# API Enumeration

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [04-Virtual-Host-Enum.md](04-Virtual-Host-Enum.md)
**Lab:** PortSwigger Academy, API testing

---

## Obiettivo

Mentre il frontend viene rifinito e testato, l'API che lo alimenta resta spesso un passo indietro: meno testata, con controlli di autorizzazione più deboli — terreno fertile per IDOR. Qui impari a scoprire endpoint REST/GraphQL, documentazione esposta e versioni parallele dell'API, a partire da quella v1 "legacy" che quasi sempre nessuno ha mai davvero disattivato.

---

## Concetti chiave

### Fonti comuni per scoprire endpoint API

| Fonte | Cosa cercare |
|-------|---------------|
| JS file del frontend | `fetch("/api/...")`, `axios.get(...)` |
| `/api/`, `/api/v1/`, `/api/v2/` | versioni parallele, spesso v1 meno protetta |
| Swagger/OpenAPI | `/swagger.json`, `/api-docs`, `/openapi.json` |
| GraphQL introspection | `/graphql` con query `__schema` |

### REST vs GraphQL: enumerazione diversa

- **REST:** la superficie è distribuita su molti path/endpoint (`/api/v1/users`, `/api/v1/orders`, ...): l'enumerazione si basa su directory/parameter fuzzing (gobuster/ffuf) e sulla lettura dei file JS, perché ogni risorsa ha una propria route.
- **GraphQL:** tipicamente un unico endpoint (`/graphql` o `/api/graphql`) espone tutte le operazioni: qui il fuzzing di path serve solo a trovare l'endpoint stesso, mentre l'enumerazione vera e propria della superficie (query, mutation, tipi disponibili) passa dall'introspection query. Se l'introspection è disabilitata in produzione, si ricostruisce lo schema per tentativi (field suggestion / errori verbosi) o con tool dedicati (InQL per Burp, GraphQL Voyager, clairvoyance).

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| gobuster | `gobuster dir -u URL/api -w wordlist` | endpoint API | usa wordlist dedicate API |
| ffuf | fuzzing su `/api/FUZZ` | endpoint validi | combina con metodi HTTP diversi |
| Postman/Burp | import Swagger | mappa completa endpoint | se documentazione esposta |

---

## Payload / Esempi

### Esempio 1: scoprire endpoint dai file JS

```bash
curl -s http://target.com/main.js | grep -oE '"/api/[a-zA-Z0-9/_-]+"' | sort -u
```

**Spiegazione:** i frontend SPA (React/Vue/Angular) spesso contengono l'intera mappa delle chiamate API nel bundle JS, anche per endpoint admin non linkati nell'interfaccia visibile.

### Esempio 2: trovare e usare la documentazione Swagger

```bash
curl -s http://target.com/swagger.json | jq '.paths | keys'
curl -s http://target.com/api/v1/swagger.json
curl -s http://target.com/api-docs
```

**Output atteso:**
```
[
  "/users",
  "/users/{id}",
  "/admin/settings"
]
```

**Spiegazione:** Swagger/OpenAPI documenta l'intera superficie API inclusi endpoint admin: se esposto pubblicamente è un enorme vantaggio in fase di enumerazione.

### Esempio 3: GraphQL introspection

```bash
curl -s -X POST http://target.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{__schema{types{name,fields{name}}}}"}' | jq
```

**Spiegazione:** se l'introspection è abilitata in produzione (errore comune), rivela l'intero schema: tutte le query/mutation disponibili, comprese quelle non documentate pubblicamente.

### Esempio 4: testare versioni API parallele

```bash
curl http://target.com/api/v1/users/1
curl http://target.com/api/v2/users/1
curl http://target.com/api/users/1
```

**Spiegazione:** spesso `v1` resta attiva per retrocompatibilità ma con controlli di sicurezza meno aggiornati rispetto a `v2`.

---

## Evasion / Bypass Techniques

### Bypass rate-limit su API con header multipli
```
X-Forwarded-For: 1.2.3.4
X-Forwarded-For: 1.2.3.5
```
Alcuni rate-limiter naive contano per IP dichiarato nell'header invece che per connessione reale.

---

## Lab Hands-On

### Lab 1: PortSwigger, API testing basics
**Obiettivo:** enumerare endpoint da JS e Swagger, testare IDOR su API
**Difficulty:** Medio
**Time:** 1h

**Walkthrough breve:**
1. Analizza i file JS del frontend per endpoint nascosti
2. Cerca documentazione Swagger/OpenAPI esposta
3. Testa IDOR cambiando ID negli endpoint trovati

---

## Common Mistakes

- Testare solo l'endpoint "v2" documentato -> controlla sempre se v1/legacy è ancora raggiungibile
- Non controllare i file JS -> spesso la mappa completa dell'API è lì, non serve nemmeno fuzzare

---

## Link Utili

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [PortSwigger: API testing](https://portswigger.net/web-security/api-testing)

---

## Connessioni

- **Prerequisito:** [04-Virtual-Host-Enum.md](04-Virtual-Host-Enum.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [06-Authentication-Authorization/04-IDOR.md](../06-Authentication-Authorization/04-IDOR.md)

---

## Checklist di padronanza

- [ ] So estrarre endpoint dai file JS
- [ ] So trovare e sfruttare documentazione Swagger esposta
- [ ] So testare GraphQL introspection
- [ ] Testo sempre le versioni API parallele (v1 vs v2)

