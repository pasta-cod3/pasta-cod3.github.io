# Cos'è il Penetration Testing

## Introduzione

Se stai muovendo i primi passi nel mondo della cybersecurity offensiva, la prima domanda che ti sei fatto è probabilmente questa: *cos'è esattamente un penetration test?*

In breve: un **penetration test** (o **pentest**) è un attacco informatico simulato, condotto con il permesso del proprietario del sistema, con l'obiettivo di trovare vulnerabilità prima che lo faccia qualcun altro di malintenzionato.

Non è hacking illegale. Non è un audit di conformità. È un tentativo reale di bucare un sistema — in modo controllato e documentato.

---

## Perché esiste il Penetration Testing

Le aziende costruiscono sistemi informatici complessi: applicazioni web, reti interne, server, endpoint. Ogni componente può avere vulnerabilità — configurazioni errate, software non aggiornato, logiche applicative difettose, credenziali deboli.

Un **vulnerability scanner** automatico trova molte di queste cose, ma ha un limite: segue regole predefinite. Un essere umano che pensa come un attaccante riesce a trovare vulnerabilità logiche, concatenare più debolezze minori in un attacco critico, capire il contesto aziendale.

Il penetration tester porta esattamente questo: la **mentalità dell'attaccante**, applicata in modo etico e controllato.

---

## Tipi di Penetration Test

Esistono diverse classificazioni. La più comune riguarda il **livello di informazioni** fornite al tester prima dell'inizio:

### Black Box
Il tester non sa nulla del target. Riceve solo un nome di dominio o un indirizzo IP. Simula al meglio un attaccante esterno che non ha informazioni privilegiate.

**Pro:** scenario realistico  
**Contro:** richiede più tempo, potrebbe non coprire aree interne critiche

### White Box
Il tester riceve documentazione completa: architettura di rete, codice sorgente, credenziali, schema del database. Massima copertura possibile.

**Pro:** molto approfondito, efficiente  
**Contro:** meno realistico come simulazione di attacco esterno

### Grey Box
Via di mezzo. Il tester riceve alcune informazioni (es. credenziali di un utente normale, schema della rete) ma non tutto. È il tipo più comune nei pentest aziendali.

---

## Le fasi di un Penetration Test

Ogni pentest professionale segue una metodologia strutturata. Le fasi principali sono:

| Fase | Descrizione |
|---|---|
| **1. Pianificazione** | Definizione dello scope, regole di ingaggio, tempistiche |
| **2. Ricognizione** | Raccolta informazioni sul target (OSINT, scansioni) |
| **3. Scansione** | Identificazione di porte, servizi, vulnerabilità |
| **4. Exploitation** | Tentativo di sfruttare le vulnerabilità trovate |
| **5. Post-exploitation** | Cosa si può fare dopo aver ottenuto accesso |
| **6. Reporting** | Documentazione di tutto: vulnerabilità, impatto, remediation |

Vedremo ogni fase in dettaglio nei prossimi articoli.

---

## Penetration Test vs Vulnerability Assessment

Spesso vengono confusi. La differenza è sostanziale:

- **Vulnerability Assessment:** *identifico* le vulnerabilità, le classifico per gravità, non le sfrutto
- **Penetration Test:** *sfrutto* attivamente le vulnerabilità per dimostrare il loro impatto reale

Un VA ti dice "questo sistema ha una porta aperta con un servizio vulnerabile".  
Un pentest ti dice "ho sfruttato quella porta, sono entrato nel server, ho letto il database clienti".

---

## Cosa serve per diventare un Penetration Tester

Non esiste un percorso unico, ma questi sono i pilastri fondamentali:

1. **Reti e protocolli** — TCP/IP, DNS, HTTP, Active Directory
2. **Sistemi operativi** — Linux (essenziale) e Windows (importante)
3. **Programmazione/scripting** — Python e Bash come minimo
4. **Strumenti offensivi** — Nmap, Metasploit, Burp Suite, etc.
5. **Metodologie** — OWASP, PTES, OSSTMM

Il percorso pratico più efficace è: **CTF** (Capture The Flag) → **TryHackMe** (per principianti) → **HackTheBox** (intermedio) → certificazioni come **eJPT**, poi **OSCP**.

---

## Conclusione

Il penetration testing è una disciplina tecnica, creativa e metodica allo stesso tempo. Non è sufficiente conoscere gli strumenti — bisogna capire come pensano gli attaccanti e come funzionano i sistemi nel profondo.

Nei prossimi articoli esploreremo ogni fase del processo, partendo dalla ricognizione e arrivando fino al reporting. Inizia a familiarizzare con Linux se non l'hai già fatto — sarà il tuo ambiente principale.
