// Datos de «Combina tu baño» y «Configura tu puerta»: opciones, colores y consejos.
import { FRENTES, ENCIMERAS } from './combina.js';

// ── Baño ──
export const B_TIPOS = [{ clave: 'suspendido', nombre: 'Suspendido' }, { clave: 'suelo', nombre: 'Al suelo' }];
export const B_FRENTES = [{ clave: 'cajones', nombre: 'Dos cajones' }, { clave: 'puertas', nombre: 'Puertas' }, { clave: 'abierto', nombre: 'Cajón y hueco abierto' }];
export const B_LAVABOS = [{ clave: 'integrado', nombre: 'Integrado en la encimera' }, { clave: 'sobre', nombre: 'Sobre encimera' }];
export const B_ESPEJOS = [{ clave: 'rect', nombre: 'Rectangular' }, { clave: 'redondo', nombre: 'Redondo' }, { clave: 'led', nombre: 'Con luz LED' }];
export const B_COLORES = FRENTES.filter((x) => ['blanco', 'blanco-roto', 'hueso', 'gris-perla', 'vison', 'antracita', 'negro', 'salvia', 'aguamarina', 'marino', 'terracota', 'roble-claro', 'roble', 'nogal'].includes(x.clave));
export const B_ENCIMERAS = ENCIMERAS.filter((x) => ['blanca', 'marmol', 'calacatta', 'piedra', 'hormigon', 'negra', 'roble-macizo'].includes(x.clave));
export const GRIFOS = [{ clave: 'cromo', nombre: 'Cromo', hex: '#c9cccf' }, { clave: 'negro', nombre: 'Negro mate', hex: '#1e1f21' }, { clave: 'oro', nombre: 'Oro cepillado', hex: '#b6955c' }, { clave: 'blanco', nombre: 'Blanco', hex: '#f1f0ec' }];
export const B_PAREDES = [{ clave: 'blanco', nombre: 'Azulejo blanco', hex: '#f1efe9', azulejo: 1 }, { clave: 'verde', nombre: 'Azulejo verde', hex: '#8fa89a', azulejo: 1 }, { clave: 'terracota', nombre: 'Azulejo terracota', hex: '#c58a6c', azulejo: 1 }, { clave: 'micro', nombre: 'Microcemento gris', hex: '#b9b6ae', azulejo: 0 }, { clave: 'crema', nombre: 'Pintura crema', hex: '#e6dcc9', azulejo: 0 }];
export const B_INICIAL = { ancho: 100, tipo: 'suspendido', frente: 'cajones', senos: '1', lavabo: 'integrado', espejo: 'led', columna: '0', color: 'roble', encimera: 'blanca', grifo: 'negro', pared: 'blanco' };

export function consejosBano(e) {
  const bien = [], ojo = [];
  bien.push(e.lavabo === 'sobre' ? 'Con lavabo sobre encimera el mueble va más bajo, para que el borde del lavabo quede a unos 90 cm.' : 'Con el lavabo integrado, la encimera a unos 85 cm: cómodo para casi todos.');
  if (e.tipo === 'suspendido') bien.push('Suspendido: se friega el suelo por debajo y el baño parece más grande.');
  else bien.push('Al suelo: más almacenaje y muy estable; con zócalo para que no le llegue el agua de fregar.');
  if (+e.senos === 2 && e.ancho < 120) ojo.push(`Con ${e.ancho} cm, dos senos quedan muy apretados: a partir de 120 cm caben bien.`);
  else if (+e.senos === 2) bien.push('Dos senos: cada uno con su espacio por la mañana.');
  if (e.frente === 'cajones') bien.push('Cajones mejor que puertas: se ve todo de un vistazo y no hay que agacharse.');
  if (e.espejo === 'led') bien.push('El espejo con luz LED da una luz uniforme en la cara, sin sombras, para maquillarse o afeitarse.');
  else bien.push('El espejo, con su centro a la altura de los ojos (unos 160 cm).');
  if (e.columna === '1') bien.push('La columna guarda toallas y productos sin llenar la encimera.');
  bien.push('Lo hacemos con tablero hidrófugo y cantos sellados, a la medida exacta del hueco, para que aguante la humedad.');
  return { bien, ojo };
}

