---
layout: post
title: "Gunra Ransomware: MFA bypass, critical infrastructure, basato su codice Conti"
date: 2026-06-10
cat: news
tags: ["Gunra", "ransomware", "critical infrastructure", "MFA bypass", "Fortinet", "RaaS"]
excerpt: "Gunra è un nuovo ransomware gang che ha colpito infrastrutture critiche (healthcare, finanza, energia, manufacturing) con sofisticati MFA bypass e sfruttamento di vulnerabilità Fortinet. Il codice è basato su leaked Conti ransomware."
---

# Gunra Ransomware: Critical Infrastructure Under Siege

## Chi è Gunra

A giugno 2026, **US e South Korea** hanno emesso un joint alert su **Gunra**, un nuovo ransomware gang emerso in primavera 2025 che ha progressivamente escalato le operazioni durante il 2026.

Caratteristiche:
- **Codice base:** Basato sul leaked Conti ransomware (conosciuto per sofisticazione)
- **Modello RaaS:** Offre il ransomware "as a service" a affiliati
- **MFA bypass:** Possiede tecniche specifiche per bypassare autenticazione multi-fattore
- **Target:** Critical infrastructure (governo, healthcare, finanza, energia, manufacturing, transportation)

---

## Metodo di attacco

1. **Accesso iniziale** — sfruttamento di vulnerabilità Fortinet (firewall) o credenziali compromesse
2. **MFA bypass** — tecniche non divulgate per bypassare 2FA/MFA
3. **Movimento laterale** — verso sistemi critici
4. **Esfiltrazione** — copia di dati sensibili
5. **Cifratura** — ransomware distribuito su larga scala
6. **Estorsione** — doppia minaccia (cifri + data leak)

---

## MFA Bypass: il vero punto di forza

Il report governativo non specifica esattamente come Gunra bypassa MFA, ma possibili tecniche includono:

- **Reverse proxy** — intercetta il flusso di autenticazione
- **SIM swapping** — per OTP SMS-based
- **Compromissione del provider MFA** — accesso agli account del provider (Okta, Duo, etc.)
- **Phishing di token** — convincere l'utente a condividere il token 2FA attivo

Il fatto che **possiede un metodo efficace e replicabile di MFA bypass** è preoccupante, perché MFA è l'ultima linea di difesa post-compromissione iniziale.

---

## Fortinet vulnerability exploitation

Gunra sfrutta attivamente:
- Vulnerabilità in FortiGate firewall
- Vulnerabilità in Fortinet VPN concentrators
- Configuration mistakes nei deployment Fortinet

Questo ha senso: Fortinet è uno dei firewall più diffusi in critical infrastructure, quindi il ROI di sfruttamento è massimo.

---

## Settori colpiti

| Settore | Impatto |
|---|---|
| **Healthcare** | Disruption di servizi, rischio di vite umane |
| **Finanza** | Accesso a conti, transferimenti fraudolenti |
| **Energia** | Potenziale blackout se SCADA compromesso |
| **Governo** | Accesso a sistemi sensibili |
| **Manufacturing** | Disruption produttivo, furto di IP |

---

## Risposta governativa

US e South Korea hanno:
1. Pubblicato indicators of compromise (IoCs)
2. Notificato critical infrastructure operators
3. Offerto technical support per remediation
4. Minacciato sanzioni contro stati che harboring Gunra

---

## Conclusione

Gunra è una evoluzione di Conti — piattaforma RaaS sofisticata con MFA bypass e targeting di critical infrastructure.

La minaccia non è solo tecnica, è **geopolitica**: se Gunra ha sponsor statale (sospettato: Russia/Korea del Nord), gli attacchi potrebbero escalare da financial ransom a disruption puro durante tensions geopolitiche.
