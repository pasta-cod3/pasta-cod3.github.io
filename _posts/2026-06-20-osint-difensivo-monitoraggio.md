---
layout: post
title: "OSINT Difensivo: monitorare la propria esposizione online come fanno gli attaccanti"
date: 2026-06-20
cat: blue
tags: [OSINT, difensivo, brand monitoring, Google Alerts, Shodan, Have I Been Pwned, threat intelligence]
excerpt: "Prima di attaccarti, gli avversari raccolgono informazioni su di te da fonti pubbliche. L'OSINT difensivo consiste nell'eseguire questa ricognizione su se stessi per scoprire e correggere le esposizioni prima degli altri."
---

L'OSINT difensivo è il processo di raccogliere informazioni su se stessi o sulla propria organizzazione usando le stesse tecniche che userebbe un attaccante — Google Dork, Shodan, breach database, social media — per identificare esposizioni prima che vengano sfruttate.

## Cosa troverebbe un attaccante su di te?

Prima di rispondere, fai questa ricerca:

```bash
# Il tuo dominio su Google
site:tuaazienda.it filetype:pdf
site:tuaazienda.it inurl:admin
site:tuaazienda.it intitle:"index of"

# La tua infrastruttura su Shodan
org:"Nome Azienda"
hostname:tuaazienda.it

# Email aziendali nei breach
# → HaveIBeenPwned.com (gratuito per singola email)
# → HIBP API (a pagamento per monitoraggio dominio)
```

Quello che trovi, lo troverebbe anche un attaccante.

## Google Alerts: monitoraggio continuo

Imposta alert gratuiti per ricevere notifiche quando certi termini appaiono online:

- `"tuaazienda.it" password` — se qualcuno pubblica credenziali
- `"tuaazienda" breach` — menzioni di violazioni
- `"tuaazienda.it" site:pastebin.com` — dati su Pastebin
- `"CEO Name" CEO "tuaazienda"` — impersonazione del CEO

→ alerts.google.com

## Monitoraggio delle credenziali nel dark web

Servizi che monitorano i breach database e avvisano quando le email aziendali appaiono:

- **HaveIBeenPwned Domain Search** (Troy Hunt): monitoraggio di tutte le email del dominio, alert in tempo reale
- **Spycloud**: anche per password hash, utile per verificare se le credenziali sono ancora in uso
- **Constella Intelligence**: monitoraggio dark web commerciale

Per le PMI: implementa HaveIBeenPwned con notifiche automatiche. Ogni volta che un'email aziendale appare in un breach, forza il cambio password.

## Shodan Monitor: i tuoi asset esposti

Shodan Monitor ti avvisa quando nuovi servizi del tuo range IP diventano visibili su Internet:

```bash
# Cerca i tuoi range IP su Shodan
shodan search "hostname:tuaazienda.it"
shodan search "org:Nome Azienda S.r.l."

# Shodan Monitor (a pagamento) → alert automatico se appare
# un nuovo servizio esposto sul tuo range
```

Particolarmente utile per trovare:
- RDP e SSH esposti per errore
- Pannelli di amministrazione accessibili
- Versioni di software con CVE note in produzione

## Certificati SSL: find your subdomains

Gli aggressori trovano i sottodomini tramite i certificati SSL pubblici. Puoi farlo anche tu:

```bash
# Cerca tutti i certificati per il tuo dominio
curl "https://crt.sh/?q=tuaazienda.it&output=json" | jq '.[].name_value' | sort -u

# Oppure
subfinder -d tuaazienda.it
amass enum -passive -d tuaazienda.it
```

Potresti scoprire staging, test, o sistemi dimenticati con versioni software vecchie.

## GitHub e repository pubblici

Molti breach iniziano da sviluppatori che committano credenziali su repository pubblici:

```bash
# GitHub dorking
org:tuaazienda password
org:tuaazienda secret_key
org:tuaazienda api_key
org:tuaazienda .env

# Tool automatici
gitleaks detect --source=./repo   # cerca segreti nel codice
trufflehog github --org=tuaorg   # scansiona tutti i repo dell'organizzazione
```

## Action plan OSINT difensivo

1. **Mensile**: Google Dork sul tuo dominio, check Shodan
2. **Automatico**: Google Alerts, HaveIBeenPwned Monitor
3. **Trimestrale**: ricerca GitHub per credenziali accidentalmente committate
4. **Annuale**: verifica completa dell'esposizione come farebbe un pentester esterno

L'investimento è minimo. Il valore è scoprire prima degli avversari ciò che è già pubblico.
