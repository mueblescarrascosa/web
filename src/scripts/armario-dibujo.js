// Dibujo del armario y del vestidor para el juego «Diseña tu armario». Todo en cm.
// El interior de cada hueco se describe una vez (piezas en coordenadas del hueco: a a lo ancho, b de altura desde el suelo, d de fondo)
// y se pinta de dos formas: de frente (armario con puertas) o en perspectiva (vestidor lineal, en L, en C o con isla).
// Medidas del taller: altillo de 45, zócalo de 8, barra larga a 170–180, dos barras a ~100 y ~195, baldas cada 35,
// cajonera hasta 90 (por debajo de 100 para ver dentro), zapatero de 18 en 18, fondo 60.

export const TIPOS = {
  largo: 'Colgar largo', doble: 'Dos barras', baldas: 'Baldas', cajones: 'Cajones y barra', zapatero: 'Zapatero y baldas',
  pantalonero: 'Pantalonero de colgar', pantExtra: 'Pantalonero extraíble', pantDoble: 'Pantalonero extraíble doble', accesorios: 'Bandejas y baldas',
};
export const MODELOS = { lisa: 'Lisa', japonesa3: 'Japonesa 3 paneles', japonesa: 'Japonesa 4 paneles', rayas: 'Cuatro paneles', moldura: 'Con moldura', cristal: 'Cristal', cruz: 'Aspa (madera y cristal)' };
export const CRISTALES = { claro: { nombre: 'Transparente', hex: '#cfe0e6', op: 0.2 }, mate: { nombre: 'Mate', hex: '#f3f3f1', op: 0.82 }, ahumado: { nombre: 'Ahumado', hex: '#2c3035', op: 0.6 } };
const ROPA = ['#3b4a5e', '#a9b4c2', '#e7e2d6', '#7a5c48', '#c6a77d', '#2f2f33', '#8e9c86', '#b46a55', '#d9d4ca', '#556b7a', '#efe9dc', '#6b5a7a'];
const PANT = ['#2f3b52', '#4a5a72', '#c9b79a', '#3a3a3a', '#6b6f73', '#8a7356', '#1f2a3a', '#7d8a9a'];
const ZAP = ['#2b2b2b', '#7a5c48', '#e7e2d6', '#a33b2f', '#3b4a5e'];
const f = (n) => +n.toFixed(1);
export const modulosPara = (ancho) => Math.max(1, Math.ceil(ancho / 100));
// Correderas: hojas de hasta unos 110 cm, y cada hoja como mucho 3,5 veces más alta que ancha (si no, cabecea al deslizar).
export const ESBELTEZ_MAX = 3.5;
export function correderas(ancho, alto) {
  const k = Math.max(2, Math.ceil(ancho / 110)), hoja = ancho / k, H = alto - 8, esbeltez = H / hoja;
  return { k, hoja: Math.round(hoja), H, esbeltez: Math.round(esbeltez * 10) / 10, ok: esbeltez <= ESBELTEZ_MAX, anchoMinimo: Math.ceil((2 * H) / ESBELTEZ_MAX / 5) * 5 };
}

