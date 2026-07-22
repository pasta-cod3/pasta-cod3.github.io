---
layout: post
title: "Zero Trust: l'architettura di sicurezza che non si fida di nessuno"
date: 2026-06-11
cat: blue
tags: [Zero Trust, architettura sicurezza, identity, microsegmentazione, BeyondCorp]
excerpt: "Il modello Zero Trust ribalta il paradigma tradizionale: non esiste più una rete 'interna' sicura. Ogni accesso va verificato, ogni identità autenticata, ogni segmento isolato."
---

Il vecchio modello di sicurezza era basato sul perimetro: dentro la rete aziendale sei fidato, fuori no. Zero Trust lo ribalta completamente: **non fidarsi mai, verificare sempre** — indipendentemente da dove si trova l'utente o il dispositivo.

## Perché il modello perimetrale è fallito

- Il **cloud** ha spostato le risorse fuori dalla rete aziendale
- Il **remote work** ha spostato gli utenti fuori dall'ufficio
- I **breach interni** dimostrano che un attaccante già dentro la rete può muoversi liberamente
- Le **supply chain attack** compromettono fornitori fidati usati come trampolino

Quando un attaccante compromette un endpoint interno, il modello perimetrale non ha più nulla da opporre. Zero Trust assume che la rete sia già compromessa.

## I tre principi fondamentali

**1. Verifica esplicita** — autentica e autorizza sempre, basandoti su tutti i dati disponibili: identità, posizione, dispositivo, servizio, data/ora.

**2. Least Privilege** — ogni utente e servizio ha solo i permessi minimi necessari, per il tempo minimo necessario (Just-In-Time access).

**3. Assume Breach** — progetta come se la rete fosse già compromessa. Minimizza il raggio di esplosione con microsegmentazione e visibilità end-to-end.

## I pilastri architetturali

```
Identità → [Identity Provider / MFA] → Policy Engine → Accesso
Dispositivo → [Device Compliance Check] →     ↕
Rete → [Microsegmentazione] ──────────→ [Risorsa Protetta]
Applicazione → [App proxy / mTLS] →
Dati → [DLP / Classificazione] →
```

**Identity Provider (IdP)**: Azure AD, Okta, Google Workspace — ogni accesso parte dall'autenticazione forte (MFA, FIDO2).

**Policy Engine**: decide "questo utente, con questo dispositivo, in questo contesto, può accedere a questa risorsa?" Considera rischio in tempo reale.

**Microsegmentazione**: ogni workload è isolato. Un attaccante che compromette un server non può muoversi lateralmente su altri server senza passare per il policy engine.

## Zero Trust in pratica: BeyondCorp

Google ha implementato Zero Trust internamente dal 2011 con **BeyondCorp**: nessuna VPN, nessuna rete "fidata". Ogni dipendente accede alle applicazioni interne tramite un access proxy, e l'accesso dipende dall'identità + dal security posture del dispositivo.

Il risultato: un dipendente che lavora da un bar ha lo stesso livello di sicurezza di chi è in ufficio.

## Implementazione progressiva

Zero Trust non si implementa da un giorno all'altro. La roadmap tipica:

1. **Inventario**: cataloga tutti gli utenti, dispositivi, applicazioni e dati
2. **MFA universale**: implementa MFA su tutti gli accessi
3. **Segmentazione di rete**: inizia a separare i segmenti critici
4. **Visibilità**: log centralizzati, SIEM, rilevamento anomalie
5. **Least privilege**: revisione e riduzione dei permessi
6. **Automazione**: risposta automatica agli alert di rischio

## Standard di riferimento

- **NIST SP 800-207**: la guida ufficiale NIST su Zero Trust
- **CISA Zero Trust Maturity Model**: livelli da Tradizionale ad Ottimale
- **Microsoft Zero Trust Deployment Center**: guide pratiche per ambienti Azure AD
