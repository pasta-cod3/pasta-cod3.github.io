---
layout: post
title: "Phishing: come riconoscerlo davvero (e cosa fare quando ci casca qualcuno)"
description: "Guida pratica al riconoscimento del phishing e alla risposta agli incidenti: analisi delle email sospette, header, link e procedure di risposta."
date: 2026-02-03
categoria: Blue Team
tags: [phishing, email-security, incident-response, social-engineering]
---

# Phishing: come riconoscerlo davvero (e cosa fare quando ci casca qualcuno)

Il phishing è il vettore di attacco numero uno. Non perché sia sofisticato — spesso non lo è — ma perché **funziona**. E funziona perché prende di mira l'elemento più difficile da patchare in assoluto: le persone.

Ho smesso di giudicare chi ci casca dopo aver visto alcuni campioni di spear phishing davvero ben costruiti. Email scritte perfettamente in italiano, con logo aziendale corretto, mittente apparentemente legittimo, contesto personalizzato. Se non sai cosa guardare, è difficile distinguerle dal reale.

Questo articolo è in due parti: come **riconoscere** il phishing e come **rispondere** quando qualcuno nel tuo team ci è già cascato.

---

## Parte 1: Riconoscere il phishing

### Il nome visualizzato non è il mittente reale

Questa è la truffa più banale ma ancora la più diffusa. Il client di posta mostra il **nome visualizzato**, non l'indirizzo reale. Un'email che mostra "Banca Intesa - Sicurezza" potrebbe avere come indirizzo reale `noreply@aggiornamento-conto.xyz`.

Controlla **sempre** l'indirizzo completo del mittente, non solo il nome.

### Analizza gli header dell'email

Gli header sono il "tracciato GPS" di un'email. Contengono tutti i server che l'hanno attraversata, i check di autenticazione, l'IP di origine.

Per visualizzarli:
- **Gmail**: tre puntini → "Mostra originale"
- **Outlook**: File → Proprietà → Intestazioni internet
- **Thunderbird**: Visualizza → Sorgente del messaggio

Cosa cercare negli header:

```
# Controlla il risultato SPF
Received-SPF: fail (google.com: domain of noreply@evil.com does not designate...)

# Controlla DKIM
DKIM-Signature: v=1; a=rsa-sha256; d=banca.it; ...

# Controlla DMARC
Authentication-Results: dmarc=fail

# Verifica il percorso dei server (Received: from)
Received: from mail.suspicious-server.ru (mail.suspicious-server.ru [185.220.x.x])
```

Se SPF, DKIM o DMARC falliscono, è un campanello d'allarme fortissimo.

Puoi analizzare gli header in modo semplice con strumenti online come **MXToolbox Header Analyzer** o **Google Admin Toolbox Messageheader**.

### Analizza i link senza cliccarci

Passa il mouse sopra il link (hover) e guarda l'URL reale che appare in basso nel browser. Oppure, copia il link e analizzalo senza aprirlo.

Cose sospette in un URL:

```
# Typosquatting (dominio simile ma diverso)
https://bancaIntesa-sicurezza.com  ← non è intesa.it

# Sottodominio ingannevole
https://intesa.it.evil-domain.com  ← il dominio reale è evil-domain.com

# URL shortener (nasconde la destinazione)
https://bit.ly/3xK8mPq

# Caratteri Unicode visivamente identici (homograph attack)
https://раypal.com  ← la "a" è cirillica
```

Per verificare un URL senza aprirlo:

```bash
# Espandi un URL shortener
curl -I -L https://bit.ly/shortlink 2>&1 | grep Location

# Controlla la reputazione del dominio
curl "https://www.virustotal.com/api/v3/domains/evil-domain.com" \
  -H "x-apikey: TUO_API_KEY"
```

### Allegati: le estensioni che dovrebbero metterti in allerta

```
.exe, .scr, .bat, .cmd, .vbs, .js, .jar  → eseguibili diretti
.doc, .docx con macro abilitate           → macro malware
.pdf con JavaScript integrato             → PDF exploit
.zip, .rar con password                   → nasconde il contenuto agli scanner
.iso, .img                                → tecnica per bypassare Mark-of-the-Web
```

---

## Parte 2: Rispondere quando qualcuno ci è cascato

Questo è il momento in cui molti si bloccano. Qualcuno ha cliccato il link o aperto l'allegato — e adesso?

