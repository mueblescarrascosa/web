// Datos de la empresa y ayudas comunes.
export const EMPRESA = {
  nombre: 'Muebles Carrascosa',
  razon: 'Muebles Carrascosa, S.L.',
  lema: 'Carpintería, cocinas y armarios a medida en Jaén',
  calle: 'C. Fuenclara, 72',
  cp: '23330',
  pueblo: 'Villanueva del Arzobispo',
  provincia: 'Jaén',
  telefono: '653 45 12 70',
  tel: '+34653451270',
  whatsapp: 'https://wa.me/34653451270',
  email: 'carrascosamuebles@gmail.com',
  facebook: 'https://facebook.com/mueblescarrascosa',
  instagram: 'https://instagram.com/mueblescarrascosa',
  comoLlegar: 'https://www.google.com/maps/dir/?api=1&destination=Muebles+Carrascosa+Villanueva+del+Arzobispo',
  resenas: 'https://g.page/r/CbVrUA6ShlL9EBM/review',
  verResenas: 'https://www.google.com/maps/search/?api=1&query=Muebles+Carrascosa+Villanueva+del+Arzobispo',
  horario: [
    ['Lunes a jueves', '8:30 – 14:00 y 16:00 – 19:00'],
    ['Viernes', '8:30 – 14:00'],
    ['Sábado y domingo', 'Cerrado'],
  ],
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
// Ruta con la base delante (en pruebas, /web).
export const r = (p = '/') => (/^(https?:|mailto:|tel:|#)/.test(p) ? p : BASE + (p.startsWith('/') ? p : '/' + p));
// HTML importado de WordPress: sus enlaces y fotos empiezan por "/"; se les pone la base.
export const conBase = (html) => (BASE ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE}/`) : html);
// Versión pequeña de una foto local (800 px) para tarjetas y cuadrículas.
export const peq = (src) => src?.replace(/\.webp$/, '-800.webp');

// Entradas visibles hoy: publicadas o programadas cuya fecha ya llegó (la web se reconstruye cada mañana).
import entradas from '../datos/entradas.json';
export const entradasVisibles = () => {
  const ahora = new Date();
  return entradas.filter((e) => (e.estado === 'publish' || e.estado === 'future') && new Date(e.fecha + '+01:00') <= ahora);
};
export const fechaLarga = (f) => new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
