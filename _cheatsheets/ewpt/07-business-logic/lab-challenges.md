---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Lab Challenges: Business Logic"
permalink: "/cheatsheet/ewpt/07-business-logic/lab-challenges/"
section: "Business Logic"
section_order: 7
order: 99
sort_key: 799
---

**Difficoltà:** Advanced
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Qui non stai più imparando una tecnica alla volta: metti insieme quello che hai visto in questa sezione (logic flaw, race condition, account enumeration, timing attack, price manipulation) su scenari che, come nella realtà, raramente si risolvono con una sola tecnica isolata.

---

## Challenge 1: Checkout completo compromesso

**Task:**
1. Su un'app e-commerce di lab, trova un modo di ottenere un prodotto a prezzo ridotto o zero
2. Combina almeno due tecniche (es. price manipulation + race condition su coupon)

**Deliverable:** documentazione step-by-step con impatto economico stimato.

---

## Challenge 2: Enumeration end-to-end

**Task:**
1. Costruisci una wordlist di username plausibili (vedi [01-Reconnaissance/03-OSINT-Tools.md](/cheatsheet/ewpt/01-reconnaissance/03-osint-tools/))
2. Verifica quali esistono realmente tramite differenziale di risposta/timing (vedi [03-Account-Enumeration.md](/cheatsheet/ewpt/07-business-logic/03-account-enumeration/) e [04-Timing-Attacks.md](/cheatsheet/ewpt/07-business-logic/04-timing-attacks/))
3. Usa la lista confermata per un password spraying mirato (vedi [06-Authentication-Authorization/05-Credential-Attacks.md](/cheatsheet/ewpt/06-authentication-authorization/05-credential-attacks/))

---

## Common Mistakes

- Considerare la business logic "meno tecnica" e quindi meno importante -> spesso è la categoria con impatto economico più diretto e più difficile da rilevare con scanner automatici
- Non documentare l'impatto in termini concreti (denaro, dati, privilegi) -> fondamentale per un report convincente

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [07-Business-Logic](.)
- **Prossimo Step:** [08-Exploitation-PostEx/01-File-Upload-Abuse.md](/cheatsheet/ewpt/08-exploitation-postex/01-file-upload-abuse/)

---

## Checklist di padronanza

- [ ] Ho completato una chain di business logic con impatto dimostrato
- [ ] Ho combinato almeno due tecniche della sezione
- [ ] Sono pronto a passare a Exploitation & Post-Exploitation
