# Nmap / Metasploit Quick Reference

**Difficoltà:** Beginner
**Time to Master:** 30 min
**Prerequisiti:** [02-Footprinting-Scanning/01-Nmap-Fundamentals.md](../02-Footprinting-Scanning/01-Nmap-Fundamentals.md), [07-Metasploit-Framework/01-Msfconsole-Basics.md](../07-Metasploit-Framework/01-Msfconsole-Basics.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Quando sei dentro un lab con il tempo che corre, l'ultima cosa che vuoi è riaprire cinque file diversi per ricordarti la sintassi di un flag nmap o di un comando msfconsole che usi praticamente ogni volta. Questa pagina esiste per quello: i comandi che finisci per digitare più spesso, raccolti in un unico posto, pronti da copiare senza pensarci due volte.

---

## Nmap: flag più usate

| Flag | Significato |
|------|--------------|
| `-sS` | SYN scan (default se root, semi-aperto, veloce) |
| `-sT` | TCP connect scan (no root necessario, più rumoroso) |
| `-sU` | UDP scan |
| `-sV` | version detection |
| `-sC` | script default (equivalente a `--script=default`) |
| `-A` | OS detect + version + script + traceroute (aggressivo) |
| `-p-` | tutte le 65535 porte |
| `-p 21,22,80` | porte specifiche |
| `--top-ports 100` | le 100 porte più comuni |
| `-O` | OS fingerprinting |
| `-T0`..`-T5` | timing, da paranoid a insane |
| `--min-rate=5000` | forza velocità minima pacchetti/sec |
| `-Pn` | salta host discovery (tratta l'host come up) |
| `-n` | no DNS resolution (più veloce) |
| `--script vuln` | script NSE categoria vulnerabilità |
| `-oN/-oX/-oG/-oA` | output normale/XML/grepable/tutti i formati |

```bash
# scan iniziale completo consigliato
nmap -p- --min-rate=5000 -Pn -oN allports.txt 10.10.10.5
nmap -sV -sC -p$(cat allports.txt | grep open | cut -d'/' -f1 | tr '\n' ',') -oN services.txt 10.10.10.5
```

---

## msfconsole: comandi essenziali

| Comando | Uso |
|---------|-----|
| `search <termine>` | cerca moduli (exploit/auxiliary/post) |
| `use <path modulo>` | seleziona modulo |
| `show options` | mostra parametri richiesti |
| `show payloads` | payload compatibili col modulo corrente |
| `set RHOSTS <ip>` | target |
| `set LHOST <ip>` | il tuo IP per callback |
| `setg <opzione> <valore>` | come `set` ma persistente su tutta la sessione |
| `check` | verifica se il target e vulnerabile senza sfruttare |
| `run` / `exploit` | esegue il modulo |
| `sessions -l` | lista sessioni attive |
| `sessions -i <id>` | interagisci con una sessione |
| `background` (o `Ctrl+Z`) | metti la sessione in background senza chiuderla |

---

## Meterpreter: comandi essenziali

| Comando | Uso |
|---------|-----|
| `sysinfo` | info sistema target |
| `getuid` | utente corrente |
| `ps` | processi in esecuzione |
| `migrate <pid>` | sposta il processo meterpreter |
| `hashdump` | dump hash SAM (richiede privilegi adeguati) |
| `download <file>` / `upload <file>` | trasferimento file |
| `shell` | drop a shell nativa del sistema |
| `background` | torna a msfconsole senza chiudere |
| `run post/multi/recon/local_exploit_suggester` | suggerisce exploit di privesc locali |

---

## Connessioni

- **Prerequisito:** [02-Footprinting-Scanning/01-Nmap-Fundamentals.md](../02-Footprinting-Scanning/01-Nmap-Fundamentals.md), [07-Metasploit-Framework/01-Msfconsole-Basics.md](../07-Metasploit-Framework/01-Msfconsole-Basics.md)

