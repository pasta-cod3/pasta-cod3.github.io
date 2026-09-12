# Price Manipulation

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [04-Timing-Attacks.md](04-Timing-Attacks.md)
**Lab:** PortSwigger Academy: High-level logic vulnerabilities (checkout)

---

## Obiettivo

Sembra troppo semplice per essere vero, e infatti la prima volta che lo trovi resti un attimo scettico: apri Burp, cambi un `199.99` in `0.01` nel body della richiesta di checkout, e l'ordine passa. Eppure succede più spesso di quanto pensi, perché il fronte-end calcola il totale per mostrarlo all'utente, ma se il back-end non lo ricalcola davvero dal catalogo prima di confermare il pagamento, si sta fidando di un numero che tu controlli. Il lavoro qui è sistematico: ogni campo numerico o monetario della richiesta di checkout è un candidato, uno alla volta.

---

## Concetti chiave

### Dove il client NON dovrebbe mai essere la fonte di verità

| Campo | Rischio se controllato dal client |
|-------|--------------------------------------|
| Prezzo unitario | acquisto a prezzo arbitrario |
| Quantità negativa | credito invece di addebito |
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

**Output atteso:** ordine confermato al prezzo modificato: conferma che il totale non viene validato server-side contro il catalogo reale.

### Esempio 2: hidden field tampering (non serve nemmeno un proxy)

Alcune applicazioni più datate/semplici passano il prezzo tramite un campo nascosto del form HTML invece che via API JSON:

```html
<form method="POST" action="/add-to-cart">
  <input type="hidden" name="product_id" value="42">
  <input type="hidden" name="price" value="199.99">
  <button type="submit">Aggiungi al carrello</button>
</form>
```

**Step-by-step:**
```
1. Visualizza il sorgente della pagina (o DevTools -> Elements) e individua l'input hidden "price"
2. Modifica il valore direttamente nel DOM (DevTools) oppure salva la pagina, edita l'HTML e riinvia il form
3. Invia il form modificato
```

**Spiegazione:** a differenza della manipolazione via Burp Proxy (che intercetta il traffico), qui il valore è già esposto e modificabile lato client prima ancora che la richiesta parta, quindi non serve nemmeno un tool di intercettazione. La vulnerabilità di fondo è identica: il server si fida di un valore che il client può controllare invece di ricalcolarlo dal catalogo/DB usando `product_id` come unica chiave affidabile.

### Esempio 3: quantità negativa per ottenere credito

```json
{"item_id": 42, "price": 50.00, "qty": -5}
```

**Spiegazione:** se il totale è calcolato come `price * qty` senza validare che `qty` sia positivo, un valore negativo può generare un totale negativo, potenzialmente accreditato invece che addebitato al conto utente.

### Esempio 4: manipolazione valuta per arbitraggio

```json
{"item_id": 42, "price": 199.99, "currency": "USD"}
```
Modificato in:
```json
{"item_id": 42, "price": 199.99, "currency": "JPY"}
```

**Spiegazione:** se il server accetta la valuta dal client senza ricalcolare l'importo nel tasso di cambio corretto, puoi pagare l'equivalente di pochi centesimi in una valuta invece del prezzo reale nell'altra.

### Esempio 5: applicazione multipla dello stesso coupon (combina con race condition)

Vedi [02-Race-Conditions.md](02-Race-Conditions.md) per la tecnica di invio parallelo: applicabile qui per applicare lo stesso sconto più volte sullo stesso ordine.

### Esempio 6: manipolare il totale finale saltando il ricalcolo

```
1. Aggiungi articoli costosi al carrello
2. Al passaggio finale (conferma pagamento), intercetta e osserva se il totale è ricalcolato o semplicemente "passato" da uno step al successivo
3. Se il totale finale è un campo hidden/parametro riusato, modificalo direttamente
```

---

## Evasion / Bypass Techniques

Non applicabile come WAF evasion; il punto è testare sistematicamente OGNI campo numerico/monetario della richiesta di checkout, uno alla volta, osservando se il server lo accetta senza validazione.

---

## Lab Hands-On

### Lab 1 (PortSwigger): Logic flaw allowing negative product quantities
**Obiettivo:** ottenere credito tramite quantità negativa
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Intercetta la richiesta di aggiunta al carrello
2. Modifica la quantita a un valore negativo
3. Verifica l'effetto sul totale/saldo finale

---

## Common Mistakes

- Testare solo il prezzo e non anche quantità/valuta/sconto -> ogni campo numerico è un candidato separato
- Non verificare il totale finale dopo ogni manipolazione -> a volte il server "sanitizza" un campo ma non il totale derivato

---

## Link Utili

- [PortSwigger: Business logic vulnerabilities](https://portswigger.net/web-security/logic-flaws)

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

