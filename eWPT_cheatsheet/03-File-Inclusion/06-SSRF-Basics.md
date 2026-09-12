# SSRF (Server-Side Request Forgery)

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [05-Evasion-Filters.md](05-Evasion-Filters.md)
**Lab:** PortSwigger Academy, Server-side request forgery (SSRF)

---

## Obiettivo

Se hai già digerito RFI, l'SSRF ti sembrerà quasi familiare: in entrambi i casi convinci il server a fare una richiesta al posto tuo verso un URL che controlli (o che scegli tu). La differenza è che nell'SSRF il server di solito non ti restituisce il contenuto scaricato come farebbe con un `include()` vulnerabile: la richiesta parte e basta, e tu devi dedurre cosa è successo dal comportamento dell'app (tempo di risposta, errore diverso, side-effect visibile). È una delle vulnerabilità più sottovalutate quando inizi: sembra "solo" far partire una richiesta, poi scopri che da lì puoi arrivare a leggere metadata cloud, bucire firewall interni, o toccare servizi che dall'esterno non vedresti mai.

---

## Concetti chiave

### Dove nasce un SSRF

Qualsiasi funzionalità che fa "il server va a prendere una risorsa da un URL che io fornisco" è un candidato: import di immagini da URL, webhook, generatori di PDF/screenshot da pagina web, integrazioni con API esterne, validatori di link, feed RSS.

### SSRF Basic vs Blind

| Tipo | Comportamento | Come lo rilevi |
|------|----------------|-----------------|
| Basic (non-blind) | la risposta della richiesta interna torna nella pagina | leggi direttamente il contenuto recuperato |
| Blind | la richiesta parte ma non vedi nulla nella risposta | out-of-band (Burp Collaborator/interactsh), timing, differenze di errore |

### Bersagli tipici una volta trovato l'SSRF

| Bersaglio | Perché interessa |
|-----------|-------------------|
| `http://169.254.169.254/` (AWS/cloud metadata) | spesso espone credenziali IAM temporanee senza autenticazione |
| `http://localhost:PORT/` | servizi interni non esposti pubblicamente (admin panel, DB web UI) |
| Servizi sulla rete interna (`10.x`, `172.16.x`, `192.168.x`) | il server compromesso spesso ha accesso a segmenti di rete non raggiungibili dall'esterno |
| Schemi diversi da http/https (`file://`, `gopher://`) | a seconda della libreria HTTP usata dal backend, possono aprire strade ulteriori (lettura file locali, interazione grezza con protocolli TCP) |

---

## Strumenti

| Tool | Uso | Output | Note |
|------|-----|--------|------|
| Burp Collaborator / interactsh | genera un dominio che logga ogni richiesta in arrivo | conferma di SSRF blind | essenziale per i casi "cieco" dove non vedi nulla nella risposta |
| curl (dal tuo host, per confrontare) | replica manualmente cosa dovrebbe succedere lato server | baseline di comportamento | utile per capire cosa aspettarti prima di iniettare il payload |

---

## Payload / Esempi

### Esempio 1: SSRF basic su un parametro che scarica un'immagine

```
POST /profile/avatar HTTP/1.1
Host: target.com
Content-Type: application/x-www-form-urlencoded

imageUrl=http://169.254.169.254/latest/meta-data/iam/security-credentials/
```

**Spiegazione:** se l'app scarica davvero l'immagine dall'URL fornito e te la mostra (o restituisce un errore che rivela il contenuto), stai leggendo l'endpoint dei metadata: su un'istanza AWS mal configurata questo può restituire il nome del ruolo IAM, primo passo per recuperare credenziali temporanee.

### Esempio 2: confermare un SSRF blind con Collaborator

```
POST /webhook/register HTTP/1.1
Host: target.com
Content-Type: application/json

{"callbackUrl": "http://YOUR-ID.oastify.com"}
```

**Spiegazione:** se il tuo dominio Collaborator riceve una richiesta HTTP dal server target (non dal tuo browser), hai confermato l'SSRF anche senza vedere nulla nella risposta dell'app: il "prova" è nel log fuori banda, non nella pagina.

### Esempio 3: bypassare un filtro su IP privati con URL encoding alternativo

```
http://127.1/
http://0x7f000001/
http://[::ffff:127.0.0.1]/
```

**Spiegazione:** molti filtri SSRF fanno un controllo ingenuo su stringa (`"127.0.0.1"` bloccato, ma `127.1` no); IP decimali, esadecimali o notazione IPv6-mapped spesso li bypassano perché il parser HTTP li risolve comunque correttamente.

---

## Evasion / Bypass Techniques

- Redirect: se il server segue le redirect HTTP, un URL "innocuo" che redirige a `http://localhost/` può bypassare una blocklist che controlla solo l'URL iniziale
- DNS rebinding: un dominio che risolve prima a un IP pubblico (passa il controllo) e poi a `127.0.0.1` (al momento della richiesta reale) aggira i controlli fatti "una volta sola" a monte
- Se il backend usa una libreria HTTP permissiva, prova schemi alternativi (`file://`, `dict://`, `gopher://`): non sempre funzionano, ma quando funzionano aprono possibilità che vanno ben oltre una richiesta HTTP

---

## Lab Hands-On

### Lab 1: PortSwigger Academy, SSRF basic
**Obiettivo:** trovare un parametro vulnerabile a SSRF e usarlo per accedere a un endpoint amministrativo interno
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Identifica una funzionalità che fa una richiesta server-side verso un URL fornito da te
2. Prova a puntarla su `http://localhost/admin` o percorsi interni tipici
3. Se la risposta torna nella pagina, hai SSRF non-blind: leggi il contenuto per capire il prossimo passo

---

## Common Mistakes

- Testare SSRF solo con `http://google.com` per "vedere se cambia qualcosa" -> non impari nulla, punta subito a `localhost`/IP privati/metadata endpoint
- Fermarsi al primo filtro che blocca `127.0.0.1` -> quasi sempre esistono rappresentazioni alternative dello stesso IP che il filtro non controlla
- Ignorare i casi blind perché "non vedo niente in risposta" -> è lì che serve Collaborator/interactsh, non una prova a occhio

---

## Link Utili

- [PortSwigger: Server-side request forgery (SSRF)](https://portswigger.net/web-security/ssrf)
- [HackTricks: SSRF](https://book.hacktricks.xyz/pentesting-web/ssrf-server-side-request-forgery)

---

## Connessioni

- **Prerequisito:** [05-Evasion-Filters.md](05-Evasion-Filters.md)
- **Prossimo Step:** [07-XXE-Basics.md](07-XXE-Basics.md)
- **Combinazione con:** [03-RFI-Techniques.md](03-RFI-Techniques.md)

---

## Checklist di padronanza

- [ ] So riconoscere una funzionalità candidata a SSRF
- [ ] So distinguere SSRF basic da SSRF blind e testare entrambi
- [ ] Conosco almeno 3 bersagli interni interessanti una volta trovato l'SSRF
- [ ] So bypassare un filtro banale su IP privati con una notazione alternativa

