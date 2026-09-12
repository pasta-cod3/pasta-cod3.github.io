#!/usr/bin/env python3
"""
Rigenera _cheatsheets/{ejpt,ewpt}/ a partire dai progetti sorgente
eJPT_cheatsheet/ ed eWPT_cheatsheet/ (importati come git subtree dentro
questo stesso repo), aggiungendo il front matter Jekyll e riscrivendo
i link interni relativi (*.md) in permalink assoluti (/cheatsheet/...).

Uso: python3 scripts/sync_cheatsheets.py [--dry-run]

Regole di conversione (dedotte dal mirror esistente, generato manualmente
in una sessione precedente):
  - layout: sempre "cheatsheet"
  - cert / cert_label: ejpt/eJPT o ewpt/eWPT
  - title: la riga H1 del file sorgente ("# Titolo" -> "Titolo"), che viene
    RIMOSSA dal body (il layout la renderizza da front matter)
  - permalink:
      INDEX.md        -> /cheatsheet/<cert>/
      QUICK-START.md  -> /cheatsheet/<cert>/quick-start/
      altro           -> /cheatsheet/<cert>/<sezione-slug>/<file-slug>/
  - section / section_order: nome e numero della cartella (00-13 eJPT,
    00-11 eWPT); Guida (index/quick-start) = -1
  - order: prefisso numerico del file; Lab-Challenges.md = 99; per la
    sezione "Lab Walkthroughs" ogni file (numerato o no) = 50; index=0,
    quick-start=1
  - sort_key: section_order*100 + order
  - Se il file mirror esiste già, il front matter esistente viene
    riusato COSÌ COM'È (è dati curati che le modifiche di tono di oggi
    non hanno toccato) — solo il body viene rigenerato dal sorgente
    aggiornato. Il front matter viene ricostruito da zero solo per i
    file che non hanno ancora un mirror.
"""
import re
import sys
import pathlib

SITE = pathlib.Path(__file__).resolve().parents[1]
MIRROR_ROOT = SITE / "_cheatsheets"

PROJECTS = {
    "ejpt": SITE / "eJPT_cheatsheet",
    "ewpt": SITE / "eWPT_cheatsheet",
}
CERT_LABEL = {"ejpt": "eJPT", "ewpt": "eWPT"}

SECTION_NAMES = {
    "ejpt": {
        "00-fundamentals": "Fundamentals",
        "01-information-gathering": "Information Gathering",
        "02-footprinting-scanning": "Footprinting & Scanning",
        "03-enumeration": "Enumeration",
        "04-vulnerability-assessment": "Vulnerability Assessment",
        "05-system-host-attacks": "System & Host Attacks",
        "06-network-attacks": "Network Attacks",
        "07-metasploit-framework": "Metasploit Framework",
        "08-exploitation-postex": "Exploitation & Post-Ex",
        "09-social-engineering": "Social Engineering",
        "10-web-application-attacks": "Web Application Attacks",
        "11-tools-reference": "Tools Reference",
        "12-reporting-notes": "Reporting Notes",
        "13-lab-walkthroughs": "Lab Walkthroughs",
    },
    "ewpt": {
        "00-fundamentals": "Fundamentals",
        "01-reconnaissance": "Reconnaissance",
        "02-scanning-enumeration": "Scanning & Enumeration",
        "03-file-inclusion": "File Inclusion",
        "04-sql-injection": "SQL Injection",
        "05-cross-site-scripting": "Cross-Site Scripting",
        "06-authentication-authorization": "Authentication & Authorization",
        "07-business-logic": "Business Logic",
        "08-exploitation-postex": "Exploitation & Post-Ex",
        "09-tools-reference": "Tools Reference",
        "10-reporting-notes": "Reporting Notes",
        "11-lab-walkthroughs": "Lab Walkthroughs",
    },
}
WALKTHROUGH_SECTION_SLUG = "lab-walkthroughs"  # suffisso comune alle chiavi sopra (13- / 11-)

EXCLUDE_NAMES = {"REVIEW-PROMPT.md"}
EXCLUDE_SUFFIX = ("Generator-Prompt.md",)


def is_excluded(path: pathlib.Path) -> bool:
    if "site" in path.parts:
        return True
    if path.name in EXCLUDE_NAMES:
        return True
    if any(path.name.endswith(s) for s in EXCLUDE_SUFFIX):
        return True
    return False


def leading_number(stem: str) -> int:
    m = re.match(r"(\d+)-", stem)
    return int(m.group(1)) if m else None


