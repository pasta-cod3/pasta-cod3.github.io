---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Host Discovery"
permalink: "/cheatsheet/ejpt/02-footprinting-scanning/02-host-discovery/"
section: "Footprinting & Scanning"
section_order: 2
order: 2
sort_key: 202
---

**Difficoltà:** Beginner
**Time to Master:** 1h
**Prerequisiti:** [01-Nmap-Fundamentals.md](/cheatsheet/ejpt/02-footprinting-scanning/01-nmap-fundamentals/)
**Lab:** INE PTS, Network Scanning

---

## Obiettivo

In eJPTv2 raramente ti danno un singolo IP: più spesso ti trovi davanti un range intero (`10.10.10.0/24`), e lanciare `-p-` su 254 indirizzi che magari non esistono nemmeno è tempo buttato. La host discovery risolve esattamente questo: capire quali host sono davvero "vivi" prima di investire minuti preziosi nello scanning porta-per-porta. È il primo vero step operativo, ed è anche dove impari che "non risponde al ping" non vuol dire "non esiste".

---

## Concetti chiave

### Metodi di discovery

| Metodo | Livello | Note |
|--------|---------|------|
| ICMP echo (ping) | L3 | semplice ma spesso bloccato da firewall |
| ARP scan | L2 | affidabilissimo su rete locale (LAN), non instradabile |
| TCP SYN/ACK ping | L4 | utile quando ICMP è filtrato, prova su porte comuni |
| UDP ping | L4 | meno usato, alcuni servizi rispondono con ICMP unreachable |

### Quando ICMP è filtrato

Molti host di lab bloccano ping di default (comportamento tipico di Windows Firewall). In quel caso l'host discovery via ICMP fallisce anche se l'host è attivo: bisogna passare a TCP/ARP o forzare la scansione con `-Pn`.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| nmap | `nmap -sn 10.10.10.0/24` | lista host che rispondono | ping scan, nessuna porta scansionata |
| arp-scan | `arp-scan -l` | IP + MAC + vendor su LAN locale | solo stessa subnet fisica |
| netdiscover | `netdiscover -r 10.10.10.0/24` | scoperta passiva/attiva ARP | utile in modalità passiva su reti condivise |
| fping | `fping -a -g 10.10.10.0/24` | lista host up | veloce, buono per script |

---

## Payload / Esempi

### Esempio 1: ping sweep con nmap

```bash
nmap -sn 10.10.10.0/24 -oN hosts-live.txt
```

**Output atteso:**
```
Nmap scan report for 10.10.10.5
Host is up (0.021s latency).
Nmap scan report for 10.10.10.12
Host is up (0.018s latency).
```

**Spiegazione:** `-sn` (in passato `-sP`) disabilita il port scan e fa solo host discovery, molto più veloce di uno scan completo su tutta la subnet.

### Esempio 2: ARP scan su rete locale

```bash
arp-scan -l
```

**Spiegazione:** l'ARP scan opera a livello 2 e non può essere filtrato da un firewall a livello IP: è il metodo più affidabile quando ci si trova sulla stessa LAN del target (tipico setup nei lab INE PTS).

### Esempio 3: forzare lo scan quando ICMP è bloccato

```bash
nmap -Pn -p 80,443,445 10.10.10.20
```

**Spiegazione:** `-Pn` salta la fase di host discovery e assume che l'host sia up, scansionando direttamente le porte indicate. Utile quando si sa già (da altra fonte) che l'host esiste ma non risponde a ping.

---

## Lab Hands-On

### Lab 1: INE PTS, Network Discovery
**Obiettivo:** mappare tutti gli host attivi su una subnet /24 di lab con almeno 2 metodi diversi
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Esegui `nmap -sn` sull'intera subnet assegnata
2. Confronta il risultato con `arp-scan -l` se sei sulla stessa LAN
3. Per ogni host trovato con ICMP bloccato, riprova con `-Pn` su porte comuni

---

## Common Mistakes

- Assumere che un host "non risponde a ping" significhi che non esiste -> molti target eJPT hanno ICMP disabilitato di proposito
- Saltare la host discovery e lanciare `-p-` su tutta la subnet -> spreco enorme di tempo su IP inesistenti
- Dimenticare che ARP scan funziona solo sulla stessa subnet fisica, non attraverso router

---

## Link Utili

- [Nmap Host Discovery docs](https://nmap.org/book/host-discovery.html)

---

## Connessioni

- **Prerequisito:** [01-Nmap-Fundamentals.md](/cheatsheet/ejpt/02-footprinting-scanning/01-nmap-fundamentals/)
- **Prossimo Step:** [03-Port-Scanning-Techniques.md](/cheatsheet/ejpt/02-footprinting-scanning/03-port-scanning-techniques/)
- **Combinazione con:** [04-Service-Version-OS-Detection.md](/cheatsheet/ejpt/02-footprinting-scanning/04-service-version-os-detection/)

---

## Checklist di padronanza

- [ ] So fare host discovery con nmap, arp-scan e fping
- [ ] Capisco quando e perché ICMP può essere filtrato
- [ ] So usare `-Pn` correttamente quando serve
