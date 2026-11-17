// Juego «Diseña tu armario»: acabados, propuestas y consejos (con las medidas de la guía del taller).
import { FRENTES } from './combina.js';
import { TIPOS, MODELOS, CRISTALES, modulosPara } from '../scripts/armario-dibujo.js';

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

export const INICIAL_A = { ancho: 240, alto: 250, puertas: 'correderas', forma: 'lineal', lado: 180, modelo: 'lisa', cristal: 'mate', franja: 'roble', perfil: 'negro', ext: 'blanco', int: 'roble-claro', tir: 'negro', mods: 'largo,cajones,doble', modsI: 'doble,zapatero', modsD: 'pantalonero,baldas' };
export const PROPUESTAS_A = [
  { nombre: 'Dormitorio de matrimonio', ancho: 280, alto: 250, puertas: 'correderas', modelo: 'japonesa3', franja: 'roble', perfil: 'madera', ext: 'blanco', int: 'blanco', tir: 'negro', mods: 'largo,cajones,doble' },
  { nombre: 'Vestidor en L de roble', ancho: 320, alto: 260, puertas: 'vestidor', forma: 'L', lado: 200, ext: 'roble-claro', int: 'roble-claro', tir: 'negro', mods: 'largo,zapatero,cajones,doble', modsI: 'pantalonero,accesorios' },
  { nombre: 'Vestidor en C con isla', ancho: 360, alto: 260, puertas: 'vestidor', forma: 'isla', lado: 220, ext: 'negro', int: 'nogal', tir: 'negro', mods: 'largo,accesorios,doble,largo', modsI: 'doble,pantalonero,cajones', modsD: 'zapatero,zapatero,baldas' },
  { nombre: 'Clásico lacado', ancho: 200, alto: 240, puertas: 'abatibles', modelo: 'moldura', ext: 'blanco-roto', int: 'blanco', tir: 'oro', mods: 'largo,cajones' },
  { nombre: 'Vitrina con cruz', ancho: 240, alto: 250, puertas: 'abatibles', modelo: 'cruz', cristal: 'mate', ext: 'salvia', int: 'blanco', tir: 'oro', mods: 'baldas,doble,accesorios' },
  { nombre: 'Japandi', ancho: 240, alto: 250, puertas: 'correderas', modelo: 'rayas', perfil: 'blanco', ext: 'cachemir', int: 'roble-claro', tir: 'negro', mods: 'doble,baldas,largo' },
  { nombre: 'Cristal ahumado', ancho: 300, alto: 260, puertas: 'correderas', modelo: 'cristal', cristal: 'ahumado', perfil: 'negro', ext: 'negro', int: 'roble', tir: 'negro', mods: 'largo,cajones,pantalonero' },
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
  if (datos.pantalones) bien.push(`El pantalonero cuelga ${datos.pantalones} pantalones doblados por la mitad, sin arrugas, en unos 75 cm de alto.`);
  if (datos.cajones) bien.push('La cajonera queda por debajo de 100 cm: ves lo que hay dentro sin agacharte demasiado.');
  if (datos.altillo) bien.push('El altillo guarda maletas y la ropa de otra temporada.');
  else ojo.push('Con menos de 220 cm de alto no queda altillo: las maletas tendrán que ir en otro sitio.');
  // Puertas
  if (e.puertas === 'correderas') bien.push('Las correderas no ocupan espacio al abrir. Ojo: el armario necesita 65 cm de fondo, porque las guías ocupan 8–9.');
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
export { modulosPara };
