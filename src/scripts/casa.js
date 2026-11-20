// «Recorre la casa»: maqueta isométrica de la portada. Cada habitación lleva a sus páginas.
// Se dibuja en SVG con una proyección propia (sin librerías). Los datos (textos, enlaces y fotos) vienen de Casa.astro.

const U = 26, C = Math.cos(Math.PI / 6), S = 0.5;
let EX = [C, S], EY = [-C, S];
const P = (x, y, z = 0) => [(x * EX[0] + y * EY[0]) * U, (x * EX[1] + y * EY[1]) * U - z * U];
const f1 = (n) => (+n).toFixed(1);
const pts = (a) => a.map((p) => P(...p).map(f1).join(',')).join(' ');
const lin = (a, b) => { const p = P(...a), q = P(...b); return `M${f1(p[0])} ${f1(p[1])}L${f1(q[0])} ${f1(q[1])}`; };
function tono(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  return `rgb(${c})`;
}
const poli = (p, fill, st, sw = 0.7) => `<polygon points="${pts(p)}" fill="${fill}"${st ? ` stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"` : ''}/>`;
const mPlano = (x, y, z = 0) => { const [px, py] = P(x, y, z); return `matrix(${(EX[0] * U).toFixed(3)},${(EX[1] * U).toFixed(3)},${(EY[0] * U).toFixed(3)},${(EY[1] * U).toFixed(3)},${f1(px)},${f1(py)})`; };
const mMuro = (s, x, y, z) => { const e = s === 'n' ? EX : EY, [px, py] = P(x, y, z); return `matrix(${(e[0] * U).toFixed(3)},${(e[1] * U).toFixed(3)},0,${-U},${f1(px)},${f1(py)})`; };
function azar(x, y) { let s = Math.abs(Math.round((x * 73.1 + y * 31.7) * 100)) % 2147483646 + 1; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; }

