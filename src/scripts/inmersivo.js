// Escenas que se mueven con el scroll (GSAP + ScrollTrigger) y desplazamiento suave (Lenis).
// Quien tenga «reducir movimiento» activado ve la página quieta y completa.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!quieto) {
  // Desplazamiento suave, sincronizado con ScrollTrigger
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const d = document.querySelector(a.getAttribute('href')); if (d) { e.preventDefault(); lenis.scrollTo(d, { offset: -80 }); }
  });

  // 1. La cámara se aleja: de la veta de la madera a la cocina entera
  const zoom = document.querySelector('.escena-zoom');
  if (zoom) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: zoom, start: 'top top', end: '+=140%', scrub: 0.6, pin: true } });
    tl.fromTo(zoom.querySelector('.zoom-foto img'), { scale: 1.9 }, { scale: 1, ease: 'none' }, 0)
      .fromTo(zoom.querySelector('.zoom-foto'), { clipPath: 'inset(18% 26% 18% 26% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' }, 0)
      .fromTo(zoom.querySelector('.zoom-a'), { opacity: 1, y: 0 }, { opacity: 0, y: -60, ease: 'none', duration: 0.35 }, 0)
      .fromTo(zoom.querySelector('.zoom-b'), { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none', duration: 0.35 }, 0.62);
  }

  // 2. Del diseño en 3D a la cocina terminada: una cortina que barre al bajar
  const tresd = document.querySelector('.escena-3d');
  if (tresd) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: tresd, start: 'top top', end: '+=120%', scrub: 0.6, pin: true } });
    tl.fromTo(tresd.querySelector('.real'), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', ease: 'none' }, 0)
      .fromTo(tresd.querySelector('.linea-corte'), { left: '100%' }, { left: '0%', ease: 'none' }, 0)
      .to(tresd.querySelector('.rotulo-3d'), { opacity: 0, ease: 'none', duration: 0.25 }, 0.55)
      .fromTo(tresd.querySelector('.rotulo-real'), { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.25 }, 0.55);
  }

  // 3. Trabajos en horizontal: al bajar, la película pasa de lado
  const pelicula = document.querySelector('.escena-pelicula');
  if (pelicula) {
    const pista = pelicula.querySelector('.pista');
    const distancia = () => pista.scrollWidth - innerWidth + 48;
    gsap.to(pista, { x: () => -distancia(), ease: 'none',
      scrollTrigger: { trigger: pelicula, start: 'top top', end: () => '+=' + distancia(), scrub: 0.6, pin: true, invalidateOnRefresh: true } });
    const barra = pelicula.querySelector('.progreso i');
    if (barra) gsap.fromTo(barra, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pelicula, start: 'top top', end: () => '+=' + distancia(), scrub: true } });
  }

  // 4. La historia se enciende palabra a palabra mientras se lee
  document.querySelectorAll('[data-palabras]').forEach((p) => {
    p.innerHTML = p.textContent.trim().split(/\s+/).map((w) => `<span class="palabra">${w}</span>`).join(' ');
    gsap.fromTo(p.querySelectorAll('.palabra'), { opacity: 0.16 }, { opacity: 1, stagger: 0.05, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  });

  // El año 1969 se desliza en sentido contrario al scroll
  const anio = document.querySelector('.anio-gigante');
  if (anio) gsap.fromTo(anio, { xPercent: 12 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: anio, start: 'top bottom', end: 'bottom top', scrub: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
}
