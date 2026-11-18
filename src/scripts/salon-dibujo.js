// Dibujo del mueble de TV para «Diseña tu salón», de frente y en cm (y hacia abajo: y = alto de la pared − altura).
// Colores en variables CSS: --frente, --panel, --pared, --suelo (y --v-frente, --v-panel para la veta).
import { tamTV } from '../datos/salon.js';
const f = (n) => +n.toFixed(1);
const R = (x, y, w, h, a = '') => (w > 0 && h > 0 ? `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${a}/>` : '');

export function salon({ ancho = 320, alto = 260, tv = 65, tvAltura = 105, frente = 'cajones', tirador = 'gola', columnas = '1', puente = '1', panel = '1', estantes = '0', chimenea = '0', led = '1' }) {
  const Y = (h) => alto - h, t = tamTV(tv);
  const COL = columnas === '1' ? 45 : 0, hayPuente = puente === '1';
  const altoBajo = chimenea === '1' ? 55 : 42, sueloBajo = 18, topeBajo = sueloBajo + altoBajo;
  const altoCol = Math.min(alto - 12, 235), altoPuente = 38;
  const interior = ancho - 2 * COL;   // entre columnas (o toda la pared)
  const bajo = COL ? interior : Math.min(ancho - 30, Math.max(t.ancho + 60, 200)), xb = (ancho - bajo) / 2;
  // La tele: su centro donde se pida, pero nunca pisando el bajo
  const centroMin = topeBajo + 10 + t.alto / 2, centro = Math.max(tvAltura, centroMin), tvBaja = tvAltura < centroMin;
  const xt = (ancho - t.ancho) / 2, techoMuebles = hayPuente ? altoCol - altoPuente : altoCol;
  const fr = (x, y, w, h) => R(x, y, w, h, 'style="fill:var(--frente)" class="pieza" stroke="#000" stroke-opacity=".22" stroke-width=".5"') + R(x, y, w, h, 'fill="url(#vetaS)" class="dibujo" style="opacity:var(--v-frente)"') + R(x, y, w, h, 'fill="url(#brilloS)"');
  const agarre = (x, y, w, h, vertical = false) => {
    if (tirador === 'gola') return vertical ? R(x + w - 2.2, y, 2.2, h, 'fill="#000" opacity=".45"') : R(x, y, w, 2.2, 'fill="#000" opacity=".45"');
    if (tirador === 'barra') return vertical ? R(x + w - 6, y + h / 2 - 10, 1.8, 20, 'rx=".9" fill="#1d1d1d"') : R(x + w / 2 - 10, y + 5, 20, 1.8, 'rx=".9" fill="#1d1d1d"');
    return '';
  };
  let s = '';
  // Pared, rodapié y suelo (más anchos que la pared, para rellenar los lados del dibujo)
  s += R(-200, -60, ancho + 400, alto + 60, 'style="fill:var(--pared)" class="pieza"') + R(-200, alto - 7, ancho + 400, 7, 'fill="#f3f2ee"') + R(-200, alto, ancho + 400, 60, 'style="fill:var(--suelo)" class="pieza"') + R(-200, alto, ancho + 400, 60, 'fill="url(#tablasS)"');
  // LED: luz que baña la pared bajo el bajo y alrededor del panel
  if (led === '1') s += `<ellipse cx="${f(ancho / 2)}" cy="${f(Y(sueloBajo) + 2)}" rx="${f(bajo / 2 + 6)}" ry="${sueloBajo - 4}" fill="url(#luzSuave)"/>`;
  // Panel de listones detrás de la tele
  if (panel === '1') {
    const pw = Math.min(interior - 20, t.ancho + 50), px = (ancho - pw) / 2, ph = techoMuebles - topeBajo - (hayPuente ? 0 : 10);
    if (led === '1') s += R(px - 8, Y(topeBajo + ph) - 6, pw + 16, ph + 12, 'rx="8" fill="url(#halo)"');
    s += R(px, Y(topeBajo + ph), pw, ph, 'style="fill:var(--panel)" class="pieza"') + R(px, Y(topeBajo + ph), pw, ph, 'fill="url(#vetaS)" class="dibujo" style="opacity:var(--v-panel)"') + R(px, Y(topeBajo + ph), pw, ph, 'fill="url(#listones)"');
  }
  // Estantes flotantes a los lados de la tele
  if (estantes === '1') {
    const ocupado = panel === '1' ? Math.min(interior - 20, t.ancho + 50) : t.ancho + 20, hueco = (interior - ocupado) / 2 - 12;
    if (hueco >= 30) {
      const w = Math.min(70, hueco);
      [COL + 6 + (hueco - w) / 2, ancho - COL - 6 - (hueco - w) / 2 - w].forEach((x) => [140, 178].forEach((h) => {
        s += R(x, Y(h), w, 3.5, 'style="fill:var(--frente)" class="pieza" stroke="#000" stroke-opacity=".2" stroke-width=".4"') + R(x + 4, Y(h) + 3.5, w - 8, 3, 'fill="#000" opacity=".12"');
        s += R(x + 8, Y(h + 16), 5, 16, 'fill="#8b6b4e"') + R(x + 14, Y(h + 14), 4, 14, 'fill="#4e6a72"') + R(x + w - 18, Y(h + 9), 12, 9, 'rx="4" fill="#d9d2c4"');
      }));
    }
  }
  // Columnas laterales y puente
  if (COL) [0, ancho - COL].forEach((x) => {
    s += R(x, Y(altoCol), COL, altoCol, 'fill="#000" opacity=".2"');
    s += fr(x, Y(altoCol), COL, altoCol - 90) + agarre(x, Y(altoCol), COL, altoCol - 90, true);
    s += fr(x, Y(90), COL, 90 - 8) + agarre(x, Y(90), COL, 90 - 8, true) + R(x, Y(8), COL, 8, 'fill="#000" opacity=".35"');
  });
  if (hayPuente) {
    const xp = COL ? COL : xb, wp = COL ? interior : bajo;
    s += fr(xp, Y(altoCol), wp, altoPuente) + agarre(xp, Y(altoCol) + altoPuente - 2.2, wp, 2.2);
    if (led === '1') s += `<ellipse cx="${f(ancho / 2)}" cy="${f(Y(altoCol - altoPuente) + 1)}" rx="${f(wp / 2 - 6)}" ry="12" fill="url(#luzSuave)"/>`;
  }
  // Sombra del bajo suspendido y el bajo con sus frentes
  s += R(xb + 4, Y(sueloBajo) + 1, bajo - 8, 5, 'fill="#000" opacity=".14"');
  s += R(xb, Y(topeBajo), bajo, altoBajo, 'style="fill:var(--frente)" class="pieza"');
  const anchoFuego = chimenea === '1' ? Math.min(100, bajo - 60) : 0;
  const tramos = anchoFuego ? [[xb, (bajo - anchoFuego) / 2], [xb + (bajo + anchoFuego) / 2, (bajo - anchoFuego) / 2]] : [[xb, bajo]];
  tramos.forEach(([x0, w0]) => {
    const n = Math.max(1, Math.round(w0 / 80)), w = w0 / n;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * w;
      if (frente === 'mixto' && !anchoFuego && n >= 3 && i === Math.floor(n / 2)) { s += R(x + 1.5, Y(topeBajo) + 1.5, w - 3, altoBajo - 3, 'fill="#000" opacity=".35"') + R(x + 8, Y(sueloBajo + 16), 22, 16, 'fill="#a58a6a"') + R(x + w - 26, Y(sueloBajo + 12), 16, 12, 'rx="2" fill="#555"'); continue; }
      s += fr(x, Y(topeBajo), w, altoBajo) + agarre(x, Y(topeBajo), w, altoBajo, frente === 'puertas');
    }
  });
  if (anchoFuego) {
    const xf = xb + (bajo - anchoFuego) / 2, yf = Y(topeBajo) + 6, hf = altoBajo - 12;
    s += R(xf, Y(topeBajo), anchoFuego, altoBajo, 'fill="#111"') + R(xf + 4, yf, anchoFuego - 8, hf, 'fill="url(#fuego)"');
    for (let x = xf + 10; x < xf + anchoFuego - 10; x += 9) s += `<path d="M${f(x)} ${f(yf + hf)}c-3 -6 2 -9 1 -15c4 4 6 9 3 15z" fill="#ffd27a" opacity=".85"/>`;
    s += R(xf + 4, yf, anchoFuego - 8, hf, 'fill="url(#reflejoS)"');
  }
  // La tele, colgada en la pared
  const yt = Y(centro + t.alto / 2);
  s += R(xt + 3, yt + 3, t.ancho, t.alto, 'rx="1.5" fill="#000" opacity=".25"') + R(xt, yt, t.ancho, t.alto, 'rx="1.5" fill="#121314"') + R(xt + 1.2, yt + 1.2, t.ancho - 2.4, t.alto - 2.4, 'fill="url(#pantalla)"');
  const libre = interior - t.ancho - 10;
  const vista = `-15 -10 ${ancho + 30} ${alto + 35}`;
  return { vista, s, bajo: Math.round(bajo), libre, tvBaja, centro: Math.round(centro), tv: t };
}

