# Exam Tips: eJPTv2

**Difficoltà:** Beginner
**Time to Master:** 30 min
**Prerequisiti:** [INE-Labs-Methodology.md](INE-Labs-Methodology.md)
**Lab:** informazioni pubbliche generiche sul formato esame

---

## Obiettivo

Prima di collegarti alla VPN d'esame aiuta sapere a cosa andrai incontro, così l'ansia si concentra sulla rete da bucare e non sul formato in sé. Qui trovi solo informazioni pubbliche e generiche su come è strutturato l'eJPTv2: nessun contenuto reale o specifico dell'esame, che qui non troveresti comunque, solo consigli di preparazione, gestione del tempo e mentalità.

---

## Formato generale (pubblico, da materiale ufficiale INE)

L'eJPTv2 è un esame **pratico**, non un questionario a domande teoriche isolate: entri in una rete simulata (INE PTS) con più host e rispondi a domande/flag basate su ciò che riesci a scoprire e sfruttare durante l'assessment. Non ti viene richiesto un report formale come nelle certificazioni più avanzate (es. eWPT/eCPPT), ma l'enumerazione sistematica resta comunque il fattore che decide se passi o no.

---

## Gestione del tempo

| Consiglio | Perché |
|-----------|--------|
| Non fissarti su un host bloccato | vedi [INE-Labs-Methodology.md](INE-Labs-Methodology.md): passa oltre e torna dopo |
| Automatizza gli scan lunghi in background | lancia `-p-` e altri scan lenti e continua a lavorare su altro nel frattempo |
| Tieni note leggibili in tempo reale | con più host e domande, ricostruire a memoria costa tempo prezioso |
| Non trascurare l'enumeration "noiosa" | share SMB, banner FTP/SSH, pagine web di default spesso contengono la risposta più velocemente di un exploit complesso |

---

## Mentalita

- **L'enumerazione sistematica batte la fortuna**: segui sempre lo stesso ordine (discovery -> scan -> enum -> vuln assessment -> exploit) invece di saltare a caso da un host all'altro
- **Le domande spesso richiedono dettagli precisi** (versione esatta di un servizio, nome di uno share, contenuto di un file): leggi l'output degli strumenti con attenzione, non solo "e vulnerabile si/no"
- **Metasploit e i tool "assistiti" fanno risparmiare tempo** ma capire cosa fanno resta essenziale se qualcosa non funziona come atteso
- **Fai una pausa se sei bloccato da tanto**: tornare con mente fresca su un host spesso rivela dettagli persi per stanchezza

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

