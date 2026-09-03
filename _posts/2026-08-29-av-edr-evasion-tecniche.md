---
layout: post
title: "AV/EDR Evasion: tecniche di offuscamento per il red team"
date: 2026-08-29
cat: red
tags: [EDR evasion, AV bypass, red team, offuscamento, AMSI]
excerpt: "Un antivirus moderno riconosce le firme note. Un EDR osserva il comportamento in tempo reale tramite hook a livello di kernel e userland. Aggirarli non significa 'nascondersi', significa capire esattamente dove guardano, ed evitare di apparire lì."
---

Un red team engagement realistico non può limitarsi a payload "puliti" testati in laboratorio: deve confrontarsi con antivirus e EDR reali, esattamente come farebbe un attaccante determinato. Capire come questi strumenti rilevano è il prerequisito per testare se le difese di un'organizzazione reggono davvero, oltre la demo.

## Come rileva un EDR moderno

| Livello | Meccanismo |
|---|---|
| **Firma statica** | hash, stringhe, pattern nel binario, il livello più facile da aggirare |
| **AMSI** (Antimalware Scan Interface) | intercetta script PowerShell/VBA/JS prima dell'esecuzione, indipendentemente da come sono arrivati |
| **User-mode hooking** | l'EDR inietta una DLL nel processo e intercetta chiamate a funzioni sensibili (`NtCreateFile`, `NtAllocateVirtualMemory`) prima che raggiungano il kernel |
| **ETW (Event Tracing for Windows)** | telemetria a livello kernel su creazione processi, accesso a memoria, chiamate di