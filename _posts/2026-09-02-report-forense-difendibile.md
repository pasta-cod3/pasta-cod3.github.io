---
layout: post
title: "Scrivere un report forense che regga in tribunale"
date: 2026-09-02
cat: blue
tags: [DFIR, report forense, expert witness, catena di custodia, comunicazione tecnica]
excerpt: "L'analisi più rigorosa del mondo non serve a niente se il report che la racconta è ambiguo, pieno di gergo o costruisce conclusioni che i dati non sostengono davvero. Il report è il prodotto finale: è quello su cui verrai giudicato."
---

Un giudice, un avvocato o un dirigente non hanno visto nessuna delle prove analizzate in questo modulo. Non hanno guardato l'output di Volatility, non hanno seguito lo stream TCP in Wireshark, non hanno letto una riga della timeline costruita con Plaso. L'unica cosa che vedranno è il report. Se il report è debole, tutto il lavoro tecnico che c'è dietro, per quanto rigoroso, semplicemente non conta.

## Chi legge un report forense

Un buon report forense serve pubblici molto diversi contemporaneamente, e deve funzionare per tutti:

- **Un dirigente o un cliente**, che vuole sapere cosa è successo e cosa fare, in due minuti di lettura
- **Un avvocato**, che deve capire se e come la prova regge legalmente
- **Un altro analista tecnico**, che deve poter verificare o riprodurre l'analisi
- **Un giudice o una giuria**, in caso di procedimento legale, che non ha alcuna competenza tecnica pregressa

Scrivere per tutti questi lettori insieme significa strutturare il report a livelli: una sintesi comprensibile a chiunque in cima, e il dettaglio tecnico verificabile in fondo, non mescolati nello stesso paragrafo.

## Struttura di un report forense

```
1. EXECUTIVE SUMMARY
   Cosa è successo, in linguaggio non tecnico, in mezza pagina.

2. AMBITO E OBIETTIVI
   Cosa è stato richiesto di analizzare, e cosa esplicitamente no.

3. METODOLOGIA
   Come sono state acquisite le prove, con quali strumenti,
   seguendo quali standard.

4. CATENA DI CUSTODIA
   Documentazione completa di ogni passaggio di mano della prova.

5. ANALISI E RISULTATI
   Il dettaglio tecnico, artefatto per artefatto, con evidenza a supporto
   di ogni affermazione.

6. TIMELINE DEGLI EVENTI
   La ricostruzione cronologica, in forma leggibile.

7. CONCLUSIONI
   Cosa i dati dimostrano, distinto con chiarezza da cosa è
   solo un'ipotesi plausibile.

8. ALLEGATI
   Hash delle prove, output grezzo degli strumenti, screenshot,
   moduli di catena di custodia firmati.
```

## L'executive summary: la parte più letta

La maggior parte dei destinatari di un report forense leggerà solo l'executive summary. Va scritto per ultimo, quando tutta l'analisi è chiara, ma va letto per primo.

Un buon executive summary risponde a quattro domande in poche frasi: cosa è successo, quando, come è stato scoperto o confermato, e quali sono le conseguenze pratiche. Niente acronimi tecnici non spiegati, niente nomi di tool, niente output di comandi.

```
Esempio:

Il 3 settembre 2026 un dipendente ha aperto un allegato malevolo
ricevuto via email, che ha eseguito codice non autorizzato sul suo
computer. L'analisi forense ha confermato che l'attaccante ha creato
un account con privilegi elevati e ha trasferito circa 2,3 GB di dati
verso un server esterno prima che la connessione venisse interrotta.
Non risultano evidenze di ulteriori sistemi compromessi.
```

Quattro frasi, zero gergo, e già dice a un dirigente tutto quello che deve sapere per decidere i prossimi passi.

## Distinguere fatti da inferenze

L'errore più costoso in un report forense è scrivere un'ipotesi come se fosse un fatto accertato. Un report onesto sui propri limiti è più credibile, non meno, di uno che finge certezza assoluta.

