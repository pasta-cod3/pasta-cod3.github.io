# HTB: Bounty (Walkthrough Notes)

**Difficulty:** Easy
**Time to root (stimato):** 1-1.5h
**Vulnerability:** File upload bypass (estensione alternativa) -> webshell ASP -> privesc locale

---

## Obiettivo

Bounty ti insegna una lezione che ti torna utile in ogni test di upload da qui in avanti: bloccare `.aspx` sembra sufficiente finché non scopri che IIS esegue tranquillamente anche altre estensioni a cui nessuno pensa. È una macchina Windows/IIS classica, breve ma diretta: bypassa il filtro, carica la webshell, poi trova il privilegio locale che ti porta a root.

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
Cerca funzionalità di upload file (spesso un form "transfer.aspx" o simile).

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
- `web.config` può essere un vettore di RCE su IIS anche quando `.aspx` è bloccato
- Verifica sempre i privilegi del token utente (`whoami /priv`) appena ottenuta esecuzione

---

## Connessioni

- **Combinazione con:** [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md), [08-Exploitation-PostEx/05-Privilege-Escalation.md](../08-Exploitation-PostEx/05-Privilege-Escalation.md)

