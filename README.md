# Bobby's Pet Shop

Tienda Next.js para `bobbyspetshop.cl`, alojada en Servidor-BYL con Docker, PostgreSQL 16 dedicado y el Cloudflare Tunnel existente.

## Estado comercial

El catálogo y carrito muestran el stock y precios por talla. El checkout acepta invitados, recalcula precios y cupones en PostgreSQL, reserva unidades y redirige a Mercado Pago Checkout Pro. El botón de pago permanece deshabilitado hasta aprobar una compra de prueba completa y configurar el aviso por correo. El envío cuesta $5.000 a todo Chile.

## Para comenzar a vender

1. La aplicación Checkout Pro **Bobbys Pet Shop** (ID `3777069441457143`) ya está creada en la cuenta de Mercado Pago de Benjamín. Las credenciales de prueba y producción están activas; ambos tokens crearon preferencias de pago correctamente en la API. Ninguna prueba ha ejecutado un cobro.
2. El evento **Pagos** ya apunta a `https://bobbyspetshop.cl/api/payments/mercadopago/webhook`. El token de producción y la clave de firma obtenida del panel están instalados como secretos en el servidor. Confirmar la clave del modo productivo antes de habilitar el checkout; nunca ponerla en Git ni en el navegador de los clientes.
3. El servidor debe tener `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL=https://bobbyspetshop.cl` y `ENABLE_PAID_CHECKOUT=true` únicamente durante pruebas controladas o después de aprobar producción. El dinero llegará a la cuenta Mercado Pago propietaria del token, que debe ser la de Benjamín. `Public Key` no se necesita para el flujo con redirección Checkout Pro.
4. Configurar SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`) para avisar a Antonela en `antonelarodil@gmail.com` solo tras confirmar un pago. Los avisos se guardan para reintento si falla el correo; el panel siempre conserva el pedido.
5. Probar con una cuenta compradora de prueba distinta de la vendedora: pago aprobado, pendiente, rechazado, cupón, última unidad, correo y panel. Verificar que el webhook y la consulta a la API marquen pagado solo tras confirmar el monto y pedido. Activar el botón público al completar esta prueba y la habilitación que Mercado Pago solicite a Benjamín. La emisión tributaria queda a cargo del titular de la venta y su asesoría.

## Componentes

- `web`: aplicación Next.js; acceso de clientes con Better Auth, panel protegido de Antonela, catálogo y carrito.
- `postgres`: base exclusiva `bobbys_petshop`, sin puerto PostgreSQL público.
- `db/shop.sql`: tablas de inventario, pedidos, cupones y auditoría; carga inicial de 23 variantes. No sobrescribe el stock al reiniciar.
- `scripts/migrate.mjs`: crea tablas de autenticación y aplica el esquema de tienda antes de iniciar la web.
- `docker-compose.yml`: conecta la web a `dokploy-network`, que usa Traefik. La base permanece en la red privada del proyecto.

## Desarrollo

```bash
npm ci
npm run dev
```

Para usar cuentas y stock vivo se requiere `DATABASE_URL`, `BETTER_AUTH_SECRET` de 32 caracteres o más y `BETTER_AUTH_URL`. Si faltan, el catálogo muestra la última instantánea confirmada y el acceso queda deshabilitado. El esquema se crea con `npm run db:migrate`.

## Servidor

Crear un archivo `.env` **solo en el servidor** junto al proyecto con `POSTGRES_PASSWORD` y `BETTER_AUTH_SECRET` aleatorios. El primero debe ser URL-safe (por ejemplo, hexadecimal). Mantener `ENABLE_CUSTOMER_SIGNUP=false` hasta haber creado y probado la cuenta de Antonela; luego cambiarlo a `true` y recrear el contenedor web para permitir cuentas de clientes. No versionar este archivo ni secretos.

```bash
docker compose up -d --build
docker compose ps
```

Traefik debe dirigir `bobbyspetshop.cl` y `www.bobbyspetshop.cl` a `http://bobbys-web:3000` por `dokploy-network`; Cloudflare Tunnel debe publicar ambos nombres hacia Traefik en `localhost:80`. Configurar DNS en la zona de Cloudflare para apuntar al túnel. Probar `/api/health/db` antes de retirar cualquier publicación anterior.

El administrador se autoriza por **ID de usuario**, correo `antonelarodil@gmail.com` y una fila explícita en `shop_admin_accounts`. Las cuentas de clientes nunca reciben acceso por registrarse con un nombre o correo parecido. `shop_admin_accounts` se aprovisiona solo desde el servidor después de crear la cuenta de Antonela. La contraseña inicial se debe cambiar desde “Mi cuenta” al primer acceso.

El registro de clientes usa contraseña de al menos 12 caracteres y limitación de solicitudes. La recuperación de contraseña por correo y la verificación de correo requieren configurar primero un proveedor de email; todavía no están disponibles. Las cuentas pueden consultar sus pedidos cuando exista el pago real.

Para respaldar la base, instalar `deploy/bobbys-db-backup.service` y `deploy/bobbys-db-backup.timer` en `/etc/systemd/system`, activar el timer y ejecutar una primera copia con `systemctl start bobbys-db-backup.service`. Los archivos comprobados quedan en `/backups/bobbys-petshop` con acceso restringido al usuario del servidor. No se borran automáticamente.

## Verificación

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
