---
layout: post
title: "Anti-Forensics: come un attaccante prova a sparire, e come lo si scopre"
date: 2026-08-07
cat: blue
tags: [DFIR, anti-forensics, timestomping, log wiping, steganografia, contromisure]
excerpt: "Ogni tecnica per cancellare le tracce lascia a sua volta una traccia: il tentativo stesso. Timestomping, wiping dei log e cifratura non rendono un attaccante invisibile, lo rendono soltanto un po' più lento da scoprire, e spesso più facile da individuare come tale."
---

Un file critico ha un timestamp di creazione più vecchio del sistema operativo su cui si trova. Un log di sicurezza si interrompe esattamente nella finestra temporale dell'attacco, per poi riprendere normalmente subito dopo. Un disco intero risulta cifrato senza che nessuna policy aziendale lo richieda. Nessuno di questi tre casi è una coincidenza: sono tre firme classiche di tecniche anti-forensi, e ognuna lascia il proprio segno rilevabile per chi sa cosa cercare.

Questo articolo copre le tecniche anti-forensi più comuni e, per ciascuna, il modo in cui un analista le identifica.

## Timestomping: alterare i timestamp dei file

Il **timestomping** consiste nel modificare artificialmente i timestamp di un file (creazione, modifica, accesso) per farlo sembrare più vecchio o più recente di quanto sia realmente, spesso per nascondere quando un malware è stato effettivamente scritto sul disco.

```
# Windows: strumenti come SetMACE o timestomp (Metasploit) modificano MACE
# Linux: touch -d
touch -d "2024-01-15 10:00:00" /tmp/malware.bin
```

Il punto debole di questa tecnica è che raramente riesce a modificare **tutti** i timestamp in modo perfettamente coerente tra loro e con il resto del sistema:

- Su NTFS, oltre ai timestamp visibili in `$STANDARD_INFORMATION` (quelli che Explorer mostra e che il timestomping tipicamente altera), esiste una seconda copia in `$FILE_NAME`, meno nota e più raramente falsificata, perché richiede accesso a un livello più basso del filesystem. Una discrepanza tra le due è un indicatore quasi certo di manomissione.
- Su Linux, come visto nell'articolo sugli artefatti Linux, il `ctime` cambia automaticamente ogni volta che i metadati di un file vengono toccati, incluso l'uso di `touch` per modificare gli altri timestamp: un `ctime` molto più recente di un `mtime` "ripulito" è un segnale evidente.

## Log wiping: cancellare le prove dirette

```bash
# Windows: svuotare i log eventi
wevtutil cl Security

# Linux: troncare invece di cancellare, per non lasciare un vuoto sospetto
> /var/log/auth.log
```

Cancellare completamente un log (invece di modificarne solo il contenuto) genera un evento a sua volta: su Windows, la cancellazione del log di sicurezza produce essa stessa un **Event ID 1102** ("Il registro di controllo è stato cancellato"), che finisce tipicamente in un log diverso non toccato dall'attaccante. Un log di sicurezza assente o con un ID 1102 non spiegato da un'attività amministrativa legittima è di per sé una delle prove più forti di attività malevola in corso.

Su Linux, un file di log troncato a zero byte o con una dimensione anomalmente piccola rispetto al normale ciclo di rotazione (confrontabile con i log dei giorni precedenti) è altrettanto sospetto quanto la sua totale assenza.

## Cifratura e wiping sicuro del disco

La cifratura di un intero volume (con strumenti come VeraCrypt o BitLocker attivato manualmente su un sistema dove non era policy aziendale) o un wiping sicuro multi-passata di uno specifico file possono rendere di fatto irrecuperabile il contenuto originale. In questi casi, l'obiettivo dell'analisi si sposta: non più recuperare il contenuto cifrato o sovrascritto, ma dimostrare **che l'azione stessa è avvenuta**, cosa spesso possibile anche quando il contenuto no.

Prefetch, Amcache e ShimCache (visti nell'articolo sul Registry Forensics) registrano l'esecuzione dello strumento di cifratura o wiping stesso, con relativo timestamp: anche senza recuperare un singolo byte del contenuto originale, si può comunque dimostrare che un tool come VeraCrypt o un wiper è stato eseguito su quella macchina in un momento coerente con l'incidente.

## Steganografia: nascondere dati dentro altri dati

La steganografia nasconde informazioni all'interno di file apparentemente innocui (un'immagine, un file audio), sfruttando gli ultimi bit meno significativi di ogni pixel o campione, impercettibili a occhio o orecchio ma sufficienti a trasportare piccoli quantitativi di dati.

```bash
# steghide, uno strumento comune per estrarre contenuto steganografato
steghide extract -sf immagine_sospetta.jpg
```

Il sospetto nasce raramente dall'osservazione diretta del file (che appare del tutto normale), ma da segnali indiretti: una dimensione del file significativamente più grande di quanto ci si aspetterebbe per quel tipo di contenuto, oppure la presenza dello strumento steganografico stesso negli artefatti di esecuzione della macchina.

## Anti-forensics contro la memoria RAM

Alcuni malware più sofisticati provano a rilevare quando sono in esecuzione dentro una macchina virtuale o un ambiente di analisi (sandbox evasion), e si comportano diversamente o si disattivano per non lasciare comportamenti osservabili. È una forma di anti-forensics preventiva: non cancellare le tracce dopo, ma evitare di generarle mentre viene osservato. Per questo un'analisi dinamica seria, come si vedrà più avanti nel modulo dedicato al malware, richiede ambienti che riducano al minimo i segnali rilevabili come "sandbox" da parte del campione stesso.

## Il principio che regge tutto il capitolo

Ogni tecnica anti-forense qui descritta condivide una debolezza strutturale: agisce **dopo** che il sistema ha già registrato l'evento originale in più punti diversi, e quasi mai riesce a intervenire su tutti contemporaneamente in modo perfettamente coerente. Un attaccante che cancella un log dimentica l'evento che ne conferma la cancellazione. Uno che altera un timestamp raramente aggiorna anche la copia meno nota dello stesso timestamp. L'anti-forensics non rende invisibili: aggiunge un secondo strato di prove, quello del tentativo stesso di nascondersi.

## Checklist essenziale

```
✅ Discrepanza tra $STANDARD_INFORMATION e $FILE_NAME (NTFS) → timestomping
✅ ctime più recente di mtime (Linux)                         → possibile touch manipolato
✅ Event ID 1102 o log assenti/troncati senza spiegazione     → log wiping
✅ Esecuzione di tool di cifratura/wiping in Amcache/Prefetch → azione dimostrabile anche senza contenuto
✅ Dimensione file anomala rispetto al tipo di contenuto      → possibile steganografia
```

## Conclusione

L'anti-forensics cambia la domanda a cui un'indagine deve rispondere, ma raramente la rende impossibile. Quando il contenuto non è più recuperabile, restano quasi sempre le tracce del tentativo di renderlo tale, e in molti casi sono proprio quelle tracce, più che il contenuto originale, a reggere meglio in un contesto investigativo.

Con questo si chiude il modulo dedicato agli artefatti specifici di sistema. Il prossimo modulo entra nel merito di ciò che quegli artefatti spesso rivelano per primi: il malware stesso, a partire da come lo si analizza senza eseguirlo.
