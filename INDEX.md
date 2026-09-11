# eJPT Cheatsheet — Main Index

Guida di studio completa per la certificazione **eJPTv2** (INE, ex eLearnSecurity Junior Penetration Tester), livello entry-level/associate. Copre l'intero blueprint d'esame: information gathering, network/host attack, Metasploit, web attack di base.

> Pronto per il livello successivo? Vedi il cheatsheet collegato: **[eWPT v2 — Main Index](../eWPT_cheatsheet/INDEX.md)** (cartella sorella `eWPT_cheatsheet/`, web application penetration testing avanzato).

---

## Per iniziare

- [Quick Start (30 min)](QUICK-START.md) — flusso rapido per orientarti subito
- [00 — Fundamentals](00-Fundamentals/) — networking, Linux, Windows, crittografia di base

---

## Per argomento (fasi dell'assessment)

| # | Sezione | Contenuto |
|---|---------|-----------|
| 01 | [Information Gathering](01-Information-Gathering/) | OSINT passivo, recon attivo, dorking |
| 02 | [Footprinting & Scanning](02-Footprinting-Scanning/) | Nmap, host discovery, port scan, OS detection |
| 03 | [Enumeration](03-Enumeration/) | SMB, FTP, SSH, SNMP, web, NFS/RPC, SMTP/DNS |
| 04 | [Vulnerability Assessment](04-Vulnerability-Assessment/) | Nessus, NSE, CVE/CVSS |
| 05 | [System/Host Attacks](05-System-Host-Attacks/) | Attacchi Windows/Linux, password attack, credential dumping |
| 06 | [Network Attacks](06-Network-Attacks/) | MITM/ARP spoofing, sniffing, Responder, DNS attack |
| 07 | [Metasploit Framework](07-Metasploit-Framework/) | msfconsole, auxiliary, exploit, meterpreter/msfvenom |
| 08 | [Exploitation & Post-Ex](08-Exploitation-PostEx/) | Exploit manuale, reverse/bind shell, privesc, pivoting, persistenza |
| 09 | [Social Engineering](09-Social-Engineering/) | Phishing, SET toolkit |
| 10 | [Web Application Attacks](10-Web-Application-Attacks/) | HTTP, SQLi, XSS, LFI/RFI, command injection, Burp |

---

## Risorse trasversali

- [11 — Tools Reference](11-Tools-Reference/) — scripting, wordlist, quick reference Nmap/Metasploit
- [12 — Reporting Notes](12-Reporting-Notes/) — template executive summary, tip di report writing

## Pratica

- [13 — Lab Walkthroughs](13-Lab-Walkthroughs/) — metodologia lab INE, piattaforme di pratica, tip d'esame

---

## Study Timeline (2-3h/giorno)

| Settimana | Focus |
|-----------|-------|
| 1 | Fundamentals + Information Gathering + Footprinting/Scanning |
| 2 | Enumeration + Vulnerability Assessment |
| 3 | System/Host Attacks + Network Attacks |
| 4 | Metasploit Framework + Exploitation/Post-Ex |
| 5 | Social Engineering + Web Application Attacks |
| 6 | Lab practice (INE PTS/attack box) + ripasso finale |

---

## Exam Tips

1. **L'esame è pratico, non a domande** — lavori dentro una rete simulata (INE PTS) e rispondi a flag/domande basate su ciò che trovi
2. **Enumerazione sistematica prima di tutto** — mappa l'intera rete (host, porte, servizi) prima di lanciare exploit
3. **Metasploit è centrale** — msfconsole, search, use, set, exploit/run vanno a memoria
4. **Non tutte le macchine sono exploit "flashy"** — spesso è credential reuse, share SMB leggibili, servizi mal configurati
5. **Tieni una nota (anche solo testuale) di IP, porte, servizi, credenziali trovate** — l'esame copre più host, è facile perdere il filo

---

## Progress Tracker

- [ ] Fundamentals completati
- [ ] Information Gathering + Footprinting/Scanning padroneggiati
- [ ] Enumeration (tutti i servizi principali) praticata
- [ ] Vulnerability Assessment (Nessus + NSE) capito
- [ ] System/Host Attacks (Windows + Linux) provati
- [ ] Network Attacks (MITM, sniffing, Responder) provati
- [ ] Metasploit Framework padroneggiato (auxiliary, exploit, meterpreter)
- [ ] Privilege escalation Windows e Linux praticata
- [ ] Pivoting/port forwarding capito
- [ ] Web Application Attacks di base praticati
- [ ] 5+ macchine/lab completate (vedi [Lab Walkthroughs](13-Lab-Walkthroughs/))
- [ ] Pronto per l'esame

---

## Come usare questo cheatsheet

- **Su CherryTree:** `Importa -> Nodi da cartella` puntando alla root di `eJPT_cheatsheet/` — ogni cartella diventa un nodo, ogni `.md` un sotto-nodo.
- **Da browser, file singolo (consigliato per uso quotidiano):** esegui una volta `python3 site/build_site.py`, poi apri semplicemente `site/index.html` a doppio click — funziona offline, senza server, sempre. Se modifichi i file `.md`, rilancia lo script per rigenerarlo.
- **Da browser, sempre aggiornato (per chi modifica spesso i file):** dalla cartella `eJPT_cheatsheet/` esegui `python3 -m http.server 8000`, poi apri `http://localhost:8000/site/index.html` — legge i `.md` live ad ogni ricarica, nessun passaggio di build.

Sidebar ad albero e ricerca full-text su titoli e contenuti (`Ctrl+K` per il focus rapido sulla ricerca).

> **Nota sul pulsante `[ cd ../eWPT ]`:** è un link relativo alla cartella sorella `eWPT_cheatsheet/`. Funziona sempre in modalità "doppio click" (file singolo). In modalità server locale funziona solo se avvii il server dalla cartella **padre** di entrambe (quella che contiene sia `eWPT_cheatsheet/` che `eJPT_cheatsheet/`): `python3 -m http.server 8000` da lì, poi apri `http://localhost:8000/eJPT_cheatsheet/site/index.html`. Se avvii il server dentro `eJPT_cheatsheet/` (come nell'istruzione sopra), il pulsante darà "file not found" perché il server non può servire file fuori dalla cartella da cui è stato avviato.

---

*Ultimo aggiornamento: Settembre 2026*
