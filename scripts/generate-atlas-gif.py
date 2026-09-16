#!/usr/bin/env python3
"""Arma los GIF del atlas a partir de los fotogramas ya capturados.

Se ejecuta a mano cuando hace falta material para una publicación, no en cada
build: el sitio no debe depender de Python ni de un navegador para compilar.

    python -m pip install --user pillow fonttools brotli
    node scripts/capture-atlas-frames.mjs http://localhost:3000
    python scripts/generate-atlas-gif.py

Las tipografías salen de public/fonts/*.woff2, que es la misma fuente que usa el
sitio: son variables, así que el peso se fija por eje y no hay un TTF por peso
que mantener aparte. Pillow no lee woff2, de modo que fontTools las convierte en
memoria a un TTF temporal.

Sobre la escala de color: el atlas reajusta su rampa cada año (2018 llega a
±1,91 y 2025 a ±4,72), así que el pie dice "la rampa de color se reajusta cada
año" y NO "escala común". El que comparte escala es el par de mapas de la
portada, que es otra figura. Escribir lo contrario se desmiente abriendo el
atlas, y ninguna cifra publicada puede afirmar lo que el lector no pueda
comprobar (docs/PRODUCT.md).
"""
import os
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRAMES = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "scripts", ".atlas-frames")
SALIDA = sys.argv[2] if len(sys.argv) > 2 else os.path.join(RAIZ, "scripts", ".atlas-gif")

# Tokens de app/globals.css. El ámbar no aparece: un mapa es contenido técnico.
PAPER, INK, MUTED, COLD, RULE = "#ffffff", "#14181d", "#626c76", "#0f4c81", "#d8dde3"
PAD, ALTO_CABECERA, ALTO_PIE, ANCHO = 18, 96, 58, 940

_ttf: dict[str, str] = {}


def _a_ttf(nombre: str) -> str:
    """Convierte public/fonts/<nombre>.woff2 a un TTF temporal. Pillow no lee woff2."""
    if nombre not in _ttf:
        from fontTools.ttLib import TTFont

        origen = os.path.join(RAIZ, "public", "fonts", f"{nombre}.woff2")
        destino = os.path.join(tempfile.gettempdir(), f"{nombre}.ttf")
        f = TTFont(origen)
        f.flavor = None
        f.save(destino)
        _ttf[nombre] = destino
    return _ttf[nombre]


_fuentes: dict[tuple, ImageFont.FreeTypeFont] = {}


def _fuente(nombre, peso, tam, opsz=None):
    clave = (nombre, peso, tam, opsz)
    if clave not in _fuentes:
        f = ImageFont.truetype(_a_ttf(nombre), tam)
        f.set_variation_by_axes([float(peso)] if opsz is None else [float(peso), float(opsz)])
        _fuentes[clave] = f
    return _fuentes[clave]


# Archivo para prosa y etiquetas; Source Serif 4 solo para el año, que es una
# cifra. Un rótulo en serif no existe en este sistema (docs/DESIGN.md).
def A(peso, tam):
    return _fuente("archivo-latin", peso, tam)


def SR(peso, tam):
    return _fuente("source-serif-4-latin", peso, tam, 60)


def _tracking(d, xy, texto, fuente, color, sep=0.0):
    """PIL no expone letter-spacing: se dibuja carácter a carácter."""
    x, y = xy
    for ch in texto:
        d.text((x, y), ch, font=fuente, fill=color)
        x += d.textlength(ch, font=fuente) + sep


NOTA_ES = "Índice estandarizado contra 2018 · la rampa de color se reajusta cada año"
NOTA_EN = "Index standardised against 2018 · the colour ramp rescales each year"

VISTAS = [
    dict(key="departamentos", lang="es", anios=range(2018, 2026), nota=NOTA_ES,
         rotulo="ÍNDICE DE INCLUSIÓN FINANCIERA · 33 DEPARTAMENTOS",
         url="davirson.com/es/research/fintech-inclusion"),
    dict(key="municipios", lang="es", anios=range(2018, 2025), nota=NOTA_ES,
         rotulo="ÍNDICE DE INCLUSIÓN FINANCIERA · 1.123 MUNICIPIOS",
         url="davirson.com/es/research/fintech-inclusion"),
    dict(key="departments", lang="en", anios=range(2018, 2026), nota=NOTA_EN,
         rotulo="FINANCIAL-INCLUSION INDEX · 33 DEPARTMENTS",
         url="davirson.com/en/research/fintech-inclusion"),
    dict(key="municipalities", lang="en", anios=range(2018, 2025), nota=NOTA_EN,
         rotulo="FINANCIAL-INCLUSION INDEX · 1,123 MUNICIPALITIES",
         url="davirson.com/en/research/fintech-inclusion"),
]


def fotograma(v, anio):
    """Cabecera con el año, el mapa, y el pie con la URL. Hoja plana: reglas, no cajas."""
    origen = Image.open(os.path.join(FRAMES, f"{v['key']}-{anio}.png")).convert("RGB")
    ancho = ANCHO - 2 * PAD
    alto = round(origen.height * ancho / origen.width)

    img = Image.new("RGB", (ANCHO, ALTO_CABECERA + alto + ALTO_PIE), PAPER)
    d = ImageDraw.Draw(img)

    _tracking(d, (PAD, 28), v["rotulo"], A(700, 15), COLD, 1.7)
    f_anio = SR(600, 52)
    d.text((ANCHO - PAD - d.textlength(str(anio), font=f_anio), 20), str(anio), font=f_anio, fill=INK)
    d.rectangle([PAD, ALTO_CABECERA - 14, ANCHO - PAD, ALTO_CABECERA - 12], fill=COLD)

    img.paste(origen.resize((ancho, alto), Image.LANCZOS), (PAD, ALTO_CABECERA))

    y0 = ALTO_CABECERA + alto + 18
    d.rectangle([PAD, y0, ANCHO - PAD, y0 + 1], fill=RULE)
    d.text((PAD, y0 + 13), v["url"], font=A(600, 15), fill=COLD)
    f_nota = A(400, 13)
    d.text((ANCHO - PAD - d.textlength(v["nota"], font=f_nota), y0 + 15), v["nota"], font=f_nota, fill=MUTED)
    return img


def main():
    os.makedirs(SALIDA, exist_ok=True)
    for v in VISTAS:
        fotogramas = [fotograma(v, a) for a in v["anios"]]
        # El primero y el último se sostienen: son el "antes" y el "después".
        duracion = [900] * len(fotogramas)
        duracion[0], duracion[-1] = 1500, 2600
        destino = os.path.join(SALIDA, f"atlas-{v['key']}-{v['lang']}.gif")
        fotogramas[0].save(destino, save_all=True, append_images=fotogramas[1:],
                           duration=duracion, loop=0, optimize=True, disposal=2)
        print(f"  {os.path.basename(destino):32} {fotogramas[0].size}  "
              f"{len(fotogramas)} fotogramas  {os.path.getsize(destino) / 1e6:.2f} MB")
    print(f"\nGIF en {SALIDA}")


if __name__ == "__main__":
    main()
