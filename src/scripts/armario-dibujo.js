// Dibujo del armario y del vestidor para el juego «Diseña tu armario». Todo en cm.
// El interior de cada hueco se describe una vez (piezas en coordenadas del hueco: a a lo ancho, b de altura desde el suelo, d de fondo)
// y se pinta de dos formas: de frente (armario con puertas) o en perspectiva (vestidor lineal, en L, en C o con isla).
// Medidas del taller: altillo de 45, zócalo de 8, barra larga a 170–180, dos barras a ~100 y ~195, baldas cada 35,
// cajonera hasta 90 (por debajo de 100 para ver dentro), zapatero de 18 en 18, fondo 60.

export const TIPOS = {
  largo: 'Colgar largo', doble: 'Dos barras', baldas: 'Baldas', cajones: 'Cajones y barra', zapatero: 'Zapatero y baldas',
  pantalonero: 'Pantalonero y barra', accesorios: 'Bandejas y baldas',
};
export const MODELOS = { lisa: 'Lisa', japonesa3: 'Japonesa 3 paneles', japonesa: 'Japonesa 4 paneles', rayas: 'Cuatro paneles', moldura: 'Con moldura', cristal: 'Cristal', cruz: 'Cristal con cruz' };
export const CRISTALES = { claro: { nombre: 'Transparente', hex: '#cfe0e6', op: 0.2 }, mate: { nombre: 'Mate', hex: '#f3f3f1', op: 0.82 }, ahumado: { nombre: 'Ahumado', hex: '#2c3035', op: 0.6 } };
const ROPA = ['#3b4a5e', '#a9b4c2', '#e7e2d6', '#7a5c48', '#c6a77d', '#2f2f33', '#8e9c86', '#b46a55', '#d9d4ca', '#556b7a', '#efe9dc', '#6b5a7a'];
const PANT = ['#2f3b52', '#4a5a72', '#c9b79a', '#3a3a3a', '#6b6f73', '#8a7356', '#1f2a3a', '#7d8a9a'];
const ZAP = ['#2b2b2b', '#7a5c48', '#e7e2d6', '#a33b2f', '#3b4a5e'];
const f = (n) => +n.toFixed(1);
export const modulosPara = (ancho) => Math.max(1, Math.ceil(ancho / 100));

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

