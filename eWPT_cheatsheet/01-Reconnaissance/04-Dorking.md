# Google/GitHub Dorking

**Difficolta:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [03-OSINT-Tools.md](03-OSINT-Tools.md)
**Lab:** TryHackMe — Google Dorking

---

## Obiettivo

Usare gli operatori di ricerca avanzata su Google e GitHub per trovare file esposti, credenziali, pannelli di login e codice sorgente collegato al target. Tecnica passiva al 100%, non genera traffico verso il target.

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
site:target.com filetype:pdf intext:"confidenziale"
site:target.com inurl:admin
site:target.com inurl:login
site:target.com intitle:"index of" "backup"
```

**Spiegazione:** file `.env`, `.sql`, `.log` indicizzati per errore spesso contengono credenziali DB, chiavi API, path interni.

### Esempio 2: dorking su GitHub per secret leak

```
org:nome-azienda password
org:nome-azienda "api_key"
"target.com" filename:.env
"target.com" filename:config extension:php
```

**Spiegazione:** sviluppatori committano per errore credenziali/chiavi in repository pubblici (anche fork temporanei poi cancellati ma ancora in cache).

### Esempio 3: pannelli admin e tecnologia esposta

```
site:target.com inurl:wp-admin
site:target.com inurl:phpmyadmin
site:target.com intitle:"dashboard" -intitle:"login"
```

---

## Evasion / Bypass Techniques

Tecnica interamente passiva: nessuna evasion necessaria verso il target. Attenzione solo a non violare i ToS del motore di ricerca con query automatizzate troppo aggressive.

---

## Lab Hands-On

### Lab 1: TryHackMe — Google Dorking
**Obiettivo:** applicare dork per trovare file/pannelli esposti su target di laboratorio
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Prova gli operatori site:/filetype:/inurl: sul dominio assegnato
2. Consulta la Google Hacking Database per dork pre-costruiti
3. Documenta ogni file/pannello trovato con URL e screenshot

---

## Common Mistakes

- Limitarsi a Google -> GitHub dorking trova spesso secret che Google non indicizza
- Ignorare la cache -> una pagina rimossa puo essere ancora visibile in cache Google/Wayback

---

## Link Utili

- [Google Hacking Database (GHDB)](https://www.exploit-db.com/google-hacking-database)
- [GitHub Code Search](https://github.com/search)

---

## Connessioni

- **Prerequisito:** [03-OSINT-Tools.md](03-OSINT-Tools.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [02-Scanning-Enumeration/03-Web-Enumeration.md](../02-Scanning-Enumeration/03-Web-Enumeration.md)

---

## Checklist di padronanza

- [ ] Conosco gli operatori Google dork principali a memoria
- [ ] So cercare secret leak su GitHub
- [ ] Ho consultato la GHDB almeno una volta
- [ ] So documentare i risultati con URL precisi

---

## Note personali

_(spazio libero)_
