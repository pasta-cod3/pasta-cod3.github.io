# Il Morris Worm (1988): il primo grande attacco su internet

## Introduzione

Il 2 novembre 1988, Robert Tappan Morris — uno studente di informatica di 23 anni alla Cornell University, figlio di un celebre crittografo della NSA — lanciò un programma su internet che non avrebbe mai dovuto fare quello che fece. In poche ore, migliaia di computer in tutto il paese smisero di funzionare. Gli amministratori di sistema di università, laboratori di ricerca e basi militari si trovarono davanti a macchine inutilizzabili senza capire perché.

Era il **Morris Worm** — il primo worm informatico su scala globale, e l'evento che cambiò per sempre la percezione della sicurezza informatica.

---

## Il contesto: come era internet nel 1988

Per capire l'impatto del Morris Worm bisogna capire com'era internet nel 1988. Non era la rete globale che conosciamo oggi. Era **ARPANET** — una rete prevalentemente accademica e militare con circa 60.000 macchine collegate. Università prestigiose, laboratori di ricerca governativi, centri dell'esercito e della marina. Un ambiente ristretto, dove tutti si conoscevano, tutti si fidavano di tutti, e la sicurezza non era mai stata una priorità.

I sistemi erano workstation **VAX** di Digital Equipment Corporation e workstation **Sun** che giravano su Unix. L'autenticazione era minimale per design: la filosofia era quella di facilitare la collaborazione, non di difendersi da attacchi. In molti casi, le macchine si fidavano automaticamente di altre macchine sulla stessa rete senza richiedere password.

L'idea che qualcuno potesse voler causare danni deliberati a questa rete era quasi impensabile nell'ambiente accademico dell'epoca.

---

## La costruzione del worm: tre vulnerabilità concatenate

Morris non inventò nuove tecniche di attacco — le vulnerabilità che sfruttò erano già note tra i ricercatori di sicurezza. Il suo contributo fu di **concatenarle** in un sistema autonomo di propagazione.

### Vulnerabilità 1: Buffer overflow in fingerd

Il programma `fingerd` era un piccolo demone Unix che rispondeva a query sul demone `finger` — un servizio che permetteva di sapere chi era connesso a un sistema. Era installato su quasi tutte le macchine Unix dell'epoca.

`fingerd` aveva un bug classico di **buffer overflow**: quando riceveva un input troppo lungo, sovrascriveva aree di memoria adiacenti al buffer allocato. Morris scrisse un exploit che sfruttava questo comportamento per sovrascrivere il return address dello stack e far saltare l'esecuzione a codice arbitrario da lui fornito.

In termini moderni, era una remote code execution via stack buffer overflow — una delle classi di vulnerabilità più sfruttate ancora oggi, trent'anni dopo.

### Vulnerabilità 2: La backdoor di Sendmail

Sendmail era (ed è ancora) il software più usato per gestire la posta elettronica su Unix. La versione in circolazione nel 1988 aveva una funzionalità di debug — il comando `DEBUG` — che permetteva di specificare comandi di sistema da eseguire invece di un indirizzo email come destinatario.

Non era propriamente un bug: era una **feature di sviluppo** lasciata attiva inavvertitamente nelle versioni di produzione. Qualcuno aveva dimenticato di rimuoverla prima del rilascio. Morris poteva inviare un'email con un destinatario come `"|/bin/sh"` e il sistema avrebbe eseguito una shell.

### Vulnerabilità 3: Il sistema di trust RSH/rexec

Unix implementava un sistema di "trusted hosts" tramite i file `.rhosts` e `/etc/hosts.equiv`. Se la macchina A aveva `B` nel suo file di trust, qualsiasi utente sulla macchina B poteva eseguire comandi sulla macchina A senza fornire password, semplicemente dichiarando di essere un certo utente.

Questo sistema era stato progettato per facilitare la collaborazione: un ricercatore poteva lavorare su più macchine senza inserire password continuamente. Ma significava anche che compromettere una macchina spesso dava accesso automatico a tutte le macchine di cui si fidava.

### Il meccanismo completo

Una volta ottenuto accesso a una macchina con una delle tre tecniche, il worm eseguiva una sequenza precisa:

1. Scaricava due piccoli programmi C ("l1.c" e "l2.c") sulla macchina compromessa
2. Li compilava localmente usando il compilatore `cc` presente sul sistema
3. Eseguiva il programma compilato, che era il vero worm
4. Il worm cercava altri host nei file di configurazione locali: `/etc/hosts`, i log di `sendmail`, le tabelle di routing, i file `.rhosts`
5. Per ogni host trovato, tentava le tre tecniche in sequenza
6. Il ciclo ricominciava

Il worm portava anche un componente per craccare le password Unix usando un dizionario integrato di 432 parole comuni, permettendogli di autenticarsi come utenti reali su sistemi che non era riuscito a compromettere altrimenti.

---

## L'errore fatale: la logica anti-duplicazione

Morris aveva pensato a un meccanismo per limitare la diffusione del worm: all'avvio, il worm controllava se era già in esecuzione sulla macchina. Se trovava una copia di se stesso, si fermava — per non sovraccaricare i sistemi infetti.

