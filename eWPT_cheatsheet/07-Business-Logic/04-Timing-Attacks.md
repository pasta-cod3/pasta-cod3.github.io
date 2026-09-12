# Timing Attacks

**Difficolta:** Advanced
**Time to Master:** 1.5h
**Prerequisiti:** [03-Account-Enumeration.md](03-Account-Enumeration.md)
**Lab:** PortSwigger Academy — Timing side channels

---

## Obiettivo

Approfondire l'uso della misurazione del tempo di risposta per inferire informazioni che l'applicazione non espone direttamente: esistenza di risorse, confronto di stringhe carattere per carattere, validita parziale di un token.

---

## Concetti chiave

### Perche il timing rivela informazioni

Molte operazioni (confronto stringhe non "constant-time", query DB con indice vs full scan, verifica hash) impiegano tempo diverso a seconda di QUANTO l'input si avvicina al valore corretto — anche differenze di pochi millisecondi, misurate su molti campioni, diventano statisticamente significative.

### Esempio classico: confronto stringhe non sicuro

```python
# Vulnerabile: confronto carattere per carattere che si ferma al primo mismatch
if input_token == stored_token:   # in molti linguaggi questo E' timing-safe di default oggi,
                                    # ma implementazioni custom (es. confronto manuale byte a byte) non lo sono
```

Se il confronto si interrompe al primo carattere sbagliato, un token che indovina correttamente i primi N caratteri impiega leggermente piu tempo di uno che sbaglia al primo carattere.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Python requests + time | script custom | tempo per richiesta | base per ogni timing attack |
| Burp — Turbo Intruder | script con misurazione timing | tempi comparati su molti payload | riduce rumore di rete meglio del client Python singolo |

---

## Payload / Esempi

### Esempio 1: script base per confronto statistico

```python
import requests, statistics

def measure(payload, samples=10):
    times = []
    for _ in range(samples):
        start = requests.get("http://target.com/api", params={"token": payload}).elapsed.total_seconds()
        times.append(start)
    return statistics.median(times)

candidates = ["aaaa", "abcd", "xyz1"]
for c in candidates:
    print(c, measure(c))
```

**Spiegazione:** usa sempre la mediana (non la media) su piu campioni per ridurre l'impatto di outlier dovuti a latenza di rete casuale.

### Esempio 2: individuare risorsa esistente vs non esistente via timing

```python
# Endpoint che controlla esistenza file prima di elaborare
import requests, time

for filename in ["config.php", "nonexistent12345.php"]:
    t0 = time.time()
    requests.get(f"http://target.com/download?file={filename}")
    print(filename, time.time() - t0)
```

### Esempio 3: uso di Turbo Intruder per timing ad alta precisione

```python
def queueRequests(target, wordlists):
    engine = RequestEngine(endpoint=target.endpoint, concurrentConnections=1, requestsPerConnection=1)
    for word in wordlists[0]:
        engine.queue(target.req, word)

def handleResponse(req, interesting):
    table.add(req)   # Turbo Intruder mostra il tempo di ogni richiesta in tabella ordinabile
```

**Spiegazione:** `concurrentConnections=1` e `requestsPerConnection=1` isolano ogni richiesta per una misurazione temporale piu pulita, senza interferenze da connessioni parallele.

---

## Evasion / Bypass Techniques

### Ridurre il rumore di rete

- Esegui i test dalla rete piu vicina possibile al target (stessa regione cloud se disponibile)
- Usa sempre la mediana su almeno 10-20 campioni per richiesta
- Scarta outlier estremi (jitter di rete occasionale)

---

## Lab Hands-On

### Lab 1: PortSwigger — Username enumeration via response timing
**Obiettivo:** distinguere account esistenti tramite timing statistico
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Misura tempo di risposta su username noto vs sconosciuto (molti campioni)
2. Calcola mediana per ciascuno
3. Conferma differenziale statisticamente significativo

---

## Common Mistakes

- Basarsi su un singolo campione -> il rumore di rete rende inaffidabile qualsiasi conclusione da una sola misurazione
- Ignorare la latenza di rete variabile -> testa sempre da una posizione di rete stabile e ripeti in momenti diversi per conferma

---

## Link Utili

- [PortSwigger — Timing attacks](https://portswigger.net/web-security/authentication/other-mechanisms)
- [Turbo Intruder GitHub](https://github.com/PortSwigger/turbo-intruder)

---

## Connessioni

- **Prerequisito:** [03-Account-Enumeration.md](03-Account-Enumeration.md)
- **Prossimo Step:** [05-Price-Manipulation.md](05-Price-Manipulation.md)

---

## Checklist di padronanza

- [ ] So scrivere uno script Python per misurazione timing statistica
- [ ] So usare la mediana invece della media per ridurre rumore
- [ ] So usare Turbo Intruder per timing ad alta precisione

---

## Note personali

_(spazio libero)_
