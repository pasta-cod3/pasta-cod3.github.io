---
layout: post
title: "University of Mississippi Medical Center: ospedale chiuso per 2+ settimane da ransomware"
date: 2026-04-10
cat: news
tags: ["Mississippi", "hospital", "ransomware", "disruption", "patient safety", "operational impact"]
excerpt: "L'Università del Mississippi Medical Center è stato forzato a chiudere tutte le cliniche statewide per più di 2 settimane dopo un attacco ransomware. 7 ospedali, 35 cliniche, e 200+ telehealth sites interrotte."
---

# Mississippi Hospital Ransomware: Complete System Shutdown

## Il fatto

A febbraio 2026, il **University of Mississippi Medical Center** è stato colpito da un attacco ransomware che ha causato:

- 🔐 Chiusura di **tutte le 7 strutture ospedaliere**
- 🏥 Chiusura di **35 cliniche ambulatoriali**
- 📱 Disabilitazione di **200+ siti telehealth**
- ⏱️ Interruzione per **più di 2 settimane**

---

## Impact immediato

**Per i pazienti:**
- Operazioni chirurgiche rinviate o cancellate
- Pazienti cronici senza accesso ai servizi
- Farmaci non disponibili
- Pazienti dirottati ad ospedali out-of-state

**Per lo stato del Mississippi:**
- Sistema sanitario dei rural areas paralizzato
- Emergenze mediche dirottate a ospedali fuori stato (spesso a ore di distanza)
- Pazienti di comunità remote senza accesso a cure specializzate

---

## Timeline

| Fase | Timeline |
|---|---|
| **Rilevamento** | Febbraio 14 |
| **Reazione iniziale** | Feb 14-16 (IT tenta di contenere) |
| **Decisione di shutdown totale** | Febbraio 17 |
| **Inizio recovery** | Febbraio 18 |
| **Riapertura parziale** | Marzo 3 (clinic ambulatoriali) |
| **Riapertura completa** | Marzo 10+ (ospedali) |

**Durata totale:** 2-3 settimane

---

## Recovery process

1. **Isolation dell'infrastruttura**
2. **Identificazione del malware**
3. **Rebuild di server critici** (dalle pulite backups)
4. **Verification dell'integrità dei dati**
5. **Gradual restoration di servizi**

---

## Lezione medica: criticità della uptime

Diversamente da aziende commerciali dove downtime = perdita di profitti, per ospedali downtime = **rischi per la salute umana**.

Pazienti con:
- **Dialisi programmate** — rimandate, rischio renale
- **Chemoterapia** — ritardata, outcome peggiori
- **Monitoraggio cronico** — pazienti diventano untracked

---

## Prevenzione per ospedali

1. **Backup offline immutabili** — ransomware non può crittarli
2. **Air-gapped systems** — sistemi critici disconnessi da network principale
3. **Redundancy** — sistemi duplicati in diverse locazioni
4. **Rapid failover** — possibilità di switchare a backup in minuti, non ore

---

## Conclusione

Mississippi Medical Center dimostra che **ransomware non è solo un problema IT — è un problema di salute pubblica**.

Per ospedali:
- Recovery plan deve prioritizzare **patient safety** non velocità
- Downtime di 1 settimana è accettabile se lo scopo è garantire dati integri
- La scelta di chiudere completamente piuttosto che offrire servizi parziali è **corretta** — evita errori medici dovuti a system outages parziali
