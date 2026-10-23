import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isMercadoPagoCheckoutUrl, validWebhook } from "@/lib/mercadopago";
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

  it("rechaza artículos duplicados y datos incompletos antes de crear un pedido", () => {
    const valid = { givenName: "Ana", familyName: "Díaz", email: "ana@example.cl", phone: "+56912345678", address: "Calle 1", city: "Santiago", region: "Metropolitana de Santiago", cart: [{ variantId: "variant-1", quantity: 1 }] };
    expect(parseCheckoutInput(valid).email).toBe("ana@example.cl");
    expect(() => parseCheckoutInput({ ...valid, cart: [...valid.cart, ...valid.cart] })).toThrow(CheckoutRejected);
    expect(() => parseCheckoutInput({ ...valid, address: "" })).toThrow(CheckoutRejected);
  });
});
