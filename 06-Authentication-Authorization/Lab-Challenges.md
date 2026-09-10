# Lab Challenges — Authentication & Authorization

**Difficolta:** Intermediate-Advanced
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Esercizi pratici per consolidare session management, CSRF, IDOR, credential attacks e JWT.

---

## Challenge 1 — Account takeover completo

**Task:**
1. Trova un endpoint IDOR che espone dati di un altro utente
2. Verifica se lo stesso endpoint permette anche la SCRITTURA (cambio email/password)
3. Se si, esegui un account takeover completo cambiando le credenziali di un altro utente

**Deliverable:** documentazione step-by-step con impatto dimostrato.

---

## Challenge 2 — JWT privilege escalation

**Task:**
1. Ottieni un JWT come utente normale
2. Applica jwt_tool in playbook mode
3. Forgia un token con ruolo admin e conferma l'accesso privilegiato

---

## Challenge 3 — CSRF su azione critica

**Task:**
1. Trova un'azione sensibile (cambio password/email) senza protezione CSRF adeguata
2. Costruisci un PoC HTML con auto-submit
3. Documenta il bypass di eventuali difese (token non legato a sessione, SameSite=Lax, Referer assente)

---

## Common Mistakes

- Considerare IDOR e CSRF come vulnerabilita "minori" -> spesso portano ad account takeover completo, massimo impatto per eWPT
- Non concatenare le vulnerabilita -> IDOR + CSRF + JWT deboli spesso si combinano per un impatto molto maggiore della singola falla

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [06-Authentication-Authorization](.)
- **Prossimo Step:** [07-Business-Logic/01-Logic-Flaws.md](../07-Business-Logic/01-Logic-Flaws.md)

---

## Checklist di padronanza

- [ ] Ho completato un account takeover end-to-end su un lab
- [ ] Ho forgiato un JWT con privilegi elevati
- [ ] Ho costruito un PoC CSRF funzionante
- [ ] Sono pronto a passare a Business Logic

---

## Note personali

_(spazio libero)_
