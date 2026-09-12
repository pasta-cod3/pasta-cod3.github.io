# Service Detection

**Difficoltà:** Beginner
**Time to Master:** 1.5h
**Prerequisiti:** [01-Port-Scanning.md](01-Port-Scanning.md)
**Lab:** HTB, macchine miste

---

## Obiettivo

Trovare una porta aperta ti dice poco da solo: è la versione esatta del servizio dietro quella porta a dirti se vale la pena scavare o se puoi passare oltre. Qui impari a identificarla con precisione e a collegarla a CVE noti, per concentrare l'attacco dove serve invece di testare tutto alla cieca.

---

## Concetti chiave

### NSE (Nmap Scripting Engine)

Script predefiniti che estendono nmap per version detection avanzato, enumerazione, e persino detection di vulnerabilità note.

| Categoria script | Esempio |
|-------------------|---------|
| `default` (-sC) | script sicuri di base |
| `vuln` | rileva CVE noti |
| `discovery` | enumerazione aggiuntiva (titoli http, share smb) |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| nmap -sV | `nmap -sV -p 80 target` | versione servizio | banner + probe |
| nmap --script vuln | `nmap --script vuln -p 80 target` | CVE noti | rumoroso, lento |
| searchsploit | `searchsploit apache 2.4.41` | exploit noti | offline DB Exploit-DB |

---

## Payload / Esempi

### Esempio 1: version detection + script vuln mirato

```bash
nmap -sV -sC -p 80,443 target.com
nmap --script vuln -p 80,443 target.com
```

**Output atteso:**
```
80/tcp open  http Apache httpd 2.4.49
| http-vuln-cve2017-9798: VULNERABLE (Optionsbleed)
```

**Spiegazione:** `--script vuln` confronta il servizio rilevato con il sottoinsieme di CVE per cui esiste uno script NSE dedicato (non tutti i CVE noti hanno una copertura in nmap). È utilissimo come primo triage, da verificare sempre manualmente. Verifica quali script sono realmente disponibili nella tua versione con `nmap --script-help "http-vuln*"`; per una copertura più ampia (matching CVE su banner di versione) valuta script di terze parti come `vulners`/`vulscan`.

### Esempio 2: ricerca exploit offline

```bash
searchsploit apache 2.4.49
searchsploit -m 50383   # scarica l'exploit trovato in locale
```

---

## Evasion / Bypass Techniques

`--script vuln` è molto rumoroso e facilmente loggato/bloccato da WAF: in un engagement reale con vincoli di stealth, preferisci version detection manuale (`-sV`) seguita da ricerca CVE offline con searchsploit.

---

## Lab Hands-On

### Lab 1: HTB, macchina con servizio vulnerabile noto
**Obiettivo:** collegare versione trovata a CVE sfruttabile
**Difficulty:** Medio
**Time:** 45 min

**Walkthrough breve:**
1. `nmap -sV -sC` sul target
2. `searchsploit` per la versione esatta trovata
3. Verifica manuale della vulnerabilità prima di lanciare l'exploit

---

## Common Mistakes

- Fidarsi del risultato di `--script vuln` senza verifica manuale -> falsi positivi frequenti
- Non aggiornare il database searchsploit -> `searchsploit -u` prima di ogni sessione di studio

---

## Link Utili

- [Nmap NSE Documentation](https://nmap.org/nsedoc/)
- [Exploit-DB](https://www.exploit-db.com/)

---

## Connessioni

- **Prerequisito:** [01-Port-Scanning.md](01-Port-Scanning.md)
- **Prossimo Step:** [03-Web-Enumeration.md](03-Web-Enumeration.md)

---

## Checklist di padronanza

- [ ] So usare script NSE mirati (non solo default)
- [ ] So cercare exploit offline con searchsploit
- [ ] So verificare manualmente un CVE prima di sfruttarlo

