---
layout: post
title: "Backup e Recovery: la regola 3-2-1 e come costruire una strategia anti-ransomware"
date: 2026-06-19
cat: blue
tags: [backup, recovery, ransomware, 3-2-1, BDR, RTO, RPO, business continuity]
excerpt: "Il backup è l'ultima linea di difesa contro il ransomware. La regola 3-2-1, i backup immutabili, i test di restore e tutto ciò che devi sapere per costruire una strategia di backup che funzioni davvero."
---

Il ransomware cifra i tuoi dati. Se hai un backup offline integro, l'attacco diventa un inconveniente invece di una catastrofe. Se non ce l'hai, stai negoziando il riscatto. La differenza tra le due situazioni è la strategia di backup.

## La regola 3-2-1

La regola d'oro della continuità aziendale:

- **3** copie dei dati (l'originale + 2 backup)
- su **2** tipi di media diversi (es. NAS + tape, o disco + cloud)
- con **1** copia offsite (fuori dalla sede principale)

La versione moderna aggiunge **1-0**: **1** copia immutabile, **0** errori verificati nei test di restore.

## Perché il backup online non basta contro il ransomware

Il ransomware moderno (Conti, LockBit, Black Basta) cifra non solo i file locali, ma cerca attivamente le share di rete e i backup collegati al sistema. Se il backup drive è mappato come `Z:\`, viene cifrato insieme a tutto il resto.

**Soluzioni:**
- **Backup offline** (air-gapped): disco scollegato fisicamente quando non in uso
- **Backup immutabile cloud**: S3 Object Lock, Azure Immutable Storage — i file non possono essere modificati o eliminati per un periodo definito
- **Regola 3-2-1 con offsite**: anche se l'intera sede viene cifrata, il backup offsite è intatto

## RPO e RTO: le metriche del recovery

**RPO (Recovery Point Objective)**: quanto indietro nel tempo puoi tornare? Quanto dati puoi perdere?
- Backup giornaliero → RPO massimo 24h (un giorno di lavoro perso)
- Backup orario → RPO 1h
- Replica sincrona → RPO quasi zero

**RTO (Recovery Time Objective)**: quanto tempo ci vuole per tornare operativi?
- Restore da tape → ore/giorni
- Restore da NAS locale → ore
- Sistema di failover automatico (hot standby) → minuti

La scelta della strategia dipende da quanto vale un'ora di downtime per il business.

## Backup immutabile con Veeam + S3 Object Lock

```bash
# Configurazione S3 bucket con Object Lock (via AWS CLI)
aws s3api create-bucket --bucket backup-immutabile --region eu-west-1
aws s3api put-object-lock-configuration \
  --bucket backup-immutabile \
  --object-lock-configuration '{
    "ObjectLockEnabled": "Enabled",
    "Rule": {
      "DefaultRetention": {
        "Mode": "COMPLIANCE",
        "Days": 30
      }
    }
  }'
# I file in questo bucket non possono essere eliminati per 30 giorni
# nemmeno dall'account root AWS
```

Con Veeam, i backup inviati a questo bucket sono protetti anche se le credenziali AWS vengono compromesse.

## Il test di restore: il vero indicatore

**Un backup non testato non è un backup.** Le statistiche sono impietose: il 30% delle organizzazioni che tentano il restore scopre che il backup è corrotto o incompleto.

Cosa testare:
1. **Test mensile** di restore di singoli file
2. **Test trimestrale** di restore di un intero server in ambiente isolato
3. **Test annuale** di disaster recovery completo: simula la perdita dell'intera infrastruttura e misura il tempo reale di recovery

## Checklist strategia backup

- [ ] Regola 3-2-1 implementata
- [ ] Almeno 1 copia air-gapped o immutabile
- [ ] Backup separato dalla produzione (credenziali diverse, non accessibile da workstation)
- [ ] Cifratura dei backup (specialmente quelli offsite)
- [ ] Test di restore documentato e schedulato
- [ ] RPO e RTO definiti e condivisi con il management
- [ ] Piano di comunicazione per il caso di ransomware (chi chiamare, in quale ordine)
