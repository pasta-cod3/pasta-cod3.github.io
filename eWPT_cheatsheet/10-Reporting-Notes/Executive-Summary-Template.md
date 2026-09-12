# Executive Summary Template

**Difficoltà:** Beginner
**Time to Master:** 30 min
**Prerequisiti:** [Report-Checklist.md](Report-Checklist.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Questa è la parte del report che leggono davvero tutti, anche chi non aprirà mai il dettaglio tecnico dei finding: se qui scrivi "SQL Injection" senza spiegare cosa significa in termini di rischio per l'azienda, hai perso il lettore che doveva approvare il budget per sistemare le cose. Il template sotto è pensato apposta per un pubblico non tecnico (management, decision maker): niente jargon, solo rischio di business e priorità d'azione.

---

## Template

```markdown
# Executive Summary

## Contesto
[Nome azienda/target] ha commissionato un penetration test sull'applicazione web
[nome applicazione] tra il [data inizio] e il [data fine], con l'obiettivo di valutare
la resistenza a attacchi realistici da parte di un utente malintenzionato.

## Risultati principali
Durante l'engagement sono state identificate [N] vulnerabilità, di cui:
- [N] Critical
- [N] High
- [N] Medium
- [N] Low

La vulnerabilità più significativa è stata [breve descrizione non tecnica], che avrebbe
permesso a un attaccante di [impatto in termini di business: accesso a dati clienti,
interruzione del servizio, perdita finanziaria, ecc.].

## Livello di rischio complessivo
[Critico / Alto / Medio / Basso]: [breve giustificazione in una frase]

## Raccomandazioni prioritarie
1. [Azione correttiva più urgente, in termini comprensibili]
2. [Seconda priorità]
3. [Terza priorità]

## Prossimi passi
Si raccomanda di correggere i finding Critical/High entro [timeframe suggerito] e di
pianificare un re-test per validare l'efficacia delle correzioni applicate.
```

---

## Esempio compilato (estratto)

```markdown
## Risultati principali
Durante l'engagement sono state identificate 8 vulnerabilità, di cui 2 Critical, 3 High,
2 Medium, 1 Low.

La vulnerabilità più significativa è stata una SQL Injection non autenticata nel modulo
di ricerca prodotti, che avrebbe permesso a un attaccante di estrarre l'intero database
clienti, incluse credenziali e dati di pagamento, senza necessità di alcun accesso
preventivo al sistema.

## Livello di rischio complessivo
Critico: la combinazione di SQL Injection non autenticata e controlli di autorizzazione
insufficienti espone l'organizzazione a un rischio concreto e immediato di violazione dati.
```

---

## Common Mistakes

- Usare terminologia tecnica (SQLi, XSS, IDOR) senza spiegarla in termini di impatto business -> il lettore executive non deve dover cercare cosa significhi ogni acronimo
- Essere troppo lunghi -> l'executive summary dovrebbe stare in una pagina, massimo due

---

## Connessioni

- **Prerequisito:** [Report-Checklist.md](Report-Checklist.md)

