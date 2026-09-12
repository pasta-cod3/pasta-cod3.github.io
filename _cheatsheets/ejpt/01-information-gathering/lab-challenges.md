---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Lab Challenges: Information Gathering"
permalink: "/cheatsheet/ejpt/01-information-gathering/lab-challenges/"
section: "Information Gathering"
section_order: 1
order: 99
sort_key: 199
---

**Difficoltà:** Beginner-Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

La teoria dei tre file precedenti si fissa solo se la metti in pratica per intero, dall'inizio alla fine: questi esercizi ti fanno percorrere tutta la fase di information gathering su un target reale (di lab), prima di passare a footprinting/scanning con basi solide sotto i piedi.

---

## Challenge 1: Recon completo passivo

**Target:** un dominio a scelta autorizzato per test (lab INE PTS o TryHackMe)

**Task:**
1. Whois + tutti i record DNS rilevanti
2. theHarvester per email/subdomain
3. Almeno 5 dork Google/GitHub mirati
4. Wayback Machine per endpoint storici

**Deliverable:** un file `recon-notes.md` con tutte le info raccolte, nessun comando verso il target attivo (solo passivo).

---

## Challenge 2: Primo contatto attivo

**Task:**
1. Banner grab su almeno 3 servizi (SSH, FTP, HTTP) con netcat/curl
2. Tenta uno zone transfer DNS
3. Confronta le versioni software rilevate con eventuali CVE noti (`searchsploit`)

**Deliverable:** tabella servizio/versione/CVE noti (se presenti).

---

## Common Mistakes

- Saltare direttamente allo scanning attivo senza aver completato la recon passiva
- Non documentare in tempo reale -> a fine giornata si dimenticano dettagli utili per il report

---

## Link Utili

- [TryHackMe: OSINT room](https://tryhackme.com/)
- [Exploit-DB](https://www.exploit-db.com/)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [01-Information-Gathering](.)
- **Prossimo Step:** [02-Footprinting-Scanning/01-Nmap-Fundamentals.md](/cheatsheet/ejpt/02-footprinting-scanning/01-nmap-fundamentals/)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 su almeno un target di lab
- [ ] Ho un template di note riutilizzabile per la recon
- [ ] Sono pronto a passare al footprinting/scanning attivo
