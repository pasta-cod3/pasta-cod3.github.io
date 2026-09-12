---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "SQLi Fundamentals"
permalink: "/cheatsheet/ewpt/04-sql-injection/01-sqli-fundamentals/"
section: "SQL Injection"
section_order: 4
order: 1
sort_key: 401
---

**Difficoltà:** Intermediate
**Time to Master:** 3h
**Prerequisiti:** [02-Scanning-Enumeration/03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/)
**Lab:** PortSwigger Academy: SQL injection

---

## Obiettivo

Una query SQL costruita concatenando l'input dell'utente senza controlli è come una frase a cui manca la punteggiatura giusta: basta chiudere una stringa nel punto sbagliato (o giusto, dal tuo punto di vista) e il database esegue tutt'altro rispetto a quello che lo sviluppatore aveva in mente. Qui capisci il meccanismo di base — il perché, non solo il come — perché è la fondamenta su cui poggiano tutte le varianti (error/union/blind) che vedi nei file successivi.

---

## Concetti chiave

### Perché funziona

```sql
-- Query originale nell'applicazione:
SELECT * FROM users WHERE username='INPUT' AND password='INPUT2'

-- Se INPUT = admin' --
SELECT * FROM users WHERE username='admin' --' AND password='INPUT2'
-- il -- commenta il resto: login come admin senza sapere la password
```

### Punti di injection comuni

| Punto | Esempio |
|-------|---------|
| Parametro GET | `?id=1` |
| Campo form/POST | login, ricerca |
| Header HTTP | `User-Agent`, `X-Forwarded-For` (loggati in DB) |
| Cookie | valori riflessi in query |

### Identificare il DB engine dal comportamento

| Test | MySQL | MSSQL | PostgreSQL | Oracle |
|------|-------|-------|------------|--------|
| commento | `-- ` o `#` | `--` | `--` | `--` |
| concatenazione | `CONCAT(a,b)` | `a + b` | `a \|\| b` | `a \|\| b` |
| stringa versione | `SELECT version()` | `SELECT @@version` | `SELECT version()` | `SELECT banner FROM v$version` |
| sleep | `SLEEP(5)` | `WAITFOR DELAY '0:0:5'` | `pg_sleep(5)` | `DBMS_LOCK.SLEEP(5)` |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | modifica parametro a mano | risposta diretta | primo strumento da usare, sempre |
| sqlmap | `sqlmap -u URL --batch` | conferma automatica | vedi [07-SQLMap-Automation.md](/cheatsheet/ewpt/04-sql-injection/07-sqlmap-automation/) |

---

## Payload / Esempi

### Esempio 1: test di base per confermare SQLi

```sql
' OR 1=1 --
' OR '1'='1
" OR 1=1 --
1 OR 1=1
1' AND '1'='1
1' AND '1'='2
```

**Spiegazione:** se `'1'='1` restituisce risultati diversi da `'1'='2'`, l'input influenza la query, a conferma dell'injection prima ancora di sapere il tipo esatto (error/union/blind).

### Esempio 2: identificare il numero di colonne (necessario per UNION, vedi file dedicato)

```sql
' ORDER BY 1 --
' ORDER BY 2 --
' ORDER BY 3 --   -- errore qui = la tabella ha 2 colonne
```

---

## Evasion / Bypass Techniques

Vedi [06-Encoding-Bypasses.md](/cheatsheet/ewpt/04-sql-injection/06-encoding-bypasses/) per la lista completa: qui solo la logica di base, se il carattere `'` viene filtrato, prova a chiudere il contesto con `"`, backtick, o senza quote (contesto numerico).

---

## Lab Hands-On

### Lab 1: PortSwigger: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data
**Obiettivo:** bypassare un filtro categoria per vedere prodotti nascosti
**Difficulty:** Facile
**Time:** 20 min

**Walkthrough breve:**
1. Identifica il parametro vulnerabile (es. `?category=Gifts`)
2. Testa `' OR 1=1--`
3. Osserva risultati aggiuntivi restituiti

---

## Common Mistakes

- Testare solo l'apice singolo `'` -> alcune query usano doppi apici o nessuna quote (contesto numerico)
- Non commentare correttamente il resto della query -> ricorda lo spazio dopo `--` in molti DB engine
- Ignorare i messaggi di errore -> spesso rivelano il DB engine esatto, guida tutte le tecniche successive

---

## Link Utili

- [PortSwigger Academy: SQL injection](https://portswigger.net/web-security/sql-injection)
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)

---

## Connessioni

- **Prerequisito:** [02-Scanning-Enumeration/03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/)
- **Prossimo Step:** [02-Error-Based-SQLi.md](/cheatsheet/ewpt/04-sql-injection/02-error-based-sqli/)
- **Combinazione con:** [06-Authentication-Authorization/05-Credential-Attacks.md](/cheatsheet/ewpt/06-authentication-authorization/05-credential-attacks/)

---

## Checklist di padronanza

- [ ] So confermare una SQLi con test base
- [ ] So identificare il DB engine dal comportamento
- [ ] So contare le colonne con ORDER BY
- [ ] Capisco perché il commento SQL "spezza" la query originale
