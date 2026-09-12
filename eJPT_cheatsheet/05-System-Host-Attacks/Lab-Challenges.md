# Lab Challenges — System/Host Attacks

**Difficolta:** Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Esercizi pratici per consolidare attacchi host Windows/Linux, password attack e credential dumping prima di passare al Metasploit Framework in modo strutturato.

---

## Challenge 1 — Dalla scoperta all'accesso su un host Windows datato

**Target:** una macchina Windows lab con SMB esposto (es. TryHackMe Blue, HTB Legacy)

**Task:**
1. Conferma MS17-010 con NSE
2. Sfrutta con Metasploit e ottieni una sessione meterpreter
3. Esegui `hashdump` e verifica se l'hash trovato e riutilizzabile su altri host

**Deliverable:** nota con IP, exploit usato, hash estratti (redatti/troncati per il proprio archivio personale).

---

## Challenge 2 — Password attack end-to-end

**Task:**
1. Trova un servizio con login esposto (SSH/FTP/form web) su un host lab
2. Esegui un brute force mirato con Hydra
3. Con le credenziali trovate, verifica il riuso su altri servizi/host della rete

**Deliverable:** tabella Servizio/Username/Password/Riusata-su.

---

## Common Mistakes

- Passare direttamente al credential dumping senza aver prima ottenuto privilegi sufficienti -> comandi falliscono senza un motivo chiaro se non si controlla `getuid`/`whoami` prima
- Non testare il riuso di credenziali trovate su tutti i servizi della rete -> si perdono host facilmente raggiungibili

---

## Link Utili

- [TryHackMe — Blue](https://tryhackme.com/room/blue)
- [HackTheBox — Legacy](https://www.hackthebox.com/)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [05-System-Host-Attacks](.)
- **Prossimo Step:** [../06-Network-Attacks/01-MITM-ARP-Spoofing.md](../06-Network-Attacks/01-MITM-ARP-Spoofing.md)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 su almeno un host di lab ciascuno
- [ ] So collegare vulnerability assessment, exploitation e credential dumping in un flusso unico
- [ ] Sono pronto a passare agli attacchi di rete

---

## Note personali

_(spazio libero)_
