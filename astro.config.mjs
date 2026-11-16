import { defineConfig } from 'astro/config';

// Mientras se prueba, la web vive en mueblescarrascosa.github.io/web (BASE=/web).
// Cuando el dominio apunte aquí, se construye sin BASE y queda en mueblescarrascosa.com.
const base = process.env.BASE || '/';
export default defineConfig({
  site: process.env.SITIO || 'https://mueblescarrascosa.com',
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
