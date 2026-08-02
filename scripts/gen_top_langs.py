#!/usr/bin/env python3
"""
Gera assets/languages.svg a partir dos bytes reais de linguagem
em repositórios OWNED (público + privado), via GitHub GraphQL.

Requer token com acesso a privados (gh auth / GH_TOKEN / GH_PAT com scope repo).
Por padrão falha se não enxergar repositórios privados — evita sobrescrever
o card com dados só-públicos (ex.: Actions com GITHUB_TOKEN).
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "languages.svg"

USERNAME = os.environ.get("GITHUB_USERNAME", "jhonzito66")
TOP_N = int(os.environ.get("LANGS_TOP_N", "6"))
# Mínimo de privados visíveis; 0 desativa a checagem.
MIN_PRIVATE = int(os.environ.get("LANGS_MIN_PRIVATE", "5"))
EXCLUDE_REPOS = {
    r.strip()
    for r in os.environ.get("LANGS_EXCLUDE_REPOS", "MaxSys").split(",")
    if r.strip()
}
EXCLUDE_LANGS = {
    r.strip()
    for r in os.environ.get("LANGS_EXCLUDE_LANGS", "Pascal").split(",")
    if r.strip()
}

BG = "#0C0C0C"
BORDER = "#333333"
TITLE = "#00FF41"
TEXT = "#E6E6E6"
MUTED = "#A0A0A0"
TRACK = "#1F1F1F"

QUERY = """
query($login: String!) {
  user(login: $login) {
    repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
      nodes {
        name
        isPrivate
        languages(first: 20, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name color } }
        }
      }
    }
  }
}
"""


def gh_graphql(login: str) -> dict:
    token = (
        os.environ.get("GH_PAT")
        or os.environ.get("GH_TOKEN")
        or os.environ.get("GITHUB_TOKEN")
        or os.environ.get("PAT")
    )
    if token:
        import urllib.request

        req = urllib.request.Request(
            "https://api.github.com/graphql",
            data=json.dumps({"query": QUERY, "variables": {"login": login}}).encode(),
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
                "User-Agent": "profile-engine-langs",
            },
            method="POST",
        )
        with urllib.request.urlopen(req) as resp:
            payload = json.load(resp)
    else:
        proc = subprocess.run(
            ["gh", "api", "graphql", "-f", f"query={QUERY}", "-F", f"login={login}"],
            capture_output=True,
            text=True,
            check=False,
        )
        if proc.returncode != 0:
            print(proc.stderr, file=sys.stderr)
            raise SystemExit(f"gh api failed ({proc.returncode})")
        payload = json.loads(proc.stdout)

    if payload.get("errors"):
        raise SystemExit(f"GraphQL errors: {payload['errors']}")
    return payload


def aggregate(payload: dict):
    totals: dict[str, int] = defaultdict(int)
    colors: dict[str, str] = {}
    used_repos: list[str] = []
    skipped: list[str] = []
    private_n = 0
    public_n = 0

    nodes = payload["data"]["user"]["repositories"]["nodes"]
    for node in nodes:
        name = node["name"]
        is_private = bool(node.get("isPrivate"))
        if name in EXCLUDE_REPOS:
            skipped.append(name)
            continue
        if is_private:
            private_n += 1
        else:
            public_n += 1
        used_repos.append(f"{name}{' (private)' if is_private else ''}")
        for edge in node["languages"]["edges"]:
            lang = edge["node"]["name"]
            if lang in EXCLUDE_LANGS:
                continue
            totals[lang] += edge["size"]
            colors[lang] = edge["node"].get("color") or "#8B949E"

    ranked = sorted(totals.items(), key=lambda x: -x[1])[:TOP_N]
    total = sum(v for _, v in ranked) or 1
    rows = [
        {
            "name": lang,
            "percent": round(size / total * 100, 1),
            "bytes": size,
            "color": colors.get(lang, "#8B949E"),
        }
        for lang, size in ranked
    ]
    if rows:
        s = sum(r["percent"] for r in rows)
        if s and abs(s - 100) >= 0.1:
            rows[0]["percent"] = round(rows[0]["percent"] + (100 - s), 1)

    return rows, used_repos, skipped, private_n, public_n


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def render(rows: list[dict], private_n: int, public_n: int) -> str:
    W, H = 300, 190
    bar_y, bar_h, bar_w = 55, 8, 250
    label_start, col_gap, row_h = 78, 130, 22
    subtitle = f"{public_n} public + {private_n} private · by code size"

    x = 0.0
    segs = []
    for r in rows:
        w = max(2.0, bar_w * (r["percent"] / 100))
        segs.append(
            f'<rect mask="url(#m)" x="{x:.2f}" y="0" width="{w:.2f}" height="{bar_h}" fill="{r["color"]}"/>'
        )
        x += w

    labels = []
    for i, r in enumerate(rows):
        col, row = i % 2, i // 2
        lx = 25 + col * col_gap
        ly = label_start + row * row_h
        labels.append(
            f"""<g transform="translate({lx}, {ly})">
  <circle cx="5" cy="-4" r="4" fill="{r["color"]}"/>
  <text x="14" y="0" class="lang">{esc(r["name"])} {r["percent"]}%</text>
</g>"""
        )

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="Most Used Languages">
  <style>
    .title {{ font: 600 16px 'Segoe UI', Ubuntu, sans-serif; fill: {TITLE}; }}
    .lang {{ font: 400 11px 'Segoe UI', Ubuntu, sans-serif; fill: {TEXT}; }}
    .sub {{ font: 400 10px 'Segoe UI', Ubuntu, sans-serif; fill: {MUTED}; }}
  </style>
  <rect width="{W}" height="{H}" rx="8" fill="{BG}" stroke="{BORDER}" stroke-width="1"/>
  <text x="25" y="32" class="title">Most Used Languages</text>
  <text x="25" y="48" class="sub">{esc(subtitle)}</text>
  <g transform="translate(25, {bar_y})">
    <mask id="m"><rect x="0" y="0" width="{bar_w}" height="{bar_h}" rx="4" fill="#fff"/></mask>
    <rect x="0" y="0" width="{bar_w}" height="{bar_h}" rx="4" fill="{TRACK}"/>
    {''.join(segs)}
  </g>
  {''.join(labels)}
</svg>
"""


def main():
    print(f"Fetching languages for {USERNAME}…")
    payload = gh_graphql(USERNAME)
    rows, used, skipped, private_n, public_n = aggregate(payload)

    if private_n < MIN_PRIVATE:
        raise SystemExit(
            f"Token só enxergou {private_n} repo(s) privado(s) (mínimo {MIN_PRIVATE}). "
            "Use um PAT com scope `repo` (secret GH_PAT). Abortando para não publicar card só-público."
        )
    if not rows:
        raise SystemExit("No language data returned")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(render(rows, private_n, public_n), encoding="utf-8")

    print(f"✓ {OUT.relative_to(ROOT)}")
    print(f"  counted: {public_n} public + {private_n} private  skipped: {skipped or '—'}")
    for r in rows:
        print(f"  {r['name']:15} {r['percent']:5.1f}%  ({r['bytes']:,} bytes)")


if __name__ == "__main__":
    main()
