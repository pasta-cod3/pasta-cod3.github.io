---
layout: post
title: "Silent Ransom (UNC3753): attacco a law firms, da compromissione a estorsione in meno di 1 ora"
date: 2026-05-05
cat: news
tags: ["Silent Ransom", "UNC3753", "law firms", "voice phishing", "extortion", "speed"]
excerpt: "Google Mandiant ha scoperto che UNC3753 (Silent Ransom) compromette law firms tramite voice phishing, e in alcuni casi progredisce da accesso iniziale a estorsione in meno di 60 minuti. Nel 2026 il gruppo ha dimostrato velocità di attacco senza precedenti."
---

# Silent Ransom (UNC3753): Compromissione in meno di 1 ora

## La scoperta

A maggio 2026, **Google Mandiant** ha pubblicato un report su **UNC3753**, il gruppo dietro la campagna **Silent Ransom**. Il report rivela una tattica inusuale: attacchi **estremamente veloci**.

Mentre la maggior parte degli attacchi ransomware impiega giorni o settimane (reconnaissance, escalation, esfiltrazione, cifratura), UNC3753 ha dimostrato capacità di:

- **Compromissione iniziale** tramite voice phishing
- **Movimento laterale** verso sistemi critici
- **Esfiltrazione di dati** sensibili
- **Estorsione** (richiedere riscatto)

Il tutto **in meno di 60 minuti** in alcuni casi recenti.

---

## Metodo di attacco: Voice Phishing

Invece di email phishing tradizionale, UNC3753 usa **voice phishing** (social engineering telefonico):

1. Attaccante chiama il numero principale della law firm
2. Si spaccia per "IT support" o "data migration service"
3. Chiede di "eseguire screen sharing" tramite software legittimo (TeamViewer, AnyDesk)
4. Conviene la vittima a scaricare lo strumento
5. Una volta accesso al desktop, procede con movimento laterale / malware download

**Perché è efficace:**
- Le persone sono meno diffidenti al telefono che via email
- Lo screen sharing crea senso di "interazione legittima"
- Lo strumento di remote access è legittimo, quindi non viene bloccato dagli antivirus

---

## La velocità dell'attacco

**Giugno 2026 incident (esempio reale):**

```
14:22 - Voice phishing call, TeamViewer installato
14:35 - Movimento laterale verso file server
14:42 - Backup identificato e cancellato
14:58 - Primo file cifrato
15:05 - Estorsione: "Pagare $2M o i dati saranno pubblici"
```

**Meno di 45 minuti** dall'accesso iniziale a estorsione completa.

---

## Impatto su law firms

Law firms sono bersaglio perché:
- Conservano dati **estremamente sensibili** (client confidentiality, deposizioni, contratti)
- Hanno **budget IT limitato** (spesso il supporto IT è esternalizzato)
- Sono **disposti a pagare** (il costo di ricatto < costo di breach disclosure legale)

---

## Difesa

1. **MFA su tutti gli account** (non solo VPN)
2. **Backup offline**: anche se i file sono cifrati, il backup non è raggiungibile
3. **Awareness training su voice phishing**: insegna ai dipendenti a verificare gli caller
4. **Ristretti gli accessi di remote**: non tutti dovrebbero poter usare TeamViewer

---

## Conclusione

UNC3753 dimostra che **la velocità è diventata un'arma**. Non è più "attacca lentamente, nascondi le tracce". È "entra, cifra, estorci" in 45 minuti.

Per organizzazioni che conservano dati critici: il tempo di reazione è ormai **misurato in minuti, non ore**.
