# Lab Challenges — Cross-Site Scripting

**Difficolta:** Intermediate-Advanced
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Esercizi pratici per consolidare tutte le varianti di XSS viste nella sezione.

---

## Challenge 1 — Le tre varianti sullo stesso target

**Task:**
1. Trova ed exploita una reflected XSS
2. Trova ed exploita una stored XSS
3. Trova ed exploita una DOM XSS (con DOM Invader o lettura manuale JS)

**Deliverable:** PoC completo per ciascuna, con screenshot/response Burp.

---

## Challenge 2 — Da alert() a impatto reale

**Task:**
1. Su una stored XSS gia confermata, trasforma il PoC `alert(1)` in furto cookie funzionante
2. Se il cookie e HttpOnly, costruisci invece un'azione privilegiata eseguita per conto della vittima

---

## Common Mistakes

- Fermarsi ad `alert(1)` senza dimostrare impatto reale -> in un report professionale serve sempre la prova di impatto concreto
- Non provare DOM XSS perche "piu difficile" -> spesso e la piu sottovalutata e quindi la piu presente in ambienti reali

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [05-Cross-Site-Scripting](.)
- **Prossimo Step:** [06-Authentication-Authorization/01-Session-Management.md](../06-Authentication-Authorization/01-Session-Management.md)

---

## Checklist di padronanza

- [ ] Ho un PoC funzionante per reflected, stored e DOM XSS
- [ ] Ho dimostrato impatto reale oltre al semplice alert()
- [ ] Sono pronto a passare ad Authentication & Authorization

---

## Note personali

_(spazio libero)_
