---
layout: post
title: "IronWorm: Rust malware with eBPF rootkit infects 36 NPM packages"
date: 2026-07-15
cat: red
tags: ["IronWorm", "Rust", "eBPF", "rootkit", "npm", "infostealer", "Tor"]
excerpt: "IronWorm è un nuovo malware scritto in Rust che nasconde un kernel rootkit eBPF per evitare detection. Infetta 36 package npm e si propaga usando stolen credentials. Comunica via Tor per evitare tracciamento."
---

# IronWorm: Rust Malware con eBPF Rootkit su NPM

## La scoperta

A luglio 2026, ricercatori hanno identificato **IronWorm**, un nuovo malware sofisticato distribuito tramite 36 package npm infetti.

Quello che rende IronWorm diverso da altri malware npm:

1. **Scritto in Rust**: difficile da disassemblare, più stealthy di JavaScript
2. **eBPF kernel rootkit**: nasconde il malware a livello kernel, evitando detection da userland tools
3. **Self-propagating**: utilizza stolen npm credentials per infettare ulteriori package
4. **Tor C2**: comunicazione con il server di comando tramite Tor network

---

## Architettura di IronWorm

```
┌─────────────────────────────────────────────────┐
│ Strato 1: Userland (Visibile)                   │
│ ┌───────────────────────────────────────────┐   │
│ │ Legittimo package npm wrapper             │   │
│ │ npm install --run-scripts (esegue)        │   │
│ │ Carica IronWorm binary Rust               │   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ Strato 2: Kernel Mode (eBPF Rootkit)            │
│ ┌───────────────────────────────────────────┐   │
│ │ eBPF program che:                         │   │
│ │ - Hide processo IronWorm dai processi list│   │
│ │ - Hide file descriptor dal filesystem     │   │
│ │ - Hide connessioni di rete (Tor traffic)  │   │
│ │ - Hook system calls per evitare logging   │   │
│ └───────────────────────────────────────────┘   │
├─────────────────────────────────────────────────┤
│ Strato 3: C2 Communication                      │
│ IronWorm → [Tor Network] → C2 server            │
│            (credenziali, dati esfiltrati)       │
└─────────────────────────────────────────────────┘
```

---

## Componenti e funzionalità

### 1. Userland Component (Rust binary)

- Raccoglie dati sensibili (SSH keys, API tokens, environment variables)
- Ruba credenziali npm da ~/.npmrc
- Effettua auto-propagation: accede all'account npm e pubblica versioni malevole di altri package

### 2. eBPF Rootkit

**eBPF (Extended Berkeley Packet Filter)** è una tecnologia che consente l'esecuzione di programmi nel kernel Linux in modo sicuro. IronWorm sfrutta eBPF per:

```c
// eBPF hook di esempio
SEC("tracepoint/syscalls/sys_enter_open")
int hide_ironworm_files(struct trace_event_raw_sys_enter *ctx) {
    // Intercetta tutte le system call open()
    // Se il file è correlato a IronWorm, ritorna errore
    // Questo nasconde i file da strumenti userland come "ls", "find"
    return 0;
}
```

**Effetto:** strumenti tradizionali di detection (che operano in userland) **non vedono** i file / processi di IronWorm, perché il rootkit eBPF intercetta le system call e rifiuta di rivelarli.

### 3. Tor Communication

Il malware comunica solo tramite Tor:
- ✅ Nasconde l'indirizzo IP reale del server C2
- ✅ Difficile da tracciare / bloccare dagli ISP
- ✅ Comunicazione crittografata end-to-end

---

## I 36 package infetti

Package compromessi includono:

- Package di utility (data formatting, string manipulation)
- Package di logging (utilizzati da migliaia di applicazioni)
- Crypto-related package (ironico, dato che uno stealer di credenziali)

**Combinazione pericolosa:** Se una applicazione dipende da 5 package diversi, e 2 sono compromessi, il malware viene installato con accesso "legittimo".

---

## Timeline di infezione

| Fase | Data | Evento |
|---|---|---|
| **Creazione** | Maggio 2026 | IronWorm sviluppato / testato |
| **Primo upload** | Giugno 2026 | Primo package compromesso pubblicato su npm |
| **Propagazione** | Giugno-Luglio | Attraverso stolen credentials, ulteriori package compromessi |
| **Rilevamento** | 14 Luglio | Ricercatori notano binario Rust sospetto in package audit |
| **Disclosure** | 15 Luglio | Advisory publico; npm inizia pulizia |
| **Remediation** | 16-20 Luglio | Revocazione token, rimozione package, alert alla community |

---

## Perché eBPF è pericoloso per la sicurezza

eBPF è stato progettato per **observation** (monitoring performance) e **filtering** (firewall rules). Però è stato utilizzato qui per **evasion** (nascondere malware).

**Il dilemma:**
- ✅ eBPF è potente e consente innovazione in kernel-level tooling
- ❌ eBPF può essere abusato per rootkit evasione
- ❌ Detection di malware eBPF richiede kernel-level tools (difficile)

---

## Difesa e rilevamento

**Se hai installato uno dei 36 package:**

1. **Immediate:**
   - `npm audit` per identificare package vulnerabili
   - Update / remove package compromessi

2. **System inspection:**
   ```bash
   # Cerca processi sospetti
   ps aux | grep -i ironworm
   
   # Cerca connessioni Tor (port 9050 tipicamente)
   netstat -tulpn | grep 9050
   
   # Esamina file eBPF (difficile, richiede bpftool)
   bpftool prog list
   ```

3. **Lungo termine:**
   - Pulisci credenziali npm, SSH keys, API tokens
   - Rivedi CI/CD logs per attività anomale durante il periodo di infezione
   - Se code/artifact è stato built con IronWorm, ripubblica / rideploy

---

## Limitazioni di detection tradizionali

IronWorm dimostra i limiti degli strumenti di security tradizionali:

| Tool | Problema |
|---|---|
| **Antivirus** | Rust binaries sono polimorfici, difficili da firmare |
| **Process monitoring** | eBPF rootkit nasconde il processo |
| **File integrity monitoring** | eBPF hook intercetta stat() calls, nasconde le modifiche |
| **Network monitoring** | Tor nasconde il vero indirizzo IP del C2 |

---

## Conclusione

IronWorm rappresenta una **nuova generazione di malware** che:
- Sfrutta tecnologie "moderne" (Rust, eBPF) per evitare detection
- Utilizza auto-propagation per scale massiccia
- Rimane "invisibile" anche agli strumenti di sistema

Per la comunità npm e per i developer:
- Supply chain security rimane il perimetro più vulnerabile
- eBPF security sia come opportunità (detection) che come minaccia (evasion)
- Il modello di "fiducia implicita" nei package pubblici è **intrinsecamente fragile**

IronWorm non è il primo eBPF rootkit malware, ma è il primo ampiamente distribuito tramite package manager mainstream. Non sarà l'ultimo.
