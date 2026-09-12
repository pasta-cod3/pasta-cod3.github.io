# NFS & RPC Enumeration

**Difficoltà:** Intermediate
**Time to Master:** 1h
**Prerequisiti:** [05-Web-Enumeration.md](05-Web-Enumeration.md)
**Lab:** INE PTS, Linux Enumeration

---

## Obiettivo

NFS è quel servizio che sulla carta sembra innocuo — "monta una cartella remota come se fosse locale" — e che in pratica, quando mal configurato, ti regala lettura o scrittura di file su un host senza che tu debba fornire una singola credenziale. Se poi trovi `no_root_squash` attivo, quello che sembrava solo un file server diventa un percorso diretto verso root.

---

## Concetti chiave

### Portmapper/RPC

NFS si appoggia su RPC (Remote Procedure Call), gestito storicamente dal portmapper (porta 111). `rpcinfo` interroga questo servizio per scoprire quali programmi RPC (incluso NFS) sono registrati e su quali porte.

### Permessi di export

Gli export NFS possono essere configurati con opzioni critiche:

| Opzione | Significato | Rischio |
|---------|--------------|---------|
| `rw` | lettura/scrittura | alto se combinato con no_root_squash |
| `no_root_squash` | l'utente root del client mantiene privilegi root sulla share | permette di creare file con owner root, spesso porta a privesc |
| `all_squash` | tutti gli utenti mappati a uno solo (es. nobody) | più sicuro, limita l'impatto |

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| rpcinfo | `rpcinfo -p target` | lista servizi RPC registrati | primo step, mostra se NFS e presente |
| showmount | `showmount -e target` | lista export NFS disponibili | mostra path e permessi client |
| mount | `mount -t nfs target:/share /mnt/nfs` | monta la share localmente | richiede root locale |

---

## Payload / Esempi

### Esempio 1: scoprire servizi RPC registrati

```bash
rpcinfo -p 10.10.10.5
```

**Output atteso:**
```
   program vers proto   port  service
    100000    4   tcp    111  portmapper
    100003    3   tcp   2049  nfs
```

**Spiegazione:** conferma che NFS e in ascolto sulla porta standard 2049, oltre al portmapper su 111.

### Esempio 2: elencare gli export disponibili

```bash
showmount -e 10.10.10.5
```

**Output atteso:**
```
Export list for 10.10.10.5:
/opt/backups (everyone)
/home/user   10.10.10.0/24
```

**Spiegazione:** `(everyone)` indica che qualunque client può montare quella share senza restrizioni di IP: il primo target da testare.

### Esempio 3: montare e sfruttare no_root_squash

```bash
mkdir /mnt/nfs
sudo mount -t nfs 10.10.10.5:/opt/backups /mnt/nfs
ls -la /mnt/nfs
```

**Spiegazione:** una volta montata, se l'export ha `no_root_squash`, un file creato come root locale (`touch /mnt/nfs/test`) apparira come owned da root anche sul target: condizione spesso sfruttata per privilege escalation, vedi [../08-Exploitation-PostEx/04-Privilege-Escalation-Linux.md](../08-Exploitation-PostEx/04-Privilege-Escalation-Linux.md).

---

## Lab Hands-On

### Lab 1: INE PTS, NFS misconfiguration
**Obiettivo:** identificare ed elencare export NFS, montarne uno e valutare i permessi effettivi
**Difficulty:** Medio
**Time:** 40 min

**Walkthrough breve:**
1. rpcinfo -p per confermare presenza NFS
2. showmount -e per listare gli export
3. Monta la share e verifica se e leggibile/scrivibile, cerca file interessanti

---

## Common Mistakes

- Dimenticare rpcinfo e passare direttamente a showmount -> a volte serve confermare prima che RPC/NFS sia effettivamente presente
- Non verificare i permessi effettivi dopo il mount (`ls -la`) -> UID/GID mapping può sorprendere
- Ignorare NFS perché "e meno comune" -> in molte macchine Linux di lab e la chiave di accesso iniziale o di privesc

---

## Link Utili

- [NFS export options: man exports](https://man7.org/linux/man-pages/man5/exports.5.html)

---

## Connessioni

- **Prerequisito:** [05-Web-Enumeration.md](05-Web-Enumeration.md)
- **Prossimo Step:** [07-SMTP-DNS-Enumeration.md](07-SMTP-DNS-Enumeration.md)
- **Combinazione con:** [../08-Exploitation-PostEx/04-Privilege-Escalation-Linux.md](../08-Exploitation-PostEx/04-Privilege-Escalation-Linux.md)

---

## Checklist di padronanza

- [ ] So usare rpcinfo e showmount per scoprire export NFS
- [ ] So montare una share NFS e verificarne i permessi
- [ ] Capisco il rischio di no_root_squash

