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

/* URL e icona reali, verificati manualmente navigando tryhackme.com
   (slug corretto, stanza gratuita, icona ufficiale dalla loro CDN) il
   23/08/2026 (voci aggiunte il 24/08/2026 verificate lo stesso giorno;
   altre aggiunte e verificate il 03/09/2026 per i rami Blue Team e DFIR).
   TryHackMe cambia periodicamente i tier gratuiti e a pagamento: se un
   link smette di funzionare, cercalo direttamente su tryhackme.com. */
const THM_DATA = {
  'Pre Security': { url: 'https://tryhackme.com/path/outline/presecurity', icon: 'https://assets.tryhackme.com/img/paths/presecurity.svg' },
  'Jr Penetration Tester': { url: 'https://tryhackme.com/path/outline/jrpenetrationtester', icon: 'https://assets.tryhackme.com/img/paths/jrpenetrationtester.svg' },
  'Nmap': { url: 'https://tryhackme.com/room/furthernmap', icon: 'https://cdn-images.tryhackme.com/room-icons/5d653d7a4e8a1a6d98379168cfc30ac0.png' },
  'Networking Concepts': { url: 'https://tryhackme.com/room/networkingconcepts', icon: 'https://cdn-images.tryhackme.com/room-icons/networkingconcepts-1785241449058.png' },
  'Introductory Networking': { url: 'https://tryhackme.com/room/introtonetworking', icon: 'https://cdn-images.tryhackme.com/room-icons/95164927092fe0fc3e9f142aea05267a.png' },
  'DNS in Detail': { url: 'https://tryhackme.com/room/dnsindetail', icon: 'https://cdn-images.tryhackme.com/room-icons/presec-room-image9.png' },
  'WAF: Introduction': { url: 'https://tryhackme.com/room/wafintroduction', icon: 'https://cdn-images.tryhackme.com/room-icons/5f04259cf9bf5b57aed2c476-1763367396646' },
  'Security Principles': { url: 'https://tryhackme.com/room/securityprinciples', icon: 'https://cdn-images.tryhackme.com/room-icons/securityprinciples-1785241452480.png' },
  'Cyber Kill Chain': { url: 'https://tryhackme.com/room/cyberkillchainzmt', icon: 'https://cdn-images.tryhackme.com/room-icons/66704dd0e54a1f39bff7b1a1-1735573085552' },
  'Unified Kill Chain': { url: 'https://tryhackme.com/room/unifiedkillchain', icon: 'https://cdn-images.tryhackme.com/room-icons/f41ca18ac58ffaae35cc78ba615f238d.png' },
  'Crack the Hash': { url: 'https://tryhackme.com/room/crackthehash', icon: 'https://cdn-images.tryhackme.com/room-icons/fafc074a97207f99929f2ee28bea87ac.jpeg' },
  'Crack The Hash Level 2': { url: 'https://tryhackme.com/room/crackthehashlevel2', icon: 'https://cdn-images.tryhackme.com/room-icons/46d805a52e01a41ddbc06f161c76e696.jpeg' },
  'Attacktive Directory': { url: 'https://tryhackme.com/room/attacktivedirectory', icon: 'https://cdn-images.tryhackme.com/room-icons/f38b047a2a7089147766099dffeb8a5d.png' },
  'Vulnversity': { url: 'https://tryhackme.com/room/vulnversity', icon: 'https://cdn-images.tryhackme.com/room-icons/85dee7ce633f5668b104d329da2769c3.png' },
  'OWASP Top 10': { url: 'https://tryhackme.com/room/owasptop10', icon: 'https://cdn-images.tryhackme.com/room-icons/99d3424920a0302aa1fda92e365999b8.png' },
  'Kenobi': { url: 'https://tryhackme.com/room/kenobi', icon: 'https://cdn-images.tryhackme.com/room-icons/46f437a95b1de43238c290a9c416c8d4.png' },
  'Blue': { url: 'https://tryhackme.com/room/blue', icon: 'https://cdn-images.tryhackme.com/room-icons/blue-1785241443587.png' },
  'Pickle Rick': { url: 'https://tryhackme.com/room/picklerick', icon: 'https://cdn-images.tryhackme.com/room-icons/47d2d3ade1795f81a155d0aca6e4da96.jpeg' },
  'RootMe': { url: 'https://tryhackme.com/room/rrootme', icon: 'https://cdn-images.tryhackme.com/room-icons/11d59cb34397e986062eb515f4d32421.png' },
  'Bounty Hacker': { url: 'https://tryhackme.com/room/cowboyhacker', icon: 'https://cdn-images.tryhackme.com/room-icons/9ad38a2cc31d6ae0030c888aca7fe646.jpeg' },
  'Steel Mountain': { url: 'https://tryhackme.com/room/steelmountain', icon: 'https://cdn-images.tryhackme.com/room-icons/c9030a2b60bb7d1cf4fcb6e5032526d3.jpeg' },
  'Hydra': { url: 'https://tryhackme.com/room/hydra', icon: 'https://cdn-images.tryhackme.com/room-icons/69208399c3fe8b0416103c51e291e117.png' },
  'Linux PrivEsc': { url: 'https://tryhackme.com/room/linuxprivesc', icon: 'https://cdn-images.tryhackme.com/room-icons/d9ff4d8d845ecec00615d68b770e8d4b.jpeg' },
  'Windows PrivEsc': { url: 'https://tryhackme.com/room/windows10privesc', icon: 'https://cdn-images.tryhackme.com/room-icons/380988091a148cb77d399cf3c577f6da.jpeg' },
  'Sudo Buffer Overflow': { url: 'https://tryhackme.com/room/sudovulnsbof', icon: 'https://cdn-images.tryhackme.com/room-icons/e3b2def112489cd67ab68bf246093c3c.png' },
  'Encryption - Crypto 101': { url: 'https://tryhackme.com/room/encryptioncrypto101', icon: 'https://cdn-images.tryhackme.com/room-icons/ca82a12b6aab343bc4689e6b7690457c.png' },
  'Snort': { url: 'https://tryhackme.com/room/snort', icon: 'https://cdn-images.tryhackme.com/room-icons/232979a675e1dd0f567ea004d1996e84.png' },
  'Introduction to SIEM': { url: 'https://tryhackme.com/room/introtosiem', icon: 'https://cdn-images.tryhackme.com/room-icons/introtosiem-1785241446199.png' },
  'Malware Analysis - Malhare.exe': { url: 'https://tryhackme.com/room/htapowershell-aoc2025-p2l5k8j1h4', icon: 'https://cdn-images.tryhackme.com/room-icons/6093e17fa004d20049b6933e-1763893187327' },
  'Phishing Analysis Fundamentals': { url: 'https://tryhackme.com/room/phishingemails1tryoe', icon: 'https://cdn-images.tryhackme.com/room-icons/66704dd0e54a1f39bff7b1a1-1735575404083' },
  'Phishing Emails in Action': { url: 'https://tryhackme.com/room/phishingemails2rytmuv', icon: 'https://cdn-images.tryhackme.com/room-icons/dcee6ebae40a07669dbec48b3c7f0a61.png' },
  'Windows Fundamentals 1': { url: 'https://tryhackme.com/room/windowsfundamentals1xbx', icon: 'https://cdn-images.tryhackme.com/room-icons/windowsfundamentals1xbx-1785241454665.png' },
  'Linux Fundamentals Part 1': { url: 'https://tryhackme.com/room/linuxfundamentalspart1', icon: 'https://cdn-images.tryhackme.com/room-icons/linuxfundamentalspart1-1785241447142.png' },
  'Memory Forensics': { url: 'https://tryhackme.com/room/memoryforensics', icon: 'https://cdn-images.tryhackme.com/room-icons/2f9dce95cf880c6d070d4a7ac92d4cfb.png' },
  'Autopsy': { url: 'https://tryhackme.com/room/btautopsye0', icon: 'https://cdn-images.tryhackme.com/room-icons/3a5bffa10dcb6fec1e4ae8b63fedddd2.png' },
  'Windows Forensics 1': { url: 'https://tryhackme.com/room/windowsforensics1', icon: 'https://cdn-images.tryhackme.com/room-icons/4f3a37633c01bc4453668af0f2d3e7ef.png' },
  'Threat Intelligence Tools': { url: 'https://tryhackme.com/room/threatinteltools', icon: 'https://cdn-images.tryhackme.com/room-icons/66704dd0e54a1f39bff7b1a1-1735575413195' },
  'Introduction to AWS Security Tools': { url: 'https://tryhackme.com/room/introductiontoawssecuritytools', icon: 'https://cdn-images.tryhackme.com/room-icons/68baea2454c82afe90fd7020-1782374116372' }
};

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

const MODULE_VISUAL = [
  { img: 'assets/icons/networking.png',     cmd: 'nmap --type NETWORKING' },
  { img: 'assets/icons/cybersecurity.png',  cmd: 'gpg --type SECURITY_CORE' },
  { img: 'assets/icons/access-control.png', cmd: 'whoami --type IDENTITY_ACCESS' },
  { img: 'assets/icons/hacker.png',         cmd: 'social-eng --type HUMAN_FACTOR' },
  { icon: reconIcon,                        cmd: 'nikto --type WEB_RECON' },
  { img: 'assets/icons/exploit.png',        cmd: 'exploit --type HANDS_ON_PWN' },
  { icon: terminalIcon,                     cmd: 'post --type LATERAL_MOVEMENT' },
  { icon: radarIcon,                        cmd: 'tail -f --type SOC_MONITOR' },
  { icon: shieldIcon,                       cmd: 'lynis audit --type HARDENING' },
  { icon: signalIcon,                       cmd: 'misp-feed --type THREAT_INTEL' },
  { icon: fingerprintIcon,                  cmd: 'vol -f dump.raw --type DFIR' },
];

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

/* ─── DATI DELLE STANZE ──────────────────────────────────── */

