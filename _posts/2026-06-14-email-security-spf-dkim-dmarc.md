---
layout: post
title: "Email Security: SPF, DKIM e DMARC — come funzionano e come configurarli"
date: 2026-06-14
cat: blue
tags: [SPF, DKIM, DMARC, email security, phishing, spoofing, DNS]
excerpt: "Il 91% degli attacchi informatici inizia con una email. SPF, DKIM e DMARC sono i tre standard che proteggono il tuo dominio dall'essere usato per phishing e spoofing. Come funzionano e come si configurano."
---

Chiunque può inviare email fingendo di essere `noreply@tuazienda.it`. Senza protezioni adeguate, le email che sembrano provenire dal tuo dominio potrebbero essere phishing verso i tuoi clienti. SPF, DKIM e DMARC sono i tre record DNS che risolvono questo problema.

## SPF — Sender Policy Framework

SPF definisce quali server mail sono autorizzati a inviare email per il tuo dominio. È un record DNS TXT sulla root del dominio.

```dns
tuazienda.it  TXT  "v=spf1 include:_spf.google.com ip4:203.0.113.1 -all"
```

- `v=spf1` — versione SPF
- `include:_spf.google.com` — Google Workspace è autorizzato
- `ip4:203.0.113.1` — questo IP specifico è autorizzato
- `-all` — **tutti gli altri sono rifiutati** (hard fail)

Quando un server ricevente riceve un'email da `@tuazienda.it`, controlla l'SPF: "questo IP è autorizzato?". Se no, l'email viene marcata come sospetta o rifiutata.

> **Attenzione**: `-all` (hard fail) rifiuta le email non autorizzate. `~all` (soft fail) le accetta ma le marca. Usa `-all` se vuoi protezione reale.

## DKIM — DomainKeys Identified Mail

DKIM aggiunge una firma crittografica alle email, dimostrando che il contenuto non è stato modificato in transito e che l'email proviene davvero da server controllati dal dominio.

Funziona con una coppia di chiavi RSA:
- **Chiave privata**: sul mail server, firma le email
- **Chiave pubblica**: nel DNS, verifica la firma

```dns
selector._domainkey.tuazienda.it  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0B..."
```

Il server ricevente legge la firma nell'header dell'email, recupera la chiave pubblica dal DNS e verifica. Se la firma è valida, l'email non è stata manomessa.

## DMARC — Domain-based Message Authentication Reporting & Conformance

DMARC lega insieme SPF e DKIM e dice ai mail server cosa fare con le email che non passano i controlli: ignorarle, metterle in spam o rifiutarle.

```dns
_dmarc.tuazienda.it  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@tuazienda.it; pct=100"
```

- `p=reject` — **rifiuta** le email che falliscono SPF/DKIM
- `p=quarantine` — metti in spam
- `p=none` — solo monitoraggio (usa per iniziare)
- `rua=mailto:...` — invia report aggregati giornalieri
- `pct=100` — applica alla totalità delle email

## Implementazione progressiva

Non passare subito a `p=reject` — rischi di bloccare email legittime.

1. **Fase 1** `p=none` — raccoglie report per 2-4 settimane senza bloccare niente
2. **Fase 2** `p=quarantine; pct=10` — metti in spam il 10% delle email che falliscono
3. **Fase 3** `p=quarantine; pct=100` — tutte le email sospette in spam
4. **Fase 4** `p=reject` — rifiuta completamente

## Verifica della configurazione

```bash
# Check SPF
dig TXT tuazienda.it | grep spf

# Check DKIM (sostituisci "selector" con il selector del tuo provider)
dig TXT google._domainkey.tuazienda.it

# Check DMARC
dig TXT _dmarc.tuazienda.it

# Tool online
mxtoolbox.com/spf.aspx
dmarcian.com/dmarc-inspector/
```

## BIMI — Brand Indicators for Message Identification

Con DMARC a `p=reject` attivo, puoi aggiungere BIMI: mostra il logo della tua azienda nell'inbox di Gmail e altri client. È un incentivo commerciale a implementare DMARC correttamente.
