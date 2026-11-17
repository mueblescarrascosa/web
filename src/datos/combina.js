// Juego «Combina tu cocina»: acabados (sacados de la guía de colores de Presupuestos, sin marcas ni grupos de precio),
// reglas para puntuar la combinación y propuestas para «Inspírame».
// Cada acabado: [clave, nombre, color, familia, tono 1 claro · 2 medio · 3 oscuro, temperatura c cálido · f frío · n neutro, dibujo]
//   dibujo: '' liso · 'veta' madera · 'marmol' vetas claras sobre fondo claro · 'marmolN' vetas claras sobre fondo oscuro
const a = (l) => l.map(([clave, nombre, hex, fam, tono, temp, dibujo = '']) => ({ clave, nombre, hex, fam, tono, temp, dibujo }));

export const FRENTES = a([
  ['blanco', 'Blanco', '#f4f3ef', 'blanco', 1, 'n'],
  ['blanco-roto', 'Blanco roto', '#efeadf', 'crema', 1, 'c'],
  ['hueso', 'Hueso', '#e6dcc6', 'crema', 1, 'c'],
  ['cachemir', 'Cachemir', '#d3c6b2', 'crema', 1, 'c'],
  ['gris-perla', 'Gris perla', '#cfcdc8', 'gris_claro', 1, 'n'],
  ['vison', 'Visón', '#9d9183', 'gris', 2, 'c'],
  ['plomo', 'Gris plomo', '#6c6f72', 'gris', 2, 'f'],
  ['antracita', 'Antracita', '#3c3f42', 'oscuro', 3, 'f'],
  ['negro', 'Negro mate', '#232323', 'negro', 3, 'n'],
  ['salvia', 'Verde salvia', '#9daa94', 'verde', 2, 'n'],
  ['musgo', 'Verde musgo', '#4f5a3c', 'verde', 3, 'c'],
  ['aguamarina', 'Aguamarina', '#9fbab4', 'azul', 2, 'f'],
  ['azul-piedra', 'Azul piedra', '#6e8391', 'azul', 2, 'f'],
  ['marino', 'Azul marino', '#333854', 'azul', 3, 'f'],
  ['terracota', 'Terracota', '#b5684b', 'terracota', 2, 'c'],
  ['roble-claro', 'Roble claro', '#cdae86', 'madera_clara', 1, 'c', 'veta'],
  ['roble', 'Roble natural', '#a7845f', 'madera_media', 2, 'c', 'veta'],
  ['nogal', 'Nogal', '#6b4c36', 'madera_oscura', 3, 'c', 'veta'],
]);

export const ENCIMERAS = a([
  ['blanca', 'Blanca lisa', '#f3f3f1', 'blanco', 1, 'n'],
  ['marmol', 'Mármol blanco', '#ecebe8', 'marmol', 1, 'f', 'marmol'],
  ['calacatta', 'Calacatta (vetas doradas)', '#eeebe5', 'marmol', 1, 'c', 'marmol'],
  ['piedra', 'Piedra beige', '#d9d2c5', 'piedra', 1, 'c'],
  ['hormigon', 'Gris hormigón', '#a5a29c', 'piedra', 2, 'n'],
  ['negra-veteada', 'Negra veteada', '#2a2a2b', 'negro', 3, 'n', 'marmolN'],
  ['negra', 'Negra lisa', '#202020', 'negro', 3, 'n'],
  ['roble-macizo', 'Roble macizo', '#c49a6c', 'madera_clara', 1, 'c', 'veta'],
  ['nogal-macizo', 'Nogal macizo', '#6b4c36', 'madera_oscura', 3, 'c', 'veta'],
]);

// tipo: barra (tirador a la vista), gola (perfil corrido, sin tiradores) o unero (hueco en el canto de la puerta)
export const TIRADORES = [
  { clave: 'gola', nombre: 'Gola de aluminio', hex: '#9aa0a6', tipo: 'gola', fam: 'gola', temp: 'n' },
  { clave: 'unero', nombre: 'Uñero', hex: '#3a3a3a', tipo: 'unero', fam: 'gola', temp: 'n' },
  { clave: 'inox', nombre: 'Barra inox', hex: '#c4c6c7', tipo: 'barra', fam: 'metal', temp: 'f' },
  { clave: 'negro', nombre: 'Barra negra', hex: '#1d1d1d', tipo: 'barra', fam: 'negro', temp: 'n' },
  { clave: 'oro', nombre: 'Oro cepillado', hex: '#b6955c', tipo: 'barra', fam: 'oro', temp: 'c' },
  { clave: 'bronce', nombre: 'Bronce', hex: '#8a6440', tipo: 'barra', fam: 'bronce', temp: 'c' },
  { clave: 'madera', nombre: 'Madera', hex: '#a9825a', tipo: 'barra', fam: 'madera_media', temp: 'c' },
];

