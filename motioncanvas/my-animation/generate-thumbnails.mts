import sharp from 'sharp';
import {mkdirSync, readFileSync} from 'fs';
import path from 'path';

const OUT = path.resolve('output/thumbnails');
mkdirSync(OUT, {recursive: true});

const config = JSON.parse(readFileSync(path.resolve('../../config.json'), 'utf8'));

const W = 1280;
const H = 720;

const COLORS = ['#f85149', '#58a6ff', '#3fb950', '#d29922', '#bc8cff', '#39d353'];

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const THEMES = [
  {main: '#f85149', secondary: '#58a6ff'},
  {main: '#58a6ff', secondary: '#3fb950'},
  {main: '#3fb950', secondary: '#d29922'},
  {main: '#d29922', secondary: '#bc8cff'},
  {main: '#bc8cff', secondary: '#f85149'},
];

function generateSvg(video: {title: string; scenes: string[]}, colorIdx: number): string {
  const c = THEMES[colorIdx % THEMES.length];
  const count = video.scenes.length;

  // Extract topic: strip trailing "(Animated)", emoji, leading numbers
  const cleaned = video.title
    .replace(/\s*\(.*?\)\s*$/g, '')           // remove (Animated)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '') // remove emoji
    .replace(/^\d+\s*/, '')                   // remove leading numbers
    .trim();

  const topic = cleaned;

  // Font sizing: monospace chars ~0.6em wide, fit within 1100px
  const topicLen = topic.toUpperCase().length;
  const topicFontSize = Math.min(80, Math.max(28, Math.floor(1100 / (topicLen * 0.6))));

  // Count font: big but not overlapping
  const countStr = String(count);
  const countFontSize = countStr.length <= 2 ? 160 : 120;

  // Layout: vertical stack with gaps
  // Zone 1: count number (top)
  // Zone 2: topic text
  // Zone 3: divider
  // Zone 4: subtitle "Every Developer"
  // Zone 5: "MUST KNOW"
  // Zone 6: badge
  // Zone 7: scatter (bottom)

  const countY = 180;
  const topicY = countY + countFontSize * 0.45 + topicFontSize * 0.5 + 10;
  const dividerY = topicY + 25;
  const subY = dividerY + 55;
  const mustY = subY + 65;
  const badgeY = mustY + 30;
  const badgeTextY = badgeY + 32;

  // Scene names for background scatter (bottom strip)
  const sceneNames = video.scenes.map(s => s.replace(/-/g, ' '));
  const scatterY = H - 60;
  const scatterSvg = sceneNames.slice(0, 10).map((name, i) => {
    const x = 40 + (i * (W - 80) / Math.min(sceneNames.length, 10));
    const y = scatterY + (i % 2) * 20;
    const fill = COLORS[i % COLORS.length];
    return `<text x="${x}" y="${y}" font-family="monospace" font-size="16" fill="${fill}" opacity="0.2">${escXml(name.slice(0, 14))}</text>`;
  }).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="35%" r="50%">
      <stop offset="0%" stop-color="${c.main}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="20%" cy="80%" r="40%">
      <stop offset="0%" stop-color="${c.secondary}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0d1117"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Edge accents -->
  <rect x="0" y="0" width="${W}" height="4" fill="${c.main}" opacity="0.6"/>
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="${c.secondary}" opacity="0.6"/>
  <rect x="0" y="0" width="3" height="${H}" fill="${c.main}" opacity="0.3"/>
  <rect x="${W - 3}" y="0" width="3" height="${H}" fill="${c.secondary}" opacity="0.3"/>

  <!-- Count number -->
  <text x="${W / 2}" y="${countY}" text-anchor="middle" dominant-baseline="central"
    font-family="Arial Black, Impact, sans-serif" font-size="${countFontSize}" font-weight="900"
    fill="${c.main}" opacity="0.85">${count}</text>

  <!-- Topic name -->
  <text x="${W / 2}" y="${topicY}" text-anchor="middle" dominant-baseline="central"
    font-family="monospace" font-size="${topicFontSize}" font-weight="900"
    fill="#e6edf3" letter-spacing="3">${escXml(topic.toUpperCase())}</text>

  <!-- Divider -->
  <line x1="${W / 2 - 180}" y1="${dividerY}" x2="${W / 2 + 180}" y2="${dividerY}"
    stroke="${c.main}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>

  <!-- Subtitle -->
  <text x="${W / 2}" y="${subY}" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700"
    fill="#8b949e">Every Developer</text>

  <!-- MUST KNOW -->
  <text x="${W / 2}" y="${mustY}" text-anchor="middle"
    font-family="Arial Black, Impact, sans-serif" font-size="56" font-weight="900"
    fill="#e6edf3">MUST KNOW</text>

  <!-- Animated badge -->
  <rect x="${W / 2 - 80}" y="${badgeY}" width="160" height="40" rx="20"
    fill="${c.main}" opacity="0.9"/>
  <text x="${W / 2}" y="${badgeTextY}" text-anchor="middle"
    font-family="monospace" font-size="22" font-weight="700" fill="#ffffff">ANIMATED</text>

  <!-- Scatter scene names -->
  ${scatterSvg}
</svg>`;
}

async function main() {
  const videos = config.videos || {};
  const keys = Object.keys(videos);

  if (keys.length === 0) {
    console.log('No videos found in config.json');
    return;
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const video = videos[key];
    const svg = generateSvg(video, i);
    const out = path.join(OUT, `${key}.png`);
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log(`✓ ${out}`);
  }

  console.log(`\nGenerated ${keys.length} thumbnails`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
