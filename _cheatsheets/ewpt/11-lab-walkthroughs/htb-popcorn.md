---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "HTB: Popcorn (Walkthrough Notes)"
permalink: "/cheatsheet/ewpt/11-lab-walkthroughs/htb-popcorn/"
section: "Lab Walkthroughs"
section_order: 11
order: 50
sort_key: 1150
---

**Difficulty:** Medium
**Time to root (stimato):** 2h
**Vulnerability:** Upload di file torrent malevolo su applicazione web -> RCE, poi privesc kernel locale

---

## Obiettivo

Popcorn è la macchina giusta per abituarti a pensare in termini di catena completa invece che di singola tecnica isolata: enumeri un'app di file sharing, trovi non uno ma potenzialmente più punti di upload, bypassi il controllo tipo file per arrivare a una webshell, e chiudi con un kernel exploit — la sequenza upload-to-root che ricapita più spesso di quanto pensi.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon e web enumeration
```bash
nmap -p- --min-rate=5000 -sV -sC target.com
gobuster dir -u http://target.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```
Aspettati un'applicazione web di file sharing/torrent tracker.

### 2. Identificazione funzionalità di upload
Cerca form che permettono upload di file (es. immagine di anteprima per un torrent): candidato diretto per [08-Exploitation-PostEx/01-File-Upload-Abuse.md](/cheatsheet/ewpt/08-exploitation-postex/01-file-upload-abuse/).

### 3. Bypass controllo tipo file
Applica sistematicamente le tecniche di bypass upload (double extension, polyglot, MIME type spoofing) per caricare una webshell PHP.

### 4. RCE e reverse shell
Una volta ottenuta esecuzione tramite la webshell, ottieni una reverse shell interattiva completa (vedi [08-Exploitation-PostEx/03-Reverse-Shells.md](/cheatsheet/ewpt/08-exploitation-postex/03-reverse-shells/)).

### 5. Privilege escalation
```bash
uname -a
```
Verifica versione kernel e cerca exploit noti corrispondenti con `searchsploit`/linux-exploit-suggester, seguendo la metodologia di [08-Exploitation-PostEx/05-Privilege-Escalation.md](/cheatsheet/ewpt/08-exploitation-postex/05-privilege-escalation/).

---

## Key Lessons

- Le applicazioni di file sharing spesso hanno funzionalità di upload multiple (avatar, anteprima, allegati): mappale tutte, non fermarti alla prima trovata
- Un kernel Linux datato è sempre un candidato per privesc rapida: controlla `uname -a` come primo passo dopo l'esecuzione iniziale
- La chain completa (upload -> webshell -> reverse shell -> privesc kernel) è uno scenario ricorrente in eWPT

---

## Connessioni

- **Combinazione con:** [08-Exploitation-PostEx/01-File-Upload-Abuse.md](/cheatsheet/ewpt/08-exploitation-postex/01-file-upload-abuse/), [08-Exploitation-PostEx/05-Privilege-Escalation.md](/cheatsheet/ewpt/08-exploitation-postex/05-privilege-escalation/)
