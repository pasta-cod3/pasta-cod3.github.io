#!/usr/bin/env python3
"""Rigenera llms.txt dai front matter reali in _posts/ — non va piu' curato a
mano: elencava ~20 articoli su 157 ed era gia' disallineato.

Il campo categoria nel front matter di questo repo e' `cat:` (codice breve:
red/blue/storia/fond/news), non `category:`/`categories:` come in un
front matter Jekyll "di libreria" — verificato con
`grep -h '^cat:' _posts/*.md | sort -u` prima di scrivere questo script.
Stesso discorso per l'estratto: il campo e' `excerpt:` (presente su tutti
e 157 i post), non `description:` (un solo post outlier lo usa).

Il testo introduttivo e le pagine principali restano scritti qui (non sono
dati derivabili dai post): l'unica parte generata e' l'elenco articoli,
cosi' llms.txt resta un file "sola generazione", mai piu' editato a mano.
Rilancia questo script prima di ogni release di contenuti (vedi README).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "_posts"
SITE = "https://pasta-cod3.github.io"

# Stesso ordine e stesse etichette usati nel resto del sito (sidebar-cats
# in index.html, CAT_LABEL in js/main.js): red, blue, storia, news, fond.
CATS = [
    ("red",    "Red Team — tecniche offensive"),
    ("blue",   "Blue Team — difesa e detection"),
    ("storia", "Storia della cybersecurity"),
    ("news",   "Notizie"),
    ("fond",   "Fondamentali"),
]

FM_RE = re.compile(r"^---\n(.*?)\n---", re.S)


def field(fm, key):
    m = re.search(rf"^{key}:\s*(.+)$", fm, re.M)
    if not m:
        return ""
    return m.group(1).strip().strip('"').strip("'")


def slug_from_filename(name):
    # YYYY-MM-DD-slug-con-eventuali-trattini.md -> slug-con-eventuali-trattini
    return name.split("-", 3)[-1].removesuffix(".md")


HEADER = """# pasta-cod3

> Blog italiano di cybersecurity scritto da stewe (stewe.sec): penetration testing, red team, blue team, fondamentali di sicurezza informatica, storia dell'hacking e notizie dal settore. Contenuti tecnici e pratici, orientati a chi studia o lavora nell'offensive/defensive security.

Il sito e' organizzato in cinque categorie: Red Team (tecniche offensive e pentest), Blue Team (difesa, SOC, detection), Storia (eventi ed episodi storici della cybersecurity), Notizie (attualita' cybersecurity, prevalentemente Italia ed Europa) e Fondamentali (concetti di base: reti, crittografia, protocolli).

## Pagine principali

- [Home]({SITE}/): elenco di tutti gli articoli, filtrabili per categoria e ricercabili
- [Chi sono]({SITE}/about.html): profilo dell'autore, certificazioni (eJPTv2, in corso eWPTv2), percorso professionale
- [Contatti]({SITE}/contatti.html): email di contatto e canali social
""".format(SITE=SITE)


def main():
    buckets = {cat: [] for cat, _ in CATS}
    skipped = []

    for md in sorted(POSTS_DIR.glob("*.md"), reverse=True):
        text = md.read_text(encoding="utf-8")
        m = FM_RE.match(text)
        if not m:
            skipped.append(md.name)
            continue
        fm = m.group(1)
        title = field(fm, "title")
        cat = field(fm, "cat").lower()
        excerpt = field(fm, "excerpt")
        slug = slug_from_filename(md.name)

        if cat not in buckets:
            skipped.append(f"{md.name} (cat '{cat}' sconosciuta)")
            continue

        line = f"- [{title}]({SITE}/posts/{slug}.html)"
        if excerpt:
            line += f": {excerpt}"
        buckets[cat].append(line)

    out = [HEADER]
    total = 0
    for cat, heading in CATS:
        if not buckets[cat]:
            continue
        out.append(f"## {heading}\n")
        out.extend(buckets[cat])
        out.append("")
        total += len(buckets[cat])

    (ROOT / "llms.txt").write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")
    print(f"llms.txt rigenerato: {total} articoli su {len(list(POSTS_DIR.glob('*.md')))} in _posts/")
    if skipped:
        print("Saltati (front matter mancante o cat sconosciuta):")
        for s in skipped:
            print(f"  - {s}")


if __name__ == "__main__":
    main()
