---
layout: post
title: "Manchester Airports Group: dati di 9 milioni di passeggeri compromessi"
date: 2026-03-20
cat: news
tags: ["data breach", "Manchester Airports", "UK", "personali data", "travel", "ransomware"]
excerpt: "Manchester Airports Group, che gestisce gli aeroporti di Manchester, Stansted e East Midlands nel Regno Unito, ha confermato il furto di dati personali di milioni di passeggeri in un attacco ransomware. I dettagli includono nomi, indirizzi, numeri di documenti e dati di pagamento."
---

# Manchester Airports Group: 9 milioni di passeggeri esposti in data breach

## Il fatto

A marzo 2026, **Manchester Airports Group (MAG)**: l'operatore dei tre aeroporti principali del Regno Unito (Manchester, Stansted, e East Midlands), ha confermato pubblicamente un **data breach massivo** che ha esposto informazioni personali di **9 milioni di passeggeri**.

L'attacco è stato perpetrato tramite **ransomware**, ma (in vero stile degli attacchi moderni), gli attaccanti hanno **esfiltrato i dati prima della cifratura** e li stanno usando come leva per estorsione.

I dati rubati includono nomi, indirizzi, date di nascita, numeri di passaporti, numeri di patenti, e in alcuni casi **dati di carte di credito**: un mix esplosivo di identificatori che rende i passeggeri estremamente vulnerabili a furto di identità, frode, e targeted phishing.

---

## Timeline dell'attacco

L'investigazione di MAG e degli esperti forensi ha ricostruito la seguente timeline:

| Fase | Quando | Cosa è successo |
|---|---|---|
| **Accesso iniziale** | Gennaio 2026 | Attaccanti ottengono accesso tramite credenziali RDP esposte o vulnerabilità su VPN aziendale |
| **Ricognizione** | Gennaio-Febbraio | Mapping della rete interna, enumerazione di Active Directory, ricerca di server di backup |
| **Escalation** | Febbraio | Movimento laterale verso server di database e file storage |
| **Esfiltrazione** | Febbraio-Inizio Marzo | Copia di 9 GB di dati personali verso infrastruttura controllata dagli attaccanti |
| **Cifratura** | Marzo 2 | Ransomware distribuito su decine di sistemi |
| **Scoperta e Disclosure** | Marzo 15 | MAG scopre l'attacco, notifica autorità (ICO, Information Commissioner's Office) e comunica pubblicamente |

La **finestra di dwell time** (il tempo tra accesso iniziale e cifratura), è stata circa 6-8 settimane. Questa è la "finestra dorata" in cui difese come EDR, segmentazione di rete, e anomaly detection avrebbero potuto intercettare l'attacco.

---

## Conseguenze per i passeggeri

Per i 9 milioni di passeggeri esposti, il rischio è immediato e duraturo:

**Furto di identità**: combinando nome, data di nascita, indirizzo, e numero di passaporto, un attore malevolo può:
- Richiedere crediti / prestiti personali a nome della vittima
- Aprire conti bancari o carte di credito
- Fare domande di sussidio governativo
- Commettere frodi fiscali

**Frode di viaggio**: conoscendo il numero di passaporto, è possibile tentare di prenotare voli o effettuare booking di hotel fraudolenti.

**Phishing mirato**: gli attaccanti sanno che la vittima è un passeggero frequente, un'email che dice "Problema rilevato sul tuo volo Manchester-Londra, clicca qui per risolvere" ha un tasso di successo molto più alto.

---

## Il problema sistemico dell'UK aviation

Questo incidente evidenzia problemi strutturali nel settore dell'aviazione civile britannica:

**Sistemi legacy**: molti sistemi di gestione aeroportuale sono stati costruiti 15-20 anni fa e non sono mai stati modernizzati con adeguate protezioni di sicurezza, backup immutabili offline, segmentazione di rete, MFA. L'upgrade avviene lentamente perché interruzioni = caos operazionale.

**Budget limitato**: la sicurezza informatica compete con investimenti in infrastrutture fisiche, e le infrastrutture fisiche generano profitti visibili.

**Supply chain exposure**: gli aeroporti dipendono da dozzine di fornitori (sistemi di biglietteria, check-in, bagagli, etc.), ognuno di questi è un potenziale punto di ingresso.

---

## La risposta normativa

Nel Regno Unito, breach come questo cadono sotto il **Data Protection Act 2018** e il **GDPR**. L'ICO (Information Commissioner's Office) ha il potere di comminare multa fino al **€20 milioni o 4% del turnover globale annuale**: per MAG, potenzialmente centinaio di milioni di sterline.

Tuttavia, anche con le regolamentazioni, la punizione arriva **dopo** il danno, i dati sono già rubati, le vittime sono già vulnerabili.

---

## Conclusione

Manchester Airports è un reminder che le organizzazioni critiche (aeroporti, ospedali, centrali elettriche), rimangono bersagli primari di attacchi ransomware moderni non perché più vulnerabili dal punto di vista tecnico, ma perché hanno:

1. Accesso a dati ad altissimo valore (identificatori, dati di viaggio)
2. Pressione operazionale a pagare (l'aeroporto non può stare fermo per settimane)
3. Budget limitato per la sicurezza (competono con investimenti legacy)

La difesa non è nel pagare quando arriva il ransomware, è intercettare gli attaccanti mentre sono ancora in fase di ricognizione e movimento laterale, nella finestra di 6-8 settimane. Quelle settimane non dovrebbero essere silenziose.
