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
export const P_INICIAL = { hueco: 82, alto: 210, galce: 9, tipo: 'abatible', modelo: 'ranuras', abre: 'der', color: 'blanco', manilla: 'negro' };

export function consejosPuerta(e, hoja) {
  const bien = [], ojo = [];
  const hojaTxt = String(hoja).replace('.', ',');
  if (e.tipo === 'abatible') {
    bien.push(`Hoja estándar de ${hojaTxt} × 203 cm para un hueco de ${e.hueco} cm. Las medidas habituales son 62,5, 72,5 y 82,5 cm de ancho.`);
    if (hoja < 72.5) ojo.push('Con menos de 72,5 cm se pasa justo con muebles o compra; para una silla de ruedas, mejor 82,5.');
    bien.push('Deja libre el barrido de la puerta al abrir: que no choque con muebles ni enchufes.');
  }
  if (e.tipo === 'granero') {
    bien.push(`Hoja de unos ${hojaTxt} cm, que tapa el hueco y 5 cm a cada lado. Va colgada de un carril a la vista.`);
    ojo.push(`Necesita pared libre a un lado de al menos ${Math.ceil(hoja)} cm, sin enchufes ni interruptores, para que corra.`);
  }
  if (e.tipo === 'empotrada') {
    bien.push(`Hoja de ${hojaTxt} cm que se esconde dentro del tabique: no ocupa sitio al abrir.`);
    ojo.push('Hay que meter un armazón (casoneto) dentro de la pared: se decide antes de la obra o al hacer reforma.');
  }
  const g = +e.galce || 9, gTxt = String(g).replace('.', ',');
  if (e.tipo === 'empotrada') { if (g < 10) ojo.push(`Con ${gTxt} cm de pared no cabe el armazón: para esconder la hoja el tabique terminado necesita unos 10 cm o más.`); else bien.push(`Galce de ${gTxt} cm: el armazón cabe dentro del tabique.`); }
  else if (g > 11) bien.push(`Galce de ${gTxt} cm: con paredes tan gruesas el marco lleva un forro (prolongación) para cubrir todo el canto.`);
  else bien.push(`Marco de ${gTxt} cm de galce, el grueso de la pared ya con el yeso o el azulejo.`);
  if (e.modelo === 'cristal' || e.modelo === 'vidrieras' || e.modelo === 'vertical') bien.push('El cristal deja pasar la luz al pasillo; si es un baño, mejor cristal mate.');
  bien.push('Las medidas exactas las tomamos nosotros en casa, con la obra terminada.');
  return { bien, ojo };
}
