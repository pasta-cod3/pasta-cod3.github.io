---
layout: post
title: "Dagli IOC alla Threat Intelligence: condividere quello che si è scoperto"
date: 2026-08-14
cat: blue
tags: [DFIR, IOC, threat intelligence, MISP, STIX, TAXII, pivoting]
excerpt: "Ogni indagine chiusa produce indicatori di compromissione: hash, IP, domini, chiavi del Registro. Lasciarli in un report PDF dimenticato in un archivio significa sprecare l'unica cosa che potrebbe aiutare un altro team a bloccare lo stesso attaccante prima che colpisca ancora."
---

Un'indagine ricostruisce completamente un attacco: hash del malware, indirizzo IP del server di comando e controllo, dominio usato per il phishing iniziale, chiave del Registro usata per la persistenza. Il report viene scritto, approvato, archiviato. Sei mesi dopo, la stessa infrastruttura d'attacco colpisce un'altra azienda del settore, che scopre tutto da zero, perché nessuno aveva condiviso quegli indicatori in un formato che un altro sistema potesse effettivamente consumare.

Questo articolo copre cosa sono gli **IOC** (Indicators of Compromise), come si trasformano in threat intelligence utilizzabile, e come si condividono in modo che altri strumenti e altri team possano beneficiarne.

## Cos'è, esattamente, un IOC

Un **Indicator of Compromise** è un dato tecnico osservabile che indica una possibile compromissione. I tipi più comuni, incontrati più volte lungo tutto questo modulo:

```
✅ Hash di file          → SHA-256 di un campione malware (visto nell'analisi statica)
✅ Indirizzi IP          → server di comando e controllo osservati nel traffico di rete
✅ Domini/URL            → infrastruttura di phishing o di distribuzione del malware
✅ Chiavi del Registro   → meccanismi di persistenza specifici (visti nel Registry Forensics)
✅ Nomi di file/mutex    → nomi caratteristici usati da una famiglia di malware specifica
```

Non tutti gli IOC hanno lo stesso valore nel tempo: un hash di file è estremamente specifico ma diventa inutile alla prima ricompilazione del malware, mentre un pattern comportamentale (come una specifica sequenza di chiamate API vista nell'analisi dinamica) resta valido molto più a lungo perché più difficile da cambiare per l'attaccante.

## La Piramide del Dolore

Un modello utile per capire perché alcuni IOC valgono più di altri è la **Piramide del Dolore** (Pyramid of Pain, concetto sviluppato da David Bianco): più in alto nella piramide si trova un indicatore, più "dolore" (costo, tempo, effort) causa all'attaccante costringerlo a cambiarlo.

```
        Tattiche, Tecniche e Procedure (TTP)   ← il più difficile da cambiare per l'attaccante
              Strumenti
           Indirizzi di rete
         Nomi di dominio
       Artefatti di rete/host
     Hash di file                              ← il più facile da cambiare (basta ricompilare)
```

Bloccare un hash costringe l'attaccante a un ricompilazione da cinque minuti. Riconoscere e bloccare una TTP (per esempio, la sequenza di chiamate API tipica di un process injection, indipendentemente dal malware specifico che la usa) costringe l'attaccante a ripensare l'intera tecnica d'attacco. Per questo la threat intelligence più preziosa non si ferma agli hash, ma sale verso comportamenti e tecniche.

## MISP: la piattaforma open source per condividere IOC

**MISP** (Malware Information Sharing Platform) è uno strumento open source ampiamente usato da CERT, SOC e community di sicurezza per raccogliere, correlare e condividere indicatori di compromissione in modo strutturato, permettendo a un'organizzazione di ricevere automaticamente gli IOC scoperti da altre organizzazioni partecipanti alla stessa community di condivisione.

```
Flusso tipico:
1. Un'indagine produce un set di IOC (hash, IP, domini)
2. Gli IOC vengono inseriti in un "evento" MISP, con contesto (famiglia di malware, data, TLP)
3. L'evento viene condiviso con community selezionate (settore, area geografica, fiducia reciproca)
4. Altri partecipanti ricevono automaticamente gli IOC e possono integrarli nei propri sistemi di detection
```

## STIX e TAXII: il formato e il trasporto

**STIX** (Structured Threat Information Expression) è il formato standard con cui si descrivono in modo strutturato e leggibile da macchina gli oggetti della threat intelligence (indicatori, malware, gruppi di attaccanti, relazioni tra loro), mentre **TAXII** (Trusted Automated Exchange of Intelligence Information) è il protocollo usato per scambiare quei dati STIX tra sistemi diversi in modo automatizzato, senza bisogno di email o file scambiati manualmente.

Insieme, STIX e TAXII permettono a un SIEM, un firewall o una piattaforma di threat intelligence di ricevere automaticamente nuovi IOC da fonti esterne affidabili e aggiornare le proprie regole di detection senza intervento manuale continuo.

## TLP: quanto in là può viaggiare un'informazione

Il **Traffic Light Protocol** classifica quanto ampiamente un'informazione di intelligence può essere condivisa, con quattro livelli colorati:

```
TLP:RED     → solo per i destinatari diretti della comunicazione, non oltre
TLP:AMBER   → condivisibile solo all'interno dell'organizzazione dei destinatari
TLP:GREEN   → condivisibile con la community di settore più ampia, non pubblicamente
TLP:CLEAR   → condivisibile pubblicamente, senza restrizioni
```

Marcare correttamente un IOC con il proprio livello TLP protegge sia le fonti sensibili sia le relazioni di fiducia tra organizzazioni che condividono intelligence, evitando che informazioni riservate finiscano diffuse oltre l'ambito previsto.

## Pivoting: da un IOC a un'intera infrastruttura

Un singolo IOC è raramente il punto di arrivo di un'indagine: è più spesso il punto di partenza per un **pivoting**, cioè l'uso di quell'indicatore per scoprirne altri collegati. Un indirizzo IP di comando e controllo può essere cercato in servizi come **Shodan** o **VirusTotal** per scoprire altri domini ospitati sullo stesso server, altri campioni di malware che comunicano con lo stesso indirizzo, o certificati SSL condivisi che collegano infrastrutture apparentemente separate a una singola campagna d'attacco.

## Checklist essenziale

```
✅ IOC classificati per tipo (hash, IP, dominio, registro, comportamentale)
✅ Consapevolezza della Piramide del Dolore     → priorità agli indicatori di livello più alto
✅ Formato STIX per la strutturazione, TAXII per la condivisione automatizzata
✅ Etichetta TLP corretta su ogni informazione condivisa
✅ Pivoting sistematico da ogni IOC per scoprire infrastruttura collegata
```

## Conclusione

Un'indagine che si conclude con un report archiviato e nient'altro ha risolto solo il proprio incidente specifico. Trasformare gli IOC scoperti in intelligence condivisa, strutturata e classificata correttamente, è quello che permette all'intera community della sicurezza di riconoscere lo stesso attaccante la volta successiva, prima che faccia altrettanto danno altrove.

L'ultimo articolo del modulo mette insieme tutto quello visto finora, dal primo modulo di fondamenti fino a qui, in un caso di studio completo di risposta a un incidente, dall'allerta iniziale al report finale.
