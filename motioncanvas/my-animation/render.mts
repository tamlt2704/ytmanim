import {chromium} from 'playwright';
import {spawn} from 'child_process';
import {existsSync, readdirSync} from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('output');
const PORT = 9000;
const RENDER_TIMEOUT = 10 * 60_000;

function findFile(dir: string, ext: string): string | null {
  try {
    for (const entry of readdirSync(dir, {withFileTypes: true, recursive: true})) {
      if (entry.isFile() && entry.name.endsWith(ext)) {
        return path.join(entry.parentPath ?? dir, entry.name);
      }
    }
  } catch {}
  return null;
}

async function startVite(): Promise<ReturnType<typeof spawn>> {
  const vite = spawn('npx', ['vite', '--port', String(PORT), '--host'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Vite start timeout')), 30_000);
    vite.stdout!.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      process.stdout.write(text);
      if (text.includes('Local:') || text.includes(`${PORT}`)) {
        clearTimeout(timeout);
        resolve();
      }
    });
    vite.stderr!.on('data', (chunk: Buffer) => process.stderr.write(chunk));
    vite.on('error', reject);
  });

  return vite;
}

async function main() {
  console.log('Starting Vite dev server...');
  const vite = await startVite();

  console.log('Launching browser...');
  const browser = await chromium.launch({headless: true});

  try {
    const page = await browser.newPage();
    page.on('console', msg => console.log(`[browser] ${msg.text()}`));
    page.on('pageerror', err => console.error(`[browser error] ${err.message}`));

    await page.goto(`http://localhost:${PORT}`, {waitUntil: 'networkidle', timeout: 60_000});
    console.log('Editor loaded.');

    // Wait for Motion Canvas UI to fully initialize
    await page.waitForTimeout(5000);

    // The Motion Canvas editor has a render button in the top bar.
    // Find and click it. The button has an SVG icon and title/aria-label.
    const clicked = await page.evaluate(() => {
      // Try multiple selectors for the render button
      const selectors = [
        'button[title="Render"]',
        'button[title="Render all"]',
        'button[aria-label="Render"]',
        '[data-tab="rendering"]',
        '[data-tab="render"]',
      ];

      for (const sel of selectors) {
        const el = document.querySelector<HTMLElement>(sel);
        if (el) {
          el.click();
          return `clicked: ${sel}`;
        }
      }

      // Fallback: find button by text content
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() ?? '';
        const title = btn.getAttribute('title')?.toLowerCase() ?? '';
        if (text.includes('render') || title.includes('render')) {
          btn.click();
          return `clicked-text: ${text || title}`;
        }
      }

      // Log what we see for debugging
      const allButtons = Array.from(document.querySelectorAll('button'))
        .map(b => ({text: b.textContent?.trim(), title: b.title, class: b.className}));
      return `no-render-button. buttons: ${JSON.stringify(allButtons.slice(0, 10))}`;
    });

    console.log(`Render trigger: ${clicked}`);

    if (clicked.startsWith('no-render-button')) {
      // Try the rendering tab approach - Motion Canvas has tabs
      console.log('Trying tab-based approach...');
      await page.evaluate(() => {
        // Look for the rendering panel tab
        const tabs = document.querySelectorAll('[role="tab"], [class*="tab"]');
        for (const tab of tabs) {
          const text = tab.textContent?.toLowerCase() ?? '';
          if (text.includes('render')) {
            (tab as HTMLElement).click();
            return;
          }
        }
      });
      await page.waitForTimeout(2000);

      // Now click the render/export button inside the panel
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          const text = btn.textContent?.toLowerCase() ?? '';
          if (text.includes('render') || text.includes('export')) {
            btn.click();
            return;
          }
        }
      });
    }

    // Wait for rendering to complete by polling for output files
    console.log('Waiting for render output...');
    const start = Date.now();
    let outputFile: string | null = null;

    while (Date.now() - start < RENDER_TIMEOUT) {
      outputFile = findFile(OUTPUT_DIR, '.mp4') ?? findFile(OUTPUT_DIR, '.webm');
      if (outputFile) break;

      // Check if rendering is still in progress via the UI
      const status = await page.evaluate(() => {
        const el = document.querySelector('[class*="progress"], [class*="render"]');
        return el?.textContent ?? 'unknown';
      });

      if (Date.now() - start > 30_000 && !outputFile) {
        // Take a screenshot for debugging
        await page.screenshot({path: 'output/debug-screenshot.png'});
        console.log('Debug screenshot saved to output/debug-screenshot.png');
      }

      await page.waitForTimeout(3000);
    }

    if (outputFile) {
      console.log(`Render complete: ${outputFile}`);
    } else {
      await page.screenshot({path: 'output/final-debug-screenshot.png'});
      console.error('Render timed out. Check output/final-debug-screenshot.png');
      process.exit(1);
    }
  } finally {
    await browser.close();
    vite.kill('SIGTERM');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
