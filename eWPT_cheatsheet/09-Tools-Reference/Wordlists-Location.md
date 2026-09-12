# Wordlists Location

**Difficoltà:** Beginner
**Time to Master:** 30 min
**Prerequisiti:** nessuno
**Lab:** riferimento trasversale

---

## Obiettivo

Sai già che ti serve una wordlist per il directory brute-force, ma il nome esatto del file dentro `/usr/share/seclists/` non te lo ricordi mai al momento giusto. Questa pagina è la mappa: dove sta rockyou, dove sono le liste di SecLists organizzate per caso d'uso, e quale scegliere a seconda della fase in cui sei.

---

## Percorsi comuni su Kali Linux

| Percorso | Contenuto |
|----------|-----------|
| `/usr/share/wordlists/rockyou.txt` | password comuni (da decomprimere con `gunzip`) |
| `/usr/share/seclists/Discovery/Web-Content/` | directory/file discovery (raft, common, big) |
| `/usr/share/seclists/Discovery/DNS/` | subdomain/vhost enumeration |
| `/usr/share/seclists/Usernames/` | username comuni |
| `/usr/share/seclists/Passwords/` | password categorizzate (default creds, breach) |
| `/usr/share/seclists/Fuzzing/` | payload SQLi/XSS/LFI pronti |

## Decomprimere rockyou se necessario

```bash
gunzip /usr/share/wordlists/rockyou.txt.gz
```

## Installare SecLists se mancante

```bash
sudo apt install seclists
# oppure
git clone https://github.com/danielmiessler/SecLists.git /opt/SecLists
```

## Wordlist consigliate per fase

| Fase | Wordlist |
|------|----------|
| Directory discovery iniziale | `Discovery/Web-Content/common.txt` |
| Directory discovery approfondito | `Discovery/Web-Content/raft-medium-directories.txt` |
| Vhost/subdomain | `Discovery/DNS/subdomains-top1million-5000.txt` |
| Password spraying | `Passwords/Common-Credentials/xato-net-10-million-passwords-1000.txt` |
| Parametri nascosti | `Discovery/Web-Content/burp-parameter-names.txt` |

---

## Connessioni

- **Combinazione con:** [02-Scanning-Enumeration/03-Web-Enumeration.md](../02-Scanning-Enumeration/03-Web-Enumeration.md), [06-Authentication-Authorization/05-Credential-Attacks.md](../06-Authentication-Authorization/05-Credential-Attacks.md)

