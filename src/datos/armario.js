// Juego «Diseña tu armario»: acabados, propuestas y consejos (con las medidas de la guía del taller).
import { FRENTES } from './combina.js';
import { TIPOS, MODELOS, CRISTALES, modulosPara, cuerposPara, correderas } from '../scripts/armario-dibujo.js';

export const PUERTAS_ARMARIO = [
  { clave: 'correderas', nombre: 'Correderas' }, { clave: 'abatibles', nombre: 'Abatibles' }, { clave: 'vestidor', nombre: 'Vestidor abierto' },
];
export const FORMAS = [
  { clave: 'lineal', nombre: 'Lineal' }, { clave: 'L', nombre: 'En L' }, { clave: 'C', nombre: 'En C' }, { clave: 'isla', nombre: 'Con isla' },
];
export const MODELOS_PUERTA = Object.entries(MODELOS).map(([clave, nombre]) => ({ clave, nombre }));
export const CRISTALES_LISTA = Object.entries(CRISTALES).map(([clave, x]) => ({ clave, ...x }));
export const EXTERIORES = FRENTES;
export const INTERIORES = [
  { clave: 'blanco', nombre: 'Blanco', hex: '#f1f0ec' }, { clave: 'roble-claro', nombre: 'Roble claro', hex: '#cdae86', dibujo: 'veta' },
  { clave: 'roble-blanco', nombre: 'Roble blanco', hex: '#e2d6c4', dibujo: 'veta' },
  { clave: 'roble', nombre: 'Roble natural', hex: '#a7845f', dibujo: 'veta' }, { clave: 'nogal', nombre: 'Nogal', hex: '#6b4c36', dibujo: 'veta' },
  { clave: 'gris', nombre: 'Gris perla', hex: '#cfcdc8' }, { clave: 'cachemir', nombre: 'Cachemir', hex: '#d3c6b2' }, { clave: 'antracita', nombre: 'Antracita', hex: '#3c3f42' },
  { clave: 'lino', nombre: 'Efecto tela (lino)', hex: '#cbc2b2', dibujo: 'tela' }, { clave: 'algodon', nombre: 'Algodón', hex: '#ece8df', dibujo: 'tela' },
];
// Herraje de las correderas: perfiles, carril y juntas
export const PERFILES = [
  { clave: 'negro', nombre: 'Negro', hex: '#232323' }, { clave: 'blanco', nombre: 'Blanco', hex: '#f1f0ec' },
  { clave: 'madera', nombre: 'Madera', hex: '#a7845f' }, { clave: 'inox', nombre: 'Inox', hex: '#b9bcbf' },
];
// Modelos que solo se hacen en puertas correderas
export const SOLO_CORREDERAS = ['japonesa', 'japonesa3', 'rayas'];
export const TIRADORES_ARMARIO = [
  { clave: 'negro', nombre: 'Barra negra', hex: '#1d1d1d', tipo: 'barra' }, { clave: 'inox', nombre: 'Barra inox', hex: '#c4c6c7', tipo: 'barra' },
  { clave: 'oro', nombre: 'Oro cepillado', hex: '#b6955c', tipo: 'barra' }, { clave: 'unero', nombre: 'Uñero', hex: '#3a3a3a', tipo: 'unero' },
];
export { TIPOS };
export const ORDEN_TIPOS = Object.keys(TIPOS);

