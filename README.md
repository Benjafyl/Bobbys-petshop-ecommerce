# Bobby's Pet Shop E-commerce

Primera base del e-commerce personalizado de Bobby's Pet Shop, construida desde el PRD v1.0.

## Incluido

- Storefront responsive con inicio, tienda, detalle de producto, guia de tallas, carrito y checkout.
- Catalogo inicial con productos, variantes, SKU, stock y umbrales de bajo stock.
- Compra rapida separada del carrito tradicional.
- Checkout por transferencia bancaria sin secretos hardcodeados.
- Panel administrativo inicial con metricas, pedidos y alertas de stock.
- Modelo Prisma para Postgres con usuarios, productos, variantes, pedidos, pagos, reviews, stock y auditoria.
- Dockerfile y docker-compose para correr con Postgres.

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run dev
```

## Base de datos

```bash
npm run db:generate
npm run db:migrate
```

Los datos bancarios, SMTP, direccion de retiro y WhatsApp deben cargarse como variables de entorno o secretos del servidor. No deben versionarse.

## Validacion

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Siguiente fase

1. Conectar autenticacion y roles reales.
2. Reemplazar catalogo estatico por APIs con Prisma/Postgres.
3. Implementar creacion transaccional de pedidos y reserva/liberacion de stock.
4. Agregar carga segura de comprobantes y correos transaccionales.
5. Probar concurrencia de inventario antes de produccion.
