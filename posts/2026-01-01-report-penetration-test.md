# Come scrivere un Report di Penetration Test

## Introduzione

Hai completato il pentest: hai trovato vulnerabilità, le hai sfruttate, sei arrivato dove volevi arrivare. Ora arriva la parte che molti principianti sottovalutano ma che è **il vero prodotto finale** del tuo lavoro: il **report**.

Un pentest senza un buon report vale poco. Il cliente non era presente durante il tuo lavoro. Tutto quello che ha trovato valore, tutto quello che devi raccomandare, tutto quello che deve essere corretto — vive nel documento che consegni.

---

## A chi è destinato il report

Un buon report di pentest ha **due audience** con esigenze diverse:

### Management / C-Level
Non tecnici. Vogliono capire:
- Quanto è grave la situazione?
- Quali sono i rischi per il business?
- Cosa dobbiamo fare?

→ **Executive Summary**: max 2 pagine, in linguaggio non tecnico, focalizzato su impatto e priorità.

### Team tecnico (sysadmin, sviluppatori, security team)
Vogliono capire:
- Esattamente cos'è vulnerabile?
- Come è stato sfruttato?
- Come lo correg­go?

→ **Sezione tecnica**: dettagliata, con prove, PoC, step di riproduzione e remediation.

---

## Struttura standard di un report

```
1. Copertina
2. Indice
3. Executive Summary
4. Metodologia
5. Findings (vulnerabilità)
6. Appendice / Prove tecniche
```

---

## Sezione 1: Copertina e metadati

```
Titolo: Penetration Test Report — [Nome Cliente]
Data: [Data consegna]
Versione: 1.0
Classificazione: Confidenziale
Preparato da: [Nome / Società]
Preparato per: [Nome Cliente]
```

---

## Sezione 2: Executive Summary

Scrivi questa sezione per un manager che ha 5 minuti. Deve rispondere a:

1. **Obiettivo**: cosa è stato testato e perché
2. **Scope**: cosa era incluso (e cosa no)
3. **Metodologia**: approccio usato (black/white/grey box)
4. **Risultati in sintesi**: quante vulnerabilità, di che gravità
5. **Impatto generale**: cosa rischia il business
6. **Top 3 priorità**: le cose più urgenti da fare

Esempio di paragrafo executive summary:

> Nel periodo dal 10 al 17 gennaio 2026, è stato condotto un penetration test in modalità grey box sull'applicazione web e sull'infrastruttura di rete del cliente. Sono state identificate 12 vulnerabilità, di cui 2 critiche, 4 alte, 5 medie e 1 bassa. Le vulnerabilità critiche permettono a un attaccante non autenticato di ottenere accesso completo al server applicativo e di estrarre il database dei clienti. Si raccomanda di applicare le patch indicate entro 48 ore per le vulnerabilità critiche.

---

## Sezione 3: Vulnerabilità — il cuore del report

Ogni vulnerabilità trovata ha la sua scheda. Struttura standard:

```
TITOLO: SQL Injection su endpoint /api/login

GRAVITÀ: Critica
CVSS Score: 9.8

DESCRIZIONE:
L'endpoint /api/login è vulnerabile a SQL Injection nel parametro
"username". Un attaccante non autenticato può sfruttare questa
vulnerabilità per bypassare l'autenticazione e accedere a qualsiasi
account, inclusi quelli amministrativi.

IMPATTO:
- Bypass dell'autenticazione completo
- Accesso al database contenente 50.000 record cliente
- Potenziale accesso al file system del server (tramite LOAD_FILE)

PASSI PER RIPRODURRE:
1. Accedere alla pagina di login: https://target.com/login
2. Nel campo username inserire: admin'--
3. Nel campo password inserire qualsiasi valore
4. Cliccare "Accedi"
5. Si ottiene accesso come utente amministratore

PROVE:
[Screenshot del login riuscito]
[Request/Response HTTP da Burp Suite]

REMEDIATION:
Sostituire la query dinamica con prepared statements:

  // VULNERABILE
  $query = "SELECT * FROM users WHERE username='" . $_POST['user'] . "'";

  // SICURO
  $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
  $stmt->execute([$_POST['user']]);

Applicare anche la validazione dell'input e il principio del minimo
privilegio per l'utente del database.

RIFERIMENTI:
- CWE-89: Improper Neutralization of Special Elements in SQL Query
- OWASP Top 10 A03:2021 - Injection
```

---

## Classificazione della gravità (CVSS)

Usa il sistema **CVSS** (Common Vulnerability Scoring System) per classificare la gravità. I fattori principali:

| Fattore | Domanda |
|---|---|
| Vettore di attacco | È sfruttabile da internet o solo in locale? |
| Complessità | Richiede condizioni particolari? |
| Autenticazione | Serve un account per sfruttarla? |
| Impatto CIA | Quanto compromette Confidenzialità, Integrità, Disponibilità? |

Livelli di gravità:

| Score | Gravità |
|---|---|
| 9.0 – 10.0 | Critica |
| 7.0 – 8.9 | Alta |
| 4.0 – 6.9 | Media |
| 0.1 – 3.9 | Bassa |
| 0.0 | Informativa |

Calculator online: `nvd.nist.gov/vuln-metrics/cvss/v3-calculator`

---

## Le prove: screenshot e log

Ogni vulnerabilità deve essere **dimostrata** con prove concrete:

- **Screenshot** del risultato sfruttato
- **Request/Response HTTP** (Burp Suite → copy as curl, copy as HTTP)
- **Output di tool** (nmap, sqlmap, ecc.)
- **Codice PoC** se rilevante

Rinomina le immagini in modo descrittivo: `sqli-admin-bypass.png`, non `screenshot1.png`.

---

## Tono e linguaggio

- Scrivi in modo **chiaro e diretto**
- Evita gergo tecnico nell'Executive Summary
- Non essere condescendente — il tuo lavoro è aiutare, non far sentire il cliente in colpa
- Sii specifico: "l'endpoint `/api/user?id=X` è vulnerabile a IDOR" è meglio di "ci sono problemi di autenticazione"
- Ogni finding deve avere una remediation **concreta e attuabile**

---

## Template e strumenti

- **Dradis** — piattaforma open source per report di pentest collaborativi
- **PlexTrac** — piattaforma commerciale
- **Ghostwriter** — open source, molto usato
- **LaTeX / Pandoc** — per chi vuole controllo totale sul formato
- **Word/Google Docs** — semplice, efficace per iniziare

---

## Conclusione

Il report è il tuo biglietto da visita professionale. Un pentest da 10.000€ con un report mediocre è un pentest mediocre agli occhi del cliente. Un pentest con report eccellente costruisce reputazione e fiducia.

Comincia a costruire **template riutilizzabili** fin dal primo report. Ogni engagement aggiunge vulnerabilità alla tua libreria personale — con il tempo avrai descrizioni, impatti e remediation pronte per le tipologie più comuni.
