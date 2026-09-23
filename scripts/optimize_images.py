#!/usr/bin/env python3
"""Genera varianti WebP per le immagini in assets/, preservando le originali.

Le immagini in assets/ sono usate solo da js/fondamentali-data.js (icone
delle stanze del percorso Fondamentali, gia' con width/height/loading=lazy
impostati in js/fondamentali.js): non tocca ne' i post ne' altre pagine.
Da rilanciare quando si aggiungono nuove immagini in assets/.
"""
from pathlib import Path
from PIL import Image

SRC = Path(__file__).resolve().parent.parent / "assets"
EXTS = {".png", ".jpg", ".jpeg"}

for path in sorted(SRC.rglob("*")):
    if path.suffix.lower() not in EXTS:
        continue
    out = path.with_suffix(".webp")
    if out.exists() and out.stat().st_mtime >= path.stat().st_mtime:
        continue
    with Image.open(path) as im:
        im.save(out, "WEBP", quality=82, method=6)
    print(f"{path.relative_to(SRC.parent)} -> {out.relative_to(SRC.parent)}")
