# HTTP Verb Tampering

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [06-JWT-Exploitation.md](06-JWT-Exploitation.md)
**Lab:** PortSwigger Academy, HTTP request smuggling e ricerca manuale su target reali

---

## Obiettivo

Questo è uno di quei bug che quando lo trovi la prima volta ti chiedi "ma è davvero così semplice?". Sì. Un endpoint protetto da un controllo di autorizzazione scritto male, tipo `if (method == "GET") checkAuth();`, sta implicitamente dicendo che se arrivi con un metodo diverso il controllo non scatta. Cambi `GET` in `HEAD`, o in un metodo a caso come `GETX`, e ti ritrovi dentro. Non serve un exploit sofisticato: serve solo sapere che il "metodo" di una richiesta HTTP non è una lista chiusa di 4-5 verbi, ed è proprio quell'assunzione sbagliata che molti sviluppatori fanno senza accorgersene.

---

## Concetti chiave

### Perché il verb tampering funziona

Molti framework/server applicano regole ACL basate sul metodo HTTP esplicitamente elencato (`GET`, `POST`), spesso a livello di configurazione web server (es. regole Apache/Nginx "nega POST su /admin") separata dalla logica applicativa. Se l'applicazione sotto processa comunque la richiesta indipendentemente dal metodo, un metodo non previsto dalla regola ACL bypassa il controllo ma arriva comunque a eseguire l'azione.

### Metodi HTTP da conoscere oltre GET/POST

| Metodo | Uso previsto | Perché interessa in un test |
|--------|----------------|-------------------------------|
| `HEAD` | come GET ma senza body di risposta | spesso trattato come "equivalente a GET" dalla logica applicativa, ma alcune ACL lo dimenticano |
| `PUT` | crea/sostituisce una risorsa | se abilitato su un web server mal configurato, può permettere upload diretto di file (es. una webshell) |
| `DELETE` | elimina una risorsa | test di autorizzazione: puoi cancellare risorse di altri utenti? |
| `OPTIONS` | elenca i metodi supportati da un endpoint | prima cosa da controllare: ti dice cosa provare dopo |
| `TRACE` | eco della richiesta (debug) | storicamente abusato per Cross-Site Tracing (XST), oggi quasi sempre disabilitato |
| Metodo custom/inesistente (es. `FAKE`) | nessuno, non è uno standard | alcuni middleware di autenticazione fanno match esatto su una whitelist e ignorano tutto il resto, comportandosi come se non ci fosse alcun controllo |

---

## Strumenti

| Tool | Uso | Output | Note |
|------|-----|--------|------|
| curl -X | `curl -X OPTIONS https://target.com/admin -i` | header `Allow` con i metodi supportati | primo comando da lanciare su ogni endpoint sospetto |
| Burp Repeater | cambiare il metodo di una richiesta intercettata e rispedirla | risposta del server con metodo alterato | il modo più comodo per iterare rapidamente sui metodi |

---

## Payload / Esempi

### Esempio 1: enumerare i metodi supportati con OPTIONS

```bash
curl -X OPTIONS https://target.com/api/admin/users -i
```

**Output atteso:**
```
HTTP/1.1 204 No Content
Allow: GET, POST, PUT, DELETE, OPTIONS
```

**Spiegazione:** l'header `Allow` ti dice esattamente quali metodi il server accetta su quell'endpoint: se vedi `PUT`/`DELETE` abilitati su una risorsa che dovrebbe essere solo in lettura, è il primo indizio da approfondire.

### Esempio 2: bypassare un controllo ACL basato sul metodo

```
# Bloccato dall'ACL (regola: nega POST su /admin/delete-user)
POST /admin/delete-user?id=42 HTTP/1.1

# L'endpoint accetta comunque HEAD, e la logica applicativa non distingue
HEAD /admin/delete-user?id=42 HTTP/1.1
```

**Spiegazione:** se la regola di blocco è scritta per un metodo specifico e la logica sotto esegue l'azione indipendentemente dal metodo ricevuto, basta cambiarlo per bypassare il controllo; verifica sempre l'effetto reale (la risorsa è stata davvero modificata?) e non fermarti al solo status code 200.

### Esempio 3: PUT abilitato su un web server mal configurato

```bash
curl -X PUT https://target.com/uploads/shell.php --data-binary @shell.php
curl https://target.com/uploads/shell.php?cmd=id
```

**Spiegazione:** se il web server accetta `PUT` senza autenticazione (capita più spesso di quanto sembri su configurazioni di default non irrobustite), è equivalente a un file upload libero: da qui il salto a RCE è diretto, vedi [08-Exploitation-PostEx/01-File-Upload-Abuse.md](../08-Exploitation-PostEx/01-File-Upload-Abuse.md).

---

## Evasion / Bypass Techniques

- Se il metodo standard è bloccato, prova a sovrascriverlo via header invece che nella request line: `X-HTTP-Method-Override: DELETE` su una richiesta POST, alcuni framework lo rispettano
- Alcuni proxy/WAF filtrano solo GET/POST/PUT/DELETE esplicitamente: un metodo custom inventato (`X-CUSTOM`) a volte passa indisturbato fino all'applicazione
- Non fermarti al primo 403/405: prova la stessa richiesta con case diverso nel metodo (`Get` invece di `GET`) su stack particolarmente permissivi, anche se è raro che faccia differenza

---

## Lab Hands-On

### Lab 1: enumerazione manuale su target di lab (HTB/TryHackMe con pannello admin)
**Obiettivo:** trovare un endpoint con controllo di autorizzazione debole basato sul metodo HTTP
**Difficulty:** Medio
**Time:** 45 min

**Walkthrough breve:**
1. Mappa gli endpoint sensibili dell'applicazione (pannelli admin, azioni di modifica/cancellazione)
2. Per ognuno, lancia `OPTIONS` per vedere i metodi dichiarati supportati
3. Prova a raggiungere lo stesso endpoint con un metodo diverso da quello previsto e verifica se l'azione viene comunque eseguita

---

## Common Mistakes

- Fermarsi al codice di stato senza verificare l'effetto reale -> un 200 con `HEAD` non prova nulla se non controlli che l'azione sia davvero avvenuta (record cancellato, valore modificato)
- Testare solo GET/POST/PUT/DELETE e ignorare metodi custom inventati -> a volte è proprio un metodo inesistente a bypassare un middleware scritto con una whitelist troppo rigida
- Dare per scontato che `OPTIONS` dica sempre la verità -> alcuni server rispondono con un `Allow` statico di configurazione che non riflette cosa la logica applicativa accetta davvero: verifica sempre con un tentativo reale

---

## Link Utili

- [OWASP: Testing HTTP Methods](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/)
- [PortSwigger: HTTP request smuggling](https://portswigger.net/web-security/request-smuggling)

---

## Connessioni

- **Prerequisito:** [06-JWT-Exploitation.md](06-JWT-Exploitation.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [04-IDOR.md](04-IDOR.md)

---

## Checklist di padronanza

- [ ] So enumerare i metodi supportati da un endpoint con OPTIONS
- [ ] So testare un controllo ACL cambiando metodo (HEAD, metodo custom)
- [ ] Capisco come PUT abilitato su un web server può portare a RCE
- [ ] Verifico sempre l'effetto reale dell'azione, non solo lo status code

