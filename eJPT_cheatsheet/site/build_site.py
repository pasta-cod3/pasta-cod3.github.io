#!/usr/bin/env python3
"""
Build script per il sito eJPT — sito di navigazione offline per il cheatsheet.
Pre-renderizza tutti i file .md in un'unica pagina HTML autonoma (no server, no
internet richiesti): sidebar ad albero + ricerca full-text client-side.

Uso:
    python3 build_site.py

Rigenera site/index.html leggendo tutti i .md nella cartella padre.
"""
import json
import os
import re
import posixpath
import markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(SITE_DIR, "index.html")

EXCLUDE_FILES = set()
EXCLUDE_DIRS = {"site", ".git"}

SECTION_ORDER = [
    ".",  # root: INDEX.md, QUICK-START.md
    "00-Fundamentals",
    "01-Information-Gathering",
    "02-Footprinting-Scanning",
    "03-Enumeration",
    "04-Vulnerability-Assessment",
    "05-System-Host-Attacks",
    "06-Network-Attacks",
    "07-Metasploit-Framework",
    "08-Exploitation-PostEx",
    "09-Social-Engineering",
    "10-Web-Application-Attacks",
    "11-Tools-Reference",
    "12-Reporting-Notes",
    "13-Lab-Walkthroughs",
]

ROOT_FILE_ORDER = ["INDEX.md", "QUICK-START.md"]


def find_md_files():
    files = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith(".")]
        rel_dir = os.path.relpath(dirpath, ROOT)
        for fn in filenames:
            if not fn.endswith(".md"):
                continue
            if fn in EXCLUDE_FILES:
                continue
            rel_path = fn if rel_dir == "." else f"{rel_dir}/{fn}"
            files.append(rel_path.replace(os.sep, "/"))
    return files


def extract_title(text, fallback):
    m = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    if m:
        return m.group(1).strip()
    return fallback


def rewrite_links(text, current_id, all_ids, folder_first_file):
    """Rewrite relative .md / directory links into internal #/ hash routes."""
    current_dir = posixpath.dirname(current_id)

    def resolve(target):
        if target.startswith(("http://", "https://", "mailto:", "#")):
            return None
        joined = posixpath.normpath(posixpath.join(current_dir, target)) if current_dir else posixpath.normpath(target)
        joined = joined.lstrip("./")
        return joined

    def repl(m):
        label, target = m.group(1), m.group(2)
        if target.startswith(("http://", "https://", "mailto:")):
            return m.group(0)
        # strip trailing slash for directory-style links (e.g. "01-Reconnaissance/")
        clean = target.rstrip("/")
        resolved = resolve(clean if clean else target)
        if resolved is None:
            return m.group(0)
        if resolved in all_ids:
            return f"[{label}](#/{resolved})"
        if resolved in folder_first_file:
            return f"[{label}](#/{folder_first_file[resolved]})"
        # try as directory even if original target had no trailing slash
        if target.endswith("/") and resolved in folder_first_file:
            return f"[{label}](#/{folder_first_file[resolved]})"
        return m.group(0)

    return re.sub(r"\[([^\]]*)\]\(([^)\s]+)\)", repl, text)


def strip_html(html):
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def main():
    rel_paths = find_md_files()
    all_ids = set(rel_paths)

    # first file per folder (for directory-style links like "01-Reconnaissance/")
    folder_first_file = {}
    by_folder = {}
    for rp in rel_paths:
        folder = posixpath.dirname(rp) or "."
        by_folder.setdefault(folder, []).append(rp)
    for folder, files in by_folder.items():
        files_sorted = sorted(files, key=lambda p: posixpath.basename(p))
        if folder != ".":
            folder_first_file[folder] = files_sorted[0]

    raw_texts = {}
    for rp in rel_paths:
        with open(os.path.join(ROOT, rp), encoding="utf-8") as f:
            raw_texts[rp] = f.read()

    pages = {}
    for rp in rel_paths:
        text = raw_texts[rp]
        fallback_title = posixpath.basename(rp).replace(".md", "").replace("-", " ")
        title = extract_title(text, fallback_title)
        text_rewritten = rewrite_links(text, rp, all_ids, folder_first_file)
        html = markdown.markdown(
            text_rewritten,
            extensions=["tables", "fenced_code", "toc", "sane_lists"],
            extension_configs={"toc": {"permalink": False}},
        )
        search_text = (title + " " + strip_html(html)).lower()
        pages[rp] = {"title": title, "html": html, "raw": text, "search": search_text}

    # ordering: use manifest.json (curated study order) when available, else alphabetical
    manifest_path = os.path.join(SITE_DIR, "manifest.json")
    manifest_order = []
    if os.path.isfile(manifest_path):
        with open(manifest_path, encoding="utf-8") as f:
            manifest_order = [p for p in json.load(f) if p in all_ids]

    def ordered(files):
        rank = {p: i for i, p in enumerate(manifest_order)}
        return sorted(files, key=lambda p: (rank.get(p, 10**9), posixpath.basename(p)))

    # build nav tree structure
    nav = []
    root_files = ordered([f for f in ROOT_FILE_ORDER if f in all_ids])
    nav.append({"type": "files", "files": root_files})
    for section in SECTION_ORDER:
        if section == ".":
            continue
        if section not in by_folder:
            continue
        nav.append({"type": "folder", "name": section, "files": ordered(by_folder[section])})

    default_page = "INDEX.md" if "INDEX.md" in all_ids else sorted(all_ids)[0]

    data = {"pages": pages, "nav": nav, "default": default_page}
    data_json = json.dumps(data, ensure_ascii=False)
    # escape sequences that could break out of the <script> block
    data_json_safe = data_json.replace("</", "<\\/")

    html_doc = HTML_TEMPLATE.replace("__DATA_JSON__", data_json_safe)

    with open(OUTPUT, "w", encoding="utf-8") as f:
        f.write(html_doc)

    print(f"Generato {OUTPUT} ({len(pages)} pagine, {os.path.getsize(OUTPUT)/1024:.0f} KB)")


