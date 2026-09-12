---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Lab Challenges: Metasploit Framework"
permalink: "/cheatsheet/ejpt/07-metasploit-framework/lab-challenges/"
section: "Metasploit Framework"
section_order: 7
order: 99
sort_key: 799
---

**Difficoltà:** Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Auxiliary, exploit e meterpreter li hai visti uno per uno: ora li metti in fila senza guida, dalla mappatura della rete fino a una sessione privilegiata, prima di passare a exploitation manuale e post-exploitation avanzata.

---

## Challenge 1: Mappatura rete completa con auxiliary

**Target:** una rete lab con almeno 3-5 host (es. INE PTS network o VM locali)

**Task:**
1. Port scan e version detection con moduli auxiliary su tutto il range
2. Popola il database (hosts/services)
3. Identifica almeno un host con un servizio potenzialmente vulnerabile a un exploit noto

**Deliverable:** export CSV di hosts e services dal workspace.

---

## Challenge 2: Dall'exploit alla sessione privilegiata

**Task:**
1. Sfrutta l'host identificato nella Challenge 1 con l'exploit corrispondente
2. Ottieni una sessione meterpreter (o shell + upgrade)
3. Esegui hashdump e documenta i privilegi ottenuti (`getuid`)
4. Se il processo non e stabile, esegui una migrazione

**Deliverable:** output di sysinfo/getuid/hashdump della sessione ottenuta.

---

## Common Mistakes

- Saltare la fase auxiliary e andare a caso sugli exploit -> tasso di successo molto più basso e più rumore generato
- Non salvare risultati nel workspace -> chiudi msfconsole senza database attivo e perdi tutto il lavoro fatto

---

## Link Utili

- [Rapid7: Metasploit Module Library](https://www.rapid7.com/db/modules/)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [07-Metasploit-Framework](.)
- **Prossimo Step:** [../08-Exploitation-PostEx/01-Manual-Exploitation-Searchsploit.md](/cheatsheet/ejpt/08-exploitation-postex/01-manual-exploitation-searchsploit/)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 su almeno una rete di lab
- [ ] So condurre l'intero flusso auxiliary -> exploit -> meterpreter senza guida
- [ ] Sono pronto a passare a exploitation manuale e post-exploitation
