/* =========================================================
   static-cinematic.js  —  pasta-cod3.github.io
   Usato da: about.html, contatti.html
   - Lenis smooth scroll (se GSAP/ScrollTrigger disponibili)
   - Terminal-box: i comandi si scrivono da soli (macchina da
     scrivere reale), l'output si mette a fuoco dopo (blur → nitido)
   - Blocchi ".about-block": reveal a cascata quando entrano
     in viewport scorrendo (numero → titolo → contenuto)
   - Card interattive (terminal-box, cert-badge, stack-item,
     tool-badge): tilt 3D al mouse + luccichio, solo visivo —
     non diventano cliccabili/navigabili.
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !reduced && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGsap) {
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
  }

  /* ── Tilt 3D + luccichio per le card interattive ─────────── */
  function makeTiltCard(el, maxTilt, lift) {
    const shimmer = document.createElement('span');
    shimmer.className = 'tc-shimmer';
    shimmer.setAttribute('aria-hidden', 'true');
    const bar = document.createElement('span');
    bar.className = 'tc-shimmer-bar';
    shimmer.appendChild(bar);
    el.appendChild(shimmer);
    el.classList.add('tc-tilt');
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) translateZ(${lift}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  }

  if (!reduced) {
    document.querySelectorAll('.terminal-box').forEach(el => makeTiltCard(el, 4, 10));
    document.querySelectorAll('.cert-badge').forEach(el => makeTiltCard(el, 10, 8));
    document.querySelectorAll('.stack-item').forEach(el => makeTiltCard(el, 6, 6));
    document.querySelectorAll('.tool-badge').forEach(el => makeTiltCard(el, 8, 5));
  }

  /* ── Terminal box: macchina da scrivere reale ────────────── */
  function typeText(el, text, speed) {
    return new Promise(resolve => {
      el.textContent = '';
      let i = 0;
      (function step() {
        el.textContent = text.slice(0, i);
        i++;
        if (i <= text.length) setTimeout(step, speed + Math.random() * 18);
        else resolve();
      })();
    });
  }

  function cmdOutputPairs(box) {
    return [...box.querySelectorAll('.t-cmd')].map(cmd => {
      const line = cmd.closest('div');
      const out = line ? line.nextElementSibling : null;
      return { cmd, out: (out && out.classList.contains('t-output')) ? out : null };
    });
  }

  async function runTerminal(box) {
    if (box.dataset.typed) return;
    box.dataset.typed = '1';
    for (const { cmd, out } of cmdOutputPairs(box)) {
      const full = cmd.textContent;
      if (!reduced) {
        await typeText(cmd, full, 24);
      } else {
        cmd.textContent = full;
      }
      if (out) {
        out.style.transition = 'opacity .5s ease, filter .5s ease, transform .5s ease';
        out.style.opacity = '1';
        out.style.filter = 'blur(0px)';
        out.style.transform = 'translateY(0)';
        if (!reduced) await new Promise(r => setTimeout(r, 320));
      }
    }
    const cursorLine = box.querySelector('#tCursorLine');
    if (cursorLine) {
      cursorLine.style.transition = 'opacity .4s ease';
      cursorLine.style.opacity = '1';
    }
  }

  const boxes = [...document.querySelectorAll('.terminal-box')];
  const outputsToHide = new Set();
  boxes.forEach(box => {
    cmdOutputPairs(box).forEach(({ out }) => { if (out) outputsToHide.add(out); });
    const cursorLine = box.querySelector('#tCursorLine');
    if (cursorLine) cursorLine.style.opacity = '0';
  });
  outputsToHide.forEach(out => {
    out.style.opacity = '0';
    out.style.filter = 'blur(6px)';
    out.style.transform = 'translateY(8px)';
  });

  if (hasGsap && boxes.length) {
    ScrollTrigger.batch(boxes, {
      start: 'top 85%',
      once: true,
      onEnter: batch => batch.forEach(runTerminal),
    });
  } else {
    boxes.forEach(runTerminal);
  }

  /* ── Reveal a cascata dei blocchi ".about-block" ─────────── */
  const blocks = [...document.querySelectorAll('.about-block')];
  if (hasGsap && blocks.length) {
    blocks.forEach(block => {
      const num = block.querySelector('.about-block-num');
      const h2s = [...block.querySelectorAll('h2')];
      const rest = [...block.querySelectorAll('.about-block-body > *')].filter(el => el.tagName !== 'H2');
      const headEls = [num, ...h2s].filter(Boolean);
      gsap.set(headEls, { opacity: 0, y: 20, filter: 'blur(8px)' });
      gsap.set(rest, { opacity: 0, y: 16 });

      ScrollTrigger.create({
        trigger: block,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
          if (num) tl.to(num, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, clearProps: 'transform,filter' });
          if (h2s.length) tl.to(h2s, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, stagger: 0.12, clearProps: 'transform,filter' }, num ? '-=0.3' : 0);
          if (rest.length) tl.to(rest, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, clearProps: 'transform' }, '-=0.3');
        },
      });
    });
  }
});
