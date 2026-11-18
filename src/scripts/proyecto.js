// «Mi proyecto»: lo último que cada visitante ha diseñado en los juegos (cocina, armario, baño, puerta y el quiz),
// guardado solo en su navegador, para verlo junto y mandarlo al taller en un único mensaje.
const CLAVE = 'mi_proyecto_v1';
export const leerProyecto = () => { try { return JSON.parse(localStorage.getItem(CLAVE) || '{}'); } catch (e) { return {}; } };
const escribir = (p) => { try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch (e) {} };
let espera = {};
// Se guarda un poco después del último cambio, para no escribir en cada movimiento de un deslizador
export function guardarEnProyecto(clave, datos) {
  clearTimeout(espera[clave]);
  espera[clave] = setTimeout(() => { const p = leerProyecto(); p[clave] = { ...datos, fecha: Date.now() }; escribir(p); }, 600);
}
export function quitarDeProyecto(clave) { const p = leerProyecto(); delete p[clave]; escribir(p); }
// El dibujo, tal cual se ve (con sus colores ya puestos), para enseñarlo en «Mi proyecto»
export const dibujoActual = (svg) => { const c = svg.cloneNode(true); c.removeAttribute('id'); c.classList.remove('redibujo'); return c.outerHTML; };
