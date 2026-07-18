---
layout: post
title: "Hardening Linux: configurare un sistema che non ti tradisce"
description: "Guida pratica all'hardening di sistemi Linux: SSH, firewall, SELinux/AppArmor, audit, aggiornamenti automatici e checklist finale."
date: 2026-02-05
categoria: Blue Team
tags: [hardening, linux, ssh, firewall, selinux, apparmor, sysadmin]
---

# Hardening Linux: configurare un sistema che non ti tradisce

Linux è il sistema operativo più usato nei server, nei dispositivi IoT, nei container, nei sistemi embedded. È potente, flessibile e, nella sua configurazione di default, **spesso più esposto di quanto dovrebbe essere**.

Un sistema Linux appena installato è come una casa nuova: le porte ci sono, ma le serrature non sono ancora tutte al loro posto. L'hardening è mettere le serrature giuste, tappare le finestre che non servono, e installare un sistema di allarme.

Questa guida è pratica. Niente teoria astratta — solo comandi, configurazioni e spiegazioni di cosa cambia e perché.

---

## 1. Aggiornamenti: la base di tutto

Non c'è hardening che tenga se il sistema non è aggiornato. Inizia sempre da qui.

```bash
# Aggiornamento completo (Debian/Ubuntu)
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y

# Aggiornamento completo (RHEL/CentOS/Fedora)
sudo dnf update -y

# Abilita aggiornamenti automatici di sicurezza (Debian/Ubuntu)
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

Configura `/etc/apt/apt.conf.d/50unattended-upgrades` per applicare solo le patch di sicurezza in automatico, evitando aggiornamenti che potrebbero rompere servizi.

---

## 2. Hardening SSH

SSH è il punto di accesso principale su qualsiasi server Linux. È anche uno dei bersagli preferiti di scanner e botnet.

```bash
sudo nano /etc/ssh/sshd_config
```

Configurazione consigliata:

```ini
# Cambia la porta di default (sicurezza per oscurità, ma riduce il rumore nei log)
Port 2222

# Disabilita il login come root
PermitRootLogin no

# Consenti solo autenticazione con chiave SSH
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Disabilita autenticazione con password vuota
PermitEmptyPasswords no

# Limita gli utenti che possono fare SSH
AllowUsers tuo_utente

# Riduci il numero di tentativi di autenticazione
MaxAuthTries 3

# Timeout di sessione inattiva
ClientAliveInterval 300
ClientAliveCountMax 2

# Disabilita X11 forwarding se non serve
X11Forwarding no

# Disabilita tunneling se non necessario
AllowTcpForwarding no
AllowStreamLocalForwarding no
GatewayPorts no
```

Dopo le modifiche, riavvia SSH:

```bash
sudo systemctl restart sshd

# Verifica che la configurazione sia valida prima di chiudere la sessione!
sudo sshd -t
```

**Genera una chiave SSH robusta** sul tuo client locale:

```bash
# ED25519 è più moderno e sicuro di RSA
ssh-keygen -t ed25519 -C "tuonome@server" -f ~/.ssh/id_ed25519

# Copia la chiave pubblica sul server
ssh-copy-id -i ~/.ssh/id_ed25519.pub utente@server -p 2222
```

---

## 3. Firewall con UFW o nftables

### UFW (più semplice, Debian/Ubuntu)

```bash
sudo apt install ufw -y

# Policy di default: blocca tutto in ingresso, permetti in uscita
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Apri solo ciò che serve
sudo ufw allow 2222/tcp   # SSH sulla nuova porta
sudo ufw allow 80/tcp     # HTTP
sudo ufw allow 443/tcp    # HTTPS

# Limita i tentativi SSH (anti-brute-force)
sudo ufw limit 2222/tcp

# Attiva il firewall
sudo ufw enable
sudo ufw status verbose
```

### nftables (più potente, approccio moderno)

```bash
# Esempio di ruleset base con nftables
sudo nft -f - << 'EOF'
flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        
        # Connessioni stabilite e correlate
        ct state established,related accept
        
        # Loopback
        iif lo accept
        
        # Ping (opzionale, puoi toglierlo)
        ip protocol icmp accept
        
        # SSH
        tcp dport 2222 ct state new accept
        
        # HTTP/HTTPS
        tcp dport { 80, 443 } accept
        
        # Log e drop del resto
        log prefix "[nftables DROP]: " drop
    }
    
    chain forward {
        type filter hook forward priority 0; policy drop;
    }
    
    chain output {
        type filter hook output priority 0; policy accept;
    }
}
EOF

