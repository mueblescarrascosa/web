// «Recorre la casa»: maqueta isométrica de la portada. Cada habitación lleva a sus páginas.
// Se dibuja en SVG con una proyección propia (sin librerías). Los datos (textos, enlaces y fotos) vienen de Casa.astro.

const U = 26, C = Math.cos(Math.PI / 6), S = 0.5;
let EX = [C, S], EY = [-C, S];
const P = (x, y, z = 0) => [(x * EX[0] + y * EY[0]) * U, (x * EX[1] + y * EY[1]) * U - z * U];
const f1 = (n) => (+n).toFixed(1);
const pts = (a) => a.map((p) => P(...p).map(f1).join(',')).join(' ');
const lin = (a, b) => { const p = P(...a), q = P(...b); return `M${f1(p[0])} ${f1(p[1])}L${f1(q[0])} ${f1(q[1])}`; };
// Trazo «a mano»: cada línea se pasa un poco de largo y se curva levemente (azar con semilla, siempre igual).
let semilla = 1;
const rnd = () => ((semilla = (semilla * 16807) % 2147483647) - 1) / 2147483646;
function trazo(q, cerrar = true) {
  let d = '';
  const n = q.length, m = cerrar ? n : n - 1;
  for (let i = 0; i < m; i++) {
    const a = q[i], b = q[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L, amp = Math.min(0.9, L / 18), ov = Math.min(1.8, L * 0.07);
    const sx = a[0] - ux * ov * rnd() + (rnd() - 0.5) * amp, sy = a[1] - uy * ov * rnd() + (rnd() - 0.5) * amp;
    const ex = b[0] + ux * ov * rnd() + (rnd() - 0.5) * amp, ey = b[1] + uy * ov * rnd() + (rnd() - 0.5) * amp;
    const bend = (rnd() - 0.5) * Math.min(2.4, L * 0.05), cx = (sx + ex) / 2 - uy * bend, cy = (sy + ey) / 2 + ux * bend;
    d += `M${f1(sx)} ${f1(sy)}Q${f1(cx)} ${f1(cy)} ${f1(ex)} ${f1(ey)}`;
  }
  return d;
}
const tinta = (q, cerrar = true) => `<path class="tinta" d="${trazo(q, cerrar)}"/>`;
// Mancha orgánica (copas, arbustos, flores): círculo deformado y suavizado, en coordenadas de pantalla.
function mancha(cx, cy, rx, ry, fill, conTinta = true, irr = 0.22) {
  const n = 9, p = [];
  for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2, f = 1 + (rnd() - 0.5) * 2 * irr; p.push([cx + Math.cos(a) * rx * f, cy + Math.sin(a) * ry * f]); }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${mid(p[n - 1], p[0]).map(f1).join(' ')}`;
  for (let k = 0; k < n; k++) { const m = mid(p[k], p[(k + 1) % n]); d += `Q${f1(p[k][0])} ${f1(p[k][1])} ${f1(m[0])} ${f1(m[1])}`; }
  return `<path d="${d}Z" fill="${fill}"${conTinta ? ' class="tinta-f"' : ''}/>`;
}
// Sombra de un objeto redondo, como polígono en pantalla (para poder rayarla).
const sombraDisco = (x, y, r) => `<polygon points="${pts(Array.from({ length: 14 }, (_, k) => [x + Math.cos(k / 14 * 6.283) * r, y + Math.sin(k / 14 * 6.283) * r, 0]))}"/>`;
function tono(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  return `rgb(${c})`;
}
const poli = (p, fill, st) => `<polygon points="${pts(p)}" fill="${fill}"/>` + (st ? tinta(p.map((v) => P(...v))) : '');
const mPlano = (x, y, z = 0) => { const [px, py] = P(x, y, z); return `matrix(${(EX[0] * U).toFixed(3)},${(EX[1] * U).toFixed(3)},${(EY[0] * U).toFixed(3)},${(EY[1] * U).toFixed(3)},${f1(px)},${f1(py)})`; };
const mMuro = (s, x, y, z) => { const e = s === 'n' ? EX : EY, [px, py] = P(x, y, z); return `matrix(${(e[0] * U).toFixed(3)},${(e[1] * U).toFixed(3)},0,${-U},${f1(px)},${f1(py)})`; };
function azar(x, y) { let s = Math.abs(Math.round((x * 73.1 + y * 31.7) * 100)) % 2147483646 + 1; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; }

// Caja con sus tres caras visibles; opciones: blando (esquinas redondeadas), tapa (color de arriba),
// fy/fx (puertas en la cara de delante o de la derecha), caj (líneas de cajones), tir (tiradores), tirZ (altura del tirador).
function caja(x, y, z, w, d, h, col, o = {}) {
  const A = [x + w, y, z], B = [x + w, y + d, z], Cc = [x, y + d, z], A2 = [x + w, y, z + h], B2 = [x + w, y + d, z + h], C2 = [x, y + d, z + h], D2 = [x, y, z + h];
  const caras = [[[A, B, B2, A2], tono(col, 0.8)], [[Cc, B, B2, C2], tono(col, 0.91)], [[D2, A2, B2, C2], o.tapa || col]];
  let s = '';
  for (const [p, c] of caras) s += o.blando ? `<polygon points="${pts(p)}" fill="${c}" stroke="${c}" stroke-width="${o.blando}" stroke-linejoin="round"/>` : `<polygon points="${pts(p)}" fill="${c}"/>`;
  // cara en sombra rayada a lápiz y contorno a tinta
  if (h > 0.45 && d > 0.2 && !o.blando) s += `<polygon points="${pts(caras[0][0])}" fill="url(#casa-rayado)"/>`;
  if (!o.sinTinta && w + d + h > 0.3) s += `<path class="tinta" d="${[[D2, A2], [A2, B2], [B2, C2], [C2, D2], [Cc, B], [Cc, C2], [B, B2], [B, A], [A, A2]].map(([a, b]) => trazo([P(...a), P(...b)], false)).join('')}"/>`;
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
  const ink = r > 0.05 ? `<path class="tinta" d="${trazo([[bx - rx, by], [bx - rx, ty]], false)}${trazo([[bx + rx, by], [bx + rx, ty]], false)}"/>` : '';
  return disco(x, y, z, r, lado, r > 0.05 ? '#3d2f25' : 'none', 0.8) + `<rect x="${f1(bx - rx)}" y="${f1(ty)}" width="${f1(2 * rx)}" height="${f1(by - ty)}" fill="${lado}"/>` + ink + disco(x, y, z + h, r, arriba, r > 0.05 ? '#3d2f25' : 'none', 0.8);
}

// ---------- Habitaciones ----------
// Cada habitación es una función que recibe «c» (la sala: posición, tamaño y qué muros son exteriores) y va colocando cosas.
// Todo lo que se coloca se ordena luego por profundidad, así nada atraviesa a nada.
const SOMBRA = 'x';
const BLA = '#f4f0e8', MAD = '#c9a27a', MADO = '#8a6a4c', ROB = '#b98d62', NEG = '#2c2c30';
const CAL = '#f7f3ea', TEJA = '#c0714a', ALMAGRA = '#b65a3c';
const ROPA = ['#e9e3d8', '#2f3a4a', '#9a6b4f', '#c9bfae', '#5d6b7d', '#7a3b33', '#d8cfc0', '#3d4a3a', '#b9a58a'];
const LIBROS = ['#a8543e', '#d8c09a', '#3f5d7a', '#6b7f5a', '#e8e2d6', '#8a6a4c', '#2f2f33', '#c9a27a'];

const HAB = {
  cocina(c) {
    c.azulejo('n', 0, 0.91, 3.3, 0.6);
    c.ven('o', 1.15, 1.05, 1.3, 1); c.ven('n', 4.25, 1.05, 1, 1);
    c.b(0, 0, 0, 3.3, 0.6, 0.86, BLA, { fy: 5, caj: [0.62], tir: '#4a4a4a', tirZ: 0.9 });
    c.b(0, 0, 0.86, 3.32, 0.64, 0.05, ROB);
    c.b(0, 0.6, 0, 0.6, 2.2, 0.86, BLA, { fx: 3, caj: [0.62], tir: '#4a4a4a', tirZ: 0.9 });
    c.b(0, 0.6, 0.86, 0.64, 2.2, 0.05, ROB);
    c.b(0.1, 1.4, 0.91, 0.42, 0.62, 0.008, '#9a9ea3', { sinTinta: true }); c.cil(0.06, 1.71, 0.91, 0.025, 0.28, '#c3c6ca', '#a3a7ab');
    c.b(1.25, 0.08, 0.912, 0.7, 0.46, 0.006, '#1f1f22', { sinTinta: true });
    [[1.42, 0.2], [1.75, 0.2], [1.42, 0.42], [1.75, 0.42]].forEach(([a, b]) => c.disco(a, b, 0.92, 0.08, 'none', '#55585c'));
    c.b(0, 0, 1.5, 1.2, 0.36, 0.75, BLA, { fy: 2, tir: '#4a4a4a', tirZ: 0.12 });
    c.b(2.05, 0, 1.5, 1.25, 0.36, 0.75, BLA, { fy: 2, tir: '#4a4a4a', tirZ: 0.12 });
    c.b(1.35, 0, 1.55, 0.65, 0.46, 0.12, '#b6b9bd'); c.b(1.52, 0, 1.67, 0.3, 0.22, 0.83, CAL);
    c.b(3.38, 0, 0, 0.72, 0.66, 2.1, '#e3e0da', { fy: 1, caj: [0.42], tir: '#8b8f94', tirZ: 0.55 });
    c.maceta(0.3, 2.45, 0.91, 0.55, '#d8463a');
    c.b(1.5, 2.1, 0, 1.8, 0.8, 0.86, ROB, { fy: 3, tir: '#3a3a3a', tirZ: 0.9 });
    c.b(1.45, 2.05, 0.86, 1.9, 0.9, 0.05, '#f6f3ee');
    c.disco(2.4, 2.5, 0.92, 0.2, '#e8e2d6', '#3d2f25'); c.disco(2.36, 2.47, 0.95, 0.06, '#e8892c'); c.disco(2.46, 2.55, 0.95, 0.06, '#e8892c');
    [1.85, 2.5, 3.1].forEach((a) => { c.cil(a, 3.35, 0, 0.03, 0.6, '#2f2f33', '#2f2f33'); c.cil(a, 3.35, 0.6, 0.17, 0.05, '#3a3a3e', '#2f2f33'); });
  },
  salon(c) {
    c.ven('o', 1, 0.9, 1.1, 1.25); c.ven('n', 1.5, 0.9, 1.1, 1.25);
    c.b(0.4, 0, 0, 3, 0.45, 0.45, MADO, { fy: 4 });
    c.b(1.15, 0.04, 0.6, 1.5, 0.05, 0.85, '#141416');
    c.disco(1.9, 1.75, 0.01, 1.25, '#d9c7a6'); c.disco(1.9, 1.75, 0.012, 1.08, 'none', '#a8543e', 1.4);
    // mesa camilla con sus faldas
    c.cil(1.9, 1.7, 0, 0.55, 0.62, '#c9a27a', '#9c3f33');
    c.disco(1.85, 1.65, 0.63, 0.1, '#f1eee8');
    c.b(0.9, 1.45, 0, 0.42, 0.42, 0.45, MAD); c.b(0.9, 1.45, 0.45, 0.06, 0.42, 0.5, MAD);
    c.lampPie(3.85, 0.45);
    c.b(0.3, 2.95, 0, 2.8, 0.8, 0.25, '#8e8a84', { blando: 3 });
    for (let i = 0; i < 3; i++) c.b(0.45 + i * 0.85, 2.97, 0.25, 0.8, 0.55, 0.14, '#aaa59e', { blando: 3 });
    c.b(0.3, 3.5, 0.25, 2.8, 0.28, 0.5, '#8e8a84', { blando: 3 });
    c.b(0.3, 2.95, 0.25, 0.17, 0.8, 0.25, '#8e8a84', { blando: 3 }); c.b(2.93, 2.95, 0.25, 0.17, 0.8, 0.25, '#8e8a84', { blando: 3 });
    c.b(0.6, 3.25, 0.39, 0.36, 0.14, 0.3, '#d9a65a', { blando: 4 }); c.b(2.45, 3.25, 0.39, 0.36, 0.14, 0.3, '#5f7a6a', { blando: 4 });
    c.maceta(c.w - 0.55, 1.5, 0, 1.1, null);
  },
  vestidor(c) {
    const T = '#d9b48b';
    c.b(0, 0, 0, 4, 0.08, 2.3, '#a98460');
    c.ropa(0.12, 0.15, 2.05, 1.15);
    for (const z of [0.55, 0.95, 1.35, 1.75]) {
      c.b(1.39, 0.08, z, 1.27, 0.55, 0.03, T);
      const r = azar(z, 3);
      for (let k = 0; k < 3; k++) c.b(1.48 + k * 0.4, 0.2, z + 0.03, 0.32, 0.38, 0.1 + r() * 0.1, ROPA[(k * 3 + Math.round(z * 10)) % ROPA.length], { blando: 1.5, sinTinta: true });
    }
    c.b(1.39, 0.08, 0, 1.27, 0.55, 0.5, T, { fy: 1, caj: [0.5], tir: '#5a4636', tirZ: 0.78 });
    c.ropa(2.78, 0.15, 2.05, 1.1, true);
    c.b(2.72, 0.08, 0, 1.22, 0.55, 0.03, T);
    for (let k = 0; k < 5; k++) c.b(2.8 + k * 0.22, 0.25, 0.03, 0.16, 0.3, 0.09, ['#2f2f33', '#9a6b4f', '#e9e3d8'][k % 3], { sinTinta: true });
    [0, 1.33, 2.66, 3.94].forEach((a) => c.b(a, 0.08, 0, 0.06, 0.55, 2.3, T, { sinTinta: true }));
    c.b(0, 0.08, 2.25, 4, 0.55, 0.05, T);
    c.disco(1.9, 2.45, 0.01, 1.15, '#d8c7ae');
    c.b(1.2, 1.9, 0, 1.4, 1.1, 0.9, BLA, { fy: 2, caj: [0.33, 0.66], tir: '#8a6a4c', tirZ: 0.5 });
    c.b(1.2, 1.9, 0.9, 1.4, 1.1, 0.03, '#c3d0d6');
    c.cil(3.4, 3.1, 0, 0.28, 0.4, '#d6ccbb', '#bdb2a0');
    c.maceta(4.6, 0.6, 0, 1, null);
  },
  taller(c, F) {
    c.cuadro('n', 0.25, 1.3, 0.8, 1, F.abuelo); c.cuadro('n', 1.2, 1.45, 1.5, 0.85, F.fachada);
    c.tablero('n', 2.85, 1.2, 0.65, 0.85); c.ven('n', 3.65, 0.95, 0.75, 1.15);
    c.b(0.2, 0.05, 0, 3.4, 0.8, 0.82, '#7a5c40', { fy: 3, caj: [0.35], tir: '#2a2a2a', tirZ: 0.2 });
    c.b(0.15, 0, 0.82, 3.5, 0.9, 0.08, '#dcbb90');
    c.b(0.35, 0.2, 0.9, 0.28, 0.32, 0.18, '#4a4f57'); c.b(1.5, 0.3, 0.9, 1.3, 0.26, 0.04, '#e6c79e'); c.b(2.95, 0.35, 0.9, 0.35, 0.22, 0.12, '#c94f3d');
    c.disco(2.5, 1.6, 0.01, 0.9, 'rgba(230,205,160,.45)'); c.disco(1.2, 3.2, 0.01, 0.5, 'rgba(230,205,160,.35)');
    c.b(1.7, 2, 0, 1.4, 1, 0.8, '#4a4f57', { fy: 1, caj: [0.6] });
    c.b(1.65, 1.95, 0.8, 1.5, 1.1, 0.05, '#aab0b7'); c.b(2.35, 2.2, 0.85, 0.08, 0.5, 0.14, '#c94f3d');
    c.b(3.9, 1.2, 0, 0.5, 2.4, 0.3, '#d9b48b'); c.b(3.95, 1.3, 0.3, 0.4, 2.2, 0.12, '#c49a6c');
    c.cil(0.75, 2.4, 0, 0.2, 0.62, '#c9a27a', '#a8835c');
    c.b(0.4, 3.1, 0, 0.6, 0.35, 0.2, MAD); c.b(0.5, 3.45, 0, 0.35, 0.3, 0.14, MADO);
  },
  // El patio: el centro de la casa andaluza. Galería de arcos con las fotos de trabajos, fuente, naranjo y macetas.
  galeria(c, F) {
    c.buganvilla('o', 0.4, c.d - 0.8);
    const n = Math.max(3, Math.round((c.w - 0.4) / 1.35)), paso = (c.w - 0.4) / n;
    c.arcada(0.2, 0.55, c.w - 0.4, n);
    [F.g1, F.g2, F.g3].forEach((src, i) => c.cuadro('n', 0.2 + paso * i + 0.18, 0.38, paso - 0.36, 0.72, src, 0.45));
    c.fuente(c.w / 2, 2.35);
    c.olivo(c.w - 0.9, c.d - 0.85, 0.8);
    c.maceta(0.35, 1.3, 0, 0.8, '#d8463a'); c.maceta(0.35, 1.85, 0, 0.7, '#e2557a'); c.maceta(0.35, 3.5, 0, 0.9, '#d8463a');
    c.maceta(c.w / 2 - 1.3, 3.55, 0, 0.7, '#e2557a'); c.maceta(c.w / 2 + 1.1, 3.55, 0, 0.7, '#d8463a');
    c.granado(c.w > 7 ? 3.1 : 1.15, 2.85);
    if (c.w > 7) { c.naranjo(1.3, 2.6); c.maceta(c.w - 2.4, 1.3, 0, 0.8, '#d8463a'); }
  },
  bano(c) {
    c.b(0.15, 0.25, 0, 0.85, 1.75, 0.55, '#f7f5f1', { blando: 6 });
    c.forma('M.32 .45H.83V1.82H.32Z', 0.56, '#a7cfe0');
    c.b(1.35, 0, 0.3, 1.35, 0.5, 0.48, ROB, { fy: 2, tir: '#2a2a2a', tirZ: 0.8 });
    c.b(1.35, 0, 0.78, 1.35, 0.5, 0.04, '#f6f3ee'); c.disco(2.02, 0.25, 0.83, 0.17, '#ffffff', '#3d2f25');
    c.cil(2.02, 0.06, 0.82, 0.02, 0.18, '#c3c6ca', '#a3a7ab');
    c.b(2.95, 0.15, 0, 0.42, 0.6, 0.4, '#f7f5f1', { blando: 5 }); c.b(2.95, 0.08, 0.4, 0.42, 0.18, 0.4, '#f7f5f1', { blando: 4 });
    c.forma('M1.4 1.2H2.6V1.9H1.4Z', 0.01, '#e8e2d6');
    c.maceta(0.45, 3.35, 0, 0.9, null);
  },
  dormitorio(c) {
    c.b(1, 0.1, 0, 2.5, 0.14, 1.05, MADO, { fy: 6 });
    c.b(1, 0.24, 0, 2.5, 2.35, 0.28, '#9a7a58');
    c.b(1.05, 0.26, 0.28, 2.4, 2.3, 0.16, '#f2eee6', { blando: 3 });
    c.b(1.25, 0.35, 0.44, 0.95, 0.45, 0.15, '#fbf9f5', { blando: 5 }); c.b(2.3, 0.35, 0.44, 0.95, 0.45, 0.15, '#fbf9f5', { blando: 5 });
    c.b(1.02, 1.05, 0.44, 2.46, 1.52, 0.08, '#c9bfae', { blando: 4 });
    c.b(1.02, 1.05, 0.52, 2.46, 0.25, 0.03, '#efe8dc', { blando: 2, sinTinta: true });
    c.b(1.02, 2.15, 0.52, 2.46, 0.38, 0.02, '#a8543e', { blando: 2, sinTinta: true });
    c.b(0.3, 0.15, 0, 0.55, 0.45, 0.5, MAD, { fy: 1, caj: [0.5], tir: '#5a4636', tirZ: 0.75 }); c.lampMesa(0.58, 0.37, 0.5);
    c.b(3.65, 0.15, 0, 0.55, 0.45, 0.5, MAD, { fy: 1, caj: [0.5], tir: '#5a4636', tirZ: 0.75 }); c.lampMesa(3.93, 0.37, 0.5);
    c.forma('M.6 2.35Q.6 2.2 .8 2.2H3.7Q3.9 2.2 3.9 2.35V3.55Q3.9 3.7 3.7 3.7H.8Q.6 3.7 .6 3.55Z', 0.008, '#e3d8c6');
    c.maceta(c.w - 0.5, 3.3, 0, 1, null);
  },
  ocio(c) {
    c.ven('o', 1.2, 0.9, 1.1, 1.2);
    c.forma('M.2 .3H3.3V3.7H.2Z', 0.008, '#8796ab');
    c.b(0.45, 0.7, 0, 2.3, 1.3, 0.72, '#6b4f38');
    c.b(0.55, 0.8, 0.72, 2.1, 1.1, 0.05, '#3f7a5a');
    [[1.1, 1.1, '#f1eee8'], [1.9, 1.4, '#c94f3d'], [2.1, 1.0, '#e0b84a'], [1.5, 1.6, '#2f2f33']].forEach(([a, b, k]) => c.disco(a, b, 0.78, 0.05, k));
    c.cil(0.6, 3.05, 0, 0.36, 0.28, '#c94f3d', '#a63f30');
    c.cil(1.45, 3.25, 0, 0.32, 0.26, '#e0b84a', '#bf9a37');
    c.b(2.95, 2.6, 0, 0.62, 0.7, 1.7, '#2f45c8', { blando: 2 });
    c.pantalla(3.02, 3.3, 1.05, 0.48, 0.42);
    c.b(2.95, 3.3, 0.85, 0.62, 0.15, 0.06, '#1e2a80');
    c.maceta(4.1, 0.5, 0, 1, null);
  },
  despacho(c) {
    c.ven('o', 0.3, 1.5, 0.9, 0.8);
    c.b(0.75, 0, 0.72, 2.5, 0.85, 0.05, '#d9b48b');
    [[0.8, 0.05], [3.15, 0.05], [0.8, 0.75]].forEach(([a, b]) => c.b(a, b, 0, 0.05, 0.05, 0.72, '#5a4636', { sinTinta: true }));
    c.b(2.55, 0.08, 0, 0.6, 0.72, 0.72, MAD, { fy: 1, caj: [0.33, 0.66], tir: '#5a4636', tirZ: 0.5 });
    c.b(1.93, 0.18, 0.77, 0.08, 0.08, 0.2, '#555', { sinTinta: true }); c.b(1.6, 0.12, 0.95, 0.75, 0.04, 0.45, '#1b1b1e');
    c.b(0.95, 0.45, 0.77, 0.42, 0.3, 0.06, '#c94f3d'); c.b(0.98, 0.48, 0.83, 0.36, 0.24, 0.01, '#f1eee8', { sinTinta: true });
    c.cil(2.85, 0.5, 0.77, 0.06, 0.12, '#e8e2d6', '#d0c9bd'); c.lampMesa(0.95, 0.15, 0.77);
    c.cil(1.95, 1.4, 0, 0.04, 0.42, '#555', '#555');
    c.cil(1.95, 1.4, 0.42, 0.3, 0.07, '#3a3a3e', '#2c2c30'); c.b(1.7, 1.66, 0.5, 0.5, 0.08, 0.5, '#2c2c30', { blando: 3 });
    c.b(0, 2.1, 0, 0.06, 1.8, 1.3, MADO);
    for (const z of [0, 0.62, 1.26]) c.b(0.06, 2.1, z, 0.4, 1.8, 0.04, MAD);
    c.libros(0.1, 2.2, 0.04, 1.6, 'y', 0.3); c.libros(0.1, 2.2, 0.66, 1.3, 'y', 0.3);
    c.forma('M1 2.2Q1 2 1.2 2H3.2Q3.4 2 3.4 2.2V3.3Q3.4 3.5 3.2 3.5H1.2Q1 3.5 1 3.3Z', 0.008, '#d6c4a6');
    c.maceta(3.6, 3.35, 0, 1.1, null);
  },
  // Delante de la casa: empedrado hasta la puerta del salón, tapia encalada con teja, farol, cipreses y olivo.
  entrada(c) {
    const p = c.puerta;
    c.forma(`M${p - 0.45} 0H${p + 0.45}C${p + 0.5} 1 ${p - 0.2} 1.7 ${p - 0.3} 2.8H${p - 1.5}C${p - 1.4} 1.6 ${p - 0.5} 1 ${p - 0.45} 0Z`, 0.008, 'url(#p-chino)', true);
    c.tapia(0, p - 1.55); c.tapia(p - 0.25, c.w);
    c.poste(p + 0.75, 0.45);
    c.maceta(p + 0.75, 0.95, 0, 0.8, '#d8463a'); c.maceta(p - 1.0, 0.4, 0, 0.8, '#e2557a');
    c.buzon(p + 0.25, 2.35);
    if (c.w > 6) {
      c.olivo(1.4, 1.2, 1.05); c.cipres(3.5, 0.6); c.cipres(4.2, 0.6);
      c.poyo(2.5, 2.05, 1.6); c.lavanda(5.6, 1.6); c.lavanda(6.3, 1.9);
    } else { c.cipres(0.5, 0.6); c.lavanda(1.2, 1.4); }
  },
  // El olivar: tierra labrada, olivos en hilera, un pozo y el indicador hacia el taller.
  jardin(c) {
    c.tapia(0, c.w);
    if (c.w > 5) {
      c.olivo(1.2, 1.35); c.olivo(3.5, 1.9, 0.95); c.olivo(5.6, 1.4);
      c.pozo(2.4, 0.75); c.indicador(4.7, 0.7); c.chumbera(6.1, 2.2);
    } else { c.olivo(1.3, 1.5); c.olivo(3.5, 1.7, 0.9); c.indicador(2.5, 0.6); }
  },
};

// ---------- Distribuciones [id, x, y, ancho, fondo, 'alto'?] ----------
// Casa andaluza: el patio en el centro; a un lado lo de diario (despacho, juegos, taller), al otro la zona de noche
// (dormitorio, vestidor y baño juntos), la cocina al fondo y el salón junto a la puerta.
const PLANO_ANCHO = [
  ['taller', 0, 0, 5, 4], ['cocina', 5, 0, 5.5, 4], ['vestidor', 10.5, 0, 5.5, 4],
  ['ocio', 0, 4, 5, 4], ['galeria', 5, 4, 5.5, 4], ['dormitorio', 10.5, 4, 5.5, 4],
  ['despacho', 0, 8, 5, 4], ['salon', 5, 8, 5.5, 4], ['bano', 10.5, 8, 5.5, 4],
  ['entrada', 0, 12, 9.5, 2.8], ['jardin', 9.5, 12, 6.5, 2.8]];
const PLANO_ALTO = [
  ['cocina', 0, 0, 4.5, 4], ['taller', 4.5, 0, 4.5, 4],
  ['galeria', 0, 4, 9, 4],
  ['despacho', 0, 8, 4.5, 4], ['dormitorio', 4.5, 8, 4.5, 4],
  ['ocio', 0, 12, 4.5, 4], ['vestidor', 4.5, 12, 4.5, 4, 'alto'],
  ['salon', 0, 16, 4.5, 4], ['bano', 4.5, 16, 4.5, 4],
  ['entrada', 0, 20, 4.5, 2.8], ['jardin', 4.5, 20, 4.5, 2.8]];
const PUERTA = [3.5, 4.3]; // hueco de la puerta en la fachada del salón

const SUELOS = {
  cocina: ['hidraulico', '#ece4d4'], salon: ['barro', '#c98a5e'], vestidor: ['tarima', '#c9a77f'], taller: ['hormigon', '#b3ada3'],
  galeria: ['barro', '#cf9566'], bano: ['baldosa', '#dfe3e0'], dormitorio: ['tarima', '#c29c74'], ocio: ['tarima', '#a9825c'],
  despacho: ['tarima', '#ad845c'], entrada: ['tierra', '#dcc7a0'], jardin: ['tierra', '#cfae7a'],
};

function patron(id, [tipo, base]) {
  const m = mPlano(0, 0, 0).replace(/,[^,]+,[^,]+\)$/, ',0,0)');
  const L = tono(base, 0.8), Cl = tono(base, 1.08);
  const t = {
    tarima: [2.4, 0.5, `<rect width="2.4" height=".5" fill="${base}"/><rect y=".25" width="2.4" height=".25" fill="${tono(base, 0.95)}"/><path d="M0 .25H2.4M0 .5H2.4M.8 0V.25M1.9 .25V.5" stroke="${L}" stroke-width=".016"/>`],
    baldosa: [0.6, 0.6, `<rect width=".6" height=".6" fill="${base}"/><path d="M0 0H.6M0 0V.6" stroke="${tono(base, 0.86)}" stroke-width=".02"/>`],
    barro: [1, 1, `<rect width="1" height="1" fill="${base}"/><rect width=".5" height=".5" fill="${tono(base, 1.06)}"/><rect x=".5" y=".5" width=".5" height=".5" fill="${tono(base, 0.94)}"/><path d="M0 0H1M0 .5H1M0 0V1M.5 0V1" stroke="${tono(base, 0.74)}" stroke-width=".025"/>`],
    hidraulico: [0.6, 0.6, `<rect width=".6" height=".6" fill="${base}"/><path d="M.3 .07L.53 .3L.3 .53L.07 .3Z" fill="none" stroke="#5b7aa8" stroke-width=".03"/><circle cx=".3" cy=".3" r=".07" fill="#b65a3c"/><path d="M0 .09A.09 .09 0 0 0 .09 0M.51 0A.09 .09 0 0 0 .6 .09M.6 .51A.09 .09 0 0 0 .51 .6M.09 .6A.09 .09 0 0 0 0 .51" fill="none" stroke="#5b7aa8" stroke-width=".025"/><path d="M0 0H.6M0 0V.6" stroke="${tono(base, 0.84)}" stroke-width=".012"/>`],
    tierra: [1, 0.6, `<rect width="1" height=".6" fill="${base}"/><path d="M0 .3C.3 .26 .7 .34 1 .3" stroke="${tono(base, 0.86)}" stroke-width=".03" fill="none"/><circle cx=".2" cy=".12" r=".02" fill="${tono(base, 0.75)}"/><circle cx=".7" cy=".48" r=".018" fill="${Cl}"/>`],
    chino: [0.3, 0.3, `<rect width=".3" height=".3" fill="${base}"/><ellipse cx=".07" cy=".08" rx=".05" ry=".035" fill="#8f8574"/><ellipse cx=".22" cy=".1" rx=".045" ry=".03" fill="#efe9dc"/><ellipse cx=".12" cy=".22" rx=".05" ry=".03" fill="#efe9dc"/><ellipse cx=".26" cy=".25" rx=".035" ry=".03" fill="#8f8574"/>`],
    surcos: [1.6, 0.5, `<rect width="1.6" height=".5" fill="${base}"/><path d="M0 .36C.3 .33 .55 .39 .8 .35S1.3 .33 1.6 .36" stroke="${tono(base, 0.88)}" stroke-width=".07" fill="none" stroke-linecap="round"/><path d="M0 .4C.4 .38 .9 .42 1.6 .4" stroke="${tono(base, 0.8)}" stroke-width=".012" fill="none"/><circle cx=".2" cy=".12" r=".025" fill="${tono(base, 0.8)}"/><circle cx=".62" cy=".2" r=".018" fill="${tono(base, 1.07)}"/><circle cx="1.1" cy=".1" r=".02" fill="${tono(base, 0.84)}"/><circle cx="1.4" cy=".24" r=".015" fill="${tono(base, 0.78)}"/><ellipse cx="1.25" cy=".44" rx=".05" ry=".02" fill="${tono(base, 0.86)}"/>`],
    hormigon: [1.5, 1.5, `<rect width="1.5" height="1.5" fill="${base}"/><circle cx=".3" cy=".4" r=".02" fill="${L}"/><circle cx="1.1" cy=".9" r=".025" fill="${Cl}"/><path d="M0 0H1.5M0 0V1.5" stroke="${tono(base, 0.9)}" stroke-width=".015"/>`],
  }[tipo];
  return `<pattern id="p-${id}" patternUnits="userSpaceOnUse" width="${t[0]}" height="${t[1]}" patternTransform="${m}">${t[2]}</pattern>`;
}

// Orden de pintado dentro de una sala: lo de la pared primero, luego lo plano del suelo y después los muebles de atrás hacia delante.
const solapa = (a0, a1, b0, b1) => a0 < b1 - 1e-3 && b0 < a1 - 1e-3;
function antes(a, b) {
  if (a.k !== b.k) return a.k - b.k;
  const ox = solapa(a.x0, a.x1, b.x0, b.x1), oy = solapa(a.y0, a.y1, b.y0, b.y1);
  if (ox && oy) return a.z0 - b.z0 || a.z1 - b.z1;
  if (!ox) { if (a.x1 <= b.x0 + 1e-3) return -1; if (b.x1 <= a.x0 + 1e-3) return 1; }
  if (!oy) { if (a.y1 <= b.y0 + 1e-3) return -1; if (b.y1 <= a.y0 + 1e-3) return 1; }
  return 0;
}
function ordenar(items) {
  const n = items.length, ent = new Array(n).fill(0), sig = items.map(() => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const r = antes(items[i], items[j]);
    if (r < 0) { sig[i].push(j); ent[j]++; } else if (r > 0) { sig[j].push(i); ent[i]++; }
  }
  const hecho = new Array(n).fill(false), out = [];
  for (let it = 0; it < n; it++) {
    let p = -1;
    for (let i = 0; i < n; i++) if (!hecho[i] && ent[i] <= 0) { p = i; break; }
    if (p < 0) p = hecho.indexOf(false);
    hecho[p] = true; out.push(items[p].s); sig[p].forEach((j) => ent[j]--);
  }
  return out.join('');
}

// Olivo: tronco retorcido y copa plateada a manchas (X, Y en el plano; t, tamaño; n, mechones de la copa)
function dibujaOlivo(X, Y, t = 1, n = 26) {
  const r = azar(X, Y);
  const [bx, by] = P(X, Y, 0), [tx, ty] = P(X, Y, 1.1 * t);
  const tr = `M${f1(bx - 3 * t)} ${f1(by)}C${f1(bx + 6 * t)} ${f1(by - 9 * t)} ${f1(tx - 8 * t)} ${f1(ty + 12 * t)} ${f1(tx - 2 * t)} ${f1(ty)}M${f1(bx + 2 * t)} ${f1(by - 2 * t)}C${f1(bx + 10 * t)} ${f1(by - 14 * t)} ${f1(tx + 12 * t)} ${f1(ty + 9 * t)} ${f1(tx + 9 * t)} ${f1(ty - 3 * t)}M${f1(tx)} ${f1(ty + 6 * t)}C${f1(tx - 6 * t)} ${f1(ty + 2 * t)} ${f1(tx - 12 * t)} ${f1(ty)} ${f1(tx - 15 * t)} ${f1(ty - 5 * t)}`;
  let s = `<path d="${tr}" stroke="#3d2f25" stroke-width="${f1(6 * t)}" stroke-linecap="round" fill="none"/><path d="${tr}" stroke="#7a6350" stroke-width="${f1(4.2 * t)}" stroke-linecap="round" fill="none"/>`;
  // copa: una masa irregular de mechones pequeños, oscuros abajo y plateados arriba
  const cy0 = ty - 12 * t, mech = [];
  for (let k = 0; k < n; k++) { const a = r() * Math.PI * 2, q = Math.sqrt(r()); mech.push([Math.cos(a) * q * 30 * t, Math.sin(a) * q * 15 * t + (r() - 0.5) * 4 * t]); }
  mech.sort((a, b) => b[1] - a[1]);
  s += mancha(tx, cy0 + 2 * t, 33 * t, 17 * t, '#6f7c52', true, 0.3);
  mech.forEach(([dx, dy]) => {
    const alto = 1 - (dy / (15 * t) + 1) / 2;
    s += mancha(tx + dx, cy0 + dy, (6 + r() * 4) * t, (4 + r() * 2.5) * t, OLIVO[Math.max(0, Math.min(4, Math.floor(alto * 4.2 + r() * 0.8)))], false, 0.35);
  });
  for (let k = 0; k < 18; k++) { const px = tx + (r() - 0.5) * 54 * t, py = cy0 + (r() - 0.5) * 24 * t, a = (r() - 0.5) * 1.4; s += `<path d="M${f1(px)} ${f1(py)}l${f1(Math.cos(a) * 3.5 * t)} ${f1(Math.sin(a) * 3.5 * t)}" stroke="#55623d" stroke-width=".9" stroke-linecap="round" stroke-opacity=".7"/>`; }
  for (let k = 0; k < 5; k++) s += `<circle cx="${f1(tx + (r() - 0.5) * 44 * t)}" cy="${f1(cy0 + (r() - 0.3) * 18 * t)}" r="1.1" fill="#3a3a2a"/>`;
  return s;
}

// ---------- Montaje ----------
const VERDES = ['#4f6b3d', '#5f7d48', '#6f8f55', '#3f5a33', '#7c9a5f'];
const OLIVO = ['#76845a', '#859268', '#97a37b', '#a9b38f', '#bdc4a6'];

export function montarCasa(seccion) {
  const svg = seccion.querySelector('svg.casa-svg');
  const panel = seccion.querySelector('.casa-panel');
  const datos = JSON.parse(seccion.querySelector('script[type="application/json"]').textContent);
  const SALAS = datos.salas, F = datos.fotos;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cajasSala = {}, vbCasa, movil, actual = null, anim;
  const svgSalas = [];

  function dibujar() {
    movil = innerWidth < 760;
    semilla = 7;
    const plano = movil ? PLANO_ALTO : PLANO_ANCHO;
    if (movil) { EX = [0.96, 0.3]; EY = [-0.26, 0.8]; } else { EX = [C, S]; EY = [-C, S]; }
    seccion.classList.toggle('es-movil', movil);
    const W = Math.max(...plano.map((r) => r[1] + r[3]));
    const Dint = Math.max(...plano.filter((r) => !SALAS[r[0]].ext).map((r) => r[2] + r[4]));
    const Dtot = Math.max(...plano.map((r) => r[2] + r[4]));
    const salon = plano.find((r) => r[0] === 'salon');
    const azul = (e) => `<pattern id="casa-azul-${e === EX ? 'n' : 'o'}" patternUnits="userSpaceOnUse" width=".15" height=".15" patternTransform="matrix(${e[0] * U},${e[1] * U},0,${-U},0,0)"><rect width=".15" height=".15" fill="#f4f1ea"/><path d="M.075 .02L.13 .075L.075 .13L.02 .075Z" fill="#4f6fa3"/><circle cx=".075" cy=".075" r=".018" fill="#d9a65a"/><path d="M0 0H.15M0 0V.15" stroke="#cfc8bb" stroke-width=".008"/></pattern>`;
    let defs = `<radialGradient id="casa-brillo"><stop offset="0" stop-color="#ffe2a8" stop-opacity=".75"/><stop offset="1" stop-color="#ffe2a8" stop-opacity="0"/></radialGradient>
      <linearGradient id="casa-cristal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3eef4"/><stop offset="1" stop-color="#9db7c8"/></linearGradient>
      <pattern id="casa-rayado" patternUnits="userSpaceOnUse" width="3.4" height="3.4" patternTransform="rotate(32)"><path d="M0 0V3.4" stroke="#4a3626" stroke-width=".7" stroke-opacity=".3"/></pattern>
      ${azul(EX)}${azul(EY)}${patron('chino', ['chino', '#c9bea8'])}${patron('surcos', ['surcos', '#d4b07c'])}`;
    // la casa está en medio del olivar: márgenes de campo alrededor (más por detrás, donde los árboles no tapan la casa)
    const [MO, MN, ME, MS] = movil ? [1.7, 3.9, 0.8, 0.9] : [5.2, 5.2, 1.9, 1.7];
    const x0 = -MO - 0.3, y0 = -MN - 0.3, x1 = W + ME + 0.3, y1 = Dtot + MS + 0.3;
    // tablero de la maqueta y su sombra rayada sobre la mesa
    const somb = [[x0 + 0.3, y0 + 0.3, -0.32], [x1 + 0.6, y0 + 0.3, -0.32], [x1 + 0.6, y1 + 0.6, -0.32], [x0 + 0.3, y1 + 0.6, -0.32]];
    let out = `<polygon points="${pts(somb)}" fill="rgba(110,80,45,.1)"/><polygon points="${pts(somb)}" fill="url(#casa-rayado)"/>`;
    out += caja(x0, y0, -0.32, x1 - x0, y1 - y0, 0.32, '#c9ab7c', { tapa: '#d6b98a' });
    out += `<polygon points="${pts([[-MO, -MN, 0], [W + ME, -MN, 0], [W + ME, Dtot + MS, 0], [-MO, Dtot + MS, 0]])}" fill="url(#p-surcos)"/>`;
    // hileras de olivos (detrás y a la izquierda de la casa) y plantones jóvenes delante
    const arboles = [], somArb = [], jovenes = [];
    for (let gy = -MN + 0.85; gy < Dtot + MS - 0.3; gy += 1.75) for (let gx = -MO + 0.85; gx < W + ME - 0.3; gx += 1.85) {
      const r = azar(gx + 11, gy + 7), X = gx + (r() - 0.5) * 0.3, Y = gy + (r() - 0.5) * 0.3;
      if (gy < -1 || gx < -1) { arboles.push([X, Y, 0.72 + r() * 0.12, 15]); somArb.push(sombraDisco(X + 0.25, Y + 0.22, 0.7)); }
    }
    const joven = (X, Y, lista) => { lista.push([X, Y, 0.36, 9]); somArb.push(sombraDisco(X + 0.12, Y + 0.12, 0.33)); };
    if (movil) for (let gy = 0.6; gy < Dtot; gy += 1.6) joven(-0.85, gy, arboles);
    else {
      for (let gy = 0.7; gy < Dtot + 0.5; gy += 1.75) joven(W + 0.95, gy, jovenes);
      for (let gx = 0.7; gx < W; gx += 1.85) joven(gx, Dtot + 0.85, jovenes);
    }
    out += `<g fill="rgba(110,80,45,.12)">${somArb.join('')}</g><g fill="url(#casa-rayado)">${somArb.join('')}</g>`;
    arboles.sort((a, b) => (a[0] * EX[1] + a[1] * EY[1]) - (b[0] * EX[1] + b[1] * EY[1]));
    out += arboles.map(([X, Y, t, n]) => dibujaOlivo(X, Y, t, n)).join('');
    jovenes.sort((a, b) => (a[0] * EX[1] + a[1] * EY[1]) - (b[0] * EX[1] + b[1] * EY[1]));
    const delante = jovenes.map(([X, Y, t, n]) => dibujaOlivo(X, Y, t, n)).join('');
    let etiquetas = '';
    const numeros = {};
    const orden = plano.slice().sort((a, b) => (!!SALAS[a[0]].ext - !!SALAS[b[0]].ext) || a[2] - b[2] || a[1] - b[1]);
    orden.forEach(([id, x, y, w, d, alto], i) => {
      const sala = SALAS[id], ext = !!sala.ext;
      defs += patron(id, SUELOS[id]);
      const nExt = y === 0, oExt = x === 0;
      let sombras = '', luces = '', pared = '';
      const items = [];
      const pon = (s, x0, y0, z0, x1, y1, z1, k = 0) => items.push({ s, x0, y0, z0, x1, y1, z1, k });
      const cerca = (mx, my) => !ext && !alto && !((my < 0.7 && nExt) || (mx < 0.7 && oExt)) && ((my < 0.7 && !nExt) || (mx < 0.7 && !oExt));
      const enMuro = (s, pos, len) => (s === 'n' ? nExt : oExt) && pos + len <= (s === 'n' ? w : d) - 0.05;
      const plano3 = (s, X, Y, a, b, l, hh) => s === 'n' ? [[X + a, Y, b], [X + a + l, Y, b], [X + a + l, Y, b + hh], [X + a, Y, b + hh]] : [[X, Y + a, b], [X, Y + a + l, b], [X, Y + a + l, b + hh], [X, Y + a, b + hh]];
      const sombra = (mx, my, r) => { sombras += sombraDisco(x + mx + r * 0.25, y + my + r * 0.25, r); };
      const c = {
        w, d, puerta: salon ? salon[1] + (PUERTA[0] + PUERTA[1]) / 2 - x : 2,
        b(mx, my, mz, bw, bd, bh, col, o) {
          if (mx >= w - 0.15 || my >= d - 0.05) return;
          bw = Math.min(bw, w - mx); bd = Math.min(bd, d - my);
          if (cerca(mx, my) && mz + bh > 1.1) { if (mz >= 1.05) return; bh = 1.1 - mz; }
          if (mz === 0 && bh > 0.15 && !o?.sinSombra) sombras += `<polygon points="${pts([[x + mx + 0.04, y + my + 0.04, 0], [x + mx + bw + 0.2, y + my + 0.04, 0], [x + mx + bw + 0.2, y + my + bd + 0.2, 0], [x + mx + 0.04, y + my + bd + 0.2, 0]])}"/>`;
          pon(caja(x + mx, y + my, mz, bw, bd, bh, col, o), mx, my, mz, mx + bw, my + bd, mz + bh);
        },
        disco(mx, my, z, r, fill, st, sw) { if (mx < w - 0.1) pon(disco(x + mx, y + my, z, r, fill, st, sw), mx - r, my - r, z, mx + r, my + r, z, z < 0.03 ? -0.5 : 0); },
        cil(mx, my, z, r, h, a, l) {
          if (mx >= w - 0.1) return;
          if (z === 0 && h > 0.15) sombra(mx, my, r * 1.1);
          pon(cilindro(x + mx, y + my, z, r, h, a, l), mx - r, my - r, z, mx + r, my + r, z + h);
        },
        forma(dd, z, fill, st) {
          const s = `<path d="${dd}" fill="${fill}"${st ? ` class="tinta-f"` : ''} vector-effect="non-scaling-stroke" transform="${mPlano(x, y, z)}"/>`;
          if (z < 0.03) pon(s, 0, 0, z, 0, 0, z, -0.5); else pon(s, 0, 0, z, w, d, z);
        },
        ven(s, pos, z, len, h) {
          if (!enMuro(s, pos, len)) return;
          const X = s === 'n' ? x : x + 0.02, Y = s === 'n' ? y + 0.02 : y, M = (a, b, l, hh) => plano3(s, X, Y, a, b, l, hh);
          let v = poli(M(pos - 0.08, z - 0.08, len + 0.16, h + 0.16), '#fbf9f5', true) + poli(M(pos, z, len, h), 'url(#casa-cristal)');
          // reja de forja
          let r = '';
          const nb = Math.max(3, Math.round(len / 0.2));
          for (let k = 1; k < nb; k++) { const q = M(pos + (len * k) / nb, z, 0, h); r += lin(q[0], q[3]); }
          [0.2, 0.8].forEach((t) => { const q = M(pos, z + h * t, len, 0); r += lin(q[0], q[1]); });
          v += `<path d="${r}" stroke="#2b2622" stroke-width="1.3" stroke-linecap="round"/>`;
          pared += v;
          const q = s === 'n' ? [[x + pos + 0.3, y + 0.15], [x + pos + len + 0.3, y + 0.15], [x + pos + len + 1, y + 1.7], [x + pos + 1, y + 1.7]] : [[x + 0.15, y + pos + 0.3], [x + 1.7, y + pos + 1], [x + 1.7, y + pos + len + 1], [x + 0.15, y + pos + len + 0.3]];
          luces += poli(q.map((p) => [p[0], p[1], 0.01]), 'rgba(255,246,225,.32)');
        },
        azulejo(s, pos, z, len, h) {
          if (!enMuro(s, pos, len)) return;
          pared += poli(plano3(s, s === 'n' ? x : x + 0.01, s === 'n' ? y + 0.01 : y, pos, z, len, h), `url(#casa-azul-${s})`, true);
        },
        cuadro(s, pos, z, len, h, src, off) {
          const libre = off !== undefined;
          if (!src || (!libre && !enMuro(s, pos, len))) return;
          const X = s === 'n' ? x : x + 0.02, Y = s === 'n' ? y + (libre ? off : 0.02) : y;
          const M = (a, b, l, hh) => plano3(s, X, Y, a, b, l, hh);
          let v = poli(M(pos, z, len, h), '#3a2f25', true) + poli(M(pos + 0.04, z + 0.04, len - 0.08, h - 0.08), '#faf8f4');
          const a = pos + 0.1, l = len - 0.2, hh = h - 0.2;
          const o = s === 'n' ? [X + a, Y + 0.01, z + 0.1 + hh] : [X + 0.01, Y + a, z + 0.1 + hh];
          const [ox, oy] = P(...o), e = s === 'n' ? EX : EY;
          v += `<image href="${src}" width="1" height="1" preserveAspectRatio="xMidYMid slice" transform="matrix(${(l * e[0] * U).toFixed(2)},${(l * e[1] * U).toFixed(2)},0,${(hh * U).toFixed(2)},${f1(ox)},${f1(oy)})"/>`;
          if (libre) pon(v, pos, off, z, pos + len, off + 0.02, z + h); else pared += v;
        },
        tablero(s, pos, z, len, h) {
          if (!enMuro(s, pos, len)) return;
          const Y = y + 0.02;
          let v = poli([[x + pos, Y, z], [x + pos + len, Y, z], [x + pos + len, Y, z + h], [x + pos, Y, z + h]], '#c9b08a', true), t = '';
          [[0.12, 0.25, 0.5], [0.3, 0.2, 0.62], [0.48, 0.3, 0.55]].forEach(([a, b0, b1]) => (t += lin([x + pos + a, Y + 0.01, z + b0], [x + pos + a, Y + 0.01, z + b1 + 0.15])));
          pared += v + `<path d="${t}" stroke="#3a3a3e" stroke-width="2.2" stroke-linecap="round"/>`;
        },
        // buganvilla trepando por un muro alto encalado
        buganvilla(s, a, b) {
          if (!(s === 'n' ? nExt : oExt)) return;
          const r = azar(a + x, b + y), at = (u, z) => P(s === 'n' ? x + u : x + 0.04, s === 'n' ? y + 0.04 : y + u, z);
          let v = '';
          const [r0x, r0y] = at(a + 0.2, 0), [r1x, r1y] = at((a + b) / 2, 2.1);
          v += `<path d="M${f1(r0x)} ${f1(r0y)}C${f1(r0x + 6)} ${f1(r0y - 30)} ${f1(r1x - 10)} ${f1(r1y + 20)} ${f1(r1x)} ${f1(r1y)}" stroke="#6b5544" stroke-width="2" fill="none"/>`;
          for (let k = 0; k < 26; k++) { const [px, py] = at(a + r() * (b - a), 1.1 + r() * 1.4); v += mancha(px, py, 5 + r() * 4, 4 + r() * 3, VERDES[k % 5], false); }
          for (let k = 0; k < 34; k++) { const [px, py] = at(a + r() * (b - a), 1.2 + r() * 1.35); v += mancha(px, py, 2.4 + r() * 2.2, 2 + r() * 1.6, ['#c2376f', '#d9558a', '#b02a62'][k % 3], false, 0.3); }
          pared += v;
        },
        libros(mx, my, z, len, eje, prof) {
          const r = azar(mx + z, my); let p = 0, k = 0;
          while (p < len - 0.06) {
            const wv = 0.05 + r() * 0.05, hv = 0.2 + r() * 0.13, col = LIBROS[(k + Math.floor(r() * 3)) % LIBROS.length];
            if (r() > 0.88) { p += 0.08; k++; continue; }
            if (eje === 'x') c.b(mx + p, my, z, wv, prof, hv, col, { sinSombra: true, sinTinta: true }); else c.b(mx, my + p, z, prof, wv, hv, col, { sinSombra: true, sinTinta: true });
            p += wv + 0.005; k++;
          }
        },
        ropa(mx, my, ztop, len, larga) {
          const r = azar(mx, ztop); let p = 0, k = 0;
          pon(`<path d="${lin([x + mx, y + my + 0.2, ztop + 0.05], [x + mx + len, y + my + 0.2, ztop + 0.05])}" stroke="#8b8f94" stroke-width="1.4"/>`, mx, my, ztop, mx + len, my + 0.4, ztop + 0.05);
          while (p < len - 0.06) {
            const wv = 0.06 + r() * 0.04, hv = (larga ? 0.9 : 0.6) + r() * 0.35;
            c.b(mx + p, my, ztop - hv, wv, 0.4, hv, ROPA[(k * 5 + Math.floor(r() * 4)) % ROPA.length], { blando: 1.6, sinSombra: true, sinTinta: true });
            p += wv + 0.02; k++;
          }
        },
        // maceta de barro: con geranios si lleva color de flor; si no, una planta de hoja
        maceta(mx, my, z = 0, t = 1, flor) {
          if (mx >= w - 0.1 || my >= d - 0.05) return;
          const r = azar(mx * 3 + z, my * 7), rp = 0.14 * Math.sqrt(t), hp = 0.26 * Math.sqrt(t);
          if (z === 0) sombra(mx, my, rp * 1.6);
          let s = cilindro(x + mx, y + my, z, rp, hp, '#5a4030', '#b8613f');
          const [bx, by] = P(x + mx, y + my, z + hp);
          if (flor) {
            for (let k = 0; k < 6; k++) s += mancha(bx + (r() - 0.5) * 16 * t, by - 4 * t + (r() - 0.6) * 9 * t, (5 + r() * 3) * t, (3.5 + r() * 2) * t, VERDES[k % 5], k % 2 === 0);
            for (let k = 0; k < 9; k++) s += `<circle cx="${f1(bx + (r() - 0.5) * 18 * t)}" cy="${f1(by - 6 * t + (r() - 0.6) * 10 * t)}" r="${f1(1.6 + r() * 1.3)}" fill="${flor}" stroke="#3d2f25" stroke-width=".4"/>`;
          } else {
            const n = Math.round(7 + 4 * t);
            for (let k = 0; k < n; k++) {
              const ang = -165 + (150 * k) / (n - 1) + (r() - 0.5) * 18, len = (11 + r() * 8) * t, rad = (ang * Math.PI) / 180;
              const cx = bx + Math.cos(rad) * len * 0.55, cy = by + Math.sin(rad) * len * 0.55;
              s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(len * 0.55)}" ry="${f1(len * 0.19)}" fill="${VERDES[k % 5]}" stroke="#3d2f25" stroke-width=".35" transform="rotate(${f1(ang)} ${f1(cx)} ${f1(cy)})"/>`;
            }
          }
          pon(s, mx - rp, my - rp, z, mx + rp, my + rp, z + hp + 0.4 * t);
        },
        // olivo: tronco retorcido y copa plateada a manchas
        olivo(mx, my, t = 1) {
          if (mx >= w - 0.3) return;
          sombras += sombraDisco(x + mx + 0.35 * t, y + my + 0.3 * t, 0.95 * t);
          pon(dibujaOlivo(x + mx, y + my, t), mx - 0.3, my - 0.3, 0, mx + 0.3, my + 0.3, 2);
        },
        // granado (por Granada): tronco de varios pies, copa verde oscura y granadas rojas con su corona
        granado(mx, my) {
          if (mx >= w - 0.3) return;
          const r = azar(mx + 4, my + 3);
          sombra(mx, my, 0.6);
          const [bx, by] = P(x + mx, y + my, 0), [tx, ty] = P(x + mx, y + my, 1.05);
          let s = '';
          [[-7, 2], [0, -2], [7, 3]].forEach(([dx, cx]) => { const d0 = `M${f1(bx + dx * 0.25)} ${f1(by)}Q${f1(bx + cx)} ${f1((by + ty) / 2)} ${f1(tx + dx)} ${f1(ty + 4)}`; s += `<path d="${d0}" stroke="#3d2f25" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="${d0}" stroke="#806552" stroke-width="2" fill="none" stroke-linecap="round"/>`; });
          s += mancha(tx, ty - 8, 22, 15, '#3f5f2c');
          for (let k = 0; k < 14; k++) s += mancha(tx + (r() - 0.5) * 36, ty - 8 + (r() - 0.5) * 22, 4 + r() * 3, 3 + r() * 2, ['#4f7436', '#5d8540', '#36552a'][k % 3], false, 0.3);
          for (let k = 0; k < 9; k++) {
            const gx = tx + (r() - 0.5) * 34, gy = ty - 6 + (r() - 0.4) * 20;
            s += `<circle cx="${f1(gx)}" cy="${f1(gy)}" r="2.6" fill="#b8232f" stroke="#3d2f25" stroke-width=".5"/><path d="M${f1(gx - 0.9)} ${f1(gy - 2.4)}l.9 -1.3l.9 1.3" stroke="#6e1a20" stroke-width=".7" fill="none"/><circle cx="${f1(gx - 0.8)}" cy="${f1(gy - 0.8)}" r=".7" fill="#e86a6f"/>`;
          }
          pon(s, mx - 0.3, my - 0.3, 0, mx + 0.3, my + 0.3, 2);
        },
        naranjo(mx, my) {
          if (mx >= w - 0.3) return;
          const r = azar(mx + 1, my + 2);
          sombra(mx, my, 0.7);
          const [bx, by] = P(x + mx, y + my, 0), [tx, ty] = P(x + mx, y + my, 1.3);
          let s = `<path d="M${f1(bx)} ${f1(by)}L${f1(tx)} ${f1(ty + 8)}" stroke="#3d2f25" stroke-width="5" stroke-linecap="round"/><path d="M${f1(bx)} ${f1(by)}L${f1(tx)} ${f1(ty + 8)}" stroke="#7a6350" stroke-width="3.4" stroke-linecap="round"/>`;
          s += mancha(tx, ty - 4, 21, 18, '#4c6b3a') + mancha(tx - 5, ty - 9, 11, 8, '#6a8a4c', false);
          for (let k = 0; k < 12; k++) s += `<circle cx="${f1(tx + (r() - 0.5) * 34)}" cy="${f1(ty - 4 + (r() - 0.5) * 28)}" r="2.1" fill="#e8892c" stroke="#3d2f25" stroke-width=".5"/>`;
          pon(s, mx - 0.3, my - 0.3, 0, mx + 0.3, my + 0.3, 2);
        },
        cipres(mx, my) {
          if (mx >= w - 0.2) return;
          sombra(mx, my, 0.35);
          const [tx, ty] = P(x + mx, y + my, 1.35);
          pon(mancha(tx, ty, 7, 34, '#3f5a3a', true, 0.1) + mancha(tx - 2, ty - 4, 3, 24, '#56724a', false, 0.15), mx - 0.2, my - 0.2, 0, mx + 0.2, my + 0.2, 2.7);
        },
        chumbera(mx, my) {
          if (mx >= w - 0.3) return;
          const r = azar(mx, my + 5);
          sombra(mx, my, 0.4);
          const [bx, by] = P(x + mx, y + my, 0);
          let s = '';
          [[0, -9, 0], [-8, -20, -0.4], [8, -22, 0.4], [-2, -32, 0.1]].forEach(([dx, dy]) => (s += mancha(bx + dx, by + dy, 6.5, 9, '#86a05f')));
          for (let k = 0; k < 10; k++) s += `<circle cx="${f1(bx + (r() - 0.5) * 22)}" cy="${f1(by - 6 - r() * 30)}" r=".7" fill="#f2e3a0"/>`;
          pon(s, mx - 0.2, my - 0.2, 0, mx + 0.2, my + 0.2, 1.4);
        },
        lavanda(mx, my) {
          if (mx >= w - 0.2) return;
          const r = azar(mx + 9, my);
          const [bx, by] = P(x + mx, y + my, 0.15);
          let s = mancha(bx, by, 11, 6, '#7c8f62');
          for (let k = 0; k < 14; k++) { const px = bx + (r() - 0.5) * 20, py = by - 2 + (r() - 0.5) * 4; s += `<path d="M${f1(px)} ${f1(py)}l${f1((r() - 0.5) * 3)} -${f1(5 + r() * 4)}" stroke="#8a6fb0" stroke-width="2" stroke-linecap="round"/>`; }
          pon(s, mx - 0.25, my - 0.2, 0, mx + 0.25, my + 0.2, 0.5);
        },
        fuente(mx, my) {
          sombra(mx, my, 0.75);
          let s = cilindro(x + mx, y + my, 0, 0.66, 0.3, '#f3eee4', '#e3dccd') + disco(x + mx, y + my, 0.3, 0.55, '#8fb9c9', '#3d2f25', 0.6);
          s += cilindro(x + mx, y + my, 0.3, 0.08, 0.5, '#f3eee4', '#ddd5c4') + cilindro(x + mx, y + my, 0.8, 0.24, 0.06, '#f3eee4', '#e3dccd');
          s += disco(x + mx, y + my, 0.86, 0.18, '#a9cfdc');
          const [jx, jy] = P(x + mx, y + my, 0.86), [kx, ky] = P(x + mx, y + my, 1.1);
          s += `<path d="M${f1(jx)} ${f1(jy)}Q${f1(kx)} ${f1(ky - 6)} ${f1(kx + 8)} ${f1(jy + 4)}M${f1(jx)} ${f1(jy)}Q${f1(kx)} ${f1(ky - 6)} ${f1(kx - 8)} ${f1(jy + 4)}" stroke="#cfe6ee" stroke-width="1.3" fill="none"/>`;
          pon(s, mx - 0.66, my - 0.66, 0, mx + 0.66, my + 0.66, 1);
        },
        // galería de arcos encalados (a lo ancho de la sala, a «off» del muro del fondo)
        arcada(pos, off, len, n) {
          const paso = len / n, colH = 1.05;
          let s = '', a = '';
          for (let i = 0; i <= n; i++) s += cilindro(x + pos + i * paso, y + off, 0, 0.07, colH, CAL, '#e4ddcf');
          for (let i = 0; i < n; i++) { const u0 = i * paso, u1 = u0 + paso; a += `M${f1(u0)} ${colH}Q${f1(u0 + paso / 2)} ${colH + 0.62} ${f1(u1)} ${colH}V${colH + 0.5}H${f1(u0)}Z`; }
          s += `<path d="${a}" fill="${CAL}" class="tinta-f" vector-effect="non-scaling-stroke" transform="${mMuro('n', x + pos, y + off, 0)}"/>`;
          s += caja(x + pos - 0.05, y + off - 0.08, colH + 0.5, len + 0.1, 0.16, 0.07, TEJA, { tapa: '#cf8058' });
          pon(s, pos, off - 0.05, 0, pos + len, off + 0.05, colH + 0.6);
        },
        // tapia encalada con remate de teja, en el borde delantero
        tapia(a, b) {
          b = Math.min(b, w); if (b - a < 0.2) return;
          c.b(a, d - 0.18, 0, b - a, 0.18, 0.5, CAL, { tapa: CAL });
          pon(caja(x + a - 0.03, y + d - 0.22, 0.5, b - a + 0.06, 0.26, 0.06, TEJA, { tapa: '#cf8058' }), a, d - 0.22, 0.5, b, d, 0.56);
        },
        poyo(mx, my, len) { c.b(mx, my, 0, len, 0.45, 0.42, CAL, { tapa: '#ece6da' }); c.maceta(mx + 0.25, my + 0.22, 0.42, 0.6, '#d8463a'); c.maceta(mx + len - 0.25, my + 0.22, 0.42, 0.6, '#e2557a'); },
        pozo(mx, my) {
          c.cil(mx, my, 0, 0.36, 0.6, CAL, '#e4ddcf');
          c.disco(mx, my, 0.6, 0.26, '#2b2622');
          c.b(mx - 0.38, my - 0.04, 0, 0.07, 0.07, 1.3, '#6b5544'); c.b(mx + 0.31, my - 0.04, 0, 0.07, 0.07, 1.3, '#6b5544');
          c.b(mx - 0.42, my - 0.05, 1.3, 0.84, 0.09, 0.07, '#6b5544');
        },
        lampMesa(mx, my, z) {
          if (mx >= w - 0.1) return;
          const [gx, gy] = P(x + mx, y + my, z + 0.26);
          pon(cilindro(x + mx, y + my, z, 0.06, 0.18, '#d8cfc0', '#bdb2a0') + cilindro(x + mx, y + my, z + 0.18, 0.12, 0.16, '#fff6e2', '#f2e3c4') + `<circle cx="${f1(gx)}" cy="${f1(gy)}" r="20" fill="url(#casa-brillo)"/>`, mx - 0.12, my - 0.12, z, mx + 0.12, my + 0.12, z + 0.34);
        },
        lampPie(mx, my) {
          if (mx >= w - 0.1) return;
          sombra(mx, my, 0.2);
          const [gx, gy] = P(x + mx, y + my, 1.5);
          pon(disco(x + mx, y + my, 0, 0.16, '#2f2f33') + cilindro(x + mx, y + my, 0, 0.02, 1.45, '#3a3a3e', '#3a3a3e') + cilindro(x + mx, y + my, 1.4, 0.2, 0.28, '#fff6e2', '#efdcb6') + `<circle cx="${f1(gx)}" cy="${f1(gy)}" r="34" fill="url(#casa-brillo)"/>`, mx - 0.2, my - 0.2, 0, mx + 0.2, my + 0.2, 1.7);
          luces += disco(x + mx, y + my, 0.01, 0.9, 'rgba(255,226,168,.22)');
        },
        pantalla(mx, my, z, l, h) {
          if (mx >= w - 0.1) return;
          pon(poli([[x + mx, y + my, z], [x + mx + l, y + my, z], [x + mx + l, y + my, z + h], [x + mx, y + my, z + h]], '#0f1430') + poli([[x + mx + 0.05, y + my, z + 0.05], [x + mx + l - 0.05, y + my, z + 0.05], [x + mx + l - 0.05, y + my, z + h - 0.05], [x + mx + 0.05, y + my, z + h - 0.05]], '#4e6cff'), mx, my, z, mx + l, my + 0.01, z + h);
        },
        // farol de forja
        poste(mx, my) {
          c.b(mx, my, 0, 0.07, 0.07, 1.65, '#2b2622');
          c.b(mx - 0.08, my - 0.08, 1.65, 0.23, 0.23, 0.28, '#f6e2b0'); c.b(mx - 0.1, my - 0.1, 1.93, 0.27, 0.27, 0.05, '#2b2622');
          const [gx, gy] = P(x + mx, y + my, 1.8); pon(`<circle cx="${f1(gx)}" cy="${f1(gy)}" r="26" fill="url(#casa-brillo)"/>`, mx, my, 2, mx + 0.1, my + 0.1, 2.1);
        },
        buzon(mx, my) { c.b(mx, my, 0, 0.08, 0.08, 1, '#2b2622'); c.b(mx - 0.15, my - 0.2, 1, 0.38, 0.48, 0.3, '#3d5a3a', { blando: 2 }); c.b(mx + 0.23, my - 0.05, 1.15, 0.02, 0.06, 0.25, '#c94f3d'); },
        indicador(mx, my) { c.b(mx, my, 0, 0.09, 0.09, 1.75, '#5b4636'); c.b(mx - 0.8, my - 0.02, 1.35, 1.15, 0.05, 0.24, MAD); c.b(mx - 0.02, my - 0.95, 1.0, 0.05, 1.05, 0.22, '#e0bf95'); },
      };
      HAB[id](c, F);
      // suelo
      const sq = [[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]];
      let g = `<polygon class="suelo" points="${pts(sq)}" fill="url(#p-${id})"/>`;
      g += luces + `<g fill="rgba(110,80,45,.12)">${sombras}</g><g fill="url(#casa-rayado)">${sombras}</g>`;
      // muros: los exteriores, altos, encalados, con zócalo de almagra y remate de teja; los interiores, cortados
      const corte = '#2f2a25';
      const muroAlto = (n) => {
        let s = n ? caja(x, y - 0.15, 0, w, 0.15, 2.6, CAL, { tapa: corte }) : caja(x - 0.15, y, 0, 0.15, d, 2.6, '#efe9de', { tapa: corte });
        s += n ? poli([[x, y + 0.005, 0], [x + w, y + 0.005, 0], [x + w, y + 0.005, 0.38], [x, y + 0.005, 0.38]], '#c0694b', true) : poli([[x + 0.005, y, 0], [x + 0.005, y + d, 0], [x + 0.005, y + d, 0.38], [x + 0.005, y, 0.38]], '#b8644a', true);
        s += n ? caja(x - 0.05, y - 0.22, 2.6, w + 0.1, 0.3, 0.09, TEJA, { tapa: '#cf8058' }) : caja(x - 0.22, y - 0.05, 2.6, 0.3, d + 0.1, 0.09, TEJA, { tapa: '#cf8058' });
        let t = '';
        const L = n ? w : d;
        for (let u = 0.2; u < L; u += 0.24) t += n ? lin([x + u, y - 0.22, 2.69], [x + u, y + 0.08, 2.69]) : lin([x - 0.22, y + u, 2.69], [x + 0.08, y + u, 2.69]);
        return s + `<path d="${t}" stroke="#8f4a2e" stroke-width=".8"/>`;
      };
      if (!ext) {
        g += nExt ? muroAlto(true) : caja(x, y - 0.15, 0, w, 0.15, 0.35, '#efeae1', { tapa: corte });
        g += oExt ? muroAlto(false) : caja(x - 0.15, y, 0, 0.15, d, 0.35, '#e6e0d5', { tapa: corte });
      }
      g += pared + ordenar(items);
      if (!ext) {
        if (y + d === Dint) {
          if (id === 'salon') { g += caja(x, y + d, 0, PUERTA[0], 0.15, 0.35, '#efeae1', { tapa: corte }); g += caja(x + PUERTA[1], y + d, 0, w - PUERTA[1], 0.15, 0.35, '#efeae1', { tapa: corte }); }
          else g += caja(x, y + d, 0, w, 0.15, 0.35, '#efeae1', { tapa: corte });
        }
        if (x + w === W) g += caja(x + w, y, 0, 0.15, d, 0.35, '#e6e0d5', { tapa: corte });
      }
      // etiqueta
      // etiqueta: solo un sello pequeño con el número; el nombre sale al pasar o tocar (y está en la leyenda de abajo)
      const [px, py] = P(x + w / 2, y + d / 2, ext ? 0.25 : 0.4), num = String(i + 1);
      const R = movil ? 8.5 : 7.5, tw = sala.n.length * (movil ? 8.4 : 6.9) + 20, th = movil ? 26 : 23;
      etiquetas += `<g class="etq" data-id="${id}" style="--i:${i}" transform="translate(${f1(px)},${f1(py)})"><circle class="anillo" r="${R}"/><circle class="pin" r="${R}"/><text class="num" y="${movil ? 3.6 : 3.3}">${num}</text><g class="nombre" transform="translate(0,${-R - th / 2 - 5})"><rect x="${-tw / 2}" y="${-th / 2}" width="${tw}" height="${th}" rx="3"/><text y="${movil ? 4.5 : 4}">${sala.n}</text></g></g>`;
      numeros[id] = num;
      svgSalas.push(`<g class="room" data-id="${id}" role="button" tabindex="0" aria-label="${sala.n}: ${sala.k}" style="--i:${i}">${g}</g>`);
      const H = ext ? 1.8 : 2.6, esq = [P(x, y, H), P(x + w, y, 0), P(x + w, y + d, 0), P(x, y + d, 0), P(x, y, 0), P(x + w, y, H), P(x, y + d, H)];
      const xs = esq.map((p) => p[0]), ys = esq.map((p) => p[1]);
      cajasSala[id] = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
    });
    const todo = [P(x0, y0, 2.4), P(x1, y0, 2.4), P(x0, y1, 0.5), P(x1, y1, -0.4), P(x0, y1, -0.4), P(x1, y0, -0.4), P(-0.6, -0.6, 2.9)];
    const xs = todo.map((p) => p[0]), ys = todo.map((p) => p[1]), m = 16;
    vbCasa = [Math.min(...xs) - m, Math.min(...ys) - m - 16, Math.max(...xs) - Math.min(...xs) + 2 * m, Math.max(...ys) - Math.min(...ys) + 2 * m + 26];
    svg.setAttribute('viewBox', vbCasa.join(' '));
    svg.innerHTML = `<defs>${defs}</defs>${out}${svgSalas.join('')}<g class="campo-delante">${delante}</g><g class="etiquetas">${etiquetas}</g>`;
    svgSalas.length = 0;
    svg.querySelectorAll('.room').forEach((el) => {
      const etq = svg.querySelector(`.etq[data-id="${el.dataset.id}"]`);
      ['mouseenter', 'focus'].forEach((e) => el.addEventListener(e, () => etq.classList.add('sobre')));
      ['mouseleave', 'blur'].forEach((e) => el.addEventListener(e, () => etq.classList.remove('sobre')));
      el.addEventListener('click', (ev) => { ev.stopPropagation(); entrar(el.dataset.id); });
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); entrar(el.dataset.id, true); } });
    });
    // leyenda: los botones de abajo llevan el mismo número y van en el mismo orden
    const lista = seccion.querySelector('.casa-ir ul');
    [...lista.children].sort((a, b) => numeros[a.firstElementChild.dataset.sala] - numeros[b.firstElementChild.dataset.sala]).forEach((li) => {
      const bt = li.firstElementChild; bt.dataset.num = numeros[bt.dataset.sala]; lista.appendChild(li);
    });
    actual = null; seccion.classList.remove('zoom'); cerrarPanel();
  }

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
  seccion.querySelectorAll('[data-sala]').forEach((b) => ['mouseenter', 'mouseleave', 'focus', 'blur'].forEach((e) => b.addEventListener(e, () => {
    svg.querySelector(`.etq[data-id="${b.dataset.sala}"]`)?.classList.toggle('sobre', e === 'mouseenter' || e === 'focus');
  })));
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
