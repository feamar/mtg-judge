// Deterministic noise generator for robustness tests (ADR-0018 §5). Same seed + severity => same output.
// Library use: import { noisify } from './noisify.mjs'; noisify(text, { cards, seed, severity }).
// CLI demo:    node golden/tools/noisify.mjs golden/cases/<case>.yaml [seed]
// The tables below are small seeds for the demo; in the product they come from the lexicon data (ADR-0018 §4).
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const NICKNAMES = {
  'Smothering Tithe': 'tithe', 'Orcish Bowmasters': 'bowmasters', "Thassa's Oracle": 'thoracle',
  'Demonic Consultation': 'consult', 'Deflecting Swat': 'swat', 'Pact of Negation': 'pact',
  'Kinnan, Bonder Prodigy': 'kinnan', 'Underworld Breach': 'breach', "Lion's Eye Diamond": 'LED',
  'Necropotence': 'necro', 'Red Elemental Blast': 'REB', 'Delney, Streetwise Lookout': 'delney',
  'Selvala, Explorer Returned': 'selvala', 'Deathrite Shaman': 'DRS', 'Swords to Plowshares': 'swords',
};
const STT = [[/\bkinnan\b/gi, 'canon'], [/\btithe\b/gi, 'tide'], [/\bmana\b/gi, 'manna'], [/\bstack\b/gi, 'stock'],
             [/\bswat\b/gi, 'swot'], [/\bpact\b/gi, 'packed'], [/\bnecro\b/gi, 'necro'], [/\bbreach\b/gi, 'breech']];
const ABBREV = [[/enters the battlefield|\benters\b/gi, 'etb'], [/\bsacrifices?\b/gi, 'sac'], [/\bgraveyard\b/gi, 'yard'],
                [/\bopponents?\b/gi, 'opp'], [/\bmana value\b/gi, 'mv'], [/\bcounter(s|ed)?\b/gi, 'counter'],
                [/\bbecause\b/gi, 'cuz'], [/\byou\b/gi, 'u']];
const FILLER = ['uh', 'like', 'so basically', 'um', 'i mean'];

function rng(seed) {                       // mulberry32
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function typo(word, r) {
  if (word.length < 4) return word;
  const i = 1 + Math.floor(r() * (word.length - 2));
  const k = Math.floor(r() * 3);
  if (k === 0) return word.slice(0, i) + word.slice(i + 1);                              // drop a letter
  if (k === 1) return word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2);      // swap two letters
  return word.slice(0, i) + word[i] + word.slice(i);                                     // double a letter
}

export function noisify(text, { cards = [], seed = 1, severity = 1 } = {}) {
  const r = rng(seed * 1000 + severity);
  const applied = [];
  let t = text;
  if (severity >= 2) {
    for (const c of cards) {
      const nick = NICKNAMES[c];
      const short = c.split(',')[0];
      if (nick && t.includes(c) && nick.toLowerCase() !== c.toLowerCase()) { t = t.split(c).join(nick); applied.push(`nickname:${c}`); }
      else if (nick && t.includes(short) && short !== c && nick.toLowerCase() !== short.toLowerCase()) { t = t.split(short).join(nick); applied.push(`nickname:${short}`); }
    }
    for (const [re, s] of ABBREV) if (t.search(re) >= 0 && r() < 0.7) { t = t.replace(re, s); applied.push(`abbrev:${s}`); }
  }
  if (severity >= 3) {
    for (const [re, s] of STT) if (t.search(re) >= 0 && t.replace(re, s) !== t) { t = t.replace(re, s); applied.push(`stt:${s}`); }
    const words = t.split(' ');
    for (let n = 0; n < 2; n++) {                                          // two typos on longer words
      const cand = words.map((w, i) => [w, i]).filter(([w]) => /^[A-Za-z']{5,}$/.test(w));
      if (cand.length) { const [w, i] = cand[Math.floor(r() * cand.length)]; words[i] = typo(w, r); applied.push(`typo:${w}`); }
    }
    for (let n = 0; n < 2; n++) { const i = Math.floor(r() * words.length); words.splice(i, 0, FILLER[Math.floor(r() * FILLER.length)]); }
    applied.push('filler');
    t = words.join(' ');
  }
  t = t.toLowerCase().replace(/[.,;:!?"“”()]/g, '').replace(/\s+/g, ' ').trim();   // severity >= 1
  applied.unshift('lowercase', 'strip-punctuation');
  return { text: t, severity, seed, applied };
}

// ---- CLI demo: read the first raw text and the cards from a case file (no YAML dependency) ----
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const file = process.argv[2];
  const seed = Number(process.argv[3] ?? 1);
  const y = readFileSync(file, 'utf8');
  const text = JSON.parse((y.match(/text:\s*("(?:[^"\\]|\\.)*")/) ?? [])[1] ?? '""');
  const cardsFlow = y.match(/cards:\s*\[(.*)\]/);
  const cards = cardsFlow ? JSON.parse(`[${cardsFlow[1]}]`)
    : [...(y.split(/\n\s*cards:\s*\n/)[1] ?? '').matchAll(/^\s*-\s*("(?:[^"\\]|\\.)*")/gm)].map((m) => JSON.parse(m[1]));
  console.log(`clean:      ${text}`);
  for (const s of [1, 2, 3]) {
    const v = noisify(text, { cards, seed, severity: s });
    console.log(`severity ${s}: ${v.text}\n            [${v.applied.join(', ')}]`);
  }
}
