"""
Gera assets/terminal.svg — card neofetch animado estilo terminal dev
Cores: Dracula (purple #BD93F9 + green #50FA7B)
"""
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'terminal.svg')

W     = 510
FONT  = 13
LH    = 21
PX    = 16
HEADER_H = 36
PY_TOP   = 14

BG      = "#1E1E2E"
TITLE_BG = "#282A36"
BORDER  = "#44475A"
PURPLE  = "#BD93F9"
GREEN   = "#50FA7B"
CYAN    = "#8BE9FD"
ORANGE  = "#FFB86C"
YELLOW  = "#F1FA8C"
WHITE   = "#F8F8F2"
GRAY    = "#6272A4"
RED     = "#FF5555"

SEP = "─" * 44

def seg(text, color=WHITE):
    return (text, color)

# None = linha vazia, "CURSOR" = prompt final com cursor piscando
LINES = [
    [seg("jhonzito66", CYAN), seg("@", GRAY), seg("github", GREEN), seg(":~$ ", WHITE), seg("neofetch", YELLOW)],
    None,
    [seg("jhonzito66", CYAN), seg("@", GRAY), seg("github", GREEN)],
    [seg(SEP, GRAY)],
    [seg("OS:      ", PURPLE), seg("macOS Sonoma · MacBook Air")],
    [seg("Host:    ", PURPLE), seg("Forja Softwares LTDA")],
    [seg("Role:    ", PURPLE), seg("Full-Stack Engineer · Co-founder")],
    [seg("IDE:     ", PURPLE), seg("VSCode · Claude Code")],
    [seg(SEP, GRAY)],
    [seg("Code:    ", PURPLE), seg("Java · TypeScript · Python · Dart", GREEN)],
    [seg("Stack:   ", PURPLE), seg("Spring Boot · Next.js · Flutter", GREEN)],
    [seg("         ", WHITE),  seg("Fastify · PostgreSQL", GREEN)],
    [seg("Human:   ", PURPLE), seg("Português (BR) · English")],
    [seg(SEP, GRAY)],
    [seg("● ", ORANGE), seg("MaxSync", ORANGE)],
    [seg("  → ", GRAY), seg("gestão de confinamento pecuário")],
    [seg("● ", ORANGE), seg("GUME", ORANGE)],
    [seg("  → ", GRAY), seg("pedidos via WhatsApp p/ restaurantes")],
    [seg(SEP, GRAY)],
    [seg("Email:   ", PURPLE), seg("forjasoftwaredeveloper@gmail.com")],
    [seg("IG:      ", PURPLE), seg("instagram.com/forja_software")],
    [seg("Local:   ", PURPLE), seg("Goiânia, GO — Brasil")],
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
            # prompt text
            elems.append(
                f'<text x="{PX}" y="{y}" '
                f'font-family="\'Courier New\', Courier, monospace" font-size="{FONT}" '
                f'fill="{GREEN}" '
                f'style="opacity:0;animation:fadeIn .1s ease {delay}s forwards">'
                f'$ </text>'
            )
            # blinking cursor block
            cx = PX + 14  # approx width of "$ "
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
  <circle cx="36" cy="18" r="6" fill="{YELLOW}"/>
  <circle cx="54" cy="18" r="6" fill="{GREEN}"/>

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
