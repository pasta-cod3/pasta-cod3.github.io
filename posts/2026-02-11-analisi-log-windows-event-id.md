# Analisi dei Log Windows: gli Event ID che devi conoscere

## Introduzione

I **Windows Event Log** sono la fonte di informazioni più importante per un analista Blue Team in ambienti Microsoft. Ogni azione significativa sul sistema viene registrata: login, creazione processi, modifiche al registro, errori di autenticazione.

Il problema non è la mancanza di dati — è che Windows genera migliaia di eventi al giorno. Bisogna sapere **quali Event ID guardare** e **come interpretarli**.

---

## Dove si trovano i log

In Windows i log sono consultabili dall'**Event Viewer** (`eventvwr.msc`) o via PowerShell. Le categorie principali:

```
Windows Logs/
├── Application    → log delle applicazioni
├── Security       → autenticazione, accessi, audit policy
├── System         → eventi di sistema, driver, hardware
└── Setup          → installazioni

Applications and Services Logs/
└── Microsoft/Windows/
    ├── PowerShell/Operational   → esecuzione di script PowerShell
    ├── Sysmon/Operational       → se Sysmon è installato
    └── TaskScheduler/Operational → task schedulati
```

Per la security, il canale **Security** è il più importante.

---

## Event ID fondamentali: Autenticazione

### 4624 — Logon riuscito

Ogni volta che un utente si autentica con successo.

Il campo più importante è **Logon Type**:

| Tipo | Descrizione | Quando è sospetto |
|---|---|---|
| 2 | Interactive (fisico) | Accesso fisico alla macchina |
| 3 | Network | Accesso a share, WMI, ecc. |
| 4 | Batch | Eseguito da un task schedulato |
| 5 | Service | Avvio di un servizio |
| 7 | Unlock | Sblocco schermo |
| 10 | RemoteInteractive | RDP |
| **11** | **CachedInteractive** | **Login con credenziali cached — sospetto** |

**Cosa cercare:** logon type 3 o 10 da IP esterni, logon in orari insoliti, logon su macchine a cui l'utente normalmente non accede.

### 4625 — Logon fallito

Tentativo di autenticazione fallito. Fondamentale per rilevare brute force e password spray.

```
Campi chiave:
- Account Name      → quale utente è stato tentato
- Failure Reason    → perché è fallito (account inesistente, password errata, ecc.)
- Source Network Address → da dove arriva il tentativo
```

**Cosa cercare:** molti 4625 consecutivi dallo stesso IP (brute force) oppure un 4625 su tanti account diversi dallo stesso IP (password spray).

### 4648 — Logon con credenziali esplicite

Qualcuno ha usato `runas` o ha specificato credenziali diverse da quelle correnti. Comune nel lateral movement.

### 4768 / 4769 — Ticket Kerberos (TGT / TGS)

```
4768 → richiesta TGT (Authentication Service Request)
4769 → richiesta TGS (Ticket Granting Service Request)
```

**Cosa cercare in 4769:** molte richieste TGS per account con SPN in poco tempo = probabile **Kerberoasting**.

### 4771 — Pre-autenticazione Kerberos fallita

Equivalente Kerberos del 4625. Indica password errata per un account di dominio.

---

## Event ID fondamentali: Gestione account

### 4720 — Account utente creato

Un nuovo account è stato creato. In ambienti stabili è raro — ogni occorrenza va verificata.

### 4722 — Account utente abilitato
### 4725 — Account utente disabilitato
### 4728 / 4732 / 4756 — Utente aggiunto a gruppo privilegiato

```
4728 → aggiunto a gruppo Security-Enabled Global Group
4732 → aggiunto a gruppo Security-Enabled Local Group (es. Administrators)
4756 → aggiunto a gruppo Security-Enabled Universal Group
```

**Critico:** un utente aggiunto al gruppo `Administrators` o `Domain Admins` è un alert di alta priorità.

---

## Event ID fondamentali: Processi e Esecuzione

### 4688 — Nuovo processo creato

Ogni volta che viene avviato un processo. Richiede di abilitare "Process Creation Auditing" nelle policy.

**Cosa cercare:**
- `powershell.exe` con argomenti offuscati o `-EncodedCommand`
- `cmd.exe` lanciato da processi insoliti (es. `iexplore.exe`, `winword.exe`)
- Tool di hacking noti: `mimikatz.exe`, `psexec.exe`, `nc.exe`
- Esecuzione da cartelle insolite: `%TEMP%`, `%AppData%`, `C:\Users\Public\`

### 4698 — Task schedulato creato

Meccanismo comune di **persistence**: l'attaccante crea un task che ri-esegue il malware periodicamente.

### 7045 — Nuovo servizio installato

Un nuovo servizio Windows è stato installato. Come i task schedulati, è un meccanismo di persistence frequente.

---

## Event ID: Policy e Sistema

### 4719 — Audit policy cambiata

Qualcuno ha modificato le policy di auditing. Un attaccante potrebbe disabilitare il logging per nascondere le proprie tracce.

### 1102 — Log di Security cancellato

**Critico.** Il Security Event Log è stato svuotato. Quasi sempre indica un attaccante che cerca di coprire le proprie tracce.

### 4657 — Registro di sistema modificato

Modifica a chiavi del registro. Molti malware usano il registro per la persistence (`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run`).

---

## Sysmon: Event ID avanzati

**Sysmon** di Sysinternals arricchisce enormemente la visibilità. Se è installato, aggiungi questi agli ID da monitorare:

| Event ID Sysmon | Descrizione |
|---|---|
| 1 | Process creation (con hash e command line completa) |
| 3 | Network connection (processo → IP:porta) |
| 7 | Image loaded (DLL caricata) |
| 8 | CreateRemoteThread (injection) |
| 11 | File created |
| 12/13 | Registry object created/value set |
| 22 | DNS query |

---

## Query PowerShell utili

```powershell
# Ultimi 50 logon falliti
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 50 |
  Select-Object TimeCreated, Message | Format-List

# Tutti i nuovi servizi nelle ultime 24h
Get-WinEvent -FilterHashtable @{LogName='System'; Id=7045;
  StartTime=(Get-Date).AddHours(-24)} | Format-List

# Log security cancellato
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=1102}

# Utenti aggiunti al gruppo Administrators
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4732} |
  Where-Object { $_.Message -match 'Administrators' }
```

---

## Conclusione

Conoscere gli Event ID Windows è la base per qualsiasi analista SOC in ambienti Microsoft. Non devi memorizzarli tutti — ma i principali (4624, 4625, 4688, 4698, 1102) devono essere automatici.

Il passo successivo è raccoglierli tutti in un **SIEM** e costruire correlation rule che generino alert automatici quando si verificano pattern sospetti. Questo è l'argomento del prossimo articolo.