export const SUELOS = a([
  ['roble-claro', 'Tarima clara', '#d2b48c', 'madera_clara', 1, 'c', 'tablas'],
  ['roble', 'Tarima roble', '#a57b52', 'madera_media', 2, 'c', 'tablas'],
  ['oscura', 'Tarima oscura', '#5f4330', 'madera_oscura', 3, 'c', 'tablas'],
  ['porcelanico', 'Porcelánico claro', '#e3e0d8', 'piedra', 1, 'n', 'baldosa'],
  ['cemento', 'Cemento gris', '#97958f', 'piedra', 2, 'n', 'baldosa'],
  ['barro', 'Barro', '#b5714b', 'terracota', 2, 'c', 'baldosa'],
]);

export const PAREDES = a([
  ['blanca', 'Blanca', '#f2f0ea', 'blanco', 1, 'n'],
  ['calida', 'Crema', '#e9e0cf', 'crema', 1, 'c'],
  ['verde', 'Verde suave', '#cfd6cb', 'verde', 1, 'n'],
  ['gris', 'Gris suave', '#d4d4d0', 'gris_claro', 1, 'f'],
]);

// Distribución y modelo de puerta (cambian el dibujo), electrodomésticos y pared entre muebles
export const DISTRIBUCIONES = [
  { clave: 'lineal', nombre: 'Lineal' }, { clave: 'L', nombre: 'En L' }, { clave: 'isla', nombre: 'Con isla' }, { clave: 'peninsula', nombre: 'Con península' },
];
export const PUERTAS = [
  { clave: 'lisa', nombre: 'Lisa' }, { clave: 'moldura', nombre: 'Con moldura' }, { clave: 'ranurada', nombre: 'Ranurada' },
];
export const ELECTROS = [
  { clave: 'inox', nombre: 'Inox', hex: '#b9bcbf' }, { clave: 'negro', nombre: 'Negro', hex: '#1e1f21' }, { clave: 'blanco', nombre: 'Blanco', hex: '#ecebe7' },
];
// tipo: pared (como la pared), azulejo (con juntas) o encimera (la misma piedra subida a la pared)
export const TRASERAS = [
  { clave: 'pared', nombre: 'Como la pared', tipo: 'pared' },
  { clave: 'azulejo-blanco', nombre: 'Azulejo blanco', hex: '#f1efe9', tipo: 'azulejo' },
  { clave: 'azulejo-verde', nombre: 'Azulejo verde', hex: '#6f8f7e', tipo: 'azulejo' },
  { clave: 'azulejo-terracota', nombre: 'Azulejo terracota', hex: '#b9765a', tipo: 'azulejo' },
  { clave: 'encimera', nombre: 'Como la encimera', tipo: 'encimera' },
];

export const INICIAL = { dist: 'lineal', bajos: 'roble', altos: 'blanco', puerta: 'lisa', encimera: 'piedra', tirador: 'negro', electro: 'inox', trasera: 'azulejo-blanco', suelo: 'porcelanico', pared: 'blanca' };
export const LISTAS = () => ({ dist: DISTRIBUCIONES, bajos: FRENTES, altos: FRENTES, puerta: PUERTAS, encimera: ENCIMERAS, tirador: TIRADORES, electro: ELECTROS, trasera: TRASERAS, suelo: SUELOS, pared: PAREDES });

// Variables CSS del dibujo para lo elegido (la página y las miniaturas usan lo mismo)
export function variables(e) {
  const v = (x, d) => (x.dibujo === d ? 1 : 0);
  const tr = e.trasera.tipo === 'encimera' ? e.encimera : e.trasera.tipo === 'azulejo' ? e.trasera : e.pared;
  return {
    '--bajos': e.bajos.hex, '--altos': e.altos.hex, '--enc': e.encimera.hex, '--tir': e.tirador.hex, '--electro': e.electro.hex,
    '--suelo': e.suelo.hex, '--pared': e.pared.hex, '--trasera': tr.hex,
    '--v-bajos': v(e.bajos, 'veta'), '--v-altos': v(e.altos, 'veta'), '--v-enc': v(e.encimera, 'veta'), '--m-enc': v(e.encimera, 'marmol'), '--mn-enc': v(e.encimera, 'marmolN'),
    '--v-azulejo': e.trasera.tipo === 'azulejo' ? 1 : 0, '--m-tras': e.trasera.tipo === 'encimera' ? v(e.encimera, 'marmol') : 0, '--mn-tras': e.trasera.tipo === 'encimera' ? v(e.encimera, 'marmolN') : 0,
    '--v-tablas': v(e.suelo, 'tablas'), '--v-baldosa': v(e.suelo, 'baldosa'),
  };
}
export const estiloVars = (e) => Object.entries(variables(e)).map(([k, v]) => `${k}:${v}`).join(';');

