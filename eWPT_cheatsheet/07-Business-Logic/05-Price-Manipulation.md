# Price Manipulation

**Difficolta:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [04-Timing-Attacks.md](04-Timing-Attacks.md)
**Lab:** PortSwigger Academy — High-level logic vulnerabilities (checkout)

---

## Obiettivo

Individuare flussi di checkout/ordine che si fidano di valori (prezzo, quantita, valuta, sconto) inviati dal client invece di ricalcolarli server-side, permettendo manipolazione diretta del totale pagato.

---

## Concetti chiave

### Dove il client NON dovrebbe mai essere la fonte di verita

| Campo | Rischio se controllato dal client |
|-------|--------------------------------------|
| Prezzo unitario | acquisto a prezzo arbitrario |
| Quantita negativa | credito invece di addebito |
| Valuta | arbitraggio tra tassi di cambio diversi |
| Sconto/coupon percentuale | sconto oltre il previsto |
| Costo di spedizione | spedizione gratuita non autorizzata |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Proxy (Intercept ON) | modifica body richiesta al volo | risposta con prezzo alterato | principale |
| Burp Repeater | replica e modifica richiesta di checkout | conferma manipolazione | verifica ripetibile |

---

## Payload / Esempi

### Esempio 1: modifica diretta del prezzo nel body della richiesta

**Setup:**
- Target: endpoint checkout che accetta `price` nel body JSON/form
- Vulnerability: il server non ricalcola il prezzo dal catalogo

**Step-by-step:**
```
1. Intercetta la richiesta POST /checkout con Burp Proxy
2. Nota il campo: {"item_id": 42, "price": 199.99, "qty": 1}
3. Modifica: {"item_id": 42, "price": 0.01, "qty": 1}
4. Forward la richiesta
```

**Output atteso:** ordine confermato al prezzo modificato — conferma che il totale non viene validato server-side contro il catalogo reale.

### Esempio 2: quantita negativa per ottenere credito

```json
{"item_id": 42, "price": 50.00, "qty": -5}
```

**Spiegazione:** se il totale e calcolato come `price * qty` senza validare che `qty` sia positivo, un valore negativo puo generare un totale negativo, potenzialmente accreditato invece che addebitato al conto utente.

### Esempio 3: manipolazione valuta per arbitraggio

```json
{"item_id": 42, "price": 199.99, "currency": "USD"}
```
Modificato in:
```json
{"item_id": 42, "price": 199.99, "currency": "JPY"}
```

**Spiegazione:** se il server accetta la valuta dal client senza ricalcolare l'importo nel tasso di cambio corretto, puoi pagare l'equivalente di pochi centesimi in una valuta invece del prezzo reale nell'altra.

### Esempio 4: applicazione multipla dello stesso coupon (combina con race condition)

Vedi [02-Race-Conditions.md](02-Race-Conditions.md) per la tecnica di invio parallelo — applicabile qui per applicare lo stesso sconto piu volte sullo stesso ordine.

### Esempio 5: manipolare il totale finale saltando il ricalcolo

```
1. Aggiungi articoli costosi al carrello
2. Al passaggio finale (conferma pagamento), intercetta e osserva se il totale e ricalcolato o semplicemente "passato" da uno step al successivo
3. Se il totale finale e un campo hidden/parametro riusato, modificalo direttamente
```

---

## Evasion / Bypass Techniques

Non applicabile come WAF evasion; il punto e testare sistematicamente OGNI campo numerico/monetario della richiesta di checkout, uno alla volta, osservando se il server lo accetta senza validazione.

---

## Lab Hands-On

### Lab 1: PortSwigger — Logic flaw allowing negative product quantities
**Obiettivo:** ottenere credito tramite quantita negativa
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Intercetta la richiesta di aggiunta al carrello
2. Modifica la quantita a un valore negativo
3. Verifica l'effetto sul totale/saldo finale

---

## Common Mistakes

- Testare solo il prezzo e non anche quantita/valuta/sconto -> ogni campo numerico e un candidato separato
- Non verificare il totale finale dopo ogni manipolazione -> a volte il server "sanitizza" un campo ma non il totale derivato

---

## Link Utili

- [PortSwigger — Business logic vulnerabilities](https://portswigger.net/web-security/logic-flaws)

---

## Connessioni

- **Prerequisito:** [04-Timing-Attacks.md](04-Timing-Attacks.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [02-Race-Conditions.md](02-Race-Conditions.md)

---

## Checklist di padronanza

- [ ] So identificare campi monetari/quantita nel body di checkout
- [ ] So testare manipolazione prezzo/quantita/valuta sistematicamente
- [ ] So combinare price manipulation con race condition per impatto maggiore

---

## Note personali

_(spazio libero)_
