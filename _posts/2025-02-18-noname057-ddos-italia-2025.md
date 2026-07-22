---
layout: post
title: "NoName057(16): quando l'hacktivismo filorusso colpisce l'Italia"
date: 2025-02-18
cat: storia
tags: [DDoS, hacktivismo, NoName057, geopolitica, NATO]
excerpt: "Febbraio 2025: aeroporti di Malpensa e Linate, porti di Trieste e Taranto, Intesa Sanpaolo. Come un gruppo Telegram ha dichiarato guerra informatica all'Italia."
---

Il 17 febbraio 2025 i siti degli aeroporti di Malpensa e Linate smettono di rispondere. Poco dopo tocca ai porti di Trieste e Taranto, poi all'area clienti di Intesa Sanpaolo. Su Telegram arriva il messaggio: *"Missili DDoS sull'Italia — punizione per le parole di Mattarella"*. Il mittente è **NoName057(16)**.

## Chi sono

Il gruppo è comparso a marzo 2022, pochi giorni dopo l'invasione russa dell'Ucraina, dichiarando supporto alla Federazione Russa. Da allora ha rivendicato centinaia di attacchi DDoS contro paesi NATO e UE: governi, trasporti, finanza, media.

Il loro strumento principale si chiama **DDOSIA** — un toolkit che permette a simpatizzanti di tutto il mondo di unirsi alle campagne come nodi di botnet volontaria, con ricompense in criptovaluta proporzionate al traffico generato. Hacking in crowdsourcing, di fatto.

Secondo il report Forescout 2025, NoName057(16) è responsabile del **90% degli attacchi state-aligned** registrati in Europa nel 2024.

## Il pretesto

Il casus belli dichiarato fu un'uscita del Presidente Mattarella a Marsiglia in cui paragonò alcune dinamiche della Russia attuale a quelle del Terzo Reich. Due ondate di attacchi: il 17 febbraio su banche e aeroporti, il 18 su ministeri, Carabinieri, Guardia di Finanza e trasporto pubblico.

## Come funziona tecnicamente

Un DDoS (Distributed Denial of Service) satura le risorse di un server inondandolo di richieste. NoName057(16) usa principalmente:

- **HTTP flood** — richieste GET/POST che esauriscono i thread del web server
- **Layer 7 attacks** — attacchi applicativi difficili da filtrare con regole IP
- **Botnet distribuita** — nodi geograficamente sparsi, inutile bloccare per area geografica

> L'ACN ha confermato che i siti colpiti sono tornati operativi in poche ore. L'obiettivo non era tecnico: era **il messaggio**.

## Il pattern si ripete

Non è stata la prima volta. Il gruppo colpisce l'Italia ogni volta che c'è una dichiarazione politica su Russia/Ucraina. Dichiarazione → rivendicazione su Telegram → ondata DDoS → scarso impatto tecnico → forte impatto mediatico.

## Difesa pratica

- CDN con capacità di assorbimento (Cloudflare, Akamai) per i siti pubblici
- Rate limiting e WAF a livello applicativo
- Monitoraggio real-time dei pattern di traffico anomalo
- Piano di comunicazione in caso di downtime, per non amplificare l'effetto mediatico