// ── Interior de un hueco: lista de piezas y lo que cabe ──
export function interior(tipo, a0, a1, techoUtil, altillo, alto, sem) {
  const p = [], n = { perchas: 0, zapatos: 0, montones: 0, cajones: 0, pantalones: 0 }, c = { largo: 0, corto: 0, doblado: 0, zapatos: 0 };
  const balda = (b) => p.push({ k: 'balda', a0, a1, b });
  const barra = (b, largo) => {
    p.push({ k: 'barra', a0, a1, b });
    for (let a = a0 + 3, i = 0; a + 5 < a1 - 2; a += 5.2, i++) { p.push({ k: 'prenda', a, b, w: 4.4 + ((sem + i) % 3) * 0.5, l: largo - ((sem + i * 13) % 4) * 7, c: ROPA[(sem + i * 5) % ROPA.length] }); n.perchas++; }
  };
  const montones = (b, libre) => {
    const capas = Math.max(1, Math.min(4, Math.floor((libre - 6) / 6)));
    for (let a = a0 + 3, i = 0; a + 26 < a1 - 2; a += 30, i++) { for (let k = 0; k < capas; k++) p.push({ k: 'monton', a, b: b + 1 + k * 6, w: 26, h: 5.6, c: ROPA[(sem + i * 3 + k * 7) % ROPA.length] }); n.montones++; }
  };
  const zapatos = (b) => { for (let a = a0 + 2, i = 0; a + 18 < a1 - 1; a += 20, i++) { const col = ZAP[(sem + i) % ZAP.length]; p.push({ k: 'zapato', a, b, c: col }, { k: 'zapato', a: a + 9.4, b, c: col }); n.zapatos++; } };
  const cajonera = (pisos) => pisos.forEach(([b0, b1]) => { p.push({ k: 'cajon', a0: a0 + 0.5, a1: a1 - 0.5, b0, b1 }); n.cajones++; });
  if (tipo === 'largo') { barra(Math.min(178, techoUtil - 8), 118); c.largo++; balda(30); montones(31, 28); zapatos(10); c.zapatos++; c.doblado++; }
  if (tipo === 'doble') { const b1 = techoUtil - 8, b2 = Math.round(b1 / 2 + 4); barra(b1, 82); barra(b2, 78); c.corto += 2; }
  if (tipo === 'baldas') { for (let b = 45; b < techoUtil - 20; b += 35) balda(b); for (let b = 10; b < techoUtil - 20; b += 35) montones(b + (b === 10 ? 0 : 1), 33); c.doblado++; }
  if (tipo === 'cajones') { cajonera([[10, 30], [30, 50], [50, 70], [70, 90]]); balda(92); barra(techoUtil - 8, 80); c.corto++; c.doblado++; }
  if (tipo === 'zapatero') { [10, 28, 46, 64].forEach((b) => { if (b > 10) balda(b); zapatos(b); }); balda(82); for (let b = 82; b + 35 < techoUtil - 5; b += 35) { montones(b + 1, 33); if (b + 35 < techoUtil - 20) balda(b + 35); } c.zapatos++; c.doblado++; }
  if (tipo === 'pantalonero') {
    // Pantalonero de colgar: barra a unos 92 cm con los pantalones doblados por la mitad (~70 cm de caída) y camisas arriba
    const bp = 92;
    p.push({ k: 'barra', a0, a1, b: bp });
    for (let a = a0 + 3, j = 0; a + 5 < a1 - 2; a += 5.6, j++) { p.push({ k: 'pantalon', a, b: bp, w: 4.8, l: 70 - ((sem + j * 7) % 3) * 3, c: PANT[(sem + j * 3) % PANT.length] }); n.pantalones++; }
    barra(techoUtil - 8, Math.min(80, techoUtil - 8 - bp - 12)); zapatos(10); c.corto++; c.zapatos++;
  }
  if (tipo === 'pantExtra' || tipo === 'pantDoble') {
    // Bastidor extraíble con los pantalones colgados de frente, uno detrás de otro; arriba, barra para camisas
    const cols = tipo === 'pantDoble' ? 2 : 1, ancho = a1 - a0, bw = Math.min(42, (ancho - 6 - (cols - 1) * 4) / cols), top = 98, l = 66;
    const x0 = a0 + (ancho - (cols * bw + (cols - 1) * 4)) / 2;
    for (let k = 0; k < cols; k++) {
      const bx = x0 + k * (bw + 4);
      p.push({ k: 'bastidor', a0: bx, a1: bx + bw, b0: top - l - 6, b1: top + 2 });
      for (let j = 3; j >= 0; j--) p.push({ k: 'pantFrente', a: bx + 3 + j * 1.6, b: top - j * 1.2, w: bw - 6, l: l - j * 1.5, c: PANT[(sem + k * 4 + j * 3) % PANT.length], atras: j });
      n.pantalones += 8;
    }
    barra(techoUtil - 8, Math.min(80, techoUtil - 8 - top - 10)); zapatos(10); c.corto++; c.zapatos++;
  }
  if (tipo === 'accesorios') {
    // Bandejas bajas con relojes, cinturones y gafas; baldas altas para bolsos
    [[10, 22], [22, 34], [34, 46]].forEach(([b0, b1]) => { p.push({ k: 'bandeja', a0: a0 + 0.5, a1: a1 - 0.5, b0, b1 }); n.cajones++; });
    p.push({ k: 'bandejaAbierta', a0: a0 + 2, a1: a1 - 2, b: 58 });
    for (let a = a0 + 6, i = 0; a + 8 < a1 - 4; a += 12, i++) p.push({ k: 'mini', a, b: 59, w: 7, h: 3, c: ['#c9a27a', '#2f2f33', '#b46a55', '#8e9c86'][(sem + i) % 4] });
    balda(70);
    [105, 140].forEach((b) => { if (b < techoUtil - 10) { balda(b); for (let a = a0 + 4, i = 0; a + 22 < a1 - 3; a += 26, i++) p.push({ k: 'bolso', a, b: b + 1, w: 20, h: 18, c: ['#7a5c48', '#2f2f33', '#c6a77d', '#a33b2f', '#e7e2d6'][(sem + i + b) % 5] }); } });
    montones(71, 33); c.doblado++;
  }
  if (altillo) {
    const ha = Math.min(26, alto - altillo - 4);
    p.push({ k: 'caja', a: a0 + 3, b: altillo + 1, w: Math.min(38, a1 - a0 - 6), h: ha, c: ['#5a6b7d', '#7a5c48', '#2f2f33'][sem % 3] });
    if (a1 - a0 > 60) p.push({ k: 'caja', a: a0 + 45, b: altillo + 1, w: Math.min(30, a1 - a0 - 50), h: Math.min(18, ha), c: '#c6a77d' });
  }
  return { p, n, c };
}

// Silueta de un pantalón de frente: cintura arriba y dos perneras que se separan a un tercio
function pantalonFrente({ a, b, w, l }) {
  const m = a + w / 2, cr = b - l * 0.34;
  return [[a, b], [a + w, b], [a + w - 0.6, b - l], [m + 1.2, b - l], [m, cr], [m - 1.2, b - l], [a + 0.6, b - l]];
}

