# Material de Bobby's Pet Shop

Este directorio recibe fotografías, piezas de marca y datos para próximas actualizaciones del sitio.

## Cómo agregar material nuevo

1. Deja los archivos nuevos en `materials/inbox/` con nombres descriptivos, por ejemplo `parka-verde-frente.jpg`.
2. Acompaña cada producto con una ficha pública de nombre, precio en CLP, tallas, medidas por talla, colores y stock. Indica también si la foto muestra una variante distinta.
3. Las fotos elegidas para publicar se copian a `public/images/official/` y se vinculan desde `src/lib/official-catalog.ts`.
4. Las fotos en `materials/reference/` son material de referencia y no se publican en el sitio.
5. Cuando cambien precio, talla o existencias, actualiza `src/lib/public-inventory.ts`, la fecha del inventario y `materials/inventory-mapping.md`. Comprueba el total de unidades antes de publicar.

No subas datos de clientes, contraseñas, costos, márgenes ni planillas financieras completas: este repositorio está en GitHub. Las imágenes oficiales se guardan con nombres descriptivos en `public/images/official/`, sin cambiar su contenido. La captura de pantalla de la parka turquesa y el video de parkas quedaron en `materials/reference/`. El video incluye una parka roja que no está a la venta y no se muestra en la web. El inventario público vigente se documenta en `materials/inventory-mapping.md`.
