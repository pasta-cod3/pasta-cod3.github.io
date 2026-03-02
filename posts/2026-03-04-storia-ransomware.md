# Storia del Ransomware: dal floppy disk ai miliardi di dollari

## Introduzione

Il ransomware sembra una minaccia nata con Bitcoin e i mercati darknet. In realtà la prima implementazione documentata risale al **1989** — quando internet non esisteva per il pubblico generale, quando i computer si scambiavano programmi su floppy disk, e quando nessuno aveva ancora capito che cifrare i dati di qualcuno e chiedere un riscatto potesse diventare un modello di business.

La storia del ransomware è la storia di come un'idea concettualmente semplice — prendi in ostaggio i dati di qualcuno, restituiscili in cambio di denaro — abbia impiegato trent'anni a trovare gli strumenti giusti per diventare la minaccia criminale più lucrativa della storia informatica. Gli strumenti che mancavano erano due: la **crittografia abbastanza forte da essere inviolabile**, e un **sistema di pagamento abbastanza anonimo da non essere tracciabile**.

Quando entrambi divennero disponibili, il risultato fu un'industria criminale da miliardi di dollari che oggi colpisce ospedali, infrastrutture critiche e governi in tutto il mondo.

---

## 1989: il Dott. Popp e i floppy disk per l'AIDS

La storia inizia con **Joseph L. Popp**, un biologo americano con un dottorato ad Harvard che aveva lavorato per l'Organizzazione Mondiale della Sanità. Nel 1989, Popp distribuì fisicamente circa **20.000 floppy disk** per posta a ricercatori, organizzazioni mediche e aziende farmaceutiche in 90 paesi.

Il disco era etichettato **"AIDS Information - Introductory Diskette 2.0"** e sembrava contenere un software educativo sulla valutazione del rischio AIDS — un argomento di urgente rilevanza nel 1989, nel pieno dell'epidemia. Le organizzazioni sanitarie di tutto il mondo ricevettero il disco come materiale legittimo.

Il programma sembrava funzionare normalmente. Ma contava silenziosamente i riavvii del computer. Dopo **90 riavvii**, si attivava.

### Il meccanismo

Il malware — che la comunità della sicurezza avrebbe poi chiamato **AIDS Trojan** o **PC Cyborg Trojan** — non cifrava i file nel senso tecnico moderno. Invece, **nascondeva tutte le directory** del disco fisso e **rendeva illeggibili i nomi dei file** attraverso una sostituzione simmetrica delle lettere. L'utente vedeva il disco apparentemente vuoto o con file con nomi incomprensibili.

Sullo schermo appariva un messaggio che notificava che la "licenza del software" era scaduta e richiedeva il pagamento di **189 dollari** (o **378 dollari** per "licenza a vita") da inviare tramite posta a una casella postale a Panama intestata alla **PC Cyborg Corporation**.

### I problemi tecnici del primo ransomware

La cifratura era tecnicamente elementare: usava **crittografia simmetrica** con una chiave derivata staticamente e scritta nel codice stesso del programma. Non ci volle molto ai ricercatori di sicurezza dell'epoca per decompilare il programma, estrarre la chiave e scrivere un decryptor gratuito. John McAfee — sì, quello della suite antivirus — fu tra i primi a distribuire uno strumento di ripristino.

Il sistema di pagamento era altrettanto vulnerabile: mandare denaro in contanti via posta a una casella postale in Panama era tracciabile, fisicamente rischioso, e lento. Popp fu identificato, arrestato, e portato in giudizio.

### Il processo e il finale

Il processo di Popp in Inghilterra fu surreale. Popp si presentò in aula indossando bigodini nei capelli, con scatole di cartone legate intorno alle gambe come "protezione dalle radiazioni". I suoi avvocati presentarono argomenti di difesa insanitari. Il giudice lo dichiarò **non in grado di sostenere il processo** per problemi di salute mentale e lo rimandò negli USA senza condanna.

Popp non fu mai incarcerato per il malware. Tornò al suo lavoro precedente come entomologo e ricercatore sulle farfalle in Africa, dove morì nel 2007.

L'AIDS Trojan rimase una curiosità storica per quasi vent'anni. L'idea era lì — ma gli strumenti per renderla una minaccia reale non esistevano ancora.

