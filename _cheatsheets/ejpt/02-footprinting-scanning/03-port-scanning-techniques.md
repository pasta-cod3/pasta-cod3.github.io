---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Port Scanning Techniques"
permalink: "/cheatsheet/ejpt/02-footprinting-scanning/03-port-scanning-techniques/"
section: "Footprinting & Scanning"
section_order: 2
order: 3
sort_key: 203
---

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [02-Host-Discovery.md](/cheatsheet/ejpt/02-footprinting-scanning/02-host-discovery/)
**Lab:** INE PTS, Network Scanning

---

## Obiettivo

`-sS` o `-sT`? UDP sì o no? Non sono scelte a caso: dipendono da quali privilegi hai sulla tua macchina, da quanto tempo hai a disposizione e da quanto vuoi farti notare. Capire a fondo queste tecniche di scan TCP/UDP e i loro compromessi è quello che ti evita di scoprire, troppo tardi in un lab o all'esame, che una porta importante non l'avevi proprio vista.

---

## Concetti chiave

### TCP connect vs SYN scan

| Scan | Come funziona | Privilegi richiesti | Rilevabilità |
|------|----------------|----------------------|----------------|
| `-sT` (connect) | completa il 3-way handshake (SYN, SYN-ACK, ACK) | nessuno (user normale) | facilmente loggato dal target |
| `-sS` (SYN/half-open) | invia SYN, riceve SYN-ACK, poi RST invece di ACK | root/raw socket | meno loggato, più veloce |

### Stati di una porta in nmap

| Stato | Significato |
|-------|-------------|
| open | servizio in ascolto e risponde |
| closed | porta raggiungibile ma nessun servizio in ascolto |
| filtered | nmap non riesce a determinare lo stato (firewall) |
| open\|filtered | tipico di UDP, nessuna risposta ricevuta |

### Scan completo vs top-ports

Uno scan `-p-` (tutte le 65535 porte) è più lento ma completo; `--top-ports N` scansiona solo le N porte più comuni secondo il database di nmap. In eJPTv2 conviene sempre fare prima un `-p-` veloce (`--min-rate` alto) per non perdere servizi custom su porte non standard.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| nmap | `nmap -sS -p- --min-rate=5000 target` | tutte le porte TCP aperte | tecnica principale d'esame |
| nmap | `nmap -sU --top-ports 20 target` | porte UDP comuni | scan UDP lento, limitare il range |
| hping3 | `hping3 -S -p 80 target` | singolo pacchetto SYN craftato | utile per test manuali mirati |

---

## Payload / Esempi

### Esempio 1: SYN scan completo veloce

```bash
sudo nmap -sS -p- --min-rate=5000 -oN scan-full.txt 10.10.10.5
```

**Spiegazione:** `-sS` richiede privilegi root per costruire pacchetti raw; è la tecnica standard per il primo giro completo perché più veloce e meno invasiva del connect scan.

### Esempio 2: scan UDP mirato

```bash
nmap -sU -p 53,67,69,161,500 -oN scan-udp-common.txt 10.10.10.5
```

**Output atteso:**
```
PORT    STATE SERVICE
53/udp  open  domain
161/udp open  snmp
```

**Spiegazione:** invece di scansionare tutte le 65535 porte UDP (molto lento), si mira alle porte UDP più spesso rilevanti in un contesto Windows/Linux (DNS, DHCP, NTP, SNMP, IKE).

### Esempio 3: evasione tramite frammentazione e decoy

```bash
sudo nmap -sS -f -D RND:10 -p 445 10.10.10.5
```

**Spiegazione:** `-f` frammenta i pacchetti TCP in header più piccoli per confondere firewall/IDS che ispezionano header interi; `-D RND:10` aggiunge 10 IP decoy casuali così il vero IP sorgente si nasconde nel rumore.

---

## Evasion / Bypass Techniques

- `-f` / `--mtu`: frammentazione pacchetti
- `-D decoy1,decoy2,ME`: decoy scan
- `-S spoofed_ip`: spoofing IP sorgente (richiede di poter ricevere le risposte, raro in pratica)
- `--scan-delay`: rallenta i pacchetti per evitare soglie di rate-limiting IDS
- In molti lab eJPTv2 non c'è IDS attivo: capire il concetto conta più che applicarlo sempre

---

## Lab Hands-On

### Lab 1: INE PTS, Advanced Scanning
**Obiettivo:** confrontare risultati di -sT vs -sS e individuare porte UDP aperte su un host multi-servizio
**Difficulty:** Medio
**Time:** 45 min

**Walkthrough breve:**
1. Esegui `-sT` e `-sS` sullo stesso target, confronta i tempi e i risultati
2. Esegui uno scan UDP mirato sulle porte più comuni
3. Annota tutte le porte open/open|filtered per la fase di enumeration

---

## Common Mistakes

- Ignorare completamente lo scan UDP perché "è lento" -> servizi critici come SNMP/DNS sono UDP
- Confondere "filtered" con "closed" -> filtered significa che serve indagare oltre (firewall nel mezzo)
- Usare `-sS` senza sudo e ottenere silenziosamente un fallback a `-sT` senza accorgersene

---

## Link Utili

- [Nmap Port Scanning Techniques](https://nmap.org/book/man-port-scanning-techniques.html)

---

## Connessioni

- **Prerequisito:** [02-Host-Discovery.md](/cheatsheet/ejpt/02-footprinting-scanning/02-host-discovery/)
- **Prossimo Step:** [04-Service-Version-OS-Detection.md](/cheatsheet/ejpt/02-footprinting-scanning/04-service-version-os-detection/)
- **Combinazione con:** [Lab-Challenges.md](/cheatsheet/ejpt/02-footprinting-scanning/lab-challenges/)

---

## Checklist di padronanza

- [ ] Conosco la differenza tecnica tra -sT e -sS
- [ ] So interpretare open/closed/filtered/open|filtered
- [ ] So quando e perché fare uno scan UDP mirato
- [ ] Ho provato almeno una tecnica di evasion di base
