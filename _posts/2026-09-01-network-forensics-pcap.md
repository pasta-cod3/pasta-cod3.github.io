---
layout: post
title: "Network Forensics: ricostruire un attacco da un file pcap"
date: 2026-09-01
cat: blue
tags: [DFIR, network forensics, pcap, Wireshark, NetworkMiner, Zeek, exfiltrazione]
excerpt: "Un IDS ha generato un alert tre settimane fa e nessuno l'ha guardato. Ora bisogna capire cosa è successo esaminando il traffico catturato allora. La network forensics è l'analisi del traffico quando l'attacco è già finito."
---

C'è una differenza sottile ma importante tra il monitoraggio di rete di un SOC e la network forensics. Il monitoraggio guarda il traffico mentre accade, per decidere se bloccare o alzare un alert. La network forensics guarda un traffico già registrato, spesso settimane prima, per rispondere a una domanda molto più specifica: cosa è realmente successo in questa connessione, e cosa è stato portato fuori dalla rete.

## Cosa si cattura, e perché conta

**Full packet capture (FPC)**: registra ogni singolo pacchetto, payload incluso. È la fonte più ricca possibile, permette di ricostruire file, sessioni e comandi esatti, ma richiede uno spazio di archiviazione enorme, tipicamente sostenibile solo per pochi giorni o settimane di traffico.

**NetFlow / metadati**: registra solo i metadati di ogni connessione (IP sorgente e destinazione, porte, durata, byte trasferiti), non il contenuto. Occupa una frazione dello spazio della FPC e si può conservare per mesi, ma non permette di vedere cosa è stato effettivamente trasmesso.

La maggior parte delle organizzazioni serie usa entrambi: NetFlow a lungo termine per capire *chi ha parlato con chi*, e FPC su una finestra più corta, spesso concentrata sui segmenti più critici, per poter ricostruire *cosa si sono detti* quando serve davvero.

## Wireshark oltre l'uso quotidiano

Chi ha già familiarità con Wireshark per il monitoraggio lo userà anche qui, ma con filtri e obiettivi diversi da quelli di un'analisi in tempo reale.

**Isolare una conversazione sospetta:**

```
ip.addr == 45.132.x.x
```

**Seguire uno stream TCP per vederne il contenuto completo:**

```
Click destro su un pacchetto → Follow → TCP Stream
```

Questo ricostruisce l'intera conversazione tra client e server come se fosse un unico documento leggibile, comandi HTTP, risposte del server, payload compreso.

**Cercare richieste HTTP verso destinazioni sospette:**

```
http.request and ip.dst == 45.132.x.x
```

**Estrarre file trasferiti nel traffico:**

```
File → Export Objects → HTTP (o SMB, o altri protocolli supportati)
```

Questa funzione ricostruisce automaticamente ogni file scaricato o caricato durante la cattura, utile per recuperare un payload di seconda fase o un file esfiltrato, senza doverlo ricostruire manualmente byte a byte dallo stream.

## tshark: Wireshark da riga di comando

Per catture grandi (decine di gigabyte) l'interfaccia grafica di Wireshark diventa lenta o instabile. **tshark**, la controparte da terminale, permette di filtrare ed estrarre dati senza caricare l'intero file in memoria.

```bash
# Estrai solo le richieste DNS da una cattura enorme
tshark -r cattura.pcap -Y "dns.flags.response == 0" -T fields -e frame.time -e dns.qry.name

# Estrai tutti gli host contattati via HTTP, con timestamp
tshark -r cattura.pcap -Y "http.request" -T fields -e frame.time -e ip.dst -e http.host -e http.request.uri
```

## NetworkMiner: ricostruzione automatica

**NetworkMiner** (gratuito, Windows e Linux) prende un pcap e ricostruisce automaticamente sessioni, file trasferiti, credenziali trasmesse in chiaro e persino screenshot di pagine web visitate, organizzandoli in schede navigabili invece di richiedere l'analisi pacchetto per pacchetto.

È spesso il primo strumento da lanciare su una cattura sconosciuta, prima di scendere nel dettaglio con Wireshark su quanto emerso di interessante.

## Zeek: log strutturati invece di pacchetti grezzi

**Zeek** (ex Bro) non mostra pacchetti: trasforma il traffico catturato in log strutturati e leggibili per ogni protocollo, un approccio molto più vicino a un SIEM che a uno sniffer.

```
conn.log     → ogni connessione di rete, con durata e byte trasferiti
dns.log      → ogni query DNS effettuata
http.log     → ogni richiesta HTTP, con user agent e URI
files.log    → ogni file visto attraversare la rete, con hash calcolato
ssl.log      → ogni handshake TLS, coi certificati usati
```

Su una cattura enorme, filtrare `conn.log` per connessioni anomale (poche connessioni, ma con un volume di byte in uscita molto alto) è spesso più veloce che cercare a mano in Wireshark, ed è il modo standard con cui molti SOC di livello enterprise fanno network forensics su vasta scala.

## Riconoscere l'esfiltrazione dati

Alcuni pattern ricorrono quasi sempre in una esfiltrazione riuscita:

- **Volume asimmetrico**: molto più traffico in uscita che in entrata verso una singola destinazione, il contrario del normale traffico di navigazione
- **Orari anomali**: trasferimenti nel cuore della notte o durante festività, quando il traffico legittimo è quasi nullo
- **Protocolli usati in modo insolito**: DNS con query lunghissime e frequenti (DNS tunneling), o traffico HTTPS verso un IP invece che verso un dominio
- **Compressione o cifratura del payload**: un archivio protetto da password inviato via email o upload, per evitare il rilevamento tramite ispezione del contenuto

```
Esempio in conn.log (Zeek):
2026-09-04 03:14:22  10.0.2.15  →  185.220.x.x:443   duration=1847s  bytes_out=2.3GB  bytes_in=4KB
```

Una singola connessione HTTPS di oltre 30 minuti, che trasferisce 2,3 GB in uscita e quasi nulla in entrata, alle tre di notte: è esattamente il pattern che un analista di network forensics impara a cercare per primo.

## Conclusione

La network forensics parte sempre da una domanda specifica, non da "analizziamo tutto il traffico": cosa ha fatto questo host in questa finestra di tempo, con chi ha parlato, cosa è uscito dalla rete. Wireshark e tshark restano gli strumenti di base, NetworkMiner accelera la ricostruzione quando il tempo stringe, e Zeek diventa indispensabile quando i pacchetti grezzi sono semplicemente troppi da guardare uno a uno.

Nell'ultimo articolo del modulo si chiude il cerchio: tutto quello che si è acquisito, analizzato e ricostruito va scritto in un report che qualcuno che non era presente, un giudice, un dirigente, un cliente, possa leggere e considerare credibile.
