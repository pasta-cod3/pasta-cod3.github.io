# HTB — Beep (Walkthrough Notes)

**Difficulty:** Easy
**Time to root (stimato):** 1.5-2h
**Vulnerability:** Elastix/FreePBX LFI noto -> RCE, servizi VoIP multipli da enumerare

---

## Obiettivo

Macchina Linux con installazione Elastix/FreePBX (VoIP), ottimo esercizio di enumerazione multi-servizio (molte porte aperte) seguita da sfruttamento di una LFI/RCE nota nel pannello web.

---

## Metodologia (nota: dettagli specifici possono variare, verifica sempre sulla macchina attuale)

### 1. Recon
```bash
nmap -p- --min-rate=5000 -sV -sC target.com
```
Aspettati un numero insolitamente alto di porte aperte (SIP, HTTPS, mail, ecc.) — tipico di una suite VoIP completa.

### 2. Fingerprint applicazione web
```bash
whatweb -a 3 https://target.com
```
Identifica Elastix/FreePBX e la versione esatta.

### 3. Ricerca vulnerabilita note per la versione
```bash
searchsploit elastix
searchsploit freepbx
```
Cerca in particolare LFI note nel pannello (es. tramite parametro che include file di log/config), applicabile secondo la metodologia di [03-File-Inclusion/01-LFI-Basics.md](../03-File-Inclusion/01-LFI-Basics.md).

### 4. Da LFI a RCE
Se disponibile un vettore di log poisoning (es. via un servizio che logga input controllabile), applica la metodologia di [03-File-Inclusion/02-LFI-Advanced.md](../03-File-Inclusion/02-LFI-Advanced.md).

### 5. Post-exploitation
Enumera credenziali riusate tra i servizi VoIP/database locali (spesso config PHP con credenziali MySQL in chiaro) per l'escalation verso root.

---

## Key Lessons

- Un numero elevato di porte aperte indica spesso una suite applicativa complessa: enumera OGNI servizio, non solo HTTP
- Le versioni software datate (Elastix/FreePBX legacy) hanno quasi sempre CVE pubblici noti: `searchsploit` e il primo strumento da usare dopo il fingerprint
- Le credenziali trovate in file di configurazione PHP sono spesso riusate a livello di sistema

---

## Connessioni

- **Combinazione con:** [03-File-Inclusion/02-LFI-Advanced.md](../03-File-Inclusion/02-LFI-Advanced.md), [02-Scanning-Enumeration/02-Service-Detection.md](../02-Scanning-Enumeration/02-Service-Detection.md)

---

## Note personali

_(annota qui i tuoi comandi esatti e le differenze rispetto a queste note generiche)_
