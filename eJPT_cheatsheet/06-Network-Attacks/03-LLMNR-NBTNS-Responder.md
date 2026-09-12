# LLMNR/NBT-NS Poisoning con Responder

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [02-Sniffing-Wireshark.md](02-Sniffing-Wireshark.md)
**Lab:** TryHackMe, Attacktive Directory / Network Services 2

---

## Obiettivo

Non serve avvelenare nessuna cache qui: basta stare in ascolto e aspettare che qualcuno sbagli un nome di risorsa. Windows, quando il DNS normale fallisce, prova a chiedere in broadcast "chi è questo nome?" — e tu rispondi prima del vero servizio, fingendoti quello richiesto, catturando l'hash NTLMv2 che il client ti manda pensando di autenticarsi altrove. È passivo, è silenzioso, ed è uno degli attacchi più affidabili che troverai su reti Windows/AD mal configurate: spesso è solo questione di aspettare.

---

## Concetti chiave

### Perché esiste LLMNR/NBT-NS

Quando la risoluzione DNS normale fallisce (es. typo in un nome di share `\\fileserver\shair`), Windows prova in broadcast/multicast con LLMNR (Link-Local Multicast Name Resolution) e NBT-NS (NetBIOS Name Service) prima di arrendersi. Chiunque sulla rete può rispondere per primo affermando "sono io quel nome".

### Flusso dell'attacco

1. Un client cerca una risorsa con nome errato o non più esistente
2. DNS non risponde -> il client tenta LLMNR/NBT-NS in broadcast
3. Responder (in ascolto) risponde per primo, fingendosi il servizio richiesto
4. Il client tenta l'autenticazione SMB verso Responder -> invia hash NTLMv2 della sessione

### Cosa fare con l'hash catturato

| Opzione | Descrizione |
|---------|-------------|
| Cracking offline | `hashcat -m 5600` (NTLMv2) contro wordlist |
| Relay (se SMB signing disabilitato) | inoltrare l'autenticazione con `ntlmrelayx.py` invece di crackarla |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Responder | `sudo responder -I eth0 -wrf` | log con hash catturati in `/usr/share/responder/logs/` | `-w` avvia WPAD, `-r`/`-f` opzioni NBT-NS/fingerprint |
| ntlmrelayx.py (impacket) | `ntlmrelayx.py -tf targets.txt -smb2support` | relay dell'autenticazione a host senza SMB signing | va combinato con Responder senza il modulo SMB attivo |
| hashcat | `hashcat -m 5600 hash.txt rockyou.txt` | password in chiaro se crackata | mode 5600 = NetNTLMv2 |

---

## Payload / Esempi

### Esempio 1: avvio base di Responder

```bash
sudo responder -I eth0 -wrf
```

**Output atteso:**
```
[+] Listening for events...
[SMB] NTLMv2-SSP Client   : 10.10.10.22
[SMB] NTLMv2-SSP Username : CORP\j.smith
[SMB] NTLMv2-SSP Hash     : j.smith::CORP:1122334455667788:...
```

**Spiegazione:** ogni volta che un client sulla LAN sbaglia un nome risorsa, Responder risponde e registra l'hash NTLMv2 dell'utente che ha tentato l'autenticazione.

### Esempio 2: cracking dell'hash catturato

```bash
hashcat -m 5600 j.smith_hash.txt /usr/share/wordlists/rockyou.txt
```

**Output atteso:**
```
J.SMITH::CORP:...:...:...  Summer2024!
```

**Spiegazione:** NTLMv2 non e reversibile ma e crackabile per confronto contro wordlist; password deboli/riutilizzate cadono rapidamente.

### Esempio 3: mitigazione (lato difensivo, utile per il report)

```
Disabilita LLMNR: Group Policy -> Computer Configuration -> Administrative Templates
                  -> Network -> DNS Client -> "Turn off Multicast Name Resolution"
Disabilita NBT-NS: impostazioni scheda di rete -> WINS -> "Disable NetBIOS over TCP/IP"
```

**Spiegazione:** disabilitare entrambi i protocolli di fallback elimina la superficie d'attacco senza impattare la risoluzione DNS normale in un ambiente correttamente configurato.

---

## Evasion / Bypass Techniques

Se il traffico broadcast non raggiunge la vittima perché sei su una VLAN separata, combina con [01-MITM-ARP-Spoofing.md](01-MITM-ARP-Spoofing.md) per posizionarti sullo stesso segmento. Altrimenti non serve fare nulla di speciale: lascia Responder acceso e attendi, su una rete Windows con molti client è quasi sempre solo questione di tempo.

---

## Lab Hands-On

### Lab 1: TryHackMe, Network Services 2 / Responder basics
**Obiettivo:** catturare e crackare un hash NTLMv2 con Responder
**Difficulty:** Media
**Time:** 45 min

**Walkthrough breve:**
1. Avvia Responder in ascolto sull'interfaccia corretta
2. Attendi (o genera) una richiesta di risorsa inesistente dal client vittima
3. Copia l'hash catturato e crackalo con hashcat/john

---

## Common Mistakes

- Lasciare attivi tutti i moduli di Responder (SMB/HTTP/WPAD) in ambienti reali senza autorizzazione esplicita -> può interferire con servizi legittimi
- Aspettarsi risultati immediati -> l'attacco dipende dal comportamento naturale degli utenti sulla rete
- Confondere hashcat mode 5600 (NetNTLMv2) con 1000 (NTLM hash da SAM/NTDS) -> mode sbagliato non crackera mai nulla

---

## Link Utili

- [Responder: GitHub ufficiale](https://github.com/lgandx/Responder)
- [Impacket: ntlmrelayx](https://github.com/fortra/impacket)

---

## Connessioni

- **Prerequisito:** [02-Sniffing-Wireshark.md](02-Sniffing-Wireshark.md)
- **Prossimo Step:** [04-DNS-Attacks.md](04-DNS-Attacks.md)
- **Combinazione con:** [../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md)

---

## Checklist di padronanza

- [ ] So spiegare perché LLMNR/NBT-NS esistono e perché sono abusabili
- [ ] So avviare Responder e leggere un hash catturato
- [ ] So crackare un hash NetNTLMv2 con il mode hashcat corretto
- [ ] Conosco la mitigazione da proporre in un report

