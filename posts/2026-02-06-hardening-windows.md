---
layout: post
title: "Hardening Windows: difendere il sistema operativo più attaccato al mondo"
description: "Guida pratica all'hardening di Windows: Group Policy, PowerShell, Windows Defender, audit log, disabilitazione servizi inutili e checklist CIS."
date: 2026-02-06
categoria: Blue Team
tags: [hardening, windows, powershell, defender, group-policy, CIS]
---

# Hardening Windows: difendere il sistema operativo più attaccato al mondo

Windows è il sistema operativo più diffuso nei contesti aziendali. È anche quello con la superficie di attacco più ampia, la storia di vulnerabilità più lunga e il numero maggiore di strumenti offensivi costruiti appositamente per attaccarlo.

La buona notizia è che Windows, nelle versioni moderne, ha strumenti di difesa potentissimi — spesso non configurati correttamente o direttamente disabilitati per "comodità". L'hardening di Windows non significa comprare niente: significa **configurare bene ciò che hai già**.

---

## 1. Aggiornamenti Windows

Prima ancora di toccare qualsiasi configurazione:

```powershell
# Forza la ricerca e installazione degli aggiornamenti
Install-Module PSWindowsUpdate -Force
Import-Module PSWindowsUpdate
Get-WindowsUpdate -Install -AcceptAll -AutoReboot
```

Abilita Windows Update per gli aggiornamenti automatici tramite Group Policy:
`Computer Configuration → Administrative Templates → Windows Components → Windows Update`

---

## 2. Account e privilegi

### Rinomina e disabilita l'account Administrator locale

```powershell
# Rinomina l'account Administrator (rende più difficile gli attacchi a dizionario)
Rename-LocalUser -Name "Administrator" -NewName "SysAdmin_$(Get-Random -Max 9999)"

# Disabilita l'account Guest
Disable-LocalUser -Name "Guest"

# Verifica tutti gli account locali
Get-LocalUser | Select-Object Name, Enabled, LastLogon
```

### Politica delle password

```powershell
# Configura i requisiti minimi delle password
net accounts /minpwlen:14 /maxpwage:90 /minpwage:1 /uniquepw:10 /lockoutthreshold:5 /lockoutduration:30 /lockoutwindow:30
```

### Principio del minimo privilegio

```powershell
# Controlla chi è nel gruppo Administrators locale
Get-LocalGroupMember -Group "Administrators"

# Rimuovi account non necessari dal gruppo
Remove-LocalGroupMember -Group "Administrators" -Member "utente_non_admin"
```

---

## 3. Windows Defender e sicurezza antimalware

Windows Defender, nelle versioni recenti di Windows 10/11 e Server, è un prodotto serio. Il problema è che spesso viene configurato al minimo.

```powershell
# Abilita la protezione in tempo reale
Set-MpPreference -DisableRealtimeMonitoring $false

# Abilita la protezione cloud
Set-MpPreference -MAPSReporting Advanced
Set-MpPreference -SubmitSamplesConsent SendAllSamples

# Abilita Attack Surface Reduction (ASR) - fondamentale
# Blocca eseguibili da email e webmail
Add-MpPreference -AttackSurfaceReductionRules_Ids BE9BA2D9-53EA-4CDC-84E5-9B1EEEE46550 -AttackSurfaceReductionRules_Actions Enabled

# Blocca esecuzione di script offuscati
Add-MpPreference -AttackSurfaceReductionRules_Ids 5BEB7EFE-FD9A-4556-801D-275E5FFC04CC -AttackSurfaceReductionRules_Actions Enabled

# Blocca process injection da Office
Add-MpPreference -AttackSurfaceReductionRules_Ids 75668C1F-73B5-4CF0-BB93-3ECF5CB7CC84 -AttackSurfaceReductionRules_Actions Enabled

# Abilita Controlled Folder Access (protezione ransomware)
Set-MpPreference -EnableControlledFolderAccess Enabled

# Forza aggiornamento definizioni
Update-MpSignature

# Verifica stato completo
Get-MpComputerStatus | Select-Object AMRunningMode, RealTimeProtectionEnabled, IoavProtectionEnabled
```

---

## 4. Hardening PowerShell

PowerShell è uno strumento fantastico per l'amministrazione, ma è anche uno degli strumenti più usati negli attacchi (LOLBins). Non disabilitarlo — configuralo bene.

```powershell
# Imposta execution policy restrittiva
Set-ExecutionPolicy AllSigned -Scope LocalMachine -Force

# Abilita il logging di PowerShell (essenziale per il Blue Team)
# Tramite Group Policy: 
# Computer Configuration → Administrative Templates → Windows Components → Windows PowerShell

# Oppure via registro:
$psLogPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell"

# Script Block Logging — logga il contenuto di ogni script eseguito
New-Item -Path "$psLogPath\ScriptBlockLogging" -Force | Out-Null
Set-ItemProperty -Path "$psLogPath\ScriptBlockLogging" -Name "EnableScriptBlockLogging" -Value 1

# Module Logging
New-Item -Path "$psLogPath\ModuleLogging" -Force | Out-Null
Set-ItemProperty -Path "$psLogPath\ModuleLogging" -Name "EnableModuleLogging" -Value 1

# Transcription — salva trascrizioni delle sessioni PS
New-Item -Path "$psLogPath\Transcription" -Force | Out-Null
Set-ItemProperty -Path "$psLogPath\Transcription" -Name "EnableTranscripting" -Value 1
Set-ItemProperty -Path "$psLogPath\Transcription" -Name "OutputDirectory" -Value "C:\PSLogs"
```