Ma Morris ragionò che i sysadmin, una volta scoperto il meccanismo, avrebbero potuto bloccare il worm installando una versione "sentinel" che si dichiarava sempre presente. Per aggirare questa contromisura, aggiunse una regola: **ogni 7 volte** che il worm trovava una copia di se stesso, la ignorava e si replicava comunque.

Questa decisione fu catastrofica. I sistemi infetti accumularono decine, poi centinaia di copie del worm in esecuzione simultanea. Ogni copia consumava CPU, memoria e connessioni di rete. I sistemi diventavano progressivamente più lenti fino all'inutilizzabilità totale.

Morris calcolò male la matematica della propagazione esponenziale in una rete densamente interconnessa.

---

## Il 2 novembre 1988: le prime ore

Il worm fu rilasciato intorno alle 18:00 del 2 novembre 1988 da un terminale del MIT — non dalla Cornell, probabilmente per oscurare la traccia verso Morris.

Alle 21:00, i sysadmin delle prime università colpite iniziarono a notare un rallentamento anomalo dei sistemi. Alle 23:00 alcune macchine erano già completamente inutilizzabili. I telefoni iniziarono a squillare tra i laboratori.

All'alba del 3 novembre, circa **6.000 sistemi** erano fuori uso — una percentuale significativa di ARPANET. La lista delle vittime includeva il MIT, Stanford, Berkeley, il Carnegie Mellon, la NASA Ames Research Center, i laboratori di Los Alamos.

Morris, rendendosi conto della portata del disastro, contattò un amico alla Harvard che cercò di inviare istruzioni anonime per fermare il worm ai newsgroup Unix. Il messaggio arrivò troppo tardi e attraverso canali già congestionati.

---

## La risposta: nasce la sicurezza informatica moderna

La risposta all'incidente fu caotica ma storica. Per la prima volta, sysadmin di università e laboratori in tutto il paese comunicarono intensamente per condividere analisi e contromisure. I ricercatori dell'UC Berkeley riuscirono a decompilare il worm e capirne il funzionamento entro 12 ore.

Poche settimane dopo, il **DARPA** finanziò la creazione del **CERT** (Computer Emergency Response Team) presso il Carnegie Mellon University — la prima organizzazione al mondo dedicata alla risposta coordinata agli incidenti informatici. Il modello CERT è stato poi replicato in decine di paesi, inclusa l'Italia con il CNAIPIC e successivamente il CSIRT.

---

## Le conseguenze legali e il dibattito

Morris si identificò attraverso un amico che contattò il New York Times il giorno dopo, dichiarando che era stato un esperimento andato storto. Non voleva causare danni — voleva misurare quanto fosse grande internet e studiare le vulnerabilità di ARPANET.

Fu il **primo condannato** in base al Computer Fraud and Abuse Act del 1986: tre anni di libertà vigilata, 400 ore di servizio civile, 10.050 dollari di multa. Nessun carcere.

La sentenza fu controversa. Molti nella comunità accademica pensavano che fosse eccessiva per quello che Morris sosteneva essere ricerca. Altri la ritenevano troppo lieve per un danno che arrivò a costare, secondo alcune stime, tra i 100.000 e i 10 milioni di dollari in ore di lavoro perse.

La verità è che il caso Morris si trovò in un vuoto legale: non esisteva ancora una giurisprudenza consolidata su cosa costituisse un crimine informatico, quale fosse il danno misurabile, e dove finisse la ricerca e iniziasse il crimine.

---

## Dove è finito Robert Morris

Robert Tappan Morris si riprese completamente dalla vicenda. Ottenne il dottorato all'Harvard, divenne professore associato al MIT nel laboratorio CSAIL (Computer Science and Artificial Intelligence Laboratory), dove insegna ancora oggi.

Nel 1995, insieme a Paul Graham e Trevor Blackwell, fondò **Viaweb** — uno dei primi servizi di e-commerce su web, venduto a Yahoo nel 1998 per 49 milioni di dollari.

Nel 2005, insieme a Paul Graham, Jessica Livingston e Trevor Blackwell, co-fondò **Y Combinator** — oggi la più importante acceleratrice di startup del mondo, che ha finanziato Airbnb, Dropbox, Stripe, Reddit e centinaia di altre aziende.

---

## Il lascito tecnico

Le tre vulnerabilità del Morris Worm non erano anomalie — erano rappresentative di problemi sistemici che continuano a ripresentarsi:

**Buffer overflow:** ancora oggi una delle classi di vulnerabilità più sfruttate, nonostante decenni di mitigazioni (ASLR, stack canaries, DEP/NX). Il principio è identico a quello del 1988.

**Feature di debug in produzione:** API non documentate, endpoint di amministrazione dimenticati, credenziali di sviluppo hardcoded. L'equivalente moderno del comando DEBUG di Sendmail è nelle notizie ogni mese.

**Trust implicito tra sistemi:** il problema del trust basato sull'identità di rete è diventato ancora più acuto con il cloud e i microservizi. Le strategie Zero Trust di oggi sono la risposta diretta a questa stessa categoria di problema.

---

## Conclusione

Il Morris Worm è il caso zero della sicurezza informatica moderna: il momento in cui il mondo si rese conto che internet era fragile, che le vulnerabilità software avevano conseguenze reali su scala globale, e che la sicurezza non poteva essere un afterthought.

Morris voleva misurare internet. Lo misurò — e nel processo cambiò per sempre come internet pensa alla propria difesa.
