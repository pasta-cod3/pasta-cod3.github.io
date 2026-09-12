# Burp Suite Basics

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [01-Web-Fundamentals-HTTP.md](01-Web-Fundamentals-HTTP.md)
**Lab:** DVWA / qualsiasi webapp di lab

---

## Obiettivo

Fin qui hai testato SQLi/XSS/LFI a mano nella barra degli indirizzi o con curl: funziona, ma diventa scomodo in fretta. Burp Suite è lo strumento che userai davvero per il resto della sezione (e per il resto della tua vita da pentester web): qui configuri proxy, intercept, Repeater e Intruder a livello base — è il prerequisito pratico per tutti gli altri file di questa sezione, non un capitolo a parte da saltare.

---

## Concetti chiave

### Componenti principali

| Componente | Funzione |
|-----------|----------|
| Proxy | intercetta le richieste tra browser e server, permette di modificarle prima dell'invio |
| Repeater | rinvia manualmente una richiesta modificata quante volte serve |
| Intruder | automatizza l'invio di richieste con payload variabili (brute force, fuzzing base) |
| Target/Site map | mappa passivamente tutte le risorse visitate durante il browsing proxato |

### Setup iniziale

1. Avvia Burp, verifica che il Proxy listener sia su `127.0.0.1:8080` (default)
2. Configura il browser per usare quel proxy (manualmente o con estensione tipo FoxyProxy)
3. Visita `http://burpsuite` (o `http://burp`) dal browser proxato per scaricare e installare il certificato CA di Burp: necessario per intercettare HTTPS senza warning

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Suite Community | GUI Java | proxy/intercept/repeater/intruder | versione gratuita sufficiente per eJPTv2 |
| FoxyProxy (estensione browser) | switch proxy rapido | instrada traffico verso Burp | comodo per attivare/disattivare il proxy |

---

## Payload / Esempi

### Esempio 1: intercettare e modificare una richiesta di login

1. Attiva "Intercept is on" nel tab Proxy
2. Invia il form di login dal browser
3. La richiesta si ferma in Burp: modifica un parametro (es. `user=admin`) prima di inoltrarla con "Forward"

**Spiegazione:** l'intercept e utile per test manuali mirati (es. bypassare controlli client-side che il browser normalmente applicherebbe prima dell'invio).

### Esempio 2: uso di Repeater per test ripetuti

1. Click destro su una richiesta catturata nel Proxy history -> "Send to Repeater"
2. Nel tab Repeater, modifica il parametro `id` in vari modi (`1'`, `1 OR 1=1`, ecc.)
3. Premi "Send" e confronta le risposte

**Spiegazione:** Repeater e lo strumento principale per confermare manualmente vulnerabilità (SQLi, XSS, LFI) prima o al posto di tool automatici come sqlmap.

### Esempio 3: Intruder per brute force di base

1. Send to Intruder da una richiesta di login catturata
2. Imposta `Sniper` come attack type, marca il campo password come posizione (`§password§`)
3. Carica una wordlist nel Payloads tab, avvia l'attacco
4. Ordina i risultati per `Length` o `Status code`: una risposta diversa dalle altre indica spesso il login corretto

**Spiegazione:** un `Content-Length` diverso tra la maggior parte dei tentativi falliti e uno solo indica spesso una risposta differente (es. redirect dopo login riuscito vs pagina di errore).

---

## Lab Hands-On

### Lab 1: DVWA con Burp, flusso completo
**Obiettivo:** proxare tutto il traffico verso DVWA e usare Repeater/Intruder
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Configura browser + certificato CA di Burp
2. Naviga DVWA con Intercept attivo, osserva ogni richiesta
3. Manda una richiesta a Repeater e prova a modificarne un parametro
4. Prova un attacco Intruder base su un form di login

---

## Common Mistakes

- Non installare il certificato CA di Burp -> HTTPS mostra sempre errore di certificato nel browser
- Lasciare Intercept attivo mentre si naviga normalmente -> ogni richiesta si blocca, workflow molto lento; disattivalo quando non serve intercettare attivamente

---

## Link Utili

- [PortSwigger: Getting started with Burp Suite](https://portswigger.net/burp/documentation/desktop/getting-started)

---

## Connessioni

- **Prerequisito:** [01-Web-Fundamentals-HTTP.md](01-Web-Fundamentals-HTTP.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [02-SQL-Injection-Basics.md](02-SQL-Injection-Basics.md), [03-XSS-Basics.md](03-XSS-Basics.md)

---

## Checklist di padronanza

- [ ] Ho configurato browser + certificato CA di Burp
- [ ] So intercettare e modificare una richiesta col Proxy
- [ ] So usare Repeater per test ripetuti
- [ ] So impostare un attacco Intruder di base

