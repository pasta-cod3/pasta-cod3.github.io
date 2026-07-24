<div align="center">

# pasta-cod3

### Hacking Based · Ethical Mindset · Defensive First

Blog italiano di cybersecurity — penetration testing, red team, blue team,
storia dell'hacking e fondamentali di sicurezza informatica.

**[pasta-cod3.github.io](https://pasta-cod3.github.io)**

</div>

<p align="center">
  <img src="https://img.shields.io/badge/Cybersecurity-Research-darkred?style=for-the-badge&logo=hackaday&logoColor=white" />
  <img src="https://img.shields.io/badge/Penetration-Testing-black?style=for-the-badge&logo=kalilinux&logoColor=white" />
  <img src="https://img.shields.io/badge/OSINT-Analysis-1f1f1f?style=for-the-badge&logo=torproject&logoColor=white" />
  <img src="https://img.shields.io/badge/Blue%20Team-Defense-0077ff?style=for-the-badge&logo=elastic&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/eJPTv2-Certified-success?style=flat-square" />
  <img src="https://img.shields.io/badge/eWPTv2-In%20Progress-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/Jekyll-GitHub%20Pages-red?style=flat-square&logo=jekyll&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TryHackMe-Labs-red?style=for-the-badge&logo=tryhackme&logoColor=white" />
  <img src="https://img.shields.io/badge/HackTheBox-Training-9fef00?style=for-the-badge&logo=hackthebox&logoColor=black" />
</p>

---

## Indice

- [About](#about)
- [Contenuti](#contenuti)
- [Struttura del progetto](#struttura-del-progetto)
- [Stack tecnico](#stack-tecnico)
- [Come contribuire / segnalare errori](#come-contribuire--segnalare-errori)
- [Aggiungere un articolo](#aggiungere-un-articolo-solo-per-il-maintainer)
- [Roadmap](#roadmap)
- [Filosofia](#filosofia)
- [Contatti](#contatti)
- [Licenza](#licenza)

---

## About

**pasta-cod3** è un blog di cybersecurity in lingua italiana, scritto e mantenuto da **stewe** ([@stewe_sec](https://www.instagram.com/stewe_sec)), penetration tester in formazione — **eJPTv2 certificato**, attualmente in preparazione per **eWPTv2**.

L'approccio è tecnico, pratico e orientato alla comprensione reale delle vulnerabilità: non solo *cosa* fare, ma *perché* funziona e *come* ci si difende. Ogni contenuto nasce dallo studio diretto — CTF, lab su TryHackMe e HackTheBox, certificazioni — e viene riscritto in italiano per colmare un vuoto che in questa lingua esiste ancora troppo spesso.

Il progetto è pensato per:

| Chi | Perché |
|---|---|
| Studenti di cybersecurity | Materiale in italiano, spiegato dalle basi |
| Aspiranti penetration tester | Metodologia, tool, esempi pratici da CTF reali |
| Professionisti IT / SOC analyst | Approfondimenti blue team, detection, IR |
| Appassionati di sicurezza informatica | Storia dell'hacking, casi reali, attualità |

---

## Contenuti

Il sito conta oltre **100 articoli** organizzati in 5 categorie:

| Categoria | Articoli | Focus |
|---|---|---|
| 🔴 **Red Team** | 25 | Tecniche offensive: AD attacks, web exploitation, pivoting, buffer overflow, C2, wireless security |
| 🔵 **Blue Team** | 25 | Difesa: SOC, EDR, forensica digitale, Zero Trust, email security, cloud security, incident response |
| 🟣 **News** | 23 | Attualità cybersecurity, prevalentemente Italia ed Europa: breach, ransomware, normative (NIS2, GDPR) |
| 🟠 **Storia** | 18 | Eventi ed episodi storici: Stuxnet, Mitnick, Morris Worm, Operation Aurora, PSN Breach |
| 🟢 **Fondamentali** | 12 | Basi tecniche: modello OSI, crittografia, DNS, firewall, autenticazione |

Ogni articolo è filtrabile per categoria e tag direttamente dal sito, con ricerca full-text integrata.

---

## Struttura del progetto

```
pasta-cod3.github.io/
├── _config.yml          # Configurazione Jekyll
├── _layouts/
│   └── post.html        # Template per gli articoli in Markdown
├── _posts/               # Articoli recenti, in formato Jekyll (YYYY-MM-DD-slug.md)
├── posts/                # Articoli storici, HTML statico
├── css/
│   └── style.css        # Tema cyberpunk azure, dark/light mode
├── js/
│   ├── main.js          # Rendering articoli, filtri, ricerca, canvas animato
│   └── static-pages.js  # Logica per pagine statiche (about, contatti)
├── index.html            # Homepage
├── about.html             # Chi sono
├── contatti.html          # Contatti
├── llms.txt               # Sintesi del sito per agenti AI (llmstxt.org)
├── robots.txt
├── sitemap.xml
└── favicon.*              # Set completo di icone (SVG, PNG, ICO)
```

---

## Stack tecnico

- **Jekyll** — generazione statica dei nuovi articoli via GitHub Pages, front matter YAML + Markdown/Kramdown
- **HTML/CSS/JS puro** — nessun framework frontend; canvas animato custom per lo sfondo cyberpunk, tema dark/light persistente
- **GitHub Pages** — hosting e deploy automatico ad ogni push su `main`
- **SEO/AEO** — Schema.org (`WebSite`, `Blog`, `Person`), sitemap XML, `llms.txt` per l'indicizzazione da parte di agenti AI
- **Design system** — palette cyberpunk azure (`#00c8ff`), font Orbitron / Inter / JetBrains Mono, categorie colore-codificate

---

## Come contribuire / segnalare errori

Il progetto non accetta PR di contenuto (gli articoli riflettono lo studio e la voce dell'autore), ma segnalazioni e correzioni sono benvenute:

1. **Errori tecnici o refusi**: apri una [Issue](https://github.com/pasta-cod3/pasta-cod3.github.io/issues) descrivendo l'articolo e il punto impreciso
2. **Bug del sito** (rendering, filtri, ricerca): apri una Issue con browser/dispositivo usato
3. **Proposte di argomenti**: scrivi via [email](#contatti) — ogni suggerimento entra nella lista

---

## Aggiungere un articolo (solo per il maintainer)

Nuovo contenuto → file Markdown in `_posts/` con nome `YYYY-MM-DD-slug.md`:

```yaml
---
layout: post
title: "Titolo dell'articolo"
date: 2026-07-24
cat: red        # red | blue | storia | fond | news
tags: [tag1, tag2]
excerpt: "Breve descrizione, max ~180 caratteri."
---

Contenuto in Markdown...
```

Push su `main` → Jekyll builda automaticamente → l'articolo compare in homepage, filtri e ricerca senza altre modifiche.

---

## Roadmap

- [ ] Migrazione completa degli articoli storici da HTML statico a Jekyll/Markdown
- [ ] Automazione generazione `sitemap.xml` in CI
- [ ] Dominio personalizzato
- [ ] RSS feed
- [ ] Sezione write-up CTF dedicata

---

## Filosofia

Ogni articolo è scritto per essere:

- **Tecnico ma chiaro** — niente supponenza, niente semplificazioni che tradiscono la realtà
- **Diretto e pratico** — comandi, payload, esempi concreti, non solo teoria
- **Onesto sui limiti** — se qualcosa non è verificato o è un'ipotesi, viene detto

> Ethical mindset only. Nessun supporto per attività illegali o exploit contro sistemi non autorizzati. Si studia per capire e difendere, non per danneggiare.

---

## Contatti

- **Email**: [stefano.comida@protonmail.com](mailto:stefano.comida@protonmail.com)
- **GitHub**: [@pasta-cod3](https://github.com/pasta-cod3)
- **Instagram**: [@stewe_sec](https://www.instagram.com/stewe_sec)

---

## Licenza

Distribuito con licenza [MIT](LICENSE). Il codice del sito è liberamente riutilizzabile; i contenuti degli articoli restano proprietà dell'autore salvo diversa indicazione.

<p align="center">
  <sub>Built for learning. Built for defense. Built for growth.</sub>
</p>
