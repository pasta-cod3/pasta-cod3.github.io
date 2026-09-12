---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Quick Start: Flusso Rapido (30 min)"
permalink: "/cheatsheet/ewpt/quick-start/"
section: "Guida"
section_order: -1
order: 1
sort_key: -99
---

**Obiettivo:** avere un primo giro veloce su un target web sconosciuto, il flusso mentale che userai in ogni engagement/lab eWPT.

---

## Prerequisiti

- [ ] Burp Suite configurato (vedi [Burp Suite Setup](/cheatsheet/ewpt/00-fundamentals/burp-suite-setup/))
- [ ] VPN lab connessa, target raggiungibile (`ping`/`curl`)
- [ ] Terminale con nmap, gobuster/ffuf, whatweb, sqlmap installati

---

## Fase 1: Recon passivo (5 min)

```bash
whois target.com
dig target.com ANY
dig target.com MX
curl -sI http://target.com
```

Riferimento: [01-Reconnaissance/01-Footprinting.md](/cheatsheet/ewpt/01-reconnaissance/01-footprinting/)

---

## Fase 2: Scanning attivo (10 min)

```bash
# Tutte le porte, veloce
nmap -p- --min-rate=5000 -oN scan-allports.txt target.com

# Service/version detection sulle porte trovate
nmap -sV -sC -p 21,22,80,443,8080 -oN scan-services.txt target.com
```

Riferimento: [02-Scanning-Enumeration/01-Port-Scanning.md](/cheatsheet/ewpt/02-scanning-enumeration/01-port-scanning/)

---

## Fase 3: Web enumeration (10 min)

```bash
whatweb -a 3 http://target.com
gobuster dir -u http://target.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,txt,bak -o gobuster.txt
```

Riferimento: [02-Scanning-Enumeration/03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/)

---

## Fase 4: Test manuale nei punti caldi (5 min)

Passa ogni parametro visibile (query string, form, header, cookie) attraverso Burp Proxy/Repeater e prova rapidamente:

| Input di prova | Cosa cerchi |
|-----------------|-------------|
| `'` `"` | errore SQL, stack trace |
| `<script>alert(1)</script>` | riflessione non sanitizzata (XSS) |
| `../../../../etc/passwd` | path traversal / LFI |
| valore ID cambiato (`?id=1` -> `?id=2`) | IDOR |

Riferimenti: [04-SQL-Injection](/cheatsheet/ewpt/04-sql-injection/01-sqli-fundamentals/), [05-Cross-Site-Scripting](/cheatsheet/ewpt/05-cross-site-scripting/01-xss-fundamentals/), [03-File-Inclusion](/cheatsheet/ewpt/03-file-inclusion/01-lfi-basics/), [06-Authentication-Authorization/04-IDOR.md](/cheatsheet/ewpt/06-authentication-authorization/04-idor/)

---

## Checklist di uscita dal Quick Start

- [ ] Ho una lista di porte/servizi aperti
- [ ] Ho una lista di path/directory scoperti
- [ ] Ho identificato tecnologia backend (PHP/ASP/Node/framework)
- [ ] Ho almeno 2-3 parametri candidati da testare a fondo
- [ ] Ho salvato tutto l'output in file (non solo terminale)

**Prossimo step:** passa da qui alla sezione [00-Fundamentals](/cheatsheet/ewpt/00-fundamentals/burp-suite-setup/) se ti mancano basi solide, oppure vai dritto su [01-Reconnaissance](/cheatsheet/ewpt/01-reconnaissance/01-footprinting/) per il flusso completo di information gathering.
