---
layout: post
title: "IDS e IPS con Suricata: metti gli occhi sulla tua rete"
description: "Guida pratica a Suricata: installazione, configurazione come IDS/IPS, scrittura di regole personalizzate e integrazione con Elastic Stack per il monitoraggio."
date: 2026-02-08
categoria: Blue Team
tags: [IDS, IPS, suricata, network-security, regole, elastic, snort]
---

# IDS e IPS con Suricata: metti gli occhi sulla tua rete

Hai un firewall. Ottimo. Ma il firewall guarda solo le porte e i protocolli — non guarda **dentro** il traffico. Potrebbe passarci un C2 in HTTPS, una sessione di esfiltrazione dati via DNS, un exploit su una porta lecita. Il firewall non direbbe niente.

Ecco dove entra in gioco un **IDS (Intrusion Detection System)** o un **IPS (Intrusion Prevention System)**: strumenti che analizzano il traffico di rete in profondità, cercando pattern di attacco noti e comportamenti anomali.

**Suricata** è la mia scelta preferita: open source, performante, con supporto multi-thread, regole compatibili con Snort e sviluppato attivamente.

---

## IDS vs IPS: la differenza pratica

| | IDS | IPS |
|---|---|---|
| Posizione | Out-of-band (copia del traffico) | In-line (nel mezzo del traffico) |
| Azione | Alert only | Alert + blocca |
| Rischio | Nessun impatto sul traffico | Falsi positivi possono bloccare traffico legittimo |
| Primo passo consigliato | ✅ Sì | Dopo aver tuned le regole |

La regola d'oro: **inizia sempre in modalità IDS** (solo alert), studia i falsi positivi, poi passa a IPS quando sei sicuro delle regole.

---

## Installazione di Suricata

```bash
# Ubuntu/Debian
sudo add-apt-repository ppa:oisf/suricata-stable
sudo apt update
sudo apt install suricata -y

# Verifica versione
suricata --version

# RHEL/CentOS/Fedora
sudo dnf install epel-release -y
sudo dnf install suricata -y
```

---

## Configurazione base

Il file di configurazione principale è `/etc/suricata/suricata.yaml`. I punti chiave:

```yaml
# Specifica le reti "home" (quelle che vuoi monitorare)
vars:
  address-groups:
    HOME_NET: "[192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12]"
    EXTERNAL_NET: "!$HOME_NET"
  
  port-groups:
    HTTP_PORTS: "80"
    HTTPS_PORTS: "443"
    SSH_PORTS: "22"

# Interfaccia di cattura
af-packet:
  - interface: eth0
    threads: auto
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes

# Output
outputs:
  - eve-log:
      enabled: yes
      filetype: regular
      filename: /var/log/suricata/eve.json
      types:
        - alert:
            payload: yes
            payload-printable: yes
        - http:
            extended: yes
        - dns:
            query: yes
            answer: yes
        - tls:
            extended: yes
        - flow
```

### Scarica le regole

```bash
# Scarica e aggiorna le regole con suricata-update
sudo apt install python3-pip -y
pip3 install suricata-update

# Aggiorna tutte le sorgenti di regole
sudo suricata-update

# Abilita sorgenti aggiuntive gratuite
sudo suricata-update list-sources
sudo suricata-update enable-source et/open         # Emerging Threats Open (gratis)
sudo suricata-update enable-source ptresearch/attackdetection
sudo suricata-update update-sources
sudo suricata-update

# Le regole vengono salvate in /var/lib/suricata/rules/suricata.rules
```

---

## Avvio e test

```bash
# Test della configurazione
sudo suricata -T -c /etc/suricata/suricata.yaml -v

# Avvia come servizio
sudo systemctl enable suricata
sudo systemctl start suricata

# Monitora i log in tempo reale
sudo tail -f /var/log/suricata/eve.json | python3 -c "
import sys, json
for line in sys.stdin:
    try:
        event = json.loads(line)
        if event.get('event_type') == 'alert':
            print(f\"[ALERT] {event['timestamp']} | {event['src_ip']} -> {event['dest_ip']} | {event['alert']['signature']}\")
    except: pass
"

# Test con traffico malevolo simulato (curl verso un IP noto nei feed)
curl http://testmynids.org/uid/index.html
```

---

## Scrittura di regole personalizzate

Questa è la parte più potente: Suricata ti permette di scrivere le tue regole basandoti sulla tua threat intelligence.

### Struttura di una regola Suricata

```
action  proto  src_ip  src_port  direction  dst_ip  dst_port  (opzioni)
```

