---
layout: post
title: "Buffer Overflow: le basi del vulnerability research su binari"
date: 2026-06-05
cat: red
tags: [buffer overflow, exploit development, gdb, pwndbg, checksec, CTF]
excerpt: "Il buffer overflow è la vulnerabilità più classica dello sviluppo software. Come funziona lo stack, perché un overflow sovrascrive il return address e come si studia per CTF e pentest."
---

Il buffer overflow è la madre di molte vulnerabilità moderne. Capirne la meccanica è fondamentale per chiunque voglia fare vulnerability research, affrontare CTF o capire davvero come funziona la sicurezza a basso livello.

## Come funziona lo stack

Quando una funzione viene chiamata, il processore salva sullo stack:
- I parametri della funzione
- Il **return address** (dove tornare dopo la funzione)
- Il **saved EBP** (base pointer precedente)
- Le variabili locali (buffer inclusi)

```
Stack layout (indirizzi crescenti verso il basso):
┌─────────────────┐  ← indirizzo alto
│   argomenti     │
├─────────────────┤
│  return address │  ← sovrascrivendo questo, controllo il flusso
├─────────────────┤
│   saved EBP     │
├─────────────────┤
│   buffer[64]    │  ← da qui parte l'overflow
└─────────────────┘  ← indirizzo basso (ESP)
```

## Esempio pratico: trovare l'offset

```c
// Codice vulnerabile classico
void vuln(char *input) {
    char buffer[64];
    strcpy(buffer, input);  // nessun controllo della lunghezza!
}
```

Per trovare l'offset al return address si usa un pattern ciclico:

```bash
# Con pwndbg
pwndbg> cyclic 200
# Lancia il programma con il pattern
pwndbg> run $(python3 -c "import pwn; print(pwn.cyclic(200).decode())")
# Il programma crasha — leggi l'EIP/RIP
pwndbg> cyclic -l 0x61616178   # offset = 76 bytes
```

## Protezioni moderne e come si studiano

I sistemi moderni hanno protezioni che rendono i BOF più complessi:

```bash
checksec --file=./binary
```

| Protezione | Cosa fa | Studio |
|-----------|---------|--------|
| **NX/DEP** | Stack non eseguibile | ROP chains |
| **ASLR** | Randomizza indirizzi | Leak di indirizzi |
| **Stack Canary** | Valore sentinella prima del ret | Leak del canary |
| **PIE** | Randomizza base del binario | Leak base address |

Per i CTF e per lo studio, spesso si lavora con binari senza protezioni per capire i fondamentali prima di affrontare le bypass.

## Strumenti di studio

```bash
# GDB con pwndbg (il migliore per exploit dev)
gdb ./binary
pwndbg> checksec
pwndbg> info functions
pwndbg> disass vuln

# pwntools — libreria Python per exploit
from pwn import *
p = process('./binary')
payload = b'A' * 76 + p32(0xdeadbeef)
p.sendline(payload)
p.interactive()

# ROPgadget — cerca gadget per ROP chains
ROPgadget --binary ./binary | grep "pop rdi"
```

## Risorse per imparare

- **pwn.college** — corso universitario gratuito, dal BOF base alle tecniche avanzate
- **CTFtime.org** — competizioni CTF con writeup
- **OverTheWire: Protostar** — lab dedicati al BOF
- **LiveOverflow** — video spiegati molto bene

Il BOF è il punto di ingresso nel mondo del vulnerability research. Non serve diventare un exploit developer per un pentest standard, ma capire la meccanica cambia radicalmente la profondità di comprensione delle CVE che si trovano.
