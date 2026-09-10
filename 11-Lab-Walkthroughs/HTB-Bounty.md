# HTB — Bounty (Walkthrough Notes)

**Difficulty:** Easy
**Time to root (stimato):** 1-1.5h
**Vulnerability:** File upload bypass (estensione alternativa) -> webshell ASP -> privesc locale

---

## Obiettivo

Macchina Windows/IIS classica per esercitarsi sul bypass di un upload filter che blocca `.aspx` ma non estensioni alternative eseguibili da IIS, seguito da una privilege escalation locale nota.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon
```bash
nmap -p- --min-rate=5000 -sV -sC target.com
```
Aspettati IIS (porta 80) come servizio principale.

### 2. Enumerazione web
```bash
gobuster dir -u http://target.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x aspx,asp,txt,config
```
Cerca funzionalita di upload file (spesso un form "transfer.aspx" o simile).

### 3. Bypass upload filter
Se `.aspx`/`.asp` sono bloccati, prova estensioni alternative eseguibili da IIS legacy come `.config` (vedi [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md)):
```
web.config con handler personalizzato che esegue codice
```
Consulta la sezione file-upload per la lista completa di tecniche di bypass da provare sistematicamente.

### 4. Webshell e RCE
Una volta caricato un file eseguibile, ottieni RCE tramite richiesta HTTP verso il path del file caricato.

### 5. Privilege escalation
Enumera con WinPEAS/manualmente: privilegi di processo, servizi con permessi deboli, `whoami /priv` per token privilege sfruttabili (es. SeImpersonatePrivilege -> tecniche note di abuso token Windows).

---

## Key Lessons

- Le blacklist di estensione IIS vanno testate sistematicamente con l'intera lista di [01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md)
- `web.config` puo essere un vettore di RCE su IIS anche quando `.aspx` e bloccato
- Verifica sempre i privilegi del token utente (`whoami /priv`) appena ottenuta esecuzione

---

## Connessioni

- **Combinazione con:** [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md), [08-Exploitation-PostEx/05-Privilege-Escalation.md](../08-Exploitation-PostEx/05-Privilege-Escalation.md)

---

## Note personali

_(annota qui i tuoi comandi esatti e le differenze rispetto a queste note generiche)_
