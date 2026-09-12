---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "eWPT Cheatsheet: Main Index"
permalink: "/cheatsheet/ewpt/"
section: "Guida"
section_order: -1
order: 0
sort_key: -100
---

Guida di studio completa per la certificazione **eWPT v2** (INE/OffSec), livello intermediate post-eJPTv2: enumeration, file inclusion, SQL injection, XSS, autenticazione e business logic, fino a exploitation e reporting. Pensata per essere seguita in ordine come corso, o consultata al volo come reference durante un engagement.

> **In breve:** 12 sezioni tematiche, ogni tecnica con obiettivo, comandi verificati e payload pronti all'uso — più lab hands-on e walkthrough di macchine reali (HTB, TryHackMe, PortSwigger Academy).

> Cerchi la certificazione base? **[eJPTv2: Main Index](/cheatsheet/ejpt/)** copre i fondamentali di rete e host attack, propedeutici a questa guida.

---

## Per iniziare

1. **Ti mancano le basi (networking, HTTP, Burp Suite)?** Parti da [00: Fundamentals](/cheatsheet/ewpt/00-fundamentals/burp-suite-setup/).
2. **Vuoi subito un flusso pratico su un target web?** Vai al [Quick Start (30 min)](/cheatsheet/ewpt/quick-start/).

---

## Per argomento (attack surface)

| # | Sezione | Contenuto |
|---|---------|-----------|
| 01 | [Reconnaissance](/cheatsheet/ewpt/01-reconnaissance/01-footprinting/) | Footprinting, fingerprinting, OSINT, dorking |
| 02 | [Scanning & Enumeration](/cheatsheet/ewpt/02-scanning-enumeration/01-port-scanning/) | Port scan, service detection, web/vhost/API enum |
| 03 | [File Inclusion](/cheatsheet/ewpt/03-file-inclusion/01-lfi-basics/) | LFI/RFI, wrapper PHP, evasion filtri, SSRF, XXE |
| 04 | [SQL Injection](/cheatsheet/ewpt/04-sql-injection/01-sqli-fundamentals/) | Error/Union/Blind/Time-based, encoding, SQLMap |
| 05 | [Cross-Site Scripting](/cheatsheet/ewpt/05-cross-site-scripting/01-xss-fundamentals/) | Reflected/Stored/DOM XSS, WAF evasion, cookie stealing |
| 06 | [Authentication & Authorization](/cheatsheet/ewpt/06-authentication-authorization/01-session-management/) | Session, CSRF, IDOR, credential attacks, JWT, HTTP verb tampering |
| 07 | [Business Logic](/cheatsheet/ewpt/07-business-logic/01-logic-flaws/) | Logic flaws, race condition, timing, price manipulation |
| 08 | [Exploitation & Post-Ex](/cheatsheet/ewpt/08-exploitation-postex/01-file-upload-abuse/) | File upload RCE, reverse shell, webshell, privesc, CMS exploitation, insecure deserialization |

---

## Risorse trasversali

- [09: Tools Reference](/cheatsheet/ewpt/09-tools-reference/automation-scripts/): Burp recipes, CLI tools, scripting, wordlist
- [10: Reporting Notes](/cheatsheet/ewpt/10-reporting-notes/cvss-scoring/): template vulnerabilità, CVSS, checklist report

## Pratica

- [11: Lab Walkthroughs](/cheatsheet/ewpt/11-lab-walkthroughs/htb-beep/): HTB, TryHackMe, PortSwigger, WebGoat

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

1. **Enumeration è l'80% della battaglia**: non correre verso l'exploit
2. **Manuale > automatico**: sqlmap/gobuster confermano, non sostituiscono la comprensione
3. **Documenta tutto mentre procedi**: screenshot, request/response, comandi esatti
4. **Leggi gli error message con attenzione**: spesso rivelano stack, path, DB engine
5. **Prova sempre l'IDOR e i controlli di autorizzazione**: spesso sottovalutati ma molto presenti in eWPT

---

## Progress Tracker

- [ ] Fundamentals completati
- [ ] Recon + Scanning padroneggiati
- [ ] SQLi (tutte le varianti) praticata
- [ ] XSS (tutte le varianti) praticata
- [ ] Authentication/Authorization flaw capiti
- [ ] Business Logic flaw capiti
- [ ] File Inclusion -> RCE chain provata
- [ ] 5+ lab machine completate (vedi [Lab Walkthroughs](/cheatsheet/ewpt/11-lab-walkthroughs/htb-beep/))
- [ ] Report scritto e revisionato ([Vulnerability Report Template](/cheatsheet/ewpt/10-reporting-notes/vulnerability-template/))
- [ ] Pronto per l'esame

---

## Come usare questo cheatsheet

Naviga tra le sezioni dalla sidebar qui a fianco: ogni pagina è indipendente, puoi partire da dove ti serve o seguirle in ordine per uno studio strutturato. I link incrociati dentro ogni pagina ("vedi anche", "prossimo step") ti portano direttamente alla tecnica correlata quando serve una base che non hai ancora ripassato.

---

*Ultimo aggiornamento: Settembre 2026*
