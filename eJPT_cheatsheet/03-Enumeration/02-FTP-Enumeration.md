# FTP Enumeration

**Difficolta:** Beginner
**Time to Master:** 45min
**Prerequisiti:** [01-SMB-NetBIOS-Enumeration.md](01-SMB-NetBIOS-Enumeration.md)
**Lab:** INE PTS — Service Enumeration

---

## Obiettivo

FTP (porta 21) e spesso il primo servizio "facile" incontrato nei lab: login anonimo mal configurato, banner rivelatori, versioni con backdoor storiche note. Rapido da enumerare, spesso decisivo per l'accesso iniziale.

---

## Concetti chiave

### Anonymous login

Molti server FTP di lab permettono login con utente `anonymous` e qualsiasi password (spesso una email fittizia per convenzione). E la prima cosa da provare sempre.

### Banner grabbing

Il banner FTP viene mostrato subito alla connessione (`220 ...`) e spesso contiene nome software e versione esatta, utile per la ricerca di exploit.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| ftp / lftp | `ftp target` | shell FTP interattiva | client classico |
| nmap | `nmap --script ftp-anon,ftp-syst -p21 target` | verifica anonymous + info sistema | veloce, automatizzato |
| netcat | `nc -nv target 21` | banner grezzo | conferma versione esatta |
| hydra | `hydra -L users.txt -P pass.txt ftp://target` | brute force credenziali | se anonymous non funziona |

---

## Payload / Esempi

### Esempio 1: verifica anonymous login con nmap

```bash
nmap --script ftp-anon -p21 10.10.10.5
```

**Output atteso:**
```
PORT   STATE SERVICE
21/tcp open  ftp
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
```

**Spiegazione:** lo script NSE `ftp-anon` prova direttamente il login anonimo, evitando il passaggio manuale.

### Esempio 2: login anonimo manuale e download file

```bash
ftp 10.10.10.5
# Name: anonymous
# Password: anonymous@
ftp> ls
ftp> get notes.txt
```

**Spiegazione:** una volta dentro, `ls` mostra i file disponibili e `get` scarica quelli di interesse (spesso credenziali, backup, note interne lasciate per errore).

### Esempio 3: identificazione backdoor storica vsftpd 2.3.4

```bash
nc -nv 10.10.10.5 21
```

**Output atteso:**
```
220 (vsFTPd 2.3.4)
```

**Spiegazione:** vsftpd 2.3.4 e associato a una backdoor storica nota (introdotta in una versione compromessa del codice sorgente nel 2011): se il banner mostra esattamente questa versione, vale la pena cercare il modulo Metasploit corrispondente in [../07-Metasploit-Framework/03-Exploit-Modules.md](../07-Metasploit-Framework/03-Exploit-Modules.md).

---

## Lab Hands-On

### Lab 1: TryHackMe — FTP enumeration basics
**Obiettivo:** identificare se il login anonimo e permesso e recuperare eventuali file interessanti
**Difficulty:** Facile
**Time:** 20 min

**Walkthrough breve:**
1. Banner grab con netcat per la versione esatta
2. Prova login anonymous con ftp/lftp
3. Se fallisce, prova credenziali di default note per il software identificato

---

## Common Mistakes

- Saltare il banner grabbing e andare dritti al brute force -> spesso il login anonimo basta, nessun brute force necessario
- Non controllare i permessi di scrittura sulla share FTP -> un FTP anonimo scrivibile puo permettere upload di webshell se combinato con un servizio web che serve la stessa directory

---

## Link Utili

- [vsftpd GitHub — changelog storico](https://github.com/vsftpd/vsftpd)

---

## Connessioni

- **Prerequisito:** [01-SMB-NetBIOS-Enumeration.md](01-SMB-NetBIOS-Enumeration.md)
- **Prossimo Step:** [03-SSH-Enumeration.md](03-SSH-Enumeration.md)
- **Combinazione con:** [../08-Exploitation-PostEx/01-Manual-Exploitation-Searchsploit.md](../08-Exploitation-PostEx/01-Manual-Exploitation-Searchsploit.md)

---

## Checklist di padronanza

- [ ] So verificare anonymous login manualmente e con NSE
- [ ] So identificare la versione esatta via banner grabbing
- [ ] Riconosco vsftpd 2.3.4 come esempio storico di backdoor nota

---

## Note personali

_(spazio libero)_
