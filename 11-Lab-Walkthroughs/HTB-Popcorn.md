# HTB — Popcorn (Walkthrough Notes)

**Difficulty:** Medium
**Time to root (stimato):** 2h
**Vulnerability:** Upload di file torrent malevolo su applicazione web -> RCE, poi privesc kernel locale

---

## Obiettivo

Macchina Linux che combina enumerazione web classica, un upload abuse su un'applicazione di file sharing, e una privilege escalation basata su un exploit kernel noto — buon esercizio per la chain completa upload-to-root.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon e web enumeration
```bash
nmap -p- --min-rate=5000 -sV -sC target.com
gobuster dir -u http://target.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```
Aspettati un'applicazione web di file sharing/torrent tracker.

### 2. Identificazione funzionalita di upload
Cerca form che permettono upload di file (es. immagine di anteprima per un torrent) — candidato diretto per [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md).

### 3. Bypass controllo tipo file
Applica sistematicamente le tecniche di bypass upload (double extension, polyglot, MIME type spoofing) per caricare una webshell PHP.

### 4. RCE e reverse shell
Una volta ottenuta esecuzione tramite la webshell, ottieni una reverse shell interattiva completa (vedi [08-Exploitation-PostEx/03-Reverse-Shells.md](../08-Exploitation-PostEx/03-Reverse-Shells.md)).

### 5. Privilege escalation
```bash
uname -a
```
Verifica versione kernel e cerca exploit noti corrispondenti con `searchsploit`/linux-exploit-suggester, seguendo la metodologia di [08-Exploitation-PostEx/05-Privilege-Escalation.md](../08-Exploitation-PostEx/05-Privilege-Escalation.md).

---

## Key Lessons

- Le applicazioni di file sharing spesso hanno funzionalita di upload multiple (avatar, anteprima, allegati): mappale tutte, non fermarti alla prima trovata
- Un kernel Linux datato e sempre un candidato per privesc rapida: controlla `uname -a` come primo passo dopo l'esecuzione iniziale
- La chain completa (upload -> webshell -> reverse shell -> privesc kernel) e uno scenario ricorrente in eWPT

---

## Connessioni

- **Combinazione con:** [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md), [08-Exploitation-PostEx/05-Privilege-Escalation.md](../08-Exploitation-PostEx/05-Privilege-Escalation.md)

---

## Note personali

_(annota qui i tuoi comandi esatti e le differenze rispetto a queste note generiche)_
