import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  preference: vi.fn(),
  mail: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ db: () => ({ connect: async () => ({ query: mocks.query, release: () => {} }) }) }));
vi.mock("@/lib/mercadopago", () => ({ createPreference: mocks.preference, searchOrderPayments: vi.fn() }));
vi.mock("@/lib/shop-mail", () => ({ sendPendingOrderNotifications: mocks.mail }));

import { createCheckout, parseCheckoutInput, recordVerifiedPayment } from "@/lib/shop-payments";

const variantKey = JSON.stringify(["parka-bicolor-gris", "M", ""]);
const orderId = "e7526353-fa4e-4f65-b2e5-70a73e2ad193";
const payment = { id: 12345, status: "approved", external_reference: orderId, currency_id: "CLP", transaction_amount: 21000 };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.preference.mockResolvedValue({ id: "pref-1", url: "https://www.mercadopago.cl/checkout" });
  mocks.mail.mockResolvedValue(undefined);
});

describe("stock y pagos confirmados", () => {
  it("crear un enlace de pago no descuenta ni reserva stock", async () => {
    mocks.query.mockImplementation(async (sql: string) => {
      if (sql.includes("from shop_inventory where active=true")) return { rows: [{ variant_key: variantKey, product_slug: "parka-bicolor-gris", size: "M", design: "", price_clp: 16000, stock_on_hand: 2 }] };
      return { rows: [] };
    });
    const input = parseCheckoutInput({ givenName: "Ana", familyName: "Díaz", email: "ana@example.cl", phone: "+56912345678", deliveryMethod: "pickup", cart: [{ variantId: variantKey, quantity: 2 }] });
    await createCheckout(input);
    const sql = mocks.query.mock.calls.map(([statement]) => String(statement));
    expect(sql.some((statement) => statement.includes("stock_reserved_at_checkout") && statement.includes("false"))).toBe(true);
    expect(sql.some((statement) => statement.includes("update shop_inventory"))).toBe(false);
    expect(sql.some((statement) => statement.includes("shop_stock_movements"))).toBe(false);
  });

  it("descuenta la cantidad comprada una sola vez cuando Mercado Pago confirma", async () => {
    mocks.query.mockImplementation(async (sql: string) => {
      if (sql.includes("from shop_orders where id=$1 for update")) return { rows: [{ id: orderId, order_number: "BPS-1", total_clp: 21000, payment_status: "PENDING", reservation_released_at: null, stock_reserved_at_checkout: false, discount_code: null }] };
      if (sql.includes("from shop_order_items")) return { rows: [{ variant_key: variantKey, quantity: 2 }] };
      if (sql.includes("from shop_inventory where variant_key=$1 for update")) return { rows: [{ stock_on_hand: 3 }] };
      return { rows: [] };
    });
    expect(await recordVerifiedPayment(payment)).toBe(true);
    expect(mocks.query.mock.calls.find(([sql]) => String(sql).includes("update shop_inventory"))?.[1]).toEqual([variantKey, 2]);
    expect(mocks.query.mock.calls.find(([sql]) => String(sql).includes("shop_stock_movements"))?.[1]?.slice(0, 3)).toEqual([variantKey, 3, 1]);
    expect(mocks.query.mock.calls.find(([sql]) => String(sql).includes("set payment_status='PAID'"))?.[1]?.[3]).toBe(false);
  });

  it("avisa si un pago llega cuando ya no hay unidades suficientes", async () => {
    mocks.query.mockImplementation(async (sql: string) => {
      if (sql.includes("from shop_orders where id=$1 for update")) return { rows: [{ id: orderId, order_number: "BPS-1", total_clp: 21000, payment_status: "PENDING", reservation_released_at: null, stock_reserved_at_checkout: false, discount_code: null }] };
      if (sql.includes("from shop_order_items")) return { rows: [{ variant_key: variantKey, quantity: 2 }] };
      if (sql.includes("from shop_inventory where variant_key=$1 for update")) return { rows: [{ stock_on_hand: 1 }] };
      return { rows: [] };
    });
    await recordVerifiedPayment(payment);
    expect(mocks.query.mock.calls.some(([sql]) => String(sql).includes("update shop_inventory"))).toBe(false);
    expect(mocks.query.mock.calls.find(([sql]) => String(sql).includes("set payment_status='PAID'"))?.[1]?.[3]).toBe(true);
  });

  it("no vuelve a descontar un pedido legado que ya reservó unidades", async () => {
    mocks.query.mockImplementation(async (sql: string) => {
      if (sql.includes("from shop_orders where id=$1 for update")) return { rows: [{ id: orderId, order_number: "BPS-1", total_clp: 21000, payment_status: "PENDING", reservation_released_at: null, stock_reserved_at_checkout: true, discount_code: null }] };
      return { rows: [] };
    });
    await recordVerifiedPayment(payment);
    expect(mocks.query.mock.calls.some(([sql]) => String(sql).includes("update shop_inventory"))).toBe(false);
  });

  it("ignora un aviso repetido de un pago ya registrado", async () => {
    mocks.query.mockImplementation(async (sql: string) => {
      if (sql.includes("from shop_orders where id=$1 for update")) return { rows: [{ id: orderId, order_number: "BPS-1", total_clp: 21000, payment_status: "PAID", reservation_released_at: null, stock_reserved_at_checkout: false, discount_code: null }] };
      return { rows: [] };
    });
    await recordVerifiedPayment(payment);
    expect(mocks.query.mock.calls.some(([sql]) => String(sql).includes("update shop_inventory"))).toBe(false);
    expect(mocks.query.mock.calls.some(([sql]) => String(sql).includes("set payment_status='PAID'"))).toBe(false);
  });
});
