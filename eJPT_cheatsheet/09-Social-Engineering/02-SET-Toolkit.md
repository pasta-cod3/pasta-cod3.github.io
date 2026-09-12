# Social-Engineer Toolkit (SET)

**Difficolta:** Beginner
**Time to Master:** 1h
**Prerequisiti:** [01-Phishing-Basics.md](01-Phishing-Basics.md)
**Lab:** INE PTS — Social Engineering module (simulazione controllata)

---

## Obiettivo

Conoscere l'uso base di SET, il framework open-source per simulare attacchi di social engineering (credential harvester, payload email) dentro un ambiente di lab isolato. eJPTv2 richiede di sapere cosa fa SET e come si naviga il menu, non necessariamente di lanciarlo contro infrastrutture reali.

---

## Concetti chiave

### Cosa offre SET

| Modulo | Funzione |
|--------|----------|
| Social-Engineering Attacks | menu principale: spear phishing, website attack, USB/CD, ecc. |
| Website Attack Vectors | clona una pagina (credential harvester), genera payload da servire |
| Credential Harvester | cattura username/password inseriti nella pagina clonata e li salva in log locale |
| Payload/Listener | genera payload Meterpreter e avvia listener collegato |

### Flusso tipico (credential harvester)

1. Scegli `1) Social-Engineering Attacks`
2. Scegli `2) Website Attack Vectors`
3. Scegli `3) Credential Harvester Attack Method`
4. Scegli `2) Site Cloner`
5. Inserisci IP locale (dove SET ospitera la pagina clonata) e URL da clonare
6. SET avvia un web server locale con la pagina clonata; ogni submit del form viene loggato

---

## Strumenti

| Tool | Comando base | Output | Note |
|------|---------------|--------|------|
| SET | `setoolkit` | menu interattivo numerato | richiede permessi elevati per bind su porta 80 |
| Apache/servizio web locale | avviato automaticamente da SET | hosting pagina clonata | va sempre su rete/host di lab isolato |

---

## Payload / Esempi

### Esempio 1: avvio e navigazione menu base

```bash
sudo setoolkit
```

```
Select from the menu:
   1) Social-Engineering Attacks
   2) Penetration Testing (Fast-Track)
   3) Third Party Modules
   99) Exit the Social-Engineer Toolkit

set> 1

   1) Spear-Phishing Attack Vectors
   2) Website Attack Vectors
   3) Infectious Media Generator
   ...

set> 2
```

**Spiegazione:** SET e interamente guidato da menu numerati; ogni scelta apre un sottomenu piu specifico. Per l'esame eJPTv2 basta sapere identificare quale sequenza di menu porta a un credential harvester.

### Esempio 2: credential harvester su pagina clonata (lab isolato)

```
set:webattack> 3   # Credential Harvester Attack Method
set:webattack> 2   # Site Cloner
[-] IP address for the POST back in Harvester/Tabnabbing: 10.10.10.50
[-] Enter the url to clone: http://intranet.lab.local/login
```

**Output atteso:**
```
[*] Cloning the website: http://intranet.lab.local/login
[*] This could take a little bit...
[*] I have read info.html for the credentials!
[*] Web Server Attack Vector will let you import a list of pre-defined web
    attack vectors that you can use to conduct social engineer attacks.

Press {return} to continue.
```

**Spiegazione:** SET clona la pagina indicata e resta in ascolto; ogni tentativo di login sulla pagina clonata viene salvato in `/root/.set/reports/` (o percorso equivalente) con username/password in chiaro. Solo su target di lab, mai su domini reali senza autorizzazione firmata.

---

## Evasion / Bypass Techniques

Non applicabile in senso offensivo: l'unico "bypass" rilevante e la somiglianza visiva della pagina clonata con l'originale, che e gia il vettore principale dell'attacco.

---

## Lab Hands-On

### Lab 1: INE PTS — SET credential harvester su webapp di lab
**Obiettivo:** clonare una pagina di login interna e catturare credenziali di test
**Difficulty:** Facile
**Time:** 30 min

**Walkthrough breve:**
1. Avvia `setoolkit` sulla VM attacker del lab
2. Segui il flusso Website Attack Vectors -> Credential Harvester -> Site Cloner
3. Apri la pagina clonata da un altro host del lab e inserisci credenziali di test
4. Verifica che siano state loggate correttamente

---

## Common Mistakes

- Lanciare SET fuori da un ambiente di lab isolato -> rischio legale enorme, mai farlo
- Dimenticare di fermare il web server/listener di SET a fine test -> resta esposto inutilmente
- Non spiegare al cliente/utenti coinvolti lo scopo del test dopo -> il social engineering assessment ha valore solo se seguito da awareness training

---

## Link Utili

- [SET su GitHub (trustedsec/social-engineer-toolkit)](https://github.com/trustedsec/social-engineer-toolkit)

---

## Connessioni

- **Prerequisito:** [01-Phishing-Basics.md](01-Phishing-Basics.md)
- **Prossimo Step:** [Lab-Challenges.md](Lab-Challenges.md)
- **Combinazione con:** [../07-Metasploit-Framework/04-Meterpreter-Msfvenom.md](../07-Metasploit-Framework/04-Meterpreter-Msfvenom.md)

---

## Checklist di padronanza

- [ ] So navigare il menu di SET fino al credential harvester
- [ ] Capisco dove SET salva le credenziali catturate
- [ ] So perche va usato solo in lab isolato/scope autorizzato

---

## Note personali

_(spazio libero)_
