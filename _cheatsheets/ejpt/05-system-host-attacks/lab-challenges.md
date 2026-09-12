---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Lab Challenges: System/Host Attacks"
permalink: "/cheatsheet/ejpt/05-system-host-attacks/lab-challenges/"
section: "System & Host Attacks"
section_order: 5
order: 99
sort_key: 599
---

**Difficoltà:** Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Fin qui hai visto ogni tecnica isolata: MS17-010 da una parte, Hydra dall'altra, mimikatz per conto suo. I due esercizi qui sotto ti fanno mettere tutto in fila su un caso solo, dalla scoperta fino al credential dumping, così quando arrivi a Metasploit hai già lo schema mentale pronto invece di improvvisarlo lì per lì.

---

## Challenge 1: Dalla scoperta all'accesso su un host Windows datato

**Target:** una macchina Windows lab con SMB esposto (es. TryHackMe Blue, HTB Legacy)

**Task:**
1. Conferma MS17-010 con NSE
2. Sfrutta con Metasploit e ottieni una sessione meterpreter
3. Esegui `hashdump` e verifica se l'hash trovato e riutilizzabile su altri host

**Deliverable:** nota con IP, exploit usato, hash estratti (redatti/troncati per il proprio archivio personale).

---

## Challenge 2: Password attack end-to-end

**Task:**
1. Trova un servizio con login esposto (SSH/FTP/form web) su un host lab
2. Esegui un brute force mirato con Hydra
3. Con le credenziali trovate, verifica il riuso su altri servizi/host della rete

**Deliverable:** tabella Servizio/Username/Password/Riusata-su.

---

## Common Mistakes

- Passare direttamente al credential dumping senza aver prima ottenuto privilegi sufficienti -> comandi falliscono senza un motivo chiaro se non controlli `getuid`/`whoami` prima
- Non testare il riuso di credenziali trovate su tutti i servizi della rete -> ti lasci indietro host facilmente raggiungibili

---

## Link Utili

- [TryHackMe: Blue](https://tryhackme.com/room/blue)
- [HackTheBox: Legacy](https://www.hackthebox.com/)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [05-System-Host-Attacks](.)
- **Prossimo Step:** [../06-Network-Attacks/01-MITM-ARP-Spoofing.md](/cheatsheet/ejpt/06-network-attacks/01-mitm-arp-spoofing/)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 su almeno un host di lab ciascuno
- [ ] So collegare vulnerability assessment, exploitation e credential dumping in un flusso unico
- [ ] Sono pronto a passare agli attacchi di rete
