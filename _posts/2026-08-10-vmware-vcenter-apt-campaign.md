---
layout: post
title: "VMware vCenter CVE-2026-59310: APT campaign targets 360+ organizations globally"
date: 2026-08-10
cat: red
tags: ["VMware", "vCenter", "CVE-2026-59310", "APT", "directory traversal", "reverse SSH"]
excerpt: "Un'APT avanzata sfrutta la vulnerabilità CVE-2026-59310 di VMware vCenter per instalare reverse_ssh e mantenere accesso persistente. Oltre 360 vittime identificate in 47 paesi; Germania, USA, Turchia, Iran, Francia concentrano metà degli attacchi."
---

# VMware vCenter APT Campaign: 360+ IP Vittime in 47 Paesi

## La campagna

A agosto 2026, ricercatori di Quirso hanno scoperto una **campagna APT coordinata e massiccia** che sfrutta **CVE-2026-59310**, una vulnerabilità critica di directory traversal in VMware vCenter Server.

La campagna è particolare perché:
- È **coordinata** (stesso tooling, stessa infrastruttura)
- È **globale** (47 paesi colpiti)
- È **persistente** (attaccanti installano reverse SSH per accesso a lungo termine)
- È **recente** (scoperta attiva il 3 agosto)

---

## CVE-2026-59310: Directory Traversal in Syslog

**Tipo di falla:**
Directory traversal nel Syslog server di VMware vCenter. Un attaccante con accesso di rete al vCenter Server (spesso accessibile via internet per scopi di administration remota) può inviare payload malevoli al server Syslog.

**Meccanismo:**
```
Attaccante → [payload con directory traversal]
            ↓
vCenter Syslog → interpreta il payload come comando
                ↓
Esegue codice arbitrario con privilegi di vCenter (root/SYSTEM)
```

**CVSS Score:** 9.8 (Criticità massima)

**Impatto:** Remote Code Execution (RCE) come utente root su un'infrastruttura di virtualizzazione enterprise.

---

## Timeline dell'exploit

| Data | Evento |
|---|---|
| **29 Luglio** | CVE-2026-59310 divulgato pubblicamente da VMware |
| **29 Luglio** | PoC (Proof of Concept) pubblicato online |
| **3 Agosto** | Primi attacchi rilevati — APT inizia sfruttamento massivo |
| **3-5 Agosto** | 340+ indirizzi IP vittime vengono compromessi |
| **5 Agosto** | Infezioni ancora in corso — attaccanti mantengono accesso persistente |

La **finestra tra disclosure e exploitation** è stata solo 4 giorni. Per organizzazioni con processi di patch lenti, questo era tempo insufficiente.

---

## Distribuzione geografica

```
Totale vittime identificate: 360+ indirizzi IP in 47 paesi

Top 5 paesi colpiti (50% del totale):
🇩🇪 Germania      ~60 vittime
🇺🇸 USA          ~55 vittime
🇹🇷 Turchia       ~35 vittime
🇮🇷 Iran         ~30 vittime
🇫🇷 Francia       ~25 vittime

Resto del mondo:  ~155 vittime distribuiti in 42 paesi
```

La concentrazione in Germania e USA suggerisce che **organizzazioni critiche** (finanza, energy, manufacturing) sono bersaglio.

---

## Tooling e persistenza: reverse_ssh

Quello che rende questa campagna particolare è il **metodo di persistenza**: gli attaccanti non usano backdoor comuni. Usano **reverse SSH**.

**Cos'è reverse SSH:**
Un tunnel SSH opposto: invece di connettersi al server del vCenter, il vCenter istabilisce una connessione SSH **outbound** verso un server controllato dall'attaccante. Una volta stabilito il tunnel, l'attaccante può:

- Accedere interattivamente al shell del vCenter
- Bypassare firewall (la connessione è outbound, spesso consentita)
- Mantenersi nascosto dai log (il traffico sembra SSH legittimo)

**Permanenza:**
Anche se VMware patcha la vulnerabilità, il tunnel reverse_ssh rimane attivo se l'attaccante mantiene la connessione. La rimozione richiede:

1. Identifica il processo reverse SSH in esecuzione
2. Termina la connessione
3. Rimuovi il payload che lo ha installato
4. Verifica che non sia stato installato da altre vulnerabilità

---

## Perché vCenter è bersaglio critico

VMware vCenter è il **controller centralizzato** di un'infrastruttura di virtualizzazione. Compromettendo vCenter, un attaccante otiene:

- **Visibilità totale** su tutte le VM ospitate (sistemi operativi, dati, applicazioni)
- **Controllo delle VM** (start, stop, modify, clone, snapshot)
- **Accesso ai dati** di tutte le VM, indipendentemente dal loro stato di patching
- **Movimento laterale** verso la rete fisica (ESXi hosts, storage, networking)

È il "golden ticket" per una rete di virtualizzazione enterprise — una compromissione di vCenter = compromissione di intera infrastruttura.

---

## Difesa e mitigazione

**Immediato:**
1. **Patcha vCenter urgentemente** — non è "quando puoi", è "ora"
2. **Scansiona per reverse SSH** — controlla processi di rete anomali (`netstat -tulpn | grep ssh` su Linux, `netstat -ano` su Windows)
3. **Monitora il traffico outbound** — reverse SSH crea connessioni outbound verso server controllati dall'attaccante

**Breve termine:**
1. **Rivedi i log di vCenter** — controlla access log per attività amministrative anomale (creazione di account, modifiche di VM)
2. **Reimposta le credenziali** di vCenter (utenti, API tokens)
3. **Ispeziona tutte le VM** per segni di compromise

**Lungo termine:**
1. **Segmentazione di rete** — vCenter non dovrebbe avere accesso diretto a VM critiche; usa micro-segmentation
2. **MFA su vCenter** — autenticazione a due fattori limita l'accesso anche se credenziali sono compromesse
3. **Zero-trust architecture** — non assumere che una connessione interna a vCenter è legittima

---

## Conclusione

La campagna APT su vCenter CVE-2026-59310 è un reminder di una realtà sgradevole: le infrastrutture di virtualizzazione sono **punti di convergenza per l'attacco**. Una singola vulnerabilità su vCenter = potenziale compromissione di decine, centinaia, talvolta migliaia di sistemi.

Il fatto che 360+ organizzazioni siano state compromesse in meno di una settimana dimostra che **l'automation massiva è il nuovo standard** per le APT — non più attacchi mirati, ma campagne di scanning e exploit coordinati su larga scala.
