// Dibujo del armario para el juego «Diseña tu armario». Todo en cm (1 unidad = 1 cm), con el alto hacia abajo:
// y = alto − altura desde el suelo. Medidas del taller: altillo de 45, zócalo de 8, barra larga a 170–180, dos barras a ~100 y ~195,
// baldas cada 35, cajonera hasta 90 (por debajo de 100 para ver dentro) y zapatero de 18 en 18.
// Los colores van en variables CSS (--ext, --int, --tir…) para que cambien con fundido.

export const TIPOS = {
  largo: 'Colgar largo', doble: 'Dos barras', baldas: 'Baldas', cajones: 'Cajones y barra', zapatero: 'Zapatero y baldas',
};
const ROPA = ['#3b4a5e', '#a9b4c2', '#e7e2d6', '#7a5c48', '#c6a77d', '#2f2f33', '#8e9c86', '#b46a55', '#d9d4ca', '#556b7a', '#efe9dc', '#6b5a7a'];
const f = (n) => +n.toFixed(1);

// Reparte el ancho en módulos de 60 a 100 cm (una barra de más de 100 sin apoyo se comba)
export const modulosPara = (ancho) => Math.max(1, Math.ceil(ancho / 100));

export function armario({ ancho = 240, alto = 250, puertas = 'correderas', mods = [] }) {
  const n = modulosPara(ancho), w = ancho / n, Y = (h) => alto - h;
  const altillo = alto >= 220 ? alto - 45 : null, techoUtil = altillo ?? alto - 2;
  let s = '', perchas = 0, zapatos = 0, montones = 0, cajones = 0, baldas = 0, maletas = 0;
  const cuenta = { largo: 0, corto: 0, doblado: 0, zapatos: 0, altillo: !!altillo };
  const R = (x, y, ancho_, alto_, a = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(ancho_)}" height="${f(alto_)}" ${a}/>`;

  // Habitación: pared y tarima
  s += R(-60, -40, ancho + 120, alto + 40, 'fill="#e9e6df"') + R(-60, alto, ancho + 120, 40, 'fill="#c8ad87"');
  for (let x = -60; x < ancho + 60; x += 14) s += `<line x1="${x}" y1="${alto}" x2="${x - 6}" y2="${alto + 40}" stroke="#7a5c40" stroke-opacity=".25" stroke-width=".3"/>`;
  s += R(-60, alto, ancho + 120, 3, 'fill="#000" opacity=".12"');
  // Cuerpo: fondo interior con su veta y laterales
  s += R(0, 0, ancho, alto, 'style="fill:var(--ext)" class="pieza"');
  s += R(2, 2, ancho - 4, alto - 10, 'style="fill:var(--int)" class="pieza"') + R(2, 2, ancho - 4, alto - 10, 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-int)"');
  s += R(2, 2, ancho - 4, alto - 10, 'fill="url(#fondoSombra)"');
  s += R(0, alto - 8, ancho, 8, 'style="fill:var(--ext)" class="pieza"') + R(0, alto - 8, ancho, 8, 'fill="#000" opacity=".35"');
  if (altillo) { s += R(2, Y(altillo) - 1, ancho - 4, 2, 'style="fill:var(--int)" class="pieza"') + R(2, Y(altillo) + 1, ancho - 4, 0.6, 'fill="#000" opacity=".25"'); }

  // Interior de cada módulo
  for (let i = 0; i < n; i++) {
    const x0 = i * w + (i ? 1 : 2), x1 = (i + 1) * w - (i < n - 1 ? 1 : 2), tipo = mods[i] || 'largo';
    let r = ''; const sem = i * 7 + 3;
    const balda = (h) => { baldas++; return R(x0, Y(h) - 1, x1 - x0, 2, 'style="fill:var(--int)" class="pieza"') + R(x0, Y(h) + 1, x1 - x0, 0.6, 'fill="#000" opacity=".22"'); };
    const barra = (h, largo) => {
      let t = `<line x1="${f(x0 + 1)}" y1="${f(Y(h))}" x2="${f(x1 - 1)}" y2="${f(Y(h))}" stroke="#9aa0a6" stroke-width="1.2" stroke-linecap="round"/>`;
      for (let x = x0 + 3, k = 0; x + 5 < x1 - 2; x += 5.2, k++) {
        const c = ROPA[(sem + k * 5) % ROPA.length], l = largo - ((sem + k * 13) % 4) * 7, an = 4.4 + ((sem + k) % 3) * 0.5, y0 = Y(h);
        // Percha (gancho y hombros) y la prenda, más ancha abajo
        t += `<path d="M${f(x + an / 2)} ${f(y0 - 0.8)}q.9 0 .9.9-.9.9-.9 1.6" stroke="#8a8f94" stroke-width=".35" fill="none"/>`;
        t += `<path d="M${f(x + 0.4)} ${f(y0 + 3.4)}q${f(an / 2 - 0.4)} -1.8 ${f(an - 0.8)} 0l.4 ${f(l - 3)}q0 1-1 1h${f(-(an - 1.2))}q-1 0-1-1z" fill="${c}"/>`;
        t += `<path d="M${f(x + 0.9)} ${f(y0 + 3.6)}v${f(l - 4)}" stroke="#fff" stroke-opacity=".14" stroke-width=".7"/>`;
        perchas++;
      }
      return t;
    };
    const montonesEn = (h, alturaLibre) => {
      let t = ''; const capas = Math.max(1, Math.min(4, Math.floor((alturaLibre - 6) / 6)));
      for (let x = x0 + 3, k = 0; x + 26 < x1 - 2; x += 30, k++) {
        for (let c = 0; c < capas; c++) t += R(x, Y(h) - 1 - (c + 1) * 6, 26, 5.6, `rx="1.2" fill="${ROPA[(sem + k * 3 + c * 7) % ROPA.length]}"`);
        montones++;
      }
      return t;
    };
    const zapatosEn = (h) => {
      let t = '';
      for (let x = x0 + 2, k = 0; x + 18 < x1 - 1; x += 20, k++) {
        const c = ['#2b2b2b', '#7a5c48', '#e7e2d6', '#a33b2f', '#3b4a5e'][(sem + k) % 5];
        t += `<path d="M${f(x)} ${f(Y(h) - 1)}h8.5v-3.2c0-1.4-2-2-3.6-2.6s-2.4-1.6-4-1.6c-.6 0-.9.5-.9 1.2z" fill="${c}"/>`;
        t += `<path d="M${f(x + 9.4)} ${f(Y(h) - 1)}h8.5v-3.2c0-1.4-2-2-3.6-2.6s-2.4-1.6-4-1.6c-.6 0-.9.5-.9 1.2z" fill="${c}"/>`;
        zapatos++;
      }
      return t;
    };
    if (tipo === 'largo') { r += barra(Math.min(178, techoUtil - 8), 118); cuenta.largo++; r += balda(30) + montonesEn(30, 28) + zapatosEn(10); cuenta.zapatos++; cuenta.doblado++; }
    if (tipo === 'doble') { const b1 = techoUtil - 8, b2 = Math.round(b1 / 2 + 4); r += barra(b1, 82) + barra(b2, 78); cuenta.corto += 2; }
    if (tipo === 'baldas') { for (let h = 10 + 35; h < techoUtil - 20; h += 35) { r += balda(h); } for (let h = 10; h < techoUtil - 20; h += 35) r += montonesEn(h + (h === 10 ? 0 : 1), 33); cuenta.doblado++; }
    if (tipo === 'cajones') {
      [[10, 30], [30, 50], [50, 70], [70, 90]].forEach(([a, b]) => { r += R(x0 + 0.5, Y(b) + 0.4, x1 - x0 - 1, b - a - 0.8, 'style="fill:var(--int)" class="pieza" stroke="#000" stroke-opacity=".2" stroke-width=".3"') + R((x0 + x1) / 2 - 7, Y(b) + 3, 14, 1.2, 'rx=".6" fill="#000" opacity=".35"'); cajones++; });
      r += balda(92) + barra(techoUtil - 8, 80); cuenta.corto++; cuenta.doblado++;
    }
    if (tipo === 'zapatero') { [10, 28, 46, 64].forEach((h) => { if (h > 10) r += balda(h); r += zapatosEn(h); }); r += balda(82); for (let h = 82; h + 35 < techoUtil - 5; h += 35) { r += montonesEn(h + 1, 33); if (h + 35 < techoUtil - 20) r += balda(h + 35); } cuenta.zapatos++; cuenta.doblado++; }
    if (altillo) { const ha = alto - altillo - 4; r += R(x0 + 3, Y(altillo) - 1 - Math.min(26, ha), Math.min(38, x1 - x0 - 6), Math.min(26, ha), `rx="1.5" fill="${['#5a6b7d', '#7a5c48', '#2f2f33'][i % 3]}"`); maletas++; if (x1 - x0 > 60) { s += ''; r += R(x0 + 45, Y(altillo) - 1 - Math.min(18, ha), Math.min(30, x1 - x0 - 50), Math.min(18, ha), 'rx="1" fill="#c6a77d"'); } }
    s += `<g class="modulo" data-i="${i}" role="button" tabindex="0" aria-label="Hueco ${i + 1}: ${TIPOS[tipo]}. Pulsa para cambiarlo">${R(x0, 2, x1 - x0, alto - 10, 'fill="transparent"')}${r}${R(x0, 2, x1 - x0, alto - 10, 'class="marca" fill="none"')}</g>`;
    if (i < n - 1) s += R((i + 1) * w - 1, 2, 2, alto - 10, 'style="fill:var(--int)" class="pieza"') + R((i + 1) * w + 1, 2, 0.5, alto - 10, 'fill="#000" opacity=".2"');
  }
  s += R(2, 2, ancho - 4, 6, 'fill="url(#luzArriba)" class="led"');

  // Puertas
  let p = '';
  const hoja = (x, wh, a = '') => `${R(x, 0, wh, alto - 8, 'style="fill:var(--ext)" class="pieza" stroke="#000" stroke-opacity=".25" stroke-width=".4"')}${R(x, 0, wh, alto - 8, 'fill="url(#vetaA)" class="dibujo" style="opacity:var(--v-ext)"')}${R(x, 0, wh, alto - 8, 'fill="url(#brilloPuerta)"')}${a}`;
  if (puertas === 'correderas') {
    const k = Math.max(2, Math.round(ancho / 90)), wh = ancho / k;
    for (let j = 0; j < k; j++) {
      const x = j * wh, dir = j % 2 ? 1 : -1;
      p += `<g class="hoja corredera" style="--mover:${f(dir * wh * 0.42)}px">${hoja(x, wh + (j < k - 1 ? 1 : 0), R(x, 0, 1.4, alto - 8, 'fill="#2b2b2b"') + R(x + wh - 1.4, 0, 1.4, alto - 8, 'fill="#2b2b2b"') + R(x + wh / 2 - 0.5, alto / 2 - 30, 1, 60, 'fill="#000" opacity=".2"'))}</g>`;
    }
    p += R(0, -1, ancho, 2.2, 'fill="#2b2b2b"');
  }
  if (puertas === 'abatibles') {
    for (let i = 0; i < n; i++) {
      const hojas = w > 60 ? 2 : 1, wh = w / hojas;
      for (let j = 0; j < hojas; j++) {
        const x = i * w + j * wh, izq = hojas === 2 ? j === 0 : i % 2 === 0, xb = izq ? x + wh - 6 : x + 3.8;
        p += `<g class="hoja abatible" style="transform-origin:${izq ? 'left' : 'right'} center">${hoja(x + 0.2, wh - 0.4,
          `<g class="t-barra">${R(xb, (alto - 8) / 2 - 12, 2.2, 26, 'rx="1" style="fill:var(--tir)" class="pieza"')}</g><g class="t-unero">${R(izq ? x + wh - 3 : x + 0.4, 0, 2.6, alto - 8, 'fill="#000" opacity=".3"')}</g>`)}</g>`;
      }
    }
  }
  return { vista: `${-30} ${-25} ${ancho + 60} ${alto + 55}`, s: s + `<g class="puertas">${p}</g>`, datos: { perchas, zapatos, montones, cajones, baldas, maletas, n, w, altillo: !!altillo, cuenta } };
}

export const DEFS_ARMARIO = `<defs>
<pattern id="vetaA" width="12" height="70" patternUnits="userSpaceOnUse"><path d="M2 0c1 16-1 32 .4 48s-.8 16 0 22M6 0c-.8 12 1.4 28 0 40s1.2 24 .4 30M10 0c1 20-1.4 36 0 52s-.4 12 .4 18" fill="none" stroke="#3b2414" stroke-opacity=".2" stroke-width=".3"/></pattern>
<linearGradient id="fondoSombra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".25" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
<linearGradient id="luzArriba" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6bd" stop-opacity=".9"/><stop offset="1" stop-color="#ffe6bd" stop-opacity="0"/></linearGradient>
<linearGradient id="brilloPuerta" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>
</defs>`;
