// Import a Judge Lab test bundle (schema_version "judge-lab-testset-bundle/1.0") into golden/cases/*.yaml.
// Deterministic, no dependencies; upserts by id (existing files with the same id are overwritten).
// Usage:
//   node golden/tools/import-judge-lab-bundle.mjs <bundle.json> [--cr <CR .txt>]
//        [--validated-by <name> --validated-on <date> --validated-note <text>]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const input = args[0];
if (!input) { console.error('usage: import-judge-lab-bundle.mjs <bundle.json> [--cr file] [--validated-by name --validated-on date --validated-note text]'); process.exit(2); }
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'cases');

let crRules = null;
if (opt('--cr')) {
  crRules = new Set();
  for (const line of readFileSync(opt('--cr'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^(\d{3}\.\d+[a-z]?)\.? /);
    if (m) crRules.add(m[1]);
  }
}

// Same minimal YAML emitter as import-judge-lab.mjs (JSON-quoted strings are valid YAML).
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

// "CR 603.8" -> "CR:603.8"; "IPG 3.8 — Definition" -> "IPG:3.8 — Definition"; "Oracle: X" -> "Oracle:X"
const cite = (s) => s.replace(/^(CR|IPG|MTR|MTRA|JAR)\s+/, '$1:').replace(/^Oracle:\s*/, 'Oracle:');
const crNumber = (c) => (c.match(/^CR:(\d{3}\.\d+[a-z]?)/) ?? [])[1];
const unknownCites = [];

const FORMAT = { cEDH: 'cEDH', Legacy: 'Legacy', General: 'any', Multiplayer: 'multiplayer' };
const relOf = (t) => /Competitive REL/i.test(t) ? 'Competitive' : /Regular REL/i.test(t) ? 'Regular' : 'not-material';

function toCase(r, bundle) {
  const x = r.expected;
  const text = [r.input.player_message, ...(r.input.assumptions ?? [])].join(' ');
  const citations = [...new Set([
    ...x.normative_references.map(cite),
    ...r.source_proposition_consequence.flatMap((s) => s.sources ?? []).filter((s) => s.startsWith('Oracle')).map(cite),
  ])];
  if (crRules) for (const c of citations) { const n = crNumber(c); if (n && !crRules.has(n)) unknownCites.push(`${r.id}: ${c}`); }
  const by = opt('--validated-by');
  const fileStatus = `outcome ${r.validation.outcome_status}, sources ${r.validation.source_status}`;
  return {
    id: r.id,
    title: r.title,
    family: r.scenario_family,
    ...(r.bucket === 'Hard' ? { tag: 'hard' } : {}),
    validation: by
      ? { status: 'VALIDATED', by, on: opt('--validated-on'), note: `${opt('--validated-note') ?? ''} Status in the bundle record: ${fileStatus}.`.trim() }
      : { status: 'SOURCE_CHECK_REQUIRED', note: `Status in the bundle record: ${fileStatus}.` },
    set: 'dev',
    origin: 'judge-lab',
    sources: { cr: '2026-09-25', oracle: 'Scryfall Oracle mirror, see provenance' },
    context: {
      format: FORMAT[r.setting] ?? 'any',
      rel: relOf(text),
      framework: /\bMTRA\b/.test(text) ? 'MTRA (as stated in the case)' : null,
      inGame: null,
    },
    input: {
      raw: [{ seat: 'P1', text: r.input.player_message }],
      cards: r.input.cards,
      assumptions: r.input.assumptions,
      entryContext: r.input.entry_context,
      eventIntegritySetting: r.input.event_integrity_setting,
      availableIntegritySettings: r.input.available_integrity_settings,
      applicationAuthority: r.input.application_authority,
    },
    expect: {
      kind: r.bucket === 'Policy' ? 'dispute' : 'rules-question',
      disposition: x.disposition,
      answer: x.ruling,
      propositions: x.intermediate_propositions,
      chain: r.source_proposition_consequence.map((s) => ({ sources: (s.sources ?? []).map(cite), propositions: s.propositions ?? [], consequence: s.consequence ?? '' })),
      requiredCitations: citations,
      requiredQuestions: x.required_questions,
      playerFacingMessage: x.player_facing_message,
      handoff: x.handoff,
      integrityPolicy: x.integrity_policy,
      stageExpectations: x.stage_expectations,
      remedy: x.remedy,
      mustNot: ['invent-infraction-or-penalty', 'add-unmentioned-effects', 'reveal-integrity-suspicion'],
      escalate: x.disposition === 'HANDOFF_TO_HUMAN' ? (x.handoff?.reason ?? 'handoff to a human judge') : false,
    },
    provenance: {
      sourceQuestionId: r.source_question_id, scenarioFile: r.scenario_file, bucket: r.bucket, pilot: r.pilot,
      originalSetting: r.setting, bundle: bundle.title, bundleSchema: bundle.schema_version,
      references: bundle.reference_catalog?.[r.source_question_id], relatedScenarios: r.related_scenarios, ...r.provenance,
    },
  };
}

// Keep owner-maintained tag / tagProposed lines on re-import (they don't exist in the source records).
function keepTags(file, yaml) {
  if (!existsSync(file)) return yaml;
  const kept = readFileSync(file, 'utf8').split(/\r?\n/)
    .filter((l) => /^(tag|tagProposed):/.test(l) && !new RegExp(`^${l.split(':')[0]}:`, 'm').test(yaml));
  return kept.length ? yaml.replace(/^(set: )/m, `${kept.join('\n')}\n$1`) : yaml;
}

const bundle = JSON.parse(readFileSync(input, 'utf8'));
if (bundle.schema_version !== 'judge-lab-testset-bundle/1.0') throw new Error(`unsupported bundle schema ${bundle.schema_version}`);
const ids = new Set();
for (const r of bundle.tests) {
  if (ids.has(r.id)) throw new Error(`duplicate id ${r.id}`);
  ids.add(r.id);
  const c = toCase(r, bundle);
  const header = `# Imported from ${input.replace(/\\/g, '/').split('/').pop()} by golden/tools/import-judge-lab-bundle.mjs. Edit the source record, not this file.\n`;
  const out = join(outDir, `${r.id}.yaml`);
  writeFileSync(out, keepTags(out, header + emit(c).replace(/^\n/, '') + '\n'), 'utf8');
}
console.log(`imported ${bundle.tests.length} cases into ${outDir}`);
if (crRules) console.log(unknownCites.length ? `CR citations not found in the given CR edition (${unknownCites.length}):\n  ${unknownCites.join('\n  ')}` : `all CR citations exist in the given CR edition (${crRules.size} rules indexed)`);
