---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "HTB: Nibbles (Walkthrough Notes)"
permalink: "/cheatsheet/ewpt/11-lab-walkthroughs/htb-nibbles/"
section: "Lab Walkthroughs"
section_order: 11
order: 50
sort_key: 1150
---

**Difficulty:** Easy
**Time to root (stimato):** 1-1.5h
**Vulnerability:** CMS Nibbleblog con directory nascosta scoperta via fuzzing -> upload PHP tramite il plugin "My Image" (bypass del controllo estensione, credenziali admin di default) -> privesc via script eseguibile con sudo

---

## Obiettivo

Arrivi sulla homepage di Nibbles, la guardi, non c'è niente: è esattamente il momento in cui molti si fermano e concludono che il target non ha superficie di attacco. Sbagliato — la directory interessante è nascosta e la trovi solo con un content discovery paziente, dietro la quale c'è un CMS con un plugin di upload facilmente bypassabile.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon e prima occhiata
```bash
nmap -p- --min-rate=5000 -sV -sC target.com
curl -s http://target.com/ 
```
La pagina principale spesso appare vuota/minimale: non fermarti qui.

### 2. Content discovery approfondito
```bash
gobuster dir -u http://target.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt
```
Segui la metodologia di [02-Scanning-Enumeration/03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/) con pazienza: la directory chiave spesso non è nella wordlist "common" ma richiede una lista più estesa.

### 3. Enumerazione del CMS trovato
Una volta trovata la directory nascosta, identifica il CMS (tipicamente Nibbleblog) e prova le credenziali amministrative di default per accedere al pannello (spesso lasciate invariate su installazioni da lab/CTF).

### 4. Upload via plugin vulnerabile -> webshell
Il vettore noto è il plugin "My Image" di Nibbleblog, il cui controllo sull'estensione caricata è insufficiente/bypassabile (non del tutto assente): carica una webshell PHP sfruttando questo bypass (vedi [08-Exploitation-PostEx/01-File-Upload-Abuse.md](/cheatsheet/ewpt/08-exploitation-postex/01-file-upload-abuse/) per le tecniche generali di bypass upload).

### 5. Privilege escalation via sudo

```bash
sudo -l
```
Cerca uno script/binario eseguibile con sudo senza password: consulta [GTFOBins](https://gtfobins.github.io/) o analizza direttamente lo script per capire come iniettare comandi arbitrari eseguiti come root.

---

## Key Lessons

- Una homepage minimale non significa "nessuna superficie di attacco": la content discovery è sempre il passo successivo obbligato
- Non dare per scontato che un controllo di upload sia robusto solo perché esiste: molti check (blacklist di estensione) sono banalmente bypassabili
- `sudo -l` va controllato SEMPRE per primo appena ottenuta esecuzione, prima di lanciare tool di enumerazione pesanti

---

## Connessioni

- **Combinazione con:** [02-Scanning-Enumeration/03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/), [08-Exploitation-PostEx/05-Privilege-Escalation.md](/cheatsheet/ewpt/08-exploitation-postex/05-privilege-escalation/)
