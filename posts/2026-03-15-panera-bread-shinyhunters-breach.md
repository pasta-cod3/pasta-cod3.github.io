# Panera Bread: ShinyHunters pubblica 5,1 milioni di account dopo estorsione fallita

## Il fatto

A fine gennaio 2026, il gruppo criminale **ShinyHunters** ha rivendicato il furto di dati da Panera Bread, la catena americana di panetterie e caffetterie con oltre 2.000 locali negli Stati Uniti. Dopo che l'estorsione è fallita — Panera non ha pagato il riscatto — gli attaccanti hanno pubblicato un archivio da circa **760 MB** su siti di data leak.

L'analisi condotta da **Have I Been Pwned** di Troy Hunt ha rilevato che l'archivio contiene circa **5,1 milioni di account unici** — significativamente meno dei 14 milioni rivendicati da ShinyHunters, ma comunque un numero sufficiente a colpire milioni di clienti reali.

---

## Chi sono ShinyHunters

ShinyHunters non è un nome nuovo. Il gruppo è responsabile di alcune delle breach più significative degli ultimi anni:

- **Tokopedia (2020):** 91 milioni di account
- **Wattpad (2020):** 271 milioni di account
- **AT&T (2024):** 70 milioni di record
- **Ticketmaster (2024):** 560 milioni di record
- **Match Group / app di dating (gennaio 2026)**
- **Crunchbase (gennaio 2026)**

Il pattern è sempre simile: esfiltrazione, richiesta di riscatto, pubblicazione se non pagato. Nel caso di Panera, il riscatto non è stato pagato e i dati sono stati pubblicati.

---

## Cosa è stato esposto

L'archivio pubblicato contiene:

- Indirizzi email dei clienti
- Nomi e cognomi
- Numeri di telefono
- Indirizzi fisici
- Hash delle password (il tipo di hashing non è stato confermato)
- Storico degli ordini e preferenze alimentari

---

## Il vettore: AppsFlyer come punto d'ingresso

Secondo quanto riportato da ShinyHunters stessi, il punto di ingresso sarebbe stato **AppsFlyer** — una piattaforma di marketing analytics per app mobile usata da Panera. Questo segue lo stesso schema di altre breach recenti dove non è l'azienda principale ad essere compromessa direttamente, ma un fornitore terzo con accesso ai suoi dati.

Il pattern "compromissione della supply chain" è diventato il vettore dominante per le breach aziendali: anziché attaccare il perimetro ben difeso di una grande azienda, gli attaccanti prendono di mira i fornitori con misure di sicurezza più deboli che hanno però accesso ai dati del target primario.

---

## Non è la prima volta per Panera

Questa non è la prima breach di Panera. Nel 2018, un ricercatore di sicurezza aveva scoperto che il sito web di Panera esponeva in chiaro i dati di milioni di clienti attraverso un'API non autenticata — e la vulnerabilità era stata ignorata per mesi dopo la prima segnalazione.

---

## Cosa fare se sei cliente Panera

- Cambia la password del tuo account Panera Bread
- Se usi la stessa password altrove, cambiala anche lì
- Verifica su Have I Been Pwned se la tua email è nell'archivio
- Attenzione a email di phishing che usano il tuo nome reale e storico ordini

---

## Conclusione

Il caso Panera è un caso di studio sulla doppia estorsione e sul rischio dei fornitori terzi. Anche se Panera non ha ceduto al ricatto, i suoi clienti pagano il prezzo della compromissione. La sicurezza di un'azienda è tanto forte quanto il suo anello più debole — e quel anello è sempre più spesso un fornitore di servizi di terze parti.
