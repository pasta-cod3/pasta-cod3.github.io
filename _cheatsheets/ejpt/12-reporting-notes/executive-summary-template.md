---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Executive Summary Template"
permalink: "/cheatsheet/ejpt/12-reporting-notes/executive-summary-template/"
section: "Reporting Notes"
section_order: 12
order: 50
sort_key: 1250
---

**Difficoltà:** Beginner
**Time to Master:** 1h
**Prerequisiti:** nessuno
**Lab:** riferimento trasversale

---

## Obiettivo

Il primo report che scrivi fa sempre un po' paura: hai tutte le note del lab sparse ovunque e non sai da dove iniziare a metterle in forma. Questo è un template compilabile, dalla executive summary alle raccomandazioni finali, pensato apposta per quel momento: prendilo come base, riempi le parentesi quadre con i tuoi dati reali e hai già la struttura di un report professionale.

---

## 1. Executive Summary

[Nome cliente/lab] ha incaricato [nome tester] di condurre un penetration test su [scope: rete interna / host specifici / applicazione web] tra il [data inizio] e il [data fine]. L'obiettivo era identificare vulnerabilità sfruttabili e valutarne l'impatto reale sulla sicurezza dell'ambiente.

Sono state identificate **[N] vulnerabilità totali**: [N] Critical, [N] High, [N] Medium, [N] Low. La vulnerabilità più significativa è stata [titolo finding più grave], che ha permesso [accesso ottenuto: es. shell come SYSTEM/root su host X].

---

## 2. Scope

| Elemento | Dettaglio |
|----------|-----------|
| Tipo di test | [Black box / Grey box / White box] |
| Target in scope | [range IP / hostname / URL] |
| Target esclusi | [eventuali esclusioni] |
| Finestra temporale | [data inizio] - [data fine] |
| Metodo di test | [remoto via VPN / on-site] |

---

## 3. Metodologia

Il test ha seguito le fasi standard di un penetration test:

1. Information Gathering: raccolta passiva/attiva di informazioni sul target
2. Footprinting & Scanning: mappatura host, porte, servizi
3. Enumeration: identificazione versioni, share, utenti, configurazioni
4. Vulnerability Assessment: correlazione servizi/versioni con CVE noti
5. Exploitation: sfruttamento controllato delle vulnerabilità identificate
6. Post-Exploitation: privilege escalation, pivoting, verifica impatto reale
7. Reporting: documentazione di findings e raccomandazioni

---

## 4. Findings Summary

| ID | Titolo | Severity | CVSS | Host |
|----|--------|----------|------|------|
| F-01 | [es. SMB signing disabilitato] | High | 7.5 | [IP] |
| F-02 | [es. Credenziali di default su servizio X] | Critical | 9.8 | [IP] |
| F-03 | [es. Servizio non aggiornato con CVE noto] | High | 8.1 | [IP] |

Per ogni finding, in una sezione dedicata sotto, includi: **Descrizione**, **Impatto**, **Passi di riproduzione**, **Evidenza (screenshot/output)**, **Remediation consigliata**.

---

## 5. Raccomandazioni

- [Priorità immediata] [es. Applicare patch MS17-010 / disabilitare SMBv1]
- [Priorità breve termine] [es. Rafforzare policy password, disabilitare LLMNR/NBT-NS]
- [Priorità medio termine] [es. Segmentazione di rete, hardening configurazioni]

---

## 6. Conclusione

Il test ha dimostrato che [sintesi rischio complessivo: es. "un attaccante con accesso alla rete interna avrebbe potuto ottenere privilegi di dominio in meno di 2 ore, sfruttando una combinazione di enumerazione SMB e credenziali deboli"]. Si raccomanda di affrontare i finding Critical/High prioritariamente prima di [eventuale scadenza/milestone].

---

## Connessioni

- **Combinazione con:** [12-Reporting-Notes/Report-Writing-Tips.md](/cheatsheet/ejpt/12-reporting-notes/report-writing-tips/), [04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](/cheatsheet/ejpt/04-vulnerability-assessment/03-cve-cvss-scoring/)
