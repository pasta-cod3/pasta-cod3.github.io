---
layout: post
title: "Threat Intelligence per principianti: capire il nemico prima che arrivi"
description: "Introduzione alla Threat Intelligence: tipi di intelligence, fonti open source (OSINT), feed IoC, MISP, e come usare queste informazioni per difendersi."
date: 2026-02-07
categoria: Blue Team
tags: [threat-intelligence, OSINT, IoC, MISP, CTI, STIX, TAXII]
---

# Threat Intelligence per principianti: capire il nemico prima che arrivi

C'è un concetto militare che mi ha sempre affascinato: **"se conosci il nemico e conosci te stesso, in cento battaglie non sarai mai in pericolo"** — Sun Tzu, L'Arte della Guerra.

La Threat Intelligence è esattamente questo applicato alla cybersecurity: raccogliere, analizzare e condividere informazioni sugli attori di minaccia per prendere decisioni di difesa migliori. Non si tratta solo di sapere che esiste un gruppo chiamato APT28 — si tratta di capire **come attacca, cosa usa, chi prende di mira e quando**.

---

## I tipi di Threat Intelligence

### Strategic Intelligence

L'intelligence di alto livello, destinata ai decision maker. Risponde a domande come:
- *Quali settori industriali sono più a rischio in questo momento?*
- *Quali attori di stato sono attivi nella nostra regione?*
- *Come sta evolvendo il panorama delle minacce ransomware?*

Non ha dati tecnici — ha contesto, tendenze, impatto sul business.

### Operational Intelligence

Il livello intermedio. Fornisce informazioni su campagne specifiche in corso:
- *Il gruppo X sta conducendo una campagna di phishing contro il settore finanziario italiano questa settimana*
- *È in corso una campagna di sfruttamento di CVE-2024-XXXX*

### Tactical Intelligence

Il livello tecnico. Descrive le TTP (Tattiche, Tecniche e Procedure) degli attaccanti, mappate su MITRE ATT&CK.

### Technical Intelligence

Il più granulare. Sono gli **Indicatori di Compromissione (IoC)**:
- Hash di file malware
- Indirizzi IP di C2 (Command & Control)
- Domini usati in campagne phishing
- URL di distribuzione di payload

---

## Fonti OSINT per la Threat Intelligence

Queste sono le fonti gratuite che uso più spesso:

### Feed IoC

```bash
# AlienVault OTX (Open Threat Exchange)
# Crea un account gratuito su otx.alienvault.com
# API per scaricare i pulse più recenti:
curl -H "X-OTX-API-KEY: TUO_API_KEY" \
  "https://otx.alienvault.com/api/v1/pulses/subscribed" | python3 -m json.tool

# Abuse.ch - malware e botnet
# URLhaus (URL di distribuzione malware)
curl https://urlhaus-api.abuse.ch/v1/urls/recent/ | python3 -m json.tool

# MalwareBazaar (hash di malware)
curl -d 'query=get_recent&selector=time' https://mb-api.abuse.ch/api/v1/

# Feodo Tracker (IP di botnet)
curl https://feodotracker.abuse.ch/downloads/ipblocklist.csv
```

### Threat Actor Tracking

