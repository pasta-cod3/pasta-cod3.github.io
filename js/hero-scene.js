/* =========================================================
   hero-scene.js — pasta-cod3.github.io
   Scena WebGL (Three.js) riusabile: una topologia di nodi/archi
   astratta — non un oggetto figurativo, non il cliché "matrix" —
   coerente col tema cybersecurity (rete, telemetria, superficie
   di attacco). Reagisce al cursore con:
   - un parallax leggero su tutto il gruppo;
   - una "rottura" locale — i nodi/archi che il cursore incrocia
     si scompongono e si respingono, poi tornano in posizione.

   Esporta createNetworkScene(options) così la stessa tecnica può
   disegnare "sistemi" diversi in più pagine (ogni hero il suo,
   con densità di nodi calibrata sulla propria altezza) senza
   duplicare codice. In fondo al file, l'istanza di default per
   la hero della home.

   Se WebGL non è disponibile, se l'utente preferisce animazioni
   ridotte o siamo su viewport stretto, non parte: il video/canvas
   di sfondo già presenti restano l'unica ambientazione, senza che
   nulla si rompa.
   ========================================================= */

export async function createNetworkScene(options) {
  const {
    canvasId,
    containerSelector,
    nodeCount = 42,
    fillFactor = 0.99,  // quanto della larghezza/altezza visibile riempire (evita vuoti ai lati)
    depthFactor = 0.55, // spessore su Z rispetto alla metà-altezza, per dare volume senza clipping
    cameraZ = 17,
    minWidth = 900, // sotto questa larghezza il modulo non parte
    accentColor = null, // hex (es. 0xff3060): tinge la rete sull'accento della pagina/categoria
  } = options;

  const canvas = document.getElementById(canvasId);
  const containerEl = document.querySelector(containerSelector);
  if (!canvas || !containerEl) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia(`(max-width: ${minWidth}px)`).matches) return;

  // Import dinamico DOPO le guardie sopra: three.module.min.js pesa 656KB,
  // prima veniva scaricato e parsato sempre (import statico in cima al
  // modulo) anche su mobile, dove minWidth fa uscire la funzione subito
  // senza mai usarlo. Così chi non vedrà mai la scena non paga il costo.
  const THREE = await import('./vendor/three.module.min.js');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: true, powerPreference: 'low-power',
    });
  } catch (e) {
    return; // WebGL non disponibile: nessun fallback rumoroso, si esce e basta
  }

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0, cameraZ);

  /* ── Spread calcolato dal frustum reale, non da numeri fissi ──
     Container larghi e bassi (hero panoramiche) lasciavano ai lati
     grandi vuoti perché lo spread era pensato per un riquadro quasi
     quadrato. Si calcola invece quanto è visibile a z=0 data la FOV
     verticale e l'aspect ratio reale del contenitore, e si riempie
     quello spazio (fillFactor), invece di indovinare un numero. */
  const rect0 = containerEl.getBoundingClientRect();
  const aspect0 = Math.max(0.1, rect0.width / Math.max(1, rect0.height));
  const halfHeightAtOrigin = Math.tan((camera.fov * Math.PI / 180) / 2) * cameraZ;
  const halfWidthAtOrigin  = halfHeightAtOrigin * aspect0;
  const spread = {
    x: halfWidthAtOrigin  * fillFactor,
    y: halfHeightAtOrigin * fillFactor,
    z: halfHeightAtOrigin * depthFactor,
  };
  // La distanza di connessione segue lo stesso riempimento: senza
  // questo, uno spread più largo lascia gli archi radi ai bordi
  // ("linee spezzate") perché la soglia restava tarata su un volume
  // più piccolo. Moltiplicatore alto apposta: geometria fitta, con
  // più intrecci fra i nodi ("giochi di geometrie").
  const edgeDist = ((spread.x + spread.y) / 2) * 0.76;

  /* ── Topologia: nodi sparsi + archi tra i nodi vicini ─────────
     Le posizioni "base" restano fisse; ogni nodo ha anche uno
     scostamento (offset) che il cursore può spingere e che torna
     a zero da solo — è quello scostamento, applicato ai vertici
     di punti e linee a ogni frame, a dare l'effetto di rottura.

     "Scoperta": solo una fascia superiore è visibile da subito. Il
     resto della rete resta nascosto (parcheggiato lontano dietro la
     camera) finché il cursore non scende fin lì — a quel punto si
     sblocca per sempre e anima verso la sua posizione reale, come
     se la rete si espandesse seguendo l'esplorazione. */
  const NODE_COUNT = nodeCount;
  const basePositions = [];
  const offsets = [];
  const unlocked = [];
  const revealThreshold = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const pos = new THREE.Vector3(
      (Math.random() * 2 - 1) * spread.x,
      (Math.random() * 2 - 1) * spread.y,
      (Math.random() * 2 - 1) * spread.z
    );
    basePositions.push(pos);

    // yNorm: 0 in cima allo spread, 1 in fondo.
    const yNorm = 1 - (pos.y + spread.y) / (2 * spread.y || 1);
    const threshold = Math.max(0, yNorm - 0.3 + Math.random() * 0.15);
    revealThreshold.push(threshold);

    const startsUnlocked = threshold <= 0.02;
    unlocked.push(startsUnlocked);
    offsets.push(
      startsUnlocked
        ? new THREE.Vector3()
        : new THREE.Vector3(0, -Math.abs(spread.y) * 1.4, -cameraZ * 3) // parcheggiato fuori dal frustum
    );
  }

  const pointsPosArr = new Float32Array(NODE_COUNT * 3);
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsPosArr, 3).setUsage(THREE.DynamicDrawUsage));
  const pointsMat = new THREE.PointsMaterial({
    size: 0.15, sizeAttenuation: true, transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);

  const edgeIndex = []; // coppie [i, j] di indici in basePositions
  for (let i = 0; i < basePositions.length; i++) {
    for (let j = i + 1; j < basePositions.length; j++) {
      if (basePositions[i].distanceTo(basePositions[j]) < edgeDist) {
        edgeIndex.push(i, j);
      }
    }
  }
  const linePosArr = new Float32Array(edgeIndex.length * 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePosArr, 3).setUsage(THREE.DynamicDrawUsage));
  const lineMat = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false });
  const lines = new THREE.LineSegments(lineGeo, lineMat);

  const group = new THREE.Group();
  group.add(points, lines);
  scene.add(group);

  function syncGeometry() {
    for (let i = 0; i < NODE_COUNT; i++) {
      const p = basePositions[i], o = offsets[i];
      pointsPosArr[i * 3]     = p.x + o.x;
      pointsPosArr[i * 3 + 1] = p.y + o.y;
      pointsPosArr[i * 3 + 2] = p.z + o.z;
    }
    pointsGeo.attributes.position.needsUpdate = true;

    for (let e = 0; e < edgeIndex.length; e += 2) {
      const a = edgeIndex[e], b = edgeIndex[e + 1];
      const pa = basePositions[a], oa = offsets[a];
      const pb = basePositions[b], ob = offsets[b];
      const base = e * 3;
      linePosArr[base]     = pa.x + oa.x;
      linePosArr[base + 1] = pa.y + oa.y;
      linePosArr[base + 2] = pa.z + oa.z;
      if (unlocked[a] && unlocked[b]) {
        // entrambi scoperti: arco vero
        linePosArr[base + 3] = pb.x + ob.x;
        linePosArr[base + 4] = pb.y + ob.y;
        linePosArr[base + 5] = pb.z + ob.z;
      } else {
        // uno dei due è ancora nascosto: arco degenere (lunghezza zero,
        // invisibile) invece di una riga tesa verso il punto parcheggiato
        linePosArr[base + 3] = linePosArr[base];
        linePosArr[base + 4] = linePosArr[base + 1];
        linePosArr[base + 5] = linePosArr[base + 2];
      }
    }
    lineGeo.attributes.position.needsUpdate = true;
  }
  syncGeometry();

  /* ── Colori per tema — il blending additivo che fa "brillare" i
     nodi su sfondo scuro li rende quasi invisibili su sfondo
     chiaro (si sommano al bianco invece di risaltarci sopra):
     su tema chiaro si passa a un blu pieno, senza additive. ────── */
  function applyThemeColors() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    if (light) {
      // Con un accento personalizzato si scurisce per restare leggibile
      // su sfondo chiaro (stesso motivo per cui qui non si usa additive).
      const pointCol = accentColor !== null ? new THREE.Color(accentColor).multiplyScalar(0.62) : new THREE.Color(0x0a5a96);
      const lineCol  = accentColor !== null ? new THREE.Color(accentColor).multiplyScalar(0.78) : new THREE.Color(0x1c6fae);
      pointsMat.color.copy(pointCol);
      pointsMat.opacity = 0.68;
      pointsMat.blending = THREE.NormalBlending;
      lineMat.color.copy(lineCol);
      lineMat.opacity = 0.32;
      lineMat.blending = THREE.NormalBlending;
    } else {
      const pointCol = accentColor !== null ? new THREE.Color(accentColor) : new THREE.Color(0x5fd8ff);
      const lineCol  = accentColor !== null ? new THREE.Color(accentColor) : new THREE.Color(0x2090ff);
      pointsMat.color.copy(pointCol);
      pointsMat.opacity = 0.8;
      pointsMat.blending = THREE.AdditiveBlending;
      lineMat.color.copy(lineCol);
      lineMat.opacity = 0.15;
      lineMat.blending = THREE.AdditiveBlending;
    }
  }
  applyThemeColors();
  new MutationObserver(applyThemeColors)
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ── Dimensionamento sul box del contenitore, non sull'intera
     finestra. Il sito applica un CSS zoom non standard su <html>
     (vedi style.css): un canvas dimensionato solo via
     renderer.setSize(w,h,false) — senza un width/height CSS
     esplicito — finisce con un box di layout più grande del
     previsto (scalato dello stesso fattore di zoom), e trabocca
     fuori dal contenitore. Si fissa quindi la dimensione CSS al
     100% del contenitore (che segue containerEl in modo
     affidabile) e si usa renderer.setSize solo per il buffer di
     disegno interno. */
  function fitToContainer() {
    const r = containerEl.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  fitToContainer();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitToContainer, 150);
  });

  /* ── Cursore: parallax d'insieme + "rottura" locale ────────────
     targetX/Y guidano la rotazione leggera del gruppo (parallax).
     mouseNDC è la stessa posizione in coordinate normalizzate per
     il raycaster, usato per capire quali nodi il cursore sta
     sfiorando in profondità e spingerli via dalla propria retta. */
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  const mouseNDC = new THREE.Vector2(0, 0);
  let hasPointer = false;
  let mouseYNorm = 0; // 0 in cima al contenitore, 1 in fondo — guida lo sblocco progressivo
  let lastClientY = null; // posizione reale del mouse in viewport, per ricalcolare allo scroll

  window.addEventListener('mousemove', e => {
    lastClientY = e.clientY;
    const r = containerEl.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    targetX = nx; targetY = ny;
    mouseNDC.set(nx, -ny);
    hasPointer = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  }, { passive: true });
  containerEl.addEventListener('mouseleave', () => { hasPointer = false; }, { passive: true });

  // Lo scroll della pagina sposta il contenitore sotto un mouse che magari
  // non si muove affatto: si ricalcola quindi la posizione relativa ad ogni
  // frame (vedi tick) usando l'ultima Y nota del mouse, non solo al mousemove.
  function updateRevealFromScroll() {
    if (lastClientY === null) return;
    const r = containerEl.getBoundingClientRect();
    if (r.height <= 0) return;
    mouseYNorm = Math.max(mouseYNorm, (lastClientY - r.top) / r.height);
  }

  const raycaster = new THREE.Raycaster();
  const HIT_RADIUS = 1.65;   // unità-scena entro cui un nodo viene "colpito"
  const PUSH_STRENGTH = 1.5; // spostamento massimo al centro del raggio
  const worldPos = new THREE.Vector3();
  const closest  = new THREE.Vector3();
  const pushDir  = new THREE.Vector3();
  const invQuat  = new THREE.Quaternion();

  function updateHitTest() {
    if (!hasPointer) return;
    raycaster.setFromCamera(mouseNDC, camera);
    group.updateMatrixWorld(true);
    invQuat.copy(group.quaternion).invert();

    for (let i = 0; i < NODE_COUNT; i++) {
      worldPos.copy(basePositions[i]).add(offsets[i]).applyMatrix4(group.matrixWorld);
      raycaster.ray.closestPointToPoint(worldPos, closest);
      const dist = worldPos.distanceTo(closest);
      if (dist < HIT_RADIUS) {
        pushDir.copy(worldPos).sub(closest);
        if (pushDir.lengthSq() < 1e-6) pushDir.set(0.001, 0.001, 0.001);
        pushDir.normalize().applyQuaternion(invQuat);
        const mag = PUSH_STRENGTH * (1 - dist / HIT_RADIUS);
        offsets[i].lerp(pushDir.multiplyScalar(mag), 0.45);
      }
    }
  }

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  let readyShown = false;
  let clock = 0;

  function tick() {
    if (!running) return;
    clock += 0.01;
    curX += (targetX - curX) * 0.03;
    curY += (targetY - curY) * 0.03;
    group.rotation.y = curX * 0.35 + clock * 0.15;
    group.rotation.x = -curY * 0.2;

    updateHitTest();
    updateRevealFromScroll();
    // Sblocco progressivo: una volta rivelato un nodo resta tale (mouseYNorm
    // non torna mai indietro). Il decadimento dell'offset — sia il ritorno
    // elastico dalla "rottura" sia l'animazione di comparsa dei nodi appena
    // sbloccati — si applica solo ai nodi già scoperti: quelli ancora
    // nascosti restano fermi al loro punto di parcheggio.
    for (let i = 0; i < NODE_COUNT; i++) {
      if (!unlocked[i] && mouseYNorm >= revealThreshold[i]) unlocked[i] = true;
      if (unlocked[i]) offsets[i].multiplyScalar(0.9);
    }
    syncGeometry();

    const baseOpacity = pointsMat.blending === THREE.AdditiveBlending ? 0.62 : 0.68;
    pointsMat.opacity = baseOpacity + Math.sin(clock * 1.4) * 0.14;
    renderer.render(scene, camera);
    if (!readyShown) {
      readyShown = true;
      canvas.classList.add('is-ready');
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── Istanza di default: hero della home ─────────────────────── */
if (document.getElementById('heroScene')) {
  createNetworkScene({
    canvasId: 'heroScene',
    containerSelector: '.hero.page-hero',
    nodeCount: 59,
    cameraZ: 17,
  });
}
