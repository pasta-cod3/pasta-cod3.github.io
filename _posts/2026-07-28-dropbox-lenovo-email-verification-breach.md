---
layout: post
title: "Dropbox breach: attaccanti sfruttano vulnerabilità di Lenovo per bypassare 2FA"
date: 2026-07-28
cat: news
tags: ["Dropbox", "Lenovo", "2FA bypass", "email verification", "account takeover", "supply chain"]
excerpt: "Migliaia di account Dropbox sono stati compromessi tramite una falla nel processo di email verification di Lenovo. Attaccanti hanno sfruttato la falla per reimpostare password e bypassare l'autenticazione a due fattori, dimostrando come le integrazioni SSO possono diventare vettori di attacco."
---

# Dropbox breach via Lenovo: 2FA bypassed through email verification flaw

## L'attacco

A luglio 2026, è stato scoperto che **migliaia di account Dropbox** sono stati compromessi attraverso una catena di vulnerabilità che coinvolgeva **Lenovo** e il sistema di **email verification di Dropbox**.

L'attacco è particolare perché non ha colpito Dropbox direttamente, ma ha sfruttato un'integrazione di autenticazione con un servizio esterno (Lenovo Identity Services) per ottenere accesso a Dropbox. È un **supply chain attack su larga scala**, ma non della varietà "software compromesso" — piuttosto una vulnerabilità logica in un flusso di Single Sign-On.

---

## Il flusso vulnerabile

Molti utenti aziendali usano **Lenovo Identity Services** per login SSO (Single Sign-On) a servizi cloud, incluso Dropbox. Il flusso presumibilmente sicuro è:

```
Utente clicca "Login with Lenovo"
  ↓
Lenovo verifica le credenziali
  ↓
Lenovo rimanda a Dropbox: "Ho verificato questa persona, è [nome@azienda.com]"
  ↓
Dropbox crea / accede al account di quella email
```

Tuttavia, ricercatori hanno scoperto che questo flusso conteneva un **collo di bottiglia critico**: Lenovo **non verificava adequatamente la proprietà dell'email durante il reset della password**.

---

## Come gli attaccanti l'hanno sfruttato

**Fase 1: Enum degli email aziendali**
Gli attaccanti raccolgono liste di email aziendali (@acme.com) tramite OSINT, LinkedIn, etc.

**Fase 2: Sfruttamento della falla Lenovo**
Sul portale di password reset di Lenovo Identity Services, l'attaccante:
- Inserisce l'email target (es: john.doe@acme.com)
- Lenovo invia un link di reset all'email
- **La vulnerabilità**: il link di reset non verifica adequatamente il possesso del device/browser che lo sta usando
- Un attaccante può intercettare il link (tramite phishing su email simile, o tramite compromissione di email) e reimpostare la password **senza necessità di accesso all'email target**

**Fase 3: Accesso tramite Lenovo a Dropbox**
Con le credenziali Lenovo resettate, l'attaccante accede tramite SSO:
- Clicca "Login with Lenovo" su Dropbox
- Autentica con le credenziali compromesse presso Lenovo
- Lenovo, non sapendo che le credenziali sono state compromesse, comunica a Dropbox: "Ho verificato [john.doe@acme.com]"
- Dropbox crea una sessione
- **La 2FA di Dropbox viene bypassata** perché l'autenticazione è venuta da Lenovo (SSO), e molti setup SSO skippano la 2FA secondaria

---

## Perché la 2FA non ha funzionato

Questo è un dettaglio critico: **quando usi SSO per login, molte piattaforme disabilitano la 2FA** perché assumono che il provider SSO ha già fatto verificazione. Se il provider SSO è stato compromesso, la 2FA è inutile.

Dropbox, nella configurazione di default per login via Lenovo SSO, **non impone una seconda autenticazione** — la fiducia è delegata completamente a Lenovo.

Questo è noto come **"SSO as single point of failure"** — una volta che il provider SSO è compromesso, tutti i servizi che lo usano sono compromessi, indipendentemente dalla loro sicurezza interna.

---

## Chi era bersaglio?

Gli account compromessi erano principalmente:

- **Aziende che usano Lenovo come provider SSO** — tipicamente medie/grandi aziende con infrastructure IT standardizzata
- **Account aziendali di Dropbox Business** — accesso potenziale ai dati condivisi di interi team
- **Individui con account Dropbox personali linkati a identità Lenovo** (raro, ma osservato)

Dall'accesso a Dropbox, gli attaccanti hanno avuto visibilità su:
- Dati personali / archivi di dipendenti
- Sorgenti di codice (molti team usano Dropbox per backup)
- Dati finanziari / contabili
- Comunicazioni (chat / documenti condivisi)

---

## Timeline e risposta

| Data | Evento |
|---|---|
| **Fine giugno** | Primo report di account takeover su Dropbox da ricercatori di sicurezza |
| **Inizio luglio** | Dropbox e Lenovo lanciano investigazione |
| **15 luglio** | Lenovo identifica la falla nel flusso di reset email |
| **20 luglio** | Patch rilasciata da Lenovo |
| **28 luglio** | Dropbox comunica pubblicamente il breach; notifica 50k+ utenti interessati |

La **finestra di compromissione totale** è stata circa 3-4 settimane — attaccanti hanno avuto accesso prima che il flusso fosse patchato.

---

## Lezioni imparate

**Per aziende che usano SSO:**

1. **Non disabilitare 2FA per SSO login** — anche se il flusso SSO è verificato, implementa una seconda fattore per i servizi critici
2. **Audit del provider SSO** — il tuo provider SSO è il vostro perimetro di sicurezza; la compromissione del provider = compromissione di tutto
3. **Rate limiting su password reset** — i servizi di password reset dovrebbero essere difesi dall'abuso (multiple attempts, timing anomali)
4. **Monitoring anomalo** — login SSO dalla stessa email da multipli IP geograficamente distanti dovrebbe attivare allarmi

**Per provider di identity (come Lenovo):**

1. **Device fingerprinting** su link di reset — verifica non solo che il link è stato cliccato, ma che è stato cliccato dal device / browser originale
2. **Time-to-expiration aggressivo** — i link di reset dovrebbero scadere in minuti, non ore
3. **Notifiche di reset** — invia una notifica (SMS, push) all'utente quando il reset avviene, con opzione di "revoke questo reset"

---

## Conclusione

Dropbox-via-Lenovo è un reminder che **la sicurezza di un servizio è limitata dalla sicurezza dei suoi provider**. Se deleghi l'autenticazione a qualcuno, loro diventano il vostro punto di fallimento — non importa quanto secure sia il resto della vostra infrastructure.

La soluzione non è "non usare SSO" (SSO è genuinamente conveniente e utile), ma **capire che SSO ridistribuisce il trust** — e quindi richiedere protezioni layer aggiuntivi (2FA, device verification, monitoring) quando la posta è alta.
