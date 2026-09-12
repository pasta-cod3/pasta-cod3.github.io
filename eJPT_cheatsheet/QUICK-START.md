# Quick Start — Flusso Rapido (30 min)

**Obiettivo:** avere un primo giro veloce su una rete/host sconosciuto, il flusso mentale che userai in ogni lab/esame eJPTv2 (approccio network+host, non solo web).

---

## Prerequisiti

- [ ] VPN lab connessa (OpenVPN INE PTS o simile), rete target raggiungibile
- [ ] Terminale con nmap, msfconsole, hydra, smbclient/enum4linux installati
- [ ] `/etc/hosts` o note aggiornate con gli IP assegnati al lab

---

## Fase 1 — Discovery della rete (5 min)

```bash
# Se hai solo un range/subnet
nmap -sn 10.10.10.0/24 -oN hosts-live.txt

# Ping sweep alternativo
fping -a -g 10.10.10.0/24 2>/dev/null
```

Riferimento: [02-Footprinting-Scanning/02-Host-Discovery.md](02-Footprinting-Scanning/02-Host-Discovery.md)

---

## Fase 2 — Scanning attivo per host (10 min)

```bash
# Tutte le porte, veloce
nmap -p- --min-rate=5000 -oN scan-allports.txt 10.10.10.5

# Service/version detection + script di default sulle porte trovate
nmap -sV -sC -p 21,22,80,139,445 -oN scan-services.txt 10.10.10.5
```

Riferimento: [02-Footprinting-Scanning/03-Port-Scanning-Techniques.md](02-Footprinting-Scanning/03-Port-Scanning-Techniques.md)

---

## Fase 3 — Enumeration dei servizi principali (10 min)

```bash
# SMB
enum4linux -a 10.10.10.5
smbclient -L //10.10.10.5/ -N

# Web (se presente)
whatweb -a 3 http://10.10.10.5
gobuster dir -u http://10.10.10.5 -w /usr/share/seclists/Discovery/Web-Content/common.txt
```

Riferimento: [03-Enumeration](03-Enumeration/)

---

## Fase 4 — Vulnerability assessment + Metasploit (5 min)

```bash
# NSE vuln scripts rapidi
nmap --script vuln -p 445 10.10.10.5

# msfconsole: cerca moduli noti per il servizio/versione trovata
msfconsole -q
search type:exploit smb
```

Riferimenti: [04-Vulnerability-Assessment](04-Vulnerability-Assessment/), [07-Metasploit-Framework/01-Msfconsole-Basics.md](07-Metasploit-Framework/01-Msfconsole-Basics.md)

---

## Checklist di uscita dal Quick Start

- [ ] Ho una lista di host live sulla rete
- [ ] Ho una lista di porte/servizi aperti per ogni host
- [ ] Ho enumerato almeno SMB/web/FTP dove presenti (share, utenti, versioni)
- [ ] Ho identificato almeno un servizio con una versione potenzialmente vulnerabile
- [ ] Ho salvato tutto l'output in file (non solo terminale) — con più host è facile perdere il filo

**Prossimo step:** passa da qui alla sezione [00-Fundamentals](00-Fundamentals/) se ti mancano basi solide, oppure vai dritto su [01-Information-Gathering](01-Information-Gathering/) per il flusso completo di recon.
