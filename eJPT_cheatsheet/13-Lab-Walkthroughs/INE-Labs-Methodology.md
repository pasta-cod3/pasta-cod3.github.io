# INE Labs: Metodologia Generale

**Difficoltà:** Beginner-Intermediate
**Time to Master:** 1h
**Prerequisiti:** [QUICK-START.md](../QUICK-START.md)
**Lab:** INE PTS (Penetration Testing Student), metodologia generica

---

## Obiettivo

La prima volta che ti trovi davanti a una rete con dieci host sconosciuti, la tentazione è buttarti sul primo che sembra interessante e scavare finché non trovi qualcosa. Funziona, ma ti costa un tempo che in esame non hai. Qui non trovi il walkthrough di un lab specifico (nessun contenuto reale d'esame è incluso, né potrebbe esserlo), ma il metodo mentale con cui affrontare una rete multi-host in stile INE PTS, lo stesso stile usato anche nell'esame eJPTv2.

---

## Fase 1: Mappare l'intera rete prima di approfondire

Non fissarti sul primo host che trovi. Prima ottieni una visione d'insieme:

```bash
nmap -sn 10.10.10.0/24 -oN hosts-live.txt
```

Per ogni host live, fai prima uno scan porte rapido (top-ports) e solo dopo uno scan completo: ti dà subito un'idea di quali host sono "interessanti" (tanti servizi, servizi noti vulnerabili) prima di investire tempo nello scan `-p-` completo su ognuno.

---

## Fase 2: Prioritizzare gli host

Non tutti gli host valgono lo stesso tempo. Criteri pratici per decidere dove investire per primo:

| Segnale | Priorità |
|---------|----------|
| Servizio con CVE noto e pubblico (es. SMB non patchato) | Alta: probabile "quick win" |
| Tanti servizi aperti (web + FTP + SMB + ecc.) | Alta: superficie di attacco ampia |
| Solo una porta filtrata/poco chiara | Bassa: lascialo per dopo |
| Host che sembra un DC (porte 88, 389, 445, 3268) | Alta: spesso centrale per l'intera rete |

**Regola pratica:** se dopo 20-30 minuti su un host non hai progressi, passa a un altro e torna dopo: spesso quello che trovi su un secondo host (credenziali, informazioni) sblocca il primo.

---

## Fase 3: Tenere note strutturate per host

Con più host attivi contemporaneamente perdi il filo più in fretta di quanto pensi: una nota testuale semplice, aggiornata mentre procedi, ti salva.

```
HOST: 10.10.10.5
- Porte: 22 (OpenSSH 7.2), 80 (Apache 2.4.18), 445 (Samba 4.3.11)
- Note: share SMB "backup" leggibile anonima, contiene script con credenziali in chiaro
- Credenziali trovate: admin:P@ssw0rd123 (da script in share SMB)
- Accesso ottenuto: no, ma credenziali riusabili su altri host da provare
- Prossimo step: provare le credenziali su SSH/RDP di altri host della rete
```

Aggiorna questo blocco per ogni host: è la base da cui, più avanti, scriverai il report finale (vedi [12-Reporting-Notes](../12-Reporting-Notes/)).

---

## Fase 4: Riusare credenziali/informazioni tra host

Nei lab a rete multi-host il punto centrale è quasi sempre il **credential reuse** e le **informazioni che si spostano da un host all'altro**: una credenziale trovata su un host quasi sempre serve altrove nella stessa rete. Prima di cercare un exploit "flashy" su un host bloccato, chiediti: *quali credenziali/informazioni ho già raccolto che non ho ancora provato qui?*

---

## Quando cambiare host

Segnali che ti dicono che è il momento di spostarti su un altro host:

- Hai enumerato tutti i servizi visibili e non hai né una vulnerabilità né credenziali da provare
- Uno scan/attacco (es. hydra, gobuster) è in esecuzione in background e può continuare da solo
- Sei bloccato da più di 20-30 minuti sullo stesso punto

---

## Connessioni

- **Prerequisito:** [QUICK-START.md](../QUICK-START.md)
- **Combinazione con:** [12-Reporting-Notes/Report-Writing-Tips.md](../12-Reporting-Notes/Report-Writing-Tips.md), [Exam-Tips-eJPTv2.md](Exam-Tips-eJPTv2.md)

