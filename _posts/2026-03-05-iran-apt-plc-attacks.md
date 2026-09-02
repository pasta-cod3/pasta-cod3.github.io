---
layout: post
title: "Iran-linked APT: PLC attacks su critical infrastructure water/energy USA"
date: 2026-03-05
cat: news
tags: ["Iran", "APT", "PLC", "SCADA", "water", "energy", "operational technology"]
excerpt: "Un'APT legata all'Iran ha lanciato una campagna di attacchi contro operational technology (PLC/SCADA) negli USA, colpendo sistemi di acqua, energia, e servizi. È il primo attacco documentato che compromette direttamente i controllori industriali."
---

# Iran APT Targets US Critical Infrastructure PLCs

## L'attacco

A marzo 2026, **CISA** e il governo USA hanno avvertito di una **campagna APT coordinata legata all'Iran** che prende di mira **dispositivi di operational technology (OT)**:

- **PLC (Programmable Logic Controllers)** — controllano macchinari
- **SCADA systems** — supervisory control e acquisition di dati
- **HMI (Human Machine Interfaces)** — console di controllo

Target settori:
- 💧 **Water and Wastewater** systems
- ⚡ **Energy** (generazione e distribuzione)
- 🏭 **Manufacturing** critical facilities

---

## Differenza tra IT e OT

| Aspetto | IT | OT |
|---|---|---|
| **Cosa controlla** | Dati, computazione | Processi fisici (pumpe, turbine, valvole) |
| **Impact di breach** | Dati rubati | **Blackout, inquinamento acqua, crash macchinari** |
| **Tempo di reazione** | Ore/giorni | **Minuti** (altrimenti disastro fisico) |
| **Recovery** | Restore backup | Restart manuale di equipaggiamento fisico |

---

## Come l'attacco funziona

```
APT iraniana
    ↓ (scansiona rete OT)
Identifica PLC/SCADA vulnerabili
    ↓ (invia payload malevolo)
PLC compromesso
    ↓ (modifica logica di controllo)
Equipaggiamento si comporta in modo anomalo:
- Pump si accende/spegne continuamente
- Valvola si chiude inaspettatamente
- Generator non risponde ai comandi
```

---

## Impatto specifico: acqua

Se un attaccante compromette un PLC in un impianto di trattamento acqua, potrebbe:

1. **Disabilitare la clorazione** — il cloro non viene aggiunto all'acqua
2. **Contaminazione** — l'acqua diventa non potabile o tossica
3. **Malattia pubblica** — epidemia di dysentery / colera
4. **Panico** — residenti non bevono più acqua dal rubinetto

---

## Impatto specifico: energia

Se un attaccante compromette un PLC in una centrale termoelettrica:

1. **Disattivazione della turbina** — la turbina non gira
2. **Blackout locale** — migliaia di residenti senza corrente
3. **Cascata** — blackout si propaga ad altre aree (grid è interconnesso)
4. **Disastro** — ospedali, semafori, riscaldamento offline

---

## Attribution all'Iran

Il governo USA ha attribuito l'attacco all'Iran per:

- **Malware signatures** — simile a malware iraniano usato in precedenti attacchi (Triton/TRISIS)
- **Infrastructure C2** — server di command-and-control tracciati a provider iraniani
- **Timing** — coincide con escalation geopolitica USA-Iran
- **Targeting** — pattern di targeting coerente con interessi iraniani (sconfitta USA energy independence)

---

## CISA response

CISA ha:
1. ✅ Rilasciato technical indicators per identificare compromissione
2. ✅ Creato remediation guidance
3. ✅ Notificato critical infrastructure operators
4. ✅ Offerto technical assistance per organizations colpite

---

## Perché OT è vulnerabile

- **Legacy systems** — PLCs installati 20+ anni fa, mai aggiornati
- **Isolamento assoluto scomparso** — OT è sempre più connesso a IT (per monitoring remoto)
- **Sparse patching** — downtime di un PLC = produzione ferma, quindi patch ritardate
- **Default credentials** — molti PLCs mantenuti con password di default

---

## Conclusione

L'attacco iraniano su OT è un **watershed moment** — cyberattack non è più "furto di dati" ma **disruption di infrastrutture fisiche**.

Il prossimo conflitto geopolitico potrebbe includere **blackout coordinati, contaminazione dell'acqua, crash della produzione** — tutto tramite cyberattack contro OT.