const ROOMS = [
  {
    id: 'come-funziona-internet',
    title: 'Come funziona Internet',
    excerpt: "Quando digiti un URL succedono decine di cose in millisecondi. Dal routing BGP alla risoluzione DNS, dai protocolli TCP/IP al TLS: come funziona davvero Internet.",
    difficulty: 'facile',
    thm: [
      { name: 'Introductory Networking', difficulty: 'facile', note: "Introduzione pratica alla teoria di rete e agli strumenti base, esattamente i fondamentali visti in questa stanza." },
      { name: 'Nmap', difficulty: 'facile', note: "Metti in pratica cosa succede davvero quando i pacchetti viaggiano in rete, scansionando host e porte reali." }
    ],
    quiz: [
      {
        q: 'Come viaggiano i dati su Internet?',
        options: [
          'Tramite un circuito dedicato stabilito per tutta la comunicazione',
          'Tramite commutazione di pacchetto: i dati sono divisi in pacchetti instradati indipendentemente',
          'Tramite un unico canale condiviso da tutti gli utenti contemporaneamente',
          'Tramite trasmissione diretta senza intermediari'
        ], correct: 1
      },
      {
        q: 'Qual è la differenza principale tra TCP e UDP?',
        options: [
          'TCP è più veloce ma meno affidabile di UDP',
          'TCP garantisce consegna ordinata e senza errori tramite handshake; UDP è "fire and forget" senza garanzie',
          'UDP richiede sempre cifratura, TCP no',
          'Non c\'è differenza pratica, sono intercambiabili'
        ], correct: 1
      },
      {
        q: 'Cosa protegge un dispositivo dietro NAT da un attaccante esterno diretto?',
        options: [
          'Il NAT cifra tutto il traffico in uscita',
          'Il NAT nasconde l\'indirizzo privato dietro l\'IP pubblico del router, rendendo il dispositivo non raggiungibile direttamente da internet',
          'Il NAT blocca automaticamente ogni porta aperta',
          'Il NAT impedisce il DNS hijacking'
        ], correct: 1
      }
    ]
  },
  {
    id: 'come-funziona-internet-v2',
    title: 'Come funziona Internet — BGP e Anycast',
    excerpt: "Secondo capitolo sull'infrastruttura di Internet: come il routing BGP decide il percorso dei pacchetti, cos'è Anycast e perché Internet sopravvive ai guasti.",
    difficulty: 'media',
    thm: [
      { name: 'Pre Security', difficulty: 'facile', note: "Buona base prima di affrontare BGP e Anycast, se non hai già fatto networking di base." },
      { name: 'Jr Penetration Tester', difficulty: 'media', note: "Il percorso ufficiale che approfondisce networking e infrastruttura in un contesto più da pentest." }
    ],
    quiz: [
      {
        q: 'Cosa fa il protocollo BGP?',
        options: [
          'Cifra il traffico tra due Autonomous System',
          'Decide quale percorso attraversano i pacchetti tra AS diversi su Internet',
          'Traduce nomi di dominio in indirizzi IP',
          'Gestisce la cache dei browser'
        ], correct: 1
      },
      {
        q: 'Come funziona Anycast (es. 1.1.1.1 di Cloudflare)?',
        options: [
          'Un DNS centrale decide quale server usare ogni volta',
          'Lo stesso indirizzo IP è annunciato da tanti server nel mondo, e il routing BGP indirizza automaticamente verso il più vicino',
          'Ogni utente ha un indirizzo IP diverso assegnato manualmente',
          'È un sistema di load balancing lato client'
        ], correct: 1
      },
      {
        q: 'Cos\'è RPKI e a cosa serve?',
        options: [
          'Un protocollo per velocizzare il DNS',
          'Una PKI che certifica quale AS ha il diritto di annunciare un certo prefisso IP, mitigando il BGP hijacking',
          'Un algoritmo di cifratura per il traffico BGP',
          'Un sistema di backup dei cavi sottomarini'
        ], correct: 1
      }
    ]
  },
  {
    id: 'modello-osi',
    title: 'Il modello OSI',
    excerpt: "Il modello OSI divide la comunicazione di rete in 7 livelli. Spiegato non con teoria pura, ma con gli attacchi informatici che operano a ciascun livello.",
    difficulty: 'facile',
    thm: [
      { name: 'Networking Concepts', difficulty: 'facile', note: "Copre proprio il modello ISO OSI e lo stack TCP/IP, con esempi pratici livello per livello." },
      { name: 'Nmap', difficulty: 'facile', note: "Vedi quali livelli OSI 'tocchi' realmente lanciando una scansione." }
    ],
    quiz: [
      {
        q: 'Quanti layer compongono il modello OSI, e in che direzione avviene l\'incapsulamento quando si inviano dati?',
        options: [
          '5 layer, dal layer 1 al layer 5',
          '7 layer, dal layer 7 (Application) scendendo al layer 1 (Physical)',
          '7 layer, dal layer 1 salendo al layer 7',
          '4 layer, corrispondenti al modello TCP/IP'
        ], correct: 1
      },
      {
        q: 'A quale layer OSI opera un attacco di ARP spoofing/poisoning?',
        options: ['Layer 7 - Application', 'Layer 4 - Transport', 'Layer 2 - Data Link', 'Layer 1 - Physical'],
        correct: 2
      },
      {
        q: 'Cosa gestisce il layer 3 (Network) del modello OSI?',
        options: [
          'Cifratura e compressione dei dati',
          'Indirizzi IP e routing',
          'Gestione delle sessioni utente',
          'MAC address e frame'
        ], correct: 1
      }
    ]
  },
  {
    id: 'dns-il-telefono-di-internet',
    title: 'DNS: il telefono di Internet',
    excerpt: "Il DNS è la rubrica di Internet. Come funziona la risoluzione ricorsiva, cosa sono i record A, MX, TXT, come difendersi da DNS hijacking e cosa cambia con DNS over HTTPS.",
    difficulty: 'facile',
    thm: [
      { name: 'DNS in Detail', difficulty: 'facile', note: "Approfondisce risoluzione ricorsiva, record e zone transfer con esempi pratici." },
      { name: 'Nmap', difficulty: 'facile', note: "L'enumerazione di un target parte spesso proprio da una ricognizione DNS." }
    ],
    quiz: [
      {
        q: 'Cosa indica il TTL di un record DNS?',
        options: [
          'Il numero massimo di hop che un pacchetto può attraversare',
          'Per quanti secondi il resolver può tenere la risposta in cache prima di richiederla di nuovo',
          'Il tempo di risposta del server autoritativo',
          'La durata di validità di un certificato TLS'
        ], correct: 1
      },
      {
        q: 'Cos\'è un Zone Transfer (AXFR) mal configurato?',
        options: [
          'Una tecnica di cifratura del traffico DNS',
          'Una funzionalità che, se non limitata ai server secondari legittimi, permette a chiunque di scaricare l\'intera zona DNS di un dominio',
          'Un meccanismo per bilanciare il carico tra più server DNS',
          'Un protocollo per aggiornare i record TXT'
        ], correct: 1
      },
      {
        q: 'Qual è la differenza principale tra DNS Cache Poisoning e DNS Hijacking?',
        options: [
          'Sono sinonimi dello stesso attacco',
          'Il poisoning inietta risposte false nella cache di un resolver; l\'hijacking modifica direttamente i record autoritativi del dominio',
          'Il poisoning riguarda solo IPv6, l\'hijacking solo IPv4',
          'Il poisoning è legale, l\'hijacking no'
        ], correct: 1
      }
    ]
  },
  {
    id: 'come-funziona-un-firewall',
    title: 'Come funziona un firewall',
    excerpt: "Un firewall non è solo una lista di regole. Differenze tra stateless e stateful inspection, Next-Gen Firewall, WAF e dove collocarli nell'architettura di rete.",
    difficulty: 'media',
    thm: [
      { name: 'WAF: Introduction', difficulty: 'facile', note: "Cosa distingue un Web Application Firewall da un firewall di rete tradizionale, con esempi pratici." },
      { name: 'Nmap', difficulty: 'facile', note: "Capisci cosa un firewall lascia passare o blocca osservando i risultati di una scansione reale." }
    ],
    quiz: [
      {
        q: 'Qual è il limite principale di un firewall stateless rispetto a uno stateful?',
        options: [
          'Non può bloccare traffico HTTPS',
          'Valuta ogni pacchetto indipendentemente, senza sapere se appartiene a una connessione legittima già in corso',
          'È più lento perché ispeziona il contenuto dei pacchetti',
          'Non supporta IPv6'
        ], correct: 1
      },
      {
        q: 'Cosa fa un WAF (Web Application Firewall) che un firewall di rete tradizionale non fa?',
        options: [
          'Blocca tutte le porte tranne la 443',
          'Opera al layer 7 e riconosce pattern applicativi come SQL injection e XSS nelle richieste HTTP',
          'Cifra automaticamente tutto il traffico interno',
          'Sostituisce completamente la necessità di un IPS'
        ], correct: 1
      },
      {
        q: 'Qual è il principio di base di una configurazione firewall sicura?',
        options: [
          'Default allow: permetti tutto, blocca solo ciò che è esplicitamente pericoloso',
          'Default deny: blocca tutto per default, permetti solo ciò che è esplicitamente necessario',
          'Bloccare solo il traffico in uscita',
          'Affidarsi solo al DPI, senza regole esplicite'
        ], correct: 1
      }
    ]
  },
  {
    id: 'modello-cia',
    title: 'Il modello CIA',
    excerpt: "Confidenzialità, Integrità, Disponibilità: la triade CIA è il framework concettuale su cui si basa tutta la sicurezza informatica. Spiegata con esempi reali.",
    difficulty: 'facile',
    thm: [
      { name: 'Security Principles', difficulty: 'facile', note: "Copre proprio la triade CIA e i modelli di sicurezza fondamentali visti in questa stanza." }
    ],
    quiz: [
      {
        q: 'Cosa rappresentano le tre lettere della triade CIA?',
        options: [
          'Central Intelligence Agency, un framework governativo',
          'Confidentiality, Integrity, Availability',
          'Cryptography, Identity, Authentication',
          'Control, Inspection, Auditing'
        ], correct: 1
      },
      {
        q: 'Un ransomware cifra i file di un ospedale rendendo le cartelle cliniche inaccessibili: quale pilastro viola principalmente?',
        options: [
          'Solo la Confidenzialità',
          'Solo l\'Integrità',
          'La Disponibilità: i medici non possono accedere ai dati quando servono',
          'Nessuno dei tre, è solo un problema economico'
        ], correct: 2
      },
      {
        q: 'A cosa serve principalmente un hash crittografico come SHA-256 su un file scaricato?',
        options: [
          'A cifrare il contenuto del file',
          'A verificarne l\'integrità: se anche un solo bit cambia, l\'hash cambia completamente',
          'A comprimere il file',
          'A garantirne la disponibilità continua'
        ], correct: 1
      }
    ]
  },
  {
    id: 'crittografia-basi',
    title: 'Crittografia: le basi',
    excerpt: "Simmetrica vs asimmetrica, cifrari a blocchi e a flusso, firma digitale, PKI e TLS. Le fondamenta crittografiche su cui si regge tutta la sicurezza informatica moderna.",
    difficulty: 'media',
    thm: [
      { name: 'Encryption - Crypto 101', difficulty: 'facile', note: "Copre simmetrica vs asimmetrica, hashing e le basi pratiche di crittografia viste in questa stanza." },
      { name: 'Crack the Hash', difficulty: 'facile', note: "Applica la teoria della crittografia debole craccando hash reali di vario tipo." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza fondamentale tra crittografia simmetrica e asimmetrica?',
        options: [
          'La simmetrica usa la stessa chiave segreta per cifrare e decifrare; l\'asimmetrica usa una coppia di chiavi pubblica/privata',
          'La simmetrica è sempre più sicura dell\'asimmetrica',
          'L\'asimmetrica non richiede alcuna chiave',
          'Sono lo stesso concetto con nomi diversi'
        ], correct: 0
      },
      {
        q: 'Perché la modalità ECB per AES è considerata pericolosa?',
        options: [
          'È troppo lenta per uso pratico',
          'Blocchi di testo in chiaro identici producono blocchi cifrati identici, rivelando pattern nei dati strutturati',
          'Non supporta chiavi a 256 bit',
          'Richiede una connessione internet per funzionare'
        ], correct: 1
      },
      {
        q: 'Cosa garantisce in più la modalità GCM rispetto a CBC?',
        options: [
          'Chiavi più corte',
          'Autenticazione del messaggio insieme alla cifratura (AEAD), garantendo sia confidenzialità che integrità',
          'Velocità di rete maggiore',
          'Compatibilità con RSA'
        ], correct: 1
      }
    ]
  },
  {
    id: 'pki-certificati-digitali',
    title: 'PKI e certificati digitali',
    excerpt: "Perché il lucchetto HTTPS non è garanzia assoluta. Come funziona la Public Key Infrastructure, il ruolo delle Certificate Authority e cosa succede quando la fiducia si rompe.",
    difficulty: 'media',
    thm: [
      { name: 'Encryption - Crypto 101', difficulty: 'facile', note: "Buona base prima di affrontare certificati e catene di fiducia in dettaglio." }
    ],
    quiz: [
      {
        q: 'A cosa serve una Certificate Authority (CA)?',
        options: [
          'A generare traffico di rete per i test di sicurezza',
          'A verificare l\'identità di chi richiede un certificato e a firmarlo digitalmente, stabilendo una fiducia verificabile',
          'A cifrare tutto il traffico di un dominio',
          'A gestire i DNS di un dominio'
        ], correct: 1
      },
      {
        q: 'Perché le Root CA non emettono certificati finali direttamente, ma usano Intermediate CA?',
        options: [
          'Per motivi di costo',
          'Come buffer di sicurezza: se una Intermediate CA viene compromessa può essere revocata senza toccare la Root CA',
          'Perché la legge lo impone in tutti i paesi',
          'Per velocizzare il TLS handshake'
        ], correct: 1
      },
      {
        q: 'Cosa fa l\'HSTS (HTTP Strict Transport Security)?',
        options: [
          'Rende un sito raggiungibile anche senza DNS',
          'Dichiara che un dominio deve essere contattato solo via HTTPS, mitigando l\'SSL stripping',
          'Sostituisce la necessità di un certificato TLS',
          'Genera automaticamente nuove chiavi private ogni giorno'
        ], correct: 1
      }
    ]
  },
  {
    id: 'cyber-kill-chain-mitre-attack',
    title: 'Cyber Kill Chain e MITRE ATT&CK',
    excerpt: "Ogni attacco informatico segue delle fasi riconoscibili. Cyber Kill Chain e MITRE ATT&CK sono i due framework che le descrivono — e che ogni difensore usa per capire dove intervenire.",
    difficulty: 'media',
    thm: [
      { name: 'Cyber Kill Chain', difficulty: 'media', note: "Applica le fasi della Kill Chain a uno scenario di attacco reale, passo dopo passo." },
      { name: 'Unified Kill Chain', difficulty: 'media', note: "Combina Kill Chain e MITRE ATT&CK in un unico framework, con un caso pratico da seguire fase per fase." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza principale tra Cyber Kill Chain e MITRE ATT&CK?',
        options: [
          'Sono esattamente lo stesso framework con nomi diversi',
          'La Kill Chain è un modello lineare a 7 fasi; ATT&CK è una matrice di tecniche non ordinate rigidamente, più granulare',
          'La Kill Chain si usa solo per il cloud, ATT&CK solo per malware tradizionale',
          'ATT&CK è stato creato prima della Kill Chain'
        ], correct: 1
      },
      {
        q: 'Nella Cyber Kill Chain, cosa succede nella fase di "Weaponization"?',
        options: [
          'L\'attaccante raccoglie informazioni sul target',
          'L\'attaccante prepara l\'arma (es. un documento con macro malevola o un exploit)',
          'L\'attaccante stabilisce un canale di comando e controllo',
          'L\'attaccante esfiltra i dati'
        ], correct: 1
      },
      {
        q: 'Cosa rappresentano le "tattiche" nella matrice MITRE ATT&CK?',
        options: [
          'Il codice sorgente specifico usato da un malware',
          'Gli obiettivi tattici dell\'attaccante (il "perché"), sotto cui sono organizzate le tecniche (il "come")',
          'Solo le tecniche usate da un singolo gruppo APT',
          'Le mitigazioni raccomandate per ogni vulnerabilità'
        ], correct: 1
      }
    ]
  },
  {
    id: 'risk-management-analisi-rischio',
    title: 'Risk Management',
    excerpt: "Non tutte le vulnerabilità meritano la stessa attenzione, e non tutti gli asset hanno lo stesso valore. Il risk management è la disciplina che permette di decidere dove investire prima che sia troppo tardi.",
    difficulty: 'media',
    thm: [
      { name: 'Jr Penetration Tester', difficulty: 'media', note: "Il percorso ufficiale mostra come reporting e prioritizzazione del rischio si inseriscono in un vero engagement." }
    ],
    quiz: [
      {
        q: 'Qual è la formula base del rischio in sicurezza informatica?',
        options: [
          'Rischio = Vulnerabilità + Asset',
          'Rischio = Probabilità × Impatto',
          'Rischio = punteggio CVSS',
          'Rischio = numero di vulnerabilità trovate'
        ], correct: 1
      },
      {
        q: 'Quali sono le quattro strategie per trattare un rischio identificato?',
        options: [
          'Ignorare, minimizzare, massimizzare, eliminare',
          'Mitigare, trasferire, accettare, evitare',
          'Patchare, segmentare, cifrare, monitorare',
          'Bloccare, permettere, loggare, allertare'
        ], correct: 1
      },
      {
        q: 'Perché una vulnerabilità con CVSS 9.8 su un sistema di test isolato, senza dati sensibili, può rappresentare un rischio basso?',
        options: [
          'Il CVSS misura la gravità tecnica, non il rischio reale, che dipende anche dal contesto (asset, probabilità, impatto)',
          'Il CVSS è sempre sbagliato e va ignorato',
          'I sistemi di test non hanno mai vulnerabilità reali',
          'Il rischio dipende solo dal punteggio CVSS'
        ], correct: 0
      }
    ]
  },
  {
    id: 'autenticazione-identita-digitale',
    title: 'Autenticazione e identità digitale',
    excerpt: "Come funziona l'autenticazione moderna: dai limiti delle password all'MFA, dalle passkey FIDO2 alle sfide dell'identità digitale nel 2026.",
    difficulty: 'facile',
    thm: [
      { name: 'Pre Security', difficulty: 'facile', note: "Introduce i concetti di autenticazione e identità digitale con taglio pratico da zero." }
    ],
    quiz: [
      {
        q: 'Quali sono i tre fattori classici di autenticazione?',
        options: [
          'Username, password, email',
          'Qualcosa che sai, qualcosa che hai, qualcosa che sei',
          'IP, User-Agent, Cookie',
          'Nome, cognome, data di nascita'
        ], correct: 1
      },
      {
        q: 'Perché l\'OTP via SMS è considerato meno sicuro di un\'app authenticator (TOTP)?',
        options: [
          'Gli SMS sono troppo lenti da ricevere',
          'È vulnerabile a SIM swapping e alle vulnerabilità del protocollo SS7 usato dalle reti telefoniche',
          'Le app authenticator non richiedono connessione internet, gli SMS sì',
          'Gli SMS OTP scadono dopo un solo secondo'
        ], correct: 1
      },
      {
        q: 'Cosa rende FIDO2/WebAuthn resistente al phishing rispetto a una password?',
        options: [
          'Richiede sempre una connessione VPN',
          'La firma crittografica è vincolata al dominio: un sito di phishing non può ottenere una firma valida',
          'Usa sempre lo stesso codice per tutti i siti',
          'Non richiede alcuna verifica biometrica'
        ], correct: 1
      }
    ]
  },
  {
    id: 'come-funzionano-le-password',
    title: 'Come funzionano le password',
    excerpt: "Le password non vengono memorizzate in chiaro — o non dovrebbero. Come funziona l'hashing, cos'è il salting, perché MD5 è obsoleto e cosa usare nel 2026.",
    difficulty: 'facile',
    thm: [
      { name: 'Crack the Hash', difficulty: 'facile', note: "Esercitati a identificare e craccare hash reali, il modo migliore per capire perché salting e algoritmi lenti contano." },
      { name: 'Crack The Hash Level 2', difficulty: 'media', note: "Il seguito più avanzato, con hash più ostici e generazione di wordlist mirate." }
    ],
    quiz: [
      {
        q: 'Perché memorizzare le password cifrate (invece che in hash) è considerato un errore?',
        options: [
          'La cifratura è troppo lenta per essere pratica',
          'La cifratura è reversibile: se l\'attaccante ruba anche la chiave, può decifrare tutte le password',
          'La cifratura non supporta caratteri speciali',
          'Non è un errore, è la pratica raccomandata'
        ], correct: 1
      },
      {
        q: 'A cosa serve il "salt" nell\'hashing delle password?',
        options: [
          'A velocizzare il calcolo dell\'hash',
          'A rendere unico l\'hash di ogni utente anche se due persone hanno la stessa password, vanificando le rainbow table',
          'A cifrare il database intero',
          'A generare automaticamente password più lunghe'
        ], correct: 1
      },
      {
        q: 'Perché Argon2id è preferito rispetto a SHA-256 per l\'hashing delle password?',
        options: [
          'SHA-256 non è abbastanza sicuro matematicamente',
          'Argon2id è deliberatamente lento e memory-hard, rendendo il brute force molto più costoso; SHA-256 è progettato per essere veloce',
          'Argon2id produce hash più corti',
          'SHA-256 non può essere usato con il salting'
        ], correct: 1
      }
    ]
  },
  {
    id: 'iam-rbac-privilegio-minimo',
    title: 'IAM, RBAC e privilegio minimo',
    excerpt: "Autenticarsi non basta: bisogna anche decidere cosa un utente autenticato può fare. IAM, RBAC, ABAC e il principio del privilegio minimo sono le fondamenta della governance degli accessi.",
    difficulty: 'media',
    thm: [
      { name: 'Jr Penetration Tester', difficulty: 'media', note: "Il percorso ufficiale mostra come privilegi mal configurati diventino vettori di attacco reali." }
    ],
    quiz: [
      {
        q: 'Come funziona il modello RBAC (Role-Based Access Control)?',
        options: [
          'I permessi sono assegnati individualmente a ogni singolo utente',
          'I permessi sono assegnati a ruoli, e gli utenti ereditano i permessi assegnandosi ai ruoli',
          'I permessi cambiano automaticamente in base all\'orario',
          'Non esistono permessi, solo autenticazione'
        ], correct: 1
      },
      {
        q: 'Cosa afferma il principio del privilegio minimo?',
        options: [
          'Ogni utente deve avere accesso amministrativo per essere produttivo',
          'Ogni identità deve avere esattamente i permessi necessari per il proprio compito, niente di più',
          'I privilegi vanno assegnati una sola volta e mai più rivisti',
          'Solo gli amministratori IT hanno bisogno di permessi'
        ], correct: 1
      },
      {
        q: 'Cosa fa uno strumento di PAM (Privileged Access Management)?',
        options: [
          'Sostituisce completamente l\'autenticazione a due fattori',
          'Centralizza le credenziali privilegiate in un vault, concede accesso temporaneo monitorato e ruota le password automaticamente',
          'Elimina la necessità di avere account amministrativi',
          'Serve solo per gestire le password degli utenti normali'
        ], correct: 1
      }
    ]
  },
  {
    id: 'active-directory-ldap-fondamenti',
    title: 'Active Directory e LDAP',
    excerpt: "Prima di capire come si attacca Active Directory, bisogna capire come funziona. Domini, Organizational Unit, Group Policy, LDAP e Kerberos: l'infrastruttura di identità del 90% delle aziende Windows.",
    difficulty: 'media',
    thm: [
      { name: 'Attacktive Directory', difficulty: 'media', note: "Primo contatto pratico con un dominio Active Directory: OU, autenticazione Kerberos e LDAP in azione." }
    ],
    quiz: [
      {
        q: 'Cosa permette a un utente Kerberos di non dover reinviare la password per ogni risorsa a cui accede?',
        options: [
          'Il TGT (Ticket Granting Ticket), ottenuto una volta al login, usato per richiedere Service Ticket specifici',
          'La cache del browser',
          'Ogni risorsa memorizza la password in chiaro',
          'Il protocollo NTLM sostituisce sempre Kerberos'
        ], correct: 0
      },
      {
        q: 'Cosa sono le Organizational Unit (OU) in Active Directory?',
        options: [
          'Server fisici separati per ogni dipartimento',
          'Contenitori che riflettono la struttura organizzativa, usati per applicare policy e delegare amministrazione in modo granulare',
          'Un tipo di malware che colpisce i domain controller',
          'Un protocollo di cifratura alternativo a LDAPS'
        ], correct: 1
      },
      {
        q: 'Qual è la differenza tra LDAP e LDAPS?',
        options: [
          'Sono esattamente lo stesso protocollo',
          'LDAPS cifra l\'intera comunicazione (SSL/TLS), mentre LDAP tradizionale può trasmettere in chiaro',
          'LDAP è più veloce e per questo sempre preferibile',
          'LDAPS funziona solo su Linux'
        ], correct: 1
      }
    ]
  },
  {
    id: 'biometria-autenticazione-fisica',
    title: 'Biometria e autenticazione fisica',
    excerpt: "Impronte digitali, riconoscimento facciale, iride: la biometria promette di eliminare le password sostituendole con 'ciò che sei'. Come funziona davvero, quanto è affidabile, e perché non è infallibile.",
    difficulty: 'facile',
    thm: [
      { name: 'Pre Security', difficulty: 'facile', note: "Copre i fondamentali di autenticazione, propedeutico prima di approfondire la biometria." }
    ],
    quiz: [
      {
        q: 'Cosa memorizza effettivamente un sistema biometrico ben progettato?',
        options: [
          'L\'immagine grezza dell\'impronta o del volto',
          'Un template — una rappresentazione matematica delle caratteristiche distintive, non l\'immagine originale',
          'Una copia della password dell\'utente',
          'Il numero di documento d\'identità'
        ], correct: 1
      },
      {
        q: 'Cosa misura il FAR (False Acceptance Rate)?',
        options: [
          'Quante volte un utente legittimo viene rifiutato',
          'La probabilità che il sistema accetti erroneamente una persona non autorizzata',
          'La velocità di scansione del sensore',
          'Il numero di utenti registrati nel sistema'
        ], correct: 1
      },
      {
        q: 'Perché la biometria non dovrebbe mai essere usata come unico fattore per accessi critici?',
        options: [
          'È troppo lenta da usare',
          'Un tratto biometrico compromesso non può essere "cambiato" come una password, quindi va sempre combinato con un secondo fattore',
          'Non è mai stata testata a sufficienza',
          'Costa troppo implementarla'
        ], correct: 1
      }
    ]
  },
  {
    id: 'ingegneria-sociale',
    title: 'Ingegneria sociale',
    excerpt: "L'ingegneria sociale sfrutta la psicologia, non il codice. Pretexting, phishing, vishing, baiting: come funzionano le tecniche di manipolazione e come costruire una cultura di difesa.",
    difficulty: 'facile',
    thm: [
      { name: 'Pre Security', difficulty: 'facile', note: "Introduce anche il lato umano della sicurezza tra i fondamentali del percorso." }
    ],
    quiz: [
      {
        q: 'Cosa distingue l\'ingegneria sociale dagli attacchi tecnici tradizionali?',
        options: [
          'Richiede sempre l\'uso di malware avanzato',
          'Sfrutta la manipolazione psicologica delle persone invece di vulnerabilità nei sistemi',
          'Funziona solo contro le grandi aziende',
          'È illegale solo in alcuni paesi'
        ], correct: 1
      },
      {
        q: 'Cos\'è il "pretexting"?',
        options: [
          'L\'invio massivo di email di phishing generiche',
          'La costruzione di uno scenario credibile per giustificare una richiesta di informazioni o accessi',
          'Un tipo di malware che si installa da una chiavetta USB',
          'La verifica dell\'identità tramite un secondo canale'
        ], correct: 1
      },
      {
        q: 'Qual è la difesa più efficace contro un Business Email Compromise (BEC) come nel caso Ubiquiti?',
        options: [
          'Usare password più lunghe',
          'Verificare fuori banda (es. chiamata telefonica con numero già noto) qualsiasi richiesta urgente di bonifico ricevuta via email',
          'Installare un antivirus più aggiornato',
          'Bloccare tutte le email esterne all\'azienda'
        ], correct: 1
      }
    ]
  },
  {
    id: 'cose-il-penetration-testing',
    title: "Cos'è il Penetration Testing",
    excerpt: "Cosa significa fare un penetration test, come si struttura un engagement, le fasi dalla ricognizione al report e la differenza tra pentest, red team e vulnerability assessment.",
    difficulty: 'facile',
    thm: [
      { name: 'Jr Penetration Tester', difficulty: 'facile', note: "Il percorso ufficiale pensato esattamente per chi vuole iniziare con il penetration testing da zero." },
      { name: 'Vulnversity', difficulty: 'facile', note: "Il primo vero assaggio pratico di un engagement: enumerazione, foothold e privesc di base." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza tra un Vulnerability Assessment e un Penetration Test?',
        options: [
          'Sono esattamente la stessa cosa con nomi diversi',
          'Il VA identifica e classifica le vulnerabilità senza sfruttarle; il pentest le sfrutta attivamente per dimostrarne l\'impatto reale',
          'Il VA è sempre illegale, il pentest no',
          'Il pentest si fa solo su reti, il VA solo su applicazioni web'
        ], correct: 1
      },
      {
        q: 'Cosa caratterizza un test in modalità "Black Box"?',
        options: [
          'Il tester ha accesso al codice sorgente completo',
          'Il tester non sa nulla del target, simulando un attaccante esterno senza informazioni privilegiate',
          'Il test viene eseguito solo di notte',
          'Il tester ha credenziali di amministratore fin dall\'inizio'
        ], correct: 1
      },
      {
        q: 'Qual è il percorso pratico di apprendimento suggerito per diventare penetration tester?',
        options: [
          'Iniziare direttamente con OSCP senza altra preparazione',
          'CTF → TryHackMe → HackTheBox → certificazioni come eJPT, poi OSCP',
          'Solo corsi universitari teorici, senza pratica',
          'Studiare esclusivamente sviluppo software per 2 anni'
        ], correct: 1
      }
    ]
  },
  {
    id: 'owasp-top-10',
    title: 'OWASP Top 10',
    excerpt: "SQL Injection, XSS, controlli di accesso rotti: la OWASP Top 10 è la classifica di riferimento delle vulnerabilità web più critiche e più diffuse. La mappa che ogni sviluppatore e pentester dovrebbe conoscere a memoria.",
    difficulty: 'media',
    thm: [
      { name: 'OWASP Top 10', difficulty: 'media', note: "Stanza dedicata esattamente alla Top 10: la metti in pratica una vulnerabilità alla volta." },
      { name: 'Vulnversity', difficulty: 'facile', note: "Buon warm-up pratico prima di affrontare la Top 10 in dettaglio." }
    ],
    quiz: [
      {
        q: 'Cosa descrive la categoria "A03: Injection" della OWASP Top 10?',
        options: [
          'Configurazioni di default lasciate attive',
          'Input non validato interpretato come codice o comando da un interprete (SQL, shell, LDAP...)',
          'Cifratura debole o assente',
          'Assenza di log e monitoraggio'
        ], correct: 1
      },
      {
        q: 'Cos\'è un attacco SSRF (Server-Side Request Forgery)?',
        options: [
          'Un attacco che sfrutta il browser della vittima per rubare cookie',
          'Un\'applicazione costretta a fare richieste verso risorse interne per conto dell\'attaccante, spesso verso endpoint sensibili come i metadata cloud',
          'Un tipo di attacco DDoS distribuito',
          'Un attacco che funziona solo su reti WiFi'
        ], correct: 1
      },
      {
        q: 'Perché la categoria "Insecure Design" è diversa dalle altre?',
        options: [
          'Descrive difetti architetturali che nessuna patch può correggere senza ridisegnare il flusso, non semplici bug di implementazione',
          'Riguarda solo il design grafico dell\'interfaccia',
          'È l\'unica categoria che non causa mai danni reali',
          'Si applica solo alle applicazioni mobile'
        ], correct: 0
      }
    ]
  },
  {
    id: 'malware-tipologie-fondamentali',
    title: 'Malware: tipologie e funzionamento',
    excerpt: "Virus, worm, trojan, ransomware, spyware, rootkit: parole usate spesso come sinonimi ma che descrivono comportamenti tecnicamente molto diversi. La tassonomia di base di cosa rende malevolo un software.",
    difficulty: 'media',
    thm: [
      { name: 'Pre Security', difficulty: 'facile', note: "Introduce i concetti base di malware e minacce prima di un approfondimento pratico." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza principale tra un virus e un worm?',
        options: [
          'Sono sinonimi dello stesso tipo di malware',
          'Il virus richiede un file ospite e un\'azione umana per attivarsi; il worm si diffonde autonomamente in rete senza bisogno di un ospite',
          'Il worm esiste solo su Windows, il virus solo su Linux',
          'Il virus è sempre più pericoloso del worm'
        ], correct: 1
      },
      {
        q: 'Cosa rende un rootkit particolarmente difficile da rilevare?',
        options: [
          'Non lascia mai tracce sul disco',
          'Opera a un livello di privilegio profondo (kernel o sotto), potendo nascondere la propria presenza persino agli strumenti di sistema usati per cercarlo',
          'Si attiva solo una volta l\'anno',
          'Non può essere rilevato in nessun modo, nemmeno da strumenti esterni'
        ], correct: 1
      },
      {
        q: 'Cos\'è il malware "fileless" e perché è difficile da rilevare con antivirus tradizionali?',
        options: [
          'Vive esclusivamente in memoria sfruttando strumenti legittimi (PowerShell, WMI), senza scrivere su disco un file che un antivirus a firme possa scansionare',
          'È un malware che non esiste realmente, solo teorico',
          'Si riferisce a malware che non ha mai un nome assegnato',
          'È un tipo di virus che infetta solo file PDF'
        ], correct: 0
      }
    ]
  },
  {
    id: 'anatomia-attacco-ransomware',
    title: 'Anatomia di un attacco ransomware',
    excerpt: "Un attacco ransomware moderno non è 'un virus che cifra i file' — è una campagna strutturata che dura giorni o settimane, con fasi precise prima che una singola cifratura venga eseguita. Ecco come funziona davvero.",
    difficulty: 'media',
    thm: [
      { name: 'Cyber Kill Chain', difficulty: 'media', note: "Ripercorre le fasi di un attacco reale, utile per collegare la teoria del ransomware a un caso pratico." }
    ],
    quiz: [
      {
        q: 'Perché avere backup funzionanti non è più sufficiente contro il ransomware moderno?',
        options: [
          'I backup non funzionano mai davvero',
          'Il modello "double extortion" include l\'esfiltrazione dei dati prima della cifratura: anche ripristinando da backup, resta la minaccia di pubblicazione dei dati rubati',
          'Il ransomware cifra sempre e comunque anche i backup offline',
          'I backup sono illegali in alcuni paesi'
        ], correct: 1
      },
      {
        q: 'Cosa sono gli "Initial Access Broker" nell\'economia del cybercrime?',
        options: [
          'Gruppi che sviluppano soltanto il codice del ransomware',
          'Gruppi specializzati che ottengono e vendono accessi iniziali già compromessi ad altri gruppi ransomware, come un mercato B2B criminale',
          'Aziende di sicurezza che vendono protezione anti-ransomware',
          'Un altro nome per gli affiliati RaaS'
        ], correct: 1
      },
      {
        q: 'Perché il "dwell time" (il tempo tra accesso iniziale e cifratura) è importante per la difesa?',
        options: [
          'Non ha alcuna rilevanza difensiva',
          'È la finestra temporale in cui è più facile intercettare l\'attacco, prima che la cifratura renda il danno spesso irreversibile',
          'Più è lungo, meno danno farà l\'attacco',
          'Riguarda solo la velocità della connessione internet dell\'attaccante'
        ], correct: 1
      }
    ]
  },

  /* ─── MODULO 5: SFRUTTAMENTO PRATICO (hands-on, flag gate) ── */
  {
    id: 'privilege-escalation-linux',
    title: 'Privilege Escalation su Linux',
    excerpt: "SUID binari, cron job mal configurati, sudo misconfiguration, capabilities: le vie più comuni per scalare da utente a root su Linux. Stanza hands-on: dopo il quiz vai su una macchina reale e conferma le flag ottenute.",
    difficulty: 'media',
    thm: [
      { name: 'Linux PrivEsc', difficulty: 'media', note: "La stanza di riferimento per esercitarsi su SUID, sudo, cron e capabilities in un ambiente controllato." },
      { name: 'Kenobi', difficulty: 'facile', note: "Box completo Linux: enumerazione di servizi, foothold e privesc finale, un buon primo bersaglio realistico." },
      { name: 'Bounty Hacker', difficulty: 'facile', note: "Percorso più guidato per chi affronta per la prima volta un intero box Linux dal foothold al root." }
    ],
    practical: {
      flags: [
        { key: 'user', label: 'Flag user.txt' },
        { key: 'root', label: 'Flag root.txt' }
      ]
    },
    quiz: [
      {
        q: 'Cos\'è un binario con bit SUID e perché è pericoloso se posseduto da root?',
        options: [
          'È un binario che si autoaggiorna periodicamente',
          'Viene eseguito con i permessi del proprietario del file (root), non dell\'utente che lo lancia: se abusabile, porta a una shell root',
          'È un binario che richiede sempre la password dell\'utente corrente',
          'È un binario disponibile solo per gli amministratori di dominio'
        ], correct: 1
      },
      {
        q: 'A cosa serve GTFOBins?',
        options: [
          'È un catalogo di binari Unix legittimi che possono essere abusati per bypassare restrizioni locali (SUID, sudo, ecc.)',
          'È un tool per generare shellcode Windows',
          'È un servizio che ospita macchine vulnerabili da attaccare online',
          'È una wordlist per il brute force di password'
        ], correct: 0
      },
      {
        q: 'Perché un cron job che root esegue su uno script scrivibile dall\'utente corrente è un vettore di privesc?',
        options: [
          'Perché i cron job di root vengono sempre eseguiti in una sandbox isolata',
          'Perché possiamo modificare lo script per iniettare comandi arbitrari, eseguiti con i privilegi di root alla prossima esecuzione del cron',
          'Perché cron invia sempre le credenziali di root via email',
          'Non è un vettore reale, è solo teoria da esame'
        ], correct: 1
      }
    ]
  },
  {
    id: 'privilege-escalation-windows',
    title: 'Privilege Escalation su Windows',
    excerpt: "Da user a SYSTEM: token impersonation, unquoted service path, AlwaysInstallElevated. Stanza hands-on: dopo il quiz vai su una macchina reale e conferma le flag ottenute.",
    difficulty: 'media',
    thm: [
      { name: 'Windows PrivEsc', difficulty: 'media', note: "Copre nel dettaglio i vettori visti nell'articolo: servizi, token, registro, AlwaysInstallElevated." },
      { name: 'Blue', difficulty: 'facile', note: "Box Windows guidato, ottimo primo bersaglio per prendere confidenza con l'ambiente prima di stanze più libere." },
      { name: 'Steel Mountain', difficulty: 'media', note: "Foothold via servizio web e privesc lato Windows, in linea con i vettori legati ai servizi visti qui." }
    ],
    practical: {
      flags: [
        { key: 'user', label: 'Flag user.txt' },
        { key: 'root', label: 'Flag root.txt' }
      ]
    },
    quiz: [
      {
        q: 'Cos\'è SeImpersonatePrivilege e perché è il vettore di privesc più comune per un account di servizio come IIS?',
        options: [
          'Permette di impersonare token di altri utenti; sfruttato con tool come PrintSpoofer/JuicyPotato per ottenere una shell SYSTEM da un account di servizio',
          'È un privilegio che disabilita automaticamente Windows Defender',
          'Permette di cambiare la password di qualsiasi utente senza conoscerla',
          'È un privilegio che serve solo per la stampa di rete'
        ], correct: 0
      },
      {
        q: 'Cos\'è un Unquoted Service Path e come si sfrutta?',
        options: [
          'È un servizio che non richiede autenticazione per essere avviato',
          'Se il path di un eseguibile di servizio contiene spazi senza virgolette, Windows prova percorsi intermedi: se scrivibili, si può piazzare lì un binario malevolo eseguito con i privilegi del servizio',
          'È un bug che impedisce a un servizio di avviarsi',
          'Riguarda solo servizi di terze parti mai quelli di sistema'
        ], correct: 1
      },
      {
        q: 'Cosa permette di fare AlwaysInstallElevated se abilitato in entrambe le chiavi di registro (HKCU e HKLM)?',
        options: [
          'Installare qualsiasi pacchetto .msi con privilegi SYSTEM, indipendentemente dai permessi dell\'utente corrente',
          'Disabilita UAC in modo permanente',
          'Concede automaticamente privilegi di amministratore di dominio',
          'Impedisce la disinstallazione di software di sicurezza'
        ], correct: 0
      }
    ]
  },
  {
    id: 'web-shells-upload-bypass',
    title: 'Web Shell e Upload Bypass',
    excerpt: "Bypass di blacklist, content-type e file polyglot per caricare una web shell su un server vulnerabile. Stanza hands-on: dopo il quiz vai su una macchina reale e conferma le flag ottenute.",
    difficulty: 'media',
    thm: [
      { name: 'Vulnversity', difficulty: 'facile', note: "Il classico primo approccio a un upload di file vulnerabile per ottenere una shell su un server web." },
      { name: 'Pickle Rick', difficulty: 'facile', note: "CTF a tema web: enumerazione, foothold applicativo e privesc, buon ripasso pratico dei concetti visti." }
    ],
    practical: {
      flags: [
        { key: 'user', label: 'Flag user.txt' },
        { key: 'root', label: 'Flag root.txt' }
      ]
    },
    quiz: [
      {
        q: 'Perché filtrare solo in base all\'estensione del file (blacklist) è insufficiente per bloccare l\'upload di una web shell?',
        options: [
          'Perché il PHP ignora sempre l\'estensione dei file',
          'Perché esistono numerosi bypass (estensioni alternative come .phtml, maiuscole/minuscole, null byte) che aggirano un controllo blacklist: serve whitelist più validazione del contenuto reale',
          'Non è insufficiente, è la tecnica più sicura in assoluto',
          'Perché i browser bloccano comunque i file PHP'
        ], correct: 1
      },
      {
        q: 'Cos\'è un file "polyglot" nel contesto dell\'upload bypass?',
        options: [
          'Un file compresso con più algoritmi contemporaneamente',
          'Un file valido sia come immagine reale sia come script eseguibile, ottenuto ad esempio iniettando codice PHP nei metadati EXIF di un\'immagine JPEG',
          'Un file scritto in più linguaggi di programmazione contemporaneamente',
          'Un file che cambia estensione automaticamente ad ogni richiesta'
        ], correct: 1
      },
      {
        q: 'Qual è la difesa più efficace contro l\'exploit di file upload, oltre alla whitelist delle estensioni?',
        options: [
          'Aumentare la dimensione massima consentita per i file',
          'Salvare i file fuori dalla webroot, rinominarli con UUID casuali e disabilitare l\'esecuzione di script nella cartella di upload',
          'Chiedere solo la conferma via email prima di ogni upload',
          'Usare esclusivamente FTP invece di HTTP per il trasferimento'
        ], correct: 1
      }
    ]
  },
  {
    id: 'active-directory-attacchi-base',
    title: 'Active Directory: Kerberoasting e AS-REP Roasting',
    excerpt: "Kerberoasting, AS-REP Roasting, Pass-the-Hash e DCSync: i vettori di attacco fondamentali contro un dominio Active Directory. Stanza hands-on: dopo il quiz vai su un lab AD reale e conferma le flag ottenute.",
    difficulty: 'difficile',
    thm: [
      { name: 'Attacktive Directory', difficulty: 'media', note: "Il primo vero lab AD: enumerazione, AS-REP Roasting e Kerberoasting su un dominio giocattolo, esattamente i vettori trattati nell'articolo." }
    ],
    practical: {
      flags: [
        { key: 'user', label: 'Flag user.txt' },
        { key: 'root', label: 'Flag root.txt / Administrator' }
      ]
    },
    quiz: [
      {
        q: 'Cos\'è il Kerberoasting e cosa lo rende possibile?',
        options: [
          'Richiedere un Service Ticket (TGS) cifrato con l\'hash NTLM di un account di servizio con SPN registrato, per poi provare a crackarlo offline se la password è debole',
          'Un attacco che sovrascrive direttamente il database NTDS.dit senza autenticarsi',
          'Un attacco DDoS mirato contro il Domain Controller',
          'Una tecnica per resettare la password di qualsiasi utente di dominio'
        ], correct: 0
      },
      {
        q: 'Perché l\'AS-REP Roasting funziona solo su account con "Do not require Kerberos preauthentication" abilitato?',
        options: [
          'Perché solo in quel caso il KDC risponde con dati cifrati con l\'hash dell\'utente senza richiedere prima una prova di conoscenza della password, rendendo possibile richiederli senza credenziali e crackarli offline',
          'Perché quell\'opzione disabilita completamente Kerberos per l\'account',
          'Non è vero, funziona su qualsiasi account di dominio senza eccezioni',
          'Perché quell\'opzione condivide la password in chiaro via LDAP'
        ], correct: 0
      },
      {
        q: 'Cosa permette di fare un attacco DCSync?',
        options: [
          'Sincronizzare solo l\'orario di sistema tra i domain controller',
          'Simulare la replica di un Domain Controller per ottenere l\'intero database NTDS.dit con tutti gli hash del dominio, tipicamente il game over per l\'intera infrastruttura AD',
          'Creare un Domain Controller clone accessibile pubblicamente',
          'Forzare il logout di tutti gli utenti connessi al dominio'
        ], correct: 1
      }
    ]
  },
  {
    id: 'buffer-overflow-basi',
    title: 'Buffer Overflow: le basi',
    excerpt: "Stack layout, return address, offset e protezioni moderne come NX e ASLR. Stanza hands-on: dopo il quiz vai su un binario reale e conferma le flag ottenute.",
    difficulty: 'difficile',
    thm: [
      { name: 'Sudo Buffer Overflow', difficulty: 'media', note: "Tutorial guidato su CVE-2019-18634 nel programma sudo: un buffer overflow reale da sfruttare passo dopo passo." }
    ],
    practical: {
      flags: [
        { key: 'user', label: 'Flag user.txt' },
        { key: 'root', label: 'Flag root.txt' }
      ]
    },
    quiz: [
      {
        q: 'Perché sovrascrivere il return address sullo stack permette di controllare il flusso di esecuzione di un programma?',
        options: [
          'Perché è l\'indirizzo a cui la CPU salta al termine della funzione corrente: sovrascrivendolo con un indirizzo scelto dall\'attaccante, l\'esecuzione riprende da lì',
          'Perché contiene sempre il codice sorgente del programma',
          'Perché disabilita automaticamente tutte le protezioni del sistema operativo',
          'Non è vero, il return address non ha alcun effetto sul flusso'
        ], correct: 0
      },
      {
        q: 'A cosa serve un pattern ciclico (es. generato con cyclic) durante lo sviluppo di un exploit da buffer overflow?',
        options: [
          'A cifrare il payload per evitare il rilevamento da parte dell\'antivirus',
          'A determinare con precisione l\'offset in byte necessario per raggiungere il return address, individuando dove il programma crasha con quale porzione del pattern',
          'A generare automaticamente lo shellcode finale',
          'A misurare la velocità di esecuzione del programma target'
        ], correct: 1
      },
      {
        q: 'Cosa fa la protezione NX/DEP e quale tecnica si usa tipicamente per aggirarla?',
        options: [
          'Randomizza gli indirizzi di memoria; si aggira leakando un indirizzo per calcolare gli offset reali',
          'Rende lo stack non eseguibile, impedendo di eseguire shellcode iniettato direttamente; si aggira con tecniche ROP (Return-Oriented Programming) che riusano codice già eseguibile presente nel binario',
          'Aggiunge un valore sentinella prima del return address; si aggira leakando quel valore',
          'Cifra l\'intero segmento di memoria dello stack; non esistono tecniche di bypass note'
        ], correct: 1
      }
    ]
  },
  {
    id: 'ricognizione-passiva-osint',
    title: 'Ricognizione passiva e OSINT',
    excerpt: "Prima di toccare il target, un buon pentester raccoglie il più possibile da fonti aperte: WHOIS, DNS, sottodomini, metadata. La fase più sottovalutata — e più utile — di ogni test.",
    difficulty: 'facile',
    thm: [
      { name: 'Pre Security', difficulty: 'facile', note: "Il percorso include i fondamenti di ricognizione e OSINT prima di passare alle tecniche attive." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza principale tra ricognizione passiva e attiva?',
        options: [
          'La passiva è più veloce ma meno precisa',
          'Nella passiva non si interagisce mai direttamente con il target, quindi non lascia tracce nei suoi log',
          'La passiva si fa solo con Nmap',
          'Non c\'è alcuna differenza pratica'
        ], correct: 1
      },
      {
        q: 'A cosa serve consultare crt.sh durante l\'enumerazione dei sottodomini?',
        options: [
          'Per craccare le password del target',
          'Per cercare sottodomini nei certificati SSL pubblici emessi per il dominio',
          'Per inviare pacchetti ICMP al target',
          'Per bypassare il WAF'
        ], correct: 1
      },
      {
        q: 'Perché i metadata di un documento PDF o DOCX pubblico possono essere utili in fase di ricognizione?',
        options: [
          'Permettono di craccare la password del file',
          'Rivelano l\'indirizzo IP del server web',
          'Possono contenere nome utente di chi ha creato il file, versione del software e percorsi di rete interni',
          'Contengono sempre le credenziali del database'
        ], correct: 2
      }
    ]
  },
  {
    id: 'ricognizione-attiva-nmap',
    title: 'Ricognizione attiva con Nmap',
    excerpt: "Nmap è il punto di partenza di ogni pentest attivo. Tipi di scansione, script NSE, timing: capire cosa fa davvero ogni comando, non solo copiarlo.",
    difficulty: 'facile',
    thm: [
      { name: 'Nmap', difficulty: 'facile', note: "La room ufficiale per esercitarsi con Nmap dalla scansione base agli script NSE." },
      { name: 'Networking Concepts', difficulty: 'facile', note: "Utile per capire a fondo TCP/UDP prima di interpretare i risultati di una scansione." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza tra una SYN scan (-sS) e una TCP Connect scan (-sT)?',
        options: [
          'Sono identiche, cambia solo il nome',
          'La SYN scan non completa il three-way handshake ed è più veloce e meno rumorosa, ma richiede privilegi root',
          'La TCP Connect scan funziona solo su UDP',
          'La SYN scan richiede sempre una VPN'
        ], correct: 1
      },
      {
        q: 'Perché la scansione UDP (-sU) è molto più lenta di quella TCP?',
        options: [
          'Perché scansiona sempre tutte le 65535 porte per forza',
          'UDP non ha un handshake, quindi Nmap deve aspettare il timeout per dedurre lo stato della porta',
          'Perché richiede sempre la risoluzione DNS inversa',
          'È un limite artificiale imposto da Nmap'
        ], correct: 1
      },
      {
        q: 'A cosa serve il Nmap Scripting Engine (NSE, es. --script=smb-vuln-ms17-010)?',
        options: [
          'Serve solo a velocizzare la scansione delle porte',
          'Esegue script per enumerazione, vulnerability detection e altro, sfruttando un motore integrato in Nmap',
          'Cripta il traffico della scansione per l\'evasione IDS',
          'È un alias del comando -sV'
        ], correct: 1
      }
    ]
  },
  {
    id: 'google-dorking-recon-avanzato',
    title: 'Google Dorking e OSINT avanzato',
    excerpt: "I motori di ricerca indicizzano più di quanto pensiamo. Operatori Google, GHDB, Shodan e Censys per trovare quello che non dovrebbe essere pubblico — senza toccare il target.",
    difficulty: 'facile',
    thm: [
      { name: 'Pre Security', difficulty: 'facile', note: "Buona base di ricognizione open source prima di affinare le tecniche di dorking avanzato." }
    ],
    quiz: [
      {
        q: 'Cosa fa l\'operatore Google `filetype:sql site:target.com`?',
        options: [
          'Cerca solo pagine HTML del sito',
          'Cerca file con estensione .sql pubblicati sul dominio target.com',
          'Blocca l\'indicizzazione dei file SQL',
          'Esegue query SQL direttamente su Google'
        ], correct: 1
      },
      {
        q: 'Qual è la differenza principale tra Shodan e Censys?',
        options: [
          'Sono lo stesso servizio con nomi diversi',
          'Censys è focalizzato sui certificati TLS, utile per trovare sottodomini e asset non linkati pubblicamente; Shodan indicizza banner di servizi esposti',
          'Shodan funziona solo su reti IPv6',
          'Censys richiede sempre l\'autenticazione VPN al target'
        ], correct: 1
      },
      {
        q: 'Cos\'è il GHDB (Google Hacking Database) di Exploit-DB?',
        options: [
          'Un database di password rubate',
          'Una raccolta di Google dork categorizzati per tipo (vulnerabilità, file sensibili, dispositivi)',
          'Un tool per bypassare il CAPTCHA di Google',
          'Un motore di ricerca alternativo a Google'
        ], correct: 1
      }
    ]
  },
  {
    id: 'burp-suite-basi',
    title: 'Burp Suite: le basi',
    excerpt: "Il proxy standard per il web application testing. Intercept, Repeater, Intruder: come intercettare, modificare e ripetere le richieste HTTP durante un test reale.",
    difficulty: 'media',
    thm: [
      { name: 'OWASP Top 10', difficulty: 'media', note: "Le vulnerabilità della Top 10 si testano quasi sempre passando per Burp: ottimo terreno di allenamento." },
      { name: 'Vulnversity', difficulty: 'media', note: "Buona palestra per esercitarsi con l\'enumerazione web prima di usare Burp sul serio." }
    ],
    quiz: [
      {
        q: 'A cosa serve la scheda Repeater di Burp Suite?',
        options: [
          'Automatizza il brute force su form di login',
          'Permette di prendere una richiesta, modificarla e rilanciarla manualmente quante volte serve',
          'Cripta automaticamente tutto il traffico HTTPS',
          'Genera report di vulnerabilità automatici anche nella Community Edition'
        ], correct: 1
      },
      {
        q: 'Perché è necessario installare il certificato CA di Burp nel browser?',
        options: [
          'Per aumentare la velocità di navigazione',
          'Per permettere a Burp di intercettare e decifrare il traffico HTTPS senza errori di certificato',
          'Non è mai necessario, funziona automaticamente',
          'Serve solo per usare l\'Intruder'
        ], correct: 1
      },
      {
        q: 'Cosa NON è incluso nella Burp Suite Community Edition (gratuita)?',
        options: [
          'Il Proxy per intercettare le richieste',
          'Il Repeater',
          'Lo Scanner automatico di vulnerabilità e il Collaborator per test out-of-band',
          'Il Decoder per Base64/URL encoding'
        ], correct: 2
      }
    ]
  },
  {
    id: 'xss-cross-site-scripting',
    title: 'XSS — Cross-Site Scripting',
    excerpt: "Reflected, stored, DOM-based: i tre tipi di XSS spiegati con payload reali. A differenza della SQLi, l\'XSS non attacca il server: attacca il browser della vittima.",
    difficulty: 'media',
    thm: [
      { name: 'OWASP Top 10', difficulty: 'media', note: "Copre XSS insieme alle altre vulnerabilità web più comuni, con esempi pratici da risolvere." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza fondamentale tra XSS e SQL Injection?',
        options: [
          'Non c\'è differenza, sono lo stesso attacco',
          'L\'XSS attacca il browser della vittima eseguendo JavaScript nel contesto del sito legittimo; la SQLi attacca il database del server',
          'L\'XSS funziona solo su Internet Explorer',
          'La SQLi richiede sempre JavaScript'
        ], correct: 1
      },
      {
        q: 'Perché lo Stored XSS è considerato il più pericoloso tra i tre tipi?',
        options: [
          'Perché richiede privilegi di amministratore per essere sfruttato',
          'Perché il payload viene salvato nel database e servito automaticamente a ogni utente che visita la pagina',
          'Perché funziona solo su applicazioni scritte in PHP',
          'Perché non può essere rilevato da nessun WAF'
        ], correct: 1
      },
      {
        q: 'In che modo una Content Security Policy (CSP) ben configurata mitiga l\'XSS?',
        options: [
          'Cripta tutto l\'output HTML della pagina',
          'Dice al browser da quali sorgenti può caricare ed eseguire script, bloccando quelli iniettati da un attaccante',
          'Blocca tutte le richieste POST verso il server',
          'Sostituisce completamente la necessità di validare l\'input'
        ], correct: 1
      }
    ]
  },
  {
    id: 'sql-injection-basi',
    title: 'SQL Injection: le basi',
    excerpt: "Al primo posto della OWASP Top 10 da decenni. Come una query costruita concatenando input utente diventa un varco per leggere l\'intero database — e come i prepared statement lo chiudono.",
    difficulty: 'media',
    thm: [
      { name: 'OWASP Top 10', difficulty: 'media', note: "La SQL Injection è una delle vulnerabilità principali coperte dalla room, con esempi pratici da sfruttare." }
    ],
    quiz: [
      {
        q: 'Nell\'esempio classico `admin\'--` inserito come username, perché il login viene bypassato?',
        options: [
          'Perché il carattere apostrofo cripta automaticamente la password',
          'Perché `--` è un commento SQL e fa ignorare tutto ciò che segue, incluso il controllo della password',
          'Perché il database si blocca e concede l\'accesso di default',
          'Non viene bypassato, è solo un mito'
        ], correct: 1
      },
      {
        q: 'Qual è la differenza tra SQLi Boolean-based e Time-based (entrambe blind)?',
        options: [
          'Sono la stessa tecnica con nomi diversi',
          'La Boolean-based osserva differenze nella risposta della pagina (vero/falso), la Time-based usa funzioni di sleep per dedurre la risposta dal ritardo',
          'La Time-based funziona solo su MySQL',
          'La Boolean-based richiede sempre accesso fisico al server'
        ], correct: 1
      },
      {
        q: 'Perché i prepared statement risolvono la SQL Injection alla radice?',
        options: [
          'Perché criptano l\'intero database',
          'Perché l\'input dell\'utente viene sempre trattato come dato e mai interpretato come codice SQL',
          'Perché bloccano automaticamente ogni utente che sbaglia la password',
          'Perché disabilitano il database in caso di errore'
        ], correct: 1
      }
    ]
  },
  {
    id: 'introduzione-metasploit',
    title: 'Introduzione a Metasploit',
    excerpt: "Il framework di exploitation più usato al mondo. Struttura dei moduli, msfconsole, payload e meterpreter: da 'exploit trovato' a sessione attiva sul target.",
    difficulty: 'media',
    thm: [
      { name: 'Blue', difficulty: 'facile', note: "La room classica per sfruttare EternalBlue proprio con Metasploit, dalla scansione alla sessione Meterpreter." },
      { name: 'Vulnversity', difficulty: 'media', note: "Buon esercizio di enumerazione ed exploitation prima di affrontare moduli più complessi." }
    ],
    quiz: [
      {
        q: 'In Metasploit, qual è la differenza tra un modulo "exploit" e un modulo "auxiliary"?',
        options: [
          'Sono sinonimi, si comportano allo stesso modo',
          'L\'exploit sfrutta attivamente una vulnerabilità per ottenere accesso, l\'auxiliary serve per scanner/enumerazione senza necessariamente exploitare nulla',
          'L\'auxiliary funziona solo su Windows',
          'L\'exploit non richiede mai un payload'
        ], correct: 1
      },
      {
        q: 'Cos\'è Meterpreter e perché è più potente di una shell classica?',
        options: [
          'È un semplice alias per netcat',
          'È un payload avanzato che gira in memoria, difficile da rilevare, con comandi built-in come hashdump, migrate e screenshot',
          'È un tool separato da Metasploit non collegato ai payload',
          'Funziona solo su sistemi Linux'
        ], correct: 1
      },
      {
        q: 'A cosa serve il comando `set RHOSTS` in msfconsole?',
        options: [
          'Imposta la wordlist da usare per il brute force',
          'Imposta l\'indirizzo IP del target su cui verrà eseguito il modulo selezionato',
          'Avvia il database PostgreSQL',
          'Cambia il payload di default'
        ], correct: 1
      }
    ]
  },
  {
    id: 'reverse-shell-bind-shell',
    title: 'Reverse shell e bind shell',
    excerpt: "Hai una RCE. E adesso? Come trasformarla in una sessione interattiva: differenza tra bind e reverse shell, payload pronti e perché la reverse è quasi sempre la scelta giusta.",
    difficulty: 'media',
    thm: [
      { name: 'Vulnversity', difficulty: 'media', note: "Porta a ottenere una reverse shell su un target reale sfruttando un upload vulnerabile." },
      { name: 'Kenobi', difficulty: 'media', note: "Altro scenario pratico per esercitarsi a ottenere ed elevare una shell su Linux." }
    ],
    quiz: [
      {
        q: 'Perché la reverse shell funziona più spesso della bind shell in ambienti reali?',
        options: [
          'Perché è più veloce da configurare',
          'Perché i firewall bloccano quasi sempre le connessioni in ingresso, ma di solito permettono il traffico in uscita — ed è il target a connettersi verso l\'attaccante',
          'Perché non richiede alcun listener',
          'Perché funziona solo su Windows'
        ], correct: 1
      },
      {
        q: 'A cosa serve il comando `python3 -c \'import pty; pty.spawn("/bin/bash")\'` dopo aver ottenuto una shell?',
        options: [
          'Chiude la connessione in modo sicuro',
          'Fa l\'upgrade da una shell primitiva a una pseudo-TTY più completa, con tab completion e gestione di CTRL+C',
          'Cripta tutto il traffico della sessione',
          'Esegue automaticamente la privilege escalation'
        ], correct: 1
      },
      {
        q: 'Cosa genera msfvenom rispetto a un semplice payload bash one-liner?',
        options: [
          'Un file di testo con le credenziali del target',
          'Un eseguibile o script compilato (es. .exe, .php) pronto per sistemi dove serve un file invece di un comando shell diretto',
          'Una scansione automatica delle porte del target',
          'Un tunnel SSH permanente'
        ], correct: 1
      }
    ]
  },
  {
    id: 'password-cracking-hashcat-hydra',
    title: 'Password cracking: Hashcat e Hydra',
    excerpt: "Hashcat per il cracking offline degli hash, Hydra per il brute force online sui servizi di rete. Come funzionano, quando usarli, e come le password deboli cadono in millisecondi.",
    difficulty: 'media',
    thm: [
      { name: 'Crack the Hash', difficulty: 'facile', note: "Esercizio diretto di identificazione e cracking di hash con Hashcat." },
      { name: 'Hydra', difficulty: 'facile', note: "Room dedicata proprio a Hydra per il brute force di servizi di rete." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza principale tra Hashcat e Hydra?',
        options: [
          'Sono lo stesso strumento con nomi diversi',
          'Hashcat cracca hash offline (usando la GPU), Hydra fa brute force online direttamente contro servizi di rete come SSH o RDP',
          'Hydra funziona solo con hash MD5',
          'Hashcat richiede sempre una connessione a internet'
        ], correct: 1
      },
      {
        q: 'Cosa fa un attacco con regole (`-a 0 -r best64.rule`) in Hashcat che un attacco a dizionario semplice non fa?',
        options: [
          'Prova solo password casuali senza dizionario',
          'Trasforma le parole della wordlist (aggiungendo numeri, maiuscole, leet speak) per coprire varianti comuni',
          'Cripta l\'hash prima di craccarlo',
          'Funziona solo con bcrypt'
        ], correct: 1
      },
      {
        q: 'Perché l\'account lockout è una difesa efficace contro Hydra ma inutile contro Hashcat?',
        options: [
          'Perché blocca i tentativi di login dopo N fallimenti, mitigando il brute force online — ma Hashcat lavora offline su un hash già rubato, dove non esiste un account da bloccare',
          'Perché Hydra è più lento di Hashcat',
          'Perché l\'account lockout cripta automaticamente le password',
          'Non è vero, funziona ugualmente contro entrambi'
        ], correct: 0
      }
    ]
  },
  {
    id: 'pivoting-tunneling-reti',
    title: 'Pivoting e tunneling',
    excerpt: "Il primo host compromesso raramente è il target finale. Come usare SSH, Chisel, Ligolo-ng e sshuttle per instradare traffico attraverso host già compromessi verso reti interne.",
    difficulty: 'difficile',
    thm: [
      { name: 'Kenobi', difficulty: 'media', note: "Buona palestra di enumerazione di servizi multipli su un host, propedeutica ai concetti di pivoting." }
    ],
    quiz: [
      {
        q: 'Cosa fa il comando `ssh -D 1080 user@pivot`?',
        options: [
          'Apre una shell interattiva sul pivot',
          'Crea un proxy SOCKS5 locale sulla porta 1080 che instrada il traffico attraverso il pivot (dynamic port forwarding)',
          'Cancella i log SSH sul pivot',
          'Disabilita il firewall del pivot'
        ], correct: 1
      },
      {
        q: 'Perché Ligolo-ng è considerato più veloce di un setup basato su proxychains?',
        options: [
          'Perché non richiede alcuna configurazione di rete',
          'Perché crea una vera interfaccia TUN a livello di rete, senza che il traffico debba passare per proxychains',
          'Perché funziona solo su reti wireless',
          'Perché non richiede un agent sul sistema compromesso'
        ], correct: 1
      },
      {
        q: 'Quale di questi è un segnale che un blue team può usare per rilevare attività di pivoting?',
        options: [
          'Un aumento della RAM disponibile sul server',
          'Connessioni SSH con flag -D o -R insolite, traffico HTTP su porte non standard, o nuove rotte di rete su un host',
          'Un numero ridotto di pacchetti ICMP',
          'La disattivazione automatica dell\'antivirus'
        ], correct: 1
      }
    ]
  },
  {
    id: 'post-exploitation-persistence-linux',
    title: 'Post-Exploitation: persistenza su Linux',
    excerpt: "Una volta dentro, come un attaccante si assicura di poter rientrare: cron job, SSH authorized_keys, systemd service, SUID binary — e come i blue team li scovano.",
    difficulty: 'difficile',
    thm: [
      { name: 'Linux PrivEsc', difficulty: 'media', note: "Copre molte delle tecniche di enumerazione ed escalation legate alla persistenza su Linux." }
    ],
    quiz: [
      {
        q: 'Perché un servizio systemd malevolo è considerato più resiliente di un semplice cron job per la persistenza?',
        options: [
          'Perché systemd non può essere disabilitato',
          'Perché con `Restart=always` il servizio si riavvia automaticamente anche dopo un crash o un reboot, ed è meno visibile a un controllo veloce di crontab',
          'Perché i cron job non esistono più su Linux moderni',
          'Non è vero, sono equivalenti'
        ], correct: 1
      },
      {
        q: 'Come rileva un SOC analyst un SUID binary sospetto lasciato da un attaccante?',
        options: [
          'Controllando `crontab -l` di ogni utente',
          'Con `find / -perm -4000 -type f`, confrontando il risultato con una baseline nota',
          'Analizzando solo i log DNS',
          'Non è possibile rilevarlo in alcun modo'
        ], correct: 1
      },
      {
        q: 'Aggiungere una chiave pubblica SSH in `~/.ssh/authorized_keys` come tecnica di persistenza permette all\'attaccante di:',
        options: [
          'Craccare la password dell\'utente',
          'Accedere via SSH senza dover inserire alcuna password',
          'Disabilitare il firewall del sistema',
          'Ottenere automaticamente privilegi root'
        ], correct: 1
      }
    ]
  },
  {
    id: 'lateral-movement-red-team',
    title: 'Lateral Movement in Active Directory',
    excerpt: "Dal primo foothold ai sistemi più preziosi della rete. Pass-the-Hash, Pass-the-Ticket, Kerberoasting: le tecniche Red Team più usate in ambienti Windows AD, e come rilevarle.",
    difficulty: 'difficile',
    thm: [
      { name: 'Attacktive Directory', difficulty: 'difficile', note: "Room dedicata proprio agli attacchi Active Directory come il Kerberoasting: il match più diretto per questo argomento." }
    ],
    quiz: [
      {
        q: 'Cosa rende possibile il Pass-the-Hash?',
        options: [
          'Il fatto che Windows in molti scenari autentica l\'utente usando direttamente l\'hash NTLM, senza richiedere la password in chiaro',
          'Una vulnerabilità presente solo su Windows XP',
          'Il fatto che tutte le password vengano salvate in chiaro nel registro',
          'Un bug specifico di Kerberos ormai patchato'
        ], correct: 0
      },
      {
        q: 'In cosa consiste il Kerberoasting?',
        options: [
          'Nel forzare il reset della password di tutti gli utenti di dominio',
          'Nel richiedere i ticket Kerberos TGS per account di servizio (con SPN) e provare a craccarli offline, senza generare molto rumore',
          'Nel disabilitare Kerberos sul Domain Controller',
          'In un attacco DDoS contro il KDC'
        ], correct: 1
      },
      {
        q: 'Perché i Managed Service Accounts (MSA/gMSA) sono una buona difesa contro il Kerberoasting?',
        options: [
          'Perché disabilitano completamente Kerberos',
          'Perché ruotano automaticamente la password, rendendo molto più difficile un cracking offline efficace',
          'Perché bloccano ogni richiesta TGS',
          'Perché non hanno mai un SPN associato'
        ], correct: 1
      }
    ]
  },
  {
    id: 'wireshark-analisi-traffico',
    title: 'Wireshark: analisi del traffico',
    excerpt: "La rete non mente. Filtri essenziali, follow TCP stream, pattern sospetti come beaconing e DNS tunneling: come leggere un pcap come un blue teamer.",
    difficulty: 'facile',
    thm: [
      { name: 'Networking Concepts', difficulty: 'facile', note: "Capire bene TCP/UDP e lo stack di rete rende molto più facile interpretare una cattura in Wireshark." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza tra un capture filter e un display filter in Wireshark?',
        options: [
          'Sono la stessa cosa con sintassi diversa',
          'Il capture filter si applica prima della cattura (sintassi BPF), il display filter si applica dopo sui dati già catturati',
          'Il display filter richiede sempre privilegi di root',
          'Il capture filter funziona solo con tshark, mai con l\'interfaccia grafica'
        ], correct: 1
      },
      {
        q: 'Cosa fa l\'opzione "Follow TCP Stream" su un pacchetto?',
        options: [
          'Cancella il pacchetto dalla cattura',
          'Ricostruisce l\'intera conversazione tra i due host in un\'unica finestra leggibile, invece del singolo pacchetto isolato',
          'Cripta automaticamente il traffico HTTP',
          'Blocca la connessione in tempo reale'
        ], correct: 1
      },
      {
        q: 'Cosa indica tipicamente un pattern di "beaconing" nel traffico di rete?',
        options: [
          'Un normale aggiornamento software',
          'Connessioni verso lo stesso IP a intervalli regolarissimi, tipico comportamento di un malware che comunica con un server C2',
          'Un errore di configurazione del DNS',
          'Un attacco DDoS in corso'
        ], correct: 1
      }
    ]
  },
  {
    id: 'ids-ips-suricata',
    title: 'IDS/IPS con Suricata',
    excerpt: "Il firewall guarda porte e protocolli, non dentro il traffico. Suricata analizza in profondità: differenza IDS/IPS, regole custom, e come integrarlo in un SOC.",
    difficulty: 'media',
    thm: [
      { name: 'Snort', difficulty: 'media', note: "Le regole Suricata sono compatibili con quelle di Snort: qui le scrivi e le testi contro traffico reale." }
    ],
    quiz: [
      {
        q: 'Qual è la differenza pratica tra IDS e IPS?',
        options: [
          'Sono esattamente lo stesso strumento',
          'L\'IDS lavora out-of-band e genera solo alert; l\'IPS lavora in-line nel traffico e può anche bloccarlo attivamente',
          'L\'IDS funziona solo su reti wireless',
          'L\'IPS non genera mai alert, solo blocchi silenziosi'
        ], correct: 1
      },
      {
        q: 'Perché la regola d\'oro è iniziare sempre in modalità IDS prima di passare a IPS?',
        options: [
          'Perché l\'IPS non supporta regole custom',
          'Per studiare i falsi positivi e affinare le regole prima che un blocco automatico possa interrompere traffico legittimo',
          'Perché l\'IDS è sempre più veloce dell\'IPS',
          'Non è vero, si può iniziare direttamente in IPS'
        ], correct: 1
      },
      {
        q: 'A cosa serve il file `eve.json` generato da Suricata?',
        options: [
          'Contiene la configurazione delle interfacce di rete',
          'È il log strutturato degli eventi (alert, http, dns, tls) pronto per essere ingerito in strumenti come Elasticsearch/Kibana',
          'È il file delle regole di detection',
          'Contiene solo i log di sistema del server'
        ], correct: 1
      }
    ]
  },
  {
    id: 'siem-blue-team',
    title: 'SIEM e Blue Team',
    excerpt: "Il cuore operativo di ogni SOC: come un SIEM raccoglie, normalizza e correla i log da tutta l\'infrastruttura — e perché saperlo interrogare conta più di possederlo.",
    difficulty: 'media',
    thm: [
      { name: 'Introduction to SIEM', difficulty: 'facile', note: "Room dedicata proprio ai fondamentali di un SIEM: il match più diretto per questo argomento." }
    ],
    quiz: [
      {
        q: 'Cos\'è una "correlation rule" in un SIEM?',
        options: [
          'Una regola che cripta i log in transito',
          'Una logica che aggrega più eventi per identificare un comportamento sospetto, es. molti logon falliti seguiti da un logon riuscito',
          'Un filtro che cancella automaticamente i log vecchi',
          'Un tipo di firewall integrato nel SIEM'
        ], correct: 1
      },
      {
        q: 'Cos\'è l\'"alert fatigue" e perché è un problema per un SOC?',
        options: [
          'La stanchezza fisica degli analisti dopo un turno lungo',
          'La condizione in cui troppi alert, quasi tutti falsi positivi, portano gli analisti a non prenderli più sul serio',
          'Un bug che blocca il SIEM dopo troppi alert',
          'Non è un problema riconosciuto nella pratica'
        ], correct: 1
      },
      {
        q: 'Quale Event ID di Windows segnala tipicamente un tentativo di logon fallito, utile per rilevare brute force?',
        options: ['4624', '4625', '4688', '7045'],
        correct: 1
      }
    ]
  },
  {
    id: 'threat-hunting-intro',
    title: 'Threat Hunting: introduzione',
    excerpt: "Gli attaccanti bravi non fanno rumore. Il threat hunting non aspetta l\'alert: parte da un\'ipotesi e cerca attivamente ciò che gli strumenti automatici non hanno trovato.",
    difficulty: 'media',
    thm: [
      { name: 'Cyber Kill Chain', difficulty: 'media', note: "Capire le fasi di un attacco aiuta a costruire ipotesi di hunting mirate su ogni fase." },
      { name: 'Unified Kill Chain', difficulty: 'media', note: "Framework di riferimento simile a MITRE ATT&CK, utile per strutturare le ipotesi di caccia." }
    ],
    quiz: [
      {
        q: 'In cosa si differenzia il threat hunting dal monitoraggio passivo tramite SIEM/IDS?',
        options: [
          'Non c\'è alcuna differenza sostanziale',
          'Il threat hunting parte dall\'assunzione che l\'attaccante sia già dentro e cerca proattivamente, senza aspettare che scatti un alert',
          'Il threat hunting si fa solo dopo un incidente confermato',
          'Il threat hunting è automatizzato al 100% senza intervento umano'
        ], correct: 1
      },
      {
        q: 'Perché un LOLBin come `certutil.exe` usato per scaricare un payload rischia di non generare alcun alert?',
        options: [
          'Perché è un file cancellato automaticamente da Windows',
          'Perché è uno strumento legittimo di Windows, e gli strumenti automatici spesso conoscono solo pattern già visti in precedenza',
          'Perché richiede sempre privilegi SYSTEM',
          'Perché funziona solo offline'
        ], correct: 1
      },
      {
        q: 'A cosa serve MITRE ATT&CK in un processo di threat hunting?',
        options: [
          'È un tool di scansione delle vulnerabilità',
          'È una knowledge base di tattiche, tecniche e procedure (TTP) usate da attori reali, utile per costruire ipotesi di hunting mirate',
          'È un SIEM open source',
          'È un protocollo di autenticazione'
        ], correct: 1
      }
    ]
  },
  {
    id: 'incident-response-processo',
    title: 'Incident Response: il processo',
    excerpt: "Cosa fare nelle prime ore dopo un attacco confermato. Le sei fasi PICERL secondo NIST/SANS: preparazione, identificazione, contenimento, eradicazione, ripristino, lezioni apprese.",
    difficulty: 'media',
    thm: [
      { name: 'Cyber Kill Chain', difficulty: 'media', note: "Capire le fasi di un attacco aiuta a identificare correttamente la portata durante un incidente reale." }
    ],
    quiz: [
      {
        q: 'Cosa significa l\'acronimo PICERL nel processo di Incident Response?',
        options: [
          'Un protocollo di cifratura per i log',
          'Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned',
          'Un tool specifico per l\'analisi forense',
          'Il nome di un framework di attacco, non di difesa'
        ], correct: 1
      },
      {
        q: 'Perché non bisogna mai spegnere di colpo un sistema compromesso durante il contenimento?',
        options: [
          'Perché rallenta il ripristino del backup',
          'Perché la RAM contiene prove preziose (processi attivi, connessioni, chiavi in memoria) che andrebbero perse spegnendo la macchina',
          'Perché lo spegnimento è illegale durante un\'indagine',
          'Non è vero, spegnere subito è sempre la scelta migliore'
        ], correct: 1
      },
      {
        q: 'Qual è l\'obiettivo principale della fase di Eradication?',
        options: [
          'Riportare i sistemi online il più velocemente possibile',
          'Rimuovere la causa dell\'incidente (malware, credenziali compromesse) e capire la root cause, cioè come è entrato l\'attaccante',
          'Scrivere il report finale per il management',
          'Configurare il piano di comunicazione fuori banda'
        ], correct: 1
      }
    ]
  },
  {
    id: 'analisi-malware-base',
    title: 'Analisi malware: le basi',
    excerpt: "Hai trovato un file sospetto. Come analizzarlo senza eseguirlo (analisi statica) e cosa osservare quando lo esegui in un ambiente isolato (analisi dinamica).",
    difficulty: 'difficile',
    thm: [
      { name: 'Malware Analysis - Malhare.exe', difficulty: 'facile', note: "Applica proprio i passi dell\'articolo — analisi statica e dinamica — su un campione reale in ambiente controllato." }
    ],
    quiz: [
      {
        q: 'Qual è la regola più importante prima di analizzare un file sospetto?',
        options: [
          'Caricarlo subito su VirusTotal',
          'Non eseguirlo mai su un sistema reale: va sempre analizzato in una VM isolata o sandbox sacrificabile',
          'Rinominare il file con estensione .txt',
          'Cancellarlo immediatamente senza analizzarlo'
        ], correct: 1
      },
      {
        q: 'Nell\'analisi statica, perché un\'alta entropia in una sezione del file (es. .text) è un campanello d\'allarme?',
        options: [
          'Indica che il file è più grande della media',
          'Suggerisce possibile packing o cifratura del codice, tecnica usata per nascondere il comportamento reale del malware',
          'Significa che il file è stato scaricato di recente',
          'Indica che il file è sicuramente innocuo'
        ], correct: 1
      },
      {
        q: 'A cosa serve uno strumento come FakeNet-NG durante l\'analisi dinamica?',
        options: [
          'Cracca le password trovate nel malware',
          'Simula DNS e HTTP per osservare le richieste di rete del malware senza generare traffico reale verso internet',
          'Compila il codice sorgente del malware',
          'Rimuove automaticamente il malware dal sistema'
        ], correct: 1
      }
    ]
  },
  {
    id: 'vulnerability-management',
    title: 'Vulnerability Management',
    excerpt: "Non puoi proteggere ciò che non conosci. Le 4 fasi del VM: inventario, scanning, prioritizzazione con CVSS/SSVC, remediation — un processo continuo, non un\'attività una tantum.",
    difficulty: 'media',
    thm: [
      { name: 'Security Principles', difficulty: 'facile', note: "Inquadra il vulnerability management nel contesto più ampio dei principi di sicurezza." },
      { name: 'Nmap', difficulty: 'facile', note: "Nmap è uno degli strumenti citati nell\'articolo per l\'inventario e lo scanning iniziale." }
    ],
    quiz: [
      {
        q: 'Quali sono, in ordine, le 4 fasi del ciclo di Vulnerability Management descritte nell\'articolo?',
        options: [
          'Patch, Scan, Report, Backup',
          'Inventario, Vulnerability Scanning, Prioritizzazione, Remediation e Verifica',
          'Exploit, Persistence, Exfiltration, Cleanup',
          'Firewall, IDS, SIEM, SOC'
        ], correct: 1
      },
      {
        q: 'Perché il solo punteggio CVSS non basta per prioritizzare correttamente una vulnerabilità?',
        options: [
          'Perché il CVSS non esiste più dal 2020',
          'Perché non considera da solo fattori come lo sfruttamento attivo in the wild o l\'esposizione reale del sistema a internet — per questo esistono framework come SSVC',
          'Perché il CVSS si applica solo al software Microsoft',
          'Perché è sempre uguale a 10 per ogni vulnerabilità critica'
        ], correct: 1
      },
      {
        q: 'Secondo l\'articolo, qual è l\'errore più comune che fa fallire un programma di Vulnerability Management?',
        options: [
          'Usare troppi scanner diversi contemporaneamente',
          'Scansionare regolarmente e produrre report, ma non riuscire davvero a far applicare le patch per problemi di processo/approvazione',
          'Non avere abbastanza budget per gli scanner a pagamento',
          'Patchare troppo velocemente senza testare'
        ], correct: 1
      }
    ]
  },
  {
    id: 'phishing-riconoscere-rispondere',
    title: 'Phishing: riconoscerlo e rispondere',
    excerpt: "Il vettore d\'attacco numero uno funziona perché prende di mira le persone. Come analizzare header, link e allegati sospetti — e cosa fare nella prima ora se qualcuno ci è già cascato.",
    difficulty: 'facile',
    thm: [
      { name: 'Phishing Analysis Fundamentals', difficulty: 'facile', note: "Analizza gli stessi elementi dell\'articolo — header, mittente, componenti dell\'email — su campioni reali." },
      { name: 'Phishing Emails in Action', difficulty: 'facile', note: "Il seguito naturale: riconosci gli indicatori di phishing su email reali usate dagli attaccanti." }
    ],
    quiz: [
      {
        q: 'Perché controllare solo il "nome visualizzato" del mittente di un\'email non è sufficiente?',
        options: [
          'Perché i client di posta nascondono sempre l\'indirizzo reale',
          'Perché il nome visualizzato è facilmente falsificabile, mentre l\'indirizzo email reale può essere completamente diverso da quello che sembra',
          'Perché il nome visualizzato viene generato casualmente da ogni client',
          'Non è vero, il nome visualizzato è sempre affidabile'
        ], correct: 1
      },
      {
        q: 'Se gli header di un\'email mostrano `Authentication-Results: dmarc=fail`, cosa significa?',
        options: [
          'Che l\'email è stata cifrata correttamente',
          'Che il controllo DMARC è fallito, un forte campanello d\'allarme sulla legittimità del mittente',
          'Che l\'email è stata bloccata e non è mai arrivata',
          'Che il server di posta del destinatario è offline'
        ], correct: 1
      },
      {
        q: 'Qual è il primo passo consigliato dall\'articolo quando un utente clicca un link di phishing e inserisce le credenziali?',
        options: [
          'Aspettare 24 ore per vedere se succede qualcosa',
          'Resettare immediatamente la password dell\'account compromesso, revocare le sessioni attive e abilitare MFA',
          'Cancellare subito l\'account dell\'utente',
          'Contattare la stampa per avvisare del data breach'
        ], correct: 1
      }
    ]
  },
  {
    id: 'cose-il-blue-team',
    title: 'Cos\'è il Blue Team: ruoli, strumenti e differenza con il Red Team',
    excerpt: "Il Blue Team difende, rileva e risponde. Cosa fanno concretamente un analista SOC, un threat hunter e un incident responder, e quali strumenti usano ogni giorno.",
    difficulty: 'facile',
    thm: [
      { name: 'Pre Security', difficulty: 'facile', note: "Prima di entrare nel Blue Team conviene avere i fondamentali di reti e sicurezza ben saldi." },
      { name: 'Security Principles', difficulty: 'facile', note: "I principi di sicurezza che stanno alla base di ogni scelta difensiva descritta in questa stanza." }
    ],
    quiz: [
      {
        q: "Qual è la differenza principale tra il lavoro del Red Team e quello del Blue Team?",
        options: [
          "Il Red Team lavora solo di notte, il Blue Team solo di giorno",
          "Il Red Team simula attacchi in ingaggi periodici, il Blue Team difende in modo operativo e continuo",
          "Non c'è differenza, sono lo stesso ruolo con nomi diversi",
          "Il Blue Team si occupa solo di firewall, il Red Team di tutto il resto"
        ], correct: 1
      },
      {
        q: "In un SOC organizzato a livelli (tier), cosa fa tipicamente un analista Tier 1?",
        options: [
          "Reverse engineering avanzato del malware",
          "Sviluppo di nuove regole di detection da zero",
          "Triage iniziale degli alert e escalation ai livelli superiori",
          "Gestione esclusiva delle relazioni con i clienti"
        ], correct: 2
      },
      {
        q: "A cosa serve principalmente il framework MITRE ATT&CK per un Blue Team?",
        options: [
          "A generare automaticamente exploit per il Red Team",
          "A mappare la propria copertura di detection sulle tattiche e tecniche realmente usate dagli attaccanti",
          "A sostituire completamente il SIEM",
          "È uno strumento solo per la gestione delle password"
        ], correct: 1
      }
    ]
  },
  {
    id: 'hardening-linux',
    title: 'Hardening Linux: rendere un sistema più sicuro passo dopo passo',
    excerpt: "Checklist pratica per hardening di sistemi Linux: configurazione SSH sicura, firewall, permessi, logging, rimozione servizi inutili e CIS benchmark.",
    difficulty: 'media',
    thm: [
      { name: 'Linux Fundamentals Part 1', difficulty: 'facile', note: "Prima di irrobustire un sistema Linux è utile essere a proprio agio con i comandi base da terminale." }
    ],
    quiz: [
      {
        q: "Quale impostazione SSH riduce di più il rischio di un attacco brute force riuscito?",
        options: [
          "Cambiare solo la porta di default, lasciando la password abilitata",
          "Disabilitare PasswordAuthentication e consentire solo l'accesso con chiave SSH",
          "Aumentare il numero massimo di tentativi di autenticazione",
          "Abilitare PermitEmptyPasswords per semplificare l'accesso"
        ], correct: 1
      },
      {
        q: "A cosa serve fail2ban in un hardening Linux?",
        options: [
          "A cifrare automaticamente il disco",
          "A bannare temporaneamente un IP dopo troppi tentativi di autenticazione falliti",
          "A sostituire completamente il firewall",
          "A gestire gli aggiornamenti automatici del sistema"
        ], correct: 1
      },
      {
        q: "Cosa fanno SELinux e AppArmor quando sono in modalità enforce?",
        options: [
          "Registrano soltanto le violazioni senza bloccarle",
          "Applicano un controllo di accesso obbligatorio (MAC) che blocca le azioni non consentite dal profilo di un'applicazione",
          "Aggiornano automaticamente i pacchetti di sistema",
          "Gestiscono esclusivamente le regole del firewall"
        ], correct: 1
      }
    ]
  },
  {
    id: 'hardening-windows',
    title: 'Hardening Windows: configurazioni essenziali per ridurre la superficie d\'attacco',
    excerpt: "Hardening di un sistema Windows: Group Policy, Defender configurato, BitLocker, logging degli eventi, disabilitazione di LLMNR/NetBIOS e protocolli legacy.",
    difficulty: 'media',
    thm: [
      { name: 'Windows Fundamentals 1', difficulty: 'facile', note: "I fondamentali di Windows utili per capire dove intervenire prima di affrontare l'hardening vero e proprio." }
    ],
    quiz: [
      {
        q: "Perché è consigliato disabilitare SMBv1 durante l'hardening di Windows?",
        options: [
          "Perché rallenta la rete più delle versioni successive",
          "Perché è il protocollo sfruttato da attacchi noti come WannaCry ed EternalBlue",
          "Perché non è più supportato da nessuna versione di Windows",
          "Perché impedisce l'uso di Windows Defender"
        ], correct: 1
      },
      {
        q: "Cosa permettono di fare le regole ASR (Attack Surface Reduction) di Windows Defender?",
        options: [
          "Bloccare comportamenti specifici e rischiosi, come l'esecuzione di script offuscati o il process injection da Office",
          "Aumentare la velocità di avvio del sistema",
          "Sostituire completamente il firewall di Windows",
          "Gestire gli aggiornamenti automatici del sistema operativo"
        ], correct: 0
      },
      {
        q: "Perché abilitare lo Script Block Logging di PowerShell è importante per un Blue Team?",
        options: [
          "Perché velocizza l'esecuzione degli script",
          "Perché registra il contenuto reale di ogni script eseguito, anche se offuscato, utile per il threat hunting",
          "Perché disabilita automaticamente PowerShell se rileva codice sospetto",
          "Perché è richiesto per installare Windows Update"
        ], correct: 1
      }
    ]
  },
  {
    id: 'network-segmentation-vlan-dmz',
    title: 'Segmentazione di rete: VLAN, DMZ e microsegmentazione per ridurre il blast radius',
    excerpt: "Una rete piatta è un sogno per gli attaccanti: compromesso un host, si muovono liberamente. La segmentazione limita il blast radius contenendo le compromissioni ai singoli segmenti.",
    difficulty: 'media',
    thm: [
      { name: 'Networking Concepts', difficulty: 'facile', note: "I concetti di rete di base che servono per capire come e perché si segmenta un'infrastruttura." }
    ],
    quiz: [
      {
        q: "Cosa si intende per \"blast radius\" in una rete non segmentata?",
        options: [
          "La velocità massima della rete",
          "L'estensione dei sistemi che un attaccante può raggiungere dopo aver compromesso un singolo host",
          "Il numero di VLAN configurate",
          "La distanza fisica tra gli switch"
        ], correct: 1
      },
      {
        q: "Qual è lo scopo principale di una DMZ?",
        options: [
          "Ospitare i backup aziendali",
          "Isolare i servizi esposti su Internet sia dalla rete interna sia da Internet stesso",
          "Sostituire la necessità di un firewall",
          "Fornire una VLAN dedicata solo agli amministratori"
        ], correct: 1
      },
      {
        q: "Come rende la segmentazione più visibile il lateral movement di un attaccante?",
        options: [
          "Lo rende impossibile in ogni caso",
          "Ogni tentativo di attraversare i segmenti passa dal firewall, che può loggare e bloccare la connessione",
          "Riduce automaticamente la velocità di ogni connessione sospetta",
          "Cifra automaticamente tutto il traffico interno"
        ], correct: 1
      }
    ]
  },
  {
    id: 'zero-trust-architettura',
    title: 'Zero Trust: l\'architettura di sicurezza che non si fida di nessuno',
    excerpt: "Il modello Zero Trust ribalta il paradigma tradizionale: non esiste più una rete 'interna' sicura. Ogni accesso va verificato, ogni identità autenticata, ogni segmento isolato.",
    difficulty: 'media',
    thm: [
      { name: 'Security Principles', difficulty: 'facile', note: "I principi di sicurezza su cui si fonda anche il ragionamento Zero Trust." }
    ],
    quiz: [
      {
        q: "Quale dei seguenti NON è uno dei tre principi fondamentali dello Zero Trust descritti nell'articolo?",
        options: [
          "Verifica esplicita di ogni accesso",
          "Least privilege e accesso Just-In-Time",
          "Fiducia implicita per chi è già dentro la rete aziendale",
          "Assume Breach, progettare come se la rete fosse già compromessa"
        ], correct: 2
      },
      {
        q: "Cos'è BeyondCorp, citato come esempio pratico di Zero Trust?",
        options: [
          "Un firewall hardware di nuova generazione",
          "L'implementazione Zero Trust di Google, senza VPN né rete interna considerata automaticamente fidata",
          "Uno standard NIST obbligatorio per legge",
          "Un antivirus per endpoint aziendali"
        ], correct: 1
      },
      {
        q: "Nel modello Zero Trust, cosa decide il \"Policy Engine\"?",
        options: [
          "Solo la velocità della connessione di rete",
          "Se un determinato utente, con un determinato dispositivo, in un determinato contesto, può accedere a una determinata risorsa",
          "Quali VLAN esistono nella rete",
          "Il colore del logo aziendale"
        ], correct: 1
      }
    ]
  },
  {
    id: 'edr-endpoint-detection-response',
    title: 'EDR: cos\'è, come funziona e come sceglierlo per la tua organizzazione',
    excerpt: "L'EDR è la risposta moderna all'antivirus tradizionale. Monitora il comportamento degli endpoint in tempo reale, correla eventi con MITRE ATT&CK e permette la risposta agli incidenti remota.",
    difficulty: 'media',
    thm: [
      { name: 'Introduction to SIEM', difficulty: 'facile', note: "Un EDR spesso alimenta un SIEM: capire come funziona l'aggregazione degli eventi aiuta a capire il valore di un EDR." }
    ],
    quiz: [
      {
        q: "Qual è la differenza fondamentale tra un antivirus tradizionale e un EDR?",
        options: [
          "L'EDR controlla solo i file in arrivo via email",
          "L'antivirus controlla i file, l'EDR controlla i comportamenti nel tempo",
          "Non c'è alcuna differenza pratica",
          "L'EDR funziona solo su server, mai su workstation"
        ], correct: 1
      },
      {
        q: "Perché una catena di processi come word.exe che genera powershell.exe che genera rundll32.exe è più significativa dei singoli eventi presi da soli?",
        options: [
          "Perché ogni singolo evento è già di per sé innocuo, ma la sequenza correlata rivela un comportamento malevolo",
          "Perché Word non può mai generare processi figli",
          "Perché indica solo un problema di prestazioni del sistema",
          "Perché è sempre un falso positivo"
        ], correct: 0
      },
      {
        q: "Cosa offre un servizio MDR (Managed Detection and Response)?",
        options: [
          "Sostituisce completamente la necessità di un EDR",
          "Personale specializzato che monitora gli alert EDR 24/7 per le organizzazioni senza un SOC interno",
          "Solo la vendita di licenze antivirus",
          "Un servizio di backup cloud"
        ], correct: 1
      }
    ]
  },
  {
    id: 'soc-analyst-giornata-tipo',
    title: 'Giornata tipo di un SOC Analyst: triage, alert fatigue e investigazione',
    excerpt: "Come si passa una giornata in un Security Operations Center? Dalla gestione degli alert mattutini all'investigazione di un incidente reale. Il ruolo del SOC analyst, gli strumenti e le sfide quotidiane.",
    difficulty: 'facile',
    thm: [
      { name: 'Introduction to SIEM', difficulty: 'facile', note: "Il SIEM è lo strumento con cui un SOC analyst passa gran parte della giornata." }
    ],
    quiz: [
      {
        q: "Cosa si intende per \"alert fatigue\" in un SOC?",
        options: [
          "La stanchezza fisica dovuta ai turni notturni",
          "Il fenomeno per cui un analyst, sommerso da troppi alert, inizia a chiuderli meccanicamente senza vera analisi",
          "Un tipo di attacco informatico",
          "Un malfunzionamento del SIEM"
        ], correct: 1
      },
      {
        q: "Nell'esempio di investigazione descritto nell'articolo, qual è la catena di processi che fa scattare i sospetti?",
        options: [
          "explorer.exe che apre una cartella di rete",
          "email aperta, poi Word, poi PowerShell, poi una connessione esterna",
          "un semplice riavvio del sistema",
          "l'apertura di un browser web"
        ], correct: 1
      },
      {
        q: "Quale tra queste NON è indicata nell'articolo come soluzione all'alert fatigue?",
        options: [
          "Tuning delle regole SIEM per ridurre i falsi positivi",
          "Automazione SOAR per gli alert semplici e ripetitivi",
          "Ignorare sistematicamente tutti gli alert di severità Critical",
          "Prioritizzazione risk-based degli alert"
        ], correct: 2
      }
    ]
  },
  {
    id: 'analisi-log-windows-event-id',
    title: 'Analisi dei log Windows: gli Event ID che ogni Blue Team deve conoscere',
    excerpt: "Gli Event ID di Windows raccontano tutto: login, escalation, lateral movement, persistence. Guida agli ID fondamentali e come usarli per rilevare attività sospette.",
    difficulty: 'media',
    thm: [
      { name: 'Windows Forensics 1', difficulty: 'media', note: "Gli stessi Event ID visti in questa stanza sono tra gli artefatti più usati anche in un'analisi forense successiva." }
    ],
    quiz: [
      {
        q: "Cosa indica tipicamente un elevato numero di Event ID 4625 provenienti dallo stesso IP in poco tempo?",
        options: [
          "Un normale utilizzo quotidiano del sistema",
          "Un probabile tentativo di brute force",
          "Un aggiornamento di Windows in corso",
          "Un problema di connettività di rete"
        ], correct: 1
      },
      {
        q: "Perché l'Event ID 1102 (log di Security cancellato) è considerato critico?",
        options: [
          "Perché avviene automaticamente ogni notte",
          "Perché quasi sempre indica un attaccante che cerca di coprire le proprie tracce",
          "Perché indica solo un riavvio programmato",
          "Perché è generato dagli aggiornamenti di sistema"
        ], correct: 1
      },
      {
        q: "Un numero elevato di richieste TGS (Event ID 4769) per account con SPN in poco tempo è sintomo di quale tecnica?",
        options: [
          "Un normale login giornaliero",
          "Probabile Kerberoasting",
          "Un problema di rete DNS",
          "Un aggiornamento delle policy di gruppo"
        ], correct: 1
      }
    ]
  },
  {
    id: 'threat-intelligence-principianti',
    title: 'Threat Intelligence per principianti: capire chi attacca e come',
    excerpt: "La threat intelligence trasforma dati grezzi in conoscenza utile per la difesa. Tipi di intelligence, fonti OSINT, MISP e come integrare gli IOC nei sistemi di difesa.",
    difficulty: 'facile',
    thm: [
      { name: 'Threat Intelligence Tools', difficulty: 'facile', note: "Gli stessi strumenti OSINT descritti nell'articolo, messi in pratica direttamente in questa stanza." }
    ],
    quiz: [
      {
        q: "Quale livello di Threat Intelligence descrive le TTP (Tattiche, Tecniche e Procedure) degli attaccanti mappate su MITRE ATT&CK?",
        options: [
          "Strategic Intelligence",
          "Tactical Intelligence",
          "Solo la Technical Intelligence",
          "Nessuno dei livelli descritti"
        ], correct: 1
      },
      {
        q: "A cosa serve MISP?",
        options: [
          "A cifrare le comunicazioni email aziendali",
          "A gestire e condividere threat intelligence tra organizzazioni, correlando automaticamente gli indicatori",
          "A sostituire completamente il SIEM",
          "A generare automaticamente exploit"
        ], correct: 1
      },
      {
        q: "Cosa sono STIX e TAXII?",
        options: [
          "Due tool di penetration testing",
          "Uno standard per rappresentare l'intelligence (STIX) e un protocollo per distribuirla (TAXII)",
          "Due tipi di malware",
          "Due certificazioni di sicurezza informatica"
        ], correct: 1
      }
    ]
  },
  {
    id: 'osint-difensivo-monitoraggio',
    title: 'OSINT Difensivo: monitorare la propria esposizione online come fanno gli attaccanti',
    excerpt: "Prima di attaccarti, gli avversari raccolgono informazioni su di te da fonti pubbliche. L'OSINT difensivo consiste nell'eseguire questa ricognizione su se stessi per scoprire e correggere le esposizioni prima degli altri.",
    difficulty: 'facile',
    thm: [
      { name: 'Threat Intelligence Tools', difficulty: 'facile', note: "Molti degli strumenti OSINT usati per la difesa in questo articolo sono gli stessi esplorati in questa stanza." }
    ],
    quiz: [
      {
        q: "Qual è l'idea centrale dell'OSINT difensivo?",
        options: [
          "Attaccare per primi i concorrenti",
          "Usare le stesse tecniche di ricognizione di un attaccante contro se stessi, per trovare esposizioni prima che vengano sfruttate",
          "Comprare software costoso di threat intelligence",
          "Disattivare completamente la presenza online dell'azienda"
        ], correct: 1
      },
      {
        q: "A cosa serve Shodan Monitor nel contesto dell'OSINT difensivo?",
        options: [
          "A cifrare i dati aziendali",
          "Ad avvisare quando nuovi servizi del proprio range IP diventano visibili pubblicamente su Internet",
          "A generare password sicure",
          "A gestire i backup aziendali"
        ], correct: 1
      },
      {
        q: "Perché monitorare i certificati SSL pubblici (es. tramite crt.sh) è utile in ottica difensiva?",
        options: [
          "Perché rivela automaticamente le password degli utenti",
          "Perché permette di scoprire sottodomini, anche dimenticati, che un attaccante troverebbe allo stesso modo",
          "Perché blocca automaticamente gli attacchi DDoS",
          "Perché è richiesto per legge in tutti i paesi"
        ], correct: 1
      }
    ]
  },
  {
    id: 'honeypot-deception-technology',
    title: 'Honeypot e Deception Technology: intrappolare gli attaccanti con trappole digitali',
    excerpt: "Un honeypot è un sistema intenzionalmente vulnerabile progettato per attirare gli attaccanti. Le moderne deception technology vanno oltre: distribuiscono trappole ovunque nella rete per rilevare le intrusioni con quasi zero falsi positivi.",
    difficulty: 'media',
    thm: [
      { name: 'Snort', difficulty: 'media', note: "Un IDS come Snort e un honeypot sono spesso complementari nella strategia di detection di un blue team." }
    ],
    quiz: [
      {
        q: "Perché un alert generato da un honeypot ha, secondo l'articolo, una percentuale di falsi positivi vicina allo zero?",
        options: [
          "Perché usa un'intelligenza artificiale avanzata",
          "Perché nessun utente legittimo ha motivo di interagire con un sistema che non ha funzioni produttive reali",
          "Perché gli honeypot bloccano automaticamente ogni connessione",
          "Perché sono collegati direttamente al SIEM aziendale"
        ], correct: 1
      },
      {
        q: "Cosa fa un Canary Token quando un attaccante apre il file collegato?",
        options: [
          "Cancella automaticamente il file",
          "Invia un alert con informazioni come IP, browser e geolocalizzazione, senza che l'attaccante se ne accorga",
          "Blocca immediatamente la rete dell'attaccante",
          "Cifra il contenuto del computer dell'attaccante"
        ], correct: 1
      },
      {
        q: "Perché un account honeytoken come \"admin-backup\" in Active Directory è utile per la detection?",
        options: [
          "Perché velocizza il login degli amministratori reali",
          "Perché nessun utente legittimo dovrebbe mai usarlo: qualsiasi tentativo di login su quell'account è automaticamente sospetto",
          "Perché sostituisce la necessità di password complesse",
          "Perché riduce il carico del controller di dominio"
        ], correct: 1
      }
    ]
  },
  {
    id: 'cloud-security-aws-misconfigurazioni',
    title: 'Cloud Security: le misconfigurazioni AWS più comuni e come evitarle',
    excerpt: "Il 99% delle violazioni cloud è causato da errori di configurazione, non da vulnerabilità del provider. Bucket S3 pubblici, IAM permissivo, istanze EC2 esposte: le misconfigurazioni AWS più comuni e come correggerle.",
    difficulty: 'media',
    thm: [
      { name: 'Introduction to AWS Security Tools', difficulty: 'facile', note: "I principali strumenti di sicurezza AWS descritti nell'articolo, esplorati in pratica in questa stanza." }
    ],
    quiz: [
      {
        q: "Secondo il modello Shared Responsibility di AWS, di chi è la responsabilità di configurare correttamente i permessi IAM?",
        options: [
          "Sempre e solo di AWS",
          "Del cliente che usa i servizi cloud",
          "Di nessuno, è automatico",
          "Solo del provider di connettività Internet"
        ], correct: 1
      },
      {
        q: "Perché una policy IAM con \"Action\": \"*\" e \"Resource\": \"*\" è considerata pericolosa?",
        options: [
          "Perché rallenta le chiamate API",
          "Perché concede permessi illimitati su ogni risorsa, violando il principio del minimo privilegio",
          "Perché è più costosa delle policy granulari",
          "Perché blocca automaticamente l'accesso di root"
        ], correct: 1
      },
      {
        q: "A cosa serve AWS CloudTrail?",
        options: [
          "A cifrare automaticamente tutti i bucket S3",
          "A registrare ogni chiamata API effettuata nell'account, fungendo da log di audit fondamentale",
          "A sostituire i Security Group",
          "A gestire esclusivamente il billing dell'account"
        ], correct: 1
      }
    ]
  },
  {
    id: 'email-security-spf-dkim-dmarc',
    title: 'Email Security: SPF, DKIM e DMARC, come funzionano e come configurarli',
    excerpt: "Il 91% degli attacchi informatici inizia con una email. SPF, DKIM e DMARC sono i tre standard che proteggono il tuo dominio dall'essere usato per phishing e spoofing. Come funzionano e come si configurano.",
    difficulty: 'media',
    thm: [
      { name: 'Phishing Analysis Fundamentals', difficulty: 'facile', note: "Capire come si falsificano le email aiuta a capire perché SPF, DKIM e DMARC servono davvero." }
    ],
    quiz: [
      {
        q: "Qual è la differenza pratica tra un record SPF con -all e uno con ~all?",
        options: [
          "Non c'è alcuna differenza",
          "-all rifiuta le email non autorizzate (hard fail), ~all le accetta comunque marcandole (soft fail)",
          "-all funziona solo con Gmail, ~all solo con Outlook",
          "~all è più restrittivo di -all"
        ], correct: 1
      },
      {
        q: "Cosa dimostra una firma DKIM valida su un'email ricevuta?",
        options: [
          "Che il mittente ha pagato per un servizio premium",
          "Che il contenuto non è stato modificato in transito e proviene da server autorizzati dal dominio",
          "Che l'email non contiene allegati",
          "Che l'email è stata cifrata end-to-end"
        ], correct: 1
      },
      {
        q: "Perché l'articolo consiglia di NON passare subito a p=reject su DMARC?",
        options: [
          "Perché p=reject non è supportato da nessun provider email",
          "Perché senza aver prima raccolto report con p=none si rischia di bloccare anche email legittime",
          "Perché p=reject è illegale in alcuni paesi",
          "Perché richiede sempre un canone aggiuntivo"
        ], correct: 1
      }
    ]
  },
  {
    id: 'backup-recovery-strategia-3-2-1',
    title: 'Backup e Recovery: la regola 3-2-1 e come costruire una strategia anti-ransomware',
    excerpt: "Il backup è l'ultima linea di difesa contro il ransomware. La regola 3-2-1, i backup immutabili, i test di restore e tutto ciò che devi sapere per costruire una strategia di backup che funzioni davvero.",
    difficulty: 'facile',
    thm: [
      { name: 'Security Principles', difficulty: 'facile', note: "La resilienza, di cui il backup è un pilastro, è uno dei principi di sicurezza fondamentali trattati in questa stanza." }
    ],
    quiz: [
      {
        q: "Cosa prevede esattamente la regola 3-2-1 per il backup?",
        options: [
          "3 backup al giorno, 2 amministratori, 1 password condivisa",
          "3 copie dei dati, su 2 tipi di media diversi, con 1 copia offsite",
          "3 ore di RTO massimo, 2 data center, 1 fornitore cloud",
          "3 anni di conservazione, 2 formati di file, 1 responsabile"
        ], correct: 1
      },
      {
        q: "Perché un backup collegato online (es. su una share di rete mappata) può non salvare da un ransomware moderno?",
        options: [
          "Perché i backup online sono sempre più lenti",
          "Perché il ransomware cerca attivamente share di rete e backup collegati, cifrandoli insieme al resto",
          "Perché i backup online costano di più",
          "Perché non sono compatibili con Windows"
        ], correct: 1
      },
      {
        q: "Qual è la differenza tra RPO e RTO?",
        options: [
          "Sono sinonimi dello stesso concetto",
          "RPO indica quanti dati puoi perdere (quanto indietro puoi tornare), RTO indica quanto tempo serve per tornare operativo",
          "RPO riguarda solo i backup cloud, RTO solo quelli locali",
          "RTO è un tipo di malware, RPO un tipo di backup"
        ], correct: 1
      }
    ]
  },
  {
    id: 'forensica-digitale-introduzione',
    title: 'Forensica Digitale: principi, metodologia e strumenti per il DFIR',
    excerpt: "La forensica digitale è la scienza di raccogliere e analizzare prove digitali mantenendo la loro integrità. Principi fondamentali, catena di custodia, analisi della memoria e del disco.",
    difficulty: 'facile',
    thm: [
      { name: 'Autopsy', difficulty: 'facile', note: "Il tool descritto nell'articolo per l'analisi del disco, messo in pratica direttamente in questa stanza." }
    ],
    quiz: [
      {
        q: "Cosa si intende per \"Order of Volatility\" in digital forensics?",
        options: [
          "L'ordine alfabetico in cui elencare le prove nel report",
          "Il principio di raccogliere prima le prove che scompaiono più velocemente, come la RAM, prima del disco",
          "L'ordine con cui i giudici esaminano le prove in tribunale",
          "Un algoritmo di compressione dei file immagine"
        ], correct: 1
      },
      {
        q: "Perché si lavora sempre su una copia forense e mai sull'originale?",
        options: [
          "Per fare prima, le copie sono più veloci da analizzare",
          "Per preservare l'integrità della prova originale, verificabile tramite hash",
          "Perché la legge lo richiede solo in alcuni paesi",
          "Perché gli strumenti forensi funzionano solo su copie"
        ], correct: 1
      },
      {
        q: "Cosa permette di fare Autopsy su un'immagine disco?",
        options: [
          "Solo cifrare il disco",
          "Navigare il filesystem inclusi i file cancellati, costruire una timeline e cercare parole chiave o hash noti",
          "Acquisire la memoria RAM del sistema",
          "Inviare automaticamente notifiche email"
        ], correct: 1
      }
    ]
  },
  {
    id: 'acquisizione-forense-catena-di-custodia',
    title: 'Acquisizione forense: imaging del disco e catena di custodia',
    excerpt: "Prima ancora di analizzare qualsiasi prova digitale bisogna acquisirla senza alterarla, e poter dimostrare che non è stata alterata. Ecco come si fa un'acquisizione forense difendibile, dal write blocker al primo hash.",
    difficulty: 'media',
    thm: [
      { name: 'Autopsy', difficulty: 'facile', note: "Una volta acquisita correttamente un'immagine disco, è con strumenti come Autopsy che inizia l'analisi vera e propria." }
    ],
    quiz: [
      {
        q: "A cosa serve un write blocker durante l'acquisizione di un disco?",
        options: [
          "A velocizzare la copia dei dati",
          "A consentire la lettura del disco originale impedendo fisicamente ogni scrittura verso di esso",
          "A cifrare automaticamente l'immagine acquisita",
          "A comprimere l'immagine per risparmiare spazio"
        ], correct: 1
      },
      {
        q: "Perché si calcola l'hash sia dell'originale sia dell'immagine acquisita?",
        options: [
          "Per generare automaticamente il report finale",
          "Per dimostrare matematicamente che l'immagine è una copia esatta, bit a bit, dell'originale",
          "Perché è richiesto solo per i dischi SSD",
          "Per velocizzare l'analisi successiva"
        ], correct: 1
      },
      {
        q: "Cosa succede alla catena di custodia se manca la documentazione di un passaggio di mano della prova, anche di una sola ora?",
        options: [
          "Non ha alcuna conseguenza pratica",
          "Può bastare a far dubitare dell'integrità dell'intera prova",
          "Viene automaticamente corretta dal sistema",
          "Riguarda solo la parte penale, mai quella civile"
        ], correct: 1
      }
    ]
  },
  {
    id: 'memory-forensics-volatility',
    title: 'Memory Forensics con Volatility: cosa vive nella RAM',
    excerpt: "Un malware fileless non tocca quasi mai il disco. Le sue tracce vivono solo in RAM, e spariscono al primo riavvio. La memory forensics, e Volatility in particolare, è come si cattura quella prova prima che svanisca.",
    difficulty: 'media',
    thm: [
      { name: 'Memory Forensics', difficulty: 'media', note: "Il tool e la metodologia descritti nell'articolo, applicati direttamente su un dump di memoria reale in questa stanza." }
    ],
    quiz: [
      {
        q: "Perché un malware fileless è particolarmente difficile da trovare analizzando solo il disco?",
        options: [
          "Perché non esiste davvero, è solo una leggenda",
          "Perché esiste solo come codice eseguibile in memoria, senza mai scrivere un file sul disco",
          "Perché cifra sempre l'intero disco",
          "Perché richiede sempre privilegi di amministratore"
        ], correct: 1
      },
      {
        q: "A cosa serve principalmente il plugin windows.malfind di Volatility?",
        options: [
          "A elencare tutti i file presenti sul disco",
          "A cercare regioni di memoria eseguibile sospette, tipiche di codice iniettato in un processo legittimo",
          "A calcolare l'hash dell'intero dump di memoria",
          "A modificare le impostazioni di rete del sistema analizzato"
        ], correct: 1
      },
      {
        q: "Perché windows.pstree è spesso più utile di windows.pslist in un'analisi di memory forensics?",
        options: [
          "Perché è più veloce da eseguire",
          "Perché mostra la gerarchia padre-figlio dei processi, rendendo più visibili catene sospette come Word che genera PowerShell",
          "Perché pslist non funziona più nella versione 3 di Volatility",
          "Perché pstree recupera anche le password in chiaro"
        ], correct: 1
      }
    ]
  },
  {
    id: 'timeline-analysis-artefatti-windows',
    title: 'Timeline Analysis: ricostruire cosa è successo su un sistema Windows',
    excerpt: "Windows registra molto più di quanto sembri: quando un file è stato eseguito, quali cartelle sono state aperte, quali dispositivi USB sono stati collegati. La timeline analysis mette tutti questi frammenti in ordine cronologico.",
    difficulty: 'media',
    thm: [
      { name: 'Windows Forensics 1', difficulty: 'media', note: "Molti degli artefatti Windows descritti nell'articolo, come Registro ed Event Log, si analizzano in pratica in questa stanza." }
    ],
    quiz: [
      {
        q: "Cosa registra tipicamente un file Prefetch in Windows?",
        options: [
          "Solo i file scaricati da internet",
          "Quale eseguibile è stato lanciato, il percorso completo, il numero di esecuzioni e i timestamp dell'ultima esecuzione",
          "Le password digitate dall'utente",
          "Solo gli errori di sistema"
        ], correct: 1
      },
      {
        q: "Cosa rappresentano i timestamp MACB associati a un file nel $MFT?",
        options: [
          "Quattro utenti diversi che hanno effettuato il login",
          "Modifica, Accesso, Creazione e modifica dei Metadati (change) di un file",
          "Quattro versioni diverse dello stesso file",
          "Un codice di errore del filesystem"
        ], correct: 1
      },
      {
        q: "A cosa serve uno strumento come Plaso/log2timeline?",
        options: [
          "A cifrare l'intero disco acquisito",
          "A unire decine di artefatti diversi (MFT, registro, Event Log e altri) in un'unica timeline ordinata cronologicamente",
          "A sostituire completamente il Registro di Windows",
          "A cancellare in modo sicuro le tracce di un'indagine"
        ], correct: 1
      }
    ]
  },
  {
    id: 'network-forensics-pcap',
    title: 'Network Forensics: ricostruire un attacco da un file pcap',
    excerpt: "Un IDS ha generato un alert tre settimane fa e nessuno l'ha guardato. Ora bisogna capire cosa è successo esaminando il traffico catturato allora. La network forensics è l'analisi del traffico quando l'attacco è già finito.",
    difficulty: 'media',
    thm: [],
    quiz: [
      {
        q: "Qual è la differenza principale tra Full Packet Capture (FPC) e NetFlow?",
        options: [
          "Sono esattamente la stessa cosa con nomi diversi",
          "FPC registra ogni pacchetto incluso il payload, NetFlow registra solo metadati delle connessioni",
          "NetFlow funziona solo su reti wireless",
          "FPC è gratuito, NetFlow è sempre a pagamento"
        ], correct: 1
      },
      {
        q: "In Wireshark, a cosa serve la funzione \"Follow TCP Stream\"?",
        options: [
          "A bloccare automaticamente la connessione sospetta",
          "A ricostruire l'intera conversazione tra client e server come un unico documento leggibile",
          "A cifrare il traffico catturato",
          "A eliminare i pacchetti duplicati dalla cattura"
        ], correct: 1
      },
      {
        q: "Quale pattern, descritto nell'articolo, è tipico di un'esfiltrazione di dati riuscita?",
        options: [
          "Traffico equilibrato tra entrata e uscita durante l'orario lavorativo",
          "Un grande volume di dati in uscita verso una singola destinazione, spesso in orari anomali",
          "Molte piccole richieste DNS distribuite durante il giorno",
          "Connessioni brevi e frequenti verso siti di aggiornamento software noti"
        ], correct: 1
      }
    ]
  },
  {
    id: 'report-forense-difendibile',
    title: 'Scrivere un report forense che regga in tribunale',
    excerpt: "L'analisi più rigorosa del mondo non serve a niente se il report che la racconta è ambiguo, pieno di gergo o costruisce conclusioni che i dati non sostengono davvero. Il report è il prodotto finale: è quello su cui verrai giudicato.",
    difficulty: 'facile',
    thm: [],
    quiz: [
      {
        q: "Perché l'executive summary di un report forense va scritto per ultimo ma va letto per primo?",
        options: [
          "È solo una convenzione senza motivo pratico",
          "Perché va scritto quando l'analisi è chiara, ma è la parte che la maggior parte dei destinatari leggerà per prima",
          "Perché deve contenere tutto l'output tecnico degli strumenti usati",
          "Perché è l'unica parte che un giudice può leggere per legge"
        ], correct: 1
      },
      {
        q: "Qual è la differenza tra scrivere \"l'attaccante ha rubato il database\" e \"la connessione mostra un trasferimento di 2,3 GB coerente con esfiltrazione, ma il contenuto non è recuperabile\"?",
        options: [
          "Nessuna, dicono la stessa cosa in modo diverso",
          "La seconda distingue chiaramente cosa i dati dimostrano da cosa non possono dimostrare, la prima presenta un'ipotesi come fatto certo",
          "La prima è più tecnica e quindi più corretta",
          "La seconda è troppo lunga per un report professionale"
        ], correct: 1
      },
      {
        q: "Cosa rischia un analista che testimonia in aula dicendo qualcosa di diverso da quanto scritto nel proprio report?",
        options: [
          "Nessuna conseguenza, il report e la testimonianza sono considerati separati",
          "Di minare la credibilità sia del report sia della propria testimonianza come expert witness",
          "Solo una sanzione amministrativa automatica",
          "Di dover ripetere gratuitamente l'intera analisi"
        ], correct: 1
      }
    ]
  }
];

