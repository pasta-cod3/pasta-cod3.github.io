---
layout: post
title: "Acquisizione forense: imaging del disco e catena di custodia"
date: 2026-09-03
cat: blue
tags: [DFIR, acquisizione forense, disk imaging, catena di custodia, write blocker, hashing]
excerpt: "Prima ancora di analizzare qualsiasi prova digitale bisogna acquisirla senza alterarla, e poter dimostrare che non è stata alterata. Ecco come si fa un'acquisizione forense difendibile, dal write blocker al primo hash."
---

Un'analisi forense impeccabile costruita su una prova acquisita male vale zero. Se un avvocato riesce a dimostrare che l'immagine del disco è stata alterata anche di un solo byte durante l'acquisizione, l'intera prova può essere dichiarata inammissibile, indipendentemente da quanto sia bravo l'analista che l'ha esaminata.

Questo articolo copre le due cose che vengono prima di ogni analisi: come acquisire un supporto senza modificarlo, e come documentare quell'acquisizione in modo che regga in un contesto legale o disciplinare.

## L'ordine di volatilità

Non tutte le prove digitali durano lo stesso tempo. Un principio cardine della digital forensics, formalizzato nella RFC 3227, è raccogliere prima ciò che scompare più in fretta:

```
1. Registri CPU, cache               (nanosecondi)
2. Tabelle di routing, cache ARP, tabella processi, memoria RAM  (minuti)
3. File temporanei                   (minuti, ore)
4. Disco                             (ore, giorni)
5. Log remoti e di monitoraggio      (variabile)
6. Configurazione fisica, topologia di rete
7. Supporti di backup, stampe
```

Un sistema acceso va trattato di conseguenza: se serve la RAM, va acquisita prima di spegnere qualsiasi cosa. Spegnere un sistema compromesso perché "è più sicuro" è spesso il primo errore di una risposta a incidente, perché cancella per sempre tutto ciò che vive solo in memoria.

## Acquisizione live o post mortem

**Acquisizione live**: il sistema resta acceso durante la raccolta delle prove. Necessaria quando serve la RAM, connessioni di rete attive o processi in esecuzione. Il rischio è che ogni comando eseguito sul sistema lascia una traccia e può sovrascrivere dati volatili.

**Acquisizione post mortem (dead)**: il sistema viene spento e il disco estratto e analizzato separatamente, in genere collegato tramite un write blocker a una workstation forense. È il metodo più difendibile per il disco, perché elimina il rischio di scrittura accidentale, ma perde tutto ciò che era solo in RAM.

Nella pratica reale si fa spesso entrambe le cose in sequenza: prima si acquisisce la RAM da vivo, poi si spegne e si acquisisce il disco da morto.

## Write blocker: la prima regola

Un **write blocker** è un dispositivo hardware, o un meccanismo software equivalente, che si frappone tra il supporto originale e il computer dell'analista, permettendo la lettura ma bloccando fisicamente ogni scrittura verso il disco.

Senza write blocker, anche solo montare un disco su un sistema operativo moderno può modificare timestamp, creare file di journaling o aggiornare metadati del filesystem: piccole modifiche che bastano a mettere in dubbio l'integrità dell'intera acquisizione.

```
Disco originale → [Write Blocker] → Workstation forense → immagine.dd
                        ↑
              consente SOLO lettura verso il disco
```

Alternative software, quando l'hardware non è disponibile, esistono (ad esempio montare il disco in sola lettura), ma un write blocker hardware certificato resta lo standard quando la prova deve reggere in tribunale.

## Imaging del disco

L'imaging crea una copia bit a bit del supporto originale, inclusi spazio non allocato, file cancellati e slack space, non solo i file visibili come farebbe una normale copia.

### dd, lo strumento base

```bash
# Imaging di un disco intero verso un file immagine
sudo dd if=/dev/sdb of=/mnt/evidenza/caso001_disco.dd bs=4M status=progress conv=noerror,sync

# if  = input file (il disco sorgente, MAI il disco di destinazione)
# of  = output file (dove salvare l'immagine)
# bs  = dimensione del blocco, 4M è un buon compromesso velocità/affidabilità
# conv=noerror,sync = continua anche in caso di settori danneggiati, riempiendo con zeri
```