// ── Puertas de paso ──
export const P_TIPOS = [{ clave: 'abatible', nombre: 'Abatible' }, { clave: 'granero', nombre: 'Corredera de granero' }, { clave: 'empotrada', nombre: 'Corredera empotrada' }];
export const P_MODELOS = [{ clave: 'lisa', nombre: 'Lisa' }, { clave: 'ranuras', nombre: 'Ranuras' }, { clave: 'vertical', nombre: 'Vidriera vertical' }, { clave: 'vidrieras', nombre: '4 vidrieras' }, { clave: 'clasica', nombre: 'Clásica' }, { clave: 'cristal', nombre: 'De cristal' }];
export const P_COLORES = FRENTES.filter((x) => ['blanco', 'blanco-roto', 'gris-perla', 'vison', 'antracita', 'negro', 'salvia', 'roble-claro', 'roble', 'nogal'].includes(x.clave));
export const MANILLAS = [{ clave: 'inox', nombre: 'Inox', hex: '#c4c6c7' }, { clave: 'negro', nombre: 'Negra', hex: '#1d1d1d' }, { clave: 'oro', nombre: 'Oro cepillado', hex: '#b6955c' }];
// Colores de pared y de zócalo (el zócalo puede ir como la puerta).
export const P_PAREDES = [
  { clave: 'blanco', nombre: 'Blanco', hex: '#f1efe9' }, { clave: 'hueso', nombre: 'Hueso', hex: '#e9e6df' }, { clave: 'arena', nombre: 'Arena', hex: '#e2d6c1' },
  { clave: 'gris', nombre: 'Gris perla', hex: '#d6d5d0' }, { clave: 'salvia', nombre: 'Salvia', hex: '#b9c4b0' }, { clave: 'azul', nombre: 'Azul niebla', hex: '#c6d0da' },
  { clave: 'terracota', nombre: 'Terracota', hex: '#c98f72' }, { clave: 'antracita', nombre: 'Antracita', hex: '#4a4d50' },
];
export const P_ZOCALO_COLORES = [
  { clave: 'puerta', nombre: 'Como la puerta', hex: '' }, { clave: 'blanco', nombre: 'Blanco', hex: '#f4f3ef' }, { clave: 'gris', nombre: 'Gris', hex: '#9b9c9a' },
  { clave: 'negro', nombre: 'Negro', hex: '#262626' }, { clave: 'roble', nombre: 'Roble', hex: '#b58a5c', dibujo: 'veta' }, { clave: 'nogal', nombre: 'Nogal', hex: '#6b4a33', dibujo: 'veta' },
];
export const P_INICIAL = { hueco: 82, alto: 210, galce: 9, tipo: 'abatible', modelo: 'ranuras', abre: 'der', tirador: 'redondo', alta: 'medida', ancha: 'fijo', color: 'blanco', manilla: 'negro', pared: 'hueso', zocalo: 'rodapie', zcolor: 'puerta' };

