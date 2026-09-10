# Linux for WebHacking

**Difficolta:** Beginner
**Time to Master:** 3h
**Prerequisiti:** nessuno (ripasso eJPTv2)
**Lab:** OverTheWire Bandit (opzionale, refresh)

---

## Obiettivo

Consolidare la command line Linux usata quotidianamente durante un web assessment: gestione file, testo, permessi, processi, e i comandi che userai per manipolare payload, wordlist e output di tool.

---

## Concetti chiave

### Redirection e pipe (fondamentali per il workflow)

```bash
comando > file.txt      # sovrascrive output su file
comando >> file.txt     # appende output
comando1 | comando2     # passa output di 1 come input di 2
comando 2>&1            # unisce stderr a stdout
```

### Permessi file (rilevante per privesc post-exploitation)

```
-rwsr-xr-x  <- SUID bit (s al posto di x nel gruppo owner)
```

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| grep | `grep -i "password" file.txt` | righe matching | `-r` ricorsivo, `-E` regex estesa |
| sed | `sed 's/http/https/g' file.txt` | testo modificato | utile per manipolare wordlist/payload |
| awk | `awk -F: '{print $1}' /etc/passwd` | campo estratto | parsing output CSV-like |
| cut | `cut -d: -f1 /etc/passwd` | campo estratto | piu semplice di awk per split banali |
| find | `find / -perm -4000 2>/dev/null` | file SUID | privesc enumeration |
| xargs | `cat urls.txt \| xargs -I{} curl -sI {}` | esegue comando per ogni riga | batch requests |

---

## Payload / Esempi

### Esempio 1: preparare una wordlist di username da una lista di nomi

```bash
cat names.txt | tr 'A-Z' 'a-z' | sed 's/ /./g' > usernames.txt
```

**Spiegazione:** trasforma "Mario Rossi" in "mario.rossi", pattern username comune da testare in credential stuffing.

### Esempio 2: estrarre tutti i parametri da una lista di URL

```bash
cat urls.txt | grep -oP '(?<=\?)[^ ]+' | tr '&' '\n' | cut -d= -f1 | sort -u
```

**Spiegazione:** utile per costruire rapidamente una lista di parametri candidati da fuzzare per SQLi/XSS su un intero sito.

### Esempio 3: batch di richieste con xargs e parallel

```bash
cat subdomains.txt | xargs -P 10 -I{} curl -sI https://{} -o /dev/null -w "%{http_code} {}\n"
```

**Spiegazione:** verifica velocemente quali subdomain rispondono, 10 richieste in parallelo.

---

## Evasion / Bypass Techniques

Non applicabile direttamente: questo file e strumentale. Vedi le sezioni tematiche per evasion specifiche (WAF, filtri).

---

## Lab Hands-On

### Lab 1: OverTheWire Bandit (livelli 0-10)
**Obiettivo:** rinfrescare comandi base di navigazione/manipolazione file
**Difficulty:** Facile
**Time:** 1h

**Walkthrough breve:**
1. SSH nel primo livello con le credenziali fornite
2. Trova la password del livello successivo nascosta nel filesystem
3. Ripeti usando `find`, `grep`, `file`, permessi

---

## Common Mistakes

- Scrivere payload lunghi a mano ogni volta -> costruisci alias/funzioni bash riutilizzabili (vedi [09-Tools-Reference/Scripting-Snippets.md](../09-Tools-Reference/Scripting-Snippets.md))
- Non salvare mai l'output dei comandi -> usa sempre `| tee output.txt` durante l'engagement

---

## Link Utili

- [OverTheWire Bandit](https://overthewire.org/wargames/bandit/)
- [Explainshell](https://explainshell.com/)

---

## Connessioni

- **Prerequisito:** [Networking-Basics.md](Networking-Basics.md)
- **Prossimo Step:** [Burp-Suite-Setup.md](Burp-Suite-Setup.md)
- **Combinazione con:** [09-Tools-Reference/Command-Line-Tools.md](../09-Tools-Reference/Command-Line-Tools.md)

---

## Checklist di padronanza

- [ ] So usare grep/sed/awk/cut senza cercare online
- [ ] So costruire pipe di piu comandi
- [ ] So usare xargs per batch di richieste
- [ ] Ho un set di alias/script pronti nel mio ambiente

---

## Note personali

_(spazio libero)_
