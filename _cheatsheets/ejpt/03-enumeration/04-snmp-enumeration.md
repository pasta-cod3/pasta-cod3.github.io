---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "SNMP Enumeration"
permalink: "/cheatsheet/ejpt/03-enumeration/04-snmp-enumeration/"
section: "Enumeration"
section_order: 3
order: 4
sort_key: 304
---

**Difficoltà:** Intermediate
**Time to Master:** 1h
**Prerequisiti:** [03-SSH-Enumeration.md](/cheatsheet/ejpt/03-enumeration/03-ssh-enumeration/)
**Lab:** INE PTS, Service Enumeration

---

## Obiettivo

Molti lo saltano perché "è solo UDP e lento", e questo è esattamente il motivo per cui SNMP mal configurato è così redditizio: con la community string giusta (spesso letteralmente `public`) diventa uno dei servizi più generosi che incontrerai, capace di rivelarti utenti, processi, interfacce di rete e software installato senza che tu debba autenticarti con nulla di reale.

---

## Concetti chiave

### Community string

SNMP v1/v2c usa una "community string" come forma debole di autenticazione, inviata in chiaro. Le default più comuni sono `public` (sola lettura) e `private` (lettura/scrittura). Molte installazioni non cambiano mai questi default.

### MIB (Management Information Base)

I dati SNMP sono organizzati in una struttura gerarchica (OID). Alcuni rami MIB rilevanti per il pentest:

| OID (parziale) | Contenuto |
|-----------------|-----------|
| `1.3.6.1.2.1.25.1.6.0` | processi in esecuzione |
| `1.3.6.1.2.1.25.4.2.1.2` | nomi eseguibili processi |
| `1.3.6.1.4.1.77.1.2.25` | utenti Windows (Host Resources MIB) |
| `1.3.6.1.2.1.6.13.1.3` | porte TCP in ascolto |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| onesixtyone | `onesixtyone -c community.txt target` | brute force community string | veloce, buono per lo scan iniziale |
| snmpwalk | `snmpwalk -c public -v1 target` | dump completo albero MIB | il tool principale per l'enumerazione vera e propria |
| nmap | `nmap -sU --script snmp-processes,snmp-win32-users -p161 target` | processi/utenti via NSE | integra bene lo scan UDP |
| snmp-check | `snmp-check target` | output formattato e leggibile | alternativa più "pulita" a snmpwalk grezzo |

---

## Payload / Esempi

### Esempio 1: individuare la community string

```bash
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt 10.10.10.5
```

**Output atteso:**
```
10.10.10.5 [public] Linux server 4.15.0
```

**Spiegazione:** `onesixtyone` prova rapidamente una lista di community string comuni; trovare `public` valida sblocca l'enumerazione completa.

### Esempio 2: dump completo con snmpwalk

```bash
snmpwalk -c public -v1 10.10.10.5
```

**Spiegazione:** senza OID specifico, snmpwalk parte dalla radice e scarica tutto l'albero MIB disponibile: utenti, processi, interfacce, software installato. Va filtrato con grep per trovare rapidamente cio che interessa.

### Esempio 3: enumerazione mirata di utenti Windows

```bash
snmpwalk -c public -v1 10.10.10.5 1.3.6.1.4.1.77.1.2.25
```

**Output atteso:**
```
iso.3.6.1.4.1.77.1.2.25.1.1 = STRING: "Administrator"
iso.3.6.1.4.1.77.1.2.25.1.1 = STRING: "svc_sql"
```

**Spiegazione:** questo OID specifico (Host Resources MIB) su Windows con SNMP abilitato restituisce direttamente la lista account locali, spesso più completa di quella ottenibile via SMB null session.

---

## Lab Hands-On

### Lab 1: INE PTS, SNMP deep enumeration
**Obiettivo:** trovare la community string corretta ed estrarre utenti/processi via SNMP
**Difficulty:** Medio
**Time:** 40 min

**Walkthrough breve:**
1. Bruteforce community string con onesixtyone
2. Dump completo con snmpwalk -c <community> -v1
3. Filtra output per utenti, processi e porte in ascolto, incrocia con l'enumerazione SMB già fatta

---

## Common Mistakes

- Saltare SNMP perché "è solo UDP e lento" -> spesso è la fonte più ricca di informazioni dell'intera enumeration
- Provare solo `public` senza controllare anche `private` -> `private` può permettere anche scrittura, non solo lettura
- Non filtrare l'output enorme di snmpwalk -> perdersi tra migliaia di righe, usare sempre grep mirato

---

## Link Utili

- [SNMP MIB browser online](https://www.circitor.fr/Mibs/Mibs.php)

---

## Connessioni

- **Prerequisito:** [03-SSH-Enumeration.md](/cheatsheet/ejpt/03-enumeration/03-ssh-enumeration/)
- **Prossimo Step:** [05-Web-Enumeration.md](/cheatsheet/ejpt/03-enumeration/05-web-enumeration/)
- **Combinazione con:** [01-SMB-NetBIOS-Enumeration.md](/cheatsheet/ejpt/03-enumeration/01-smb-netbios-enumeration/)

---

## Checklist di padronanza

- [ ] So fare brute force delle community string
- [ ] So usare snmpwalk per dump mirati con OID specifici
- [ ] Conosco almeno 2-3 OID utili per utenti/processi