const ROOM_BY_ID = new Map(ROOMS.map(r => [r.id, r]));

/* ─── MODULI: raggruppamento tematico delle stanze ───────────
   Ogni modulo si sblocca solo se il precedente è "superato":
   tutte le sue stanze completate E almeno il 90% dei circuiti
   massimi possibili del modulo (somma dei max di ogni stanza).
   ────────────────────────────────────────────────────────── */

const MODULES = [
  {
    id: 'reti-internet',
    title: 'Reti e Internet',
    subtitle: 'Come viaggiano i dati, dal cavo sottomarino al browser.',
    roomIds: ['come-funziona-internet', 'come-funziona-internet-v2', 'modello-osi', 'dns-il-telefono-di-internet', 'come-funziona-un-firewall']
  },
  {
    id: 'sicurezza-fondamentale',
    title: 'Sicurezza fondamentale',
    subtitle: 'I principi, i framework e la crittografia su cui si basa tutta la disciplina.',
    roomIds: ['modello-cia', 'cyber-kill-chain-mitre-attack', 'risk-management-analisi-rischio', 'crittografia-basi', 'pki-certificati-digitali', 'vulnerability-management']
  },
  {
    id: 'identita-accesso',
    title: 'Identità e Accesso',
    subtitle: 'Autenticazione, governance e infrastruttura: chi sei e cosa puoi fare.',
    roomIds: ['autenticazione-identita-digitale', 'come-funzionano-le-password', 'iam-rbac-privilegio-minimo', 'active-directory-ldap-fondamenti', 'biometria-autenticazione-fisica']
  },
  {
    id: 'fattore-umano',
    title: 'Fattore umano e Offensive Security',
    subtitle: "L'anello più debole di ogni sistema, la metodologia offensiva e le minacce reali.",
    roomIds: ['ingegneria-sociale', 'cose-il-penetration-testing', 'owasp-top-10', 'malware-tipologie-fondamentali', 'anatomia-attacco-ransomware', 'phishing-riconoscere-rispondere']
  },
  {
    id: 'ricognizione-web-hacking',
    title: 'Ricognizione e Web Hacking',
    subtitle: 'Dalla ricerca di informazioni pubbliche alle vulnerabilità web più diffuse: OSINT, Nmap, Burp, XSS e SQL Injection.',
    branch: 'red',
    roomIds: ['ricognizione-passiva-osint', 'ricognizione-attiva-nmap', 'google-dorking-recon-avanzato', 'burp-suite-basi', 'xss-cross-site-scripting', 'sql-injection-basi']
  },
  {
    id: 'sfruttamento-pratico',
    title: 'Sfruttamento pratico',
    subtitle: "Dalla teoria alla macchina reale: privesc, web, Active Directory e buffer overflow — con flag da TryHackMe per confermare il completamento.",
    branch: 'red',
    roomIds: ['privilege-escalation-linux', 'privilege-escalation-windows', 'web-shells-upload-bypass', 'active-directory-attacchi-base', 'buffer-overflow-basi']
  },
  {
    id: 'post-exploitation-red-team',
    title: 'Post-Exploitation e Red Team',
    subtitle: 'Cosa succede dopo il primo accesso: shell, cracking delle password, pivoting, persistenza e movimento laterale in Active Directory.',
    branch: 'red',
    roomIds: ['introduzione-metasploit', 'reverse-shell-bind-shell', 'password-cracking-hashcat-hydra', 'pivoting-tunneling-reti', 'post-exploitation-persistence-linux', 'lateral-movement-red-team']
  },
  {
    id: 'blue-team-monitoraggio-difesa',
    title: 'Blue Team: Monitoraggio e Difesa',
    subtitle: "Dall'altra parte della barricata: leggere il traffico, rilevare intrusioni, cacciare le minacce e rispondere quando l'incidente è reale.",
    branch: 'blue',
    roomIds: ['wireshark-analisi-traffico', 'ids-ips-suricata', 'siem-blue-team', 'threat-hunting-intro', 'incident-response-processo', 'analisi-malware-base']
  },
  {
    id: 'blue-hardening-architettura',
    title: 'Blue Team: Hardening e Architettura difensiva',
    subtitle: "Irrobustire Linux e Windows, segmentare la rete e ripensare l'architettura di sicurezza da zero con Zero Trust ed EDR.",
    branch: 'blue',
    roomIds: ['cose-il-blue-team', 'hardening-linux', 'hardening-windows', 'network-segmentation-vlan-dmz', 'zero-trust-architettura', 'edr-endpoint-detection-response']
  },
  {
    id: 'blue-intelligence-risposta',
    title: 'Blue Team: Intelligence e Risposta',
    subtitle: 'Dalla giornata di un SOC analyst alla threat intelligence, fino a cloud, email e backup: gli altri fronti della difesa quotidiana.',
    branch: 'blue',
    roomIds: ['soc-analyst-giornata-tipo', 'analisi-log-windows-event-id', 'threat-intelligence-principianti', 'osint-difensivo-monitoraggio', 'honeypot-deception-technology', 'cloud-security-aws-misconfigurazioni', 'email-security-spf-dkim-dmarc', 'backup-recovery-strategia-3-2-1']
  },
  {
    id: 'dfir-fondamenti',
    title: 'DFIR: Fondamenti di Digital Forensics',
    subtitle: "Dall'acquisizione della prova al report finale: come si raccoglie, analizza e racconta un'evidenza digitale in modo che regga.",
    branch: 'dfir',
    roomIds: ['forensica-digitale-introduzione', 'acquisizione-forense-catena-di-custodia', 'memory-forensics-volatility', 'timeline-analysis-artefatti-windows', 'network-forensics-pcap', 'report-forense-difendibile']
  }
];

