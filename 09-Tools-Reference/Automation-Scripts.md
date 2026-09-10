# Automation Scripts

**Difficolta:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [Scripting-Snippets.md](Scripting-Snippets.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Script pronti per automatizzare la fase iniziale di un engagement (recon + scan + enum), da lanciare all'inizio di ogni sessione di lab/esame per risparmiare tempo manuale ripetitivo.

---

## Script Bash — recon + scan iniziale completo

```bash
#!/usr/bin/env bash
# usage: ./autorecon.sh target.com
TARGET=$1
mkdir -p "$TARGET"/{recon,scan,web}

echo "[*] Whois + DNS"
whois "$TARGET" > "$TARGET/recon/whois.txt"
dig "$TARGET" ANY > "$TARGET/recon/dns.txt"

echo "[*] Full port scan"
nmap -p- --min-rate=5000 -oN "$TARGET/scan/allports.txt" "$TARGET"

PORTS=$(grep -oP '\d{1,5}/open' "$TARGET/scan/allports.txt" | cut -d/ -f1 | tr '\n' ',' | sed 's/,$//')

echo "[*] Service detection su porte: $PORTS"
nmap -sV -sC -p "$PORTS" -oN "$TARGET/scan/services.txt" "$TARGET"

echo "[*] Web enumeration (se porta 80/443 aperta)"
if echo "$PORTS" | grep -qE '80|443'; then
  whatweb -a 3 "http://$TARGET" > "$TARGET/web/whatweb.txt"
  gobuster dir -u "http://$TARGET" -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt -o "$TARGET/web/gobuster.txt"
fi

echo "[*] Fatto. Risultati in ./$TARGET/"
```

## Script Python — batch check subdomain live

```python
#!/usr/bin/env python3
import requests, sys

with open(sys.argv[1]) as f:
    subs = [l.strip() for l in f if l.strip()]

for sub in subs:
    try:
        r = requests.get(f"http://{sub}", timeout=3)
        print(f"{r.status_code} {sub} ({len(r.content)} bytes)")
    except requests.RequestException:
        pass
```

## Script Bash — monitor continuo di un endpoint (per race condition/timing testing ripetuto)

```bash
#!/usr/bin/env bash
URL=$1
for i in $(seq 1 20); do
  time curl -s -o /dev/null "$URL"
done
```

**Spiegazione:** utile per raccogliere una serie di misurazioni timing (vedi [07-Business-Logic/04-Timing-Attacks.md](../07-Business-Logic/04-Timing-Attacks.md)) e calcolarne la mediana.

---

## Common Mistakes

- Lanciare script di automazione senza autorizzazione esplicita sul target/scope -> verifica sempre lo scope dell'engagement prima
- Non rendere gli script parametrici (target hardcoded) -> spreco di tempo a riscriverli ogni volta

---

## Connessioni

- **Prerequisito:** [Scripting-Snippets.md](Scripting-Snippets.md)
- **Combinazione con:** [04-SQL-Injection/07-SQLMap-Automation.md](../04-SQL-Injection/07-SQLMap-Automation.md)

---

## Note personali

_(spazio libero)_
