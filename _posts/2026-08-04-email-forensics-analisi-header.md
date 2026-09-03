---
layout: post
title: "Email Forensics: leggere un header per scoprire una falsificazione"
date: 2026-08-04
cat: blue
tags: [DFIR, email forensics, header analysis, Received, spoofing, EML]
excerpt: "Il corpo di un'email si può falsificare con un editor di testo in due minuti. L'header no, o almeno non facilmente: ogni server che ha gestito il messaggio lascia una riga Received che è difficile falsificare senza lasciare incongruenze rilevabili."
---

Un dipendente riceve un'email che sembra arrivare dal CEO, con una richiesta urgente di bonifico. L'indirizzo del mittente, a colpo d'occhio, è quello giusto. Il body è scritto nello stesso stile delle email precedenti. L'unica cosa che il body non può falsificare in modo credibile è il percorso tecnico che il messaggio ha davvero seguito per arrivare in quella casella, ed è lì che va cercata la prova.

Questo articolo copre come leggere un header email riga per riga per stabilire se un messaggio è genuino o falsificato, e cosa cercare in un file `.eml` durante un'indagine.

## Come vedere l'header completo

Ogni client di posta nasconde l'header per impostazione predefinita, mostrando solo mittente, oggetto e data. Per l'analisi forense serve l'header **completo** (raw), che si ottiene diversamente a seconda del client:

```
Gmail:    apri l'email → tre puntini in alto a destra → "Mostra originale"
Outlook:  apri l'email → File → Proprietà → campo "Intestazioni internet"
Thunderbird: apri l'email → Altro → "Codice sorgente del messaggio" (Ctrl+U)
```

Il risultato è un blocco di testo che inizia con una serie di righe `Received:`, seguite da `From:`, `Return-Path:`, `Reply-To:` e altri campi tecnici che il body dell'email non mostra mai.

## Le righe Received: il percorso reale del messaggio

Ogni server SMTP che gestisce un'email aggiunge una propria riga `Received:` **in cima** alle precedenti, mai in fondo. Questo significa che leggendo le righe `Received:` **dal basso verso l'alto**, si ricostruisce il percorso reale seguito dal messaggio, dal server di invio originale fino alla casella di destinazione.

```
Received: from mail.destinatario.com by mx.gmail.com ...   ← ultimo hop (il più recente)
Received: from smtp.dominiosconosciuto.ru by mail.destinatario.com ...
Received: from [10.0.0.55] by smtp.dominiosconosciuto.ru ...   ← primo hop (il più vecchio, in fondo)
```

Se un'email dichiara di venire dal dominio aziendale ma la prima riga `Received:` (quella più in basso, il vero punto di origine) mostra un server SMTP che non ha nulla a che fare con l'infrastruttura email dell'azienda, è un'incongruenza che il mittente falso non può nascondere facilmente: dovrebbe controllare l'intera catena di server di posta legittimi per farla sparire.

## From vs Return-Path vs Reply-To

Tre campi che sembrano simili ma raccontano cose diverse, e la loro discordanza è un classico indicatore di spoofing:

- **From**: l'indirizzo mostrato all'utente nel client di posta. È il più facile da falsificare, quasi chiunque può scrivere qualsiasi cosa qui.
- **Return-Path**: dove rimbalzano gli errori di consegna (bounce). Spesso rivela il vero indirizzo del mittente tecnico, diverso da quello mostrato in `From`.
- **Reply-To**: dove va davvero la risposta se il destinatario clicca "Rispondi". In un attacco di Business Email Compromise, è comune che `Reply-To` punti a un indirizzo completamente diverso e sconosciuto, per dirottare la conversazione verso l'attaccante senza che la vittima se ne accorga a colpo d'occhio.

## SPF, DKIM, DMARC nell'header: il verdetto tecnico

La maggior parte dei server di posta in ricezione aggiunge un campo `Authentication-Results` che riassume l'esito delle verifiche automatiche:

```
Authentication-Results: mx.gmail.com;
       spf=fail (google.com: domain of ceo@azienda.com does not designate 203.0.113.9 as permitted sender) smtp.mailfrom=ceo@azienda.com;
       dkim=none;
       dmarc=fail (p=REJECT sp=REJECT dis=NONE) header.from=azienda.com
```

Un `spf=fail` accompagnato da `dmarc=fail` su un'email che dichiara di venire dal dominio aziendale è quasi sempre la prova definitiva di uno spoofing riuscito nel superare i controlli visivi dell'utente ma non quelli tecnici del server. Questo campo va sempre controllato per primo: se il server di destinazione ha già fatto il lavoro di verifica, l'analista non deve rifarlo manualmente da zero.

## Message-ID: un identificatore che non dovrebbe ripetersi

```
Message-ID: <a1b2c3d4-e5f6-7890@mail.azienda.com>
```

Ogni email dovrebbe avere un `Message-ID` univoco, generato dal server che la invia per la prima volta, tipicamente contenente il dominio del vero mittente dopo la chiocciola. Un `Message-ID` che riporta un dominio completamente estraneo a quello dichiarato in `From` è un altro segnale che il messaggio non è mai passato dai server ufficiali di quel dominio.

## Estensione EML: analizzare offline senza aprire l'email

Salvare un'email sospetta come file `.eml` (formato standard, testo semplice con header e body) permette di analizzarla in un ambiente isolato senza rischiare di eseguire contenuti attivi (immagini remote, script) semplicemente aprendola nel client normale. Strumenti come `MailXaminer` o anche un semplice editor di testo permettono di ispezionare l'header raw di un file `.eml` in totale sicurezza, senza connessione di rete attiva.

## Checklist essenziale

```
✅ Header completo (raw), non solo la vista semplificata del client
✅ Righe Received lette dal basso verso l'alto → percorso reale del messaggio
✅ From vs Return-Path vs Reply-To          → discordanze sospette
✅ Authentication-Results (SPF/DKIM/DMARC)  → verdetto tecnico già calcolato dal server
✅ Message-ID                                → dominio coerente con il mittente dichiarato
✅ Salvataggio come .eml prima di ogni analisi, mai aprire contenuti attivi nel client normale
```

## Conclusione

Il body di un'email è pura interfaccia utente e non prova nulla dal punto di vista tecnico. L'header, per quanto ignorato dalla maggior parte degli utenti, è la parte del messaggio che un attaccante deve lavorare di più per falsificare in modo coerente su ogni singolo campo, ed è proprio lì che un'indagine trova le incongruenze che il body non potrà mai mostrare.

Nel prossimo articolo si guarda a un altro tipo di dispositivo spesso sottovalutato in un'indagine: le chiavette USB, e come il sistema operativo tiene traccia di ogni connessione anche molto tempo dopo che il dispositivo è stato rimosso.
