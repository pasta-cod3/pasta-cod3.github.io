# Guida alle Piattaforme di Pratica

**Difficolta:** Beginner
**Time to Master:** 30 min (lettura) + pratica continua
**Prerequisiti:** [QUICK-START.md](../QUICK-START.md)
**Lab:** panoramica piattaforme esterne

---

## Obiettivo

Quali piattaforme usare per esercitarsi concretamente sugli argomenti eJPTv2, e perche ognuna e utile per una fase specifica della preparazione. Nessun walkthrough di exploit qui — solo indicazioni su dove esercitarsi.

---

## TryHackMe

| Percorso | Perche e utile |
|----------|-----------------|
| Pre Security | ripasso networking/Linux/Windows fondamentali, ottimo se [00-Fundamentals](../00-Fundamentals/) ti sembra ostico |
| Jr Penetration Tester | percorso guidato che copre quasi 1:1 il blueprint eJPTv2 (recon, scanning, exploitation base, web attack) |
| Room singole per servizio | cerca room dedicate a SMB, FTP, SNMP ecc. per esercitarti su un singolo protocollo alla volta |

THM e ideale nelle prime settimane: room guidate passo-passo, ottime per imparare la sintassi degli strumenti prima di affrontare macchine libere.

---

## HackTheBox

| Risorsa | Perche e utile |
|---------|-----------------|
| Starting Point (Tier 0/1) | macchine guidatissime, pensate per chi inizia — perfette dopo aver finito THM Jr Penetration Tester |
| Macchine Easy retired note (Blue, Legacy, Lame, Devel) | classici storici basati su vulnerabilita note (es. MS17-010) molto in linea col livello eJPTv2 — writeup ufficiali disponibili per chi si blocca |
| Modalita "release arena"/Easy attive | una volta a tuo agio, esercitati senza writeup a disposizione per simulare la pressione dell'esame |

HTB e piu "sandbox libera" rispetto a THM: nessuna guida passo-passo, ottimo per allenare la metodologia di enumerazione descritta in [13-Lab-Walkthroughs/INE-Labs-Methodology.md](INE-Labs-Methodology.md).

---

## VulnHub

Macchine scaricabili ed eseguibili in locale (VirtualBox/VMware), utili quando vuoi esercitarti offline o ripetere piu volte lo stesso scenario senza dipendere da una VPN lab. Cerca macchine taggate "easy"/"beginner" per restare in linea col livello eJPTv2.

---

## Metasploitable2 / DVWA (hosting locale)

| Target | Perche e utile |
|--------|-----------------|
| Metasploitable2 | macchina Linux volutamente piena di servizi vulnerabili (FTP, SMB, servizi RPC, ecc.) — ottima per esercitarsi su [03-Enumeration](../03-Enumeration/) e [07-Metasploit-Framework](../07-Metasploit-Framework/) senza limiti di tempo/VPN |
| DVWA / bWAPP / OWASP Juice Shop | webapp volutamente vulnerabili per esercitarsi su [10-Web-Application-Attacks](../10-Web-Application-Attacks/) (SQLi, XSS, LFI) in totale sicurezza e ripetibilita |

Entrambe girano in locale via VM/Docker: nessun rischio legale, nessuna dipendenza da connessione, puoi resettare lo stato quando vuoi.

---

## Come sequenziare la pratica

1. **Settimana 1-2:** THM Pre Security + Jr Penetration Tester (segui la guida)
2. **Settimana 3-4:** Metasploitable2 + DVWA in locale, applica [03-Enumeration](../03-Enumeration/) e [10-Web-Application-Attacks](../10-Web-Application-Attacks/) senza guida
3. **Settimana 5:** HTB Starting Point, poi 2-3 macchine Easy retired (Blue, Legacy, Lame)
4. **Settimana 6:** macchine Easy attive su HTB senza writeup, cronometrando il tempo come simulazione esame

---

## Connessioni

- **Prerequisito:** [QUICK-START.md](../QUICK-START.md)
- **Combinazione con:** [INE-Labs-Methodology.md](INE-Labs-Methodology.md), [Exam-Tips-eJPTv2.md](Exam-Tips-eJPTv2.md)

---

## Note personali

_(spazio libero)_
