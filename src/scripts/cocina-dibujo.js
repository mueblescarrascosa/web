// Dibujo de la cocina en perspectiva para el juego «Combina tu cocina».
// Medidas en cm, como en el taller: zócalo 10, bajos hasta 90, encimera de 4 (a 94), altos de 146 a 216, techo a 260.
// Los colores no van aquí: cada pieza usa una variable CSS (--bajos, --altos, --enc…) que pone la página, así cambian con fundido.
// Solo hay que volver a dibujar si cambia la distribución o el modelo de puerta.

export const VISTA = '0 110 1000 510';
const F = 1260, CZ = 900, CY = 150, H0 = 309;
let CX = 200;
const P = (x, y, z) => { const s = F / (CZ - z); return [500 + (x - CX) * s, H0 - (y - CY) * s]; };
const pts = (l) => l.map((p) => P(...p).map((n) => n.toFixed(1)).join(',')).join(' ');
const poli = (l, a = '') => `<polygon points="${pts(l)}" ${a}/>`;
const linea = (p, q, a = '') => { const [x1, y1] = P(...p), [x2, y2] = P(...q); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" ${a}/>`; };

// Una cara plana: origen, dirección a lo ancho (u) y hacia arriba. Un rectángulo de la cara (a: ancho, b: alto) → 4 puntos.
const cara = (o, u) => ({ o, u });
const rect = (c, a0, b0, a1, b1) => {
  const p = (a, b) => [c.o[0] + c.u[0] * a, c.o[1] + b, c.o[2] + c.u[2] * a];
  return [p(a0, b0), p(a1, b0), p(a1, b1), p(a0, b1)];
};
const sombra = (v) => (v > 0 ? `fill="#000" opacity="${v}"` : `fill="#fff" opacity="${-v}"`);

// ── Frentes: puertas y cajones con su veta, su modelo (lisa, moldura, ranuras) y sus tiradores ──
function frente(c, e, color, veta, puerta) {
  const r = rect(c, e.a0, e.b0, e.a1, e.b1);
  let s = poli(r, `style="fill:var(${color})" class="pieza" stroke="#000" stroke-opacity=".28" stroke-width=".8"`);
  s += poli(r, `fill="url(#veta)" class="dibujo" style="opacity:var(${veta})"`);
  const w = e.a1 - e.a0, h = e.b1 - e.b0;
  if (puerta === 'moldura' && h > 14) {
    const m = h > 30 ? 6 : 3.5;
    s += poli(rect(c, e.a0 + m, e.b0 + m, e.a1 - m, e.b1 - m), 'fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="1.1"');
    s += poli(rect(c, e.a0 + m + 1.6, e.b0 + m - 1.2, e.a1 - m + 1.2, e.b1 - m - 1.6), 'fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1"');
  }
  if (puerta === 'ranurada') for (let a = e.a0 + 6; a < e.a1 - 3; a += 6) s += linea(...rect(c, a, e.b0 + 1, a, e.b1 - 1).slice(0, 4).filter((_, i) => i === 0 || i === 3), 'stroke="#000" stroke-opacity=".24" stroke-width=".9"');
  // Tiradores (los tres tipos; la página enseña el elegido)
  const barra = [], gola = [], unero = [];
  if (e.k === 'cajon') { const l = Math.min(30, w * 0.45), m = (e.a0 + e.a1) / 2; barra.push(rect(c, m - l / 2, e.b1 - 7, m + l / 2, e.b1 - 5)); }
  if (e.k === 'puerta') { const x = e.abre === 'der' ? e.a1 - 5 : e.a0 + 3; barra.push(e.alto ? rect(c, x, e.b0 + 6, x + 2.2, e.b0 + 28) : rect(c, x, e.b1 - 28, x + 2.2, e.b1 - 6)); }
  if (e.k !== 'panel') {
    if (e.alto) unero.push(rect(c, e.a0 + 1, e.b0, e.a1 - 1, e.b0 + 3)); else unero.push(rect(c, e.a0 + 1, e.b1 - 3, e.a1 - 1, e.b1));
    if (!e.alto && e.b1 < 89) gola.push(rect(c, e.a0, e.b1 - 4, e.a1, e.b1));
  }
  return { s, barra, gola, unero };
}

// Módulos de una bancada → puertas y cajones (alturas de los bajos: zócalo 10, frente de 10 a 90)
function bajos(m) {
  const l = [], { a0, a1, tipo } = m, med = (a0 + a1) / 2;
  if (tipo === 'cajones3') [[10, 32], [32, 60], [60, 90]].forEach(([b0, b1]) => l.push({ a0, a1, b0, b1, k: 'cajon' }));
  if (tipo === 'placa' || tipo === 'cajones2') [[10, 50], [50, 90]].forEach(([b0, b1]) => l.push({ a0, a1, b0, b1, k: 'cajon' }));
  if (tipo === 'puerta' || tipo === 'lava') l.push({ a0, a1, b0: 10, b1: 90, k: 'puerta', abre: 'der' });
  if (tipo === 'fregadero' || tipo === 'rincon') { l.push({ a0, a1: med, b0: 10, b1: 90, k: 'puerta', abre: 'der' }); l.push({ a0: med, a1, b0: 10, b1: 90, k: 'puerta', abre: 'izq' }); }
  if (tipo === 'panel') l.push({ a0, a1, b0: 10, b1: 90, k: 'panel' });
  return l;
}
const altos = (a0, a1) => { const n = Math.max(1, Math.round((a1 - a0) / 50)), w = (a1 - a0) / n; return Array.from({ length: n }, (_, i) => ({ a0: a0 + i * w, a1: a0 + (i + 1) * w, b0: 146, b1: 216, k: 'puerta', alto: true, abre: i % 2 ? 'izq' : 'der' })); };
const columna = (a0, a1) => [{ a0, a1, b0: 10, b1: 80, k: 'puerta', abre: 'der' }, { a0, a1, b0: 188, b1: 216, k: 'puerta', alto: true, abre: 'der' }];

// Cada distribución: módulos de la pared del fondo, altos, hueco de campana, ventana y lo demás
const PLANOS = {
  lineal: { cx: 200, col: [0, 60], bajos: [['cajones3', 60, 120], ['placa', 120, 210], ['lava', 210, 270], ['fregadero', 270, 350], ['puerta', 350, 400]], altos: [[60, 120], [210, 270], [350, 400]], campana: [120, 210], ventana: [270, 350] },
  isla: { cx: 200, col: [0, 60], bajos: [['cajones3', 60, 120], ['placa', 120, 210], ['lava', 210, 270], ['fregadero', 270, 350], ['puerta', 350, 400]], altos: [[60, 120], [210, 270], [350, 400]], campana: [120, 210], ventana: [270, 350], isla: true },
  peninsula: { cx: 185, col: [0, 60], bajos: [['cajones3', 60, 120], ['placa', 120, 210], ['lava', 210, 270], ['fregadero', 270, 350], ['puerta', 350, 400]], altos: [[60, 120], [210, 270]], campana: [120, 210], ventana: [270, 350], peninsula: true },
  L: { cx: 250, bajos: [['rincon', 0, 100], ['placa', 100, 190], ['lava', 190, 250], ['fregadero', 250, 330], ['cajones2', 330, 400]], altos: [[0, 100], [190, 250], [330, 400]], campana: [100, 190], ventana: [250, 330], izquierda: true },
};

export function dibujo({ dist = 'lineal', puerta = 'lisa' } = {}) {
  const pl = PLANOS[dist] || PLANOS.lineal; CX = pl.cx;
  let s = '', luces = '';
  const grupoTir = (T, extra = '') => `<g class="t-barra">${T.barra.map((r) => poli(r, 'style="fill:var(--tir)" class="pieza"')).join('')}</g>`
    + `<g class="t-gola">${T.gola.map((r) => poli(r, 'style="fill:var(--tir)" class="pieza"')).join('')}${extra}</g>`
    + `<g class="t-unero">${T.unero.map((r) => poli(r, 'fill="#000" opacity=".4"')).join('')}</g>`;
  const pon = (c, l, color, veta, extraGola = '') => { const T = { barra: [], gola: [], unero: [] };
    l.forEach((e) => { const f = frente(c, e, color, veta, puerta); s += f.s; T.barra.push(...f.barra); T.gola.push(...f.gola); T.unero.push(...f.unero); });
    s += grupoTir(T, extraGola); };
  const ZF = 690;

  // Habitación: suelo, paredes y techo
  s += poli([[0, 0, 0], [400, 0, 0], [400, 0, ZF], [0, 0, ZF]], 'style="fill:var(--suelo)" class="pieza"');
  let tablas = '', baldosas = '';
  for (let x = 18; x < 400; x += 18) tablas += linea([x, 0, 0], [x, 0, ZF]);
  for (let x = 0, i = 0; x < 400; x += 18, i++) for (let z = (i * 53) % 120; z < ZF; z += 120) tablas += linea([x, 0, z], [x + 18, 0, z]);
  for (let x = 60; x < 400; x += 60) baldosas += linea([x, 0, 0], [x, 0, ZF]);
  for (let z = 60; z < ZF; z += 60) baldosas += linea([0, 0, z], [400, 0, z]);
  s += `<g class="dibujo" stroke="#2a1a0e" stroke-opacity=".3" stroke-width="1" style="opacity:var(--v-tablas)">${tablas}</g>`;
  s += `<g class="dibujo" stroke="#000" stroke-opacity=".17" stroke-width="1.4" style="opacity:var(--v-baldosa)">${baldosas}</g>`;
  s += poli([[0, 0, 0], [400, 0, 0], [400, 0, ZF], [0, 0, ZF]], 'fill="url(#sueloLuz)"');
  s += poli([[0, 0, 0], [400, 0, 0], [400, 260, 0], [0, 260, 0]], 'style="fill:var(--pared)" class="pieza"');
  [[0, 0.07], [400, 0.13]].forEach(([x, o]) => { const l = [[x, 0, 0], [x, 260, 0], [x, 260, ZF], [x, 0, ZF]]; s += poli(l, 'style="fill:var(--pared)" class="pieza"') + poli(l, sombra(o)); });
  s += poli([[0, 260, 0], [400, 260, 0], [400, 260, ZF], [0, 260, ZF]], 'style="fill:var(--pared)" class="pieza"') + poli([[0, 260, 0], [400, 260, 0], [400, 260, ZF], [0, 260, ZF]], sombra(0.22));

  // Pared entre muebles (azulejo, piedra o lisa) y ventana
  const trasera = (l) => { s += poli(l, 'style="fill:var(--trasera)" class="pieza"'); ['azulejo', 'marmol', 'marmolN'].forEach((p, i) => (s += poli(l, `fill="url(#${p})" class="dibujo" style="opacity:var(${['--v-azulejo', '--m-tras', '--mn-tras'][i]})"`))); };
  trasera([[0, 94, 0.2], [400, 94, 0.2], [400, 146, 0.2], [0, 146, 0.2]]);
  if (pl.izquierda) trasera([[0.2, 94, 0], [0.2, 94, 200], [0.2, 146, 200], [0.2, 146, 0]]);
  const [v0, v1] = pl.ventana;
  s += poli([[v0 + 6, 106, 0.4], [v1 - 6, 106, 0.4], [v1 - 6, 210, 0.4], [v0 + 6, 210, 0.4]], 'fill="#f3f2ee"');
  s += poli([[v0 + 10, 110, 0.5], [v1 - 10, 110, 0.5], [v1 - 10, 206, 0.5], [v0 + 10, 206, 0.5]], 'fill="url(#cielo)" class="cristal-dia"');
  s += poli([[v0 + 10, 110, 0.5], [v1 - 10, 110, 0.5], [v1 - 10, 206, 0.5], [v0 + 10, 206, 0.5]], 'fill="url(#cieloNoche)" class="cristal-noche"');
  s += linea([(v0 + v1) / 2, 110, 0.6], [(v0 + v1) / 2, 206, 0.6], 'stroke="#f3f2ee" stroke-width="3"');

  // Altos del fondo (fondo 35) y campana
  const fondoAlto = cara([0, 0, 35], [1, 0, 0]);
  pl.altos.forEach(([a0, a1]) => pon(fondoAlto, altos(a0, a1), '--altos', '--v-altos'));
  pl.altos.forEach(([a0, a1]) => {
    const x = a1 <= CX ? a1 : a0 >= CX ? a0 : null;
    if (x === null || x === 0 || x === 400 || (pl.col && x === pl.col[1])) return;
    const l = [[x, 146, 0], [x, 146, 35], [x, 216, 35], [x, 216, 0]];
    s += poli(l, 'style="fill:var(--altos)" class="pieza"') + poli(l, sombra(0.18));
  });
  const [c0, c1] = pl.campana, cm = (c0 + c1) / 2;
  s += poli([[cm - 13, 182, 26], [cm + 13, 182, 26], [cm + 13, 260, 26], [cm - 13, 260, 26]], 'style="fill:var(--electro)" class="pieza"');
  s += poli([[cm - 44, 160, 50], [cm + 44, 160, 50], [cm + 15, 182, 26], [cm - 15, 182, 26]], 'style="fill:var(--electro)" class="pieza"');
  s += poli([[cm - 44, 160, 50], [cm + 44, 160, 50], [cm + 15, 182, 26], [cm - 15, 182, 26]], 'fill="url(#brilloMetal)"');
  s += poli([[cm - 44, 157, 50], [cm + 44, 157, 50], [cm + 44, 160, 50], [cm - 44, 160, 50]], 'fill="#000" opacity=".35"');

  // Bancada del fondo: zócalo, frentes, columna y encimera
  const fondoBajo = cara([0, 0, 58], [1, 0, 0]);
  s += poli(rect(fondoBajo, 0, 0, 400, 10), 'style="fill:var(--bajos)" class="pieza"') + poli(rect(fondoBajo, 0, 0, 400, 10), sombra(0.5));
  const g0 = pl.col ? pl.col[1] : 0;
  pon(fondoBajo, pl.bajos.flatMap(([tipo, a0, a1]) => bajos({ tipo, a0, a1 })), '--bajos', '--v-bajos',
    poli(rect(fondoBajo, g0, 84, 400, 90), 'style="fill:var(--tir)" class="pieza"') + poli(rect(fondoBajo, g0, 86, 400, 90), 'fill="#000" opacity=".35"'));
  const encimera = (l, cantos) => {
    s += poli(l, 'style="fill:var(--enc)" class="pieza"');
    ['vetaH', 'marmol', 'marmolN'].forEach((p, i) => (s += poli(l, `fill="url(#${p})" class="dibujo" style="opacity:var(${['--v-enc', '--m-enc', '--mn-enc'][i]})"`)));
    s += poli(l, sombra(-0.08));
    cantos.forEach((c) => { s += poli(c, 'style="fill:var(--enc)" class="pieza"') + poli(c, sombra(0.12)); });
  };
  encimera([[g0, 94, 0], [400, 94, 0], [400, 94, 62], [g0, 94, 62]], [[[g0, 90, 62], [400, 90, 62], [400, 94, 62], [g0, 94, 62]]]);
  // Placa, fregadero y grifo encima de su módulo
  pl.bajos.forEach(([tipo, a0, a1]) => {
    const m = (a0 + a1) / 2;
    if (tipo === 'placa') { s += poli([[m - 30, 94.3, 8], [m + 30, 94.3, 8], [m + 30, 94.3, 52], [m - 30, 94.3, 52]], 'fill="#0e0e10"'); s += poli([[m - 30, 94.3, 8], [m + 30, 94.3, 8], [m + 30, 94.3, 52], [m - 30, 94.3, 52]], 'fill="url(#brilloPlaca)"'); }
    if (tipo === 'fregadero') { s += poli([[m - 25, 94.3, 12], [m + 25, 94.3, 12], [m + 25, 94.3, 50], [m - 25, 94.3, 50]], 'fill="#55595d"'); s += poli([[m - 22, 94.4, 15], [m + 22, 94.4, 15], [m + 22, 94.4, 47], [m - 22, 94.4, 47]], 'fill="#2c2f32"');
      const g = [[m, 94, 6], [m, 128, 6], [m, 131, 9], [m, 131, 20], [m, 124, 22]].map((p) => P(...p).map((n) => n.toFixed(1)).join(',')).join(' ');
      s += `<polyline points="${g}" fill="none" style="stroke:var(--electro)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`; }
  });
  if (pl.col) { // Columna con horno y microondas, y su costado
    const [a0, a1] = pl.col;
    pon(fondoBajo, columna(a0, a1), '--altos', '--v-altos');
    s += poli(rect(fondoBajo, a0, 0, a1, 10), 'style="fill:var(--altos)" class="pieza"') + poli(rect(fondoBajo, a0, 0, a1, 10), sombra(0.5));
    s += electro(fondoBajo, a0, a1);
    const lado = [[a1, 0, 0], [a1, 0, 58], [a1, 216, 58], [a1, 216, 0]];
    s += poli(lado, 'style="fill:var(--altos)" class="pieza"') + poli(lado, sombra(0.2));
  }

  // Cocina en L: bancada en la pared izquierda, con columna al final
  if (pl.izquierda) {
    const izq = cara([58, 0, 0], [0, 0, 1]), izqAlto = cara([35, 0, 0], [0, 0, 1]);
    pon(izqAlto, altos(62, 200), '--altos', '--v-altos');
    s += poli(rect(izq, 62, 0, 200, 10), 'style="fill:var(--bajos)" class="pieza"') + poli(rect(izq, 62, 0, 200, 10), sombra(0.5));
    pon(izq, bajos({ tipo: 'cajones3', a0: 62, a1: 122 }).concat(bajos({ tipo: 'puerta', a0: 122, a1: 200 })), '--bajos', '--v-bajos');
    s += poli(rect(izq, 62, 0, 200, 90), sombra(0.1));
    encimera([[0, 94, 62], [62, 94, 62], [62, 94, 200], [0, 94, 200]], [[[62, 90, 62], [62, 90, 200], [62, 94, 200], [62, 94, 62]]]);
    pon(izq, columna(200, 260), '--altos', '--v-altos');
    s += poli(rect(izq, 200, 0, 260, 10), 'style="fill:var(--altos)" class="pieza"') + poli(rect(izq, 200, 0, 260, 10), sombra(0.5));
    s += electro(izq, 200, 260);
    s += poli(rect(izq, 200, 0, 260, 216), sombra(0.1));
    const fin = [[0, 0, 260], [58, 0, 260], [58, 216, 260], [0, 216, 260]];
    s += poli(fin, 'style="fill:var(--altos)" class="pieza"') + poli(fin, sombra(0.05));
  }

  // Península pegada a la bancada, con barra al final
  if (pl.peninsula) {
    const lado = cara([310, 0, 0], [0, 0, 1]);
    s += poli(rect(lado, 62, 0, 230, 10), 'style="fill:var(--bajos)" class="pieza"') + poli(rect(lado, 62, 0, 230, 10), sombra(0.5));
    pon(lado, bajos({ tipo: 'cajones3', a0: 62, a1: 122 }).concat(bajos({ tipo: 'puerta', a0: 122, a1: 182 }), bajos({ tipo: 'panel', a0: 182, a1: 230 })), '--bajos', '--v-bajos');
    s += poli(rect(lado, 62, 0, 230, 90), sombra(0.12));
    const fin = cara([310, 0, 230], [1, 0, 0]);
    pon(fin, [{ a0: 0, a1: 90, b0: 0, b1: 90, k: 'panel' }], '--bajos', '--v-bajos');
    encimera([[306, 94, 62], [400, 94, 62], [400, 94, 258], [306, 94, 258]], [[[306, 90, 62], [306, 90, 258], [306, 94, 258], [306, 94, 62]], [[306, 90, 258], [400, 90, 258], [400, 94, 258], [306, 94, 258]]]);
  }

  // Isla con barra, taburetes y lámparas
  if (pl.isla) {
    const fr = cara([0, 0, 245], [1, 0, 0]);
    s += poli(rect(fr, 105, 0, 295, 10), 'style="fill:var(--bajos)" class="pieza"') + poli(rect(fr, 105, 0, 295, 10), sombra(0.5));
    pon(fr, [0, 1, 2].map((i) => ({ a0: 105 + i * 63.33, a1: 105 + (i + 1) * 63.33, b0: 10, b1: 90, k: 'panel' })), '--bajos', '--v-bajos');
    encimera([[100, 94, 155], [300, 94, 155], [300, 94, 272], [100, 94, 272]], [[[100, 90, 272], [300, 90, 272], [300, 94, 272], [100, 94, 272]]]);
    s += poli([[105, 0.2, 272], [295, 0.2, 272], [295, 0.2, 245], [105, 0.2, 245]], 'fill="#000" opacity=".18"');
    [150, 200, 250].forEach((x) => {
      s += linea([x - 13, 0, 292], [x - 11, 64, 292], 'stroke="#1c1c1c" stroke-width="3"') + linea([x + 13, 0, 292], [x + 11, 64, 292], 'stroke="#1c1c1c" stroke-width="3"');
      s += poli([[x - 17, 66, 280], [x + 17, 66, 280], [x + 17, 66, 304], [x - 17, 66, 304]], 'fill="#5a4330"') + poli([[x - 17, 62, 304], [x + 17, 62, 304], [x + 17, 66, 304], [x - 17, 66, 304]], 'fill="#3d2d20"');
    });
    luces += poli([[100, 94.5, 155], [300, 94.5, 155], [300, 94.5, 272], [100, 94.5, 272]], 'fill="url(#luzEncimera)" class="luz-noche"');
    [160, 240].forEach((x) => {
      s += linea([x, 260, 210], [x, 186, 210], 'stroke="#222" stroke-width="1.5"');
      s += poli([[x - 9, 186, 210], [x + 9, 186, 210], [x + 15, 168, 210], [x - 15, 168, 210]], 'fill="#1f1f1f"');
      const [lx, ly] = P(x, 166, 210);
      luces += `<ellipse class="luz-noche" cx="${lx.toFixed(1)}" cy="${(ly + 6).toFixed(1)}" rx="120" ry="80" fill="url(#halo)"/>`;
    });
  }


  // Noche: la habitación se oscurece y se encienden las tiras LED y las lámparas
  s += `<rect class="noche" x="0" y="110" width="1000" height="510" fill="#06070f" style="mix-blend-mode:multiply"/>`;
  const led = (a0, a1) => poli([[a0, 146, 0.6], [a1, 146, 0.6], [a1, 94, 0.6], [a0, 94, 0.6]], 'fill="url(#luzLed)" class="luz-noche"') + poli([[a0, 94.6, 0], [a1, 94.6, 0], [a1, 94.6, 50], [a0, 94.6, 50]], 'fill="url(#luzEncimera)" class="luz-noche"');
  pl.altos.forEach(([a0, a1]) => (s += led(a0, a1)));
  return s + luces;
}

// Horno y microondas en una columna
function electro(c, a0, a1) {
  let s = '';
  const marco = (b0, b1) => rect(c, a0 + 3, b0, a1 - 3, b1);
  s += poli(marco(84, 144), 'style="fill:var(--electro)" class="pieza"') + poli(rect(c, a0 + 6, 88, a1 - 6, 132), 'fill="url(#cristal)"') + poli(rect(c, a0 + 10, 136, a1 - 10, 138), 'fill="#000" opacity=".45"');
  s += poli(marco(148, 185), 'style="fill:var(--electro)" class="pieza"') + poli(rect(c, a0 + 6, 151, a1 - 18, 182), 'fill="url(#cristal)"');
  return s;
}

// Patrones y degradados (una vez por dibujo)
export const DEFS = `<defs>
<pattern id="veta" width="46" height="180" patternUnits="userSpaceOnUse"><path d="M6 0c3 40-3 80 1 120s-2 50 0 60M18 0c-2 30 4 70 0 100s3 60 1 80M31 0c3 50-4 90 0 130s-1 40 1 50M41 0c-1 45 3 75-1 110s2 55 0 70" fill="none" stroke="#3b2414" stroke-opacity=".22" stroke-width="1.1"/><ellipse cx="25" cy="95" rx="2.5" ry="9" fill="#3b2414" fill-opacity=".16"/></pattern>
<pattern id="vetaH" width="220" height="14" patternUnits="userSpaceOnUse"><path d="M0 3c50 3 110-2 220 1M0 8c70-3 140 3 220-1M0 12c60 2 120-2 220 1" fill="none" stroke="#3b2414" stroke-opacity=".25" stroke-width="1"/></pattern>
<pattern id="marmol" width="260" height="40" patternUnits="userSpaceOnUse"><path d="M0 12c30-6 50 4 80-3s60-8 90 2 60 0 90-5M40 0c10 8 30 16 45 40M170 40c15-16 40-24 60-40M0 30c40 4 80-6 120 2" fill="none" stroke="#8a8a8a" stroke-opacity=".45" stroke-width=".9"/></pattern>
<pattern id="marmolN" width="260" height="40" patternUnits="userSpaceOnUse"><path d="M0 12c30-6 50 4 80-3s60-8 90 2 60 0 90-5M40 0c10 8 30 16 45 40M170 40c15-16 40-24 60-40M0 30c40 4 80-6 120 2" fill="none" stroke="#d9c7a3" stroke-opacity=".55" stroke-width=".9"/></pattern>
<pattern id="azulejo" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 .5h22M0 11.5h22M.5 0v11M11.5 11v11" stroke="#000" stroke-opacity=".22" stroke-width="1"/><path d="M0 1.5h22M0 12.5h22" stroke="#fff" stroke-opacity=".35" stroke-width="1"/></pattern>
<linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd4e6"/><stop offset=".7" stop-color="#e9f0f2"/><stop offset="1" stop-color="#cfd9c4"/></linearGradient>
<linearGradient id="cieloNoche" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1026"/><stop offset="1" stop-color="#1c2340"/></linearGradient>
<linearGradient id="sueloLuz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset=".12" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
<linearGradient id="luzLed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd9a0" stop-opacity=".95"/><stop offset=".6" stop-color="#ffcf8a" stop-opacity=".35"/><stop offset="1" stop-color="#ffcf8a" stop-opacity=".15"/></linearGradient>
<linearGradient id="luzEncimera" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd59a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd59a" stop-opacity=".1"/></linearGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#ffe2b0" stop-opacity=".85"/><stop offset=".35" stop-color="#ffcf8a" stop-opacity=".3"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/></radialGradient>
<linearGradient id="cristal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3d42"/><stop offset=".5" stop-color="#101113"/><stop offset="1" stop-color="#26282c"/></linearGradient>
<linearGradient id="brilloMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".15"/></linearGradient>
<linearGradient id="brilloPlaca" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="ambiente" cx=".45" cy=".4" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></radialGradient>
</defs>`;

export const svgCocina = (estado) => DEFS + dibujo(estado) + '<rect x="0" y="110" width="1000" height="510" fill="url(#ambiente)" pointer-events="none"/>';
