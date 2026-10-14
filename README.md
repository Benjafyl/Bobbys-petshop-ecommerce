# Bobby's Pet Shop E-commerce

Primera base del e-commerce de Bobby's Pet Shop. El sitio publicado es una vista previa:
el catálogo, los precios y las existencias son referenciales; aún no recibe pedidos ni pagos.

## Incluido

- Storefront responsive con inicio, tienda, detalle de producto, guía de tallas y carrito.
- Catálogo inicial de ropa y accesorios con productos y variantes de ejemplo.
- Resumen de selección sin captura de datos de clientes ni creación ficticia de pedidos.
- Imágenes de accesorios generadas para esta vista previa.
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

Los datos bancarios, SMTP, dirección de retiro y WhatsApp deben cargarse como variables de entorno o secretos del servidor. No deben versionarse.

## Validacion

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Siguiente fase

1. Confirmar productos, precios, tallas, fotografías, existencias y canales de contacto reales.
2. Conectar autenticación y roles reales.
3. Reemplazar catálogo estático por APIs con Prisma/Postgres.
4. Implementar pedidos, reserva de stock, pagos y correos transaccionales.
5. Validar despacho, retiro y políticas comerciales antes de habilitar compras.
