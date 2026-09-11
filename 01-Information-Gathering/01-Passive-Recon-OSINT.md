# Passive Recon & OSINT

**Difficolta:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [00-Fundamentals/02-Networking-Basics.md](../00-Fundamentals/02-Networking-Basics.md)
**Lab:** INE PTS — Information Gathering

---

## Obiettivo

Raccogliere informazioni pubbliche su un target (organizzazione o dominio) senza inviare traffico direttamente verso i suoi sistemi. E il primo step di ogni engagement e definisce la superficie di attacco iniziale.

---

## Concetti chiave

### Cosa cerchiamo in fase passiva

| Categoria | Esempi |
|-----------|--------|
| Infrastruttura | IP range, hosting/cloud provider, record DNS |
| Persone | dipendenti, email, ruoli (utile per social engineering/password spraying) |
| Tecnologia | stack software esposto via metadata, job posting tecnici |
| Storico | versioni passate del sito, endpoint rimossi (Wayback Machine) |

### Whois e DNS

| Record | Significato |
|--------|-------------|
| A / AAAA | IP v4/v6 del dominio |
| MX | server di posta |
| TXT | SPF/DKIM/verifiche, spesso rivela servizi terzi |
| NS | name server, chi gestisce il DNS |
| CNAME | alias, utile per subdomain takeover |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| whois | `whois target.com` | registrant, NS, date | a volte redatto per GDPR |
| dig | `dig target.com ANY` | record DNS | molti resolver limitano ANY, interroga i tipi singolarmente |
| theHarvester | `theHarvester -d target.com -b all` | email, subdomain, host | aggrega piu fonti OSINT |
| Shodan | `shodan search hostname:target.com` | host/servizi esposti indicizzati | richiede account (free tier disponibile) |
| Wayback Machine | web.archive.org | snapshot storici del sito | trova endpoint/file rimossi |

---

## Payload / Esempi

### Esempio 1: recon DNS completo

```bash
whois target.com
dig target.com A
dig target.com MX
dig target.com TXT
dig target.com NS
```

**Output atteso:**
```
target.com.  300  IN  A  93.184.216.34
target.com.  300  IN  MX  10 mail.target.com.
```

**Spiegazione:** i record MX rivelano il provider di posta (es. Google Workspace, Office 365), utile per capire dove indirizzare eventuali test di phishing autorizzati.

### Esempio 2: raccolta email e subdomain con theHarvester

```bash
theHarvester -d target.com -b google,bing,linkedin -l 200
```

**Spiegazione:** aggrega automaticamente risultati da piu motori/fonti OSINT; le email raccolte sono materiale per password spraying o phishing (sempre nello scope autorizzato).

### Esempio 3: host esposti via Shodan

```bash
shodan search "org:\"Target Org\""
shodan host 93.184.216.34
```

**Spiegazione:** Shodan indicizza banner di servizi esposti su internet — puo rivelare servizi dimenticati (VPN, pannelli admin, IoT) prima ancora di fare uno scan attivo.

---

## Evasion / Bypass Techniques

Tecnica interamente passiva: nessuna evasion necessaria verso il target. L'unico limite e non violare i ToS delle piattaforme OSINT con query automatizzate troppo aggressive.

---

## Lab Hands-On

### Lab 1: INE PTS — Passive Information Gathering
**Obiettivo:** raccogliere quante piu informazioni possibili su un dominio assegnato senza toccarlo direttamente
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Whois + record DNS completi
2. theHarvester per email/subdomain
3. Controlla Wayback Machine per endpoint storici
4. Documenta tutto in un file di note prima di passare alla fase attiva

---

## Common Mistakes

- Saltare direttamente allo scanning attivo senza aver completato la recon passiva -> si perdono informazioni difficili da recuperare dopo
- Fidarsi ciecamente di un solo tool -> incrociare sempre whois/dig/theHarvester/Shodan
- Non documentare in tempo reale -> a fine sessione si dimenticano dettagli utili

---

## Link Utili

- [Shodan](https://www.shodan.io/)
- [Wayback Machine](https://web.archive.org/)
- [theHarvester GitHub](https://github.com/laramies/theHarvester)

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/02-Networking-Basics.md](../00-Fundamentals/02-Networking-Basics.md)
- **Prossimo Step:** [02-Active-Information-Gathering.md](02-Active-Information-Gathering.md)
- **Combinazione con:** [03-Google-Dorking-Search-Engines.md](03-Google-Dorking-Search-Engines.md)

---

## Checklist di padronanza

- [ ] So estrarre tutti i record DNS rilevanti di un dominio
- [ ] So usare theHarvester per aggregare email/subdomain
- [ ] Conosco almeno un uso pratico di Shodan
- [ ] So consultare la Wayback Machine per endpoint storici

---

## Note personali

_(spazio libero)_
