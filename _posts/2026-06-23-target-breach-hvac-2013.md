---
layout: post
title: "Target Breach 2013: 40 milioni di carte di credito rubate tramite un fornitore di HVAC"
date: 2026-06-23
cat: storia
tags: [Target, breach 2013, supply chain, HVAC, POS, Fazio Mechanical, credenziali rubate]
excerpt: "Novembre 2013: 40 milioni di carte di credito rubate da Target nei giorni del Black Friday. Il vettore d'attacco: le credenziali di rete di un fornitore di impianti di climatizzazione. Il caso che ha ridefinito la sicurezza della supply chain."
---

Novembre 2013, Black Friday. Milioni di americani fanno shopping da Target, la seconda catena di grande distribuzione degli USA. Nel frattempo, in silenzio, 40 milioni di numeri di carta di credito vengono esfiltrati dai sistemi del retailer. È quello che diventerà noto semplicemente come "the Target breach" — uno dei più grandi data breach della storia e, soprattutto, un caso studio definitivo sulla sicurezza della supply chain.

## Il vettore iniziale: un fornitore di HVAC

La parte più sorprendente del breach non fu la sofisticazione tecnica dell'attacco — ma il punto d'ingresso. Gli attaccanti non compromisero Target direttamente. Compromisero **Fazio Mechanical Services**, una piccola azienda di Sharpsburg, Pennsylvania, fornitrice di impianti di climatizzazione e refrigerazione per i negozi Target.

Come? Con una campagna di phishing mirata. Una email malevola inviata a un dipendente di Fazio conteneva un Trojan noto come **Citadel**, una variante di Zeus (malware per il furto di credenziali bancarie). Le credenziali rubate includevano quelle per il portale fornitori di Target.

Target aveva fornito a Fazio accesso di rete per il monitoraggio remoto dei sistemi di climatizzazione. Un accesso che avrebbe dovuto essere rigidamente isolato dai sistemi di pagamento. Non lo era.

## Movimento laterale e installazione del malware POS

Con le credenziali di Fazio, gli attaccanti entrarono nella rete Target nel 15 novembre 2013. Una volta dentro, sfruttarono una segmentazione di rete insufficiente per muoversi lateralmente verso i sistemi POS (Point of Sale) — i terminali di pagamento nei negozi.

Installarono un malware POS custom chiamato **BlackPOS** (o "Kaptoxa") su migliaia di terminali in 1800 negozi. BlackPOS catturava i dati delle carte di credito dalla memoria RAM del terminale nel momento in cui venivano lette — una tecnica chiamata **RAM scraping** o **memory scraping** — prima che i dati venissero cifrati per la trasmissione.

## L'esfiltrazione

Dal 27 novembre al 15 dicembre 2013, i dati di 40 milioni di carte di credito e debito furono esfiltrati attraverso la rete interna di Target verso server staging negli USA, poi verso server in Russia. In parallelo, furono rubati anche dati personali (nome, email, telefono, indirizzo) di altri 70 milioni di clienti.

FireEye, il sistema di sicurezza che Target aveva acquistato mesi prima, rilevò il malware e generò alert. Gli alert furono ignorati. Target aveva personale a Bangalore che monitorava i sistemi 24/7 — ma non c'erano procedure chiare per l'escalation degli alert di questa tipologia.

## Le conseguenze

- **Target**: 18 milioni di dollari di risarcimento agli stati USA, 10 milioni ai consumatori, 67 milioni a Visa, 19 milioni a MasterCard, costi totali stimati oltre 200 milioni di dollari. Il CEO e il CIO si dimisero.
- **Fazio Mechanical**: nessuna conseguenza legale diretta, ma la piccola azienda fu nell'occhio del ciclone mediatico.
- **Settore retail**: spinta massiva verso l'adozione di chip EMV (le carte con il chip), che rendono molto più difficile il RAM scraping.
- **Supply chain security**: il caso rese obbligatorio per ogni CTO chiedersi "quali accessi ho fornito ai miei fornitori, e sono opportunamente isolati?"

## Le lezioni apprese

1. **Segmentazione di rete**: un fornitore HVAC non deve mai poter raggiungere i POS. Mai.
2. **Vendor risk management**: valuta la sicurezza dei tuoi fornitori tanto quanto valuti la tua.
3. **Alert response**: avere un sistema di sicurezza non basta — ci vogliono procedure e personale per rispondere agli alert.
4. **Privilegio minimo**: le credenziali dei fornitori devono dare accesso solo a ciò di cui hanno strettamente bisogno.

Il breach di Target fu il momento in cui "supply chain attack" smise di essere un termine tecnico di nicchia e diventò una preoccupazione dei board aziendali.
