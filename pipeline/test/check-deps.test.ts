import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const run = (root: string) => spawnSync('node', ['pipeline/check-deps.mjs', root], { encoding: 'utf8' });
function fixture(src: string) {
  const d = mkdtempSync(join(tmpdir(), 'deps-'));
  mkdirSync(join(d, 'core', 'src'), { recursive: true });
  writeFileSync(join(d, 'core', 'src', 'x.ts'), src);
  return d;
}
describe('check-deps', () => {
  it('fails a planted core -> node:fs import', () => {
    expect(run(fixture("import { readFileSync } from 'node:fs';\n")).status).toBe(1);
  });
  it('fails a bare built-in and an adapter import', () => {
    expect(run(fixture("import fs from 'fs';\n")).status).toBe(1);
    expect(run(fixture("import a from '@mtg-judge/adapter-sqlite';\n")).status).toBe(1);
  });
  it('passes clean core', () => {
    expect(run(fixture("import { z } from 'zod';\nexport const a = 1;\n")).status).toBe(0);
  });
  it('real repo core is clean', () => { expect(run('.').status).toBe(0); });
});