HTML_TEMPLATE = r"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>eJPT Cheatsheet</title>
<style>
:root{
  /* paper / printout mode (light) */
  --bg:#efe9d8; --bg-elev:#f7f3e7; --border:#c9bfa0; --text:#2b2a20; --text-dim:#726d54;
  --accent:#8a5a00; --accent-soft:#e2d3a4; --code-bg:#e6ded0; --link:#8a5a00;
  --sidebar-bg:#e7e0cc; --scrollbar:#c9bfa0; --mark:#f2c351; --ok:#2f7d2f; --dim-red:#a33;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#0b0c0a; --bg-elev:#141611; --border:#2a2e24; --text:#dcdccb; --text-dim:#7d8271;
    --accent:#ffb000; --accent-soft:#2a2010; --code-bg:#101208; --link:#ffb000;
    --sidebar-bg:#0e0f0c; --scrollbar:#33372c; --mark:#ffb000; --ok:#5fd75f; --dim-red:#c25454;
  }
}
:root[data-theme="dark"]{
  --bg:#0b0c0a; --bg-elev:#141611; --border:#2a2e24; --text:#dcdccb; --text-dim:#7d8271;
  --accent:#ffb000; --accent-soft:#2a2010; --code-bg:#101208; --link:#ffb000;
  --sidebar-bg:#0e0f0c; --scrollbar:#33372c; --mark:#ffb000; --ok:#5fd75f; --dim-red:#c25454;
}
*{box-sizing:border-box}
html{scrollbar-color:var(--scrollbar) transparent}
body{background:var(--bg);color:var(--text);font-family:"JetBrains Mono","Fira Code",Consolas,"Liberation Mono",Menlo,Monaco,monospace;margin:0}
a{color:var(--link)}
code,pre{font-family:inherit}
#app{display:flex;height:100vh;overflow:hidden;animation:boot .5s ease-out}
@keyframes boot{from{opacity:0;filter:brightness(2.4)}to{opacity:1;filter:brightness(1)}}
@media (prefers-reduced-motion: reduce){#app{animation:none}}

/* Sidebar */
#sidebar{width:300px;min-width:220px;max-width:420px;background:var(--sidebar-bg);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}
#sidebar-header{padding:0 0 10px;border-bottom:1px solid var(--border)}
#term-dots{display:flex;gap:6px;padding:9px 12px;border-bottom:1px solid var(--border)}
#term-dots span{width:8px;height:8px;border-radius:50%;display:inline-block;opacity:.55}
#term-dots span:nth-child(1){background:var(--dim-red)}
#term-dots span:nth-child(2){background:var(--accent)}
#term-dots span:nth-child(3){background:var(--ok)}
#brand{font-weight:600;font-size:13.5px;letter-spacing:.01em;display:flex;align-items:baseline;padding:10px 14px 12px;white-space:nowrap;overflow:hidden}
#brand .u{color:var(--accent);font-weight:700}
#brand .p{color:var(--text-dim)}
#brand .h{color:var(--text)}
#brand .cur{display:inline-block;width:7px;height:14px;margin-left:2px;background:var(--accent);animation:blink 1.1s steps(1) infinite}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@media (prefers-reduced-motion: reduce){#brand .cur{animation:none}}
#search-wrap{position:relative;padding:0 14px}
#search-prompt{position:absolute;left:24px;top:50%;transform:translateY(-50%);color:var(--accent);font-size:13px;pointer-events:none}
#search{width:100%;padding:8px 30px 8px 22px;border-radius:0;border:1px solid var(--border);background:var(--bg-elev);color:var(--text);font-size:13px;font-family:inherit}
#search:focus{outline:1px solid var(--accent);outline-offset:-1px;border-color:var(--accent)}
#search-clear{position:absolute;right:20px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-dim);cursor:pointer;font-size:14px;padding:2px 5px;display:none}
#search-count{font-size:11px;color:var(--text-dim);margin:6px 14px 0}
#tree{flex:1;overflow-y:auto;padding:10px 6px 24px}
#tree::-webkit-scrollbar{width:8px}
#tree::-webkit-scrollbar-thumb{background:var(--scrollbar)}
.nav-root-files{margin-bottom:10px;padding:0 8px}
.nav-folder{margin-bottom:1px}
.nav-folder-label{display:flex;align-items:center;gap:6px;padding:7px 8px;font-size:12px;font-weight:600;letter-spacing:.02em;color:var(--text-dim);cursor:pointer;user-select:none}
.nav-folder-label:hover{color:var(--text);background:var(--bg-elev)}
.nav-folder-label .chev{display:inline-block;color:var(--accent);font-size:11px;width:10px;flex-shrink:0}
.nav-folder.collapsed .chev{transform:rotate(-90deg)}
.nav-folder.collapsed .nav-folder-files{display:none}
.nav-file{display:flex;align-items:center;padding:5px 8px 5px 8px;font-size:13px;color:var(--text);text-decoration:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nav-root-files .nav-file{font-weight:600}
.nav-root-files .nav-file::before{content:'$ ';color:var(--accent)}
.nav-folder-files .nav-file::before{content:'\251c\2500 ';color:var(--text-dim);flex-shrink:0}
.nav-folder-files .nav-file:last-child::before{content:'\2514\2500 '}
.nav-file:hover{background:var(--bg-elev);color:var(--accent)}
.nav-file.active{background:var(--accent-soft);color:var(--accent);font-weight:600}
.nav-file[hidden]{display:none}
.nav-folder[data-allhidden="1"]{display:none}

/* Main */
#main{flex:1;overflow-y:auto;min-width:0}
#main-inner{max-width:78ch;margin:0 auto;padding:40px 48px 100px}
#path-bar{font-size:12px;color:var(--text-dim);margin-bottom:18px;padding-bottom:10px;border-bottom:1px dashed var(--border)}
#path-bar .cmd{color:var(--accent)}
#topbar{display:none;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--bg-elev)}
#topbar button,#theme-toggle,#ai-clear,#sister-link{background:none;border:1px solid var(--border);border-radius:0;color:var(--text);padding:5px 9px;cursor:pointer;font-size:12.5px;font-family:inherit}
#topbar button::before,#theme-toggle::before,#ai-clear::before,#sister-link::before{content:'[ '}
#topbar button::after,#theme-toggle::after,#ai-clear::after,#sister-link::after{content:' ]'}
#topbar button:hover,#theme-toggle:hover,#ai-clear:hover,#sister-link:hover{background:var(--accent);color:var(--bg);border-color:var(--accent)}
#theme-toggle{color:var(--text-dim)}
#header-actions{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
#sister-link{color:var(--text-dim);text-decoration:none;display:inline-block;white-space:nowrap}

.content h1{font-size:23px;border-bottom:2px solid var(--accent);padding-bottom:10px;margin-top:0;letter-spacing:-.01em}
.content h2{font-size:17px;margin-top:34px;color:var(--accent)}
.content h2::before{content:'## ';color:var(--text-dim);font-weight:400}
.content h3{font-size:14.5px;margin-top:24px}
.content h3::before{content:'### ';color:var(--text-dim);font-weight:400}
.content p, .content li{line-height:1.65;font-size:14px}
.content table{border-collapse:collapse;width:100%;margin:16px 0;font-size:13px;display:block;overflow-x:auto}
.content th,.content td{border:1px solid var(--border);padding:6px 10px;text-align:left}
.content th{background:var(--code-bg);font-weight:600;color:var(--accent);border-bottom:2px solid var(--accent)}
.content tr:hover td{background:var(--accent-soft)}
.content code{background:var(--code-bg);padding:1px 5px;font-size:.9em;border:1px solid var(--border)}
.content pre{background:var(--code-bg);padding:12px 14px;border-radius:0;overflow-x:auto;border:1px solid var(--border);border-left:3px solid var(--accent)}
.content pre code{background:none;padding:0;border:none}
.content blockquote{border-left:3px solid var(--accent);background:var(--accent-soft);margin:16px 0;padding:8px 16px;color:var(--text)}
.content blockquote::before{content:'[!] ';color:var(--accent);font-weight:700}
.content hr{border:none;border-top:1px dashed var(--border);margin:26px 0}
.content a{text-decoration:none;border-bottom:1px solid var(--accent-soft)}
.content a:hover{border-bottom-color:var(--accent)}
mark{background:var(--mark);color:#0b0c0a;border-radius:0}

.search-results{padding:4px 0}
.search-result{display:block;padding:10px 8px;text-decoration:none;color:var(--text);border-bottom:1px solid var(--border)}
.search-result:hover{background:var(--bg-elev);color:var(--accent)}
.search-result .srt{font-weight:600;font-size:13.5px;color:inherit}
.search-result .srp{font-size:11px;color:var(--text-dim);margin-bottom:3px}
.search-result .srp::before{content:'/'}

#empty-state{color:var(--text-dim);font-size:13px;padding:14px 8px}

@media (max-width: 820px){
  #sidebar{position:fixed;left:0;top:0;bottom:0;z-index:20;transform:translateX(-100%);transition:transform .18s;box-shadow:2px 0 12px rgba(0,0,0,.4)}
  #sidebar.open{transform:translateX(0)}
  #topbar{display:flex}
  #main-inner{padding:24px 18px 80px}
}

/* ---- AI panel ---- */
#ai-toggle{position:fixed;right:22px;bottom:22px;z-index:15;background:var(--bg-elev);color:var(--accent);border:1px solid var(--accent);
  border-radius:0;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);
  display:flex;align-items:center;gap:7px;font-family:inherit}
#ai-toggle::before{content:'[ ';color:var(--text-dim)}
#ai-toggle::after{content:' ]';color:var(--text-dim)}
#ai-toggle:hover{background:var(--accent);color:var(--bg)}
#ai-toggle .dot{width:7px;height:7px;border-radius:50%;background:var(--dim-red);opacity:.8}
#ai-toggle[data-connected="1"] .dot{background:var(--ok);opacity:1}
#ai-panel{position:fixed;top:0;right:0;bottom:0;width:400px;max-width:92vw;background:var(--bg-elev);
  border-left:1px solid var(--border);box-shadow:-6px 0 20px rgba(0,0,0,.3);z-index:25;
  display:flex;flex-direction:column;transform:translateX(100%);transition:transform .2s}