// ── Pintado de frente (armario con puertas) ──
function deFrente(piezas, alto) {
  const Y = (b) => alto - b, R = (x, y, w, h, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${a}/>`;
  // Luz LED (opción): bajo cada barra, una tira cálida que ilumina la ropa
  const luz = piezas.filter((q) => q.k === 'barra').map((q) => R(q.a0 + 1, Y(q.b) + 0.6, q.a1 - q.a0 - 2, 34, 'fill="url(#ledCono)" class="led-barra"') + `<line x1="${f(q.a0 + 1)}" y1="${f(Y(q.b))}" x2="${f(q.a1 - 1)}" y2="${f(Y(q.b))}" stroke="#ffe7b8" stroke-width="1.4" stroke-linecap="round" class="led-barra"/>`).join('');
  return piezas.map((q) => {
    if (q.k === 'balda') return R(q.a0, Y(q.b) - 1, q.a1 - q.a0, 2, 'style="fill:var(--int)" class="pieza"') + R(q.a0, Y(q.b) + 1, q.a1 - q.a0, 0.6, 'fill="#000" opacity=".22"');
    if (q.k === 'barra') return `<line x1="${f(q.a0 + 1)}" y1="${f(Y(q.b))}" x2="${f(q.a1 - 1)}" y2="${f(Y(q.b))}" stroke="#9aa0a6" stroke-width="1.2" stroke-linecap="round"/>`;
    if (q.k === 'varilla') return `<line x1="${f(q.a0)}" y1="${f(Y(q.b))}" x2="${f(q.a1)}" y2="${f(Y(q.b))}" stroke="#b5b9bd" stroke-width=".6"/>`;
    if (q.k === 'marco') return R(q.a0, Y(q.b1), 1.2, q.b1 - q.b0, 'fill="#9aa0a6"') + R(q.a1 - 1.2, Y(q.b1), 1.2, q.b1 - q.b0, 'fill="#9aa0a6"');
    if (q.k === 'prenda') { const y0 = Y(q.b);
      return `<path d="M${f(q.a + q.w / 2)} ${f(y0 - 0.8)}q.9 0 .9.9-.9.9-.9 1.6" stroke="#8a8f94" stroke-width=".35" fill="none"/>`
        + `<path d="M${f(q.a + 0.4)} ${f(y0 + 3.4)}q${f(q.w / 2 - 0.4)} -1.8 ${f(q.w - 0.8)} 0l.4 ${f(q.l - 3)}q0 1-1 1h${f(-(q.w - 1.2))}q-1 0-1-1z" fill="${q.c}"/>`
        + `<path d="M${f(q.a + 0.9)} ${f(y0 + 3.6)}v${f(q.l - 4)}" stroke="#fff" stroke-opacity=".14" stroke-width=".7"/>`; }
    if (q.k === 'pantalon') { const y0 = Y(q.b);
      return `<path d="M${f(q.a + q.w / 2)} ${f(y0 - 0.8)}q.9 0 .9.9-.9.9-.9 1.6" stroke="#8a8f94" stroke-width=".35" fill="none"/>`
        + R(q.a, y0 + 1.4, q.w, q.l, `rx=".9" fill="${q.c}"`) + R(q.a, y0 + 1.4, q.w, 3.2, 'fill="#000" opacity=".22"')
        + `<path d="M${f(q.a + q.w / 2)} ${f(y0 + 1.4 + q.l * 0.42)}V${f(y0 + 1.4 + q.l)}" stroke="#000" stroke-opacity=".28" stroke-width=".45"/>`
        + `<path d="M${f(q.a + 0.8)} ${f(y0 + 4.6)}v${f(q.l - 6)}" stroke="#fff" stroke-opacity=".12" stroke-width=".6"/>`; }
    if (q.k === 'monton') return R(q.a, Y(q.b) - q.h, q.w, q.h, `rx="1.2" fill="${q.c}"`);
    if (q.k === 'zapato') return `<path d="M${f(q.a)} ${f(Y(q.b) - 1)}h8.5v-3.2c0-1.4-2-2-3.6-2.6s-2.4-1.6-4-1.6c-.6 0-.9.5-.9 1.2z" fill="${q.c}"/>`;
    if (q.k === 'cajon' || q.k === 'bandeja') return R(q.a0, Y(q.b1) + 0.4, q.a1 - q.a0, q.b1 - q.b0 - 0.8, 'style="fill:var(--int)" class="pieza" stroke="#000" stroke-opacity=".2" stroke-width=".3"') + R((q.a0 + q.a1) / 2 - 7, Y(q.b1) + 3, 14, 1.2, 'rx=".6" fill="#000" opacity=".35"');
    if (q.k === 'bandejaAbierta') return R(q.a0, Y(q.b), q.a1 - q.a0, 2, 'fill="#3a2f2a"') + R(q.a0, Y(q.b) - 0.5, q.a1 - q.a0, 0.6, 'fill="#000" opacity=".3"');
    if (q.k === 'mini') return R(q.a, Y(q.b) - q.h, q.w, q.h, `rx="1" fill="${q.c}"`);
    if (q.k === 'bolso') return `<path d="M${f(q.a)} ${f(Y(q.b))}l2-${f(q.h - 6)}h${f(q.w - 4)}l2 ${f(q.h - 6)}z" fill="${q.c}"/><path d="M${f(q.a + 5)} ${f(Y(q.b) - q.h + 6)}q${f(q.w / 2 - 5)} -9 ${f(q.w - 10)} 0" fill="none" stroke="${q.c}" stroke-width="1.2"/>`;
    if (q.k === 'caja') return R(q.a, Y(q.b) - q.h, q.w, q.h, `rx="1.5" fill="${q.c}"`);
    if (q.k === 'bastidor') return R(q.a0, Y(q.b1), 1.2, q.b1 - q.b0, 'fill="#b5b9bd"') + R(q.a1 - 1.2, Y(q.b1), 1.2, q.b1 - q.b0, 'fill="#b5b9bd"') + R(q.a0, Y(q.b1), q.a1 - q.a0, 1.4, 'fill="#9aa0a6"') + R(q.a0, Y(q.b0) - 1.4, q.a1 - q.a0, 1.4, 'fill="#9aa0a6"');
    if (q.k === 'pantFrente') return `<path d="${pantalonFrente(q).map(([a, b], i) => (i ? 'L' : 'M') + f(a) + ' ' + f(Y(b))).join('')}Z" fill="${q.c}"${q.atras ? ` opacity="${1 - q.atras * 0.12}"` : ''}/>` + (q.atras ? '' : `<path d="M${f(q.a + q.w / 2)} ${f(Y(q.b - q.l * 0.34))}V${f(Y(q.b - q.l))}M${f(q.a + q.w * 0.25)} ${f(Y(q.b - 5))}V${f(Y(q.b - q.l))}M${f(q.a + q.w * 0.75)} ${f(Y(q.b - 5))}V${f(Y(q.b - q.l))}" stroke="#000" stroke-opacity=".22" stroke-width=".4" fill="none"/>` + R(q.a, Y(q.b), q.w, 4, 'fill="#000" opacity=".2"'));
    return '';
  }).join('') + luz;
}

// ── Cuerpo de un mueble de frente: carcasa, interior de cada hueco, separaciones y luz (sin puertas ni habitación) ──
function cuerpo(ancho, alto, mods, clave, semBase = 3, nombre = 'Hueco') {
  const n = modulosPara(ancho), w = ancho / n, Y = (h) => alto - h;
  const altillo = alto >= 220 ? alto - 45 : null, techoUtil = altillo ?? alto - 2;
  const tot = { perchas: 0, zapatos: 0, montones: 0, cajones: 0, pantalones: 0 }, cuenta = { largo: 0, corto: 0, doblado: 0, zapatos: 0 };
  const R = (x, y, an, al, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(an)}" height="${f(al)}" ${a}/>`;
  let s = '';
  s += R(0, 0, ancho, alto, 'style="fill:var(--ext)" class="pieza"');
  s += R(2, 2, ancho - 4, alto - 10, 'style="fill:var(--int)" class="pieza"') + R(2, 2, ancho - 4, alto - 10, 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-int)"');
  s += R(2, 2, ancho - 4, alto - 10, 'fill="url(#telaA)" class="dibujo" style="opacity:var(--t-int)"');
  s += R(2, 2, ancho - 4, alto - 10, 'fill="url(#fondoSombra)"') + R(2, 2, ancho - 4, alto - 10, 'fill="#14100c" class="penumbra"');
  s += R(0, alto - 8, ancho, 8, 'style="fill:var(--ext)" class="pieza"') + R(0, alto - 8, ancho, 8, 'fill="#000" opacity=".35"');
  if (altillo) s += R(2, Y(altillo) - 1, ancho - 4, 2, 'style="fill:var(--int)" class="pieza"') + R(2, Y(altillo) + 1, ancho - 4, 0.6, 'fill="#000" opacity=".25"');
  for (let i = 0; i < n; i++) {
    const x0 = i * w + (i ? 1 : 2), x1 = (i + 1) * w - (i < n - 1 ? 1 : 2), tipo = mods[i] || 'largo';
    const it = interior(tipo, x0, x1, techoUtil, altillo, alto, i * 7 + semBase);
    Object.keys(tot).forEach((k) => (tot[k] += it.n[k])); Object.keys(it.c).forEach((k) => (cuenta[k] += it.c[k]));
    const tiras = R(x0, 4, 0.9, alto - 14, 'fill="#ffe7b8" class="led-barra"') + R(x1 - 0.9, 4, 0.9, alto - 14, 'fill="#ffe7b8" class="led-barra"') + R(x0, 4, 8, alto - 14, 'fill="url(#ledLado)" class="led-barra"') + `<rect x="${f(x1 - 8)}" y="4" width="8" height="${f(alto - 14)}" fill="url(#ledLado)" transform="rotate(180 ${f(x1 - 4)} ${f(4 + (alto - 14) / 2)})" class="led-barra"/>`;
    s += `<g class="modulo" data-k="${clave}-${i}" role="button" tabindex="0" aria-label="${nombre} ${i + 1}: ${TIPOS[tipo]}. Pulsa para cambiarlo">${R(x0, 2, x1 - x0, alto - 10, 'fill="transparent"')}${deFrente(it.p, alto)}${tiras}${R(x0, 2, x1 - x0, alto - 10, 'class="marca" fill="none"')}</g>`;
    if (i < n - 1) s += R((i + 1) * w - 1, 2, 2, alto - 10, 'style="fill:var(--int)" class="pieza"') + R((i + 1) * w + 1, 2, 0.5, alto - 10, 'fill="#000" opacity=".2"');
  }
  s += R(2, 2, ancho - 4, 6, 'fill="url(#luzArriba)" class="led"');
  return { s, tot, cuenta, n, altillo };
}
const sumar = (a, b) => Object.keys(b).forEach((k) => (a[k] = (a[k] || 0) + b[k]));

// ── Armario con puertas, de frente ──
export function armario({ ancho = 240, alto = 250, puertas = 'correderas', mods = [], modelo = 'lisa' }) {
  const n = modulosPara(ancho), w = ancho / n;
  const R = (x, y, an, al, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(an)}" height="${f(al)}" ${a}/>`;
  let s = '';
  s += R(-60, -40, ancho + 120, alto + 40, 'fill="#e9e6df"') + R(-60, alto, ancho + 120, 40, 'fill="#c8ad87"');
  for (let x = -60; x < ancho + 60; x += 14) s += `<line x1="${x}" y1="${alto}" x2="${x - 6}" y2="${alto + 40}" stroke="#7a5c40" stroke-opacity=".25" stroke-width=".3"/>`;
  s += R(-60, alto, ancho + 120, 3, 'fill="#000" opacity=".12"');
  const c = cuerpo(ancho, alto, mods, 'f');
  s += c.s;

  // Puertas con su modelo
  const H = alto - 8, cristal = modelo === 'cristal';
  const hoja = (x, wh, extra = '') => {
    let t = '';
    if (cristal) {
      const m = 4; // marco
      t += R(x, 0, wh, H, 'style="fill:var(--ext)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".4"');
      t += R(x + m, m, wh - 2 * m, H - 2 * m, 'fill="#e9e6df"');
      t += `<rect x="${f(x + m)}" y="${m}" width="${f(wh - 2 * m)}" height="${f(H - 2 * m)}" class="cristal" style="fill:var(--cristal);opacity:var(--cristal-op)"/>`;
      t += R(x + m, m, wh - 2 * m, H - 2 * m, 'fill="url(#reflejo)"');
      if (modelo === 'cruz') t += R(x + wh / 2 - 1.3, m, 2.6, H - 2 * m, 'style="fill:var(--ext)" class="pieza"') + R(x + m, H / 2 - 1.3, wh - 2 * m, 2.6, 'style="fill:var(--ext)" class="pieza"');
    } else {
      t += R(x, 0, wh, H, 'style="fill:var(--ext)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".4"') + R(x, 0, wh, H, 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-ext)"');
      if (modelo === 'japonesa' || modelo === 'japonesa3') {
        // 4 paneles con la franja en el segundo, o 3 paneles: dos grandes y uno estrecho en el centro con la franja
        const bandas = (modelo === 'japonesa' ? [0, 0.26, 0.5, 0.74, 1] : [0, 0.42, 0.58, 1]).map((v) => v * H), fr = 1;
        t += R(x, bandas[fr], wh, bandas[fr + 1] - bandas[fr], 'style="fill:var(--franja)" class="pieza"') + R(x, bandas[fr], wh, bandas[fr + 1] - bandas[fr], 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-franja)"');
        bandas.slice(1, -1).forEach((y) => (t += R(x, y - 0.7, wh, 1.4, 'style="fill:var(--perfil)" class="pieza"'))); }
      if (modelo === 'rayas') [0.25, 0.5, 0.75].forEach((v) => (t += R(x, v * H - 0.5, wh, 1, 'fill="#000" opacity=".3"')));
      if (modelo === 'moldura') t += R(x + 7, 7, wh - 14, H - 14, 'fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".6"') + R(x + 8, 8, wh - 15, H - 15, 'fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".5"');
      if (modelo === 'cruz') {
        // Madera arriba y abajo, cristal en medio; dentro del cristal un aspa de madera con un círculo en el centro
        const m = 6, y1 = H * 0.3, y2 = H * 0.7, cx = x + wh / 2, cy = (y1 + y2) / 2, ancho_ = wh - 2 * m, alto_ = y2 - y1;
        t += R(x + m, y1, ancho_, alto_, 'fill="#e9e6df"');
        t += `<rect x="${f(x + m)}" y="${f(y1)}" width="${f(ancho_)}" height="${f(alto_)}" class="cristal" style="fill:var(--cristal);opacity:var(--cristal-op)"/>`;
        t += R(x + m, y1, ancho_, alto_, 'fill="url(#reflejo)"') + R(x + m, y1, ancho_, alto_, 'fill="none" stroke="#000" stroke-opacity=".3" stroke-width=".5"');
        t += `<path d="M${f(x + m)} ${f(y1)}L${f(x + wh - m)} ${f(y2)}M${f(x + wh - m)} ${f(y1)}L${f(x + m)} ${f(y2)}" style="stroke:var(--ext)" stroke-width="2.6" class="pieza"/>`;
        t += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(Math.min(ancho_, alto_) * 0.17)}" style="fill:var(--ext)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".4"/>`;
      }
      t += R(x, 0, wh, H, 'fill="url(#brilloPuerta)"');
    }
    return t + extra;
  };
  let p = '';
  if (puertas === 'correderas') {
    const { k } = correderas(ancho, alto), wh = ancho / k;
    for (let j = 0; j < k; j++) {
      const x = j * wh, dir = j % 2 ? 1 : -1;
      p += `<g class="hoja corredera" style="--mover:${f(dir * wh * 0.42)}px">${hoja(x, wh + (j < k - 1 ? 1 : 0), R(x, 0, 1.4, H, 'style="fill:var(--perfil)" class="pieza"') + R(x + wh - 1.4, 0, 1.4, H, 'style="fill:var(--perfil)" class="pieza"') + R(x, H - 1.4, wh, 1.4, 'style="fill:var(--perfil)" class="pieza"'))}</g>`;
    }
    p += R(0, -1, ancho, 2.2, 'style="fill:var(--perfil)" class="pieza"') + R(0, 1, ancho, 0.5, 'fill="#000" opacity=".25"');
  }
  if (puertas === 'abatibles') {
    for (let i = 0; i < n; i++) {
      const hojas = w > 60 ? 2 : 1, wh = w / hojas;
      for (let j = 0; j < hojas; j++) {
        const x = i * w + j * wh, izq = hojas === 2 ? j === 0 : i % 2 === 0, xb = izq ? x + wh - 6 : x + 3.8;
        p += `<g class="hoja abatible" style="transform-origin:${izq ? 'left' : 'right'} center">${hoja(x + 0.2, wh - 0.4,
          `<g class="t-barra">${R(xb, H / 2 - 12, 2.2, 26, 'rx="1" style="fill:var(--tir)" class="pieza"')}</g><g class="t-unero">${R(izq ? x + wh - 3 : x + 0.4, 0, 2.6, H, 'fill="#000" opacity=".3"')}</g>`)}</g>`;
      }
    }
  }
  const cuenta = { ...c.cuenta, altillo: !!c.altillo };
  return { vista: `${-30} ${-25} ${ancho + 60} ${alto + 55}`, s: s + `<g class="puertas">${p}</g>`, datos: { ...c.tot, perchas: c.tot.perchas + c.tot.pantalones, n, altillo: !!c.altillo, cuenta, huecos: [['f', n]] } };
}

// ── Vestidor «de maqueta»: el fondo de frente y los laterales abiertos hacia los lados, con el mismo dibujo que de frente ──
// Cada pared lateral es el mismo cuerpo de frente, inclinado con una transformación afín (x se acorta y baja hacia el espectador).
const SX = 0.6, SY = 0.3, FONDO = 60;
export function vestidor({ ancho = 300, alto = 250, forma = 'lineal', lado = 180, mods = [], modsI = [], modsD = [] }) {
  const W = ancho, conIzq = forma !== 'lineal', conDer = forma === 'C' || forma === 'isla';
  const D = conIzq ? FONDO + lado : 150;                 // profundidad de las paredes laterales
  const LX = D * SX;                                      // margen a la izquierda para el lateral izquierdo
  const tot = { perchas: 0, zapatos: 0, montones: 0, cajones: 0, pantalones: 0 }, cuenta = { largo: 0, corto: 0, doblado: 0, zapatos: 0 };
  const huecos = []; let s = '', altillo = false;
  const pt = (x, y) => `${f(x)},${f(y)}`;
  // Suelo: trapecio que se abre hacia el espectador, con tarima que converge al fondo
  const fondoI = [LX, alto], fondoD = [LX + W, alto], frenteI = [LX - D * SX, alto + D * SY], frenteD = [LX + W + D * SX, alto + D * SY];
  s += `<polygon points="${[fondoI, fondoD, frenteD, frenteI].map((q) => pt(...q)).join(' ')}" fill="#c8ad87"/>`;
  for (let k = 1; k < 16; k++) { const t = k / 16; s += `<line x1="${f(fondoI[0] + W * t)}" y1="${alto}" x2="${f(frenteI[0] + (frenteD[0] - frenteI[0]) * t)}" y2="${f(alto + D * SY)}" stroke="#7a5c40" stroke-opacity=".22" stroke-width=".5"/>`; }
  s += `<polygon points="${[fondoI, fondoD, frenteD, frenteI].map((q) => pt(...q)).join(' ')}" fill="url(#sueloMaqueta)"/>`;
  // Pared del fondo por encima del mueble
  s += `<rect x="${f(LX)}" y="-30" width="${f(W)}" height="30" fill="#e9e6df"/>`;
  // Lateral (izquierdo o derecho): pared lisa en toda la profundidad y, si hay mueble, su cuerpo desde la esquina + 60
  const lateral = (lado_, clave, lista) => {
    const izq = lado_ === 'i', esq = izq ? [LX, 0] : [LX + W, 0];
    // Matriz: x' a lo largo de la pared (0 = esquina … D = delante), y hacia abajo
    const ux = izq ? -SX : SX, uy = SY;
    const m = (x0) => `matrix(${ux} ${uy} 0 1 ${f(esq[0] + ux * x0)} ${f(esq[1] + uy * x0)})`;
    let t = `<g transform="${m(0)}"><rect x="0" y="-30" width="${D}" height="${alto + 30}" fill="#e9e6df"/><rect x="0" y="-30" width="${D}" height="${alto + 30}" fill="#000" opacity="${izq ? 0.06 : 0.1}"/></g>`;
    if (lista) {
      const c = cuerpo(lado_ === 'i' ? lado : lado, alto, lista, clave, clave === 'i' ? 11 : 19, izq ? 'Izquierda, hueco' : 'Derecha, hueco');
      sumar(tot, c.tot); sumar(cuenta, c.cuenta); altillo = altillo || !!c.altillo; huecos.push([clave, c.n]);
      // El cuerpo se dibuja de frente con x de 0 a lado: en el izquierdo, x=0 queda delante; en el derecho, junto a la esquina
      const tr = izq ? `matrix(${-ux} ${-uy} 0 1 ${f(esq[0] + ux * D)} ${f(esq[1] + uy * D)})` : m(FONDO);
      t += `<g transform="${tr}">${c.s}<rect x="0" y="0" width="${lado}" height="${alto}" fill="#000" opacity="${izq ? 0.05 : 0.09}" pointer-events="none"/></g>`;
      // Canto delantero del lateral (el panel final, de frente)
      const fx = izq ? esq[0] + ux * D : esq[0] + ux * D, fy = esq[1] + uy * D;
      t += `<polygon points="${pt(fx, fy)} ${pt(fx + (izq ? 2.5 : -2.5), fy)} ${pt(fx + (izq ? 2.5 : -2.5), fy + alto)} ${pt(fx, fy + alto)}" style="fill:var(--ext)" class="pieza"/>`;
    }
    return t;
  };
  s += lateral('i', 'i', conIzq ? modsI : null);
  s += lateral('d', 'd', conDer ? modsD : null);
  // Fondo
  const cf = cuerpo(W, alto, mods, 'f', 3, 'Fondo, hueco');
  sumar(tot, cf.tot); sumar(cuenta, cf.cuenta); altillo = altillo || !!cf.altillo; huecos.unshift(['f', cf.n]);
  s += `<g transform="translate(${f(LX)} 0)">${cf.s}</g>`;
  // Isla (joyero con tapa de cristal), situada en el suelo
  if (forma === 'isla') {
    const suelo = (X, Z, h = 0) => { const t = Z / D, xb = LX + X, xf = frenteI[0] + (frenteD[0] - frenteI[0]) * (X / W); return [xb + (xf - xb) * t, alto + D * SY * t - h]; };
    const X0 = W / 2 - 25, X1 = W / 2 + 25, Z0 = FONDO + 50, Z1 = Math.min(D - 15, Z0 + 120), H = 88;
    const pol = (l, a) => `<polygon points="${l.map((q) => pt(...q)).join(' ')}" ${a}/>`;
    s += pol([suelo(X0 - 4, Z0 - 4), suelo(X1 + 4, Z0 - 4), suelo(X1 + 4, Z1 + 6), suelo(X0 - 4, Z1 + 6)], 'fill="#000" opacity=".16"');
    s += pol([suelo(X0, Z0, 0), suelo(X0, Z1, 0), suelo(X0, Z1, H), suelo(X0, Z0, H)], 'style="fill:var(--ext)" class="pieza"') + pol([suelo(X0, Z0, 0), suelo(X0, Z1, 0), suelo(X0, Z1, H), suelo(X0, Z0, H)], 'fill="#000" opacity=".12"');
    s += pol([suelo(X1, Z0, 0), suelo(X1, Z1, 0), suelo(X1, Z1, H), suelo(X1, Z0, H)], 'style="fill:var(--ext)" class="pieza"') + pol([suelo(X1, Z0, 0), suelo(X1, Z1, 0), suelo(X1, Z1, H), suelo(X1, Z0, H)], 'fill="#000" opacity=".2"');
    s += pol([suelo(X0, Z1, 0), suelo(X1, Z1, 0), suelo(X1, Z1, H), suelo(X0, Z1, H)], 'style="fill:var(--ext)" class="pieza"') + pol([suelo(X0, Z1, 0), suelo(X1, Z1, 0), suelo(X1, Z1, H), suelo(X0, Z1, H)], 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-ext)"');
    [0.3, 0.6].forEach((v) => (s += pol([suelo(X0 + 2, Z1, 8 + (H - 8) * v), suelo(X1 - 2, Z1, 8 + (H - 8) * v), suelo(X1 - 2, Z1, 8.6 + (H - 8) * v), suelo(X0 + 2, Z1, 8.6 + (H - 8) * v)], 'fill="#000" opacity=".3"')));
    s += pol([suelo(X0, Z1, 0), suelo(X1, Z1, 0), suelo(X1, Z1, 8), suelo(X0, Z1, 8)], 'fill="#000" opacity=".35"');
    s += pol([suelo(X0, Z0, H), suelo(X1, Z0, H), suelo(X1, Z1, H), suelo(X0, Z1, H)], 'style="fill:var(--ext)" class="pieza"');
    s += pol([suelo(X0 + 3, Z0 + 3, H), suelo(X1 - 3, Z0 + 3, H), suelo(X1 - 3, Z1 - 3, H), suelo(X0 + 3, Z1 - 3, H)], 'fill="#3a2f2a"');
    for (let z = Z0 + 12, i = 0; z < Z1 - 14; z += 17, i++) {
      s += pol([suelo(X0 + 9, z, H), suelo(X0 + 19, z, H), suelo(X0 + 19, z + 7, H), suelo(X0 + 9, z + 7, H)], `fill="${['#c9a27a', '#d9d4ca', '#b46a55'][i % 3]}"`);
      s += pol([suelo(X1 - 19, z + 4, H), suelo(X1 - 9, z + 4, H), suelo(X1 - 9, z + 11, H), suelo(X1 - 19, z + 11, H)], `fill="${['#2f2f33', '#c9a27a', '#8e9c86'][i % 3]}"`);
    }
    s += pol([suelo(X0 + 3, Z0 + 3, H), suelo(X1 - 3, Z0 + 3, H), suelo(X1 - 3, Z1 - 3, H), suelo(X0 + 3, Z1 - 3, H)], 'fill="url(#reflejo)" opacity=".85"');
    cuenta.isla = true; tot.cajones += 6;
  }
  const x0 = -D * SX + LX - 12, x1 = LX + W + D * SX + 12, y0 = -38, y1 = alto + D * SY + 10;
  return { vista: `${f(x0)} ${f(y0)} ${f(x1 - x0)} ${f(y1 - y0)}`, s, datos: { ...tot, perchas: tot.perchas + tot.pantalones, n: huecos.reduce((a, h) => a + h[1], 0), altillo, cuenta: { ...cuenta, altillo }, huecos } };
}

// ── Plano visto desde arriba, con los pasos (para la esquina del dibujo del vestidor) ──
export function plano({ ancho = 300, forma = 'lineal', lado = 180 }) {
  const W = ancho, conIzq = forma !== 'lineal', conDer = forma === 'C' || forma === 'isla', D = conIzq ? FONDO + lado : 150;
  const k = 150 / Math.max(W, D), r = (x, y, w, h, a) => `<rect x="${f(x * k)}" y="${f(y * k)}" width="${f(w * k)}" height="${f(h * k)}" ${a}/>`;
  const t = (x, y, txt) => `<text x="${f(x * k)}" y="${f(y * k)}" text-anchor="middle" font-size="10" font-family="Inter, sans-serif" fill="#fff">${txt}</text>`;
  let s = r(0, 0, W, D, 'fill="#1d1d20" stroke="#55555c" stroke-width="1"') + r(0, 0, W, FONDO, 'fill="#c9a27a"');
  if (conIzq) s += r(0, FONDO, FONDO, lado, 'fill="#c9a27a"');
  if (conDer) s += r(W - FONDO, FONDO, FONDO, lado, 'fill="#c9a27a"');
  let paso = W - (conIzq ? FONDO : 0) - (conDer ? FONDO : 0);
  const ix = conIzq ? FONDO : 0;
  if (forma === 'isla') { s += r(W / 2 - 25, FONDO + 50, 50, Math.min(D - 15, FONDO + 170) - (FONDO + 50), 'fill="#3d55ff"'); paso = Math.floor((W - 2 * FONDO - 50) / 2); }
  const py = FONDO + (D - FONDO) * 0.82, ok = paso >= (conDer ? (forma === 'isla' ? 90 : 100) : 90) ? '#8796ff' : paso >= (conDer ? 80 : 70) ? '#c9a27a' : '#e07a62';
  const x1p = forma === 'isla' ? W / 2 - 25 : W - (conDer ? FONDO : 0);
  s += `<line x1="${f(ix * k + 3)}" y1="${f(py * k)}" x2="${f(x1p * k - 3)}" y2="${f(py * k)}" stroke="${ok}" stroke-width="1.5" marker-start="url(#flecha)" marker-end="url(#flecha)"/>`;
  s += t((ix + x1p) / 2, py - 4, `${paso} cm`);
  s += t(W / 2, D + 13, `${W} cm`);
  return `<svg viewBox="-6 -6 ${f(W * k + 12)} ${f(D * k + 24)}" width="${f(W * k + 12)}" height="${f(D * k + 24)}" aria-hidden="true"><defs><marker id="flecha" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 6 3 0 6z" fill="${ok}"/></marker></defs>${s}</svg>`;
}

export const DEFS_ARMARIO = `<defs>
<pattern id="vetaA" width="12" height="70" patternUnits="userSpaceOnUse"><path d="M2 0c1 16-1 32 .4 48s-.8 16 0 22M6 0c-.8 12 1.4 28 0 40s1.2 24 .4 30M10 0c1 20-1.4 36 0 52s-.4 12 .4 18" fill="none" stroke="#3b2414" stroke-opacity=".2" stroke-width=".3"/></pattern>
<pattern id="telaA" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 .6h2.4M0 1.8h2.4" stroke="#5a4a36" stroke-opacity=".24" stroke-width=".5"/><path d="M.6 0v2.4M1.8 0v2.4" stroke="#fff" stroke-opacity=".3" stroke-width=".45"/></pattern>
<pattern id="telaV" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .75h3M0 2.25h3" stroke="#5a4a36" stroke-opacity=".14" stroke-width=".6"/><path d="M.75 0v3M2.25 0v3" stroke="#fff" stroke-opacity=".2" stroke-width=".5"/></pattern>
<linearGradient id="fondoSombra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".25" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
<linearGradient id="luzArriba" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6bd" stop-opacity=".9"/><stop offset="1" stop-color="#ffe6bd" stop-opacity="0"/></linearGradient>
<linearGradient id="luzArribaV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6bd" stop-opacity=".95"/><stop offset="1" stop-color="#ffe6bd" stop-opacity=".1"/></linearGradient>
<linearGradient id="brilloPuerta" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
<linearGradient id="reflejo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".12"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="sueloV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".25"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
<linearGradient id="ledCono" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe2ad" stop-opacity=".62"/><stop offset=".45" stop-color="#ffe2ad" stop-opacity=".2"/><stop offset="1" stop-color="#ffe2ad" stop-opacity="0"/></linearGradient>
<linearGradient id="ledLado" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe2ad" stop-opacity=".45"/><stop offset="1" stop-color="#ffe2ad" stop-opacity="0"/></linearGradient>
<linearGradient id="sueloMaqueta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".35" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
<radialGradient id="haloV"><stop offset="0" stop-color="#fff3d9" stop-opacity=".9"/><stop offset="1" stop-color="#fff3d9" stop-opacity="0"/></radialGradient>
</defs>`;
