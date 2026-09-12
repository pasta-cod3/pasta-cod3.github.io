# Password Attacks: Hydra, John, Hashcat

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [../00-Fundamentals/05-Cryptography-Basics.md](../00-Fundamentals/05-Cryptography-Basics.md)
**Lab:** INE PTS labs / TryHackMe, Crack the Hash

---

## Obiettivo

Nei file precedenti hai già usato Hydra e hashdump un po' "a intuito": qui è il momento di capire davvero cosa stai facendo, perché quasi ogni lab eJPT a un certo punto ti mette in mano un servizio con login o un hash e ti aspetta al varco. Padroneggia i tre strumenti principali — brute force online contro servizi di rete (Hydra), cracking offline di hash (John the Ripper), cracking offline accelerato via GPU (Hashcat) — e saprai sempre quale dei tre tirare fuori a seconda di cosa hai davanti.

---

## Concetti chiave

### Online vs offline password attack

| Tipo | Strumento | Quando si usa |
|------|-----------|-----------------|
| Online (contro un servizio) | Hydra, Medusa | quando hai solo un servizio di rete raggiungibile (SSH/FTP/RDP/form web) |
| Offline (contro un hash già estratto) | John the Ripper, Hashcat | quando hai già ottenuto un hash (SAM, /etc/shadow, dump DB) |

Se puoi scegliere, scegli sempre l'offline: nessun rischio di lockout o rilevazione, e la velocità non è nemmeno paragonabile — è la differenza tra provare password una alla volta e provarne miliardi al secondo.

### Wordlist principali

| Wordlist | Percorso tipico | Note |
|----------|-------------------|------|
| rockyou.txt | `/usr/share/wordlists/rockyou.txt` | ~14M password reali da leak, la più usata in lab |
| SecLists | `/usr/share/seclists/` | collezione ampia (username, password, fuzzing) |
| crunch | generata al volo | pattern custom (es. solo numerica, lunghezza fissa) |
| cewl | generata dal sito target | wordlist basata su parole del sito web del target |

### Hashcat mode number (esempi comuni)

| Mode | Tipo hash |
|------|-----------|
| 0 | MD5 |
| 100 | SHA1 |
| 1000 | NTLM |
| 1800 | sha512crypt (Linux /etc/shadow) |
| 3200 | bcrypt |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| hydra | `hydra -l user -P wordlist target service` | credenziali valide | online, molti protocolli (ssh/ftp/http-post-form/rdp/smb) |
| john | `john --wordlist=rockyou.txt hash.txt` | password in chiaro | offline, auto-detect formato hash |
| hashcat | `hashcat -m <mode> -a 0 hash.txt wordlist.txt` | password in chiaro | offline, accelerato GPU |
| crunch | `crunch 6 6 0123456789 -o nums.txt` | wordlist generata | utile per PIN/pattern numerici |

---

## Payload / Esempi

### Esempio 1: brute force login form web con Hydra

```bash
hydra -l admin -P /usr/share/wordlists/rockyou.txt 10.10.10.5 http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"
```

**Output atteso:**
```
[80][http-post-form] host: 10.10.10.5   login: admin   password: admin123
```

**Spiegazione:** `^USER^`/`^PASS^` sono placeholder sostituiti da Hydra; l'ultima parte della stringa è la firma di risposta che indica fallimento, necessaria per distinguere tentativo riuscito da fallito.

### Esempio 2: cracking hash NTLM con John

```bash
john --format=NT --wordlist=/usr/share/wordlists/rockyou.txt ntlm-hashes.txt
john --show ntlm-hashes.txt
```

**Output atteso:**
```
administrator:Password123!:::
```

**Spiegazione:** dopo un dump di hash NTLM (vedi [04-Credential-Dumping-Mimikatz.md](04-Credential-Dumping-Mimikatz.md)), John prova ogni parola della wordlist contro l'hash fino a trovare match; `--show` visualizza i risultati già craccati.

### Esempio 3: cracking hash Linux /etc/shadow con Hashcat

```bash
hashcat -m 1800 -a 0 shadow-hashes.txt /usr/share/wordlists/rockyou.txt
```

**Spiegazione:** mode 1800 corrisponde a sha512crypt, formato standard delle password in `/etc/shadow` sui sistemi Linux moderni; `-a 0` indica attacco a dizionario semplice.

---

## Evasion / Bypass Techniques

Per servizi con account lockout policy, preferire **password spraying** (una password comune contro molti utenti, con delay tra i tentativi) invece del brute force classico (`hydra -t 1` con pausa, oppure crackmapexec con `--continue-on-success` per spraying su più host contemporaneamente).

---

## Lab Hands-On

### Lab 1: TryHackMe, Crack the Hash
**Obiettivo:** identificare il tipo di hash e craccarlo con lo strumento corretto
**Difficulty:** Facile
**Time:** 45 min

**Walkthrough breve:**
1. Identifica il formato dell'hash (lunghezza, charset, hashcat --identify)
2. Scegli il mode corretto per hashcat o il formato per John
3. Lancia il cracking con rockyou.txt e documenta la password trovata

---

## Common Mistakes

- Usare rockyou.txt intero contro un servizio online lento -> tempi enormi, meglio wordlist mirate/piccole per attacchi online
- Non identificare correttamente il formato hash prima di lanciare John/Hashcat -> nessun match anche se la password e nella wordlist
- Ignorare il rischio di lockout account durante brute force su servizi con policy restrittiva -> preferire password spraying

---

## Link Utili

- [Hashcat example hashes (mode reference)](https://hashcat.net/wiki/doku.php?id=example_hashes)
- [SecLists: GitHub](https://github.com/danielmiessler/SecLists)

---

## Connessioni

- **Prerequisito:** [../00-Fundamentals/05-Cryptography-Basics.md](../00-Fundamentals/05-Cryptography-Basics.md)
- **Prossimo Step:** [04-Credential-Dumping-Mimikatz.md](04-Credential-Dumping-Mimikatz.md)
- **Combinazione con:** [01-Windows-Host-Attacks.md](01-Windows-Host-Attacks.md), [02-Linux-Host-Attacks.md](02-Linux-Host-Attacks.md)

---

## Checklist di padronanza

- [ ] So scegliere tra attacco online e offline in base a cosa ho disponibile
- [ ] So usare Hydra contro almeno 3 protocolli diversi (ssh/ftp/http-post-form)
- [ ] So identificare un formato hash e sceglierne il mode corretto in Hashcat
- [ ] Conosco la differenza tra brute force e password spraying e quando preferire l'uno o l'altro

