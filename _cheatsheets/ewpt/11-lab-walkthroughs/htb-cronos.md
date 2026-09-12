---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "HTB: Cronos (Walkthrough Notes)"
permalink: "/cheatsheet/ewpt/11-lab-walkthroughs/htb-cronos/"
section: "Lab Walkthroughs"
section_order: 11
order: 50
sort_key: 1150
---

**Difficulty:** Medium
**Time to root (stimato):** 2h
**Vulnerability:** DNS zone transfer -> vhost enumeration -> SQL Injection -> RCE via OS Command Injection -> cron job privesc

---

## Obiettivo

Cronos è quasi un riassunto in scala ridotta di tutta la metodologia eWPT, ed è per questo che vale la pena rifarla più di una volta: parti da un DNS zone transfer che quasi nessuno controlla per abitudine, scopri vhost nascosti che l'enumerazione HTTP diretta non avrebbe mai rivelato, bypassi un login con SQLi, ed esci con un privesc via cron job — la stessa distrazione di configurazione che vedrai ricorrere in molte macchine reali.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon DNS
```bash
dig axfr target.com @target.com
```
Un DNS zone transfer riuscito rivela subdomain/vhost non altrimenti scopribili: vedi [01-Reconnaissance/01-Footprinting.md](/cheatsheet/ewpt/01-reconnaissance/01-footprinting/).

### 2. Virtual host discovery
Aggiungi i vhost trovati a `/etc/hosts` e ripeti l'enumerazione web su ciascuno, seguendo [02-Scanning-Enumeration/04-Virtual-Host-Enum.md](/cheatsheet/ewpt/02-scanning-enumeration/04-virtual-host-enum/).

### 3. SQL injection su pannello di login
Testa il form di login con i payload base di [04-SQL-Injection/01-SQLi-Fundamentals.md](/cheatsheet/ewpt/04-sql-injection/01-sqli-fundamentals/):
```
' OR 1=1 --
```
Se il bypass funziona, sei dentro un pannello amministrativo.

### 4. RCE via command injection su un tool di rete del pannello admin

Molti pannelli admin di questo tipo espongono una funzionalità "di rete" (es. ping/traceroute) che passa l'input utente non sanitizzato a una chiamata di sistema (`system()`/`exec()`): un classico caso di OS Command Injection, non di file upload. Vedi [08-Exploitation-PostEx/02-RCE-Techniques.md](/cheatsheet/ewpt/08-exploitation-postex/02-rce-techniques/):
```
127.0.0.1; id
127.0.0.1 && id
```

### 5. Privilege escalation via cron job

```bash
cat /etc/crontab
ls -la /var/www/*/  # cerca script eseguiti periodicamente e scrivibili dall'utente corrente
```
Se uno script eseguito da cron come root è scrivibile dal tuo utente, modificalo per ottenere una reverse shell privilegiata.

---

## Key Lessons

- Il DNS zone transfer, quando riuscito, è una delle scoperte più preziose e sottovalutate della recon passiva
- La stessa vulnerabilità (SQLi) può servire sia per bypass auth sia, in altri contesti, per estrazione dati: adatta l'obiettivo al contesto
- I cron job che eseguono script scrivibili da utenti a basso privilegio sono un vettore di privesc estremamente comune

---

## Connessioni

- **Combinazione con:** [01-Reconnaissance/01-Footprinting.md](/cheatsheet/ewpt/01-reconnaissance/01-footprinting/), [04-SQL-Injection/01-SQLi-Fundamentals.md](/cheatsheet/ewpt/04-sql-injection/01-sqli-fundamentals/), [08-Exploitation-PostEx/02-RCE-Techniques.md](/cheatsheet/ewpt/08-exploitation-postex/02-rce-techniques/), [08-Exploitation-PostEx/05-Privilege-Escalation.md](/cheatsheet/ewpt/08-exploitation-postex/05-privilege-escalation/)
