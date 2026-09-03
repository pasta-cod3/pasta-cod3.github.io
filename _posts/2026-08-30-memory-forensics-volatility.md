---
layout: post
title: "Memory Forensics con Volatility: cosa vive nella RAM"
date: 2026-08-30
cat: blue
tags: [DFIR, memory forensics, Volatility, RAM, malware analysis, LSASS]
excerpt: "Un malware fileless non tocca quasi mai il disco. Le sue tracce vivono solo in RAM, e spariscono al primo riavvio. La memory forensics, e Volatility in particolare, è come si cattura quella prova prima che svanisca."
---

Un ransomware che cifra un intero server aziendale spesso non lascia un eseguibile pulito da analizzare sul disco: si inietta in un processo legittimo, decifra il proprio payload solo in memoria, e cancella ogni traccia scritta su disco appena può. Il disco, in questi casi, racconta solo metà della storia. L'altra metà vive nella RAM, e dura solo finché il sistema resta acceso.

## Perché la RAM conta così tanto

Cose che si trovano in memoria e quasi mai altrove:

- **Password e chiavi di cifratura in chiaro**, anche quando su disco tutto è cifrato
- **Processi malevoli iniettati** in processi legittimi (process hollowing, DLL injection)
- **Connessioni di rete attive** al momento della cattura, incluse quelle verso un C2
- **Comandi eseguiti in shell** che non sono mai stati scritti in un file di log
- **Malware fileless**, che esiste solo come codice eseguibile in memoria, mai come file

Se un sistema compromesso viene spento prima di catturare la RAM, tutto questo scompare per sempre. È il motivo per cui, nell'ordine di volatilità visto nell'articolo precedente, la memoria viene subito dopo i registri della CPU.

## Catturare la RAM

La cattura della memoria va fatta con uno strumento dedicato, mentre il sistema è ancora acceso, verso un disco esterno o una condivisione di rete, mai sul disco di sistema stesso.

**Windows:**

```
# DumpIt (Comae): il più semplice, un doppio click genera il dump
DumpIt.exe

# WinPmem: open source, riga di comando
winpmem.exe -o memoria.raw

# FTK Imager può catturare la RAM oltre ai dischi
# File → Capture Memory
```

**Linux:**

```bash
# LiME (Linux Memory Extractor), compilato come modulo del kernel in corso
insmod lime-$(uname -r).ko "path=/mnt/evidenza/memoria.lime format=lime"
```

La dimensione del dump corrisponde alla RAM installata: un server con 64 GB di RAM produce un file da 64 GB. Va calcolato spazio e tempo di trasferimento prima di iniziare, soprattutto su sistemi critici dove ogni minuto di rallentamento ha un costo.

## Volatility: il framework di riferimento

**Volatility** è il framework open source standard per l'analisi di dump di memoria. La versione 3, riscritta in Python puro, è quella attualmente mantenuta e non richiede più di specificare manualmente il profilo del sistema operativo come la versione 2.

```bash
# Installazione
pip install volatility3

# Primo comando: identifica il sistema operativo del dump
vol -f memoria.raw windows.info
```

### I plugin più usati

**Processi in esecuzione al momento della cattura:**

```bash
vol -f memoria.raw windows.pslist
vol -f memoria.raw windows.pstree
```

`pstree` è spesso più utile di `pslist` perché mostra la gerarchia padre-figlio: un `winword.exe` che ha generato un `powershell.exe` è un pattern che salta subito all'occhio, esattamente come nell'EDR di un blue team in tempo reale, solo che qui la si ricostruisce a posteriori.

**Connessioni di rete attive nel momento della cattura:**

```bash
vol -f memoria.raw windows.netscan
```

Un processo legittimo con una connessione verso un IP sconosciuto su una porta insolita è uno dei segnali più diretti di compromissione che la memory forensics può dare.

**Rilevare process injection:**

```bash
vol -f memoria.raw windows.malfind
```

`malfind` cerca regioni di memoria eseguibile con caratteristiche sospette, tipiche di codice iniettato che non corrisponde a nessun file legittimo su disco. È uno dei plugin più diretti per trovare malware che sul disco semplicemente non esiste.

**DLL caricate da un processo:**

```bash
vol -f memoria.raw windows.dlllist --pid 4821
```

Utile per verificare se un processo ha caricato librerie non standard o presenti in percorsi insoliti, come `C:\Users\Public\` invece delle cartelle di sistema.

**Estrarre credenziali dalla memoria di LSASS:**

```bash
vol -f memoria.raw windows.lsadump.Lsadump
```

Lo stesso principio su cui si basa Mimikatz, visto dal lato dell'investigatore invece che dell'attaccante: le credenziali che un attaccante potrebbe estrarre sono spesso ancora lì, nel dump, a dimostrare cosa è stato esposto.

## Un flusso di analisi tipico

```
1. windows.info          → identifica il sistema operativo e la build
2. windows.pstree        → cerca processi anomali o gerarchie sospette
3. windows.netscan       → cerca connessioni di rete verso IP sconosciuti
4. windows.malfind       → cerca codice iniettato in memoria
5. windows.dlllist       → verifica DLL caricate dai processi sospetti
6. windows.filescan      → cerca riferimenti a file, anche se cancellati dal disco
7. windows.cmdline       → recupera la riga di comando con cui ogni processo è stato lanciato
```

`windows.cmdline` in particolare recupera spesso comandi PowerShell offuscati o codificati in base64 lanciati da un attaccante, la stessa cosa che un SIEM ben configurato registrerebbe in tempo reale, qui ricostruita dopo i fatti.

## I limiti della memory forensics

La RAM non è persistente: spegnere il sistema, anche per pochi secondi, cancella tutto. E un dump di memoria è una fotografia di un singolo istante: eventi avvenuti prima della cattura e già conclusi (un processo terminato, una connessione già chiusa) potrebbero non lasciare traccia, a meno che non siano ancora presenti in strutture come le liste di connessioni recenti mantenute dal sistema operativo.

Per questo la memory forensics quasi mai lavora da sola: si combina con l'acquisizione del disco e, quando disponibile, con i log di rete per ricostruire una timeline completa.

## Conclusione

La memoria RAM è il posto dove un attaccante moderno lascia le tracce che pensa di non lasciare da nessuna parte: credenziali decifrate, codice iniettato, connessioni verso un C2. Volatility non è complicato da usare quanto sembra al primo impatto: la parte difficile non è ricordare i plugin, è sapere quale domanda porre al dump. `pstree` per capire cosa girava, `netscan` per capire con chi parlava, `malfind` per capire se qualcosa è stato iniettato.

Nel prossimo articolo si torna sul disco, ma con un obiettivo diverso dall'acquisizione: ricostruire una timeline precisa di cosa è successo su un sistema Windows, minuto per minuto, usando gli artefatti che Windows stesso lascia senza che nessuno glielo chieda.
