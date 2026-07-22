---
layout: post
title: "Forensica Digitale: principi, metodologia e strumenti per il DFIR"
date: 2026-06-13
cat: blue
tags: [forensica digitale, DFIR, Volatility, Autopsy, memory forensics, incident response]
excerpt: "La forensica digitale è la scienza di raccogliere e analizzare prove digitali mantenendo la loro integrità. Principi fondamentali, catena di custodia, analisi della memoria e del disco."
---

Quando un incidente di sicurezza si verifica, la forensica digitale risponde a una domanda fondamentale: **cosa è successo, quando, come e da chi**? È la disciplina che trasforma gli artefatti digitali in prove utili per la risposta all'incidente e, quando necessario, per procedimenti legali.

## Principi fondamentali

**Integrità della prova**: mai lavorare sull'originale. Si crea una copia forense (immagine bit-per-bit) e si lavora su quella. Si calcola l'hash (SHA-256) dell'originale e della copia per dimostrarne l'identità.

**Catena di custodia**: ogni persona che tocca la prova viene documentata con data, ora e scopo. In caso di procedimento penale, una catena di custodia rotta rende la prova inutilizzabile.

**Order of Volatility**: si raccolgono le prove nell'ordine di volatilità — prima ciò che scompare più velocemente:
1. Registri CPU e cache
2. **RAM** (contenuto perso allo spegnimento)
3. Swap/pagefile
4. Connessioni di rete attive
5. File di log aperti
6. **Disco** (persistente)

## Acquisizione della memoria RAM

La RAM contiene processi in esecuzione, credenziali in chiaro, connessioni di rete attive, payload in memoria. Va acquisita *prima* di qualsiasi altra cosa e *prima* di spegnere il sistema.

```bash
# Su Windows: WinPmem o DumpIt
winpmem_mini_x64.exe memory.dmp

# Su Linux: LiME (Loadable Kernel Module)
insmod lime.ko "path=/mnt/usb/ram.lime format=lime"

# macOS
osxpmem memory.aff4
```

## Analisi della memoria con Volatility 3

Volatility è lo strumento standard per l'analisi forense della RAM:

```bash
# Lista dei processi al momento dell'acquisizione
python3 vol.py -f memory.dmp windows.pslist

# Connessioni di rete attive
python3 vol.py -f memory.dmp windows.netstat

# Processi con DLL inject sospette
python3 vol.py -f memory.dmp windows.malfind

# Estrai un processo dalla RAM per analisi statica
python3 vol.py -f memory.dmp windows.dumpfiles --pid 1234

# Cerca stringhe nelle memoria di un processo
python3 vol.py -f memory.dmp windows.memmap --pid 1234 --dump
strings pid.1234.dmp | grep -i "password"
```

## Acquisizione del disco

```bash
# dd — classico, lento ma affidabile
dd if=/dev/sda of=/mnt/usb/disk.img bs=4M conv=sync,noerror

# dcfldd — con hashing automatico
dcfldd if=/dev/sda of=/mnt/usb/disk.img hash=sha256 hashlog=hash.txt

# FTK Imager (Windows) — GUI, molto usato in contesti legali
```

## Analisi del disco con Autopsy

Autopsy è il frontend grafico per The Sleuth Kit (TSK). Permette di:
- Navigare il filesystem anche su file cancellati (file carving)
- Analizzare i log del sistema
- Timeline di tutte le attività sul filesystem
- Ricerca di parole chiave e hash noti di malware (NSRL database)
- Analisi delle email e dei browser

## Artefatti chiave Windows

| Artefatto | Posizione | Cosa contiene |
|-----------|-----------|---------------|
| **Event Log** | `C:\Windows\System32\winevt\Logs\` | Login, processi, errori |
| **Prefetch** | `C:\Windows\Prefetch\` | Programmi eseguiti |
| **Amcache** | `C:\Windows\AppCompat\` | File eseguiti (con hash) |
| **Registry hives** | `C:\Windows\System32\config\` | Configurazioni, persistence |
| **ShellBags** | NTUSER.DAT | Cartelle visitate |
| **LNK files** | `%APPDATA%\Microsoft\Windows\Recent\` | File aperti di recente |

## Timeline forense

La creazione di una timeline è il cuore dell'analisi forense:

```bash
# Con Plaso/log2timeline
log2timeline.py timeline.plaso /mnt/disk_image
psort.py -o l2tcsv timeline.plaso > timeline.csv
```

Una timeline mostra tutti gli eventi in ordine cronologico: login, file creati/modificati/acceduti, programmi eseguiti, connessioni di rete. Permette di ricostruire l'attività dell'attaccante minuto per minuto.
