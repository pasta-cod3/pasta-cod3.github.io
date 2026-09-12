# Lab Challenges: File Inclusion

**Difficoltà:** Advanced
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Hai visto la teoria file per file: ora la rimetti insieme da solo. Questi esercizi ti fanno ripercorrere l'intera chain LFI/RFI -> RCE senza qualcuno che ti guida passo passo come nelle pagine precedenti.

---

## Challenge 1: LFI to RCE completa

**Task:**
1. Trova un parametro vulnerabile a LFI
2. Leggi `/etc/passwd` per confermare
3. Esegui log poisoning per ottenere RCE
4. Ottieni una reverse shell (vedi [08-Exploitation-PostEx/03-Reverse-Shells.md](../08-Exploitation-PostEx/03-Reverse-Shells.md))

**Deliverable:** documentazione step-by-step con request/response Burp.

---

## Challenge 2: Bypass filtro progressivo

**Task:**
1. Su un lab con filtro attivo, identifica il tipo di controllo
2. Applica sistematicamente la lista di [05-Evasion-Filters.md](05-Evasion-Filters.md)
3. Documenta quale tecnica specifica ha funzionato

---

## Common Mistakes

- Fermarsi alla sola lettura file senza tentare l'escalation a RCE -> in eWPT la chain completa è spesso richiesta
- Non verificare i permessi del processo web prima di dare per scontato che un file non sia accessibile

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [03-File-Inclusion](.)
- **Prossimo Step:** [04-SQL-Injection/01-SQLi-Fundamentals.md](../04-SQL-Injection/01-SQLi-Fundamentals.md)

---

## Checklist di padronanza

- [ ] Ho completato una chain LFI -> RCE su almeno un lab
- [ ] So applicare sistematicamente le tecniche di evasion
- [ ] Sono pronto a passare a SQL Injection

