# Lab Challenges — Footprinting & Scanning

**Difficolta:** Beginner-Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Esercizi pratici per consolidare l'intera fase di footprinting/scanning prima di passare all'enumeration dei servizi.

---

## Challenge 1 — Mappatura completa di una subnet

**Target:** una subnet /24 di lab (es. INE PTS o TryHackMe network)

**Task:**
1. Host discovery con nmap `-sn` + arp-scan
2. Per ogni host live, scan completo `-p-` con `--min-rate` alto
3. Version/OS detection su tutte le porte trovate

**Deliverable:** una tabella IP / porte aperte / servizi+versione / OS stimato.

---

## Challenge 2 — Scan sotto vincoli di evasione

**Task:**
1. Ripeti lo scan di un host del Challenge 1 usando `-f`, `-D RND:10` e `-T2`
2. Confronta tempo impiegato e risultati con lo scan "normale"
3. Documenta quali porte, se presenti, non vengono rilevate correttamente con timing troppo lento

**Deliverable:** breve nota su trade-off velocita/evasione osservato.

---

## Common Mistakes

- Concentrarsi solo su TCP e dimenticare UDP -> si perdono servizi come SNMP, spesso chiave per l'enumeration successiva
- Non salvare gli output (-oA) -> si ripete lavoro gia fatto quando serve incrociare i dati piu avanti

---

## Link Utili

- [TryHackMe — Nmap room](https://tryhackme.com/)
- [Nmap Network Scanning (libro ufficiale, capitoli gratuiti online)](https://nmap.org/book/toc.html)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [02-Footprinting-Scanning](.)
- **Prossimo Step:** [../03-Enumeration/01-SMB-NetBIOS-Enumeration.md](../03-Enumeration/01-SMB-NetBIOS-Enumeration.md)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 su almeno un target/lab
- [ ] Ho un template di note riutilizzabile per scan e discovery
- [ ] Sono pronto a passare all'enumeration dei servizi

---

## Note personali

_(spazio libero)_