---

## Il decennio perduto (1990-2004): esperimenti senza scala

Negli anni '90 e nei primi anni 2000 comparvero sporadicamente malware con componenti di cifratura o estorsione, ma nessuno raggiunse scala significativa per ragioni strutturali:

**Il problema della consegna:** internet stava crescendo, ma la distribuzione di malware su larga scala era ancora difficile. Le email di spam erano nascenti. I sistemi di aggiornamento automatico non esistevano come vettori di diffusione.

**Il problema della crittografia:** gli algoritmi crittografici forti esistevano, ma implementarli correttamente in un malware era complesso. Molte implementazioni erano vulnerabili ad attacchi crittanalitici elementari.

**Il problema del pagamento:** come si raccoglie il riscatto in modo anonimo e non tracciabile? I trasferimenti bancari sono tracciabili. Il contante richiede incontri fisici. I vaglia postali lasciano tracce. Non esisteva ancora un meccanismo di pagamento che fosse simultaneamente anonimo, globale, irreversibile e scalabile.

Questo ultimo problema era il vero blocco. Senza un sistema di pagamento anonimo, il ransomware era un crimine ad alto rischio e bassa resa per i suoi autori.

---

## 2005-2012: i precursori moderni

### GPCoder e Archiveus (2005-2006)

Nel 2005 apparve **GPCoder** — il primo ransomware che usava crittografia asimmetrica reale (RSA). Cifrava file con determinate estensioni e richiedeva il pagamento via bonifico bancario a un conto in Estonia.

La crittografia era sufficientemente forte da non essere crackata facilmente, ma il pagamento tramite bonifico bancario era tracciabile. I criminali dietro GPCoder furono identificati e il server con le chiavi private fu sequestrato, permettendo il recupero dei file.

Nel 2006, **Archiveus** fu il primo malware a usare chiavi RSA a 1024 bit — abbastanza forte per essere inviolabile praticamente. Richiedeva alle vittime di acquistare prodotti specifici da farmacie online per ricevere la password di decifrazione. Anche questo sistema di pagamento lasciava tracce.

Il pattern era chiaro: la crittografia era ormai abbastanza forte. Il problema rimaneva il pagamento.

### I sistemi di pagamento pre-Bitcoin

Tra il 2008 e il 2012, una serie di ransomware "polizia" (o "scareware") raggiunse scala significativa usando sistemi di pagamento come **Ukash**, **PaySafeCard** e **MoneyPak** — buoni prepagati acquistabili in tabaccherie e negozi di convenienza che potevano essere convertiti in denaro con un livello di anonimato relativamente alto.

Il più noto di questi fu **Reveton** — un trojan che bloccava lo schermo del computer e mostrava una schermata dell'FBI (o della polizia locale, adattata per ogni paese) che accusava la vittima di aver visitato siti di pedopornografia o di aver violato il copyright, e richiedeva il pagamento di una "multa" di 100-200 euro per sbloccare il sistema.

Reveton infettò centinaia di migliaia di macchine in Europa e negli USA. Era efficace perché sfruttava la vergogna e la paura: molte vittime pagavano semplicemente per evitare che qualcuno venisse a sapere che il loro computer era stato "trovato" con quei contenuti — anche quando erano completamente innocenti.

Ma Reveton cifrava il **sistema operativo**, non i file dell'utente. Questo significava che i dati erano recuperabili e che, con un po' di competenza tecnica, il blocco poteva essere aggirato senza pagare.

---

## 2013: CryptoLocker e la rivoluzione

Nel settembre 2013, tutto cambiò.

**CryptoLocker** era diverso da tutti i ransomware precedenti in modo strutturale. Combinava per la prima volta tre elementi in modo coerente:

**1. Crittografia simmetrica + asimmetrica ibrida**

CryptoLocker generava una chiave AES-256 univoca per ogni file cifrato. Quella chiave veniva poi cifrata con una chiave pubblica RSA a 2048 bit — la chiave privata corrispondente esisteva solo sui server dei criminali. Non c'era modo di recuperare i file senza quella chiave privata. Nessuna quantità di potenza di calcolo disponibile nel 2013 avrebbe potuto forzarla in tempi ragionevoli.

