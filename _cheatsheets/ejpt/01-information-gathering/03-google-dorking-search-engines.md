---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Google Dorking & Search Engines"
permalink: "/cheatsheet/ejpt/01-information-gathering/03-google-dorking-search-engines/"
section: "Information Gathering"
section_order: 1
order: 3
sort_key: 103
---

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [02-Active-Information-Gathering.md](/cheatsheet/ejpt/01-information-gathering/02-active-information-gathering/)
**Lab:** INE PTS, Information Gathering

---

## Obiettivo

Google e GitHub hanno già indicizzato più cose del target di quanto pensi, e trovarle è ancora recon passiva al 100%: nessun traffico diretto verso il target, solo query mirate a un motore di ricerca. Con gli operatori giusti (`site:`, `filetype:`, `inurl:`) e qualche dork della GHDB scopri file esposti per errore, credenziali finite in un repository pubblico, pannelli di login che nessuno pensava fossero raggiungibili da fuori.

---

## Concetti chiave

### Operatori Google dork principali

| Operatore | Uso |
|-----------|-----|
| `site:` | limita a un dominio |
| `intitle:` | testo nel titolo pagina |
| `inurl:` | testo nell'URL |
| `filetype:` | tipo file specifico |
| `intext:` | testo nel corpo pagina |
| `-` | esclude termine |

### GHDB (Google Hacking Database)

Raccolta pubblica su Exploit-DB di dork già pronti, categorizzati per tipo di risultato (file sensibili, pannelli di login, messaggi di errore, ecc.): punto di partenza migliore rispetto a inventare dork da zero.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Google Search | dork manuale | pagine indicizzate | manuale, gratuito |
| GitHub Search | dork su github.com/search | codice sorgente pubblico | ottimo per secret leak |
| GHDB (Exploit-DB) | consultazione online | dork predefiniti categorizzati | database di dork pronti |

---

## Payload / Esempi

### Esempio 1: file sensibili esposti sul dominio target

```
site:target.com filetype:env
site:target.com filetype:sql
site:target.com filetype:log
site:target.com inurl:admin
site:target.com inurl:login
```

**Spiegazione:** file `.env`, `.sql`, `.log` indicizzati per errore spesso contengono credenziali DB, chiavi API, path interni.

### Esempio 2: dorking su GitHub per secret leak

```
org:nome-azienda password
org:nome-azienda "api_key"
"target.com" path:*.env
```

**Spiegazione:** sviluppatori committano per errore credenziali/chiavi in repository pubblici. La code search GitHub filtra per nome/estensione file con `path:` (es. `path:*.env`).

### Esempio 3: pannelli admin esposti

```
site:target.com inurl:wp-admin
site:target.com inurl:phpmyadmin
site:target.com intitle:"dashboard" -intitle:"login"
```

**Spiegazione:** trovare pannelli amministrativi esposti pubblicamente e spesso il primo passo verso attacchi di credential stuffing o password spraying.

---

## Evasion / Bypass Techniques

Tecnica interamente passiva: nessuna evasion necessaria verso il target.

---

## Lab Hands-On

### Lab 1: INE PTS, Dorking Practice
**Obiettivo:** applicare dork per trovare file/pannelli esposti su target di laboratorio
**Difficulty:** Facile
**Time:** 25 min

**Walkthrough breve:**
1. Prova gli operatori site:/filetype:/inurl: sul dominio assegnato
2. Consulta la GHDB per dork pre-costruiti
3. Documenta ogni file/pannello trovato con URL

---

## Common Mistakes

- Limitarsi a Google -> il dorking su GitHub trova spesso secret che Google non indicizza
- Ignorare la cache -> una pagina rimossa può essere ancora visibile in cache/Wayback Machine

---

## Link Utili

- [Google Hacking Database (GHDB)](https://www.exploit-db.com/google-hacking-database)
- [GitHub Code Search](https://github.com/search)

---

## Connessioni

- **Prerequisito:** [02-Active-Information-Gathering.md](/cheatsheet/ejpt/01-information-gathering/02-active-information-gathering/)
- **Prossimo Step:** [Lab-Challenges.md](/cheatsheet/ejpt/01-information-gathering/lab-challenges/)
- **Combinazione con:** [03-Enumeration/05-Web-Enumeration.md](/cheatsheet/ejpt/03-enumeration/05-web-enumeration/)

---

## Checklist di padronanza

- [ ] Conosco gli operatori Google dork principali a memoria
- [ ] So cercare secret leak su GitHub
- [ ] Ho consultato la GHDB almeno una volta
- [ ] So documentare i risultati con URL precisi
