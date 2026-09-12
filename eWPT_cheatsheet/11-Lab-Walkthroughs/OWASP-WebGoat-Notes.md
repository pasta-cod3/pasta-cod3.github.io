# OWASP WebGoat: Notes

**Difficulty:** Facile-Medio (progressivo, per lezione)
**Time to complete (stimato):** 6-8h per l'intera piattaforma
**Vulnerability:** copertura ampia OWASP Top 10, ottimo complemento a PortSwigger Academy

---

## Obiettivo

Dopo un po' di lab PortSwigger isolati per singola tecnica, WebGoat ti dà una sensazione diversa e utile: è un'unica applicazione Java/Spring volutamente vulnerabile, con lezioni guidate che ti accompagnano passo passo. Se PortSwigger ti insegna la tecnica in laboratorio, WebGoat ti fa vedere come quella stessa tecnica si comporta dentro un'app "vera" con più pezzi che interagiscono tra loro.

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
| Insecure Deserialization | [08-Exploitation-PostEx/08-Insecure-Deserialization.md](../08-Exploitation-PostEx/08-Insecure-Deserialization.md) |
| XXE | [03-File-Inclusion/07-XXE-Basics.md](../03-File-Inclusion/07-XXE-Basics.md) |

---

## Key Lessons

- WebGoat presenta le vulnerabilità nel contesto di un'applicazione Java "verosimile": utile per abituarsi a stack tecnologici diversi da PHP (spesso predominante nei lab HTB easy)
- I moduli su Insecure Deserialization e XXE non sono il cuore di eWPT, ma valgono lo stesso il tempo: sono trattati nelle pagine collegate sopra, completa comunque i moduli WebGoat per fissare la logica prima di provarli su target reali
- Le lezioni guidate con hint progressivi sono ottime per chi è ancora insicuro sui concetti di base prima di passare ai lab "a scatola nera" di PortSwigger/HTB

---

## Connessioni

- **Combinazione con:** [04-SQL-Injection/](../04-SQL-Injection/), [05-Cross-Site-Scripting/](../05-Cross-Site-Scripting/), [06-Authentication-Authorization/](../06-Authentication-Authorization/)

