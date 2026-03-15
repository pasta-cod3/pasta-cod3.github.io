# CrackArmor: 9 vulnerabilità nel kernel Linux colpiscono 12,6 milioni di server

## Il fatto

Il 12-13 marzo 2026, il Qualys Threat Research Unit (TRU) ha pubblicato una delle advisory di sicurezza più significative degli ultimi anni per il mondo Linux: **CrackArmor**, una serie di nove vulnerabilità nel modulo AppArmor del kernel Linux che permettono a utenti senza privilegi di scalare i propri permessi fino a root, aggirare le protezioni dei container, e causare crash del kernel.

La cosa più inquietante: i bug esistono dal 2017 — dalla versione 4.11 del kernel — e sono rimasti nascosti per quasi **nove anni** in produzione.

---

## Cos'è AppArmor

AppArmor è un **Linux Security Module (LSM)** che implementa il **Mandatory Access Control (MAC)**: un sistema che limita quello che ogni applicazione può fare sul sistema, indipendentemente dai permessi dell'utente che la esegue. È il meccanismo di sicurezza di default su **Ubuntu, Debian e SUSE** — tre delle distribuzioni Linux più diffuse al mondo.

AppArmor è installato e attivo per default su:
- Tutti i sistemi Ubuntu dalla versione 7.10 (2007)
- Debian dalla versione 10 (Buster)
- SUSE Enterprise Linux
- La maggior parte degli ambienti Kubernetes cloud
- Infrastrutture IoT e edge computing

Qualys stima che **12,6 milioni di istanze Linux enterprise** nel mondo abbiano AppArmor abilitato per default — tutte potenzialmente vulnerabili fino alla patch.

---

## La classe di vulnerabilità: Confused Deputy

Il cuore di CrackArmor è un **confused deputy attack** — una classe di vulnerabilità dove un processo non privilegiato convince un processo privilegiato a fare qualcosa per suo conto.

AppArmor espone file di controllo speciali sotto `/sys/kernel/security/apparmor/`:

```
/sys/kernel/security/apparmor/.load
/sys/kernel/security/apparmor/.replace
/sys/kernel/security/apparmor/.remove
```

Questi file permettono di caricare, sostituire e rimuovere i profili di sicurezza AppArmor. Il problema: **le permissions vengono verificate solo al momento della scrittura dei dati, non all'apertura del file descriptor**.

Un utente non privilegiato può aprire questi file per la scrittura. Se poi riesce a convincere un'applicazione privilegiata (come `sudo` o `su`) a scrivere il formato corretto in quel file descriptor già aperto, l'operazione viene eseguita con i privilegi dell'applicazione privilegiata — aggirando completamente le restrizioni.

```
Attaccante (no root) → apre .load per scrittura
→ convince sudo a scrivere nel FD già aperto
→ sudo ha i privilegi necessari
→ profilo AppArmor caricato/modificato con privilegi root
→ attaccante ha ora root
```

---

## Le nove vulnerabilità in dettaglio

Le nove flaw identificate da Qualys coprono diverse categorie di impatto:

**Privilege Escalation a root:**
- Manipolazione dei profili via pseudo-file + cooperazione di `sudo` o `su`
- Bypass delle restrizioni user-namespace di Ubuntu
- Esecuzione di codice arbitrario nel kernel

**Denial of Service:**
- Stack exhaustion tramite profili AppArmor appositamente costruiti
- Kernel panic causabile da utenti non privilegiati

**Information Disclosure:**
- Out-of-bounds read che bypassa KASLR (Kernel Address Space Layout Randomization)
- KASLR è una delle difese fondamentali contro gli exploit del kernel — conoscerne il layout rende gli attacchi successivi molto più facili

**Container Isolation Bypass:**
- In ambienti con container (Docker, Kubernetes) con immagini potenzialmente malevole, lo sfruttamento non richiede nemmeno l'applicazione cooperante privilegiata

---

