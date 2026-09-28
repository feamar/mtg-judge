// Import Judge Lab JSONL records (schema_version 1.0) into golden/cases/*.yaml (golden-case.schema.json).
// Deterministic, no dependencies. Usage:
//   node golden/tools/import-judge-lab.mjs <input.jsonl> [--cr <CR .txt>] [--validated-by <name> --validated-on <date> --validated-note <text>]
// With --cr, every "CR x" citation is checked against the rule numbers in that CR edition.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const input = args[0];
if (!input) { console.error('usage: import-judge-lab.mjs <input.jsonl> [--cr file] [--validated-by name --validated-on date --validated-note text]'); process.exit(2); }
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'cases');

// --- optional CR rule index -------------------------------------------------
let crRules = null;
if (opt('--cr')) {
  crRules = new Set();
  for (const line of readFileSync(opt('--cr'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^(\d{3}\.\d+[a-z]?)\.? /);
    if (m) crRules.add(m[1]);
  }
}

// --- minimal YAML emitter (strings are JSON-quoted, which is valid YAML) ----
const scalar = (v) => (v === null || v === undefined) ? 'null' : (typeof v === 'string' ? JSON.stringify(v) : String(v));
function emit(v, indent = '') {
  if (Array.isArray(v)) {
    if (v.length === 0) return ' []';
    return v.map((x) => (x !== null && typeof x === 'object')
      ? `\n${indent}- ${emit(x, indent + '  ').replace(/^\n\s*/, '')}`
      : `\n${indent}- ${scalar(x)}`).join('');
  }
  if (v !== null && typeof v === 'object') {
    const keys = Object.keys(v).filter((k) => v[k] !== undefined);
    if (keys.length === 0) return ' {}';
    return keys.map((k) => {
      const x = v[k];
      return (x !== null && typeof x === 'object') ? `\n${indent}${k}:${emit(x, indent + '  ')}` : `\n${indent}${k}: ${scalar(x)}`;
    }).join('');
  }
  return ` ${scalar(v)}`;
}

// --- mapping ----------------------------------------------------------------
const cite = (s) => s.replace(/^CR\s+/, 'CR:').replace(/^Oracle:\s*/, 'Oracle:');
const unknownCites = [];

function toCase(r) {
  const x = r.expected;
  const citations = [...new Set([
    ...x.normative_references.map(cite),
    ...r.source_proposition_consequence.flatMap((s) => s.sources).filter((s) => s.startsWith('Oracle')).map(cite),
  ])];
  if (crRules) for (const c of citations.filter((c) => c.startsWith('CR:'))) {
    const n = c.slice(3).trim();
    if (!crRules.has(n)) unknownCites.push(`${r.id}: ${c}`);
  }
  const by = opt('--validated-by');
  return {
    id: r.id,
    title: r.title,
    family: r.scenario_family,
    validation: by
      ? { status: 'VALIDATED', by, on: opt('--validated-on'), note: `${opt('--validated-note') ?? ''} Original record: ${r.validation.outcome_review} Source status in record: ${r.validation.source_status}.`.trim() }
      : { status: r.validation.source_status === 'SOURCE CHECK REQUIRED' ? 'SOURCE_CHECK_REQUIRED' : 'VALIDATED', note: r.validation.outcome_review },
    set: r.evaluation_split,
    origin: 'judge-lab',
    sources: { cr: r.context.rules_version, oracle: 'Scryfall Oracle mirror, see provenance' },
    context: { format: 'any', rel: 'not-material', framework: null, inGame: false },
    input: {
      raw: [{ seat: 'P1', text: r.input.player_message }],
      cards: r.input.cards,
      assumptions: r.input.assumptions,
    },
    expect: {
      kind: 'rules-question',
      answer: x.ruling,
      propositions: x.intermediate_propositions,
      chain: r.source_proposition_consequence.map((s) => ({ sources: s.sources.map(cite), propositions: s.propositions, consequence: s.consequence })),
      requiredCitations: citations,
      mustNot: ['invent-infraction-or-penalty', 'add-unmentioned-effects'],
      escalate: x.escalation_required,
    },
    provenance: { sourceQuestionId: r.source_question_id, scenarioFile: r.scenario_file, schemaVersion: r.schema_version, ...r.provenance },
  };
}

// Keep owner-maintained tag / tagProposed lines on re-import (they don't exist in the source records).
function keepTags(file, yaml) {
  if (!existsSync(file)) return yaml;
  const kept = readFileSync(file, 'utf8').split(/\r?\n/)
    .filter((l) => /^(tag|tagProposed):/.test(l) && !new RegExp(`^${l.split(':')[0]}:`, 'm').test(yaml));
  return kept.length ? yaml.replace(/^(set: )/m, `${kept.join('\n')}\n$1`) : yaml;
}

const rows = readFileSync(input, 'utf8').split(/\r?\n/).filter((l) => l.trim()).map((l) => JSON.parse(l));
const ids = new Set();
for (const r of rows) {
  if (ids.has(r.id)) throw new Error(`duplicate id ${r.id}`);
  ids.add(r.id);
  if (r.interaction_type !== 'rules_question' || r.expected.disposition !== 'resolved_rules_question') throw new Error(`${r.id}: unsupported interaction/disposition`);
  const c = toCase(r);
  const header = `# Imported from ${input.replace(/\\/g, '/').split('/').pop()} by golden/tools/import-judge-lab.mjs. Edit the source record, not this file.\n`;
  const out = join(outDir, `${r.id}.yaml`);
  writeFileSync(out, keepTags(out, header + emit(c).replace(/^\n/, '') + '\n'), 'utf8');
}
console.log(`imported ${rows.length} cases into ${outDir}`);
if (crRules) console.log(unknownCites.length ? `CR citations not found in the given CR edition:\n  ${unknownCites.join('\n  ')}` : `all CR citations exist in the given CR edition (${crRules.size} rules indexed)`);