// «Inspírame»: propuestas sacadas de las recetas por estilo de la guía de colores
export const PROPUESTAS = [
  { nombre: 'Blanco y roble', dist: 'lineal', puerta: 'lisa', electro: 'inox', trasera: 'azulejo-blanco', bajos: 'roble', altos: 'blanco', encimera: 'piedra', tirador: 'negro', suelo: 'porcelanico', pared: 'blanca' },
  { nombre: 'Nórdica', dist: 'isla', puerta: 'lisa', electro: 'blanco', trasera: 'azulejo-blanco', bajos: 'blanco', altos: 'blanco', encimera: 'roble-macizo', tirador: 'madera', suelo: 'roble-claro', pared: 'blanca' },
  { nombre: 'Japandi', dist: 'lineal', puerta: 'ranurada', electro: 'negro', trasera: 'encimera', bajos: 'roble-claro', altos: 'cachemir', encimera: 'negra', tirador: 'unero', suelo: 'porcelanico', pared: 'calida' },
  { nombre: 'Negro y madera', dist: 'isla', puerta: 'lisa', electro: 'negro', trasera: 'encimera', bajos: 'negro', altos: 'roble-claro', encimera: 'marmol', tirador: 'gola', suelo: 'roble-claro', pared: 'blanca' },
  { nombre: 'Verde salvia y oro', dist: 'L', puerta: 'moldura', electro: 'inox', trasera: 'azulejo-blanco', bajos: 'salvia', altos: 'blanco-roto', encimera: 'calacatta', tirador: 'oro', suelo: 'roble', pared: 'calida' },
  { nombre: 'Azul marino clásica', dist: 'peninsula', puerta: 'moldura', electro: 'inox', trasera: 'encimera', bajos: 'marino', altos: 'blanco', encimera: 'marmol', tirador: 'oro', suelo: 'roble', pared: 'blanca' },
  { nombre: 'Industrial', dist: 'L', puerta: 'lisa', electro: 'negro', trasera: 'pared', bajos: 'antracita', altos: 'roble', encimera: 'negra-veteada', tirador: 'negro', suelo: 'cemento', pared: 'gris' },
  { nombre: 'Greige', dist: 'peninsula', puerta: 'lisa', electro: 'inox', trasera: 'pared', bajos: 'vison', altos: 'vison', encimera: 'blanca', tirador: 'inox', suelo: 'porcelanico', pared: 'calida' },
  { nombre: 'Rústica cálida', dist: 'L', puerta: 'moldura', electro: 'negro', trasera: 'azulejo-terracota', bajos: 'nogal', altos: 'hueso', encimera: 'piedra', tirador: 'bronce', suelo: 'barro', pared: 'calida' },
  { nombre: 'Blanca total', dist: 'isla', puerta: 'lisa', electro: 'negro', trasera: 'encimera', bajos: 'blanco', altos: 'blanco', encimera: 'negra-veteada', tirador: 'gola', suelo: 'roble', pared: 'blanca' },
  { nombre: 'Mediterránea', dist: 'lineal', puerta: 'ranurada', electro: 'blanco', trasera: 'azulejo-verde', bajos: 'terracota', altos: 'blanco-roto', encimera: 'blanca', tirador: 'madera', suelo: 'porcelanico', pared: 'blanca' },
  { nombre: 'Gris y madera', dist: 'peninsula', puerta: 'lisa', electro: 'inox', trasera: 'pared', bajos: 'plomo', altos: 'gris-perla', encimera: 'roble-macizo', tirador: 'gola', suelo: 'porcelanico', pared: 'gris' },
];

// ── Puntuación ──
const luz = (hex) => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11); };
const madera = (f) => /^madera/.test(f);
const fuerte = (f) => ['verde', 'azul', 'terracota'].includes(f);
const oscuro = (x) => x.tono === 3;