// Caja con sus tres caras visibles; opciones: blando (esquinas redondeadas), tapa (color de arriba),
// fy/fx (puertas en la cara de delante o de la derecha), caj (líneas de cajones), tir (tiradores), tirZ (altura del tirador).
function caja(x, y, z, w, d, h, col, o = {}) {
  const caras = [
    [[[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], tono(col, 0.68)],
    [[[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], tono(col, 0.84)],
    [[[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], o.tapa || col],
  ];
  let s = '';
  for (const [p, c] of caras) s += o.blando ? `<polygon points="${pts(p)}" fill="${c}" stroke="${c}" stroke-width="${o.blando}" stroke-linejoin="round"/>` : poli(p, c, tono(col, 0.5));
  const ln = tono(col, 0.55);
  if (o.fy) {
    const dw = w / o.fy; let dd = '';
    for (let i = 1; i < o.fy; i++) dd += lin([x + i * dw, y + d, z + 0.02], [x + i * dw, y + d, z + h - 0.02]);
    (o.caj || []).forEach((t) => (dd += lin([x + 0.02, y + d, z + h * t], [x + w - 0.02, y + d, z + h * t])));
    if (dd) s += `<path d="${dd}" stroke="${ln}" stroke-width=".8" fill="none"/>`;
    if (o.tir) { let tt = ''; const zz = z + h * (o.tirZ ?? 0.85); for (let i = 0; i < o.fy; i++) tt += lin([x + i * dw + dw * 0.32, y + d + 0.01, zz], [x + i * dw + dw * 0.68, y + d + 0.01, zz]); s += `<path d="${tt}" stroke="${o.tir}" stroke-width="1.6" stroke-linecap="round"/>`; }
  }
  if (o.fx) {
    const dw = d / o.fx; let dd = '';
    for (let i = 1; i < o.fx; i++) dd += lin([x + w, y + i * dw, z + 0.02], [x + w, y + i * dw, z + h - 0.02]);
    (o.caj || []).forEach((t) => (dd += lin([x + w, y + 0.02, z + h * t], [x + w, y + d - 0.02, z + h * t])));
    if (dd) s += `<path d="${dd}" stroke="${tono(col, 0.45)}" stroke-width=".8" fill="none"/>`;
    if (o.tir) { let tt = ''; const zz = z + h * (o.tirZ ?? 0.85); for (let i = 0; i < o.fx; i++) tt += lin([x + w + 0.01, y + i * dw + dw * 0.32, zz], [x + w + 0.01, y + i * dw + dw * 0.68, zz]); s += `<path d="${tt}" stroke="${o.tir}" stroke-width="1.6" stroke-linecap="round"/>`; }
  }
  return s;
}
const disco = (x, y, z, r, fill, st = 'none', sw = 1) => `<circle r="${r}" fill="${fill}" stroke="${st}" stroke-width="${sw}" vector-effect="non-scaling-stroke" transform="${mPlano(x, y, z)}"/>`;
function cilindro(x, y, z, r, h, arriba, lado) {
  const rx = r * U * Math.hypot(EX[0], EY[0]), [bx, by] = P(x, y, z), [, ty] = P(x, y, z + h);
  return disco(x, y, z, r, lado) + `<rect x="${f1(bx - rx)}" y="${f1(ty)}" width="${f1(2 * rx)}" height="${f1(by - ty)}" fill="${lado}"/>` + disco(x, y, z + h, r, arriba);
}

// ---------- Habitaciones ----------
// Cada habitación es una función que recibe «c» (la sala: posición, tamaño y qué muros son exteriores) y va colocando cosas.
const SOMBRA = 'rgba(60,40,20,.34)';
const BLA = '#f3f0ea', MAD = '#c9a27a', MADO = '#8a6a4c', ROB = '#b98d62', NEG = '#2c2c30';
const ROPA = ['#e9e3d8', '#2f3a4a', '#9a6b4f', '#c9bfae', '#5d6b7d', '#7a3b33', '#d8cfc0', '#3d4a3a', '#b9a58a'];
const LIBROS = ['#a8543e', '#d8c09a', '#3f5d7a', '#6b7f5a', '#e8e2d6', '#8a6a4c', '#2f2f33', '#c9a27a'];

const HAB = {
  cocina(c) {
    c.azulejo('n', 0, 0.91, 3.3, 0.6); c.ven('o', 1.15, 1.05, 1.3, 1);
    c.b(0, 0, 0, 3.3, 0.6, 0.86, BLA, { fy: 5, caj: [0.62], tir: '#4a4a4a', tirZ: 0.9 });
    c.b(0, 0, 0.86, 3.32, 0.64, 0.05, ROB);
    c.b(0, 0.6, 0, 0.6, 2.2, 0.86, BLA, { fx: 3, caj: [0.62], tir: '#4a4a4a', tirZ: 0.9 });
    c.b(0, 0.6, 0.86, 0.64, 2.2, 0.05, ROB);
    c.b(0.1, 1.4, 0.91, 0.42, 0.62, 0.008, '#9a9ea3'); c.cil(0.06, 1.71, 0.91, 0.025, 0.28, '#c3c6ca', '#a3a7ab');
    c.b(1.25, 0.08, 0.912, 0.7, 0.46, 0.006, '#1f1f22');
    [[1.42, 0.2], [1.75, 0.2], [1.42, 0.42], [1.75, 0.42]].forEach(([a, b]) => c.disco(a, b, 0.92, 0.08, 'none', '#55585c'));
    c.b(3.3, 0, 0, 0.7, 0.66, 2.15, '#e3e0da', { fy: 1, caj: [0.42], tir: '#8b8f94', tirZ: 0.55 });
    c.b(0, 0, 1.5, 1.2, 0.36, 0.75, BLA, { fy: 2, tir: '#4a4a4a', tirZ: 0.12 });
    c.b(2.05, 0, 1.5, 1.25, 0.36, 0.75, BLA, { fy: 2, tir: '#4a4a4a', tirZ: 0.12 });
    c.b(1.4, 0, 1.55, 0.55, 0.46, 0.12, '#b6b9bd'); c.b(1.55, 0, 1.67, 0.25, 0.2, 0.98, '#b6b9bd');
    c.planta(2.95, 0.3, 0.91, 0.55);
    c.b(1.5, 2.05, 0, 1.8, 0.85, 0.86, ROB, { fy: 3, tir: '#3a3a3a', tirZ: 0.9 });
    c.b(1.45, 2, 0.86, 1.9, 0.95, 0.05, '#f6f3ee');
    c.disco(2.4, 2.45, 0.92, 0.2, '#e8e2d6', '#c9c1b2'); c.disco(2.36, 2.42, 0.95, 0.06, '#c9783d'); c.disco(2.46, 2.5, 0.95, 0.06, '#9bb04a');
    [1.85, 2.5, 3.1].forEach((a) => { c.cil(a, 3.3, 0, 0.03, 0.6, '#2f2f33', '#2f2f33'); c.cil(a, 3.3, 0.6, 0.17, 0.05, '#3a3a3e', '#2f2f33'); });
  },
  salon(c) {
    c.ven('n', 3.75, 0.9, 1, 1.25);
    c.b(0.5, 0, 0, 3, 0.45, 0.45, MADO, { fy: 4 });
    c.b(1.25, 0.04, 0.75, 1.5, 0.05, 0.85, '#141416');
    c.b(0.5, 0, 1.75, 0.9, 0.25, 0.035, MADO); c.libros(0.55, 0.02, 1.785, 0.75, 'x', 0.2);
    c.b(2.6, 0, 1.75, 0.9, 0.25, 0.035, MADO); c.planta(3.2, 0.12, 1.785, 0.45);
    c.disco(2.2, 2.15, 0.01, 1.3, '#e2d4bc'); c.disco(2.2, 2.15, 0.012, 1.12, 'none', '#c5b393', 1.2);
    c.cil(2.2, 2.05, 0, 0.42, 0.36, '#c9a27a', '#a8835c');
    c.disco(2.1, 2.0, 0.37, 0.09, '#e8e2d6'); c.b(2.3, 1.95, 0.36, 0.22, 0.3, 0.05, '#a8543e');
    c.b(0.8, 2.95, 0, 3, 0.8, 0.25, '#8e8a84', { blando: 3 });
    for (let i = 0; i < 3; i++) c.b(0.97 + i * 0.9, 2.97, 0.25, 0.86, 0.58, 0.14, '#aaa59e', { blando: 3 });
    c.b(0.8, 3.5, 0.25, 3, 0.3, 0.52, '#8e8a84', { blando: 3 });
    c.b(0.8, 2.95, 0.25, 0.17, 0.8, 0.25, '#8e8a84', { blando: 3 }); c.b(3.63, 2.95, 0.25, 0.17, 0.8, 0.25, '#8e8a84', { blando: 3 });
    c.b(1.1, 3.3, 0.39, 0.36, 0.14, 0.3, '#c9a27a', { blando: 4 }); c.b(3.15, 3.3, 0.39, 0.36, 0.14, 0.3, '#5f7a6a', { blando: 4 });
    c.lampPie(4.5, 3.3); c.planta(4.55, 0.4, 0, 1.25);
  },
  vestidor(c) {
    const T = '#d9b48b';
    c.b(0, 0, 0, 4, 0.08, 2.3, '#a98460');
    c.ropa(0.12, 0.15, 2.05, 1.15);
    for (const z of [0.55, 0.95, 1.35, 1.75]) {
      c.b(1.39, 0.08, z, 1.27, 0.55, 0.03, T);
      const r = azar(z, 3);
      for (let k = 0; k < 3; k++) c.b(1.48 + k * 0.4, 0.2, z + 0.03, 0.32, 0.38, 0.1 + r() * 0.1, ROPA[(k * 3 + Math.round(z * 10)) % ROPA.length], { blando: 1.5 });
    }
    c.b(1.39, 0.08, 0, 1.27, 0.55, 0.5, T, { fy: 1, caj: [0.5], tir: '#5a4636', tirZ: 0.78 });
    c.ropa(2.78, 0.15, 2.05, 1.1, true);
    c.b(2.72, 0.08, 0, 1.22, 0.55, 0.03, T);
    for (let k = 0; k < 5; k++) c.b(2.8 + k * 0.22, 0.25, 0.03, 0.16, 0.3, 0.09, ['#2f2f33', '#9a6b4f', '#e9e3d8'][k % 3]);
    [0, 1.33, 2.66, 3.94].forEach((a) => c.b(a, 0.08, 0, 0.06, 0.55, 2.3, T));
    c.b(0, 0.08, 2.25, 4, 0.55, 0.05, T);
    c.disco(1.9, 2.45, 0.01, 1.15, '#d8c7ae');
    c.b(1.2, 1.9, 0, 1.4, 1.1, 0.9, BLA, { fy: 2, caj: [0.33, 0.66], tir: '#8a6a4c', tirZ: 0.5 });
    c.b(1.2, 1.9, 0.9, 1.4, 1.1, 0.03, '#c3d0d6');
    c.cil(3.2, 3, 0, 0.28, 0.4, '#d6ccbb', '#bdb2a0');
    c.b(0.05, 3, 0, 0.06, 0.7, 1.8, '#b3bcc9');
  },
  taller(c, F) {
    c.cuadro('n', 0.25, 1.3, 0.8, 1, F.abuelo); c.cuadro('n', 1.2, 1.45, 1.5, 0.85, F.fachada);
    c.tablero('n', 2.85, 1.2, 0.65, 0.85); c.ven('n', 3.65, 0.95, 1.1, 1.15);
    c.b(0.2, 0.05, 0, 3.4, 0.8, 0.82, '#7a5c40', { fy: 3, caj: [0.35], tir: '#2a2a2a', tirZ: 0.2 });
    c.b(0.15, 0, 0.82, 3.5, 0.9, 0.08, '#dcbb90');
    c.b(0.35, 0.2, 0.9, 0.28, 0.32, 0.18, '#4a4f57'); c.b(1.5, 0.3, 0.9, 1.3, 0.26, 0.04, '#e6c79e'); c.b(2.95, 0.35, 0.9, 0.35, 0.22, 0.12, '#c94f3d');
    c.disco(2.5, 1.6, 0.01, 0.9, 'rgba(230,205,160,.45)'); c.disco(1.2, 3.2, 0.01, 0.5, 'rgba(230,205,160,.35)');
    c.b(1.7, 2, 0, 1.4, 1, 0.8, '#4a4f57', { fy: 1, caj: [0.6] });
    c.b(1.65, 1.95, 0.8, 1.5, 1.1, 0.05, '#aab0b7'); c.b(2.35, 2.2, 0.85, 0.08, 0.5, 0.14, '#c94f3d');
    c.b(3.95, 0.5, 0, 0.85, 2.6, 0.3, '#d9b48b'); c.b(4, 0.6, 0.3, 0.75, 2.4, 0.12, '#c49a6c'); c.b(4, 0.7, 0.42, 0.75, 2, 0.1, '#e0bf95');
    c.cil(0.75, 2.4, 0, 0.2, 0.62, '#c9a27a', '#a8835c');
    c.b(0.4, 3.1, 0, 0.6, 0.35, 0.2, MAD); c.b(0.5, 3.45, 0, 0.35, 0.3, 0.14, MADO);
  },
  galeria(c, F) {
    c.cuadro('o', 0.2, 1.15, 1, 0.8, F.g1); c.cuadro('o', 1.4, 1, 0.8, 1.1, F.g2); c.cuadro('o', 2.4, 1.2, 1.05, 0.75, F.g3);
    c.forma('M.75 .3H1.9V3.6H.75Z', 0.01, '#a8543e'); c.forma('M.85 .4H1.8V3.5H.85Z', 0.012, 'none', '#e0c9a6');
    c.b(1.25, 1.2, 0, 0.5, 1.4, 0.42, MADO);
    c.planta(1.95, 0.35, 0, 1.35);
    c.b(0.6, 3.86, 0, 1.15, 0.14, 2.15, '#a97c52', { fy: 1 });
    c.b(0.72, 4, 0.15, 0.91, 0.005, 1.85, '#b88c60'); c.b(1.55, 4.01, 1, 0.07, 0.05, 0.1, '#e6e2da');
  },
  bano(c) {
    c.b(0.15, 0.25, 0, 0.85, 1.75, 0.55, '#f7f5f1', { blando: 6 });
    c.forma('M.32 .45H.83V1.82H.32Z', 0.56, '#a7cfe0');
    c.b(1.35, 0, 0.3, 1.35, 0.5, 0.48, ROB, { fy: 2, tir: '#2a2a2a', tirZ: 0.8 });
    c.b(1.35, 0, 0.78, 1.35, 0.5, 0.04, '#f6f3ee'); c.disco(2.02, 0.25, 0.83, 0.17, '#ffffff', '#c9cfd3');
    c.cil(2.02, 0.06, 0.82, 0.02, 0.18, '#c3c6ca', '#a3a7ab');
    c.b(2.95, 0.08, 0.4, 0.42, 0.18, 0.4, '#f7f5f1', { blando: 4 }); c.b(2.95, 0.15, 0, 0.42, 0.6, 0.4, '#f7f5f1', { blando: 5 });
    c.forma('M1.4 1.2H2.6V1.9H1.4Z', 0.01, '#e8e2d6');
    c.planta(0.4, 3.4, 0, 0.95);
  },
  dormitorio(c) {
    c.b(1, 0.1, 0, 2.5, 0.14, 1.05, MADO, { fy: 6 });
    c.b(1, 0.24, 0, 2.5, 2.35, 0.28, '#9a7a58');
    c.b(1.05, 0.26, 0.28, 2.4, 2.3, 0.16, '#f2eee6', { blando: 3 });
    c.b(1.25, 0.35, 0.44, 0.95, 0.45, 0.15, '#fbf9f5', { blando: 5 }); c.b(2.3, 0.35, 0.44, 0.95, 0.45, 0.15, '#fbf9f5', { blando: 5 });
    c.b(1.02, 1.05, 0.44, 2.46, 1.52, 0.08, '#c9bfae', { blando: 4 });
    c.b(1.02, 1.05, 0.52, 2.46, 0.25, 0.03, '#efe8dc', { blando: 2 });
    c.b(1.02, 2.15, 0.52, 2.46, 0.38, 0.02, '#a8543e', { blando: 2 });
    c.b(0.3, 0.15, 0, 0.55, 0.45, 0.5, MAD, { fy: 1, caj: [0.5], tir: '#5a4636', tirZ: 0.75 }); c.lampMesa(0.58, 0.37, 0.5);
    c.b(3.65, 0.15, 0, 0.55, 0.45, 0.5, MAD, { fy: 1, caj: [0.5], tir: '#5a4636', tirZ: 0.75 }); c.lampMesa(3.93, 0.37, 0.5);
    c.forma('M.6 2.35Q.6 2.2 .8 2.2H3.7Q3.9 2.2 3.9 2.35V3.55Q3.9 3.7 3.7 3.7H.8Q.6 3.7 .6 3.55Z', 0.008, '#e3d8c6');
    c.planta(4.1, 3.3, 0, 1.2); c.planta(5.9, 0.4, 0, 1.3);
  },
  ocio(c) {
    c.forma('M.2 .3H3.3V3.7H.2Z', 0.008, '#8796ab');
    c.b(0.45, 0.7, 0, 2.3, 1.3, 0.72, '#6b4f38');
    c.b(0.55, 0.8, 0.72, 2.1, 1.1, 0.05, '#3f7a5a');
    [[1.1, 1.1, '#f1eee8'], [1.9, 1.4, '#c94f3d'], [2.1, 1.0, '#e0b84a'], [1.5, 1.6, '#2f2f33']].forEach(([a, b, k]) => c.disco(a, b, 0.78, 0.05, k));
    c.cil(0.6, 3.05, 0, 0.36, 0.28, '#c94f3d', '#a63f30');
    c.cil(1.45, 3.25, 0, 0.32, 0.26, '#e0b84a', '#bf9a37');
    c.b(2.65, 2.6, 0, 0.62, 0.7, 1.7, '#2f45c8', { blando: 2 });
    c.pantalla(2.72, 3.3, 1.05, 0.48, 0.42);
    c.b(2.65, 3.3, 0.85, 0.62, 0.15, 0.06, '#1e2a80');
    // en el móvil la sala es más ancha
    c.b(4.6, 0.05, 0, 2.6, 0.25, 0.85, '#4a4f6a', { blando: 3 }); c.b(4.6, 0.3, 0, 2.6, 0.7, 0.42, '#5a5f7a', { blando: 3 });
    c.b(5.2, 2.3, 0, 1.5, 0.45, 0.5, MAD, { fy: 3 }); c.planta(8.3, 0.4, 0, 1.2);
  },
  despacho(c) {
    c.b(0.35, 0, 0.72, 2.5, 0.85, 0.05, '#d9b48b');
    [[0.4, 0.05], [2.75, 0.05], [0.4, 0.75]].forEach(([a, b]) => c.b(a, b, 0, 0.05, 0.05, 0.72, '#5a4636'));
    c.b(2.15, 0.08, 0, 0.6, 0.72, 0.72, MAD, { fy: 1, caj: [0.33, 0.66], tir: '#5a4636', tirZ: 0.5 });
    c.b(1.53, 0.18, 0.77, 0.08, 0.08, 0.2, '#555'); c.b(1.2, 0.12, 0.95, 0.75, 0.04, 0.45, '#1b1b1e');
    c.b(0.55, 0.45, 0.77, 0.42, 0.3, 0.06, '#c94f3d'); c.b(0.58, 0.48, 0.83, 0.36, 0.24, 0.01, '#f1eee8');
    c.cil(2.45, 0.5, 0.77, 0.06, 0.12, '#e8e2d6', '#d0c9bd'); c.lampMesa(0.55, 0.15, 0.77);
    c.disco(1.55, 1.4, 0.01, 0.32, '#2f2f33'); c.cil(1.55, 1.4, 0, 0.04, 0.42, '#555', '#555');
    c.cil(1.55, 1.4, 0.42, 0.3, 0.07, '#3a3a3e', '#2c2c30'); c.b(1.3, 1.66, 0.5, 0.5, 0.08, 0.5, '#2c2c30', { blando: 3 });
    c.b(0, 1.5, 0, 0.06, 2.3, 1.3, MADO);
    for (const z of [0, 0.62, 1.26]) c.b(0.06, 1.5, z, 0.4, 2.3, 0.04, MAD);
    c.libros(0.1, 1.6, 0.04, 2.05, 'y', 0.3); c.libros(0.1, 1.6, 0.66, 1.6, 'y', 0.3);
    c.b(0.06, 1.5, 0, 0.4, 0.04, 1.3, MAD); c.b(0.06, 3.76, 0, 0.4, 0.04, 1.3, MAD);
    c.planta(0.25, 3.45, 1.3, 0.5);
    c.forma('M1 2.2Q1 2 1.2 2H3.2Q3.4 2 3.4 2.2V3.3Q3.4 3.5 3.2 3.5H1.2Q1 3.5 1 3.3Z', 0.008, '#d6c4a6');
    c.planta(3.45, 3.35, 0, 1.25);
  },
  entrada(c) {
    c.forma('M.62 0H1.72C1.78 .9 2.55 1.5 2.7 2.8H1.48C1.42 1.9 .62 1.2 .62 0Z', 0.008, '#ddd1b8');
    [[1.15, 0.35], [1.3, 0.95], [1.75, 1.5], [2.05, 2.1], [2.15, 2.6]].forEach(([a, b], i) => c.disco(a, b, 0.012, 0.2 - (i % 2) * 0.03, '#c1b59c', '#a99d84', 0.6));
    c.forma('M3.3 .25C4.4 .1 5.7 .3 5.75 .9C5.8 1.6 4.6 1.8 3.7 1.6C3 1.4 2.9 .4 3.3 .25Z', 0.008, '#6d5a45');
    c.arbusto(3.6, 0.7); c.arbusto(4.3, 1.1); c.arbusto(5.1, 0.7); c.arbusto(4.6, 0.45);
    c.poste(0.25, 0.4);
    c.b(0, 2.62, 0, 1.4, 0.18, 0.38, '#d6ccba', { tapa: '#e3dacb' });
    c.b(2.8, 2.62, 0, 3.2, 0.18, 0.38, '#d6ccba', { tapa: '#e3dacb' });
    c.buzon(3.0, 2.35);
  },
  jardin(c) {
    c.b(0, 2.62, 0, 12, 0.18, 0.38, '#d6ccba', { tapa: '#e3dacb' });
    c.olivo(1.2, 1.3); c.indicador(2.6, 2.05); c.olivo(3.7, 0.95);
    c.arbusto(2.2, 0.5); c.b(5, 1.9, 0, 1.4, 0.45, 0.42, MADO);
    c.olivo(6.2, 1.5); c.arbusto(7.4, 0.6); c.olivo(8.6, 1.0); c.olivo(11, 1.45); c.arbusto(10, 2.1);
  },
};

// ---------- Distribuciones [id, x, y, ancho, fondo] ----------
const PLANO_ANCHO = [
  ['cocina', 0, 0, 4, 4], ['salon', 4, 0, 5, 4], ['vestidor', 9, 0, 4, 4], ['taller', 13, 0, 5, 4],
  ['galeria', 0, 4, 2.5, 4], ['bano', 2.5, 4, 3.5, 4], ['dormitorio', 6, 4, 4.5, 4], ['ocio', 10.5, 4, 3.5, 4], ['despacho', 14, 4, 4, 4],
  ['entrada', 0, 8, 6, 2.8], ['jardin', 6, 8, 12, 2.8]];
const PLANO_ALTO = [
  ['cocina', 0, 0, 4, 4], ['taller', 4, 0, 5, 4],
  ['vestidor', 0, 4, 4, 4], ['salon', 4, 4, 5, 4],
  ['galeria', 0, 8, 2.5, 4], ['dormitorio', 2.5, 8, 6.5, 4],
  ['bano', 0, 12, 4, 4], ['despacho', 4, 12, 5, 4],
  ['ocio', 0, 16, 9, 3.5],
  ['entrada', 0, 19.5, 4.5, 2.8], ['jardin', 4.5, 19.5, 4.5, 2.8]];

const SUELOS = {
  cocina: ['baldosa', '#dcd5c9'], salon: ['tarima', '#bb9168'], vestidor: ['tarima', '#c9a77f'], taller: ['hormigon', '#aaa59c'],
  galeria: ['tarima', '#b5895f'], bano: ['baldosa', '#d3d9d8'], dormitorio: ['tarima', '#c29c74'], ocio: ['tarima', '#a9825c'],
  despacho: ['tarima', '#ad845c'], entrada: ['cesped', '#86a061'], jardin: ['cesped', '#86a061'],
};

function patron(id, [tipo, base]) {
  const m = mPlano(0, 0, 0).replace(/,[^,]+,[^,]+\)$/, ',0,0)');
  const L = tono(base, 0.8), Cl = tono(base, 1.08);
  const t = {
    tarima: [2.4, 0.5, `<rect width="2.4" height=".5" fill="${base}"/><rect y=".25" width="2.4" height=".25" fill="${tono(base, 0.95)}"/><path d="M0 .25H2.4M0 .5H2.4M.8 0V.25M1.9 .25V.5" stroke="${L}" stroke-width=".016"/>`],
    baldosa: [0.6, 0.6, `<rect width=".6" height=".6" fill="${base}"/><path d="M0 0H.6M0 0V.6" stroke="${tono(base, 0.88)}" stroke-width=".02"/>`],
    cesped: [0.5, 0.5, `<rect width=".5" height=".5" fill="${base}"/><path d="M.1 .2l.02-.07M.13 .2l.03-.06M.34 .42l.02-.07M.37 .42l.03-.05" stroke="${tono(base, 0.78)}" stroke-width=".015"/><circle cx=".4" cy=".12" r=".025" fill="${Cl}"/>`],
    hormigon: [1.5, 1.5, `<rect width="1.5" height="1.5" fill="${base}"/><circle cx=".3" cy=".4" r=".02" fill="${L}"/><circle cx="1.1" cy=".9" r=".025" fill="${Cl}"/><path d="M0 0H1.5M0 0V1.5" stroke="${tono(base, 0.9)}" stroke-width=".015"/>`],
  }[tipo];
  return `<pattern id="p-${id}" patternUnits="userSpaceOnUse" width="${t[0]}" height="${t[1]}" patternTransform="${m}">${t[2]}</pattern>`;
}

// ---------- Montaje ----------
export function montarCasa(seccion) {
  const svg = seccion.querySelector('svg.casa-svg');
  const panel = seccion.querySelector('.casa-panel');
  const datos = JSON.parse(seccion.querySelector('script[type="application/json"]').textContent);
  const SALAS = datos.salas, F = datos.fotos;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cajasSala = {}, vbCasa, movil, actual = null, anim;

  function dibujar() {
    movil = innerWidth < 760;
    const plano = movil ? PLANO_ALTO : PLANO_ANCHO;
    if (movil) { EX = [0.96, 0.3]; EY = [-0.26, 0.8]; } else { EX = [C, S]; EY = [-C, S]; }
    seccion.classList.toggle('es-movil', movil);
    const W = Math.max(...plano.map((r) => r[1] + r[3]));
    const Dint = Math.max(...plano.filter((r) => !SALAS[r[0]].ext).map((r) => r[2] + r[4]));
    const Dtot = Math.max(...plano.map((r) => r[2] + r[4]));
    let defs = `<filter id="casa-difu" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <filter id="casa-difu-g" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
      <radialGradient id="casa-brillo"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".75"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>
      <linearGradient id="casa-cristal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3eef4"/><stop offset="1" stop-color="#9db7c8"/></linearGradient>
      <pattern id="casa-azul-n" patternUnits="userSpaceOnUse" width=".3" height=".15" patternTransform="matrix(${EX[0] * U},${EX[1] * U},0,${-U},0,0)"><rect width=".3" height=".15" fill="#f6f4f0"/><path d="M0 0H.3M0 0V.15" stroke="#d9d4cb" stroke-width=".012"/></pattern>
      <pattern id="casa-azul-o" patternUnits="userSpaceOnUse" width=".3" height=".15" patternTransform="matrix(${EY[0] * U},${EY[1] * U},0,${-U},0,0)"><rect width=".3" height=".15" fill="#f6f4f0"/><path d="M0 0H.3M0 0V.15" stroke="#d9d4cb" stroke-width=".012"/></pattern>`;
    // tablero de la maqueta y su sombra sobre la mesa
    let out = `<polygon points="${pts([[-0.4, -0.2, -0.5], [W + 0.5, -0.2, -0.5], [W + 0.5, Dtot + 0.6, -0.5], [-0.4, Dtot + 0.6, -0.5]])}" fill="rgba(70,50,30,.32)" filter="url(#casa-difu-g)"/>`;
    out += caja(-0.6, -0.6, -0.32, W + 1.2, Dtot + 1.1, 0.32, '#d9c4a2', { tapa: '#e6d5b8' });
    let etiquetas = '';
    const orden = plano.slice().sort((a, b) => (!!SALAS[a[0]].ext - !!SALAS[b[0]].ext) || a[2] - b[2] || a[1] - b[1]);
    orden.forEach(([id, x, y, w, d], i) => {
      const sala = SALAS[id], ext = !!sala.ext;
      defs += patron(id, SUELOS[id]);
      const nExt = y === 0, oExt = x === 0;
      let cuerpo = '', sombras = '', luces = '';
      const cerca = (mx, my) => !ext && !((my < 0.7 && nExt) || (mx < 0.7 && oExt)) && ((my < 0.7 && !nExt) || (mx < 0.7 && !oExt));
      const c = {
        w, d,
        b(mx, my, mz, bw, bd, bh, col, o) {
          if (mx >= w - 0.15) return;
          if (cerca(mx, my) && mz + bh > 1.1) { if (mz >= 1.05) return; bh = 1.1 - mz; }
          if (mz === 0 && bh > 0.15 && !o?.sinSombra) sombras += `<polygon points="${pts([[x + mx + 0.04, y + my + 0.04, 0], [x + mx + bw + 0.2, y + my + 0.04, 0], [x + mx + bw + 0.2, y + my + bd + 0.2, 0], [x + mx + 0.04, y + my + bd + 0.2, 0]])}"/>`;
          cuerpo += caja(x + mx, y + my, mz, bw, bd, bh, col, o);
        },
        disco(mx, my, z, r, fill, st, sw) { if (mx < w - 0.1) cuerpo += disco(x + mx, y + my, z, r, fill, st, sw); },
        cil(mx, my, z, r, h, a, l) {
          if (mx >= w - 0.1) return;
          if (z === 0 && h > 0.15) sombras += disco(x + mx + 0.1, y + my + 0.1, 0, r * 1.1, SOMBRA);
          cuerpo += cilindro(x + mx, y + my, z, r, h, a, l);
        },
        forma(dd, z, fill, st) { cuerpo += `<path d="${dd}" fill="${fill}" stroke="${st || 'none'}" stroke-width="${st ? 1.2 : 0}" vector-effect="non-scaling-stroke" transform="${mPlano(x, y, z)}"/>`; },
        ven(s, pos, z, len, h) {
          if (!(s === 'n' ? nExt : oExt)) return;
          const X = s === 'n' ? x : x + 0.02, Y = s === 'n' ? y + 0.02 : y, M = (a, b, l, hh) => s === 'n' ? [[X + a, Y, b], [X + a + l, Y, b], [X + a + l, Y, b + hh], [X + a, Y, b + hh]] : [[X, Y + a, b], [X, Y + a + l, b], [X, Y + a + l, b + hh], [X, Y + a, b + hh]];
          cuerpo += poli(M(pos - 0.07, z - 0.07, len + 0.14, h + 0.14), '#fbf9f5', '#cfc8bc') + poli(M(pos, z, len, h), 'url(#casa-cristal)');
          cuerpo += `<path d="${lin(M(pos + len / 2, z, 0, h)[0], M(pos + len / 2, z, 0, h)[3])}${lin(M(pos, z + h * 0.55, len, 0)[0], M(pos, z + h * 0.55, len, 0)[1])}" stroke="#fbf9f5" stroke-width="2"/>`;
          const q = s === 'n' ? [[x + pos + 0.3, y + 0.15], [x + pos + len + 0.3, y + 0.15], [x + pos + len + 1, y + 1.7], [x + pos + 1, y + 1.7]] : [[x + 0.15, y + pos + 0.3], [x + 1.7, y + pos + 1], [x + 1.7, y + pos + len + 1], [x + 0.15, y + pos + len + 0.3]];
          luces += poli(q.map((p) => [p[0], p[1], 0.01]), 'rgba(255,246,225,.32)');
        },
        azulejo(s, pos, z, len, h) {
          if (!(s === 'n' ? nExt : oExt)) return;
          const q = s === 'n' ? [[x + pos, y + 0.01, z], [x + pos + len, y + 0.01, z], [x + pos + len, y + 0.01, z + h], [x + pos, y + 0.01, z + h]] : [[x + 0.01, y + pos, z], [x + 0.01, y + pos + len, z], [x + 0.01, y + pos + len, z + h], [x + 0.01, y + pos, z + h]];
          cuerpo += poli(q, `url(#casa-azul-${s})`);
        },
        cuadro(s, pos, z, len, h, src) {
          if (!(s === 'n' ? nExt : oExt) || !src) return;
          const X = s === 'n' ? x : x + 0.02, Y = s === 'n' ? y + 0.02 : y;
          const M = (a, b, l, hh) => s === 'n' ? [[X + a, Y, b], [X + a + l, Y, b], [X + a + l, Y, b + hh], [X + a, Y, b + hh]] : [[X, Y + a, b], [X, Y + a + l, b], [X, Y + a + l, b + hh], [X, Y + a, b + hh]];
          cuerpo += poli(M(pos, z, len, h), '#3a2f25', '#21190f') + poli(M(pos + 0.04, z + 0.04, len - 0.08, h - 0.08), '#faf8f4');
          const a = pos + 0.1, l = len - 0.2, hh = h - 0.2;
          const o = s === 'n' ? [X + a, Y + 0.01, z + 0.1 + hh] : [X + 0.01, Y + a, z + 0.1 + hh];
          const [ox, oy] = P(...o), e = s === 'n' ? EX : EY;
          cuerpo += `<image href="${src}" width="1" height="1" preserveAspectRatio="xMidYMid slice" transform="matrix(${(l * e[0] * U).toFixed(2)},${(l * e[1] * U).toFixed(2)},0,${(hh * U).toFixed(2)},${f1(ox)},${f1(oy)})"/>`;
        },
        tablero(s, pos, z, len, h) {
          if (!(s === 'n' ? nExt : oExt)) return;
          const Y = y + 0.02;
          cuerpo += poli([[x + pos, Y, z], [x + pos + len, Y, z], [x + pos + len, Y, z + h], [x + pos, Y, z + h]], '#c9b08a', '#9c8360');
          let t = '';
          [[0.12, 0.25, 0.5], [0.3, 0.2, 0.62], [0.48, 0.3, 0.55]].forEach(([a, b0, b1]) => (t += lin([x + pos + a, Y + 0.01, z + b0], [x + pos + a, Y + 0.01, z + b1 + 0.15])));
          cuerpo += `<path d="${t}" stroke="#3a3a3e" stroke-width="2.2" stroke-linecap="round"/>`;
        },
        libros(mx, my, z, len, eje, prof) {
          const r = azar(mx + z, my); let p = 0, k = 0;
          while (p < len - 0.06) {
            const wv = 0.05 + r() * 0.05, hv = 0.2 + r() * 0.13, col = LIBROS[(k + Math.floor(r() * 3)) % LIBROS.length];
            if (r() > 0.88) { p += 0.08; k++; continue; }
            if (eje === 'x') c.b(mx + p, my, z, wv, prof, hv, col, { sinSombra: true }); else c.b(mx, my + p, z, prof, wv, hv, col, { sinSombra: true });
            p += wv + 0.005; k++;
          }
        },
        ropa(mx, my, ztop, len, larga) {
          const r = azar(mx, ztop); let p = 0, k = 0;
          cuerpo += `<path d="${lin([x + mx, y + my + 0.2, ztop + 0.05], [x + mx + len, y + my + 0.2, ztop + 0.05])}" stroke="#8b8f94" stroke-width="1.4"/>`;
          while (p < len - 0.06) {
            const wv = 0.06 + r() * 0.04, hv = (larga ? 0.9 : 0.6) + r() * 0.35;
            c.b(mx + p, my, ztop - hv, wv, 0.4, hv, ROPA[(k * 5 + Math.floor(r() * 4)) % ROPA.length], { blando: 1.6, sinSombra: true });
            p += wv + 0.02; k++;
          }
        },
        planta(mx, my, z = 0, t = 1) {
          if (mx >= w - 0.1) return;
          const r = azar(mx * 3 + z, my * 7);
          if (z === 0) sombras += disco(x + mx + 0.08, y + my + 0.08, 0, 0.22 * t, SOMBRA);
          cuerpo += cilindro(x + mx, y + my, z, 0.15 * Math.sqrt(t), 0.28 * Math.sqrt(t), '#5a4030', '#b9785a');
          const [bx, by] = P(x + mx, y + my, z + 0.28 * Math.sqrt(t));
          const n = Math.round(7 + 4 * t), verdes = ['#4f6b3d', '#5f7d48', '#6f8f55', '#3f5a33', '#7c9a5f'];
          let hojas = '';
          for (let k = 0; k < n; k++) {
            const ang = -165 + (150 * k) / (n - 1) + (r() - 0.5) * 18, len = (11 + r() * 8) * t, rad = (ang * Math.PI) / 180;
            const cx = bx + Math.cos(rad) * len * 0.55, cy = by + Math.sin(rad) * len * 0.55;
            hojas += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(len * 0.55)}" ry="${f1(len * 0.19)}" fill="${verdes[k % 5]}" transform="rotate(${f1(ang)} ${f1(cx)} ${f1(cy)})"/>`;
          }
          cuerpo += hojas;
        },
        arbusto(mx, my) {
          if (mx >= w - 0.1) return;
          const r = azar(mx, my), [cx, cy] = P(x + mx, y + my, 0.22);
          sombras += disco(x + mx + 0.1, y + my + 0.1, 0, 0.32, SOMBRA);
          let s = '';
          for (let k = 0; k < 9; k++) s += `<circle cx="${f1(cx + (r() - 0.5) * 16)}" cy="${f1(cy + (r() - 0.5) * 8)}" r="${f1(4 + r() * 3.5)}" fill="${['#5f7d48', '#6f8f55', '#7f9d62', '#557344'][k % 4]}"/>`;
          for (let k = 0; k < 6; k++) s += `<circle cx="${f1(cx + (r() - 0.5) * 16)}" cy="${f1(cy - 3 + (r() - 0.5) * 8)}" r="1.1" fill="#f2e8bf"/>`;
          cuerpo += s;
        },
        olivo(mx, my) {
          if (mx >= w - 0.3) return;
          const r = azar(mx, my);
          sombras += disco(x + mx + 0.3, y + my + 0.3, 0, 0.85, SOMBRA);
          const [bx, by] = P(x + mx, y + my, 0), [tx, ty] = P(x + mx, y + my, 1.05);
          cuerpo += `<path d="M${f1(bx - 2)} ${f1(by)}C${f1(bx + 5)} ${f1(by - 8)} ${f1(tx - 6)} ${f1(ty + 12)} ${f1(tx)} ${f1(ty)}M${f1(bx + 1)} ${f1(by - 4)}C${f1(bx + 8)} ${f1(by - 12)} ${f1(tx + 9)} ${f1(ty + 8)} ${f1(tx + 8)} ${f1(ty - 2)}" stroke="#5b4636" stroke-width="3.6" stroke-linecap="round" fill="none"/>`;
          const bol = [];
          for (let k = 0; k < 22; k++) bol.push([(r() - 0.5) * 50, (r() - 0.6) * 30, 6 + r() * 6, ['#7b8c5c', '#8a9a6a', '#9aab7a', '#a9b78b', '#6e7f50'][k % 5]]);
          bol.sort((a, b) => a[1] - b[1]);
          cuerpo += bol.map(([dx, dy, rr, col]) => `<circle cx="${f1(tx + dx)}" cy="${f1(ty - 8 + dy)}" r="${f1(rr)}" fill="${col}" stroke="#5d6b45" stroke-width=".5"/>`).join('');
        },
        lampMesa(mx, my, z) {
          if (mx >= w - 0.1) return;
          cuerpo += cilindro(x + mx, y + my, z, 0.06, 0.18, '#d8cfc0', '#bdb2a0') + cilindro(x + mx, y + my, z + 0.18, 0.12, 0.16, '#fff6e2', '#f2e3c4');
          const [gx, gy] = P(x + mx, y + my, z + 0.26);
          cuerpo += `<circle cx="${f1(gx)}" cy="${f1(gy)}" r="20" fill="url(#casa-brillo)"/>`;
        },
        lampPie(mx, my) {
          if (mx >= w - 0.1) return;
          sombras += disco(x + mx + 0.06, y + my + 0.06, 0, 0.2, SOMBRA);
          cuerpo += disco(x + mx, y + my, 0, 0.16, '#2f2f33') + cilindro(x + mx, y + my, 0, 0.02, 1.45, '#3a3a3e', '#3a3a3e') + cilindro(x + mx, y + my, 1.4, 0.2, 0.28, '#fff6e2', '#efdcb6');
          const [gx, gy] = P(x + mx, y + my, 1.5);
          cuerpo += `<circle cx="${f1(gx)}" cy="${f1(gy)}" r="34" fill="url(#casa-brillo)"/>`;
          luces += disco(x + mx, y + my, 0.01, 0.9, 'rgba(255,226,168,.22)');
        },
        pantalla(mx, my, z, l, h) {
          if (mx >= w - 0.1) return;
          cuerpo += poli([[x + mx, y + my, z], [x + mx + l, y + my, z], [x + mx + l, y + my, z + h], [x + mx, y + my, z + h]], '#0f1430');
          cuerpo += poli([[x + mx + 0.05, y + my, z + 0.05], [x + mx + l - 0.05, y + my, z + 0.05], [x + mx + l - 0.05, y + my, z + h - 0.05], [x + mx + 0.05, y + my, z + h - 0.05]], '#4e6cff');
        },
        poste(mx, my) { c.b(mx, my, 0, 0.08, 0.08, 1.7, '#2b2b2e'); c.b(mx - 0.07, my - 0.07, 1.7, 0.22, 0.22, 0.26, '#fff4dc'); const [gx, gy] = P(x + mx, y + my, 1.82); cuerpo += `<circle cx="${f1(gx)}" cy="${f1(gy)}" r="26" fill="url(#casa-brillo)"/>`; },
        buzon(mx, my) { c.b(mx, my, 0, 0.08, 0.08, 1, '#2b2b2e'); c.b(mx - 0.15, my - 0.2, 1, 0.38, 0.48, 0.3, '#1c34c9', { blando: 2 }); c.b(mx + 0.23, my - 0.05, 1.15, 0.02, 0.06, 0.25, '#c94f3d'); },
        indicador(mx, my) { c.b(mx, my, 0, 0.09, 0.09, 1.75, '#5b4636'); c.b(mx - 0.8, my - 0.02, 1.35, 1.15, 0.05, 0.24, MAD); c.b(mx - 0.02, my - 0.95, 1.0, 0.05, 1.05, 0.22, '#e0bf95'); },
      };
      HAB[id](c, F);
      // suelo
      let g = poli([[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]], `url(#p-${id})`).replace('<polygon', '<polygon class="suelo"');
      g += luces + `<g fill="rgba(60,40,20,.34)" filter="url(#casa-difu)">${sombras}</g>`;
      // muros: los exteriores, altos; los interiores, cortados (con el corte oscuro, como en las maquetas)
      if (!ext) {
        const corte = '#2f2a25';
        g += caja(x, y - 0.15, 0, w, 0.15, nExt ? 2.6 : 0.35, '#efeae1', { tapa: corte });
        g += caja(x - 0.15, y, 0, 0.15, d, oExt ? 2.6 : 0.35, '#e6e0d5', { tapa: corte });
        if (nExt) g += caja(x, y, 0, w, 0.03, 0.12, '#d2c7b6');
        if (oExt) g += caja(x, y, 0, 0.03, d, 0.12, '#cbbfae');
      }
      g += cuerpo;
      if (!ext) {
        const corte = '#2f2a25';
        if (y + d === Dint && id !== 'galeria') g += caja(x, y + d, 0, w, 0.15, 0.35, '#efeae1', { tapa: corte });
        if (id === 'galeria' && y + d === Dint) { g += caja(x, y + d, 0, 0.6, 0.15, 0.35, '#efeae1', { tapa: corte }); g += caja(x + 1.75, y + d, 0, w - 1.75, 0.15, 0.35, '#efeae1', { tapa: corte }); }
        if (x + w === W) g += caja(x + w, y, 0, 0.15, d, 0.35, '#e6e0d5', { tapa: corte });
      }
      // etiqueta
      const [lx, ly] = P(x + w / 2, y + d / 2, ext ? 0.9 : 1.6), [bx, by] = P(x + w / 2, y + d / 2, 0);
      const num = String(i + 1).padStart(2, '0'), tw = sala.n.length * (movil ? 8.9 : 6.8) + (movil ? 42 : 36), th = movil ? 30 : 25, tx = movil ? 34 : 29;
      etiquetas += `<g class="etq" data-id="${id}" style="--i:${i}"><line x1="${f1(bx)}" y1="${f1(by)}" x2="${f1(lx)}" y2="${f1(ly + th / 2)}"/><circle class="anillo" cx="${f1(bx)}" cy="${f1(by)}" r="2.8"/><circle cx="${f1(bx)}" cy="${f1(by)}" r="2.8"/><g transform="translate(${f1(lx)},${f1(ly)})"><rect x="${-tw / 2}" y="${-th / 2}" width="${tw}" height="${th}" rx="3"/><text class="num" x="${-tw / 2 + 10}" y="${movil ? 5 : 4}">${num}</text><text x="${-tw / 2 + tx}" y="${movil ? 5 : 4}">${sala.n}</text></g></g>`;
      cuerpo = g;
      svgSalas.push(`<g class="room" data-id="${id}" role="button" tabindex="0" aria-label="${sala.n}: ${sala.k}" style="--i:${i}">${cuerpo}</g>`);
      const H = ext ? 1.8 : 2.6, esq = [P(x, y, H), P(x + w, y, 0), P(x + w, y + d, 0), P(x, y + d, 0), P(x, y, 0), P(x + w, y, H), P(x, y + d, H)];
      const xs = esq.map((p) => p[0]), ys = esq.map((p) => p[1]);
      cajasSala[id] = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
    });
    const todo = [P(-0.6, -0.6, 2.6), P(W + 0.6, -0.6, 2.6), P(-0.6, Dtot + 0.5, 2), P(W + 0.6, Dtot + 0.5, -0.4), P(-0.6, Dtot + 0.5, -0.4), P(W + 0.6, -0.6, -0.4)];
    const xs = todo.map((p) => p[0]), ys = todo.map((p) => p[1]), m = 16;
    vbCasa = [Math.min(...xs) - m, Math.min(...ys) - m - 16, Math.max(...xs) - Math.min(...xs) + 2 * m, Math.max(...ys) - Math.min(...ys) + 2 * m + 26];
    svg.setAttribute('viewBox', vbCasa.join(' '));
    svg.innerHTML = `<defs>${defs}</defs>${out}${svgSalas.join('')}<g class="etiquetas">${etiquetas}</g>`;
    svgSalas.length = 0;
    svg.querySelectorAll('.room').forEach((el) => {
      const etq = svg.querySelector(`.etq[data-id="${el.dataset.id}"]`);
      ['mouseenter', 'focus'].forEach((e) => el.addEventListener(e, () => etq.classList.add('sobre')));
      ['mouseleave', 'blur'].forEach((e) => el.addEventListener(e, () => etq.classList.remove('sobre')));
      el.addEventListener('click', (ev) => { ev.stopPropagation(); entrar(el.dataset.id); });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); entrar(el.dataset.id, true); } });
    });
    actual = null; seccion.classList.remove('zoom'); cerrarPanel();
  }
  const svgSalas = [];

  function irA(vb) {
    const ini = svg.getAttribute('viewBox').split(' ').map(Number), t0 = performance.now(), dur = reducido ? 0 : 1000;
    cancelAnimationFrame(anim);
    const paso = (now) => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      svg.setAttribute('viewBox', ini.map((v, i) => v + (vb[i] - v) * e).join(' '));
      if (k < 1) anim = requestAnimationFrame(paso);
    };
    anim = requestAnimationFrame(paso);
  }
  function desplazar(y) { if (window.__lenis) window.__lenis.scrollTo(y, { duration: reducido ? 0 : 0.9 }); else scrollTo({ top: y, behavior: reducido ? 'auto' : 'smooth' }); }
  let origen = null;
  function entrar(id, teclado) {
    actual = id; seccion.classList.add('usada');
    origen = teclado ? svg.querySelector(`.room[data-id="${id}"]`) : null;
    const [x, y, w, h] = cajasSala[id], r = svg.clientWidth / svg.clientHeight;
    let vb;
    if (movil) { const ww = Math.max(w * 1.9, h * 1.7 * r), hh = ww / r; vb = [x + w / 2 - ww / 2, y + h / 2 - hh * 0.36, ww, hh]; }
    else { const hh = Math.max(h * 1.7, (w * 1.5) / r), ww = hh * r; vb = [x + w / 2 - ww * 0.33, y + h / 2 - hh / 2, ww, hh]; }
    irA(vb);
    if (movil) { const top = svg.getBoundingClientRect().top + scrollY; desplazar(top + svg.clientHeight * 0.36 - innerHeight * 0.24); }
    seccion.classList.add('zoom');
    svg.querySelectorAll('.room').forEach((el) => el.classList.toggle('activa', el.dataset.id === id));
    abrirPanel(id);
    if (teclado) setTimeout(() => panel.querySelector('.casa-t').focus({ preventScroll: true }), 50);
  }
  function salir() {
    if (!actual) return;
    actual = null; irA(vbCasa); seccion.classList.remove('zoom');
    svg.querySelectorAll('.room').forEach((r) => r.classList.remove('activa'));
    cerrarPanel();
    if (origen && panel.contains(document.activeElement)) origen.focus({ preventScroll: true });
    origen = null;
  }
  const pf = panel.querySelector('.casa-foto'), pi = pf.querySelector('img');
  function abrirPanel(id) {
    const s = SALAS[id];
    panel.classList.remove('abierto'); void panel.offsetWidth;
    pf.hidden = !s.foto; if (s.foto) { pi.src = s.foto; pi.alt = s.alt || ''; }
    panel.querySelector('.casa-k').textContent = s.k;
    panel.querySelector('.casa-t').textContent = s.n;
    panel.querySelector('.casa-d').textContent = s.d;
    const pl = panel.querySelector('.casa-enlaces');
    pl.classList.toggle('chips', !!s.chips);
    pl.innerHTML = s.l.map(([t, h]) => `<a href="${h}">${t}<span aria-hidden="true">→</span></a>`).join('');
    panel.classList.add('abierto'); panel.setAttribute('aria-hidden', 'false');
  }
  function cerrarPanel() { panel.classList.remove('abierto'); panel.setAttribute('aria-hidden', 'true'); }

  panel.querySelector('.casa-volver').addEventListener('click', salir);
  panel.querySelector('.casa-cerrar').addEventListener('click', salir);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') salir(); });
  svg.addEventListener('click', (e) => { if (!e.target.closest('.room')) salir(); });
  seccion.querySelectorAll('[data-sala]').forEach((b) => b.addEventListener('click', () => {
    if (movil) entrar(b.dataset.sala, true);
    else { desplazar(svg.getBoundingClientRect().top + scrollY - 90); setTimeout(() => entrar(b.dataset.sala, true), reducido ? 0 : 450); }
  }));
  // al salir de la sección se cierra el panel (en el móvil es fijo abajo)
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) salir(); else seccion.classList.add('vista'); }, { threshold: 0.12 }).observe(svg);

  let modo = innerWidth < 760;
  addEventListener('resize', () => { const m = innerWidth < 760; if (m !== modo) { modo = m; dibujar(); } });
  dibujar();
}

document.querySelectorAll('.casa').forEach(montarCasa);
