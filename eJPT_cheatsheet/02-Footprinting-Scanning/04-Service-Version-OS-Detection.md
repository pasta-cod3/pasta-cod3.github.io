# Service, Version & OS Detection

**Difficoltà:** Beginner
**Time to Master:** 1h
**Prerequisiti:** [03-Port-Scanning-Techniques.md](03-Port-Scanning-Techniques.md)
**Lab:** INE PTS, Network Scanning

---

## Obiettivo

Una porta aperta da sola non ti dice quasi nulla: è la versione esatta del servizio dietro — `vsftpd 2.3.4`, non solo "ftp" — che trasforma un elenco di porte in una lista di potenziali exploit. Qui impari a spremere da nmap (e, quando serve, da una connessione netcat manuale) quel dettaglio in più: è il ponte diretto verso la vulnerability assessment, perché ogni versione nota apre subito la ricerca di CVE pubblici.

---

## Concetti chiave

### Version detection intensity

`-sV` può essere regolato con `--version-intensity 0-9` (default 7): valori più alti provano più probe ma sono più lenti. `--version-light` equivale a intensity 2, `--version-all` prova tutti i probe disponibili (intensity 9).

### OS fingerprinting

`-O` analizza le peculiarità dello stack TCP/IP (TTL iniziale, window size, opzioni TCP) e le confronta con un database di firme per stimare il sistema operativo. Non è infallibile: richiede almeno una porta open e una closed per essere affidabile.

### Banner grabbing manuale

Quando nmap non identifica con certezza una versione, il banner grabbing manuale con netcat o curl spesso rivela l'informazione esatta, specialmente su servizi HTTP/FTP/SSH che si presentano in chiaro alla connessione.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| nmap | `nmap -sV --version-all target` | versione dettagliata servizio | più lento ma più accurato |
| nmap | `nmap -O target` | stima OS | serve almeno 1 porta open + 1 closed |
| netcat | `nc -nv target 21` | banner grezzo del servizio | manuale, sempre affidabile se il servizio banner-a |
| curl | `curl -sI http://target` | header HTTP (Server, X-Powered-By) | rivela stack web spesso in modo preciso |

---

## Payload / Esempi

### Esempio 1: version detection approfondita

```bash
nmap -sV --version-all -p 21,22,80,445 -oN versions.txt 10.10.10.5
```

**Output atteso:**
```
PORT    STATE SERVICE VERSION
21/tcp  open  ftp     vsftpd 2.3.4
22/tcp  open  ssh     OpenSSH 7.6p1 Ubuntu
80/tcp  open  http    Apache httpd 2.4.29
```

**Spiegazione:** avere la versione esatta (es. `vsftpd 2.3.4`, noto per una backdoor storica) permette la ricerca mirata di exploit in [08-Exploitation-PostEx/01-Manual-Exploitation-Searchsploit.md](../08-Exploitation-PostEx/01-Manual-Exploitation-Searchsploit.md).

### Esempio 2: banner grabbing manuale con netcat

```bash
nc -nv 10.10.10.5 21
```

**Output atteso:**
```
220 (vsFTPd 2.3.4)
```

**Spiegazione:** la connessione grezza mostra il banner esattamente come lo vede il servizio, utile quando `-sV` dà un risultato generico o incerto.

### Esempio 3: OS detection combinato con traceroute

```bash
sudo nmap -O --osscan-guess -p 22,445 10.10.10.5
```

**Spiegazione:** `--osscan-guess` forza nmap a dare comunque una stima anche quando la confidenza è bassa, utile per orientarsi (es. capire se è Windows o Linux prima di scegliere il modulo Metasploit giusto).

---

## Lab Hands-On

### Lab 1: INE PTS, Fingerprinting
**Obiettivo:** identificare versione esatta di almeno 3 servizi e stimare l'OS di un host di lab
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Esegui `-sV --version-all` sulle porte aperte trovate in precedenza
2. Per ogni servizio ambiguo, verifica manualmente con netcat/curl
3. Esegui `-O` e confronta la stima con quanto dedotto dai servizi (es. porta 445 = quasi certamente Windows o Samba)

---

## Common Mistakes

- Fidarsi ciecamente della stima OS senza incrociarla con altri indizi (porte tipiche, banner) -> può sbagliare, specialmente con firewall nel mezzo
- Non provare il banner grabbing manuale quando `-sV` dà "unknown" -> spesso basta una connessione netcat diretta
- Dimenticare che una versione "vecchia" non significa automaticamente vulnerabile: va comunque verificato con searchsploit/CVE

---

## Link Utili

- [Nmap OS Detection docs](https://nmap.org/book/osdetect.html)

---

## Connessioni

- **Prerequisito:** [03-Port-Scanning-Techniques.md](03-Port-Scanning-Techniques.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [../04-Vulnerability-Assessment/02-Nmap-NSE-Scripts.md](../04-Vulnerability-Assessment/02-Nmap-NSE-Scripts.md)

---

## Checklist di padronanza

- [ ] So usare --version-intensity e --version-all
- [ ] So fare banner grabbing manuale con netcat/curl
- [ ] Capisco i limiti dell'OS fingerprinting con -O

