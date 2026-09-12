---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Lab Challenges: Cross-Site Scripting"
permalink: "/cheatsheet/ewpt/05-cross-site-scripting/lab-challenges/"
section: "Cross-Site Scripting"
section_order: 5
order: 99
sort_key: 599
---

**Difficoltà:** Intermediate-Advanced
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Leggere le tecniche è un conto, ritrovarle senza indicazioni su un target vero è un altro: questi esercizi servono a consolidare tutte le varianti di XSS viste nella sezione, dal PoC minimo fino a un impatto che reggerebbe in un report reale.

---

## Challenge 1: Le tre varianti sullo stesso target

**Task:**
1. Trova ed exploita una reflected XSS
2. Trova ed exploita una stored XSS
3. Trova ed exploita una DOM XSS (con DOM Invader o lettura manuale JS)

**Deliverable:** PoC completo per ciascuna, con screenshot/response Burp.

---

## Challenge 2: Da alert() a impatto reale

**Task:**
1. Su una stored XSS già confermata, trasforma il PoC `alert(1)` in furto cookie funzionante
2. Se il cookie è HttpOnly, costruisci invece un'azione privilegiata eseguita per conto della vittima

---

## Common Mistakes

- Fermarsi ad `alert(1)` senza dimostrare impatto reale -> in un report professionale serve sempre la prova di impatto concreto
- Non provare DOM XSS perché "più difficile" -> è proprio per questo che resta la più sottovalutata, e quindi la più presente in ambienti reali

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [05-Cross-Site-Scripting](.)
- **Prossimo Step:** [06-Authentication-Authorization/01-Session-Management.md](/cheatsheet/ewpt/06-authentication-authorization/01-session-management/)

---

## Checklist di padronanza

- [ ] Ho un PoC funzionante per reflected, stored e DOM XSS
- [ ] Ho dimostrato impatto reale oltre al semplice alert()
- [ ] Sono pronto a passare ad Authentication & Authorization
