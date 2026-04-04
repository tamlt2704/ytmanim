import puppeteer from 'puppeteer';
import {spawn} from 'child_process';
import {existsSync} from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('output');
const TIMEOUT = 5 * 60 * 1000; // 5 min max

async function waitForFile(dir, ext, timeout) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const {readdirSync} = await import('fs');
    try {
      const files = readdirSync(dir, {recursive: true}).map(String);
      const match = files.find(f => f.endsWith(ext));
      if (match) return path.join(dir, match);
    } catch {}
    await new Promise(r => setTimeout(r, 2000));
  }
  return null;
}

// Start vite dev server
const vite = spawn('npx', ['vite', '--port', '9000'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  cwd: process.cwd(),
});

let serverReady = false;
const readyPromise = new Promise(resolve => {
  vite.stdout.on('data', data => {
    const text = data.toString();
    process.stdout.write(text);
    if (text.includes('Local:') || text.includes('localhost')) {
      serverReady = true;
      resolve();
    }
  });
  vite.stderr.on('data', data => process.stderr.write(data));
});

// Timeout for server start
const serverTimeout = setTimeout(() => {
  if (!serverReady) {
    console.error('Vite server failed to start within 30s');
    vite.kill();
    process.exit(1);
  }
}, 30000);

await readyPromise;
clearTimeout(serverTimeout);
console.log('Vite server ready, launching browser...');

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

try {
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:9000', {waitUntil: 'networkidle0', timeout: 60000});
  console.log('Editor loaded, triggering render...');

  // Wait for the Motion Canvas app to initialize, then trigger render
  await page.evaluate(async () => {
    // Wait for the app to be ready
    await new Promise(r => setTimeout(r, 3000));
  });

  // Click the render button in the editor UI
  // Motion Canvas editor has a render button we can trigger
  const rendered = await page.evaluate(async () => {
    // Access the Motion Canvas player/renderer API
    // The editor exposes rendering through its internal state
    const renderButton = document.querySelector('[title="Render"]') 
      || document.querySelector('button[aria-label="Render"]')
      || document.querySelector('[data-testid="render"]');
    
    if (renderButton) {
      renderButton.click();
      return 'clicked';
    }

    // Fallback: try to find any render-related button
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => 
      b.textContent?.toLowerCase().includes('render') ||
      b.getAttribute('title')?.toLowerCase().includes('render')
    );
    if (btn) {
      btn.click();
      return 'clicked-fallback';
    }

    return 'no-button-found';
  });

  console.log('Render trigger result:', rendered);

  // Wait for output file
  console.log('Waiting for rendered output...');
  const outputFile = await waitForFile(OUTPUT_DIR, '.mp4', TIMEOUT);

  if (outputFile) {
    console.log(`Render complete: ${outputFile}`);
  } else {
    console.error('Render timed out — no .mp4 found in output/');
    process.exit(1);
  }
} finally {
  await browser.close();
  vite.kill();
}
