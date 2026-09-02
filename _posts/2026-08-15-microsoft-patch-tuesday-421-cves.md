---
layout: post
title: "Microsoft Patch Tuesday Agosto 2026: 421 CVE, 1 zero-day exploited in the wild"
date: 2026-08-15
cat: blue
tags: ["Microsoft", "Patch Tuesday", "CVE-2026-68820", "zero-day", "kernel", "Windows"]
excerpt: "Microsoft ha rilasciato patch per 421 vulnerabilità a agosto 2026, incluso un zero-day su afd.sys (CVE-2026-68820) già sotto attacco attivo. La falla consente escalazione ai privilegi SYSTEM e affligge Windows in modo critico."
---

# Microsoft Patch Tuesday Agosto 2026: 421 CVE con zero-day sfruttato

## Il rilascio

A agosto 2026, **Microsoft ha annunciato un Patch Tuesday massiccio**: patch per **421 vulnerabilità totali**, il secondo mese consecutivo con più di 400 CVE in un singolo rilascio.

Più preoccupante: **almeno uno** di questi CVE — **CVE-2026-68820** — è **già sotto attacco attivo** prima che gli utenti avessero tempo di patchare.

---

## CVE-2026-68820: Use-After-Free in afd.sys

**Descrizione tecnica:**
La vulnerabilità è un difetto use-after-free nel driver kernel `afd.sys` (Auxiliary Function Driver for Windows Sockets). L'afd.sys è un componente critico che gestisce la comunicazione di rete a basso livello per le socket.

**Come funziona:**
Un attaccante autenticato localmente (o che ha ottenuto accesso tramite phishing, RDP compromesso, etc.) può:
1. Creare un'applicazione appositamente costruita
2. Attivare una race condition nel driver afd.sys
3. Sfruttare il difetto use-after-free per leggere/scrivere memoria kernel
4. Elevare i privilegi da utente normale a SYSTEM

**Impatto critico:**
Con privilegi SYSTEM, l'attaccante ha:
- Accesso completo al sistema operativo
- Capacità di disabilitare antivirus / EDR
- Accesso ai segreti archiviati nel sistema
- Movimento laterale possibile verso la rete aziendale

---

## Contesto: afd.sys è stata bersaglio ricorrente

Quello che rende CVE-2026-68820 particolarmente preoccupante è il pattern:

| CVE | Data | Tipo | Utilizzato da |
|---|---|---|---|
| CVE-2021-1732 | Marzo 2021 | Use-after-free in afd.sys | APT28 (Fancy Bear) |
| CVE-2022-21224 | Febbraio 2022 | Buffer overflow in afd.sys | State-sponsored APT |
| CVE-2024-36936 | Luglio 2024 | EoP in afd.sys | FIN7 |
| **CVE-2026-68820** | **Agosto 2026** | **Use-after-free in afd.sys** | **Unknown APT** |

**Tre** zero-day su afd.sys sono stati identificati e sfruttati dal 2022. Questo **quarto difetto** sulla stesso componente suggerisce che:

1. Il driver è stato scritto con vulnerabilità strutturali
2. Gli attaccanti lo sanno e continuano a cercarlo
3. Microsoft ha difficoltà a risolvere completamente il problema root

---

## Distribuzione dei 421 CVE

Oltre a CVE-2026-68820, Microsoft ha patchato:

- **236 CVE in Windows** (core OS)
- **98 CVE in Office** (legacy + modern versions)
- **30 CVE in SharePoint Server**
- **26 CVE in Developer Tools**
- **17 CVE in Azure**
- **7 CVE in Exchange Server**
- **1 CVE in Defender**
- **6 CVE in altri prodotti**

Oltre 40 di questi CVE sono stati classificati come "Criticità elevata" o "Critica".

---

## Timeline di sfruttamento

| Data | Evento |
|---|---|
| **Agosto 8** | Microsoft identifica CVE-2026-68820 in active exploitation |
| **Agosto 13** | Microsoft annuncia il CVE nel security advisory |
| **Agosto 13** | Patch rilasciato su Windows Update |
| **Agosto 14-15** | Primi rapporti di organizzazioni che aggiungono il CVE alla priorità di patching |
| **Agosto 20+** | Continuo sfruttamento di sistemi non patchati |

La **finestra di esposizione** è stata almeno 5-7 giorni. Per organizzazioni con processi di patch lenti (settimane), la finestra è molto più lunga.

---

## Cosa fare

**Immediato (ore):**
1. **Scansiona vulnerabilità**: usa Microsoft Vulnerability Assessment per identificare sistemi con afd.sys vulnerabile
2. **Priortizza patch**: CVE-2026-68820 deve essere prima nella lista
3. **Monitora i log**: controlla i log di sicurezza per attività anomale post-compromise (creazione account, escalazione privilegi)

**Breve termine (giorni):**
1. **Applica la patch** su tutti i sistemi Windows
2. **Reboot**: la patch richiede reboot per la validazione completa
3. **Verifica**: dopo il patch, riconfirma che afd.sys è stato aggiornato

**Lungo termine:**
1. **Ridurre privilegi di utente** — utenti normali non dovrebbero poter accedere a risorse kernel-level
2. **Applicare Kernel Patch Protection (KPP)** — mitiga alcuni difetti use-after-free
3. **EDR sensitivity**: configura EDR per catturare anomalie di accesso kernel da processi user-mode

---

## Conclusione

421 CVE in un singolo mese sono indicatore di una realtà sgradevole: la complessità di Windows, specialmente driver legacy come afd.sys, continua a generare difetti. Il fatto che CVE-2026-68820 sia già sotto attacco prima che gli utenti lo sapessero è un reminder che **patch Tuesday non significa sicurezza immediata** — significa iniziare una corsa contro il tempo per patchare prima che gli attaccanti li raggiungano.
