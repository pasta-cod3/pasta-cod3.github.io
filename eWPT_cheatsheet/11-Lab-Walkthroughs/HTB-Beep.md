# HTB: Beep (Walkthrough Notes)

**Difficulty:** Easy
**Time to root (stimato):** 1.5-2h
**Vulnerability:** Elastix/FreePBX LFI noto -> RCE, servizi VoIP multipli da enumerare

---

## Obiettivo

La prima volta che lanci nmap su Beep e vedi la lista di porte aperte ti chiedi se hai sbagliato target: è normale, una suite VoIP completa come Elastix/FreePBX espone davvero così tanti servizi. La tentazione è concentrarsi subito sull'HTTP e ignorare il resto, ma qui il valore dell'esercizio è proprio imparare a enumerare tutto con calma prima di sfruttare la LFI/RCE nota nel pannello.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon
```bash
nmap -p- --min-rate=5000 -sV -sC target.com
```
Aspettati un numero insolitamente alto di porte aperte (SIP, HTTPS, mail, ecc.): è tipico di una suite VoIP completa.

### 2. Fingerprint applicazione web
```bash
whatweb -a 3 https://target.com
```
Identifica Elastix/FreePBX e la versione esatta.

### 3. Ricerca vulnerabilità note per la versione
```bash
searchsploit elastix
searchsploit freepbx
```
Cerca in particolare LFI note nel pannello (es. tramite parametro che include file di log/config), applicabile secondo la metodologia di [03-File-Inclusion/01-LFI-Basics.md](../03-File-Inclusion/01-LFI-Basics.md).

### 4. Da LFI a RCE
Vettore tipico su Elastix: log poisoning del log di Asterisk (es. `/var/log/asterisk/full`), che registra header SIP (come lo User-Agent) senza sanitizzazione: inserisci un payload PHP in quell'header e poi includilo tramite la LFI. Applica la metodologia di [03-File-Inclusion/02-LFI-Advanced.md](../03-File-Inclusion/02-LFI-Advanced.md).

### 5. Post-exploitation
Enumera credenziali riusate tra i servizi VoIP/database locali (spesso config PHP con credenziali MySQL in chiaro) per l'escalation verso root.

---

## Key Lessons

- Vedere venti porte aperte non è un errore di scansione: indica spesso una suite applicativa complessa, ed enumerare OGNI servizio (non solo HTTP) è quello che separa chi trova il vettore da chi resta bloccato
- Le versioni software datate (Elastix/FreePBX legacy) hanno quasi sempre CVE pubblici noti: `searchsploit` è il primo strumento da usare dopo il fingerprint
- Le credenziali trovate in file di configurazione PHP sono spesso riusate a livello di sistema

---

## Connessioni

- **Combinazione con:** [03-File-Inclusion/02-LFI-Advanced.md](../03-File-Inclusion/02-LFI-Advanced.md), [02-Scanning-Enumeration/02-Service-Detection.md](../02-Scanning-Enumeration/02-Service-Detection.md)

