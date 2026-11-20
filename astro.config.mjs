import { defineConfig } from 'astro/config';

// Mientras se prueba, la web vive en mueblescarrascosa.github.io/web (BASE=/web).
// Cuando el dominio apunte aquí, se construye sin BASE y queda en mueblescarrascosa.com.
const base = process.env.BASE || '/';
export default defineConfig({
  site: process.env.SITIO || 'https://mueblescarrascosa.com',
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Direcciones de la web de WordPress que ya no existen igual: llevan a su página equivalente (en GitHub Pages no hay 301)
  redirects: Object.fromEntries(
    ['comparativa', 'mejor-puerta-de-cocina', 'puertas-de-cocina', 'puertas', 'tipos-de-puertas'].map((t) => [`/tag/${t}/`, `${base.replace(/\/$/, '')}/2024/02/05/tipos-de-puertas-de-cocina/`]),
  ),
});