export const INICIAL_A = { ancho: 240, alto: 250, puertas: 'correderas', forma: 'lineal', lado: 180, modelo: 'lisa', cristal: 'mate', franja: 'roble', perfil: 'negro', led: '0', ext: 'blanco', int: 'roble-claro', tir: 'negro', mods: 'largo,cajones,doble', modsI: 'doble,zapatero', modsD: 'pantalonero,baldas' };
export const PROPUESTAS_A = [
  { nombre: 'Dormitorio de matrimonio', ancho: 280, alto: 250, puertas: 'correderas', modelo: 'japonesa3', franja: 'roble', perfil: 'madera', ext: 'blanco', int: 'blanco', tir: 'negro', mods: 'largo,cajones,doble' },
  { nombre: 'Vestidor en L de roble', ancho: 320, alto: 260, puertas: 'vestidor', forma: 'L', lado: 200, ext: 'roble-claro', int: 'roble-claro', tir: 'negro', mods: 'largo,zapatero,cajones,doble', modsI: 'pantExtra,accesorios' },
  { nombre: 'Vestidor en C con isla', ancho: 360, alto: 260, puertas: 'vestidor', forma: 'isla', led: '1', lado: 220, ext: 'negro', int: 'nogal', tir: 'negro', mods: 'largo,accesorios,doble,largo', modsI: 'doble,pantDoble,cajones', modsD: 'zapatero,zapatero,baldas' },
  { nombre: 'Clásico lacado', ancho: 200, alto: 240, puertas: 'abatibles', modelo: 'moldura', ext: 'blanco-roto', int: 'blanco', tir: 'oro', mods: 'largo,cajones' },
  { nombre: 'Vitrina con aspa', ancho: 240, alto: 250, puertas: 'abatibles', modelo: 'cruz', cristal: 'mate', ext: 'salvia', int: 'blanco', tir: 'oro', mods: 'baldas,doble,accesorios' },
  { nombre: 'Japandi', ancho: 240, alto: 250, puertas: 'correderas', modelo: 'rayas', perfil: 'blanco', ext: 'cachemir', int: 'roble-claro', tir: 'negro', mods: 'doble,baldas,largo' },
  { nombre: 'Cristal ahumado', ancho: 300, alto: 260, puertas: 'correderas', modelo: 'cristal', cristal: 'ahumado', perfil: 'negro', led: '1', ext: 'negro', int: 'roble', tir: 'negro', mods: 'largo,cajones,pantalonero' },
  { nombre: 'Vestidor en C blanco', ancho: 300, alto: 250, puertas: 'vestidor', forma: 'C', lado: 180, ext: 'blanco', int: 'blanco', tir: 'negro', mods: 'largo,cajones,doble', modsI: 'zapatero,accesorios', modsD: 'pantalonero,doble' },
  { nombre: 'Infantil', ancho: 160, alto: 230, puertas: 'abatibles', modelo: 'lisa', ext: 'salvia', int: 'blanco', tir: 'unero', mods: 'doble,baldas' },
];

