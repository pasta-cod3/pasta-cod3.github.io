# Cos'è il Blue Team: difendere i sistemi informatici

## Introduzione

Se il Red Team simula gli attaccanti, il **Blue Team** è chi difende. È il team responsabile di proteggere l'infrastruttura, rilevare le intrusioni e rispondere agli incidenti.

Mentre il Red Team lavora su ingaggi temporanei, il Blue Team opera **continuativamente** — 24 ore su 24, 7 giorni su 7 nei contesti più seri. È il lavoro quotidiano della sicurezza informatica operativa.

---

## Cosa fa il Blue Team

Le responsabilità principali:

- **Monitoraggio** — analizzare log, alert e traffico di rete in cerca di attività sospette
- **Detection** — identificare attacchi in corso o già avvenuti
- **Incident Response** — rispondere agli incidenti, contenerli e risolverli
- **Hardening** — rafforzare i sistemi per ridurre la superficie d'attacco
- **Threat Hunting** — cercare proattivamente minacce nascoste nella rete
- **Vulnerability Management** — identificare e tracciare le vulnerabilità dei sistemi
- **Threat Intelligence** — raccogliere e applicare informazioni sulle minacce attuali

---

## Le figure professionali del Blue Team

### SOC Analyst (L1 / L2 / L3)

Il **Security Operations Center** è il cuore operativo del Blue Team. Gli analisti monitorano alert, fanno triage e investigano incidenti.

- **L1** — triage iniziale degli alert, escalation
- **L2** — investigazione più approfondita, correlazione eventi
- **L3** — incident response avanzata, threat hunting, forensics

### Incident Responder

Si attiva quando c'è un incidente confermato. Contiene la minaccia, analizza l'impatto, coordina il recovery.

### Threat Hunter

Cerca proattivamente minacce nella rete senza aspettare che scattino gli alert. Parte da ipotesi e cerca prove nei log.

### Forensic Analyst

Analizza sistemi compromessi per capire cosa è successo, come è entrato l'attaccante e quali dati sono stati toccati.

---

## Gli strumenti fondamentali

| Categoria | Strumenti comuni |
|---|---|
| SIEM | Splunk, Elastic SIEM, Microsoft Sentinel, Wazuh |
| EDR | CrowdStrike, SentinelOne, Microsoft Defender for Endpoint |
| IDS/IPS | Snort, Suricata, Zeek |
| Threat Intel | MISP, OpenCTI, VirusTotal |
| Forensics | Autopsy, Volatility, FTK |

Per chi inizia il percorso consigliato è: **Wazuh** (SIEM gratuito) + **Wireshark** (analisi traffico) + lab su **TryHackMe SOC Level 1**.

---

## Blue Team vs Red Team vs Purple Team

| | Red Team | Blue Team | Purple Team |
|---|---|---|---|
| Ruolo | Attacca | Difende | Collabora |
| Obiettivo | Trovare vulnerabilità | Rilevare e rispondere | Migliorare detection |
| Lavoro | Ingaggi periodici | Operativo continuo | Esercizi congiunti |

Il **Purple Team** fa lavorare Red e Blue insieme: le tecniche offensive vengono testate in tempo reale per verificare che la difesa le rilevi correttamente.

---

## Il framework MITRE ATT&CK

**MITRE ATT&CK** è una knowledge base delle tattiche e tecniche usate dagli attaccanti reali. Per il Blue Team è fondamentale perché:

- Mappa le proprie detection coverage
- Aiuta a prioritizzare cosa monitorare
- Dà contesto agli alert ("questa tecnica corrisponde a T1078 — Valid Accounts")

Disponibile gratuitamente su `attack.mitre.org`.

---

## Il ciclo di vita di un incidente (NIST)

```
1. PREPARATION         → policy, strumenti, formazione
2. DETECTION           → identificare l'incidente
3. CONTAINMENT         → fermare la diffusione
4. ERADICATION         → eliminare la causa
5. RECOVERY            → ripristinare i sistemi
6. POST-INCIDENT       → lezioni apprese
```

---

## Conclusione

Il Blue Team è spesso meno "glamour" del Red Team agli occhi dei principianti, ma è dove avviene il vero lavoro della sicurezza informatica operativa. La maggior parte delle posizioni lavorative nel settore sono difensive.

I migliori professionisti conoscono entrambe le parti: per difendere bene bisogna capire come si attacca, e viceversa.
