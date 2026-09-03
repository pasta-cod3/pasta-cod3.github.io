---
layout: post
title: "Caso di studio: un incidente ransomware dall'allerta al report finale"
date: 2026-07-31
cat: blue
tags: [DFIR, incident response, caso di studio, ransomware, timeline, capstone]
excerpt: "Un caso di studio completo che mette insieme tutto il percorso DFIR: acquisizione, memoria, registro, rete, malware e report. Non una teoria isolata, ma la sequenza reale con cui un analista affronta un incidente dall'allerta iniziale fino alla testimonianza finale."
---

Alle 6:14 di un lunedì mattina, un sistema di monitoraggio genera un alert: un server file aziendale sta cifrando in massa i propri file condivisi. Alle 6:20 il team di incident response viene chiamato. Da questo momento in poi, ogni decisione presa nella prima ora determina se l'indagine successiva avrà prove solide o macerie da cui provare a ricostruire qualcosa. Questo articolo segue l'intero percorso, passo per passo, richiamando ogni tecnica vista nei moduli precedenti nel punto esatto in cui un caso reale la richiederebbe.

## Ora 0: contenimento senza distruggere prove

Il primo istinto è spegnere tutto. È anche, quasi sempre, l'errore più costoso: spegnere un sistema compromesso cancella per sempre qualunque cosa vivesse solo in RAM, esattamente il principio dell'**ordine di volatilità** visto nell'articolo sull'acquisizione forense.

```
Azione corretta: isolare il server dalla rete (disconnessione fisica del cavo o
disabilitazione della porta switch), lasciandolo ACCESO, non spegnerlo.
```

Isolare interrompe la propagazione del ransomware senza distruggere lo stato del sistema. È la stessa logica di isolamento vista nell'articolo sulla mobile forensics, applicata qui a un server invece che a uno smartphone.

## Ora 1: acquisire la memoria prima che sia troppo tardi

Con il sistema ancora acceso e isolato, il primo dato da catturare è la RAM, seguendo esattamente il flusso descritto nell'articolo sulla memory forensics:

```bash
# Acquisizione della memoria con uno strumento come WinPMem, prima di ogni altra azione
winpmem_mini.exe memoria_server01.raw
```

L'analisi preliminare con Volatility (`windows.pstree`, `windows.malfind`) rivela un processo `svchost.exe` con un genitore anomalo e memoria eseguibile iniettata: la stessa firma di process injection già descritta nell'articolo sulla malware analysis dinamica.

## Ora 2-4: imaging del disco con catena di custodia

Solo dopo aver messo in sicurezza la memoria, si procede all'acquisizione del disco, con write blocker e calcolo dell'hash prima e dopo la copia, esattamente come nell'articolo sull'acquisizione forense:

```bash
sudo dcfldd if=/dev/sdb of=server01_disco.dd hash=sha256 hashlog=server01_hash.txt
```

Ogni passaggio, da questo momento, viene registrato nel modulo di catena di custodia: chi ha acquisito, quando, con quale hash di verifica.

## Ora 5-8: ricostruire il punto di ingresso

Con l'immagine disco disponibile, l'analisi si sposta sul Registro e sui log di autenticazione per capire come l'attaccante è entrato. La chiave `Run` mostra un eseguibile sospetto registrato per la persistenza (visto nel Registry Forensics), mentre `auth.log` (il server ha anche un componente Linux nella propria infrastruttura di backup) mostra un'ondata di tentativi SSH falliti seguiti da un accesso riuscito, la stessa firma da brute force descritta nell'articolo sugli artefatti Linux.

Amcache conferma l'esecuzione dell'eseguibile sospetto con un hash SHA-1 specifico. Quell'hash, controllato su VirusTotal, corrisponde a una famiglia di ransomware nota, la stessa metodologia dell'analisi statica vista in un articolo precedente.

## Ora 9-12: la timeline completa

Combinando timestamp da MFT, Prefetch, Event Log e la memoria acquisita in precedenza (log2timeline/Plaso, come descritto nell'articolo sulla timeline analysis), emerge una sequenza chiara:

```
02:14 - Accesso SSH riuscito dopo tentativi di brute force
02:31 - Download di un secondo stage via PowerShell (confermato in RunMRU)
02:47 - Persistenza registrata nella chiave Run del Registro
03:02 - Amcache registra l'esecuzione del binario ransomware
06:14 - Il sistema di monitoraggio rileva l'attività di cifratura massiva
```

## Ora 13-18: cosa è uscito dalla rete

L'analisi del traffico di rete (pcap catturato dal firewall aziendale, con la stessa metodologia dell'articolo sulla network forensics) mostra un breve ma consistente trasferimento di dati in uscita poco prima della cifratura, verso un indirizzo IP mai visto prima nella rete aziendale: un pattern di **doppia estorsione**, in cui i dati vengono esfiltrati prima di essere cifrati, per aumentare la pressione sulla vittima.

Quell'indirizzo IP, l'hash del ransomware e il dominio usato per il secondo stage vengono immediatamente trasformati in IOC e condivisi con il CERT di settore tramite MISP, seguendo il flusso descritto nell'articolo sulla threat intelligence, nella speranza di bloccare la stessa infrastruttura prima che colpisca altre aziende.

## Giorno 2-3: il report finale

Il report finale segue la struttura descritta nell'ultimo articolo del primo modulo DFIR: un executive summary scritto per ultimo ma letto per primo, una timeline tecnica dettagliata, e conclusioni che distinguono chiaramente cosa i dati dimostrano ("un accesso SSH riuscito alle 02:14 da IP X, seguito da esecuzione di un binario con hash Y") da cosa restano ipotesi ragionevoli ma non certezze assolute.

## Cosa avrebbe potuto essere fatto diversamente, prima dell'incidente

Ogni caso di studio di questo tipo rivela anche cosa, a monte, avrebbe reso l'indagine più semplice o l'incidente meno grave:

```
✅ MFA sull'accesso SSH avrebbe probabilmente bloccato il brute force iniziale
✅ Segmentazione di rete più stretta avrebbe limitato la propagazione laterale
✅ Backup offline (non raggiungibili dalla rete compromessa) per un ripristino senza pagare riscatto
✅ CloudTrail (o log equivalenti) attivi in anticipo, non configurati dopo l'incidente
```

## Conclusione del percorso DFIR

Nessuna singola tecnica vista nei tre moduli di questo percorso, da sola, avrebbe ricostruito questo incidente. È la sequenza, applicata nell'ordine corretto, a fare la differenza: memoria prima del disco, disco prima dell'analisi degli artefatti, artefatti prima della timeline, timeline prima del report. Lo stesso ordine di volatilità visto nel primissimo articolo del percorso, applicato adesso a un caso reale dall'inizio alla fine.

Il percorso DFIR di pasta-cod3 continua a crescere: nuovi moduli e nuovi casi di studio arriveranno man mano che il ramo si espande, con lo stesso approccio pratico visto fin qui.
