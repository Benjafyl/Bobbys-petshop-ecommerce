# Bobby's Pet Shop

Tienda Next.js para `bobbyspetshop.cl`, alojada en Servidor-BYL con Docker, PostgreSQL 16 dedicado y el Cloudflare Tunnel existente.

## Estado comercial

El catálogo y carrito muestran el stock y precios por talla. El pago en línea todavía no está conectado y la web no crea pedidos ni marca pagos como recibidos. El envío informado es de $5.000 a todo Chile. No actives `ENABLE_PAID_CHECKOUT` hasta integrar y verificar un proveedor de pagos con notificaciones auténticas.

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
