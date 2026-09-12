# Burp Suite Setup

**Difficolta:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [HTTP-HTTPS-Deep-Dive.md](HTTP-HTTPS-Deep-Dive.md)
**Lab:** PortSwigger Academy — Burp Suite Essentials

---

## Obiettivo

Configurare Burp Suite come strumento centrale per tutto l'esame eWPT: proxy, certificato, workflow Proxy/Repeater/Intruder/Decoder. Senza un setup solido perdi tempo prezioso durante l'esame.

---

## Concetti chiave

### Componenti principali

| Componente | Uso |
|------------|-----|
| Proxy | intercetta traffico browser <-> server |
| Repeater | rinvia/modifica singole richieste a mano |
| Intruder | fuzzing automatizzato (bruteforce, payload injection) |
| Decoder | encode/decode Base64, URL, Hex, HTML entity |
| Comparer | diff tra due response/request |
| Target/Sitemap | mappa passiva del sito visitato |

### Flusso tipico

```
Browser -> Burp Proxy (127.0.0.1:8080) -> Target
                |
                v
         Proxy History -> Send to Repeater / Intruder
```

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Proxy | Proxy > Options > Add listener 127.0.0.1:8080 | intercetta traffico | imposta anche su FoxyProxy nel browser |
| Burp CA cert | http://burp (con proxy attivo) | scarica cacert.der | necessario per intercettare HTTPS |

---

## Payload / Esempi

### Esempio 1: setup proxy da zero

**Step-by-step:**
```
1. Apri Burp Suite -> Proxy -> Options -> verifica listener 127.0.0.1:8080 attivo
2. Nel browser installa FoxyProxy, punta a 127.0.0.1:8080
3. Con proxy attivo, naviga su http://burp e scarica il certificato CA
4. Importa il certificato nel browser (Settings > Privacy > Certificates > Import)
5. Verifica: naviga su un sito HTTPS, non deve comparire warning certificato
```

**Output atteso:** traffico HTTPS intercettato senza errori di certificato nel browser.

**Spiegazione:** Burp fa da man-in-the-middle: firma al volo un certificato per ogni dominio visitato usando la propria CA, che il browser deve fidarsi esplicitamente.

### Esempio 2: workflow Repeater base

```
1. In Proxy > HTTP history, trova la richiesta interessante (es. login POST)
2. Click destro -> Send to Repeater
3. In Repeater modifica il parametro (es. username=admin' OR '1'='1)
4. Click Send, analizza la response
```

---

## Evasion / Bypass Techniques

### Match and Replace per bypassare controlli client-side
```
Proxy > Options > Match and Replace
Match: Content-Security-Policy: .*
Replace: (vuoto)
```
Rimuove la CSP dalle response per testare XSS senza restrizioni durante l'analisi (solo in ambiente di test autorizzato).

---

## Lab Hands-On

### Lab 1: PortSwigger — Burp Suite Essentials
**Obiettivo:** consolidare Proxy/Repeater/Intruder/Decoder
**Difficulty:** Facile
**Time:** 1h

**Walkthrough breve:**
1. Completa i task guidati di PortSwigger sul setup di Burp
2. Pratica invio richieste multiple con Intruder (Sniper mode)
3. Usa Decoder per convertire un payload in Base64 e viceversa

---

## Common Mistakes

- Dimenticare di importare il certificato CA -> tutte le richieste HTTPS falliscono con warning
- Lasciare Intercept ON durante la navigazione normale -> browsing bloccato ad ogni richiesta, disattivalo e usa solo Proxy History
- Non salvare mai il progetto Burp -> usa "New Project on disk" per non perdere la history in caso di crash

---

## Link Utili

- [PortSwigger Burp Suite Docs](https://portswigger.net/burp/documentation)
- [FoxyProxy](https://getfoxyproxy.org/)

---

## Connessioni

- **Prerequisito:** [HTTP-HTTPS-Deep-Dive.md](HTTP-HTTPS-Deep-Dive.md)
- **Prossimo Step:** [01-Reconnaissance/01-Footprinting.md](../01-Reconnaissance/01-Footprinting.md)
- **Combinazione con:** [09-Tools-Reference/Burp-Suite-Recipes.md](../09-Tools-Reference/Burp-Suite-Recipes.md)

---

## Checklist di padronanza

- [ ] Proxy configurato e funzionante su HTTP e HTTPS
- [ ] So usare Repeater per modificare/rinviare richieste
- [ ] So usare Decoder per encoding/decoding rapido
- [ ] Ho salvato un progetto Burp persistente per lo studio

---

## Note personali

_(spazio libero)_