// Lo que cabe y los consejos del taller
export function consejos(e, datos) {
  const bien = [], ojo = [], c = datos.cuenta, vest = e.puertas === 'vestidor';
  const lados = vest ? (e.forma === 'lineal' ? 0 : e.forma === 'L' ? 1 : 2) : 0;
  const personas = Math.max(1, Math.round((e.ancho + lados * (e.lado || 0)) / 100));
  if (!c.largo) ojo.push('Sin hueco para colgar largo: abrigos y vestidos necesitan 150–170 cm, con la barra a 170–180.');
  else bien.push('Hueco largo para abrigos y vestidos, con la barra a unos 175 cm.');
  if (c.corto) bien.push('Camisas y chaquetas en dos alturas: el doble de ropa en el mismo hueco.');
  if (!c.doblado) ojo.push('Faltan baldas o cajones para la ropa doblada: jerséis, camisetas y ropa interior.');
  if (!c.zapatos) ojo.push('¿Y los zapatos? Un zapatero abajo los deja a la vista y ordenados.');
  if (datos.pantalones) bien.push(`Caben unos ${datos.pantalones} pantalones colgados sin arrugas${(e.mods || []).concat(e.modsI || [], e.modsD || []).some((x) => x === 'pantExtra' || x === 'pantDoble') ? '; el pantalonero extraíble sale hacia delante y los ves de frente' : ''}.`);
  if (e.led === '1') bien.push(vest ? 'Con LED en las barras, la ropa se ve bien a cualquier hora y el vestidor luce como una tienda.' : 'Con LED en las barras y a los lados, la ropa se ve al abrir la puerta: se encuentra todo a la primera.');
  if (datos.cajones) bien.push('La cajonera queda por debajo de 100 cm: ves lo que hay dentro sin agacharte demasiado.');
  if (datos.altillo) bien.push('El altillo guarda maletas y la ropa de otra temporada.');
  else ojo.push('Con menos de 220 cm de alto no queda altillo: las maletas tendrán que ir en otro sitio.');
  // Puertas
  const cr = correderas(e.ancho, e.alto);
  if (!vest && !cr.ok) ojo.push(`Con ${e.ancho} cm de ancho, cada hoja corredera mediría ${cr.hoja} × ${cr.H} cm: ${String(cr.esbeltez).replace('.', ',')} veces más alta que ancha. Pasando de 3,5 la hoja cabecea al deslizar, así que van abatibles. Las correderas, a partir de unos ${cr.anchoMinimo} cm de ancho con este alto.`);
  if (e.puertas === 'correderas') bien.push(`Correderas de ${cr.k} hojas de ${cr.hoja} cm: no ocupan espacio al abrir. Ojo: el armario necesita 65 cm de fondo, porque las guías ocupan 8–9.`);
  if (e.puertas === 'abatibles') bien.push('Las abatibles dejan ver todo el armario a la vez. Deja 80–90 cm libres delante para abrirlas.');
  if (!vest) {
    if (e.modelo === 'cristal' || e.modelo === 'cruz') (e.cristal === 'claro' ? ojo : bien).push(e.cristal === 'claro' ? 'Con cristal transparente se ve todo: pide orden dentro y luz LED para que luzca.' : `El cristal ${e.cristal === 'mate' ? 'mate deja pasar la luz sin enseñar el desorden' : 'ahumado deja intuir el interior con un aire elegante'}.`);
    if (e.modelo === 'japonesa' || e.modelo === 'japonesa3') bien.push('La franja de la puerta japonesa rompe la superficie y da calidez si es de madera.');
    if (e.modelo === 'moldura' && e.tir === 'unero') ojo.push('Las puertas con moldura piden tirador; el uñero es para puertas lisas.');
  }
  // Pasos del vestidor (guía del taller)
  if (vest) {
    if (e.forma === 'lineal') bien.push('Vestidor lineal: deja al menos 70 cm de paso delante (90 es lo cómodo).');
    if (e.forma === 'L') { const paso = e.ancho - 60; (paso >= 90 ? bien : ojo).push(paso >= 90 ? `Quedan ${paso} cm de paso delante del lateral: cómodo.` : `Solo quedan ${paso} cm de paso delante del lateral; lo cómodo son 90.`); }
    if (e.forma === 'C') { const paso = e.ancho - 120; (paso >= 100 ? bien : paso >= 80 ? bien : ojo).push(paso >= 100 ? `Quedan ${paso} cm de paso entre los laterales: caben dos personas.` : paso >= 80 ? `Quedan ${paso} cm de paso entre los laterales: justo, lo cómodo son 100.` : `Solo ${paso} cm de paso entre los laterales; el mínimo con muebles a los dos lados son 80.`); }
    if (e.forma === 'isla') { const paso = (e.ancho - 120 - 50) / 2; (paso >= 90 ? bien : ojo).push(paso >= 90 ? `Con la isla quedan ${Math.floor(paso)} cm de paso a cada lado: los cajones abren bien.` : `Con la isla solo quedan ${Math.floor(paso)} cm a cada lado; hacen falta 90 (un cuarto de unos 350 cm de ancho). Prueba sin isla o más ancho.`); }
  }
  const tipos = new Set([...(e.mods || []), ...(vest && lados ? e.modsI || [] : []), ...(vest && lados > 1 ? e.modsD || [] : [])]);
  let p = 40 + [c.largo, c.corto, c.doblado, c.zapatos, datos.altillo].filter(Boolean).length * 10 + Math.min(8, tipos.size * 2);
  if (datos.n > 1 && tipos.size === 1) { p -= 8; ojo.push('Todos los huecos iguales: mezcla colgar, baldas y cajones para aprovecharlo mejor.'); }
  p -= ojo.filter((t) => /paso|pide tirador/.test(t)).length * 10;
  p = Math.max(35, Math.min(100, p));
  return { puntos: p, personas, bien, ojo, veredicto: p >= 90 ? '¡Todo en su sitio!' : p >= 75 ? 'Muy bien organizado' : p >= 60 ? 'Le falta algo' : 'Hay que repensarlo' };
}
export { modulosPara, cuerposPara, correderas };

