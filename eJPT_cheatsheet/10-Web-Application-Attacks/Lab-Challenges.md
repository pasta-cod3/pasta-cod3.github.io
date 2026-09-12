# Lab Challenges — Web Application Attacks

**Difficolta:** Beginner-Intermediate
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** DVWA / bWAPP / OWASP Juice Shop

---

## Obiettivo

Esercizi pratici che combinano SQLi, XSS, LFI/command injection e Burp Suite su una webapp intenzionalmente vulnerabile, per consolidare l'intera sezione Web Application Attacks di eJPTv2.

---

## Challenge 1 — Catena completa su DVWA (livello low)

**Target:** DVWA in locale/lab

**Task:**
1. Bypassa l'autenticazione con SQL injection classica
2. Estrai la tabella utenti con UNION-based SQLi
3. Dimostra un reflected e uno stored XSS
4. Dimostra una LFI verso `/etc/passwd`
5. Documenta ogni step con richiesta/risposta da Burp

**Deliverable:** un mini-report con vulnerabilita trovate, payload usato, evidenza (screenshot/output).

---

## Challenge 2 — OWASP Juice Shop free-play

**Target:** OWASP Juice Shop (Docker/lab)

**Task:**
1. Trova almeno 3 challenge diverse (login bypass, XSS, path traversal se presente)
2. Usa Burp Repeater per ogni tentativo, non solo il browser
3. Annota quale categoria OWASP Top 10 corrisponde a ciascuna vulnerabilita trovata

**Deliverable:** tabella challenge/tecnica-usata/categoria OWASP.

---

## Common Mistakes

- Passare subito a sqlmap/tool automatici senza capire manualmente il comportamento dell'app -> per l'esame serve capire cosa succede, non solo ottenere il risultato
- Non salvare le richieste in Burp (history/Repeater tabs) -> perdi la possibilita di ricostruire il payload esatto per il report

---

## Link Utili

- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- [DVWA — Damn Vulnerable Web Application](https://github.com/digininja/DVWA)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [10-Web-Application-Attacks](.)
- **Prossimo Step:** [../11-Tools-Reference/Scripting-Snippets.md](../11-Tools-Reference/Scripting-Snippets.md)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 su DVWA livello low
- [ ] Ho trovato almeno 3 vulnerabilita su Juice Shop
- [ ] So scrivere un mini-report con payload ed evidenza per ogni finding

---

## Note personali

_(spazio libero)_
