/* =========================================================
   fondamentali.js  —  pasta-cod3.github.io
   Percorso di apprendimento "Fondamentali": nickname, moduli
   tematici, ognuno con le proprie stanze (lettura articolo +
   quiz), circuiti, sblocco lineare. Per superare un modulo e
   sbloccare il successivo serve aver completato tutte le sue
   stanze con almeno il 90% dei circuiti massimi possibili di
   quel modulo — sotto soglia si può rientrare nelle stanze già
   fatte e ripetere il quiz per migliorare il punteggio.

   Ogni stanza ha una difficoltà e 1-3 stanze TryHackMe gratuite
   consigliate sull'argomento. Le stanze "hands-on" (modulo
   Sfruttamento pratico) richiedono in più, dopo il quiz,
   l'inserimento delle flag user/root ottenute su una macchina
   reale per essere considerate completate: pasta-cod3 non può
   verificare le flag reali di TryHackMe (sono uniche per ogni
   deploy/utente), quindi è un passo di autocertificazione con
   validazione minima di formato, dichiarata esplicitamente
   nella UI.

   Stato persistito in localStorage (sopravvive a chiusura
   browser / riavvio PC — è legato al browser/dispositivo).
   ========================================================= */

'use strict';

const FOND_STORAGE_KEY = 'pc3_fondamentali_v2';

/* ─── DIFFICOLTÀ ─────────────────────────────────────────── */

const DIFF_META = {
  facile:    { label: 'Facile',    cls: 'diff-easy' },
  media:     { label: 'Media',     cls: 'diff-medium' },
  difficile: { label: 'Difficile', cls: 'diff-hard' }
};

function diffBadge(level, extraClass) {
  const m = DIFF_META[level] || DIFF_META.facile;
  return `<span class="fond-diff ${m.cls}${extraClass ? ' ' + extraClass : ''}">${m.label}</span>`;
}

/* ─── ICONE (SVG inline, coerenti con lo stile lineare del sito) ─ */

/* Badge "circuiti": foto/illustrazione reale di una scheda madre
   (non un'icona vettoriale), PNG statico in assets/icons/circuit-badge.png.
   Il bagliore, il fluttuare e l'inclinazione 3D sono in CSS. */
function circuitBadge(size) {
  size = size || 20;
  return `<img class="fond-trophy-icon" src="assets/icons/circuit-badge.png" width="${size}" height="${size}" alt="" aria-hidden="true">`;
}

function targetIcon(size) {
  size = size || 18;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
    <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/>
  </svg>`;
}

function externalLinkIcon(size) {
  size = size || 12;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>
  </svg>`;
}

/* Badge "monogramma": fallback usato solo se un'icona reale non è
   registrata in THM_DATA o non riesce a caricarsi (onerror sull'img). */
const THM_MONO_PALETTE = ['#00dd88', '#00c8ff', '#2090ff', '#ffaa20', '#ff3060'];

function thmMonogramData(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = ((words[0] || '')[0] || '?') + ((words[1] || '')[0] || '');
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return { initials: initials.toUpperCase(), color: THM_MONO_PALETTE[hash % THM_MONO_PALETTE.length] };
}

function thmMonogramHtml(name, extraClass) {
  const { initials, color } = thmMonogramData(name);
  return `<span class="fond-thm-mono${extraClass ? ' ' + extraClass : ''}" style="--mono-c:${color}" aria-hidden="true">${esc(initials)}</span>`;
}

/* THM_DATA -> vedi js/fondamentali-data.js */

function thmUrl(name) {
  const d = THM_DATA[name];
  return d ? d.url : `https://tryhackme.com/hacktivities/search?kind=all&searchText=${encodeURIComponent(name)}&contentSubType=free`;
}

function thmIconHtml(name) {
  const d = THM_DATA[name];
  if (!d) return thmMonogramHtml(name);
  return `<span class="fond-thm-icon-wrap">
    <img class="fond-thm-icon" src="${d.icon}" alt="" loading="lazy" width="34" height="34"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    ${thmMonogramHtml(name, 'fond-thm-mono-fallback')}
  </span>`;
}

function flagIcon(size) {
  size = size || 18;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/>
  </svg>`;
}

/* ─── ICONE DEI MODULI (PNG a tema per i primi 5, badge con
   bagliore dietro; i moduli aggiunti dopo riusano lo stesso badge
   ma con una piccola icona SVG inline, in stile coerente) ─── */

function reconIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.3"/>
    <path d="M15.3 15.3 21 21"/>
    <path d="M7.8 10.5h5.4M10.5 7.8v5.4"/>
  </svg>`;
}

function fingerprintIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3a8 8 0 0 0-8 8v2.5"/>
    <path d="M12 3a8 8 0 0 1 8 8v2.5"/>
    <path d="M8 21c1-2 1.3-4.3 1.3-6.5V11a2.7 2.7 0 0 1 5.4 0v1"/>
    <path d="M15.5 21c.6-1.8.9-3.6.9-5.5"/>
    <path d="M5.3 17c.5-1.6.8-3.3.8-5V11a5.9 5.9 0 0 1 11.8 0v2"/>
    <circle cx="12" cy="12" r="0.4" fill="currentColor" stroke="none"/>
  </svg>`;
}

function shieldIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3.5 19 6.3v5.4c0 4.6-2.9 8-7 9.3-4.1-1.3-7-4.7-7-9.3V6.3Z"/>
    <path d="M9.2 12.2 11.2 14.2 15 10"/>
  </svg>`;
}

function signalIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="6" cy="18" r="1.6" fill="currentColor" stroke="none"/>
    <path d="M6 13.5a7 7 0 0 1 7 7"/>
    <path d="M6 9a11.5 11.5 0 0 1 11.5 11.5"/>
    <path d="M6 4.5A16 16 0 0 1 22 20.5"/>
  </svg>`;
}

function terminalIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="2.6" y="4" width="18.8" height="16" rx="2.2"/>
    <path d="M6.6 9.6 10.2 12.5 6.6 15.4"/>
    <path d="M12.6 15.4h5"/>
  </svg>`;
}

function radarIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9.2"/>
    <path d="M5.3 12h2.9l1.7-4.6 2.4 9 1.7-4.4h4.7"/>
  </svg>`;
}

/* MODULE_VISUAL -> vedi js/fondamentali-data.js */

/* Effetto macchina da scrivere per il mini-terminale dei moduli:
   parte quando il modulo entra in viewport (vedi layoutCircuit). */
function typeModuleCommand(el) {
  if (!el || el.dataset.typed) return;
  el.dataset.typed = '1';
  const cmd = el.dataset.cmd || '';
  const cursor = el.nextElementSibling && el.nextElementSibling.classList.contains('fond-mod-cursor')
    ? el.nextElementSibling : null;
  let i = 0;
  const step = () => {
    el.textContent = cmd.slice(0, i);
    i++;
    if (i <= cmd.length) {
      setTimeout(step, 22 + Math.random() * 35);
    } else if (cursor) {
      cursor.classList.add('fond-mod-cursor-blink');
    }
  };
  step();
}

/* ROOMS (dati delle stanze) -> vedi js/fondamentali-data.js */

const ROOM_BY_ID = new Map(ROOMS.map(r => [r.id, r]));

/* MODULES (raggruppamento in moduli) -> vedi js/fondamentali-data.js */

/* BRANCHES (rami Red/Blue/DFIR) -> vedi js/fondamentali-data.js */

const BRANCH_ICON_FN = { radar: radarIcon, terminal: terminalIcon, recon: reconIcon, fingerprint: fingerprintIcon };

function trunkIndices() {
  return MODULES.map((_, i) => i).filter(i => !MODULES[i].branch);
}
function branchIndices(branchId) {
  return MODULES.map((_, i) => i).filter(i => MODULES[i].branch === branchId);
}
function trunkComplete() {
  return trunkIndices().every(i => moduleStats(i).passed);
}
/* Numerazione "locale": posizione del modulo dentro il tronco o
   dentro il proprio ramo, invece del semplice indice globale
   (che con i rami in parallelo non avrebbe più senso da solo). */
function moduleBranchInfo(moduleIndex) {
  const branch = MODULES[moduleIndex].branch || null;
  const idxs = branch ? branchIndices(branch) : trunkIndices();
  const meta = branch ? BRANCHES.find(b => b.id === branch) : null;
  return {
    branch,
    pos: idxs.indexOf(moduleIndex) + 1,
    total: idxs.length,
    label: meta ? `Ramo ${meta.title}` : 'Tronco comune'
  };
}

const CIRCUITS_FIRST_TRY = 20;
const CIRCUITS_RETRY = 10;
const MODULE_PASS_RATIO = 0.9;

function roomMaxCircuits(room) {
  return room.quiz.length * CIRCUITS_FIRST_TRY;
}

/* ─── STATO / PERSISTENZA ────────────────────────────────── */

function defaultState(nickname) {
  return {
    nickname: nickname,
    completed: {},
    focusBranch: null,
    createdAt: new Date().toISOString()
  };
}

function setFocusBranch(branchId) {
  fondState.focusBranch = (fondState.focusBranch === branchId) ? null : branchId;
  saveState(fondState);
}

function loadState() {
  try {
    const raw = localStorage.getItem(FOND_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(FOND_STORAGE_KEY, JSON.stringify(state));
}

let fondState = loadState();
let sessionAttempts = {}; // per-stanza, per-domanda: contatore tentativi (non persistito)

/* ─── HELPERS ────────────────────────────────────────────── */

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function roomCircuits(roomId) {
  const c = fondState.completed[roomId];
  return c ? c.circuits : 0;
}

function totalCircuits() {
  return Object.values(fondState.completed).reduce((sum, c) => sum + c.circuits, 0);
}

function moduleMaxCircuits(mod) {
  return mod.roomIds.reduce((sum, id) => sum + roomMaxCircuits(ROOM_BY_ID.get(id)), 0);
}

function moduleStats(moduleIndex) {
  const mod = MODULES[moduleIndex];
  const max = moduleMaxCircuits(mod);
  const earned = mod.roomIds.reduce((sum, id) => sum + roomCircuits(id), 0);
  const done = mod.roomIds.filter(id => fondState.completed[id]).length;
  const total = mod.roomIds.length;
  const allDone = done === total;
  const ratio = max ? earned / max : 0;
  return { mod, max, earned, done, total, allDone, ratio, passed: allDone && ratio >= MODULE_PASS_RATIO };
}

function modulePrerequisiteMet(moduleIndex) {
  const branch = MODULES[moduleIndex].branch;
  if (!branch) {
    // Modulo del tronco: sblocco lineare rispetto al tronco soltanto.
    const idxs = trunkIndices();
    const pos = idxs.indexOf(moduleIndex);
    return pos === 0 || moduleStats(idxs[pos - 1]).passed;
  }
  // Modulo di un ramo: il primo di ogni ramo richiede il tronco completo
  // (tutti i rami si sbloccano insieme, nessuno prima degli altri); i
  // successivi restano lineari rispetto al proprio ramo soltanto.
  const idxs = branchIndices(branch);
  const pos = idxs.indexOf(moduleIndex);
  if (pos === 0) return trunkComplete();
  return moduleStats(idxs[pos - 1]).passed;
}

function moduleStatus(moduleIndex) {
  if (!modulePrerequisiteMet(moduleIndex)) return 'locked';
  const s = moduleStats(moduleIndex);
  if (!s.allDone) return 'unlocked';
  return s.passed ? 'passed' : 'below-threshold';
}

function moduleNodeClass(status) {
  if (status === 'passed') return 'fond-node-completed';
  if (status === 'below-threshold') return 'fond-node-below-threshold';
  return `fond-node-${status}`; // locked / unlocked
}

function roomStatus(moduleIndex, roomIndexInModule) {
  const mod = MODULES[moduleIndex];
  const roomId = mod.roomIds[roomIndexInModule];
  if (fondState.completed[roomId]) return 'completed';
  if (moduleStatus(moduleIndex) === 'locked') return 'locked';
  const allPriorDone = mod.roomIds.slice(0, roomIndexInModule).every(id => fondState.completed[id]);
  return allPriorDone ? 'unlocked' : 'locked';
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function bindResetBtn() {
  const btn = document.getElementById('fondResetBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('Azzerare i progressi e impostare un nuovo nickname? Questa azione non si può annullare.')) {
      localStorage.removeItem(FOND_STORAGE_KEY);
      fondState = null;
      renderApp();
    }
  });
}

function fmtPct(ratio) {
  return `${Math.round(ratio * 100)}%`;
}

/* ─── RENDER: BOX CONSIGLI THM ───────────────────────────── */

function renderThmBox(room) {
  if (!room.thm || !room.thm.length) return '';
  const cards = room.thm.map(t => `
    <a class="fond-thm-card" href="${thmUrl(t.name)}" target="_blank" rel="noopener noreferrer"
       aria-label="Apri ${esc(t.name)} su TryHackMe (nuova scheda)">
      ${thmIconHtml(t.name)}
      <div class="fond-thm-card-body">
        <div class="fond-thm-card-head">
          <span class="fond-thm-name">${esc(t.name)}</span>
          ${diffBadge(t.difficulty)}
        </div>
        <p class="fond-thm-note">${esc(t.note)}</p>
        <span class="fond-thm-card-link">apri su tryhackme.com ${externalLinkIcon(11)}</span>
      </div>
    </a>
  `).join('');
  return `
    <div class="fond-thm-box">
      <div class="fond-thm-box-head">
        <span class="fond-thm-box-icon" aria-hidden="true">${targetIcon(20)}</span>
        <div>
          <h3>Allenati su TryHackMe</h3>
          <p>${room.thm.length > 1 ? 'Stanze' : 'Stanza'} gratuite consigliate su questo argomento, verificate a mano il 23/08/2026. I tier gratuiti di TryHackMe cambiano nel tempo — se un link smette di funzionare, cercalo direttamente su tryhackme.com.</p>
        </div>
      </div>
      <div class="fond-thm-cards">${cards}</div>
    </div>
  `;
}

/* ─── RENDER: NICKNAME GATE ──────────────────────────────── */

function renderGate() {
  const app = document.getElementById('fondApp');
  app.innerHTML = `
    <div class="fond-gate">
      <div class="terminal-box fond-gate-terminal">
        <div class="terminal-bar">
          <span class="t-dot red" aria-hidden="true"></span>
          <span class="t-dot yellow" aria-hidden="true"></span>
          <span class="t-dot green" aria-hidden="true"></span>
          <span class="terminal-title">bash — percorso-fondamentali:~</span>
        </div>
        <div class="terminal-body">
          <div><span class="t-prompt">$</span> <span class="t-cmd">./avvia-percorso.sh</span></div>
          <div class="t-output" style="margin-top:.5rem">Benvenuto. Prima di iniziare, dimmi come chiamarti.</div>
          <form id="fondGateForm" class="fond-gate-form">
            <span class="t-prompt">set nickname:</span>
            <input type="text" id="fondNicknameInput" class="fond-gate-input" maxlength="24"
                   placeholder="es. cyberpasta" autocomplete="off" required>
          </form>
        </div>
      </div>
      <button type="submit" form="fondGateForm" class="btn-primary fond-gate-submit">→ Entra nel percorso</button>
      <p class="fond-gate-note">I progressi vengono salvati in questo browser (localStorage): restano anche se chiudi la scheda o spegni il PC, ma non si sincronizzano su altri dispositivi.</p>
    </div>
  `;
  const form = document.getElementById('fondGateForm');
  const input = document.getElementById('fondNicknameInput');
  input.focus();
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nick = input.value.trim();
    if (!nick) return;
    fondState = defaultState(nick);
    saveState(fondState);
    renderApp();
  });
}

/* ─── RENDER: STATUS BAR ─────────────────────────────────── */

function renderStatusBar(extra) {
  const passedModules = MODULES.reduce((n, _, i) => n + (moduleStats(i).passed ? 1 : 0), 0);
  const thirdLabel = extra ? extra.label : 'Moduli superati';
  const thirdValue = extra ? extra.value : `${passedModules} / ${MODULES.length}`;
  return `
    <div class="fond-statusbar">
      <div class="fond-status-item">
        <span class="fond-status-label">Operatore</span>
        <span class="fond-status-value">${esc(fondState.nickname)}</span>
      </div>
      <div class="fond-status-item fond-trophy-chip">
        <span class="fond-status-label">Circuiti</span>
        <span class="fond-status-value fond-circuits">${circuitBadge(32)} ${totalCircuits()}</span>
      </div>
      <div class="fond-status-item">
        <span class="fond-status-label">${esc(thirdLabel)}</span>
        <span class="fond-status-value">${esc(thirdValue)}</span>
      </div>
      <button class="fond-reset-btn" id="fondResetBtn" type="button">cambia nickname / azzera</button>
    </div>
  `;
}

/* ─── RENDER: MODULI (vista principale) ──────────────────── */

/* Tilt 3D interattivo al mouse per le card del percorso — sia i
   moduli (M01...) sia le stanze dentro un modulo (U01...): si
   ingrandisce e si muove su più assi (rotateX/rotateY/translateZ)
   seguendo il puntatore, invece del semplice hover piatto —
   coerente con lo stesso pattern già usato per stat-box/cat-card
   in main.js. */
function initNodeTilt() {
  document.querySelectorAll('.fond-node:not(.fond-node-locked)').forEach(el => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(650px) scale(1.06) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(22px) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

function moduleDesignator(i) {
  const info = moduleBranchInfo(i);
  const prefix = info.branch ? info.branch[0].toUpperCase() : 'T';
  return `${prefix}${String(info.pos).padStart(2, '0')}`;
}

/* Markup di un singolo nodo-modulo, usato sia per il tronco sia per i
   moduli dentro un ramo: il node-key è l'indice globale in MODULES, così
   layoutCircuit può collegarli tra loro indipendentemente dal contenitore
   DOM in cui finiscono (tronco vs. colonna di un ramo). */
function renderModuleNodeHtml(i) {
  const mod = MODULES[i];
  const status = moduleStatus(i);
  const stats = moduleStats(i);
  const statusLabel = { locked: 'bloccato', unlocked: 'in corso', passed: 'superato', 'below-threshold': 'sotto soglia' }[status];
  let footer;
  if (status === 'locked') {
    footer = `<span class="fond-node-locked-label">bloccato</span>`;
  } else if (status === 'passed') {
    footer = `<span class="fond-node-circuits">${circuitBadge(20)} ${stats.earned}/${stats.max}</span>`;
  } else if (status === 'below-threshold') {
    footer = `<span class="fond-node-warn">sotto soglia · ${stats.done}/${stats.total} stanze</span>`;
  } else {
    footer = `<span class="fond-node-cta">${stats.done}/${stats.total} stanze · apri →</span>`;
  }
  const visual = MODULE_VISUAL[i] || MODULE_VISUAL[0];
  const iconHtml = visual.img
    ? `<img class="fond-mod-icon-img" src="${visual.img}" alt="" loading="lazy" width="56" height="56">`
    : `<span class="fond-mod-icon-svg">${visual.icon()}</span>`;
  const info = moduleBranchInfo(i);
  return `
    <div class="fond-path-item" data-idx="${i}" data-node-key="${i}">
      <div class="fond-node fond-node-module ${moduleNodeClass(status)}" data-module-index="${i}"
           role="button" tabindex="${status === 'locked' ? '-1' : '0'}"
           aria-disabled="${status === 'locked'}"
           aria-label="${esc(info.label)}, modulo ${info.pos} di ${info.total}: ${esc(mod.title)} — ${statusLabel}">
        <span class="fond-node-head">
          <span class="fond-node-designator">${moduleDesignator(i)}</span>
          <span class="fond-node-led" aria-hidden="true"></span>
        </span>
        <div class="fond-mod-icon" aria-hidden="true">
          <span class="fond-mod-icon-glow"></span>
          ${iconHtml}
        </div>
        <span class="fond-node-title">${esc(mod.title)}</span>
        <div class="fond-mod-term" aria-hidden="true">
          <span class="fond-mod-term-dots"><i></i><i></i><i></i></span>
          <span class="fond-mod-term-path">root@kali</span>
        </div>
        <p class="fond-mod-cmdline">
          <span class="fond-mod-prompt">$</span>
          <span class="fond-mod-type" data-cmd="${esc(visual.cmd)}"></span><span class="fond-mod-cursor">▋</span>
        </p>
        <span class="fond-node-foot">${footer}</span>
        <span class="fond-node-shimmer" aria-hidden="true"></span>
      </div>
    </div>
  `;
}

/* Card segnaposto per un ramo che non ha ancora moduli (oggi: DFIR):
   compare comunque nel bivio, per far vedere che il ramo esiste ed è
   in arrivo, ma non è cliccabile e non tiene traccia di progressi. */
function renderBranchPlaceholderHtml(branch) {
  return `
    <div class="fond-path-item" data-node-key="placeholder-${branch.id}">
      <div class="fond-node fond-node-module fond-node-locked fond-node-preview" aria-hidden="true">
        <span class="fond-node-head">
          <span class="fond-node-designator">${branch.id[0].toUpperCase()}01</span>
          <span class="fond-node-led" aria-hidden="true"></span>
        </span>
        <div class="fond-mod-icon" aria-hidden="true">
          <span class="fond-mod-icon-glow"></span>
          <span class="fond-mod-icon-svg">${(BRANCH_ICON_FN[branch.icon] || reconIcon)()}</span>
        </div>
        <span class="fond-node-title">In arrivo</span>
        <p class="fond-mod-cmdline"><span class="fond-mod-prompt">$</span> <span class="fond-node-locked-label">stanze in preparazione</span></p>
        <span class="fond-node-foot"><span class="fond-node-locked-label">prossimamente</span></span>
      </div>
    </div>
  `;
}

function renderBranchHeadHtml(branch, idxs) {
  const focused = fondState.focusBranch === branch.id;
  const hasModules = idxs.length > 0;
  const passedCount = idxs.reduce((n, i) => n + (moduleStats(i).passed ? 1 : 0), 0);
  const progress = hasModules
    ? `<span class="fond-branch-progress">${passedCount}/${idxs.length} moduli superati</span>`
    : `<span class="fond-branch-progress fond-branch-progress-soon">in arrivo</span>`;
  const focusBtn = hasModules
    ? `<button type="button" class="fond-branch-focus-btn${focused ? ' fond-branch-focus-btn-active' : ''}"
         data-branch="${branch.id}" aria-pressed="${focused}"
         aria-label="${focused ? 'Togli' : 'Segna'} ${esc(branch.title)} come ramo su cui concentrarti">
         ${focused ? '★ il tuo ramo' : '☆ concentrati qui'}
       </button>`
    : '';
  return `
    <div class="fond-branch-head">
      <span class="fond-branch-icon" aria-hidden="true">${(BRANCH_ICON_FN[branch.icon] || reconIcon)()}</span>
      <div class="fond-branch-head-text">
        <h3 class="fond-branch-title">${esc(branch.title)}</h3>
        <p class="fond-branch-subtitle">${esc(branch.subtitle)}</p>
      </div>
      <div class="fond-branch-head-meta">
        ${progress}
        ${focusBtn}
      </div>
    </div>
  `;
}

function renderModules() {
  const app = document.getElementById('fondApp');

  const trunkIdxs = trunkIndices();
  const trunkNodeHtml = trunkIdxs.map(renderModuleNodeHtml).join('');

  const maxBranchModules = Math.max(...BRANCHES.map(b => branchIndices(b.id).length));
  const branchesHtml = BRANCHES.map(branch => {
    const idxs = branchIndices(branch.id);
    const nodesHtml = idxs.length ? idxs.map(renderModuleNodeHtml).join('') : renderBranchPlaceholderHtml(branch);
    const focused = fondState.focusBranch === branch.id;
    // Se questo ramo ha meno moduli del più profondo, riempie lo spazio
    // rimasto con una nota invece di lasciare un riquadro vuoto senza senso.
    const moreComing = idxs.length && idxs.length < maxBranchModules
      ? `<p class="fond-branch-more-soon">+ altri moduli in arrivo per questo ramo</p>` : '';
    return `
      <div class="fond-branch${focused ? ' fond-branch-focused' : ''}${idxs.length ? '' : ' fond-branch-empty'}" data-branch="${branch.id}" style="--branch-accent:${branch.accent};--branch-glow:${branch.glowRgb}">
        ${renderBranchHeadHtml(branch, idxs)}
        <div class="fond-path fond-path-branch" role="list" aria-label="Moduli del ramo ${esc(branch.title)}">
          ${nodesHtml}
        </div>
        ${moreComing}
      </div>
    `;
  }).join('');

  app.innerHTML = `
    ${renderStatusBar()}
    <div class="fond-path-wrap fond-path-wrap-tree" id="fondMapWrap">
      <svg class="fond-path-svg" id="fondMapSvg" aria-hidden="true"></svg>
      <div class="fond-path" id="fondMapGrid" role="list" aria-label="Tronco comune, in sequenza">
        ${trunkNodeHtml}
      </div>
      <p class="fond-fork-label">${trunkComplete() ? '▾ scegli il tuo ramo, o esplorali tutti ▾' : '▾ il bivio si sblocca a tronco completato ▾'}</p>
      <div class="fond-branches">
        ${branchesHtml}
      </div>
      <span class="fond-board-label" aria-hidden="true">pasta-cod3 · fond-board rev.2026</span>
    </div>
  `;

  bindResetBtn();
  initNodeTilt();

  app.querySelectorAll('.fond-node-module:not(.fond-node-locked)').forEach(node => {
    const trigger = () => {
      const idx = parseInt(node.dataset.moduleIndex, 10);
      pushHistoryView({ view: 'moduleMap', moduleIndex: idx });
      renderModuleMap(idx);
      document.getElementById('fondApp').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    node.addEventListener('click', trigger);
    node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
  });

  app.querySelectorAll('.fond-branch-focus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setFocusBranch(btn.dataset.branch);
      renderModules();
      document.getElementById('fondApp').scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  });

  /* Collegamenti: catena del tronco, poi il bivio (ultimo nodo del
     tronco verso il primo nodo di ognuno dei 3 rami), poi la catena
     interna di ciascun ramo. */
  const edgeState = (a, b) => {
    const sa = moduleStatus(a), sb = moduleStatus(b);
    if (sa === 'passed' && sb === 'passed') return 'done';
    if (sa === 'passed' && (sb === 'unlocked' || sb === 'below-threshold')) return 'active';
    return 'idle';
  };

  const edges = [];
  for (let k = 0; k < trunkIdxs.length - 1; k++) {
    edges.push({ a: trunkIdxs[k], b: trunkIdxs[k + 1], state: edgeState(trunkIdxs[k], trunkIdxs[k + 1]) });
  }
  const lastTrunk = trunkIdxs[trunkIdxs.length - 1];
  BRANCHES.forEach((branch, bi) => {
    // Su layout a colonna singola (mobile) i tre rami condividono la
    // stessa x: senza un piccolo offset di partenza le tre tracce del
    // bivio si sovrapporrebbero esattamente, nascondendosi a vicenda.
    const startOffsetX = (bi - (BRANCHES.length - 1) / 2) * 10;
    const idxs = branchIndices(branch.id);
    if (!idxs.length) {
      edges.push({ a: lastTrunk, b: `placeholder-${branch.id}`, state: 'preview', elbowBefore: '.fond-branches', branch: branch.id, startOffsetX });
      return;
    }
    const forkState = !trunkComplete() ? 'idle' : (moduleStats(idxs[0]).passed ? 'done' : 'active');
    edges.push({ a: lastTrunk, b: idxs[0], state: forkState, elbowBefore: '.fond-branches', branch: branch.id, startOffsetX });
    for (let k = 0; k < idxs.length - 1; k++) {
      edges.push({ a: idxs[k], b: idxs[k + 1], state: edgeState(idxs[k], idxs[k + 1]), branch: branch.id });
    }
  });

  layoutCircuit(edges);
}

/* ─── RENDER: MAPPA DI UN MODULO (le sue stanze) ─────────── */

function renderModuleMap(moduleIndex) {
  const mod = MODULES[moduleIndex];
  const stats = moduleStats(moduleIndex);
  const app = document.getElementById('fondApp');

  const nodeHtml = mod.roomIds.map((roomId, ri) => {
    const room = ROOM_BY_ID.get(roomId);
    const status = roomStatus(moduleIndex, ri);
    const circuits = roomCircuits(roomId);
    const max = roomMaxCircuits(room);
    const statusLabel = status === 'completed' ? 'completata' : status === 'unlocked' ? 'sbloccata' : 'bloccata';
    const designator = `U${String(ri + 1).padStart(2, '0')}`;

    const detailLine = status === 'completed'
      ? `[!] circuiti ${circuits}/${max} · ${fmtPct(max ? circuits / max : 0)}`
      : status === 'unlocked'
        ? `[!] difficoltà ${DIFF_META[room.difficulty].label.toLowerCase()} · da completare`
        : `[!] richiede la stanza precedente`;

    const resultLine = status === 'completed'
      ? 'superata ✓'
      : status === 'unlocked'
        ? 'apri stanza →'
        : 'bloccata';

    return `
      <div class="fond-path-item" data-idx="${ri}" data-node-key="${ri}">
        <div class="fond-node fond-node-room-term fond-node-${status}" data-room-id="${roomId}"
             role="button" tabindex="${status === 'locked' ? '-1' : '0'}"
             aria-disabled="${status === 'locked'}"
             aria-label="Stanza ${ri + 1} di ${mod.roomIds.length}: ${esc(room.title)} — ${statusLabel}, difficoltà ${DIFF_META[room.difficulty].label}">
          <div class="fond-term-bar" aria-hidden="true">
            <span class="fond-term-dot red"></span>
            <span class="fond-term-dot yellow"></span>
            <span class="fond-term-dot green"></span>
            <span class="fond-term-bar-title">${designator}.sh — ${statusLabel}</span>
          </div>
          <div class="fond-term-body">
            <div class="fond-term-line fond-term-cmd"><span class="fond-term-prompt">$</span> inspect_room --id ${designator}</div>
            <div class="fond-term-line fond-term-info">[*] ${esc(room.title)}</div>
            <div class="fond-term-line fond-term-warn">${detailLine}</div>
            <div class="fond-term-line fond-term-result">&gt;&gt; ${resultLine}<span class="fond-term-cursor" aria-hidden="true">▋</span></div>
          </div>
          <span class="fond-node-shimmer" aria-hidden="true"></span>
        </div>
      </div>
    `;
  }).join('');

  const banner = stats.allDone ? `
    <div class="fond-threshold-banner ${stats.passed ? 'fond-threshold-pass' : 'fond-threshold-fail'}">
      ${stats.passed
        ? `<strong>Modulo superato ✓</strong> — ${stats.earned}/${stats.max} circuiti (${fmtPct(stats.ratio)}).`
        : `<strong>Sotto soglia</strong> — ${stats.earned}/${stats.max} circuiti (${fmtPct(stats.ratio)}). Serve almeno il ${fmtPct(MODULE_PASS_RATIO)} (${Math.ceil(stats.max * MODULE_PASS_RATIO)}) per sbloccare il modulo successivo. Riapri una stanza qui sotto e premi "Riprova quiz" per migliorare il punteggio.`
      }
    </div>` : '';

  const branchInfo = moduleBranchInfo(moduleIndex);

  app.innerHTML = `
    ${renderStatusBar({ label: 'Modulo', value: `${branchInfo.pos}/${branchInfo.total} · ${stats.done}/${stats.total} stanze` })}
    <div class="fond-room">
      <button class="fond-back-map" id="fondBackModules" type="button">← Torna ai moduli</button>
      <div class="fond-room-head">
        <span class="fond-room-eyebrow">${esc(branchInfo.label)} · Modulo ${branchInfo.pos} / ${branchInfo.total}</span>
        <h2 class="fond-room-title">${esc(mod.title)}</h2>
        <p class="fond-room-excerpt">${esc(mod.subtitle)}</p>
      </div>
      ${banner}
    </div>
    <div class="fond-path-wrap" id="fondMapWrap">
      <svg class="fond-path-svg" id="fondMapSvg" aria-hidden="true"></svg>
      <div class="fond-path" id="fondMapGrid" role="list" aria-label="Stanze del modulo, in sequenza">
        ${nodeHtml}
      </div>
      <span class="fond-board-label" aria-hidden="true">pasta-cod3 · ${esc(mod.id)}</span>
    </div>
  `;

  bindResetBtn();
  initNodeTilt();
  document.getElementById('fondBackModules').addEventListener('click', () => history.back());

  app.querySelectorAll('.fond-node:not(.fond-node-locked)').forEach(node => {
    const trigger = () => {
      const ri = mod.roomIds.indexOf(node.dataset.roomId);
      pushHistoryView({ view: 'room', moduleIndex, roomIndexInModule: ri });
      renderRoom(moduleIndex, ri);
      document.getElementById('fondApp').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    node.addEventListener('click', trigger);
    node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
  });

  layoutCircuit(mod.roomIds.slice(0, -1).map((_, i) => {
    const a = roomStatus(moduleIndex, i), b = roomStatus(moduleIndex, i + 1);
    let state = 'idle';
    if (a === 'completed' && b === 'completed') state = 'done';
    else if (a === 'completed' && b === 'unlocked') state = 'active';
    return { a: i, b: i + 1, state };
  }));
}

/* ─── PERCORSO: linea verticale animata stile "circuito vivo" ─
   Percorso lineare (non più una griglia a serpentina): i nodi
   sono impilati in colonna, alternati leggermente a sinistra e
   destra, collegati da un'unica curva continua disegnata in SVG
   dopo il layout. I segmenti già completati o attivi si
   "accendono" e restano vivi con una shimmer/flow continua;
   l'ingresso dei nodi in viewport è gestito con
   IntersectionObserver per un effetto reattivo allo scroll.
   ────────────────────────────────────────────────────────── */

function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

let activeEdges = [];
let fondPathObserver = null;
let circuitRelayoutQueued = false;

/* edges: [{ a: <node-key>, b: <node-key>, state: 'done'|'active'|'idle'|'preview' }]
   Il node-key è quello messo in data-node-key su ciascun .fond-path-item:
   così i collegamenti si possono disegnare tra nodi che vivono in
   contenitori DOM diversi (es. tronco + rami affiancati), non solo tra
   fratelli consecutivi come nel vecchio percorso lineare. */
function layoutCircuit(edges) {
  if (edges) activeEdges = edges;
  const currentEdges = activeEdges;

  const wrap = document.getElementById('fondMapWrap');
  const svg = document.getElementById('fondMapSvg');
  if (!wrap || !svg) return;

  const items = [...wrap.querySelectorAll('.fond-path-item')];
  if (!items.length) return;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const wrapRect = wrap.getBoundingClientRect();
    if (!wrapRect.width || !wrapRect.height) return;

    svg.setAttribute('width', wrapRect.width);
    svg.setAttribute('height', wrapRect.height);
    svg.setAttribute('viewBox', `0 0 ${wrapRect.width} ${wrapRect.height}`);
    svg.textContent = '';

    const reduced = prefersReducedMotion();

    const centerByKey = new Map(items.map(el => {
      const r = el.querySelector('.fond-node').getBoundingClientRect();
      return [el.dataset.nodeKey, [r.left - wrapRect.left + r.width / 2, r.top - wrapRect.top + r.height / 2]];
    }));

    // Alcuni edge (il bivio) indicano un elemento PRIMA del quale la
    // svolta orizzontale deve avvenire, cosi' la curva resta sopra tutte
    // le card invece di tagliare in diagonale sopra quelle di altri rami
    // mentre scende verso la propria colonna.
    const elbowBeforeCache = new Map();
    const resolveElbowY = selector => {
      if (elbowBeforeCache.has(selector)) return elbowBeforeCache.get(selector);
      const el = wrap.querySelector(selector);
      const y = el ? (el.getBoundingClientRect().top - wrapRect.top - 14) : null;
      elbowBeforeCache.set(selector, y);
      return y;
    };

    const segPaths = [];
    currentEdges.forEach(({ a, b, state, elbowBefore, branch, startOffsetX }) => {
      const c1 = centerByKey.get(String(a)), c2 = centerByKey.get(String(b));
      if (!c1 || !c2) return;
      const [x1raw, y1] = c1;
      const [x2, y2] = c2;
      const x1 = x1raw + (startOffsetX || 0);
      const forcedElbowY = elbowBefore ? resolveElbowY(elbowBefore) : null;
      let d;
      if (forcedElbowY != null && Math.abs(x2 - x1) > 1) {
        // Bivio: la svolta orizzontale deve stare TUTTA sulla riga
        // dell'elbow, non spalmata su una S-curve (altrimenti taglia
        // in diagonale dentro le card sotto). Due tratti verticali
        // dritti + un angolo smussato sulla riga dell'elbow.
        const dir = x2 > x1 ? 1 : -1;
        const r = Math.max(2, Math.min(18, Math.abs(x2 - x1) / 2, Math.abs(forcedElbowY - y1) / 2, Math.abs(y2 - forcedElbowY) / 2));
        d = `M ${x1} ${y1} L ${x1} ${forcedElbowY - r} Q ${x1} ${forcedElbowY} ${x1 + dir * r} ${forcedElbowY} `
          + `L ${x2 - dir * r} ${forcedElbowY} Q ${x2} ${forcedElbowY} ${x2} ${forcedElbowY + r} L ${x2} ${y2}`;
      } else {
        const ymid = (forcedElbowY != null) ? forcedElbowY : (y1 + y2) / 2;
        d = `M ${x1} ${y1} C ${x1} ${ymid}, ${x2} ${ymid}, ${x2} ${y2}`;
      }

      const branchCls = branch ? ` fond-trace-b-${branch}` : '';
      const path = svgEl('path', { d, class: `fond-trace fond-trace-${state}${branchCls}` });
      svg.appendChild(path);
      segPaths.push({ path, state });

      [[x1, y1], [x2, y2]].forEach(([cx, cy]) => {
        svg.appendChild(svgEl('circle', { cx, cy, r: 4, class: `fond-via fond-via-${state}${branch ? ` fond-via-b-${branch}` : ''}` }));
        svg.appendChild(svgEl('circle', { cx, cy, r: 1.6, class: 'fond-via-hole' }));
      });

      if (state === 'active' && !reduced) {
        const dot = svgEl('circle', { r: 4.5, class: `fond-flow-dot${branch ? ` fond-flow-dot-b-${branch}` : ''}` });
        dot.style.offsetPath = `path('${d}')`;
        svg.appendChild(dot);
      }
    });

    if (fondPathObserver) fondPathObserver.disconnect();

    if (reduced) {
      items.forEach(el => {
        el.classList.add('fond-inview');
        const typeEl = el.querySelector('.fond-mod-type');
        if (typeEl) { typeEl.dataset.typed = '1'; typeEl.textContent = typeEl.dataset.cmd || ''; }
      });
      return;
    }

    // Ingresso animato una tantum dei tratti già "vivi" (done/active),
    // così il percorso si "accende" quando la mappa appare la prima volta.
    segPaths.forEach(({ path, state }, i) => {
      if (state === 'idle' || state === 'preview') return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      path.getBoundingClientRect(); // forza reflow prima di animare
      path.style.transition = `stroke-dashoffset .7s ease ${i * 90}ms`;
      path.addEventListener('transitionend', () => {
        path.style.transition = '';
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
      }, { once: true });
      requestAnimationFrame(() => { path.style.strokeDashoffset = '0'; });
    });

    // Reattività allo scroll: ogni nodo entra in vista con un fade/slide;
    // se contiene il mini-terminale del modulo, parte anche il typewriter.
    fondPathObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('fond-inview');
        const typeEl = entry.target.querySelector('.fond-mod-type');
        if (typeEl) setTimeout(() => typeModuleCommand(typeEl), 260);
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => fondPathObserver.observe(el));
  }));
}

function scheduleCircuitRelayout() {
  if (circuitRelayoutQueued) return;
  circuitRelayoutQueued = true;
  requestAnimationFrame(() => {
    circuitRelayoutQueued = false;
    layoutCircuit();
  });
}

window.addEventListener('resize', () => {
  if (document.getElementById('fondMapGrid')) scheduleCircuitRelayout();
});

/* ─── RENDER: STANZA (lettura + quiz) ────────────────────── */

function renderRoom(moduleIndex, roomIndexInModule) {
  const mod = MODULES[moduleIndex];
  const roomId = mod.roomIds[roomIndexInModule];
  const room = ROOM_BY_ID.get(roomId);
  const status = roomStatus(moduleIndex, roomIndexInModule);
  const app = document.getElementById('fondApp');

  if (status === 'completed') {
    const c = fondState.completed[roomId];
    app.innerHTML = `
      ${renderStatusBar({ label: 'Modulo', value: mod.title })}
      <div class="fond-room">
        <button class="fond-back-map" id="fondBackMap" type="button">← Torna al modulo</button>
        <div class="fond-room-head">
          <span class="fond-room-eyebrow">${esc(mod.title)} · stanza ${roomIndexInModule + 1}/${mod.roomIds.length} · completata ✓ ${diffBadge(room.difficulty, 'fond-room-diff')}</span>
          <h2 class="fond-room-title">${esc(room.title)}</h2>
          <p class="fond-room-excerpt">${esc(room.excerpt)}</p>
          <a href="posts/${room.id}.html" class="btn-ghost" target="_blank" rel="noopener">Rileggi l'articolo completo →</a>
        </div>
        <div class="fond-room-done">
          <p>Punteggio attuale: <strong>${c.correct}/${room.quiz.length}</strong> risposte corrette,
          <strong class="fond-circuits">${circuitBadge(22)} ${c.circuits}/${roomMaxCircuits(room)} circuiti</strong>
          (ultimo tentativo: ${new Date(c.completedAt).toLocaleDateString('it-IT')}).</p>
          ${c.practical ? `<p class="fond-flaggate-done">${flagIcon(14)} Macchina completata: <strong>${esc(c.practical.machine)}</strong> — flag confermate ✓</p>` : ''}
          <button class="btn-ghost" id="fondRetryQuiz" type="button">↻ Riprova quiz</button>
        </div>
        ${renderThmBox(room)}
      </div>
    `;
    bindResetBtn();
    document.getElementById('fondBackMap').addEventListener('click', () => history.back());
    document.getElementById('fondRetryQuiz').addEventListener('click', () => renderQuiz(moduleIndex, roomIndexInModule, true));
    return;
  }

  renderQuiz(moduleIndex, roomIndexInModule, false);
}

function renderQuiz(moduleIndex, roomIndexInModule, isRetry) {
  const mod = MODULES[moduleIndex];
  const roomId = mod.roomIds[roomIndexInModule];
  const room = ROOM_BY_ID.get(roomId);
  const app = document.getElementById('fondApp');

  sessionAttempts[roomId] = room.quiz.map(() => 0);
  const solved = room.quiz.map(() => false);

  app.innerHTML = `
    ${renderStatusBar({ label: 'Modulo', value: mod.title })}
    <div class="fond-room">
      <button class="fond-back-map" id="fondBackMap" type="button">← Torna al modulo</button>
      <div class="fond-room-head">
        <span class="fond-room-eyebrow">${esc(mod.title)} · stanza ${roomIndexInModule + 1}/${mod.roomIds.length}${isRetry ? ' · nuovo tentativo' : ''} ${diffBadge(room.difficulty, 'fond-room-diff')}</span>
        <h2 class="fond-room-title">${esc(room.title)}</h2>
        <p class="fond-room-excerpt">${esc(room.excerpt)}</p>
        <a href="posts/${room.id}.html" class="btn-ghost" target="_blank" rel="noopener">Leggi l'articolo completo →</a>
      </div>
      ${!isRetry ? renderThmBox(room) : ''}
      <div class="fond-quiz" id="fondQuiz">
        <h3 class="fond-quiz-title">Quiz — rispondi correttamente a tutte le domande per ${isRetry ? 'migliorare il punteggio' : (room.practical ? 'passare allo step pratico' : 'sbloccare la stanza successiva')}</h3>
        ${room.quiz.map((q, qi) => `
          <fieldset class="fond-question" id="fondQ${qi}" data-qi="${qi}">
            <legend>${qi + 1}. ${esc(q.q)}</legend>
            <div class="fond-options" role="radiogroup">
              ${q.options.map((opt, oi) => `
                <label class="fond-option">
                  <input type="radio" name="fondQ${qi}" value="${oi}">
                  <span>${esc(opt)}</span>
                </label>
              `).join('')}
            </div>
            <p class="fond-question-feedback" id="fondFeedback${qi}" aria-live="polite"></p>
          </fieldset>
        `).join('')}
        <button class="btn-primary" id="fondSubmitQuiz" type="button">Verifica risposte</button>
      </div>
    </div>
  `;

  bindResetBtn();
  document.getElementById('fondBackMap').addEventListener('click', () => history.back());

  document.getElementById('fondSubmitQuiz').addEventListener('click', () => {
    let allSolved = true;

    room.quiz.forEach((q, qi) => {
      if (solved[qi]) return; // già corretta in questo tentativo, non ritoccare
      const checked = app.querySelector(`input[name="fondQ${qi}"]:checked`);
      const fieldset = document.getElementById(`fondQ${qi}`);
      const feedback = document.getElementById(`fondFeedback${qi}`);

      if (!checked) {
        allSolved = false;
        feedback.textContent = 'Seleziona una risposta.';
        feedback.className = 'fond-question-feedback fond-feedback-warn';
        return;
      }

      const chosen = parseInt(checked.value, 10);
      sessionAttempts[roomId][qi]++;

      if (chosen === q.correct) {
        solved[qi] = true;
        fieldset.classList.add('fond-question-correct');
        fieldset.querySelectorAll('input').forEach(i => i.disabled = true);
        const firstTry = sessionAttempts[roomId][qi] === 1;
        feedback.textContent = firstTry
          ? `Corretto al primo colpo! +${CIRCUITS_FIRST_TRY} circuiti`
          : `Corretto! +${CIRCUITS_RETRY} circuiti`;
        feedback.className = 'fond-question-feedback fond-feedback-ok';
      } else {
        allSolved = false;
        fieldset.classList.add('fond-question-wrong');
        feedback.textContent = 'Risposta sbagliata, riprova.';
        feedback.className = 'fond-question-feedback fond-feedback-err';
      }
    });

    if (allSolved) {
      let earned = 0;
      room.quiz.forEach((q, qi) => {
        earned += sessionAttempts[roomId][qi] === 1 ? CIRCUITS_FIRST_TRY : CIRCUITS_RETRY;
      });
      if (room.practical && !isRetry) {
        renderFlagGate(moduleIndex, roomIndexInModule, earned, isRetry);
      } else {
        completeRoom(moduleIndex, roomIndexInModule, earned, isRetry);
      }
    }
  });
}

/* ─── RENDER: STEP PRATICO (flag gate per stanze hands-on) ─── */

function renderFlagGate(moduleIndex, roomIndexInModule, circuitsEarned, isRetry) {
  const mod = MODULES[moduleIndex];
  const roomId = mod.roomIds[roomIndexInModule];
  const room = ROOM_BY_ID.get(roomId);
  const app = document.getElementById('fondApp');

  app.innerHTML = `
    ${renderStatusBar({ label: 'Modulo', value: mod.title })}
    <div class="fond-room">
      <div class="fond-room-head">
        <span class="fond-room-eyebrow">${esc(mod.title)} · stanza ${roomIndexInModule + 1}/${mod.roomIds.length} · quiz superato ✓ ${diffBadge(room.difficulty, 'fond-room-diff')}</span>
        <h2 class="fond-room-title">${esc(room.title)}</h2>
        <p class="fond-room-excerpt">Questa è una stanza hands-on: per completarla devi esercitarti davvero su una macchina reale. Scegli una delle stanze TryHackMe consigliate qui sotto, portala a termine, e inserisci le flag che hai ottenuto.</p>
      </div>
      ${renderThmBox(room)}
      <div class="fond-flaggate">
        <h3>${flagIcon(18)} Conferma il completamento</h3>
        <p class="fond-flaggate-note">pasta-cod3 non può verificare le flag reali di TryHackMe: sono uniche per ogni deploy/utente, quindi non esiste un valore "corretto" da controllare qui. Questo è un passo di autocertificazione per tracciare il tuo progresso reale, non una validazione contro TryHackMe.</p>
        <form id="fondFlagForm" class="fond-flaggate-form">
          <label class="fond-flaggate-label">Macchina completata
            <input type="text" id="fondFlagMachine" placeholder="es. ${esc(room.thm[0] ? room.thm[0].name : 'Linux PrivEsc')}" required minlength="3" autocomplete="off">
          </label>
          ${room.practical.flags.map(f => `
            <label class="fond-flaggate-label">${esc(f.label)}
              <input type="text" id="fondFlag_${f.key}" placeholder="incolla qui la flag ottenuta" required minlength="4" autocomplete="off">
            </label>
          `).join('')}
          <p class="fond-flaggate-error" id="fondFlagError" aria-live="polite"></p>
          <button type="submit" class="btn-primary">Conferma e completa stanza →</button>
        </form>
      </div>
    </div>
  `;

  bindResetBtn();

  document.getElementById('fondFlagForm').addEventListener('submit', e => {
    e.preventDefault();
    const machine = document.getElementById('fondFlagMachine').value.trim();
    const values = {};
    let ok = machine.length >= 3;
    room.practical.flags.forEach(f => {
      const v = document.getElementById(`fondFlag_${f.key}`).value.trim();
      values[f.key] = v;
      if (v.length < 4) ok = false;
    });
    if (!ok) {
      document.getElementById('fondFlagError').textContent = 'Inserisci il nome della macchina e una flag valida (almeno 4 caratteri) per ogni campo.';
      return;
    }
    completeRoom(moduleIndex, roomIndexInModule, circuitsEarned, isRetry, { machine, values });
  });
}

function completeRoom(moduleIndex, roomIndexInModule, circuitsEarned, isRetry, practicalData) {
  const mod = MODULES[moduleIndex];
  const roomId = mod.roomIds[roomIndexInModule];
  const room = ROOM_BY_ID.get(roomId);

  const prevEntry = fondState.completed[roomId];
  const prevCircuits = roomCircuits(roomId);
  const finalCircuits = isRetry ? Math.max(prevCircuits, circuitsEarned) : circuitsEarned;
  const improved = isRetry && finalCircuits > prevCircuits;

  fondState.completed[roomId] = {
    correct: room.quiz.length,
    circuits: finalCircuits,
    completedAt: new Date().toISOString(),
    practical: practicalData || (prevEntry && prevEntry.practical) || null
  };
  saveState(fondState);

  const stats = moduleStats(moduleIndex);
  const nextRoomId = mod.roomIds[roomIndexInModule + 1];
  const app = document.getElementById('fondApp');
  const max = roomMaxCircuits(room);

  const resultMsg = isRetry
    ? (improved
        ? `Nuovo punteggio: <strong class="fond-circuits">${circuitBadge(22)} ${finalCircuits}/${max}</strong> (prima era ${prevCircuits}/${max}).`
        : `Punteggio confermato: <strong class="fond-circuits">${circuitBadge(22)} ${finalCircuits}/${max}</strong>. Il tentativo precedente era già uguale o migliore.`)
    : `Hai guadagnato <strong class="fond-circuits">${finalCircuits}/${max} circuiti</strong>.`;

  let moduleMsg = '';
  if (stats.allDone && (isRetry || !nextRoomId)) {
    moduleMsg = stats.passed
      ? `<p class="fond-threshold-banner fond-threshold-pass">Modulo <strong>${esc(mod.title)}</strong> superato ✓ — ${stats.earned}/${stats.max} circuiti (${fmtPct(stats.ratio)}). Modulo successivo sbloccato.</p>`
      : `<p class="fond-threshold-banner fond-threshold-fail">Modulo <strong>${esc(mod.title)}</strong> completato ma sotto soglia — ${stats.earned}/${stats.max} circuiti (${fmtPct(stats.ratio)}). Serve almeno il ${fmtPct(MODULE_PASS_RATIO)}: rientra nelle stanze e riprova i quiz per migliorare.</p>`;
  }

  app.innerHTML = `
    ${renderStatusBar({ label: 'Modulo', value: mod.title })}
    <div class="fond-room fond-room-complete">
      <div class="fond-trophy-award" aria-hidden="true">${circuitBadge(70)}</div>
      <div class="fond-trophy-award-count">+${finalCircuits}</div>
      <h2>${isRetry ? 'Quiz ripetuto' : 'Stanza completata!'}</h2>
      <p>${resultMsg}</p>
      ${practicalData ? `<p class="fond-flaggate-done">${flagIcon(14)} Macchina completata: <strong>${esc(practicalData.machine)}</strong> — flag confermate ✓</p>` : ''}
      ${!isRetry && nextRoomId ? `<p>Stanza successiva sbloccata nel modulo.</p>` : ''}
      ${moduleMsg}
      <div class="fond-complete-actions">
        ${nextRoomId && !isRetry
          ? `<button class="btn-primary" id="fondGoNext" type="button">Vai alla stanza successiva →</button>`
          : ''}
        <button class="btn-ghost" id="fondGoModule" type="button">← Torna al modulo</button>
      </div>
    </div>
  `;

  bindResetBtn();
  document.getElementById('fondGoModule').addEventListener('click', () => history.back());
  const nextBtn = document.getElementById('fondGoNext');
  if (nextBtn) nextBtn.addEventListener('click', () => {
    pushHistoryView({ view: 'room', moduleIndex, roomIndexInModule: roomIndexInModule + 1 });
    renderRoom(moduleIndex, roomIndexInModule + 1);
  });
}

/* ─── INIT ───────────────────────────────────────────────── */

/* Cronologia in-app: ogni "drill down" (mappa → modulo → stanza) fa
   un pushState così il tasto indietro del browser torna di un passo
   invece di uscire dalla pagina. I bottoni "← Torna..." richiamano
   semplicemente history.back(), condividendo lo stesso meccanismo. */
function pushHistoryView(state) {
  history.pushState(state, '');
}
function replaceHistoryView(state) {
  history.replaceState(state, '');
}
window.addEventListener('popstate', e => {
  const s = e.state;
  if (!fondState || !s || s.view === 'gate') { renderGate(); return; }
  if (s.view === 'moduleMap') { renderModuleMap(s.moduleIndex); return; }
  if (s.view === 'room') { renderRoom(s.moduleIndex, s.roomIndexInModule); return; }
  renderModules();
});

function renderApp() {
  if (!fondState) {
    replaceHistoryView({ view: 'gate' });
    renderGate();
  } else {
    replaceHistoryView({ view: 'map' });
    renderModules();
  }
}

document.addEventListener('DOMContentLoaded', renderApp);
