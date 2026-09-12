---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Linux Fundamentals"
permalink: "/cheatsheet/ejpt/00-fundamentals/03-linux-fundamentals/"
section: "Fundamentals"
section_order: 0
order: 3
sort_key: 3
---

**Difficoltà:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [02-Networking-Basics.md](/cheatsheet/ejpt/00-fundamentals/02-networking-basics/)
**Lab:** INE PTS, Linux Fundamentals

---

## Obiettivo

Linux qui gioca due ruoli: è la tua attack box (Kali o simili) e, spessissimo, anche il target che devi enumerare ed exploitare. Vale la pena muoversi con sicurezza da entrambi i lati: capire filesystem e permessi non è un esercizio accademico, è quello che ti fa notare al volo un binario SUID sospetto o un cron job scrivibile mentre stai enumerando una macchina sotto tempo.

---

## Concetti chiave

### Filesystem Hierarchy essenziale

| Path | Contenuto |
|------|-----------|
| `/etc` | file di configurazione di sistema (es. `/etc/passwd`, `/etc/shadow`) |
| `/home` | home degli utenti standard |
| `/root` | home dell'utente root |
| `/var/log` | log di sistema e servizi |
| `/tmp` | file temporanei, spesso scrivibile da tutti: comodo per staging di file durante exploitation |
| `/usr/bin`, `/usr/sbin` | binari di sistema |
| `/proc` | filesystem virtuale con info sui processi in esecuzione |

### Permessi

```
-rwxr-xr-- 1 user group 4096 Jan 1 10:00 file.sh
```

| Segmento | Significato |
|----------|-------------|
| primo carattere | tipo file (`-` file, `d` directory, `l` link) |
| rwx (owner) | permessi del proprietario |
| r-x (group) | permessi del gruppo |
| r-- (other) | permessi per tutti gli altri |

| Numero ottale | Permesso |
|-----------------|----------|
| 7 | rwx |
| 6 | rw- |
| 5 | r-x |
| 4 | r-- |
| 0 | --- |

### SUID / SGID / Sticky bit

| Bit | Effetto | Rilevanza offensiva |
|-----|---------|------------------------|
| SUID (4000) | il binario gira con i permessi dell'owner del file, non di chi lo lancia | binari SUID di root mal configurati = privilege escalation classica |
| SGID (2000) | come SUID ma per il gruppo | meno comune ma stesso principio |
| Sticky bit (1000) | in una dir condivisa, solo l'owner può cancellare i propri file | tipico su `/tmp` |

### Utenti e gruppi

| File | Contenuto |
|------|-----------|
| `/etc/passwd` | lista utenti, UID, shell, home (leggibile da tutti) |
| `/etc/shadow` | hash delle password (leggibile solo da root) |
| `/etc/group` | gruppi e membership |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| find | `find / -perm -4000 2>/dev/null` | file SUID | classico per privesc enum |
| grep | `grep -r "password" /var/www` | pattern match ricorsivo | utile per credential hunting |
| netstat / ss | `ss -tulnp` | porte in ascolto | vedi anche [02-Networking-Basics.md](/cheatsheet/ejpt/00-fundamentals/02-networking-basics/) |
| ps | `ps aux` | processi in esecuzione | cerca processi root sospetti |
| crontab | `crontab -l`, `cat /etc/crontab` | job pianificati | cron job scrivibili = privesc |

---

## Payload / Esempi

### Esempio 1: enumerare file SUID sospetti

```bash
find / -perm -4000 -type f 2>/dev/null
```

**Output atteso:**
```
/usr/bin/passwd
/usr/bin/sudo
/usr/local/bin/backup.sh
```

**Spiegazione:** i primi due sono normali; un binario custom come `backup.sh` con SUID è un candidato immediato da controllare per privilege escalation (vedi [08-Exploitation-PostEx/04-Privilege-Escalation-Linux.md](/cheatsheet/ejpt/08-exploitation-postex/04-privilege-escalation-linux/)).

### Esempio 2: bash scripting minimo per automatizzare un task

```bash
#!/bin/bash
for ip in $(cat hosts.txt); do
  echo "[*] $ip"
  nmap -p 22,80,445 --open -oG - "$ip" | grep "Ports"
done
```

**Spiegazione:** loop su una lista di IP per uno scan rapido delle porte più comuni: pattern che ritroverai spesso quando devi lavorare su più host in un lab.

### Esempio 3: cercare credenziali in chiaro

```bash
grep -ri "password" /var/www/html --include=*.php -n
```

**Spiegazione:** file di configurazione web (specialmente CMS custom) spesso contengono credenziali DB in chiaro, riutilizzabili altrove nel sistema.

---

## Common Mistakes

- Dimenticare `2>/dev/null` in `find /` -> output illeggibile pieno di "Permission denied"
- Confondere permessi ottali (es. 755) con quelli simbolici (`rwxr-xr-x`) durante `chmod`
- Non controllare mai crontab e file SUID durante la post-exploitation: sono tra i vettori di privesc più comuni

---

## Link Utili

- [GTFOBins](https://gtfobins.github.io/): abuso di binari Unix per privesc/bypass
- [Linux Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)

---

## Connessioni

- **Prerequisito:** [02-Networking-Basics.md](/cheatsheet/ejpt/00-fundamentals/02-networking-basics/)
- **Prossimo Step:** [04-Windows-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/04-windows-fundamentals/)
- **Combinazione con:** [08-Exploitation-PostEx/04-Privilege-Escalation-Linux.md](/cheatsheet/ejpt/08-exploitation-postex/04-privilege-escalation-linux/)

---

## Checklist di padronanza

- [ ] So leggere una stringa di permessi (`rwxr-xr--`) e convertirla in ottale
- [ ] So spiegare cosa fa il bit SUID e perché è rilevante offensivamente
- [ ] Conosco i path chiave del filesystem (`/etc/passwd`, `/etc/shadow`, `/tmp`)
- [ ] So scrivere un semplice loop bash su una lista di IP
