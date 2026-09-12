---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Active Information Gathering"
permalink: "/cheatsheet/ejpt/01-information-gathering/02-active-information-gathering/"
section: "Information Gathering"
section_order: 1
order: 2
sort_key: 102
---

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [01-Passive-Recon-OSINT.md](/cheatsheet/ejpt/01-information-gathering/01-passive-recon-osint/)
**Lab:** INE PTS, Information Gathering

---

## Obiettivo

Qui è dove il target inizia a "vedere" qualcosa di te, anche se solo un pacchetto ICMP o una connessione netcat su una porta: passi dalla raccolta passiva a un primo contatto diretto ma ancora leggero e controllato — banner grabbing, tentativi di zone transfer, ping/traceroute. Pensalo come il ponte verso footprinting e scanning veri e propri: non stai ancora enumerando a fondo, stai solo bussando piano per vedere chi risponde.

---

## Concetti chiave

### Passivo vs Attivo

| Caratteristica | Passivo | Attivo |
|------------------|---------|--------|
| Traffico verso il target | nessuno | si, diretto |
| Rilevabilita | invisibile | può generare log/alert (IDS/IPS) |
| Esempi | whois, OSINT | ping, banner grab, zone transfer |

### Quando l'active recon richiede autorizzazione esplicita

Qualsiasi pacchetto inviato direttamente al target è "in scope" solo se coperto dalle Rules of Engagement (vedi [00-Fundamentals/01-Cybersecurity-Concepts.md](/cheatsheet/ejpt/00-fundamentals/01-cybersecurity-concepts/)). In laboratorio questo è implicito, ma è la mentalità corretta da portarsi dietro per un engagement reale.

### Banner grabbing

Molti servizi rispondono con informazioni di versione al primo contatto (banner): spesso sufficiente per cercare exploit noti senza ulteriore enumerazione.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| ping / traceroute | `ping -c 4 target.com` | raggiungibilità, hop | ICMP può essere filtrato |
| netcat | `nc -nv target.com 22` | banner del servizio | funziona su quasi ogni servizio testuale |
| dig axfr | `dig axfr @ns1.target.com target.com` | tentativo zone transfer | quasi sempre negato su server moderni |
| curl | `curl -sI http://target.com` | header HTTP di risposta | rivela server/tecnologia |

---

## Payload / Esempi

### Esempio 1: banner grabbing manuale con netcat

```bash
nc -nv 10.10.10.5 22
nc -nv 10.10.10.5 21
```

**Output atteso:**
```
10.10.10.5: inverse host lookup failed: Unknown host
(UNKNOWN) [10.10.10.5] 22 (ssh) open
SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.5
```

**Spiegazione:** la versione OpenSSH esatta permette di cercare CVE noti (`searchsploit openssh 8.2`), oppure confermare una versione patchata.

### Esempio 2: tentativo di DNS zone transfer

```bash
dig axfr @ns1.target.com target.com
```

**Spiegazione:** se mal configurato, un zone transfer riuscito restituisce l'intera mappa DNS interna del dominio (subdomain, IP interni): misconfigurazione critica ma rara oggi.

### Esempio 3: header HTTP per fingerprint rapido

```bash
curl -sI http://10.10.10.5
```

**Output atteso:**
```
HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
X-Powered-By: PHP/7.4.3
```

**Spiegazione:** `Server` e `X-Powered-By` rivelano stack tecnologico: primo indizio per cercare vulnerabilità note in quella versione specifica.

---

## Common Mistakes

- Lanciare uno scan aggressivo come primo pacchetto verso il target invece di un banner grab leggero
- Aspettarsi che lo zone transfer funzioni sempre: sui server moderni e quasi sempre negato, non e un fallimento della metodologia
- Ignorare header HTTP "minori" (X-Powered-By, Server) che spesso rivelano più del contenuto della pagina

---

## Link Utili

- [RFC 1035: DNS](https://www.rfc-editor.org/rfc/rfc1035)

---

## Connessioni

- **Prerequisito:** [01-Passive-Recon-OSINT.md](/cheatsheet/ejpt/01-information-gathering/01-passive-recon-osint/)
- **Prossimo Step:** [03-Google-Dorking-Search-Engines.md](/cheatsheet/ejpt/01-information-gathering/03-google-dorking-search-engines/)
- **Combinazione con:** [02-Footprinting-Scanning/01-Nmap-Fundamentals.md](/cheatsheet/ejpt/02-footprinting-scanning/01-nmap-fundamentals/)

---

## Checklist di padronanza

- [ ] So fare banner grabbing manuale con netcat su almeno 3 servizi diversi
- [ ] So tentare (e interpretare l'esito di) uno zone transfer DNS
- [ ] So leggere gli header HTTP per un primo fingerprint tecnologico
- [ ] Capisco la differenza di rischio/rilevabilità tra recon passiva e attiva
