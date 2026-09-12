---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Lab Challenges: Reconnaissance"
permalink: "/cheatsheet/ewpt/01-reconnaissance/lab-challenges/"
section: "Reconnaissance"
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

Prima di passare a scanning/enumeration, mettiti alla prova qui: due esercizi pratici per consolidare l'intera fase di reconnaissance mentre è ancora fresca, invece di scoprire più avanti di averla solo letta senza mai farla per intero.

---

## Challenge 1: Recon completo passivo

**Target:** un dominio a scelta autorizzato per test (es. lab TryHackMe/HTB)

**Task:**
1. Whois + tutti i record DNS
2. theHarvester per email/subdomain
3. Almeno 5 dork Google/GitHub mirati
4. Wayback Machine per endpoint storici

**Deliverable:** un file `recon-notes.md` con tutte le info raccolte, nessun comando verso il target attivo (solo passivo).

---

## Challenge 2: Fingerprint stack tecnologico

**Task:**
1. whatweb + wappalyzer sullo stesso target
2. Confronta i risultati, nota discrepanze
3. Cerca CVE noti per ogni versione identificata con `searchsploit`

**Deliverable:** tabella tecnologia/versione/CVE noti.

---

## Common Mistakes

- Saltare direttamente allo scanning attivo senza aver completato la recon passiva -> perdi informazioni che non ritroverai facilmente dopo
- Non documentare in tempo reale -> a fine giornata dimentichi dettagli utili per il report

---

## Link Utili

- [TryHackMe: OSINT room](https://tryhackme.com/)
- [Hack The Box](https://www.hackthebox.com/)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [01-Reconnaissance](.)
- **Prossimo Step:** [02-Scanning-Enumeration/01-Port-Scanning.md](/cheatsheet/ewpt/02-scanning-enumeration/01-port-scanning/)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 su almeno un target di lab
- [ ] Ho un template di note riutilizzabile per la recon
- [ ] Sono pronto a passare allo scanning attivo