`dd` non calcola hash da solo e non produce metadati: va bene per capire il meccanismo, ma raramente è sufficiente da solo in un contesto professionale.

### dcfldd, la variante forense

`dcfldd` è un fork di `dd` pensato per la forensics: calcola l'hash durante la copia stessa, invece di doverlo fare come passaggio separato.

```bash
sudo dcfldd if=/dev/sdb of=caso001_disco.dd hash=sha256 hashlog=caso001_hash.txt bs=4M
```

### FTK Imager, l'opzione con interfaccia grafica

**FTK Imager** (gratuito, Windows) è lo strumento più usato per l'acquisizione quando serve un'interfaccia grafica e un formato che preservi metadati aggiuntivi. Supporta il formato **E01 (EnCase Evidence File)**, che oltre ai dati grezzi include un header con informazioni sul caso, hash di verifica integrati e compressione.

Il flusso tipico in FTK Imager: `File → Create Disk Image → seleziona sorgente → seleziona formato E01 → compila i campi del caso (numero caso, esaminatore, note) → verifica hash al termine`.

## Hashing: la prova matematica dell'integrità

Ogni acquisizione va accompagnata da un hash crittografico calcolato **prima** e **dopo** la copia. Se i due hash coincidono, l'immagine è una copia esatta, bit a bit, dell'originale.

```bash
# Hash dell'originale (tramite il write blocker) prima della copia
sha256sum /dev/sdb

# Hash dell'immagine dopo la copia
sha256sum caso001_disco.dd

# Devono corrispondere esattamente
```

**MD5** è ancora usato per compatibilità storica ma è crittograficamente rotto per altri usi. In ambito forense va bene comunque, perché qui serve solo a rilevare modifiche accidentali, non a resistere ad attacchi deliberati: per questo si affianca quasi sempre a **SHA-256**, più robusto, e si registrano entrambi nel report.

## Catena di custodia

La **catena di custodia** è la documentazione continua di chi ha avuto accesso a una prova, quando, dove e perché, dal momento dell'acquisizione fino alla sua eventuale presentazione. Un anello mancante nella catena, anche solo un'ora non documentata, può bastare a far dubitare dell'intera prova.

Un modulo di catena di custodia include tipicamente:

```
Numero caso:            ________________
Descrizione della prova: ________________
Data e ora di acquisizione: ________________
Luogo di acquisizione:  ________________
Acquisita da:           ________________ (nome, firma)
Hash SHA-256:           ________________

Cronologia dei passaggi di mano:
  Data/ora | Da | A | Motivo | Firma
  _________|____|___|________|______
```

Regole pratiche che riducono il rischio di contestazioni:

- **Un solo esaminatore lavora sull'originale**: tutte le analisi successive si fanno su copie dell'immagine, mai sul supporto originale, che va conservato sigillato
- **Ogni passaggio di mano va firmato**, anche tra colleghi dello stesso team
- **L'originale va conservato in un contenitore antistatico, sigillato ed etichettato**, in un luogo ad accesso controllato
- **Ogni azione sull'immagine va loggata**: chi l'ha aperta, con quale strumento, quando

## Checklist di acquisizione

```
✅ Write blocker collegato e verificato prima di toccare il disco originale
✅ Hash dell'originale calcolato PRIMA della copia
✅ Immagine acquisita bit a bit (non una semplice copia di file)
✅ Hash dell'immagine calcolato e confrontato con l'originale
✅ Modulo di catena di custodia compilato e firmato
✅ Originale conservato sigillato, mai più toccato
✅ Tutte le analisi successive eseguite solo su copie dell'immagine
```

## Conclusione

L'acquisizione è la parte meno interessante della digital forensics agli occhi di chi vuole subito analizzare artefatti e ricostruire un attacco, ma è anche quella su cui si gioca se il lavoro successivo avrà un valore qualsiasi. Un write blocker, un hash verificato e un modulo di catena di custodia compilato con cura non sono burocrazia: sono la differenza tra una prova che regge e una che viene buttata fuori dall'aula.

Nel prossimo articolo si va oltre il disco: come si acquisisce e si analizza la memoria RAM, dove vivono processi, chiavi di cifratura e malware che sul disco non lasciano quasi traccia.
