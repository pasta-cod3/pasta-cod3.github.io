# eWPT Cheatsheet — Main Index

Guida di studio completa per la certificazione **eWPT v2** (INE/OffSec), livello intermediate post-eJPTv2.

---

## Per iniziare

- [Quick Start (30 min)](QUICK-START.md) — flusso rapido per orientarti subito
- [00 — Fundamentals](00-Fundamentals/) — ripasso networking, HTTP, Linux, Burp Suite

---

## Per argomento (attack surface)

| # | Sezione | Contenuto |
|---|---------|-----------|
| 01 | [Reconnaissance](01-Reconnaissance/) | Footprinting, fingerprinting, OSINT, dorking |
| 02 | [Scanning & Enumeration](02-Scanning-Enumeration/) | Port scan, service detection, web/vhost/API enum |
| 03 | [File Inclusion](03-File-Inclusion/) | LFI/RFI, wrapper PHP, evasion filtri |
| 04 | [SQL Injection](04-SQL-Injection/) | Error/Union/Blind/Time-based, encoding, SQLMap |
| 05 | [Cross-Site Scripting](05-Cross-Site-Scripting/) | Reflected/Stored/DOM XSS, WAF evasion, cookie stealing |
| 06 | [Authentication & Authorization](06-Authentication-Authorization/) | Session, CSRF, IDOR, credential attacks, JWT |
| 07 | [Business Logic](07-Business-Logic/) | Logic flaws, race condition, timing, price manipulation |
| 08 | [Exploitation & Post-Ex](08-Exploitation-PostEx/) | File upload RCE, reverse shell, webshell, privesc |

---

## Risorse trasversali

- [09 — Tools Reference](09-Tools-Reference/) — Burp recipes, CLI tools, scripting, wordlist
- [10 — Reporting Notes](10-Reporting-Notes/) — template vulnerabilita, CVSS, checklist report

## Pratica

- [11 — Lab Walkthroughs](11-Lab-Walkthroughs/) — HTB, TryHackMe, PortSwigger, WebGoat

---

## Study Timeline (3-4h/giorno)

| Settimana | Focus |
|-----------|-------|
| 1-2 | Fundamentals + Reconnaissance + Scanning |
| 3-4 | File Inclusion + SQL Injection |
| 5-6 | XSS + Authentication/Authorization |
| 7-8 | Business Logic + Exploitation/Post-Ex |
| 9 | Lab practice + Reporting |

---

## Exam Tips

1. **Enumeration e l'80% della battaglia** — non correre verso l'exploit
2. **Manuale > automatico** — sqlmap/gobuster confermano, non sostituiscono la comprensione
3. **Documenta tutto mentre procedi** — screenshot, request/response, comandi esatti
4. **Leggi gli error message con attenzione** — spesso rivelano stack, path, DB engine
5. **Prova sempre l'IDOR e i controlli di autorizzazione** — spesso sottovalutati ma molto presenti in eWPT

---

## Progress Tracker

- [ ] Fundamentals completati
- [ ] Recon + Scanning padroneggiati
- [ ] SQLi (tutte le varianti) praticata
- [ ] XSS (tutte le varianti) praticata
- [ ] Authentication/Authorization flaw capiti
- [ ] Business Logic flaw capiti
- [ ] File Inclusion -> RCE chain provata
- [ ] 5+ lab machine completate (vedi [Lab Walkthroughs](11-Lab-Walkthroughs/))
- [ ] Report scritto e revisionato ([template](10-Reporting-Notes/Vulnerability-Template.md))
- [ ] Pronto per l'esame

---

## Come usare questo cheatsheet

- **Su CherryTree:** `Importa -> Nodi da cartella` puntando alla root di `eWPT_cheatsheet/` — ogni cartella diventa un nodo, ogni `.md` un sotto-nodo.
- **Da browser, file singolo (consigliato per uso quotidiano):** esegui una volta `python3 site/build_site.py`, poi apri semplicemente `site/eWPT-Site.html` a doppio click — funziona offline, senza server, sempre. Se modifichi i file `.md` (es. le sezioni "Note personali"), rilancia lo script per rigenerarlo.
- **Da browser, sempre aggiornato (per chi modifica spesso i file):** dalla cartella `eWPT_cheatsheet/` esegui `python3 -m http.server 8000`, poi apri `http://localhost:8000/site/index.html` — legge i `.md` live ad ogni ricarica, nessun passaggio di build.

Entrambe le versioni hanno sidebar ad albero e ricerca full-text su titoli e contenuti (`Ctrl+K` per il focus rapido sulla ricerca).

---

*Ultimo aggiornamento: Settembre 2026*
