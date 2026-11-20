// Portada: comparador 3D/real con deslizador y el año 1969 que se desliza con el scroll (GSAP + ScrollTrigger).
// Nada fija la página ni cambia cómo responde la rueda: el scroll siempre avanza.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Del diseño en 3D a la cocina terminada: se compara deslizando
const marco = document.querySelector('.escena-3d .marco');
const desliza = marco?.querySelector('input[type=range]');
if (marco && desliza) {
  const pon = (v) => { marco.style.setProperty('--corte', v + '%'); desliza.value = v; };
  desliza.addEventListener('input', () => pon(+desliza.value));
  // Al aparecer, la cortina hace un barrido corto para invitar a deslizar
  if (!quieto && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return; io.disconnect();
      const t0 = performance.now(), d = 2200;
      const paso = (t) => { const p = Math.min(1, (t - t0) / d), v = p < 0.45 ? 100 - 85 * (1 - (1 - p / 0.45) ** 3) : 15 + 35 * (1 - (1 - (p - 0.45) / 0.55) ** 3); pon(Math.round(v)); if (p < 1) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    }, { threshold: 0.5 });
    io.observe(marco);
  }
}

if (!quieto) {
  const anio = document.querySelector('.anio-gigante');
  if (anio) gsap.fromTo(anio, { xPercent: 12 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: anio, start: 'top bottom', end: 'bottom top', scrub: true } });
  addEventListener('load', () => ScrollTrigger.refresh());
}
