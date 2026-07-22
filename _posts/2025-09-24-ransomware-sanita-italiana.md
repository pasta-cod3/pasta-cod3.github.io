---
layout: post
title: "Ospedali sotto attacco: perché la sanità italiana è nel mirino del ransomware"
date: 2025-09-24
cat: red
tags: [ransomware, sanità, ospedale, SECTOR16, supply-chain, ACN]
excerpt: "Dal 2023 una media di 3,5 attacchi al mese contro ospedali italiani. Perché il settore sanitario è il bersaglio preferito del ransomware e cosa si può fare per difendersi."
---

Quando un ransomware colpisce un'azienda manifatturiera, si fermano le linee produttive. Quando colpisce un ospedale, si fermano le terapie. È per questo che la sanità è diventata il settore più redditizio per i gruppi criminali: le vittime non possono permettersi di aspettare.

## I numeri in Italia

Secondo l'**Agenzia per la Cybersicurezza Nazionale**, dal gennaio 2023 si registrano in media **3,5 attacchi al mese** contro ospedali e aziende sanitarie italiane. Gli episodi sono passati da 27 a 57 in un anno, con un incremento del 111%.

Nei primi nove mesi del 2025, le minacce principali rilevate sono state: scansione su credenziali, phishing, compromissione email, esposizione dati. Il vettore email rimane il punto d'ingresso principale.

## Il caso SECTOR16 (maggio 2025)

Il gruppo hacktivista **SECTOR16** — attivo da inizio 2025, noto per attacchi a sistemi SCADA nel settore energetico USA — ha rivendicato su Telegram un data breach contro un ospedale italiano non identificato. Probabile vettore di accesso: un servizio **RDP esposto su internet**, non protetto da MFA, che ha permesso accesso diretto alla macchina.

> Il settore sanitario detiene il record di costi per violazione dei dati per il quattordicesimo anno consecutivo. Media 2025: **7,42 milioni di dollari per breach**.

## Perché gli ospedali sono vulnerabili

**Sistemi HIS obsoleti** — molti Information Systems ospedalieri girano su Windows non supportati, non aggiornabili per ragioni di certificazione del software medico.

**Dispositivi IoMT non gestiti** — apparecchiature di imaging, monitor cardiaci, pompe per infusione: firmware non aggiornabile, comunicazione in rete senza autenticazione.

**Supply chain** — nel 2024 un singolo attacco supply chain ha causato 31 incidenti in altrettante strutture italiane.

## Difesa pratica

- **Segmentazione di rete** — isolare i dispositivi IoMT dalla rete amministrativa
- **MFA su RDP e VPN** — eliminare accessi remoti con sola password
- **Backup offline testato** — il backup online non protegge dal ransomware
- **Piano di Business Continuity** — protocolli cartacei per il pronto soccorso in caso di downtime digitale
- **Formazione del personale** — il phishing email è il vettore n.1
