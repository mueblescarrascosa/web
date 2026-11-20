// Comportamiento de la web: menú, cabecera de la portada, visor de fotos, antes/después y formulario.
// Cuenta lo que se hace en la web (sin cookies, con GoatCounter). Si no hay código configurado, no hace nada.
window.medir = (nombre) => { try { window.goatcounter?.count?.({ path: 'evento/' + nombre, title: nombre, event: true }); } catch (e) {} };
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const pagina = () => location.pathname.replace(/^\/web/, '').replace(/\/$/, '').replace(/^\//, '') || 'portada';
  // Cualquier botón de juego (data-accion), enlace a WhatsApp o llamada
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-accion], a[href*="wa.me"], a[href^="tel:"], a[href^="mailto:"], .boton-luz, .quiz-op');
    if (!b) return;
    const que = b.dataset.accion || (b.href?.includes('wa.me') ? 'whatsapp' : b.href?.startsWith('tel:') ? 'llamar' : b.href?.startsWith('mailto:') ? 'correo' : b.classList.contains('boton-luz') ? 'luz-o-puertas' : 'quiz-respuesta');
    window.medir(pagina() + '/' + que);
  }, true);

  // Menú del móvil
  const boton = $('.menu-boton'), menu = $('#menu');
  if (boton && menu) boton.addEventListener('click', () => {
    const abrir = boton.getAttribute('aria-expanded') !== 'true';
    boton.setAttribute('aria-expanded', String(abrir)); boton.setAttribute('aria-label', abrir ? 'Cerrar el menú' : 'Abrir el menú');
    menu.classList.toggle('abierto', abrir); document.body.classList.toggle('menu-abierto', abrir);
    // Con el menú abierto, el desplazamiento suave se para para poder bajar dentro del menú
  });
  // Al tocar un enlace del menú, se cierra
  if (menu) menu.addEventListener('click', e => { if (e.target.closest('a') && menu.classList.contains('abierto')) boton.click(); });
  $$('.desplegable > button').forEach(b => b.addEventListener('click', () => {
    const li = b.parentElement, abrir = !li.classList.contains('abierto');
    li.classList.toggle('abierto', abrir); b.setAttribute('aria-expanded', String(abrir));
  }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.classList.contains('abierto')) boton.click(); });

  // Diseños 3D: la primera galería (parejas 3D / terminada) pasa a comparadores; las demás, a un escaparate
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('.pagina-disenos-3d .wp-block-gallery').forEach((g, k) => {
    const figs = $$(':scope > figure', g); if (figs.length < 2) return;
    const datos = figs.map(f => { const im = $('img', f); return { src: im.getAttribute('src'), alt: im.alt, pie: $('figcaption', f)?.textContent || im.alt }; });
    if (k === 0) {
      const caja = document.createElement('div'); caja.className = 'parejas';
      for (let n = 0; n + 1 < datos.length; n += 2) {
        const [a, b] = [datos[n], datos[n + 1]];
        const c = document.createElement('figure'); c.className = 'pareja';
        c.innerHTML = `<div class="comparar apaisado"><img src="${a.src}" alt="${a.alt}" loading="lazy"><img class="despues" src="${b.src}" alt="${b.alt}" loading="lazy"><span class="tirador"></span><span class="etiqueta-foto" style="left:1rem">Diseño 3D</span><span class="etiqueta-foto" style="right:1rem">Terminada</span><input type="range" min="0" max="100" value="50" aria-label="Deslizar para comparar el diseño en 3D con el trabajo terminado"></div><figcaption>${(t => t.charAt(0).toUpperCase() + t.slice(1))(a.alt.replace(/^Diseño en 3D de\s*/i, ''))}</figcaption>`;
        const cmp = $('.comparar', c), r = $('input', c);
        r.addEventListener('input', () => cmp.style.setProperty('--corte', r.value + '%'));
        // Al aparecer, la cortina hace un barrido para invitar a deslizar
        if (!quieto && 'IntersectionObserver' in window) {
          const io = new IntersectionObserver(es => { if (!es[0].isIntersecting) return; io.disconnect();
            const t0 = performance.now(), d = 2200;
            const paso = t => { const p = Math.min(1, (t - t0) / d), v = p < .45 ? 100 - 85 * (1 - (1 - p / .45) ** 3) : 15 + 35 * (1 - (1 - (p - .45) / .55) ** 3);
              cmp.style.setProperty('--corte', v + '%'); r.value = v; if (p < 1 && !c.dataset.tocado) requestAnimationFrame(paso); };
            cmp.style.setProperty('--corte', '100%'); requestAnimationFrame(paso);
          }, { threshold: .55 });
          io.observe(c); r.addEventListener('pointerdown', () => c.dataset.tocado = 1);
        }
        caja.append(c);
      }
      g.replaceWith(caja);
      return;
    }
    const esc = document.createElement('div'); esc.className = 'escaparate';
    esc.innerHTML = `<div class="escenario"><img src="${datos[0].src}" alt="${datos[0].alt}" loading="lazy"><button class="ant" aria-label="Diseño anterior">‹</button><button class="sig" aria-label="Diseño siguiente">›</button><p class="pie"><span class="cuenta"></span><span class="texto"></span></p></div><div class="miniaturas" role="tablist">${datos.map((d, n) => `<button role="tab" aria-label="${d.pie}" aria-selected="${n === 0}"><img src="${d.src.replace(/\.webp$/, '-800.webp')}" onerror="this.onerror=null;this.src='${d.src}'" alt="" loading="lazy"></button>`).join('')}</div>`;
    const esc_ = $('.escenario', esc), minis = $$('.miniaturas button', esc);
    let i = 0, ocupado = false;
    const rotulo = () => { $('.cuenta', esc).textContent = String(i + 1).padStart(2, '0') + ' / ' + String(datos.length).padStart(2, '0'); $('.texto', esc).textContent = datos[i].pie; };
    const ir = (n) => {
      n = (n + datos.length) % datos.length; if (n === i || ocupado) return;
      const dir = n > i ? 1 : -1; i = n; ocupado = true;
      minis.forEach((b, m) => b.setAttribute('aria-selected', String(m === i)));
      minis[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: quieto ? 'auto' : 'smooth' });
      const viejo = $('.escenario > img', esc), nuevo = new Image(); nuevo.src = datos[i].src; nuevo.alt = datos[i].alt;
      const poner = () => {
        viejo.after(nuevo); rotulo();
        if (quieto) { viejo.remove(); ocupado = false; return; }
        const a = nuevo.animate([{ clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', transform: 'scale(1.12)' }, { clipPath: 'inset(0 0 0 0)', transform: 'scale(1)' }], { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)' });
        viejo.animate([{ transform: 'none', filter: 'brightness(1)' }, { transform: `translateX(${-12 * dir}%) scale(.96)`, filter: 'brightness(.35)' }], { duration: 900, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
        a.onfinish = () => { viejo.remove(); ocupado = false; };
      };
      nuevo.decode ? nuevo.decode().then(poner, poner) : (nuevo.onload = poner);
    };
    $('.ant', esc).onclick = () => ir(i - 1); $('.sig', esc).onclick = () => ir(i + 1);
    minis.forEach((b, n) => b.onclick = () => ir(n));
    esc.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') ir(i - 1); if (e.key === 'ArrowRight') ir(i + 1); });
    let x0 = null; esc_.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
    esc_.addEventListener('touchend', e => { if (x0 == null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) ir(i + (d < 0 ? 1 : -1)); x0 = null; });
    rotulo(); g.replaceWith(esc);
  });

  // Páginas interiores: fotos que se destapan y textos que suben al entrar en pantalla
  if (!$('.es-portada') && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fichas = $$('.contenido .wp-block-group').filter(g => g.querySelector(':scope > h3 + figure'));
    const destapar = [...new Set([...fichas.flatMap(g => $$(':scope > .wp-block-image, :scope > .wp-block-gallery > figure', g)),
      ...$$('.contenido .wp-block-gallery > figure, .contenido > .wp-block-image, .contenido .wp-block-group > .wp-block-image')])];
    const subir = [...fichas.flatMap(g => $$(':scope > h3, :scope > p', g)), ...$$('.contenido h2, .tarjeta, .escaparate, .pareja')];
    if (destapar.length || subir.length) {
      document.documentElement.classList.add('revela');
      destapar.forEach(el => el.classList.add('destapa'));
      subir.forEach(el => el.classList.add('aparece'));
      // Las fotos de una misma galería salen una detrás de otra
      $$('.contenido .wp-block-gallery').forEach(g => [...g.children].forEach((f, n) => f.style.transitionDelay = (n % 4) * 90 + 'ms'));
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
      [...destapar, ...subir].forEach(el => io.observe(el));
    }
  }

  // Mapa de Contacto: Google Maps solo se carga si el visitante lo pide
  const tapa = $('.mapa-tapa button');
  if (tapa) tapa.addEventListener('click', () => {
    const caja = tapa.closest('.mapa'), f = document.createElement('iframe');
    f.src = caja.dataset.mapa; f.title = 'Mapa: cómo llegar al taller'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    caja.append(f); tapa.closest('.mapa-tapa').remove();
  });

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

  // Cita para medir: de lunes a viernes, desde mañana; los viernes solo por la mañana
  const cita = $('#form-cita');
  if (cita) {
    const dia = cita.elements.dia, aviso = $('.cita-aviso', cita), tarde = $('input[name="franja"][value^="tarde"]', cita);
    const iso = (d) => d.toISOString().slice(0, 10), manana = new Date(Date.now() + 864e5), limite = new Date(Date.now() + 60 * 864e5);
    dia.min = iso(manana); dia.max = iso(limite);
    const revisar = () => {
      aviso.textContent = ''; tarde.disabled = false; tarde.closest('label').style.opacity = '';
      if (!dia.value) return true;
      const d = new Date(dia.value + 'T12:00:00'), s = d.getDay();
      if (s === 0 || s === 6) { aviso.textContent = 'Los fines de semana no medimos: elige de lunes a viernes.'; return false; }
      if (s === 5) { tarde.disabled = true; tarde.closest('label').style.opacity = '.4'; if (tarde.checked) $('input[name="franja"]', cita).checked = true; aviso.textContent = 'Los viernes, solo por la mañana.'; }
      return true;
    };
    dia.addEventListener('change', revisar);
    // Si viene de un juego («Pide cita para medirlo»): qué hay que medir y el diseño, que va en el mensaje
    const qs = new URLSearchParams(location.search), cajaDiseno = $('.cita-diseno', cita);
    let diseno = qs.get('diseno') || '';
    const que = qs.get('que'), opcion = que && $(`input[name="que"][value="${que.replace(/"/g, '')}"]`, cita);
    if (opcion) opcion.checked = true;
    if (diseno && cajaDiseno) {
      $('span', cajaDiseno).textContent = diseno.split('\n')[0];
      cajaDiseno.hidden = false;
      $('button', cajaDiseno).addEventListener('click', () => { diseno = ''; cajaDiseno.hidden = true; });
    }
    cita.addEventListener('submit', e => {
      e.preventDefault();
      if (!cita.reportValidity() || !revisar()) return;
      window.medir('contacto/cita');
      const d = new FormData(cita), fecha = new Date(d.get('dia') + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      const texto = `Hola, soy ${d.get('nombre')}. Quiero pedir cita para medir: ${d.get('que').toLowerCase()}.\nDía: ${fecha}, por la ${d.get('franja')}.\nDónde: ${d.get('donde')}\nMi teléfono: ${d.get('telefono')}${diseno ? `\n\nMi diseño:\n${diseno}` : ''}`;
      location.href = e.submitter?.value === 'correo'
        ? `mailto:carrascosamuebles@gmail.com?subject=${encodeURIComponent('Cita para medir: ' + d.get('que'))}&body=${encodeURIComponent(texto)}`
        : `https://wa.me/34653451270?text=${encodeURIComponent(texto)}`;
    });
  }

  // Formulario de contacto: prepara el mensaje y lo abre en WhatsApp (o en el correo)
  const form = $('#pide-presupuesto');
  const entradaFotos = form?.querySelector('input[name=fotos]');
  if (entradaFotos) entradaFotos.addEventListener('change', () => {
    const n = entradaFotos.files.length;
    form.querySelector('.fotos-lista').textContent = n ? `${n} ${n === 1 ? 'archivo elegido' : 'archivos elegidos'}: ${[...entradaFotos.files].map((f) => f.name).join(', ')}` : '';
  });
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    window.medir('contacto/presupuesto');
    const d = new FormData(form);
    const texto = `Hola, soy ${d.get('nombre')}. Me interesa: ${d.get('tipo')}.${d.get('pueblo') ? ' Pueblo: ' + d.get('pueblo') + '.' : ''}\n${d.get('mensaje')}${d.get('telefono') ? '\nMi teléfono: ' + d.get('telefono') : ''}`;
    const via = e.submitter?.value || 'whatsapp';
    const fotos = form.querySelector('input[name=fotos]')?.files.length || 0;
    const destino = via === 'correo'
      ? `mailto:carrascosamuebles@gmail.com?subject=${encodeURIComponent('Presupuesto: ' + d.get('tipo'))}&body=${encodeURIComponent(texto)}`
      : `https://wa.me/34653451270?text=${encodeURIComponent(texto + (fotos ? '\n(Ahora te mando las fotos)' : ''))}`;
    if (!fotos) { location.href = destino; return; }
    // Con fotos: el chat o el correo no las pueden llevar solas; se avisa y se abre con un botón cuando la persona lo haya leído
    const av = form.querySelector('.fotos-aviso'), bt = av.querySelector('a');
    av.querySelector('p').textContent = via === 'correo'
      ? `Se abrirá tu correo con el mensaje escrito. Adjunta allí ${fotos === 1 ? 'tu foto' : 'tus ' + fotos + ' fotos'} con el clip 📎 antes de enviarlo.`
      : `Se abrirá nuestro chat de WhatsApp con el mensaje escrito. Mándalo y, después, pulsa el clip 📎 para enviarnos ${fotos === 1 ? 'tu foto' : 'tus ' + fotos + ' fotos'}.`;
    bt.textContent = via === 'correo' ? 'Abrir el correo' : 'Abrir WhatsApp';
    bt.href = destino; if (via !== 'correo') { bt.target = '_blank'; bt.rel = 'noopener'; } else bt.removeAttribute('target');
    av.hidden = false; bt.focus();
  });
})();
