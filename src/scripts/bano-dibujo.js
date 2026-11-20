// Dibujo del mueble de baño para «Combina tu baño», de frente y en cm (y hacia abajo: y = 240 − altura).
// Colores en variables CSS: --frente, --enc, --grifo, --pared, --suelo (y --v-frente, --m-enc para veta y vetas).
const f = (n) => +n.toFixed(1), H = 240, Y = (h) => H - h;
const R = (x, y, w, h, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${a}/>`;

// Medidas: suspendido de 30 a 85 cm (encimera a 85) o al suelo con zócalo; con lavabo sobre encimera, el mueble baja a 76
export function medidasBano({ tipo = 'suspendido', lavabo = 'integrado' }) {
  const sobre = lavabo === 'sobre', encTop = sobre ? 78 : 85, base = tipo === 'suelo' ? 0 : 30;
  return { encTop, base, borde: sobre ? encTop + 13 : encTop };
}


// Cotas: líneas de medida con su etiqueta (se encienden al cambiar la medida: clase «cambia» desde la página)
const etC = (x, y, txt) => `<rect x="${f(x - txt.length * 3.1 - 4)}" y="${f(y - 8)}" width="${f(txt.length * 6.2 + 8)}" height="14" rx="3" fill="#fbf7ee" stroke="#3d2f25" stroke-width=".6"/><text x="${f(x)}" y="${f(y + 2.6)}" text-anchor="middle">${txt}</text>`;
const linC = (x1, y1, x2, y2) => `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}"/>`;
const cotaH = (id, x1, x2, y, txt) => `<g class="cota" id="cota-${id}">${linC(x1, y, x2, y)}${linC(x1, y - 6, x1, y + 6)}${linC(x2, y - 6, x2, y + 6)}${etC((x1 + x2) / 2, y, txt)}</g>`;
const cotaV = (id, x, y1, y2, txt) => `<g class="cota" id="cota-${id}">${linC(x, y1, x, y2)}${linC(x - 6, y1, x + 6, y1)}${linC(x - 6, y2, x + 6, y2)}${etC(x, (y1 + y2) / 2, txt)}</g>`;
export function bano({ ancho = 100, tipo = 'suspendido', frente = 'cajones', senos = 1, lavabo = 'integrado', espejo = 'rect', columna = false }) {
  const m = medidasBano({ tipo, lavabo }), W = 260, x0 = (W - ancho - (columna ? 45 : 0)) / 2, cuerpoArriba = m.encTop - 2;
  let s = '';
  // Pared con azulejo y suelo
  s += R(0, 0, W, H, 'style="fill:var(--pared)" class="pieza"') + R(0, 0, W, H, 'fill="url(#azulejoB)" class="dibujo" style="opacity:var(--v-azulejo)"');
  s += R(0, H, W, 30, 'style="fill:var(--suelo)" class="pieza"') + R(0, H, W, 30, 'fill="url(#baldosaB)"') + R(0, H, W, 3, 'fill="#000" opacity=".15"');
  // Toallero con toalla y planta
  const xt = x0 + ancho + (columna ? 55 : 22);
  if (xt + 30 < W) s += R(xt, Y(120), 30, 1.6, 'style="fill:var(--grifo)" class="pieza"') + R(xt + 3, Y(119.5), 24, 48, 'rx="3" fill="#e7e2d6"') + R(xt + 3, Y(119.5), 24, 4, 'fill="#000" opacity=".1"');
  // Espejo(s)
  const zonas = senos === 2 ? [[x0, x0 + ancho / 2], [x0 + ancho / 2, x0 + ancho]] : [[x0, x0 + ancho]];
  zonas.forEach(([a, b]) => {
    const c = (a + b) / 2, w = Math.min(b - a - 8, espejo === 'redondo' ? 60 : 110);
    if (espejo === 'redondo') s += `<circle cx="${f(c)}" cy="${Y(160)}" r="${f(w / 2)}" fill="url(#espejoB)" stroke="#9aa0a6" stroke-width="1"/><circle cx="${f(c)}" cy="${Y(160)}" r="${f(w / 2)}" fill="url(#reflejoB)"/>`;
    else {
      if (espejo === 'led') s += R(c - w / 2 - 4, Y(204), w + 8, 98, 'rx="6" fill="url(#haloB)" class="led-espejo"');
      s += R(c - w / 2, Y(200), w, 90, `rx="${espejo === 'led' ? 3 : 1}" fill="url(#espejoB)" stroke="${espejo === 'led' ? '#fff3d9' : '#9aa0a6'}" stroke-width="${espejo === 'led' ? 1.6 : 1}"`) + R(c - w / 2, Y(200), w, 90, 'fill="url(#reflejoB)"');
    }
  });
  // Columna lateral
  if (columna) {
    const xc = x0 + ancho + 5;
    s += R(xc, Y(190), 40, 160, 'style="fill:var(--frente)" class="pieza" stroke="#000" stroke-opacity=".2" stroke-width=".4"') + R(xc, Y(190), 40, 160, 'fill="url(#vetaB)" class="dibujo" style="opacity:var(--v-frente)"');
    s += R(xc, Y(110), 40, 0.6, 'fill="#000" opacity=".25"') + R(xc + 4, Y(186), 2, 26, 'style="fill:var(--grifo)" class="pieza"') + R(xc + 4, Y(106), 2, 26, 'style="fill:var(--grifo)" class="pieza"');
  }
  // Sombra del mueble suspendido en la pared
  if (tipo === 'suspendido') s += R(x0 + 3, Y(m.base) - 1, ancho - 6, 6, 'fill="#000" opacity=".12"');
  // Cuerpo y frentes
  const alto = cuerpoArriba - m.base, zo = tipo === 'suelo' ? 8 : 0;
  s += R(x0, Y(cuerpoArriba), ancho, alto, 'style="fill:var(--frente)" class="pieza"');
  if (zo) s += R(x0 + 2, Y(zo), ancho - 4, zo, 'fill="#000" opacity=".35"');
  const fr = (x, y, w, h) => R(x, y, w, h, 'style="fill:var(--frente)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".5"') + R(x, y, w, h, 'fill="url(#vetaB)" class="dibujo" style="opacity:var(--v-frente)"') + R(x, y, w, h, 'fill="url(#brilloB)"');
  const util = alto - zo, yTop = Y(cuerpoArriba);
  if (frente === 'cajones') { const h1 = util * 0.45; s += fr(x0, yTop, ancho, h1) + fr(x0, yTop + h1, ancho, util - h1); [yTop, yTop + h1].forEach((y) => (s += R(x0 + ancho / 2 - 12, y + 4, 24, 1.8, 'rx=".9" style="fill:var(--grifo)" class="pieza"'))); }
  if (frente === 'puertas') { const n = ancho > 80 ? 2 : 1, w = ancho / n; for (let i = 0; i < n; i++) { s += fr(x0 + i * w, yTop, w, util); const xb = n === 2 ? (i ? x0 + i * w + 4 : x0 + w - 6) : x0 + w - 6; s += R(xb, yTop + 5, 1.8, 18, 'rx=".9" style="fill:var(--grifo)" class="pieza"'); } }
  if (frente === 'abierto') { const h1 = util * 0.5; s += fr(x0, yTop, ancho, h1) + R(x0 + ancho / 2 - 12, yTop + 4, 24, 1.8, 'rx=".9" style="fill:var(--grifo)" class="pieza"'); s += R(x0 + 2, yTop + h1 + 1, ancho - 4, util - h1 - 2, 'fill="#000" opacity=".28"'); for (let x = x0 + 8; x + 12 < x0 + ancho - 4; x += 16) s += R(x, yTop + util - 14, 12, 12, `rx="2" fill="${['#e7e2d6', '#a9b4c2', '#c6a77d'][Math.round(x) % 3]}"`); }
  // Encimera
  s += R(x0 - 1, Y(m.encTop), ancho + 2, 2.5, 'style="fill:var(--enc)" class="pieza"') + R(x0 - 1, Y(m.encTop), ancho + 2, 2.5, 'fill="url(#marmolB)" class="dibujo" style="opacity:var(--m-enc)"');
  // Lavabo(s) y grifo(s)
  zonas.forEach(([a, b]) => {
    const c = (a + b) / 2, gb = m.encTop, alto = lavabo === 'sobre' ? 30 : 18;
    // Primero el grifo (va detrás) y luego el lavabo
    s += R(c - 1.2, Y(gb + alto), 2.4, alto, 'style="fill:var(--grifo)" class="pieza"');
    s += `<path d="M${f(c)} ${Y(gb + alto - 1)}h9v3" fill="none" style="stroke:var(--grifo)" stroke-width="2.2" stroke-linecap="round"/>`;
    if (lavabo === 'sobre') s += `<path d="M${f(c - 22)} ${Y(m.encTop)}c0-8 2-13 6-13h32c4 0 6 5 6 13z" fill="#f6f5f1" stroke="#cfcdc8" stroke-width=".6"/>`;
    else s += R(c - 20, Y(m.encTop) - 0.6, 40, 0.8, 'fill="#000" opacity=".2"');
  });
  s += cotaH('ancho', x0, x0 + ancho, H + 17, ancho + ' cm') + cotaV('encimera', x0 - 12, Y(m.encTop), H, m.encTop + ' cm');
  return { vista: `0 0 ${W} ${H + 30}`, s };
}

