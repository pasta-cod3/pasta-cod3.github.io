# HTB — Nibbles (Walkthrough Notes)

**Difficulty:** Easy
**Time to root (stimato):** 1-1.5h
**Vulnerability:** CMS con directory nascosta scoperta via fuzzing -> file upload senza restrizioni -> privesc via script eseguibile con sudo

---

## Obiettivo

Macchina Linux ottima per esercitarsi sull'importanza della directory/content discovery: l'applicazione principale non rivela nulla di interessante, ma una directory nascosta ospita un CMS vulnerabile.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon e prima occhiata
```bash
nmap -p- --min-rate=5000 -sV -sC target.com
curl -s http://target.com/ 
```
La pagina principale spesso appare vuota/minimale — non fermarti qui.

### 2. Content discovery approfondito
```bash
gobuster dir -u http://target.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```
Segui la metodologia di [02-Scanning-Enumeration/03-Web-Enumeration.md](../02-Scanning-Enumeration/03-Web-Enumeration.md) con pazienza: la directory chiave spesso non e nella wordlist "common" ma richiede una lista piu estesa.

### 3. Enumerazione del CMS trovato
Una volta trovata la directory nascosta, fingerprint del CMS/applicazione ospitata e ricerca di funzionalita di upload.

### 4. Upload senza restrizioni -> webshell
Se l'upload non applica alcun controllo su estensione/contenuto, carica direttamente una webshell PHP (vedi [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md) anche se qui il bypass potrebbe non essere nemmeno necessario).

### 5. Privilege escalation via sudo

```bash
sudo -l
```
Cerca uno script/binario eseguibile con sudo senza password: consulta [GTFOBins](https://gtfobins.github.io/) o analizza direttamente lo script per capire come iniettare comandi arbitrari eseguiti come root.

---

## Key Lessons

- Una homepage minimale non significa "nessuna superficie di attacco": la content discovery e sempre il passo successivo obbligato
- Non tutte le applicazioni implementano controlli di upload: verifica sempre, non dare per scontato che serva un bypass complesso
- `sudo -l` va controllato SEMPRE per primo appena ottenuta esecuzione, prima di lanciare tool di enumerazione pesanti

---

## Connessioni

- **Combinazione con:** [02-Scanning-Enumeration/03-Web-Enumeration.md](../02-Scanning-Enumeration/03-Web-Enumeration.md), [08-Exploitation-PostEx/05-Privilege-Escalation.md](../08-Exploitation-PostEx/05-Privilege-Escalation.md)

---

## Note personali

_(annota qui i tuoi comandi esatti e le differenze rispetto a queste note generiche)_
