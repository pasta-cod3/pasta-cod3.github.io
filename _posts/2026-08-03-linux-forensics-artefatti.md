---
layout: post
title: "Linux Forensics: gli artefatti che restano su un server compromesso"
date: 2026-08-03
cat: blue
tags: [DFIR, Linux forensics, bash history, auth.log, cron, systemd, incident response]
excerpt: "Un attaccante che ottiene una shell su un server Linux lascia tracce in decine di posti diversi: log di autenticazione, cronologia della shell, cron job, unit systemd. Sapere dove guardare, in ordine, fa la differenza tra ricostruire l'attacco e restare bloccati."
---

Un server web Linux inizia a mandare traffico verso un indirizzo IP sconosciuto alle tre del mattino. Il team scopre l'incidente due giorni dopo. L'attaccante ha avuto tutto il tempo di ripulire quello che sapeva ripulire, ma su Linux le tracce di un compromissione sono sparse su così tanti file diversi che è quasi impossibile cancellarle tutte senza lasciare a sua volta il segno di averle cancellate.

Questo articolo copre gli artefatti Linux più utili in un'indagine di incident response, in un ordine pensato per chi deve ricostruire un attacco partendo da un server già compromesso.

## Log di autenticazione: chi è entrato, da dove e quando

```bash
# Debian/Ubuntu
/var/log/auth.log

# RHEL/CentOS/Fedora
/var/log/secure
```

Ogni tentativo di login, riuscito o fallito, ogni uso di `sudo` e ogni nuova sessione SSH viene registrato qui. Un pattern classico da cercare è un lungo elenco di tentativi SSH falliti da un singolo IP, seguito da un login riuscito: la firma di un attacco brute force andato a segno.

```bash
grep "Failed password" /var/log/auth.log | wc -l
grep "Accepted password\|Accepted publickey" /var/log/auth.log
```

Un dettaglio spesso trascurato: se l'attaccante ha eliminato l'intero file `auth.log`, la sua assenza (o una dimensione anomalmente piccola rispetto alla rotazione normale dei log) è essa stessa una prova, spesso più eloquente di quanto ci fosse scritto dentro.

## Bash history: cosa ha digitato l'attaccante

```bash
~/.bash_history
```

Ogni comando digitato in una shell interattiva bash viene salvato qui riga per riga, in ordine cronologico ma senza timestamp per impostazione predefinita (a meno che la variabile `HISTTIMEFORMAT` non sia stata configurata prima). È uno degli artefatti più diretti per capire *cosa ha fatto* l'attaccante una volta dentro: enumerazione, download di tool, tentativi di privilege escalation.

Un attaccante consapevole spesso cancella o svuota questo file (`history -c`, `rm .bash_history`, oppure imposta `HISTSIZE=0` prima di agire). La sua assenza totale su un account che risulta comunque usato attivamente è di per sé un segnale di attività sospetta e va documentata come tale.

## Cron job e systemd timer: la persistenza silenziosa

```bash
# Cron job per utente
/var/spool/cron/crontabs/<utente>
crontab -l -u <utente>

# Cron job di sistema
/etc/crontab
/etc/cron.d/

# Unit systemd (servizi e timer)
/etc/systemd/system/
systemctl list-timers --all
```

Un attaccante che vuole sopravvivere a un riavvio spesso installa un cron job che riscarica una backdoor a intervalli regolari, oppure crea una unit systemd mascherata da servizio legittimo. Va controllato non solo `crontab -l` per l'utente sospetto, ma anche i cron job di sistema e ogni unit systemd non riconosciuta, specialmente quelle con nomi che imitano servizi noti (`systemd-udevd-monitor` invece di `systemd-udevd`, per esempio).

## Processi e connessioni di rete attive

Su un sistema ancora acceso, prima di qualsiasi acquisizione del disco, va catturato lo stato live di processi e rete, perché scompare al riavvio:

```bash
ps auxf                    # albero dei processi, mostra le relazioni padre-figlio
netstat -tulpn              # connessioni di rete attive con PID associato
lsof -p <PID>                # file aperti da un processo sospetto
ls -la /proc/<PID>/exe       # percorso reale dell'eseguibile, anche se il nome è ingannevole
```

Un trucco comune degli attaccanti è rinominare il proprio processo malevolo per farlo sembrare legittimo (`[kworker/0:1]` è un nome tipico usato per mimetizzarsi tra i processi del kernel). Controllare `/proc/<PID>/exe` mostra il percorso reale del binario in esecuzione, indipendentemente dal nome visualizzato in `ps`.

## File modificati di recente e permessi anomali

```bash
find / -mtime -2 -type f 2>/dev/null | grep -v "^/proc\|^/sys"
find / -perm -4000 -type f 2>/dev/null    # binari con bit SUID, possibile privesc
```

Cercare i file modificati nelle ultime 48 ore (adattando la finestra temporale al caso specifico) su tutto il filesystem, escludendo `/proc` e `/sys` che cambiano costantemente per natura, è un modo rapido per individuare file lasciati o modificati dall'attaccante. La ricerca dei binari con bit SUID attivo aiuta a scoprire meccanismi di escalation dei privilegi lasciati appositamente da chi ha già ottenuto accesso root e vuole poterlo riottenere anche da un utente non privilegiato.

## Attenzione al timestomping su ext4

Anche su Linux i timestamp dei file (`mtime`, `atime`, `ctime`) possono essere alterati con `touch -d`, ma il `ctime` (change time, quando i metadati del file sono cambiati) è più difficile da falsificare in modo coerente rispetto agli altri due, perché cambia automaticamente ogni volta che il file viene toccato in qualunque modo, incluso l'uso di `touch` stesso per modificare gli altri timestamp. Un `mtime` "pulito" ma un `ctime` molto più recente è spesso il segnale di un tentativo di camuffamento.

## Checklist essenziale

```
✅ /var/log/auth.log o /var/log/secure   → login, sudo, tentativi falliti
✅ ~/.bash_history                       → comandi digitati (occhio a cancellazioni sospette)
✅ crontab e /etc/systemd/system/        → persistenza pianificata
✅ ps auxf + /proc/<PID>/exe             → processi reali, non solo il nome visualizzato
✅ find / -mtime -N                      → file toccati di recente
✅ find / -perm -4000                    → binari SUID sospetti
✅ ctime anomalo rispetto a mtime        → possibile timestomping
```

## Conclusione

Linux non nasconde le tracce meglio di Windows: le distribuisce semplicemente in modo diverso, tra file di testo semplici e strutture del filesystem invece che in un unico grande Registro. Un attaccante può ripulire un file alla volta, ma raramente pensa a tutti i posti diversi in cui il sistema ha comunque registrato il suo passaggio.

Nel prossimo articolo si torna alla posta elettronica, ma con un taglio diverso da quello già visto per SPF e DKIM: come si legge un header email riga per riga per stabilire, con certezza tecnica, se un messaggio è stato falsificato.