export const DEFS_SALON = `<defs>
<pattern id="vetaS" width="10" height="70" patternUnits="userSpaceOnUse"><path d="M2 0c1 16-1 32 .4 48s-.8 16 0 22M6 0c-.8 12 1.4 28 0 40s1.2 24 .4 30" fill="none" stroke="#3b2414" stroke-opacity=".2" stroke-width=".35"/></pattern>
<pattern id="listones" width="5" height="10" patternUnits="userSpaceOnUse"><rect x="4" width="1" height="10" fill="#000" opacity=".28"/></pattern>
<pattern id="tablasS" width="18" height="30" patternUnits="userSpaceOnUse"><path d="M0 0v30" stroke="#2a1a0e" stroke-opacity=".25" stroke-width=".5"/></pattern>
<linearGradient id="pantalla" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d3440"/><stop offset=".45" stop-color="#15181d"/><stop offset=".46" stop-color="#1b1f26"/><stop offset="1" stop-color="#0b0c0e"/></linearGradient>
<linearGradient id="fuego" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a1a"/><stop offset=".45" stop-color="#c2410c" stop-opacity=".9"/><stop offset="1" stop-color="#1a0d06"/></linearGradient>
<linearGradient id="luzAbajo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7b0" stop-opacity=".75"/><stop offset="1" stop-color="#ffe7b0" stop-opacity="0"/></linearGradient>
<radialGradient id="luzSuave" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffe7b0" stop-opacity=".8"/><stop offset=".7" stop-color="#ffe7b0" stop-opacity=".15"/><stop offset="1" stop-color="#ffe7b0" stop-opacity="0"/></radialGradient>
<radialGradient id="halo"><stop offset=".75" stop-color="#ffe7b0" stop-opacity=".55"/><stop offset="1" stop-color="#ffe7b0" stop-opacity="0"/></radialGradient>
<linearGradient id="reflejoS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="brilloS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
</defs>`;
