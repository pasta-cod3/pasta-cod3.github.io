---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Command-Line Tools Quick Reference"
permalink: "/cheatsheet/ewpt/09-tools-reference/command-line-tools/"
section: "Tools Reference"
section_order: 9
order: 50
sort_key: 950
---

**Difficoltà:** Beginner
**Time to Master:** 1h
**Prerequisiti:** [00-Fundamentals/Linux-for-WebHacking.md](/cheatsheet/ewpt/00-fundamentals/linux-for-webhacking/)
**Lab:** riferimento trasversale

---

## Obiettivo

Durante l'esame non hai tempo di aprire il man di nmap per ricordarti se era `-sV` o `-sC` a fare cosa. Questa è la pagina che tieni aperta in un tab: le flag di nmap, curl, gobuster/ffuf e sqlmap che usi davvero, senza il resto del manuale che non ti serve in quel momento.

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

- **Prerequisito:** [00-Fundamentals/Linux-for-WebHacking.md](/cheatsheet/ewpt/00-fundamentals/linux-for-webhacking/)
- **Prossimo Step:** [Scripting-Snippets.md](/cheatsheet/ewpt/09-tools-reference/scripting-snippets/)
