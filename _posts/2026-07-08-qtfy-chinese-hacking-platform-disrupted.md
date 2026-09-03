---
layout: post
title: "US disrupts QTFY: Chinese hacking platform used against military and critical infrastructure"
date: 2026-07-08
cat: news
tags: ["China", "QTFY", "hacking platform", "military", "critical infrastructure", "APT"]
excerpt: "Il governo USA ha disabilitato QTFY, una piattaforma di hacking cinese utilizzata dal governo cinese per attaccare infrastruttura militare e critica degli USA dal 2018. La piattaforma offrira servizi di hacking a clienti state-sponsored."
---

# US Disrupts QTFY: Chinese Hacking Platform

## L'operazione

A luglio 2026, il **Department of Justice (DOJ)** e **CISA** hanno annunciato il **sequestro e disabilitazione di QTFY**, una piattaforma di hacking utilizzata dal governo cinese per:

- 🎯 Attaccare **infrastruttura militare USA**
- 🏭 Compromettere **critical infrastructure** (energia, acqua, trasporti)
- 💻 Rubare **intellectual property** da aziende private

---

## QTFY: cos'era

**QTFY** era un **hacking-as-a-service platform** operato da entità cinese (sospettate: MSS, PLA Cyber) che:

- Offriva **scanning automatizzato** di reti USA
- Forniva **exploit database** con zero-day vulnerabilities
- Consentiva **automated attacks** contro target specifici
- Operava dal **2018** senza interruzione fino al 2026

**Clienti:** Apparentemente qualunque agenzia cinese che pagasse per i servizi.

---

## Metodo di funzionamento

```
Agenzia cinese
    ↓ (paga per servizio)
QTFY platform
    ↓ (riceve target: "attacca questo IP")
Automated scanning + exploitation
    ↓ (accesso ottenuto)
Reverse tunnel verso infrastruttura C2 cinese
    ↓
Agenzia cinese ottiene accesso al network target
```

---

## Target e impact

**Militare:**
- Departimento della Difesa (DoD) network
- Contractor aerospaziale / difesa

**Critical infrastructure:**
- Electrical grid operators
- Water/Wastewater treatment
- Transportation systems
- Petroleum/Natural gas

---

## Come è stata scoperta

L'indagine ha coinvolto:
1. Tracciamento di indirizzi IP C2 (command & control)
2. Analisi di traffic verso i C2
3. Infiltration dei log di QTFY tramite cooperazione internazionale
4. Identificazione di vittime
5. Coordinamento internazionale per il sequestro

---

## Risposta legale

- 🔒 Sequestro del dominio QTFY
- ⚖️ Indictment di operatori (in absentia)
- 💰 Sanzioni economiche contro entità cinese associate
- 🤝 Avviso a paesi alleati

---

## Significato geopolitico

QTFY era un **government-sponsored hacking platform**, il che significa:

1. **Attribution certa**: il governo USA ha prove che il governo cinese era dietro
2. **Escalation di tensione**: cyberwarfare state-sponsored non è nuovi, ma il sequestro è un atto di **active defense** inusuale
3. **Precedente**: altri governi potrebbero seguire simili disabilitazioni

---

## Lezione

Mentre QTFY è stata disabilitata, il suo modus operandi (scanning automatico + exploitation + C2 tunnel) rimane il **modello standard** per cyberattacchi state-sponsored.

La disabilitazione è una **vittoria tattica** (il platform non opera più), ma **non è una vittoria strategica** (il governo cinese ha altre piattaforme di hacking, e probabilmente sta costruendo QTFY v2).
