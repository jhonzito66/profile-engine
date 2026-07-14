"""
Gera ASCII art da foto de perfil usando PIL puro.
Saída: ascii-art.txt (texto puro para embed no README)
"""
from PIL import Image, ImageEnhance
import os

IMG_PATH = os.path.join(os.path.dirname(__file__), "..", "167132754.png")
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "ascii-art.txt")

# Charset do mais denso ao mais vazio
CHARS = "@%#*+=-:. "

WIDTH  = 42   # colunas (pra caber ao lado do bloco de texto)
RATIO  = 0.45 # correção de aspecto do terminal (char ~2x mais alto que largo)

def to_ascii(img_path: str, width: int) -> list[str]:
    img = Image.open(img_path).convert("RGB")

    # Contraste e saturação mais fortes pra ASCII ficar legível
    img = ImageEnhance.Contrast(img).enhance(1.6)
    img = ImageEnhance.Sharpness(img).enhance(2.0)

    w, h = img.size
    height = int(width * (h / w) * RATIO)
    img = img.resize((width, height), Image.LANCZOS)

    lines = []
    for y in range(height):
        row = ""
        for x in range(width):
            r, g, b = img.getpixel((x, y))
            brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            idx = int(brightness * (len(CHARS) - 1))
            row += CHARS[idx]
        lines.append(row)
    return lines

lines = to_ascii(IMG_PATH, WIDTH)
art = "\n".join(lines)

with open(OUT_PATH, "w") as f:
    f.write(art)

print(art)
print(f"\n→ salvo em ascii-art.txt ({len(lines)} linhas × {WIDTH} cols)")
