# Fingerprinting

**Difficoltà:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [01-Footprinting.md](01-Footprinting.md)
**Lab:** TryHackMe, Active Reconnaissance

---

## Obiettivo

Una versione software nota è oro: invece di provare payload a caso, cerchi il CVE giusto e vai dritto al punto. Qui identifichi lo stack del target — web server, linguaggio backend, CMS, librerie JS — partendo da indizi che spesso il team di sviluppo lascia esposti senza accorgersene: header, cookie name, path statici, persino il footer della pagina.

---

## Concetti chiave

### Superfici di fingerprint

| Fonte | Cosa rivela |
|-------|-------------|
| Header HTTP (`Server`, `X-Powered-By`) | web server, linguaggio |
| Cookie name (`PHPSESSID`, `JSESSIONID`, `laravel_session`) | linguaggio/framework |
| Pagine di errore custom vs default | framework (Django debug page, Laravel Whoops) |
| Path/file statici (`/wp-content/`, `/static/admin/`) | CMS/framework |
| Favicon hash | identifica CMS/prodotto via database (es. Shodan favicon hash) |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| whatweb | `whatweb -a 3 http://target.com` | stack tecnologico | `-a 3` = aggressivo (più richieste per plugin); il massimo è `-a 4` (Heavy) |
| wappalyzer | estensione browser | stack tecnologico | visuale, comodo durante navigazione |
| nmap | `nmap -sV -p 80,443 target.com` | versione servizio | banner grabbing |
| curl | `curl -I http://target.com` | header response | manuale, sempre affidabile |

---

## Payload / Esempi

### Esempio 1: fingerprint completo con whatweb

```bash
whatweb -a 3 -v http://target.com
```

**Output atteso:**
```
http://target.com [200 OK] Apache[2.4.41], PHP[7.4.3], WordPress[5.8], Cookies[wordpress_logged_in]
```

**Spiegazione:** in un colpo solo rivela web server, linguaggio, CMS e versione: da qui parti a cercare CVE noti (es. `searchsploit wordpress 5.8`).

### Esempio 2: identificare framework da errore forzato

```bash
curl "http://target.com/index.php?id=1'"
curl "http://target.com/api/users/abc"   # ID non numerico dove atteso intero
```

**Spiegazione:** forzare un errore (parametro malformato) spesso fa emergere uno stack trace che rivela linguaggio, ORM, e talvolta path assoluti del server.

### Esempio 3: banner grabbing manuale

```bash
nc -v target.com 80
HEAD / HTTP/1.1
Host: target.com

```

---

## Evasion / Bypass Techniques

### Header spoofing/nascondere il fingerprint (lato difensivo, utile da riconoscere)
Alcuni target rimuovono `Server`/`X-Powered-By`: non fermarti lì, usa comportamenti specifici (formato errori, header custom come `X-Drupal-Cache`) per identificare comunque lo stack.

---

## Lab Hands-On

### Lab 1: TryHackMe, Active Reconnaissance
**Obiettivo:** fingerprint completo di un target di laboratorio
**Difficulty:** Facile
**Time:** 45 min

**Walkthrough breve:**
1. Esegui whatweb e nmap -sV sul target
2. Cerca CVE noti per le versioni trovate
3. Documenta stack completo in un file di note

---

## Common Mistakes

- Fidarsi ciecamente della versione dichiarata negli header -> può essere modificata/nascosta, verifica con comportamento (es. path specifici del CMS)
- Non controllare il footer HTML -> molti CMS/temi lasciano credit "Powered by X vY" visibile nel markup

---

## Link Utili

- [Wappalyzer](https://www.wappalyzer.com/)
- [Exploit-DB / searchsploit](https://www.exploit-db.com/)

---

## Connessioni

- **Prerequisito:** [01-Footprinting.md](01-Footprinting.md)
- **Prossimo Step:** [03-OSINT-Tools.md](03-OSINT-Tools.md)
- **Combinazione con:** [02-Scanning-Enumeration/02-Service-Detection.md](../02-Scanning-Enumeration/02-Service-Detection.md)

---

## Checklist di padronanza

- [ ] So usare whatweb e interpretarne l'output
- [ ] So forzare errori per rivelare stack tecnologico
- [ ] So cercare CVE per una versione software trovata
- [ ] Ho un workflow ripetibile di fingerprint

