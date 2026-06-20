/**
 * Post-build step: stamp a unique build id into the service worker so each
 * deploy produces a byte-different sw.js. That's what makes browsers detect an
 * update and trigger the seamless reload flow in registerSW.ts.
 *
 * Runs against the built output (dist/public/sw.js); the source file in
 * client/public/sw.js keeps the literal __BUILD_ID__ placeholder.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swPath = resolve(__dirname, '..', 'dist', 'public', 'sw.js');

if (!existsSync(swPath)) {
  console.error(`[stamp-sw] sw.js not found at ${swPath} — did the client build run?`);
  process.exit(1);
}

const buildId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const original = readFileSync(swPath, 'utf8');

if (!original.includes('__BUILD_ID__')) {
  console.warn('[stamp-sw] placeholder __BUILD_ID__ not found; sw.js left unchanged.');
} else {
  writeFileSync(swPath, original.replaceAll('__BUILD_ID__', buildId));
  console.log(`[stamp-sw] sw.js version set to ${buildId}`);
}
