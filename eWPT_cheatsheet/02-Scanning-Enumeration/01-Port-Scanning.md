# Port Scanning

**Difficoltà:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [00-Fundamentals/Networking-Basics.md](../00-Fundamentals/Networking-Basics.md)
**Lab:** HTB, qualsiasi macchina web-focused

---

## Obiettivo

Questo è il primo comando davvero attivo dell'engagement — il momento in cui smetti di osservare da fuori e inizi a toccare il target — e ogni scelta che fai qui si ripercuote a valle: una scansione superficiale ti fa perdere un servizio su porta non standard che magari è proprio quello vulnerabile. Qui mappi rapidamente e con precisione le porte aperte, la base su cui si costruisce tutta l'enumerazione successiva.

---

## Concetti chiave

### Tipi di scan nmap

| Flag | Tipo | Note |
|------|------|------|
| `-sS` | SYN scan (half-open) | default se root, veloce e discreto |
| `-sT` | TCP connect | usato se non root, handshake completo |
| `-sU` | UDP scan | lento, spesso saltato per tempo ma non va dimenticato |
| `-Pn` | skip host discovery | usalo se ICMP è bloccato |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| nmap | `nmap -p- target` | porte aperte | full scan, lento |
| masscan | `masscan -p1-65535 target --rate=1000` | porte aperte | molto più veloce di nmap su range ampi |
| rustscan | `rustscan -a target -- -sV` | porte + pipe a nmap | veloce, integra nmap per version detect |

---

## Payload / Esempi

### Esempio 1: full port scan veloce poi mirato

```bash
# Step 1: trova tutte le porte aperte, veloce
nmap -p- --min-rate=5000 -T4 -oG allports.txt target.com

# Step 2: estrai le porte trovate
ports=$(grep -oP '\d{1,5}/open' allports.txt | cut -d/ -f1 | tr '\n' ',' | sed 's/,$//')

# Step 3: scan mirato con version/script detection
nmap -sV -sC -p $ports -oN detailed.txt target.com
```

**Output atteso:**
```
PORT     STATE SERVICE VERSION
80/tcp   open  http    Apache httpd 2.4.41
443/tcp  open  ssl/http Apache httpd 2.4.41
```

**Spiegazione:** separare full-scan (veloce, solo porte) da scan dettagliato (lento, su porte già note) è la pratica standard per non perdere tempo con `-sV` su tutte le 65535 porte.

### Esempio 2: scan UDP mirato (spesso dimenticato)

```bash
nmap -sU --top-ports 20 target.com
```

**Spiegazione:** UDP è lento da scansionare per intero, ma i top-port (DNS 53, SNMP 161, NTP 123) rivelano spesso servizi utili in poco tempo.

---

## Evasion / Bypass Techniques

### Rallentare/frammentare per ridurre detection

```bash
nmap -sS -T2 -f target.com          # frammenta pacchetti, timing lento
nmap --data-length 25 target.com    # padding per confondere firme IDS
```

Nota: in eWPT l'evasion IDS non è centrale come in esami offensive avanzati, ma sapere che esiste `-T` (timing) e `-f` (fragment) è utile.

---

## Lab Hands-On

### Lab 1: HTB, qualsiasi macchina "easy" web
**Obiettivo:** eseguire scan completo e passare a enumerazione servizi
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. `nmap -p- --min-rate=5000` per tutte le porte
2. `nmap -sV -sC` sulle porte trovate
3. Nota ogni servizio web per la fase successiva

---

## Common Mistakes

- Usare solo `nmap -sV target.com` senza `-p-` prima -> nmap di default scansiona solo le top 1000 porte, perdi servizi su porte non standard
- Non fare mai UDP scan -> molti servizi critici (SNMP con community string default) sono solo UDP

---

## Link Utili

- [Nmap Reference Guide](https://nmap.org/book/man.html)
- [HTB Academy: Network Enumeration](https://academy.hackthebox.com/)

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/Networking-Basics.md](../00-Fundamentals/Networking-Basics.md)
- **Prossimo Step:** [02-Service-Detection.md](02-Service-Detection.md)
- **Combinazione con:** [03-Web-Enumeration.md](03-Web-Enumeration.md)

---

## Checklist di padronanza

- [ ] So fare un full port scan efficiente (2 step)
- [ ] Non dimentico mai lo scan UDP
- [ ] So interpretare open/closed/filtered
- [ ] Ho automatizzato l'estrazione delle porte per il secondo scan

