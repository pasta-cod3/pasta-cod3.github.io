---
layout: post
title: "2,2 milioni di alert: le credenziali italiane sul dark web nel 2025"
date: 2025-11-20
cat: blue
tags: [dark-web, credential-leak, CRIF, data-breach, password, OSINT]
excerpt: "L'Osservatorio Cyber CRIF 2025 ha registrato oltre 2,2 milioni di alert su dati italiani esposti nel dark web, con una crescita del 22% nella gravità media. Cosa significano questi dati per te."
---

Mentre le aziende si preoccupano degli attacchi diretti alle loro reti, c'è un mercato parallelo che prospera silenziosamente: il commercio di credenziali rubate nel dark web. Nel 2025, i dati degli italiani sono merce molto richiesta.

## I dati CRIF

L'**Osservatorio Cyber di CRIF** ha registrato nel 2025:

- **2,2 milioni di alert** su esposizione di dati italiani (+5,8% rispetto al 2024)
- **+22% nella gravità media** degli alert — non solo più quantità, ma qualità più alta
- Crescita di dataset che associano email a password, username e riferimenti precisi agli account

Il dato sulla gravità è quello che preoccupa di più: un leak di sole email è fastidioso. Un leak che associa email, password, username, data di nascita e numero di telefono è uno strumento di identità digitale completa, pronto per il credential stuffing.

## Come i dati finiscono nel dark web

**Data breach di servizi** — quando un servizio online viene compromesso, il database finisce in vendita. Molte credenziali in circolazione oggi vengono da breach di anni fa: chi non ha cambiato password dopo un leak del 2020 è ancora vulnerabile.

**Infostealer malware** — malware come RedLine, Raccoon e Lumma estraggono silenziosamente credenziali salvate nel browser, token di sessione e cookie. Il dispositivo sembra funzionare normalmente mentre le credenziali vengono vendute nel giro di ore.

**Credential stuffing lists** — combinazioni email/password testate automaticamente contro centinaia di servizi. Se usi la stessa password su più siti, basta che uno venga compromesso per esporre tutti gli altri.

> **Come controllare**: [HaveIBeenPwned](https://haveibeenpwned.com) permette di verificare gratuitamente se la tua email è comparsa in breach noti.

## Dal leak all'account compromesso

Con una lista di credenziali, un attaccante esegue **credential stuffing**: testa automaticamente ogni coppia su decine di servizi popolari. La velocità è limitata solo dai rate limit dei servizi bersaglio.

## Difesa pratica

1. **Password uniche per ogni servizio** — un password manager risolve il problema alla radice
2. **MFA ovunque disponibile** — anche con le credenziali corrette, l'attaccante non entra senza il secondo fattore
3. **Monitoraggio breach** — HaveIBeenPwned, Firefox Monitor, o servizi aziendali dedicati
4. **Attenzione agli infostealer** — non scaricare software da fonti non attendibili, zero crack/keygen
5. **Cambio password post-breach** — quando un servizio notifica un breach, cambia la password lì *e* su tutti i servizi dove usavi la stessa
