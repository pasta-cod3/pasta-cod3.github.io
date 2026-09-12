# Web Enumeration

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [04-SNMP-Enumeration.md](04-SNMP-Enumeration.md)
**Lab:** INE PTS, Web Enumeration

---

## Obiettivo

Qui non ti serve la profondità che vedrai in eWPT, ma non puoi nemmeno saltarla: qualunque servizio HTTP/HTTPS incontri in un lab va comunque enumerato a fondo — fingerprint dello stack, directory/file nascosti, virtual host. Considerala la base minima indispensabile prima di arrivare a [10-Web-Application-Attacks](../10-Web-Application-Attacks/), dove quello che trovi qui inizia a diventare exploit.

---

## Concetti chiave

### Fingerprint dello stack tecnologico

Header HTTP (`Server`, `X-Powered-By`), cookie di sessione (es. `PHPSESSID`, `JSESSIONID`), e pagine di errore di default spesso rivelano linguaggio backend, framework e versione.

### Directory/file brute force

Le applicazioni web spesso espongono percorsi non linkati pubblicamente (pannelli admin, backup, file di config) che una wordlist mirata può scoprire.

### Virtual host enumeration

Un singolo IP può ospitare più siti distinti tramite header `Host`; enumerare i vhost può rivelare applicazioni "nascoste" non raggiungibili dall'IP diretto.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| whatweb | `whatweb -a 3 http://target` | stack tecnologico rilevato | intensity 3 = aggressivo ma sicuro |
| gobuster | `gobuster dir -u http://target -w wordlist.txt` | directory/file trovati | veloce, scritto in Go |
| ffuf | `ffuf -u http://target/FUZZ -w wordlist.txt` | fuzzing flessibile | ottimo anche per vhost/parametri |
| nikto | `nikto -h http://target` | vulnerabilità web note + misconfigurazioni | scan rumoroso ma rapido |

---

## Payload / Esempi

### Esempio 1: fingerprint completo dello stack

```bash
whatweb -a 3 http://10.10.10.5
```

**Output atteso:**
```
http://10.10.10.5 [200 OK] Apache[2.4.29], Country[RESERVED][ZZ],
HTTPServer[Ubuntu Linux][Apache/2.4.29 (Ubuntu)], IP[10.10.10.5],
PHP[7.2.24], X-Powered-By[PHP/7.2.24]
```

**Spiegazione:** in un solo comando si ottiene server web, OS sottostante, linguaggio e versione: punto di partenza per cercare CVE noti.

### Esempio 2: directory brute force

```bash
gobuster dir -u http://10.10.10.5 -w /usr/share/seclists/Discovery/Web-Content/common.txt -x php,txt,bak -o gobuster.txt
```

**Spiegazione:** `-x` aggiunge estensioni comuni ai tentativi (utile per trovare `config.php.bak` o simili), `-o` salva l'output per confronto successivo.

### Esempio 3: virtual host enumeration con ffuf

```bash
ffuf -u http://10.10.10.5 -H "Host: FUZZ.target.local" -w subdomains.txt -fs 1234
```

**Spiegazione:** si fuzza l'header Host mantenendo lo stesso IP; `-fs 1234` filtra le risposte con dimensione uguale a quella del sito di default per isolare solo i vhost che restituiscono contenuto diverso.

---

## Lab Hands-On

### Lab 1: INE PTS, Web fingerprint & brute force
**Obiettivo:** identificare stack tecnologico e almeno 2 directory/file non linkati pubblicamente
**Difficulty:** Facile
**Time:** 40 min

**Walkthrough breve:**
1. whatweb -a 3 sul target
2. gobuster dir con wordlist common + estensioni pertinenti allo stack rilevato
3. Verifica manualmente robots.txt e sitemap.xml

---

## Common Mistakes

- Usare sempre la stessa wordlist generica -> adattarla allo stack rilevato (es. wordlist PHP-specifiche se il target e PHP) da risultati migliori
- Ignorare `robots.txt`/`sitemap.xml` -> spesso rivelano percorsi interessanti gratuitamente, prima di ogni brute force
- Non salvare gli output -> difficile confrontare risultati tra scan diversi durante l'esame

---

## Link Utili

- [SecLists: wordlist di riferimento](https://github.com/danielmiessler/SecLists)

---

## Connessioni

- **Prerequisito:** [04-SNMP-Enumeration.md](04-SNMP-Enumeration.md)
- **Prossimo Step:** [06-NFS-RPC-Enumeration.md](06-NFS-RPC-Enumeration.md)
- **Combinazione con:** [../10-Web-Application-Attacks/01-Web-Fundamentals-HTTP.md](../10-Web-Application-Attacks/01-Web-Fundamentals-HTTP.md)

---

## Checklist di padronanza

- [ ] So fare fingerprint completo di uno stack web
- [ ] So eseguire directory/file brute force con gobuster e ffuf
- [ ] So enumerare virtual host quando presenti

