# La Commissione Europea violata tramite vulnerabilità Ivanti: nomi e telefoni del personale esposti

## Il fatto

Il 6 febbraio 2026, la Commissione Europea ha comunicato ufficialmente una violazione dei propri sistemi informatici. Il sistema di gestione dei dispositivi mobili (**MDM — Mobile Device Management**) dell'istituzione è stato compromesso, con potenziale accesso a nomi e numeri di telefono del personale.

La detection è avvenuta il 30 gennaio 2026, quando l'infrastruttura MDM ha rilevato tracce di un attacco. La Commissione ha contenuto l'incidente e ripulito i sistemi in meno di **9 ore** dall'identificazione — un tempo di risposta notevole per un'istituzione della sua dimensione.

---

## Il vettore: Ivanti Endpoint Manager Mobile

I report hanno collegato l'attività a vulnerabilità in **Ivanti Endpoint Manager Mobile (EPMM)**, precedentemente noto come MobileIron. Ivanti aveva pubblicato un advisory di sicurezza il 29 gennaio 2026 — appena un giorno prima che la Commissione rilevasse il compromesso.

Questo timing non è casuale: gli attaccanti monitorano sistematicamente i bollettini di sicurezza e i rilasci di patch per identificare i sistemi non ancora aggiornati. La finestra tra la pubblicazione di un advisory e l'applicazione della patch è diventata il momento di massimo rischio.

La CISA aveva già aggiunto vulnerabilità Ivanti EPMM al proprio catalogo KEV in precedenza. Le soluzioni Ivanti — Pulse Connect Secure, EPMM, Sentry — hanno avuto una serie di vulnerabilità critiche negli ultimi anni che le hanno rese bersagli preferiti di attori avanzati, inclusi gruppi sponsorizzati da stati.

---

## Cosa è stato esposto

La Commissione ha dichiarato che gli intrusi **potrebbero aver avuto accesso** a:
- Nomi del personale
- Numeri di telefono dei dispositivi mobili aziendali

Non sono stati confermati compromessi ai dispositivi mobili stessi, né accesso a contenuti di comunicazioni, email, o documenti. L'infrastruttura MDM gestisce la configurazione e l'enrollment dei dispositivi — non necessariamente i loro contenuti.

---

## Il contesto: la Commissione nel mirino

La Commissione Europea non è un target casuale. È l'organo esecutivo dell'Unione Europea, coinvolto in:

- Negoziazioni commerciali con USA, Cina, e altri
- Sanzioni contro la Russia
- Regolamentazione dell'AI e del digitale (AI Act, GDPR, NIS2, DSA)
- Coordinamento delle risposte alle crisi geopolitiche

I dati del personale — anche solo nomi e telefoni — possono essere usati per:
- Spear phishing mirato
- Vishing verso dipendenti con accesso a dati sensibili
- Identificazione di target di alto valore per campagne di intelligence

---

## Il tempismo: il pacchetto cybersecurity della Commissione

C'è un'ironia nella tempistica dell'incidente. Il 20 gennaio 2026 — dieci giorni prima del breach rilevato — la Commissione Europea aveva annunciato il proprio **pacchetto sulla cybersecurity**, un insieme di misure per rafforzare la resilienza cyber delle istituzioni europee.

Il breach che ha seguito quasi immediatamente questo annuncio illustra la distanza che spesso esiste tra l'annuncio di politiche di sicurezza e la loro effettiva implementazione nei sistemi operativi quotidiani.

---

## Ivanti: un problema sistemico

Questo non è un incidente isolato legato a Ivanti. Il pattern negli ultimi due anni è consistente:

| Data | Vulnerabilità Ivanti | Attori |
|---|---|---|
| 2024 | CVE-2024-21887 (Pulse Secure RCE) | APT cinesi, ransomware |
| 2024 | CVE-2024-8963 (EPMM auth bypass) | Molteplici |
| 2025 | CVE-2025-0282 (Ivanti Connect Secure) | Threat actor statali |
| Gen 2026 | CVE-2026-1603 (EPMM auth bypass) | Aggiunti KEV CISA |

La raccomandazione dei ricercatori di sicurezza è diventata sempre più netta: le organizzazioni con profilo di rischio elevato dovrebbero valutare alternative ai prodotti Ivanti o implementare controlli compensativi molto robusti.

---

## La risposta

La Commissione ha dichiarato di aver:
- Contenuto l'incidente e pulito i sistemi in meno di 9 ore
- Avviato una revisione forense per mappare l'accesso
- Aumentato monitoring e controlli difensivi
- Tenuto informata l'agenzia CERT-EU

---

## Conclusione

Il breach della Commissione Europea è un caso emblematico di come anche le istituzioni con risorse significative per la sicurezza possano essere colpite tramite vulnerabilità nelle soluzioni di terze parti. La rapidità di risposta (9 ore) è da lodare — ma la prevenzione richiede tempi di patching che tengano il passo con la velocità degli attaccanti.
