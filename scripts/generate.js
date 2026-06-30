#!/usr/bin/env node
/**
 * profile-engine — generates SVG assets from config/profile.json
 * Run: node scripts/generate.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const config = JSON.parse(
  fs.readFileSync(path.join(ROOT, "config", "profile.json"), "utf8")
);

const { name, title, status, location, focus, stack, currentProject, theme } =
  config;

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateBanner() {
  const focusLine = focus.join(" • ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" width="800" height="220" role="img" aria-label="${escapeXml(name)} — ${escapeXml(title)}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentGlow}"/>
    </linearGradient>
    <filter id="nameGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <clipPath id="scanClip">
      <rect x="0" y="0" width="0" height="220">
        <animate attributeName="width" from="0" to="800" dur="2s" fill="freeze"/>
      </rect>
    </clipPath>
    <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="12" r="0.8" fill="#1F2937"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="800" height="220" fill="url(#bgGrad)"/>
  <rect width="800" height="220" fill="url(#dotGrid)" opacity="0.6"/>

  <!-- Particles layer (embedded) -->
  <g opacity="0.4" stroke="${theme.accent}" stroke-width="0.5" fill="none">
    <line x1="60" y1="180" x2="140" y2="120"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="6s" repeatCount="indefinite"/></line>
    <line x1="140" y1="120" x2="220" y2="170"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="7s" repeatCount="indefinite"/></line>
    <line x1="220" y1="170" x2="300" y2="100"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite"/></line>
    <line x1="300" y1="100" x2="380" y2="160"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="8s" repeatCount="indefinite"/></line>
  </g>
  <g fill="${theme.accent}">
    <circle cx="60" cy="180" r="2" opacity="0.8"><animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="140" cy="120" r="2.5" opacity="0.7"><animate attributeName="cy" values="120;116;120" dur="4s" repeatCount="indefinite"/></circle>
    <circle cx="220" cy="170" r="2" opacity="0.6"/>
    <circle cx="300" cy="100" r="2.5" opacity="0.9"><animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite"/></circle>
    <circle cx="380" cy="160" r="2" opacity="0.7"/>
  </g>

  <!-- Top border accent -->
  <rect x="0" y="0" width="800" height="2" fill="url(#accentGrad)"/>
  <rect x="0" y="218" width="800" height="2" fill="url(#accentGrad)" opacity="0.4"/>

  <!-- Scan line -->
  <rect x="-20" y="0" width="4" height="220" fill="${theme.accent}" opacity="0.15">
    <animate attributeName="x" from="-20" to="820" dur="3s" repeatCount="indefinite"/>
  </rect>

  <!-- Main content -->
  <g clip-path="url(#scanClip)">
    <text x="48" y="78" font-family="'Segoe UI', system-ui, sans-serif" font-size="36" font-weight="700" fill="${theme.text}" filter="url(#nameGlow)">${escapeXml(name)}</text>
  </g>
  <text x="48" y="78" font-family="'Segoe UI', system-ui, sans-serif" font-size="36" font-weight="700" fill="${theme.text}" opacity="0">${escapeXml(name)}<animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="2s" fill="freeze"/></text>

  <!-- Title + cursor -->
  <text x="48" y="112" font-family="'Segoe UI', system-ui, monospace" font-size="16" fill="${theme.muted}">${escapeXml(title)}</text>
  <rect x="248" y="98" width="10" height="18" fill="${theme.accent}">
    <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
  </rect>

  <!-- Online badge -->
  <circle cx="58" cy="138" r="4" fill="${theme.success}">
    <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="70" y="142" font-family="'Segoe UI', system-ui, sans-serif" font-size="12" fill="${theme.muted}">Online</text>

  <!-- Side panel -->
  <rect x="560" y="32" width="210" height="156" rx="8" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1"/>
  <rect x="560" y="32" width="210" height="3" rx="8" fill="url(#accentGrad)"/>

  <text x="576" y="58" font-family="'Segoe UI', system-ui, monospace" font-size="10" fill="${theme.muted}">STATUS</text>
  <text x="576" y="76" font-family="'Segoe UI', system-ui, sans-serif" font-size="13" fill="${theme.text}">${escapeXml(status)}</text>

  <text x="576" y="98" font-family="'Segoe UI', system-ui, monospace" font-size="10" fill="${theme.muted}">LOCATION</text>
  <text x="576" y="116" font-family="'Segoe UI', system-ui, sans-serif" font-size="13" fill="${theme.text}">${escapeXml(location)}</text>

  <text x="576" y="138" font-family="'Segoe UI', system-ui, monospace" font-size="10" fill="${theme.muted}">FOCUS</text>
  <text x="576" y="156" font-family="'Segoe UI', system-ui, sans-serif" font-size="12" fill="${theme.accentGlow}">${escapeXml(focusLine)}</text>

  <text x="576" y="178" font-family="'Segoe UI', system-ui, monospace" font-size="10" fill="${theme.muted}">@jhonzito66</text>
</svg>`;
}

function generateTerminal() {
  const stackLines = stack.map((s) => `  ${s}`).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 280" width="680" height="280" role="img" aria-label="Terminal profile">
  <defs>
    <style>
      .mono { font-family: 'Cascadia Code', 'Fira Code', Consolas, monospace; }
    </style>
  </defs>
  <rect width="680" height="280" rx="10" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <rect width="680" height="32" rx="10" fill="${theme.surface}"/>
  <rect y="22" width="680" height="10" fill="${theme.surface}"/>
  <circle cx="20" cy="16" r="6" fill="#EF4444"/>
  <circle cx="40" cy="16" r="6" fill="#F59E0B"/>
  <circle cx="60" cy="16" r="6" fill="#22C55E"/>
  <text x="90" y="20" class="mono" font-size="11" fill="${theme.muted}">profile-engine — bash</text>

  <text x="24" y="58" class="mono" font-size="13" fill="${theme.accent}">$</text>
  <text x="40" y="58" class="mono" font-size="13" fill="${theme.text}">whoami</text>

  <text x="24" y="82" class="mono" font-size="13" fill="${theme.text}" opacity="0">
    ${escapeXml(name)}
    <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.8s" fill="freeze"/>
  </text>

  <text x="24" y="112" class="mono" font-size="13" fill="${theme.accent}" opacity="0">
    $
    <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="1.5s" fill="freeze"/>
  </text>
  <text x="40" y="112" class="mono" font-size="13" fill="${theme.text}" opacity="0">
    stack
    <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="1.5s" fill="freeze"/>
  </text>

${stack
  .map(
    (s, i) => `  <text x="24" y="${138 + i * 20}" class="mono" font-size="12" fill="${theme.muted}" opacity="0">
    ${escapeXml(s)}
    <animate attributeName="opacity" from="0" to="1" dur="0.2s" begin="${2 + i * 0.3}s" fill="freeze"/>
  </text>`
  )
  .join("\n")}

  <text x="24" y="${138 + stack.length * 20 + 10}" class="mono" font-size="13" fill="${theme.accent}" opacity="0">
    $
    <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="${2 + stack.length * 0.3 + 0.5}s" fill="freeze"/>
  </text>
  <text x="40" y="${138 + stack.length * 20 + 10}" class="mono" font-size="13" fill="${theme.text}" opacity="0">
    current_project
    <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="${2 + stack.length * 0.3 + 0.5}s" fill="freeze"/>
  </text>

  <text x="24" y="${138 + stack.length * 20 + 34}" class="mono" font-size="13" fill="${theme.accentGlow}" font-weight="600" opacity="0">
    ${escapeXml(currentProject)}
    <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${2 + stack.length * 0.3 + 1.2}s" fill="freeze"/>
  </text>

  <rect x="24" y="${138 + stack.length * 20 + 44}" width="8" height="14" fill="${theme.accent}" opacity="0">
    <animate attributeName="opacity" values="0;1;0;1" dur="1s" begin="${2 + stack.length * 0.3 + 1.6}s" repeatCount="indefinite"/>
  </rect>
</svg>`;
}

function generateProjectCard(project) {
  const tags = project.tags
    .map(
      (tag, i) =>
        `<rect x="${24 + i * 88}" y="108" width="80" height="22" rx="4" fill="${theme.surface}" stroke="${theme.border}"/>
  <text x="${64 + i * 88}" y="123" font-family="system-ui, sans-serif" font-size="10" fill="${theme.muted}" text-anchor="middle">${escapeXml(tag)}</text>`
    )
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 160" width="340" height="160" role="img" aria-label="${escapeXml(project.name)}">
  <rect width="340" height="160" rx="10" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <rect width="340" height="3" rx="10" fill="url(#cardAccent)"/>
  <defs>
    <linearGradient id="cardAccent" x1="0" y1="0" x2="340" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentGlow}"/>
    </linearGradient>
  </defs>
  <text x="24" y="44" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="${theme.text}">${escapeXml(project.name)}</text>
  <text x="24" y="68" font-family="system-ui, sans-serif" font-size="12" fill="${theme.muted}">${escapeXml(project.tagline)}</text>
  ${tags}
  <line x1="24" y1="88" x2="316" y2="88" stroke="${theme.border}" stroke-width="1"/>
  <text x="24" y="148" font-family="system-ui, sans-serif" font-size="12" fill="${theme.accent}">Open →</text>
</svg>`;
}

function writeFile(relativePath, content) {
  const fullPath = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`✓ ${relativePath}`);
}

writeFile("assets/banner.svg", generateBanner());
writeFile("assets/terminal.svg", generateTerminal());

for (const project of config.projects) {
  writeFile(`assets/cards/${project.id}.svg`, generateProjectCard(project));
}

console.log("\nDone. Preview with: npm run preview");
