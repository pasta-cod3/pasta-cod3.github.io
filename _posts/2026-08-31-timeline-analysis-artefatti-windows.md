---
layout: post
title: "Timeline Analysis: ricostruire cosa è successo su un sistema Windows"
date: 2026-08-31
cat: blue
tags: [DFIR, timeline analysis, Windows artifacts, registro, prefetch, event log, MFT]
excerpt: "Windows registra molto più di quanto sembri: quando un file è stato eseguito, quali cartelle sono state aperte, quali dispositivi USB sono stati collegati. La timeline analysis mette tutti questi frammenti in ordine cronologico."
---

Un cliente chiede una cosa semplice da formulare e complessa da rispondere: cosa è successo su questo computer, e in che ordine? La risposta non sta in un unico file di log. Sta sparsa in decine di artefatti diversi che Windows crea da solo, per ragioni che non hanno nulla a che fare con la sicurezza, e che messi insieme raccontano una storia sorprendentemente dettagliata.

## Perché serve una timeline

Un singolo artefatto risponde a una domanda ristretta: il Prefetch dice che un programma è stato eseguito, ma non da chi. Un Event Log dice che c'è stato un logon, ma non cosa è successo dopo. Solo mettendo insieme decine di fonti diverse, ordinate per timestamp, emerge una sequenza coerente: *l'utente ha aperto l'allegato alle 14:32, che ha lanciato PowerShell alle 14:32:03, che ha scaricato un secondo stage alle 14:32:11, che ha creato persistenza alle 14:33*.

Questa è, in sostanza, la stessa logica di un SIEM che correla eventi in tempo reale, applicata a posteriori su artefatti che restano sul disco molto dopo che l'incidente è finito.

## Gli artefatti principali di Windows

### Master File Table ($MFT)

Il **$MFT** è la struttura dati che NTFS usa per tracciare ogni file e cartella del volume: nome, dimensione, e quattro coppie di timestamp (creazione, modifica, accesso, modifica dei metadati), spesso indicate con la sigla **MACB**.

Anche i file cancellati lasciano traccia nel $MFT per un periodo di tempo, prima che lo spazio venga sovrascritto: è spesso il primo posto dove cercare file che l'attaccante ha provato a eliminare.

```
Strumento: MFTECmd (parte del pacchetto Eric Zimmerman's Tools)
MFTECmd.exe -f "$MFT" --csv output --csvf mft_timeline.csv
```

### Prefetch: cosa è stato eseguito

