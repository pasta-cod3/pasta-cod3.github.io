# Executive Summary Template

**Difficolta:** Beginner
**Time to Master:** 1h
**Prerequisiti:** nessuno
**Lab:** riferimento trasversale

---

## Obiettivo

Template compilabile per un report di penetration test, dalla executive summary alle raccomandazioni finali. Usalo come base per i report che scrivi durante i lab di pratica.

---

## 1. Executive Summary

[Nome cliente/lab] ha incaricato [nome tester] di condurre un penetration test su [scope: rete interna / host specifici / applicazione web] tra il [data inizio] e il [data fine]. L'obiettivo era identificare vulnerabilita sfruttabili e valutarne l'impatto reale sulla sicurezza dell'ambiente.

Sono state identificate **[N] vulnerabilita totali**: [N] Critical, [N] High, [N] Medium, [N] Low. La vulnerabilita piu significativa e stata [titolo finding piu grave], che ha permesso [accesso ottenuto: es. shell come SYSTEM/root su host X].

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

1. Information Gathering — raccolta passiva/attiva di informazioni sul target
2. Footprinting & Scanning — mappatura host, porte, servizi
3. Enumeration — identificazione versioni, share, utenti, configurazioni
4. Vulnerability Assessment — correlazione servizi/versioni con CVE noti
5. Exploitation — sfruttamento controllato delle vulnerabilita identificate
6. Post-Exploitation — privilege escalation, pivoting, verifica impatto reale
7. Reporting — documentazione di findings e raccomandazioni

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

- [Priorita immediata] [es. Applicare patch MS17-010 / disabilitare SMBv1]
- [Priorita breve termine] [es. Rafforzare policy password, disabilitare LLMNR/NBT-NS]
- [Priorita medio termine] [es. Segmentazione di rete, hardening configurazioni]

---

## 6. Conclusione

Il test ha dimostrato che [sintesi rischio complessivo: es. "un attaccante con accesso alla rete interna avrebbe potuto ottenere privilegi di dominio in meno di 2 ore, sfruttando una combinazione di enumerazione SMB e credenziali deboli"]. Si raccomanda di affrontare i finding Critical/High prioritariamente prima di [eventuale scadenza/milestone].

---

## Connessioni

- **Combinazione con:** [12-Reporting-Notes/Report-Writing-Tips.md](Report-Writing-Tips.md), [04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md](../04-Vulnerability-Assessment/03-CVE-CVSS-Scoring.md)

---

## Note personali

_(spazio libero)_