export function puntuar({ bajos: b, altos: al, encimera: e, tirador: t, suelo: s, puerta: pu, electro: el, trasera: tr, dist: di }) {
  let p = 62; const bien = [], ojo = [];
  const lb = luz(b.hex), la = luz(al.hex), le = luz(e.hex), ls = luz(s.hex);
  const mismoFrente = b.clave === al.clave;

  // Arriba claro, abajo oscuro
  if (!mismoFrente && la > lb + 25) { p += 8; bien.push('Claro arriba y más oscuro abajo: la cocina parece más alta y amplia.'); }
  else if (!mismoFrente && lb > la + 40 && !(madera(al.fam) && lb - la < 70)) { p -= 14; ojo.push('Los altos más oscuros que los bajos pesan mucho a la vista. Prueba al revés.'); }
  if (mismoFrente && b.tono === 1) { p += 4; bien.push('Mismo color claro arriba y abajo: luminosa y tranquila.'); }
  if (mismoFrente && b.tono === 3) { p -= 6; ojo.push('Toda la cocina oscura necesita mucha luz y una encimera clara.'); }

  // Encimera
  const contraste = Math.abs(le - lb);
  if (contraste > 70) { p += 8; bien.push('La encimera contrasta con los bajos y marca bien la línea de trabajo.'); }
  else if (contraste < 18 && !(b.fam === 'blanco' && e.fam === 'blanco')) { p -= 7; ojo.push('La encimera se confunde con los muebles bajos: falta contraste.'); }
  if (b.fam === 'blanco' && e.fam === 'blanco') ojo.push('Blanco sobre blanco: muy luminosa; el contraste lo ponen los tiradores o el suelo.');

  // Maderas
  const maderas = [b, al, e].filter((x) => madera(x.fam));
  const distintas = new Set(maderas.map((x) => x.hex)).size;
  if (distintas >= 2 && Math.abs(luz(maderas[0].hex) - luz(maderas[1].hex)) < 60) { p -= 12; ojo.push('Dos maderas parecidas pero distintas compiten entre sí. Mejor una sola madera, o dos muy diferentes.'); }
  else if (maderas.length === 1) { p += 5; bien.push('Un toque de madera da calidez sin cargar.'); }
  if (madera(b.fam) && madera(s.fam) && Math.abs(lb - ls) < 30) { p -= 8; ojo.push('Los bajos en madera se pierden con un suelo de madera del mismo tono.'); }
  else if (Math.abs(lb - ls) > 55) { p += 3; bien.push('Los muebles se despegan bien del suelo.'); }

  // Colores fuertes
  const colores = new Set([b, al].filter((x) => fuerte(x.fam)).map((x) => x.clave));
  if (colores.size > 1) { p -= 12; ojo.push('Dos colores fuertes a la vez compiten. Elige uno y acompáñalo de blanco, crema o madera.'); }
  else if (colores.size === 1 && (claro(al) || claro(b))) { p += 6; bien.push('Un color con carácter y el resto neutro: así se luce.'); }
  if ([b, al].some((x) => x.fam === 'azul') && [b, al, e, s].some((x) => madera(x.fam))) { p += 4; bien.push('Azul y madera: una combinación que nunca falla.'); }

  // Frío y cálido
  const fr = [b, al].filter((x) => x.temp === 'f').length, ca = [b, al, e].filter((x) => x.temp === 'c' && !madera(x.fam)).length;
  if (fr && ca && !colores.size) { p -= 5; ojo.push('Mezclas tonos fríos y cálidos; la madera o el blanco puro ayudan a unirlos.'); }

  // Tiradores
  if (['oro', 'bronce'].includes(t.fam)) {
    const sobre = [b, al].find((x) => ['verde', 'azul', 'crema', 'madera_oscura'].includes(x.fam) || x.clave === 'negro');
    if (sobre) { p += 6; bien.push(`El ${t.nombre.toLowerCase()} luce mucho sobre el ${sobre.nombre.toLowerCase()}.`); }
    else if ([b, al].every((x) => x.temp === 'f' || x.fam === 'gris_claro')) { p -= 4; ojo.push('El dorado queda raro con grises fríos; mejor inox, negro o sin tirador.'); }
  }
  if (t.clave === 'negro' && oscuro(b)) bien.push('Tirador negro sobre frente oscuro: casi invisible, muy limpio.');
  if (t.clave === 'negro' && !oscuro(b)) { p += 3; bien.push('El tirador negro dibuja la cocina y combina con todo.'); }
  if (t.tipo !== 'barra') { p += 4; bien.push('Sin tiradores a la vista: líneas limpias, estilo actual.'); }
  if (t.clave === 'inox' && madera(b.fam) && b.tono === 3) { p -= 3; ojo.push('El inox se ve frío sobre madera oscura; prueba negro o bronce.'); }
  if (t.clave === 'madera' && madera(b.fam)) { p -= 4; ojo.push('Tirador de madera sobre frente de madera: se pierde.'); }

  // Modelo de puerta
  if (pu?.clave === 'moldura') {
    if (t.tipo !== 'barra') { p -= 6; ojo.push('Las puertas con moldura piden tirador; la gola y el uñero son para puertas lisas.'); }
    else if (['oro', 'bronce'].includes(t.fam) && [b, al].some((x) => ['blanco', 'crema', 'verde', 'azul'].includes(x.fam))) { p += 5; bien.push('Moldura y tirador dorado: un clásico que no falla.'); }
    if ([b, al].every((x) => madera(x.fam) || x.fam === 'negro')) { p -= 3; ojo.push('La moldura luce más lacada en color que en madera o negro.'); }
  }
  if (pu?.clave === 'ranurada' && [b, al].some((x) => madera(x.fam) || x.fam === 'crema' || x.fam === 'verde')) { p += 4; bien.push('Las ranuras verticales con madera, crema o verde dan un aire japandi muy actual.'); }
  // Electrodomésticos (van en la columna, que es del color de los altos)
  if (el?.clave === 'negro' && oscuro(al)) { p += 4; bien.push('Electrodomésticos negros en una columna oscura: quedan integrados.'); }
  else if (el?.clave === 'blanco' && al.tono === 1 && !madera(al.fam)) { p += 3; bien.push('Electrodomésticos blancos en una columna clara: casi desaparecen.'); }
  else if (el?.clave === 'blanco' && oscuro(al)) { p -= 4; ojo.push('Electrodomésticos blancos en una columna oscura: llaman mucho la atención.'); }
  // Pared entre muebles
  if (tr?.tipo === 'encimera' && !madera(e.fam)) { p += 4; bien.push('La encimera subida a la pared da continuidad y se limpia de una pasada.'); }
  if (tr?.tipo === 'azulejo' && tr.clave !== 'azulejo-blanco') {
    if (colores.size) { p -= 6; ojo.push('Azulejo de color con muebles de color: demasiado. Uno de los dos, neutro.'); }
    else { p += 4; bien.push(`El ${tr.nombre.toLowerCase()} da personalidad a una cocina de colores neutros.`); }
  }
  if (di?.clave === 'isla') bien.push('Con isla ganas encimera y sitio para comer; pide al menos 90 cm de paso alrededor.');

  // Demasiado oscuro
  if ([b, al, e].filter(oscuro).length === 3) { p -= 12; ojo.push('Muebles y encimera oscuros: queda muy cerrada salvo en cocinas grandes y con mucha luz.'); }

  p = Math.max(38, Math.min(99, Math.round(p)));
  const veredicto = p >= 90 ? '¡De revista!' : p >= 78 ? 'Combina muy bien' : p >= 64 ? 'Funciona, con matices' : 'Arriesgada';
  return { puntos: p, veredicto, bien, ojo, estilo: estilo({ b, al, e, t, s, pu }) };
}
const claro = (x) => x.tono === 1 && !fuerte(x.fam);

