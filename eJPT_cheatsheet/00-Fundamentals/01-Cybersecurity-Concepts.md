# Cybersecurity Concepts

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** nessuno
**Lab:** INE PTS, Introduzione

---

## Obiettivo

Prima di lanciare il primo nmap ti serve il vocabolario giusto, altrimenti passi l'esame ripetendo termini a memoria senza sapere perché li usi in quel momento. Qui vedi cos'è davvero un assessment, come si differenzia un pentest da un vulnerability assessment o da un red team engagement, come si struttura un lavoro dall'inizio alla fine, e — cosa che sottovaluti finché non ti capita — cosa significa avere l'autorizzazione scritta prima di toccare qualsiasi cosa.

---

## Concetti chiave

### CIA Triad

| Pilastro | Significato | Esempio di violazione |
|----------|-------------|------------------------|
| Confidentiality | solo chi è autorizzato accede ai dati | data breach, sniffing di credenziali in chiaro |
| Integrity | i dati non vengono alterati senza autorizzazione | tampering di un file di config, SQL injection che modifica record |
| Availability | il sistema/servizio resta utilizzabile | DoS, ransomware che cifra i dati |

### Threat, Vulnerability, Risk, Exploit

| Termine | Definizione |
|---------|-------------|
| Threat (minaccia) | un attore o evento potenzialmente dannoso (es. un attaccante, un worm) |
| Vulnerability (vulnerabilità) | una debolezza nel sistema che può essere sfruttata |
| Risk (rischio) | probabilità che una minaccia sfrutti una vulnerabilità, per l'impatto risultante |
| Exploit | codice/tecnica che sfrutta concretamente una vulnerabilità |

Formula concettuale: **Risk = Threat x Vulnerability x Impact**.

### Tipi di assessment

| Tipo | Obiettivo | Durata tipica | Note |
|------|-----------|----------------|------|
| Vulnerability Assessment | identificare e classificare vulnerabilità | breve | nessuno sfruttamento attivo, output = lista di vulnerabilità |
| Penetration Test | dimostrare impatto reale sfruttando le vulnerabilità | medio | scope definito, exploitation autorizzata, è ciò che copre eJPTv2 |
| Red Team Assessment | simulare un attacco reale end-to-end, spesso senza preavviso ai difensori | lungo | include social engineering, evasione, persistenza; obiettivo = testare anche il rilevamento (blue team) |

### Black box / Grey box / White box

| Modello | Informazioni fornite al tester |
|---------|----------------------------------|
| Black box | nessuna, come un attaccante esterno |
| Grey box | parziali (es. credenziali utente standard, mappa di rete) |
| White box | complete (codice sorgente, architettura, credenziali admin) |

### Fasi standard di un penetration test (metodologia tipo PTES)

1. **Pre-engagement**: scope, rules of engagement (RoE), autorizzazione scritta
2. **Information Gathering**: recon passivo e attivo
3. **Threat Modeling / Vulnerability Analysis**: mappare i vettori d'attacco plausibili
4. **Exploitation**: sfruttare le vulnerabilità individuate
5. **Post-Exploitation**: privilege escalation, pivoting, raccolta prove di impatto
6. **Reporting**: documentare tutto con evidenze riproducibili

### Autorizzazione e Rules of Engagement

- **Mai** testare un sistema senza autorizzazione scritta esplicita (Get-Out-of-Jail-Free letter/contratto)
- Lo **scope** definisce cosa è IN e cosa è OUT (IP range, applicazioni, orari, tecniche vietate come il DoS)
- Le **Rules of Engagement** definiscono limiti operativi (es. no social engineering sui dipendenti reali, no exploit distruttivi)
- In laboratorio (INE PTS, TryHackMe, HTB) l'autorizzazione è implicita nei termini della piattaforma: resta comunque buona pratica pensare "scope" anche in lab

---

## Strumenti

| Tool | Uso | Note |
|------|-----|------|
| Scoping document/contratto | definisce il perimetro autorizzato | non tecnico ma fondamentale |
| CVSS calculator | quantifica la severità di una vulnerabilità | vedi [04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md) |
| Note-taking (CherryTree, Obsidian, markdown) | tracciare ogni step per il report finale | essenziale con più host in scope |

---

## Payload / Esempi

Questa pagina è concettuale, non ha payload tecnici. Esempio di frase tipica in una RoE:

```
Scope: 10.10.10.0/24
Escluso: DoS, social engineering su personale reale, exploitation distruttiva senza conferma
Finestra di test: 09:00-18:00, giorni lavorativi
Contatto di emergenza: security-team@cliente.local
```

**Spiegazione:** ogni voce limita legalmente e operativamente cosa puoi fare: uscire da questo perimetro, anche per errore, è un problema serio in un engagement reale.

---

## Lab Hands-On

### Lab 1: INE PTS, Panoramica ambiente
**Obiettivo:** familiarizzare con l'interfaccia del lab, la VPN, e la struttura a flag/domande dell'esame eJPTv2
**Difficulty:** Facile
**Time:** 20 min

**Walkthrough breve:**
1. Connetti la VPN fornita dal lab
2. Verifica la connettività con `ping` verso gli host assegnati
3. Apri le domande/obiettivi e nota come sono strutturati (a differenza di un CTF puro, spesso richiedono una sequenza logica di enumerazione -> exploitation)

---

## Common Mistakes

- Iniziare a scansionare senza aver letto lo scope -> in un engagement reale è un problema legale
- Confondere vulnerability assessment con penetration test in un colloquio o in un report -> sono deliverable diversi
- Saltare la fase di reporting mentalmente "perché tanto è solo un lab" -> la documentazione è una competenza testata anche indirettamente (capacità di tracciare cosa hai fatto)

---

## Link Utili

- [PTES: Penetration Testing Execution Standard](http://www.pentest-standard.org/)
- [NIST SP 800-115: Technical Guide to Information Security Testing](https://csrc.nist.gov/publications/detail/sp/800-115/final)

---

## Connessioni

- **Prerequisito:** nessuno, è il punto di partenza
- **Prossimo Step:** [02-Networking-Basics.md](02-Networking-Basics.md)
- **Combinazione con:** [12-Reporting-Notes](../12-Reporting-Notes/)

---

## Checklist di padronanza

- [ ] So spiegare la differenza tra vulnerability assessment, penetration test e red team
- [ ] Conosco le fasi standard di un pentest a memoria
- [ ] Capisco perché l'autorizzazione scritta è sempre necessaria
- [ ] So cos'è la CIA triad e faccio esempi concreti di violazione per ciascun pilastro

