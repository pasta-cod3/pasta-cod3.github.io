---
layout: post
title: "Android 17: ECH (Encrypted Client Hello) rende il tracking del browser molto più difficile"
date: 2026-06-30
cat: blue
tags: ["Android 17", "privacy", "ECH", "TLS", "encryption", "tracking prevention"]
excerpt: "Android 17 introduces native support for ECH (Encrypted Client Hello), a TLS extension that encrypts the SNI (Server Name Indication) field. This makes it much harder for network observers, ISPs, and middleboxes to profile user browsing behavior."
---

# Android 17: ECH encrypts the handshake, making tracking harder

## Cosa è cambiato

Con il rilascio di **Android 17** a giugno 2026, Google ha abilitato di default il supporto per **ECH (Encrypted Client Hello)** in Chrome e nei browser Chromium-based su Android. 

Per la prima volta, su larga scala, gli utenti hanno una **difesa nativa contro il network-level tracking**.

---

## Il problema: SNI in chiaro

Quando ti connetti a un sito web tramite HTTPS, il tuo browser e il server negoziano una connessione criptata. Ma c'è un dettaglio: il browser deve comunicare **quale sito vuole visitare** al server (il nome del dominio), anche prima che la connessione sia criptata.

Questo dato è chiamato **SNI (Server Name Indication)**, ed è mandato **in chiaro**, non criptato:

```
Client: "Ciao, voglio connettermi a example.com"
         [SENZA CRIPTAZIONE - VISIBILE A QUALSIASI OBSERVER]
Server: "Ok, eccoti il certificato SSL per example.com"
Client + Server: [Ora negoziano la chiave simmetrica e HTTPS cifra tutto]
```

Questo significa che:

- **ISP e operatori di rete** possono leggere quale sito stai visitando (anche se il contenuto è criptato)
- **Firewall aziendali** possono bloccare siti specifici basandosi su SNI
- **Middleboxes** (proxy, firewalls) possono profilare il tuo browsing behavior
- **Correlazione passiva**: anche se la connessione HTTPS è sicura, osservare che visitaste `example.com/products` alle 14:35 rivela informazioni

ECH risolve questo, criptando il SNI stesso.

---

## Come funziona ECH

```
Client: "Voglio parlare con example.com"
         [CRIPTATO end-to-end - non visibile a observer]
Server: "Ok, ti conosco, eccoti la chiave simmetrica HTTPS"
Client + Server: [HTTPS criptato completo]
```

**Tecnicamente:**

1. Il client genera una **chiave pubblica temporanea** specifica per il server che vuole visitare
2. Cripta il ClientHello (la prima fase del TLS handshake) usando quella chiave pubblica
3. Invia il ClientHello criptato al server
4. Il server (che ha la chiave privata corrispondente), decripta il ClientHello
5. Procede con il TLS handshake normale

Da questo punto in poi, nessun observer intermedio sa quale SNI è stata richiesta, sanno solo che è avvenuta una connessione HTTPS al server.

---

## Cosa cambia per l'utente Android

**Prima di Android 17:**

```
Tu → ISP/rete → [legge SNI] → example.com
    "visita example.com ogni giorno dalle 14:00 alle 15:00"
```

**Con Android 17 + ECH:**

```
Tu → ISP/rete → [SNI criptato, illeggibile] → example.com
    "qualcuno sta facendo HTTPS handshake, non sappiamo con chi"
```

Per l'utente finale:
- ✅ Il tuo ISP non può più vendere dati di browsing a data broker (cosa illegale in Europa, ma pratica in USA)
- ✅ Reti pubbliche/caffè non possono profilo il tuo browsing
- ✅ Siti con SNI-based blocking rimangono sbloccati (firewall non sa quale SNI)
- ✅ Costi di traffic analysis calano drasticamente

---

## I limiti

ECH non è una panacea, anche con ECH criptato:

- **Timing e volume di traffico** rimane visibile (se visiti un sito per 2 ore, l'observer sa che qualcosa di voluminoso sta accadendo)
- **Indirizzi IP** rimangono visibili (se vuoi privacy dalla rete, devi usare una VPN o Tor)
- **Siti senza ECH** continuano a trasmettere SNI in chiaro
- **Nomi di dominio di sottoinsiemi** (es. `user-12345.example.com`) potrebbero still leak informazioni via IP geolocation

Ma è un passo avanti significativo.

---

## Adozione e roadmap

| Platform | Stato | Timeline |
|---|---|---|
| **Chrome on Android** | ✅ Enabled default | Android 17+ (Giugno 2026) |
| **Chrome desktop** | 🟡 Partial | Enabled for some users; full rollout Q4 2026 |
| **Safari** | 🟡 Partial | iOS 17+, non default |
| **Firefox** | 🟡 Behind flag | Developers can enable; non-default |
| **Other browsers** | ❌ None | Dipendono da OS / implementazione |

Il blocco sarà **adozione lenta**, perché:
1. Non tutti i siti supportano ECH (richiede certificati speciali)
2. Alcuni firewall aziendali lo bloccano esplicitamente (perché riduce visibility)
3. Compatibility issues con alcune middleboxes legacy

---

## Perché Google lo sta facendo

La privacy era storicamente un'area dove Google era indietro rispetto ai competitor (Apple's App Tracking Transparency, etc.). ECH è un modo per:

1. Allinearsi con movimenti di privacy globali (privacy regolamentata in EU)
2. Differenziare Android come "platform che rispetta la privacy"
3. Compensare per i dati di Chrome che Google stesso raccoglie (il paradosso: Google traccia massicciamente mentre implementa tracking prevention)

---

## Conclusione

ECH è una vittoria silenziosa per la privacy su Android 17. Non è drammatico come VPN o Tor, ma è **passive defense** che protegge milioni di utenti da ISP tracking senza richiedere azione conscia.

Per gli utenti tech-savvy: ECH insieme a **DNS-over-HTTPS** (DoH) forma un doppio strato di protezione, il tuo ISP non sa ne quale sito stai visitando (SNI criptato) ne quale IP lookup hai fatto (DNS criptato).

Non è privacy totale, ma è un progresso significativo verso un internet dove il default non è sorveglianza passiva della rete.
