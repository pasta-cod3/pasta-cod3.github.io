/* ═══════════════════════════════════════════════════════════
   PASTA-COD3 — main.js v3  (full responsive)
   ═══════════════════════════════════════════════════════════ */

const CAT_CLASS = {
  'red-team':'t-red','blue-team':'t-blue','storia':'t-storia',
  'fondamentali':'t-fond','notizie':'t-news'
};
const CAT_LABEL = {
  'red-team':'Red Team','blue-team':'Blue Team','storia':'Storia',
  'fondamentali':'Fondamentali','notizie':'Notizie'
};

let allArticles = [];
let activeTag   = null;
let activeCat   = null;
let searchQuery = '';

/* ── Helpers ─────────────────────────────────────────────── */
function readingTime(text){
  return Math.max(1, Math.round(text.trim().split(/\s+/).length/200))+' min';
}
function formatDate(d){
  const m=['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
  const p=d.split('-');
  return p[2]+' '+m[parseInt(p[1])-1]+' '+p[0];
}
function isMobile(){ return window.innerWidth < 768; }

/* ── Space Background — full page ────────────────────────── */
function initConstellation(){
  const canvas = document.getElementById('spaceCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');

  const mouse = { x:-9999, y:-9999 };
  const MOUSE_R = 140;

  // Track mouse globally
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x=-9999; mouse.y=-9999; });

  function resize(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Palette ──────────────────────────────────────────────
  function palette(){
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark ? [
      { r:0,   g:255, b:180 },  // accent green
      { r:0,   g:170, b:255 },  // accent2 blue
      { r:255, g:51,  b:102 },  // danger red
      { r:200, g:100, b:255 },  // fond purple
      { r:240, g:165, b:0   },  // news amber
      { r:180, g:220, b:255 },  // cold white-blue
    ] : [
      { r:56,  g:189, b:248 },
      { r:129, g:140, b:248 },
      { r:251, g:113, b:133 },
      { r:167, g:139, b:250 },
      { r:251, g:191, b:36  },
      { r:200, g:230, b:255 },
    ];
  }
  function randColor(pal){ return pal[Math.floor(Math.random()*pal.length)]; }
  function rgba(c, a){ return `rgba(${c.r},${c.g},${c.b},${a})`; }

  // ── Node types ────────────────────────────────────────────
  const TYPES = { STAR:0, MOON:1, GALAXY:2, NODE:3 };

  function makeNode(pal){
    const roll = Math.random();
    let type;
    if(roll < .06)      type = TYPES.GALAXY;
    else if(roll < .14) type = TYPES.MOON;
    else if(roll < .45) type = TYPES.STAR;
    else                type = TYPES.NODE;

    return {
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random()-.5) * .3,
      vy: (Math.random()-.5) * .3,
      r:  type===TYPES.GALAXY ? 18+Math.random()*14
          : type===TYPES.MOON  ? 4+Math.random()*4
          : type===TYPES.STAR  ? 1+Math.random()*1.5
          : 1.5+Math.random()*1.5,
      color: randColor(pal),
      type,
      phase: Math.random()*Math.PI*2,
      speed: .5+Math.random()*.8,
      arms:  type===TYPES.GALAXY ? 2+Math.floor(Math.random()*3) : 0,
      armLen:type===TYPES.GALAXY ? 30+Math.random()*20 : 0,
      twinkle: Math.random() < .4,
    };
  }

  const NUM = 130;
  let pal  = palette();
  let nodes = Array.from({length:NUM}, ()=>makeNode(pal));
  let frame = 0;

  // ── Draw functions ────────────────────────────────────────

  function drawStar(ctx, n, alpha, glow){
    const size = n.r * (1 + (glow*.4));
    ctx.save();
    ctx.translate(n.x, n.y);
    // 4-point sparkle
    ctx.shadowBlur  = glow ? 12+glow*10 : 4;
    ctx.shadowColor = rgba(n.color, .8);
    ctx.fillStyle   = rgba(n.color, alpha);
    for(let i=0;i<4;i++){
      ctx.beginPath();
      ctx.rotate(Math.PI/4);
      ctx.moveTo(0, -size*2.2);
      ctx.lineTo(size*.35, -size*.35);
      ctx.lineTo(size*2.2, 0);
      ctx.lineTo(size*.35, size*.35);
      ctx.lineTo(0, size*2.2);
      ctx.lineTo(-size*.35, size*.35);
      ctx.lineTo(-size*2.2, 0);
      ctx.lineTo(-size*.35, -size*.35);
      ctx.closePath();
      ctx.fill();
      break; // just 4-point cross
    }
    // center dot
    ctx.beginPath();
    ctx.arc(0, 0, size*.6, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  function drawMoon(ctx, n, alpha, glow){
    ctx.save();
    ctx.translate(n.x, n.y);
    ctx.rotate(n.phase*.2);
    ctx.shadowBlur  = glow ? 15+glow*12 : 6;
    ctx.shadowColor = rgba(n.color, .7);
    // outer disc
    ctx.beginPath();
    ctx.arc(0, 0, n.r, 0, Math.PI*2);
    ctx.fillStyle = rgba(n.color, alpha*.9);
    ctx.fill();
    // crescent bite — use actual bg color
    const bgColor = document.documentElement.getAttribute('data-theme')==='dark'
      ? 'rgba(2,4,8,1)' : 'rgba(10,14,23,1)';
    ctx.beginPath();
    ctx.arc(n.r*.45, 0, n.r*.85, 0, Math.PI*2);
    ctx.fillStyle = bgColor;
    ctx.fill();
    ctx.restore();
  }

  function drawGalaxy(ctx, n, alpha, glow){
    ctx.save();
    ctx.translate(n.x, n.y);
    const rot = frame * .002 * n.speed;
    ctx.rotate(rot);
    ctx.shadowBlur  = glow ? 20+glow*15 : 10;
    ctx.shadowColor = rgba(n.color, .5);

    // spiral arms
    for(let arm=0; arm<n.arms; arm++){
      const armAngle = (Math.PI*2/n.arms)*arm;
      for(let p=0; p<28; p++){
        const t = p/27;
        const angle = armAngle + t*Math.PI*2.2;
        const dist  = t*n.armLen;
        const px = Math.cos(angle)*dist;
        const py = Math.sin(angle)*dist*0.5;
        const pr = (1-t)*1.8+.3;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI*2);
        ctx.fillStyle = rgba(n.color, (1-t)*alpha*.7);
        ctx.fill();
      }
    }
    // core
    const grad = ctx.createRadialGradient(0,0,0, 0,0,n.r*.6);
    grad.addColorStop(0, rgba(n.color, alpha*.9));
    grad.addColorStop(.5, rgba(n.color, alpha*.4));
    grad.addColorStop(1, rgba(n.color, 0));
    ctx.beginPath();
    ctx.arc(0, 0, n.r*.6, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  function drawNode(ctx, n, alpha, glow){
    ctx.beginPath();
    ctx.shadowBlur  = glow ? 8+glow*8 : 0;
    ctx.shadowColor = rgba(n.color, .8);
    ctx.fillStyle   = rgba(n.color, alpha);
    ctx.arc(n.x, n.y, n.r+(glow*.5), 0, Math.PI*2);
    ctx.fill();
  }

  // ── Main draw loop ────────────────────────────────────────
  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;

    // connection lines between nearby nodes
    for(let i=0;i<nodes.length;i++){
      const a=nodes[i];
      if(a.type===TYPES.GALAXY) continue;
      for(let j=i+1;j<nodes.length;j++){
        const b=nodes[j];
        if(b.type===TYPES.GALAXY) continue;
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<150){
          const mx=(a.x+b.x)/2-mouse.x, my=(a.y+b.y)/2-mouse.y;
          const md=Math.sqrt(mx*mx+my*my);
          const boost = md<MOUSE_R ? (1-md/MOUSE_R)*.5 : 0;
          ctx.beginPath();
          ctx.strokeStyle=rgba(a.color, (1-dist/150)*.25+boost*.3);
          ctx.lineWidth=.5+(boost*1.2);
          ctx.shadowBlur = boost>0 ? boost*8 : 0;
          ctx.shadowColor = rgba(a.color, .4);
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    ctx.shadowBlur=0;

    // draw each node
    nodes.forEach(n=>{
      const dx=n.x-mouse.x, dy=n.y-mouse.y;
      const md=Math.sqrt(dx*dx+dy*dy);
      const near=md<MOUSE_R;
      const glow=near?(1-md/MOUSE_R):0;

      const twinkleAlpha = n.twinkle
        ? .4+Math.sin(frame*.05*n.speed+n.phase)*.35
        : .65;
      const alpha = near ? Math.min(twinkleAlpha+glow*.4,1) : twinkleAlpha;

      switch(n.type){
        case TYPES.STAR:   drawStar(ctx,n,alpha,glow);   break;
        case TYPES.MOON:   drawMoon(ctx,n,alpha,glow);   break;
        case TYPES.GALAXY: drawGalaxy(ctx,n,alpha,glow); break;
        default:           drawNode(ctx,n,alpha,glow);
      }
    });
    ctx.shadowBlur=0;
  }

  function update(){
    frame++;
    nodes.forEach(n=>{
      // mouse repulsion
      const dx=n.x-mouse.x, dy=n.y-mouse.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<MOUSE_R && dist>0){
        const force = .015*(1-dist/MOUSE_R);
        n.vx+=(dx/dist)*force*3;
        n.vy+=(dy/dist)*force*3;
      }
      // damping
      n.vx*=.98; n.vy*=.98;
      // speed cap
      const sp=Math.sqrt(n.vx*n.vx+n.vy*n.vy);
      if(sp>1.5){ n.vx=n.vx/sp*1.5; n.vy=n.vy/sp*1.5; }

      n.x+=n.vx; n.y+=n.vy;
      n.phase+=.005*n.speed;

      // wrap edges
      if(n.x<-30)                   n.x=canvas.width+30;
      if(n.x>canvas.width+30)       n.x=-30;
      if(n.y<-30)                   n.y=canvas.height+30;
      if(n.y>canvas.height+30)      n.y=-30;
    });

    // refresh palette on theme change
    pal = palette();
  }

  function loop(){ update(); draw(); requestAnimationFrame(loop); }
  loop();
}

/* ── Mobile nav drawer ───────────────────────────────────── */
function initMobileNav(){
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('navDrawer');
  const overlay    = document.getElementById('navOverlay');

  if(!hamburger||!drawer||!overlay) return;

  function openDrawer(){
    drawer.classList.add('open');
    drawer.style.display='flex';
    overlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeDrawer(){
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow='';
    setTimeout(()=>{ if(!drawer.classList.contains('open')) drawer.style.display='none'; },350);
  }

  hamburger.addEventListener('click',()=>{ drawer.classList.contains('open')?closeDrawer():openDrawer(); });
  overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.nav-drawer-link').forEach(link=>{
    link.addEventListener('click',e=>{
      e.preventDefault();
      const cat=link.dataset.cat;
      if(cat) setCat(activeCat===cat?null:cat);
      closeDrawer();
    });
  });
}

/* ── Mobile filter sheet ─────────────────────────────────── */
function initFilterSheet(){
  const btn     = document.getElementById('filterDrawerBtn');
  const sheet   = document.getElementById('filterSheet');
  const overlay = document.getElementById('filterOverlay');
  const closeBtn= document.getElementById('filterSheetClose');

  if(!btn||!sheet||!overlay||!closeBtn) return;

  function openSheet(){
    sheet.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeSheet(){
    sheet.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow='';
  }

  btn.addEventListener('click', openSheet);
  closeBtn.addEventListener('click', closeSheet);
  overlay.addEventListener('click', closeSheet);

  // Cat buttons in sheet
  const sheetCats = document.getElementById('filterSheetCats');
  if(sheetCats){
    sheetCats.addEventListener('click',e=>{
      const b=e.target.closest('.filter-sheet-cat-btn');
      if(!b) return;
      const cat=b.dataset.cat||null;
      setCat(activeCat===cat?null:cat);
      syncFilterSheetState();
    });
  }
}

function syncFilterSheetState(){
  // sync cat buttons
  document.querySelectorAll('.filter-sheet-cat-btn').forEach(b=>{
    b.classList.toggle('active', (b.dataset.cat||null)===(activeCat||null));
  });
  // sync tag buttons
  document.querySelectorAll('.filter-sheet-tag-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.tag===activeTag);
  });
  // update count badge
  const fdbCount=document.getElementById('fdbCount');
  const visible=document.querySelectorAll('.article-card:not(.hidden)').length;
  if(fdbCount) fdbCount.textContent=visible;
}

/* ── Mobile search toggle ────────────────────────────────── */
function initMobileSearch(){
  const toggleBtn = document.getElementById('searchToggleBtn');
  const searchWrap= document.getElementById('searchWrap');
  const searchInput=document.getElementById('searchInput');

  if(!toggleBtn||!searchWrap) return;

  function checkMobile(){
    if(window.innerWidth<768){
      toggleBtn.style.display='flex';
    } else {
      toggleBtn.style.display='none';
      searchWrap.classList.remove('mobile-search-open');
    }
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);

  toggleBtn.addEventListener('click',()=>{
    searchWrap.classList.toggle('mobile-search-open');
    if(searchWrap.classList.contains('mobile-search-open')){
      setTimeout(()=>searchInput.focus(),50);
    }
  });
}

/* ── Render articles ─────────────────────────────────────── */
function renderArticles(){
  const list  = document.getElementById('articleList');
  const noRes = document.getElementById('noResults');
  let visible = 0;

  list.querySelectorAll('.article-card').forEach(item=>{
    const title=item.dataset.title.toLowerCase();
    const cat  =item.dataset.cat;
    const tags =item.dataset.tags.toLowerCase();
    const mS=!searchQuery||title.includes(searchQuery)||tags.includes(searchQuery);
    const mC=!activeCat||cat===activeCat;
    const mT=!activeTag||tags.includes(activeTag.toLowerCase());
    if(mS&&mC&&mT){ item.classList.remove('hidden'); visible++; }
    else            item.classList.add('hidden');
  });

  noRes.classList.toggle('show',visible===0);

  const sc=document.getElementById('sidebarCount');
  if(sc) sc.textContent=visible+(visible===1?' articolo':' articoli');

  const fdb=document.getElementById('fdbCount');
  if(fdb) fdb.textContent=visible;

  syncFilterSheetState();
}

/* ── Build article card ──────────────────────────────────── */
function buildArticleCard(a,index){
  const item=document.createElement('a');
  item.href='post.html?id='+a.id;
  item.className='article-card';
  item.dataset.title=a.title;
  item.dataset.cat=a.category;
  item.dataset.tags=(a.tags||[]).join(' ');
  item.dataset.index=index;

  const catClass=CAT_CLASS[a.category]||'t-fond';
  const catLabel=CAT_LABEL[a.category]||a.category;

  item.innerHTML=`
    <div class="art-date">${formatDate(a.date)}</div>
    <div>
      <div class="art-title">${a.title}</div>
      <div class="art-excerpt">${a.excerpt||''}</div>
    </div>
    <div class="art-meta">
      <div class="art-cat ${catClass}">${catLabel}</div>
      <div class="art-readtime" id="rt-${a.id}">… min</div>
    </div>
  `;
  return item;
}

/* ── Build sidebar & sheet tags ──────────────────────────── */
function buildTags(articles){
  const tagSet=new Set();
  articles.forEach(a=>(a.tags||[]).forEach(t=>tagSet.add(t)));

  // Desktop sidebar
  const sidebarTags=document.getElementById('sidebarTags');
  // Mobile sheet
  const sheetTags=document.getElementById('filterSheetTags');

  tagSet.forEach(tag=>{
    // sidebar
    if(sidebarTags){
      const btn=document.createElement('button');
      btn.className='sidebar-tag-btn';
      btn.dataset.tag=tag; btn.textContent=tag;
      btn.addEventListener('click',()=>setTag(tag));
      sidebarTags.appendChild(btn);
    }
    // sheet
    if(sheetTags){
      const btn=document.createElement('button');
      btn.className='filter-sheet-tag-btn';
      btn.dataset.tag=tag; btn.textContent=tag;
      btn.addEventListener('click',()=>{ setTag(tag); syncFilterSheetState(); });
      sheetTags.appendChild(btn);
    }
  });
}

/* ── Set tag ─────────────────────────────────────────────── */
function setTag(tag){
  activeTag=(activeTag===tag)?null:tag;
  document.querySelectorAll('.sidebar-tag-btn,.filter-sheet-tag-btn').forEach(b=>
    b.classList.toggle('active',b.dataset.tag===activeTag)
  );
  renderArticles();
}

/* ── Set category ────────────────────────────────────────── */
function setCat(cat){
  activeCat=cat; activeTag=null;

  const title=document.getElementById('articlesSectionTitle');
  const reset=document.getElementById('resetFilter');
  if(title) title.textContent=cat?CAT_LABEL[cat]:'Tutti gli articoli';
  if(reset) reset.style.display=cat?'block':'none';

  // sync all cat buttons across desktop + mobile
  document.querySelectorAll('[data-cat]').forEach(el=>{
    if(el.classList.contains('sidebar-cat-btn')||el.classList.contains('filter-sheet-cat-btn')){
      el.classList.toggle('active',(el.dataset.cat||null)===(cat||null));
    }
    if(el.tagName==='A'&&el.classList.contains('nav-drawer-link')){
      el.classList.toggle('active',el.dataset.cat===cat);
    }
    if(el.tagName==='A'&&el.closest('.nav-links')){
      el.classList.toggle('active',el.dataset.cat===cat);
    }
  });
  document.querySelectorAll('.sidebar-tag-btn,.filter-sheet-tag-btn').forEach(b=>b.classList.remove('active'));

  renderArticles();
  const section=document.getElementById('articles');
  if(section) section.scrollIntoView({behavior:'smooth'});
}

/* ── Update counts ───────────────────────────────────────── */
function updateCounts(articles){
  const counts={};
  articles.forEach(a=>{ counts[a.category]=(counts[a.category]||0)+1; });
  const sm={'red-team':'cnt-red','blue-team':'cnt-blue','storia':'cnt-storia','fondamentali':'cnt-fond','notizie':'cnt-news'};
  const cm={'red-team':'cc-red','blue-team':'cc-blue','storia':'cc-storia','fondamentali':'cc-fond','notizie':'cc-news'};
  Object.entries(sm).forEach(([c,id])=>{ const e=document.getElementById(id); if(e)e.textContent=counts[c]||0; });
  Object.entries(cm).forEach(([c,id])=>{ const e=document.getElementById(id); if(e)e.textContent=(counts[c]||0)+' articoli'; });
}

/* ── Search dropdown ─────────────────────────────────────── */
function buildSearchDropdown(query){
  const dd=document.getElementById('searchDropdown');
  if(!dd) return;
  if(!query){ dd.classList.remove('open'); dd.innerHTML=''; return; }
  const q=query.toLowerCase();
  const matches=allArticles.filter(a=>
    a.title.toLowerCase().includes(q)||
    (a.tags||[]).some(t=>t.toLowerCase().includes(q))||
    (a.excerpt||'').toLowerCase().includes(q)
  ).slice(0,6);

  if(!matches.length){
    dd.innerHTML='<div class="search-no-results">Nessun risultato per "'+query+'"</div>';
  } else {
    dd.innerHTML=matches.map(a=>`
      <a href="post.html?id=${a.id}" class="search-result-item">
        <div class="sri-title">${a.title}</div>
        <div class="sri-meta">
          <span class="sri-cat ${CAT_CLASS[a.category]||'t-fond'}">${CAT_LABEL[a.category]||a.category}</span>
          <span class="sri-date">${formatDate(a.date)}</span>
        </div>
      </a>`).join('');
  }
  dd.classList.add('open');
}

/* ── Fetch reading time ──────────────────────────────────── */
async function fetchReadTime(a){
  try{
    const r=await fetch(a.file);
    const t=await r.text();
    const el=document.getElementById('rt-'+a.id);
    if(el) el.textContent=readingTime(t);
  }catch(e){}
}

/* ── Init ────────────────────────────────────────────────── */
async function init(){
  const res=await fetch('posts/index.json');
  allArticles=await res.json();
  allArticles.sort((a,b)=>new Date(b.date)-new Date(a.date));

  updateCounts(allArticles);
  buildTags(allArticles);

  const list=document.getElementById('articleList');
  allArticles.forEach((a,i)=>list.appendChild(buildArticleCard(a,i)));

  renderArticles();
  allArticles.forEach(a=>fetchReadTime(a));

  initConstellation();
  initMobileNav();
  initFilterSheet();
  initMobileSearch();
}

/* ── Global events ───────────────────────────────────────── */
document.getElementById('searchInput').addEventListener('input',e=>{
  searchQuery=e.target.value.toLowerCase().trim();
  buildSearchDropdown(e.target.value.trim());
  renderArticles();
});
document.getElementById('searchInput').addEventListener('blur',()=>{
  setTimeout(()=>{ const dd=document.getElementById('searchDropdown'); if(dd)dd.classList.remove('open'); },200);
});
document.getElementById('searchInput').addEventListener('focus',e=>{
  if(e.target.value.trim()) buildSearchDropdown(e.target.value.trim());
});

document.getElementById('resetFilter').addEventListener('click',()=>setCat(null));

// Nav links, stat boxes, footer links (desktop) — NOT cat-cards (handled separately)
document.querySelectorAll('[data-cat]').forEach(el=>{
  if(el.classList.contains('sidebar-cat-btn')||
     el.classList.contains('filter-sheet-cat-btn')||
     el.classList.contains('nav-drawer-link')||
     el.classList.contains('cat-card')||
     el.classList.contains('hamburger')) return;
  el.addEventListener('click',e=>{
    if(el.tagName==='A') e.preventDefault();
    const cat=el.dataset.cat;
    if(cat!==undefined) setCat(activeCat===cat?null:cat);
  });
});

// Cat cards — always SET the category (never toggle off from a card click)
document.querySelectorAll('.cat-grid').forEach(grid=>{
  grid.addEventListener('click',e=>{
    const card=e.target.closest('.cat-card');
    if(!card) return;
    const cat=card.dataset.cat;
    if(cat!==undefined) setCat(cat);
  });
});

// Desktop sidebar cats
document.getElementById('sidebarCats').addEventListener('click',e=>{
  const btn=e.target.closest('.sidebar-cat-btn');
  if(!btn) return;
  const cat=btn.dataset.cat||null;
  setCat(activeCat===cat?null:cat);
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('click',()=>{
  const html=document.documentElement;
  const isDark=html.getAttribute('data-theme')==='dark';
  const next=isDark?'light':'dark';
  html.setAttribute('data-theme',next);
  localStorage.setItem('theme',next);
  document.getElementById('themeToggle').textContent=isDark?'◑ DARK':'◐ LIGHT';
});

// Restore saved theme
(function(){
  const saved=localStorage.getItem('theme');
  if(saved){
    document.documentElement.setAttribute('data-theme',saved);
    const btn=document.getElementById('themeToggle');
    if(btn) btn.textContent=saved==='dark'?'◐ LIGHT':'◑ DARK';
  }
})();

init();
