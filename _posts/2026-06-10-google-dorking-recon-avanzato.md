---
layout: post
title: "Google Dorking avanzato: OSINT e reconnaissance con i motori di ricerca"
date: 2026-06-10
cat: red
tags: [Google Dork, OSINT, recon, Shodan, Censys, passive reconnaissance, pentest]
excerpt: "I motori di ricerca indicizzano molto più di quanto pensiamo. Google Dork, Shodan e Censys permettono di trovare informazioni critiche su target senza mai toccarli direttamente."
---

Prima di inviare un singolo pacchetto al target, un buon pentester raccoglie il più possibile da fonti pubbliche. I motori di ricerca sono tra le fonti più potenti — e più sottovalutate. Il Google Dorking (o Google Hacking) consiste nell'usare operatori avanzati per trovare informazioni che non dovrebbero essere accessibili.

## Operatori Google fondamentali

```
site:target.com              → solo pagine del dominio
filetype:pdf site:target.com → PDF del sito
inurl:admin site:target.com  → URL contenenti "admin"
intitle:"index of"           → directory listing aperte
intext:"password" filetype:txt → file di testo con "password"
cache:target.com             → versione cached di Google
```

## Dork pratici per il pentest

```
# Pannelli di login
site:target.com inurl:login
site:target.com inurl:admin
site:target.com intitle:"login"

# File sensibili esposti
site:target.com filetype:sql
site:target.com filetype:env
site:target.com filetype:bak
site:target.com filetype:conf

# Directory listing
site:target.com intitle:"index of /"
site:target.com intitle:"Apache2 Ubuntu Default Page"

# Tecnologie e versioni
site:target.com intext:"Powered by WordPress"
site:target.com intext:"phpMyAdmin"
```

## Google Hacking Database (GHDB)

Il GHDB di Exploit-DB raccoglie migliaia di dork categorizzati per tipo (vulnerabilità, file sensibili, dispositivi, ecc.). È una risorsa fondamentale durante la fase di recon:

**exploit-db.com/google-hacking-database**

## Shodan — il motore di ricerca per dispositivi IoT

Shodan indicizza tutto ciò che è connesso a Internet e risponde a una probe: server, router, webcam, PLC industriali, stampanti. Cerca per banner, protocollo, versione.

```
# Ricerche base Shodan
org:"Azienda Target"
hostname:target.com
ssl.cert.subject.cn:target.com
port:3389 country:IT          → RDP esposti in Italia
product:"Apache httpd" version:"2.4.49"  → versione vulnerabile
```

## Censys — più orientato ai certificati

Censys è simile a Shodan ma con focus sui certificati TLS. Permette di trovare:

- Tutti i sottodomini di un'azienda tramite i loro certificati
- Asset "nascosti" non linkati pubblicamente ma con un certificato valido
- Infrastruttura cloud non mappata

## theHarvester — automatizza la raccolta

```bash
theHarvester -d target.com -b google,bing,yahoo,shodan
# Raccoglie: email, hostname, sottodomini, IP, URL
```

## Cosa si trova (e cosa non dovrebbe essere lì)

Durante engagement reali, con queste tecniche si trovano regolarmente:
- Pannelli di amministrazione non protetti
- File `.env` con chiavi API e credenziali database
- Backup del sito (`.sql`, `.zip`, `.tar.gz`)
- Versioni di software con CVE note
- Credenziali hardcoded in repository GitHub pubblici

## Difesa

- **Google Search Console**: monitora cosa Google ha indicizzato del tuo sito
- **robots.txt**: non blocca Shodan, ma riduce l'indicizzazione Google
- **Security.txt** e bug bounty: rende facile segnalare quello che si trova
- Scansioni periodiche con gli stessi strumenti usati dagli attaccanti (Shodan Monitor, Google Alerts)
- Policy di gestione dei file: nessun backup nella webroot, `.env` fuori dalla webroot
