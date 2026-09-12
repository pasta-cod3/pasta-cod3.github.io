---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Cryptography Basics"
permalink: "/cheatsheet/ejpt/00-fundamentals/05-cryptography-basics/"
section: "Fundamentals"
section_order: 0
order: 5
sort_key: 5
---

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [04-Windows-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/04-windows-fundamentals/)
**Lab:** INE PTS, Cryptography Fundamentals

---

## Obiettivo

Buona notizia: non ti serve la matematica dietro RSA o AES, ti serve il riconoscimento pratico. Vedere una stringa di 32 caratteri hex e pensare subito "MD5, provo prima quello con hashcat" invece di tirare a indovinare, capire cosa TLS protegge davvero e cosa no, e sapere quando una password hashata è realisticamente crackabile e quando stai solo sprecando ore di GPU: è tutto quello che ti serve qui, niente di più.

---

## Concetti chiave

### Hashing vs Cifratura

| Caratteristica | Hashing | Cifratura (Encryption) |
|------------------|---------|---------------------------|
| Reversibile? | No (one-way) | Si, con la chiave giusta |
| Uso tipico | integrità, storage password | confidenzialità dei dati in transito/riposo |
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
4. Comunicazione cifrata simmetricamente (più veloce per il traffico effettivo)

### Hash password che incontrerai nel pentest

| Contesto | Formato hash | Note |
|----------|----------------|------|
| Windows locale (SAM) | NTLM | `whoami`-accessibile via Mimikatz/hashdump, crackabile con hashcat mode 1000 |
| Active Directory | NTLM / Kerberos (AS-REP, TGS) | vedi Kerberoasting in [05-System-Host-Attacks](/cheatsheet/ejpt/05-system-host-attacks/01-windows-host-attacks/) |
| Linux `/etc/shadow` | SHA-512 crypt (`$6$...`) | hashcat mode 1800 |
| Applicazioni web moderne | bcrypt (`$2b$...`), scrypt, Argon2 | molto più lente da crackare per design |

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

**Spiegazione:** la lunghezza (32 caratteri hex) e la struttura suggeriscono MD5; il valore reale corrisponde ad hash MD5 di "password": utile confermarlo prima di lanciare hashcat con il modulo sbagliato.

### Esempio 2: ispezionare un certificato TLS

```bash
openssl s_client -connect target.com:443 -servername target.com </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

**Spiegazione:** rivela subject/issuer/validità del certificato: utile per fingerprinting (nomi interni nel subject, CA usata) e per capire se e self-signed (spesso indice di ambiente di test/interno).

---

## Common Mistakes

- Lanciare hashcat con il modulo `-m` sbagliato -> nessun crack anche se la wordlist contiene la password giusta
- Confondere hashing con cifratura in un report -> imprecisione che salta subito all'occhio del reviewer
- Sottovalutare bcrypt/Argon2 come "crackabili facilmente come MD5" -> il cost factor li rende ordini di grandezza più lenti

---

## Link Utili

- [Hashcat: example hashes](https://hashcat.net/wiki/doku.php?id=example_hashes)
- [OWASP: Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

## Connessioni

- **Prerequisito:** [04-Windows-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/04-windows-fundamentals/)
- **Prossimo Step:** [01-Information-Gathering](/cheatsheet/ejpt/01-information-gathering/01-passive-recon-osint/)
- **Combinazione con:** [05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](/cheatsheet/ejpt/05-system-host-attacks/03-password-attacks-hydra-john-hashcat/)

---

## Checklist di padronanza

- [ ] So la differenza tra hashing e cifratura con un esempio ciascuno
- [ ] So riconoscere a colpo d'occhio MD5/SHA1/SHA256/NTLM da lunghezza e formato
- [ ] Capisco perché bcrypt e più sicuro di MD5 per le password
- [ ] So spiegare a grandi linee cosa succede in un TLS handshake
