---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Report Writing Tips"
permalink: "/cheatsheet/ejpt/12-reporting-notes/report-writing-tips/"
section: "Reporting Notes"
section_order: 12
order: 50
sort_key: 1250
---

**Difficoltà:** Beginner
**Time to Master:** 45 min
**Prerequisiti:** [Executive-Summary-Template.md](/cheatsheet/ejpt/12-reporting-notes/executive-summary-template/)
**Lab:** riferimento trasversale

---

## Obiettivo

Nessuno insegna davvero come documentare un test mentre lo fai, e infatti è la competenza che scopri mancarti proprio quando è troppo tardi per rimediare: sei arrivato in fondo al lab e non ricordi più come hai ottenuto quella shell. Qui trovi consigli pratici per trasformare le note grezze in un report leggibile, utili anche solo per organizzarti durante l'esame.

---

## Documentare mentre procedi, non dopo

| Cosa salvare | Come |
|--------------|------|
| Ogni comando eseguito | history del terminale o file `commands.log` con `script -a session.log` |
| Output rilevante | redirect su file (`-oN`, `> output.txt`), mai solo a schermo |
| Screenshot | ogni volta che ottieni accesso, ogni shell, ogni credenziale trovata |
| Timestamp | utile per correlare eventi durante lab con più host |
| Credenziali trovate | tabella centralizzata: host, servizio, user, pass/hash, come ottenuta |

**Perché conta:** a fine giornata di lab con 5+ host attivi è facilissimo dimenticare "come" hai ottenuto un accesso: se non è scritto nel momento, spesso non lo ricostruisci più con precisione.

```bash
# cattura automaticamente tutta la sessione terminale
script -a pentest-session.log
```

---

## Struttura di un finding chiaro

Ogni finding dovrebbe rispondere a 5 domande, in quest'ordine:

1. **Titolo**: sintetico e specifico (non "SMB vulnerability" ma "SMBv1 con MS17-010 EternalBlue non patchato")
2. **Descrizione**: cosa e la vulnerabilità, perché esiste
3. **Impatto**: cosa può fare un attaccante concretamente (non teoria generica: "ottiene shell SYSTEM su DC01")
4. **Passi di riproduzione**: comandi esatti, in ordine, replicabili da chiunque
5. **Remediation**: azione concreta, non "aggiornare il sistema" ma "applicare KB4013389 o disabilitare SMBv1 con `Disable-WindowsOptionalFeature -Online -FeatureName smb1protocol`"

---

## Errori comuni nei report

- **Severity gonfiate o sottostimate**: usa CVSS in modo coerente, non "a sensazione" (vedi [04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](/cheatsheet/ejpt/04-vulnerability-assessment/03-cve-cvss-scoring/))
- **Passi di riproduzione incompleti**: se chi legge non riesce a riprodurre il finding con i tuoi comandi, il report e incompleto
- **Troppo tecnico senza executive summary chiaro**: un report deve parlare sia al management (impatto business) sia al tecnico (dettagli riproduzione)
- **Copia-incolla generico da tool automatici**: un output grezzo di Nessus/nmap non è un finding, va contestualizzato e verificato manualmente
- **Dimenticare i falsi positivi**: se un vuln scanner segnala qualcosa che poi verifichi essere non sfruttabile, documentalo comunque (mostra rigore) invece di ignorarlo

---

## Connessioni

- **Prerequisito:** [Executive-Summary-Template.md](/cheatsheet/ejpt/12-reporting-notes/executive-summary-template/)
- **Combinazione con:** [04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](/cheatsheet/ejpt/04-vulnerability-assessment/03-cve-cvss-scoring/)
