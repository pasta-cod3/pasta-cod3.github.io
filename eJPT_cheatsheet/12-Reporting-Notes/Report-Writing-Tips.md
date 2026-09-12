# Report Writing Tips

**Difficolta:** Beginner
**Time to Master:** 45 min
**Prerequisiti:** [Executive-Summary-Template.md](Executive-Summary-Template.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Consigli pratici per documentare un test durante l'esecuzione e trasformare le note grezze in un report leggibile e utile — competenza spesso trascurata ma centrale in ogni pentest reale (e utile anche per organizzare le note durante l'esame).

---

## Documentare mentre procedi, non dopo

| Cosa salvare | Come |
|--------------|------|
| Ogni comando eseguito | history del terminale o file `commands.log` con `script -a session.log` |
| Output rilevante | redirect su file (`-oN`, `> output.txt`), mai solo a schermo |
| Screenshot | ogni volta che ottieni accesso, ogni shell, ogni credenziale trovata |
| Timestamp | utile per correlare eventi durante lab con piu host |
| Credenziali trovate | tabella centralizzata: host, servizio, user, pass/hash, come ottenuta |

**Perche conta:** a fine giornata di lab con 5+ host attivi e facilissimo dimenticare "come" hai ottenuto un accesso — se non e scritto nel momento, spesso non lo ricostruisci piu con precisione.

```bash
# cattura automaticamente tutta la sessione terminale
script -a pentest-session.log
```

---

## Struttura di un finding chiaro

Ogni finding dovrebbe rispondere a 5 domande, in quest'ordine:

1. **Titolo** — sintetico e specifico (non "SMB vulnerability" ma "SMBv1 con MS17-010 EternalBlue non patchato")
2. **Descrizione** — cosa e la vulnerabilita, perche esiste
3. **Impatto** — cosa puo fare un attaccante concretamente (non teoria generica: "ottiene shell SYSTEM su DC01")
4. **Passi di riproduzione** — comandi esatti, in ordine, replicabili da chiunque
5. **Remediation** — azione concreta, non "aggiornare il sistema" ma "applicare KB4013389 o disabilitare SMBv1 con `Disable-WindowsOptionalFeature -Online -FeatureName smb1protocol`"

---

## Errori comuni nei report

- **Severity gonfiate o sottostimate** — usa CVSS in modo coerente, non "a sensazione" (vedi [04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md))
- **Passi di riproduzione incompleti** — se chi legge non riesce a riprodurre il finding con i tuoi comandi, il report e incompleto
- **Troppo tecnico senza executive summary chiaro** — un report deve parlare sia al management (impatto business) sia al tecnico (dettagli riproduzione)
- **Copia-incolla generico da tool automatici** — un output grezzo di Nessus/nmap non e un finding, va contestualizzato e verificato manualmente
- **Dimenticare i falsi positivi** — se un vuln scanner segnala qualcosa che poi verifichi essere non sfruttabile, documentalo comunque (mostra rigore) invece di ignorarlo

---

## Connessioni

- **Prerequisito:** [Executive-Summary-Template.md](Executive-Summary-Template.md)
- **Combinazione con:** [04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md)

---

## Note personali

_(spazio libero)_
