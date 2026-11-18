// Dibujo de la puerta de paso para «Configura tu puerta», de frente y en cm (y hacia abajo: y = 250 − altura).
// Tipos: abatible (con marco y tapajuntas), corredera de granero (colgada de un carril por fuera) y corredera empotrada (casoneto).
// Colores en variables CSS: --hoja, --manilla, --pared, --suelo (y --v-hoja para la veta).
const f = (n) => +n.toFixed(1), TOP = 250, Y = (h) => TOP - h;
const R = (x, y, w, h, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${a}/>`;
export const HOJAS = [62.5, 72.5, 82.5, 92.5];

// Hoja estándar para un hueco de obra: la mayor que cabe. Sin obra, el marco pide unos 8,5 cm más que la hoja;
// con algo de obra (ajustando el hueco y el premarco) cabe ya con 2,5 cm más: la de 82,5 en un hueco de 85 u 86.
export const HOLGURA = 8.5, HOLGURA_OBRA = 2.5;
export function hojaPara(hueco, tipo) {
  if (tipo === 'granero') return Math.round((hueco + 10) * 2) / 2;                 // por fuera tapa el hueco y 5 cm a cada lado
  return HOJAS.filter((h) => h <= hueco - HOLGURA_OBRA).pop() || HOJAS[0];
}
export const conObra = (hueco, hoja, tipo) => tipo !== 'granero' && hueco - hoja < HOLGURA;

// Alto de la hoja según el alto del hueco (abatible y empotrada; la de granero se hace a la medida):
//   menos de 206: la de 203 no entra sin obra (o una hoja más baja, a medida) · 206–213: la normal de 203
//   214–221: altura especial de 211 · más de 221: altura especial superior (a medida) o la de 211 con un fijo arriba.
export const ALTO_NORMAL = 203, ALTO_ESPECIAL = 211;
export function altoPara(alto, tipo, alta = 'medida') {
  if (tipo === 'granero') return { altoHoja: alto + 5, nivel: 'granero', fijo: 0 };
  if (alto < 206) return { altoHoja: ALTO_NORMAL, nivel: 'bajo', fijo: 0 };
  if (alto <= 213) return { altoHoja: ALTO_NORMAL, nivel: 'normal', fijo: 0 };
  if (alto <= 221) return { altoHoja: ALTO_ESPECIAL, nivel: 'especial', fijo: 0 };
  if (alta === 'fijo') return { altoHoja: ALTO_ESPECIAL, nivel: 'fijo', fijo: alto - ALTO_ESPECIAL - 7 };
  return { altoHoja: alto - 8, nivel: 'superior', fijo: 0 };
}

// Tirador de las correderas, embutido en la hoja (del color de los herrajes): redondo, dedal (alargado) o barra (granero).
export const TIRADORES = [{ clave: 'redondo', nombre: 'Embutido redondo' }, { clave: 'dedal', nombre: 'Dedal' }, { clave: 'barra', nombre: 'Barra (solo granero)' }];
const tirador = (clase, xc, yc) => {
  if (clase === 'barra') return R(xc - 1.3, yc - 20, 2.6, 40, 'rx="1.2" style="fill:var(--manilla)" class="pieza"');
  if (clase === 'dedal') return R(xc - 2.2, yc - 7, 4.4, 14, 'rx="2.2" style="fill:var(--manilla)" class="pieza"') + R(xc - 1.2, yc - 5.5, 2.4, 11, 'rx="1.2" fill="#000" opacity=".45"');
  return `<circle cx="${f(xc)}" cy="${f(yc)}" r="4.2" style="fill:var(--manilla)" class="pieza"/><circle cx="${f(xc)}" cy="${f(yc)}" r="2.8" fill="#000" opacity=".45"/>`;
};

export function puerta({ hueco = 82, alto = 210, tipo = 'abatible', modelo = 'lisa', abre = 'der', tirador: tir = 'redondo', alta = 'medida' }) {
  const W = 300, x0 = (W - hueco) / 2, hoja = hojaPara(hueco, tipo), A = altoPara(alto, tipo, alta), altoHoja = A.altoHoja;
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
  // Fijo encima de la hoja (montante): panel del color de la puerta y un travesaño que lo separa
  function fijoArriba(xh, w, hHoja, altoHueco) {
    const y0 = Y(altoHueco - 1), y1 = Y(hHoja + 2.5);
    return R(xh, y0, w, y1 - y0, 'style="fill:var(--hoja)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".5"') + R(xh, y0, w, y1 - y0, 'fill="url(#vetaP)" class="dibujo" style="opacity:var(--v-hoja)"')
      + R(xh, y1, w, 2.5, 'fill="#000" opacity=".35"');
  }
  if (tipo === 'abatible') {
    // Marco y tapajuntas alrededor del hueco; la hoja gira sobre las bisagras
    s += R(x0 - 7, Y(alto + 7), hueco + 14, alto + 7, 'style="fill:var(--hoja)" class="pieza"') + R(x0 - 7, Y(alto + 7), hueco + 14, alto + 7, 'fill="#000" opacity=".08"');
    s += R(x0, Y(alto), hueco, alto, 'fill="#2a2a2e"') + R(x0, Y(alto), hueco, alto, 'fill="url(#fondoP)"');
    const xh = x0 + (hueco - hoja) / 2;
    if (A.fijo > 0) s += fijoArriba(xh, hoja, altoHoja, alto);
    const izq = abre === 'izq', xm = izq ? xh + hoja - 8 : xh + 4;
    s += `<g class="hoja-puerta abatible" style="transform-origin:${izq ? 'left' : 'right'} center">${dibujaHoja(xh, hoja, altoHoja)}`
      + R(xm, Y(105), 4, 2.2, 'rx="1" style="fill:var(--manilla)" class="pieza"') + R(izq ? xm - 10 : xm, Y(105), 14, 2.2, 'rx="1" style="fill:var(--manilla)" class="pieza"') + `<circle cx="${f(xm + 2)}" cy="${Y(104)}" r="2.8" style="fill:var(--manilla)" class="pieza"/>`
      // Escudo de la condena, debajo de la manilla, del mismo acabado
      + `<circle cx="${f(xm + 2)}" cy="${Y(92)}" r="2.2" style="fill:var(--manilla)" class="pieza"/>` + R(xm + 1.4, Y(92.6), 1.2, 2.4, 'fill="#000" opacity=".5"') + `</g>`;
    // Cuatro bisagras del color de los herrajes: a 20 cm de arriba, a 25 del suelo y dos repartidas entre medias
    const arriba = altoHoja - 20, abajo = 25 + 10;
    [0, 1, 2, 3].map((i) => arriba - ((arriba - abajo) * i) / 3).forEach((h) => (s += R(izq ? xh - 1.2 : xh + hoja - 1.2, Y(h), 2.4, 10, 'rx=".6" style="fill:var(--manilla)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".3"')));
  }
  if (tipo === 'granero') {
    // Carril por encima del hueco y hoja colgada por fuera, que se desliza junto a la pared
    const xh = x0 - 5;
    s += R(xh - 4, Y(alto + 14), hoja * 2 + 8, 3, 'style="fill:var(--manilla)" class="pieza"');
    s += `<g class="hoja-puerta granero" style="--mover:${f(hoja)}px">${dibujaHoja(xh, hoja, altoHoja)}`
      + `<circle cx="${f(xh + 12)}" cy="${Y(alto + 12)}" r="3" style="fill:var(--manilla)" class="pieza"/><circle cx="${f(xh + hoja - 12)}" cy="${Y(alto + 12)}" r="3" style="fill:var(--manilla)" class="pieza"/>`
      + tirador(tir, xh + hoja - 8, Y(105)) + `</g>`;
  }
  if (tipo === 'empotrada') {
    // La hoja entra en el tabique (dentro de un casoneto): solo se ve en el hueco
    const xh = x0 + (hueco - hoja) / 2;
    s += `<clipPath id="huecoP"><rect x="${f(x0)}" y="${Y(alto)}" width="${f(hueco)}" height="${alto}"/></clipPath>`;
    if (A.fijo > 0) s += fijoArriba(xh, hoja, altoHoja, alto);
    s += `<g clip-path="url(#huecoP)"><g class="hoja-puerta empotrada" style="--mover:${f(-hoja)}px">${dibujaHoja(xh, hoja, Math.min(altoHoja, alto))}`
      + tirador(tir === 'barra' ? 'redondo' : tir, xh + hoja - 8, Y(105)) + `</g></g>`;
    s += R(x0 - 1.5, Y(alto + 1.5), hueco + 3, alto + 1.5, 'fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.5"');
  }
  const ys = Math.min(20, TOP - alto - 22);   // con huecos altos, el encuadre sube para que entren el marco y el carril
  return { vista: `0 ${ys} ${W} ${TOP + 30 - ys}`, s, hoja, altoHoja, nivel: A.nivel, fijo: A.fijo };
}

export const DEFS_PUERTA = `<defs>
<pattern id="vetaP" width="10" height="70" patternUnits="userSpaceOnUse"><path d="M2 0c1 16-1 32 .4 48s-.8 16 0 22M6 0c-.8 12 1.4 28 0 40s1.2 24 .4 30" fill="none" stroke="#3b2414" stroke-opacity=".2" stroke-width=".35"/></pattern>
<pattern id="tablasP" width="18" height="30" patternUnits="userSpaceOnUse"><path d="M0 0v30" stroke="#2a1a0e" stroke-opacity=".25" stroke-width=".5"/></pattern>
<linearGradient id="fondoP" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".5" stop-color="#3a3a40" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
<linearGradient id="reflejoP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".2"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="brilloP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
</defs>`;