// ── Pintado de frente (armario con puertas) ──
function deFrente(piezas, alto) {
  const Y = (b) => alto - b, R = (x, y, w, h, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${a}/>`;
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
    return '';
  }).join('');
}

// ── Armario con puertas, de frente ──
export function armario({ ancho = 240, alto = 250, puertas = 'correderas', mods = [], modelo = 'lisa' }) {
  const n = modulosPara(ancho), w = ancho / n, Y = (h) => alto - h;
  const altillo = alto >= 220 ? alto - 45 : null, techoUtil = altillo ?? alto - 2;
  const tot = { perchas: 0, zapatos: 0, montones: 0, cajones: 0, pantalones: 0 }, cuenta = { largo: 0, corto: 0, doblado: 0, zapatos: 0, altillo: !!altillo };
  const R = (x, y, an, al, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(an)}" height="${f(al)}" ${a}/>`;
  let s = '';
  s += R(-60, -40, ancho + 120, alto + 40, 'fill="#e9e6df"') + R(-60, alto, ancho + 120, 40, 'fill="#c8ad87"');
  for (let x = -60; x < ancho + 60; x += 14) s += `<line x1="${x}" y1="${alto}" x2="${x - 6}" y2="${alto + 40}" stroke="#7a5c40" stroke-opacity=".25" stroke-width=".3"/>`;
  s += R(-60, alto, ancho + 120, 3, 'fill="#000" opacity=".12"');
  s += R(0, 0, ancho, alto, 'style="fill:var(--ext)" class="pieza"');
  s += R(2, 2, ancho - 4, alto - 10, 'style="fill:var(--int)" class="pieza"') + R(2, 2, ancho - 4, alto - 10, 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-int)"');
  s += R(2, 2, ancho - 4, alto - 10, 'fill="url(#telaA)" class="dibujo" style="opacity:var(--t-int)"');
  s += R(2, 2, ancho - 4, alto - 10, 'fill="url(#fondoSombra)"');
  s += R(0, alto - 8, ancho, 8, 'style="fill:var(--ext)" class="pieza"') + R(0, alto - 8, ancho, 8, 'fill="#000" opacity=".35"');
  if (altillo) s += R(2, Y(altillo) - 1, ancho - 4, 2, 'style="fill:var(--int)" class="pieza"') + R(2, Y(altillo) + 1, ancho - 4, 0.6, 'fill="#000" opacity=".25"');
  for (let i = 0; i < n; i++) {
    const x0 = i * w + (i ? 1 : 2), x1 = (i + 1) * w - (i < n - 1 ? 1 : 2), tipo = mods[i] || 'largo';
    const it = interior(tipo, x0, x1, techoUtil, altillo, alto, i * 7 + 3);
    Object.keys(tot).forEach((k) => (tot[k] += it.n[k])); Object.keys(it.c).forEach((k) => (cuenta[k] += it.c[k]));
    s += `<g class="modulo" data-k="f-${i}" role="button" tabindex="0" aria-label="Hueco ${i + 1}: ${TIPOS[tipo]}. Pulsa para cambiarlo">${R(x0, 2, x1 - x0, alto - 10, 'fill="transparent"')}${deFrente(it.p, alto)}${R(x0, 2, x1 - x0, alto - 10, 'class="marca" fill="none"')}</g>`;
    if (i < n - 1) s += R((i + 1) * w - 1, 2, 2, alto - 10, 'style="fill:var(--int)" class="pieza"') + R((i + 1) * w + 1, 2, 0.5, alto - 10, 'fill="#000" opacity=".2"');
  }
  s += R(2, 2, ancho - 4, 6, 'fill="url(#luzArriba)" class="led"');

  // Puertas con su modelo
  const H = alto - 8, cristal = modelo === 'cristal' || modelo === 'cruz';
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
      t += R(x, 0, wh, H, 'fill="url(#brilloPuerta)"');
    }
    return t + extra;
  };
  let p = '';
  if (puertas === 'correderas') {
    const k = Math.max(2, Math.round(ancho / 90)), wh = ancho / k;
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
  return { vista: `${-30} ${-25} ${ancho + 60} ${alto + 55}`, s: s + `<g class="puertas">${p}</g>`, datos: { ...tot, perchas: tot.perchas + tot.pantalones, n, altillo: !!altillo, cuenta, huecos: [['f', n]] } };
}