```suricata
# Rileva connessioni verso un IP di C2 noto
alert ip any any -> 185.220.101.47 any (
    msg:"TI - Connessione verso C2 noto Feb2026";
    classtype:trojan-activity;
    sid:9000001;
    rev:1;
    metadata:affected_product Windows;
)

# Rileva download di file eseguibili via HTTP
alert http any any -> any any (
    msg:"Possible EXE download via HTTP";
    flow:established,to_client;
    file.data;
    content:"MZ";
    within:2;
    http.response_body;
    classtype:policy-violation;
    sid:9000002;
    rev:1;
)

# Rileva DNS verso domini DGA (generazione algoritmica)
alert dns any any -> any any (
    msg:"Possible DGA domain - long random subdomain";
    dns.query;
    pcre:"/^[a-z0-9]{15,}\.(?:com|net|org|ru|cn)$/i";
    classtype:bad-unknown;
    sid:9000003;
    rev:1;
)

# Rileva tentativi di SQL Injection via HTTP
alert http any any -> $HOME_NET any (
    msg:"SQL Injection Attempt - UNION SELECT";
    http.uri;
    content:"UNION";
    nocase;
    content:"SELECT";
    nocase;
    distance:0;
    classtype:web-application-attack;
    sid:9000004;
    rev:1;
)

# Rileva scan Nmap
alert tcp any any -> $HOME_NET any (
    msg:"Nmap Scan Detected - SYN Scan";
    flags:S;
    threshold:type both, track by_src, count 20, seconds 5;
    classtype:network-scan;
    sid:9000005;
    rev:1;
)
```

Salva le tue regole custom in `/etc/suricata/rules/local.rules` e aggiungile al config:

```yaml
# In suricata.yaml
rule-files:
  - /var/lib/suricata/rules/suricata.rules
  - /etc/suricata/rules/local.rules  # ← aggiungi questa
```

---

## Modalità IPS: bloccare il traffico

Per passare da IDS a IPS, devi mettere Suricata in modalità **NFQUEUE** su Linux:

```bash
# Installa le dipendenze
sudo apt install libnetfilter-queue-dev -y

# Reindirizza il traffico verso Suricata
sudo iptables -I FORWARD -j NFQUEUE --queue-num 0
sudo iptables -I INPUT -j NFQUEUE --queue-num 0

# Avvia Suricata in modalità IPS
sudo suricata -c /etc/suricata/suricata.yaml -q 0
```

Nelle regole, cambia `alert` con `drop` per bloccare il traffico:

```suricata
drop ip any any -> 185.220.101.47 any (
    msg:"BLOCK - C2 noto";
    sid:9000010;
    rev:1;
)
```

---

## Integrazione con Elastic Stack

Il file `eve.json` di Suricata è perfetto per l'ingestione su Elasticsearch:

```bash
# Installa Filebeat
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.x-amd64.deb
sudo dpkg -i filebeat-8.x-amd64.deb

# Configura Filebeat per Suricata
sudo filebeat modules enable suricata

# Configura /etc/filebeat/modules.d/suricata.yml
```

```yaml
- module: suricata
  eve:
    enabled: true
    var.paths: ["/var/log/suricata/eve.json"]
```

```bash
# Configura l'output verso Elasticsearch
sudo nano /etc/filebeat/filebeat.yml
```

```yaml
output.elasticsearch:
  hosts: ["localhost:9200"]

setup.kibana:
  host: "localhost:5601"
```

```bash
# Carica i dashboard Kibana preconfigurati per Suricata
sudo filebeat setup --dashboards
sudo systemctl start filebeat
```

In Kibana avrai dashboard pronti con: top alert, paesi di origine degli attacchi, protocolli più colpiti, trend temporale.

---

## Tuning: ridurre i falsi positivi

Il nemico del Blue Team non è solo l'attaccante — sono i **falsi positivi** che ti fanno ignorare gli alert reali.

```bash
# Sopprime alert per IP interni fidati
# In /etc/suricata/threshold.conf:
suppress gen_id 1, sig_id 2013028, track by_src, ip 192.168.1.0/24

# Sopprime alert ripetitivi (threshold)
# Logga solo 1 alert ogni 60 secondi per lo stesso IP sorgente
threshold gen_id 1, sig_id 9000005, type threshold, track by_src, count 1, seconds 60
```

---

## Conclusione

Suricata è uno strumento potente che può trasformare la tua visibilità sulla rete da zero a quasi completa in poche ore. L'investimento iniziale è nella configurazione e nel tuning — ma una volta rodato, ti fornisce un livello di alerting che nessun firewall classico può darti.

Inizia in modalità IDS, studia i tuoi log, scrivi regole basate sulla tua realtà specifica, e passa a IPS solo quando hai fiducia nelle tue regole. Il traffico di rete non mente. 📡