#ai-panel.open{transform:translateX(0)}
#ai-header{padding:12px 14px;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:8px}
#ai-header-top{display:flex;align-items:center;gap:8px}
#ai-title{font-weight:700;font-size:13.5px;flex:1}
#ai-title::before{content:'# '}
#ai-close{background:none;border:none;color:var(--text-dim);font-size:18px;cursor:pointer;line-height:1;padding:2px 6px}
#ai-model-row{display:flex;gap:6px}
#ai-model{flex:1;min-width:0;padding:6px 8px;border-radius:0;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:12.5px;font-family:inherit}
#ai-endpoint{width:100%;padding:5px 8px;border-radius:0;border:1px solid var(--border);background:var(--bg);color:var(--text-dim);font-size:11px;font-family:inherit}
#ai-context-label{font-size:11px;color:var(--text-dim)}
#ai-context-label b{color:var(--accent)}
#ai-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px}
.ai-msg{max-width:92%;padding:9px 12px;border-radius:0;font-size:13.5px;line-height:1.55}
.ai-msg.user{align-self:flex-end;background:var(--accent-soft);color:var(--text);border:1px solid var(--accent)}
.ai-msg.user::before{content:'\276f ';color:var(--accent);font-weight:700}
.ai-msg.assistant{align-self:flex-start;background:var(--code-bg);border:1px solid var(--border)}
.ai-msg.assistant::before{content:'# ';color:var(--text-dim)}
.ai-msg.assistant.pending{color:var(--text-dim)}
.ai-msg p{margin:0 0 8px}
.ai-msg p:last-child{margin-bottom:0}
.ai-msg pre{margin:8px 0}
.ai-msg h1,.ai-msg h2,.ai-msg h3{font-size:13.5px;margin:8px 0 4px;border:none;color:var(--text)}
#ai-empty{color:var(--text-dim);font-size:12.5px;padding:6px 2px}
#ai-setup{margin:0 14px 12px;padding:12px;border:1px solid var(--border);border-radius:0;background:var(--code-bg);font-size:12px;display:none}
#ai-setup.show{display:block}
#ai-setup code{display:block;margin-top:6px;padding:6px 8px;background:var(--bg);word-break:break-all}
#ai-input-row{border-top:1px solid var(--border);padding:10px;display:flex;gap:8px;align-items:flex-end}
#ai-input{flex:1;resize:none;max-height:120px;padding:8px 10px;border-radius:0;border:1px solid var(--border);
  background:var(--bg);color:var(--text);font-size:13px;font-family:inherit}
