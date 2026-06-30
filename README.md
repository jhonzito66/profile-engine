# profile-engine

Motor de geração de assets SVG para o perfil GitHub de [@jhonzito66](https://github.com/jhonzito66).

Em vez de copiar templates genéricos, este projeto gera um **banner animado exclusivo**, terminal interativo, cards de projetos e automações — tudo leve, em SVG puro (sem GIF/vídeo).

## Estrutura

```
profile-engine/
├── assets/
│   ├── banner.svg          ← banner principal (animado)
│   ├── terminal.svg        ← terminal com typing effect
│   ├── particles.svg       ← malha de partículas
│   └── cards/              ← cards premium dos projetos
├── config/
│   └── profile.json        ← fonte da verdade (nome, stack, projetos)
├── scripts/
│   └── generate.js         ← gera todos os SVGs a partir do config
├── index.html              ← preview local
└── .github/workflows/
    ├── generate.yml        ← regenera assets no push
    └── deploy-pages.yml    ← publica no GitHub Pages
```

## Quick start

```bash
# Edite seus dados
code config/profile.json

# Gere os SVGs
npm run generate

# Preview local
npm run preview
# → http://localhost:3456
```

## Consumo no README do perfil

Após publicar no GitHub Pages:

```markdown
<img src="https://jhonzito66.github.io/profile-engine/assets/banner.svg" width="100%"/>
<img src="https://jhonzito66.github.io/profile-engine/assets/terminal.svg" width="100%"/>
```

Ou via raw (branch `main`):

```markdown
<img src="https://raw.githubusercontent.com/jhonzito66/profile-engine/main/assets/banner.svg" width="100%"/>
```

## Design

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg` | `#0B0F19` | Fundo principal |
| `--accent` | `#6366F1` | Indigo (Vercel/Linear vibe) |
| `--text` | `#F9FAFB` | Texto principal |
| `--muted` | `#9CA3AF` | Labels secundários |

Inspirado em interfaces de dev tools (Vercel, Linear, GitHub) com identidade própria.

## Automação

- **generate.yml** — roda `npm run generate` em cada push e commita os assets atualizados
- **deploy-pages.yml** — publica `assets/` no GitHub Pages

O repositório [`jhonzito66/jhonzito66`](https://github.com/jhonzito66/jhonzito66) consome estes assets automaticamente.

## Licença

MIT