- **MITRE ATT&CK Groups**: [attack.mitre.org/groups](https://attack.mitre.org/groups) — profili completi di oltre 100 gruppi
- **Malpedia**: database di famiglie malware con campioni e rapporti
- **Mandiant Threat Intelligence** (free tier): report su campagne attive
- **Recorded Future Community**: indicatori gratuiti

### Fonti di intelligence governative

```
CISA (USA):          cisa.gov/known-exploited-vulnerabilities-catalog
NCSC (UK):           ncsc.gov.uk/threat-reports
CERT-AgID (Italia):  cert-agid.gov.it/news-e-comunicati/
Europol:             europol.europa.eu/publications-events
```

---

## STIX e TAXII: i linguaggi dell'intelligence

La Threat Intelligence si condivide in formati standard:

### STIX 2.1 (Structured Threat Information Expression)

STIX è il formato JSON per rappresentare oggetti di intelligence:

```json
{
  "type": "bundle",
  "id": "bundle--12345",
  "objects": [
    {
      "type": "indicator",
      "spec_version": "2.1",
      "id": "indicator--abc123",
      "name": "IP C2 del gruppo XYZ",
      "description": "Server C2 identificato in campagna ransomware",
      "pattern": "[ipv4-addr:value = '185.220.101.47']",
      "pattern_type": "stix",
      "valid_from": "2026-02-01T00:00:00Z",
      "labels": ["malicious-activity"]
    },
    {
      "type": "malware",
      "spec_version": "2.1",
      "id": "malware--def456",
      "name": "CryptoLocker Variant X",
      "malware_types": ["ransomware"],
      "is_family": false
    }
  ]
}
```

### TAXII 2.1 (Trusted Automated eXchange of Intelligence Information)

TAXII è il protocollo per distribuire STIX via API. Molti feed gratuiti usano TAXII:

```python
from taxii2client.v21 import Server

# Connettiti a un server TAXII pubblico
server = Server("https://cti-taxii.mitre.org/taxii/",
                user="guest", password="guest")

# Lista le collection disponibili
for api_root in server.api_roots:
    print(f"\n[API Root]: {api_root.title}")
    for collection in api_root.collections:
        print(f"  - {collection.title} ({collection.id})")
```

---

## MISP: la piattaforma di threat intelligence sharing

**MISP** (Malware Information Sharing Platform) è la piattaforma open source più usata per gestire e condividere intelligence. Molti CERT nazionali e organizzazioni la usano.

```bash
# Installazione rapida con Docker
git clone https://github.com/MISP/misp-docker
cd misp-docker
cp template.env .env
docker-compose up -d
```

Con MISP puoi:
- Importare IoC da feed esterni
- Correlare indicatori automaticamente
- Condividere intelligence con altre organizzazioni
- Esportare in STIX, CSV, YARA, Sigma

```python
# Esempio: aggiungere un evento IoC a MISP via API
import pymisp

misp = pymisp.PyMISP("https://tuo-misp.local", "TUO_API_KEY", ssl=False)

evento = misp.new_event(
    distribution=0,
    threat_level_id=2,
    analysis=1,
    info="Campagna phishing IT - Febbraio 2026"
)

# Aggiungi un IoC (IP di C2)
misp.add_attribute(
    evento["Event"]["id"],
    {
        "type": "ip-dst",
        "value": "185.220.101.47",
        "comment": "C2 identificato in campagna",
        "to_ids": True
    }
)
```

---

## Come integrare la Threat Intelligence nel tuo workflow

Il valore dell'intelligence si realizza solo quando viene **consumata e agita**:

### 1. Block list automatica

```bash
# Script per scaricare IP malevoli e aggiungerli a nftables
curl -s https://feodotracker.abuse.ch/downloads/ipblocklist.txt | grep -v "^#" | while read ip; do
    nft add element inet filter blocklist { $ip }
done
```

### 2. Regole YARA da intelligence

```yara
/* Regola YARA basata su indicatori di una campagna specifica */
rule APT_Campaign_Feb2026 {
    meta:
        author = "pasta-cod3"
        description = "Indicatori campagna osservata Feb 2026"
        tlp = "white"
    
    strings:
        $mutex = "Global\\MutexName_XYZ" ascii
        $c2_url = "cdn-update.evil-domain.com" ascii
        $pdb = "C:\\Users\\attacker\\project\\payload.pdb" ascii
    
    condition:
        any of them
}
```

### 3. Regole Sigma per SIEM

```yaml
title: Connessione verso C2 noto - Campagna Feb2026
status: experimental
description: Rileva connessioni verso IP C2 noti da threat intelligence
logsource:
    category: network_connection
    product: windows
detection:
    selection:
        DestinationIp:
            - '185.220.101.47'
            - '194.165.16.x'
    condition: selection
level: high
tags:
    - attack.command_and_control
    - attack.t1071
```

---

## Conclusione

La Threat Intelligence non è solo per le grandi organizzazioni con team dedicati. Anche con risorse limitate, consumare feed gratuiti e integrare gli indicatori nel proprio SIEM o firewall fa una differenza concreta.

L'obiettivo non è sapere tutto su tutti gli attaccanti — è sapere **abbastanza** per prendere decisioni migliori sulla difesa. E quella conoscenza, oggi, è spesso gratuita e accessibile a chiunque voglia andarla a cercare. 🕵️