// ── Vestidor en perspectiva: lineal, en L, en C o con isla ──
const F = 1260, CZ = 900, CY = 150, H0 = 309;
export function vestidor({ ancho = 300, alto = 250, forma = 'lineal', lado = 180, mods = [], modsI = [], modsD = [] }) {
  const W = ancho, CX = W / 2;
  const P = (x, y, z) => { const sc = F / (CZ - z); return [500 + (x - CX) * sc, H0 - (y - CY) * sc]; };
  const pts = (l) => l.map((q) => P(...q).map((v) => v.toFixed(1)).join(',')).join(' ');
  const poli = (l, a = '') => `<polygon points="${pts(l)}" ${a}/>`;
  const ln = (p1, p2, a = '') => { const [x1, y1] = P(...p1), [x2, y2] = P(...p2); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" ${a}/>`; };
  const altillo = alto >= 220 ? alto - 45 : null, techoUtil = altillo ?? alto - 2, FONDO = 60, ZF = 520;
  const tot = { perchas: 0, zapatos: 0, montones: 0, cajones: 0, pantalones: 0 }, cuenta = { largo: 0, corto: 0, doblado: 0, zapatos: 0, altillo: !!altillo };
  const conIzq = forma !== 'lineal', conDer = forma === 'C' || forma === 'isla';
  let s = '';
  // Habitación
  s += poli([[0, 0, 0], [W, 0, 0], [W, 0, ZF], [0, 0, ZF]], 'fill="#c8ad87"');
  for (let x = 16; x < W; x += 16) s += ln([x, 0, 0], [x, 0, ZF], 'stroke="#7a5c40" stroke-opacity=".22" stroke-width="1"');
  s += poli([[0, 0, 0], [W, 0, 0], [W, 0, ZF], [0, 0, ZF]], 'fill="url(#sueloV)"');
  s += poli([[0, 0, 0], [W, 0, 0], [W, alto + 20, 0], [0, alto + 20, 0]], 'fill="#e9e6df"');
  [[0, 0.08], [W, 0.14]].forEach(([x, o]) => { const l = [[x, 0, 0], [x, alto + 20, 0], [x, alto + 20, ZF], [x, 0, ZF]]; s += poli(l, 'fill="#e9e6df"') + poli(l, `fill="#000" opacity="${o}"`); });
  s += poli([[0, alto + 20, 0], [W, alto + 20, 0], [W, alto + 20, ZF], [0, alto + 20, ZF]], 'fill="#e9e6df"') + poli([[0, alto + 20, 0], [W, alto + 20, 0], [W, alto + 20, ZF], [0, alto + 20, ZF]], 'fill="#000" opacity=".2"');

  // Un tramo de muebles a lo largo de una pared: o (esquina de la pared), u (a lo largo), nrm (hacia la habitación)
  const tramo = (clave, o, u, nrm, largo, lista, finVisible) => {
    const n = modulosPara(largo), w = largo / n;
    const Q = (a, b, d) => [o[0] + u[0] * a + nrm[0] * d, b, o[2] + u[2] * a + nrm[2] * d];
    const cuad = (a0, b0, a1, b1, d) => [Q(a0, b0, d), Q(a1, b0, d), Q(a1, b1, d), Q(a0, b1, d)];
    const plano = (a0, a1, b, d0, d1) => [Q(a0, b, d0), Q(a1, b, d0), Q(a1, b, d1), Q(a0, b, d1)];
    const lateral = (a, b0, b1, d0, d1) => [Q(a, b0, d0), Q(a, b0, d1), Q(a, b1, d1), Q(a, b1, d0)];
    let t = '';
    // Fondo, techo del mueble, zócalo y altillo
    t += poli(cuad(0, 8, largo, alto, 0.5), 'style="fill:var(--int)" class="pieza"') + poli(cuad(0, 8, largo, alto, 0.5), 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-int)"') + poli(cuad(0, 8, largo, alto, 0.5), 'fill="url(#telaV)" class="dibujo" style="opacity:var(--t-int)"') + poli(cuad(0, 8, largo, alto, 0.5), 'fill="#000" opacity=".1"');
    t += poli(plano(0, largo, alto - 2, 0, FONDO), 'style="fill:var(--int)" class="pieza"') + poli(plano(0, largo, alto - 2, 0, FONDO), 'fill="#000" opacity=".22"');
    t += poli(plano(0, largo, 8, 0, FONDO), 'style="fill:var(--int)" class="pieza"') + poli(plano(0, largo, 8, 0, FONDO), 'fill="#fff" opacity=".06"');
    t += poli(cuad(0, 0, largo, 8, FONDO), 'style="fill:var(--ext)" class="pieza"') + poli(cuad(0, 0, largo, 8, FONDO), 'fill="#000" opacity=".4"');
    if (altillo) t += poli(plano(0, largo, altillo, 0, FONDO), 'style="fill:var(--int)" class="pieza"') + poli(plano(0, largo, altillo, 0, FONDO), `fill="#000" opacity="${altillo > CY ? 0.2 : 0}"`);
    // Separación entre huecos (lateral y canto). En los laterales va antes del hueco más cercano; en el fondo, al final.
    const separa = (a) => poli(lateral(a, 8, alto - 2, 0, FONDO), 'style="fill:var(--int)" class="pieza"') + poli(lateral(a, 8, alto - 2, 0, FONDO), 'fill="#000" opacity=".16"') + poli(cuad(a - 1, 8, a + 1, alto, FONDO), 'style="fill:var(--ext)" class="pieza"');
    // Huecos
    for (let i = 0; i < n; i++) {
      if (clave !== 'f' && i > 0) t += separa(i * w);
      const a0 = i * w + 1, a1 = (i + 1) * w - 1, tipo = lista[i] || 'largo';
      const it = interior(tipo, a0, a1, techoUtil, altillo, alto, i * 7 + clave.length * 5 + 3);
      Object.keys(tot).forEach((k) => (tot[k] += it.n[k])); Object.keys(it.c).forEach((k) => (cuenta[k] += it.c[k]));
      let g = poli(cuad(a0, 8, a1, alto - 2, FONDO), 'fill="transparent"');
      const baldas = [];
      it.p.forEach((q) => {
        if (q.k === 'balda') { baldas.push(q); g += poli(plano(q.a0, q.a1, q.b, 0, FONDO - 2), `style="fill:var(--int)" class="pieza"`) + poli(plano(q.a0, q.a1, q.b, 0, FONDO - 2), `fill="${q.b > CY ? '#000' : '#fff'}" opacity="${q.b > CY ? 0.22 : 0.08}"`); }
        if (q.k === 'barra') g += ln(Q(q.a0, q.b, 30), Q(q.a1, q.b, 30), 'stroke="#9aa0a6" stroke-width="2.2" stroke-linecap="round"');
        if (q.k === 'varilla') g += ln(Q(q.a0, q.b, 52), Q(q.a1, q.b, 52), 'stroke="#b5b9bd" stroke-width="1.1"');
        if (q.k === 'marco') g += poli(lateral(q.a0, q.b0, q.b1, 4, 56), 'fill="#9aa0a6" opacity=".5"');
        if ((q.k === 'prenda' || q.k === 'pantalon') && clave !== 'f') { const b0 = q.b - 3, b1 = q.b - q.l; g += poli(cuad(q.a, b1, q.a + q.w * 0.8, b0, 30), `fill="${q.c}"`) + poli(cuad(q.a, b1, q.a + q.w * 0.25, b0, 30.5), 'fill="#fff" opacity=".12"'); }
        else if (q.k === 'prenda' || q.k === 'pantalon') { const b0 = q.b - 3, b1 = q.b - q.l; g += poli([Q(q.a, b0, 10), Q(q.a, b0, 50), Q(q.a + 0.4, b1, 53), Q(q.a + 0.4, b1, 7)], `fill="${q.c}"`) + poli([Q(q.a, b0, 50), Q(q.a + q.w * 0.6, b0, 50), Q(q.a + q.w * 0.6, b1, 53), Q(q.a + 0.4, b1, 53)], `fill="${q.c}"`) + poli([Q(q.a, b0, 50), Q(q.a + q.w * 0.6, b0, 50), Q(q.a + q.w * 0.6, b1, 53), Q(q.a + 0.4, b1, 53)], 'fill="#000" opacity=".12"'); }
        if (q.k === 'monton') g += poli(cuad(q.a, q.b, q.a + q.w, q.b + q.h, 46), `fill="${q.c}"`) + (q.b + q.h < CY ? poli(plano(q.a, q.a + q.w, q.b + q.h, 16, 46), `fill="${q.c}"`) + poli(plano(q.a, q.a + q.w, q.b + q.h, 16, 46), 'fill="#fff" opacity=".18"') : '');
        if (q.k === 'zapato' && clave !== 'f') g += poli(cuad(q.a, q.b, q.a + 8.5, q.b + 4.5, 40), `fill="${q.c}"`) + poli(cuad(q.a, q.b + 4.5, q.a + 3.5, q.b + 7, 40), `fill="${q.c}"`);
        else if (q.k === 'zapato') g += poli([Q(q.a, q.b, 44), Q(q.a + 8.5, q.b, 44), Q(q.a + 8.5, q.b + 4.5, 40), Q(q.a + 2, q.b + 7, 34), Q(q.a, q.b + 7, 34)], `fill="${q.c}"`);
        if (q.k === 'cajon' || q.k === 'bandeja') g += poli(cuad(q.a0, q.b0 + 0.4, q.a1, q.b1 - 0.4, FONDO - 1), 'style="fill:var(--int)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".7"') + poli(cuad((q.a0 + q.a1) / 2 - 7, q.b1 - 4, (q.a0 + q.a1) / 2 + 7, q.b1 - 2.8, FONDO - 0.8), 'fill="#000" opacity=".35"');
        if (q.k === 'bandejaAbierta') g += poli(plano(q.a0, q.a1, q.b, 10, FONDO - 2), 'fill="#3a2f2a"');
        if (q.k === 'mini') g += poli(cuad(q.a, q.b, q.a + q.w, q.b + q.h, 40), `fill="${q.c}"`);
        if (q.k === 'bolso') g += poli([Q(q.a, q.b, 40), Q(q.a + q.w, q.b, 40), Q(q.a + q.w - 2, q.b + q.h - 6, 40), Q(q.a + 2, q.b + q.h - 6, 40)], `fill="${q.c}"`);
        if (q.k === 'caja') g += poli(cuad(q.a, q.b, q.a + q.w, q.b + q.h, 50), `fill="${q.c}"`) + poli(plano(q.a, q.a + q.w, q.b, 10, 50), 'fill="#000" opacity=".15"');
      });
      baldas.forEach((q) => (g += poli(cuad(q.a0, q.b - 1, q.a1, q.b + 1, FONDO - 2), 'style="fill:var(--int)" class="pieza"') + poli(cuad(q.a0, q.b - 1, q.a1, q.b + 1, FONDO - 2), 'fill="#000" opacity=".12"')));
      g += poli(cuad(a0, 8, a1, alto - 2, FONDO), 'class="marca" fill="none"');
      t += `<g class="modulo" data-k="${clave}-${i}" role="button" tabindex="0" aria-label="${{ f: 'Fondo', i: 'Izquierda', d: 'Derecha' }[clave]}, hueco ${i + 1}: ${TIPOS[tipo]}. Pulsa para cambiarlo">${g}</g>`;
    }
    // Separaciones entre huecos y cantos delanteros
    if (clave === 'f') for (let i = 1; i < n; i++) t += separa(i * w);
    t += poli(cuad(0, alto - 3, largo, alto, FONDO), 'style="fill:var(--ext)" class="pieza"');
    t += poli(cuad(0, alto - 8, largo, alto - 3, FONDO - 1), 'fill="url(#luzArribaV)" class="led"');
    // Dibujo «en corte»: del panel final de los laterales solo se ve el canto, para que no tape el interior
    if (finVisible) t += poli(cuad(largo - 2, 0, largo, alto, FONDO), 'style="fill:var(--ext)" class="pieza"') + poli(lateral(largo, alto - 2, alto, 0, FONDO), 'style="fill:var(--ext)" class="pieza"');
    return { t, n };
  };
  const huecos = [];
  const fondo = tramo('f', [0, 0, 0], [1, 0, 0], [0, 0, 1], W, mods, false); s += fondo.t; huecos.push(['f', fondo.n]);
  if (conIzq) { const iz = tramo('i', [0, 0, FONDO], [0, 0, 1], [1, 0, 0], lado, modsI, true); s += iz.t; huecos.push(['i', iz.n]); }
  if (conDer) { const de = tramo('d', [W, 0, FONDO], [0, 0, 1], [-1, 0, 0], lado, modsD, true); s += de.t; huecos.push(['d', de.n]); }
  // Isla de cajones con tapa de cristal (joyero)
  if (forma === 'isla') {
    const x0 = W / 2 - 25, x1 = W / 2 + 25, z0 = FONDO + 60, z1 = Math.min(FONDO + lado, z0 + 120);
    s += poli([[x0 - 6, 0.3, z0 - 4], [x1 + 6, 0.3, z0 - 4], [x1 + 6, 0.3, z1 + 6], [x0 - 6, 0.3, z1 + 6]], 'fill="#000" opacity=".15"');
    s += poli([[x0, 0, z1], [x1, 0, z1], [x1, 88, z1], [x0, 88, z1]], 'style="fill:var(--ext)" class="pieza"') + poli([[x0, 0, z1], [x1, 0, z1], [x1, 88, z1], [x0, 88, z1]], 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-ext)"');
    s += poli([[x0, 0, z1], [x1, 0, z1], [x1, 8, z1], [x0, 8, z1]], 'fill="#000" opacity=".35"');
    s += poli([[x0, 88, z0], [x1, 88, z0], [x1, 88, z1], [x0, 88, z1]], 'style="fill:var(--ext)" class="pieza"');
    s += poli([[x0 + 3, 88.3, z0 + 3], [x1 - 3, 88.3, z0 + 3], [x1 - 3, 88.3, z1 - 3], [x0 + 3, 88.3, z1 - 3]], 'fill="#3a2f2a"');
    for (let z = z0 + 10, i = 0; z < z1 - 12; z += 16, i++) s += poli([[x0 + 10, 88.6, z], [x0 + 18, 88.6, z], [x0 + 18, 88.6, z + 6], [x0 + 10, 88.6, z + 6]], `fill="${['#c9a27a', '#d9d4ca', '#b46a55'][i % 3]}"`) + poli([[x1 - 18, 88.6, z + 3], [x1 - 10, 88.6, z + 3], [x1 - 10, 88.6, z + 9], [x1 - 18, 88.6, z + 9]], `fill="${['#2f2f33', '#c9a27a', '#8e9c86'][i % 3]}"`);
    s += poli([[x0 + 3, 88.8, z0 + 3], [x1 - 3, 88.8, z0 + 3], [x1 - 3, 88.8, z1 - 3], [x0 + 3, 88.8, z1 - 3]], 'fill="url(#reflejo)" opacity=".8"');
    cuenta.isla = true; tot.cajones += 6;
  }
  // Lámpara de techo
  const [lx, ly] = P(W / 2, alto + 18, FONDO + lado / 2);
  s += `<ellipse cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="40" ry="7" fill="#fff" opacity=".85"/><ellipse cx="${lx.toFixed(1)}" cy="${(ly + 30).toFixed(1)}" rx="160" ry="60" fill="url(#haloV)" opacity=".5"/>`;
  // Encuadre: de la pared del fondo a la parte delantera de los laterales
  const zv = FONDO + lado + 30, [ax, ay] = P(0, alto + 20, 0), [, by] = P(0, 0, Math.min(zv, 300)), [lx0] = P(conIzq ? 0 : -20, 0, conIzq ? zv : 120), [lx1] = P(conDer ? W : W + 20, 0, conDer ? zv : 120);
  const x0 = Math.min(ax, lx0) - 10, x1 = Math.max(P(W, 0, 0)[0], lx1) + 10, y0 = ay - 10, y1 = by + 6;
  return { vista: `${f(x0)} ${f(y0)} ${f(x1 - x0)} ${f(y1 - y0)}`, s, datos: { ...tot, perchas: tot.perchas + tot.pantalones, n: huecos.reduce((a, h) => a + h[1], 0), altillo: !!altillo, cuenta, huecos } };
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
<radialGradient id="haloV"><stop offset="0" stop-color="#fff3d9" stop-opacity=".9"/><stop offset="1" stop-color="#fff3d9" stop-opacity="0"/></radialGradient>
</defs>`;
