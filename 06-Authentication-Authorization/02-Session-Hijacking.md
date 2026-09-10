# Session Hijacking / Fixation

**Difficolta:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [01-Session-Management.md](01-Session-Management.md)
**Lab:** PortSwigger Academy — Session fixation

---

## Obiettivo

Sfruttare la mancata rigenerazione del session ID al login (fixation) o la trasmissione/esposizione del cookie (hijacking) per impersonare un utente autenticato.

---

## Concetti chiave

### Session Fixation

Se l'applicazione NON rigenera il session ID dopo il login (usa lo stesso ID assegnato prima dell'autenticazione), un attaccante puo:
1. Ottenere un session ID valido ma non autenticato
2. Costringere la vittima a usarlo (link con `?PHPSESSID=xxx`, o cookie impostato via subdomain)
3. Attendere che la vittima faccia login: il session ID resta lo stesso, ora autenticato
4. Usare lo stesso ID per accedere come la vittima

### Session Hijacking

Furto diretto del session ID gia autenticato (via XSS, sniffing su HTTP non cifrato, log esposti).

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | confronta session ID pre/post login | conferma fixation | manuale |
| Wireshark | cattura traffico HTTP non cifrato | session ID in chiaro | se manca HTTPS |

---

## Payload / Esempi

### Esempio 1: verificare session fixation

```bash
# Step 1: ottieni un session ID prima del login
curl -c cookies_pre.txt http://target.com/login

# Step 2: effettua login riusando lo stesso cookie
curl -b cookies_pre.txt -c cookies_post.txt -d "user=admin&pass=admin123" http://target.com/login

# Step 3: confronta il valore del session ID nei due file
diff <(grep session cookies_pre.txt) <(grep session cookies_post.txt)
```

**Output atteso:** se il valore e identico prima e dopo il login, l'app e vulnerabile a fixation.

**Spiegazione:** un'app sicura deve emettere un NUOVO session ID al momento dell'autenticazione, invalidando quello pre-login.

### Esempio 2: exploit fixation completo

```
1. Ottieni un session ID valido (non autenticato): session=fixed123
2. Costruisci un link per la vittima: http://target.com/login?PHPSESSID=fixed123
   (funziona solo se l'app accetta session ID da URL/parametro, non solo da cookie proprio)
3. La vittima clicca il link e fa login normalmente
4. Usa tu stesso session=fixed123 per accedere: ora sei autenticato come la vittima
```

### Esempio 3: hijacking via traffico non cifrato

```bash
# Su rete condivisa/MITM, cattura traffico HTTP (non HTTPS)
tcpdump -i eth0 -A 'tcp port 80' | grep -i cookie
```

---

## Evasion / Bypass Techniques

Non applicabile in senso WAF; la "tecnica" qui e principalmente la scelta del vettore di consegna del session ID fissato (link, subdomain cookie scoping, header custom accettato dall'app).

---

## Lab Hands-On

### Lab 1: PortSwigger — Session fixation
**Obiettivo:** dimostrare che il session ID non cambia dopo il login
**Difficulty:** Medio
**Time:** 30 min

**Walkthrough breve:**
1. Cattura session ID pre-login
2. Effettua login riusando lo stesso ID
3. Verifica se l'ID resta invariato

---

## Common Mistakes

- Dare per scontato che HTTPS risolva sempre il problema -> la fixation e indipendente da HTTPS, riguarda la logica applicativa
- Non testare la rigenerazione anche dopo logout/privilege change (es. da utente normale ad admin) -> stesso principio si applica a ogni cambio di privilegio

---

## Link Utili

- [OWASP Session Fixation](https://owasp.org/www-community/attacks/Session_fixation)
- [PortSwigger — Session fixation](https://portswigger.net/web-security/authentication)

---

## Connessioni

- **Prerequisito:** [01-Session-Management.md](01-Session-Management.md)
- **Prossimo Step:** [03-CSRF-Attacks.md](03-CSRF-Attacks.md)
- **Combinazione con:** [05-Cross-Site-Scripting/07-Cookie-Stealing.md](../05-Cross-Site-Scripting/07-Cookie-Stealing.md)

---

## Checklist di padronanza

- [ ] So verificare se il session ID cambia dopo il login
- [ ] So costruire un exploit di fixation completo
- [ ] So riconoscere quando l'hijacking richiede HTTPS assente o XSS

---

## Note personali

_(spazio libero)_
