#!/usr/bin/env node
/**
 * profile-engine — generates SVG assets from config/profile.json
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const config = JSON.parse(
  fs.readFileSync(path.join(ROOT, "config", "profile.json"), "utf8")
);

const { name, title, status, location, focus, stack, currentProject, languages, theme } =
  config;

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateBanner() {
  const focusLine = focus.join(" · ");
  const titleWidth = title.length * 9.5;
  const cursorX = 48 + titleWidth + 8;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 220" width="800" height="220" role="img" aria-label="${escapeXml(name)} — ${escapeXml(title)}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}"/>
      <stop offset="100%" stop-color="#252525"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentGlow}"/>
    </linearGradient>
    <filter id="nameGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="0.6" fill="#333333"/>
    </pattern>
  </defs>

  <rect width="800" height="220" fill="url(#bgGrad)"/>
  <rect width="800" height="220" fill="url(#dotGrid)" opacity="0.5"/>

  <g opacity="0.25" stroke="${theme.accent}" stroke-width="0.6" fill="none">
    <line x1="40" y1="190" x2="120" y2="130"><animate attributeName="opacity" values="0.1;0.5;0.1" dur="5s" repeatCount="indefinite"/></line>
    <line x1="120" y1="130" x2="200" y2="180"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="6s" repeatCount="indefinite"/></line>
    <line x1="200" y1="180" x2="280" y2="100"><animate attributeName="opacity" values="0.1;0.4;0.1" dur="7s" repeatCount="indefinite"/></line>
  </g>
  <g fill="${theme.accent}">
    <circle cx="40" cy="190" r="2"><animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="120" cy="130" r="2.5"><animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite"/></circle>
    <circle cx="200" cy="180" r="2"/>
    <circle cx="280" cy="100" r="2"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite"/></circle>
  </g>

  <rect x="0" y="0" width="800" height="3" fill="url(#accentGrad)"/>
  <rect x="0" y="217" width="800" height="3" fill="url(#accentGrad)" opacity="0.5"/>

  <text x="48" y="82" font-family="Segoe UI, system-ui, sans-serif" font-size="38" font-weight="700" fill="${theme.text}" filter="url(#nameGlow)">${escapeXml(name)}</text>

  <text x="48" y="118" font-family="Segoe UI, system-ui, monospace" font-size="15" fill="${theme.muted}">${escapeXml(title)}</text>
  <rect x="${cursorX}" y="103" width="10" height="18" fill="${theme.accent}">
    <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
  </rect>

  <circle cx="58" cy="144" r="5" fill="${theme.accent}">
    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
  </circle>
  <text x="72" y="148" font-family="Segoe UI, system-ui, sans-serif" font-size="12" fill="${theme.muted}">Online</text>

  <rect x="548" y="28" width="228" height="164" rx="8" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1"/>
  <rect x="548" y="28" width="228" height="4" rx="8" fill="url(#accentGrad)"/>

  <text x="564" y="56" font-family="Segoe UI, system-ui, monospace" font-size="9" letter-spacing="1" fill="${theme.accent}">STATUS</text>
  <text x="564" y="74" font-family="Segoe UI, system-ui, sans-serif" font-size="14" fill="${theme.text}">${escapeXml(status)}</text>

  <text x="564" y="98" font-family="Segoe UI, system-ui, monospace" font-size="9" letter-spacing="1" fill="${theme.accent}">LOCATION</text>
  <text x="564" y="116" font-family="Segoe UI, system-ui, sans-serif" font-size="14" fill="${theme.text}">${escapeXml(location)}</text>

  <text x="564" y="140" font-family="Segoe UI, system-ui, monospace" font-size="9" letter-spacing="1" fill="${theme.accent}">FOCUS</text>
  <text x="564" y="158" font-family="Segoe UI, system-ui, sans-serif" font-size="12" fill="${theme.accentGlow}">${escapeXml(focusLine)}</text>

  <text x="564" y="182" font-family="Segoe UI, system-ui, monospace" font-size="11" fill="${theme.muted}">@jhonzito66</text>
</svg>`;
}

function generateTerminal() {
  const half = Math.ceil(stack.length / 2);
  const row1 = stack.slice(0, half).join("   ");
  const row2 = stack.slice(half).join("   ");

  const projY = 196;
  const cursorY = 220;
  const totalH = 248;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 ${totalH}" width="680" height="${totalH}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Terminal profile">
  <defs>
    <style>.m { font-family: Cascadia Code, Fira Code, Consolas, monospace; }</style>
  </defs>

  <rect width="680" height="${totalH}" rx="10" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <rect width="680" height="36" rx="10" fill="${theme.surface}"/>
  <rect y="26" width="680" height="10" fill="${theme.surface}"/>
  <circle cx="20" cy="18" r="6" fill="#EF4444"/>
  <circle cx="40" cy="18" r="6" fill="#F59E0B"/>
  <circle cx="60" cy="18" r="6" fill="#22C55E"/>
  <text x="90" y="22" class="m" font-size="11" fill="${theme.muted}">profile-engine — bash</text>
  <rect x="0" y="35" width="680" height="1" fill="${theme.border}"/>

  <text x="24" y="62" class="m" font-size="13" fill="${theme.accent}">$</text>
  <text x="42" y="62" class="m" font-size="13" fill="${theme.text}">whoami</text>
  <text x="42" y="84" class="m" font-size="13" fill="${theme.text}">${escapeXml(name)}</text>

  <text x="24" y="112" class="m" font-size="13" fill="${theme.accent}">$</text>
  <text x="42" y="112" class="m" font-size="13" fill="${theme.text}">stack</text>
  <text x="42" y="134" class="m" font-size="12" fill="${theme.muted}">${escapeXml(row1)}</text>
  <text x="42" y="154" class="m" font-size="12" fill="${theme.muted}">${escapeXml(row2)}</text>

  <text x="24" y="182" class="m" font-size="13" fill="${theme.accent}">$</text>
  <text x="42" y="182" class="m" font-size="13" fill="${theme.text}">current_project</text>
  <text x="42" y="${projY}" class="m" font-size="14" fill="${theme.accentGlow}" font-weight="600">${escapeXml(currentProject)}</text>
  <rect x="42" y="${cursorY - 13}" width="9" height="16" fill="${theme.accent}">
    <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
  </rect>
</svg>`;
}

function generateLanguagesChart() {
  const barH = 22;
  const gap = 10;
  const startY = 56;
  const maxBarW = 420;
  const totalH = startY + languages.length * (barH + gap) + 24;

  const bars = languages
    .map((lang, i) => {
      const y = startY + i * (barH + gap);
      const w = Math.max(4, (lang.percent / 100) * maxBarW);
      return `  <text x="24" y="${y + 15}" font-family="system-ui, sans-serif" font-size="12" fill="${theme.text}">${escapeXml(lang.name)}</text>
  <rect x="120" y="${y}" width="${maxBarW}" height="${barH}" rx="4" fill="${theme.surface}"/>
  <rect x="120" y="${y}" width="${w}" height="${barH}" rx="4" fill="url(#langGrad)"/>
  <text x="${120 + maxBarW + 12}" y="${y + 15}" font-family="system-ui, sans-serif" font-size="11" fill="${theme.muted}">${lang.percent}%</text>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 ${totalH}" width="580" height="${totalH}" role="img" aria-label="Top Languages">
  <defs>
    <linearGradient id="langGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentGlow}"/>
    </linearGradient>
  </defs>
  <rect width="580" height="${totalH}" rx="10" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <rect width="580" height="4" rx="10" fill="url(#langGrad)"/>
  <text x="24" y="36" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="${theme.text}">Top Languages</text>
${bars}
</svg>`;
}

function generateProjectCard(project) {
  const gradId = `g-${project.id}`;
  const tags = project.tags
    .map((tag, i) => {
      const x = 20 + i * 96;
      return `<rect x="${x}" y="94" width="88" height="26" rx="5" fill="${theme.surface}" stroke="${theme.border}"/>
  <text x="${x + 44}" y="112" font-family="system-ui, sans-serif" font-size="10" fill="${theme.muted}" text-anchor="middle">${escapeXml(tag)}</text>`;
    })
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 172" width="340" height="172" role="img" aria-label="${escapeXml(project.name)}">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="340" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentGlow}"/>
    </linearGradient>
  </defs>
  <rect width="340" height="172" rx="10" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1"/>
  <rect width="340" height="4" rx="10" fill="url(#${gradId})"/>
  <text x="20" y="42" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="${theme.text}">${escapeXml(project.name)}</text>
  <text x="20" y="64" font-family="system-ui, sans-serif" font-size="12" fill="${theme.muted}">${escapeXml(project.tagline)}</text>
  ${tags}
  <line x1="20" y1="134" x2="320" y2="134" stroke="${theme.border}" stroke-width="1"/>
  <text x="20" y="156" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="${theme.accent}">Open →</text>
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
writeFile("assets/languages.svg", generateLanguagesChart());
for (const project of config.projects) {
  writeFile(`assets/cards/${project.id}.svg`, generateProjectCard(project));
}
console.log("\nDone.");
