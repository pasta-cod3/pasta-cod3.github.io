---
layout: post
title: "PlayStation Network Breach 2011: 77 milioni di account e 23 giorni offline"
date: 2026-06-25
cat: storia
tags: [PSN, PlayStation, Sony, 2011, LulzSec, breach, Anonymous, gaming]
excerpt: "Aprile 2011: Sony disattiva il PlayStation Network per 23 giorni dopo aver scoperto che 77 milioni di account sono stati compromessi. Il più grande breach di dati ai consumatori fino a quel momento. La risposta di Sony — ritardata e opaca — diventa il caso di studio di come non gestire un incidente."
---

Il 20 aprile 2011 Sony disattivò il PlayStation Network, lasciando milioni di giocatori in tutto il mondo senza accesso ai servizi online. Non fu un'interruzione tecnica ordinaria. Quattro giorni dopo, Sony ammise quello che già stava emergendo: il PSN era stato violato. 77 milioni di account compromessi, 23 giorni offline, miliardi di dollari di danni. È rimasto per anni il più grande breach di dati ai consumatori della storia.

## Il contesto: Sony vs. hacker

Inizio 2011. Sony è in guerra con la comunità hacker. George Hotz (Geohot) aveva pubblicato la chiave di cifratura del PS3, permettendo l'installazione di software non autorizzato. Sony lo aveva citato in giudizio. La comunità hacker aveva risposto: Anonymous aveva già lanciato attacchi DDoS contro Sony come rappresaglia.

In questo clima teso, qualcuno — o più persone — decise di colpire più in profondità.

## Cosa è stato rubato

Dal 17 al 19 aprile 2011, gli attaccanti esfiltrano da due datacenter Sony il contenuto del database PSN:

- **Nome, indirizzo, email, data di nascita** di 77 milioni di account
- **Cronologie di acquisto** e informazioni di abbonamento
- **Password** — non in chiaro, ma con hashing non salted (probabilmente MD5 o SHA-1)
- Potenzialmente: dati di **12.000 carte di credito** di Qriocity (il servizio music/video di Sony), non cifrate

Sony non era sicura se i dati delle carte di credito fossero stati rubati. Non lo sapeva — non aveva la visibilità per determinarlo con certezza.

## La risposta di Sony: il caso di studio sbagliato

La violazione avvenne intorno al 17 aprile. Sony lo scoprì il 19 aprile. Disattivò il PSN il 20 aprile. Informò pubblicamente gli utenti il **27 aprile** — 7 giorni dopo la scoperta, 10 giorni dopo la violazione.

In quei 10 giorni, gli utenti non sapevano che le loro credenziali e potenzialmente i dati delle carte di credito erano in mano agli attaccanti.

**Le critiche:**
- Sony usò password hashing senza salt, rendendo molto più facile il cracking delle password
- I dati erano parzialmente in chiaro
- 10 giorni per notificare gli utenti era considerato inaccettabile
- La comunicazione iniziale era vaga sui dettagli esatti del breach

## Chi era responsabile?

L'attribuzione rimase sempre incompleta. Sony indicò Anonymous e LulzSec come possibili responsabili. LulzSec — che rivendicò un secondo attacco a Sony Pictures Entertainment in giugno — non rivendicò mai il breach del PSN. Anonymous negò il coinvolgimento.

L'FBI aprì un'indagine. Nessun arresto formalmente collegato al PSN breach fu mai annunciato pubblicamente. Il mistero rimase.

## Le conseguenze

**Per gli utenti**: cambio obbligatorio password, monitoraggio carte di credito, rischio di identity theft.

**Per Sony**: 
- 23 giorni di PSN offline, con perdite stimate in oltre 170 milioni di dollari
- Offerta di "Welcome Back" ai clienti (un mese di PlayStation Plus gratuito, due giochi, 30 giorni di servizio music)
- 2,75 milioni di sterline di multa dall'ICO britannica (massimo consentito dalla legge dell'epoca)
- Cause legali collettive
- Danno reputazionale enorme

**Per il settore**: il PSN breach spinse l'industria del gaming — e il settore consumer in generale — a prendere sul serio hashing salted delle password, cifratura dei dati delle carte, e tempi di notifica rapidi. Diventò un caso di studio nelle policy di data breach notification.

## La lezione che rimane

Il PSN breach aveva due messaggi chiari:

1. **Sicurezza tecnica**: password senza salt, dati di pagamento non cifrati — erano errori fondamentali, non sofisticate vulnerabilità zero-day. Una sicurezza di base adeguata avrebbe limitato enormemente il danno.

2. **Risposta all'incidente**: la lentezza e l'opacità della comunicazione di Sony fecero più danni del breach stesso in termini di fiducia. La trasparenza rapida, anche quando dolorosa, è sempre la strategia giusta.
