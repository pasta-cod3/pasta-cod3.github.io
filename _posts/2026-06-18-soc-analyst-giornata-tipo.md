---
layout: post
title: "Giornata tipo di un SOC Analyst: triage, alert fatigue e investigazione"
date: 2026-06-18
cat: blue
tags: [SOC, analyst, triage, alert fatigue, SIEM, incident response, blue team]
excerpt: "Come si passa una giornata in un Security Operations Center? Dalla gestione degli alert mattutini all'investigazione di un incidente reale. Il ruolo del SOC analyst, gli strumenti e le sfide quotidiane."
---

Il Security Operations Center (SOC) è il centro nevralgico della difesa di un'organizzazione. Un SOC analyst lavora con un flusso continuo di alert provenienti da SIEM, EDR, firewall e IDS, con il compito di distinguere le minacce reali dal rumore di fondo.

## La struttura del SOC

I SOC sono tipicamente organizzati in livelli (tier):

**Tier 1 — SOC Analyst**: triage degli alert, prima analisi, escalation ai tier superiori. Spesso lavora su turni 24/7.

**Tier 2 — Senior Analyst / Incident Responder**: investigazione approfondita degli incidenti escalati dal Tier 1, threat hunting, analisi malware.

**Tier 3 — Threat Hunter / Expert**: ricerca proattiva di minacce nascoste nella rete, sviluppo di nuove regole di detection, malware reverse engineering.

## Mattina: gestione degli alert overnight

Ogni mattina, un Tier 1 analyst apre la coda degli alert accumulati durante la notte. La realtà dei SOC enterprise: **centinaia di alert al giorno**, di cui il 95%+ sono falsi positivi o eventi di bassa priorità.

Il processo di triage:

1. **Prioritizzazione**: gli alert sono ordinati per severità (Critical, High, Medium, Low). Si parte dai Critical.
2. **Contestualizzazione**: l'utente che ha generato l'alert è privilegiato? Il sistema è critico? C'è attività correlata?
3. **Deduplication**: lo stesso alert è già stato investigato? C'è un ticket aperto?
4. **Decisione**: chiudi, escalation, o apri un incidente.

## Alert Fatigue: il problema principale

Quando un analyst riceve troppi alert, inizia a chiuderli meccanicamente senza vera analisi. Il risultato: l'incidente reale viene perso nel rumore.

**Soluzioni:**
- **Tuning delle regole SIEM**: ridurre i falsi positivi migliorando le regole
- **Automazione SOAR**: rispondi automaticamente agli alert semplici e ripetitivi
- **Prioritizzazione risk-based**: non tutti i Critical sono uguali
- **Rotazione dei turni**: il burnout degli analyst è un problema serio

## Un incidente reale: investigazione step-by-step

*Scenario: alert "Possible PowerShell Encoded Command" su workstation HR-PC-042*

**Step 1 — Triage**
```
Alert: Encoded PowerShell execution
User: laura.rossi
Host: HR-PC-042
Time: 14:32:17
Severity: HIGH
```

**Step 2 — Contestualizzazione**
- Laura Rossi è una normale impiegata HR, non un amministratore
- PowerShell encoded è insolito per HR
- Controlla nel SIEM gli eventi precedenti su questo host

**Step 3 — Pivot nell'EDR**
```
14:30:12 — outlook.exe (email aperta)
14:30:45 — winword.exe (allegato aperto)
14:31:02 — winword.exe → cmd.exe → powershell.exe -enc JABjAG...
14:31:15 — powershell.exe → connessione a 185.x.x.x:443
```

Catena di processo sospetta: email → Word → PowerShell → connessione esterna. Probabile macro malevola.

**Step 4 — Contenimento**
- Isola immediatamente HR-PC-042 dalla rete (via EDR)
- Blocca il dominio 185.x.x.x sul firewall
- Notifica il responsabile IT e il team IR

**Step 5 — Escalation**
Apri ticket incidente, escalation a Tier 2 per analisi approfondita dell'allegato email e ricerca di altri host che hanno comunicato con lo stesso IP.

## Strumenti del SOC analyst

| Strumento | Uso |
|-----------|-----|
| **SIEM** (Splunk, QRadar, Elastic) | Aggregazione log, ricerca, correlazione |
| **EDR** (CrowdStrike, Defender for Endpoint) | Visibilità endpoint, contenimento |
| **Threat Intel Platform** (MISP, VirusTotal) | Contesto sugli IOC |
| **SOAR** (Palo Alto XSOAR, Splunk SOAR) | Automazione del playbook |
| **Ticketing** (ServiceNow, Jira) | Gestione degli incidenti |

## La realtà del lavoro in SOC

Lavorare in SOC significa:
- Turni (anche notturni e festivi)
- Pressione costante
- Apprendimento continuo — il panorama delle minacce cambia ogni giorno
- Grande soddisfazione quando si rileva un incidente reale

È il punto di ingresso ideale nel blue team per chi inizia la carriera in cybersecurity.
