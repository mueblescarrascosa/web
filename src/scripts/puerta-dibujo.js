// Dibujo de la puerta de paso para «Configura tu puerta», de frente y en cm (y hacia abajo: y = 250 − altura).
// Tipos: abatible (con marco y tapajuntas), corredera de granero (colgada de un carril por fuera) y corredera empotrada (casoneto).
// Colores en variables CSS: --hoja, --manilla, --pared, --zocalo, --suelo (y --v-hoja para la veta).
// Todas las medidas son orientativas: se confirman siempre en obra.
const f = (n) => +n.toFixed(1), TOP = 250, Y = (h) => TOP - h;
const R = (x, y, w, h, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${a}/>`;
const medio = (v) => Math.floor(v * 2) / 2;
export const HOJAS = [62.5, 72.5, 82.5, 92.5];

// ── Ancho ──
// Una hoja: la estándar más grande que cabe. Sin obra, el marco pide unos 8,5 cm más que la hoja; con algo de obra
// (ajustando el hueco y el premarco) cabe ya con 2,5 cm más: la de 82,5 en un hueco de 85 u 86.
export const HOLGURA = 8.5, HOLGURA_OBRA = 2.5, ANCHO_UNA = 120, FIJO_MIN = 25, HOJILLA_MIN = 30, GRANERO_MAX = 120;

// Cotas: líneas de medida con su etiqueta (se encienden al cambiar la medida: clase «cambia» desde la página)
const etC = (x, y, txt) => `<rect x="${f(x - txt.length * 3.1 - 4)}" y="${f(y - 8)}" width="${f(txt.length * 6.2 + 8)}" height="14" rx="3" fill="#fbf7ee" stroke="#3d2f25" stroke-width=".6"/><text x="${f(x)}" y="${f(y + 2.6)}" text-anchor="middle">${txt}</text>`;
const linC = (x1, y1, x2, y2) => `<path d="M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}"/>`;
const cotaH = (id, x1, x2, y, txt) => `<g class="cota" id="cota-${id}">${linC(x1, y, x2, y)}${linC(x1, y - 6, x1, y + 6)}${linC(x2, y - 6, x2, y + 6)}${etC((x1 + x2) / 2, y, txt)}</g>`;
const cotaV = (id, x, y1, y2, txt) => `<g class="cota" id="cota-${id}">${linC(x, y1, x, y2)}${linC(x - 6, y1, x + 6, y1)}${linC(x - 6, y2, x + 6, y2)}${etC(x, (y1 + y2) / 2, txt)}</g>`;
export function hojaPara(hueco, tipo) {
  if (tipo === 'granero') return medio(hueco + 10);                 // por fuera tapa el hueco y 5 cm a cada lado
  return HOJAS.filter((h) => h <= hueco - HOLGURA_OBRA).pop() || HOJAS[0];
}
export const conObra = (hueco, hoja, tipo) => tipo !== 'granero' && hueco - hoja < HOLGURA;

// Reparto del ancho en hojas, priorizando el paso (la hoja que se abre a diario, lo más ancha posible):
//   abatible de hasta 120: una hoja · de más: hoja + fijo lateral, o doble bandera (hoja grande + hojilla)
//   empotrada de más de 120: dos hojas iguales, una a cada lado (casoneto doble)
//   granero: la hoja tapa el hueco y 5 cm por lado; si pasaría de 120, dos hojas que se abren a cada lado.
// Devuelve { piezas: [{ w, clase: 'hoja'|'hojilla'|'fijo' }], principal, paso, aMedida, conObra, forma }.
export function repartoAncho(hueco, tipo, ancha = 'fijo') {
  if (tipo === 'granero') {
    const total = medio(hueco + 10);
    if (total <= GRANERO_MAX) return { forma: 'una', piezas: [{ w: total, clase: 'hoja' }], principal: total, paso: hueco, aMedida: true, conObra: false };
    const w = medio(total / 2);
    return { forma: 'doble', piezas: [{ w, clase: 'hoja' }, { w, clase: 'hoja' }], principal: w, paso: hueco, aMedida: true, conObra: false };
  }
  if (hueco <= ANCHO_UNA) {
    const h = hojaPara(hueco, tipo);
    return { forma: 'una', piezas: [{ w: h, clase: 'hoja' }], principal: h, paso: h, aMedida: false, conObra: conObra(hueco, h, tipo) };
  }
  const total = tipo === 'empotrada' ? hueco - HOLGURA : hueco;   // abatible: las hojas se reparten el hueco (185 = 92,5 + 92,5)
  if (tipo === 'empotrada') {
    const std = HOJAS.filter((h) => 2 * h <= hueco - 2 * HOLGURA_OBRA).pop();
    const w = std && 2 * std >= total - 8 ? std : medio(total / 2);
    return { forma: 'doble', piezas: [{ w, clase: 'hoja' }, { w, clase: 'hoja' }], principal: w, paso: 2 * w, aMedida: !HOJAS.includes(w), conObra: 2 * w > total };
  }
  if (ancha === 'doble') {
    // Doble bandera: la hoja grande, estándar, lo más ancha posible, y la hojilla con lo que sobra (al menos 30 y no más que la grande)
    const h = HOJAS.filter((x) => total - x >= HOJILLA_MIN && total - x <= x).pop();
    if (h) return { forma: 'doble', piezas: [{ w: h, clase: 'hoja' }, { w: medio(total - h), clase: 'hojilla' }], principal: h, paso: total, aMedida: true, conObra: false };
    const w = medio(total / 2);
    return { forma: 'doble', piezas: [{ w, clase: 'hoja' }, { w, clase: 'hojilla' }], principal: w, paso: total, aMedida: true, conObra: false };
  }
  // Hoja + fijo lateral: la hoja estándar más ancha que deja un fijo de al menos 25
  const h = HOJAS.filter((x) => total - x >= FIJO_MIN).pop() || HOJAS[0];
  return { forma: 'fijo', piezas: [{ w: h, clase: 'hoja' }, { w: medio(total - h), clase: 'fijo' }], principal: h, paso: h, aMedida: true, conObra: false };
}

// ── Alto ──
//   abatible: menos de 206, la de 203 no entra: hoja a medida, 3 cm más baja que el hueco · 206–213, la normal de 203 · 214–221, altura especial de 211 ·
//             más de 221, altura especial superior (a medida) o la de 211 con un fijo arriba.
//   empotrada: los casonetos conocidos llegan a huecos de 205–206 (hoja de 203; con menos, hoja a medida 2 cm más baja); por encima, dintel o fijo arriba.
//   granero: la hoja tapa el hueco y 5 cm más; más de 203 es altura especial y más de 240 no se hace.
export const ALTO_NORMAL = 203, ALTO_ESPECIAL = 211, ALTO_GRANERO_MAX = 240, ALTO_CASONETO = 206;
export function altoPara(alto, tipo, alta = 'medida') {
  if (tipo === 'granero') {
    const h = alto + 5;
    if (h > ALTO_GRANERO_MAX) return { altoHoja: ALTO_GRANERO_MAX, nivel: 'granero-max', fijo: 0 };
    return { altoHoja: h, nivel: h > ALTO_NORMAL ? 'granero-especial' : 'granero', fijo: 0 };
  }
  if (tipo === 'empotrada') {
    if (alto < 205) return { altoHoja: alto - 2, nivel: 'bajo', fijo: 0 };
    if (alto <= ALTO_CASONETO) return { altoHoja: ALTO_NORMAL, nivel: 'normal', fijo: 0 };
    return { altoHoja: ALTO_NORMAL, nivel: 'sin-casoneto', fijo: alto - ALTO_CASONETO };
  }
  if (alto < 206) return { altoHoja: alto - 3, nivel: 'bajo', fijo: 0 };
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
// Zócalo de la pared: rodapié de 8 cm o zócalo alto (arrimadero) de 1 m, del color elegido.
export const ZOCALOS = [{ clave: 'rodapie', nombre: 'Rodapié' }, { clave: 'alto', nombre: 'Zócalo alto (1 m)' }, { clave: 'no', nombre: 'Sin zócalo' }];

export function puerta({ hueco = 82, alto = 210, tipo = 'abatible', modelo = 'lisa', abre = 'der', tirador: tir = 'redondo', alta = 'medida', ancha = 'fijo', zocalo = 'rodapie' }) {
  const W = Math.max(300, tipo === 'granero' ? 3 * hueco + 60 : hueco + 90), x0 = (W - hueco) / 2;
  const reparto = repartoAncho(hueco, tipo, ancha), A = altoPara(alto, tipo, alta), altoHoja = A.altoHoja;
  const hoja = reparto.principal;
  let s = '';
  // Pared, zócalo y suelo
  s += R(-300, -60, W + 600, TOP + 60, 'style="fill:var(--pared)" class="pieza"');
  if (zocalo === 'alto') s += R(-300, Y(100), W + 600, 100, 'style="fill:var(--zocalo)" class="pieza"') + R(-300, Y(100), W + 600, 100, 'fill="url(#panelP)"') + R(-300, Y(100) - 2, W + 600, 3, 'style="fill:var(--zocalo)" class="pieza"') + R(-300, Y(100) - 2, W + 600, 3, 'fill="#000" opacity=".12"');
  if (zocalo !== 'no') s += R(-300, TOP - 8, W + 600, 8, 'style="fill:var(--zocalo)" class="pieza"') + R(-300, TOP - 8, W + 600, 0.8, 'fill="#000" opacity=".15"');
  s += R(-300, TOP, W + 600, 60, 'style="fill:var(--suelo)" class="pieza"') + R(-300, TOP, W + 600, 60, 'fill="url(#tablasP)"');
  // Hueco (el pasillo de detrás, en penumbra)
  const hueco_ = () => R(x0, Y(alto), hueco, alto, 'fill="#2a2a2e"') + R(x0, Y(alto), hueco, alto, 'fill="url(#fondoP)"');
  s += hueco_();
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
  // Fijo encima de la hoja (montante o dintel): panel del color de la puerta y un travesaño que lo separa
  const fijoArriba = (x, w, hHoja, altoHueco) => {
    const y0 = Y(altoHueco - 1), y1 = Y(hHoja + 2.5);
    return R(x, y0, w, y1 - y0, 'style="fill:var(--hoja)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".5"') + R(x, y0, w, y1 - y0, 'fill="url(#vetaP)" class="dibujo" style="opacity:var(--v-hoja)"')
      + R(x, y1, w, 2.5, 'fill="#000" opacity=".35"');
  };
  const izq = abre === 'izq';
  const manilla = (xm) => R(xm, Y(105), 4, 2.2, 'rx="1" style="fill:var(--manilla)" class="pieza"') + R(izq ? xm - 10 : xm, Y(105), 14, 2.2, 'rx="1" style="fill:var(--manilla)" class="pieza"') + `<circle cx="${f(xm + 2)}" cy="${Y(104)}" r="2.8" style="fill:var(--manilla)" class="pieza"/>`
    + `<circle cx="${f(xm + 2)}" cy="${Y(92)}" r="2.2" style="fill:var(--manilla)" class="pieza"/>` + R(xm + 1.4, Y(92.6), 1.2, 2.4, 'fill="#000" opacity=".5"');
  // Cuatro bisagras del color de los herrajes: a 20 cm de arriba, a 35 del suelo y dos repartidas entre medias
  const bisagras = (xb) => { const arriba = altoHoja - 20, abajo = 35; return [0, 1, 2, 3].map((i) => R(xb - 1.2, Y(arriba - ((arriba - abajo) * i) / 3), 2.4, 10, 'rx=".6" style="fill:var(--manilla)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".3"')).join(''); };

  if (tipo === 'abatible') {
    // Marco y tapajuntas alrededor del hueco
    s += R(x0 - 7, Y(alto + 7), hueco + 14, alto + 7, 'style="fill:var(--hoja)" class="pieza"') + R(x0 - 7, Y(alto + 7), hueco + 14, alto + 7, 'fill="#000" opacity=".08"') + hueco_();
    const [p, q] = reparto.piezas;
    if (!q) {
      const xh = x0 + (hueco - p.w) / 2;
      if (A.fijo > 0) s += fijoArriba(xh, p.w, altoHoja, alto);
      s += `<g class="hoja-puerta abatible" style="transform-origin:${izq ? 'left' : 'right'} center">${dibujaHoja(xh, p.w, altoHoja)}${manilla(izq ? xh + p.w - 8 : xh + 4)}</g>` + bisagras(izq ? xh : xh + p.w);
    } else {
      // Hoja principal del lado de las bisagras elegido; el fijo o la hojilla, al otro lado. Un montante de 2 cm entre hoja y fijo.
      const xi = x0 + HOLGURA / 2, xf = x0 + hueco - HOLGURA / 2;
      const xp = izq ? xi : xf - p.w, xq = izq ? xi + p.w : xi;
      if (A.fijo > 0) s += fijoArriba(xi, xf - xi, altoHoja, alto);
      if (q.clase === 'fijo') s += dibujaHoja(xq, q.w, altoHoja) + R(izq ? xq : xq + q.w - 1.5, Y(altoHoja), 1.5, altoHoja, 'fill="#000" opacity=".3"');
      else s += `<g class="hoja-puerta abatible" style="transform-origin:${izq ? 'right' : 'left'} center">${dibujaHoja(xq, q.w, altoHoja)}${R(izq ? xq + 3 : xq + q.w - 5, Y(altoHoja - 4), 2, 10, 'rx="1" style="fill:var(--manilla)" class="pieza"')}</g>` + bisagras(izq ? xq + q.w : xq);
      s += `<g class="hoja-puerta abatible" style="transform-origin:${izq ? 'left' : 'right'} center">${dibujaHoja(xp, p.w, altoHoja)}${manilla(izq ? xp + p.w - 8 : xp + 4)}</g>` + bisagras(izq ? xp : xp + p.w);
    }
  }
  if (tipo === 'granero') {
    // Carril por encima de la hoja y hoja(s) colgada(s) por fuera, que se deslizan junto a la pared
    const yc = Y(altoHoja + 9), [p, q] = reparto.piezas;
    if (A.nivel === 'granero-max' && alto + 2 > altoHoja) s += R(x0 - 6, Y(alto + 2), hueco + 12, alto + 2 - altoHoja, 'style="fill:var(--hoja)" class="pieza"') + R(x0 - 6, Y(alto + 2), hueco + 12, alto + 2 - altoHoja, 'fill="#000" opacity=".2"');
    const colgada = (x, w, mover, xt) => `<g class="hoja-puerta granero" style="--mover:${f(mover)}px">${dibujaHoja(x, w, altoHoja)}`
      + `<circle cx="${f(x + 12)}" cy="${f(yc + 3)}" r="3" style="fill:var(--manilla)" class="pieza"/><circle cx="${f(x + w - 12)}" cy="${f(yc + 3)}" r="3" style="fill:var(--manilla)" class="pieza"/>` + tirador(tir, xt, Y(105)) + `</g>`;
    if (!q) {
      const xh = x0 - 5;
      s += R(xh - 4, yc - 3, p.w * 2 + 8, 3, 'style="fill:var(--manilla)" class="pieza"') + colgada(xh, p.w, p.w, xh + p.w - 8);
    } else {
      const xa = x0 - 5, xb = xa + p.w;
      s += R(xa - p.w - 4, yc - 3, 4 * p.w + 8, 3, 'style="fill:var(--manilla)" class="pieza"') + colgada(xa, p.w, -p.w, xa + p.w - 8) + colgada(xb, q.w, q.w, xb + 8);
    }
  }
  if (tipo === 'empotrada') {
    // La hoja (o las dos, una a cada lado) entra en el tabique dentro de un casoneto: solo se ve en el hueco
    const altoVisto = Math.min(altoHoja, alto), [p, q] = reparto.piezas;
    if (A.fijo > 0) s += fijoArriba(x0, hueco, altoHoja, alto);
    s += `<clipPath id="huecoP"><rect x="${f(x0)}" y="${Y(alto)}" width="${f(hueco)}" height="${alto}"/></clipPath><g clip-path="url(#huecoP)">`;
    const t = tir === 'barra' ? 'redondo' : tir;
    if (!q) { const xh = x0 + (hueco - p.w) / 2; s += `<g class="hoja-puerta empotrada" style="--mover:${f(-p.w)}px">${dibujaHoja(xh, p.w, altoVisto)}${tirador(t, xh + p.w - 8, Y(105))}</g>`; }
    else {
      const xm = x0 + hueco / 2;
      s += `<g class="hoja-puerta empotrada" style="--mover:${f(-p.w)}px">${dibujaHoja(xm - p.w, p.w, altoVisto)}${tirador(t, xm - 8, Y(105))}</g>`
        + `<g class="hoja-puerta empotrada" style="--mover:${f(q.w)}px">${dibujaHoja(xm, q.w, altoVisto)}${tirador(t, xm + 8, Y(105))}</g>`;
    }
    s += `</g>` + R(x0 - 1.5, Y(alto + 1.5), hueco + 3, alto + 1.5, 'fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1.5"');
  }
  s += cotaH('hueco', x0, x0 + hueco, TOP + 18, hueco + ' cm') + cotaV('alto', x0 + hueco + 16, Y(alto), TOP, alto + ' cm');
  const ys = Math.min(20, TOP - alto - 24);   // con huecos altos, el encuadre sube para que entren el marco y el carril
  return { vista: `0 ${ys} ${W} ${TOP + 30 - ys}`, s, hoja, altoHoja, nivel: A.nivel, fijo: A.fijo, reparto };
}

export const DEFS_PUERTA = `<defs>
<pattern id="vetaP" width="10" height="70" patternUnits="userSpaceOnUse"><path d="M2 0c1 16-1 32 .4 48s-.8 16 0 22M6 0c-.8 12 1.4 28 0 40s1.2 24 .4 30" fill="none" stroke="#3b2414" stroke-opacity=".2" stroke-width=".35"/></pattern>
<pattern id="tablasP" width="18" height="30" patternUnits="userSpaceOnUse"><path d="M0 0v30" stroke="#2a1a0e" stroke-opacity=".25" stroke-width=".5"/></pattern>
<pattern id="panelP" y="150" width="40" height="100" patternUnits="userSpaceOnUse"><rect x="4" y="10" width="32" height="82" fill="none" stroke="#000" stroke-opacity=".14" stroke-width=".6"/></pattern>
<linearGradient id="fondoP" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".5" stop-color="#3a3a40" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
<linearGradient id="reflejoP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".2"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="brilloP" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
</defs>`;
