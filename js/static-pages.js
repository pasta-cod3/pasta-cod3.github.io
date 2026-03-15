/* ═══════════════════════════════════════════════════════════
   PASTA-COD3 — static-pages.js
   Shared logic for about.html and contatti.html
   ═══════════════════════════════════════════════════════════ */

/* ── Theme restore ───────────────────────────────────────── */
(function(){
  const saved = localStorage.getItem('theme');
  if(saved){
    document.documentElement.setAttribute('data-theme', saved);
    const btn = document.getElementById('themeToggle');
    if(btn) btn.textContent = saved === 'dark' ? '◐ LIGHT' : '◑ DARK';
  }
})();

document.getElementById('themeToggle').addEventListener('click', () => {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.getElementById('themeToggle').textContent = isDark ? '◑ DARK' : '◐ LIGHT';
});

/* ── Mobile hamburger ────────────────────────────────────── */
(function(){
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('navDrawer');
  const overlay   = document.getElementById('navOverlay');
  if(!hamburger || !drawer || !overlay) return;

  function open(){
    drawer.classList.add('open');
    drawer.style.display = 'flex';
    overlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if(!drawer.classList.contains('open')) drawer.style.display='none'; }, 350);
  }

  hamburger.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  drawer.querySelectorAll('.nav-drawer-link').forEach(l => l.addEventListener('click', close));
})();

