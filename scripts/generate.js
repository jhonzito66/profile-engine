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
  const titleWidth = title.length * 9.5;
  const cursorX = 48 + titleWidth + 8;

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

  <rect width="800" height="220" fill="url(#bgGrad)"/>
  <rect width="800" height="220" fill="url(#dotGrid)" opacity="0.6"/>

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

  <rect x="0" y="0" width="800" height="2" fill="url(#accentGrad)"/>
  <rect x="0" y="218" width="800" height="2" fill="url(#accentGrad)" opacity="0.4"/>

  <rect x="-20" y="0" width="4" height="220" fill="${theme.accent}" opacity="0.15">
    <animate attributeName="x" from="-20" to="820" dur="3s" repeatCount="indefinite"/>
  </rect>

  <g clip-path="url(#scanClip)">
    <text x="48" y="78" font-family="Segoe UI, system-ui, sans-serif" font-size="36" font-weight="700" fill="${theme.text}" filter="url(#nameGlow)">${escapeXml(name)}</text>
  </g>
  <text x="48" y="78" font-family="Segoe UI, system-ui, sans-serif" font-size="36" font-weight="700" fill="${theme.text}" opacity="0">${escapeXml(name)}<animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="2s" fill="freeze"/></text>

  <text x="48" y="112" font-family="Segoe UI, system-ui, monospace" font-size="16" fill="${theme.muted}">${escapeXml(title)}</text>
  <rect x="${cursorX}" y="98" width="10" height="18" fill="${theme.accent}">
    <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
  </rect>

  <circle cx="58" cy="138" r="4" fill="${theme.success}">
    <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="70" y="142" font-family="Segoe UI, system-ui, sans-serif" font-size="12" fill="${theme.muted}">Online</text>

  <rect x="560" y="32" width="210" height="156" rx="8" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1"/>
  <rect x="560" y="32" width="210" height="3" rx="8" fill="url(#accentGrad)"/>

  <text x="576" y="58" font-family="Segoe UI, system-ui, monospace" font-size="10" fill="${theme.muted}">STATUS</text>
  <text x="576" y="76" font-family="Segoe UI, system-ui, sans-serif" font-size="13" fill="${theme.text}">${escapeXml(status)}</text>
  <text x="576" y="98" font-family="Segoe UI, system-ui, monospace" font-size="10" fill="${theme.muted}">LOCATION</text>
  <text x="576" y="116" font-family="Segoe UI, system-ui, sans-serif" font-size="13" fill="${theme.text}">${escapeXml(location)}</text>
  <text x="576" y="138" font-family="Segoe UI, system-ui, monospace" font-size="10" fill="${theme.muted}">FOCUS</text>
  <text x="576" y="156" font-family="Segoe UI, system-ui, sans-serif" font-size="12" fill="${theme.accentGlow}">${escapeXml(focusLine)}</text>
  <text x="576" y="178" font-family="Segoe UI, system-ui, monospace" font-size="10" fill="${theme.muted}">@jhonzito66</text>
