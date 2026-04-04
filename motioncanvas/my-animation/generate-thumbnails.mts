import sharp from 'sharp';
import {mkdirSync} from 'fs';
import path from 'path';

const OUT = path.resolve('output/thumbnails');
mkdirSync(OUT, {recursive: true});

const W = 1280;
const H = 720;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#f85149" stop-opacity="0.2"/>
      <stop offset="60%" stop-color="#0d1117" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="20%" cy="80%" r="40%">
      <stop offset="0%" stop-color="#58a6ff" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f85149" stop-opacity="0"/>
      <stop offset="50%" stop-color="#f85149"/>
      <stop offset="100%" stop-color="#f85149" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="barBot" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#58a6ff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#58a6ff"/>
      <stop offset="100%" stop-color="#58a6ff" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0d1117"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Top/bottom accent bars -->
  <rect x="0" y="0" width="${W}" height="5" fill="url(#bar)"/>
  <rect x="0" y="${H - 5}" width="${W}" height="5" fill="url(#barBot)"/>

  <!-- Side strips -->
  <rect x="0" y="0" width="4" height="${H}" fill="#f85149" opacity="0.4"/>
  <rect x="${W - 4}" y="0" width="4" height="${H}" fill="#58a6ff" opacity="0.4"/>

  <!-- Corner accents -->
  <rect x="-30" y="-30" width="120" height="120" rx="16" fill="#f85149" opacity="0.1" transform="rotate(45,30,30)"/>
  <rect x="${W - 90}" y="${H - 90}" width="120" height="120" rx="16" fill="#58a6ff" opacity="0.1" transform="rotate(45,${W - 30},${H - 30})"/>

  <!-- Big number -->
  <text x="${W / 2}" y="260" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="220" font-weight="900" fill="#f85149" opacity="0.9">13</text>

  <!-- GIT COMMANDS -->
  <text x="${W / 2}" y="380" text-anchor="middle" font-family="monospace" font-size="80" font-weight="900" fill="#e6edf3" letter-spacing="8">GIT COMMANDS</text>

  <!-- Divider -->
  <line x1="${W / 2 - 200}" y1="410" x2="${W / 2 + 200}" y2="410" stroke="#f85149" stroke-width="3" stroke-linecap="round" opacity="0.6"/>

  <!-- Every Developer MUST Know -->
  <text x="${W / 2}" y="480" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700" fill="#8b949e">Every Developer</text>
  <text x="${W / 2}" y="550" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="64" font-weight="900" fill="#e6edf3">MUST KNOW</text>

  <!-- Animated badge -->
  <rect x="${W / 2 - 90}" y="580" width="180" height="46" rx="23" fill="#f85149" opacity="0.9"/>
  <text x="${W / 2}" y="612" text-anchor="middle" font-family="monospace" font-size="24" font-weight="700" fill="#ffffff">ANIMATED</text>

  <!-- Subtle git command names scattered in background -->
  <text x="80" y="660" font-family="monospace" font-size="18" fill="#3fb950" opacity="0.2">init</text>
  <text x="200" y="680" font-family="monospace" font-size="18" fill="#bc8cff" opacity="0.2">clone</text>
  <text x="340" y="660" font-family="monospace" font-size="18" fill="#d29922" opacity="0.2">commit</text>
  <text x="480" y="680" font-family="monospace" font-size="18" fill="#58a6ff" opacity="0.2">push</text>
  <text x="580" y="660" font-family="monospace" font-size="18" fill="#39d353" opacity="0.2">branch</text>
  <text x="700" y="680" font-family="monospace" font-size="18" fill="#f85149" opacity="0.2">merge</text>
  <text x="820" y="660" font-family="monospace" font-size="18" fill="#3fb950" opacity="0.2">stash</text>
  <text x="940" y="680" font-family="monospace" font-size="18" fill="#d29922" opacity="0.2">bisect</text>
  <text x="1060" y="660" font-family="monospace" font-size="18" fill="#bc8cff" opacity="0.2">blame</text>
  <text x="140" y="700" font-family="monospace" font-size="18" fill="#f85149" opacity="0.2">reflog</text>
  <text x="320" y="700" font-family="monospace" font-size="18" fill="#39d353" opacity="0.2">cherry-pick</text>
  <text x="540" y="700" font-family="monospace" font-size="18" fill="#58a6ff" opacity="0.2">worktree</text>
  <text x="740" y="700" font-family="monospace" font-size="18" fill="#d29922" opacity="0.2">status</text>
</svg>`;

async function main() {
  const out = path.join(OUT, 'git-commands.png');
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`✓ ${out}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