/* ── Space constellation (same as main.js) ───────────────── */
(function initConstellation(){
  const canvas = document.getElementById('spaceCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const mouse = { x:-9999, y:-9999 };
  const MOUSE_R = 140;

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x=-9999; mouse.y=-9999; });

  function resize(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function palette(){
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark ? [
      {r:0,g:255,b:180}, {r:0,g:170,b:255}, {r:255,g:51,b:102},
      {r:200,g:100,b:255}, {r:240,g:165,b:0}, {r:180,g:220,b:255}
    ] : [
      {r:56,g:189,b:248}, {r:129,g:140,b:248}, {r:251,g:113,b:133},
      {r:167,g:139,b:250}, {r:251,g:191,b:36}, {r:200,g:230,b:255}
    ];
  }
  function randColor(p){ return p[Math.floor(Math.random()*p.length)]; }
  function rgba(c,a){ return `rgba(${c.r},${c.g},${c.b},${a})`; }

  const TYPES = {STAR:0,MOON:1,GALAXY:2,NODE:3};
  let pal = palette();

  function makeNode(){
    const roll = Math.random();
    const type = roll<.06?TYPES.GALAXY : roll<.14?TYPES.MOON : roll<.45?TYPES.STAR : TYPES.NODE;
    return {
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      r: type===TYPES.GALAXY?18+Math.random()*14 : type===TYPES.MOON?4+Math.random()*4 : type===TYPES.STAR?1+Math.random()*1.5 : 1.5+Math.random()*1.5,
      color:randColor(pal), type, phase:Math.random()*Math.PI*2, speed:.5+Math.random()*.8,
      arms:type===TYPES.GALAXY?2+Math.floor(Math.random()*3):0,
      armLen:type===TYPES.GALAXY?30+Math.random()*20:0, twinkle:Math.random()<.4
    };
  }

  const NUM = 130;
  let nodes = Array.from({length:NUM}, makeNode);
  let frame = 0;

  function drawStar(n,alpha,glow){
    const s=n.r*(1+glow*.4);
    ctx.save(); ctx.translate(n.x,n.y);
    ctx.shadowBlur=glow?12+glow*10:4; ctx.shadowColor=rgba(n.color,.8);
    ctx.fillStyle=rgba(n.color,alpha);
    ctx.beginPath();
    ctx.moveTo(0,-s*2.2); ctx.lineTo(s*.35,-s*.35); ctx.lineTo(s*2.2,0); ctx.lineTo(s*.35,s*.35);
    ctx.lineTo(0,s*2.2); ctx.lineTo(-s*.35,s*.35); ctx.lineTo(-s*2.2,0); ctx.lineTo(-s*.35,-s*.35);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(0,0,s*.6,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function drawMoon(n,alpha,glow){
    ctx.save(); ctx.translate(n.x,n.y); ctx.rotate(n.phase*.2);
    ctx.shadowBlur=glow?15+glow*12:6; ctx.shadowColor=rgba(n.color,.7);
    ctx.beginPath(); ctx.arc(0,0,n.r,0,Math.PI*2);
    ctx.fillStyle=rgba(n.color,alpha*.9); ctx.fill();
    const bgColor=document.documentElement.getAttribute('data-theme')==='dark'?'rgba(2,4,8,1)':'rgba(10,14,23,1)';
    ctx.beginPath(); ctx.arc(n.r*.45,0,n.r*.85,0,Math.PI*2);
    ctx.fillStyle=bgColor; ctx.fill(); ctx.restore();
  }

  function drawGalaxy(n,alpha,glow){
    ctx.save(); ctx.translate(n.x,n.y); ctx.rotate(frame*.002*n.speed);
    ctx.shadowBlur=glow?20+glow*15:10; ctx.shadowColor=rgba(n.color,.5);
    for(let arm=0;arm<n.arms;arm++){
      const aa=(Math.PI*2/n.arms)*arm;
      for(let p=0;p<28;p++){
        const t=p/27, angle=aa+t*Math.PI*2.2, dist=t*n.armLen;
        ctx.beginPath(); ctx.arc(Math.cos(angle)*dist,Math.sin(angle)*dist*.5,(1-t)*1.8+.3,0,Math.PI*2);
        ctx.fillStyle=rgba(n.color,(1-t)*alpha*.7); ctx.fill();
      }
    }
    const grad=ctx.createRadialGradient(0,0,0,0,0,n.r*.6);
    grad.addColorStop(0,rgba(n.color,alpha*.9)); grad.addColorStop(.5,rgba(n.color,alpha*.4)); grad.addColorStop(1,rgba(n.color,0));
    ctx.beginPath(); ctx.arc(0,0,n.r*.6,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill(); ctx.restore();
  }

  function drawNode(n,alpha,glow){
    ctx.beginPath(); ctx.shadowBlur=glow?8+glow*8:0; ctx.shadowColor=rgba(n.color,.8);
    ctx.fillStyle=rgba(n.color,alpha); ctx.arc(n.x,n.y,n.r+(glow*.5),0,Math.PI*2); ctx.fill();
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height); ctx.shadowBlur=0;
    for(let i=0;i<nodes.length;i++){
      const a=nodes[i]; if(a.type===TYPES.GALAXY) continue;
      for(let j=i+1;j<nodes.length;j++){
        const b=nodes[j]; if(b.type===TYPES.GALAXY) continue;
        const dx=a.x-b.x, dy=a.y-b.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<150){
          const mx=(a.x+b.x)/2-mouse.x, my=(a.y+b.y)/2-mouse.y;
          const md=Math.sqrt(mx*mx+my*my);
          const boost=md<MOUSE_R?(1-md/MOUSE_R)*.5:0;
          ctx.beginPath(); ctx.strokeStyle=rgba(a.color,(1-dist/150)*.25+boost*.3);
          ctx.lineWidth=.5+(boost*1.2); ctx.shadowBlur=boost>0?boost*8:0; ctx.shadowColor=rgba(a.color,.4);
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    ctx.shadowBlur=0;
    nodes.forEach(n=>{
      const dx=n.x-mouse.x, dy=n.y-mouse.y, md=Math.sqrt(dx*dx+dy*dy);
      const near=md<MOUSE_R, glow=near?(1-md/MOUSE_R):0;
      const ta=n.twinkle?.4+Math.sin(frame*.05*n.speed+n.phase)*.35:.65;
      const alpha=near?Math.min(ta+glow*.4,1):ta;
      switch(n.type){
        case TYPES.STAR:   drawStar(n,alpha,glow);   break;
        case TYPES.MOON:   drawMoon(n,alpha,glow);   break;
        case TYPES.GALAXY: drawGalaxy(n,alpha,glow); break;
        default:           drawNode(n,alpha,glow);
      }
    });
    ctx.shadowBlur=0;
  }

  function update(){
    frame++; pal=palette();
    nodes.forEach(n=>{
      const dx=n.x-mouse.x, dy=n.y-mouse.y, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<MOUSE_R&&dist>0){ const f=.015*(1-dist/MOUSE_R); n.vx+=(dx/dist)*f*3; n.vy+=(dy/dist)*f*3; }
      n.vx*=.98; n.vy*=.98;
      const sp=Math.sqrt(n.vx*n.vx+n.vy*n.vy);
      if(sp>1.5){ n.vx=n.vx/sp*1.5; n.vy=n.vy/sp*1.5; }
      n.x+=n.vx; n.y+=n.vy; n.phase+=.005*n.speed;
      if(n.x<-30) n.x=canvas.width+30; if(n.x>canvas.width+30) n.x=-30;
      if(n.y<-30) n.y=canvas.height+30; if(n.y>canvas.height+30) n.y=-30;
    });
  }

  function loop(){ update(); draw(); requestAnimationFrame(loop); }
  loop();
})();
