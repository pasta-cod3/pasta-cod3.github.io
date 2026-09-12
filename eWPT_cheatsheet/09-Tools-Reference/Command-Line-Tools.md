# Command-Line Tools Quick Reference

**Difficolta:** Beginner
**Time to Master:** 1h
**Prerequisiti:** [00-Fundamentals/Linux-for-WebHacking.md](../00-Fundamentals/Linux-for-WebHacking.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Riferimento rapido con flag e opzioni dei tool CLI usati piu spesso durante un engagement eWPT, per non perdere tempo a cercare la sintassi esatta durante l'esame.

---

## nmap

| Flag | Uso |
|------|-----|
| `-p-` | tutte le 65535 porte |
| `-sV` | version detection |
| `-sC` | script default |
| `--script vuln` | rilevamento CVE noti |
| `-Pn` | salta host discovery |
| `-oN/-oG/-oX` | output normale/grepable/XML |

## curl

| Flag | Uso |
|------|-----|
| `-I` | solo header response |
| `-v` | verbose, mostra request+response |
| `-X` | metodo HTTP |
| `-d` | body dati (form) |
| `--data-binary @file` | invia file come body raw |
| `-b`/`-c` | leggi/salva cookie |

## gobuster / ffuf

| Flag (gobuster) | Uso |
|------------------|-----|
| `dir -u -w` | directory brute-force |
| `vhost -u -w` | virtual host fuzzing |
| `-x php,txt,bak` | estensioni da testare |

| Flag (ffuf) | Uso |
|--------------|-----|
| `-w wordlist -u URL/FUZZ` | fuzzing generico |
| `-fs N` | filtra per size response |
| `-fc N` | filtra per status code |

## sqlmap

| Flag | Uso |
|------|-----|
| `-r request.txt` | richiesta raw da file |
| `--dbs` / `--tables` / `--dump` | enumerazione progressiva |
| `--technique=` | forza tecnica specifica |
| `--batch` | risposte automatiche default |

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/Linux-for-WebHacking.md](../00-Fundamentals/Linux-for-WebHacking.md)
- **Prossimo Step:** [Scripting-Snippets.md](Scripting-Snippets.md)

---

## Note personali

_(spazio libero)_
