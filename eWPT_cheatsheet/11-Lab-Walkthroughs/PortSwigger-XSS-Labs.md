# PortSwigger Academy: XSS Labs (Walkthrough Notes)

**Difficulty:** Facile-Difficile (progressivo)
**Time to complete (stimato):** 8-10h per l'intera serie
**Vulnerability:** tutte le varianti di XSS coperte in [05-Cross-Site-Scripting/](../05-Cross-Site-Scripting/)

---

## Obiettivo

Con l'XSS la tentazione è imparare un payload e provarlo ovunque, poi scopri che in metà dei casi non funziona perché il contesto di injection è diverso. Questa serie di lab PortSwigger ti costringe a guardare il contesto ogni volta — HTML body, attributo, stringa JS — prima di scegliere il payload, ed è probabilmente il modo più efficiente per interiorizzare quella disciplina prima dell'esame.

---

## Percorso consigliato (in ordine di difficoltà crescente)

| Lab | File cheatsheet collegato |
|-----|------------------------------|
| Reflected XSS into HTML context with nothing encoded | [01-XSS-Fundamentals.md](../05-Cross-Site-Scripting/01-XSS-Fundamentals.md) |
| Stored XSS into HTML context with nothing encoded | [03-Stored-XSS.md](../05-Cross-Site-Scripting/03-Stored-XSS.md) |
| DOM XSS in document.write sink using source location.search | [04-DOM-XSS.md](../05-Cross-Site-Scripting/04-DOM-XSS.md) |
| DOM XSS in innerHTML sink using source location.hash | [04-DOM-XSS.md](../05-Cross-Site-Scripting/04-DOM-XSS.md) |
| Reflected XSS into attribute with angle brackets HTML-encoded | [05-Encoding-Payloads.md](../05-Cross-Site-Scripting/05-Encoding-Payloads.md) |
| Reflected XSS into a JavaScript string with angle brackets HTML-encoded | [05-Encoding-Payloads.md](../05-Cross-Site-Scripting/05-Encoding-Payloads.md) |
| Reflected XSS with some SVG markup allowed | [06-WAF-Evasion.md](../05-Cross-Site-Scripting/06-WAF-Evasion.md) |
| Reflected XSS with AngularJS sandbox escape without strings | [06-WAF-Evasion.md](../05-Cross-Site-Scripting/06-WAF-Evasion.md) |
| Exploiting XSS to steal cookies | [07-Cookie-Stealing.md](../05-Cross-Site-Scripting/07-Cookie-Stealing.md) |
| Exploiting XSS to bypass CSRF defenses | [07-Cookie-Stealing.md](../05-Cross-Site-Scripting/07-Cookie-Stealing.md) |

---

## Metodologia di studio consigliata

1. Usa sempre "View source" e DOM Invader per capire il contesto ESATTO prima di scegliere un payload
2. Per i lab di sfruttamento (cookie stealing), usa l'exploit server integrato di PortSwigger per costruire e consegnare il PoC realisticamente
3. Documenta ogni payload che ha funzionato in un file di note personale, con il contesto specifico che lo richiedeva

---

## Key Lessons

- Il contesto di injection (HTML body, attributo, JS string) determina COMPLETAMENTE quale payload funziona: non esiste un payload universale
- I lab "exploit server" insegnano la parte spesso trascurata: costruire un attacco end-to-end, non solo un `alert(1)`
- DOM Invader (integrato in Burp) accelera enormemente l'identificazione di source/sink rispetto alla lettura manuale del JS

---

## Connessioni

- **Prerequisito:** [05-Cross-Site-Scripting/01-XSS-Fundamentals.md](../05-Cross-Site-Scripting/01-XSS-Fundamentals.md)
- **Combinazione con:** [05-Cross-Site-Scripting/Lab-Challenges.md](../05-Cross-Site-Scripting/Lab-Challenges.md)

