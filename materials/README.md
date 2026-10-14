# Material de Bobby's Pet Shop

Este directorio recibe fotografías, piezas de marca y datos para próximas actualizaciones del sitio.

## Cómo agregar material nuevo

1. Deja los archivos nuevos en `materials/inbox/` con nombres descriptivos, por ejemplo `parka-verde-frente.jpg`.
2. Acompaña cada producto con una ficha pública de nombre, precio en CLP, tallas, medidas por talla, colores y stock. Indica también si la foto muestra una variante distinta.
3. Las fotos elegidas para publicar se copian a `public/images/official/` y se vinculan desde `src/lib/official-catalog.ts`.
4. Las fotos en `materials/reference/` son material de referencia y no se publican en el sitio.

No subas datos de clientes, contraseñas, costos, márgenes ni planillas financieras completas: este repositorio está en GitHub. Las imágenes oficiales recibidas el 13 de octubre de 2026 se guardaron con nombres descriptivos en `public/images/official/`, sin cambiar su contenido. La captura de pantalla de la parka turquesa quedó en `materials/reference/` porque incluye controles del teléfono. El cruce público de inventario está documentado en `materials/inventory-mapping.md`.
