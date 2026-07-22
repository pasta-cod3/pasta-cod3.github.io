---
layout: post
title: "Incident Response: cosa fare quando le cose vanno male davvero"
description: "Il processo di incident response spiegato passo passo: le fasi PICERL, cosa fare nei primi minuti, come contenere senza distruggere le prove e cosa scrivere nel report."
date: 2026-02-09
categoria: Blue Team
tags: [incident-response, blue-team, forensics, playbook, nist, picerl]
---

C'è un momento, nella vita di ogni persona che lavora nella sicurezza, in cui l'allarme non è un falso positivo. È reale. Qualcuno è dentro. Ricordo ancora il vuoto allo stomaco la prima volta: quella sensazione di "e adesso cosa faccio?" mentre il cursore lampeggiava e mezza azienda aspettava una risposta da me. La verità è che in quel momento non devi *pensare* — devi *seguire un processo*. Ed è esattamente per questo che l'incident response esiste: per trasformare il panico in procedura.

## Perché serve un processo

Sotto stress, il cervello umano prende decisioni pessime. Sotto stress *e* con un attaccante attivo che potrebbe accorgersi di essere stato scoperto, prende decisioni ancora peggiori. Un processo di incident response ben definito ti dà tre cose:

- **Ordine** quando tutto sembra caos.
- **Ruoli chiari**, così nessuno calpesta il lavoro di un altro.
- **Ripetibilità**, così il prossimo incidente sia gestito meglio del precedente.

## Le sei fasi: PICERL

Il modello più usato (derivato dalle linee guida NIST e SANS) si riassume nell'acronimo **PICERL**:

1. **Preparation** — Preparazione
2. **Identification** — Identificazione
3. **Containment** — Contenimento
4. **Eradication** — Eradicazione
5. **Recovery** — Ripristino
6. **Lessons Learned** — Lezioni apprese

Vediamole una per una, con l'onestà di chi le ha vissute.

### 1. Preparation

Questa fase avviene **prima** che accada qualcosa, ed è la più trascurata. Preparazione significa avere: un piano scritto, una lista di contatti (chi chiami alle 3 di notte?), gli strumenti pronti, e — soprattutto — i **log giusti già attivi**. Non puoi indagare su ciò che non hai registrato.

Una checklist minima di preparazione:

```text
[ ] Playbook di IR documentato e accessibile offline
[ ] Contatti di emergenza (interni + esterni + legale)
[ ] Logging centralizzato attivo (min. 90 giorni di retention)
[ ] Immagini "golden" dei sistemi per il ripristino
[ ] Un canale di comunicazione fuori banda (non la mail aziendale!)
```

Quel dettaglio del canale fuori banda non è paranoia: se l'attaccante è nella tua mail, coordinarti via mail significa fargli leggere il tuo piano di difesa.

### 2. Identification

Qui confermi che l'incidente è reale e ne stabilisci la portata. Le domande da farsi:

- Cosa è successo esattamente?
- Quali sistemi sono coinvolti?
- Da quanto tempo?
- L'attaccante è *ancora* attivo?

Un errore classico è sottostimare la portata. Trovi un host compromesso e pensi "ok, ne ho uno". Poi indaghi e scopri che quell'host parlava con altri cinque. **Mappa la portata prima di agire.**

### 3. Containment

Il contenimento si divide in due momenti:

- **Contenimento a breve termine**: fermi l'emorragia subito (isoli l'host dalla rete, blocchi un IP, disabiliti un account).
- **Contenimento a lungo termine**: applichi soluzioni più solide mentre prepari l'eradicazione.

⚠️ **Attenzione al dettaglio che rovina le indagini**: non spegnere di botto la macchina compromessa. La RAM contiene prove preziosissime (processi in esecuzione, connessioni, chiavi in memoria) che spegnendo perderesti per sempre. Se puoi, **isola dalla rete ma lascia acceso**, e acquisisci la memoria:

```bash
# Isolare un host Linux dalla rete senza spegnerlo
# (blocca tutto il traffico tranne la tua sessione forense)
iptables -A INPUT -j DROP
iptables -A OUTPUT -j DROP

# Acquisire una copia della memoria per l'analisi successiva
# (con strumenti come AVML o LiME)
avml /mnt/forensics/memoria_$(hostname)_$(date +%F).lime
```

Su Windows lo stesso concetto si applica con strumenti come WinPmem o le funzioni di isolamento dell'EDR, che spesso permettono di "network-isolare" un endpoint con un click mantenendo solo il canale verso la console di gestione.

### 4. Eradication

Ora rimuovi la causa: elimini il malware, chiudi la vulnerabilità sfruttata, resetti le credenziali compromesse. Il punto critico qui è **la root cause**. Se rimuovi il malware ma non capisci *come* è entrato, lo ritroverai domani. Chiediti sempre: qual è stata la porta d'ingresso?

### 5. Recovery

Rimetti i sistemi in produzione, ma con giudizio. Non ripristinare tutto in una volta: reintroduci i sistemi gradualmente e **monitorali con attenzione doppia** nei giorni successivi. Un attaccante che aveva persistenza potrebbe ripresentarsi appena riaccendi.

### 6. Lessons Learned

Questa è la fase che separa i team che migliorano da quelli che ripetono gli stessi errori. Entro un paio di settimane dall'incidente, riunisci tutti e rispondi onestamente a:

- Cosa ha funzionato?
- Cosa no?
- Cosa dobbiamo cambiare?

E — regola d'oro — **niente colpevolizzazioni**. Se la cultura punisce chi ha cliccato sul link o chi ha configurato male il firewall, la prossima volta le persone nasconderanno gli incidenti invece di segnalarli. Ed è così che un problema piccolo diventa una catastrofe.

## Un mini-playbook di partenza

Se non hai ancora nulla di scritto, parti da questo scheletro e riempilo con la tua realtà:

```text
INCIDENTE RILEVATO
  │
  ├─ 1. Registra ora e ora di rilevamento
  ├─ 2. Assegna un incident lead (una persona, una sola)
  ├─ 3. Apri il canale fuori banda
  ├─ 4. Identifica portata → quali host/account/dati?
  ├─ 5. Contieni → isola, NON spegnere
  ├─ 6. Acquisisci prove (memoria, disco, log)
  ├─ 7. Eradica → root cause + rimozione
  ├─ 8. Ripristina gradualmente + monitora
  └─ 9. Post-mortem entro 14 giorni
```

## Documentare tutto, sempre

Durante l'incidente, ogni azione va registrata con timestamp: cosa hai fatto, quando, perché. Non è burocrazia — è ciò che ti salva quando, tre mesi dopo, il legale o un'autorità ti chiederà una ricostruzione dei fatti. Un semplice log testuale tenuto in tempo reale vale oro.

---

L'incident response non è mai piacevole, ma con un processo chiaro smette di essere terrore e diventa lavoro. La prima volta tremerai. La decima, seguirai le fasi con la calma di chi sa esattamente qual è il prossimo passo. E quella calma, credimi, è la cosa più preziosa che tu possa portare in una stanza dove tutti stanno andando nel panico.

Nel prossimo articolo mettiamo le mani su uno degli strumenti che userai proprio durante queste indagini: **Wireshark**, per leggere il traffico di rete e capire cosa si sono detti davvero quei pacchetti. 🚨