// Armarios y vestidores que hemos hecho, con su foto (medios.json), para cargarlos en el juego.
export const DE_LA_CASA_A = [
  { nombre: 'Vestidor en U blanco', foto: 536, ancho: 300, alto: 250, puertas: 'vestidor', forma: 'C', lado: 200, ext: 'blanco', int: 'blanco', tir: 'negro', mods: 'baldas,doble,cajones', modsI: 'largo,doble', modsD: 'baldas,cajones' },
  { nombre: 'Correderas de cristal negro en buhardilla', foto: 589, ancho: 220, alto: 250, puertas: 'correderas', modelo: 'cristal', cristal: 'ahumado', perfil: 'inox', ext: 'negro', int: 'roble-claro', tir: 'negro', mods: 'largo,doble' },
  { nombre: 'Corredera Halifax con estantes', foto: 572, ancho: 180, alto: 250, puertas: 'correderas', modelo: 'japonesa3', franja: 'blanco', perfil: 'inox', ext: 'roble', int: 'roble-claro', tir: 'negro', mods: 'largo,cajones' },
  { nombre: 'Vestidor de madera blanca', foto: 587, ancho: 240, alto: 250, puertas: 'vestidor', forma: 'C', lado: 220, ext: 'roble-claro', int: 'roble-claro', tir: 'negro', mods: 'baldas', modsI: 'doble,pantExtra,cajones', modsD: 'largo,accesorios' },
  { nombre: 'Vitrina de aspa lacada', foto: 588, ancho: 300, alto: 250, puertas: 'abatibles', modelo: 'cruz', cristal: 'claro', ext: 'blanco-roto', int: 'blanco', tir: 'negro', mods: 'baldas,doble,largo' },
];

// ── Precio orientativo (con IVA, montado) ──
// Sacado de la app de Presupuestos (armarios.js, tabla inicial, margen del 25 %) el 18/11/2026: armario de suelo a techo
// (250 de alto, 60 de fondo) con interior básico y dos cajones, de 150, 200 y 300 cm; vestidor abierto de 200, 300 y 400 cm.
// Por metro, con IVA: armario laminado 670–725 · lacado blanco 885–925 · lacado color ~1.105; vestidor 600–860.
export const GAMAS_A = [
  { clave: 'economica', nombre: 'Económica', texto: 'Laminados (melamina o roble)', armario: [650, 750], vestidor: [600, 650] },
  { clave: 'media', nombre: 'Media', texto: 'Lacado blanco, textiles', armario: [850, 950], vestidor: [650, 750] },
  { clave: 'alta', nombre: 'Alta', texto: 'Lacado de color, herrajes altos', armario: [1050, 1200], vestidor: [780, 900] },
];
// Metros de mueble: el ancho del armario; en el vestidor, lo que miden sus paredes con cuerpos
export function metrosArmario(e) {
  if (e.puertas !== 'vestidor') return e.ancho / 100;
  const lado = (+e.lado || 0) / 100, fondo = e.ancho / 100;
  // En cada esquina se solapan los fondos (60 cm): no se cuentan dos veces
  return e.forma === 'L' ? fondo + lado - 0.6 : e.forma === 'C' || e.forma === 'isla' ? fondo + 2 * lado - 1.2 : fondo;
}
export function precioArmario(e, gama) {
  const g = GAMAS_A.find((x) => x.clave === gama) || GAMAS_A[1], m = metrosArmario(e), t = e.puertas === 'vestidor' ? g.vestidor : g.armario;
  const r50 = (v) => Math.round(v / 50) * 50;
  return { desde: r50(m * t[0]), hasta: r50(m * t[1]), metros: m, gama: g };
}
