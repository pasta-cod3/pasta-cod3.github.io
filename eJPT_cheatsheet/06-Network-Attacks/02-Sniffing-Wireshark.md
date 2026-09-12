# Sniffing / Wireshark

**Difficoltà:** Beginner-Intermediate
**Time to Master:** 2h
**Prerequisiti:** [01-MITM-ARP-Spoofing.md](01-MITM-ARP-Spoofing.md)
**Lab:** TryHackMe, Wireshark: The Basics

---

## Obiettivo

Ora che sei in posizione MITM, hai traffico che ti passa sotto il naso — ma un flusso di pacchetti grezzi non ti dice niente finché non sai cosa cercare e come guardarlo. Qui impari a catturare e analizzare traffico di rete per estrarre credenziali in chiaro, identificare protocolli e capire cosa sta succedendo davvero sulla rete durante o dopo un MITM. È una competenza trasversale: la userai in quasi ogni fase di un assessment eJPTv2, non solo qui.

---

## Concetti chiave

### Cattura vs analisi

- **tcpdump**: cattura da riga di comando, leggero, ideale su server/lab remoti (`.pcap` da analizzare dopo)
- **Wireshark**: GUI per analisi approfondita, dissectors per centinaia di protocolli, filtri potenti

### Modalità promiscua

Per catturare traffico non indirizzato alla propria interfaccia serve la modalità promiscua, oppure essere già in posizione man-in-the-middle come nel file precedente. Su reti switched senza MITM vedi solo il tuo traffico e il broadcast: se ti aspettavi di vedere tutto e non vedi niente, è quasi sempre questo il motivo.

### Protocolli in chiaro comuni da cercare

| Protocollo | Porta | Cosa si trova |
|------------|-------|----------------|
| HTTP | 80 | credenziali form, cookie di sessione |
| FTP | 21 | username/password in chiaro |
| Telnet | 23 | intera sessione in chiaro |
| SMTP/POP3/IMAP | 25/110/143 | credenziali mail se non su TLS |
| SNMP v1/v2c | 161 | community string |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| tcpdump | `tcpdump -i eth0 -w cattura.pcap` | file pcap | `-n` per non risolvere DNS, `-v` verboso |
| Wireshark | GUI, oppure `wireshark -k -i eth0` | analisi interattiva | richiede permessi cattura (gruppo wireshark/root) |
| tshark | `tshark -i eth0 -Y http.request` | output testuale filtrato | versione CLI di Wireshark, utile per script |

---

## Payload / Esempi

### Esempio 1: cattura mirata con tcpdump

```bash
sudo tcpdump -i eth0 -n port 80 or port 21 -w cattura.pcap
```

**Output atteso:**
```
tcpdump: listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
124 packets captured
```

**Spiegazione:** filtra solo traffico HTTP/FTP per non riempire il file con rumore, poi si apre `cattura.pcap` in Wireshark per l'analisi visuale.

### Esempio 2: filtri display Wireshark utili

```
http.request.method == "POST"
ftp.request.command == "PASS"
tcp.port == 445
dns
ip.addr == 10.10.10.5
```

**Spiegazione:** i filtri display (barra in alto in Wireshark) si applicano dopo la cattura e non scartano pacchetti; per filtrare durante la cattura servono i filtri di cattura (sintassi BPF, es. `port 80`).

### Esempio 3: estrazione credenziali FTP con Follow TCP Stream

```bash
tshark -r cattura.pcap -Y "ftp.request.command==\"USER\" or ftp.request.command==\"PASS\""
```

**Output atteso:**
```
  45 2.11 10.10.10.10 -> 10.10.10.5 FTP 82 Request: USER admin
  47 2.34 10.10.10.10 -> 10.10.10.5 FTP 84 Request: PASS Summer2024!
```

**Spiegazione:** in Wireshark GUI lo stesso risultato si ottiene con click destro su un pacchetto FTP -> "Follow" -> "TCP Stream", che ricostruisce l'intera conversazione in ordine.

---

## Lab Hands-On

### Lab 1: TryHackMe, Wireshark: The Basics
**Obiettivo:** analizzare una pcap fornita ed estrarre credenziali FTP/HTTP
**Difficulty:** Facile
**Time:** 40 min

**Walkthrough breve:**
1. Apri la pcap in Wireshark, applica `Statistics -> Protocol Hierarchy` per una panoramica
2. Filtra per `ftp` e `http.request.method == "POST"`
3. Usa Follow TCP Stream sui pacchetti rilevanti per leggere credenziali in chiaro

---

## Common Mistakes

- Catturare tutto senza filtri su reti trafficate -> file enormi difficili da analizzare
- Dimenticare che HTTPS/SSH non mostrano contenuto in chiaro senza tecniche aggiuntive
- Non salvare la cattura (`-w`) e perdere i dati alla chiusura del terminale

---

## Link Utili

- [Wireshark: Display Filter Reference](https://www.wireshark.org/docs/dfref/)

---

## Connessioni

- **Prerequisito:** [01-MITM-ARP-Spoofing.md](01-MITM-ARP-Spoofing.md)
- **Prossimo Step:** [03-LLMNR-NBTNS-Responder.md](03-LLMNR-NBTNS-Responder.md)
- **Combinazione con:** [../03-Enumeration/05-Web-Enumeration.md](../03-Enumeration/05-Web-Enumeration.md)

---

## Checklist di padronanza

- [ ] So catturare traffico filtrato con tcpdump
- [ ] Conosco i filtri display Wireshark più comuni
- [ ] So usare Follow TCP Stream per ricostruire una sessione
- [ ] So riconoscere protocolli che trasportano credenziali in chiaro

