---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Report Checklist"
permalink: "/cheatsheet/ewpt/10-reporting-notes/report-checklist/"
section: "Reporting Notes"
section_order: 10
order: 50
sort_key: 1050
---

**Difficoltà:** Beginner
**Time to Master:** 30 min
**Prerequisiti:** [CVSS-Scoring.md](/cheatsheet/ewpt/10-reporting-notes/cvss-scoring/)
**Lab:** riferimento trasversale

---

## Obiettivo

La tecnica del test la padroneggi, ma è facile arrivare alla fine di un engagement stanco e consegnare un report a cui manca l'Executive Summary o con uno screenshot tagliato male — e sono proprio quei dettagli che il cliente nota per primi. Questa è la checklist che scorri prima di premere invio, per non lasciare fuori i pezzi che contano.

---

## Checklist struttura report

- [ ] Copertina con nome target, date engagement, versione documento
- [ ] Executive Summary (vedi [Executive-Summary-Template.md](/cheatsheet/ewpt/10-reporting-notes/executive-summary-template/))
- [ ] Scope dell'engagement (cosa era incluso/escluso)
- [ ] Metodologia usata (es. OWASP Testing Guide, PTES)
- [ ] Sommario vulnerabilità (tabella con severità e stato)
- [ ] Dettaglio di ogni vulnerabilità (vedi [Vulnerability-Template.md](/cheatsheet/ewpt/10-reporting-notes/vulnerability-template/))
- [ ] Score CVSS per ogni finding (vedi [CVSS-Scoring.md](/cheatsheet/ewpt/10-reporting-notes/cvss-scoring/))
- [ ] Appendice con evidenze (screenshot, request/response raw)
- [ ] Conclusioni e raccomandazioni generali

---

## Checklist qualità per singolo finding

- [ ] Titolo chiaro e specifico (non generico)
- [ ] Severità giustificata con vettore CVSS completo
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

- Consegnare un report con solo output di tool automatici senza analisi manuale -> in eWPT (e nella pratica reale) questo abbassa drasticamente la qualità percepita
- Dimenticare l'Executive Summary -> spesso l'unica parte letta dai decision-maker non tecnici

---

## Connessioni

- **Prerequisito:** [CVSS-Scoring.md](/cheatsheet/ewpt/10-reporting-notes/cvss-scoring/)
- **Prossimo Step:** [Executive-Summary-Template.md](/cheatsheet/ewpt/10-reporting-notes/executive-summary-template/)
