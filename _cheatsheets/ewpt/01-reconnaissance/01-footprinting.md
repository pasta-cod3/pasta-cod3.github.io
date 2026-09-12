---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Footprinting"
permalink: "/cheatsheet/ewpt/01-reconnaissance/01-footprinting/"
section: "Reconnaissance"
section_order: 1
order: 1
sort_key: 101
---

**Difficoltà:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [00-Fundamentals/Networking-Basics.md](/cheatsheet/ewpt/00-fundamentals/networking-basics/)
**Lab:** TryHackMe, Passive Reconnaissance

---

## Obiettivo

Prima ancora di mandare un solo pacchetto al target, puoi già sapere parecchio su di lui: chi è il registrant, dove sono i name server, se è dietro Cloudflare o su un'istanza cloud dimenticata. Questo è il recon passivo — whois, DNS, registrar, hosting/cloud provider — ed è il primo step di ogni engagement proprio perché disegna la superficie di attacco senza lasciare traccia nei log del target.

---

## Concetti chiave

### Whois

Rivela registrant, name server, date di registrazione/scadenza. Utile per capire chi gestisce il dominio e se è ospitato su cloud (AWS, Azure, Cloudflare).

### DNS record types rilevanti

| Record | Significato |
|--------|-------------|
| A / AAAA | IP v4/v6 del dominio |
| MX | server di posta: rivela provider (Google Workspace, O365) |
| TXT | SPF/DKIM/verifiche: spesso rivela servizi terzi in uso |
| NS | name server: chi gestisce il DNS |
| CNAME | alias: utile per scoprire subdomain takeover |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| whois | `whois target.com` | registrant, NS, date | dati a volte redatti (GDPR) |
| nslookup | `nslookup target.com` | A record | rapido |
| dig | `dig target.com ANY` | tutti i record | più completo di nslookup; molti resolver moderni limitano/ignorano `ANY` (RFC 8482), meglio interrogare i tipi singolarmente |
| host | `host -t mx target.com` | record specifico | leggero |

---

## Payload / Esempi

### Esempio 1: recon DNS completo

```bash
whois target.com
dig target.com A
dig target.com MX
dig target.com TXT
dig target.com NS
dig axfr @ns1.target.com target.com   # tenta zone transfer, spesso negato
```

**Output atteso:**
```
target.com.  300  IN  A  93.184.216.34
target.com.  300  IN  MX 10 mail.target.com.
```

**Spiegazione:** un zone transfer riuscito (`AXFR`) esporrebbe l'intera zona DNS: misconfigurazione critica ma rara oggi, comunque sempre da testare.

### Esempio 2: identificare provider cloud/CDN dall'IP

```bash
dig target.com +short
whois $(dig target.com +short | tail -1) | grep -i "orgname\|netname"
```

**Spiegazione:** se l'IP appartiene a range Cloudflare/AWS/Akamai, il target reale è probabilmente dietro un WAF/CDN: gli attacchi diretti all'IP spesso falliscono, serve trovare l'IP origine.

---

## Evasion / Bypass Techniques

### Non farti scoprire durante recon passivo

- Usa servizi terzi (whois online, `crt.sh`) invece di query dirette quando possibile, per non generare traffico verso il target
- Rispetta la frequenza di query DNS: troppe query rapide possono triggerare rate-limit/alert

---

## Lab Hands-On

### Lab 1: TryHackMe, Passive Reconnaissance
**Obiettivo:** eseguire whois/DNS recon su un target di laboratorio
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Esegui whois sul dominio target
2. Estrai tutti i record DNS con dig
3. Identifica il provider di hosting dall'IP

---

## Common Mistakes

- Fermarsi al primo IP trovato -> controlla anche i CNAME, potrebbero puntare a servizi terzi (subdomain takeover)
- Ignorare i record TXT -> spesso rivelano SaaS di terze parti (Mailchimp, Google verification, Stripe)

---

## Link Utili

- [crt.sh: Certificate Transparency](https://crt.sh/)
- [OWASP Testing Guide: Information Gathering](https://owasp.org/www-project-web-security-testing-guide/)

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/Networking-Basics.md](/cheatsheet/ewpt/00-fundamentals/networking-basics/)
- **Prossimo Step:** [02-Fingerprinting.md](/cheatsheet/ewpt/01-reconnaissance/02-fingerprinting/)
- **Combinazione con:** [04-Dorking.md](/cheatsheet/ewpt/01-reconnaissance/04-dorking/)

---

## Checklist di padronanza

- [ ] So interrogare whois e interpretare l'output
- [ ] So estrarre tutti i record DNS rilevanti
- [ ] So riconoscere un provider cloud/CDN dall'IP
- [ ] Ho provato uno zone transfer (anche se fallito)
