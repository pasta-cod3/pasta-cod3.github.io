# Il Caso Hess: come 75 centesimi smascherarono una rete di spionaggio

## Introduzione

Nel settembre 1986, Clifford Stoll era un astronomo disoccupato che aveva accettato un lavoro provvisorio come sysadmin al **Lawrence Berkeley Laboratory** — un centro di ricerca nucleare dell'Università della California finanziato dal Dipartimento dell'Energia americano. Non sapeva nulla di sicurezza informatica. Non aveva mai lavorato in quel campo. Era lì perché aveva bisogno di soldi.

Il suo primo compito fu banale: risolvere una discrepanza contabile di **75 centesimi** nel sistema di fatturazione dell'uso dei computer. Qualcuno aveva usato tempo di calcolo che non risultava in nessun account fatturabile.

Nei mesi successivi, quei 75 centesimi lo avrebbero portato a smascherare una rete di spionaggio che collegava un hacker disoccupato di Hannover al KGB sovietico — in quello che divenne il primo caso documentato di cyberespionaggio della storia, e uno dei casi fondanti della sicurezza informatica moderna.

---

## Il Lawrence Berkeley Laboratory nel 1986

Per capire il caso bisogna capire il contesto. Il Lawrence Berkeley Laboratory era connesso a **ARPANET** — la rete che sarebbe diventata internet — ed era parte di un ecosistema di laboratori di ricerca accademici e militari interconnessi.

Come quasi tutti i sistemi universitari e di ricerca dell'epoca, LBL aveva un approccio alla sicurezza che oggi sembrerebbe ingenuo: le macchine erano connesse, molti servizi erano aperti per facilitare la collaborazione, e il sistema di autenticazione si basava su password spesso banali. La filosofia implicita era che gli utenti fossero ricercatori e accademici fidati — non avversari.

Stoll gestiva un sistema **VAX** su cui diversi utenti avevano account. Il sistema fatturava il tempo di CPU usato. Quando trovò la discrepanza di 75 centesimi, iniziò a controllare i log.

---

## La scoperta: un account fantasma

Analizzando i log di autenticazione, Stoll trovò qualcosa di strano: accessi a un account chiamato **"hunter"** — un account di sistema che non doveva essere usato da nessuno, creato per manutenzione interna e dimenticato. L'account aveva passato ore connesso ai sistemi del laboratorio, ma nessuno avrebbe dovuto saperlo.

Stoll iniziò a monitorare le sessioni attive. Quello che vide lo lasciò senza parole.

L'intruso non era interessato ai dati del Lawrence Berkeley Laboratory. Stava usando i sistemi del laboratorio come **trampolino** — un punto di accesso da cui saltare verso altre reti. Stava navigando sistematicamente attraverso ARPANET, connettendosi a sistemi militari e governativi.

In poche settimane di monitoraggio, Stoll documentò accessi dell'intruso a:
- Sistemi del **Pentagono**
- La **NASA Ames Research Center**
- Il **Mitre Corporation** (contractor della difesa)
- Il **Rome Air Development Center** dell'Air Force
- Decine di università e centri di ricerca militari

L'intruso cercava file con parole chiave specifiche: **"nuclear"**, **"SDI"** (Strategic Defense Initiative — lo scudo spaziale di Reagan), **"KH"** (probabile riferimento ai satelliti spia Keyhole), **"NORAD"**, **"EMP"** (Electromagnetic Pulse), **"crypto"**.

Non era un curioso. Aveva un'agenda precisa.

---

## Il problema del tracciamento

Stoll capì subito che per identificare l'intruso avrebbe dovuto tenerlo connesso il più a lungo possibile mentre le autorità risalivano la catena delle chiamate. Il problema era puramente tecnico: nel 1986, tracciare una connessione telefonica richiedeva la collaborazione manuale di ogni compagnia telefonica lungo il percorso, e ci volevano **minuti** per completare il tracciamento.

L'intruso raramente rimaneva connesso più di un minuto prima di disconnettersi.

Stoll contattò l'FBI, la CIA, la NSA e le autorità militari. La risposta fu deludente: nessuno era particolarmente interessato. La CIA disse che non aveva giurisdizione su territorio americano. L'FBI disse che il danno economico — qualche centinaio di dollari di tempo CPU rubato — era troppo piccolo per aprire un'indagine federale. La NSA non rispose.

Stoll continuò da solo, con l'appoggio informale del suo supervisore.

---

## L'honeypot: l'invenzione per necessità

La soluzione che Stoll inventò per risolvere il problema del tempo di tracciamento è oggi riconosciuta come la **prima implementazione documentata di un honeypot** nella storia della sicurezza informatica.