Windows crea un file `.pf` in `C:\Windows\Prefetch\` ogni volta che un eseguibile viene lanciato, per velocizzarne i lanci successivi. Ogni file Prefetch contiene il nome dell'eseguibile, il percorso completo, il numero di esecuzioni e fino a otto timestamp dell'ultima esecuzione.

```
Strumento: PECmd
PECmd.exe -f "C:\Windows\Prefetch\POWERSHELL.EXE-1A2B3C4D.pf"
```

Un Prefetch di `powershell.exe` che mostra un numero di esecuzioni molto più alto del solito, o un orario fuori dal normale utilizzo dell'utente, è un segnale da approfondire.

### Registro di sistema: UserAssist e ShimCache

Il registro contiene diverse chiavi che tracciano l'esecuzione di programmi, spesso ignorate da chi attacca proprio perché meno note del Prefetch:

- **UserAssist** (`NTUSER.DAT`): traccia i programmi lanciati dall'interfaccia grafica (Explorer), con conteggio e timestamp dell'ultima esecuzione, codificati con ROT13
- **ShimCache / AppCompatCache**: registra i metadati di ogni eseguibile a cui il sistema ha applicato una verifica di compatibilità, spesso anche per programmi mai effettivamente eseguiti, solo elencati
- **Amcache.hve**: file di registro separato che traccia in modo più dettagliato i binari eseguiti, incluso l'hash SHA-1 del file

```
Strumento: RECmd o AppCompatCacheParser
AppCompatCacheParser.exe -f "C:\Windows\System32\config\SYSTEM" --csv output
```

### Event Log: la fonte più ricca

I file `.evtx` in `C:\Windows\System32\winevt\Logs\` contengono migliaia di eventi. Per la timeline analysis, gli Event ID più rilevanti si sovrappongono a quelli già visti per il monitoraggio in tempo reale (4624 logon, 4688 creazione processo, 4720 creazione account), ma qui vengono estratti in blocco e ordinati insieme a tutti gli altri artefatti, non osservati uno a uno mentre accadono.

```
Strumento: EvtxECmd
EvtxECmd.exe -f "Security.evtx" --csv output --csvf security_timeline.csv
```

### Shellbags e Jump List

Le **Shellbags**, salvate nel registro, tracciano quali cartelle un utente ha aperto tramite Explorer, incluse cartelle su unità di rete o dispositivi rimovibili ormai scollegati. Le **Jump List** (`C:\Users\<utente>\AppData\Roaming\Microsoft\Windows\Recent\AutomaticDestinations\`) tracciano invece i file recenti aperti da ogni applicazione.

Entrambe sono utili per rispondere a una domanda specifica: l'utente ha mai navigato in quella cartella, o aperto quel file, anche se ora non esiste più?

## Costruire una super timeline

Analizzare ogni artefatto separatamente funziona per domande mirate, ma per una ricostruzione completa serve unire tutte le fonti in un'unica timeline ordinata cronologicamente: una **super timeline**.

**Plaso / log2timeline** è lo strumento open source di riferimento per questo scopo: legge decine di formati di artefatti diversi (MFT, registro, Event Log, browser history, e molti altri) e li normalizza in un unico formato temporale.

```bash
# Genera il timeline storage file da un'immagine disco o una cartella montata
log2timeline.py timeline.plaso /mnt/evidenza/caso001

# Esporta in CSV ordinato cronologicamente
psort.py -o l2tcsv -w timeline.csv timeline.plaso
```

Il risultato è un singolo file con milioni di righe, una per ogni evento rilevato in qualsiasi artefatto del sistema: enorme, ma filtrabile per intervallo di tempo, il che lo rende gestibile quando si ha già un'idea approssimativa di quando è avvenuto l'incidente, magari da un alert del SIEM o dalla testimonianza dell'utente.

## Un esempio di ricostruzione

```
14:31:58  Event Log 4688   → outlook.exe avvia allegato "fattura.docm"
14:32:03  Prefetch         → WINWORD.EXE eseguito (prima volta in 40 giorni)
14:32:07  Event Log 4688   → winword.exe genera powershell.exe
14:32:07  UserAssist       → nessuna voce (lancio non da Explorer, coerente con un macro)
14:32:11  Amcache          → nuovo eseguibile "update.exe" registrato in %TEMP%
14:32:15  Prefetch         → UPDATE.EXE eseguito
14:33:02  Event Log 4720   → nuovo account locale creato: "svc_backup"
14:33:40  Shellbags        → cartella \\10.0.0.5\backup$ aperta da Explorer
```

Nessuno di questi eventi preso da solo dimostrerebbe un attacco. Messi in sequenza, con timestamp coerenti a pochi secondi di distanza l'uno dall'altro, raccontano con chiarezza un documento malevolo che ha eseguito una macro, scaricato un secondo stage, creato un account di persistenza e iniziato a muoversi verso una condivisione di rete.

## Conclusione

Windows non ha bisogno di essere istruito a loggare tutto questo: lo fa già, per ragioni di performance e usabilità che non hanno nulla a che fare con la sicurezza. Il lavoro dell'analista forense è sapere dove guardare, ed estrarre ogni fonte con lo strumento giusto (Eric Zimmerman's Tools per la maggior parte degli artefatti, Plaso per unirli tutti) prima di ordinarli e leggerli come una storia unica.

Nel prossimo articolo si esce dal singolo host per guardare cosa attraversa la rete: come si fa network forensics su un pcap, quando l'obiettivo non è più rilevare un attacco in corso ma ricostruirne uno già avvenuto.
