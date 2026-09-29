// Dependency check (NFR-EXT-1, NFR-TECH-1): core must not import Node built-ins or adapters.
// Usage: node pipeline/check-deps.mjs [rootDir]   Exit 0 ok, 1 violation.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { builtinModules } from 'node:module';
import { join, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? '.');
const builtins = new Set(builtinModules.filter((m) => !m.startsWith('_')));
const re = /(?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)['"]([^'"]+)['"]/g;

function* files(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(ts|tsx|mts|js|mjs)$/.test(e) && !e.endsWith('.d.ts')) yield p;
  }
}
function forbidden(spec) {
  const bare = spec.replace(/^node:/, '').split('/')[0];
  if (spec.startsWith('node:') || builtins.has(bare)) return `Node built-in "${spec}"`;
  if (/^@mtg-judge\/(adapter-|app|eval|pipeline)/.test(spec)) return `outward dependency "${spec}"`;
  if (/(^|\/)adapters\//.test(spec)) return `adapter path "${spec}"`;
  return null;
}
const bad = [];
try {
  for (const f of files(join(root, 'core', 'src'))) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(re)) {
      const why = forbidden(m[1]);
      if (why) bad.push(`${f}: ${why}`);
    }
  }
} catch (e) { if (e.code !== 'ENOENT') throw e; }
if (bad.length) { console.error('check-deps FAIL\n' + bad.join('\n')); process.exit(1); }
console.log('check-deps ok');