export const DEFS_BANO = `<defs>
<pattern id="azulejoB" width="15" height="7.5" patternUnits="userSpaceOnUse"><path d="M0 .3h15M.3 0v3.75M7.8 3.75v3.75M0 3.9h15" stroke="#000" stroke-opacity=".14" stroke-width=".4"/></pattern>
<pattern id="baldosaB" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M0 .3h30M.3 0v30" stroke="#000" stroke-opacity=".15" stroke-width=".5"/></pattern>
<pattern id="vetaB" width="10" height="60" patternUnits="userSpaceOnUse"><path d="M2 0c1 14-1 28 .4 42s-.8 12 0 18M6 0c-.8 10 1.4 24 0 36s1.2 20 .4 24" fill="none" stroke="#3b2414" stroke-opacity=".2" stroke-width=".3"/></pattern>
<pattern id="marmolB" width="80" height="3" patternUnits="userSpaceOnUse"><path d="M0 1.5c20-1 30 1 50 0s20-1 30 0" fill="none" stroke="#8a8a8a" stroke-opacity=".5" stroke-width=".3"/></pattern>
<linearGradient id="espejoB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dfe6ea"/><stop offset=".6" stop-color="#b9c4ca"/><stop offset="1" stop-color="#cdd6db"/></linearGradient>
<linearGradient id="reflejoB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".25"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="haloB"><stop offset=".8" stop-color="#fff3d9" stop-opacity=".9"/><stop offset="1" stop-color="#fff3d9" stop-opacity="0"/></radialGradient>
<linearGradient id="brilloB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
</defs>`;
