# Networking Basics

**Difficolta:** Beginner
**Time to Master:** 3h
**Prerequisiti:** nessuno
**Lab:** TryHackMe — Network Fundamentals

---

## Obiettivo

Rinfrescare i concetti di rete indispensabili prima di attaccare applicazioni web: modello OSI/TCP-IP, socket, three-way handshake, e come leggere un `nmap`/`tcpdump` senza pensarci troppo. In eWPT il layer di rete e solo un mezzo per arrivare al layer 7 (HTTP), ma se non lo capisci ti perdi nella lettura degli scan.

---

## Concetti chiave

### Modello OSI vs TCP/IP

| OSI | TCP/IP | Esempio |
|-----|--------|---------|
| 7 Application | Application | HTTP, DNS, FTP |
| 6 Presentation | Application | TLS/SSL |
| 5 Session | Application | Session handling |
| 4 Transport | Transport | TCP, UDP |
| 3 Network | Internet | IP, ICMP |
| 2 Data Link | Link | Ethernet, ARP |
| 1 Physical | Link | Cavo, wifi |

### Three-way handshake (TCP)

```
Client -> SYN      -> Server
Client <- SYN/ACK  <- Server
Client -> ACK      -> Server
```

Un port scanner "SYN scan" (`nmap -sS`) manda solo il primo pacchetto e non completa l'handshake: piu veloce, meno rumoroso nei log applicativi (ma comunque loggato a livello firewall).

### Porte comuni per web pentesting

| Porta | Servizio | Note |
|-------|----------|------|
| 80 | HTTP | plaintext |
| 443 | HTTPS | TLS, controlla il certificato per subdomain/SAN |
| 8080 / 8443 | HTTP(S) alternativo | proxy, admin panel, app server |
| 3000 / 5000 / 8000 | Dev server | Node/Flask/Django spesso esposti per errore |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| ping | `ping -c 4 target` | RTT, host up/down | ICMP puo essere filtrato |
| traceroute | `traceroute target` | hop di rete | utile per capire load balancer/WAF davanti |
| netstat/ss | `ss -tulpn` | socket locali in ascolto | lato tuo host, non del target |
| tcpdump | `tcpdump -i eth0 port 80` | cattura pacchetti | debug proxy/VPN lab |

---

## Payload / Esempi

### Esempio 1: verificare raggiungibilita e capire se c'e un proxy davanti

```bash
ping -c 2 target.com
curl -sI http://target.com
curl -sI https://target.com
```

**Output atteso:**
```
HTTP/1.1 200 OK
Server: nginx/1.18.0
```

**Spiegazione:** l'header `Server` da un primo indizio tecnologico; se manca o e generico ("cloudflare") probabilmente c'e un reverse proxy/CDN davanti al target reale.

---

## Evasion / Bypass Techniques

Nota: a livello di rete pura in eWPT non serve evasion avanzata (niente IDS evasion stile OSCP). Ricorda solo che `nmap -sS` e piu silenzioso di `-sT`, e che ICMP bloccato non vuol dire host down (`-Pn`).

---

## Lab Hands-On

### Lab 1: TryHackMe Network Fundamentals
**Obiettivo:** consolidare OSI/TCP-IP con esercizi pratici
**Difficulty:** Facile
**Time:** 1h

**Walkthrough breve:**
1. Completa i task su three-way handshake
2. Cattura traffico con Wireshark/tcpdump
3. Identifica SYN, SYN-ACK, ACK nel capture

---

## Common Mistakes

- Assumere che un host non risponda al ping sia "down" -> usa `-Pn` con nmap, molti firewall droppano solo ICMP
- Confondere porta chiusa con porta filtrata -> leggi bene `closed` vs `filtered` nell'output nmap

---

## Link Utili

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [TryHackMe Network Fundamentals](https://tryhackme.com/)

---

## Connessioni

- **Prossimo Step:** [HTTP-HTTPS-Deep-Dive.md](HTTP-HTTPS-Deep-Dive.md)
- **Combinazione con:** [02-Scanning-Enumeration/01-Port-Scanning.md](../02-Scanning-Enumeration/01-Port-Scanning.md)

---

## Checklist di padronanza

- [ ] Ho capito il concetto teorico
- [ ] So distinguere closed/filtered/open in un port scan
- [ ] So leggere un three-way handshake in Wireshark
- [ ] Ho collegato le porte comuni ai servizi web

---

## Note personali

_(spazio libero)_
