---
layout: post
title: "EDR: cos'è, come funziona e come sceglierlo per la tua organizzazione"
date: 2026-06-12
cat: blue
tags: [EDR, endpoint security, CrowdStrike, Microsoft Defender, SentinelOne, MITRE ATT&CK]
excerpt: "L'EDR è la risposta moderna all'antivirus tradizionale. Monitora il comportamento degli endpoint in tempo reale, correla eventi con MITRE ATT&CK e permette la risposta agli incidenti remota."
---

L'antivirus tradizionale controlla i file. L'EDR controlla i **comportamenti**. Questa differenza fondamentale lo rende lo strumento più efficace contro le minacce moderne — ransomware, APT, living-off-the-land attacks — che spesso non usano malware tradizionale.

## Cosa monitora un EDR

Un agente EDR installato sugli endpoint raccoglie in tempo reale:

- **Process tree**: quale processo ha lanciato quale figlio (es. Word → PowerShell → cmd.exe è sospetto)
- **File system events**: creazione, modifica, cancellazione di file
- **Registry events**: modifiche alle chiavi di registro
- **Network events**: connessioni TCP/UDP per processo
- **Memory events**: allocazione di memoria eseguibile, injection
- **Authentication events**: login, escalation di privilegi

## Rilevamento basato su comportamento

La potenza dell'EDR è correlare questi eventi in catene di comportamento:

```
ALERT: Credential Access (T1003)
  word.exe
    └─ powershell.exe -enc [base64]
         └─ rundll32.exe comsvcs.dll MiniDump
              └─ lsass.dmp creato
  Confidence: HIGH
  MITRE: T1055 Process Injection | T1003.001 LSASS Memory
```

Nessuno dei singoli eventi è necessariamente malevolo. La catena sì.

## I principali EDR sul mercato

| Prodotto | Note |
|----------|------|
| **CrowdStrike Falcon** | Leader di mercato, cloud-native, ottimo threat intel |
| **Microsoft Defender for Endpoint** | Integrato in Windows, ottimo rapporto qualità/prezzo |
| **SentinelOne** | AI-powered, risposta automatica senza firma |
| **Carbon Black (VMware)** | Forte in ambienti enterprise legacy |
| **Elastic Security** | Open source, flessibile, richiede expertise |

## Risposta agli incidenti con EDR

Gli EDR moderni permettono di rispondere agli incidenti direttamente dall'agent:

- **Isolamento della rete**: l'endpoint viene isolato dalla rete mantenendo la connessione al C2 dell'EDR per l'indagine
- **Kill di processi**: termina processi malevoli da remoto
- **File quarantine**: mette in quarantena file sospetti
- **Live investigation**: shell remota sicura per indagare il sistema
- **Timeline**: ricostruzione cronologica di tutto ciò che è avvenuto

## MDR — Managed Detection and Response

Molte organizzazioni non hanno un SOC interno. I servizi MDR forniscono personale specializzato che monitora gli alert EDR 24/7 e risponde agli incidenti. È l'opzione più pratica per le PMI.

## Come valutare un EDR

- **MITRE ATT&CK Evaluations**: test indipendenti che simulano APT reali (Wizard Spider, APT3, APT29)
- **MTTR (Mean Time to Respond)**: quanto tempo per contenere un incidente
- **False positive rate**: quanti alert non sono minacce reali
- **Coverage**: Linux, macOS, Windows, container
