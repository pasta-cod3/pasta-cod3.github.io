---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "eJPT Cheatsheet: Main Index"
permalink: "/cheatsheet/ejpt/"
section: "Guida"
section_order: -1
order: 0
sort_key: -100
---

Guida di studio completa per la certificazione **eJPTv2** (INE, ex eLearnSecurity Junior Penetration Tester), livello entry-level/associate: il primo gradino delle certificazioni pratiche di pentesting. Copre l'intero blueprint d'esame, dai fondamentali di rete a information gathering, network/host attack, Metasploit e i primi attacchi web.

> **In breve:** 14 sezioni tematiche, ogni tecnica con obiettivo, comandi verificati e payload pronti all'uso — più lab hands-on e checklist di progresso per sapere sempre a che punto sei.

> Pronto per il livello successivo? **[eWPT v2: Main Index](/cheatsheet/ewpt/)** copre web application penetration testing avanzato.

---

## Per iniziare

1. **Ti mancano le basi (networking, Windows/Linux, crittografia)?** Parti da [00: Fundamentals](/cheatsheet/ejpt/00-fundamentals/01-cybersecurity-concepts/).
2. **Vuoi subito un flusso pratico su una rete target?** Vai al [Quick Start: Flusso Rapido (30 min)](/cheatsheet/ejpt/quick-start/).

---

## Per argomento (fasi dell'assessment)

| # | Sezione | Contenuto |
|---|---------|-----------|
| 01 | [Information Gathering](/cheatsheet/ejpt/01-information-gathering/01-passive-recon-osint/) | OSINT passivo, recon attivo, dorking |
| 02 | [Footprinting & Scanning](/cheatsheet/ejpt/02-footprinting-scanning/01-nmap-fundamentals/) | Nmap, host discovery, port scan, OS detection |
| 03 | [Enumeration](/cheatsheet/ejpt/03-enumeration/01-smb-netbios-enumeration/) | SMB, FTP, SSH, SNMP, web, NFS/RPC, SMTP/DNS |
| 04 | [Vulnerability Assessment](/cheatsheet/ejpt/04-vulnerability-assessment/01-vulnerability-scanning-nessus/) | Nessus, NSE, CVE/CVSS |
| 05 | [System/Host Attacks](/cheatsheet/ejpt/05-system-host-attacks/01-windows-host-attacks/) | Attacchi Windows/Linux, password attack, credential dumping |
| 06 | [Network Attacks](/cheatsheet/ejpt/06-network-attacks/01-mitm-arp-spoofing/) | MITM/ARP spoofing, sniffing, Responder, DNS attack |
| 07 | [Metasploit Framework](/cheatsheet/ejpt/07-metasploit-framework/01-msfconsole-basics/) | msfconsole, auxiliary, exploit, meterpreter/msfvenom |
| 08 | [Exploitation & Post-Ex](/cheatsheet/ejpt/08-exploitation-postex/01-manual-exploitation-searchsploit/) | Exploit manuale, reverse/bind shell, privesc, pivoting, trasferimento file, persistenza |
| 09 | [Social Engineering](/cheatsheet/ejpt/09-social-engineering/01-phishing-basics/) | Phishing, SET toolkit |
| 10 | [Web Application Attacks](/cheatsheet/ejpt/10-web-application-attacks/01-web-fundamentals-http/) | HTTP, SQLi, XSS, LFI/RFI, command injection, Burp |

---

## Risorse trasversali

- [11: Tools Reference](/cheatsheet/ejpt/11-tools-reference/nmap-metasploit-quick-reference/): scripting, wordlist, quick reference Nmap/Metasploit
- [12: Reporting Notes](/cheatsheet/ejpt/12-reporting-notes/executive-summary-template/): template executive summary, tip di report writing

## Pratica

- [13: Lab Walkthroughs](/cheatsheet/ejpt/13-lab-walkthroughs/exam-tips-ejptv2/): metodologia lab INE, piattaforme di pratica, tip d'esame

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

1. **L'esame è pratico, non a domande**: lavori dentro una rete simulata (INE PTS) e rispondi a flag/domande basate su ciò che trovi
2. **Enumerazione sistematica prima di tutto**: mappa l'intera rete (host, porte, servizi) prima di lanciare exploit
3. **Metasploit è centrale**: msfconsole, search, use, set, exploit/run vanno a memoria
4. **Non tutte le macchine sono exploit "flashy"**: spesso è credential reuse, share SMB leggibili, servizi mal configurati
5. **Tieni una nota (anche solo testuale) di IP, porte, servizi, credenziali trovate**: l'esame copre più host, è facile perdere il filo

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
- [ ] 5+ macchine/lab completate (vedi [Lab Walkthroughs](/cheatsheet/ejpt/13-lab-walkthroughs/exam-tips-ejptv2/))
- [ ] Pronto per l'esame

---

## Come usare questo cheatsheet

Naviga tra le sezioni dalla sidebar qui a fianco: ogni pagina è indipendente, puoi partire da dove ti serve o seguirle in ordine per uno studio strutturato. I link incrociati dentro ogni pagina ("vedi anche", "prossimo step") ti portano direttamente alla tecnica correlata quando serve una base che non hai ancora ripassato.

---

*Ultimo aggiornamento: Settembre 2026*
