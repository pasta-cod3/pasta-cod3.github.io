# Business Logic Flaws

**Difficoltà:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [06-Authentication-Authorization/04-IDOR.md](../06-Authentication-Authorization/04-IDOR.md)
**Lab:** PortSwigger Academy: Business logic vulnerabilities

---

## Obiettivo

Qui cambi completamente approccio rispetto a SQLi o XSS: non stai cercando un carattere che il parser interpreta male, stai cercando un passaggio della LOGICA dell'applicazione che può essere saltato, ripetuto, invertito o eseguito fuori dall'ordine che lo sviluppatore aveva in mente. Nessuno scanner te lo trova, perché uno scanner non sa cosa "dovrebbe" succedere in quel workflow — lo sai solo tu, dopo averlo mappato con calma. È il tipo di vulnerabilità più soddisfacente da trovare in eWPT: non richiede exploit complessi, solo la domanda giusta al momento giusto.

---

## Concetti chiave

### Dove cercare logic flaw

| Area applicativa | Domanda da porsi |
|--------------------|--------------------|
| Multi-step form/checkout | posso saltare uno step andando direttamente all'ultimo? |
| Validazione lato client | cosa succede se disabilito JS o intercetto con Burp? |
| Limiti/quote | posso superare un limite ripetendo/parallelizzando la richiesta? |
| Stato/workflow | posso tornare a uno stato precedente dopo essere avanzato? |

### Principio guida

Ogni volta che vedi "Step 1 -> Step 2 -> Step 3", chiediti: cosa succede se salto direttamente a Step 3? Se richiamo Step 2 due volte? Se torno a Step 1 dopo aver completato Step 3?

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Proxy | intercetta ogni step del workflow | mappa completa richieste | fondamentale per capire la sequenza |
| Burp Repeater | rinvia step fuori ordine | risposta del server | test manuale principale |

---

## Payload / Esempi

### Esempio 1: bypass step di verifica in un flusso multi-step

**Setup:**
- Target: registrazione utente con step "email verification" prima dell'attivazione account
- Vulnerability: lo step finale di attivazione non verifica se lo step precedente è stato completato

**Step-by-step:**
```
1. Intercetta con Burp l'intero flusso: register -> verify_email -> activate
2. Nota l'ID/token passato tra gli step
3. Prova a chiamare direttamente /activate con un ID valido, saltando /verify_email
```

**Spiegazione:** se il server valida solo "l'ID esiste" e non "lo step precedente è stato completato con successo", l'intero controllo di verifica email è bypassabile.

### Esempio 2: validazione prezzo solo lato client

```
1. Intercetta la richiesta di checkout con Burp Proxy (Intercept ON)
2. Nota il campo "price" o "total" nel body della richiesta
3. Modifica il valore prima di inoltrare (es. da 100.00 a 0.01)
4. Forward la richiesta modificata
```

**Spiegazione:** se il server si fida del prezzo inviato dal client invece di ricalcolarlo server-side dal catalogo prodotti, questo permette manipolazione diretta del prezzo: vedi [05-Price-Manipulation.md](05-Price-Manipulation.md) per approfondimento.

### Esempio 3: coupon/sconto riutilizzabile oltre il limite previsto

```
1. Applica un coupon "usa una volta sola" al checkout
2. Invece di completare l'ordine, torna indietro e riapplica lo stesso coupon su un nuovo carrello
3. Verifica se il server traccia l'uso del coupon per sessione/utente o solo per singola transazione completata
```

---

## Evasion / Bypass Techniques

Non applicabile come WAF evasion; la "tecnica" è interamente nell'analisi del workflow e nell'individuare assunzioni implicite non verificate server-side.

---

## Lab Hands-On

### Lab 1 (PortSwigger): High-level logic vulnerability
**Obiettivo:** bypassare un controllo di flusso mal implementato
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Mappa l'intero workflow con Burp Proxy
2. Identifica assunzioni implicite (es. "l'utente arriva sempre da step precedente")
3. Testa chiamate dirette/fuori ordine agli endpoint

---

## Common Mistakes

- Testare solo il "percorso felice" (flusso previsto dall'app) -> le logic flaw vivono nei percorsi NON previsti
- Fidarsi della UI che nasconde/disabilita opzioni -> verifica sempre lato server con richieste dirette via Burp
- Non pensare come uno sviluppatore che assume "l'utente segue sempre l'ordine" -> quell'assunzione e spesso il punto debole

---

## Link Utili

- [PortSwigger: Business logic vulnerabilities](https://portswigger.net/web-security/logic-flaws)

---

## Connessioni

- **Prerequisito:** [06-Authentication-Authorization/04-IDOR.md](../06-Authentication-Authorization/04-IDOR.md)
- **Prossimo Step:** [02-Race-Conditions.md](02-Race-Conditions.md)

---

## Checklist di padronanza

- [ ] So mappare un intero workflow multi-step con Burp
- [ ] So identificare assunzioni implicite non verificate server-side
- [ ] So testare step fuori ordine/saltati

