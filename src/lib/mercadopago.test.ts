import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { createPreference, isMercadoPagoCheckoutUrl, validWebhook } from "@/lib/mercadopago";
import { CheckoutRejected, parseCheckoutInput } from "@/lib/shop-payments";

describe("integración de cobro", () => {
  it("acepta solo enlaces HTTPS propios de Mercado Pago", () => {
    expect(isMercadoPagoCheckoutUrl("https://www.mercadopago.cl/checkout/v1/redirect?id=123")).toBe(true);
    expect(isMercadoPagoCheckoutUrl("https://sandbox.mercadopago.com/checkout/pay?id=123")).toBe(true);
    expect(isMercadoPagoCheckoutUrl("https://mercadopago.cl.ejemplo.com/pagar")).toBe(false);
    expect(isMercadoPagoCheckoutUrl("http://www.mercadopago.cl/checkout")).toBe(false);
  });

  it("exige firma auténtica del webhook", () => {
    const oldSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    process.env.MERCADOPAGO_WEBHOOK_SECRET = "test-secret";
    try {
      const manifest = "id:12345;request-id:request-1;ts:1700000000;";
      const hash = createHmac("sha256", "test-secret").update(manifest).digest("hex");
      const request = new Request("https://bobbyspetshop.cl/api/payments/mercadopago/webhook?data.id=12345&type=payment", { headers: { "x-request-id": "request-1", "x-signature": `ts=1700000000,v1=${hash}` } });
      expect(validWebhook(request, "12345")).toBe(true);
      expect(validWebhook(request, "12346")).toBe(false);
      expect(validWebhook(new Request(request.url), "12345")).toBe(false);
    } finally { process.env.MERCADOPAGO_WEBHOOK_SECRET = oldSecret; }
  });

  it("usa init_point también con credenciales de prueba y envía la referencia del pedido", async () => {
    const oldToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const oldSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.MERCADOPAGO_ACCESS_TOKEN = "TEST-example";
    process.env.NEXT_PUBLIC_SITE_URL = "https://bobbyspetshop.cl";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({
      id: "pref-1", init_point: "https://www.mercadopago.cl/checkout/v1/redirect?id=pref-1",
    }), { status: 200 }));
    try {
      const result = await createPreference({ orderId: "order-1", orderNumber: "BPS-1", givenName: "Ana", familyName: "Díaz", email: "ana@example.cl", total: 10500, expiresAt: new Date(Date.now() + 3600000) });
      expect(result.url).toContain("mercadopago.cl");
      const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
      expect(body.external_reference).toBe("order-1");
      expect(body.payer).toEqual({ email: "ana@example.cl", name: "Ana", surname: "Díaz" });
      expect(body.statement_descriptor).toBe("BOBBYS PET SHOP");
    } finally {
      fetchMock.mockRestore();
      if (oldToken === undefined) delete process.env.MERCADOPAGO_ACCESS_TOKEN;
      else process.env.MERCADOPAGO_ACCESS_TOKEN = oldToken;
      if (oldSiteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = oldSiteUrl;
    }
  });

  it("rechaza artículos duplicados y datos incompletos antes de crear un pedido", () => {
    const valid = { givenName: "Ana", familyName: "Díaz", email: "ana@example.cl", phone: "+56912345678", address: "Calle 1", city: "Santiago", region: "Metropolitana de Santiago", cart: [{ variantId: "variant-1", quantity: 1 }] };
    expect(parseCheckoutInput(valid).email).toBe("ana@example.cl");
    expect(() => parseCheckoutInput({ ...valid, cart: [...valid.cart, ...valid.cart] })).toThrow(CheckoutRejected);
    expect(() => parseCheckoutInput({ ...valid, address: "" })).toThrow(CheckoutRejected);
  });
});