# Salva la configurazione
sudo nft list ruleset > /etc/nftables.conf
sudo systemctl enable nftables
```

---

## 4. Fail2ban: blocca i brute force

```bash
sudo apt install fail2ban -y

# Crea la configurazione locale (non modificare jail.conf direttamente)
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
# Banna per 1 ora dopo 3 tentativi falliti in 10 minuti
bantime = 3600
findtime = 600
maxretry = 3

# Notifica email (se hai un mailserver)
destemail = tuaemail@example.com
action = %(action_mwl)s

[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Verifica gli IP bannati
sudo fail2ban-client status sshd
```

---

## 5. SELinux / AppArmor: MAC (Mandatory Access Control)

### AppArmor (Debian/Ubuntu)

```bash
sudo apt install apparmor apparmor-utils -y

# Verifica stato
sudo aa-status

# Metti un profilo in enforce mode
sudo aa-enforce /etc/apparmor.d/usr.sbin.nginx

# Crea un profilo per una nuova applicazione
sudo aa-genprof /usr/local/bin/mia-app
```

### SELinux (RHEL/CentOS/Fedora)

```bash
# Verifica che SELinux sia in enforce
getenforce

# Se è in Permissive, mettilo in Enforcing
sudo setenforce 1

# Rendi permanente
sudo nano /etc/selinux/config
# SELINUX=enforcing

# Controlla i denial recenti
sudo ausearch -m avc -ts recent | audit2why
```

---

## 6. Audit e Logging

```bash
sudo apt install auditd -y

# Aggiungi regole di audit critiche
sudo auditctl -w /etc/passwd -p wa -k passwd_changes
sudo auditctl -w /etc/shadow -p wa -k shadow_changes
sudo auditctl -w /etc/sudoers -p wa -k sudoers_changes
sudo auditctl -a always,exit -F arch=b64 -S execve -k command_exec

# Rendi le regole permanenti
sudo nano /etc/audit/rules.d/hardening.rules
```

```bash
# Contenuto di hardening.rules
-w /etc/passwd -p wa -k passwd_changes
-w /etc/shadow -p wa -k shadow_changes
-w /etc/group -p wa -k group_changes
-w /etc/sudoers -p wa -k sudoers_changes
-w /var/log/auth.log -p wa -k auth_log
-a always,exit -F arch=b64 -S execve -k all_commands
```

---

## 7. Rimuovi ciò che non serve

```bash
# Lista i servizi attivi
sudo systemctl list-units --type=service --state=running

# Disabilita servizi inutili (esempio)
sudo systemctl disable --now bluetooth
sudo systemctl disable --now cups
sudo systemctl disable --now avahi-daemon

# Rimuovi pacchetti non necessari
sudo apt autoremove -y
sudo apt purge telnet ftp rsh-client -y
```

---

## Checklist finale rapida

```
✅ Sistema aggiornato
✅ Aggiornamenti di sicurezza automatici abilitati
✅ SSH: root login disabilitato
✅ SSH: solo autenticazione con chiave
✅ SSH: porta cambiata
✅ Firewall attivo con policy deny-default
✅ Fail2ban configurato e attivo
✅ SELinux/AppArmor in enforce mode
✅ Auditd configurato
✅ Servizi non necessari rimossi
✅ Account inutilizzati disabilitati
✅ Permessi su file sensibili verificati (passwd, shadow, sudoers)
```

---

## Conclusione

L'hardening non è un'operazione una tantum — è un processo. I sistemi cambiano, vengono installate nuove applicazioni, si aprono nuove porte. Riesegui questi controlli periodicamente e considera l'uso di strumenti come **Lynis** per un audit automatico:

```bash
sudo apt install lynis -y
sudo lynis audit system
```

Lynis ti darà un punteggio di hardening e una lista di miglioramenti suggeriti. Punta a superare 70/100 come baseline.

Nel prossimo articolo facciamo la stessa cosa su Windows — stesso concetto, mondo completamente diverso. 🐧
