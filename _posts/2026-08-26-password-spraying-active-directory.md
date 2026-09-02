---
layout: post
title: "Password Spraying: l'attacco silenzioso contro Active Directory"
date: 2026-08-26
cat: red
tags: [password spraying, Active Directory, brute force, red team, lockout policy]
excerpt: "Invece di provare mille password su un account, il password spraying prova una manciata di password ovvie su migliaia di account — restando sotto la soglia di lockout e sotto il radar di chi guarda i log nel modo sbagliato."
---

Il brute force classico (molte password contro un account) viene bloccato in fretta dalla policy di lockout. Il **password spraying** ribalta l'approccio: poche password comuni, testate contro **molti** account — restando sotto la soglia di tentativi falliti che fa scattare il blocco, e sfruttando il fatto che, su una rete di migliaia di utenti, c'è quasi sempre qualcuno con una password debole o prevedibile.

## Perché funziona

Le policy aziendali impongono complessità (maiuscole, numeri, simboli) ma raramente impediscono i pattern stagionali:

```
Estate2026!
Autunno2026!
Aziendaxyz123!
Password1!
```

Su una popolazione di 5.000 utenti, statisticamente **decine** avranno impostato una variante di questi pattern — specialmente subito dopo un reset forzato trimestrale.

## Enumerazione degli utenti — il prerequisito

```bash
# Kerbrute — enumera username validi senza generare lockout (pre-auth failure ≠ tentativo di login)
kerbrute userenum -d domain.local --dc 10.10.10.1 users.txt

# LDAP anonimo, se consentito
ldapsearch -x -H ldap://10.10.10.1 -b "dc=domain,dc=local" "(objectClass=user)" sAMAccountName
```

## Eseguire lo spray

```bash
# Kerbrute — spray su Kerberos pre-auth, molto silenzioso
kerbrute passwordspray -d domain.local --dc 10.10.10.1 users.txt 'Autunno2026!'

# CrackMapExec/NetExec — spray via SMB
netexec smb 10.10.10.0/24 -u users.txt -p 'Autunno2026!' --continue-on-success
```

> **Regola d'oro**: un solo tentativo per utente ogni volta, con un intervallo (idealmente rispettando la finestra di reset del contatore di lockout, spesso 30 minuti) prima del giro successivo. Uno script che spara tutte le password su tutti gli utenti in sequenza stretta è quello che fa scattare i lockout di massa — e allerta immediatamente il SOC.

## Perché Kerberos pre-auth è preferibile a SMB/NTLM

Un tentativo di pre-autenticazione Kerberos fallito (Event ID 4771 con codice `0x18`, password errata) è meno rumoroso e meno monitorato, in molte configurazioni, rispetto ai fallimenti NTLM su SMB (Event ID 4625), che spesso alimentano regole SIEM già consolidate.

## Il rischio per l'attaccante: il lockout di massa

Sbagliare il calcolo della threshold policy (es. 5 tentativi in 30 minuti) e spruzzare troppe password nella stessa finestra blocca contemporaneamente centinaia di account — un evento estremamente visibile che compromette l'intera operazione, altro che silenzioso.

## Come si difende un blue team

- **Smart lockout / soglie basate sul rischio** (es. Microsoft Entra Smart Lockout) invece di soglie fisse facilmente aggirabili
- **MFA ovunque** — anche se la password viene indovinata, senza il secondo fattore l'accesso resta bloccato
- **Monitoraggio dei fallimenti distribuiti**: un singolo utente con 3 fallimenti non allarma nessuno; 200 utenti con 1 fallimento ciascuno nello stesso minuto è uno spray, e va correlato come tale nel SIEM
- **Banned password list** (Azure AD Password Protection o equivalenti) che blocca pattern stagionali/aziendali prevedibili in fase di creazione password
- **Alert su Event ID 4771/4625 aggregati per intervallo temporale e distribuzione tra account**, non per singolo account

## Conclusione

Il password spraying dimostra un principio più generale della sicurezza offensiva: spesso non serve rompere la crittografia o trovare uno zero-day, basta sfruttare la statistica del comportamento umano su larga scala — e restare sotto le soglie che qualcun altro ha deciso, mesi prima, di considerare "normali".
