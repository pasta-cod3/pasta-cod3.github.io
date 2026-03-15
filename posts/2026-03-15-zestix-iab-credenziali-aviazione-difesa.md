# Zestix e il broker silenzioso: credenziali rubate da aviazione, difesa e sanità in vendita

## Il fatto

A gennaio 2026, i ricercatori di sicurezza hanno identificato **Zestix** — un threat actor che opera come **Initial Access Broker (IAB)** sul dark web — come responsabile di una campagna prolungata di furto e vendita di credenziali aziendali che ha colpito organizzazioni in settori critici: aviazione, difesa, sanità, utility, trasporti di massa, telecomunicazioni, real estate e governo.

Il vettore era brutalmente semplice: **credenziali rubate da infostealer combinato con assenza di MFA**. Le piattaforme colpite includevano **ShareFile, Nextcloud e OwnCloud** — soluzioni di file sharing aziendali usate da migliaia di organizzazioni nel mondo.

---

## Chi è Zestix

Zestix non è un hacker nel senso tradizionale — è un intermediario. Il modello IAB si è affermato come una delle componenti più redditizie dell'ecosistema del cybercrimine:

1. **Raccolta:** Zestix acquista o raccoglie credenziali da campagne infostealer — malware progettati per estrarre password, cookie e token dai browser
2. **Verifica:** le credenziali vengono testate automaticamente per verificarne la validità
3. **Classificazione:** gli accessi validi vengono classificati per settore, dimensione dell'organizzazione e livello di privilegio
4. **Vendita:** gli accessi vengono venduti ad altri attori — tipicamente gruppi ransomware — che le usano per condurre le intrusioni vere e proprie

---

## Il problema delle piattaforme file sharing

ShareFile, Nextcloud e OwnCloud sono soluzioni di file sharing aziendale diffusissime — spesso usate per condividere documenti con clienti esterni, collaborare su contratti, o archiviare dati sensibili.

Il problema: molte installazioni on-premise di Nextcloud e OwnCloud sono configurate senza MFA, con password deboli, e spesso accessibili direttamente da internet. Sono bersagli facili.

I dati esfiltrati da queste piattaforme includevano:
- **Cartelle cliniche** (settore sanità)
- **Contratti governativi** e documentazione classificata
- **Dati tecnici** di sistemi difensivi e aerospaziali
- **Informazioni finanziarie** e legali

---

## Infostealer: il motore silenzioso del cybercrimine

Gli **infostealer** — malware come Redline, Vidar, Raccoon, LummaC2 — sono programmi che si installano silenziosamente (tipicamente via phishing o software cracckato) e raccolgono tutte le credenziali salvate nei browser, i cookie di sessione, i file `.env`, e i token di autenticazione.

I log di infostealer vengono venduti in abbonamento su canali Telegram e forum underground. Un abbonamento a un feed di log può costare poche centinaia di dollari al mese e fornire accesso a migliaia di credenziali fresche ogni giorno.

---

## Come difendersi

- Abilita MFA su tutte le piattaforme di file sharing accessibili da internet
- Considera soluzioni ZTNA invece di esporre direttamente Nextcloud/OwnCloud
- Monitora i log di accesso per IP e orari anomali
- Usa strumenti di threat intelligence per verificare se le tue credenziali compaiono in database di infostealer
- Implementa policy di rotazione automatica delle password

---

## Conclusione

Zestix non è sofisticato — è efficiente. Comprare credenziali da infostealer e rivenderle a gruppi ransomware è un business che richiede poche competenze tecniche ma genera profitti significativi. La difesa è banale ma spesso ignorata: MFA su tutto ciò che è esposto a internet, senza eccezioni.