#ai-send,#ai-stop{border:1px solid var(--accent);border-radius:0;padding:8px 14px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit}
#ai-send{background:var(--accent);color:var(--bg)}
#ai-send:disabled{opacity:.4;cursor:default}
#ai-stop{background:var(--border);color:var(--text);border-color:var(--border);display:none}
#ai-clear{color:var(--text-dim);font-size:11px;padding:4px 8px}

@media (max-width: 820px){
  #ai-panel{width:100vw;max-width:100vw}
  #ai-toggle{right:14px;bottom:14px}
}
</style>
</head>
<body>
<div id="app">
  <aside id="sidebar">
    <div id="sidebar-header">
      <div id="term-dots"><span></span><span></span><span></span></div>
      <div id="brand"><span class="u">ejpt</span><span class="p">@</span><span class="h">cheatsheet</span><span class="p">:~$</span><span class="cur"></span></div>
      <div id="header-actions">
        <button id="theme-toggle">Tema</button>
        <a id="sister-link" href="../../eWPT_cheatsheet/site/index.html">cd ../eWPT</a>
      </div>
      <div id="search-wrap">
        <span id="search-prompt">&#10095;</span>
        <input id="search" type="text" placeholder="grep -i ..." autocomplete="off">
        <button id="search-clear" aria-label="Cancella ricerca">&times;</button>
      </div>
      <div id="search-count"></div>
    </div>
    <nav id="tree"></nav>
  </aside>
  <main id="main">
    <div id="topbar">
      <button id="menu-toggle">Indice</button>
    </div>
    <div id="main-inner">
      <div id="path-bar"></div>
      <div id="content" class="content"></div>
    </div>
  </main>
