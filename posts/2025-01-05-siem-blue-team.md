# SIEM e Blue Team: guida pratica all'analisi dei log

## Introduzione

Un **SIEM** (Security Information and Event Management) è il cuore operativo di qualsiasi SOC. Raccoglie log da ogni fonte disponibile — firewall, endpoint, Active Directory, applicazioni web — li normalizza, li correla e genera alert.

Ma avere un SIEM non basta. Il vero lavoro è **saperlo interrogare**, capire quali alert vale la pena investigare e come ridurre il rumore di fondo senza perdere i segnali reali.

Questa guida è orientata a chi inizia a lavorare in un SOC o vuole capire come strutturare un'analisi dei log efficace.

---

## L'architettura base di un SIEM

```
[Sorgenti]          [Raccolta]        [Processing]      [Output]
  Firewall    ──→   Log shipper  ──→   Normalizza   ──→  Dashboard
  AD / DC     ──→   (Filebeat,         Correla           Alert
  Endpoint    ──→    Winlogbeat)        Indicizza         Report
  Web server  ──→
```

Le soluzioni più diffuse sono:

- **Elastic SIEM** (Elasticsearch + Kibana) — open source, molto flessibile
- **Splunk** — potente ma costoso, molto diffuso in enterprise
- **Microsoft Sentinel** — nativo su Azure, ottimo in ambienti Microsoft
- **Wazuh** — open source, ottimo per chi inizia

---

## Fonti di log fondamentali

### Windows Event Log

I tre canali più importanti:

| Event ID | Descrizione | Perché interessa |
|---|---|---|
| 4624 | Logon riuscito | Accessi a orari insoliti, logon type 3 da IP esterni |
| 4625 | Logon fallito | Brute force, password spray |
| 4688 | Creazione processo | Esecuzione di PowerShell, cmd, strumenti sospetti |
| 4698 | Task schedulato creato | Persistence via scheduled task |
| 4768/4769 | Ticket Kerberos | Kerberoasting, Pass-the-Ticket |
| 7045 | Nuovo servizio installato | Persistence via servizio |

### Sysmon (consigliato)

Sysmon di Sysinternals arricchisce enormemente i log Windows. Con una buona configurazione (tipo quella di [SwiftOnSecurity](https://github.com/SwiftOnSecurity/sysmon-config)) ottieni:

- **Event 1**: Process creation con hash e command line completa
- **Event 3**: Network connection con processo sorgente
- **Event 11**: File created
- **Event 22**: DNS query

### Firewall / Network

Cerca sempre:

- Connessioni verso IP di reputazione bassa
- Traffico in uscita su porte insolite (4444, 8080, etc.)
- Elevato volume di dati verso destinazioni esterne (data exfiltration)
- Scansioni di rete interne

---

## Correlation rule: da dove partire

Una **correlation rule** è una logica che aggrega più eventi per identificare un comportamento sospetto. Esempi classici:

### Brute force su RDP

```sql
-- Pseudo-query (sintassi Elastic/KQL)
event.code: "4625" AND
winlog.event_data.LogonType: "10" AND
count() >= 10 WITHIN 5 minutes
GROUP BY source.ip, destination.ip
```

### PowerShell encoded command

```sql
event.code: "4688" AND
process.name: "powershell.exe" AND
process.command_line: *-enc* OR *-EncodedCommand*
```

### Nuovo servizio + esecuzione da cartella temp

```sql
event.code: "7045" AND
winlog.event_data.ImagePath: (*\\Temp\\* OR *\\AppData\\*)
```

---

## Gestione degli alert: ridurre i falsi positivi

Il problema più comune nei SOC è il **alert fatigue**: troppi alert, quasi tutti falsi positivi, e gli analisti smettono di prenderli sul serio.

### Strategia a livelli

1. **Triage automatico**: regole semplici che scartano automaticamente eventi noti-buoni (es. antivirus aggiornato, backup notturno)
2. **Enrichment**: arricchisci ogni alert con contesto — IP su threat feed, utente in AD, asset criticality
3. **Priorità per rischio**: un logon fallito su una workstation è diverso da un logon fallito sul Domain Controller
4. **Tuning continuo**: ogni falso positivo è un'opportunità per affinare la regola

### Esempio di enrichment query

```python
# Pseudo-python: interroga VirusTotal sull'IP dell'alert
import requests

def check_ip_reputation(ip):
    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"
    headers = {"x-apikey": "YOUR_API_KEY"}
    r = requests.get(url, headers=headers)
    data = r.json()
    malicious = data['data']['attributes']['last_analysis_stats']['malicious']
    return malicious > 0
```

---

## Playbook: cosa fare quando scatta un alert

Un buon SOC ha **playbook** documentati per i tipi di incident più comuni. Un esempio per "account compromesso":

```
1. IDENTIFICAZIONE
   - Qual è l'account coinvolto?
   - Da quale IP si è autenticato?
   - Quali risorse ha acceduto?

2. CONTENIMENTO
   - Disabilita l'account in AD
   - Blocca l'IP sorgente sul firewall

3. ANALISI
   - Controlla i log delle ultime 24-72h per l'account
   - Verifica se ha creato altri account o task schedulati
   - Cerca movimenti laterali correlati

4. ERADICAZIONE / RECOVERY
   - Resetta la password
   - Controlla tutti i sistemi su cui l'account si è autenticato
   - Riabilita l'account solo dopo verifica

5. DOCUMENTAZIONE
   - Scrivi l'incident report
   - Aggiorna le regole SIEM se necessario
```

---

## Conclusione

Un SIEM è potente quanto le query che ci scrivi e i processi che ci costruisci intorno. Il vero valore non è nell'aggregazione dei log — quella è la parte facile — ma nella capacità di estrarre **segnali significativi dal rumore**.

Inizia con poche correlation rule ben fatte, fai tuning costante, e costruisci playbook chiari. Poi espandi gradualmente.

Nel prossimo articolo parlerò di **threat hunting proattivo** — come cercare attività malevole nei log anche in assenza di alert.
