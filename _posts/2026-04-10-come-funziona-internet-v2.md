---
layout: post
title: "Come funziona Internet — approfondimento: BGP, Anycast e la resilienza della rete"
date: 2026-04-10
cat: fond
tags: [internet, BGP, anycast, routing, infrastruttura, fondamentali]
excerpt: "Secondo capitolo sull'infrastruttura di Internet: come il routing BGP decide il percorso dei pacchetti, cos'è Anycast e perché Internet sopravvive ai guasti."
---

Nel primo articolo su come funziona Internet abbiamo visto il percorso di un pacchetto dal tuo browser al server: DNS, TCP/IP, TLS, HTTP. Oggi entriamo più in profondità nell'infrastruttura stessa — quella parte invisibile che decide *quale strada* fanno i tuoi dati, come viene gestita la ridondanza e perché Internet non ha un singolo punto di failure.

## La struttura di Internet: una rete di reti

Internet non è un'unica rete. È una **federazione di migliaia di reti autonome**, ognuna gestita da un'organizzazione diversa: ISP, aziende, università, governi, CDN. Ogni rete ha un identificatore unico chiamato **ASN — Autonomous System Number**.

Il tuo provider di casa (Telecom, Fastweb, Vodafone) è un AS. Google è un AS. Cloudflare è un AS. L'Università di Bologna è un AS. La connessione tra AS diversi avviene in punti fisici chiamati **IXP — Internet Exchange Point**: sale piene di rack dove i cavi di AS diversi si incrociano e i router si scambiano traffico.

In Italia il principale IXP è il **MIX di Milano**. A livello europeo i più grandi sono DE-CIX a Francoforte e AMS-IX ad Amsterdam. Ogni volta che accedi a un servizio italiano da una rete italiana, i tuoi pacchetti probabilmente non escono mai dall'Italia — passano per questi exchange point locali.

## BGP: il protocollo che instrada Internet

All'interno di una singola rete (un AS), il routing funziona con protocolli come OSPF o IS-IS. Ma tra AS diversi esiste un solo protocollo di routing: **BGP — Border Gateway Protocol**.

BGP è il protocollo più critico e meno conosciuto di Internet. È lui che decide quale AS attraversano i tuoi pacchetti per arrivare a destinazione. Funziona su connessioni TCP ed è fondamentalmente basato sulla **fiducia**: ogni AS annuncia al mondo i prefissi IP che possiede e i vicini con cui è connesso. Gli altri AS aggiornano le proprie tabelle di routing in base a questi annunci.

### Come si legge una tabella BGP

```
# Esempio semplificato di route BGP
# AS_PATH: sequenza di AS attraversati per raggiungere il prefisso
# NEXT_HOP: prossimo router da contattare

Prefix          Next Hop       AS_PATH
1.1.1.0/24      203.0.113.1    13335          # Cloudflare
8.8.8.0/24      198.51.100.2   15169          # Google
93.184.216.0/24 192.0.2.5      15133 2914     # Edgecast via NTT
```

Quando un router BGP deve scegliere tra più percorsi per raggiungere un prefisso, applica una serie di regole — il **BGP decision process** — che considera attributi come lunghezza dell'AS_PATH, LOCAL_PREF, MED e altri. In pratica, la strada più corta in termini di hop tra AS tende a essere preferita, ma operatori diversi possono configurare policy diverse per motivi economici o tecnici.

> **⚠ BGP HIJACKING** — BGP si basa sulla fiducia: chiunque gestisca un AS può annunciare qualsiasi prefisso. Nel 2010 China Telecom annunciò per errore 37.000 prefissi IP redirigendo traffico globale attraverso la Cina per 18 minuti. Nel 2022 un attore malevolo reindirizzò traffico diretto a Coinbase e altri target. La mitigazione moderna si chiama **RPKI — Resource Public Key Infrastructure**: una PKI che certifica quale AS ha il diritto di annunciare ogni prefisso.

## Anycast: un indirizzo, mille server

Sai che quando digiti `1.1.1.1` stai raggiungendo Cloudflare? Ma sai *quale* server di Cloudflare? Probabilmente quello più vicino a te — geograficamente e in termini di latenza di rete. Questo è possibile grazie ad **Anycast**.

Con Anycast, lo stesso indirizzo IP viene annunciato tramite BGP da decine o centinaia di server distribuiti nel mondo. Quando il tuo pacchetto arriva su Internet, il routing BGP lo dirige automaticamente verso il server più vicino secondo le tabelle di routing degli AS intermedi. Non c'è un DNS che decide, non c'è un load balancer centrale: è la struttura stessa di Internet che smista.

| Tecnologia | Come funziona | Caso d'uso principale |
|------------|---------------|----------------------|
| Unicast    | Un indirizzo → un server | Server normali, comunicazione punto-punto |
| Anycast    | Un indirizzo → il server più vicino | DNS, CDN, DDoS mitigation |
| Multicast  | Un indirizzo → un gruppo di destinatari | Streaming video interno, IPTV |
| Broadcast  | Un indirizzo → tutti nella rete locale | ARP, DHCP discovery |

