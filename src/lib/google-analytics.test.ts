import { afterEach, describe, expect, it, vi } from "vitest";
import { safePageLocation } from "@/lib/google-analytics";

afterEach(() => vi.unstubAllGlobals());

describe("Google Analytics page location", () => {
  it("does not transmit payment or order identifiers from the return URL", () => {
    vi.stubGlobal("window", { location: { href: "https://bobbyspetshop.cl/pago/resultado?pedido=private-order&payment_id=private-payment&status=approved" } });
    expect(safePageLocation()).toBe("https://bobbyspetshop.cl/pago/resultado");
  });

  it("keeps campaign attribution without unrelated query values", () => {
    vi.stubGlobal("window", { location: { href: "https://bobbyspetshop.cl/producto/parka-bicolor-gris?utm_source=instagram&utm_medium=social&customer_email=private%40example.com" } });
    expect(safePageLocation()).toBe("https://bobbyspetshop.cl/producto/parka-bicolor-gris?utm_source=instagram&utm_medium=social");
  });
});
