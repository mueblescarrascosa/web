// Convierte el dibujo de un juego en una imagen PNG con la marca de Muebles Carrascosa:
// logo en la esquina, marca de agua suave en diagonal y un pie con el resumen y la web.
// Copia los colores y la visibilidad ya calculados (las variables CSS no viajan con el SVG suelto).

const base = () => (document.querySelector('link[rel=icon]')?.getAttribute('href') || '/favicon.png').replace(/\/favicon\.png$/, '');
const cargar = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

export async function imagenConMarca(svg, { titulo, lineas = [], ancho = 2000, vista } = {}) {
  try { svg.getAnimations({ subtree: true }).forEach((an) => an.finish()); } catch (e) {}
  const copia = svg.cloneNode(true), a = [svg, ...svg.querySelectorAll('*')], b = [copia, ...copia.querySelectorAll('*')];
  a.forEach((el, i) => {
    const cs = getComputedStyle(el), d = b[i];
    ['display', 'opacity', 'mix-blend-mode', 'transform', 'transform-origin', 'transform-box'].forEach((p) => d.style.setProperty(p, cs.getPropertyValue(p)));
    ['fill', 'stroke'].forEach((p) => { const v = cs.getPropertyValue(p); if (v && !v.startsWith('url(') && el.style.getPropertyValue(p)) d.style.setProperty(p, v); });
    d.style.removeProperty('transition'); d.style.removeProperty('animation');
  });
  if (vista) copia.setAttribute('viewBox', vista);
  const [, , vw, vh] = copia.getAttribute('viewBox').split(/\s+/).map(Number);
  const AN = ancho, AL = Math.round((AN * vh) / vw), PIE = 245;
  copia.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); copia.setAttribute('width', AN); copia.setAttribute('height', AL);
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copia)], { type: 'image/svg+xml' }));
  const img = await cargar(url); URL.revokeObjectURL(url);
  const c = document.createElement('canvas'); c.width = AN; c.height = AL + PIE; const x = c.getContext('2d');
  x.drawImage(img, 0, 0, AN, AL);
  try { await document.fonts.load('650 52px "Bricolage Grotesque Variable"'); await document.fonts.load('400 26px "Inter Variable"'); } catch (e) {}
  // Marca de agua en diagonal, muy suave
  x.save(); x.translate(AN / 2, AL / 2); x.rotate(-Math.PI / 9); x.globalAlpha = 0.07; x.fillStyle = '#000';
  x.font = '650 64px "Bricolage Grotesque Variable", sans-serif'; x.textAlign = 'center';
  for (let fy = -AL; fy <= AL; fy += 260) for (let fx = -AN; fx <= AN; fx += 900) x.fillText('MUEBLES CARRASCOSA', fx + (fy / 260) * 300, fy);
  x.restore();
  // Logo en la esquina, sobre una placa clara
  try {
    const logo = await cargar(base() + '/logo-negro.png'), lw = 300, lh = (logo.height / logo.width) * lw;
    x.globalAlpha = 0.82; x.fillStyle = '#ffffff'; x.beginPath(); x.roundRect(AN - lw - 64, AL - lh - 56, lw + 36, lh + 28, 14); x.fill();
    x.globalAlpha = 1; x.drawImage(logo, AN - lw - 46, AL - lh - 42, lw, lh);
  } catch (e) {}
  x.globalAlpha = 1;
  // Pie: título, resumen y web
  x.fillStyle = '#0d0d0e'; x.fillRect(0, AL, AN, PIE);
  x.fillStyle = '#ffffff'; x.font = '650 52px "Bricolage Grotesque Variable", sans-serif'; x.fillText(titulo, 60, AL + 78);
  x.fillStyle = '#a8a39b'; x.font = '400 25px "Inter Variable", sans-serif';
  const filas = [''];
  lineas.forEach((t) => { const l = filas.length - 1, prueba = filas[l] ? filas[l] + ' · ' + t : t; if (x.measureText(prueba).width > AN - 120 && filas[l]) filas.push(t); else filas[l] = prueba; });
  filas.slice(0, 2).forEach((t, i) => x.fillText(t, 60, AL + 122 + i * 36));
  x.fillStyle = '#c9a27a'; x.fillText('Diseña el tuyo en mueblescarrascosa.com · Muebles Carrascosa, Villanueva del Arzobispo (Jaén) · 653 45 12 70', 60, AL + 210);
  return new Promise((res) => c.toBlob(res, 'image/png'));
}

// Descarga la imagen o, en el móvil, la comparte (WhatsApp, etc.)
export async function descargarOCompartir(blob, nombre, titulo) {
  const archivo = new File([blob], nombre, { type: 'image/png' });
  if (matchMedia('(pointer: coarse)').matches && navigator.canShare?.({ files: [archivo] })) { await navigator.share({ files: [archivo], title: titulo }); return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
