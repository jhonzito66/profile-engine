"""
Gera ASCII art da foto de perfil (PIL puro).
Saída: ascii-art.txt
"""
from PIL import Image, ImageEnhance, ImageFilter
import os

IMG_PATH = os.path.join(os.path.dirname(__file__), "..", "167132754.png")
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "ascii-art.txt")

# Charset denso → vazio (claro → escuro no terminal escuro = invertemos)
CHARS  = " .,:;i1tfLCG08@"   # 15 graus de detalhe
WIDTH  = 44
RATIO  = 0.47  # correção de aspecto terminal

def to_ascii(path, width):
    img = Image.open(path).convert("L")  # grayscale

    # Pipeline de melhoria
    img = ImageEnhance.Contrast(img).enhance(2.0)
    img = ImageEnhance.Sharpness(img).enhance(2.5)
    img = img.filter(ImageFilter.EDGE_ENHANCE)

    w, h = img.size
    height = int(width * (h / w) * RATIO)
    img = img.resize((width, height), Image.LANCZOS)

    lines = []
    for y in range(height):
        row = ""
        for x in range(width):
            pixel = img.getpixel((x, y))
            # Inverte: pixel escuro (dog) → char denso
            brightness = 1.0 - (pixel / 255.0)
            idx = int(brightness * (len(CHARS) - 1))
            row += CHARS[idx]
        lines.append(row)
    return lines

lines = to_ascii(IMG_PATH, WIDTH)
art   = "\n".join(lines)

with open(OUT_PATH, "w") as f:
    f.write(art)

print(art)
print(f"\n→ {OUT_PATH}  ({len(lines)} linhas × {WIDTH} cols)")