```
DEBOLE:  "L'attaccante ha rubato il database dei clienti."

MEGLIO:  "L'analisi del traffico di rete mostra una connessione TCP
          di 2,3 GB verso l'indirizzo IP 185.220.x.x, coerente con
          esfiltrazione di dati. Il contenuto esatto del trasferimento
          non è stato recuperabile perché la connessione era cifrata."
```

La seconda versione dice esattamente cosa i dati dimostrano (una connessione con quelle caratteristiche è avvenuta) e cosa non possono dimostrare (il contenuto esatto), senza inventare un fatto che le prove non supportano fino in fondo.

Frasi utili per marcare il livello di certezza in modo esplicito: *"le evidenze confermano che..."*, *"i dati sono coerenti con..."*, *"non è stato possibile determinare se..."*, *"un'ipotesi plausibile, non confermata dalle evidenze disponibili, è che..."*.

## Ogni affermazione ha bisogno di un'evidenza

Ogni riga nella sezione di analisi dovrebbe poter essere ricondotta a un artefatto specifico, verificabile: un output di comando, uno screenshot, un timestamp preciso, un hash.

```
DEBOLE:  "Sono state trovate tracce di attività malevola sul sistema."

MEGLIO:  "Il plugin windows.malfind di Volatility ha identificato una
          regione di memoria eseguibile non associata a nessun modulo
          caricato legittimamente, all'interno del processo explorer.exe
          (PID 3421). Vedere Allegato C per l'output completo."
```

Questo è anche ciò che rende un report riproducibile: un altro analista, con accesso alle stesse prove, deve poter arrivare alle stesse conclusioni seguendo gli stessi passaggi.

## Il ruolo dell'expert witness

Quando un caso arriva in tribunale, l'analista che ha scritto il report può essere chiamato a testimoniare come **expert witness**, un testimone che non racconta fatti di cui è stato spettatore diretto, ma fornisce un'opinione tecnica basata sulla propria competenza e sull'analisi svolta.

Alcune conseguenze pratiche per come si scrive e ci si prepara:

- **Ogni affermazione nel report può essere messa in discussione dalla controparte**: se non è supportata da un'evidenza precisa, cade
- **Le qualifiche e certificazioni dell'analista contano**: vanno documentate in un curriculum allegato al report nei casi che richiedono testimonianza
- **La coerenza tra report e testimonianza è cruciale**: dire in aula qualcosa di diverso da quanto scritto nel report mina la credibilità di entrambi
- **Il linguaggio va calibrato per un pubblico non tecnico**: una giuria non tecnica deve poter seguire il ragionamento senza perdersi in acronimi

## Errori comuni da evitare

```
✅ Scrivere l'executive summary per ultimo, ma metterlo per primo
✅ Distinguere sempre fatti accertati da ipotesi plausibili
✅ Collegare ogni affermazione a un'evidenza specifica e verificabile
✅ Includere hash e metadati di ogni prova, non solo la loro descrizione
✅ Far revisionare il report da un collega prima della consegna
✅ Conservare tutti gli output grezzi degli strumenti come allegati

❌ Usare acronimi tecnici senza spiegarli almeno una volta
❌ Scrivere conclusioni più forti di quanto i dati permettano
❌ Mescolare fatti e opinioni personali nello stesso paragrafo
❌ Omettere cosa NON è stato possibile determinare
```

## Conclusione

Un report forense non è un output tecnico da appendere in fondo al lavoro: è il lavoro, agli occhi di chiunque non abbia partecipato all'analisi. La stessa disciplina usata per acquisire una prova senza alterarla va applicata a come se ne scrive: con precisione, con onestà sui limiti, e con ogni affermazione ancorata a qualcosa che un altro analista, o un avvocato della controparte, possa verificare da solo.

Con questo si chiude il primo modulo del ramo DFIR. Le basi sono qui: come acquisire senza distruggere, come leggere memoria e disco, come ricostruire una rete, e come raccontare tutto questo in modo che regga fuori da questa pagina.
