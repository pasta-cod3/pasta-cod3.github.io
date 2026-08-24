/* =========================================================
   post-reveal.js  —  pasta-cod3.github.io
   Usato da: _layouts/post.html (pagina di lettura articolo)
   Scroll fluido (Lenis) + ingresso cinematografico dell'header
   del post e composizione a blocchi del contenuto mentre si
   scorre (blur → nitido, non solo opacity/y). Ogni blocco entra
   già "a fuoco" prima che l'occhio del lettore lo raggiunga
   (start: 'top 90%'), quindi non interferisce con la lettura.
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ── Header del post: back-link, eyebrow, titolo, meta ──── */
  const back    = document.querySelector('.post-back');
  const eyebrow = document.querySelector('.post-eyebrow');
  const title   = document.querySelector('.post-title');
  const meta    = document.querySelector('.post-meta');

  if (title) {
    gsap.set([back, eyebrow].filter(Boolean), { opacity: 0, y: 14, filter: 'blur(6px)' });
    gsap.set(title, { opacity: 0, y: 22, filter: 'blur(10px)' });
    if (meta) gsap.set(meta, { opacity: 0, y: 10 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (back) tl.to(back, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 });
    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45 }, back ? '-=0.2' : 0);
    tl.to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6 }, '-=0.25');
    if (meta) tl.to(meta, { opacity: 1, y: 0, duration: 0.4, clearProps: 'transform,filter' }, '-=0.3');
  }

  /* ── Contenuto del post: composizione a blocchi in scroll ── */
  const body = document.querySelector('.post-body');
  if (!body) return;

  const blocks = [...body.querySelectorAll('h2, h3, p, ul, ol, blockquote, pre, .mermaid, table, img')];
  if (!blocks.length) return;

  const isMobile = window.innerWidth < 768;
  gsap.set(blocks, { opacity: 0, y: 26, filter: 'blur(6px)' });

  ScrollTrigger.batch(blocks, {
    start: 'top 90%',
    once: true,
    batchMax: isMobile ? 2 : 4,
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: isMobile ? 0.5 : 0.65,
      ease: 'power2.out',
      stagger: isMobile ? 0.05 : 0.08,
      overwrite: true,
      clearProps: 'transform,filter',
    }),
  });
});
