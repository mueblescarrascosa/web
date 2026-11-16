// Importa las páginas y entradas exportadas de WordPress (_wp/*.json) al proyecto Astro:
// - limpia el HTML de cada una (sin srcset, data-*, ni restos de Jetpack que no sirven aquí),
// - descarga cada foto una vez, la deja en public/img/ en WebP (1600 px y 800 px) y cambia las rutas,
// - guarda src/datos/paginas.json y src/datos/entradas.json con título, SEO, portada y HTML.
// Se puede volver a ejecutar: las fotos ya descargadas no se vuelven a bajar.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const WP = path.join(RAIZ, '_wp'), IMG = path.join(RAIZ, 'public', 'img'), DATOS = path.join(RAIZ, 'src', 'datos');
fs.mkdirSync(IMG, { recursive: true }); fs.mkdirSync(DATOS, { recursive: true });
const leer = f => JSON.parse(fs.readFileSync(path.join(WP, f), 'utf8'));
const paginas = leer('pages.json'), entradas = leer('posts.json'), medios = leer('media.json'), cats = leer('categories.json');
// Entradas programadas o en borrador exportadas a mano (MCP) antes de la migración, si existen.
const extra = fs.existsSync(path.join(WP, 'pendientes-contenido.json')) ? leer('pendientes-contenido.json') : [];
const medioPorId = new Map(medios.map(m => [m.id, m]));
const SITIO = 'https://mueblescarrascosa.com';

// Nombre local de una foto: el archivo original sin tamaño ni parámetros.
const original = u => u.split('?')[0].replace(/-\d+x\d+(\.\w+)$/, '$1');
const nombreLocal = u => path.basename(original(u)).replace(/\.(jpe?g|png|webp|gif)$/i, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 80);
const pendientes = new Map();
function local(u) {
  if (!u || !/\/wp-content\/uploads\/|files\.wordpress\.com\/\d{4}\//.test(u)) return u;
  const n = nombreLocal(u); pendientes.set(n, original(u).replace(/^\/\//, 'https://').replace(/^http:/, 'https:'));
  return `/img/${n}.webp`;
}
async function descargar(n, url) {
  const grande = path.join(IMG, n + '.webp'), peq = path.join(IMG, n + '-800.webp');
  if (fs.existsSync(grande) && fs.existsSync(peq)) return;
  const r = await fetch(url + '?w=2000');
  if (!r.ok) { console.warn('  no se pudo bajar', url, r.status); return; }
  const buf = Buffer.from(await r.arrayBuffer());
  const im = sharp(buf).rotate();
  await im.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(grande);
  await im.clone().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 74 }).toFile(peq);
}

function limpiar(html) {
  let h = html;
  h = h.replace(/\s(srcset|sizes|data-[a-z-]+|decoding|fetchpriority|loading)="[^"]*"/g, '');
  h = h.replace(/<img([^>]*?)src="([^"]+)"/g, (_, a, s) => `<img${a}src="${local(s)}"`);
  h = h.replace(/href="(https?:)?\/\/mueblescarrascosa\.com\/wp-content\/uploads\/([^"]+)"/g, (_, __, r) => `href="${local(SITIO + '/wp-content/uploads/' + r)}"`);
  h = h.replace(/href="(https?:\/\/mueblescarrascosa\.files\.wordpress\.com\/\d{4}\/[^"]+)"/g, (_, u) => `href="${local(u)}"`);
  h = h.replace(/href="https?:\/\/mueblescarrascosa\.com(\/[^"]*)?"/g, (_, r) => `href="${r || '/'}"`);
  h = h.replace(/<img(?![^>]*loading)/g, '<img loading="lazy" decoding="async"');
  h = h.replace(/\swidth="\d+"\sheight="\d+"/g, m => m); // se conservan para que no salte la página
  return h.trim();
}
const portada = id => { const m = medioPorId.get(id); return m ? { src: local(m.source_url), alt: m.alt_text || '' } : null; };
const texto = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();
const descripcion = (p) => p.meta?.advanced_seo_description || texto(p.excerpt?.rendered || '').slice(0, 158);
const titulo = h => h.replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&#8220;|&#8221;/g, '"').replace(/&amp;/g, '&').replace(/&#038;/g, '&');

const salidaPaginas = paginas.map(p => ({
  id: p.id, slug: p.slug, ruta: new URL(p.link).pathname, titulo: titulo(p.title.rendered),
  tituloSeo: p.meta?.jetpack_seo_html_title || '', descripcion: descripcion(p), noindex: !!p.meta?.jetpack_seo_noindex,
  portada: portada(p.featured_media), html: limpiar(p.content.rendered),
}));
const nombreCat = new Map(cats.map(c => [c.id, { nombre: titulo(c.name), slug: c.slug }]));
const salidaEntradas = [...entradas, ...extra].map(p => ({
  id: p.id, slug: p.slug, fecha: p.date, estado: p.status || 'publish',
  ruta: p.link ? new URL(p.link).pathname : `/${p.date.slice(0, 4)}/${p.date.slice(5, 7)}/${p.date.slice(8, 10)}/${p.slug}/`,
  titulo: titulo(p.title.rendered ?? p.title.raw ?? p.title), tituloSeo: p.meta?.jetpack_seo_html_title || '', descripcion: descripcion(p),
  categorias: (p.categories || []).map(id => nombreCat.get(id)).filter(Boolean), portada: portada(p.featured_media),
  html: limpiar(p.content.rendered ?? p.content.raw ?? p.content),
})).sort((a, b) => b.fecha.localeCompare(a.fecha));

fs.writeFileSync(path.join(DATOS, 'paginas.json'), JSON.stringify(salidaPaginas, null, 1));
fs.writeFileSync(path.join(DATOS, 'entradas.json'), JSON.stringify(salidaEntradas, null, 1));
fs.writeFileSync(path.join(DATOS, 'categorias.json'), JSON.stringify(cats.map(c => ({ id: c.id, nombre: titulo(c.name), slug: c.slug })), null, 1));

// Fotos de la portada y las que se usan sueltas en las plantillas (ids de la biblioteca).
for (const id of [618, 559, 536, 1619, 542, 620, 608, 611, 572, 589, 587, 1216, 1219, 567, 358]) { const m = medioPorId.get(id); if (m) local(m.source_url); }
const lista = [...pendientes]; let i = 0;
await Promise.all(Array.from({ length: 6 }, async () => { while (i < lista.length) { const [n, u] = lista[i++]; await descargar(n, u); } }));
fs.writeFileSync(path.join(DATOS, 'medios.json'), JSON.stringify(Object.fromEntries([...medioPorId].filter(([, m]) => pendientes.has(nombreLocal(m.source_url))).map(([id, m]) => [id, { src: `/img/${nombreLocal(m.source_url)}.webp`, alt: m.alt_text || '', ancho: m.media_details?.width, alto: m.media_details?.height }])), null, 1));
console.log('páginas', salidaPaginas.length, 'entradas', salidaEntradas.length, 'fotos', lista.length);
