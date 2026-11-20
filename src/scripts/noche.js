// Modo noche para los juegos que no lo traen de serie (armario, baño, puerta y salón): un botón «Noche» en el dibujo
// que oscurece la habitación y deja la luz cálida de una lámpara. La cocina tiene el suyo propio, con sus luces.
const lienzos = [...document.querySelectorAll('.combina-vista .lienzo')].filter((l) => !l.querySelector('[data-luz]'));
lienzos.forEach((l) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'boton-luz boton-noche'; b.setAttribute('aria-pressed', 'false');
  b.innerHTML = '<svg class="luna" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor"/></svg><svg class="sol" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Noche</span>';
  l.appendChild(b);
  b.addEventListener('click', () => {
    const noche = !l.classList.contains('de-noche');
    l.classList.toggle('de-noche', noche);
    b.setAttribute('aria-pressed', String(noche));
    b.querySelector('span').textContent = noche ? 'Día' : 'Noche';
    window.medir?.('noche/' + location.pathname.split('/').filter(Boolean).pop());
  });
});
