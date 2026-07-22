---
layout: post
title: "Operation Aurora 2009: quando la Cina hackerò Google e cambiò la cybersecurity"
date: 2026-06-21
cat: storia
tags: [Operation Aurora, Google, Cina, APT, zero-day, spionaggio, Internet Explorer]
excerpt: "Gennaio 2010: Google annuncia pubblicamente di essere stata vittima di un attacco sofisticato proveniente dalla Cina. Operation Aurora cambiò per sempre il modo in cui il mondo capisce la cyberguerra."
---

Il 12 gennaio 2010 Google pubblicò un post sul proprio blog che scosse il mondo tecnologico: l'azienda aveva subito un attacco informatico sofisticato proveniente dalla Cina, mirato ai suoi sistemi e alla posta elettronica di attivisti per i diritti umani. Era Operation Aurora, e avrebbe ridefinito il concetto di cyberwar.

## Il contesto geopolitico

Alla fine del 2009, i rapporti tra Google e il governo cinese erano già tesi. Il motore di ricerca censurava i risultati su google.cn in conformità con le leggi cinesi, ma stava valutando se continuare. Dietro le quinte, i servizi di intelligence cinesi stavano già agendo.

## Come funzionò l'attacco

Gli analisti di McAfee (che denominarono l'operazione "Aurora") e successivamente Mandiant ricostruirono la catena d'attacco:

**1. Spear phishing mirato**  
I dipendenti Google ricevevano messaggi personalizzati — email, messaggi su IRC — con link a siti web malevoli. Il messaggio era calibrato sulla persona: conosceva il nome del destinatario, i suoi interessi, i suoi colleghi.

**2. Zero-day in Internet Explorer (CVE-2010-0249)**  
I link portavano a pagine che sfruttavano una vulnerabilità zero-day nel motore JavaScript di Internet Explorer 6. Visitare la pagina con IE era sufficiente per compromettere il sistema, senza nessun'altra interazione dell'utente. Questo tipo di attacco viene chiamato **drive-by download**.

**3. Movimento laterale e esfiltrazione**  
Una volta dentro la rete, gli attaccanti si mossero lateralmente verso i repository di codice sorgente di Google e, soprattutto, verso un sistema che gestiva i mandati legali emessi dal governo USA alle aziende tech per intercettazioni legali. Era esattamente quello che un'intelligence straniera voleva sapere.

## Chi erano le vittime

Google non era sola. Mandiant identificò oltre 30 aziende colpite: Adobe, Juniper Networks, Rackspace, Yahoo, Symantec, Northrop Grumman, Morgan Stanley. Il pattern era identico: zero-day IE + spear phishing + accesso ai sistemi di IP e ricerca e sviluppo.

## L'attribuzione

Il governo USA attribuì formalmente l'attacco all'**APT1** — Advanced Persistent Threat Group 1 — successivamente identificato come l'Unità 61398 dell'Esercito Popolare di Liberazione cinese, con sede a Shanghai. Il rapport Mandiant del 2013 documentò anni di attività di questo gruppo con prove fotografiche, includendo le finestre degli uffici da cui operavano.

La Cina negò qualsiasi coinvolgimento.

## Le conseguenze

**Per Google**: in risposta all'attacco e alla richiesta cinese di continuare la censura, Google spostò google.cn a Hong Kong, di fatto uscendo dal mercato cinese. Una decisione senza precedenti per un'azienda da miliardi di dollari.

**Per il settore**: Operation Aurora segnò la nascita dell'era degli **APT** nel dibattito pubblico. Prima, le cyberminacce erano viste come criminalità organizzata o script kiddie. Dopo Aurora, era chiaro che gli stati-nazione conducevano operazioni di cyberespionaggio sistematiche contro il settore privato.

**Per Microsoft**: la divulgazione della vulnerabilità di Internet Explorer portò a una patch d'emergenza. Il governo tedesco e quello francese consigliarono pubblicamente ai cittadini di non usare IE finché non fosse stata rilasciata.

**Per la diplomazia**: fu il primo caso in cui un'azienda privata accusò pubblicamente un governo straniero di averla attaccata. Aprì un decennio di tensioni diplomatiche sul tema del cyberspionaggio statale.

## L'eredità

Operation Aurora è il punto di origine di molti sviluppi che oggi diamo per scontati:
- Il termine **APT** è entrato nel vocabolario della sicurezza informatica
- Il concetto di **threat intelligence** e di attribuzione degli attacchi agli stati
- Il movimento Bring Your Own Device e la sicurezza degli endpoint aziendali
- Il primo utilizzo mainstream della term "cyberwar" nelle discussioni politiche
