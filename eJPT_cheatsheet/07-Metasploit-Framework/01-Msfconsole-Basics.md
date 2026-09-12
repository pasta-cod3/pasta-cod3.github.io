# Msfconsole Basics

**Difficolta:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md)
**Lab:** INE PTS — Metasploit Framework labs

---

## Obiettivo

Padroneggiare l'interfaccia msfconsole: navigazione tra moduli, ricerca, configurazione opzioni, gestione workspace/database. E il punto d'ingresso obbligato per tutto cio che riguarda auxiliary/exploit/meterpreter nell'esame eJPTv2.

---

## Concetti chiave

### Struttura dei moduli Metasploit

| Tipo modulo | Path esempio | Scopo |
|-------------|--------------|-------|
| exploit | `exploit/windows/smb/ms17_010_eternalblue` | sfrutta una vulnerabilita specifica |
| auxiliary | `auxiliary/scanner/smb/smb_version` | scanning, enumeration, brute force (non da accesso diretto) |
| post | `post/windows/gather/hashdump` | azioni post-exploitation su una sessione gia aperta |
| payload | `windows/x64/meterpreter/reverse_tcp` | codice eseguito sul target dopo l'exploit |
| encoder/nop | vari | offuscamento payload (uso limitato con AV moderni) |

### Database Metasploit (msfdb)

Metasploit puo salvare host, servizi, credenziali e loot in un database PostgreSQL, condiviso tra tutte le sessioni msfconsole aperte sullo stesso workspace.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| msfconsole | `msfconsole -q` | shell interattiva | `-q` sopprime il banner |
| msfdb | `sudo msfdb init` | inizializza il database | va fatto una volta sola per macchina |
| workspace | `workspace -a cliente1` | crea/passa a un workspace | isola i dati tra engagement diversi |

---

## Payload / Esempi

### Esempio 1: ricerca ed esplorazione di un modulo

```
msf6 > search type:exploit smb ms17
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 exploit(windows/smb/ms17_010_eternalblue) > show options
msf6 exploit(windows/smb/ms17_010_eternalblue) > show targets
msf6 exploit(windows/smb/ms17_010_eternalblue) > info
```

**Output atteso:**
```
Matching Modules
================
   #  Name                                          Disclosure Date  Rank     Check  Description
   -  ----                                          ----------------  ----     -----  -----------
   0  exploit/windows/smb/ms17_010_eternalblue      2017-03-14        average  Yes    MS17-010 EternalBlue SMB Remote Windows Kernel Pool Corruption
```

**Spiegazione:** `search` filtra per tipo e keyword, `use` seleziona il modulo, `show options` elenca i parametri richiesti (marcati `yes` in colonna Required), `info` da la descrizione completa e i riferimenti CVE.

### Esempio 2: configurazione opzioni e variabili globali

```
msf6 exploit(windows/smb/ms17_010_eternalblue) > set RHOSTS 10.10.10.5
msf6 exploit(windows/smb/ms17_010_eternalblue) > set LHOST 10.10.14.2
msf6 exploit(windows/smb/ms17_010_eternalblue) > setg LHOST 10.10.14.2
```

**Spiegazione:** `set` vale solo per il modulo corrente, `setg` imposta la variabile globalmente per tutti i moduli caricati nella sessione — utile per LHOST che resta lo stesso durante l'intero engagement.

### Esempio 3: workspace e database

```
msf6 > workspace -a lab-network
msf6 > workspace
msf6 > db_status
msf6 > hosts
msf6 > services
```

**Output atteso:**
```
[*] Added workspace: lab-network
* lab-network
[*] connected to msf. Connection type: postgresql.
```

**Spiegazione:** ogni host/servizio scoperto da moduli auxiliary/nmap import viene salvato nel workspace corrente, consultabile in seguito con `hosts`/`services`/`creds`.

---

## Lab Hands-On

### Lab 1: INE PTS — Metasploit Framework Fundamentals
**Obiettivo:** familiarizzare con search/use/set/show/info su almeno 5 moduli diversi
**Difficulty:** Facile
**Time:** 45 min

**Walkthrough breve:**
1. Inizializza il database con `msfdb init`
2. Crea un workspace dedicato al lab
3. Cerca ed esplora moduli auxiliary e exploit per i servizi gia enumerati in [03-Enumeration](../03-Enumeration/)

---

## Common Mistakes

- Non inizializzare il database (`msfdb init`) -> perdi tracking di host/servizi/credenziali tra sessioni
- Confondere `set` e `setg` -> variabili che "spariscono" cambiando modulo
- Non leggere `show options` per intero -> RPORT o SMBUser lasciati al default causano fallimenti silenziosi

---

## Link Utili

- [Metasploit Unleashed — Offensive Security](https://www.offsec.com/metasploit-unleashed/)

---

## Connessioni

- **Prerequisito:** [../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md)
- **Prossimo Step:** [02-Auxiliary-Modules.md](02-Auxiliary-Modules.md)
- **Combinazione con:** [../03-Enumeration/01-SMB-NetBIOS-Enumeration.md](../03-Enumeration/01-SMB-NetBIOS-Enumeration.md)

---

## Checklist di padronanza

- [ ] So cercare e caricare un modulo con search/use
- [ ] So configurare opzioni con set/setg e verificarle con show options
- [ ] So usare workspace per isolare engagement diversi
- [ ] So consultare hosts/services/creds dal database

---

## Note personali

_(spazio libero)_
