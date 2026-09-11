# Nmap Fundamentals

**Difficolta:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [00-Fundamentals/02-Networking-Basics.md](../00-Fundamentals/02-Networking-Basics.md)
**Lab:** INE PTS — Network Scanning

---

## Obiettivo

Padroneggiare nmap come strumento centrale di footprinting e scanning: tipi di scan, timing, formati di output. È lo strumento più usato in tutto l'esame eJPTv2, va conosciuto a fondo prima di passare a host discovery e port scanning avanzato.

---

## Concetti chiave

### Tipi di scan principali

| Flag | Nome | Note |
|------|------|------|
| `-sS` | SYN scan (half-open) | default se root, veloce, non completa il 3-way handshake |
| `-sT` | TCP connect scan | completa la connessione, usato se non si è root |
| `-sU` | UDP scan | lento, spesso servizi non rispondono (filtrato/open assunto) |
| `-sV` | Version detection | identifica versione software dietro la porta |
| `-sC` | Script scan (default NSE) | esegue script della categoria "default" |
| `-A` | Aggressive | combina -sV -sC -O --traceroute |
| `-O` | OS detection | fingerprint dello stack TCP/IP |

### Timing templates

| Template | Velocità | Uso |
|----------|----------|-----|
| `-T0` | Paranoid | massima evasione IDS, molto lento |
| `-T2` | Polite | riduce banda, ambienti sensibili |
| `-T3` | Normal | default |
| `-T4` | Aggressive | uso comune in lab/CTF |
| `-T5` | Insane | rischio falsi negativi, solo reti stabili |

### Formati di output

| Flag | Formato | Uso |
|------|---------|-----|
| `-oN` | Normal | leggibile a schermo |
| `-oX` | XML | parsing automatico (es. Nessus, tool terzi) |
| `-oG` | Grepable | parsing veloce con grep/awk (deprecato ma ancora usato) |
| `-oA` | All | salva tutti e tre i formati con lo stesso basename |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| nmap | `nmap -sV -sC target` | porte, versioni, script default | tool principale |
| masscan | `masscan -p1-65535 target --rate=10000` | porte aperte, molto veloce | usato per scan rapidi di range grandi, meno accurato |
| rustscan | `rustscan -a target -- -sV -sC` | porte + pipe automatico a nmap | wrapper veloce moderno |

---

## Payload / Esempi

### Esempio 1: scan completo di tutte le porte

```bash
nmap -p- --min-rate=5000 -oN scan-allports.txt 10.10.10.5
```

**Output atteso:**
```
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
445/tcp  open  microsoft-ds
3389/tcp open  ms-wbt-server
```

**Spiegazione:** `-p-` scansiona tutte le 65535 porte TCP, `--min-rate` forza un throughput minimo di pacchetti/sec per velocizzare lo scan su reti stabili come i lab.

### Esempio 2: scan di versione e script default sulle porte trovate

```bash
nmap -sV -sC -p 22,80,445,3389 -oN scan-services.txt 10.10.10.5
```

**Spiegazione:** una volta note le porte aperte (esempio 1), si ripete lo scan solo su quelle con `-sV -sC` per ottenere versioni software e output degli script NSE di default (es. `smb-os-discovery`, `http-title`).

### Esempio 3: scan UDP delle porte più comuni

```bash
nmap -sU --top-ports 20 -oN scan-udp.txt 10.10.10.5
```

**Spiegazione:** UDP è senza stato, nmap non può distinguere facilmente "open" da "filtered" senza risposta; per questo si limita lo scan alle porte più comuni (`--top-ports`) per contenere i tempi.

---

## Evasion / Bypass Techniques

- `-f` — frammenta i pacchetti per evadere IDS/firewall semplici basati su pattern matching
- `-D RND:10` — decoy scan, genera pacchetti da IP falsi insieme al reale
- `--data-length 25` — aggiunge padding random per evitare firme basate su lunghezza pacchetto
- In un contesto di esame/lab autorizzato l'evasion serve più a capire il concetto che a essere strettamente necessaria: la maggior parte dei target di lab non ha IDS attivo

---

## Lab Hands-On

### Lab 1: TryHackMe — Nmap
**Obiettivo:** esercitarsi con tutti i tipi di scan e timing template su un target controllato
**Difficulty:** Facile
**Time:** 45 min

**Walkthrough breve:**
1. Esegui `-sS`, `-sT`, `-sU` sullo stesso target e confronta i risultati
2. Prova i 6 timing template e misura il tempo di esecuzione
3. Salva l'output in tutti e 3 i formati con `-oA`

---

## Common Mistakes

- Fidarsi solo di `--top-ports` senza mai fare uno scan completo `-p-` -> si perdono servizi su porte non standard
- Usare `-T5` su reti VPN lente (tipico dei lab) -> falsi negativi, porte segnate come chiuse quando non lo sono
- Dimenticare `-Pn` quando l'host blocca ping ma le porte sono comunque raggiungibili

---

## Link Utili

- [Nmap Reference Guide](https://nmap.org/book/man.html)
- [Nmap Cheat Sheet — SANS](https://www.sans.org/posters/)

---

## Connessioni

- **Prerequisito:** [00-Fundamentals/02-Networking-Basics.md](../00-Fundamentals/02-Networking-Basics.md)
- **Prossimo Step:** [02-Host-Discovery.md](02-Host-Discovery.md)
- **Combinazione con:** [03-Port-Scanning-Techniques.md](03-Port-Scanning-Techniques.md)

---

## Checklist di padronanza

- [ ] Conosco a memoria i flag principali (-sS/-sT/-sU/-sV/-sC/-A)
- [ ] So scegliere il timing template giusto per il contesto
- [ ] So salvare output in tutti i formati utili
- [ ] Ho provato almeno una tecnica di evasion

---

## Note personali

_(spazio libero)_
