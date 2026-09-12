---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "XSS Fundamentals"
permalink: "/cheatsheet/ewpt/05-cross-site-scripting/01-xss-fundamentals/"
section: "Cross-Site Scripting"
section_order: 5
order: 1
sort_key: 501
---

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [00-Fundamentals/HTTP-HTTPS-Deep-Dive.md](/cheatsheet/ewpt/00-fundamentals/http-https-deep-dive/)
**Lab:** PortSwigger Academy, XSS

---

## Obiettivo

La domanda da farti prima di qualsiasi payload non è "che script uso" ma "dove finisce esattamente il mio input nella pagina": in un tag HTML, in un attributo, dentro uno script inline? Da quella risposta discende tutto il resto. Qui vedi come riconoscere i punti dove l'input utente arriva nel DOM/HTML senza sanitizzazione, permettendo l'esecuzione di JavaScript arbitrario nel browser della vittima — la base su cui si appoggiano reflected, stored e DOM XSS, trattate nei file successivi.

---

## Concetti chiave

### I tre contesti di injection

| Contesto | Esempio | Payload adatto |
|----------|---------|-----------------|
| HTML body | `<div>INPUT</div>` | `<script>...</script>` |
| Attributo HTML | `<input value="INPUT">` | `" onmouseover="alert(1)` |
| JavaScript inline | `var x = "INPUT";` | `";alert(1);//` |

### Categorie di XSS

| Tipo | Dove vive il payload | Persistenza |
|------|------------------------|-------------|
| Reflected | riflesso subito nella response (URL/parametro) | nessuna, serve link malevolo |
| Stored | salvato nel DB, mostrato ad altri utenti | persistente, impatto maggiore |
| DOM-based | eseguito interamente lato client via JS | dipende dal sink JS coinvolto |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | payload manuale | risposta con/senza sanitizzazione | primo strumento |
| Browser DevTools | Console/Elements | verifica esecuzione reale | conferma visiva |
| XSS Hunter / webhook.site | riceve callback | conferma blind XSS | vedi [07-Cookie-Stealing.md](/cheatsheet/ewpt/05-cross-site-scripting/07-cookie-stealing/) |

---

## Payload / Esempi

### Esempio 1: test di conferma base

```html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
```

**Spiegazione:** se il popup di alert appare, l'input è riflesso senza sanitizzazione in un contesto HTML eseguibile; se non appare, controlla il sorgente della pagina (view-source) per capire come è stato filtrato/escaped l'input.

### Esempio 2: identificare il contesto esatto guardando il sorgente

```bash
curl "http://target.com/search?q=UNIQUESTRING123" | grep -A2 -B2 "UNIQUESTRING123"
```

**Spiegazione:** cerca sempre prima dove esattamente finisce il tuo input nel markup (dentro un tag? un attributo? uno script?) prima di scegliere il payload giusto.

---

## Evasion / Bypass Techniques

Vedi [06-WAF-Evasion.md](/cheatsheet/ewpt/05-cross-site-scripting/06-waf-evasion/) per la lista completa di bypass; qui solo il concetto: se `<script>` è filtrato, prova tag/handler alternativi come `<img onerror=>`, `<svg onload=>`.

---

## Lab Hands-On

### Lab 1: PortSwigger, Reflected XSS into HTML context with nothing encoded
**Obiettivo:** confermare XSS riflessa base
**Difficulty:** Facile
**Time:** 15 min

**Walkthrough breve:**
1. Trova un parametro riflesso nella pagina
2. Inserisci `<script>alert(1)</script>`
3. Conferma esecuzione del popup

---

## Common Mistakes

- Provare solo `<script>` -> è il primo tag che ogni filtro blocca, ma quasi sempre lasciano passare `<img onerror=>` o `<svg onload=>`
- Non guardare il sorgente HTML della risposta -> ti risparmia decine di tentativi a caso: il contesto esatto ti dice subito quale payload ha senso provare

---

## Link Utili

- [PortSwigger Academy: XSS](https://portswigger.net/web-security/cross-site-scripting)
- [OWASP XSS](https://owasp.org/www-community/attacks/xss/)

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/HTTP-HTTPS-Deep-Dive.md](/cheatsheet/ewpt/00-fundamentals/http-https-deep-dive/)
- **Prossimo Step:** [02-Reflected-XSS.md](/cheatsheet/ewpt/05-cross-site-scripting/02-reflected-xss/)

---

## Checklist di padronanza

- [ ] So distinguere reflected/stored/DOM XSS
- [ ] So identificare il contesto di injection dal sorgente HTML
- [ ] So costruire payload di conferma base
