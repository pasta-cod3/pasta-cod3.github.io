---
layout: post
title: "Wireshark: leggere cosa si dicono davvero i pacchetti"
description: "Guida pratica a Wireshark: catturare traffico, usare i filtri di visualizzazione, seguire uno stream TCP e riconoscere pattern sospetti nel traffico di rete."
date: 2026-02-10
categoria: Blue Team
tags: [wireshark, network-analysis, pcap, tcp, dns, forensics, blue-team]
---

Wireshark è stato il primo strumento che mi ha fatto sentire davvero un "hacker" — nel senso buono. Ricordo la sensazione quasi magica di aprire una cattura e vedere, riga dopo riga, tutto ciò che il mio computer stava dicendo alla rete senza chiedermi il permesso. È stato lì che ho capito una cosa fondamentale: **la rete non mente**. Un malware può nascondersi da un antivirus, offuscarsi, cancellare i suoi log — ma se deve comunicare con l'esterno, quei pacchetti passano. E se stai guardando, li vedi.

## Cos'è Wireshark

Wireshark è un **analizzatore di protocolli di rete**: cattura i pacchetti che transitano su un'interfaccia e te li mostra decodificati, livello per livello, dallo strato fisico fino ai dati applicativi. È gratuito, open source, e disponibile su Windows, Linux e macOS.

Una precisazione importante: catturare traffico di rete che non è tuo, o su reti che non ti appartengono, **è illegale** nella maggior parte delle giurisdizioni. Usa Wireshark sulla tua rete, in laboratorio, o in contesti dove hai esplicita autorizzazione. Il "defensive first" del nostro approccio vale anche qui.

## La prima cattura

Apri Wireshark, scegli l'interfaccia (di solito quella con il grafico che "si muove" indica traffico attivo) e clicca sull'icona della pinna per iniziare a catturare. Vedrai le righe scorrere. Clicca sul quadrato rosso per fermare.

Se preferisci la riga di comando — utilissima su server senza interfaccia grafica — c'è `tshark`, il fratello CLI di Wireshark:

```bash
# Cattura 100 pacchetti sull'interfaccia eth0 e salvali in un file
tshark -i eth0 -c 100 -w cattura.pcap

# Analizza un file pcap già esistente mostrando solo i dettagli utili
tshark -r cattura.pcap -T fields \
  -e frame.time -e ip.src -e ip.dst -e _ws.col.Protocol
```

Il file `.pcap` (o `.pcapng`) è il formato standard: lo puoi salvare, condividere col team, e riaprire in Wireshark con la comodità dell'interfaccia grafica.

## I filtri: qui inizia il vero potere

Una cattura di rete reale contiene migliaia di pacchetti al secondo. Guardarli tutti è impossibile. La chiave di Wireshark sono i **display filter**, che nascondono tutto tranne ciò che ti interessa.

Attenzione a non confonderli con i *capture filter* (sintassi BPF, applicati *prima* della cattura). I display filter si applicano *dopo*, sui dati già catturati, e usano una sintassi diversa. Ecco quelli che uso praticamente ogni giorno:

```text
# Solo traffico da o verso un IP specifico
ip.addr == 192.168.1.50

# Solo traffico HTTP
http

# Solo query DNS
dns.flags.response == 0

# Solo pacchetti TCP con il flag SYN (inizio connessione)
tcp.flags.syn == 1 && tcp.flags.ack == 0

# Escludere il rumore di fondo (broadcast, ARP)
!(arp || icmp)

# Cercare una stringa nel payload (utile per credenziali in chiaro)
frame contains "password"
```

Combinandoli con gli operatori logici (`&&`, `||`, `!`) puoi passare da migliaia di pacchetti a una manciata rilevante in pochi secondi.

## Seguire uno stream

Il singolo pacchetto racconta poco. La conversazione completa racconta tutto. Cliccando con il tasto destro su un pacchetto TCP e scegliendo **Follow → TCP Stream**, Wireshark ricostruisce l'intero dialogo tra i due host in un'unica finestra leggibile.

È qui che il traffico non cifrato mostra tutti i suoi segreti: richieste HTTP complete, credenziali inviate in chiaro, comandi impartiti a un server. È anche il momento in cui capisci *davvero* perché HTTPS è così importante — perché senza cifratura, chiunque sulla tratta legge tutto.

## Riconoscere pattern sospetti

Con un po' di occhio, alcune cose iniziano a saltare fuori da sole. Ecco i segnali che mi fanno drizzare le antenne:

- **Beaconing**: connessioni verso lo stesso IP a intervalli regolarissimi (es. ogni 60 secondi esatti). È il classico comportamento di un malware che "chiama casa" verso un server C2.
- **DNS anomalo**: query verso domini lunghissimi e dall'aspetto casuale, o un volume abnorme di richieste DNS. Può indicare *DNS tunneling* (esfiltrazione di dati mascherata da query DNS).
- **Trasferimenti in uscita insoliti**: grandi quantità di dati che *escono* dalla rete verso destinazioni sconosciute, magari in orari notturni.
- **Protocolli su porte sbagliate**: traffico che sembra HTTP ma su una porta strana, o cifrato dove non dovrebbe esserlo.

Per il beaconing, un trucco veloce con `tshark` per contare le connessioni verso ogni destinazione:

```bash
# Top 10 destinazioni per numero di pacchetti
tshark -r cattura.pcap -T fields -e ip.dst \
  | sort | uniq -c | sort -rn | head -10
```

Se un IP esterno che non riconosci è in cima alla lista con connessioni ritmiche, hai qualcosa da indagare.

## Statistiche: la panoramica dall'alto

Prima di tuffarti nei singoli pacchetti, il menu **Statistics** di Wireshark ti dà una fotografia d'insieme preziosissima:

- **Protocol Hierarchy** — quali protocolli compongono il traffico e in che percentuale.
- **Conversations** — chi parla con chi, e quanto.
- **Endpoints** — tutti gli host coinvolti.

Io parto quasi sempre da qui: prima capisco la forma generale del traffico, poi scendo nel dettaglio dove qualcosa stona.

---

Wireshark ha una curva d'apprendimento onesta: i primi giorni ti sembrerà di annegare in un mare di pacchetti incomprensibili. Poi, un po' alla volta, il rumore diventa segnale. Inizi a "leggere" una cattura come si legge un testo, e i pattern anomali ti saltano all'occhio prima ancora di analizzarli a fondo. Il mio consiglio: apri Wireshark sulla tua rete di casa stasera, guarda cosa fanno i tuoi dispositivi quando pensi siano "fermi". Rimarrai sorpreso da quanto chiacchierano.

Con questo chiudiamo la nostra serie sulle fondamenta del Blue Team: dal threat hunting all'analisi del traffico, hai ora una cassetta degli attrezzi concreta per iniziare a difendere sul serio. Il resto è pratica, curiosità, e quella sana paranoia che, in questo mestiere, non è un difetto ma una virtù. 📡
