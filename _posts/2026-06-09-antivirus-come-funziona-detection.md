---
layout: post
title: "Come funziona un antivirus moderno: firme, AMSI, behavioral analysis e EDR"
date: 2026-06-09
cat: red
tags: [antivirus, AMSI, EDR, detection, behavioral analysis, sicurezza endpoint]
excerpt: "Capire come un antivirus rileva le minacce è fondamentale sia per chi difende che per chi testa la sicurezza. Firme, heuristic engine, AMSI, sandbox e behavioral monitoring."
---

Per chi fa penetration testing, capire come funziona il rilevamento degli antivirus e degli EDR è indispensabile. Non per eluderli arbitrariamente, ma perché sapere cosa cercano aiuta a capire quali tecniche un attaccante reale userebbe, e quindi cosa un difensore deve monitorare.

## I livelli di rilevamento

Un antivirus moderno (e ancor di più un EDR) usa più strati di rilevamento sovrapposti.

### 1. Firma (Signature-based)

Il metodo più vecchio e ancora il più comune. Il motore confronta i file con un database di hash e pattern noti di malware.

- **Pro**: velocissimo, zero falsi positivi su minacce note
- **Contro**: cieco su malware mai visto prima (zero-day) o su varianti leggermente modificate

### 2. Analisi euristica

Invece di confrontare con firme note, analizza le caratteristiche statiche del file:

- Il codice apre socket di rete?
- Modifica le chiavi di registro?
- Usa API tipiche del malware (VirtualAlloc, CreateRemoteThread)?
- Il file è impacchettato o offuscato?

### 3. AMSI — Antimalware Scan Interface (Windows)

AMSI è un'interfaccia introdotta da Microsoft in Windows 10 che permette all'AV di ispezionare il contenuto degli script *prima che vengano eseguiti*. Intercetta:

- PowerShell
- WScript / CScript (JavaScript, VBScript)
- .NET (tramite CLR hooks)
- Macro Office

```
Script → PowerShell → AMSI Provider → AV Engine → [blocca o lascia passare]
```

Dal punto di vista del red team, AMSI è uno degli ostacoli principali quando si usa PowerShell in un engagement. Dal punto di vista del blue team, significa che i log di AMSI contengono tutto il testo degli script PowerShell eseguiti — fonte di telemetria preziosa.

### 4. Behavioral Analysis / Sandboxing

Il file viene eseguito in un ambiente isolato (sandbox) e monitorato. Se si comporta come malware (apre connessioni, crea processi figli, cifra file), viene bloccato.

- Cloud sandboxing: analisi su server remoti con immagini aggiornate
- Locale: hooking delle API di sistema

### 5. EDR — Endpoint Detection and Response

Un EDR è la versione enterprise e avanzata dell'AV. Monitora continuamente:

- Tutti i processi e la loro catena di discendenza (chi ha lanciato chi)
- File system events
- Registry events
- Network connections per processo
- Memory scanning

Gli EDR principali (CrowdStrike Falcon, Microsoft Defender for Endpoint, SentinelOne, Carbon Black) correlano questi eventi con MITRE ATT&CK per identificare comportamenti sospetti anche se il singolo evento è innocuo.

## Cosa vede un analista negli alert EDR

Un alert tipico di un EDR mostra:
```
ALERT: Suspicious process tree
  cmd.exe → powershell.exe → rundll32.exe → [network connection to 1.2.3.4:443]
  MITRE: T1059.001 (PowerShell) | T1218.011 (Rundll32) | TA0011 (C2)
```

La catena di processo e le tecniche MITRE permettono all'analista di ricostruire esattamente cosa è successo, anche ore o giorni dopo.

## Implicazioni per il red team e per il blue team

Da red team: qualsiasi strumento di pentest deve fare i conti con questi layer. I framework moderni come Cobalt Strike e Sliver includono funzionalità per operare "under the radar" degli EDR, e questo è legittimo in un engaged red team.

Da blue team: la difesa non è "bloccare tutto" ma **avere visibilità**. Un EDR che logga tutto e integra MITRE ATT&CK permette di rilevare anche tecniche mai viste prima, purché producano comportamenti anomali.
