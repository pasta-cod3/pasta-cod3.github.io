---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "Virtual Host Enumeration"
permalink: "/cheatsheet/ewpt/02-scanning-enumeration/04-virtual-host-enum/"
section: "Scanning & Enumeration"
section_order: 2
order: 4
sort_key: 204
---

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/)
**Lab:** HTB, macchine multi-vhost

---

## Obiettivo

Un solo IP può nascondere più applicazioni distinte, invisibili al DNS pubblico e raggiungibili solo se sai quale header `Host` chiedere. È qui che spesso si trovano gli ambienti "dimenticati" — staging, admin, api interne — che nessuno protegge quanto il sito principale perché "tanto non li trova nessuno".

---

## Concetti chiave

### Come funziona il virtual hosting

Un singolo server IP può ospitare più siti distinti in base all'header `Host` della richiesta HTTP. Se conosci solo l'IP, provando `Host` diversi puoi scoprire applicazioni non linkate da nessuna parte pubblicamente.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| ffuf | `ffuf -w wordlist -H "Host: FUZZ.target.com" -u http://target.com` | vhost validi | filtra per size response |
| gobuster vhost | `gobuster vhost -u http://target.com -w wordlist --append-domain` | vhost validi | modalità dedicata |
| wfuzz | `wfuzz -w wordlist -H "Host: FUZZ.target.com" http://target.com` | vhost validi | alternativa a ffuf |

---

## Payload / Esempi

### Esempio 1: vhost fuzzing con ffuf

```bash
ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt \
  -H "Host: FUZZ.target.com" \
  -u http://target.com \
  -fs 1234
```

**Output atteso:**
```
staging                [Status: 200, Size: 3456]
api                    [Status: 200, Size: 892]
```

**Spiegazione:** `-fs 1234` esclude tutte le response di dimensione uguale a quella del vhost "non esistente" di default (misuralo prima con un host fittizio), isolando i vhost reali configurati.

**Nota:** dalla v3.6 di gobuster, la modalità `vhost` richiede `--append-domain` per costruire l'header come `parola.target.com`; senza questo flag gobuster usa le parole della wordlist così come sono come Host completo (utile solo se la wordlist contiene già FQDN).

### Esempio 2: verifica manuale con curl

```bash
curl -H "Host: staging.target.com" http://target.com -v
```

---

## Evasion / Bypass Techniques

Nota: aggiungi sempre il vhost trovato al file `/etc/hosts` locale per navigarlo normalmente (link relativi, redirect, cookie legati al dominio funzionano solo così):

```bash
echo "TARGET_IP staging.target.com" | sudo tee -a /etc/hosts
```

---

## Lab Hands-On

### Lab 1: HTB, macchina con vhost nascosto
**Obiettivo:** scoprire un'applicazione admin/staging non linkata
**Difficulty:** Medio
**Time:** 45 min

**Walkthrough breve:**
1. Fuzzing vhost su IP del target
2. Aggiungi vhost trovato a `/etc/hosts`
3. Ripeti l'intera enumerazione web sul nuovo vhost

---

## Common Mistakes

- Dimenticare di filtrare per size response -> migliaia di falsi positivi con lo stesso contenuto "default vhost"
- Non aggiungere il vhost a `/etc/hosts` -> molte app rompono redirect/asset se navigate solo via IP

---

## Link Utili

- [SecLists: subdomains wordlist](https://github.com/danielmiessler/SecLists/tree/master/Discovery/DNS)

---

## Connessioni

- **Prerequisito:** [03-Web-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/03-web-enumeration/)
- **Prossimo Step:** [05-API-Enumeration.md](/cheatsheet/ewpt/02-scanning-enumeration/05-api-enumeration/)

---

## Checklist di padronanza

- [ ] So fuzzare vhost e filtrare i falsi positivi
- [ ] So aggiungere vhost trovati a /etc/hosts
- [ ] Ripeto sempre l'enumerazione completa su ogni vhost scoperto
