# Session Management

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [00-Fundamentals/HTTP-HTTPS-Deep-Dive.md](../00-Fundamentals/HTTP-HTTPS-Deep-Dive.md)
**Lab:** PortSwigger Academy, modulo Authentication

---

## Obiettivo

Prima di attaccare una sessione devi capire come vive: il meccanismo che tiene "loggato" un utente tra una richiesta e l'altra è quasi sempre un cookie, un JWT o un token, e ognuno porta i suoi difetti di implementazione tipici. Qui vedi come le applicazioni mantengono lo stato di autenticazione e quali flag/scelte deboli rendono le sessioni attaccabili — è la base su cui si appoggiano i file successivi su hijacking, CSRF e JWT.

---

## Concetti chiave

### Meccanismi comuni

| Meccanismo | Come funziona | Rischio tipico |
|------------|-----------------|------------------|
| Cookie di sessione | ID opaco, stato salvato server-side | fissazione, hijacking se rubato |
| JWT | token firmato, stato nel token stesso | vedi [06-JWT-Exploitation.md](06-JWT-Exploitation.md) |
| Token in localStorage | gestito da JS | accessibile a qualsiasi XSS (no HttpOnly) |

### Flag cookie da controllare sempre

```
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/
```

| Flag mancante | Rischio |
|-----------------|---------|
| `HttpOnly` | leggibile via `document.cookie` (XSS -> furto sessione) |
| `Secure` | inviato anche su HTTP in chiaro |
| `SameSite` | senza l'attributo i browser moderni applicano `Lax` di default (mitiga già molti CSRF); solo con `SameSite=None` esplicito (richiede `Secure`) il cookie viaggia cross-site senza restrizioni |

### Qualità del session ID

Un buon session ID deve essere lungo, casuale (alta entropia) e imprevedibile. ID sequenziali o brevi sono indovinabili.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Sequencer | invia richieste multiple, analizza token | stima entropia | rileva session ID prevedibili |
| Burp Repeater | osserva Set-Cookie manualmente | flag cookie | check rapido |

---

## Payload / Esempi

### Esempio 1: analisi entropia session ID con Burp Sequencer

```
1. Cattura una richiesta che genera un nuovo token/session ID (es. login)
2. Send to Sequencer
3. Avvia cattura di centinaia di token
4. Analizza: se l'entropia stimata è bassa, il token è prevedibile
```

### Esempio 2: verifica manuale flag cookie

```bash
curl -s -D - -o /dev/null http://target.com/login -d "user=test&pass=test" | grep -i set-cookie
```

**Output atteso:**
```
Set-Cookie: session=abc123; Path=/
```

**Spiegazione:** l'assenza di `HttpOnly`/`Secure`/`SameSite` in questo output è già una scoperta da documentare, indipendentemente da altri exploit.

### Esempio 3: session ID prevedibile (pattern temporale/sequenziale)

```
session=1000234
session=1000235
session=1000236
```

**Spiegazione:** se il session ID è chiaramente incrementale o basato su timestamp, puoi provare a indovinare/forzare sessioni di altri utenti.

---

## Evasion / Bypass Techniques

Non applicabile in senso di evasion WAF; la "tecnica" qui è l'analisi statistica (Sequencer) per dimostrare debolezza dell'entropia del token.

---

## Lab Hands-On

### Lab 1: PortSwigger, analisi di un token di sessione debole
**Obiettivo:** dimostrare prevedibilità di un session ID
**Difficulty:** Medio
**Time:** 45 min

**Walkthrough breve:**
1. Cattura molti token consecutivi con Sequencer
2. Analizza entropia stimata
3. Documenta il rischio anche senza exploit completo (basta dimostrare bassa entropia)

---

## Common Mistakes

- Controllare solo la presenza del cookie, non i suoi flag -> HttpOnly/Secure/SameSite sono controlli distinti, vanno verificati tutti e tre
- Non testare mai l'entropia del session ID -> è un controllo che si salta facilmente, ma resta un finding segnalabile a sé

---

## Link Utili

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [PortSwigger: Authentication](https://portswigger.net/web-security/authentication)

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/HTTP-HTTPS-Deep-Dive.md](../00-Fundamentals/HTTP-HTTPS-Deep-Dive.md)
- **Prossimo Step:** [02-Session-Hijacking.md](02-Session-Hijacking.md)

---

## Checklist di padronanza

- [ ] So verificare tutti i flag di sicurezza di un cookie
- [ ] So usare Burp Sequencer per analizzare entropia
- [ ] So riconoscere pattern prevedibili in un session ID

