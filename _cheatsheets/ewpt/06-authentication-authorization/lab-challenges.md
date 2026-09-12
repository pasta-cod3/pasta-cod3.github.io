---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Lab Challenges: Authentication & Authorization"
permalink: "/cheatsheet/ewpt/06-authentication-authorization/lab-challenges/"
section: "Authentication & Authorization"
section_order: 6
order: 99
sort_key: 699
---

**Difficoltà:** Intermediate-Advanced
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Qui è dove le tecniche viste nella sezione smettono di essere singoli trucchi isolati e iniziano a combinarsi: esercizi pratici per consolidare session management, CSRF, IDOR, credential attacks e JWT, con l'obiettivo di arrivare a un impatto concreto, non solo a una prova di concetto.

---

## Challenge 1: Account takeover completo

**Task:**
1. Trova un endpoint IDOR che espone dati di un altro utente
2. Verifica se lo stesso endpoint permette anche la SCRITTURA (cambio email/password)
3. Se sì, esegui un account takeover completo cambiando le credenziali di un altro utente

**Deliverable:** documentazione step-by-step con impatto dimostrato.

---

## Challenge 2: JWT privilege escalation

**Task:**
1. Ottieni un JWT come utente normale
2. Applica jwt_tool in playbook mode
3. Forgia un token con ruolo admin e conferma l'accesso privilegiato

---

## Challenge 3: CSRF su azione critica

**Task:**
1. Trova un'azione sensibile (cambio password/email) senza protezione CSRF adeguata
2. Costruisci un PoC HTML con auto-submit
3. Documenta il bypass di eventuali difese (token non legato a sessione, SameSite=Lax, Referer assente)

---

## Common Mistakes

- Considerare IDOR e CSRF come vulnerabilità "minori" -> spesso portano ad account takeover completo, massimo impatto per eWPT
- Non concatenare le vulnerabilità -> IDOR + CSRF + JWT deboli si combinano spesso per un impatto molto maggiore della singola falla, e un report che le mostra insieme vale più di tre segnalazioni isolate

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [06-Authentication-Authorization](.)
- **Prossimo Step:** [07-Business-Logic/01-Logic-Flaws.md](/cheatsheet/ewpt/07-business-logic/01-logic-flaws/)

---

## Checklist di padronanza

- [ ] Ho completato un account takeover end-to-end su un lab
- [ ] Ho forgiato un JWT con privilegi elevati
- [ ] Ho costruito un PoC CSRF funzionante
- [ ] Sono pronto a passare a Business Logic
