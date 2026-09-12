# Race Conditions

**Difficoltà:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [01-Logic-Flaws.md](01-Logic-Flaws.md)
**Lab:** PortSwigger Academy: Race conditions

---

## Obiettivo

Se hai già visto un coupon "usa una volta sola" applicarsi due volte perché hai cliccato due volte troppo in fretta, hai già intuito il succo di una race condition: il server controlla una condizione ("questo coupon è stato usato?") e solo dopo la applica, e se in quella finestra temporale arrivano più richieste insieme, ognuna può superare il controllo prima che una sola di esse aggiorni davvero lo stato. La parte interessante di questa tecnica è che spesso non serve un exploit sofisticato: serve solo mandare le richieste giuste, davvero in parallelo, invece che una dopo l'altra come fa un click umano.

---

## Concetti chiave

### Principio TOCTOU (Time-Of-Check to Time-Of-Use)

```
1. Server controlla: "saldo sufficiente?" -> sì
2. Server esegue: scala il saldo
```
Se tra il controllo (1) e l'esecuzione (2) arrivano PIÙ richieste in parallelo, ognuna può passare il controllo prima che il saldo venga effettivamente aggiornato. Risultato: N operazioni completate quando solo 1 doveva essere possibile.

### Dove cercare

| Contesto | Esempio |
|----------|---------|
| Redeem coupon "una volta sola" | applicalo N volte in parallelo |
| Trasferimento/prelievo fondi | preleva più del saldo disponibile |
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
- Vulnerability: controllo "già usato?" non atomico con l'aggiornamento del flag

**Step-by-step:**
```
1. Cattura la richiesta di redeem con Burp Proxy
2. Send to Repeater, poi duplica la scheda 5-10 volte (stesso identico gruppo/tab group)
3. Seleziona tutte le schede -> tasto destro -> "Send group in parallel"
4. Osserva quante richieste restituiscono "successo" invece di solo una
```

**Attenzione:** inviare le richieste una dopo l'altra a mano (anche velocemente, click su Send ripetuto su schede separate) NON è un vero test di race condition: c'è sempre un round-trip di rete tra una richiesta e l'altra, quindi il server le vede quasi sempre in sequenza e il controllo TOCTOU non viene mai stressato davvero. "Send group in parallel" invece invia le richieste del gruppo realmente in concorrenza: se il target supporta HTTP/2 usa il **single-packet attack** (tutte le richieste, tranne l'ultimo frame, vengono preparate su connessioni separate e l'ultimo frame di ciascuna viene rilasciato nello stesso istante, azzerando quasi del tutto lo skew di rete); su HTTP/1.1 Burp ripiega automaticamente sulla tecnica **last-byte sync** (apre una connessione per richiesta, invia tutto tranne l'ultimo byte, poi rilascia l'ultimo byte di ognuna in un unico istante). Il risultato pratico è lo stesso: le richieste arrivano al server nella stessa finestra temporale invece che in sequenza.

**Output atteso:** se più di una richiesta restituisce successo, il coupon è stato applicato più volte nonostante il limite "una volta sola".

### Esempio 2: race condition con Turbo Intruder (più preciso su target con alta latenza di rete)

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

**Spiegazione:** Turbo Intruder invia le richieste "in gate" (accodate e rilasciate simultaneamente), riducendo al minimo la finestra temporale tra le richieste rispetto all'invio manuale: più affidabile su connessioni con latenza variabile.

### Esempio 3: race condition su limite di iscrizione eventi

```
1. Identifica l'endpoint POST /event/123/register con limite "max 1 posto per utente"
2. Duplica ed invia in parallelo 5 richieste identiche con la stessa sessione
3. Verifica nel pannello utente se sono state create più iscrizioni per lo stesso evento
```

---

## Evasion / Bypass Techniques

### Aumentare la probabilità di successo sincronizzando davvero le richieste

Il fattore che decide se una race condition è sfruttabile o no è la dimensione della finestra temporale tra check e use lato server: più le richieste arrivano vicine nel tempo, più è probabile che passino tutte il controllo prima che una sola di esse aggiorni lo stato. Per questo "Send group in parallel" di Burp Repeater sceglie automaticamente la tecnica migliore per il protocollo del target: single-packet attack su HTTP/2 (massima precisione, tutte le richieste arrivano nello stesso pacchetto TCP) o last-byte sync su HTTP/1.1 (connessioni separate con l'ultimo byte trattenuto e rilasciato simultaneamente). Se il target è dietro un load balancer con connessioni non sticky, prova ad aumentare il numero di richieste nel gruppo (es. 20-50) per compensare la possibile distribuzione su più backend.

---

## Lab Hands-On

### Lab 1 (PortSwigger): Limit overrun race conditions
**Obiettivo:** superare un limite "una tantum" tramite richieste parallele
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Identifica un'azione con limite dichiarato (una volta sola / quota massima)
2. Invia richieste identiche in parallelo con Burp Repeater o Turbo Intruder
3. Verifica se il limite è stato superato

---

## Common Mistakes

- Inviare le richieste in sequenza rapida invece che veramente in parallelo -> usa "Send group in parallel" o Turbo Intruder, non click ripetuti manuali
- Non ripetere il test più volte -> le race condition sono probabilistiche, un singolo tentativo fallito non esclude la vulnerabilità
- Sottovalutare l'impatto -> anche un piccolo overrun (2x invece di 1x) è un finding valido da documentare

---

## Link Utili

- [PortSwigger: Race conditions](https://portswigger.net/web-security/race-conditions)
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
- [ ] Ripeto sempre il test più volte prima di escludere la vulnerabilità

