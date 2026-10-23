import { createHmac, timingSafeEqual } from "node:crypto";

const api = "https://api.mercadopago.com";

export function paidCheckoutEnabled() {
  return process.env.ENABLE_PAID_CHECKOUT === "true" && Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_WEBHOOK_SECRET && process.env.DATABASE_URL);
}

export function isMercadoPagoCheckoutUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["mercadopago.cl", "mercadopago.com"].some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  } catch { return false; }
}

async function mpFetch(path: string, init?: RequestInit) {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("Mercado Pago no está configurado");
  const response = await fetch(`${api}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Mercado Pago respondió ${response.status}`);
  return response.json() as Promise<unknown>;
}

export type MpPayment = {
  id: number | string;
  status: string;
  external_reference: string | null;
  transaction_amount: number;
  currency_id: string;
  payment_method_id?: string;
};

export async function createPreference(input: {
  orderId: string;
  orderNumber: string;
  givenName: string;
  familyName: string;
  email: string;
  total: number;
  expiresAt: Date;
}) {
  // The payment callback must use the runtime origin. NEXT_PUBLIC_* values are
  // embedded during the build and can point at a different deployment.
  const base = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!base || !base.startsWith("https://")) throw new Error("URL pública de la tienda no configurada");
  const result = await mpFetch("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify({
      items: [{ id: input.orderId, title: `Pedido Bobby's ${input.orderNumber}`, currency_id: "CLP", quantity: 1, unit_price: input.total }],
      payer: { email: input.email, name: input.givenName, surname: input.familyName },
      statement_descriptor: "BOBBYS PET SHOP",
      external_reference: input.orderId,
      back_urls: {
        success: `${base}/pago/resultado?pedido=${input.orderId}`,
        pending: `${base}/pago/resultado?pedido=${input.orderId}`,
        failure: `${base}/pago/resultado?pedido=${input.orderId}`,
      },
      auto_return: "approved",
      notification_url: `${base}/api/payments/mercadopago/webhook`,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: input.expiresAt.toISOString(),
    }),
  }) as { id?: string; init_point?: string };
  const url = result.init_point;
  if (!result.id || !url || !isMercadoPagoCheckoutUrl(url)) throw new Error("Mercado Pago no devolvió una URL de pago válida");
  return { id: result.id, url };
}

export async function getPayment(id: string): Promise<MpPayment> {
  if (!/^\d{1,24}$/.test(id)) throw new Error("Identificador de pago inválido");
  return await mpFetch(`/v1/payments/${id}`) as MpPayment;
}

export async function searchOrderPayments(orderId: string): Promise<MpPayment[]> {
  const query = new URLSearchParams({ external_reference: orderId, sort: "date_created", criteria: "desc", limit: "50" });
  const data = await mpFetch(`/v1/payments/search?${query}`) as { results?: MpPayment[] };
  return (data.results ?? []).filter((payment) => payment.external_reference === orderId);
}

export function validWebhook(request: Request, paymentId: string) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const signature = request.headers.get("x-signature") ?? "";
  const requestId = request.headers.get("x-request-id") ?? "";
  const fields = Object.fromEntries(signature.split(",").map((part) => part.trim().split("=", 2)));
  if (!secret || !requestId || !fields.ts || !/^[a-f\d]{64}$/i.test(fields.v1 ?? "") || !/^\d{1,24}$/.test(paymentId)) return false;
  const manifest = `id:${paymentId.toLowerCase()};request-id:${requestId};ts:${fields.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest();
  return timingSafeEqual(expected, Buffer.from(fields.v1, "hex"));
}
