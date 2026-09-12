# Web Fundamentals & HTTP

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [../00-Fundamentals/02-Networking-Basics.md](../00-Fundamentals/02-Networking-Basics.md)
**Lab:** INE PTS, Web module / DVWA

---

## Obiettivo

Da qui in poi il target smette di essere "una macchina con delle porte aperte" e diventa un'applicazione web, e serve un vocabolario diverso per parlarne. Prima di affrontare SQLi/XSS/LFI ti servono le basi HTTP: metodi, status code, struttura di richiesta/risposta, cookie/sessioni. L'eJPTv2 tratta il web solo a livello introduttivo rispetto a eWPT, ma queste basi sono comunque richieste e valgono anche fuori esame, ogni volta che apri Burp.

---

## Concetti chiave

### Metodi HTTP principali

| Metodo | Uso |
|--------|-----|
| GET | richiede una risorsa, parametri in query string |
| POST | invia dati nel body (form, upload, login) |
| HEAD | come GET ma solo header, nessun body |
| PUT | crea/sostituisce una risorsa |
| DELETE | elimina una risorsa |
| OPTIONS | elenca i metodi supportati da un endpoint |

### Status code principali

| Range | Significato | Esempi |
|-------|-------------|--------|
| 2xx | successo | 200 OK, 201 Created |
| 3xx | redirect | 301 Moved Permanently, 302 Found |
| 4xx | errore client | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| 5xx | errore server | 500 Internal Server Error, 502 Bad Gateway |

### Anatomia richiesta/risposta

```
GET /profile?id=42 HTTP/1.1
Host: target.com
Cookie: session=abc123
User-Agent: Mozilla/5.0
```

```
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: session=abc123; HttpOnly
Content-Length: 1523
```

### Cookie e sessioni

Dopo il login, il server assegna un cookie di sessione (`Set-Cookie`) che il browser reinvia a ogni richiesta successiva (`Cookie:`). Flag importanti: `HttpOnly` (non accessibile da JavaScript, mitiga XSS), `Secure` (solo su HTTPS), `SameSite` (limita invio cross-site, mitiga CSRF).

### Header di sicurezza (cenno)

| Header | Scopo |
|--------|-------|
| Content-Security-Policy | limita sorgenti di script/risorse caricabili |
| X-Frame-Options | previene clickjacking |
| Strict-Transport-Security | forza HTTPS |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| curl | `curl -sI http://target.com` | solo header risposta | rapido per status code/header |
| Burp Suite | proxy intercettivo | request/response completa | vedi [05-Burp-Suite-Basics.md](05-Burp-Suite-Basics.md) |
| browser DevTools | tab Network | tutte le richieste della pagina | utile senza configurare un proxy |

---

## Payload / Esempi

### Esempio 1: ispezione header con curl

```bash
curl -sI http://target.com/
```

**Output atteso:**
```
HTTP/1.1 200 OK
Server: Apache/2.4.41 (Ubuntu)
Set-Cookie: PHPSESSID=abc123def456; path=/
X-Powered-By: PHP/7.4.3
```

**Spiegazione:** `Server` e `X-Powered-By` rivelano stack tecnologico e versione, utili per cercare CVE noti in fase di vulnerability assessment.

### Esempio 2: differenza GET vs POST con curl

```bash
curl "http://target.com/login?user=admin&pass=admin"          # GET: dati visibili in URL/log
curl -X POST -d "user=admin&pass=admin" http://target.com/login  # POST: dati nel body
```

**Spiegazione:** i parametri GET finiscono in log server, history browser, referrer header: mai usare GET per dati sensibili come login.

---

## Lab Hands-On

### Lab 1: DVWA, osservazione richieste HTTP
**Obiettivo:** familiarizzare con request/response reali usando Burp/DevTools
**Difficulty:** Facile
**Time:** 20 min

**Walkthrough breve:**
1. Apri DVWA con Burp in proxy
2. Effettua login e osserva la richiesta POST e il cookie di sessione ricevuto
3. Naviga tra le pagine osservando come il cookie viene reinviato a ogni richiesta

---

## Common Mistakes

- Confondere status code 401 (non autenticato) con 403 (autenticato ma non autorizzato) -> cambia la strategia di test
- Ignorare gli header di risposta -> spesso rivelano tecnologia/versione utile per il resto dell'assessment

---

## Link Utili

- [MDN: HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP)

---

## Connessioni

- **Prerequisito:** [../00-Fundamentals/02-Networking-Basics.md](../00-Fundamentals/02-Networking-Basics.md)
- **Prossimo Step:** [02-SQL-Injection-Basics.md](02-SQL-Injection-Basics.md)
- **Combinazione con:** [05-Burp-Suite-Basics.md](05-Burp-Suite-Basics.md)

---

## Checklist di padronanza

- [ ] Conosco i metodi HTTP principali e quando si usano
- [ ] So leggere status code comuni
- [ ] Capisco come funzionano cookie/sessioni e i flag di sicurezza principali

