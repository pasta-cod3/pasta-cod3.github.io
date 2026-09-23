#!/usr/bin/env bash
# Rigenera css/style.min.css e js/*.min.js dai sorgenti.
# Da rilanciare ad ogni modifica di css/style.css o di uno script in js/
# (i .min.* sono commitati: il build di GitHub Pages e' quello legacy,
# senza Actions, quindi non c'e' una pipeline che li rigeneri da sola).
#
# Minifica ogni file JS separatamente: NON fare bundling, gli script
# condividono lo scope globale (POSTS, activeTag, funzioni globali...) e
# un bundle romperebbe main.js e tutto cio' che dipende dalle sue globals.
set -euo pipefail
cd "$(dirname "$0")/.."

for f in js/*.js; do
  case "$f" in
    *.min.js) continue ;;
  esac
  echo "minify: $f"
  npx --yes esbuild "$f" --minify --target=es2020 --outfile="${f%.js}.min.js"
done

echo "minify: css/style.css"
# Il pacchetto "lightningcss" e' solo la libreria: il binario CLI e'
# distribuito da "lightningcss-cli" (verificato con `npm view ... bin`).
npx --yes lightningcss-cli --minify --targets '>= 0.25%' css/style.css -o css/style.min.css

echo "fatto."
