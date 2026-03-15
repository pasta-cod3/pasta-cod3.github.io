# ShinyHunters attacca Match Group: milioni di account di app di dating esposti

## Il fatto

A gennaio 2026, il gruppo **ShinyHunters** ha rivendicato il furto di dati da **Match Group** — la società che possiede alcune delle app di dating più usate al mondo: Tinder, Match.com, OkCupid, Hinge, e PlentyOfFish. La società ha definito l'accaduto un "security incident" ancora sotto indagine, senza confermare il numero esatto di utenti coinvolti.

ShinyHunters sostiene di aver ottenuto accesso tramite **AppsFlyer**, la stessa piattaforma di marketing analytics già citata come punto d'ingresso nel breach di Panera Bread nello stesso periodo. Questo suggerisce che AppsFlyer — o un subset dei suoi sistemi — potrebbe essere stato compromesso in modo sistemico, servendo da trampolino verso molteplici organizzazioni clienti.

---

## Perché i dati di dating app sono particolarmente sensibili

Rispetto a un breach di un e-commerce o di un servizio cloud, i dati di una app di dating hanno caratteristiche di sensibilità uniche:

**Informazioni demografiche dettagliate:**
- Età, genere, orientamento sessuale dichiarato
- Religione, etnia, statura, peso
- Preferenze relazionali e sessuali

**Dati comportamentali:**
- Pattern di utilizzo (quando sei online, con chi interagisci)
- Contenuti delle conversazioni (nelle versioni premium)
- Foto personali, spesso con metadati di localizzazione

**Dati di localizzazione:**
- Dove vivi, dove lavori, dove frequenti

**Dati finanziari:**
- Storico dei pagamenti per abbonamenti premium
- Metodi di pagamento

Questa combinazione rende i dati di dating app particolarmente utili per:
- Estorsione e sextortion
- Identificazione di persone LGBTQ+ in paesi dove l'omosessualità è illegale
- Profilazione dettagliata per campagne di spear phishing
- Stalking

---

## Il pattern ShinyHunters nel 2026

Quello che colpisce di gennaio 2026 è il numero di breach attribuiti allo stesso gruppo in un breve arco temporale:

- **Panera Bread** — 5,1 milioni di account
- **Match Group** — in corso di valutazione
- **Crunchbase** — confermato
- Decine di altre organizzazioni tramite Zestix e altri IAB collegati

ShinyHunters si sta dimostrando uno degli attori più produttivi del panorama del cybercrimine. La loro specializzazione è chiara: accesso iniziale tramite fornitori terzi comuni (AppsFlyer in questo periodo sembra essere un vettore frequente), esfiltrazione massiva di dati, richiesta di riscatto, pubblicazione se il riscatto non viene pagato.

---

## Il problema della terza parte: AppsFlyer

AppsFlyer è una piattaforma di **mobile attribution** — aiuta le aziende a capire da dove vengono i loro utenti (quale pubblicità, quale app store, quale campagna marketing ha portato ciascun download). Per funzionare, ha bisogno di accesso ai dati degli utenti di molteplici app dei suoi clienti.

Questo crea un problema strutturale: una singola compromissione di AppsFlyer o di un suo componente può esporre simultaneamente i dati di decine o centinaia di aziende clienti. Il valore per un attaccante di compromettere un fornitore di questo tipo è enormemente superiore al valore di compromettere una singola azienda.

---

## La risposta di Match Group

Match Group ha confermato l'incidente con una dichiarazione vaga che riconosce un "security incident" in corso di indagine. Non ha specificato:
- Quali app sono affette
- Quanti utenti sono coinvolti
- Quali dati sono stati esfiltrati
- Se e quando invierà notifiche agli utenti

Questo tipo di risposta — vaga, ritardata, con minime informazioni concrete — è purtroppo comune nelle prime fasi di una breach disclosure. Ma è problematica per gli utenti che devono decidere se cambiare password, monitorare i propri account, o prendere altre misure protettive.

---

## Cosa fare se usi app Match Group

- Cambia le password di Tinder, Hinge, OkCupid, Match.com
- Attiva l'autenticazione a due fattori dove disponibile
- Rivedi le foto condivise e considera se contengono elementi identificativi sensibili
- Monitora eventuali comunicazioni ufficiali di Match Group
- Sii sospettoso di contatti insoliti che sembrano conoscere informazioni dettagliate su di te

---

## Conclusione

I dati di dating app sono tra i più personali che esistano. Il breach di Match Group — se confermato nella sua portata — potrebbe avere conseguenze reali sulla sicurezza personale di milioni di persone. Il vero problema strutturale rimane la concentrazione di dati sensibili in fornitori terzi senza che gli utenti finali ne siano consapevoli.
