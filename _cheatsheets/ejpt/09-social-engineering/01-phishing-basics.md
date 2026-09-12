---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Phishing Basics"
permalink: "/cheatsheet/ejpt/09-social-engineering/01-phishing-basics/"
section: "Social Engineering"
section_order: 9
order: 1
sort_key: 901
---

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [00-Fundamentals/01-Cybersecurity-Concepts.md](/cheatsheet/ejpt/00-fundamentals/01-cybersecurity-concepts/)
**Lab:** INE PTS, Social Engineering module (simulazione controllata)

---

## Obiettivo

Dopo capitoli pieni di nmap e shell, questa sezione cambia registro: qui l'obiettivo non è un servizio vulnerabile, è una persona che clicca. Capisci come funziona un attacco di phishing/spear phishing dal punto di vista di chi lo costruisce, per poterlo simulare in un engagement autorizzato e per saperlo riconoscere/difendere lato blue team. L'eJPTv2 tratta il social engineering a livello concettuale e di simulazione controllata: non è una licenza per provarlo fuori da un lab o da un engagement con autorizzazione scritta.

---

## Concetti chiave

### Tipi di attacco

| Tipo | Canale | Target |
|------|--------|--------|
| Phishing | email di massa | utenti generici |
| Spear phishing | email mirata | persona/ruolo specifico (es. CFO) |
| Whaling | email mirata | dirigenti/executive |
| Vishing | telefono | qualsiasi utente |
| Smishing | SMS | qualsiasi utente |

### Anatomia di una email di phishing

1. **Mittente falsificato**: dominio simile (typosquatting: `paypa1.com`) o spoofing dell'header From
2. **Urgenza/paura**: "il tuo account sara sospeso", pressione a cliccare subito
3. **Link ingannevole**: testo visibile diverso dall'URL reale (hover per verificare)
4. **Allegato malevolo**: macro Office, PDF con JavaScript, eseguibile mascherato
5. **Landing page clonata**: pagina di login identica all'originale che cattura le credenziali inserite

### Clonazione di pagine di login (concetto)

In un engagement autorizzato si può clonare la pagina di login di un servizio interno (es. portale webmail aziendale) per misurare quanti utenti inseriscono le credenziali. Il principio tecnico è semplice (copia HTML/CSS/JS del form + backend che salva l'input), ma va fatto **solo** dentro lo scope firmato dal cliente, con dominio/hosting dedicato al test e piano di comunicazione post-test (debrief, non punizione).

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| SET (Social-Engineer Toolkit) | `setoolkit` | menu interattivo | vedi [02-SET-Toolkit.md](/cheatsheet/ejpt/09-social-engineering/02-set-toolkit/) |
| GoPhish | web UI su porta locale | campagne phishing tracciate | pensato per assessment aziendali autorizzati |
| swaks | `swaks --to a@b.com --from x@y.com --server smtp.target.com` | test invio SMTP | utile per verificare filtri anti-spam del cliente |

---

## Payload / Esempi

### Esempio 1: indicatori di phishing in un header email

```
From: "IT Support" <support@paypa1-security.com>
Reply-To: helpdesk@mail-verify-portal.net
Subject: URGENTE: il tuo account verra sospeso entro 24 ore
```

**Spiegazione:** dominio del mittente (`paypa1-security.com`) diverso dal dominio ufficiale, Reply-To che punta a un terzo dominio non correlato, subject con urgenza artificiale: tre red flag classiche da insegnare durante un debrief di awareness.

### Esempio 2: verifica manuale di un link sospetto (lato difensivo)

```bash
# non cliccare mai direttamente: risolvi il dominio e controlla whois/reputazione
whois mail-verify-portal.net
dig mail-verify-portal.net A
curl -sI http://mail-verify-portal.net    # solo in sandbox isolata, mai dal proprio host di lavoro
```

**Output atteso:**
```
Domain Name: MAIL-VERIFY-PORTAL.NET
Creation Date: 2026-08-02T00:00:00Z   <- dominio registrato pochi giorni fa: forte indicatore
```

**Spiegazione:** un dominio registrato da pochissimi giorni e quasi sempre un segnale di campagna phishing appena lanciata; e uno dei controlli più veloci in fase di triage.

---

## Lab Hands-On

### Lab 1: TryHackMe, Phishing awareness / Social Engineering intro
**Obiettivo:** riconoscere indicatori di phishing in email di esempio
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Analizza header e corpo di email di esempio fornite dal lab
2. Identifica dominio mittente, link reali dietro il testo visibile, urgenza artificiale
3. Documenta ogni indicatore trovato in una checklist

---

## Common Mistakes

- Testare tecniche di phishing fuori da uno scope autorizzato -> illegale, oltre che eticamente scorretto
- Concentrarsi solo sull'email e ignorare vishing/smishing -> un assessment SE completo copre più canali
- Non fare debrief post-test -> il valore del test e formativo, va sempre condiviso con gli utenti coinvolti

---

## Link Utili

- [TryHackMe: Phishing rooms](https://tryhackme.com/)
- [GoPhish: Open Source Phishing Framework](https://getgophish.com/)

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/01-Cybersecurity-Concepts.md](/cheatsheet/ejpt/00-fundamentals/01-cybersecurity-concepts/)
- **Prossimo Step:** [02-SET-Toolkit.md](/cheatsheet/ejpt/09-social-engineering/02-set-toolkit/)
- **Combinazione con:** [Lab-Challenges.md](/cheatsheet/ejpt/09-social-engineering/lab-challenges/)

---

## Checklist di padronanza

- [ ] So elencare i 5 indicatori principali di una email di phishing
- [ ] Conosco la differenza tra phishing/spear phishing/whaling/vishing/smishing
- [ ] Capisco perché la clonazione di pagine va fatta solo in scope autorizzato
