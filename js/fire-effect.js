/* =========================================================
   fire-effect.js  —  pasta-cod3.github.io
   Effetto fuoco WebGL (shader originale di @kuvkar, via PixiJS)
   adattato per bruciare dentro il riquadro di un ramo scelto nel
   percorso Fondamentali, invece che a schermo intero. La texture
   di rumore usata dallo shader viene generata localmente (canvas
   con pixel casuali) invece di dipendere da un asset esterno.
   Il colore (rosso/blu/viola) si ottiene con un filtro CSS
   hue-rotate sul canvas, non riscrivendo lo shader: vedi le classi
   .fond-branch-fire-canvas-* in style.css.
   Richiede PixiJS (window.PIXI) caricato prima di questo file;
   se assente, o se l'utente preferisce animazioni ridotte, resta
   inerte e chi lo usa vede semplicemente nessun fuoco.
   ========================================================= */
'use strict';

const FOND_FIRE_FRAG = `
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform sampler2D mapSampler;
  uniform vec4 filterArea;
  uniform vec2 dimensions;
  uniform float time;
  uniform vec2 mouseUv;

  float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
  }

  mat2 rotz(float angle) {
    mat2 m;
    m[0][0] = cos(angle); m[0][1] = -sin(angle);
    m[1][0] = sin(angle); m[1][1] = cos(angle);
    return m;
  }

  float fbm(vec2 uv) {
    float n = (texture2D(mapSampler, uv).r - 0.5) * 0.5;
    n += (texture2D(mapSampler, uv * 2.0).r - 0.5) * 0.5 * 0.5;
    n += (texture2D(mapSampler, uv * 3.0).r - 0.5) * 0.5 * 0.5 * 0.5;
    return n + 0.5;
  }

  void main() {
    vec2 uv = (vTextureCoord * filterArea.xy) / dimensions;
    uv.y = 1.0 - uv.y;

    vec2 _uv = uv;
    uv -= vec2(0.5);
    uv.y /= dimensions.x / dimensions.y;

    vec2 centerUV = uv;

    // Distorsione verso l'esterno intorno al cursore: il fuoco si
    // scosta fluidamente al passaggio del mouse (solo desktop, il
    // valore resta (-1,-1) quando non c'è un mouse attivo). Il
    // fattore di smorzamento (lerp) è applicato lato JS per un
    // movimento morbido invece di uno scatto secco.
    if (mouseUv.x >= 0.0) {
      vec2 mUv = mouseUv - vec2(0.5);
      mUv.y /= dimensions.x / dimensions.y;
      vec2 toCursor = uv - mUv;
      float d = length(toCursor) + 0.0001;
      float push = smoothstep(0.55, 0.0, d) * 0.4;
      uv += normalize(toCursor) * push;
    }

    float variationH = fbm(vec2(time * 0.3)) * 1.1;
    vec2 offset = vec2(0.0, -time * 0.05);
    float f = fbm(uv * 0.1 + offset);
    float l = max(0.1, length(uv));
    uv += rotz(((f - 0.5) / l) * smoothstep(-0.2, 0.4, _uv.y) * 0.45) * uv;

    float flame = 1.3 - length(uv.x) * 5.0;

    float blueflame = pow(flame * 0.9, 15.0);
    blueflame *= smoothstep(0.2, -1.0, _uv.y);
    blueflame /= abs(uv.x * 2.0);
    blueflame = clamp(blueflame, 0.0, 1.0);

    flame *= smoothstep(1.0, variationH * 0.5, _uv.y);
    flame = clamp(flame, 0.0, 1.0);
    flame = pow(flame, 3.0);
    flame /= smoothstep(1.1, -0.1, _uv.y);

    vec4 col = mix(vec4(1.0, 1.0, 0.0, 0.0), vec4(1.0, 1.0, 0.6, 0.0), flame);
    col = mix(vec4(1.0, 0.0, 0.0, 0.0), col, smoothstep(0.0, 1.6, flame));
    gl_FragColor = col;

    vec4 bluecolor = mix(vec4(0.0, 0.0, 1.0, 0.0), gl_FragColor, 0.95);
    gl_FragColor = mix(gl_FragColor, bluecolor, blueflame);

    gl_FragColor *= flame;
    gl_FragColor.a = flame;

    float haloSize = 0.5;
    float centerL = 1.0 - (length(centerUV + vec2(0.0, 0.1)) / haloSize);
    vec4 halo = vec4(0.8, 0.3, 0.3, 0.0) * 1.0 * fbm(vec2(time * 0.035)) * centerL + 0.02;
    vec4 finalCol = mix(halo, gl_FragColor, gl_FragColor.a);
    gl_FragColor = finalCol;

    gl_FragColor *= mix(rand(uv) + rand(uv * 0.45), 1.0, 0.9);
    gl_FragColor = clamp(gl_FragColor, 0.0, 1.0);
  }
`;

const FondFire = (() => {
  let app = null;
  let filter = null;
  let noiseTexture = null;

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function buildNoiseTexture(size) {
    size = size || 256;
    const c = document.createElement('canvas');
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.floor(Math.random() * 256);
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return PIXI.Texture.from(c);
  }

  class FlameFilter extends PIXI.Filter {
    constructor(texture, width, height) {
      super(null, FOND_FIRE_FRAG);
      this.uniforms.dimensions = new Float32Array([width, height]);
      this.uniforms.mouseUv = new Float32Array([-1, -1]);
      texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      this.uniforms.mapSampler = texture;
      this.time = 0;
      this.targetMouse = [-1, -1];
    }
    apply(filterManager, input, output, clear) {
      this.uniforms.time = this.time;
      // Lerp verso il target: movimento morbido invece di uno scatto
      // secco a ogni pixel di spostamento del mouse.
      const cur = this.uniforms.mouseUv;
      const tgt = this.targetMouse;
      cur[0] += (tgt[0] - cur[0]) * 0.12;
      cur[1] += (tgt[1] - cur[1]) * 0.12;
      filterManager.applyFilter(this, input, output, clear);
    }
  }

  function start(canvas, width, height) {
    stop();
    if (!window.PIXI || reducedMotion() || !width || !height) return false;
    try {
      app = new PIXI.Application({ view: canvas, width, height, backgroundAlpha: 0, antialias: false });
      if (!noiseTexture) noiseTexture = buildNoiseTexture();
      filter = new FlameFilter(noiseTexture, width, height);
      app.stage.filterArea = app.screen;
      app.stage.filters = [filter];
      app.ticker.add(delta => { filter.time += 0.1 * delta; });
      return true;
    } catch (e) {
      stop();
      return false;
    }
  }

  /* nx, ny in 0..1 (spazio del canvas, come coordinate DOM normali:
     0,0 in alto a sinistra). Passare -1,-1 per disattivare l'effetto
     (mouse uscito dal riquadro). */
  function setMouse(nx, ny) {
    if (filter) { filter.targetMouse[0] = nx; filter.targetMouse[1] = ny; }
  }

  function resize(width, height) {
    if (app && width && height) {
      app.renderer.resize(width, height);
      if (filter) { filter.uniforms.dimensions[0] = width; filter.uniforms.dimensions[1] = height; }
    }
  }

  function stop() {
    if (app) {
      try { app.destroy(true, { children: true, texture: false, baseTexture: false }); } catch (e) { /* noop */ }
      app = null;
    }
    filter = null;
  }

  return { start, resize, stop, setMouse };
})();
