# Exam Tips — eJPTv2

**Difficolta:** Beginner
**Time to Master:** 30 min
**Prerequisiti:** [INE-Labs-Methodology.md](INE-Labs-Methodology.md)
**Lab:** informazioni pubbliche generiche sul formato esame

---

## Obiettivo

Informazioni pubbliche e generiche su come e strutturato l'esame eJPTv2 e come organizzarsi — nessun contenuto reale o specifico dell'esame (che non e comunque disponibile qui), solo consigli di preparazione, gestione del tempo e mentalita.

---

## Formato generale (pubblico, da materiale ufficiale INE)

L'eJPTv2 e un esame **pratico**, non a domande teoriche isolate: accedi a una rete simulata (INE PTS) con piu host e rispondi a una serie di domande/flag basate su cio che scopri e sfrutti durante l'assessment. Non e richiesto un report formale come per certificazioni piu avanzate (es. eWPT/eCPPT), ma la systematic enumeration resta il fattore decisivo.

---

## Gestione del tempo

| Consiglio | Perche |
|-----------|--------|
| Non fissarti su un host bloccato | vedi [INE-Labs-Methodology.md](INE-Labs-Methodology.md) — passa oltre e torna dopo |
| Automatizza gli scan lunghi in background | lancia `-p-` e altri scan lenti e continua a lavorare su altro nel frattempo |
| Tieni note leggibili in tempo reale | con piu host e domande, ricostruire a memoria costa tempo prezioso |
| Non trascurare l'enumeration "noiosa" | share SMB, banner FTP/SSH, pagine web di default spesso contengono la risposta piu velocemente di un exploit complesso |

---

## Mentalita

- **L'enumerazione sistematica batte la fortuna** — segui sempre lo stesso ordine (discovery -> scan -> enum -> vuln assessment -> exploit) invece di saltare a caso da un host all'altro
- **Le domande spesso richiedono dettagli precisi** (versione esatta di un servizio, nome di uno share, contenuto di un file) — leggi l'output degli strumenti con attenzione, non solo "e vulnerabile si/no"
- **Metasploit e i tool "assistiti" fanno risparmiare tempo** ma capire cosa fanno resta essenziale se qualcosa non funziona come atteso
- **Fai una pausa se sei bloccato da tanto** — tornare con mente fresca su un host spesso rivela dettagli persi per stanchezza

---

## Checklist pre-esame

- [ ] Ho completato tutte le sezioni di questo cheatsheet almeno una volta in pratica
- [ ] Conosco a memoria i comandi base di nmap e msfconsole (vedi [11-Tools-Reference/Nmap-Metasploit-Quick-Reference.md](../11-Tools-Reference/Nmap-Metasploit-Quick-Reference.md))
- [ ] Ho un template di note rapido e riutilizzabile per host multipli
- [ ] Ho esercitato privilege escalation Windows e Linux almeno 2-3 volte ciascuna
- [ ] So usare Responder/Wireshark per catturare credenziali su una rete
- [ ] Ho fatto almeno una simulazione a tempo su una rete multi-host (vedi [Practice-Platforms-Guide.md](Practice-Platforms-Guide.md))

---

## Connessioni

- **Prerequisito:** [INE-Labs-Methodology.md](INE-Labs-Methodology.md)
- **Combinazione con:** [Practice-Platforms-Guide.md](Practice-Platforms-Guide.md)

---

## Note personali

_(spazio libero)_
