---
layout: post
title: "Honeypot e Deception Technology: intrappolare gli attaccanti con trappole digitali"
date: 2026-06-16
cat: blue
tags: [honeypot, deception, canary token, honeytokens, threat intelligence, blue team]
excerpt: "Un honeypot è un sistema intenzionalmente vulnerabile progettato per attirare gli attaccanti. Le moderne deception technology vanno oltre: distribuiscono trappole ovunque nella rete per rilevare le intrusioni con quasi zero falsi positivi."
---

Un alert SIEM può avere una percentuale di falsi positivi del 90%. Un honeypot ha una percentuale di falsi positivi dello 0%: se qualcuno ci interagisce, è un attaccante. È la premessa fondamentale della deception technology.

## Cos'è un Honeypot

Un honeypot è un sistema (server, workstation, database, file) che simula un target appetibile ma non ha funzioni produttive reali. Nessun utente legittimo dovrebbe mai accedervi. Qualsiasi interazione è sospetta per definizione.

**Tipi di honeypot:**
- **Low-interaction**: emulano servizi limitati, facili da configurare (Honeyd, OpenCanary)
- **High-interaction**: sistemi reali, massima fedeltà all'attaccante, più rischiosi da gestire
- **Research honeypot**: raccolgono dati sulle tecniche degli attaccanti (usati da SANS, Symantec)
- **Production honeypot**: difendono reti reali rilevando intrusioni

## OpenCanary — honeypot leggero e facile

```bash
pip install opencanary
opencanaryd --copyconfig   # crea config.json
# Abilita servizi che vuoi emulare:
# ssh, ftp, http, mysql, redis, mongodb...
opencanaryd --start

# Ogni accesso genera un alert
# configurabile via syslog, email, Slack, webhook
```

## Canary Tokens — trappole ovunque

I Canary Token (da canarytokens.org) sono oggetti digitali che "chiamano casa" quando qualcuno li apre:

- **File Word/PDF**: se un attaccante apre `CREDENZIALI_BANCA.docx`, ricevi un alert con IP, browser, geolocalizzazione
- **Link URL**: invia un link "confidenziale" — se viene visitato, alert
- **AWS Access Key**: se qualcuno testa questa chiave, alert immediato da AWS
- **DNS token**: se qualcuno risolve questo hostname, alert
- **Immagine**: se viene caricata su un server esterno, alert

```bash
# Crea un token su canarytokens.org
# Scarica il file .docx
# Piazzalo su una share di rete come "password_lista_2026.docx"
# Attendi che un attaccante lo trovi e lo apra
```

La bellezza: l'attaccante non sa che ha attivato un allarme.

## Honeytokens in Active Directory

In AD si possono creare account "honeypot" con nomi appetibili:

```powershell
# Crea un account che nessuno deve usare
New-ADUser -Name "admin-backup" -AccountPassword (ConvertTo-SecureString "Password123!" -AsPlainText -Force)

# Monitora ogni tentativo di login su quest'account
# con alert SIEM su Event ID 4625 (failed login) e 4624 (successful login)
```

Ogni tentativo di login su `admin-backup` è automaticamente sospetto — nessun utente legittimo conosce questo account.

## HoneyPot in rete: rilevamento del lateral movement

Distribuire honeypot "invisibili" sui segmenti di rete:

- Un host con porte SSH/RDP/SMB aperte che sembrano reali
- Credenziali "trovabili" (nei log, in file di configurazione fake) che portano al honeypot
- Se un attaccante le usa per connettersi, alert immediato

Questo è particolarmente efficace per rilevare il **lateral movement**: un attaccante che si muove nella rete interna spesso scansiona e prova credenziali, e prima o poi colpisce un honeypot.

## Integrazione nel SOC

- Alert honeypot → priorità CRITICA, zero falsi positivi
- Ogni interazione viene loggata e analizzata
- Permette di capire le TTP dell'attaccante prima che raggiunga target reali
- Alcuni honeypot avanzati rallentano deliberatamente l'attaccante (tarpit)

## Soluzioni enterprise

Per ambienti enterprise, soluzioni come **Attivo Networks** (ora SentinelOne Ranger), **Illusive Networks** e **Cymulate** distribuiscono automaticamente migliaia di deception element su tutta la rete.
