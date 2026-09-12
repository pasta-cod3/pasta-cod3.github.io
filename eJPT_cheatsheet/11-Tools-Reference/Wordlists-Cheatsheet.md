# Wordlists Cheatsheet

**Difficolta:** Beginner
**Time to Master:** 1h
**Prerequisiti:** [05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Sapere dove trovare, come generare e come combinare wordlist per password attack, brute force e directory enumeration — passaggio spesso sottovalutato ma decisivo per la riuscita di un attacco a dizionario.

---

## Wordlist gia presenti su Kali

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

Se seclists non e installata: `sudo apt install seclists` (o clona da GitHub).

---

## Generare wordlist custom

### cewl — estrai parole da un sito web target

```bash
cewl -d 2 -m 5 -w custom-words.txt http://target.com
```

Utile quando il target ha una cultura aziendale/gergo specifico che finisce spesso nelle password (nome prodotto, slogan, ecc.).

### crunch — genera combinazioni secondo pattern

```bash
# password numeriche di 4 cifre
crunch 4 4 0123456789 -o pin4.txt

# pattern con charset custom: lettera maiuscola + 3 minuscole + 2 numeri
crunch 6 6 -t @@@@%% -o custom-pattern.txt
```

### cupp — profilo personalizzato basato su dati noti del target

```bash
cupp -i
# risponde a nome, cognome, data nascita, nome animale ecc: genera varianti tipiche (Nome1990!, nome_cognome, ecc.)
```

---

## Combinare wordlist con regole (rules)

Le rules trasformano ogni parola della wordlist base in varianti plausibili (maiuscole, numeri finali, leetspeak) senza dover generare manualmente milioni di combinazioni.

```bash
# hashcat con la rule "best64" (inclusa di default)
hashcat -m 1000 -a 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# john con rules
john --wordlist=rockyou.txt --rules hash.txt
```

**Spiegazione:** `best64.rule` applica ~64 trasformazioni comuni (append numero, capitalize, leet) a ogni parola — spesso trasforma una wordlist debole in un attacco molto piu efficace senza aumentare troppo il tempo di esecuzione.

---

## Connessioni

- **Prerequisito:** [05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md)
- **Combinazione con:** [03-Enumeration/05-Web-Enumeration.md](../03-Enumeration/05-Web-Enumeration.md)

---

## Note personali

_(spazio libero)_
