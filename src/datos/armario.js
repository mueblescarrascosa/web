// Juego «Diseña tu armario»: acabados, propuestas y consejos (con las medidas de la guía del taller).
import { FRENTES } from './combina.js';
import { TIPOS, modulosPara } from '../scripts/armario-dibujo.js';

export const PUERTAS_ARMARIO = [
  { clave: 'correderas', nombre: 'Correderas' }, { clave: 'abatibles', nombre: 'Abatibles' }, { clave: 'vestidor', nombre: 'Vestidor abierto' },
];
export const EXTERIORES = FRENTES;
export const INTERIORES = [
  { clave: 'blanco', nombre: 'Blanco', hex: '#f1f0ec' }, { clave: 'roble-claro', nombre: 'Roble claro', hex: '#cdae86', dibujo: 'veta' },
  { clave: 'roble', nombre: 'Roble natural', hex: '#a7845f', dibujo: 'veta' }, { clave: 'gris', nombre: 'Gris perla', hex: '#cfcdc8' }, { clave: 'cachemir', nombre: 'Cachemir', hex: '#d3c6b2' },
];
export const TIRADORES_ARMARIO = [
  { clave: 'negro', nombre: 'Barra negra', hex: '#1d1d1d', tipo: 'barra' }, { clave: 'inox', nombre: 'Barra inox', hex: '#c4c6c7', tipo: 'barra' },
  { clave: 'oro', nombre: 'Oro cepillado', hex: '#b6955c', tipo: 'barra' }, { clave: 'unero', nombre: 'Uñero', hex: '#3a3a3a', tipo: 'unero' },
];
export { TIPOS };
export const ORDEN_TIPOS = Object.keys(TIPOS);

export const INICIAL_A = { ancho: 240, alto: 250, puertas: 'correderas', ext: 'blanco', int: 'roble-claro', tir: 'negro', mods: 'largo,cajones,doble' };
export const PROPUESTAS_A = [
  { nombre: 'Dormitorio de matrimonio', ancho: 280, alto: 250, puertas: 'correderas', ext: 'roble', int: 'blanco', tir: 'negro', mods: 'largo,cajones,doble' },
  { nombre: 'Vestidor en roble', ancho: 320, alto: 260, puertas: 'vestidor', ext: 'roble-claro', int: 'roble-claro', tir: 'negro', mods: 'largo,zapatero,cajones,doble' },
  { nombre: 'Clásico lacado', ancho: 200, alto: 240, puertas: 'abatibles', ext: 'blanco-roto', int: 'blanco', tir: 'oro', mods: 'largo,cajones' },
  { nombre: 'Japandi', ancho: 240, alto: 250, puertas: 'correderas', ext: 'cachemir', int: 'roble-claro', tir: 'negro', mods: 'doble,baldas,largo' },
  { nombre: 'Infantil', ancho: 160, alto: 230, puertas: 'abatibles', ext: 'salvia', int: 'blanco', tir: 'unero', mods: 'doble,baldas' },
  { nombre: 'Negro y madera', ancho: 300, alto: 260, puertas: 'correderas', ext: 'negro', int: 'roble', tir: 'negro', mods: 'largo,cajones,zapatero' },
];

// Lo que cabe y los consejos del taller
export function consejos(e, datos) {
  const bien = [], ojo = [], c = datos.cuenta;
  const personas = Math.max(1, Math.round(e.ancho / 100));
  if (!c.largo) ojo.push('Sin hueco para colgar largo: abrigos y vestidos necesitan 150–170 cm, con la barra a 170–180.');
  else bien.push('Hueco largo para abrigos y vestidos, con la barra a unos 175 cm.');
  if (c.corto) bien.push('Las camisas y chaquetas caben en dos alturas: el doble de ropa en el mismo hueco.');
  if (!c.doblado) ojo.push('Faltan baldas o cajones para la ropa doblada: jerséis, camisetas y ropa interior.');
  if (!c.zapatos) ojo.push('¿Y los zapatos? Un zapatero abajo los deja a la vista y ordenados.');
  if (datos.cajones) bien.push('La cajonera queda por debajo de 100 cm: ves lo que hay dentro sin agacharte demasiado.');
  if (datos.altillo) bien.push('El altillo guarda maletas y la ropa de otra temporada.');
  else ojo.push('Con menos de 220 cm de alto no queda altillo: las maletas tendrán que ir en otro sitio.');
  if (e.puertas === 'correderas') bien.push('Las correderas no ocupan espacio al abrir. Ojo: el armario necesita 65 cm de fondo, porque las guías ocupan 8–9.');
  if (e.puertas === 'abatibles') bien.push('Las abatibles dejan ver todo el armario a la vez. Deja 80–90 cm libres delante para abrirlas.');
  if (e.puertas === 'vestidor') bien.push('Vestidor: deja al menos 70 cm de paso (90 es lo cómodo), o 80 si hay muebles a los dos lados.');
  const tipos = new Set(e.mods.slice(0, datos.n)); let p = 40 + [c.largo, c.corto, c.doblado, c.zapatos, datos.altillo].filter(Boolean).length * 11 + Math.min(5, tipos.size);
  if (datos.n > 1 && tipos.size === 1) { p -= 8; ojo.push('Todos los huecos iguales: mezcla colgar, baldas y cajones para aprovecharlo mejor.'); }
  p = Math.max(35, Math.min(100, p));
  return { puntos: p, personas, bien, ojo, veredicto: p >= 90 ? '¡Todo en su sitio!' : p >= 75 ? 'Muy bien organizado' : p >= 60 ? 'Le falta algo' : 'Hay que repensarlo' };
}
export { modulosPara };
