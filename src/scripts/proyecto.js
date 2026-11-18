// «Mi proyecto»: lo último que cada visitante ha diseñado en los juegos (cocina, armario, baño, puerta, salón y el quiz),
// guardado solo en su navegador, para verlo junto y mandarlo al taller en un único mensaje.
// Aquí también va lo común a todos los juegos, que se engancha al guardar: el botón «Pide cita para medirlo» (lleva el
// diseño a la cita), «Comparar dos versiones» y el modo «solo dibujo» (?solo=1) que usan la comparación y el proyecto compartido.
const CLAVE = 'mi_proyecto_v1', CLAVE_COMPARAR = 'comparar_v1';
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const leerProyecto = () => { try { return JSON.parse(localStorage.getItem(CLAVE) || '{}'); } catch (e) { return {}; } };
const escribir = (p) => { try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch (e) {} };
let espera = {};
// Se guarda un poco después del último cambio, para no escribir en cada movimiento de un deslizador
export function guardarEnProyecto(clave, datos) {
  comun(clave, datos);
  if (soloDibujo) return;   // vista de comparación o de proyecto compartido: no pisa lo guardado
  clearTimeout(espera[clave]);
  espera[clave] = setTimeout(() => { const p = leerProyecto(); p[clave] = { ...datos, fecha: Date.now() }; escribir(p); }, 600);
}
export function quitarDeProyecto(clave) { const p = leerProyecto(); delete p[clave]; escribir(p); }
export function ponerEnProyecto(datos) { const p = leerProyecto(); Object.entries(datos).forEach(([k, v]) => (p[k] = { ...v, fecha: Date.now() })); escribir(p); }
// El dibujo, tal cual se ve (con sus colores ya puestos), para enseñarlo en «Mi proyecto»
export const dibujoActual = (svg) => { const c = svg.cloneNode(true); c.removeAttribute('id'); c.classList.remove('redibujo'); return c.outerHTML; };

// ── Lo común a los juegos ──
const QUE = { cocina: 'Cocina', armario: 'Armario o vestidor', bano: 'Baño', puerta: 'Puertas', salon: 'Salón o mueble de TV' };
const soloDibujo = typeof location !== 'undefined' && new URLSearchParams(location.search).has('solo');
if (soloDibujo) document.documentElement.classList.add('solo');
export const conSolo = (enlace) => { const u = new URL(enlace, location.href); u.searchParams.set('solo', '1'); return u.toString(); };
// Enlace a la cita para medir con el diseño: el formulario lo añade al mensaje
export const enlaceCita = (que, texto) => `${BASE}/contacto/?que=${encodeURIComponent(que)}&diseno=${encodeURIComponent(texto)}#cita`;
const leerComparar = () => { try { return JSON.parse(localStorage.getItem(CLAVE_COMPARAR) || '{}'); } catch (e) { return {}; } };
const actual = {};
let enganchado = false;
function comun(clave, datos) {
  actual[clave] = datos;
  const que = QUE[clave];
  if (!que || typeof document === 'undefined') return;
  const cita = document.querySelector('[data-accion="cita"]');
  if (cita) cita.href = enlaceCita(que, `${datos.titulo}: ${datos.resumen}\n${datos.enlace}`);
  const b = document.querySelector('[data-accion="comparar"]');
  if (!b) return;
  const pintarBoton = () => { const a = leerComparar()[clave]; b.textContent = a && a.enlace !== actual[clave].enlace ? '⇄ Comparar con la guardada' : a ? '⇄ Guardada: cambia algo y vuelve a pulsar' : '⇄ Comparar dos versiones'; };
  pintarBoton();
  if (enganchado) return;
  enganchado = true;
  b.addEventListener('click', () => {
    const d = actual[clave], todo = leerComparar(), a = todo[clave];
    if (a && a.enlace !== d.enlace) {
      window.medir?.('comparar/' + clave);
      location.href = `${BASE}/compara/#k=${clave}&t=${encodeURIComponent(d.titulo)}&a=${encodeURIComponent(a.enlace)}&b=${encodeURIComponent(d.enlace)}&ra=${encodeURIComponent(a.resumen)}&rb=${encodeURIComponent(d.resumen)}`;
      return;
    }
    todo[clave] = { enlace: d.enlace, resumen: d.resumen };
    try { localStorage.setItem(CLAVE_COMPARAR, JSON.stringify(todo)); } catch (e) {}
    pintarBoton();
  });
}
export function olvidarComparar(clave) { const t = leerComparar(); delete t[clave]; try { localStorage.setItem(CLAVE_COMPARAR, JSON.stringify(t)); } catch (e) {} }
// En el modo «solo dibujo», el juego le dice a la página que lo contiene cuánto mide, para que el marco se ajuste al dibujo
if (soloDibujo && window.parent !== window) {
  const avisar = () => { const s = document.querySelector('.lienzo > svg'); if (s) window.parent.postMessage({ soloAltura: Math.ceil(s.getBoundingClientRect().height) }, location.origin); };
  addEventListener('load', () => { avisar(); setTimeout(avisar, 600); });
  addEventListener('resize', avisar);
}
// La página que contiene los marcos: ajusta cada uno a la altura que le diga su dibujo
export function ajustarMarcos() {
  addEventListener('message', (ev) => {
    if (ev.origin !== location.origin || !ev.data || !ev.data.soloAltura) return;
    document.querySelectorAll('iframe[data-solo]').forEach((f) => { if (f.contentWindow === ev.source) f.style.height = ev.data.soloAltura + 'px'; });
  });
}
