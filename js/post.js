/* ═══════════════════════════════════════════════════════════
   PASTA-COD3 — post.js
   ═══════════════════════════════════════════════════════════ */

const CAT_CLASS = {
  'red-team':     'cat-red',
  'blue-team':    'cat-blue',
  'storia':       'cat-storia',
  'fondamentali': 'cat-fond',
  'notizie':      'cat-news'
};

const CAT_LABEL = {
  'red-team':     'Red Team',
  'blue-team':    'Blue Team',
  'storia':       'Storia',
  'fondamentali': 'Fondamentali',
  'notizie':      'Notizie'
};

/* ── Helpers ─────────────────────────────────────────────── */

function formatDate(d) {
  const months = ['GEN','FEB','MAR','APR','MAG','GIU','LUG','AGO','SET','OTT','NOV','DIC'];
  const p = d.split('-');
  return p[2] + ' ' + months[parseInt(p[1]) - 1] + ' ' + p[0];
}

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)) + ' min di lettura';
}

/* ── Init ────────────────────────────────────────────────── */

async function init() {
  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id');
  if (!id) { window.location.href = 'index.html'; return; }

  /* load index */
  const indexRes = await fetch('posts/index.json');
  const articles = await indexRes.json();
  const article  = articles.find(a => a.id === id);
  if (!article) { window.location.href = 'index.html'; return; }

  document.title = 'pasta-cod3 — ' + article.title;

  /* load markdown */
  const mdRes = await fetch(article.file);
  const md    = await mdRes.text();
  const rt    = readingTime(md);

  /* parse markdown + inject heading IDs */
  const tmpDiv = document.createElement('div');
  tmpDiv.innerHTML = marked.parse(md);
  tmpDiv.querySelectorAll('h2, h3').forEach((h, i) => { h.id = 'heading-' + i; });

  /* FIX: convert marked's <pre><code class="language-mermaid"> → <div class="mermaid"> */
  tmpDiv.querySelectorAll('code.language-mermaid').forEach(code => {
    const div = document.createElement('div');
    div.className = 'mermaid';
    div.textContent = code.textContent;
    code.parentElement.replaceWith(div);
  });

  const finalHtml = tmpDiv.innerHTML;

  /* build TOC */
  const headings = tmpDiv.querySelectorAll('h2, h3');
  let tocItems = '';
  headings.forEach((h, i) => {
    const cls = h.tagName === 'H3' ? 'toc-item h3' : 'toc-item';
    tocItems += `<li class="${cls}" onclick="document.getElementById('heading-${i}').scrollIntoView({behavior:'smooth'})">${h.textContent}</li>`;
  });

  /* related articles (same category, exclude self) */
  const related = articles.filter(a => a.category === article.category && a.id !== id).slice(0, 3);
  const relatedHtml = related.map(a => `
    <a href="post.html?id=${a.id}" class="related-item">
      <div class="related-title">${a.title}</div>
      <div class="related-cat">${CAT_LABEL[a.category] || a.category}</div>
    </a>
  `).join('');

  /* prev / next */
  const sorted = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));
  const idx    = sorted.findIndex(a => a.id === id);
  const prev   = sorted[idx + 1];
  const next   = sorted[idx - 1];

  const prevHtml = prev
    ? `<a href="post.html?id=${prev.id}" class="post-nav-item prev"><div class="nav-dir">← Precedente</div><div class="nav-title">${prev.title}</div></a>`
    : `<div class="post-nav-item prev" style="opacity:.3"><div class="nav-dir">← Precedente</div><div class="nav-title">Inizio del blog</div></div>`;

  const nextHtml = next
    ? `<a href="post.html?id=${next.id}" class="post-nav-item next"><div class="nav-dir">Successivo →</div><div class="nav-title">${next.title}</div></a>`
    : `<div class="post-nav-item next" style="opacity:.3;text-align:right"><div class="nav-dir">Successivo →</div><div class="nav-title">Ultimo articolo</div></div>`;

  /* build tags */
  const tagsHtml = (article.tags || []).map(t => `<div class="post-tag">${t}</div>`).join('');
  const catClass = CAT_CLASS[article.category] || 'cat-fond';
  const catLabel = CAT_LABEL[article.category] || article.category;

  /* render */
  const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
  mermaid.initialize({
    startOnLoad: false,
    theme: isDarkTheme ? 'dark' : 'default',
    darkMode: isDarkTheme,
    background: 'transparent'
  });

  document.getElementById('postContainer').innerHTML = `
    <div class="post-header">
      <div class="post-meta-top">
        <div class="post-cat ${catClass}">${catLabel}</div>
        <div class="post-date">${formatDate(article.date)}</div>
        <div class="post-readtime">${rt}</div>
      </div>
      <div class="post-title">${article.title}</div>
      <div class="post-excerpt">${article.excerpt || ''}</div>
      <div class="post-tags">${tagsHtml}</div>
    </div>

    <div class="post-wrap">
      <div class="post-content" id="postContent">${finalHtml}</div>
      <div class="post-sidebar">
        ${tocItems ? `
          <div class="sidebar-block">
            <div class="sidebar-title">Indice</div>
            <ul class="toc-list">${tocItems}</ul>
          </div>` : ''}
        ${relatedHtml ? `
          <div class="sidebar-block">
            <div class="sidebar-title">Articoli correlati</div>
            <div class="related-list">${relatedHtml}</div>
          </div>` : ''}
      </div>
    </div>

    <div class="post-nav">${prevHtml}${nextHtml}</div>
  `;

  /* render mermaid diagrams */
  mermaid.run();
}

/* ── Theme toggle ────────────────────────────────────────── */

// Restore saved theme immediately on load
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
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'default' : 'dark',
    darkMode: !isDark,
    background: 'transparent'
  });
  mermaid.run();
});

init();
