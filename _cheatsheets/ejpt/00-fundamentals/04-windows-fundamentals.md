---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Windows Fundamentals"
permalink: "/cheatsheet/ejpt/00-fundamentals/04-windows-fundamentals/"
section: "Fundamentals"
section_order: 0
order: 4
sort_key: 4
---

**Difficoltà:** Beginner
**Time to Master:** 2h
**Prerequisiti:** [03-Linux-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/03-linux-fundamentals/)
**Lab:** INE PTS, Windows Fundamentals

---

## Obiettivo

Se vieni dal mondo Linux, preparati a un cambio di paradigma: qui non ci sono `/etc/passwd` e permessi ottali, ma SAM, LSASS e una gerarchia di gruppi che decide chi controlla cosa. La maggior parte degli host che incontri in un lab eJPTv2 è Windows, spesso agganciato a un dominio Active Directory, e senza questi concetti di base l'enumeration e la privilege escalation restano una sequenza di comandi che copi senza capire cosa stai davvero guardando.

---

## Concetti chiave

### Utenti e gruppi: locali vs dominio

| Tipo | Ambito | Esempio |
|------|--------|---------|
| Utente locale | valido solo su quella macchina | `.\Administrator` |
| Utente di dominio | valido su tutta la Active Directory | `DOMAIN\jsmith` |
| Gruppo locale importante | Administrators, Users, Remote Desktop Users | controlla i privilegi locali |
| Gruppo di dominio importante | Domain Admins, Enterprise Admins | controllo totale sul dominio se compromesso |

### Active Directory: concetti base

| Concetto | Significato |
|----------|-------------|
| Domain Controller (DC) | server che gestisce autenticazione/autorizzazione del dominio (esegue AD DS) |
| Domain | confine logico di gestione di utenti/computer/policy |
| OU (Organizational Unit) | contenitore per organizzare oggetti AD e applicare GPO |
| GPO (Group Policy Object) | regole applicate centralmente a utenti/computer |
| Trust | relazione che permette autenticazione tra domini diversi |
| Kerberos | protocollo di autenticazione di default in AD (ticket-based) |

### File credenziali chiave

| File/DB | Contenuto | Dove si trova |
|---------|-----------|-----------------|
| SAM (Security Account Manager) | hash NTLM degli utenti locali | `C:\Windows\System32\config\SAM`, accessibile solo con privilegi elevati/offline |
| NTDS.dit | database degli account dell'intero dominio | solo sui Domain Controller |
| LSASS | processo di memoria che gestisce credenziali in sessione | target tipico di Mimikatz |

### CMD vs PowerShell essenziali

| Task | CMD | PowerShell |
|------|-----|------------|
| Lista utenti locali | `net user` | `Get-LocalUser` |
| Lista processi | `tasklist` | `Get-Process` |
| Info sistema | `systeminfo` | `Get-ComputerInfo` |
| Rete/IP | `ipconfig /all` | `Get-NetIPAddress` |
| Servizi | `sc query` | `Get-Service` |
| Task pianificati | `schtasks /query` | `Get-ScheduledTask` |

### Registry essenziale

- `HKLM\SYSTEM`, `HKLM\SAM`: configurazione di sistema e account (accesso ristretto)
- `HKCU\...\Run`: chiavi di autorun tipiche per persistenza
- Accesso da riga di comando: `reg query HKLM\Software\...`

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| net.exe | `net user`, `net localgroup administrators` | utenti/gruppi locali | disponibile su ogni Windows |
| PowerShell | `Get-LocalUser`, `whoami /priv` | info dettagliate utente/privilegi | più potente di cmd, spesso monitorato |
| wmic (legacy) | `wmic qfe list` | patch/hotfix installati | deprecato nelle build recenti ma ancora comune |
| whoami | `whoami /all` | utente, gruppi, privilegi correnti | primo comando dopo ogni shell ottenuta |

---

## Payload / Esempi

### Esempio 1: enumerazione rapida post-shell

```powershell
whoami /all
Get-LocalUser
Get-LocalGroupMember Administrators
systeminfo
```

**Spiegazione:** i primi comandi da lanciare dopo aver ottenuto accesso: chi sono, che privilegi ho, chi altro c'è sulla macchina, che versione/patch level ha il sistema (utile per cercare exploit di privesc noti).

### Esempio 2: verificare i privilegi correnti per privesc

```cmd
whoami /priv
```

**Output atteso:**
```
PRIVILEGES INFORMATION
----------------------
Privilege Name               Description                    State
============================= =============================== ========
SeImpersonatePrivilege       Impersonate a client...         Enabled
```

**Spiegazione:** `SeImpersonatePrivilege` abilitato è il prerequisito classico per tecniche di privesc come i "potato exploit" (vedi [08-Exploitation-PostEx/03-Privilege-Escalation-Windows.md](/cheatsheet/ejpt/08-exploitation-postex/03-privilege-escalation-windows/)).

---

## Common Mistakes

- Confondere un utente locale amministratore con "Domain Admin": privilegi completamente diversi
- Ignorare `whoami /priv`: molte privesc Windows dipendono da privilegi specifici abilitati, non solo dal gruppo
- Dimenticare che PowerShell può essere loggato/monitorato (AMSI, transcript): rilevante per capire perché un payload "funziona in lab ma non in produzione"

---

## Link Utili

- [Microsoft Docs: Active Directory Domain Services](https://learn.microsoft.com/windows-server/identity/ad-ds/active-directory-domain-services)
- [ADSecurity.org](https://adsecurity.org/)

---

## Connessioni

- **Prerequisito:** [03-Linux-Fundamentals.md](/cheatsheet/ejpt/00-fundamentals/03-linux-fundamentals/)
- **Prossimo Step:** [05-Cryptography-Basics.md](/cheatsheet/ejpt/00-fundamentals/05-cryptography-basics/)
- **Combinazione con:** [08-Exploitation-PostEx/03-Privilege-Escalation-Windows.md](/cheatsheet/ejpt/08-exploitation-postex/03-privilege-escalation-windows/)

---

## Checklist di padronanza

- [ ] So la differenza tra utente locale e utente di dominio
- [ ] Conosco il ruolo di SAM, NTDS.dit e LSASS
- [ ] So enumerare utenti/gruppi/privilegi con cmd e PowerShell
- [ ] Capisco cosa sono OU e GPO in Active Directory
