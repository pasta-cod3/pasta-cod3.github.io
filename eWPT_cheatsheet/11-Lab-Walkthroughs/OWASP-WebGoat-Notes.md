# OWASP WebGoat — Notes

**Difficulty:** Facile-Medio (progressivo, per lezione)
**Time to complete (stimato):** 6-8h per l'intera piattaforma
**Vulnerability:** copertura ampia OWASP Top 10, ottimo complemento a PortSwigger Academy

---

## Obiettivo

WebGoat e un'applicazione volutamente vulnerabile (Java/Spring) con lezioni guidate interattive: buon complemento pratico ai lab PortSwigger, con focus leggermente diverso (piu vicino a un'applicazione "reale" completa piuttosto che lab isolati per singola tecnica).

---

## Setup rapido

```bash
docker run -p 8080:8080 -p 9090:9090 webgoat/webgoat
```
Accedi poi su `http://localhost:8080/WebGoat`.

---

## Percorso consigliato per modulo

| Modulo WebGoat | File cheatsheet collegato |
|------------------|-------------------------------|
| SQL Injection (intro + advanced) | [04-SQL-Injection/](../04-SQL-Injection/) |
| Cross-Site Scripting | [05-Cross-Site-Scripting/](../05-Cross-Site-Scripting/) |
| Path Traversal | [03-File-Inclusion/01-LFI-Basics.md](../03-File-Inclusion/01-LFI-Basics.md) |
| Insecure Direct Object References | [06-Authentication-Authorization/04-IDOR.md](../06-Authentication-Authorization/04-IDOR.md) |
| CSRF | [06-Authentication-Authorization/03-CSRF-Attacks.md](../06-Authentication-Authorization/03-CSRF-Attacks.md) |
| JWT | [06-Authentication-Authorization/06-JWT-Exploitation.md](../06-Authentication-Authorization/06-JWT-Exploitation.md) |
| Insecure Deserialization | argomento avanzato, non coperto in dettaglio in questo cheatsheet — utile approfondimento extra |
| XXE | argomento avanzato, non coperto in dettaglio in questo cheatsheet — utile approfondimento extra |

---

## Key Lessons

- WebGoat presenta le vulnerabilita nel contesto di un'applicazione Java "verosimile": utile per abituarsi a stack tecnologici diversi da PHP (spesso predominante nei lab HTB easy)
- I moduli su Insecure Deserialization e XXE non sono coperti in profondita in questo cheatsheet (fuori scope principale eWPT ma utili come cultura generale) — se il tempo lo permette, completali comunque
- Le lezioni guidate con hint progressivi sono ottime per chi e ancora insicuro sui concetti di base prima di passare ai lab "a scatola nera" di PortSwigger/HTB

---

## Connessioni

- **Combinazione con:** [04-SQL-Injection/](../04-SQL-Injection/), [05-Cross-Site-Scripting/](../05-Cross-Site-Scripting/), [06-Authentication-Authorization/](../06-Authentication-Authorization/)

---

## Note personali

_(traccia qui i moduli completati e argomenti extra da approfondire)_
