# Password Cracking: hashcat e hydra per principianti

## Introduzione

Le password sono ancora la principale linea di difesa della maggior parte dei sistemi. E la maggior parte delle password fa schifo.

Il **password cracking** è l'arte di recuperare password da hash o di trovare credenziali valide per l'accesso a un sistema. È una delle tecniche più usate nei penetration test — e una delle più efficaci.

Due strumenti dominano questo campo:
- **Hashcat** — cracking offline di hash
- **Hydra** — brute force online su servizi di rete

---

## Parte 1: Hashcat — cracking offline

### Cos'è un hash

Quando un sistema salva una password, non la salva in chiaro. La passa attraverso una funzione di hashing (MD5, SHA1, bcrypt, NTLM, ecc.) che produce una stringa di lunghezza fissa.

```
password: "ciao123"
MD5:      "db40bfb39f8e4d71a59c2b9bc0312d41"
SHA1:     "6e82282b7d09e1b5a0e4cd8c30c7cc3a0b27c72"
NTLM:     "5cf0ee6b18e8f3d6e3d9c9c1e5e7f72a"
```

Il cracking consiste nel trovare quale testo originale produce quell'hash.

### Installazione

```bash
# Kali / Parrot (preinstallato)
hashcat --version

# Ubuntu/Debian
sudo apt install hashcat
```

Hashcat sfrutta la GPU per velocità enormi. Con una GPU moderna puoi testare miliardi di hash al secondo per algoritmi deboli come MD5.

### Tipi di attacco

#### Attacco a dizionario (-a 0)

Prova tutte le parole di un file wordlist.

```bash
hashcat -a 0 -m 0 hash.txt /usr/share/wordlists/rockyou.txt
```

**RockYou** è la wordlist standard: contiene 14 milioni di password reali leaked nel 2009.

#### Attacco brute force (-a 3)

Prova tutte le combinazioni possibili di caratteri.

```bash
# Tutte le combinazioni di 6 caratteri minuscoli
hashcat -a 3 -m 0 hash.txt ?l?l?l?l?l?l

# Charset disponibili:
# ?l = minuscole (a-z)
# ?u = maiuscole (A-Z)
# ?d = cifre (0-9)
# ?s = simboli
# ?a = tutti
```

#### Attacco con regole (-a 0 -r)

Le regole trasformano le parole della wordlist: aggiungono numeri, maiuscole, sostituiscono lettere con simboli (leet speak), ecc.

```bash
hashcat -a 0 -m 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule
```

### Identificare il tipo di hash (-m)

```bash
# Identificazione automatica (strumento separato)
hashid hash.txt

# Tipi comuni:
# -m 0     → MD5
# -m 100   → SHA1
# -m 1000  → NTLM (Windows)
# -m 1800  → SHA-512 Unix ($6$)
# -m 3200  → bcrypt (molto lento)
# -m 13100 → Kerberos TGS (Kerberoasting)
```

### Esempio pratico: crack di hash NTLM da Windows

```bash
# Hai dumpato gli hash con Mimikatz o hashdump di Meterpreter:
Administrator:500:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::

# Prendi solo la parte NTLM (dopo il secondo :)
echo "8846f7eaee8fb117ad06bdd830b7586c" > ntlm.txt

# Cracking
hashcat -a 0 -m 1000 ntlm.txt rockyou.txt

# Risultato
8846f7eaee8fb117ad06bdd830b7586c:password
```

---

## Parte 2: Hydra — brute force online

Hydra testa credenziali direttamente su servizi di rete: SSH, FTP, HTTP, RDP, SMB, database e altro.

> **Attenzione:** il brute force online genera molti tentativi di login e viene quasi sempre loggato. Usalo solo su sistemi autorizzati, e considera l'impatto (blocco account, alert, ecc.).

### Sintassi base

```bash
hydra -l utente -P wordlist.txt PROTOCOLLO://IP
```

### Esempi per servizio

```bash
# SSH — prova username fisso con wordlist di password
hydra -l admin -P rockyou.txt ssh://192.168.1.100

# SSH — prova lista di username E lista di password
hydra -L users.txt -P rockyou.txt ssh://192.168.1.100

# FTP
hydra -l ftpuser -P rockyou.txt ftp://192.168.1.100

# RDP (Windows Remote Desktop)
hydra -l administrator -P rockyou.txt rdp://192.168.1.100

# HTTP form di login (POST)
hydra -l admin -P rockyou.txt 192.168.1.100 http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"
```

### Opzioni utili

```bash
-t 4        → thread paralleli (default 16, metti 4 per essere più cauto)
-V          → verbose, mostra ogni tentativo
-f          → fermati al primo match trovato
-o out.txt  → salva i risultati su file
-s 2222     → porta personalizzata
```

---

## Wordlist: dove trovarle

```bash
# RockYou (già su Kali, compressa)
gunzip /usr/share/wordlists/rockyou.txt.gz

# SecLists — raccolta enorme di wordlist
sudo apt install seclists
ls /usr/share/seclists/Passwords/

# CeWL — genera wordlist dal sito del target
cewl https://www.target.com -m 6 -w target_words.txt
```

**CeWL** è particolarmente interessante: fa scraping del sito del target e costruisce una wordlist con le parole trovate. Le persone spesso usano parole legate alla loro azienda come password.

---

## Difendersi dal password cracking

Come blue teamer, cosa fare:

- **Password policy forte:** minimo 12 caratteri, maiuscole, numeri, simboli
- **Multi-factor authentication (MFA):** rende il cracking online inutile
- **Account lockout:** blocca l'account dopo N tentativi falliti (mitiga Hydra)
- **Hashing forte:** bcrypt, Argon2, scrypt — rallentano enormemente Hashcat
- **Password manager:** gli utenti non riusano password se non devono ricordarle

---

## Conclusione

Il password cracking dimostra perché le password deboli sono un problema reale — non teorico. "password123" viene craccata in millisecondi. "Tr0ub4dor&3" resiste ore. "xK#9mLq$2vNp" non verrà mai craccata con un dizionario.

Come penetration tester, il cracking delle password è spesso il modo più veloce per muoversi lateralmente dopo un primo accesso. Impara a usare questi strumenti bene, e soprattutto impara cosa ti dicono sulla sicurezza dei sistemi che stai testando.