L'idea era semplice nella sua eleganza: se doveva tenere l'intruso connesso abbastanza a lungo da completare il tracciamento, doveva dargli qualcosa di abbastanza interessante da esaminare. Qualcosa che sembrasse prezioso e richiedesse tempo per essere letto.

Stoll creò una serie di **file e directory false** che sembravano contenere documentazione classificata. I nomi erano scelti per attirare esattamente il tipo di ricerche che l'intruso stava facendo:

- **`SDInet/`** — una directory che sembrava contenere documentazione sul progetto SDI
- **`MITRE-RESEARCH/`** — file che sembravano report di ricerca militare
- **`SPACENET/`** — documentazione fasulla su reti satellitari

I file erano scritti in modo convincente — non troppo tecnici da sembrare inventati, non troppo semplici da essere ovviamente falsi. Stoll passò ore a scrivere contenuti plausibili.

Quando l'intruso accedeva ai file esca, passava molti minuti a leggerli — abbastanza perché i tecnici delle compagnie telefoniche completassero il tracciamento.

Nel corso di mesi, Stoll costruì versioni sempre più elaborate dei file esca, aggiungendo dettagli, creando strutture di directory credibili, inserendo riferimenti incrociati tra documenti. L'intruso continuava ad abboccare.

---

## Tracciare la connessione: da Berkeley ad Hannover

Il percorso delle connessioni dell'intruso era complicato. Le chiamate arrivavano attraverso una catena di sistemi intermedi — un tecnica che oggi chiameremmo **proxy chaining** o **pivoting** — che rendeva difficile risalire alla sorgente.

Stoll mappò il percorso pezzo per pezzo:
```
Intruso → Tymnet (rete di dati commerciale) → LBL → Sistemi militari
```

Risalendo la catena, la connessione passava attraverso **Tymnet** — una delle principali reti di trasmissione dati dell'epoca — e arrivava da **Bremen, Germania Ovest**. Ma il segnale dalla Germania proveniva a sua volta da **Datex-P**, la rete a pacchetti della Deutsche Bundespost.

Il problema era che le autorità americane non avevano giurisdizione in Germania. L'FBI e la CIA continuavano a non essere interessate — il caso sembrava troppo piccolo, troppo tecnico, troppo internazionale.

Stoll contattò le autorità tedesche direttamente. Trovò un interlocutore nell'**Ufficio Federale per la Protezione della Costituzione** (BfV) tedesco — l'equivalente dell'FBI per la controspionaggio interno.

---

## Markus Hess e la rete di spionaggio

Dopo mesi di tracciamento coordinato tra autorità americane e tedesche, la connessione fu risalita fino ad **Hannover**, Germania Ovest. L'hacker era **Markus Hess**, 25 anni, programmatore freelance disoccupato.

Hess non operava da solo. Faceva parte di un piccolo gruppo che includeva **Karl Koch** — un giovane hacker instabile e dipendente dalla cocaina che usava il nome online **"Hagbard Celine"**, tratto dal romanzo di fantapolitica "Illuminatus!" di Robert Anton Wilson.

Koch aveva stabilito un canale con il **KGB sovietico** attraverso un intermediario. Il meccanismo era semplice e antico: Hess e il gruppo rubavano documentazione tecnica da sistemi militari e di ricerca americani, Koch la consegnava fisicamente agli agenti del KGB in cambio di denaro. Il compenso per ogni transazione era modesto — alcune migliaia di marchi, spesso in parte convertiti in cocaina per Koch.

I dati venduti includevano:
- Documentazione su sistemi operativi militari
- Specifiche tecniche di hardware difensivo
- Comunicazioni interne di contractor della difesa
- Accessi a sistemi classificati (anche se i file più sensibili erano protetti da ulteriori livelli di autenticazione che Hess non riuscì a superare)

Non era chiaro con certezza quanto valore avessero i dati venduti per l'intelligence sovietica. Il KGB era noto per acquisire grandi quantità di materiale tecnico di qualità variabile, lasciando ai propri analisti il compito di trovare i grani di valore nell'enorme volume di rumore.

---

## Gli arresti e il finale tragico di Koch

Nel 1987 le autorità tedesche avevano abbastanza prove per agire. Nel marzo 1987, la polizia tedesca arrestò Hess e altri membri del gruppo.

**Markus Hess** fu processato e condannato nel 1990 a un anno e otto mesi di prigione con sospensiva — una pena che molti considerarono sorprendentemente lieve per il reato di spionaggio.

**Karl Koch** non visse per vedere il processo. Nel maggio 1989, una settimana prima che le autorità lo dovessero arrestare, il suo corpo fu trovato in un bosco vicino a Celle, nei pressi di Hannover. Era bruciato. La polizia tedesca concluse per suicidio — Koch aveva cosparso se stesso di benzina e si era dato fuoco.