/* ─── RAMI ───────────────────────────────────────────────────
   Dal modulo 4 (tronco comune) in poi il percorso si biforca.
   Un modulo senza campo "branch" appartiene al tronco: sblocco
   lineare come sempre. Un modulo con "branch" appartiene invece
   a uno dei rami sotto: tutti i rami si sbloccano insieme al
   completamento del tronco (nessun ramo è più "principale" di
   un altro), e dentro ogni ramo i moduli restano lineari tra
   loro. Un ramo senza moduli (dfir, per ora) è "in arrivo": ha
   comunque una sua card nel bivio, ma senza stanze da aprire. ── */
const BRANCHES = [
  { id: 'red',  title: 'Red Team',  subtitle: 'Offensiva: exploitation, post-exploitation, movimento laterale.', icon: 'radar',    accent: 'var(--c-red)' },
  { id: 'blue', title: 'Blue Team', subtitle: 'Difesa: monitoraggio, detection, threat hunting, incident response.', icon: 'terminal', accent: 'var(--c-blue)' },
  { id: 'dfir', title: 'DFIR', subtitle: 'Digital Forensics & Incident Response: acquisizione, analisi, catena di custodia.', icon: 'fingerprint', accent: 'var(--c-news)' }
];

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
    <div class="fond-branch-head" style="--branch-accent:${branch.accent}">
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

  const branchesHtml = BRANCHES.map(branch => {
    const idxs = branchIndices(branch.id);
    const nodesHtml = idxs.length ? idxs.map(renderModuleNodeHtml).join('') : renderBranchPlaceholderHtml(branch);
    const focused = fondState.focusBranch === branch.id;
    return `
      <div class="fond-branch${focused ? ' fond-branch-focused' : ''}${idxs.length ? '' : ' fond-branch-empty'}" data-branch="${branch.id}">
        ${renderBranchHeadHtml(branch, idxs)}
        <div class="fond-path fond-path-branch" role="list" aria-label="Moduli del ramo ${esc(branch.title)}">
          ${nodesHtml}
        </div>
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
  BRANCHES.forEach(branch => {
    const idxs = branchIndices(branch.id);
    if (!idxs.length) {
      edges.push({ a: lastTrunk, b: `placeholder-${branch.id}`, state: 'preview' });
      return;
    }
    const forkState = !trunkComplete() ? 'idle' : (moduleStats(idxs[0]).passed ? 'done' : 'active');
    edges.push({ a: lastTrunk, b: idxs[0], state: forkState });
    for (let k = 0; k < idxs.length - 1; k++) {
      edges.push({ a: idxs[k], b: idxs[k + 1], state: edgeState(idxs[k], idxs[k + 1]) });
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
  document.getElementById('fondBackModules').addEventListener('click', renderModules);

  app.querySelectorAll('.fond-node:not(.fond-node-locked)').forEach(node => {
    const trigger = () => {
      const ri = mod.roomIds.indexOf(node.dataset.roomId);
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

    const segPaths = [];
    currentEdges.forEach(({ a, b, state }) => {
      const c1 = centerByKey.get(String(a)), c2 = centerByKey.get(String(b));
      if (!c1 || !c2) return;
      const [x1, y1] = c1;
      const [x2, y2] = c2;
      const ymid = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${ymid}, ${x2} ${ymid}, ${x2} ${y2}`;

      const path = svgEl('path', { d, class: `fond-trace fond-trace-${state}` });
      svg.appendChild(path);
      segPaths.push({ path, state });

      [[x1, y1], [x2, y2]].forEach(([cx, cy]) => {
        svg.appendChild(svgEl('circle', { cx, cy, r: 4, class: `fond-via fond-via-${state}` }));
        svg.appendChild(svgEl('circle', { cx, cy, r: 1.6, class: 'fond-via-hole' }));
      });

      if (state === 'active' && !reduced) {
        const dot = svgEl('circle', { r: 4.5, class: 'fond-flow-dot' });
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
    document.getElementById('fondBackMap').addEventListener('click', () => renderModuleMap(moduleIndex));
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
  document.getElementById('fondBackMap').addEventListener('click', () => renderModuleMap(moduleIndex));

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
  document.getElementById('fondGoModule').addEventListener('click', () => renderModuleMap(moduleIndex));
  const nextBtn = document.getElementById('fondGoNext');
  if (nextBtn) nextBtn.addEventListener('click', () => renderRoom(moduleIndex, roomIndexInModule + 1));
}

/* ─── INIT ───────────────────────────────────────────────── */

function renderApp() {
  if (!fondState) {
    renderGate();
  } else {
    renderModules();
  }
}

document.addEventListener('DOMContentLoaded', renderApp);