Questo era matematicamente diverso da tutto ciò che era venuto prima. Non era una questione di implementazione difettosa o di chiave debole — era matematicamente inviolabile.

**2. Bitcoin come sistema di pagamento**

Bitcoin era stato creato nel 2009 ma nel 2013 aveva raggiunto sufficiente liquidità e accessibilità da essere usato come sistema di pagamento in un'operazione criminale. Era pseudoanonimo (le transazioni sono pubbliche ma i wallet non hanno identità associate di default), globale, irreversibile, e non richiedeva la cooperazione di banche o sistemi di pagamento tradizionali.

CryptoLocker fu il primo ransomware a richiedere pagamento in Bitcoin — e stabilì il modello che quasi tutti i ransomware successivi avrebbero adottato.

**3. Scadenza temporale e urgenza psicologica**

CryptoLocker mostrava un **conto alla rovescia**: 72 ore per pagare, poi la chiave privata sarebbe stata distrutta permanentemente. Il prezzo era circa 300 dollari in Bitcoin.

La scadenza era deliberatamente psicologica. Creava urgenza, impediva alla vittima di pensare razionalmente alle alternative, e accelerava la decisione di pagare. Era una tecnica di social engineering applicata all'automazione.

### La distribuzione

CryptoLocker si diffondeva prevalentemente via **email di spam** con allegati che sembravano documenti aziendali legittimi — fatture, tracking di spedizioni, documenti legali. Una volta aperto l'allegato su un sistema Windows, il ransomware si installava silenziosamente e iniziava a cifrare.

Cifrava tutti i file con estensioni comuni (documenti Office, PDF, immagini, video, database) su tutti i drive accessibili: locali, USB connesse, e soprattutto **share di rete**. Questo significava che un singolo dipendente che apriva un allegato sbagliato poteva cifrare i file condivisi di un intero ufficio.

### L'impatto

In pochi mesi CryptoLocker aveva infettato tra i **250.000 e 500.000 sistemi** in tutto il mondo e raccolto circa **3 milioni di dollari** in riscatti prima di essere smantellato.

L'operazione **Tovar** nel giugno 2014 — coordinata da FBI, Europol, e aziende private tra cui Dell SecureWorks, Symantec e Sophos — sequestrò la rete botnet Gameover Zeus che distribuiva CryptoLocker e ottenne le chiavi private dai server sequestrati. Le vittime che non avevano ancora pagato poterono recuperare i file gratuitamente.

Ma CryptoLocker aveva dimostrato il modello. Centinaia di gruppi criminali ne copiarono il concetto nelle settimane e mesi successivi.

---

## 2014-2016: l'ecosistema esplode

### CryptoWall

Successore diretto del modello CryptoLocker, **CryptoWall** fu distribuito in diverse versioni tra il 2014 e il 2016. La versione 3.0 usava la rete Tor per nascondere l'infrastruttura di comando e controllo, rendendo molto più difficile il sequestro dei server.

Si stima che CryptoWall abbia raccolto circa **325 milioni di dollari** in riscatti — il ransomware più lucrativo fino a quel momento.

### Ransomware-as-a-Service: la democratizzazione del crimine

Il cambiamento più significativo di questo periodo non fu tecnico ma organizzativo: la nascita del modello **Ransomware-as-a-Service (RaaS)**.

I developer di ransomware smisero di operare direttamente e iniziarono a vendere o noleggiare i propri strumenti ad **affiliati** — persone con capacità di distribuzione ma non necessariamente con le competenze tecniche per sviluppare il malware.

