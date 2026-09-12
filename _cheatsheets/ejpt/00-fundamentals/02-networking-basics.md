---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Networking Basics"
permalink: "/cheatsheet/ejpt/00-fundamentals/02-networking-basics/"
section: "Fundamentals"
section_order: 0
order: 2
sort_key: 2
---

**Difficoltà:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [01-Cybersecurity-Concepts.md](/cheatsheet/ejpt/00-fundamentals/01-cybersecurity-concepts/)
**Lab:** INE PTS, Networking Fundamentals

---

## Obiettivo

Qui non c'è niente di offensivo in senso stretto, ma è la base su cui poggia tutto il resto: se non capisci davvero OSI/TCP-IP, porte, subnetting e ARP, ogni fase successiva (scanning, enumeration, exploitation di rete) diventa un elenco di comandi lanciati a memoria, dove non sai spiegare perché uno SYN scan è "half-open" o perché un host non risponde al ping. Investi tempo qui: si ripaga da solo appena inizi a interpretare l'output di nmap invece di limitarti a leggerlo.

---

## Concetti chiave

### Modello OSI vs TCP/IP

| Layer OSI | Esempio | Layer TCP/IP equivalente |
|-----------|---------|----------------------------|
| 7 Application | HTTP, DNS, FTP | Application |
| 6 Presentation | TLS/encoding | Application |
| 5 Session | gestione sessione | Application |
| 4 Transport | TCP, UDP | Transport |
| 3 Network | IP, routing | Internet |
| 2 Data Link | MAC, switch, ARP | Network Access |
| 1 Physical | cavo, wifi | Network Access |

### TCP vs UDP

| Caratteristica | TCP | UDP |
|-----------------|-----|-----|
| Connessione | orientata alla connessione (handshake) | senza connessione |
| Affidabilità | garantisce consegna e ordine | nessuna garanzia |
| Overhead | maggiore | minore |
| Uso tipico | HTTP, SSH, FTP | DNS, DHCP, SNMP, streaming |

### TCP 3-way handshake

```
Client -> Server: SYN
Server -> Client: SYN-ACK
Client -> Server: ACK
```

Questo è alla base di come funziona uno scan TCP connect (`-sT`) e uno SYN scan (`-sS`, che si ferma dopo il SYN-ACK senza completare la connessione: "half-open").

### Subnetting / CIDR essenziale

| Notazione CIDR | Subnet mask | Host disponibili |
|-----------------|-------------|---------------------|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /28 | 255.255.255.240 | 14 |
| /30 | 255.255.255.252 | 2 (tipico link punto-punto) |

Calcolo rapido: numero di host = 2^(32-prefisso) - 2 (indirizzo di rete e broadcast esclusi).

### Porte e servizi comuni

| Porta | Protocollo | Servizio |
|-------|------------|----------|
| 21 | TCP | FTP |
| 22 | TCP | SSH |
| 23 | TCP | Telnet |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 111 | TCP/UDP | RPCbind |
| 135 | TCP | MS-RPC |
| 139 | TCP | NetBIOS Session |
| 143 | TCP | IMAP |
| 161/162 | UDP | SNMP |
| 389 | TCP | LDAP |
| 443 | TCP | HTTPS |
| 445 | TCP | SMB |
| 3306 | TCP | MySQL |
| 3389 | TCP | RDP |
| 5432 | TCP | PostgreSQL |
| 8080/8443 | TCP | HTTP/HTTPS alternativi |

### ARP e routing di base

- **ARP** risolve IP -> MAC address sulla stessa subnet (`arp -a` per vedere la cache locale)
- Fuori dalla subnet locale il traffico passa dal **default gateway**, che instrada verso altre reti
- `route` / `ip route` mostrano la tabella di routing locale

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| ping | `ping -c 4 10.10.10.5` | latenza/raggiungibilità | ICMP può essere filtrato |
| traceroute | `traceroute 10.10.10.5` | percorso hop-by-hop | utile per capire topologia |
| ip / ifconfig | `ip a` | interfacce e IP locali | `ip` è lo standard moderno |
| netstat / ss | `ss -tulnp` | porte in ascolto locali | utile su host compromessi |
| arp | `arp -a` | cache ARP locale | mostra host visti sulla LAN |

---

## Payload / Esempi

### Esempio 1: calcolo subnet

```bash
# Range utile in una /26 partendo da 10.10.10.0
# 10.10.10.0/26 -> rete 10.10.10.0, broadcast 10.10.10.63, host 10.10.10.1-10.10.10.62
ipcalc 10.10.10.0/26
```

**Output atteso:**
```
Address:   10.10.10.0
Netmask:   255.255.255.192 = 26
Network:   10.10.10.0/26
HostMin:   10.10.10.1
HostMax:   10.10.10.62
Broadcast: 10.10.10.63
```

**Spiegazione:** conoscere il range esatto ti serve per non "sparare" scan su indirizzi di rete/broadcast (inutili) e per capire quanti host puoi aspettarti in un lab.

### Esempio 2: osservare l'handshake TCP con tcpdump

```bash
sudo tcpdump -i eth0 tcp port 80 -nn
curl http://10.10.10.5
```

**Spiegazione:** vedrai i flag SYN, SYN-ACK, ACK nell'output di tcpdump: utile per capire davvero cosa fa uno scan TCP prima di lanciarlo alla cieca.

---

## Common Mistakes

- Scansionare l'indirizzo di rete o broadcast come se fosse un host valido
- Non capire perché UDP scan è lento/inaffidabile (nessuna risposta può significare "aperto" o "filtrato")
- Assumere che ICMP bloccato significhi host down: molti host sono raggiungibili anche senza rispondere al ping

---

## Link Utili

- [Subnetting practice: subnettingpractice.com](https://subnettingpractice.com/)
- [IANA: porte registrate](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)

---

## Connessioni

- **Prerequisito:** [01-Cybersecurity-Concepts.md](/cheatsheet/ejpt/00-fundamentals/01-cybersecurity-concepts/)
- **Prossimo Step:** [03-Linux-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/03-linux-fundamentals/)
- **Combinazione con:** [02-Footprinting-Scanning/01-Nmap-Fundamentals.md](/cheatsheet/ejpt/02-footprinting-scanning/01-nmap-fundamentals/)

---

## Checklist di padronanza

- [ ] So spiegare il TCP 3-way handshake e collegarlo al funzionamento di uno SYN scan
- [ ] So calcolare rete/broadcast/range host da una notazione CIDR
- [ ] Conosco a memoria le porte comuni della tabella sopra
- [ ] So la differenza pratica tra TCP e UDP durante uno scan
