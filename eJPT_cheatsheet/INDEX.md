# eJPT Cheatsheet: Main Index

Guida di studio completa per la certificazione **eJPTv2** (INE, ex eLearnSecurity Junior Penetration Tester), livello entry-level/associate: il primo gradino delle certificazioni pratiche di pentesting. Copre l'intero blueprint d'esame, dai fondamentali di rete a information gathering, network/host attack, Metasploit e i primi attacchi web.

> **In breve:** 14 sezioni tematiche, ogni tecnica con obiettivo, comandi verificati e payload pronti all'uso — più lab hands-on e checklist di progresso per sapere sempre a che punto sei.

> Pronto per il livello successivo? **[eWPT v2: Main Index](../eWPT_cheatsheet/INDEX.md)** copre web application penetration testing avanzato.

---

## Per iniziare

1. **Ti mancano le basi (networking, Windows/Linux, crittografia)?** Parti da [00: Fundamentals](00-Fundamentals/).
2. **Vuoi subito un flusso pratico su una rete target?** Vai al [Quick Start: Flusso Rapido (30 min)](QUICK-START.md).

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
| 08 | [Exploitation & Post-Ex](08-Exploitation-PostEx/) | Exploit manuale, reverse/bind shell, privesc, pivoting, trasferimento file, persistenza |
| 09 | [Social Engineering](09-Social-Engineering/) | Phishing, SET toolkit |
| 10 | [Web Application Attacks](10-Web-Application-Attacks/) | HTTP, SQLi, XSS, LFI/RFI, command injection, Burp |

---

## Risorse trasversali

- [11: Tools Reference](11-Tools-Reference/): scripting, wordlist, quick reference Nmap/Metasploit
- [12: Reporting Notes](12-Reporting-Notes/): template executive summary, tip di report writing

## Pratica

- [13: Lab Walkthroughs](13-Lab-Walkthroughs/): metodologia lab INE, piattaforme di pratica, tip d'esame

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
- [ ] 5+ macchine/lab completate (vedi [Lab Walkthroughs](13-Lab-Walkthroughs/))
- [ ] Pronto per l'esame

---

## Come usare questo cheatsheet

Naviga tra le sezioni dalla sidebar qui a fianco: ogni pagina è indipendente, puoi partire da dove ti serve o seguirle in ordine per uno studio strutturato. I link incrociati dentro ogni pagina ("vedi anche", "prossimo step") ti portano direttamente alla tecnica correlata quando serve una base che non hai ancora ripassato.

---

*Ultimo aggiornamento: Settembre 2026*
