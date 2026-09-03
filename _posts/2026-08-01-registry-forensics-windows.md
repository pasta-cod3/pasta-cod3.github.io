---
layout: post
title: "Registry Forensics: cosa nasconde il Registro di Windows"
date: 2026-08-01
cat: blue
tags: [DFIR, registry forensics, Windows, NTUSER.DAT, SAM, Amcache, ShimCache]
excerpt: "Il Registro di Windows non è solo un posto dove vivono le impostazioni di sistema. È un diario che registra quali programmi sono stati eseguiti, quali dispositivi USB sono stati collegati e quali cartelle sono state aperte, spesso anche dopo che l'utente ha provato a cancellare le tracce."
---

Un sospettato nega di aver mai collegato quella chiavetta USB al proprio portatile aziendale. Il disco non mostra file sospetti, i log degli antivirus sono puliti. Poi qualcuno controlla la chiave `USBSTOR` del Registro, e lì c'è tutto: produttore, numero di serie, prima e ultima connessione. Il Registro di Windows non dimentica quasi mai, anche quando l'utente ha fatto di tutto per farlo sembrare così.

Questo articolo copre le chiavi del Registro più utili in un'indagine forense, dove si trovano fisicamente sul disco e cosa raccontano davvero.

## Cos'è, concretamente, il Registro

Il Registro non è un unico file: è un insieme di file binari chiamati **hive**, ognuno caricato in una parte diversa dell'albero `HKEY_*` che si vede con `regedit`. I hive più rilevanti per un'indagine vivono in due posti:

```
C:\Windows\System32\config\   → SYSTEM, SOFTWARE, SAM, SECURITY, DEFAULT
C:\Users\<utente>\NTUSER.DAT  → impostazioni e attività specifiche di QUEL profilo utente
C:\Users\<utente>\AppData\Local\Microsoft\Windows\UsrClass.dat → ShellBags e altro
```

La distinzione conta: `SYSTEM` e `SOFTWARE` raccontano la macchina, `NTUSER.DAT` racconta la persona che ha usato quel profilo. Un sistema con cinque utenti ha un `SYSTEM` e cinque `NTUSER.DAT` diversi.

## Dispositivi USB: la chiave che smentisce le bugie

```
HKLM\SYSTEM\CurrentControlSet\Enum\USBSTOR
```

Ogni dispositivo di archiviazione USB mai collegato a quel sistema lascia una sottochiave qui, con produttore, modello e numero di serie univoco del dispositivo. Incrociando questo con `SYSTEM\CurrentControlSet\Enum\USB` e con i timestamp della chiave stessa (`LastWrite time`), si ricostruisce quando un dispositivo è stato collegato per la prima e l'ultima volta, anche se l'utente lo ha rimosso fisicamente da mesi.

## Amcache e ShimCache: cosa è stato eseguito

Due artefatti spesso confusi tra loro, ma con scopi diversi:

**Amcache** (`C:\Windows\AppCompat\Programs\Amcache.hve`) registra i metadati di ogni eseguibile che è stato lanciato almeno una volta: percorso completo, hash SHA-1, dimensione del file e la prima volta che è stato eseguito. È probabilmente il singolo artefatto più prezioso per dimostrare che un malware specifico è girato su quella macchina, perché include l'hash: basta confrontarlo con VirusTotal per avere una conferma quasi immediata.

**ShimCache** (dentro l'hive `SYSTEM`, chiave `AppCompatCache`) tiene traccia di quali eseguibili sono stati visti dal sistema per verificarne la compatibilità, inclusi programmi che potrebbero non essere mai stati eseguiti con successo. È meno affidabile sui timestamp ma copre anche tentativi falliti, il che lo rende utile per capire cosa un attaccante ha *provato* a lanciare.

```
HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\AppCompatCache
```

## ShellBags: le cartelle che l'utente ha aperto

Windows Explorer ricorda come hai lasciato ogni cartella (dimensione della finestra, tipo di visualizzazione, ordinamento) e salva questa informazione nel Registro, in `UsrClass.dat`, sotto forma di **ShellBags**. L'effetto collaterale è che questa struttura registra il percorso completo di cartelle che l'utente ha navigato, comprese cartelle su unità di rete o USB rimosse da tempo e non più presenti sul sistema.

Per un analista, questo significa poter dimostrare che un utente ha navigato una cartella specifica (ad esempio su un condivisione di rete contenente dati riservati) anche se quella cartella non esiste più o l'unità è stata scollegata.

## RunMRU e programmi eseguiti da Esegui

```
HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU
```

Ogni comando digitato nella finestra "Esegui" (`Win+R`) viene salvato qui in ordine, con una lettera come chiave (`a`, `b`, `c`...) che indica la posizione nella lista MRU (Most Recently Used). È uno degli artefatti preferiti per dimostrare l'uso intenzionale di strumenti come `powershell`, `cmd` o percorsi UNC verso condivisioni remote, perché richiede un'azione deliberata dell'utente, diversa da un doppio clic accidentale.

## Persistenza: dove si nasconde chi vuole restare

```
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
HKCU\Software\Microsoft\Windows\CurrentVersion\Run
HKLM\SYSTEM\CurrentControlSet\Services
```

Le chiavi `Run` e `RunOnce` (sia a livello di macchina `HKLM` sia di singolo utente `HKCU`) sono il primo posto dove cercare persistenza: qualsiasi voce qui viene eseguita automaticamente al login o all'avvio. La chiave `Services` è più profonda e spesso usata da malware più sofisticati che si registrano come servizio di sistema per sopravvivere ai riavvii con privilegi elevati.

## Estrarre gli hive da un'immagine forense

Su un sistema spento (analisi post mortem), gli hive si estraggono direttamente dall'immagine disco con uno strumento come `RegRipper` o `Registry Explorer`, senza mai montare o avviare il sistema originale:

```bash
# RegRipper su un hive SYSTEM estratto dall'immagine
rip.pl -r SYSTEM -p usbstor
rip.pl -r NTUSER.DAT -p userassist
```

`RegRipper` applica plugin specifici (`usbstor`, `userassist`, `runmru`...) che sanno già dove guardare e come interpretare i timestamp binari del Registro, evitando di doverli decodificare a mano.

## Checklist essenziale

```
✅ SYSTEM\...\USBSTOR                       → dispositivi USB collegati
✅ Amcache.hve                              → eseguibili lanciati, con hash SHA-1
✅ SYSTEM\...\AppCompatCache (ShimCache)    → eseguibili visti, anche se falliti
✅ UsrClass.dat (ShellBags)                 → cartelle navigate, anche rimosse
✅ NTUSER.DAT\...\RunMRU                    → comandi digitati in Esegui
✅ ...\CurrentVersion\Run e Services        → meccanismi di persistenza
```

## Conclusione

Il Registro è denso, poco documentato ufficialmente nei dettagli forensi e pieno di formati binari proprietari, ma è anche uno degli artefatti più difficili da ripulire completamente per un attaccante, perché tocca decine di chiavi diverse sparse in più hive. Conoscere anche solo questa manciata di percorsi trasforma un'indagine da "non abbiamo prove" a "abbiamo l'hash, l'orario e il dispositivo".

Nel prossimo articolo si resta su Windows ma si cambia fonte: come si ricostruisce l'attività di un utente analizzando cronologia, cache e download del browser.
