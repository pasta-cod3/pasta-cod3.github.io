---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Wordlists Cheatsheet"
permalink: "/cheatsheet/ejpt/11-tools-reference/wordlists-cheatsheet/"
section: "Tools Reference"
section_order: 11
order: 50
sort_key: 1150
---

**Difficoltà:** Beginner
**Time to Master:** 1h
**Prerequisiti:** [05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](/cheatsheet/ejpt/05-system-host-attacks/03-password-attacks-hydra-john-hashcat/)
**Lab:** riferimento trasversale

---

## Obiettivo

Le wordlist sono la parte noiosa che si sottovaluta sempre, finché non ti capita di far fallire un attacco a dizionario per aver usato la lista sbagliata. Qui trovi dove pescare quelle già pronte su Kali, come generarne di su misura per il target che hai davanti, e come combinarle con le rules per moltiplicarne l'efficacia senza scaricare terabyte di variazioni.

---

## Wordlist già presenti su Kali

| Percorso | Contenuto | Uso tipico |
|----------|-----------|------------|
| `/usr/share/wordlists/rockyou.txt` | ~14M password reali da leak pubblici | password attack generico (va decompressa con `gunzip`) |
| `/usr/share/seclists/Discovery/Web-Content/` | liste per directory/file brute force | gobuster/ffuf su webapp |
| `/usr/share/seclists/Usernames/` | username comuni, default account | user enumeration, login brute force |
| `/usr/share/seclists/Passwords/Common-Credentials/` | combo user:pass di default per dispositivi/servizi | router, pannelli admin, IoT |
| `/usr/share/wordlists/metasploit/` | wordlist usate dai moduli auxiliary di Metasploit | scanner/login moduli MSF |

```bash
# rockyou e spesso compressa di default
sudo gunzip /usr/share/wordlists/rockyou.txt.gz
```

Se seclists non è installata te ne accorgi subito perché i path sopra non esistono: `sudo apt install seclists`, oppure clonala da GitHub.

---

## Generare wordlist custom

### cewl: estrai parole da un sito web target

```bash
cewl -d 2 -m 5 -w custom-words.txt http://target.com
```

Utile quando il target ha un gergo aziendale suo, perché quel gergo, nome del prodotto, slogan, termini interni, finisce quasi sempre dentro le password dei dipendenti.

### crunch: genera combinazioni secondo pattern

```bash
# password numeriche di 4 cifre
crunch 4 4 0123456789 -o pin4.txt

# pattern con charset custom: lettera maiuscola + 3 minuscole + 2 numeri
crunch 6 6 -t @@@@%% -o custom-pattern.txt
```

### cupp: profilo personalizzato basato su dati noti del target

```bash
cupp -i
# risponde a nome, cognome, data nascita, nome animale ecc: genera varianti tipiche (Nome1990!, nome_cognome, ecc.)
```

---

## Combinare wordlist con regole (rules)

Le rules fanno il lavoro sporco al posto tuo: prendono ogni parola della wordlist base e generano varianti plausibili (maiuscole, numeri finali, leetspeak) senza che tu debba creare a mano milioni di combinazioni.

```bash
# hashcat con la rule "best64" (inclusa di default)
hashcat -m 1000 -a 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# john con rules
john --wordlist=rockyou.txt --rules hash.txt
```

**Perché funziona:** `best64.rule` applica una sessantina di trasformazioni comuni (numero in fondo, iniziale maiuscola, leet) a ogni parola, e spesso basta questo per trasformare una wordlist debole in un attacco molto più efficace, senza far esplodere i tempi di esecuzione.

---

## Connessioni

- **Prerequisito:** [05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](/cheatsheet/ejpt/05-system-host-attacks/03-password-attacks-hydra-john-hashcat/)
- **Combinazione con:** [03-Enumeration/05-Web-Enumeration.md](/cheatsheet/ejpt/03-enumeration/05-web-enumeration/)