**Regola numero zero: non farti prendere dal panico e non perdere tempo a rimproverare chi ha cliccato.** Hai una finestra di tempo limitata per contenere il danno.

### Timeline di risposta

```
T+0 min   → Ricezione della segnalazione
T+5 min   → Isolamento del sistema dalla rete
T+15 min  → Raccolta dei log e delle evidenze
T+30 min  → Analisi dell'email e degli indicatori
T+60 min  → Valutazione del perimetro colpito
T+2h      → Comunicazioni interne e (se necessario) esterne
```

### Step 1: Isola immediatamente il sistema

```bash
# Linux: disabilita le interfacce di rete
sudo ip link set eth0 down
sudo ip link set wlan0 down

# Windows (PowerShell, da amministratore)
Disable-NetAdapter -Name "*" -Confirm:$false
```

Non spegnere il sistema — potresti perdere evidenze in memoria (RAM). Disconnetti dalla rete, ma lascialo acceso.

### Step 2: Preserva le evidenze

```bash
# Cattura la memoria RAM (Linux) con LiME
sudo insmod lime.ko "path=/media/usb/ram.lime format=lime"

# Elenca i processi attivi in quel momento
ps auxf > /tmp/processes_$(date +%Y%m%d_%H%M).txt

# Connessioni di rete attive
ss -tulnp > /tmp/network_$(date +%Y%m%d_%H%M).txt
netstat -an >> /tmp/network_$(date +%Y%m%d_%H%M).txt
```

### Step 3: Analizza l'email originale

Se riesci a recuperare l'email originale (file `.eml`), analizzala:

```bash
# Estrai gli allegati da un file .eml
python3 -c "
import email, sys
msg = email.message_from_file(open('suspicious.eml'))
for part in msg.walk():
    if part.get_filename():
        print(f'Allegato trovato: {part.get_filename()}')
        # Non salvare/eseguire automaticamente!
"

# Estrai tutti gli URL dal corpo dell'email
grep -oE 'https?://[^ \"<>]+' suspicious.eml | sort -u
```

### Step 4: Cerca se altri hanno ricevuto la stessa email

Se hai un SIEM o accesso ai log del mail server:

```bash
# Esempio query Splunk per trovare email simili
index=email sourcetype=mail 
| search subject="*Aggiornamento account*" OR from="*evil-domain.com*"
| stats count by recipient, subject, from
| sort - count
```

### Step 5: Resetta le credenziali

Se l'utente ha inserito credenziali in una pagina di phishing:

1. **Resetta immediatamente la password** dell'account compromesso
2. **Revoca tutte le sessioni attive** (soprattutto per account cloud/SaaS)
3. **Abilita MFA** se non era già attivo
4. **Controlla i log di accesso** per vedere se le credenziali sono già state usate

```bash
# Esempio: revocare tutte le sessioni OAuth di un utente Google (via API)
curl -X POST "https://oauth2.googleapis.com/revoke?token=ACCESS_TOKEN"
```

---

## Template di comunicazione interna

Quando un incidente di phishing è confermato, comunica in modo chiaro e non allarmistico:

```
Oggetto: [SICUREZZA] Campagna phishing identificata - Azione richiesta

Ciao a tutti,

abbiamo identificato una campagna di phishing che ha preso di mira 
alcuni indirizzi aziendali nelle ultime ore.

L'email incriminata ha le seguenti caratteristiche:
- Mittente: noreply@aggiornamento-accesso.xyz
- Oggetto: "Verifica il tuo account entro 24 ore"
- Contiene un link verso: http://falsa-pagina-login.com

COSA FARE:
✓ Se hai ricevuto questa email, NON cliccare nessun link
✓ Se hai già cliccato, contatta immediatamente il team IT
✓ Segnala l'email come phishing e cancellala

Il team di sicurezza sta monitorando la situazione.
Per segnalazioni: security@tua-azienda.it
```

---

## Conclusione

Il phishing non si sconfigge solo con la tecnologia. Si sconfigge con **consapevolezza + processi chiari + risposta rapida**. Gli strumenti aiutano, ma la differenza la fanno le persone che sanno cosa guardare e cosa fare.

Se lavori in un contesto aziendale, considera di introdurre campagne di phishing simulato — non per punire chi clicca, ma per misurare la consapevolezza reale e costruire memoria muscolare nella risposta. 🎣