## Il problema di sudo e su

Qualys ha identificato anche un problema separato in `sudo` che può essere concatenato con le vulnerabilità AppArmor:

Il feature di email notification di sudo, quando abilitato, può essere triggerato da un utente non privilegiato e usato come vettore per innescare il confused deputy. Questo crea una catena di exploit: AppArmor vulnerability + sudo notification feature = privilege escalation completa anche senza interazione di altri processi privilegiati.

`sudo-rs` — la riscrittura in Rust di sudo disponibile su Ubuntu 25.10+ — **non è affetto** perché non implementa la funzionalità di email notification per scelta di design.

---

## La disclosure: un processo complicato

Qualys non ha nascosto la frustrazione nel processo di disclosure:

> "Crediamo che la responsible disclosure richieda pazienza e fiducia. Tuttavia, il processo di coordinamento per queste vulnerabilità si è esteso significativamente oltre le tempistiche tipiche a causa di molteplici round di revisione delle patch e ritardi comunicativi con i maintainer upstream."

Un processo di disclosure che dura a lungo è un problema reale: più tempo passa, più aumenta il rischio che qualcun altro scopra indipendentemente le stesse vulnerabilità e le sfrutti silenziosamente.

---

## Nessun CVE assegnato (ancora)

Al momento della pubblicazione, nessun CVE identifier è stato assegnato alle vulnerabilità CrackArmor. La ragione è procedurale: per flaw nel kernel Linux upstream, solo il kernel security team ha l'autorità di assegnare CVE, e tipicamente lo fa una o due settimane dopo che la patch è stabile in una release.

Questo crea un paradosso: l'assenza di un numero CVE può far sembrare la vulnerabilità meno urgente nei sistemi di vulnerability management aziendali, anche quando la gravità è altissima.

---

## Distribuzioni affette

| Distribuzione | Affetta | Note |
|---|---|---|
| Ubuntu (tutte le versioni con AppArmor) | Sì | Patch disponibile |
| Debian 10+ | Sì | Patch rilasciata il 12 marzo |
| SUSE Enterprise Linux | Sì | In corso |
| Red Hat Enterprise Linux | No | Usa SELinux, non AppArmor |
| Amazon Linux | No | Usa SELinux |
| Fedora | No | Usa SELinux |

---

## Come mitigarsi

Qualys e Canonical raccomandano un approccio a doppio livello:

**1. Patch del kernel Linux** — la soluzione definitiva. Aggiornare il kernel all'ultima versione disponibile dal vendor.

**2. Mitigazioni userspace** — Canonical ha rilasciato patch per `su` (nel pacchetto `util-linux`) e `sudo` che rimuovono i principali vettori di exploitation senza dover aggiornare il kernel.

```bash
# Ubuntu — aggiornamento completo
sudo apt update && sudo apt upgrade

# Verifica versione kernel post-patch
uname -r

# Monitoraggio per modifiche anomale ai profili AppArmor
auditctl -w /sys/kernel/security/apparmor/ -p wa -k apparmor_changes
```

---

## Il quadro più ampio: implicazioni per il cloud

Quello che rende CrackArmor particolarmente rilevante nel 2026 è la pervasività di Linux in cloud e container:

- La stragrande maggioranza delle istanze cloud (AWS, Azure, GCP) gira su Linux
- Kubernetes usa AppArmor come meccanismo di security per i container
- In ambienti multi-tenant, un singolo utente non privilegiato con accesso a un container potrebbe scalare fino a root sull'host

CISA e il DHS americano hanno emesso bullettin urgenti mettendo in allerta i settori energia, sanità, acqua e difesa.

---

## Conclusione

Nove bug in un modulo di sicurezza fondamentale, presenti da nove anni, che colpiscono 12,6 milioni di server enterprise. CrackArmor è un promemoria che anche i meccanismi progettati per difendere i sistemi possono diventare vettori di attacco. Il patching immediato è non negoziabile.