Il modello funzionava così:
- Il developer creava il ransomware, l'infrastruttura di pagamento, il sistema di decifrazione per le vittime che pagavano, e un pannello di controllo per gli affiliati
- Gli affiliati si registravano, pagavano una fee o accettavano una percentuale dei proventi (tipicamente 20-30% al developer, 70-80% all'affiliato), e si occupavano della distribuzione
- Ogni campagna dell'affiliato generava ID univoci che permettevano di tracciare quale affiliato aveva generato quale pagamento

Il risultato fu un abbassamento drastico della barriera d'ingresso. Non serviva saper programmare per diventare un operatore di ransomware — serviva solo saper distribuire malware via spam o exploit kit. Il crimine informatico si industrializzava.

---

## 2017: l'anno delle armi di stato

### WannaCry: quando una vulnerabilità NSA diventa pandemica

Il **12 maggio 2017** è considerato uno dei giorni peggiori nella storia della cybersecurity.

**WannaCry** si diffuse in modo che nessun ransomware aveva fatto prima: non via email, non via allegati, non richiedendo nessuna interazione dell'utente. Si propagava **automaticamente** attraverso le reti sfruttando **EternalBlue** — un exploit per una vulnerabilità critica in SMBv1 (il protocollo di file sharing di Windows) che era stato sviluppato dalla NSA come arma offensiva.

EternalBlue era stato rubato alla NSA dal gruppo **Shadow Brokers** — la cui identità rimane oggetto di dibattito, con molti esperti che indicano la Russia — e pubblicato online ad aprile 2017. Microsoft aveva rilasciato una patch (MS17-010) due mesi prima, a marzo. Ma milioni di sistemi nel mondo non erano stati aggiornati.

WannaCry sfruttava EternalBlue per scansionare le reti alla ricerca di sistemi vulnerabili, infettarli, cifrarne i file, e poi usarli per infettare altri sistemi. Era un **worm** oltre che un ransomware — si propagava autonomamente senza bisogno di un vettore umano.

In **quattro ore**, WannaCry aveva infettato 230.000 sistemi in 150 paesi.

### Il NHS: il caso più grave

Il caso più drammatico e visivamente impattante fu il **National Health Service** britannico. Il sistema sanitario nazionale del Regno Unito — che gestisce quasi tutti gli ospedali pubblici del paese — fu colpito in modo devastante.

I medici non riuscivano ad accedere ai file dei pazienti. I sistemi di prenotazione erano offline. Le ambulanze venivano dirottate dagli ospedali colpiti verso altri con sistemi funzionanti. Circa **80 NHS trusts** su 236 furono colpiti. Operazioni chirurgiche furono cancellate. Pazienti furono rimandati a casa.

Il problema strutturale: molti sistemi NHS giravano ancora su **Windows XP** — un sistema operativo che Microsoft aveva smesso di supportare nel 2014. Non esisteva una patch ufficiale di Microsoft per Windows XP per EternalBlue (Microsoft ne rilasciò una eccezionale proprio durante l'emergenza WannaCry).

### Marcus Hutchins e il kill switch

Il pomeriggio del 12 maggio, un ricercatore di sicurezza britannico di 22 anni che lavorava da casa nel Devon — **Marcus Hutchins**, noto online come MalwareTech — stava analizzando il codice di WannaCry.

Nel codice trovò qualcosa di insolito: il malware tentava di connettersi a un dominio specifico prima di eseguire il payload di cifratura. Se il dominio non rispondeva, il ransomware procedeva. Se il dominio rispondeva, il malware si fermava.

Il dominio era non registrato. Hutchins lo registrò per **8,29 dollari**.

In pochi minuti, i nuovi sistemi infettati da WannaCry smettevano di cifrare i file non appena si connettevano al server di Hutchins. Il kill switch funzionava.

WannaCry non fu eliminato — i sistemi già cifrati rimasero cifrati, e la propagazione continuò in modo ridotto attraverso varianti senza kill switch — ma la fase acuta dell'epidemia fu fermata da un singolo ricercatore con una registrazione di dominio da meno di 10 euro.

### L'attribuzione

Gli USA, il UK, Australia, Canada, Nuova Zelanda e Giappone attribuirono formalmente WannaCry alla **Corea del Nord** e al Lazarus Group nel dicembre 2017. WannaCry aveva caratteristiche tecniche — frammenti di codice, tecniche di offuscamento — che si sovrapponevano ad attacchi nordcoreani precedenti.

Ma c'era un'anomalia: il riscatto raccolto da WannaCry fu relativamente modesto — meno di **150.000 dollari** totali. Per un'operazione che aveva causato miliardi di danni, l'incentivo economico sembrava sproporzionato. Molti esperti concludono che WannaCry era principalmente **un'arma di distruzione** — forse testata in condizioni reali, forse distribuita più aggressivamente del previsto — piuttosto che un'operazione criminale ottimizzata per il profitto.

---

## NotPetya: non era ransomware, era un'arma di stato

Il **27 giugno 2017**, sei settimane dopo WannaCry, apparve quello che sembrava un nuovo ransomware. Si chiamava **NotPetya** — o Petya, o ExPetr, a seconda dell'analista — e usava EternalBlue come vettore di diffusione, esattamente come WannaCry.

Ma NotPetya non era ransomware. Era un **wiper** mascherato da ransomware.

### Il meccanismo

NotPetya cifrava il **Master Boot Record** del disco fisso — rendendo il sistema impossibile da avviare — e cifrava le tabelle dei file. Mostrava un messaggio di riscatto con istruzioni per pagare.

Il problema: il meccanismo di recupero era deliberatamente rotto. Non c'era chiave da consegnare. Il codice di identificazione della vittima mostrato sullo schermo era generato casualmente, non collegato a nessuna chiave crittografica. Pagare il riscatto non avrebbe mai recuperato i dati. Era progettato per distruggere, non per estorcere.

### La distribuzione: attraverso un software contabile

NotPetya si diffuse inizialmente attraverso **M.E.Doc** — un software di contabilità usato da quasi tutte le aziende che operavano in Ucraina per conformarsi ai requisiti fiscali locali. Gli attaccanti avevano compromesso il meccanismo di aggiornamento di M.E.Doc e distribuito NotPetya come aggiornamento legittimo.

Qualsiasi azienda che operava in Ucraina e usava M.E.Doc — che erano praticamente tutte — era potenzialmente vulnerabile. E attraverso le reti VPN e i sistemi condivisi di queste aziende con le loro sedi globali, NotPetya si diffuse in tutto il mondo.

### Il danno

I numeri sono quasi incomprensibili:

**Maersk** — il più grande operatore di container shipping al mondo — perse tutti i sistemi in 130 paesi. Dovette reinstallare 45.000 PC, 4.000 server e 2.500 applicazioni in 10 giorni. Usò 3 hub aeroportuali nelle Americhe come punti di distribuzione di hardware fisico. Il danno: circa **300 milioni di dollari**.

**FedEx/TNT** — la divisione TNT di FedEx, acquisita nel 2016, fu devastata. Ci vollero mesi per recuperare completamente. Il danno: circa **400 milioni di dollari**.

**Merck** — la farmaceutica americana perse sistemi di produzione critici. Non riuscì a produrre abbastanza vaccini contro l'HPV per soddisfare la domanda. Il danno: circa **870 milioni di dollari**.

**Mondelez** (produttore di Oreo e altre marche) — **135 milioni di dollari**.

Il danno totale stimato di NotPetya supera i **10 miliardi di dollari** — il più costoso singolo cyberattack della storia.

### L'attribuzione

USA, UK, Australia, Canada e altri governi attribuirono formalmente NotPetya al **GRU** — l'intelligence militare russa — nel febbraio 2018. Il vettore di distribuzione attraverso M.E.Doc era compatibile con un'operazione mirata principalmente all'Ucraina, e il timing coincideva con un'escalation del conflitto russo-ucraino.

La Russia negò qualsiasi coinvolgimento.

---

## 2019-oggi: la "Big Game Hunting"

L'evoluzione più recente del ransomware ha abbandonato il modello della distribuzione di massa per il modello della **caccia alle grandi prede**.

Invece di infettare centinaia di migliaia di utenti individuali per riscatti di 300-500 dollari, i gruppi moderni:

1. **Selezionano bersagli ad alto valore:** grandi aziende, ospedali, studi legali, governi locali, infrastrutture critiche
2. **Eseguono intrusioni manuali:** si infiltrano nella rete del target, si muovono lateralmente per settimane o mesi, mappano l'infrastruttura critica
3. **Eseguono l'attacco al momento ottimale:** distribuiscono il ransomware simultaneamente su tutti i sistemi critici
4. **Chiedono riscatti nell'ordine di milioni**

Il modello della **doppia estorsione** — introdotto da **Maze ransomware** nel 2019 — ha aggiunto un secondo livello di pressione: gli attaccanti non solo cifrano i dati, ma li esfiltrano prima di cifrare, e minacciano di pubblicarli se la vittima non paga. Questo elimina l'argomento "ho i backup, non pago".

Alcuni gruppi praticano la **tripla estorsione**: cifrano, minacciano di pubblicare, E attaccano i clienti o i partner della vittima con richieste separate.

### I gruppi più rilevanti

**REvil (Sodinokibi)** — gruppo russo-legato che colpì **Kaseya** nel luglio 2021 in un attacco supply chain che raggiunse circa 1.500 aziende simultaneamente attraverso il software di gestione IT. Richiesta iniziale: 70 milioni di dollari. Il gruppo scomparve misteriosamente nell'ottobre 2021, probabilmente dopo pressioni del governo russo (ironia della sorte) a seguito di conversazioni tra Biden e Putin sulla cybersecurity.

**Conti** — gruppo russo molto attivo tra il 2020 e il 2022, con struttura quasi corporativa interna (chat di lavoro, reparti HR, sistemi di gestione). Attaccò il sistema sanitario irlandese (**HSE**) nel 2021, causando interruzioni di servizio per settimane. Si sciolse nel 2022 dopo che le sue chat interne furono pubblicate da un ricercatore ucraino indignato dal supporto di Conti all'invasione russa.

**LockBit** — il gruppo ransomware più attivo per numero di vittime tra il 2022 e il 2024. Operava con un modello RaaS molto strutturato con programmi di affiliazione, supporto tecnico, e persino un bug bounty per trovare vulnerabilità nella propria infrastruttura. Smantellato parzialmente dall'operazione Cronos dell'FBI ed Europol nel febbraio 2024.

---

## La difesa: cosa funziona davvero

Dopo trent'anni di evoluzione del ransomware, le difese efficaci sono relativamente chiare:

**Backup offline testati regolarmente** — l'unica difesa che elimina completamente la leva del ransomware. Se hai backup recenti offline che non possono essere cifrati dall'attaccante perché non sono connessi alla rete, il ransomware perde il suo potere. Il punto critico è "testati": molte organizzazioni scoprono durante un incidente che i backup non erano funzionanti.

**Patching aggressivo** — WannaCry e NotPetya avrebbero causato danni enormemente inferiori se le organizzazioni colpite avessero applicato la patch MS17-010 nelle settimane tra il suo rilascio e gli attacchi. Il patching è noioso, complesso, a volte destabilizzante per sistemi legacy — ma è l'attività di sicurezza con il miglior rapporto tra costo e beneficio che esista.

**Segmentazione della rete** — limitare il movimento laterale. Se il ransomware non può raggiungere tutti i sistemi dalla macchina inizialmente compromessa, il danno è contenuto. La microsegmentazione e i principi Zero Trust sono le risposte architetturali.

**EDR (Endpoint Detection and Response)** — il comportamento del ransomware (cifratura massiva di file in breve tempo) è rilevabile. Gli strumenti EDR moderni possono bloccare o contenere automaticamente il ransomware prima che cifri l'intera rete.

**MFA e gestione dei privilegi** — la maggior parte delle intrusioni inizia con credenziali rubate. MFA su tutti i sistemi critici e il principio del minimo privilegio limitano drasticamente la capacità di movimento laterale degli attaccanti.

---

## Conclusione

Il ransomware è passato da un esperimento bizzarro di un biologo con bigodini in testa a un'industria criminale da miliardi di dollari in trent'anni. La traiettoria è stata abilitata da tre convergenze tecnologiche: crittografia abbastanza forte da essere inviolabile, sistemi di pagamento abbastanza anonimi da non essere tracciabili, e un modello di business (RaaS) abbastanza scalabile da coinvolgere centinaia di gruppi criminali simultaneamente.

La prossima frontiera è già visibile: ransomware che prende di mira sistemi di controllo industriale (come Stuxnet, ma con motivazione criminale invece che statale), ransomware che usa AI per personalizzare gli attacchi di social engineering iniziali, e gruppi criminali sempre più integrati con gli interessi strategici di stati nazione che li tollerano o li sponsorizzano.

Contro questa minaccia non esiste una difesa tecnologica perfetta. Esiste un processo: backup, patching, segmentazione, monitoring. Le organizzazioni che implementano questi processi rigorosa mente sopravvivono agli attacchi. Quelle che li implementano a metà, o che li sacrificano per convenienza operativa, prima o poi pagheranno il conto — spesso letteralmente.
