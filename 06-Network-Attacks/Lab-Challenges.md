# Lab Challenges — Network Attacks

**Difficolta:** Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Esercizi pratici per consolidare MITM, sniffing e poisoning su una rete lab prima di passare a Metasploit ed exploitation.

---

## Challenge 1 — MITM completo con estrazione credenziali

**Target:** due macchine lab su una LAN condivisa (es. TryHackMe network o VM locali)

**Task:**
1. Identifica vittima e gateway
2. Esegui ARP poisoning bidirezionale
3. Cattura il traffico con tcpdump/Wireshark
4. Estrai almeno una credenziale in chiaro (FTP/HTTP/Telnet)

**Deliverable:** pcap salvata + credenziali estratte con relativo Follow TCP Stream documentato.

---

## Challenge 2 — Cattura e cracking hash NTLMv2

**Task:**
1. Avvia Responder sulla rete lab
2. Genera o attendi una richiesta di risorsa con nome errato dal client vittima
3. Cracka l'hash catturato con hashcat/john
4. Documenta la mitigazione da proporre (disabilitare LLMNR/NBT-NS)

**Deliverable:** hash catturato, password in chiaro (se crackata), raccomandazione di mitigazione.

---

## Common Mistakes

- Saltare direttamente a Responder senza aver verificato la connettivita di rete di base -> perdi tempo a debuggare un setup, non l'attacco
- Non documentare i passaggi in tempo reale -> difficile ricostruire la catena per il report finale

---

## Link Utili

- [TryHackMe — Network Services rooms](https://tryhackme.com/)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [06-Network-Attacks](.)
- **Prossimo Step:** [../07-Metasploit-Framework/01-Msfconsole-Basics.md](../07-Metasploit-Framework/01-Msfconsole-Basics.md)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 su almeno una rete di lab
- [ ] So spiegare l'intera catena MITM -> sniffing -> Responder a qualcun altro
- [ ] Sono pronto a passare a Metasploit Framework

---

## Note personali

_(spazio libero)_
