---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Lab Challenges: Enumeration"
permalink: "/cheatsheet/ejpt/03-enumeration/lab-challenges/"
section: "Enumeration"
section_order: 3
order: 99
sort_key: 399
---

**Difficoltà:** Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Il valore reale dell'enumeration non emerge guardando un servizio alla volta, ma incrociando quello che trovi tra servizi diversi: una userlist SNMP che diventa il dizionario per un brute force SSH, una credenziale FTP che funziona anche su RDP. Questi esercizi ti fanno vivere esattamente quella combinazione su una rete multi-host, prima di passare a vulnerability assessment e attacchi mirati.

---

## Challenge 1: Enumerazione completa multi-host

**Target:** una rete di lab con almeno 3 host (es. un DC Windows, un host Linux con SMB/NFS, un host con SNMP)

**Task:**
1. Per ogni host, esegui l'enumerazione completa dei servizi rilevati (SMB, FTP, SSH, SNMP, web, NFS/RPC, SMTP/DNS a seconda di cosa e presente)
2. Costruisci un'unica userlist combinata raccogliendo nomi utente da tutte le fonti (SMB null session, SNMP, SMTP)
3. Documenta ogni share/export leggibile o scrivibile trovato

**Deliverable:** tabella host / servizio / info raccolta / credenziali o userlist / note.

---

## Challenge 2: Da enumerazione a credenziali

**Task:**
1. Usa la userlist combinata del Challenge 1 per un brute force mirato e limitato (hydra) su SSH o un login web trovato
2. Verifica se le credenziali trovate sono riusabili su altri servizi (SMB, RDP)
3. Documenta ogni riuso di credenziali funzionante

**Deliverable:** nota su quali credenziali funzionano su quali servizi (credential reuse map).

---

## Common Mistakes

- Enumerare i servizi in isolamento senza mai incrociare i dati raccolti -> il valore vero sta nella combinazione (userlist SNMP + brute force SSH, es.)
- Fermarsi al primo servizio "interessante" senza completare l'enumerazione degli altri -> si perdono vettori più semplici scoperti dopo

---

## Link Utili

- [HackTricks: Pentesting network services](https://book.hacktricks.wiki/)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [03-Enumeration](.)
- **Prossimo Step:** [../04-Vulnerability-Assessment/01-Vulnerability-Scanning-Nessus.md](/cheatsheet/ejpt/04-vulnerability-assessment/01-vulnerability-scanning-nessus/)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 su una rete di lab multi-host
- [ ] Ho una userlist combinata riutilizzabile
- [ ] Ho verificato almeno un caso di credential reuse
- [ ] Sono pronto a passare alla vulnerability assessment
