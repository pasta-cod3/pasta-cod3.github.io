/* ============================================================
   post.js — Carica e renderizza un singolo articolo Markdown
   ============================================================ */

(async function () {
  const container = document.getElementById('postContainer');

  /* ── 1. Leggi ?id= dall'URL ──────────────────────────────── */
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id) {
    showError('Nessun articolo specificato nell\'URL.');
    return;
  }

  /* ── 2. Carica index.json per trovare i metadati ─────────── */
  let meta;
  try {
    const res = await fetch('posts/index.json');
    if (!res.ok) throw new Error();
    const all = await res.json();
    meta = all.find(a => a.id === id);
    if (!meta) throw new Error('non trovato');
  } catch {
    showError(`Articolo "${id}" non trovato.`);
    return;
  }

  /* ── 3. Carica il file Markdown ──────────────────────────── */
  let markdownText;
  try {
    const res = await fetch(meta.file);
    if (!res.ok) throw new Error();
    markdownText = await res.text();
  } catch {
    showError('Impossibile caricare il file dell\'articolo.');
    return;
  }

  /* ── 4. Aggiorna <title> ─────────────────────────────────── */
  document.title = `${meta.title} — Pasta-Cod3`;

  /* ── 5. Configura marked.js ──────────────────────────────── */
  marked.setOptions({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true,
  });

  /* ── 6. Rimuovi il titolo H1 dal Markdown se uguale al title */
  const bodyMd = markdownText.replace(/^#\s+.+\n/, '');

  /* ── 7. Costruisci HTML ──────────────────────────────────── */
  const badgeClass = {
    'red-team':     'badge-red',
    'blue-team':    'badge-blue',
    'storia':       'badge-gold',
    'fondamentali': 'badge-cyan',
  }[meta.category] || 'badge-green';

  const badgeLabel = {
    'red-team':     'Red Team',
    'blue-team':    'Blue Team',
    'storia':       'Storia',
    'fondamentali': 'Fondamentali',
  }[meta.category] || meta.category;

  const tagsHtml = (meta.tags || [])
    .map(t => `<span class="tag">#${t}</span>`)
    .join('');

  const coverHtml = meta.cover
    ? `<img src="${meta.cover}" alt="${meta.title}" style="width:100%;max-height:340px;object-fit:cover;border-radius:4px;margin-bottom:32px;opacity:.85;" />`
    : '';

  container.innerHTML = `
    ${coverHtml}
    <div class="post-header">
      <div class="post-meta">
        <span class="badge ${badgeClass}">${badgeLabel}</span>
        <span class="card-date" style="font-family:var(--font-mono);font-size:.78rem;color:var(--text-dim)">
          ${formatDate(meta.date)}
        </span>
      </div>
      <h1>${meta.title}</h1>
      ${tagsHtml ? `<div class="post-tags">${tagsHtml}</div>` : ''}
    </div>
    <div class="post-body" id="postBody">
      ${marked.parse(bodyMd)}
    </div>
  `;

  /* ── 8. Syntax highlight su tutti i code block ───────────── */
  document.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });

  /* ── 9. Aggiorna <title> con meta.title ──────────────────── */
  document.title = `${meta.title} — Pasta-Cod3`;

  /* ── helpers ─────────────────────────────────────────────── */
  function formatDate (dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const months = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
    return `${parseInt(d, 10)} ${months[parseInt(m,10)-1]} ${y}`;
  }

  function showError (msg) {
    container.innerHTML = `
      <div style="font-family:var(--font-mono);color:var(--accent-red);padding:40px 0;">
        // errore: ${msg}
      </div>
      <a href="index.html" class="post-back" style="margin-top:16px">← torna agli articoli</a>
    `;
  }
})();