---

## 5. Audit e Event Logging

I log di Windows sono la tua finestra su tutto ciò che accade. Di default, non loggano abbastanza.

```powershell
# Abilita l'audit avanzato (Advanced Audit Policy)
# Processo di creazione (fondamentale per il threat hunting)
auditpol /set /subcategory:"Process Creation" /success:enable /failure:enable

# Logon/Logoff
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Logoff" /success:enable /failure:enable

# Accesso a oggetti (file, cartelle)
auditpol /set /subcategory:"File System" /success:enable /failure:enable

# Cambio di policy
auditpol /set /subcategory:"Audit Policy Change" /success:enable /failure:enable

# Gestione account
auditpol /set /subcategory:"User Account Management" /success:enable /failure:enable

# Usa di privilegi speciali
auditpol /set /subcategory:"Special Logon" /success:enable

# Verifica le impostazioni
auditpol /get /category:*
```

**Event ID fondamentali da monitorare:**

```
4624 → Logon riuscito
4625 → Logon fallito (brute force!)
4648 → Logon con credenziali esplicite
4688 → Nuovo processo creato
4698 → Task schedulato creato
4720 → Account utente creato
4732 → Utente aggiunto al gruppo Administrators
7045 → Nuovo servizio installato
```

---

## 6. Disabilita servizi e protocolli inutili

```powershell
# Disabilita SMBv1 (responsabile di WannaCry, EternalBlue, ecc.)
Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force
Disable-WindowsOptionalFeature -Online -FeatureName smb1protocol -NoRestart

# Disabilita LLMNR (Link-Local Multicast Name Resolution) — vettore di relay attack
# Via Group Policy: Computer Configuration → Administrative Templates → Network → DNS Client
# "Turn off multicast name resolution" → Enabled

# Disabilita NetBIOS over TCP/IP
$adapters = Get-WmiObject Win32_NetworkAdapterConfiguration
foreach ($adapter in $adapters) {
    $adapter.SetTcpipNetbios(2)  # 2 = Disabilitato
}

# Disabilita servizi non necessari
$servizi_da_disabilitare = @(
    "Fax",           # Fax
    "XblGameSave",   # Xbox Game Save
    "XboxNetApiSvc", # Xbox Network
    "RemoteRegistry" # Registry remoto — SEMPRE disabilitarlo
)

foreach ($svc in $servizi_da_disabilitare) {
    if (Get-Service -Name $svc -ErrorAction SilentlyContinue) {
        Stop-Service -Name $svc -Force
        Set-Service -Name $svc -StartupType Disabled
        Write-Host "[+] Disabilitato: $svc"
    }
}
```

---

## 7. Windows Firewall

```powershell
# Verifica stato
Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction

# Abilita il firewall su tutti i profili con policy deny-default in ingresso
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
Set-NetFirewallProfile -Profile Domain,Public,Private -DefaultInboundAction Block
Set-NetFirewallProfile -Profile Domain,Public,Private -DefaultOutboundAction Allow

# Aggiungi regola per SSH se necessario
New-NetFirewallRule -DisplayName "SSH" -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow

# Blocca protocolli pericolosi in entrata
New-NetFirewallRule -DisplayName "Block Telnet" -Direction Inbound -Protocol TCP -LocalPort 23 -Action Block
New-NetFirewallRule -DisplayName "Block RDP from internet" -Direction Inbound -Protocol TCP -LocalPort 3389 -RemoteAddress LocalSubnet -Action Allow
```

---

## 8. Credential Guard e Device Guard

Su Windows 10/11 Enterprise e Windows Server 2016+:

```powershell
# Abilita Credential Guard (protegge gli hash NTLM e ticket Kerberos in memoria)
# Richiede UEFI e Secure Boot

$regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard"
Set-ItemProperty -Path $regPath -Name "EnableVirtualizationBasedSecurity" -Value 1
Set-ItemProperty -Path $regPath -Name "RequirePlatformSecurityFeatures" -Value 1

$cgPath = "HKLM:\SYSTEM\CurrentControlSet\Control\Lsa"
Set-ItemProperty -Path $cgPath -Name "LsaCfgFlags" -Value 1
```

---

## Checklist CIS Windows semplificata

Il CIS (Center for Internet Security) pubblica benchmark dettagliati per ogni versione di Windows. Puoi scaricarli gratuitamente. Gli elementi più critici:

```
✅ Account Administrator rinominato e disabilitato
✅ Guest disabilitato
✅ Password policy configurata
✅ Windows Update attivo e aggiornato
✅ Windows Defender con ASR abilitato
✅ PowerShell logging abilitato
✅ Script Block Logging attivo
✅ SMBv1 disabilitato
✅ NetBIOS disabilitato
✅ LLMNR disabilitato
✅ RemoteRegistry disabilitato
✅ Firewall attivo su tutti i profili
✅ Audit policy avanzata configurata
✅ Credential Guard abilitato (se supportato)
```

---

## Conclusione

L'hardening di Windows sembra intimidatorio, ma la maggior parte di queste configurazioni si applica in pochi minuti con PowerShell o Group Policy. Molte di esse prevengono le tecniche di attacco più comuni — pass-the-hash, lateral movement, credential dumping — semplicemente configurando correttamente ciò che Windows già offre.

Uno strumento utile per fare un check veloce dello stato di hardening è **Microsoft Security Compliance Toolkit**, gratuito e scaricabile direttamente da Microsoft. 🪟
