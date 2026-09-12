# SMTP & DNS Enumeration

**Difficoltà:** Intermediate
**Time to Master:** 1h
**Prerequisiti:** [06-NFS-RPC-Enumeration.md](06-NFS-RPC-Enumeration.md)
**Lab:** INE PTS, Service Enumeration

---

## Obiettivo

Sono due servizi facili da ignorare perché "non si exploitano", e infatti non è quello il punto: SMTP con `VRFY` aperto ti regala una lista di utenti validi, un DNS zone transfer riuscito ti regala la mappa interna di una rete. In entrambi i casi non stai attaccando nulla, stai solo raccogliendo materiale che userai concretamente nella fase successiva.

---

## Concetti chiave

### Comandi SMTP per user enumeration

| Comando | Uso | Comportamento tipico |
|---------|-----|------------------------|
| `VRFY` | verifica se un utente esiste | risposta diversa per utente valido/non valido (se non disabilitato) |
| `EXPN` | espande una mailing list | rivela indirizzi membri se abilitato |
| `RCPT TO` | destinatario di una mail | usato come fallback quando VRFY e disabilitato (comportamento server differisce su indirizzo esistente/inesistente) |

### DNS zone transfer (AXFR)

Un DNS server mal configurato può permettere il trasferimento completo della zona a chiunque lo richieda, rivelando tutti i record (subdomain, IP interni, host mail) in un colpo solo. I resolver moderni spesso limitano AXFR, ma resta un test da fare sempre.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| smtp-user-enum | `smtp-user-enum -M VRFY -U users.txt -t target` | utenti validi via SMTP | automatizza VRFY/EXPN/RCPT |
| netcat | `nc -nv target 25` | interazione manuale protocollo SMTP | utile per capire esattamente cosa risponde il server |
| dig | `dig axfr @nsserver target.com` | zone transfer completo | fallisce silenziosamente se non permesso |
| nmap | `nmap --script smtp-commands,dns-zone-transfer -p25,53 target` | comandi supportati SMTP + tentativo AXFR | integra bene lo scan iniziale |

---

## Payload / Esempi

### Esempio 1: user enumeration SMTP automatizzata

```bash
smtp-user-enum -M VRFY -U /usr/share/seclists/Usernames/top-usernames-shortlist.txt -t 10.10.10.5
```

**Output atteso:**
```
admin@10.10.10.5 exists
backup@10.10.10.5 exists
guest@10.10.10.5 does not exist
```

**Spiegazione:** la userlist risultante può essere riusata direttamente per un brute force mirato su SSH/FTP/web login (vedi [../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md)).

### Esempio 2: VRFY manuale via netcat

```bash
nc -nv 10.10.10.5 25
VRFY root
```

**Output atteso:**
```
250 2.1.5 root <root@localhost>
```

**Spiegazione:** una risposta 250 conferma l'esistenza dell'utente; un 550 tipicamente indica utente inesistente: utile quando VRFY non e disabilitato dal server.

### Esempio 3: tentativo di zone transfer DNS

```bash
dig axfr @ns1.target.com target.com
```

**Output atteso (se vulnerabile):**
```
target.com.        300  IN  A     10.10.10.5
mail.target.com.   300  IN  A     10.10.10.6
internal.target.com. 300 IN A    10.10.10.20
```

**Spiegazione:** una zona trasferita con successo rivela host interni non altrimenti scopribili via enumerazione esterna: quasi sempre negato su target moderni, ma sempre da provare.

---

## Lab Hands-On

### Lab 1: INE PTS, Mail & DNS enumeration
**Obiettivo:** enumerare almeno 3 utenti via SMTP e verificare se il DNS permette zone transfer
**Difficulty:** Medio
**Time:** 35 min

**Walkthrough breve:**
1. smtp-user-enum con una shortlist di username comuni
2. Verifica manuale VRFY/RCPT TO via netcat se il tool automatico non chiarisce
3. dig axfr contro ogni nameserver identificato per il dominio target

---

## Common Mistakes

- Usare solo VRFY quando e disabilitato -> ricontrollare con RCPT TO, spesso il comportamento differisce comunque tra utenti validi/non validi
- Provare axfr solo verso il resolver pubblico e non verso i nameserver autoritativi specifici del dominio -> il transfer va tentato contro ogni NS elencato
- Non incrociare le userlist raccolte da SMTP con quelle di SMB/SNMP -> combinare le fonti aumenta le probabilità di successo nei password attack

---

## Link Utili

- [smtp-user-enum GitHub](https://github.com/pentestmonkey/smtp-user-enum)

---

## Connessioni

- **Prerequisito:** [06-NFS-RPC-Enumeration.md](06-NFS-RPC-Enumeration.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md](../05-System-Host-Attacks/03-Password-Attacks-Hydra-John-Hashcat.md)

---

## Checklist di padronanza

- [ ] So enumerare utenti SMTP con VRFY/EXPN/RCPT TO
- [ ] So tentare uno zone transfer DNS con dig axfr
- [ ] So riusare le userlist raccolte per i password attack successivi

