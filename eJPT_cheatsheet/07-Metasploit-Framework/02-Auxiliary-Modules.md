# Auxiliary Modules

**Difficolta:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [01-Msfconsole-Basics.md](01-Msfconsole-Basics.md)
**Lab:** INE PTS — Metasploit scanning labs

---

## Obiettivo

Usare i moduli auxiliary di Metasploit per scanning, enumeration e brute force, spesso piu comodi degli strumenti standalone perche i risultati finiscono direttamente nel database del workspace.

---

## Concetti chiave

### Categorie principali di auxiliary

| Categoria | Esempio path | Uso |
|-----------|--------------|-----|
| scanner | `auxiliary/scanner/portscan/tcp` | port scanning integrato |
| scanner (version) | `auxiliary/scanner/smb/smb_version` | fingerprint versione servizio |
| scanner (login) | `auxiliary/scanner/smb/smb_login` | brute force credenziali |
| dos | `auxiliary/dos/...` | test di stabilita (usare con cautela, solo lab autorizzati) |
| admin | `auxiliary/admin/...` | interazione amministrativa non-exploit |

### Perche preferire auxiliary a strumenti standalone

Ogni host/servizio/credenziale trovato da un modulo auxiliary viene salvato automaticamente nel database (`hosts`, `services`, `creds`), disponibile per moduli successivi senza doverlo reinserire.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| auxiliary/scanner/portscan/tcp | `set RHOSTS 10.10.10.0/24; run` | porte aperte su range | piu lento di nmap, utile quando nmap non e disponibile |
| auxiliary/scanner/smb/smb_version | `set RHOSTS 10.10.10.5; run` | versione SMB/OS | popola automaticamente il db |
| auxiliary/scanner/ftp/ftp_version | `set RHOSTS 10.10.10.5; run` | banner FTP | rapido check preliminare |
| auxiliary/scanner/smb/smb_login | `set RHOSTS ...; set USER_FILE ...; set PASS_FILE ...; run` | credenziali valide | brute force, rispetta THREADS per velocita |

---

## Payload / Esempi

### Esempio 1: version scan SMB su un range

```
msf6 > use auxiliary/scanner/smb/smb_version
msf6 auxiliary(scanner/smb/smb_version) > set RHOSTS 10.10.10.0/24
msf6 auxiliary(scanner/smb/smb_version) > set THREADS 20
msf6 auxiliary(scanner/smb/smb_version) > run
```

**Output atteso:**
```
[+] 10.10.10.5:445 - Host is running Windows 7 Professional 7601 Service Pack 1 (build:7601) (name:PC01) (domain:WORKGROUP)
[*] 10.10.10.0/24 - Scanned 254 of 254 hosts
```

**Spiegazione:** ogni host che risponde viene aggiunto al database con `hosts -o csv` esportabile in qualsiasi momento; utile per costruire rapidamente una mappa della rete.

### Esempio 2: brute force credenziali SMB

```
msf6 > use auxiliary/scanner/smb/smb_login
msf6 auxiliary(scanner/smb/smb_login) > set RHOSTS 10.10.10.5
msf6 auxiliary(scanner/smb/smb_login) > set USER_FILE users.txt
msf6 auxiliary(scanner/smb/smb_login) > set PASS_FILE rockyou-top100.txt
msf6 auxiliary(scanner/smb/smb_login) > set STOP_ON_SUCCESS true
msf6 auxiliary(scanner/smb/smb_login) > run
```

**Output atteso:**
```
[+] 10.10.10.5:445 - 10.10.10.5:445 - Success: 'WORKGROUP\administrator:Summer2024!'
```

**Spiegazione:** `STOP_ON_SUCCESS` evita brute force inutile una volta trovata una credenziale valida; le credenziali finiscono automaticamente in `creds -o csv`.

### Esempio 3: consultare i risultati salvati

```
msf6 > hosts
msf6 > services -p 445
msf6 > creds
```

**Spiegazione:** questi comandi funzionano indipendentemente dal modulo attivo e mostrano tutto cio che e stato raccolto nel workspace corrente — il vero valore aggiunto rispetto a tool standalone.

---

## Lab Hands-On

### Lab 1: INE PTS — Network scanning con auxiliary
**Obiettivo:** mappare una rete lab intera usando solo moduli auxiliary
**Difficulty:** Media
**Time:** 1h

**Walkthrough breve:**
1. Port scan con `auxiliary/scanner/portscan/tcp` sull'intero range
2. Version detection sui servizi trovati (SMB/FTP/SSH)
3. Brute force mirato dove ha senso (credenziali deboli/default)
4. Esporta host/servizi/credenziali con `hosts -o`, `services -o`, `creds -o`

---

## Common Mistakes

- Usare THREADS troppo alto su reti lente -> falsi negativi per timeout
- Fare brute force senza `STOP_ON_SUCCESS` su ogni host -> spreco di tempo e possibile lockout account
- Dimenticare che alcuni moduli `dos/` possono destabilizzare un servizio -> usarli solo se esplicitamente in scope

---

## Link Utili

- [Rapid7 — Metasploit Module Library](https://www.rapid7.com/db/modules/)

---

## Connessioni

- **Prerequisito:** [01-Msfconsole-Basics.md](01-Msfconsole-Basics.md)
- **Prossimo Step:** [03-Exploit-Modules.md](03-Exploit-Modules.md)
- **Combinazione con:** [../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md)

---

## Checklist di padronanza

- [ ] So usare moduli scanner per version detection
- [ ] So configurare un brute force auxiliary con STOP_ON_SUCCESS
- [ ] So consultare hosts/services/creds dal database
- [ ] So esportare i risultati raccolti

---

## Note personali

_(spazio libero)_