</div>

<button id="ai-toggle" data-connected="0"><span class="dot"></span>Chiedi all'AI</button>
<aside id="ai-panel">
  <div id="ai-header">
    <div id="ai-header-top">
      <div id="ai-title">Assistente di studio (locale)</div>
      <button id="ai-clear">Nuova chat</button>
      <button id="ai-close" aria-label="Chiudi">&times;</button>
    </div>
    <div id="ai-model-row">
      <select id="ai-model"><option value="">(nessun modello trovato)</option></select>
    </div>
    <input id="ai-endpoint" type="text" value="http://localhost:11434" spellcheck="false">
    <div id="ai-context-label">Contesto: <b id="ai-context-page">-</b></div>
  </div>
  <div id="ai-setup">
    <div>Non riesco a contattare Ollama su questo indirizzo. Verifica che sia avviato e che accetti richieste da questa origine:</div>
    <code id="ai-setup-cmd">OLLAMA_ORIGINS=* ollama serve</code>
    <div style="margin-top:6px">(oppure aggiungi l'origine esatta di questa pagina a <code style="display:inline;padding:1px 4px">OLLAMA_ORIGINS</code>, poi riavvia Ollama e clicca "Riprova" qui sotto)</div>
    <button id="ai-retry" style="margin-top:8px;background:var(--accent);color:var(--bg-elev);border:none;border-radius:6px;padding:6px 10px;font-size:12px;cursor:pointer">Riprova</button>
  </div>
  <div id="ai-messages">
    <div id="ai-empty">Fai una domanda sul contenuto della pagina che stai leggendo — l'assistente vede solo questa pagina, gira in locale, nessun dato lascia il tuo PC.</div>
  </div>
  <div id="ai-input-row">
    <textarea id="ai-input" rows="1" placeholder="Chiedi una spiegazione..."></textarea>
    <button id="ai-stop">Stop</button>
    <button id="ai-send">Invia</button>
  </div>
</aside>

<script id="data" type="application/json">__DATA_JSON__</script>
<script>
(function(){
  var DATA = JSON.parse(document.getElementById('data').textContent);
  var PAGES = DATA.pages, NAV = DATA.nav, DEFAULT = DATA.default;

  var treeEl = document.getElementById('tree');
  var contentEl = document.getElementById('content');
  var searchEl = document.getElementById('search');
  var searchClear = document.getElementById('search-clear');
  var searchCount = document.getElementById('search-count');
  var sidebar = document.getElementById('sidebar');

  function folderLabel(name){
    return name.replace(/^\d+-/, function(m){return '';}) ? name : name;
  }

  function buildTree(){
    treeEl.innerHTML = '';
    NAV.forEach(function(section){
      if(section.type === 'files'){
        var wrap = document.createElement('div');
        wrap.className = 'nav-root-files';
        section.files.forEach(function(id){
          wrap.appendChild(makeFileLink(id));
        });
        treeEl.appendChild(wrap);
      } else {
        var folder = document.createElement('div');
        folder.className = 'nav-folder';
        folder.dataset.folder = section.name;
        var label = document.createElement('div');
        label.className = 'nav-folder-label';
        label.innerHTML = '<span class="chev">&#9662;</span><span>' + section.name + '/</span>';
        label.addEventListener('click', function(){ folder.classList.toggle('collapsed'); });
        folder.appendChild(label);
        var filesWrap = document.createElement('div');
        filesWrap.className = 'nav-folder-files';
        section.files.forEach(function(id){
          filesWrap.appendChild(makeFileLink(id));
        });
        folder.appendChild(filesWrap);
        treeEl.appendChild(folder);
      }
    });
  }

  function makeFileLink(id){
    var a = document.createElement('a');
    a.href = '#/' + id;
    a.className = 'nav-file';
    a.dataset.id = id;
    a.textContent = PAGES[id].title;
    a.title = PAGES[id].title;
    return a;
  }

  function setActive(id){
    document.querySelectorAll('.nav-file').forEach(function(el){
      el.classList.toggle('active', el.dataset.id === id);
    });
    // expand containing folder
    var active = document.querySelector('.nav-file.active');
    if(active){
      var folder = active.closest('.nav-folder');
      if(folder) folder.classList.remove('collapsed');
      active.scrollIntoView({block:'nearest'});
    }
  }

  var CURRENT_PAGE_ID = null;
  var pathBarEl = document.getElementById('path-bar');

  function renderPage(id){
    var page = PAGES[id];
    if(!page){ id = DEFAULT; page = PAGES[id]; }
    contentEl.innerHTML = page.html;
    pathBarEl.innerHTML = '<span class="cmd">$ cat</span> ' + escapeHtml(id);
    document.title = page.title + ' — eJPT Cheatsheet';
    setActive(id);
    document.getElementById('main').scrollTop = 0;
    sidebar.classList.remove('open');
    CURRENT_PAGE_ID = id;
    if(typeof updateContextLabel === 'function') updateContextLabel();
  }

  function currentIdFromHash(){
    var h = location.hash.replace(/^#\/?/, '');
    return h && PAGES[h] ? h : DEFAULT;
  }

  window.addEventListener('hashchange', function(){
    renderPage(currentIdFromHash());
  });

  // ---- search ----
  var searchMode = false;

  function runSearch(q){
    q = q.trim().toLowerCase();
    if(!q){
      searchMode = false;
      searchClear.style.display = 'none';
      searchCount.textContent = '';
      buildTree();
      setActive(currentIdFromHash());
      return;
    }
    searchMode = true;
    searchClear.style.display = 'block';
    var terms = q.split(/\s+/).filter(Boolean);
    var results = [];
    Object.keys(PAGES).forEach(function(id){
      var p = PAGES[id];
      var hay = p.search;
      var titleHay = p.title.toLowerCase();
      var matches = terms.every(function(t){ return hay.indexOf(t) !== -1; });
      if(matches){
        var score = terms.every(function(t){ return titleHay.indexOf(t) !== -1; }) ? 0 : 1;
        results.push({id:id, title:p.title, score:score});
      }
    });
    results.sort(function(a,b){ return a.score - b.score || a.title.localeCompare(b.title); });
    searchCount.textContent = results.length + ' risultat' + (results.length===1?'o':'i');

    treeEl.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'search-results';
    if(results.length === 0){
      var empty = document.createElement('div');
      empty.id = 'empty-state';
      empty.textContent = 'Nessun cheatsheet trovato.';
      wrap.appendChild(empty);
    }
    results.forEach(function(r){
      var a = document.createElement('a');
      a.className = 'search-result';
      a.href = '#/' + r.id;
      var pathLabel = r.id.indexOf('/') !== -1 ? r.id.split('/')[0] : 'root';
      a.innerHTML = '<div class="srp">' + pathLabel + '</div><div class="srt">' + escapeHtml(r.title) + '</div>';
      wrap.appendChild(a);
    });
    treeEl.appendChild(wrap);
  }

  function escapeHtml(s){
    return s.replace(/[&<>"]/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }

  searchEl.addEventListener('input', function(){ runSearch(searchEl.value); });
  searchClear.addEventListener('click', function(){
    searchEl.value = '';
    runSearch('');
    searchEl.focus();
  });
  document.addEventListener('keydown', function(e){
    if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      searchEl.focus();
      searchEl.select();
    }
    if(e.key === 'Escape' && document.activeElement === searchEl){
      searchEl.value=''; runSearch(''); searchEl.blur();
    }
  });

  // ---- mobile sidebar toggle ----
  document.getElementById('menu-toggle').addEventListener('click', function(){
    sidebar.classList.toggle('open');
  });

  // ---- theme toggle ----
  var themeBtn = document.getElementById('theme-toggle');
  function applyTheme(t){
    if(t){ document.documentElement.setAttribute('data-theme', t); }
    else { document.documentElement.removeAttribute('data-theme'); }
  }
  try {
    var saved = localStorage.getItem('ewpt-theme');
    if(saved) applyTheme(saved);
  } catch(e){}
  themeBtn.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : (current === 'light' ? null : 'dark');
    applyTheme(next);
    try { localStorage.setItem('ewpt-theme', next || ''); } catch(e){}
  });

  // ---------------------------------------------------------------------
  // Minimal Markdown -> HTML (used only to render live AI chat replies;
  // page content itself is already pre-rendered at build time above)
  // ---------------------------------------------------------------------
  function inlineFull(raw){
    var codeStore = [];
    var t = raw.replace(/`([^`]+)`/g, function(_, code){
      codeStore.push(code);
      return ' CODE' + (codeStore.length - 1) + ' ';
    });
    var boldStore = [];
    t = t.replace(/\*\*([^*]+)\*\*/g, function(_, b){
      boldStore.push(b);
      return ' BOLD' + (boldStore.length - 1) + ' ';
    });
    t = escapeHtml(t);
    t = t.replace(/ BOLD(\d+) /g, function(_, i){ return '<strong>' + escapeHtml(boldStore[+i]) + '</strong>'; });
    t = t.replace(/ CODE(\d+) /g, function(_, i){ return '<code>' + escapeHtml(codeStore[+i]) + '</code>'; });
    return t;
  }

  function markdownToHtml(src){
    var lines = src.replace(/\r\n/g, '\n').split('\n');
    var out = [];
    var i = 0, n = lines.length;
    while(i < n){
      var line = lines[i];
      if(line.trim() === ''){ i++; continue; }
      var fence = line.match(/^```(\w*)\s*$/);
      if(fence){
        var lang = fence[1] || '';
        var buf = [];
        i++;
        while(i < n && !/^```\s*$/.test(lines[i])){ buf.push(lines[i]); i++; }
        i++;
        var cls = lang ? ' class="language-' + escapeHtml(lang) + '"' : '';
        out.push('<pre><code' + cls + '>' + escapeHtml(buf.join('\n')) + '</code></pre>');
        continue;
      }
      var heading = line.match(/^(#{1,6})\s+(.*)$/);
      if(heading){
        var level = heading[1].length;
        out.push('<h' + level + '>' + inlineFull(heading[2]) + '</h' + level + '>');
        i++; continue;
      }
      if(/^\s*-{3,}\s*$/.test(line)){ out.push('<hr>'); i++; continue; }
      if(/^\s*-\s+/.test(line)){
        var items = [];
        while(i < n && /^\s*-\s+/.test(lines[i])){
          items.push('<li>' + inlineFull(lines[i].replace(/^\s*-\s+/, '')) + '</li>');
          i++;
        }
        out.push('<ul>' + items.join('') + '</ul>');
        continue;
      }
      if(/^\s*\d+\.\s+/.test(line)){
        var oitems = [];
        while(i < n && /^\s*\d+\.\s+/.test(lines[i])){
          oitems.push('<li>' + inlineFull(lines[i].replace(/^\s*\d+\.\s+/, '')) + '</li>');
          i++;
        }
        out.push('<ol>' + oitems.join('') + '</ol>');
        continue;
      }
      var para = [line];
      i++;
      while(i < n && lines[i].trim() !== '' && !/^```/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
            !/^\s*-{3,}\s*$/.test(lines[i]) && !/^\s*-\s+/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i])){
        para.push(lines[i]); i++;
      }
      out.push('<p>' + inlineFull(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  // ---------------------------------------------------------------------
  // AI study assistant (local Ollama, no data leaves the machine)
  // ---------------------------------------------------------------------
  var SYSTEM_PROMPT = [
    "Sei un tutor tecnico che aiuta a studiare per la certificazione eJPTv2 (INE Junior Penetration Tester: networking, host,",
    "web e Metasploit di base).",
    "Chi ti parla sta studiando su materiale didattico autorizzato (un cheatsheet personale) in un contesto di",
    "sicurezza offensiva autorizzata (lab, CTF, esame di certificazione). Spiega comandi, payload e concetti con",
    "chiarezza pedagogica: cosa fa il codice, riga per riga se utile, perche funziona, in quali condizioni, e quali",
    "errori comuni evitare. Rispondi in italiano, in modo conciso ma completo. Se la domanda esce dal contesto della",
    "pagina fornita, rispondi comunque ma segnalalo brevemente. Non aggiungere disclaimer superflui: il contesto",
    "educativo/autorizzato e gia stabilito."
  ].join(' ');

  var aiToggle = document.getElementById('ai-toggle');
  var aiPanel = document.getElementById('ai-panel');
  var aiClose = document.getElementById('ai-close');
  var aiClear = document.getElementById('ai-clear');
  var aiModelSel = document.getElementById('ai-model');
  var aiEndpointInput = document.getElementById('ai-endpoint');
  var aiContextPage = document.getElementById('ai-context-page');
  var aiSetup = document.getElementById('ai-setup');
  var aiSetupCmd = document.getElementById('ai-setup-cmd');
  var aiRetry = document.getElementById('ai-retry');
  var aiMessagesEl = document.getElementById('ai-messages');
  var aiEmpty = document.getElementById('ai-empty');
  var aiInput = document.getElementById('ai-input');
  var aiSend = document.getElementById('ai-send');
  var aiStop = document.getElementById('ai-stop');

  var aiHistory = [];
  var aiController = null;
  var aiConnected = false;

  try {
    var savedEndpoint = localStorage.getItem('ewpt-ai-endpoint');
    if(savedEndpoint) aiEndpointInput.value = savedEndpoint;
  } catch(e){}

  function updateContextLabel(){
    var page = PAGES[CURRENT_PAGE_ID];
    aiContextPage.textContent = page ? page.title : '-';
  }

  function currentOrigin(){
    return location.origin || (location.protocol + '//' + location.host);
  }

  function aiBase(){
    return aiEndpointInput.value.replace(/\/+$/, '');
  }

  function setConnected(state){
    aiConnected = state;
    aiToggle.dataset.connected = state ? '1' : '0';
    aiSetup.classList.toggle('show', !state);
  }

  function checkConnection(){
    var base = aiBase();
    aiSetupCmd.textContent = 'OLLAMA_ORIGINS=' + currentOrigin() + ' ollama serve';
    return fetch(base + '/api/tags').then(function(r){
      if(!r.ok) throw new Error('bad status ' + r.status);
      return r.json();
    }).then(function(data){
      var models = (data && data.models) || [];
      aiModelSel.innerHTML = '';
      if(models.length === 0){
        var opt = document.createElement('option');
        opt.textContent = '(nessun modello scaricato — usa "ollama pull <modello>")';
        aiModelSel.appendChild(opt);
        setConnected(true);
        return;
      }
      models.forEach(function(m){
        var opt = document.createElement('option');
        opt.value = m.name;
        opt.textContent = m.name + (m.details && m.details.parameter_size ? ' (' + m.details.parameter_size + ')' : '');
        aiModelSel.appendChild(opt);
      });
      try {
        var savedModel = localStorage.getItem('ewpt-ai-model');
        if(savedModel && models.some(function(m){ return m.name === savedModel; })) aiModelSel.value = savedModel;
      } catch(e){}
      setConnected(true);
    }).catch(function(){
      setConnected(false);
    });
  }

  function truncateText(text, max){
    if(text.length <= max) return text;
    return text.slice(0, max) + '\n\n[...pagina troncata per non sovraccaricare il modello locale...]';
  }

  function appendMessage(role, initialText){
    aiEmpty.style.display = 'none';
    var el = document.createElement('div');
    el.className = 'ai-msg ' + role + (initialText === '' ? ' pending' : '');
    if(role === 'user'){
      el.textContent = initialText;
    } else {
      el.innerHTML = initialText ? markdownToHtml(initialText) : 'Sto pensando…';
    }
    aiMessagesEl.appendChild(el);
    aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;
    return el;
  }

  function setSending(isSending){
    aiSend.disabled = isSending;
    aiStop.style.display = isSending ? 'inline-block' : 'none';
    aiInput.disabled = isSending;
  }

  function sendMessage(){
    var text = aiInput.value.trim();
    if(!text || aiController) return;
    if(!aiModelSel.value){ checkConnection(); return; }

    aiHistory.push({role: 'user', content: text});
    appendMessage('user', text);
    aiInput.value = '';
    aiInput.style.height = 'auto';

    var page = PAGES[CURRENT_PAGE_ID];
    var contextMsg = page
      ? 'Contesto — contenuto della pagina attualmente aperta ("' + page.title + '"):\n\n' + truncateText(page.raw || '', 6000)
      : 'Nessuna pagina specifica aperta al momento.';

    var messages = [
      {role: 'system', content: SYSTEM_PROMPT},
      {role: 'system', content: contextMsg}
    ].concat(aiHistory);

    var bubble = appendMessage('assistant', '');
    var accumulated = '';
    aiController = new AbortController();
    setSending(true);

    fetch(aiBase() + '/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      signal: aiController.signal,
      body: JSON.stringify({
        model: aiModelSel.value,
        messages: messages,
        stream: true,
        options: {num_predict: 700, temperature: 0.3}
      })
    }).then(function(r){
      if(!r.ok || !r.body) throw new Error('bad status ' + r.status);
      var reader = r.body.getReader();
      var decoder = new TextDecoder();
      var buf = '';
      function pump(){
        return reader.read().then(function(res){
          if(res.done) return;
          buf += decoder.decode(res.value, {stream: true});
          var lines = buf.split('\n');
          buf = lines.pop();
          lines.forEach(function(line){
            line = line.trim();
            if(!line) return;
            try {
              var obj = JSON.parse(line);
              if(obj.message && obj.message.content){
                accumulated += obj.message.content;
                bubble.classList.remove('pending');
                bubble.innerHTML = markdownToHtml(accumulated);
                aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;
              }
            } catch(e){ /* ignore partial/non-JSON line */ }
          });
          return pump();
        });
      }
      return pump();
    }).catch(function(err){
      if(err && err.name === 'AbortError'){
        if(!accumulated) bubble.innerHTML = '<em>Risposta interrotta.</em>';
      } else {
        bubble.classList.remove('pending');
        bubble.innerHTML = '<em>Errore di comunicazione con Ollama: ' + escapeHtml(String(err && err.message || err)) + '</em>';
        setConnected(false);
      }
    }).then(function(){
      if(accumulated) aiHistory.push({role: 'assistant', content: accumulated});
      aiController = null;
      setSending(false);
      aiInput.focus();
    });
  }

  aiToggle.addEventListener('click', function(){
    aiPanel.classList.add('open');
    updateContextLabel();
    if(!aiConnected) checkConnection();
    aiInput.focus();
  });
  aiClose.addEventListener('click', function(){ aiPanel.classList.remove('open'); });
  aiRetry.addEventListener('click', function(){ checkConnection(); });
  aiClear.addEventListener('click', function(){
    aiHistory = [];
    aiMessagesEl.innerHTML = '';
    aiMessagesEl.appendChild(aiEmpty);
    aiEmpty.style.display = 'block';
  });
  aiSend.addEventListener('click', sendMessage);
  aiStop.addEventListener('click', function(){ if(aiController) aiController.abort(); });
  aiInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); }
  });
  aiInput.addEventListener('input', function(){
    aiInput.style.height = 'auto';
    aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + 'px';
  });
  aiModelSel.addEventListener('change', function(){
    try { localStorage.setItem('ewpt-ai-model', aiModelSel.value); } catch(e){}
  });
  aiEndpointInput.addEventListener('change', function(){
    try { localStorage.setItem('ewpt-ai-endpoint', aiEndpointInput.value); } catch(e){}
    checkConnection();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && aiPanel.classList.contains('open') && document.activeElement !== aiInput){
      aiPanel.classList.remove('open');
    }
  });

  // ---- init ----
  buildTree();
  renderPage(currentIdFromHash());
})();
</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
