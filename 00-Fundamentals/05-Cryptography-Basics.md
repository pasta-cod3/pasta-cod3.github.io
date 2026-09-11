# Cryptography Basics

**Difficolta:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [04-Windows-Fundamentals.md](04-Windows-Fundamentals.md)
**Lab:** INE PTS — Cryptography Fundamentals

---

## Obiettivo

Avere abbastanza crittografia applicata da riconoscere tipi di hash, capire cosa protegge TLS e sapere quando/come attaccare password hashate — non serve teoria matematica approfondita per eJPTv2, serve riconoscimento pratico.

---

## Concetti chiave

### Hashing vs Cifratura

| Caratteristica | Hashing | Cifratura (Encryption) |
|------------------|---------|---------------------------|
| Reversibile? | No (one-way) | Si, con la chiave giusta |
| Uso tipico | integrita, storage password | confidenzialita dei dati in transito/riposo |
| Esempio | SHA-256, bcrypt | AES, RSA |

### Simmetrico vs Asimmetrico

| Tipo | Chiavi | Velocita | Uso tipico |
|------|--------|----------|------------|
| Simmetrico | stessa chiave per cifrare/decifrare | veloce | cifratura di grandi moli di dati (AES) |
| Asimmetrico | coppia pubblica/privata | lento | scambio chiavi, firma digitale (RSA), TLS handshake iniziale |

### Algoritmi comuni

| Algoritmo | Tipo | Note |
|-----------|------|------|
| MD5 | hash | rotto, ancora molto diffuso in sistemi legacy |
| SHA-1 | hash | deprecato per sicurezza ma ancora presente |
| SHA-256/512 | hash | standard moderno |
| bcrypt | hash password | include salt + cost factor, resistente a bruteforce |
| AES | simmetrico | standard per cifratura dati |
| RSA | asimmetrico | standard per scambio chiavi/firma |

### TLS/SSL handshake essenziale

1. Client Hello (cifrari supportati)
2. Server Hello + certificato (chiave pubblica)
3. Scambio/derivazione chiave di sessione (asimmetrico -> simmetrico)
4. Comunicazione cifrata simmetricamente (piu veloce per il traffico effettivo)

### Hash password che incontrerai nel pentest

| Contesto | Formato hash | Note |
|----------|----------------|------|
| Windows locale (SAM) | NTLM | `whoami`-accessibile via Mimikatz/hashdump, crackabile con hashcat mode 1000 |
| Active Directory | NTLM / Kerberos (AS-REP, TGS) | vedi Kerberoasting in [05-System-Host-Attacks](../05-System-Host-Attacks/) |
| Linux `/etc/shadow` | SHA-512 crypt (`$6$...`) | hashcat mode 1800 |
| Applicazioni web moderne | bcrypt (`$2b$...`), scrypt, Argon2 | molto piu lente da crackare per design |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| hashid / hash-identifier | `hashid <hash>` | possibile tipo di hash | primo step prima di crackare |
| hashcat | `hashcat -m 1000 hash.txt wordlist.txt` | password crackata | `-m` seleziona l'algoritmo |
| openssl | `openssl s_client -connect target.com:443` | dettagli certificato TLS | verifica cipher/certificato |

---

## Payload / Esempi

### Esempio 1: identificare un hash sconosciuto

```bash
hashid '5f4dcc3b5aa765d61d8327deb882cf99'
```

**Output atteso:**
```
Analyzing '5f4dcc3b5aa765d61d8327deb882cf99'
[+] MD5
[+] Domain Cached Credentials
```

**Spiegazione:** la lunghezza (32 caratteri hex) e la struttura suggeriscono MD5; il valore reale corrisponde ad hash MD5 di "password" — utile confermarlo prima di lanciare hashcat con il modulo sbagliato.

### Esempio 2: ispezionare un certificato TLS

```bash
openssl s_client -connect target.com:443 -servername target.com </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

**Spiegazione:** rivela subject/issuer/validita del certificato — utile per fingerprinting (nomi interni nel subject, CA usata) e per capire se e self-signed (spesso indice di ambiente di test/interno).

---

## Common Mistakes

- Lanciare hashcat con il modulo `-m` sbagliato -> nessun crack anche se la wordlist contiene la password giusta
- Confondere hashing con cifratura in un report -> imprecisione che salta subito all'occhio del reviewer
- Sottovalutare bcrypt/Argon2 come "crackabili facilmente come MD5" -> il cost factor li rende ordini di grandezza piu lenti

---

## Link Utili

- [Hashcat — example hashes](https://hashcat.net/wiki/doku.php?id=example_hashes)
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

## Connessioni

- **Prerequisito:** [04-Windows-Fundamentals.md](04-Windows-Fundamentals.md)
- **Prossimo Step:** [01-Information-Gathering](../01-Information-Gathering/)
- **Combinazione con:** [05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md)

---

## Checklist di padronanza

- [ ] So la differenza tra hashing e cifratura con un esempio ciascuno
- [ ] So riconoscere a colpo d'occhio MD5/SHA1/SHA256/NTLM da lunghezza e formato
- [ ] Capisco perche bcrypt e piu sicuro di MD5 per le password
- [ ] So spiegare a grandi linee cosa succede in un TLS handshake

---

## Note personali

_(spazio libero)_
