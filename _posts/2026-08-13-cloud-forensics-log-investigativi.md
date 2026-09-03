---
layout: post
title: "Cloud Forensics: indagare quando il disco non esiste più"
date: 2026-08-13
cat: blue
tags: [DFIR, cloud forensics, CloudTrail, log investigativi, AWS, evidenza volatile]
excerpt: "Non si può collegare un write blocker a un bucket S3. In cloud, l'unica prova disponibile è spesso il log delle API, e quel log ha una scadenza: se non viene esportato e conservato in tempo, sparisce per sempre insieme a ogni possibilità di ricostruire l'accaduto."
---

Un bucket S3 configurato per errore come pubblicamente accessibile viene scoperto tre settimane dopo l'esposizione iniziale. Il team vuole sapere chi ha effettivamente scaricato i dati durante quella finestra. Non c'è un disco da acquisire, non c'è un write blocker da collegare: l'unica fonte di verità è il log delle chiamate API del provider cloud, e quel log potrebbe già essere scaduto secondo la policy di conservazione predefinita.

Questo articolo copre i principi fondamentali della cloud forensics, con un focus pratico su AWS come esempio più diffuso, e sulle differenze strutturali rispetto alla forensics tradizionale.

## Perché la cloud forensics è strutturalmente diversa

Tre differenze cambiano radicalmente l'approccio rispetto a un'indagine su infrastruttura fisica:

- **Non esiste un disco fisico da isolare**: l'infrastruttura è condivisa tra migliaia di clienti, e l'accesso ai livelli più bassi (hardware, hypervisor) non è mai disponibile al cliente, per quanto legittima sia l'indagine
- **L'evidenza è tipicamente un log, non un file**: il comportamento del sistema è ricostruibile principalmente attraverso i log delle chiamate API, che il provider genera automaticamente quando abilitati, ma quasi mai per impostazione predefinita
- **L'evidenza ha una scadenza attiva**: i log restano disponibili solo per il periodo configurato nella policy di conservazione, e una volta scaduti non sono recuperabili in nessun modo, a differenza di un disco che può essere riacquisito mesi dopo l'incidente

## AWS CloudTrail: il registro di ogni chiamata API

**CloudTrail** registra ogni chiamata effettuata contro le API di AWS: chi (quale utente o ruolo), cosa (quale azione, come `GetObject` o `PutBucketPolicy`), quando e da quale indirizzo IP. È l'equivalente cloud del log di autenticazione visto nell'articolo sugli artefatti Linux, ma copre azioni sull'infrastruttura invece che su un singolo sistema operativo.

```bash
# Interrogare CloudTrail per accessi a un bucket specifico in una finestra temporale
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=ResourceName,AttributeValue=bucket-esposto \
  --start-time 2026-07-01T00:00:00Z \
  --end-time 2026-07-21T00:00:00Z
```

Il dettaglio critico: CloudTrail va **abilitato esplicitamente** e configurato per esportare i log verso un bucket S3 dedicato con una policy di conservazione adeguata (spesso anni, non i pochi mesi di default in alcune configurazioni). Un'organizzazione che scopre un incidente e attiva CloudTrail solo in quel momento ha già perso ogni visibilità sul periodo precedente.

## VPC Flow Logs: il traffico di rete a livello cloud

Analogamente a un file pcap in un'infrastruttura tradizionale, i **VPC Flow Logs** registrano i metadati del traffico di rete (IP sorgente e destinazione, porte, protocollo, byte trasferiti) all'interno della rete virtuale cloud, senza catturare il payload effettivo dei pacchetti. Sono utili per identificare pattern di esfiltrazione (un grande volume di dati verso una destinazione anomala, lo stesso principio già visto nell'articolo sulla network forensics) anche quando l'accesso al traffico reale non è possibile a questo livello di astrazione.

## S3 Access Logs: chi ha toccato cosa, oggetto per oggetto

Per bucket S3 specifici, abilitare i log di accesso a livello di oggetto fornisce un dettaglio ancora più fine di CloudTrail: ogni singola richiesta di lettura o scrittura su ogni singolo file, incluso l'indirizzo IP del richiedente e se la richiesta proveniva da un utente autenticato o da un accesso anonimo (rilevante proprio nel caso di un bucket esposto pubblicamente per errore).

## Il problema della prova volatile e multi-tenant

Un'istanza cloud (una macchina virtuale gestita dal provider) può essere terminata da un attaccante o da un processo automatico di scalabilità in pochi secondi, portando via con sé qualunque dato non fosse già stato esportato verso uno storage persistente esterno all'istanza stessa. A differenza di un server fisico, che resta fisicamente presente finché qualcuno non lo spegne, un'istanza cloud può letteralmente smettere di esistere, rendendo imperativo automatizzare l'esportazione continua dei log critici verso una destinazione separata e sotto controllo diretto dell'organizzazione, non lasciata alla sola configurazione predefinita del provider.

## Snapshot e immagini: l'equivalente cloud dell'imaging del disco

Quando un'istanza compromessa deve essere preservata per analisi, la pratica corretta è creare uno **snapshot** del volume di storage associato (analogo concettualmente a un'immagine disco forense) prima di spegnere o modificare l'istanza, così da preservare lo stato esatto del sistema al momento della scoperta, permettendo un'analisi successiva senza mantenere l'istanza compromessa attiva e potenzialmente ancora sotto controllo dell'attaccante.

## Checklist essenziale

```
✅ CloudTrail (o equivalente del provider) abilitato PRIMA dell'incidente, non dopo
✅ Policy di conservazione dei log sufficientemente lunga, non il default minimo
✅ VPC Flow Logs per pattern di traffico anomalo
✅ Log di accesso a livello di oggetto per bucket contenenti dati sensibili
✅ Snapshot dell'istanza compromessa prima di qualsiasi azione di remediation
✅ Esportazione continua dei log critici verso storage esterno all'istanza stessa
```

## Conclusione

La cloud forensics ribalta una regola di fondo della forensics tradizionale: qui non è quasi mai una questione di *come* acquisire correttamente una prova che già esiste, ma di *aver configurato in anticipo* la generazione e conservazione di quella prova, perché una volta che l'infrastruttura scala, si distrugge o il log scade, non c'è nessun disco fisico rimasto da recuperare mesi dopo.

Nel prossimo articolo si torna a un tema trasversale a tutto il modulo: come gli indicatori di compromissione raccolti durante un'indagine, cloud o meno, si trasformano in intelligence condivisibile con altri team e altre organizzazioni.
