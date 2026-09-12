# Lab Challenges: SQL Injection

**Difficoltà:** Intermediate-Advanced
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Hai visto error, union, blind booleano e blind a tempo uno per uno: ora li rimetti insieme su un target che non ti dice in anticipo quale ti servirà.

---

## Challenge 1: Chain completa su un solo target

**Task:**
1. Trova un parametro vulnerabile
2. Conferma con test booleano manuale
3. Identifica DB engine dal comportamento
4. Estrai dati con la tecnica più appropriata (error/union/blind) a seconda di cosa l'app mostra
5. Ripeti l'estrazione con sqlmap e confronta i risultati

**Deliverable:** documento con request/response per ogni step, più comando sqlmap equivalente.

---

## Challenge 2: Bypass filtro progressivo

**Task:**
1. Su un lab con WAF/filtro attivo (es. DVWA high, PortSwigger WAF labs)
2. Applica sistematicamente le tecniche di [06-Encoding-Bypasses.md](06-Encoding-Bypasses.md)
3. Documenta quale bypass ha funzionato

---

## Common Mistakes

- Saltare direttamente a sqlmap senza capire manualmente la vulnerabilità -> in esame potresti dover spiegare/riprodurre l'exploit a mano
- Non testare tutte le varianti (error/union/blind) quando la prima tentata non dà risultati immediati

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [04-SQL-Injection](.)
- **Prossimo Step:** [05-Cross-Site-Scripting/01-XSS-Fundamentals.md](../05-Cross-Site-Scripting/01-XSS-Fundamentals.md)

---

## Checklist di padronanza

- [ ] Ho completato una chain SQLi manuale end-to-end
- [ ] Ho ripetuto la stessa chain con sqlmap
- [ ] So applicare bypass filtro quando necessario
- [ ] Sono pronto a passare a XSS

