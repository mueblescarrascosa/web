// Dibujo de la puerta de paso para «Configura tu puerta», de frente y en cm (y hacia abajo: y = 250 − altura).
// Tipos: abatible (con marco y tapajuntas), corredera de granero (colgada de un carril por fuera) y corredera empotrada (casoneto).
// Colores en variables CSS: --hoja, --manilla, --pared, --suelo (y --v-hoja para la veta).
const f = (n) => +n.toFixed(1), TOP = 250, Y = (h) => TOP - h;
const R = (x, y, w, h, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${a}/>`;
export const HOJAS = [62.5, 72.5, 82.5, 92.5];

// Hoja estándar para un hueco de obra: la mayor que deja unos 9 cm para el marco (abatible) o que lo tapa (corredera)
export function hojaPara(hueco, tipo) {
  if (tipo === 'granero') return Math.round((hueco + 10) * 2) / 2;                 // por fuera tapa el hueco y 5 cm a cada lado
  return HOJAS.filter((h) => h <= hueco - 8.5).pop() || HOJAS[0];
}

export function puerta({ hueco = 82, alto = 210, tipo = 'abatible', modelo = 'lisa', abre = 'der' }) {
  const W = 300, x0 = (W - hueco) / 2, hoja = hojaPara(hueco, tipo), altoHoja = tipo === 'granero' ? alto + 5 : 203;
  let s = '';
  // Pared y suelo
  s += R(0, 0, W, TOP, 'style="fill:var(--pared)" class="pieza"') + R(0, TOP, W, 30, 'style="fill:var(--suelo)" class="pieza"') + R(0, TOP, W, 30, 'fill="url(#tablasP)"') + R(0, TOP - 8, W, 8, 'fill="#f1f0ec"') + R(0, TOP - 8, W, 0.8, 'fill="#000" opacity=".12"');
  // Hueco (el pasillo de detrás, en penumbra)
  s += R(x0, Y(alto), hueco, alto, 'fill="#2a2a2e"') + R(x0, Y(alto), hueco, alto, 'fill="url(#fondoP)"');
  // La hoja con su modelo
  const dibujaHoja = (x, w, h) => {
    const y = Y(h);
    let t = R(x, y, w, h, 'style="fill:var(--hoja)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".5"') + R(x, y, w, h, 'fill="url(#vetaP)" class="dibujo" style="opacity:var(--v-hoja)"');
    const vidrio = (vx, vy, vw, vh) => R(vx, vy, vw, vh, 'fill="#cfe0e6" opacity=".55"') + R(vx, vy, vw, vh, 'fill="url(#reflejoP)"') + R(vx, vy, vw, vh, 'fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".5"');
    if (modelo === 'ranuras') [0.2, 0.35, 0.5, 0.65, 0.8].forEach((v) => (t += R(x + 4, y + h * v, w - 8, 0.7, 'fill="#000" opacity=".25"')));
    if (modelo === 'vertical') t += vidrio(x + w * 0.62, y + 12, w * 0.14, h - 24);
    if (modelo === 'vidrieras') [0.12, 0.33, 0.54, 0.75].forEach((v) => (t += vidrio(x + w * 0.22, y + h * v, w * 0.56, h * 0.16)));
    if (modelo === 'clasica') [[0.1, 0.45], [0.55, 0.37]].forEach(([v, alto_]) => (t += R(x + 9, y + h * v, w - 18, h * alto_, 'fill="none" stroke="#fff" stroke-opacity=".38" stroke-width=".8"') + R(x + 10, y + h * v + 1, w - 19, h * alto_ - 1, 'fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".6"')));
    if (modelo === 'cristal') t += vidrio(x + 8, y + 10, w - 16, h - 20);
    return t + R(x, y, w, h, 'fill="url(#brilloP)"');
  };
  if (tipo === 'abatible') {
    // Marco y tapajuntas alrededor del hueco; la hoja gira sobre las bisagras
    s += R(x0 - 7, Y(alto + 7), hueco + 14, alto + 7, 'style="fill:var(--hoja)" class="pieza"') + R(x0 - 7, Y(alto + 7), hueco + 14, alto + 7, 'fill="#000" opacity=".08"');
    s += R(x0, Y(alto), hueco, alto, 'fill="#2a2a2e"') + R(x0, Y(alto), hueco, alto, 'fill="url(#fondoP)"');
    const xh = x0 + (hueco - hoja) / 2;
    const izq = abre === 'izq', xm = izq ? xh + hoja - 8 : xh + 4;
    s += `<g class="hoja-puerta abatible" style="transform-origin:${izq ? 'left' : 'right'} center">${dibujaHoja(xh, hoja, altoHoja)}`
      + R(xm, Y(105), 4, 2.2, 'rx="1" style="fill:var(--manilla)" class="pieza"') + R(izq ? xm - 10 : xm, Y(105), 14, 2.2, 'rx="1" style="fill:var(--manilla)" class="pieza"') + `<circle cx="${f(xm + 2)}" cy="${Y(104)}" r="2.8" style="fill:var(--manilla)" class="pieza"/></g>`;
    [Y(altoHoja - 20), Y(30)].forEach((yb) => (s += R(izq ? xh - 1 : xh + hoja - 1, yb, 2, 9, 'fill="#9aa0a6"')));
  }
  if (tipo === 'granero') {
    // Carril por encima del hueco y hoja colgada por fuera, que se desliza junto a la pared
    const xh = x0 - 5;
    s += R(xh - 4, Y(alto + 14), hoja * 2 + 8, 3, 'style="fill:var(--manilla)" class="pieza"');
    s += `<g class="hoja-puerta granero" style="--mover:${f(hoja)}px">${dibujaHoja(xh, hoja, altoHoja)}`
      + `<circle cx="${f(xh + 12)}" cy="${Y(alto + 12)}" r="3" style="fill:var(--manilla)" class="pieza"/><circle cx="${f(xh + hoja - 12)}" cy="${Y(alto + 12)}" r="3" style="fill:var(--manilla)" class="pieza"/>`
      + R(xh + hoja - 9, Y(130), 2.6, 40, 'rx="1.2" style="fill:var(--manilla)" class="pieza"') + `</g>`;
  }
  if (tipo === 'empotrada') {
    // La hoja entra en el tabique (dentro de un casoneto): solo se ve en el hueco
    const xh = x0 + (hueco - hoja) / 2;
    s += `<clipPath id="huecoP"><rect x="${f(x0)}" y="${Y(alto)}" width="${f(hueco)}" height="${alto}"/></clipPath>`;
    s += `<g clip-path="url(#huecoP)"><g class="hoja-puerta empotrada" style="--mover:${f(-hoja)}px">${dibujaHoja(xh, hoja, Math.min(altoHoja, alto))}`
      + R(xh + hoja - 7, Y(120), 2.4, 30, 'rx="1" fill="#000" opacity=".45"') + `</g></g>`;
    s += R(x0 - 1.5, Y(alto + 1.5), hueco + 3, alto + 1.5, 'fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.5"');
  }
  return { vista: `0 20 ${W} ${TOP + 10}`, s, hoja, altoHoja };
}

export const DEFS_PUERTA = `<defs>
<pattern id="vetaP" width="10" height="70" patternUnits="userSpaceOnUse"><path d="M2 0c1 16-1 32 .4 48s-.8 16 0 22M6 0c-.8 12 1.4 28 0 40s1.2 24 .4 30" fill="none" stroke="#3b2414" stroke-opacity=".2" stroke-width=".35"/></pattern>
<pattern id="tablasP" width="18" height="30" patternUnits="userSpaceOnUse"><path d="M0 0v30" stroke="#2a1a0e" stroke-opacity=".25" stroke-width=".5"/></pattern>
<linearGradient id="fondoP" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".5" stop-color="#3a3a40" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
<linearGradient id="reflejoP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".2"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="brilloP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
</defs>`;
