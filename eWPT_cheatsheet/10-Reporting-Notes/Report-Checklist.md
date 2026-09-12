# Report Checklist

**Difficolta:** Beginner
**Time to Master:** 30 min
**Prerequisiti:** [CVSS-Scoring.md](CVSS-Scoring.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Checklist finale da scorrere prima di consegnare/consegnare mentalmente un report di penetration test, per non dimenticare componenti essenziali.

---

## Checklist struttura report

- [ ] Copertina con nome target, date engagement, versione documento
- [ ] Executive Summary (vedi [Executive-Summary-Template.md](Executive-Summary-Template.md))
- [ ] Scope dell'engagement (cosa era incluso/escluso)
- [ ] Metodologia usata (es. OWASP Testing Guide, PTES)
- [ ] Sommario vulnerabilita (tabella con severita e stato)
- [ ] Dettaglio di ogni vulnerabilita (vedi [Vulnerability-Template.md](Vulnerability-Template.md))
- [ ] Score CVSS per ogni finding (vedi [CVSS-Scoring.md](CVSS-Scoring.md))
- [ ] Appendice con evidenze (screenshot, request/response raw)
- [ ] Conclusioni e raccomandazioni generali

---

## Checklist qualita per singolo finding

- [ ] Titolo chiaro e specifico (non generico)
- [ ] Severita giustificata con vettore CVSS completo
- [ ] Passi di riproduzione testati e ripetibili da chi legge
- [ ] Evidenza concreta allegata (non solo descrizione testuale)
- [ ] Remediation specifica e attuabile (non generica tipo "sistemare la sicurezza")
- [ ] Riferimento a standard/CWE quando applicabile

---

## Checklist finale prima della consegna

- [ ] Nessun dato sensibile del cliente esposto per errore (credenziali reali, PII)
- [ ] Tutti i link interni funzionano
- [ ] Screenshot leggibili e non tagliati
- [ ] Ortografia e formattazione verificate
- [ ] Executive Summary comprensibile anche a un lettore non tecnico

---

## Common Mistakes

- Consegnare un report con solo output di tool automatici senza analisi manuale -> in eWPT (e nella pratica reale) questo abbassa drasticamente la qualita percepita
- Dimenticare l'Executive Summary -> spesso l'unica parte letta dai decision-maker non tecnici

---

## Connessioni

- **Prerequisito:** [CVSS-Scoring.md](CVSS-Scoring.md)
- **Prossimo Step:** [Executive-Summary-Template.md](Executive-Summary-Template.md)

---

## Note personali

_(spazio libero)_
