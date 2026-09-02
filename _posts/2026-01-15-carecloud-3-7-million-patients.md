---
layout: post
title: "CareCloud Healthcare Breach: 3.7 milioni di pazienti esposti"
date: 2026-01-15
cat: news
tags: ["CareCloud", "healthcare", "data breach", "patient data", "AWS", "unauthorized access"]
excerpt: "CareCloud, fornitore di soluzioni IT per healthcare, ha confermato una violazione di dati che ha compromesso 3.7 milioni di cartelle cliniche di pazienti. Un'entità non autorizzata ha ottenuto accesso all'ambiente AWS dell'azienda."
---

# CareCloud Breach: 3.7 Million Patients Affected

## Il fatto

A gennaio 2026, **CareCloud** — una healthcare IT company che fornisce soluzioni di gestione clinica e amministrativa — ha **confermato una violazione massiccia di dati**.

Un attaccante ha ottenuto accesso non autorizzato all'ambiente AWS dell'azienda e ha exfiltrato i dati di **3.7 milioni di pazienti**.

---

## Timeline

| Data | Evento |
|---|---|
| **10 Marzo 2026** | Attaccante ottiene accesso all'AWS di CareCloud |
| **11-16 Marzo** | Attaccante copia dati da database |
| **17 Marzo** | CareCloud notifica AWS; AWS disabilita credenziali |
| **18 Marzo** | Investigazione avviata |
| **15 Gennaio 2026** | CareCloud notifica pubblicamente i pazienti |

(Nota: Il rilascio pubblico è avvenuto con ritardo di mesi — procedura standard di HIPAA compliance notification)

---

## Dati compromessi

- 👤 Nome completo
- 📅 Data di nascita
- 🏥 Numero cartella clinica
- 💊 Storici medici e diagnosi
- 💊 Medicinali prescritti
- 🏥 Informazioni di strutture visitate

---

## Come è successo

**Fase 1: Misconfiguration AWS**
CareCloud ha configurato un bucket S3 (storage cloud) in modo che fosse **pubblicamente accessibile** — con pochi click, chiunque poteva leggere i file.

Alternativamente, credenziali AWS furono compromesse (trovate su GitHub, acquistate da broker di accesso iniziale).

**Fase 2: Accesso**
L'attaccante ha avuto accesso ai database di pazienti

**Fase 3: Exfiltrazione**
Copia di 3.7 milioni di record

**Fase 4: Scoperta**
CareCloud nota attività anomala nel billing AWS (data transfer massivo) e notifica

---

## Impatto

**Per i pazienti:**
- Rischio di furto di identità (SSN + DOB)
- Rischio di phishing mirato ("Your CareCloud medical records were exposed, click here to freeze your credit")
- Accesso storico medico (info sensibile disponibile ai criminali)

**Per CareCloud:**
- Notifiche mediche a 3.7 milioni di pazienti (costi massivi)
- Potenziali settlement legali (HIPAA breach = up to $1.5M per violation)
- Danno reputazionale

---

## HIPAA violation

CareCloud è soggetta a **HIPAA (Health Insurance Portability and Accountability Act)**, che richiede:

- 🔒 **Encryption** di dati sensibili
- 🔐 **Access controls** adeguati
- 📝 **Audit logging** di chi accede ai dati
- 📢 **Notification** di breach entro 60 giorni

CareCloud ha violato almeno il requisito di encryption (il bucket era accessibile in chiaro).

---

## Prevenzione

Per healthcare IT companies:

1. **AWS security best practices:**
   - Disabilitare public access per S3 bucket per default
   - Usare encryption at-rest
   - Implementare bucket policies restrittive

2. **Access control:**
   - IAM roles con least privilege
   - MFA su account AWS
   - Credential rotation periodica

3. **Monitoring:**
   - CloudTrail logging di tutti gli accessi
   - Alert su volumetti di data transfer anomali
   - Regular security audits

---

## Conclusione

CareCloud è un caso classico di **misconfiguration cloud** — non è una sofisticata vulnerabilità zero-day, è una semplice configurazione sbagliata che espone milioni di record.

La lezione: **cloud security non è automatico** — provider cloud (AWS) fornisce gli strumenti (encryption, access control), ma è responsabilità dell'organizzazione implementarli correttamente.
