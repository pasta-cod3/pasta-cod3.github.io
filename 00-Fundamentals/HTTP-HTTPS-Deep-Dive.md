# HTTP/HTTPS Deep Dive

**Difficolta:** Beginner
**Time to Master:** 4h
**Prerequisiti:** [Networking-Basics.md](Networking-Basics.md)
**Lab:** PortSwigger Academy — HTTP basics

---

## Obiettivo

Capire a fondo richieste/risposte HTTP, header critici, cookie e sessioni: e la base assoluta di tutto il web hacking. Ogni vulnerabilita che vedrai (SQLi, XSS, IDOR, CSRF) si manifesta dentro una request/response HTTP che devi saper leggere e modificare a mano.

---

## Concetti chiave

### Anatomia di una richiesta

```
GET /profile?id=42 HTTP/1.1
Host: target.com
Cookie: session=abc123
User-Agent: Mozilla/5.0
Accept: text/html

```

### Metodi HTTP rilevanti

| Metodo | Uso | Rischio tipico |
|--------|-----|-----------------|
| GET | lettura, parametri in URL | dati sensibili in log/history |
| POST | invio dati, form | CSRF se manca token |
| PUT/DELETE | REST API | spesso mancano controlli auth (IDOR) |
| OPTIONS | discovery metodi supportati | rivela metodi non protetti |

### Header di sicurezza da controllare sempre

| Header | Significato se assente |
|--------|--------------------------|
| `X-Frame-Options` | possibile clickjacking |
| `Content-Security-Policy` | XSS piu facile da eseguire |
| `Strict-Transport-Security` | possibile downgrade HTTP |
| `Set-Cookie: ...; HttpOnly; Secure; SameSite=Strict` | cookie rubabile via JS/rete |

### Status code utili in enumerazione

| Code | Significato |
|------|--------------|
| 200 | OK |
| 301/302 | redirect — segui sempre, puo rivelare path reali |
| 401/403 | risorsa esiste ma accesso negato — bersaglio per bypass |
| 404 | non esiste (attenzione ai custom 404 "soft 404") |
| 500 | errore server — spesso fonte di stack trace utile |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| curl | `curl -v http://target.com` | request+response raw | `-I` solo header |
| Burp Repeater | intercetta -> Send to Repeater | modifica/rinvia richiesta | core tool per test manuale |
| Burp Proxy | intercept ON | intercetta traffico browser | vedi [Burp-Suite-Setup.md](Burp-Suite-Setup.md) |

---

## Payload / Esempi

### Esempio 1: leggere request/response completa con curl

```bash
curl -v -X GET "http://target.com/profile?id=42" \
  -H "Cookie: session=abc123" \
  -H "User-Agent: Mozilla/5.0"
```

**Output atteso:**
```
> GET /profile?id=42 HTTP/1.1
> Host: target.com
> Cookie: session=abc123
<
< HTTP/1.1 200 OK
< Set-Cookie: session=abc123; HttpOnly
```

**Spiegazione:** `-v` mostra sia la request inviata (`>`) sia la response ricevuta (`<`); e l'equivalente CLI di guardare Burp Proxy history.

### Esempio 2: forzare un metodo diverso per bypassare un controllo

```bash
curl -X POST http://target.com/api/admin/delete -d "id=5"
curl -X PUT http://target.com/api/admin/delete -d "id=5"
```

**Spiegazione:** alcune ACL sono scritte solo per GET/POST; testare metodi alternativi (PUT, DELETE, PATCH, persino verbi custom) puo bypassare controlli mal implementati.

---

## Evasion / Bypass Techniques

### Method override header
```
X-HTTP-Method-Override: DELETE
```
Alcuni framework leggono questo header per simulare metodi non supportati dal client.

### Header spoofing per bypass IP-based ACL
```
X-Forwarded-For: 127.0.0.1
X-Originating-IP: 127.0.0.1
X-Remote-IP: 127.0.0.1
X-Client-IP: 127.0.0.1
```

---

## Lab Hands-On

### Lab 1: PortSwigger Academy — HTTP request smuggling (intro)
**Obiettivo:** capire come vengono parsate le request in presenza di piu server
**Difficulty:** Medio
**Time:** 1h

**Walkthrough breve:**
1. Analizza header `Content-Length` vs `Transfer-Encoding`
2. Osserva come proxy e backend possono disaccordare sul confine della request
3. Nota che e un argomento avanzato, utile ma non centrale in eWPT

---

## Common Mistakes

- Ignorare i redirect (301/302) senza seguirli -> puoi perdere path/parametri interessanti
- Testare solo GET/POST -> molte API REST usano PUT/DELETE/PATCH con controlli diversi
- Non guardare i cookie flag (`HttpOnly`, `Secure`, `SameSite`) -> indizio diretto su session hijacking possibile

---

## Link Utili

- [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [PortSwigger Academy](https://portswigger.net/web-security)

---

## Connessioni

- **Prerequisito:** [Networking-Basics.md](Networking-Basics.md)
- **Prossimo Step:** [Linux-for-WebHacking.md](Linux-for-WebHacking.md)
- **Combinazione con:** [06-Authentication-Authorization/01-Session-Management.md](../06-Authentication-Authorization/01-Session-Management.md)

---

## Checklist di padronanza

- [ ] So leggere request/response raw a mano
- [ ] Conosco i metodi HTTP e quando testarli tutti
- [ ] So riconoscere header di sicurezza mancanti
- [ ] Ho praticato con curl senza usare solo Burp

---

## Note personali

_(spazio libero)_