class FileInfo:
    def __init__(self, cert, src_path: pathlib.Path):
        self.cert = cert
        self.src_path = src_path
        self.is_index = src_path.name == "INDEX.md"
        self.is_quickstart = src_path.name == "QUICK-START.md"
        rel = src_path.relative_to(PROJECTS[cert])

        if self.is_index or self.is_quickstart:
            self.section_slug = None
            self.section_name = "Guida"
            self.section_order = -1
            self.order = 0 if self.is_index else 1
            self.file_slug = "index" if self.is_index else "quick-start"
            self.mirror_rel = pathlib.Path(f"{self.file_slug}.md")
            self.permalink = f"/cheatsheet/{cert}/" if self.is_index else f"/cheatsheet/{cert}/quick-start/"
        else:
            section_dir = rel.parts[0]
            self.section_slug = section_dir.lower()
            if self.section_slug not in SECTION_NAMES[cert]:
                raise ValueError(f"Sezione sconosciuta: {cert}/{section_dir}")
            self.section_name = SECTION_NAMES[cert][self.section_slug]
            self.section_order = int(self.section_slug.split("-", 1)[0])
            self.file_slug = src_path.stem.lower()
            self.mirror_rel = pathlib.Path(self.section_slug) / f"{self.file_slug}.md"
            self.permalink = f"/cheatsheet/{cert}/{self.section_slug}/{self.file_slug}/"

            if src_path.stem == "Lab-Challenges":
                self.order = 99
            else:
                n = leading_number(src_path.stem)
                # file senza prefisso numerico (walkthrough, tools reference,
                # reporting notes...): ordine piatto a 50, come nel mirror esistente
                self.order = n if n is not None else 50

        self.sort_key = self.section_order * 100 + self.order
        self.mirror_path = MIRROR_ROOT / cert / self.mirror_rel

    def read_text(self):
        return self.src_path.read_text(encoding="utf-8")


def collect_registry():
    by_abs_path = {}
    by_abs_dir = {}  # dir -> list of FileInfo (per trovare il file con order minore)
    all_infos = []

    for cert, proj_dir in PROJECTS.items():
        for src in sorted(proj_dir.rglob("*.md")):
            if is_excluded(src.relative_to(proj_dir)):
                continue
            info = FileInfo(cert, src)
            all_infos.append(info)
            by_abs_path[src.resolve()] = info
            by_abs_dir.setdefault(src.parent.resolve(), []).append(info)

    # ordina ogni cartella per 'order' cosi' il primo elemento e' il target
    # dei link "a cartella" (es. [03-Enumeration](03-Enumeration/))
    first_in_dir = {
        d: min(infos, key=lambda i: i.order) for d, infos in by_abs_dir.items()
    }
    return all_infos, by_abs_path, first_in_dir


LINK_RE = re.compile(r"\[([^\]]*)\]\(([^)\s]+)\)")


def rewrite_links(text: str, current_src: pathlib.Path, by_abs_path, first_in_dir, unresolved):
    out_lines = []
    in_fence = False
    for line in text.split("\n"):
        if line.strip().startswith("```"):
            in_fence = not in_fence
            out_lines.append(line)
            continue
        if in_fence:
            out_lines.append(line)
            continue

        def repl(m):
            label, url = m.group(1), m.group(2)
            if url.startswith(("http://", "https://", "mailto:", "#", "/")):
                return m.group(0)
            clean = url.split("#", 1)[0]
            if not (clean.endswith(".md") or clean.endswith("/")):
                return m.group(0)
            target = (current_src.parent / clean).resolve()
            if clean.endswith("/"):
                info = first_in_dir.get(target)
                if info is None:
                    unresolved.append((str(current_src), url))
                    return m.group(0)
                return f"[{label}]({info.permalink})"
            else:
                info = by_abs_path.get(target)
                if info is None:
                    unresolved.append((str(current_src), url))
                    return m.group(0)
                return f"[{label}]({info.permalink})"

        out_lines.append(LINK_RE.sub(repl, line))
    return "\n".join(out_lines)


H1_RE = re.compile(r"\A# .+\n\n?")


def strip_h1(text: str):
    m = H1_RE.match(text)
    title = None
    if m:
        title = text[2:m.end()].split("\n", 1)[0].strip()
        text = text[m.end():]
    return title, text


def existing_front_matter(mirror_path: pathlib.Path):
    if not mirror_path.exists():
        return None
    text = mirror_path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---\n", 4)
    if end == -1:
        return None
    return text[: end + 5]  # include il secondo '---\n'


def build_front_matter(info: FileInfo, title: str):
    return (
        "---\n"
        "layout: cheatsheet\n"
        f"cert: {info.cert}\n"
        f'cert_label: "{CERT_LABEL[info.cert]}"\n'
        f'title: "{title}"\n'
        f'permalink: "{info.permalink}"\n'
        f'section: "{info.section_name}"\n'
        f"section_order: {info.section_order}\n"
        f"order: {info.order}\n"
        f"sort_key: {info.sort_key}\n"
        "---\n"
    )


def main():
    dry_run = "--dry-run" in sys.argv
    all_infos, by_abs_path, first_in_dir = collect_registry()

    unresolved = []
    written = 0
    new_files = 0

    for info in all_infos:
        raw = info.read_text()
        title, body = strip_h1(raw)
        body = rewrite_links(body, info.src_path, by_abs_path, first_in_dir, unresolved)
        body = body.rstrip("\n") + "\n"

        fm = existing_front_matter(info.mirror_path)
        if fm is None:
            if title is None:
                raise ValueError(f"Nessun H1 trovato in {info.src_path}, impossibile costruire il titolo")
            fm = build_front_matter(info, title)
            new_files += 1

        final_text = fm + "\n" + body

        if dry_run:
            print(f"[dry-run] {info.mirror_path.relative_to(SITE)}")
        else:
            info.mirror_path.parent.mkdir(parents=True, exist_ok=True)
            info.mirror_path.write_text(final_text, encoding="utf-8")
        written += 1

    print(f"File scritti: {written} (di cui nuovi: {new_files})")
    if unresolved:
        print(f"\nLink NON risolti ({len(unresolved)}) — lasciati invariati, da controllare a mano:")
        for src, url in unresolved:
            print(f"  {src} -> {url}")


if __name__ == "__main__":
    main()
