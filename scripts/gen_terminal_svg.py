"""
Gera assets/terminal.svg — card neofetch animado estilo terminal
Cores: ANSI clássicas (verde/ciano/âmbar em fundo preto)
"""
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'terminal.svg')

W     = 510
FONT  = 13
LH    = 21
PX    = 16
HEADER_H = 36
PY_TOP   = 14

# Paleta terminal padrão (ANSI / CRT)
BG       = "#0C0C0C"
TITLE_BG = "#1A1A1A"
BORDER   = "#333333"
GREEN    = "#00FF41"
CYAN     = "#00D7FF"
ORANGE   = "#FFAF00"
YELLOW   = "#FFD700"
WHITE    = "#E6E6E6"
GRAY     = "#6A6A6A"
RED      = "#FF5F56"
TL_YELLOW = "#FFBD2E"
TL_GREEN  = "#27C93F"

SEP = "─" * 44

def seg(text, color=WHITE):
    return (text, color)

# None = linha vazia, "CURSOR" = prompt final com cursor piscando
LINES = [
    [seg("jhonzito66", CYAN), seg("@", GRAY), seg("github", GREEN), seg(":~$ ", WHITE), seg("neofetch", YELLOW)],
    None,
    [seg("jhonzito66", CYAN), seg("@", GRAY), seg("github", GREEN)],
    [seg(SEP, GRAY)],
    [seg("OS:      ", GREEN), seg("macOS Sonoma · MacBook Air")],
    [seg("Host:    ", GREEN), seg("Forja Softwares LTDA")],
    [seg("Role:    ", GREEN), seg("Full-Stack Engineer · Co-founder")],
    [seg("IDE:     ", GREEN), seg("VSCode · Claude Code")],
    [seg(SEP, GRAY)],
    [seg("Code:    ", GREEN), seg("Java · TypeScript · Python · Dart", CYAN)],
    [seg("Stack:   ", GREEN), seg("Spring Boot · Next.js · Flutter", CYAN)],
    [seg("         ", WHITE),  seg("Fastify · PostgreSQL", CYAN)],
    [seg("Human:   ", GREEN), seg("Português (BR) · English")],
    [seg(SEP, GRAY)],
    [seg("Recent:  ", GREEN), seg("últimos mexidos", GRAY)],
    [seg("● ", ORANGE), seg("GUME", ORANGE), seg("  ★", YELLOW)],
    [seg("  → ", GRAY), seg("pedidos via WhatsApp p/ restaurantes")],
    [seg("● ", ORANGE), seg("MaxSync", ORANGE)],
    [seg("  → ", GRAY), seg("gestão de confinamento pecuário")],
    [seg(SEP, GRAY)],
    [seg("Web:     ", GREEN), seg("forjasoftware.com.br", CYAN)],
    [seg("IG:      ", GREEN), seg("instagram.com/forja_software", CYAN)],
    [seg("Email:   ", GREEN), seg("forjasoftwaredeveloper@gmail.com")],
    [seg("Local:   ", GREEN), seg("Goiânia, GO — Brasil")],
    [seg(SEP, GRAY)],
    "CURSOR",
]

H = HEADER_H + PY_TOP + len(LINES) * LH + 20

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def render_lines():
    elems = []
    for i, line in enumerate(LINES):
        y = HEADER_H + PY_TOP + FONT + i * LH
        delay = round(i * 0.055, 3)

        if line is None:
            continue

        if line == "CURSOR":
            elems.append(
                f'<text x="{PX}" y="{y}" '
                f'font-family="\'Courier New\', Courier, monospace" font-size="{FONT}" '
                f'fill="{GREEN}" '
                f'style="opacity:0;animation:fadeIn .1s ease {delay}s forwards">'
                f'$ </text>'
            )
            cx = PX + 14
            cy = y - FONT + 2
            elems.append(
                f'<rect x="{cx}" y="{cy}" width="8" height="{FONT}" fill="{GREEN}" '
                f'style="opacity:0;animation:fadeIn .1s ease {delay}s forwards, blink 1s step-end {delay + 0.2}s infinite"/>'
            )
            continue

        spans = "".join(
            f'<tspan fill="{color}">{esc(text)}</tspan>'
            for text, color in line
        )
        elems.append(
            f'<text x="{PX}" y="{y}" '
            f'font-family="\'Courier New\', Courier, monospace" font-size="{FONT}" '
            f'style="opacity:0;animation:fadeIn .1s ease {delay}s forwards">'
            f'{spans}</text>'
        )
    return "\n  ".join(elems)

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <defs>
    <style>
      @keyframes fadeIn {{
        from {{ opacity: 0; transform: translateY(3px); }}
        to   {{ opacity: 1; transform: translateY(0); }}
      }}
      @keyframes blink {{
        0%, 100% {{ opacity: 1; }}
        50%       {{ opacity: 0; }}
      }}
    </style>
  </defs>

  <!-- window bg -->
  <rect width="{W}" height="{H}" rx="10" fill="{BG}" stroke="{BORDER}" stroke-width="1"/>

  <!-- title bar -->
  <rect width="{W}" height="{HEADER_H}" rx="10" fill="{TITLE_BG}"/>
  <rect y="{HEADER_H - 8}" width="{W}" height="8" fill="{TITLE_BG}"/>

  <!-- traffic lights -->
  <circle cx="18" cy="18" r="6" fill="{RED}"/>
  <circle cx="36" cy="18" r="6" fill="{TL_YELLOW}"/>
  <circle cx="54" cy="18" r="6" fill="{TL_GREEN}"/>

  <!-- title -->
  <text x="{W // 2}" y="22" text-anchor="middle"
    font-family="'Courier New', Courier, monospace" font-size="11" fill="{GRAY}">
    jhonzito66 — bash
  </text>

  <!-- content -->
  {render_lines()}
</svg>"""

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(svg)

print(f"✓ terminal.svg gerado  {W}×{H}px  {len(LINES)} linhas")
