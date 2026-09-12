# Lab Challenges: Social Engineering

**Difficoltà:** Beginner
**Time to Master:** variabile
**Prerequisiti:** tutti i file di questa sezione
**Lab:** raccolta

---

## Obiettivo

Prima di lasciarti alle spalle il social engineering e tornare a target puramente tecnici, mettiti alla prova su queste due challenge: triage di email sospette e un credential harvester end-to-end. Sono l'ultima occasione di questa sezione per collegare teoria e pratica prima di passare alle Web Application Attacks.

---

## Challenge 1: Triage di email di phishing

**Target:** dataset di email di esempio (lab TryHackMe o forniti dal corso INE)

**Task:**
1. Analizza 5 email campione ed elenca gli indicatori di phishing trovati in ognuna (mittente, link, urgenza, allegati)
2. Classifica ogni email come phishing/spear phishing/legittima con motivazione
3. Verifica whois/età di registrazione dei domini sospetti

**Deliverable:** tabella email/indicatori-trovati/classificazione.

---

## Challenge 2: Credential harvester end-to-end

**Target:** webapp di login interna al lab (VM isolata)

**Task:**
1. Clona la pagina di login con SET (Site Cloner)
2. Da un secondo host del lab, invia credenziali di test alla pagina clonata
3. Verifica e documenta il log delle credenziali catturate
4. Spegni web server/listener a fine test

**Deliverable:** screenshot del log catturato + note sui passi eseguiti.

---

## Common Mistakes

- Saltare la fase di documentazione -> senza note e impossibile scrivere un report di social engineering assessment credibile
- Dimenticare di fermare i servizi lanciati da SET -> restano esposti anche dopo il test

---

## Link Utili

- [TryHackMe: Social Engineering rooms](https://tryhackme.com/)

---

## Connessioni

- **Prerequisito:** tutti i file precedenti di [09-Social-Engineering](.)
- **Prossimo Step:** [../10-Web-Application-Attacks/01-Web-Fundamentals-HTTP.md](../10-Web-Application-Attacks/01-Web-Fundamentals-HTTP.md)

---

## Checklist di padronanza

- [ ] Ho completato challenge 1 e 2 in ambiente di lab
- [ ] So spiegare la differenza tra test autorizzato e attacco reale
- [ ] Sono pronto a passare alle Web Application Attacks

