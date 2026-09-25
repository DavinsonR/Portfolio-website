"""Pasa las capturas de la vitrina (public/showcase/*.png) a WebP de 1400 px y
borra los PNG. Segundo paso de scripts/capture-showcase.mjs."""
from pathlib import Path
from PIL import Image

for png in sorted(Path("public/showcase").glob("*.png")):
    im = Image.open(png).convert("RGB")
    w = 1400
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    out = png.with_suffix(".webp")
    im.save(out, "WEBP", quality=82, method=6)
    png.unlink()
    print(f"ok {out}  {out.stat().st_size // 1024} KB  {im.size[0]}x{im.size[1]}")
