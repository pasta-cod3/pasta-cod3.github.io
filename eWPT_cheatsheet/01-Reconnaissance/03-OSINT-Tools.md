# OSINT Tools

**Difficoltà:** Intermediate
**Time to Master:** 3h
**Prerequisiti:** [02-Fingerprinting.md](02-Fingerprinting.md)
**Lab:** TryHackMe, OSINT

---

## Obiettivo

Le persone dietro un'organizzazione lasciano tracce pubbliche che valgono quanto una vulnerabilità tecnica: un pattern email, una password riciclata da un breach vecchio di anni, un subdomain che qualcuno ha dimenticato online. Qui raccogli queste informazioni da fonti pubbliche — social media, breach database, domain history — utili per password spraying mirato, social engineering, o semplicemente per capire come è cresciuta nel tempo l'infrastruttura che stai testando.

---

## Concetti chiave

### Categorie di OSINT rilevanti in eWPT

| Categoria | Obiettivo |
|-----------|-----------|
| Email harvesting | costruire lista utenti per bruteforce/spraying |
| Breach data | credenziali riutilizzate note |
| Domain history | vecchie versioni del sito, subdomain dimenticati |
| Metadata documenti | autori, software, path interni nei PDF/DOC pubblici |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| theHarvester | `theHarvester -d target.com -b google,bing` | email, subdomain | passivo, multi-fonte |
| Hunter.io | ricerca web | pattern email aziendale | rivela formato (nome.cognome@) |
| Wayback Machine | `curl "http://archive.org/wayback/available?url=target.com"` | snapshot storici | vecchi endpoint/path |
| exiftool | `exiftool documento.pdf` | metadata file | autore, software, a volte path interni |

---

## Payload / Esempi

### Esempio 1: raccolta email con theHarvester

```bash
theHarvester -d target.com -b google,bing,linkedin -l 200 -f report.html
```

**Output atteso:**
```
[*] Emails found: 12
mario.rossi@target.com
info@target.com
```

**Spiegazione:** una volta capito il pattern email (nome.cognome@target.com) puoi generare una wordlist di username plausibili da usare in [06-Authentication-Authorization/05-Credential-Attacks.md](../06-Authentication-Authorization/05-Credential-Attacks.md).

### Esempio 2: cercare versioni storiche del sito

```bash
curl -s "http://web.archive.org/cdx/search/cdx?url=target.com/*&output=text&fl=original&collapse=urlkey" | sort -u > wayback-urls.txt
```

**Spiegazione:** l'archivio storico spesso conserva endpoint/API dismessi ma ancora attivi sul server corrente, ottima fonte di attack surface dimenticata.

### Esempio 3: metadata da documenti pubblici

```bash
# scarica PDF/DOC pubblici dal sito, poi:
exiftool *.pdf | grep -i "author\|software\|creator"
```

**Spiegazione:** rivela username interni, software usato (es. "Microsoft Word 16 - John.Doe"), utile per costruire una lista utenti realistica.

---

## Evasion / Bypass Techniques

### Non farti scoprire durante OSINT
- Preferisci fonti passive (Google, Wayback, Hunter.io) a query dirette contro il target
- Usa un browser/account dedicato quando cerchi su LinkedIn per non esporre il tuo profilo personale

---

## Lab Hands-On

### Lab 1: TryHackMe, OSINT
**Obiettivo:** raccogliere informazioni su un target fittizio con più tool OSINT
**Difficulty:** Medio
**Time:** 1h

**Walkthrough breve:**
1. Esegui theHarvester sul dominio target
2. Cerca vecchi snapshot su Wayback Machine
3. Estrai metadata da un documento pubblico di esempio

---

## Common Mistakes

- Fermarsi alla prima fonte (solo Google) -> combina almeno 3 fonti diverse per email/subdomain
- Ignorare Wayback Machine -> spesso l'endpoint vulnerabile è stato "rimosso" dal menu ma resta raggiungibile

---

## Link Utili

- [theHarvester GitHub](https://github.com/laramies/theHarvester)
- [Wayback Machine](https://web.archive.org/)

---

## Connessioni

- **Prerequisito:** [02-Fingerprinting.md](02-Fingerprinting.md)
- **Prossimo Step:** [04-Dorking.md](04-Dorking.md)
- **Combinazione con:** [06-Authentication-Authorization/05-Credential-Attacks.md](../06-Authentication-Authorization/05-Credential-Attacks.md)

---

## Checklist di padronanza

- [ ] So usare theHarvester per email/subdomain harvesting
- [ ] So consultare Wayback Machine per endpoint storici
- [ ] So estrarre metadata da documenti pubblici
- [ ] So costruire una wordlist di username plausibili dal pattern email

