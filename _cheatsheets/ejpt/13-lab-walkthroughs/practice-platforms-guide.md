---
layout: cheatsheet
cert: ejpt
cert_label: "eJPT"
title: "Guida alle Piattaforme di Pratica"
permalink: "/cheatsheet/ejpt/13-lab-walkthroughs/practice-platforms-guide/"
section: "Lab Walkthroughs"
section_order: 13
order: 50
sort_key: 1350
---

**Difficoltà:** Beginner
**Time to Master:** 30 min (lettura) + pratica continua
**Prerequisiti:** [QUICK-START.md](/cheatsheet/ejpt/quick-start/)
**Lab:** panoramica piattaforme esterne

---

## Obiettivo

A un certo punto la teoria non basta più, e ti serve un posto dove sporcarti le mani senza rischiare di far danni su qualcosa vero. Qui trovi quali piattaforme usare per esercitarti concretamente sugli argomenti eJPTv2, e perché ognuna serve a una fase diversa della preparazione. Nessun walkthrough di exploit: solo indicazioni su dove andare a esercitarti.

---

## TryHackMe

| Percorso | Perché e utile |
|----------|-----------------|
| Pre Security | ripasso networking/Linux/Windows fondamentali, ottimo se [00-Fundamentals](/cheatsheet/ejpt/00-fundamentals/01-cybersecurity-concepts/) ti sembra ostico |
| Jr Penetration Tester | percorso guidato che copre quasi 1:1 il blueprint eJPTv2 (recon, scanning, exploitation base, web attack) |
| Room singole per servizio | cerca room dedicate a SMB, FTP, SNMP ecc. per esercitarti su un singolo protocollo alla volta |

THM è quello che ti conviene usare nelle prime settimane: room guidate passo-passo, ottime per imparare la sintassi degli strumenti prima di buttarti su macchine libere.

---

## HackTheBox

| Risorsa | Perché e utile |
|---------|-----------------|
| Starting Point (Tier 0/1) | macchine guidatissime, pensate per chi inizia: perfette dopo aver finito THM Jr Penetration Tester |
| Macchine Easy retired note (Blue, Legacy, Lame, Devel) | classici storici basati su vulnerabilità note (es. MS17-010) molto in linea col livello eJPTv2: writeup ufficiali disponibili per chi si blocca |
| Modalità "release arena"/Easy attive | una volta a tuo agio, esercitati senza writeup a disposizione per simulare la pressione dell'esame |

HTB è più una "sandbox libera" rispetto a THM: nessuna guida passo-passo, quindi è il posto giusto per allenare la metodologia di enumerazione descritta in [INE-Labs-Methodology.md](/cheatsheet/ejpt/13-lab-walkthroughs/ine-labs-methodology/) quando sei pronto a cavartela da solo.

---

## VulnHub

Macchine scaricabili ed eseguibili in locale (VirtualBox/VMware): la scelta giusta quando vuoi esercitarti offline, o ripetere lo stesso scenario più volte senza dipendere da una VPN lab che magari quel giorno è lenta o irraggiungibile. Cerca macchine taggate "easy"/"beginner" per restare in linea col livello eJPTv2.

---

## Metasploitable2 / DVWA (hosting locale)

| Target | Perché e utile |
|--------|-----------------|
| Metasploitable2 | macchina Linux volutamente piena di servizi vulnerabili (FTP, SMB, servizi RPC, ecc.): ottima per esercitarsi su [03-Enumeration](/cheatsheet/ejpt/03-enumeration/01-smb-netbios-enumeration/) e [07-Metasploit-Framework](/cheatsheet/ejpt/07-metasploit-framework/01-msfconsole-basics/) senza limiti di tempo/VPN |
| DVWA / bWAPP / OWASP Juice Shop | webapp volutamente vulnerabili per esercitarsi su [10-Web-Application-Attacks](/cheatsheet/ejpt/10-web-application-attacks/01-web-fundamentals-http/) (SQLi, XSS, LFI) in totale sicurezza e ripetibilità |

Girano entrambe in locale via VM/Docker: nessun rischio legale, nessuna dipendenza dalla connessione, e se rompi qualcosa resetti lo stato e ripeti.

---

## Come sequenziare la pratica

1. **Settimana 1-2:** THM Pre Security + Jr Penetration Tester (segui la guida)
2. **Settimana 3-4:** Metasploitable2 + DVWA in locale, applica [03-Enumeration](/cheatsheet/ejpt/03-enumeration/01-smb-netbios-enumeration/) e [10-Web-Application-Attacks](/cheatsheet/ejpt/10-web-application-attacks/01-web-fundamentals-http/) senza guida
3. **Settimana 5:** HTB Starting Point, poi 2-3 macchine Easy retired (Blue, Legacy, Lame)
4. **Settimana 6:** macchine Easy attive su HTB senza writeup, cronometrando il tempo come simulazione esame

---

## Connessioni

- **Prerequisito:** [QUICK-START.md](/cheatsheet/ejpt/quick-start/)
- **Combinazione con:** [INE-Labs-Methodology.md](/cheatsheet/ejpt/13-lab-walkthroughs/ine-labs-methodology/), [Exam-Tips-eJPTv2.md](/cheatsheet/ejpt/13-lab-walkthroughs/exam-tips-ejptv2/)
