/* ============================================================
   main.js — Homepage: carica articoli, filtri, ricerca
   ============================================================ */

(async function () {
  const grid        = document.getElementById('articlesGrid');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');

  let allArticles = [];
  let activeCat   = 'all';
  let searchQuery = '';

  /* ── 1. Leggi il parametro ?cat= dall'URL ────────────────── */
  const urlParams = new URLSearchParams(window.location.search);
  const urlCat    = urlParams.get('cat');
  if (urlCat) activeCat = urlCat;

  /* ── 2. Carica index.json ────────────────────────────────── */
  try {
    const res  = await fetch('posts/index.json');
    if (!res.ok) throw new Error('index.json non trovato');
    allArticles = await res.json();
  } catch (err) {
    grid.innerHTML = `<p class="empty-state">Errore nel caricamento degli articoli. (${err.message})</p>`;
    return;
  }

  /* ── 3. Imposta filtro iniziale dai bottoni ──────────────── */
  filterBtns.forEach(btn => {
    if (btn.dataset.cat === activeCat) btn.classList.add('active');
    else btn.classList.remove('active');

    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderArticles();
    });
  });

  /* ── 4. Ricerca real-time ────────────────────────────────── */
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    renderArticles();
  });

  /* ── 5. Render ───────────────────────────────────────────── */
  function renderArticles () {
    const filtered = allArticles.filter(article => {
      const matchCat  = activeCat === 'all' || article.category === activeCat;
      const haystack  = [article.title, ...(article.tags || [])].join(' ').toLowerCase();
      const matchSearch = !searchQuery || haystack.includes(searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="empty-state">nessun articolo trovato</p>`;
      return;
    }

    grid.innerHTML = filtered.map((article, i) => buildCard(article, i)).join('');

    /* click su tag → imposta ricerca */
    grid.querySelectorAll('.tag').forEach(tagEl => {
      tagEl.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        searchInput.value = tagEl.dataset.tag;
        searchQuery = tagEl.dataset.tag.toLowerCase();
        activeCat = 'all';
        filterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-cat="all"]').classList.add('active');
        renderArticles();
      });
    });
  }

  /* ── 6. Build card HTML ──────────────────────────────────── */
  function buildCard (a, index) {
    const badgeClass = {
      'red-team':     'badge-red',
      'blue-team':    'badge-blue',
      'storia':       'badge-gold',
      'fondamentali': 'badge-cyan',
    }[a.category] || 'badge-green';

    const badgeLabel = {
      'red-team':     'Red Team',
      'blue-team':    'Blue Team',
      'storia':       'Storia',
      'fondamentali': 'Fondamentali',
    }[a.category] || a.category;

    const coverHtml = a.cover
      ? `<img class="card-cover" src="${a.cover}" alt="${a.title}" loading="lazy" />`
      : '';

    const tagsHtml = (a.tags || [])
      .map(t => `<span class="tag" data-tag="${t}">#${t}</span>`)
      .join('');

    const dateFormatted = formatDate(a.date);

    return `
      <a class="article-card" href="post.html?id=${a.id}" data-cat="${a.category}" data-index="${index}">
        ${coverHtml}
        <div class="card-body">
          <div class="card-meta">
            <span class="badge ${badgeClass}">${badgeLabel}</span>
            <span class="card-date">${dateFormatted}</span>
          </div>
          <h2 class="card-title">${a.title}</h2>
          <p class="card-excerpt">${a.excerpt}</p>
          ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
        </div>
      </a>
    `;
  }

  /* ── 7. Formatta data ────────────────────────────────────── */
  function formatDate (dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
    return `${parseInt(d, 10)} ${months[parseInt(m,10)-1]} ${y}`;
  }

  /* ── Primo render ────────────────────────────────────────── */
  renderArticles();
})();
