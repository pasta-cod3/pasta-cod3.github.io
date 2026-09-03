---
layout: post
title: "Mobile Forensics: acquisire uno smartphone senza comprometterlo"
date: 2026-08-12
cat: blue
tags: [DFIR, mobile forensics, Android, iOS, acquisizione logica, acquisizione fisica]
excerpt: "Uno smartphone contiene spesso più prove digitali di un intero laptop: posizione, messaggi, app installate, cronologia di navigazione. Acquisirlo correttamente è più delicato che acquisire un disco, perché il dispositivo continua a comunicare con la rete finché non lo si isola."
---

Un telefono aziendale sequestrato durante un'indagine interna continua a ricevere notifiche push mentre è sul tavolo dell'analista. Ogni notifica che arriva, ogni sincronizzazione automatica in background, è una modifica ai dati del dispositivo che avviene dopo il sequestro, esattamente il tipo di alterazione che l'acquisizione forense di un disco (vista in un articolo precedente) cerca di evitare con un write blocker. Su mobile, il problema è analogo ma la soluzione è diversa: qui non basta bloccare la scrittura, bisogna isolare il dispositivo dalla rete.

Questo articolo copre i principi di base dell'acquisizione forense di uno smartphone, le differenze tra Android e iOS, e cosa cambia rispetto alla forensics tradizionale su disco.

## Il primo gesto: isolare il dispositivo dalla rete

Prima di qualsiasi altra operazione, un dispositivo mobile sotto sequestro va isolato da qualunque connessione di rete, per impedire comandi di cancellazione remota (wipe), sincronizzazioni cloud che alterano i dati locali, o semplicemente nuove notifiche che modificano lo stato del dispositivo dopo il momento dell'acquisizione:

```
Metodi comuni di isolamento:
- Modalità aereo attivata immediatamente (se il dispositivo è sbloccato)
- Gabbia di Faraday o sacchetto schermante (Faraday bag), che blocca fisicamente ogni segnale
- Rimozione della SIM, se compatibile con la necessità di mantenere il dispositivo acceso
```

La modalità aereo da sola non è sempre sufficiente in un contesto realmente rigoroso, perché richiede comunque un'interazione con il dispositivo che potrebbe essere contestata: una gabbia di Faraday garantisce l'isolamento fisico senza dover toccare le impostazioni.

## Acquisizione logica vs acquisizione fisica

Due livelli di profondità molto diversi, con implicazioni diverse su cosa si riesce a recuperare:

**Acquisizione logica**: estrae i dati accessibili tramite le normali API del sistema operativo (contatti, messaggi, log delle chiamate, app installate, file nella memoria condivisa), tipicamente tramite un backup gestito da strumenti come **ADB** su Android o gli strumenti di backup ufficiali su iOS. È il metodo più comune, non richiede sblocco di sicurezza avanzato del dispositivo, ma non recupera dati cancellati o nascosti a livello di sistema.

**Acquisizione fisica**: crea un'immagine bit a bit dell'intera memoria del dispositivo, incluso lo spazio non allocato dove possono sopravvivere dati cancellati, in modo concettualmente identico all'imaging di un disco visto nell'articolo sull'acquisizione forense. È molto più completa ma anche molto più complessa da ottenere, spesso richiede l'accesso root/jailbreak del dispositivo (che a sua volta altera il sistema) o strumenti forensi specializzati e costosi.

```bash
# Esempio di acquisizione logica Android via ADB (dispositivo con debug USB attivo)
adb backup -apk -shared -all -f backup_dispositivo.ab
```

## Cosa cambia tra Android e iOS

Le due piattaforme richiedono approcci diversi per ragioni architetturali:

- **Android** è più aperto e frammentato: centinaia di produttori diversi, versioni del sistema diverse, e in molti casi un accesso root ottenibile (anche se altera il dispositivo) permette un'acquisizione fisica più completa. La memoria è tipicamente basata su **UFS** o **eMMC**, con strutture filesystem accessibili con strumenti dedicati una volta ottenuto l'accesso adeguato.
- **iOS** è un ecosistema molto più chiuso: Apple cifra l'intero storage per impostazione predefinita e limita fortemente le acquisizioni fisiche complete senza vulnerabilità di jailbreak specifiche per quella versione del sistema. La maggior parte delle indagini su iOS si basa su acquisizioni logiche tramite backup iTunes/Finder, oppure su un'estrazione **iCloud** quando le credenziali sono disponibili legalmente, il che sposta parte del problema dall'hardware fisico all'account cloud dell'utente.

## Cosa si trova, una volta dentro

Un'acquisizione riuscita, anche solo logica, tipicamente restituisce:

```
✅ Messaggi (SMS, e spesso database locali di app come WhatsApp o Signal, se non cifrati end-to-end a riposo)
✅ Cronologia chiamate e contatti
✅ App installate, con relativi dati locali nella sandbox dell'app
✅ Dati di geolocalizzazione (cache di posizione, foto con metadati EXIF geografici)
✅ Cronologia del browser mobile, con gli stessi principi visti nell'articolo sul browser forensics
```

I database delle app di messaggistica meritano attenzione particolare: molte app salvano localmente una copia in chiaro o debolmente protetta dei messaggi, anche quando pubblicizzano la cifratura end-to-end per il solo transito in rete, il che significa che un'acquisizione locale del dispositivo può recuperare conversazioni che sarebbero altrimenti impossibili da intercettare in transito.

## Cloud: l'acquisizione che non passa dal dispositivo fisico

Sempre più spesso, i dati rilevanti non risiedono più solo sul dispositivo fisico ma sincronizzati su iCloud, Google Drive o backup automatici dell'app stessa. Con l'autorizzazione legale adeguata (mandato o consenso), un'estrazione diretta dall'account cloud può recuperare dati anche quando il dispositivo fisico non è mai stato recuperato, cancellato o distrutto, aprendo un fronte di indagine completamente indipendente dal telefono stesso.

## Checklist essenziale

```
✅ Isolamento immediato dalla rete (Faraday bag, non solo modalità aereo)
✅ Scelta tra acquisizione logica (più comune, meno invasiva) e fisica (più completa, più complessa)
✅ Differenze Android/iOS considerate prima di scegliere lo strumento
✅ Database locali delle app di messaggistica controllati per copie in chiaro
✅ Valutazione di un'acquisizione cloud parallela, se legalmente autorizzata
```

## Conclusione

Un telefono sotto sequestro non smette mai davvero di "vivere" finché non lo si isola attivamente dalla rete, ed è proprio questa differenza rispetto a un disco spento a rendere la mobile forensics un campo con regole proprie. Una volta isolato correttamente, però, i principi di fondo restano gli stessi visti finora in tutto il percorso: preservare l'originale, documentare ogni passaggio, e distinguere sempre cosa si può recuperare da cosa richiede un livello di accesso più invasivo.

Nel prossimo articolo si sale di un altro livello di astrazione: cosa succede quando le prove non risiedono più su nessun dispositivo fisico, ma nell'infrastruttura di un provider cloud.
