---
layout: post
title: "SSRF — Server-Side Request Forgery: dalla richiesta al cloud metadata"
date: 2026-08-23
cat: red
tags: [SSRF, web, cloud metadata, exploitation, red team]
excerpt: "Una SSRF costringe il server a compiere richieste che l'attaccante non potrebbe fare direttamente — spesso la strada più diretta verso credenziali cloud, servizi interni e reti che dovrebbero essere irraggiungibili dall'esterno."
---

Una Server-Side Request Forgery (SSRF) sfrutta una funzionalità legittima — il server che effettua una richiesta HTTP per conto dell'utente — per far compiere all'applicazione richieste verso destinazioni che l'attaccante non potrebbe raggiungere direttamente: rete interna, servizi di management, e soprattutto l'endpoint di metadata cloud.

## Dove si nasconde

Qualsiasi funzionalità che prende un URL (o un host) in input e lo contatta lato server è un candidato:

- Import di immagini/avatar da URL
- Webhook e integrazioni ("test connection")
- PDF generator che carica risorse esterne
- Proxy/fetch API interni, SSO federato, parser XML con entità esterne (XXE che degenera in SSRF)

## Il bersaglio più prezioso: il cloud metadata endpoint

Ogni provider cloud espone un endpoint interno, raggiungibile solo dall'istanza stessa, che serve credenziali temporanee e configurazione:

```bash
# AWS (IMDSv1 — nessuna autenticazione)
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Azure
curl -H "Metadata: true" "http://169.254.169.254/metadata/instance?api-version=2021-02-01"

# GCP
curl -H "Metadata-Flavor: Google" "http://metadata.google.internal/computeMetadata/v1/"
```

Se l'applicazione vulnerabile gira su un'istanza EC2 con un IAM role allegato, una SSRF verso quell'endpoint restituisce **access key, secret key e session token** validi — accesso diretto all'account cloud, spesso con privilegi ben più ampi di quelli dell'applicazione stessa.

> AWS ha introdotto **IMDSv2**, che richiede un token ottenuto con una richiesta PUT autenticata a livello di sessione — mitiga le SSRF "semplici" (GET-based) ma non quelle che permettono all'attaccante di controllare header e metodo della richiesta.

## Bypass dei filtri comuni

I blocklist basati su stringa sono quasi sempre aggirabili:

| Tecnica | Esempio |
|---|---|
| Encoding decimale/ottale/esadecimale dell'IP | `http://2130706433/` (= 127.0.0.1) |
| IPv6 mapping | `http://[::ffff:127.0.0.1]/` |
| DNS rebinding | dominio che risolve a IP pubblico in fase di validazione, poi a IP interno alla richiesta reale |
| Redirect chain | URL pubblico che risponde con `302` verso `169.254.169.254` |
| Confusione del parser URL | `http://trusted.com@169.254.169.254/` — molte librerie leggono l'host dopo la `@` in modo incoerente |
| Domini "wildcard" mal validati | `169.254.169.254.trusted-domain.com` supera un controllo `.endswith("trusted-domain.com")` |

## Blind SSRF

Quando la risposta della richiesta non torna nel body, la SSRF è comunque sfruttabile: si usa un listener controllato (Burp Collaborator, `interactsh`) per confermare l'esecuzione, oppure si sfrutta la differenza di tempo di risposta per fare port scanning interno (porta chiusa = risposta immediata, porta aperta = timeout diverso).

## Come si difende un blue team

- **IMDSv2 obbligatorio** e `hop limit` a 1 sulle istanze EC2 — blocca l'inoltro del token da un container annidato
- **Allowlist**, non blocklist, sui domini/IP che l'applicazione può contattare
- **Rete segmentata**: l'applicazione web non dovrebbe avere di default un percorso di rete verso servizi interni sensibili
- **Disabilitare i redirect automatici** nel client HTTP lato server, o validare l'URL di destinazione dopo ogni redirect, non solo all'inizio
- **Egress filtering**: firewall in uscita che limita le destinazioni raggiungibili dai servizi applicativi

## Conclusione

La SSRF è pericolosa non per la richiesta in sé, ma per *dove* può arrivare: reti interne, pannelli di management non esposti, e soprattutto le credenziali cloud che l'infrastruttura moderna serve implicitamente a chiunque riesca a farsi passare per l'istanza stessa.
