// Datos de «Diseña tu salón»: mueble de TV a medida (bajo suspendido, columnas, puente, panel de listones,
// estantes, chimenea eléctrica y LED), colores y consejos del taller.
import { FRENTES } from './combina.js';

export const S_COLORES = FRENTES.filter((x) => ['blanco', 'blanco-roto', 'hueso', 'gris-perla', 'vison', 'antracita', 'negro', 'salvia', 'marino', 'terracota', 'roble-claro', 'roble', 'nogal'].includes(x.clave));
export const S_PANELES = FRENTES.filter((x) => ['roble-claro', 'roble', 'nogal', 'negro', 'antracita', 'blanco'].includes(x.clave));
export const S_PAREDES = [
  { clave: 'blanco', nombre: 'Blanco', hex: '#f1efe9' }, { clave: 'hueso', nombre: 'Hueso', hex: '#e9e6df' }, { clave: 'arena', nombre: 'Arena', hex: '#e2d6c1' },
  { clave: 'gris', nombre: 'Gris perla', hex: '#d6d5d0' }, { clave: 'salvia', nombre: 'Salvia', hex: '#b9c4b0' }, { clave: 'azul', nombre: 'Azul niebla', hex: '#c6d0da' },
  { clave: 'terracota', nombre: 'Terracota', hex: '#c98f72' }, { clave: 'antracita', nombre: 'Antracita', hex: '#4a4d50' },
];
export const S_FRENTES = [{ clave: 'cajones', nombre: 'Cajones' }, { clave: 'puertas', nombre: 'Puertas abatibles' }, { clave: 'mixto', nombre: 'Cajones y hueco abierto' }];
export const S_TIRADORES = [{ clave: 'gola', nombre: 'Gola (sin tirador)' }, { clave: 'push', nombre: 'Push (se abre empujando)' }, { clave: 'barra', nombre: 'Tirador de barra' }];
export const TVS = [43, 50, 55, 65, 75, 85];
export const SI_NO = [{ clave: '0', nombre: 'No' }, { clave: '1', nombre: 'Sí' }];
export const S_INICIAL = { ancho: 320, alto: 260, tv: 65, tvAltura: 105, sofa: 3, frente: 'cajones', tirador: 'gola', columnas: '1', puente: '1', panel: '1', estantes: '0', chimenea: '0', led: '1', color: 'blanco', panelColor: 'roble', pared: 'hueso' };

// Tamaño de la tele (cm) por pulgadas, formato 16:9
export const tamTV = (pulgadas) => ({ ancho: Math.round(pulgadas * 2.54 * 0.8716), alto: Math.round(pulgadas * 2.54 * 0.4903) });
// Pulgadas aconsejadas para la distancia al sofá: verla a entre 1 y 2 veces su diagonal (más cerca, en 4K)
export const pulgadasPara = (metros) => ({ desde: Math.round((metros * 100) / 2 / 2.54), hasta: Math.round((metros * 100) / 1.0 / 2.54) });

export function consejosSalon(e, d = {}) {
  const bien = [], ojo = [], t = tamTV(e.tv), r = pulgadasPara(e.sofa), m = (v) => String(v).replace('.', ','), centro = d.centro || e.tvAltura;
  // La tele y el sofá
  if (e.tv < r.desde) ojo.push(`Para ${m(e.sofa)} m de sofá la tele de ${e.tv}" se queda pequeña: lo cómodo son de ${r.desde}" a ${Math.min(r.hasta, 98)}".`);
  else if (e.tv > r.hasta) ojo.push(`Para ${m(e.sofa)} m de sofá una tele de ${e.tv}" es muy grande: cansa la vista. Lo cómodo, hasta unas ${r.hasta}".`);
  else bien.push(`Tele de ${e.tv}" (${t.ancho} × ${t.alto} cm) a ${m(e.sofa)} m del sofá: buena medida.`);
  // Altura de la tele: el centro a la altura de los ojos sentado (unos 100–110 cm)
  if (d.tvBaja) ojo.push(`La tele no cabe con el centro a ${e.tvAltura} cm sin pisar el bajo: sube hasta ${centro} cm.`);
  if (centro > 120) ojo.push(`Con el centro de la tele a ${centro} cm hay que mirar hacia arriba y cansa el cuello: lo cómodo son 100–110 cm, a la altura de los ojos sentado.`);
  else if (centro < 95) ojo.push(`Con el centro a ${centro} cm la tele queda baja: lo cómodo son 100–110 cm.`);
  else bien.push(`Centro de la tele a ${centro} cm: a la altura de los ojos sentado en el sofá.`);
  if (e.chimenea === '1') {
    bien.push('Chimenea eléctrica en el bajo: da ambiente y algo de calor, sin obra ni humos. Necesita un enchufe en el hueco.');
    if (d.tvBaja) ojo.push('Con la chimenea debajo, la tele no puede bajar más: el bajo es más alto. Que su centro no pase de 115–120 cm.');
  }
  // El mueble
  if (d.bajo && d.bajo < t.ancho + 20) ojo.push(`El bajo (${d.bajo} cm) es más estrecho que la tele: mejor que la pase al menos 10 cm por cada lado.`);
  if (d.libre !== undefined && d.libre < 0) ojo.push(`La tele de ${e.tv}" no cabe entre las columnas con ${e.ancho} cm de pared: quita las columnas o elige una tele más pequeña.`);
  if (e.columnas === '1') bien.push('Las columnas laterales guardan mucho y enmarcan la tele; con puertas, lo de dentro no se ve.');
  if (e.puente === '1') bien.push('El puente arriba une las columnas y aprovecha la parte alta de la pared, para lo que se usa poco.');
  if (e.panel === '1') bien.push('El panel de listones detrás de la tele esconde los cables y da calidez a la pared.');
  if (e.estantes === '1') bien.push('Estantes flotantes para libros y adornos, sin herrajes a la vista.');
  if (e.led === '1') bien.push('LED indirecto: luz suave para ver la tele sin cansar la vista, con la luz del techo apagada.');
  if (e.tirador === 'gola') bien.push('Con gola los frentes quedan lisos, sin tiradores que se enganchen.');
  bien.push('Dejamos el pasacables y los enchufes detrás de la tele y del bajo: sin cables a la vista.');
  ojo.push('Todo esto son estimaciones: siempre hay que verlo en obra. Las medidas exactas las tomamos nosotros en casa.');
  return { bien, ojo };
}
