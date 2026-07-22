# Burp Suite: il proxy essenziale per il web hacking

## Introduzione

Ogni penetration tester che lavora su applicazioni web usa **Burp Suite**. È un proxy HTTP intercettatore che ti mette in mezzo tra il tuo browser e il server, permettendoti di vedere, modificare e ripetere ogni singola richiesta.

La Community Edition è gratuita e copre il 90% delle esigenze di chi inizia.

---

## Installazione e setup

```bash
# Kali Linux (preinstallato)
burpsuite

# Download manuale
# https://portswigger.net/burp/releases
# Disponibile per Windows, macOS, Linux
```

### Configurare il browser

Burp agisce come proxy in ascolto su `127.0.0.1:8080`. Il browser deve essere configurato per passare il traffico attraverso di esso.

**Metodo consigliato: FoxyProxy** (estensione Firefox/Chrome)

1. Installa FoxyProxy
2. Aggiungi proxy: `127.0.0.1:8080`
3. Attiva/disattiva con un click

### Installare il certificato CA di Burp

Per intercettare traffico HTTPS devi installare il certificato CA di Burp nel browser:

1. Con Burp attivo e proxy configurato, vai su `http://burpsuite`
2. Clicca "CA Certificate" e scarica il file
3. Nel browser: Impostazioni → Certificati → Importa → seleziona il file scaricato
4. Fidati per "identificare siti web"

---

## Interfaccia: i tab principali

### Proxy → Intercept

Il cuore di Burp. Quando "Intercept is ON", ogni richiesta del browser viene bloccata qui prima di essere inviata al server. Puoi modificarla e poi fare "Forward" per inviarla.

```
GET /login?user=admin HTTP/1.1
Host: target.com
Cookie: session=abc123

→ Modifica → Forward
```

### Proxy → HTTP History

Storico di tutte le richieste fatte, anche quelle non intercettate. Fondamentale per capire come funziona l'applicazione.

### Repeater

Prendi una richiesta, modificala, rilanciala quante volte vuoi. Perfetto per testare manualmente:
- Parametri di input (SQLi, XSS, IDOR)
- Header
- Cookie

**Come usarlo:** click destro su una richiesta nell'History → "Send to Repeater" → tab Repeater → modifica → "Send"

### Intruder

Automatizza l'invio di molte richieste variando i parametri. Usato per:
- Brute force su form di login
- Fuzzing di parametri
- Enumerazione di risorse

> Nella Community Edition è limitato in velocità (throttling). Per attacchi veloci usa Hydra o ffuf.

### Scanner (Pro only)

La versione a pagamento include uno scanner automatico di vulnerabilità web. La Community non ce l'ha.

### Decoder

Encode/decode di stringhe: Base64, URL encoding, HTML entities, Hex. Utile quando trovi token o parametri offuscati.

```
Input: cGFzc3dvcmQ=
Decode (Base64): password
```

### Comparer

Confronta due richieste o risposte per trovare differenze. Utile in blind SQLi o nei test di autenticazione.

---

## Workflow tipico su una web app

### 1. Mappa l'applicazione

Prima di cercare vulnerabilità, capisci cosa fa l'applicazione. Naviga con il proxy attivo (Intercept OFF) e lascia che Burp registri tutto nell'History.

Identifica:
- Funzionalità principali
- Dove vengono passati parametri utente
- Endpoint API
- Cookie e header di autenticazione

### 2. Analizza i parametri sospetti

Nell'History, cerca richieste con parametri interessanti:
- `?id=123` → IDOR, SQLi
- `?redirect=https://...` → Open Redirect
- `?file=documento.pdf` → Path Traversal
- Form di login → Brute force, SQLi

### 3. Manda al Repeater e testa

```
GET /api/user?id=1 HTTP/1.1
→ Send to Repeater
→ Cambia id=1 in id=2, id=0, id=-1, id=1'
→ Osserva le risposte
```

### 4. Usa Intruder per fuzzing

```
POST /login HTTP/1.1
...
username=§admin§&password=§password§

→ Attack type: Cluster bomb (prova tutte le combinazioni)
→ Payload 1: lista di username
→ Payload 2: lista di password
→ Start attack
```

---

## Funzioni utili meno conosciute

### Match and Replace

In Proxy → Options → Match and Replace, puoi fare sostituzioni automatiche su ogni richiesta:

- Sostituire automaticamente l'User-Agent
- Aggiungere header custom
- Rimuovere header di tracking

### Scope

Definisci il target scope (es. solo `target.com`) per non registrare traffico irrilevante di altri siti.

Proxy → Options → Intercept Client Requests → "And URL Is in target scope"

### Burp Collaborator (Pro)

Genera URL/DNS temporanei per rilevare vulnerabilità out-of-band (SSRF, Blind XSS, XXE). Nella Community non è disponibile, ma puoi usare **interactsh** come alternativa open source.

---

## Estensioni (BApp Store)

Burp ha un marketplace di estensioni. Le più utili gratuite:

- **Autorize** — testa automaticamente IDOR e problemi di autorizzazione
- **JWT Editor** — analizza e modifica JSON Web Token
- **HackBar** — payload rapidi per SQLi/XSS
- **Retire.js** — identifica librerie JavaScript vulnerabili

---

## Conclusione

Burp Suite non è solo uno strumento — è un **modo di pensare**. Ti abitua a guardare ogni interazione web come una sequenza di richieste HTTP modificabili. Una volta che inizi a usarlo, non torni al browser "nudo".

Il modo migliore per impararlo è la **PortSwigger Web Security Academy**: lab gratuiti pensati esattamente per essere risolti con Burp. Ogni concetto ha la sua lab pratica.
