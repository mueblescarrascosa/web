# mueblescarrascosa.com

Web de Muebles Carrascosa hecha con [Astro](https://astro.build) y publicada en GitHub Pages.

- `npm run dev`: verla en local mientras se trabaja.
- `node scripts/importar.mjs`: volver a traer páginas, entradas y fotos de la exportación de WordPress (`_wp/`, no se sube).
- Las entradas del blog están en `src/datos/entradas.json`; las que tienen fecha futura se publican solas ese día (la web se reconstruye cada mañana).
