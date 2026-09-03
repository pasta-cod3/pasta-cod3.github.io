---
layout: post
title: "USB Forensics: ricostruire una timeline di esfiltrazione completa"
date: 2026-08-06
cat: blue
tags: [DFIR, USB forensics, setupapi, LNK files, Jump Lists, esfiltrazione dati]
excerpt: "Sapere che una chiavetta USB è stata collegata non basta a dimostrare cosa è successo dopo. Incrociando il log di installazione del dispositivo con i file LNK e le Jump List di Windows si ricostruisce l'intera timeline: quando, quale dispositivo e quali file sono stati aperti da lì."
---

Il Registro conferma che una chiavetta USB con un certo numero di serie è stata collegata al portatile di un dipendente il giorno prima delle sue dimissioni. Fin qui, un solo dato isolato: non dimostra ancora cosa sia successo davvero. La domanda che conta in un'indagine di sospetta esfiltrazione non è "è stata collegata una chiavetta", ma "quali file sono stati copiati o aperti da quella chiavetta, e quando". Per rispondere serve incrociare più artefatti diversi.

Questo articolo mette insieme tre fonti complementari (il log di installazione del dispositivo, i file LNK e le Jump List) per costruire una timeline difendibile di un episodio di esfiltrazione via USB.

## Punto di partenza: il numero di serie dal Registro

Come visto nell'articolo sul Registry Forensics, la chiave `SYSTEM\CurrentControlSet\Enum\USBSTOR` fornisce produttore, modello e **numero di serie univoco** del dispositivo. Questo numero di serie è la chiave di correlazione che collega tutte le altre fonti che seguono: senza di esso, si può solo dire "una qualche chiavetta è stata usata", non "questa chiavetta specifica".

```
HKLM\SYSTEM\CurrentControlSet\Enum\USBSTOR\Disk&Ven_Kingston&Prod_DataTraveler...\<numero di serie>
```

## setupapi.dev.log: il timestamp preciso di ogni connessione

```
C:\Windows\inf\setupapi.dev.log
```

Ogni volta che Windows rileva un nuovo dispositivo USB (o uno già visto ma con un driver da ricaricare), registra l'evento in questo file di log testuale, con un timestamp al secondo. A differenza della chiave del Registro, che mostra solo la **prima** e l'**ultima** connessione aggregate, `setupapi.dev.log` elenca ogni singolo evento di connessione in ordine cronologico, permettendo di sapere esattamente quante volte quel dispositivo specifico è stato collegato durante il periodo sotto indagine.

```bash
grep -A 5 "Kingston DataTraveler" C:\Windows\inf\setupapi.dev.log
```

## LNK files: cosa è stato aperto, non solo cosa è collegato

Ogni volta che un utente apre un file da Esplora Risorse (anche da un'unità USB), Windows crea o aggiorna automaticamente un file `.lnk` (collegamento) nella cartella dei file recenti:

```
C:\Users\<utente>\AppData\Roaming\Microsoft\Windows\Recent\
```

Un file LNK non contiene solo il nome del file aperto: incorpora il **numero di serie del volume** su cui quel file risiedeva al momento dell'apertura, oltre a percorso completo, dimensione e timestamp MAC del file originale. Se il numero di serie del volume dentro il LNK corrisponde al volume della chiavetta USB identificata in precedenza, si ha la prova diretta che un file specifico è stato aperto **da quella chiavetta**, anche se il dispositivo non è più fisicamente disponibile per l'analisi.

```bash
# Estrazione con LECmd (Eric Zimmerman tools)
LECmd.exe -f "C:\Users\utente\AppData\Roaming\Microsoft\Windows\Recent\report_riservato.lnk"
```

## Jump Lists: la stessa storia, raccontata due volte

Le **Jump List** (i menu che appaiono cliccando col tasto destro su un'icona nella barra delle applicazioni) mantengono una propria cronologia di file recenti per applicazione, salvata in file binari `.automaticDestinations-ms`:

```
C:\Users\<utente>\AppData\Roaming\Microsoft\Windows\Recent\AutomaticDestinations\
```

Ogni Jump List contiene al proprio interno strutture LNK complete per ciascun file recente di quell'applicazione, con lo stesso numero di serie del volume di origine. Il valore aggiunto per l'indagine è duplice: le Jump List sono organizzate per programma (quale applicazione ha aperto il file: Word, Excel, un visualizzatore PDF), e spesso sopravvivono anche quando i singoli file `.lnk` nella cartella Recent sono stati cancellati manualmente dall'utente, perché è un file separato con una propria gestione.

## Mettere insieme la timeline

```
1. USBSTOR (Registro)         → chiavetta con serial XYZ collegata la prima e l'ultima volta
2. setupapi.dev.log             → 14:02 e 14:47, due connessioni distinte quel giorno
3. LNK in Recent                → 14:05, aperto "clienti_2026.xlsx" da volume con serial coerente
4. Jump List di Excel           → conferma lo stesso file, stessa applicazione, stesso orario
```

Nessuna delle quattro fonti da sola basta a costruire un caso solido. Insieme, raccontano una storia coerente e verificabile in modo incrociato: la chiavetta è stata collegata, un file specifico è stato aperto da quella chiavetta in quella finestra temporale, e due artefatti indipendenti (LNK e Jump List) confermano lo stesso evento con lo stesso numero di serie del volume.

## Checklist essenziale

```
✅ Numero di serie del dispositivo da USBSTOR         → chiave di correlazione
✅ setupapi.dev.log                                    → timestamp precisi di ogni connessione
✅ File LNK in Recent                                  → file aperti, con serial del volume di origine
✅ Jump List (.automaticDestinations-ms)               → conferma indipendente, per applicazione
✅ Corrispondenza del serial del volume tra LNK/Jump List e chiavetta identificata
```

## Conclusione

Un singolo artefatto isolato in un'indagine di esfiltrazione via USB dice poco: conferma solo che qualcosa è successo, non cosa. È l'incrocio sistematico tra Registro, log di sistema e artefatti applicativi come LNK e Jump List a trasformare un sospetto in una timeline verificabile, con più fonti indipendenti che confermano lo stesso evento dagli stessi due numeri di serie: quello del dispositivo e quello del volume.

Nel prossimo articolo si cambia completamente prospettiva: cosa succede quando è l'attaccante, non l'analista, a conoscere questi stessi artefatti e prova a cancellarli o falsificarli prima che qualcuno li trovi.