Anycast è usato da tutti i resolver DNS pubblici: `1.1.1.1` (Cloudflare), `8.8.8.8` (Google), `9.9.9.9` (Quad9). È usato dai root server DNS — i 13 server che formano il vertice del sistema DNS globale sono in realtà centinaia di macchine distribuite nel mondo, raggiungibili tutte con gli stessi 13 indirizzi IP. È usato da Cloudflare per assorbire attacchi DDoS: il traffico malevolo viene distribuito automaticamente tra tutti i PoP della rete senza sovraccaricare nessun singolo nodo.

## Perché Internet non ha un singolo punto di failure

Torniamo alla domanda fondamentale: perché Internet sopravvive ai guasti? La risposta ha tre componenti.

### 1. Ridondanza fisica

I cavi sottomarini, i PoP degli ISP, gli IXP — tutte le infrastrutture critiche sono replicate. Quando nel gennaio 2022 un cavo sottomarino si è rotto vicino a Tonga, l'isola ha perso il 94% della connettività per settimane — ma è rimasta connessa attraverso un percorso alternativo via satellite. Il cavo era un single point of failure che tutti conoscevano ma che non era stato mitigato.

### 2. Routing dinamico con BGP

Se un link BGP cade, i router che lo utilizzano rimuovono le route corrispondenti e le ricalcolano attraverso percorsi alternativi. Il processo di convergenza BGP può richiedere da secondi a minuti, durante i quali alcune destinazioni possono risultare temporaneamente irraggiungibili — ma poi il traffico trova un nuovo percorso automaticamente.

### 3. Architettura decentralizzata

Non esiste un "server centrale di Internet" da spegnere. I DNS root server sono distribuiti. I protocolli di routing sono distribuiti. La governance è distribuita tra IANA, RIR regionali, ICANN, IETF. Questa frammentazione è a volte frustrante dal punto di vista organizzativo, ma è il motivo per cui Internet ha resistito a disastri naturali, guasti tecnici e attacchi.

> **📊 I NUMERI DI BGP OGGI** — La tabella di routing globale BGP contiene circa **950.000 prefissi IPv4** e oltre 200.000 prefissi IPv6 (luglio 2026). Ogni router di core Internet mantiene questa tabella in memoria e aggiorna le sue route centinaia di volte al secondo. La crescita della tabella BGP è un problema noto: i router devono avere RAM sufficiente per tenerla, e i produttori di hardware di rete pianificano upgrade ogni pochi anni.

## Implicazioni per la sicurezza

Capire BGP e Anycast non è solo accademia — ha implicazioni dirette per chi lavora in sicurezza informatica.

- **BGP hijacking** — un attaccante che controlla un AS può reindirizzare traffico verso di sé, intercettarlo (Man-in-the-Middle a scala Internet) o scartarlo (blackhole). Senza RPKI, è difficile da rilevare in tempo reale.
- **Prefix filtering** — una misconfiguration BGP può causare un "route leak". È successo con Facebook nel 2021: i BGP update errati hanno rimosso i prefissi di Facebook dalla tabella globale, rendendola irraggiungibile per 6 ore.
- **DDoS e Anycast** — Cloudflare, Akamai e altri usano Anycast per distribuire il traffico DDoS su decine di PoP. Un attacco volumetrico viene assorbito da una rete globale con capacità aggregata nell'ordine dei Tbps.
- **Geofencing e censura** — gli stati che vogliono filtrare traffico lo fanno spesso a livello BGP, facendo annunciare ai propri ISP prefissi che "attirano" il traffico verso sistemi di ispezione. Il Great Firewall cinese funziona in parte così.

## Strumenti per esplorare BGP

Se vuoi vedere BGP in azione, alcuni tool pubblici sono molto utili:

- **[bgp.he.net](https://bgp.he.net)** — Hurricane Electric BGP Toolkit: route di qualsiasi AS, prefissi annunciati, peer
- **[bgpview.io](https://bgpview.io)** — lookup per IP, ASN, prefissi; visualizza l'AS path completo
- **[stat.ripe.net](https://stat.ripe.net)** — RIPE NCC Statistics: dati in tempo reale su routing, visibilità prefissi, eventi BGP
- **[routeviews.org](https://www.routeviews.org)** — accesso telnet a router BGP reali per vedere le tabelle di routing globali

Cerca l'ASN di Cloudflare (`AS13335`) su bgpview.io — vedrai tutti i prefissi che annunciano e una mappa degli AS con cui si interconnettono. È il modo più concreto per capire quanto è grande e distribuita l'infrastruttura di un singolo attore.

## Conclusione

Internet è una macchina straordinariamente complessa che funziona in modo sorprendentemente robusto — non perché qualcuno l'abbia progettata per essere infallibile, ma perché i protocolli su cui si basa (TCP/IP, BGP, DNS) sono progettati per adattarsi ai guasti in modo automatico. BGP è al tempo stesso la colla che tiene unito il tutto e uno dei vettori di rischio più sottovalutati: un singolo errore di configurazione in un AS può causare interruzioni a scala globale.

Comprendere questa infrastruttura è fondamentale sia per chi lavora in networking sia per chi fa sicurezza offensiva o difensiva: sapere come i pacchetti vengono instradati, dove possono essere intercettati e come funziona la fiducia tra AS è il prerequisito per ragionare seriamente su attacchi e difese a livello di rete.
