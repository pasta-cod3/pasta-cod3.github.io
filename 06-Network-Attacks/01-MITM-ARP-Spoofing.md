# MITM / ARP Spoofing

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [../00-Fundamentals/02-Networking-Basics.md](../00-Fundamentals/02-Networking-Basics.md)
**Lab:** TryHackMe — Network Services / ARP Poisoning

---

## Obiettivo

Capire come un attaccante sulla stessa LAN può posizionarsi come man-in-the-middle tra due host avvelenando la cache ARP, per poi intercettare o manipolare il traffico. È la base per gli attacchi di sniffing e Responder trattati nei file successivi.

---

## Concetti chiave

### Come funziona ARP normalmente

ARP (Address Resolution Protocol) mappa un IP a un indirizzo MAC sulla LAN. Ogni host mantiene una cache ARP costruita da richieste/risposte broadcast, senza alcuna autenticazione: chiunque può rispondere a una ARP request affermando di possedere un dato IP.

### ARP spoofing / poisoning

L'attaccante invia ARP reply non richiesti (gratuitous ARP) a due host (es. vittima e gateway), dicendo a ciascuno che il proprio MAC corrisponde all'IP dell'altro. Il traffico tra i due passa quindi attraverso la macchina dell'attaccante, che può inoltrarlo (IP forwarding attivo) dopo averlo osservato/modificato.

| Ruolo | Cosa vede l'attaccante dopo il poisoning |
|-------|-------------------------------------------|
| Vittima -> Gateway | Tutto il traffico in uscita della vittima |
| Gateway -> Vittima | Tutto il traffico di risposta destinato alla vittima |

### Rischi e limiti

- Funziona solo sulla stessa LAN/broadcast domain (non attraversa router)
- Traffico cifrato (TLS) resta illeggibile senza ulteriori attacchi (es. SSL stripping)
- Facilmente rilevabile con strumenti di ARP monitoring (arpwatch, IDS di rete)

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| arpspoof (dsniff) | `arpspoof -i eth0 -t 10.10.10.5 10.10.10.1` | invia ARP reply falsificati | serve avviare due istanze (una per direzione) o usare `-r` |
| ettercap | `ettercap -T -i eth0 -M arp:remote /10.10.10.5// /10.10.10.1//` | MITM completo con plugin | interfaccia testuale o grafica (`-G`) |
| bettercap | `bettercap -iface eth0` poi `net.probe on; arp.spoof on` | MITM modulare, molto più attivo di ettercap | usato spesso anche per sslstrip/caplets |
| netdiscover | `netdiscover -r 10.10.10.0/24` | scopre host attivi sulla LAN | utile per trovare target/gateway prima del poisoning |

---

## Payload / Esempi

### Esempio 1: abilitare IP forwarding (necessario prima di ogni MITM)

```bash
sudo sysctl -w net.ipv4.ip_forward=1
```

**Output atteso:**
```
net.ipv4.ip_forward = 1
```

**Spiegazione:** senza IP forwarding attivo la vittima e il gateway smettono di comunicare (l'attaccante riceve i pacchetti ma non li inoltra), causando un DoS invece di un MITM silenzioso.

### Esempio 2: ARP poisoning bidirezionale con arpspoof

```bash
# terminale 1: vittima crede che l'attaccante sia il gateway
sudo arpspoof -i eth0 -t 10.10.10.5 10.10.10.1

# terminale 2: gateway crede che l'attaccante sia la vittima
sudo arpspoof -i eth0 -t 10.10.10.1 10.10.10.5
```

**Output atteso:**
```
0:c:29:aa:bb:cc 0:50:56:11:22:33 0806 42: arp reply 10.10.10.1 is-at 0:c:29:aa:bb:cc
```

**Spiegazione:** ogni riga è un ARP reply falsificato inviato in loop. A questo punto il traffico tra 10.10.10.5 e 10.10.10.1 transita sulla macchina attaccante; combina con `tcpdump`/Wireshark (vedi file successivo) per osservarlo.

### Esempio 3: MITM rapido con bettercap

```
sudo bettercap -iface eth0
> net.probe on
> set arp.spoof.targets 10.10.10.5
> arp.spoof on
> net.sniff on
```

**Spiegazione:** bettercap unisce discovery, spoofing e sniffing in un'unica sessione interattiva, con moduli aggiuntivi per HTTP/HTTPS proxy trasparente.

---

## Evasion / Bypass Techniques

Non è un attacco da "evadere" verso il target, ma da nascondere alla rete: limitare il rate degli ARP reply e usare `arp.spoof.fullduplex` con parsimonia riduce le anomalie rilevabili da IDS/arpwatch. In ambito d'esame/lab autorizzato la stealth non è prioritaria.

---

## Lab Hands-On

### Lab 1: TryHackMe — Network Services / MITM basics
**Obiettivo:** eseguire ARP poisoning tra due macchine lab e osservare il traffico intercettato
**Difficulty:** Media
**Time:** 45 min

**Walkthrough breve:**
1. Identifica vittima e gateway con `netdiscover`/`arp -a`
2. Attiva IP forwarding
3. Avvia il poisoning bidirezionale con arpspoof o bettercap
4. Passa a [02-Sniffing-Wireshark.md](02-Sniffing-Wireshark.md) per analizzare il traffico catturato

---

## Common Mistakes

- Dimenticare `ip_forward=1` -> la vittima perde connettività e l'attacco viene notato subito
- Fare poisoning solo in una direzione -> si perde metà del traffico (solo richieste o solo risposte)
- Aspettarsi di leggere traffico HTTPS in chiaro senza ulteriori tecniche (sslstrip, certificati fake)

---

## Link Utili

- [Ettercap — documentazione ufficiale](https://www.ettercap-project.org/)
- [Bettercap — documentazione ufficiale](https://www.bettercap.org/)

---

## Connessioni

- **Prerequisito:** [../00-Fundamentals/02-Networking-Basics.md](../00-Fundamentals/02-Networking-Basics.md)
- **Prossimo Step:** [02-Sniffing-Wireshark.md](02-Sniffing-Wireshark.md)
- **Combinazione con:** [03-LLMNR-NBTNS-Responder.md](03-LLMNR-NBTNS-Responder.md)

---

## Checklist di padronanza

- [ ] So spiegare come funziona ARP e perché è vulnerabile allo spoofing
- [ ] So eseguire un poisoning bidirezionale con arpspoof
- [ ] So usare bettercap per un MITM rapido
- [ ] Conosco i limiti dell'attacco (stessa LAN, traffico cifrato)

---

## Note personali

_(spazio libero)_
