# TryHackMe — Burp Suite: The Complete Guide (Walkthrough Notes)

**Difficulty:** Facile-Medio
**Time to complete (stimato):** 3-4h (serie completa di room)
**Vulnerability:** N/A — percorso di apprendimento strumento, non una singola vulnerabilita

---

## Obiettivo

Serie di room TryHackMe dedicata interamente a Burp Suite: dal setup base fino a Intruder, Extensions, e workflow avanzati. Percorso consigliato PRIMA di iniziare seriamente le sezioni tematiche di questo cheatsheet, se Burp non e ancora familiare.

---

## Percorso consigliato

### 1. Burp Basics & Repeater
Consolida quanto visto in [00-Fundamentals/Burp-Suite-Setup.md](../00-Fundamentals/Burp-Suite-Setup.md): setup proxy, certificato, uso base di Repeater.

### 2. Burp Proxy
Intercept ON/OFF, HTTP history, Match and Replace — pratica sul flusso completo di intercettazione.

### 3. Burp Intruder
Le 4 modalita di attacco (Sniper, Battering ram, Pitchfork, Cluster bomb) — pratica su un form di login per consolidare [09-Tools-Reference/Burp-Suite-Recipes.md](../09-Tools-Reference/Burp-Suite-Recipes.md).

### 4. Burp Decoder & Comparer
Encoding/decoding rapido, diff tra risposte — utile trasversalmente per XSS/SQLi encoding.

### 5. Burp Extensions
Installazione da BApp Store: consigliate Logger++, Turbo Intruder, DOM Invader (nativo in Burp moderno).

### 6. Sequencer
Analisi entropia token di sessione — vedi [06-Authentication-Authorization/01-Session-Management.md](../06-Authentication-Authorization/01-Session-Management.md).

---

## Key Lessons

- Investire tempo nella padronanza di Burp PRIMA di attaccare vulnerabilita specifiche ripaga enormemente in velocita durante l'esame
- Le Session Handling Rules e le Macro sono spesso sottovalutate ma indispensabili per automazione su form con token dinamici
- Conoscere le scorciatoie da tastiera di Burp (Ctrl+R per Repeater, Ctrl+I per Intruder) velocizza molto il workflow sotto pressione di tempo

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/Burp-Suite-Setup.md](../00-Fundamentals/Burp-Suite-Setup.md)
- **Combinazione con:** [09-Tools-Reference/Burp-Suite-Recipes.md](../09-Tools-Reference/Burp-Suite-Recipes.md)

---

## Note personali

_(annota qui le funzionalita di Burp che usi meno e su cui vuoi tornare)_
