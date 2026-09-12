# SSH Enumeration

**Difficolta:** Beginner
**Time to Master:** 45min
**Prerequisiti:** [02-FTP-Enumeration.md](02-FTP-Enumeration.md)
**Lab:** INE PTS — Service Enumeration

---

## Obiettivo

SSH (porta 22) e raramente exploitabile direttamente, ma l'enumerazione della versione e degli algoritmi supportati puo rivelare vulnerabilita note e orientare gli attacchi a credenziali successivi (password attack, key reuse).

---

## Concetti chiave

### Banner grabbing versione

Il banner SSH (`SSH-2.0-OpenSSH_7.2p2 Ubuntu...`) viene inviato subito alla connessione, prima di qualsiasi autenticazione, ed e sempre leggibile senza credenziali.

### User enumeration timing (concettuale)

Alcune versioni vulnerabili di OpenSSH (es. CVE-2018-15473) permettevano di distinguere utenti validi da invalidi osservando differenze di tempo/risposta durante il processo di autenticazione. Concetto utile da conoscere per l'esame anche se lo sfruttamento pratico e delicato e spesso poco affidabile su reti lente.

### Algoritmi supportati

La lista di key exchange, cifrari e MAC supportati da un server SSH puo rivelare indirettamente l'eta del software (versioni datate spesso mantengono algoritmi deboli per compatibilita).

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| netcat | `nc -nv target 22` | banner versione | immediato, nessun tool extra |
| nmap | `nmap -sV -p22 target` | versione + eventuale script default | integra bene lo scan iniziale |
| ssh-audit | `ssh-audit target` | algoritmi supportati, raccomandazioni | utile per capire "quanto vecchio" e il servizio |
| hydra | `hydra -L users.txt -P pass.txt ssh://target` | brute force credenziali | dopo aver raccolto una userlist da altre enumeration |

---

## Payload / Esempi

### Esempio 1: banner grabbing con netcat

```bash
nc -nv 10.10.10.5 22
```

**Output atteso:**
```
SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.8
```

**Spiegazione:** la stringa rivela sia il software (OpenSSH) sia la versione precisa, utile per cercare CVE noti associati.

### Esempio 2: audit algoritmi con ssh-audit

```bash
ssh-audit 10.10.10.5
```

**Spiegazione:** mostra key exchange, cipher e MAC supportati con relativa valutazione (weak/ok/recommended); algoritmi deboli suggeriscono una configurazione datata, spesso correlata ad altre debolezze del sistema.

### Esempio 3: brute force mirato dopo aver raccolto una userlist

```bash
hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://10.10.10.5 -t 4
```

**Spiegazione:** SSH tollera pochi tentativi al secondo prima di rallentare/bloccare (fail2ban e comune); `-t 4` limita i thread paralleli per non saturare la connessione ed evitare lockout, e piu efficace se la userlist viene da enumeration precedente (SMB, SNMP) invece di essere generica.

---

## Lab Hands-On

### Lab 1: INE PTS — SSH fingerprint & brute force
**Obiettivo:** identificare versione OpenSSH esatta e tentare accesso con una userlist raccolta da altri servizi
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Banner grab con netcat o nmap -sV
2. Cerca CVE noti per la versione con searchsploit
3. Se hai una userlist da SMB/SNMP, prova un brute force mirato e limitato

---

## Common Mistakes

- Lanciare hydra con wordlist enormi senza limitare i thread -> lockout account o ban IP dal target
- Ignorare la versione SSH pensando "tanto non e mai exploitabile" -> a volte conferma indirettamente l'eta del sistema operativo sottostante
- Non provare mai il riuso di credenziali trovate su altri servizi (FTP, web) anche su SSH

---

## Link Utili

- [ssh-audit GitHub](https://github.com/jtesta/ssh-audit)

---

## Connessioni

- **Prerequisito:** [02-FTP-Enumeration.md](02-FTP-Enumeration.md)
- **Prossimo Step:** [04-SNMP-Enumeration.md](04-SNMP-Enumeration.md)
- **Combinazione con:** [../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md)

---

## Checklist di padronanza

- [ ] So fare banner grabbing SSH e trovare la versione esatta
- [ ] Conosco il concetto di user enumeration via timing (CVE-2018-15473)
- [ ] So impostare un brute force mirato e limitato con hydra

---

## Note personali

_(spazio libero)_
