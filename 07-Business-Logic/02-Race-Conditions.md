# Race Conditions

**Difficolta:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [01-Logic-Flaws.md](01-Logic-Flaws.md)
**Lab:** PortSwigger Academy — Race conditions

---

## Obiettivo

Sfruttare finestre temporali dove operazioni concorrenti non sono gestite atomicamente lato server (mancanza di lock/transazioni), permettendo di superare limiti previsti eseguendo la stessa azione piu volte in parallelo.

---

## Concetti chiave

### Principio TOCTOU (Time-Of-Check to Time-Of-Use)

```
1. Server controlla: "saldo sufficiente?" -> si
2. Server esegue: scala il saldo
```
Se tra il controllo (1) e l'esecuzione (2) arrivano PIU richieste in parallelo, ognuna puo passare il controllo prima che il saldo venga effettivamente aggiornato — risultato: N operazioni completate quando solo 1 doveva essere possibile.

### Dove cercare

| Contesto | Esempio |
|----------|---------|
| Redeem coupon "una volta sola" | applicalo N volte in parallelo |
| Trasferimento/prelievo fondi | preleva piu del saldo disponibile |
| Iscrizione a evento con posti limitati | supera il limite massimo |
| Rate-limit su tentativi (es. OTP) | bypassa il conteggio con richieste simultanee |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater (Send group in parallel) | invia N richieste identiche simultaneamente | risultati per ogni richiesta | funzione nativa Burp 2023+ |
| Turbo Intruder | script Python per richieste HTTP/2 single-packet | massima precisione temporale | estensione Burp dedicata a race condition |

---

## Payload / Esempi

### Esempio 1: race condition su redeem coupon con Burp Repeater

**Setup:**
- Target: endpoint `/redeem-coupon` utilizzabile "una volta sola" per utente
- Vulnerability: controllo "gia usato?" non atomico con l'aggiornamento del flag

**Step-by-step:**
```
1. Cattura la richiesta di redeem con Burp Proxy
2. Send to Repeater, poi duplica la scheda 5-10 volte (stesso identico gruppo)
3. Seleziona tutte le schede -> "Send group in parallel" (single-packet attack)
4. Osserva quante richieste restituiscono "successo" invece di solo una
```

**Output atteso:** se piu di una richiesta restituisce successo, il coupon e stato applicato piu volte nonostante il limite "una volta sola".

### Esempio 2: race condition con Turbo Intruder (piu preciso su target con alta latenza di rete)

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint,
                            concurrentConnections=10,
                            engine=Engine.BURP2)
    for i in range(10):
        engine.queue(target.req, gate='race1')
    engine.openGate('race1')

def handleResponse(req, interesting):
    table.add(req)
```

**Spiegazione:** Turbo Intruder invia le richieste "in gate" (accodate e rilasciate simultaneamente), riducendo al minimo la finestra temporale tra le richieste rispetto all'invio manuale — piu affidabile su connessioni con latenza variabile.

### Esempio 3: race condition su limite di iscrizione eventi

```
1. Identifica l'endpoint POST /event/123/register con limite "max 1 posto per utente"
2. Duplica ed invia in parallelo 5 richieste identiche con la stessa sessione
3. Verifica nel pannello utente se sono state create piu iscrizioni per lo stesso evento
```

---

## Evasion / Bypass Techniques

### Aumentare la probabilita di successo con richieste HTTP/2 single-packet

Il single-packet attack (supportato nativamente da Burp Repeater "Send group in parallel" su HTTP/2) invia tutte le richieste nello stesso pacchetto di rete, massimizzando le probabilita che il server le processi realmente in concorrenza invece che in sequenza.

---

## Lab Hands-On

### Lab 1: PortSwigger — Limit overrun race conditions
**Obiettivo:** superare un limite "una tantum" tramite richieste parallele
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Identifica un'azione con limite dichiarato (una volta sola / quota massima)
2. Invia richieste identiche in parallelo con Burp Repeater o Turbo Intruder
3. Verifica se il limite e stato superato

---

## Common Mistakes

- Inviare le richieste in sequenza rapida invece che veramente in parallelo -> usa "Send group in parallel" o Turbo Intruder, non click ripetuti manuali
- Non ripetere il test piu volte -> le race condition sono probabilistiche, un singolo tentativo fallito non esclude la vulnerabilita
- Sottovalutare l'impatto -> anche un piccolo overrun (2x invece di 1x) e un finding valido da documentare

---

## Link Utili

- [PortSwigger — Race conditions](https://portswigger.net/web-security/race-conditions)
- [Turbo Intruder GitHub](https://github.com/PortSwigger/turbo-intruder)

---

## Connessioni

- **Prerequisito:** [01-Logic-Flaws.md](01-Logic-Flaws.md)
- **Prossimo Step:** [03-Account-Enumeration.md](03-Account-Enumeration.md)

---

## Checklist di padronanza

- [ ] So usare "Send group in parallel" in Burp Repeater
- [ ] So impostare uno script Turbo Intruder base
- [ ] So identificare endpoint candidati (limiti, quote, "una tantum")
- [ ] Ripeto sempre il test piu volte prima di escludere la vulnerabilita

---

## Note personali

_(spazio libero)_
