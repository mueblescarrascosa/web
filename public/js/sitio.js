// Comportamiento de la web: menú, cabecera de la portada, visor de fotos, antes/después y formulario.
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Menú del móvil
  const boton = $('.menu-boton'), menu = $('#menu');
  if (boton && menu) boton.addEventListener('click', () => {
    const abrir = boton.getAttribute('aria-expanded') !== 'true';
    boton.setAttribute('aria-expanded', String(abrir)); boton.setAttribute('aria-label', abrir ? 'Cerrar el menú' : 'Abrir el menú');
    menu.classList.toggle('abierto', abrir); document.body.classList.toggle('menu-abierto', abrir);
  });
  $$('.desplegable > button').forEach(b => b.addEventListener('click', () => {
    const li = b.parentElement, abrir = !li.classList.contains('abierto');
    li.classList.toggle('abierto', abrir); b.setAttribute('aria-expanded', String(abrir));
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.classList.contains('abierto')) boton.click(); });

  // Portada: la cabecera se vuelve sólida al bajar de la foto
  const cab = $('.cabecera.sobre-foto');
  if (cab) { const f = () => cab.classList.toggle('solida', scrollY > innerHeight * 0.6); addEventListener('scroll', f, { passive: true }); f(); }

  // Proceso de la portada: el paso que está a la vista se enciende y su número sale en grande a la izquierda
  const pasos = $$('.paso'), grande = $('.proceso-fijo .grande');
  if (pasos.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      pasos.forEach(p => p.classList.toggle('activo', p === e.target));
      if (grande) grande.textContent = e.target.dataset.n;
    }), { rootMargin: '-45% 0px -45% 0px' });
    pasos.forEach(p => io.observe(p)); pasos[0].classList.add('activo');
  }

  // Antes y después de Jetpack → deslizador propio
  $$('.wp-block-jetpack-image-compare').forEach(fig => {
    const antes = $('.image-compare__image-before', fig), despues = $('.image-compare__image-after', fig);
    if (!antes || !despues) return;
    const caja = document.createElement('div'); caja.className = 'comparar';
    antes.removeAttribute('width'); antes.removeAttribute('height'); despues.removeAttribute('width'); despues.removeAttribute('height');
    despues.classList.add('despues');
    const r = document.createElement('input'); r.type = 'range'; r.min = 0; r.max = 100; r.value = 50; r.setAttribute('aria-label', 'Deslizar para comparar antes y después');
    const t = document.createElement('span'); t.className = 'tirador';
    const e1 = Object.assign(document.createElement('span'), { className: "etiqueta-foto", textContent: "Antes" }); e1.style.left = '1rem';
    const e2 = Object.assign(document.createElement('span'), { className: "etiqueta-foto", textContent: "Después" }); e2.style.right = '1rem';
    caja.append(antes, despues, t, e1, e2, r);
    r.addEventListener('input', () => caja.style.setProperty('--corte', r.value + '%'));
    $('.juxtapose', fig)?.replaceWith(caja);
  });

  // Visor de fotos: galerías y fotos sueltas del contenido y del mosaico de la portada
  const fotos = $$('.wp-block-gallery img, .contenido .wp-block-image img, .pista img');
  if (fotos.length) {
    const v = document.createElement('div'); v.className = 'visor'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Foto ampliada');
    v.innerHTML = '<figure style="margin:0"><img alt=""><p></p></figure><button class="cerrar" aria-label="Cerrar">×</button><button class="ant" aria-label="Foto anterior">‹</button><button class="sig" aria-label="Foto siguiente">›</button>';
    document.body.append(v);
    let i = 0, volver = null;
    const grande = s => s.replace(/-800\.webp$/, '.webp');
    const ver = n => { i = (n + fotos.length) % fotos.length; const im = fotos[i]; $('img', v).src = grande(im.currentSrc || im.src); $('img', v).alt = im.alt; $('p', v).textContent = im.closest('figure')?.querySelector('figcaption')?.textContent || im.alt || ''; };
    const abrir = n => { volver = document.activeElement; ver(n); v.classList.add('abierto'); $('.cerrar', v).focus(); };
    const cerrar = () => { v.classList.remove('abierto'); volver?.focus(); };
    fotos.forEach((im, n) => {
      const a = im.closest('a'); const objetivo = a || im;
      if (!a) { im.tabIndex = 0; im.setAttribute('role', 'button'); }
      objetivo.addEventListener('click', e => { e.preventDefault(); abrir(n); });
      im.addEventListener('keydown', e => { if (e.key === 'Enter') abrir(n); });
    });
    $('.cerrar', v).onclick = cerrar; $('.ant', v).onclick = () => ver(i - 1); $('.sig', v).onclick = () => ver(i + 1);
    v.addEventListener('click', e => { if (e.target === v) cerrar(); });
    document.addEventListener('keydown', e => { if (!v.classList.contains('abierto')) return; if (e.key === 'Escape') cerrar(); if (e.key === 'ArrowLeft') ver(i - 1); if (e.key === 'ArrowRight') ver(i + 1); });
    let x0 = null; v.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
    v.addEventListener('touchend', e => { if (x0 == null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) ver(i + (d < 0 ? 1 : -1)); x0 = null; });
  }

  // Formulario de contacto: prepara el mensaje y lo abre en WhatsApp (o en el correo)
  const form = $('#pide-presupuesto');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const texto = `Hola, soy ${d.get('nombre')}. Me interesa: ${d.get('tipo')}.${d.get('pueblo') ? ' Pueblo: ' + d.get('pueblo') + '.' : ''}\n${d.get('mensaje')}${d.get('telefono') ? '\nMi teléfono: ' + d.get('telefono') : ''}`;
    const via = e.submitter?.value || 'whatsapp';
    location.href = via === 'correo'
      ? `mailto:carrascosamuebles@gmail.com?subject=${encodeURIComponent('Presupuesto: ' + d.get('tipo'))}&body=${encodeURIComponent(texto)}`
      : `https://wa.me/34653451270?text=${encodeURIComponent(texto)}`;
  });
})();