La dinamica rimase misteriosa e controversa. C'erano chi sosteneva che Koch sapesse troppo, chi lo considerava genuinamente instabile e autodistruttivo. La sua vita era già segnata dalla dipendenza dalla cocaina, da paranoie crescenti e da una progressiva disconnessione dalla realtà.

Koch è diventato una figura quasi mitica nella sottocultura hacker tedesca degli anni '80 — emblema sia del talento che dell'autodistruzione.

---

## The Cuckoo's Egg: il libro che fondò una disciplina

Nel 1989, Clifford Stoll scrisse **"The Cuckoo's Egg: Tracking a Spy Through the Maze of Computer Espionage"** — il resoconto in prima persona dell'intera vicenda.

Il libro era insolito per il suo tempo: scritto in modo accessibile come un thriller, con la tensione narrativa di un romanzo, ma fondato su eventi reali documentati con precisione. Stoll scrisse per un pubblico generale, non per specialisti tecnici.

"The Cuckoo's Egg" è diventato uno dei libri di sicurezza informatica più letti e influenti di sempre. Per molti professionisti del settore — incluse persone che lavorano nella sicurezza oggi — è il libro che ha scatenato l'interesse per la disciplina. È ancora in stampa, ancora usato come testo introduttivo in corsi universitari di cybersecurity.

Il titolo si riferisce alla pratica del cuculo di depositare le uova nel nido di altri uccelli — un'analogia per l'intruso che usava i sistemi altrui per i propri scopi.

---

## L'impatto sulla sicurezza informatica

Il caso Hess-Stoll ha avuto un'influenza sproporzionata rispetto alla sua scala tecnica. Non era il breach più grande, non era il danno più grave. Ma era documentato in modo eccezionale e arrivò nel momento giusto.

**Prima dimostrazione documentata di cyberespionaggio:** il caso mostrò per la prima volta in modo inequivocabile che gli stati nazione usavano hacker per raccogliere intelligence attraverso le reti informatiche. Quello che oggi è ovvio — che le reti di ricerca, militari e aziendali sono bersagli di intelligence straniera — nel 1986 era una novità assoluta.

**L'honeypot come tecnica difensiva:** la tecnica inventata da Stoll per necessità pratica è diventata una disciplina a sé stante. Gli honeypot — sistemi o dati fasulli progettati per attirare e studiare gli attaccanti — sono oggi un componente standard dell'arsenale difensivo. Esistono honeypot per reti, honeypot per endpoint, honeydocument (file che segnalano quando vengono aperti da un luogo non autorizzato), e intere reti honeypot chiamate "honeynet".

**L'importanza del logging:** Stoll poté ricostruire le azioni dell'intruso solo perché aveva log dettagliati delle connessioni e delle attività. Il caso stabilì l'importanza del logging sistematico come prerequisito di qualsiasi indagine su incidenti di sicurezza.

**La cooperazione internazionale:** il caso mostrò sia la necessità che la difficoltà della cooperazione tra autorità di diversi paesi in indagini informatiche. Le stesse difficoltà — giurisdizione, standard di prova diversi, velocità delle indagini incompatibile con la velocità degli attacchi — sono ancora le sfide principali della law enforcement informatica internazionale.

---

## Clifford Stoll oggi

Stoll non è mai diventato un professionista della sicurezza nel senso convenzionale. Dopo il caso scrisse il libro, fece molte conferenze, e poi tornò all'astronomia e alla sua vera passione: la didattica della matematica e della fisica per bambini.

È noto oggi anche per un'altra cosa: nel 1995 scrisse un articolo sul Newsweek intitolato **"The Internet? Bah!"** in cui prediceva con sicurezza che internet non sarebbe mai diventata una piattaforma commerciale significativa, che gli e-book non avrebbero mai sostituito i libri fisici, e che il commercio online era destinato al fallimento. È diventato uno degli esempi più citati di previsione tecnologica errata.

Stoll è il primo a riderne.

---

## Conclusione

La storia di Clifford Stoll è, a suo modo, la storia perfetta dell'analista della sicurezza. Non era un esperto. Non aveva risorse. Non aveva il supporto delle istituzioni. Aveva una discrepanza di 75 centesimi, la curiosità di capire cosa l'aveva causata, e l'ostinazione di continuare a indagare per mesi nonostante nessuno fosse interessato.

Quella combinazione — attenzione ai dettagli anomali, curiosità metodica, ostinazione — è esattamente quello che distingue un buon analista da uno mediocre. Nel 1986 come nel 2026.

E l'honeypot che inventò per necessità pratica in quei mesi è ancora uno degli strumenti più eleganti della sicurezza difensiva: invece di cercare di costruire difese perfette — impresa impossibile — si crea l'illusione di una debolezza, e si aspetta che l'attaccante ci cada dentro.