// Consejos y avisos de la puerta. Prudentes: todo es orientativo y se confirma en obra.
// d: lo que devuelve puerta() (reparto del ancho, alto de la hoja y su nivel, fijo arriba).
export function consejosPuerta(e, hoja, d = {}) {
  const bien = [], ojo = [], n = (v) => String(Math.round(v * 10) / 10).replace('.', ',');
  const r = d.reparto || { forma: 'una', piezas: [{ w: hoja, clase: 'hoja' }], principal: hoja, paso: hoja };
  const altoHoja = d.altoHoja || 203, [p, q] = r.piezas;

  // ── Ancho ──
  if (e.tipo === 'abatible') {
    if (r.forma === 'una') {
      bien.push(`Hoja de ${n(p.w)} × ${altoHoja} cm para un hueco de ${e.hueco} × ${e.alto} cm. Las habituales son de 62,5, 72,5 y 82,5 de ancho y 203 de alto.`);
      if (r.conObra) ojo.push(`Con ${e.hueco} cm de hueco la de ${n(p.w)} cabe con algo de obra: lo normal para ella sin tocar el hueco son ${n(p.w + 8.5)} cm.`);
      if (e.hueco - p.w > 12.5) ojo.push(`Sobra hueco: con ${e.hueco} cm, la hoja de ${n(p.w)} deja ${n(e.hueco - p.w - 8.5)} cm de más para el marco. Hay que estrechar el hueco con obra o hacer la hoja a medida.`);
      if (p.w < 72.5) ojo.push('Con menos de 72,5 cm de hoja se pasa justo con muebles o con la compra; para silla de ruedas, mejor 82,5.');
    } else if (r.forma === 'fijo') {
      bien.push(`Con ${e.hueco} cm de hueco, una hoja sola sería demasiado ancha y pesada: va una hoja de ${n(p.w)} (el paso de cada día) y un fijo lateral de ${n(q.w)} cm.`);
      if (q.w > p.w) ojo.push(`El fijo (${n(q.w)} cm) queda más ancho que la hoja: con este hueco suele quedar mejor una doble bandera.`);
    } else {
      bien.push(`Doble bandera: hoja de ${n(p.w)} para el paso de cada día y ${q.w === p.w ? 'otra igual' : `una hojilla de ${n(q.w)} cm`} que se abre cuando hace falta más paso (${n(r.paso)} cm con las dos abiertas).`);
      if (![62.5, 72.5, 82.5, 92.5].includes(p.w)) ojo.push(`Con ${e.hueco} cm las hojas pasan de las medidas de serie: van a medida.`);
      else if (q.w !== p.w) ojo.push('La hojilla va a medida, con el mismo modelo y acabado que la hoja.');
    }
    bien.push('Deja libre el barrido de la puerta al abrir: que no choque con muebles, enchufes ni interruptores.');
  }
  if (e.tipo === 'granero') {
    if (r.forma === 'una') {
      bien.push(`Hoja de unos ${n(p.w)} × ${altoHoja} cm, a medida, que tapa el hueco y unos 5 cm por cada lado. Va colgada de un carril a la vista.`);
      ojo.push(`Necesita pared libre a un lado de al menos ${Math.ceil(p.w)} cm, sin enchufes, interruptores ni muebles, para que corra.`);
    } else {
      bien.push(`Con ${e.hueco} cm de hueco una hoja pasaría de 120 cm: van dos hojas de unos ${n(p.w)} cm que se abren cada una hacia un lado.`);
      ojo.push(`Necesita pared libre a los dos lados, de al menos ${Math.ceil(p.w)} cm cada uno, sin enchufes ni interruptores.`);
    }
  }
  if (e.tipo === 'empotrada') {
    if (r.forma === 'una') {
      bien.push(`Hoja de ${n(p.w)} × ${altoHoja} cm que se esconde dentro del tabique: no ocupa sitio al abrir.`);
      if (r.conObra) ojo.push(`Con ${e.hueco} cm de hueco la de ${n(p.w)} entra con algo de obra al montar el armazón.`);
      if (e.hueco - p.w > 12.5) ojo.push(`Sobra hueco: con ${e.hueco} cm, la hoja de ${n(p.w)} no lo cierra bien. Hay que estrechar el hueco con obra o buscar un casoneto para una hoja a medida.`);
    } else {
      bien.push(`Con ${e.hueco} cm de hueco van dos hojas de ${n(p.w)} cm, una a cada lado (casoneto doble): ${n(r.paso)} cm de paso.`);
      ojo.push(`Hace falta tabique libre a los dos lados del hueco, de al menos ${Math.ceil(p.w)} cm cada uno, para meter las hojas.`);
      if (r.aMedida) ojo.push('Con este hueco las hojas no son de serie: hay que confirmar que hay casoneto doble para esa medida.');
    }
    ojo.push('Hay que meter un armazón (casoneto) dentro de la pared: se decide antes de la obra o al hacer la reforma.');
  }

  // ── Alto ──
  const nv = d.nivel;
  if (e.tipo === 'abatible') {
    if (nv === 'bajo') ojo.push(`Con ${e.alto} cm de alto la hoja normal de 203 no entra: va una hoja a medida de ${altoHoja} cm (o se sube el hueco con obra).`);
    if (nv === 'especial') ojo.push(`Con ${e.alto} cm de alto va una puerta de altura especial, de 211 (la normal, de 203, es para huecos de 206 a 213).`);
    if (nv === 'superior') ojo.push(`Con ${e.alto} cm de alto se pasa de la altura especial de 211: hoja de altura especial superior, a medida, o la de 211 con un fijo arriba.`);
    if (nv === 'fijo') ojo.push(`Con ${e.alto} cm de alto: hoja de 211 y un fijo arriba de unos ${Math.round(d.fijo)} cm, del mismo acabado.`);
  }
  if (e.tipo === 'empotrada') {
    if (nv === 'bajo') ojo.push(`Con ${e.alto} cm de alto la hoja de 203 no entra en el casoneto: va una hoja a medida de ${altoHoja} cm (o se sube el hueco con obra).`);
    if (nv === 'sin-casoneto') ojo.push(`Con ${e.alto} cm de alto no conocemos casoneto de serie: llegan a huecos de 205–206 (hoja de 203). Habría que bajar el hueco con un dintel o un fijo arriba de unos ${Math.round(d.fijo)} cm, o elegir otra puerta (abatible o de granero).`);
  }
  if (e.tipo === 'granero') {
    if (nv === 'granero-especial') ojo.push(`Hoja de ${altoHoja} cm de alto: pasa de 203, así que es de altura especial, a medida.`);
    if (nv === 'granero-max') ojo.push(`Con ${e.alto} cm de hueco la hoja pasaría de 240 cm de alto, y más no se hace: hay que bajar el hueco con un dintel (dibujado encima) o elegir otra puerta.`);
  }

  // ── Galce ──
  const g = +e.galce || 9, gTxt = n(g);
  if (e.tipo === 'empotrada') {
    if (g < 10) ojo.push(`Con ${gTxt} cm de pared puede no caber el armazón: el tabique terminado suele necesitar unos 10 cm o más, según el casoneto.`);
    else bien.push(`Galce de ${gTxt} cm: en principio el armazón cabe dentro del tabique.`);
  } else if (e.tipo === 'abatible') {
    if (g > 11) ojo.push(`Galce especial de ${gTxt} cm: pasa de los 11 de serie. El marco va especial o con un forro (prolongación) para cubrir el canto.`);
    else if (g < 7) ojo.push(`Galce de ${gTxt} cm, muy fino: hay que mirar qué marco se puede poner.`);
    else bien.push(`Marco de ${gTxt} cm de galce: el grueso de la pared ya con el yeso o el azulejo.`);
  } else if (g > 11) bien.push(`Galce de ${gTxt} cm: el canto del hueco se forra a juego para que quede rematado.`);

  if (e.modelo === 'cristal' || e.modelo === 'vidrieras' || e.modelo === 'vertical') bien.push('El cristal deja pasar la luz al pasillo; si es un baño, mejor cristal mate.');
  if (e.zocalo === 'alto') bien.push('El zócalo alto (de 1 m) protege la pared de golpes y roces, y a juego con la puerta queda muy bien.');
  ojo.push('Todo esto son estimaciones: siempre hay que verlo en obra. Las medidas exactas las tomamos nosotros en casa.');
  return { bien, ojo };
}