function estilo({ b, al, e, t, s, pu }) {
  const fams = [b.fam, al.fam];
  const hay = (f) => fams.includes(f);
  if (pu?.clave === 'ranurada' && [b, al].some((x) => madera(x.fam))) return 'japandi';
  if (pu?.clave === 'moldura' && (hay('crema') || hay('blanco') || hay('verde') || hay('azul'))) return 'clásico';
  if (fams.some((f) => f === 'madera_clara') && t.tipo === 'unero') return 'japandi';
  if ((hay('oscuro') || hay('negro')) && [b, al, e].some((x) => madera(x.fam)) && t.tipo === 'barra') return 'industrial';
  if (['oro', 'bronce'].includes(t.fam) && (hay('verde') || hay('azul') || hay('crema'))) return 'clásico';
  if (hay('terracota') || (s.fam === 'terracota' && (hay('blanco') || hay('crema')))) return 'mediterráneo';
  if (madera(b.fam) && b.tono === 3) return 'rústico';
  if ((hay('blanco') || hay('crema')) && [b, al, e, s].some((x) => x.fam === 'madera_clara')) return 'nórdico';
  if (t.tipo !== 'barra' && fams.every((f) => ['blanco', 'gris_claro', 'gris', 'oscuro', 'negro'].includes(f))) return 'minimalista';
  return 'moderno';
}
