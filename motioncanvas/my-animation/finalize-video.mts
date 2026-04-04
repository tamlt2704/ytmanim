import {execSync} from 'child_process';
import {readdirSync, mkdirSync} from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('output');
const MUSIC = path.resolve('../../music.mp3');
const FINAL = path.join(OUTPUT_DIR, 'final.mp4');

function findVideo(dir: string): string | null {
  try {
    for (const entry of readdirSync(dir, {withFileTypes: true, recursive: true})) {
      if (entry.isFile() && /\.(mp4|webm)$/.test(entry.name) && entry.name !== 'final.mp4') {
        return path.join(entry.parentPath ?? dir, entry.name);
      }
    }
  } catch {}
  return null;
}

const video = findVideo(OUTPUT_DIR);
if (!video) {
  console.error('No rendered video found in output/');
  console.error('Run "npm start" first, then render from the editor UI.');
  process.exit(1);
}

console.log(`Found: ${video}`);

try {
  execSync('ffmpeg -version', {stdio: 'ignore'});
} catch {
  console.error('ffmpeg not found. Install it first.');
  process.exit(1);
}

const duration = execSync(
  `ffprobe -v error -show_entries format=duration -of csv=p=0 "${video}"`,
).toString().trim();

console.log(`Duration: ${duration}s`);
console.log('Adding music...');

mkdirSync(OUTPUT_DIR, {recursive: true});

execSync(
  `ffmpeg -y -i "${video}" -stream_loop -1 -i "${MUSIC}" ` +
  `-t ${duration} -map 0:v -map 1:a -c:v copy -c:a aac -shortest "${FINAL}"`,
  {stdio: 'inherit'},
);

console.log(`✓ ${FINAL}`);
