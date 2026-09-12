# PortSwigger Academy: SQL Injection Labs (Walkthrough Notes)

**Difficulty:** Facile-Difficile (progressivo)
**Time to complete (stimato):** 8-10h per l'intera serie
**Vulnerability:** tutte le varianti di SQLi coperte in [04-SQL-Injection/](../04-SQL-Injection/)

---

## Obiettivo

Se c'è una cosa che ti conviene fare prima dell'esame è passare per tutta la serie SQLi di PortSwigger Academy: è gratuita, è curata a livello di dettaglio che raramente trovi altrove, e copre ogni variante che poi ritroverai identica (o quasi) su HTB e nell'esame stesso. Qui hai il percorso ordinato, dal lab più semplice al più ostico.

---

## Percorso consigliato (in ordine di difficoltà crescente)

| Lab | File cheatsheet collegato |
|-----|------------------------------|
| SQL injection vulnerability in WHERE clause allowing retrieval of hidden data | [01-SQLi-Fundamentals.md](../04-SQL-Injection/01-SQLi-Fundamentals.md) |
| SQL injection vulnerability allowing login bypass | [01-SQLi-Fundamentals.md](../04-SQL-Injection/01-SQLi-Fundamentals.md) |
| SQL injection UNION attack, determining the number of columns | [03-Union-Based-SQLi.md](../04-SQL-Injection/03-Union-Based-SQLi.md) |
| SQL injection UNION attack, retrieving data from other tables | [03-Union-Based-SQLi.md](../04-SQL-Injection/03-Union-Based-SQLi.md) |
| SQL injection attack, querying the database type and version | [02-Error-Based-SQLi.md](../04-SQL-Injection/02-Error-Based-SQLi.md) |
| Blind SQL injection with conditional responses | [04-Blind-SQLi.md](../04-SQL-Injection/04-Blind-SQLi.md) |
| Blind SQL injection with conditional errors | [02-Error-Based-SQLi.md](../04-SQL-Injection/02-Error-Based-SQLi.md) |
| Blind SQL injection with time delays | [05-Time-Based-Blind.md](../04-SQL-Injection/05-Time-Based-Blind.md) |
| SQL injection with filter bypass via XML encoding | [06-Encoding-Bypasses.md](../04-SQL-Injection/06-Encoding-Bypasses.md) |

---

## Metodologia di studio consigliata

1. Prova il lab SENZA guardare la soluzione per almeno 15-20 minuti
2. Se bloccato, consulta il file cheatsheet collegato per la tecnica generale
3. Applica la tecnica, adattandola alle specificità del lab
4. Dopo la risoluzione, rileggi la spiegazione ufficiale PortSwigger per capire ESATTAMENTE perché funziona
5. Ripeti il lab da zero un paio di giorni dopo per verificare ritenzione

---

## Key Lessons

- I lab PortSwigger sono progettati per insegnare UN concetto alla volta: non saltare avanti, la progressione è intenzionale
- Ogni lab ha una "solution" ufficiale nascosta: usala solo dopo aver tentato seriamente da solo
- Molti pattern qui si ripetono identici nelle macchine HTB e nell'esame stesso: la ripetizione paga

---

## Connessioni

- **Prerequisito:** [04-SQL-Injection/01-SQLi-Fundamentals.md](../04-SQL-Injection/01-SQLi-Fundamentals.md)
- **Combinazione con:** [04-SQL-Injection/Lab-Challenges.md](../04-SQL-Injection/Lab-Challenges.md)

