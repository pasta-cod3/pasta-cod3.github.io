---
layout: post
title: "Command & Control: cos'è un C2 e come viene rilevato dai difensori"
date: 2026-06-07
cat: red
tags: [C2, command and control, Metasploit, Cobalt Strike, MITRE ATT&CK, detection]
excerpt: "Un framework C2 è il cuore delle operazioni red team avanzate. Cos'è, come funziona la comunicazione attaccante-agente, e soprattutto come i blue team li rilevano."
---

Nelle operazioni di penetration testing avanzato e red team, il **Command & Control (C2)** è l'infrastruttura che permette all'operatore di comunicare con gli agenti (impianti) eseguiti sui sistemi compromessi. Capire come funziona è fondamentale sia per chi simula gli attacchi che per chi li deve rilevare.

## L'anatomia di un C2

```
Operatore → [C2 Server] ← Agente (sul sistema compromesso)
                ↕
         [Team Server]
```

Un framework C2 ha tre componenti:
- **Server**: riceve le connessioni degli agenti, gestisce le sessioni
- **Agente / Implant**: software eseguito sui sistemi compromessi, si connette al server
- **Client**: interfaccia per l'operatore

Il **callback** avviene tipicamente tramite HTTP/S, DNS, o SMB — protocolli che attraversano quasi tutti i firewall.

## Framework usati nei pentest autorizzati

| Framework | Note |
|-----------|------|
| **Metasploit** | Open source, il più usato per pentest standard |
| **Cobalt Strike** | Commerciale, standard de facto per red team avanzati |
| **Sliver** | Open source, alternativa moderna a CS |
| **Havoc** | Open source, molto usato in CTF avanzati |
| **Brute Ratel C4** | Commerciale, progettato per eludere EDR |

## Come comunica un agente: beaconing

Il pattern caratteristico di un C2 è il **beaconing**: l'agente contatta il server a intervalli regolari per ricevere comandi. Un agente configurato con beacon interval di 60 secondi manderà una richiesta HTTP ogni minuto.

```
09:00:01 → GET /jquery.min.js HTTP/1.1 Host: c2.example.com
09:01:01 → GET /jquery.min.js HTTP/1.1 Host: c2.example.com
09:02:01 → GET /jquery.min.js HTTP/1.1 Host: c2.example.com
```

I blue team cercano esattamente questo pattern: richieste periodiche regolari verso lo stesso host, anche se il traffico sembra legittimo.

## Tecniche di evasione del traffico C2

Gli operatori red team nascondono il traffico C2:
- **Domain Fronting**: usa CDN come Cloudflare per mascherare la destinazione reale
- **Malleable Profiles** (Cobalt Strike): personalizzano il traffico HTTP per sembrare applicazioni legittime (es. Google Analytics, Bing, Office365)
- **DNS C2**: i comandi vengono codificati in query DNS, difficili da bloccare
- **Sleeping / Jitter**: interval variabile (60s ± 30s) per rompere il pattern regolare

## Come i difensori lo rilevano — MITRE ATT&CK

Le tecniche C2 nel framework MITRE ATT&CK (TA0011):
- **T1071** Application Layer Protocol — traffico C2 su HTTP/DNS
- **T1573** Encrypted Channel — uso di TLS per cifrare i beacon
- **T1008** Fallback Channels — canali di fallback se il primario viene bloccato
- **T1568** Dynamic Resolution — uso di DGA o Fast Flux per i domini C2

**Indicatori di rilevamento**:
- Beaconing regolare verso IP/domini insoliti
- Connessioni HTTPS verso IP diretti (senza nome host)
- Alto volume di query DNS verso domini registrati di recente
- Processi insoliti con connessioni di rete (es. `notepad.exe` con socket TCP)
- User-Agent strings non standard o incoerenti con il browser dichiarato

## Cosa cerca un analyst nel SIEM

```
# Ricerca beaconing in Splunk (esempio)
index=proxy sourcetype=squid
| stats count, avg(bytes) by src_ip, dest_host, _time span=1m
| where count > 50 AND avg(bytes) < 500
```

Richieste molto frequenti, piccole e regolari verso lo stesso host = beaconing sospetto.
