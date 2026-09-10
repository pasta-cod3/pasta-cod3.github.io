# CVSS Scoring

**Difficolta:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [Vulnerability-Template.md](Vulnerability-Template.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Saper assegnare uno score CVSS v3.1 coerente a ogni vulnerabilita trovata, requisito standard per un report professionale.

---

## Concetti chiave

### Metriche Base (le piu rilevanti per il punteggio)

| Metrica | Valori | Significato |
|---------|--------|--------------|
| AV (Attack Vector) | N/A/L/P | Network/Adjacent/Local/Physical — da dove si sferra l'attacco |
| AC (Attack Complexity) | L/H | Low/High — difficolta delle condizioni per sfruttarla |
| PR (Privileges Required) | N/L/H | None/Low/High — privilegi necessari |
| UI (User Interaction) | N/R | None/Required — serve interazione della vittima? |
| S (Scope) | U/C | Unchanged/Changed — impatta risorse oltre il componente vulnerabile? |
| C/I/A (Confidentiality/Integrity/Availability) | N/L/H | impatto su ciascuna proprieta |

---

## Esempi pratici per vulnerabilita comuni

### SQL Injection non autenticata, dump completo DB

```
AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N
```
Score tipico: 9.1-9.8 (Critical) — network, bassa complessita, nessun privilegio, nessuna interazione utente, alto impatto su confidenzialita/integrita.

### Reflected XSS (richiede click vittima)

```
AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N
```
Score tipico: 6.1 (Medium) — la necessita di interazione utente (UI:R) e lo scope changed (colpisce il browser della vittima, non il server) abbassano lo score rispetto a una SQLi diretta.

### IDOR con accesso in lettura a dati di altri utenti

```
AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N
```
Score tipico: 6.5-7.5 (Medium-High) — richiede autenticazione (PR:L) ma nessuna interazione utente, impatto alto solo su confidenzialita.

### CSRF su azione critica (cambio password)

```
AV:N/AC:L/PR:N/UI:R/S:U/C:N/I:H/A:N
```
Score tipico: 6.5-8.1 — dipende molto da quanto e critica l'azione forzabile.

---

## Strumenti

| Tool | Uso |
|------|-----|
| [FIRST CVSS Calculator](https://www.first.org/cvss/calculator/3.1) | calcolo ufficiale interattivo |
| NVD CVSS Calculator | alternativa, stesso standard |

---

## Common Mistakes

- Dare sempre "Critical" a tutto -> uno score inflazionato senza giustificazione mina la credibilita del report
- Non documentare il vettore CVSS completo (solo lo score numerico) -> il vettore permette al cliente di verificare/discutere la valutazione

---

## Connessioni

- **Prerequisito:** [Vulnerability-Template.md](Vulnerability-Template.md)
- **Prossimo Step:** [Report-Checklist.md](Report-Checklist.md)

---

## Note personali

_(spazio libero)_
