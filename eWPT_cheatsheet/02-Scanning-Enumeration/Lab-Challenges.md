# Lab Challenges: Scanning & Enumeration

**Difficoltà:** Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Prima di passare alle vulnerabilità specifiche (SQLi, XSS, LFI e compagnia), fermati qui a consolidare l'intero flusso di scanning ed enumeration: è la parte che si salta più volentieri sotto pressione, ed è quasi sempre quella che poi ti fa perdere la vulnerabilità più ovvia.

---

## Challenge 1: Mappa completa dell'attack surface

**Task:**
1. Full port scan (TCP + UDP top ports) su un target di laboratorio
2. Service/version detection su ogni porta aperta
3. Web enumeration completa (directory + vhost + API) sui servizi HTTP/HTTPS trovati

**Deliverable:** un file `enum-notes.md` con: porte aperte, versioni servizi, directory/file trovati, vhost scoperti, endpoint API mappati.

---

## Challenge 2: Bypass di un 403

**Task:**
1. Trova una directory/path che risponde 403
2. Prova almeno 4 tecniche di bypass diverse (case, header, slash, method override)
3. Documenta quale tecnica ha funzionato e perché

---

## Common Mistakes

- Passare alla fase di exploitation con un'enumerazione parziale -> torna sempre qui se ti blocchi in seguito
- Non ripetere l'enumerazione su ogni vhost/subdomain scoperto -> ogni vhost è una superficie a sé

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [02-Scanning-Enumeration](.)
- **Prossimo Step:** [03-File-Inclusion/01-LFI-Basics.md](../03-File-Inclusion/01-LFI-Basics.md) oppure [04-SQL-Injection/01-SQLi-Fundamentals.md](../04-SQL-Injection/01-SQLi-Fundamentals.md)

---

## Checklist di padronanza

- [ ] Ho una mappa completa e documentata di un target di lab
- [ ] Ho praticato bypass di controlli 403
- [ ] Sono pronto a passare alle vulnerabilità specifiche

