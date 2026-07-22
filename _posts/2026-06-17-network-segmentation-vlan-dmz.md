---
layout: post
title: "Segmentazione di rete: VLAN, DMZ e microsegmentazione per ridurre il blast radius"
date: 2026-06-17
cat: blue
tags: [VLAN, DMZ, segmentazione, microsegmentazione, firewall, rete, blue team]
excerpt: "Una rete piatta è un sogno per gli attaccanti: compromesso un host, si muovono liberamente. La segmentazione limita il blast radius contenendo le compromissioni ai singoli segmenti."
---

Immagina una nave con un solo compartimento: un foro e affonda tutta. Ora immagina la stessa nave con 20 compartimenti stagni: un foro causa al massimo l'allagamento di uno. La segmentazione di rete applica la stessa logica alle infrastrutture IT.

## Il problema della rete piatta

In una rete non segmentata:
- Un PC utente può raggiungere direttamente il server database
- Un dispositivo IoT può raggiungere il server degli HR
- Un attaccante che compromette un laptop può muoversi liberamente verso tutti i target

Il **blast radius** di una compromissione è l'intera rete.

## VLAN — Virtual LAN

Le VLAN creano reti logiche separate sulla stessa infrastruttura fisica. Un switch gestito assegna ogni porta a una VLAN; il traffico tra VLAN passa solo attraverso un router/firewall.

**Schema tipico:**

```
VLAN 10 — Utenti (192.168.10.0/24)
VLAN 20 — Server (10.0.20.0/24)
VLAN 30 — IoT (172.16.30.0/24)
VLAN 40 — Stampanti/periferiche (10.0.40.0/24)
VLAN 50 — Management (10.0.50.0/24)  ← solo amministratori
VLAN 99 — Guest WiFi (192.168.99.0/24) ← solo internet, no LAN
```

Il traffico da VLAN 10 (Utenti) a VLAN 20 (Server) passa attraverso il firewall — che può filtrare, loggare e applicare regole granulari.

## DMZ — Demilitarized Zone

La DMZ è un segmento dedicato ai servizi esposti su Internet (web server, mail server, reverse proxy). È separata sia da Internet che dalla rete interna:

```
Internet → [Firewall esterno] → DMZ → [Firewall interno] → Rete interna
                                  ↑
                            Web server, Mail server, VPN endpoint
```

Regole tipiche:
- Internet → DMZ: solo HTTP/S, SMTP (porte specifiche)
- DMZ → Rete interna: solo le connessioni necessarie (es. il web server → database su porta 3306)
- Rete interna → DMZ: management SSH da Management VLAN
- DMZ → Internet: bloccato (il web server non deve iniziare connessioni verso Internet)

## Microsegmentazione

La microsegmentazione porta la segmentazione a livello di singolo workload: ogni server può comunicare solo con i server con cui deve comunicare, e non con tutti gli altri nella stessa VLAN.

**Implementazioni:**
- **Host-based firewall** (Windows Firewall, iptables): regole per ogni singolo host
- **NSX** (VMware): microsegmentazione per VM in ambienti virtuali
- **Kubernetes Network Policies**: isolamento dei pod
- **AWS Security Groups**: uno per ogni tipo di istanza, regole minimali

## Regole di segmentazione essenziali

```
# Regole base che ogni organizzazione dovrebbe avere:

UTENTI → INTERNET: permesso
UTENTI → SERVER: solo porte applicative necessarie
UTENTI → UTENTI: bloccato (no SMB tra workstation)
IOT → INTERNET: bloccato (solo dove necessario)
IOT → SERVER: bloccato
MANAGEMENT → TUTTO: permesso (ma solo da IP gestione)
GUEST → INTERNET: permesso
GUEST → LAN: bloccato completamente
```

## Rilevamento del lateral movement

La segmentazione rende il lateral movement molto più rumoroso:
- Un attaccante che prova a raggiungere un server da una VLAN utenti genera traffico intercettato dal firewall
- I log del firewall mostrano tentativi di connessione inusuali
- I blocchi automatici su connessioni non autorizzate possono triggerare alert

Con una rete piatta, il lateral movement avviene silenziosamente in SMB tra workstation. Con segmentazione, ogni movimento è loggato.
