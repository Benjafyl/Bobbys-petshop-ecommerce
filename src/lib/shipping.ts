// Tarifa única informada por Bobby's Pet Shop para un pedido dentro de Chile.
export const SHIPPING_FEE_CLP = 5000;

export const PICKUP_ADDRESS = "Av. Edmundo Eluchans 2066";
export const PICKUP_CITY = "Viña del Mar";
export const PICKUP_REGION = "Valparaíso";
export const PICKUP_LOCATION = `${PICKUP_ADDRESS}, ${PICKUP_CITY}`;

export type DeliveryMethod = "shipping" | "pickup";

export function deliveryFeeClp(method: DeliveryMethod) {
  return method === "pickup" ? 0 : SHIPPING_FEE_CLP;
}
