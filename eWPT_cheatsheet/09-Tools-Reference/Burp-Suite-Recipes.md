# Burp Suite Recipes

**Difficolta:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [00-Fundamentals/Burp-Suite-Setup.md](../00-Fundamentals/Burp-Suite-Setup.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Ricette pronte per le situazioni ricorrenti durante un engagement: automazione con macro, session handling per token dinamici, uso efficace di Intruder.

---

## Macro per login automatico (quando serve autenticare ogni richiesta di Intruder/Scanner)

```
1. Project options > Sessions > Macros > Add
2. Registra la sequenza di richieste che compongono il login (GET pagina login -> POST credenziali)
3. Crea una Session Handling Rule che usa la macro per rinnovare la sessione quando scade
4. Applica la rule allo scope Intruder/Repeater desiderato
```

## Session handling rule per token CSRF dinamico

```
1. Session Handling Rule > Rule Actions > Add > "Extract a value from response"
2. Definisci il pattern regex per estrarre il token CSRF dalla risposta della pagina form
3. Aggiungi "Update a parameter" per iniettare il token estratto nella richiesta successiva
```

**Spiegazione:** indispensabile per Hydra/Intruder su form protetti da token CSRF che cambia ad ogni richiesta — senza questa rule, ogni tentativo di bruteforce fallisce per token non valido, non per credenziali sbagliate.

## Intruder — Attack types

| Tipo | Uso |
|------|-----|
| Sniper | un payload set, una posizione alla volta |
| Battering ram | stesso payload in tutte le posizioni contemporaneamente |
| Pitchfork | piu payload set, sincronizzati (posizione N con valore N) |
| Cluster bomb | piu payload set, tutte le combinazioni (bruteforce completo) |

## Match and Replace per bypass client-side

```
Proxy > Options > Match and Replace
Match: Content-Security-Policy: .*
Replace: (vuoto)
```

## Comparer per diff response

```
1. Send to Comparer due risposte (es. utente valido vs invalido)
2. Compare words/bytes
3. Individua il differenziale esatto per account enumeration/business logic testing
```

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/Burp-Suite-Setup.md](../00-Fundamentals/Burp-Suite-Setup.md)
- **Combinazione con:** [06-Authentication-Authorization/05-Credential-Attacks.md](../06-Authentication-Authorization/05-Credential-Attacks.md)

---

## Note personali

_(spazio libero)_
