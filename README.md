# Bobby's Pet Shop E-commerce

Primera base del e-commerce de Bobby's Pet Shop. El sitio publicado muestra las 27 unidades informadas el 19 de octubre de 2026, con fotografías, precios y existencias por talla. Aún no recibe pedidos ni pagos.

## Incluido

- Storefront responsive con inicio, tienda, detalle de producto y guía para medir al perro.
- Catálogo de parkas, chalecos, disfraces, pañuelos y collares para gatos, con precios y existencias por talla.
- Fotografías oficiales organizadas en `public/images/official/`, video de la parka gris en `public/videos/official/` y espacio de entrada en `materials/inbox/`.
- Carrito y checkout inactivos hasta completar los datos comerciales.
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

1. Confirmar medidas por talla y canales de contacto reales.
2. Conectar autenticación y roles reales.
3. Reemplazar catálogo estático por APIs con Prisma/Postgres.
4. Implementar pedidos, reserva de stock, pagos y correos transaccionales.
5. Validar despacho, retiro y políticas comerciales antes de habilitar compras.
