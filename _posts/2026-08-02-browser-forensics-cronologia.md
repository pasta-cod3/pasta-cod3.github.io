---
layout: post
title: "Browser Forensics: cronologia, cache e download come prova digitale"
date: 2026-08-02
cat: blue
tags: [DFIR, browser forensics, cronologia, SQLite, cache, download, navigazione privata]
excerpt: "Ogni sito visitato, ogni file scaricato e quasi ogni ricerca digitata lascia una traccia nei database SQLite del browser. Anche cancellare la cronologia manualmente non basta a farla sparire davvero: ecco dove guardare e cosa sopravvive."
---

Un dipendente sospettato di aver scaricato dati aziendali su un sito di file sharing esterno giura di non averlo mai fatto. Ha cancellato la cronologia il giorno stesso. Peccato che la cronologia non sia l'unico posto dove il browser tiene traccia di cosa è successo: la cache, i cookie e persino la tabella dei download cancellati raccontano una storia diversa da quella che l'utente voleva far vedere.

Questo articolo copre gli artefatti del browser più utili in un'indagine, dove si trovano sul disco per Chrome, Firefox ed Edge, e cosa sopravvive davvero a una cancellazione manuale.

## Dove vivono i dati del browser

I browser moderni salvano quasi tutto in database **SQLite**, file `.sqlite` o senza estensione che si possono aprire con qualsiasi client SQLite (o con `sqlite3` da riga di comando) senza bisogno di strumenti specializzati.

```
# Chrome / Edge (basati su Chromium), Windows
C:\Users\<utente>\AppData\Local\Google\Chrome\User Data\Default\History
C:\Users\<utente>\AppData\Local\Microsoft\Edge\User Data\Default\History

# Firefox
C:\Users\<utente>\AppData\Roaming\Mozilla\Firefox\Profiles\<profilo>\places.sqlite
```

Il file `History` di Chrome ed Edge contiene diverse tabelle rilevanti: `urls` (ogni URL visitato, con conteggio delle visite e ultimo accesso), `visits` (ogni singola visita, con timestamp preciso) e `downloads` (file scaricati, percorso di destinazione e stato del download).

## Interrogare la cronologia senza il browser

Il browser blocca il proprio database `History` mentre è in esecuzione: su un sistema live va copiato prima di poterlo aprire. Su una copia forense (o dopo aver chiuso il browser), si interroga direttamente con SQL:

```bash
# Copia il file prima di interrogarlo, non toccare mai l'originale
cp History History_copy.sqlite

sqlite3 History_copy.sqlite "SELECT url, title, datetime(last_visit_time/1000000-11644473600,'unixepoch') AS visita FROM urls ORDER BY last_visit_time DESC LIMIT 20;"
```

Il calcolo `/1000000-11644473600` non è un dettaglio a caso: Chrome salva i timestamp come **microsecondi dal 1° gennaio 1601** (formato WebKit), non come i più comuni secondi dal 1970 (Unix epoch). Sbagliare questa conversione porta a interpretare male date e orari di mesi o addirittura secoli, un errore più comune di quanto sembri in analisi frettolose.

## Cosa sopravvive alla cancellazione della cronologia

Cancellare la cronologia dall'interfaccia del browser svuota le tabelle `urls` e `visits`, ma in un file SQLite le righe cancellate non vengono necessariamente sovrascritte subito: restano nello spazio libero del file finché SQLite non decide di riutilizzarlo. Strumenti come **Autopsy** o plugin specifici per SQLite carving riescono spesso a recuperare righe cancellate di recente esaminando questo spazio non allocato all'interno dello stesso file.

Oltre a questo, restano intatti altri artefatti che l'utente tipicamente non pensa a cancellare:

- **Cache** (`Cache` o `Cache_Data`): copie locali di immagini e risorse dei siti visitati, spesso ancora presenti anche dopo aver svuotato la cronologia
- **Cookie**: possono confermare l'accesso autenticato a un servizio specifico anche senza voci di cronologia corrispondenti
- **Autocompletamento moduli** (`Web Data`, tabella `autofill`): frammenti di testo digitati in form, a volte incluse porzioni di email o nomi utente

## Download cancellati: la tabella che mente meno

La tabella `downloads` in Chrome ed Edge registra il percorso completo di destinazione, l'URL sorgente e lo stato (completato, interrotto, cancellato) di ogni file scaricato, anche se l'utente lo ha poi eliminato dal disco e svuotato il cestino. È spesso l'artefatto decisivo in casi di sospetta esfiltrazione: dimostra non solo *che* un file è stato scaricato, ma da dove e quando, indipendentemente dal fatto che il file esista ancora.

## Navigazione privata: cosa NON viene salvato (e cosa sì)

La modalità privata (Incognito su Chrome, Navigazione anonima su Firefox) impedisce la scrittura di nuove voci in `History`, `Cache` e `Cookies` per quella sessione, ma non è invisibile per definizione:

- La **cronologia DNS** del sistema operativo, se abilitata, può comunque registrare i domini risolti durante la sessione privata
- Le **estensioni del browser** attive in modalità privata possono mantenere i propri log separati
- Se il sistema aveva la RAM ancora accesa al momento dell'acquisizione, un dump di memoria può contenere frammenti di pagine visitate in privata, perché quei dati esistono comunque in memoria mentre il browser è aperto

La navigazione privata protegge dalla persona che usa lo stesso computer dopo, non da un'indagine forense con accesso al sistema operativo o alla memoria.

## Checklist essenziale

```
✅ History (urls, visits, downloads)          → cronologia e file scaricati
✅ Cache / Cache_Data                         → risorse visitate, sopravvive a history pulita
✅ Cookies                                    → conferma sessioni autenticate
✅ Web Data (tabella autofill)                → frammenti digitati nei form
✅ Timestamp WebKit (microsecondi dal 1601)   → conversione corretta prima di ogni conclusione
✅ Spazio non allocato del file SQLite        → possibile recupero di righe cancellate
```

## Conclusione

Il browser è probabilmente lo strumento più usato su qualsiasi postazione di lavoro, e proprio per questo lascia una delle tracce più ricche e sottovalutate in un'indagine. La cronologia è solo la punta visibile: cache, cookie, download e lo spazio non allocato dentro gli stessi database SQLite spesso raccontano molto più di quanto l'utente pensasse di aver cancellato.

Nel prossimo articolo si lascia Windows per guardare al lato Linux: quali artefatti restano su un server compromesso quando l'attaccante ha provato a coprire le proprie tracce nella shell.
