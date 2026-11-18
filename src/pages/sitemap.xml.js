import paginas from '../datos/paginas.json';
import categorias from '../datos/categorias.json';
import { entradasVisibles } from '../lib/sitio.js';

export function GET() {
  const legal = ['aviso-legal', 'politica-de-privacidad', 'politica-de-cookies', 'destacado-2'];
  const rutas = ['/', '/contacto/', '/entradas-del-blog/', '/combina-tu-cocina/', '/disena-tu-armario/', '/que-cocina-va-contigo/', '/combina-tu-bano/', '/configura-tu-puerta/', '/disena-tu-salon/', '/elige-tu-encimera/', '/preguntas-frecuentes/',
    ...paginas.filter((p) => !p.noindex && !legal.includes(p.slug) && !['contacto', 'entradas-del-blog'].includes(p.slug)).map((p) => p.ruta),
    ...entradasVisibles().map((e) => e.ruta), ...categorias.map((c) => `/category/${c.slug}/`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(rutas)].map((u) => `  <url><loc>https://mueblescarrascosa.com${u}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
