#!/usr/bin/env python3
"""Genera los iconos rasterizados a partir de la misma geometría que `app/icon.svg`.

    python3 -m pip install --user pillow
    python3 scripts/generate-icons.py

Salidas (versionadas en el repo, como el .tex del CV y la figura del atlas: el
build no debe depender de Python ni de la red):

    app/favicon.ico      16/32/48 px — la pestaña en navegadores viejos
    app/apple-icon.png   180 px      — la pantalla de inicio de iOS
    public/icon-192.png  192 px      — el manifest (app/manifest.ts)
    public/icon-512.png  512 px      — el manifest

`app/icon.svg` es la fuente de verdad y se edita a mano. Este script NO lo lee:
PIL no rasteriza SVG, así que repite la geometría en coordenadas de 64 px. Si
cambias el SVG, cambia también las constantes de abajo — y al revés.

La D es un rectángulo redondeado con los dos vértices DERECHOS a radio
altura/2; el ojo es la misma forma metida 9 px y rellena del azul del fondo.
Se dibuja a 1024 px y se reduce con LANCZOS: PIL no antialiasa los rellenos,
así que el suavizado sale del remuestreo.
"""
from pathlib import Path
from PIL import Image, ImageDraw

COLD, PAPER = "#0f4c81", "#ffffff"
SUPERSAMPLE = 1024
ROOT = Path(__file__).resolve().parent.parent

# Geometría en el sistema de 64 px de app/icon.svg
BG_RADIUS = 11
OUTER = (16, 14, 48, 50)   # caja de la D; radio = alto/2 = 18
INNER = (25, 23, 39, 41)   # el ojo, metido 9 px; radio = alto/2 = 9
RIGHT_CORNERS = (False, True, True, False)  # (sup-izq, sup-der, inf-der, inf-izq)


def draw(size: int, bg_radius: int) -> Image.Image:
    """El icono a `size` px. `bg_radius` en el sistema de 64; 0 = a sangre."""
    s = SUPERSAMPLE / 64
    im = Image.new("RGBA", (SUPERSAMPLE, SUPERSAMPLE), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    box = [0, 0, SUPERSAMPLE - 1, SUPERSAMPLE - 1]
    if bg_radius:
        d.rounded_rectangle(box, radius=bg_radius * s, fill=COLD)
    else:
        d.rectangle(box, fill=COLD)
    for (x0, y0, x1, y1), fill in ((OUTER, PAPER), (INNER, COLD)):
        d.rounded_rectangle(
            [x0 * s, y0 * s, x1 * s, y1 * s],
            radius=(y1 - y0) / 2 * s,
            corners=RIGHT_CORNERS,
            fill=fill,
        )
    return im.resize((size, size), Image.LANCZOS)


# iOS no respeta la transparencia y recorta las esquinas él mismo: va a sangre.
apple = draw(180, bg_radius=0).convert("RGB")
apple.save(ROOT / "app" / "apple-icon.png", optimize=True)

# El .ico lleva los tres tamaños que pide un navegador de escritorio.
draw(48, BG_RADIUS).save(
    ROOT / "app" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
)

# Los del manifest. Van a sangre y declarados `maskable`: Android recorta el
# icono a la forma del lanzador, y una esquina ya redondeada se recorta dos veces.
for px in (192, 512):
    draw(px, bg_radius=0).convert("RGB").save(
        ROOT / "public" / f"icon-{px}.png", optimize=True
    )

print("app/apple-icon.png (180) · app/favicon.ico (16/32/48) · public/icon-{192,512}.png")
