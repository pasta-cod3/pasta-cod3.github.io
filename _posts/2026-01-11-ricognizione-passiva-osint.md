# Ricognizione Passiva: raccogliere informazioni senza farsi notare

## Introduzione

Prima di toccare qualsiasi sistema, un buon penetration tester passa ore — a volte giorni — a **raccogliere informazioni sul target**. Questa fase si chiama **ricognizione** ed è il fondamento di ogni attacco efficace.

La ricognizione si divide in due tipi:

- **Passiva:** raccogli informazioni senza interagire direttamente con il target. Il target non può accorgersi di te.
- **Attiva:** interagisci direttamente (scansioni di porte, ping, ecc.). Lasci tracce nei log.

In questo articolo ci occupiamo della **ricognizione passiva**, che si basa principalmente su **OSINT** — Open Source Intelligence: informazioni pubblicamente disponibili.

---

## Cosa cerchiamo nella ricognizione

L'obiettivo è costruire una **mappa del target** il più completa possibile:

- Indirizzi IP e range di rete
- Domini e sottodomini
- Tecnologie usate (server web, CMS, framework)
- Email dei dipendenti
- Nomi e ruoli delle persone (per attacchi di social engineering)
- Documenti pubblici che rivelano info interne
- Credenziali leaked in passate violazioni

---

## Strumenti e tecniche

### 1. WHOIS

Il WHOIS ti dà informazioni su chi possiede un dominio: nome, email, indirizzo, nameserver.

```bash
whois target.com
```

Molti domini usano **privacy shield** (Cloudflare, GoDaddy Privacy) che nascondono i dati reali. Ma i nameserver e le date di registrazione rimangono utili.

### 2. DNS Lookup

Il DNS rivela la struttura del target: quali sottodomini esistono, dove puntano, quali servizi di mail usano.

```bash
# Record base
nslookup target.com
dig target.com ANY

# Trovare il mail server
dig MX target.com

# Tentativo di zone transfer (spesso bloccato ma vale provare)
dig AXFR @ns1.target.com target.com
```

### 3. Enumerazione sottodomini (passiva)

Senza mai toccare i server del target, puoi trovare sottodomini usando:

- **crt.sh** — cerca nei certificati SSL pubblici
  ```
  https://crt.sh/?q=%.target.com
  ```
- **DNSDumpster** — `https://dnsdumpster.com`
- **Shodan** — motore di ricerca per dispositivi connessi a internet
  ```
  hostname:target.com
  ```

### 4. Google Dorking

I motori di ricerca indicizzano più di quanto pensi. Con operatori avanzati puoi trovare file sensibili, pagine di login nascoste, errori di configurazione.

```
# Trovare sottodomini
site:target.com

# Trovare file PDF o DOCX esposti
site:target.com filetype:pdf
site:target.com filetype:xlsx

# Trovare pagine di login
site:target.com inurl:login
site:target.com inurl:admin

# Trovare errori o stack trace
site:target.com "warning:" OR "error:" OR "exception:"
```

### 5. Shodan

Shodan indicizza dispositivi e servizi esposti su internet. Puoi trovare server, router, telecamere, sistemi SCADA — tutto quello che ha una porta aperta visibile da internet.

```
# Cerca per organizzazione
org:"Target Company"

# Cerca per tecnologia
http.title:"Apache Tomcat" org:"Target Company"

# Cerca porte specifiche
port:22 org:"Target Company"
```

### 6. Ricerca email

Le email dei dipendenti sono preziose per attacchi di phishing o per tentare accessi su servizi esposti.

Strumenti utili:
- **Hunter.io** — trova pattern email di un'azienda
- **LinkedIn** — nomi, ruoli, struttura organizzativa
- **theHarvester** — tool da terminale che aggrega più fonti

```bash
theHarvester -d target.com -b google,linkedin,bing -l 200
```

### 7. Wayback Machine

L'archivio di Internet conserva versioni precedenti dei siti. Versioni vecchie possono rivelare:
- Endpoint rimossi ma ancora attivi sul server
- Tecnologie sostituite
- File di configurazione dimenticati

```
https://web.archive.org/web/*/target.com/*
```

### 8. Metadata nei documenti pubblici

I file PDF, DOCX, XLSX e le immagini contengono spesso **metadata** che rivelano info interne: nome utente di chi ha creato il documento, versione di software, percorsi di rete interni.

```bash
# Scarica tutti i file pubblici e analizza i metadata
exiftool documento.pdf
```

**ExifTool** legge i metadata di praticamente qualsiasi formato file.

---

## Costruire il report di ricognizione

Tutto quello che trovi va documentato. Una struttura semplice:

```
TARGET: target.com
DATA: 2026-01-12

== INFRASTRUTTURA ==
IP principali: 93.184.216.34
Range AS: AS15169 (Google)
Nameserver: ns1.target.com, ns2.target.com

== SOTTODOMINI ==
mail.target.com       → 93.184.216.100
dev.target.com        → 10.0.0.5 (interno, non raggiungibile)
staging.target.com    → 93.184.216.102

== EMAIL ==
Pattern: nome.cognome@target.com
Trovate: mario.rossi@target.com, anna.bianchi@target.com

== TECNOLOGIE ==
Web server: nginx/1.18.0
CMS: WordPress 6.4.2
```

---

## Conclusione

La ricognizione passiva è la fase più sottovalutata dai principianti. Tutti vogliono subito aprire Metasploit — ma un professionista sa che il 60% del lavoro è capire il target prima di attaccarlo.

Più informazioni hai, più precisi e silenziosi saranno i tuoi attacchi successivi. Nel prossimo articolo passiamo alla **ricognizione attiva** con Nmap.
