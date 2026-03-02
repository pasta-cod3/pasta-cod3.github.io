# Ricognizione Attiva con Nmap: scansione di porte e servizi

## Introduzione

Dopo aver raccolto informazioni in modo passivo, è il momento di interagire direttamente con il target. La **ricognizione attiva** comporta l'invio di pacchetti verso i sistemi del target — e questo lascia tracce nei log.

Lo strumento più importante per questa fase è **Nmap** (Network Mapper): uno scanner di rete open source, usato da penetration tester, sysadmin e — purtroppo — anche da attaccanti reali.

Imparare Nmap bene è fondamentale. Non come lista di comandi da copiare, ma capendo *cosa fa* ogni tipo di scansione.

---

## Come funziona una scansione di porte

Ogni computer ha **65.535 porte TCP** e altrettante UDP. Le porte sono come porte di un palazzo: dietro ognuna può esserci un servizio in ascolto (web server, SSH, database, ecc.).

Nmap invia pacchetti verso queste porte e in base alla risposta determina se la porta è:

- **Open** — c'è un servizio in ascolto, ha risposto
- **Closed** — la porta è raggiungibile ma non c'è nessun servizio
- **Filtered** — nessuna risposta (firewall sta bloccando)

---

## Installazione

```bash
# Debian/Ubuntu
sudo apt install nmap

# Fedora/RHEL
sudo dnf install nmap

# macOS
brew install nmap
```

---

## Scansioni fondamentali

### Scansione base

```bash
nmap 192.168.1.1
```

Scansiona le 1000 porte più comuni. Veloce, ma non esaustiva.

### Scansione completa di tutte le porte

```bash
nmap -p- 192.168.1.1
```

Scansiona tutte le 65.535 porte TCP. Lenta ma completa. Usala sempre dopo la scansione base per non perdere nulla.

### Rilevamento versioni dei servizi

```bash
nmap -sV 192.168.1.1
```

Nmap cerca di identificare **quale software** gira su ogni porta e la sua versione. Fondamentale: sapere che gira "Apache 2.4.49" ti permette di cercare CVE specifiche.

### Rilevamento sistema operativo

```bash
sudo nmap -O 192.168.1.1
```

Richiede i permessi di root. Nmap analizza le risposte TCP per indovinare il sistema operativo.

### Scansione "aggressiva" (tutto insieme)

```bash
sudo nmap -A 192.168.1.1
```

Combina: rilevamento OS (`-O`), versioni servizi (`-sV`), script di default (`-sC`), traceroute. Molto rumorosa ma raccoglie tantissime info.

---

## Tipi di scansione TCP

### SYN Scan (Half-open) — il default

```bash
sudo nmap -sS 192.168.1.1
```

Invia un pacchetto SYN (inizio handshake TCP). Se riceve SYN-ACK, la porta è aperta — ma Nmap non completa il handshake (manda RST). Più veloce e meno rumorosa del full connect.

Richiede privilegi root.

### TCP Connect Scan

```bash
nmap -sT 192.168.1.1
```

Completa il three-way handshake. Non richiede root ma è più lenta e più facile da loggare.

### UDP Scan

```bash
sudo nmap -sU 192.168.1.1
```

Scansiona porte UDP. Molto lenta — UDP non ha handshake, Nmap deve aspettare timeout. Ma i servizi UDP (DNS :53, SNMP :161, TFTP :69) sono spesso dimenticati dagli amministratori e vulnerabili.

---

## Nmap Scripting Engine (NSE)

Nmap ha un motore di script integrato con centinaia di script per enumerazione, detection di vulnerabilità, brute force e altro.

```bash
# Script di default (sicuri, poco invasivi)
nmap -sC 192.168.1.1

# Script specifico
nmap --script=http-title 192.168.1.1

# Tutti gli script per SMB
nmap --script=smb* 192.168.1.1

# Check EternalBlue (MS17-010)
nmap --script=smb-vuln-ms17-010 192.168.1.1

# Enumerazione HTTP
nmap --script=http-enum 192.168.1.80
```

---

## Output e salvataggio

```bash
# Output normale su file
nmap -oN risultati.txt 192.168.1.1

# Output XML (per importare in altri tool)
nmap -oX risultati.xml 192.168.1.1

# Tutti i formati
nmap -oA risultati 192.168.1.1
# genera: risultati.nmap, risultati.xml, risultati.gnmap
```

Salva sempre l'output. Durante un pentest reale hai bisogno di rivedere i risultati in qualsiasi momento.

---

## Velocità e timing

Nmap ha 6 livelli di timing (`-T0` a `-T5`):

| Template | Nome | Uso |
|---|---|---|
| -T0 | Paranoid | Stealth estremo, lentissimo |
| -T1 | Sneaky | IDS evasion, molto lento |
| -T2 | Polite | Gentile con la rete |
| -T3 | Normal | Default |
| -T4 | Aggressive | Reti veloci, lab |
| -T5 | Insane | Massima velocità, può perdere risultati |

Per i lab usa `-T4`. Per ambienti reali, mai sopra `-T3` senza valutare l'impatto.

---

## Esempio reale: scansione completa di un host

```bash
# Step 1: scopri porte aperte velocemente
sudo nmap -sS -T4 -p- --open 192.168.1.100 -oN porte_aperte.txt

# Step 2: analizza i servizi sulle porte trovate
sudo nmap -sV -sC -p 22,80,443,3306 192.168.1.100 -oN servizi.txt

# Step 3: script specifici in base ai servizi trovati
nmap --script=http-enum,http-headers -p 80,443 192.168.1.100
```

---

## Conclusione

Nmap è il coltellino svizzero del penetration tester. Impararlo in profondità — capire la differenza tra i tipi di scansione, quando usare NSE, come interpretare i risultati — fa la differenza tra un pentest superficiale e uno professionale.

Nel prossimo articolo vedremo come usare i risultati di Nmap per identificare vulnerabilità concrete con i vulnerability scanner.
