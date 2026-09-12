---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "CVSS Scoring"
permalink: "/cheatsheet/ewpt/10-reporting-notes/cvss-scoring/"
section: "Reporting Notes"
section_order: 10
order: 50
sort_key: 1050
---

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [Vulnerability-Template.md](/cheatsheet/ewpt/10-reporting-notes/vulnerability-template/)
**Lab:** riferimento trasversale

---

## Obiettivo

"Critical" buttato a caso su tutto è il modo più veloce per far perdere credibilità a un report, e il cliente se ne accorge. Qui impari a costruire il vettore CVSS v3.1 metrica per metrica invece di tirare a indovinare lo score finale: una volta capito il ragionamento dietro AV/AC/PR/UI, assegnare uno score coerente diventa quasi meccanico.

---

## Concetti chiave

### Metriche Base (le più rilevanti per il punteggio)

| Metrica | Valori | Significato |
|---------|--------|--------------|
| AV (Attack Vector) | N/A/L/P | Network/Adjacent/Local/Physical: da dove si sferra l'attacco |
| AC (Attack Complexity) | L/H | Low/High: difficoltà delle condizioni per sfruttarla |
| PR (Privileges Required) | N/L/H | None/Low/High: privilegi necessari |
| UI (User Interaction) | N/R | None/Required: serve interazione della vittima? |
| S (Scope) | U/C | Unchanged/Changed: impatta risorse oltre il componente vulnerabile? |
| C/I/A (Confidentiality/Integrity/Availability) | N/L/H | impatto su ciascuna proprietà |

---

## Esempi pratici per vulnerabilità comuni

### SQL Injection non autenticata, dump completo DB

```
AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N
```
Score tipico: 9.1-9.8 (Critical): network, bassa complessità, nessun privilegio, nessuna interazione utente, alto impatto su confidenzialità/integrità.

### Reflected XSS (richiede click vittima)

```
AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N
```
Score tipico: 6.1 (Medium): la necessità di interazione utente (UI:R) e lo scope changed (colpisce il browser della vittima, non il server) abbassano lo score rispetto a una SQLi diretta.

### IDOR con accesso in lettura a dati di altri utenti

```
AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N
```
Score tipico: 6.5-7.5 (Medium-High): richiede autenticazione (PR:L) ma nessuna interazione utente, impatto alto solo su confidenzialità.

### CSRF su azione critica (cambio password)

```
AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N
```
Score tipico: 6.5-8.1: dipende molto da quanto è critica l'azione forzabile.

---

## Strumenti

| Tool | Uso |
|------|-----|
| [FIRST CVSS Calculator](https://www.first.org/cvss/calculator/3.1) | calcolo ufficiale interattivo |
| NVD CVSS Calculator | alternativa, stesso standard |

---

## Common Mistakes

- Dare sempre "Critical" a tutto -> uno score inflazionato senza giustificazione mina la credibilità del report
- Non documentare il vettore CVSS completo (solo lo score numerico) -> il vettore permette al cliente di verificare/discutere la valutazione

---

## Connessioni

- **Prerequisito:** [Vulnerability-Template.md](/cheatsheet/ewpt/10-reporting-notes/vulnerability-template/)
- **Prossimo Step:** [Report-Checklist.md](/cheatsheet/ewpt/10-reporting-notes/report-checklist/)
