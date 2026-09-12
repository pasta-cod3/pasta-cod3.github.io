# Web Enumeration

**Difficolta:** Intermediate
**Time to Master:** 3h
**Prerequisiti:** [02-Service-Detection.md](02-Service-Detection.md)
**Lab:** HTB Academy — Attacking Web Applications with Ffuf

---

## Obiettivo

Mappare l'intera superficie del sito: directory, file, backup, endpoint nascosti non linkati dal menu. E dove si trova la maggior parte delle vulnerabilita in eWPT.

---

## Concetti chiave

### Directory brute-force vs content discovery

- **Brute-force classico:** wordlist di path comuni (`/admin`, `/backup`)
- **Content discovery intelligente:** basato su tecnologia rilevata (wordlist specifiche per WordPress, Laravel, ecc.)

### Wordlist consigliate (SecLists)

| Wordlist | Uso |
|----------|-----|
| `raft-medium-directories.txt` | directory generiche |
| `raft-medium-files.txt` | file generici |
| `common.txt` | scan rapido iniziale |
| liste specifiche per CMS | dopo aver identificato lo stack |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| gobuster | `gobuster dir -u URL -w wordlist -x php,txt,bak` | path trovati | veloce, stabile |
| ffuf | `ffuf -w wordlist -u URL/FUZZ` | path trovati | molto flessibile, JSON output |
| dirsearch | `dirsearch -u URL -e php,html,bak` | path trovati | wordlist integrate per estensione |
| feroxbuster | `feroxbuster -u URL -w wordlist` | path trovati (ricorsivo) | scan ricorsivo automatico |

---

## Payload / Esempi

### Esempio 1: directory brute-force base con gobuster

```bash
gobuster dir -u http://target.com \
  -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt \
  -x php,txt,bak,zip \
  -t 50 \
  -o gobuster-dirs.txt
```

**Output atteso:**
```
/admin                (Status: 301)
/backup.zip           (Status: 200)
/config.php.bak       (Status: 200)
```

**Spiegazione:** i file `.bak`/`.zip` con status 200 sono spesso backup dimenticati dagli sviluppatori: possono contenere codice sorgente completo con credenziali hardcoded.

### Esempio 2: fuzzing parametri GET con ffuf

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt \
  -u "http://target.com/search.php?FUZZ=test" \
  -fs 4242
```

**Spiegazione:** `-fs` filtra per dimensione response, escludendo risposte "non trovate" identiche — trova parametri GET nascosti che l'app accetta silenziosamente.

### Esempio 3: ricerca ricorsiva automatica

```bash
feroxbuster -u http://target.com -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -x php,html -d 3
```

**Spiegazione:** `-d 3` limita la ricorsione a 3 livelli, evitando scan infiniti su siti con struttura profonda.

---

## Evasion / Bypass Techniques

### Bypassare 403 su path scoperti

```bash
curl http://target.com/admin/           # 403
curl http://target.com/admin/.          # a volte bypassa
curl http://target.com/Admin/           # case variation
curl http://target.com//admin//         # double slash
curl -H "X-Forwarded-For: 127.0.0.1" http://target.com/admin/
curl -H "X-Original-URL: /admin/" http://target.com/
```

**Spiegazione:** molte regole di blocco 403 sono implementate a livello di path-matching esatto; variazioni di case, slash, o header di forwarding possono bypassare controlli mal configurati (rate-limit o reverse-proxy rule).

---

## Lab Hands-On

### Lab 1: HTB Academy — Attacking Web Applications with Ffuf
**Obiettivo:** trovare endpoint nascosti con fuzzing avanzato
**Difficulty:** Medio
**Time:** 1.5h

**Walkthrough breve:**
1. Fuzzing directory con gobuster/ffuf
2. Fuzzing parametri su endpoint trovati
3. Bypass di eventuali 403 con tecniche header/case

---

## Common Mistakes

- Usare una sola wordlist piccola -> combina `common.txt` (rapido) con `raft-medium/large` (approfondito)
- Ignorare status 403/401 come "vicoli ciechi" -> spesso bypassabili, vedi sezione Evasion
- Non filtrare le false-positive (soft 404) -> usa `-fs`/`-fw` per escludere pagine "non trovate" con status 200

---

## Link Utili

- [SecLists GitHub](https://github.com/danielmiessler/SecLists)
- [HTB Academy — Ffuf](https://academy.hackthebox.com/)

---

## Connessioni

- **Prerequisito:** [02-Service-Detection.md](02-Service-Detection.md)
- **Prossimo Step:** [04-Virtual-Host-Enum.md](04-Virtual-Host-Enum.md)
- **Combinazione con:** [03-File-Inclusion/](../03-File-Inclusion/)

---

## Checklist di padronanza

- [ ] So usare gobuster/ffuf con wordlist appropriate
- [ ] So fuzzare parametri, non solo directory
- [ ] Conosco almeno 3 tecniche di bypass 403
- [ ] So filtrare i falsi positivi nel fuzzing

---

## Note personali

_(spazio libero)_
