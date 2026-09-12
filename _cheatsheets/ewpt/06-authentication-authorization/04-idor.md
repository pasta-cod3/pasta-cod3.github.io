---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "IDOR (Insecure Direct Object Reference)"
permalink: "/cheatsheet/ewpt/06-authentication-authorization/04-idor/"
section: "Authentication & Authorization"
section_order: 6
order: 4
sort_key: 604
---

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [03-CSRF-Attacks.md](/cheatsheet/ewpt/06-authentication-authorization/03-csrf-attacks/)
**Lab:** PortSwigger Academy, modulo Access control

---

## Obiettivo

Cambiare un numero nell'URL e vedere apparire il profilo di qualcun altro è probabilmente il momento più "questo non dovrebbe funzionare così" che proverai in tutto l'esame — ed è esattamente quello che serve per trovare un IDOR. Qui vedi come identificare endpoint che espongono risorse tramite identificatori diretti (ID numerico, UUID, filename) senza verificare che l'utente autenticato abbia effettivamente diritto ad accedervi: una delle vulnerabilità più frequenti e più redditizie in eWPT, perché richiede zero payload sofisticati.

---

## Concetti chiave

### Pattern tipico

```
GET /api/user/123/profile   <- il tuo profilo, id=123
GET /api/user/124/profile   <- prova a cambiare id: è il profilo di un altro utente?
```

Se la response restituisce dati dell'utente 124 senza errore di autorizzazione, è IDOR.

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

**Spiegazione:** un ID "non indovinabile" (UUID) non è una protezione se l'ID stesso trapela altrove nell'applicazione (notifiche, log pubblici, risposte di altre API).

### Esempio 3: enumerazione massiva con Burp Intruder

```
Payload position: /api/user/§123§/profile
Payload type: Numbers, range 1-1000
```

**Spiegazione:** automatizza il controllo su centinaia di ID in sequenza, filtrando poi per status code 200 e dimensione response diversa dal "not found" standard.

### Esempio 4: IDOR verticale, accesso a funzione admin cambiando solo il path

```bash
curl -b "session=TUO_COOKIE_UTENTE_NORMALE" "http://target.com/admin/users/delete?id=5"
```

**Spiegazione:** verifica sempre se endpoint admin sono raggiungibili anche da un utente con privilegi normali, semplicemente conoscendo il path (spesso "protetti" solo nascondendo il link nell'UI, non lato server).

### Esempio 5: IDOR su richieste POST/PUT (modifica dati di altri)

```bash
curl -b "session=TUO_COOKIE" -X PUT "http://target.com/api/user/124/email" -d "email=attacker@evil.com"
```

**Spiegazione:** l'IDOR non riguarda solo la lettura: la scrittura/modifica di risorse altrui è spesso ancora più grave (impatto: account takeover).

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

### Lab 1: PortSwigger, Insecure direct object references
**Obiettivo:** accedere a dati/documenti di un altro utente
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Identifica un endpoint con ID diretto nell'URL/body
2. Cambia l'ID con quello di un'altra risorsa/utente
3. Conferma accesso non autorizzato

---

## Common Mistakes

- Testare IDOR solo su GET -> testa sempre anche PUT/POST/DELETE, spesso meno controllati di quanto pensi
- Fermarsi al primo endpoint protetto -> un'app può avere controlli incoerenti tra endpoint diversi, quindi verificane sempre più di uno prima di concludere che è tutto a posto
- Non provare IDOR verticale (funzioni admin) -> spesso il controllo di ruolo manca del tutto lato server, non solo per quell'endpoint che hai già testato

---

## Link Utili

- [OWASP: Insecure Direct Object References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References)
- [PortSwigger: Access control vulnerabilities](https://portswigger.net/web-security/access-control)

---

## Connessioni

- **Prerequisito:** [03-CSRF-Attacks.md](/cheatsheet/ewpt/06-authentication-authorization/03-csrf-attacks/)
- **Prossimo Step:** [05-Credential-Attacks.md](/cheatsheet/ewpt/06-authentication-authorization/05-credential-attacks/)
- **Combinazione con:** [02-Scanning-Enumeration/05-API-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/05-api-enumeration/)

---

## Checklist di padronanza

- [ ] So testare IDOR orizzontale e verticale
- [ ] So automatizzare l'enumerazione ID con Burp Intruder
- [ ] Testo sempre lettura E scrittura, non solo GET
- [ ] So bypassare controlli 403 basati su path esatto
