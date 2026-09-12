# SMB & NetBIOS Enumeration

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [../02-Footprinting-Scanning/04-Service-Version-OS-Detection.md](../02-Footprinting-Scanning/04-Service-Version-OS-Detection.md)
**Lab:** INE PTS, Windows Enumeration

---

## Obiettivo

Se c'è una porta 445 aperta in un lab eJPTv2, aspettati di passarci un bel po' di tempo: SMB è il servizio più enumerato di tutto l'esame, e a ragione — rivela nomi utente, share, versione OS, e spesso permette accesso anonimo a dati che dovrebbero essere protetti. Padroneggiare enum4linux e smbclient qui non è opzionale, è quasi sempre il primo vero punto d'ingresso in una macchina Windows.

---

## Concetti chiave

### Null session e accesso anonimo

Molte installazioni SMB (specialmente Windows datati o Samba mal configurati) permettono una "null session": autenticazione senza username/password valida, che comunque consente di enumerare share, utenti e policy password.

### RID cycling

Ogni account Windows ha un RID (Relative Identifier) incrementale. Con una null session è possibile enumerare RID in sequenza (500, 501, 1000, 1001...) per scoprire nomi utente anche quando l'enumerazione diretta è limitata.

### Share types comuni

| Share | Significato |
|-------|-------------|
| `C$`, `ADMIN$` | share amministrative nascoste, richiedono privilegi admin |
| `IPC$` | Inter-Process Communication, usata per null session e RPC |
| share custom | spesso contengono dati utente, backup, script: obiettivo primario |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| enum4linux-ng | `enum4linux-ng -A target` | utenti, share, policy, OS | versione moderna consigliata |
| smbclient | `smbclient -L //target/ -N` | lista share disponibili | `-N` = null session |
| smbmap | `smbmap -H target -u '' -p ''` | share + permessi (read/write) | mostra subito i permessi effettivi |
| nmap | `nmap --script smb-enum-shares,smb-enum-users -p445 target` | share + utenti via NSE | integra bene lo scan iniziale |
| rpcclient | `rpcclient -U "" -N target` | shell RPC per query manuali | usato per RID cycling manuale |

---

## Payload / Esempi

### Esempio 1: enumerazione completa con enum4linux-ng

```bash
enum4linux-ng -A 10.10.10.5
```

**Output atteso:**
```
[+] Enumerating users
  user:[administrator] rid:[0x1f4]
  user:[guest] rid:[0x1f5]
  user:[svc_backup] rid:[0x450]
[+] Found 3 share(s)
  ADMIN$   Disk   Remote Admin
  backups  Disk   
```

**Spiegazione:** `-A` esegue tutti i moduli (utenti, share, policy password, OS, gruppi); l'utente `svc_backup` è un tipico account di servizio interessante per password attack mirato.

### Esempio 2: listare e accedere a una share

```bash
smbclient -L //10.10.10.5/ -N
smbclient //10.10.10.5/backups -N
```

**Spiegazione:** il primo comando elenca le share disponibili con accesso anonimo, il secondo apre una shell tipo FTP dentro la share `backups` (comandi `ls`, `get`, `cd`).

### Esempio 3: RID cycling manuale con rpcclient

```bash
rpcclient -U "" -N 10.10.10.5
rpcclient $> lookupsids S-1-5-21-...-1000
```

**Spiegazione:** dopo aver ottenuto il SID del dominio (con `lsaquery` dentro rpcclient), si incrementano i RID per risolvere account che non compaiono nell'enumerazione diretta.

---

## Evasion / Bypass Techniques

Enumerazione SMB genera log evidenti sul target (Windows Event ID 4624/4625 per i tentativi di logon). In un contesto di esame autorizzato la discrezione non è prioritaria come in un red team reale; conoscere comunque il concetto: throttling delle richieste, evitare enumerazione a raffica su più host in parallelo.

---

## Lab Hands-On

### Lab 1: INE PTS, SMB Enumeration
**Obiettivo:** enumerare utenti e share via null session, accedere a una share leggibile e recuperare un file
**Difficulty:** Medio
**Time:** 45 min

**Walkthrough breve:**
1. Verifica se e permessa una null session con smbclient -N
2. Esegui enum4linux-ng -A per la panoramica completa
3. Accedi alle share con permessi di lettura e cerca file sensibili (credenziali, config)

---

## Common Mistakes

- Assumere che SMB senza credenziali significhi "niente da fare" -> la null session spesso basta per enumerare tutto
- Ignorare smbmap -> mostra i permessi (read/write) in modo molto più diretto di smbclient -L
- Non controllare share amministrative nascoste (`C$`) quando si hanno già credenziali valide trovate altrove

---

## Link Utili

- [enum4linux-ng GitHub](https://github.com/cddmp/enum4linux-ng)
- [SMB protocol overview: Microsoft docs](https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-overview)

---

## Connessioni

- **Prerequisito:** [../02-Footprinting-Scanning/04-Service-Version-OS-Detection.md](../02-Footprinting-Scanning/04-Service-Version-OS-Detection.md)
- **Prossimo Step:** [02-FTP-Enumeration.md](02-FTP-Enumeration.md)
- **Combinazione con:** [../05-System-Host-Attacks/01-Windows-Host-Attacks.md](../05-System-Host-Attacks/01-Windows-Host-Attacks.md)

---

## Checklist di padronanza

- [ ] So verificare e sfruttare una null session SMB
- [ ] So enumerare utenti, share e policy con enum4linux-ng
- [ ] Conosco il concetto di RID cycling
- [ ] So distinguere share amministrative da share dati