</svg>`;
}

function generateTerminal() {
  const lineH = 18;
  const stackStartY = 136;
  const colW = 180;
  const rows = Math.ceil(stack.length / 2);

  const stackEls = stack
    .map((s, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 40 + col * colW;
      const y = stackStartY + row * lineH;
      const delay = (2 + i * 0.15).toFixed(1);
      return `  <text x="${x}" y="${y}" class="mono" font-size="12" fill="${theme.muted}" opacity="0">${escapeXml(s)}<animate attributeName="opacity" from="0" to="1" dur="0.2s" begin="${delay}s" fill="freeze"/></text>`;
    })
    .join("\n");

  const cmdY = stackStartY + rows * lineH + 28;
  const projY = cmdY + 24;
  const cursorY = projY + 18;
  const totalH = cursorY + 20;
  const cmdDelay = (2 + stack.length * 0.15 + 0.4).toFixed(1);
  const projDelay = (parseFloat(cmdDelay) + 0.7).toFixed(1);
  const cursorDelay = (parseFloat(projDelay) + 0.4).toFixed(1);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 ${totalH}" width="680" height="${totalH}" role="img" aria-label="Terminal profile">
  <defs>
    <style>.mono { font-family: Cascadia Code, Fira Code, Consolas, monospace; }</style>
  </defs>
  <rect width="680" height="${totalH}" rx="10" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <rect width="680" height="32" rx="10" fill="${theme.surface}"/>
  <rect y="22" width="680" height="10" fill="${theme.surface}"/>
  <circle cx="20" cy="16" r="6" fill="#EF4444"/>
  <circle cx="40" cy="16" r="6" fill="#F59E0B"/>
  <circle cx="60" cy="16" r="6" fill="#22C55E"/>
  <text x="90" y="20" class="mono" font-size="11" fill="${theme.muted}">profile-engine — bash</text>

  <text x="24" y="56" class="mono" font-size="13" fill="${theme.accent}">$</text>
  <text x="40" y="56" class="mono" font-size="13" fill="${theme.text}">whoami</text>
  <text x="40" y="80" class="mono" font-size="13" fill="${theme.text}" opacity="0">${escapeXml(name)}<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="0.6s" fill="freeze"/></text>

  <text x="24" y="108" class="mono" font-size="13" fill="${theme.accent}" opacity="0">$<animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="1.2s" fill="freeze"/></text>
  <text x="40" y="108" class="mono" font-size="13" fill="${theme.text}" opacity="0">stack<animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="1.2s" fill="freeze"/></text>
${stackEls}

  <text x="24" y="${cmdY}" class="mono" font-size="13" fill="${theme.accent}" opacity="0">$<animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="${cmdDelay}s" fill="freeze"/></text>
  <text x="40" y="${cmdY}" class="mono" font-size="13" fill="${theme.text}" opacity="0">current_project<animate attributeName="opacity" from="0" to="1" dur="0.01s" begin="${cmdDelay}s" fill="freeze"/></text>
  <text x="40" y="${projY}" class="mono" font-size="13" fill="${theme.accentGlow}" font-weight="600" opacity="0">${escapeXml(currentProject)}<animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="${projDelay}s" fill="freeze"/></text>
  <rect x="40" y="${cursorY - 12}" width="8" height="14" fill="${theme.accent}" opacity="0">
    <animate attributeName="opacity" values="0;1;0;1" dur="1s" begin="${cursorDelay}s" repeatCount="indefinite"/>
  </rect>
</svg>`;
}

function generateProjectCard(project) {
  const gradId = `grad-${project.id}`;
  const tags = project.tags
    .map((tag, i) => {
      const x = 20 + i * 96;
      return `<rect x="${x}" y="96" width="88" height="24" rx="5" fill="${theme.surface}" stroke="${theme.border}"/>
  <text x="${x + 44}" y="112" font-family="system-ui, sans-serif" font-size="10" fill="${theme.muted}" text-anchor="middle">${escapeXml(tag)}</text>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 168" width="340" height="168" role="img" aria-label="${escapeXml(project.name)}">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="340" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentGlow}"/>
    </linearGradient>
  </defs>
  <rect width="340" height="168" rx="10" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <rect width="340" height="3" rx="10" fill="url(#${gradId})"/>
  <text x="20" y="40" font-family="system-ui, sans-serif" font-size="17" font-weight="700" fill="${theme.text}">${escapeXml(project.name)}</text>
  <text x="20" y="62" font-family="system-ui, sans-serif" font-size="12" fill="${theme.muted}">${escapeXml(project.tagline)}</text>
  ${tags}
  <line x1="20" y1="132" x2="320" y2="132" stroke="${theme.border}" stroke-width="1"/>
  <text x="20" y="154" font-family="system-ui, sans-serif" font-size="12" fill="${theme.accent}">Open →</text>
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
