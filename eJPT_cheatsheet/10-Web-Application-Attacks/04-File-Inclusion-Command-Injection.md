# File Inclusion & Command Injection Basics

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [03-XSS-Basics.md](03-XSS-Basics.md)
**Lab:** DVWA / bWAPP, File Inclusion & Command Injection

---

## Obiettivo

Un parametro `?page=about.php` sembra il posto meno pericoloso di un'applicazione, finché non ci provi `../../../../etc/passwd` e il server te lo restituisce senza fare una piega. Qui vedi come riconoscere Local/Remote File Inclusion e Command Injection a livello base: dove cercarle, come confermarle, quale impatto hanno davvero. È la versione introduttiva rispetto alla trattazione approfondita di eWPT (wrapper PHP, evasion filtri) — qui basta riconoscere il pattern e dimostrarlo.

---

## Concetti chiave

### Local File Inclusion (LFI)

Un parametro che seleziona un file lato server (es. `?page=about.php`) senza validazione permette di includere file arbitrari sul filesystem locale, tipicamente con path traversal (`../`).

### Remote File Inclusion (RFI)

Variante più rara oggi (richiede `allow_url_include` attivo in PHP): il parametro accetta un URL esterno, permettendo di includere ed eseguire codice ospitato su un server controllato dall'attaccante.

### Command Injection

Un input passato senza sanitizzazione a una funzione di sistema (es. `system()`, `exec()`) permette di concatenare comandi arbitrari usando separatori di shell.

| Separatore | Effetto |
|------------|---------|
| `;` | esegue il comando successivo indipendentemente dall'esito del primo |
| `&&` | esegue il comando successivo solo se il primo ha successo |
| \| | esegue il comando successivo indipendentemente, redirige output |
| `` ` `` o `$()` | command substitution, esegue e inserisce l'output inline |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| Burp Repeater | invio manuale parametri modificati | risposta completa | metodo principale per confermare |
| curl | `curl "http://target.com/page?file=../../../../etc/passwd"` | contenuto file se vulnerabile | rapido per test da terminale |

---

## Payload / Esempi

### Esempio 1: LFI classico su /etc/passwd

```bash
curl "http://target.com/index.php?page=../../../../etc/passwd"
```

**Output atteso:**
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
...
```

**Spiegazione:** il numero di `../` deve essere sufficiente a risalire dalla directory web root fino alla radice del filesystem; qualche `../` di troppo non è un problema (il sistema ignora quelli oltre la radice).

### Esempio 2: command injection su un campo ping/tool web

```
Input campo IP: 127.0.0.1; whoami
Input campo IP: 127.0.0.1 && cat /etc/passwd
```

**Output atteso:** l'output del comando `ping` seguito dall'output di `whoami`/`cat /etc/passwd` nella stessa risposta.

**Spiegazione:** funzionalità web che eseguono comandi di sistema (tool "ping IP" integrati in dashboard di rete, ecc.) sono un bersaglio classico: se l'input non è sanitizzato, qualsiasi separatore di shell permette di concatenare comandi arbitrari.

---

## Evasion / Bypass Techniques

- Se `../` viene filtrato, prova encoding (`%2e%2e%2f`) o doppio encoding
- Se gli spazi sono filtrati nella command injection, prova `${IFS}` al posto dello spazio

---

## Lab Hands-On

### Lab 1: DVWA, File Inclusion e Command Injection (livello low)
**Obiettivo:** dimostrare LFI su /etc/passwd e command injection su modulo ping
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Sul modulo File Inclusion, prova il path traversal verso `/etc/passwd`
2. Sul modulo Command Injection, concatena `whoami` all'input IP con `;` o `&&`
3. Osserva come cambia il comportamento a livello "medium" (filtri parziali)

---

## Common Mistakes

- Fermarsi al primo tentativo di path traversal senza variare il numero di `../` -> spesso serve calibrare in base alla profondità reale della webroot
- Ignorare i log applicativi come possibile target di LFI-to-RCE (log poisoning) -> tecnica avanzata ma concettualmente utile da conoscere

---

## Link Utili

- [PortSwigger Academy: Path traversal](https://portswigger.net/web-security/file-path-traversal)
- [PortSwigger Academy: OS command injection](https://portswigger.net/web-security/os-command-injection)

---

## Connessioni

- **Prerequisito:** [03-XSS-Basics.md](03-XSS-Basics.md)
- **Prossimo Step:** [05-Burp-Suite-Basics.md](05-Burp-Suite-Basics.md)
- **Combinazione con:** [../08-Exploitation-PostEx/02-Reverse-Bind-Shells.md](../08-Exploitation-PostEx/02-Reverse-Bind-Shells.md)

---

## Checklist di padronanza

- [ ] So confermare una LFI con path traversal verso /etc/passwd
- [ ] Conosco la differenza tra LFI e RFI
- [ ] So concatenare comandi con `;`, `&&`, `|` in una command injection

