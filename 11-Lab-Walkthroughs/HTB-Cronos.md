# HTB — Cronos (Walkthrough Notes)

**Difficulty:** Medium
**Time to root (stimato):** 2h
**Vulnerability:** DNS zone transfer -> vhost enumeration -> SQL Injection -> RCE via webshell -> cron job privesc

---

## Obiettivo

Macchina Linux che copre l'intera catena di metodologia eWPT: DNS recon, virtual host discovery, SQL injection per bypass autenticazione, upload webshell, e privilege escalation tramite cron job mal configurato.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon DNS
```bash
dig axfr target.com @target.com
```
Un DNS zone transfer riuscito rivela subdomain/vhost non altrimenti scopribili — vedi [01-Reconnaissance/01-Footprinting.md](../01-Reconnaissance/01-Footprinting.md).

### 2. Virtual host discovery
Aggiungi i vhost trovati a `/etc/hosts` e ripeti l'enumerazione web su ciascuno, seguendo [02-Scanning-Enumeration/04-Virtual-Host-Enum.md](../02-Scanning-Enumeration/04-Virtual-Host-Enum.md).

### 3. SQL injection su pannello di login
Testa il form di login con i payload base di [04-SQL-Injection/01-SQLi-Fundamentals.md](../04-SQL-Injection/01-SQLi-Fundamentals.md):
```
' OR 1=1 --
```
Se il bypass funziona, sei dentro un pannello amministrativo.

### 4. RCE via funzionalita admin (upload/edit file)

Molti pannelli admin di questo tipo offrono una funzionalita di editing/upload file direttamente sfruttabile per caricare una webshell — vedi [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md).

### 5. Privilege escalation via cron job

```bash
cat /etc/crontab
ls -la /var/www/*/  # cerca script eseguiti periodicamente e scrivibili dall'utente corrente
```
Se uno script eseguito da cron come root e scrivibile dal tuo utente, modificalo per ottenere una reverse shell privilegiata.

---

## Key Lessons

- Il DNS zone transfer, quando riuscito, e una delle scoperte piu preziose e sottovalutate della recon passiva
- La stessa vulnerabilita (SQLi) puo servire sia per bypass auth sia, in altri contesti, per estrazione dati — adatta l'obiettivo al contesto
- I cron job che eseguono script scrivibili da utenti a basso privilegio sono un vettore di privesc estremamente comune

---

## Connessioni

- **Combinazione con:** [01-Reconnaissance/01-Footprinting.md](../01-Reconnaissance/01-Footprinting.md), [04-SQL-Injection/01-SQLi-Fundamentals.md](../04-SQL-Injection/01-SQLi-Fundamentals.md), [08-Exploitation-PostEx/05-Privilege-Escalation.md](../08-Exploitation-PostEx/05-Privilege-Escalation.md)

---

## Note personali

_(annota qui i tuoi comandi esatti e le differenze rispetto a queste note generiche)_
