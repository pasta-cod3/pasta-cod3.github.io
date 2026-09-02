---
layout: post
title: "McKesson Data Breach: 284 milioni di record rubati, richiesta di $55 milioni"
date: 2026-08-05
cat: news
tags: ["McKesson", "healthcare", "data breach", "ransomware", "ShinyHunters", "extortion"]
excerpt: "McKesson Corporation, gigante della distribuzione farmaceutica e IT healthcare, ha confermato che attaccanti hanno exfiltrato 284 milioni di record. Il gruppo ShinyHunters rivendica il furto e richiede $55 milioni di riscatto con deadline al 1 settembre."
---

# McKesson Healthcare Breach: 284 Milioni di Record, $55M Extortion Demand

## Il fatto

A agosto 2026, **McKesson Corporation** — uno dei più grandi distributori di farmaci e fornitore di soluzioni IT per il settore healthcare negli USA — ha **confermato pubblicamente** una massiccia violazione di dati.

Gli attaccanti hanno exfiltrato **284 milioni di record** contenenti informazioni sensibili di pazienti, fornitori di healthcare, e dati aziendali critici. Il gruppo di cybercriminali **ShinyHunters** ha rivendicato l'attacco e ha pubblicato un ultimatum: **pagare $55 milioni entro settembre 1**, o i dati saranno pubblicamente leakati.

---

## Timeline dell'attacco

| Data | Evento |
|---|---|
| **25 Agosto** | McKesson scopre incident nel suo sistema informativo |
| **26 Agosto** | Investigazione forense inizia |
| **28 Agosto** | Confirm che dati sono stati exfiltrati |
| **29 Agosto** | ShinyHunters pubblica proof (sample di dati) |
| **31 Agosto** | McKesson conferma pubblicamente il breach |
| **1 Settembre** | Deadline di ShinyHunters per il pagamento |

La **découverte iniziale** è stata rapida (stesso giorno della scoperta), il che suggerisce:
- Attaccanti hanno lasciato "traces" evidenti (attività anomala), oppure
- McKesson ha processi di rilevamento abbastanza buoni da catturare l'esfilazione in tempo reale

---

## Cosa contiene: 284 milioni di record

I dati exfiltrati includono informazioni di:

| Categoria | Tipo di dato |
|---|---|
| **Pazienti** | Nome, DOB, SSN, indirizzo, numero di assicurazione |
| **Fornitori healthcare** | Informazioni di contatto, credenziali, storici di transazione |
| **Dati aziendali** | Contratti, informazioni finanziarie, sorgenti di codice |
| **Sistema interno** | Credenziali di servizio, configurazioni, accessi di amministrazione |

Il numero **284 milioni** è massivo — è come se ogni cittadino USA avesse i propri record healthcare di McKesson exfiltrati (USA ~330 milioni).

---

## Chi è McKesson e perché è bersaglio

McKesson è una delle "Big 3" della distribuzione farmaceutica negli USA (insieme a Cardinal Health e AmerisourceBergen). Serve:

- **Ospedali** (98% degli ospedali USA usano McKesson per supply chain)
- **Farmacie** (distribuzione wholesale di farmaci)
- **Healthcare providers** (soluzioni IT, sistemi di gestione pazienti)

Compromettere McKesson = compromettere l'intera supply chain del healthcare. Non è solo un'azienda, è una **infrastruttura critica**.

---

## ShinyHunters: chi sono

ShinyHunters è un **ransomware-as-a-service (RaaS) affiliate group** noto per:

- Attacchi a **healthcare, finanza, retail**
- Uso di **double extortion** (cifrano i dati e li pubblicano se non paghi)
- Spesso un **front group** per attori state-sponsored (sospetti legami con Russia)
- Storicamente riescono a riscuotere pagamenti in **crypto** senza traccia

ShinyHunters ha una **history di follow-through** — se non paghi, **pubblicano davvero i dati** (a differenza di molti gruppi che minacciano solo).

---

## $55 Milioni: perché questa cifra?

| Stima | Razionale |
|---|---|
| **Healthcare breach settlement (USA)** | Generalmente $1-100 milioni per breach di scala nazionale |
| **Costo reputazionale** | McKesson dovrà investire in customer notification, legal, PR |
| **Regulatory fines** | HIPAA violation può costare fino a $50k per record ($284M × $50k = $14 miliardi potenzialmente) |
| **Richiesta reale** | $55M è "ragionevole" nel contesto di un breach di questo livello |

ShinyHunters probabilmente sa che **pagare $55M è meno costoso per McKesson** che:
- Affrontare i danni reputazionali di una data leak completa
- Pagare le settlement legali dopo il fatto
- Perdere contratti di distribuzione

---

## Impatto su pazienti e healthcare

Per i 284 milioni di persone i cui record sono stati compromessi:

**Rischi immediati:**
- Furto di identità (SSN, DOB, indirizzo)
- Frode medica (qualcuno potrebbe usare i tuoi dati di assicurazione per ottenere cure)
- Targeted phishing ("McKesson notified us your healthcare data was breached, click here to verify...")

**Rischi a lungo termine:**
- La combinazione di SSN + full name + DOB è utilizzabile per decenni
- Accesso a storici medici (informazioni sensibili: condizioni, trattamenti, allergie)

**Per il healthcare system:**
- Interruzione della supply chain (se McKesson deve notificare milioni di utenti, risorse dirottate)
- Loss of trust (pazienti perderanno fiducia nei sistemi healthcare)

---

## Lesson learned: perché McKesson era vulnerabile?

Non sappiamo ancora esattamente come gli attaccanti hanno ottenuto l'accesso iniziale. Possibilità:

1. **Credenziali RDP esposte** — McKesson ha probabile migliaia di dipendenti con accesso RDP
2. **Vulnerabilità zero-day** — exploit su VPN / Firewall
3. **Insider threat** — dipendente compromesso
4. **Phishing** — attacco di social engineering che ha compromesso account privilegiato

Qualunque sia il vettore, la lezione è: **le infrastrutture critiche rimangono vulnerabili all'accesso iniziale** — non importa quanto grande tu sia, il primo step dell'attacco è spesso il più facile.

---

## Conclusione

McKesson è un promemoria che **nessun'organizzazione è "troppo grande per essere hackerata"**. Un gigante della distribuzione farmaceutica con miliardi di dollari di revenue rimane vulnerabile a attacchi che iniziano spesso con phishing o credenziali compromesse.

Per il healthcare system, il danno è duplice:
1. **Dati sensibili di milioni di pazienti** sono esposti
2. **Fiducia nel sistema healthcare** è ulteriormente erodita

Il pagamento di $55 milioni è preferibile alla McKesson, ma il vero costo è pagato dai pazienti il cui privacy è violato permanentemente.
