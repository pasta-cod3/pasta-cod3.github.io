---
layout: post
title: "Il Samy Worm 2005: il primo worm virale della storia del web — tutto XSS"
date: 2026-06-24
cat: storia
tags: [Samy Worm, XSS, MySpace, 2005, Samy Kamkar, worm, storia web]
excerpt: "20 ottobre 2005: Samy Kamkar rilascia su MySpace un codice JavaScript che si diffonde da profilo a profilo. In meno di 24 ore infetta un milione di account. È il primo worm virale mai visto su una piattaforma social."
---

Il 20 ottobre 2005, alle ore 13:00, Samy Kamkar aggiunse al proprio profilo MySpace un innocuo pezzo di JavaScript. In 20 ore aveva infettato oltre un milione di profili. MySpace dovette andare offline per contenerlo. Era il Samy Worm — il primo e, per molti versi, il più elegante worm social della storia.

## Chi era Samy Kamkar

Samy Kamkar aveva 19 anni, viveva in California e, a suo dire, non voleva fare niente di malevolo. Voleva un po' di popolarità su MySpace — era il 2005, MySpace era il social network dominante con 60 milioni di utenti — e trovare nuovi amici. Quello che creò, però, era un'opera di ingegneria JavaScript che i ricercatori di sicurezza studiano ancora oggi.

## MySpace e i "filtri" per la sicurezza

MySpace permetteva agli utenti di personalizzare i propri profili con HTML e CSS. Ovviamente vietava i tag `<script>` per prevenire attacchi XSS — Cross-Site Scripting. Ma il filtraggio era implementato male: controllava la presenza letterale di certi tag e attributi, ma non gestiva tutti i casi edge del linguaggio.

Kamkar scoprì che:
- `<div style="background:url('javascript:...')">` funzionava
- JavaScript nel CSS in certi browser (Internet Explorer, Safari dell'epoca) veniva eseguito
- Alcune stringhe come `javascript` venivano filtrate, ma `java\nscript` (con newline) no
- L'attributo `expression()` nel CSS di Internet Explorer eseguiva JavaScript

## Come funzionava il worm

Il payload era elegante nella sua semplicità:

1. **Leggeva il profilo dell'utente corrente** tramite una richiesta AJAX
2. **Estraeva il token CSRF** dalla pagina (MySpace non aveva protezione sufficiente)
3. **Modificava il profilo** aggiungendo Samy come amico e la scritta "but most of all, samy is my hero" nella sezione about
4. **Iniettava se stesso** nel profilo infetto, così chiunque lo visitasse veniva a sua volta infettato

Il ciclo era: visito il profilo infetto → il mio profilo viene infettato → chiunque visiti il mio profilo viene infettato. Crescita esponenziale.

Una difficoltà tecnica: MySpace limitava la lunghezza del campo di personalizzazione. Kamkar scrisse il worm in modo che si auto-decomprimesse, tenendolo sotto il limite. E poiché la parola `javascript` veniva filtrata, la sostituì con `java\nscript` e altri trucchi che i parser dell'epoca non intercettavano.

## La diffusione

```
20 ottobre, ore 13:00 → Worm attivato (0 infetti)
20 ottobre, ore 14:00 → circa 80 infetti
20 ottobre, sera     → migliaia di infetti
21 ottobre, mattina  → 500.000 infetti
21 ottobre, sera     → oltre 1.000.000 infetti
21 ottobre, notte    → MySpace va offline per contenere il worm
```

MySpace dovette disattivare parti del sito per rimuovere il worm e rafforzare i filtri.

## Le conseguenze legali

Nonostante l'assenza di intento malevolo e il fatto che il worm non rubasse dati (aggiungeva solo una frase e un "amico"), le autorità federali aprirono un'indagine. Kamkar si dichiarò colpevole e fu condannato a:
- 3 anni di probation
- 720 ore di lavori socialmente utili
- Divieto di usare computer e Internet senza supervisione per un anno

## L'eredità tecnica

Il Samy Worm fu il punto di svolta che spinse MySpace — e l'intera industria — a prendere sul serio la sicurezza delle applicazioni web. Prima di Samy, XSS era considerato un problema secondario. Dopo, divenne una vulnerabilità critica in ogni framework di sviluppo.

Kamkar, oggi, è un ricercatore di sicurezza rispettato. Ha scoperto vulnerabilità in Airbnb, Google, PayPal, Tesla. Il suo lavoro sul Rolljam (un dispositivo per aprire auto con telecomando) e sul Combo Breaker (clonazione di lucchetti) è ampiamente citato nei circoli della sicurezza.

Il Samy Worm è ancora online come codice commentato su samy.pl/myspace. È diventato un pezzo di storia.
