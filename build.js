#!/usr/bin/env node
// Middle-earth RPG content compiler. Walks content/ and emits js/world/*.js
// shards onto window.W.* globals. Pure Node — no npm.

'use strict';

const fs = require('fs');
const path = require('path');

const { parseFrontmatter } = require('./build/parse_frontmatter');
const { SCHEMAS, validateRecord } = require('./build/schemas');
const { parseDialogueBody } = require('./build/parse_dialogue');
const { parseQuestBody } = require('./build/parse_quest');
const { validateCrossRefs } = require('./build/validators');
const { emitManifest, emitShard } = require('./build/emit');
const { decorateWorldPositions, reportPlacement } = require('./build/placement');

const CONTENT = path.join(__dirname, 'content');
const WORLD_OUT = path.join(__dirname, 'js', 'world');
const SCHEMA_VERSION = 2;

const store = {
  regions: {}, settlements: {}, buildings: {}, npcs: {},
  dialogues: {}, quests: {}, items: {}, factions: {},
  arcs: {}, encounters: {}, overworlds: {},
};

const args = process.argv.slice(2);
const CHECK_ONLY = args.includes('--check');
const PLACEMENT_ONLY = args.includes('--check-placement');
const VERBOSE = args.includes('--verbose');

function main() {
  if (!fs.existsSync(CONTENT)) {
    console.log('[build] no content/ directory — emitting empty shards');
  } else {
    walk(CONTENT);
  }
  decorateWorldPositions(store);
  const errors = validateCrossRefs(store);
  if (errors.length) {
    for (const err of errors) console.error('[build] cross-ref:', err);
    process.exit(1);
  }
  if (PLACEMENT_ONLY) { reportPlacement(store); return; }
  if (CHECK_ONLY) { console.log('[build] --check: ok'); return; }
  fs.mkdirSync(WORLD_OUT, { recursive: true });
  fs.writeFileSync(path.join(WORLD_OUT, '_manifest.js'), emitManifest(SCHEMA_VERSION));
  for (const type of Object.keys(SCHEMAS)) {
    const bucket = type === 'overworld' ? store.overworlds : (store[pluralOf(type)] || {});
    const shard = emitShard(type, bucket || {});
    const fileBase = type === 'overworld' ? 'overworld' : pluralOf(type);
    fs.writeFileSync(path.join(WORLD_OUT, fileBase + '.js'), shard);
  }
  console.log('[build] wrote', Object.keys(SCHEMAS).length + 1, 'shards to js/world/');
}

// decorateWorldPositions + reportPlacement live in build/placement.js.

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith('_') && name !== '_schemas') continue; // skip _index.md etc at walk time
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!name.endsWith('.md')) continue;
    if (p.includes(path.sep + '_schemas' + path.sep)) continue;
    ingest(p);
  }
}

function ingest(filename) {
  const src = fs.readFileSync(filename, 'utf8');
  const { frontmatter, body } = parseFrontmatter(src, filename);
  if (!frontmatter) return; // skip docs without frontmatter
  const type = typeFromPath(filename);
  if (!type) return;
  if (VERBOSE) console.log('[build]', type, filename);
  validateRecord(type, frontmatter, filename);
  const record = frontmatter;
  if (type === 'region') {
    // tilemap / neighbors are vestigial now that the world is unified;
    // drop them if present so they don't leak into the emitted shard.
    delete record.tilemap;
    delete record.neighbors;
    store.regions[record.id] = record;
  } else if (type === 'dialogue') {
    const parsed = parseDialogueBody(body, filename);
    store.dialogues[record.id] = Object.assign({ id: record.id, speaker: record.speaker }, parsed);
  } else if (type === 'quest') {
    record.steps = parseQuestBody(body, filename);
    store.quests[record.id] = record;
  } else if (type === 'overworld') {
    store.overworlds[record.id] = record;
  } else {
    store[pluralOf(type)][record.id] = record;
    // NPCs may embed an inline ```dialogue fenced block; register it.
    if (type === 'npc' && record.dialogue) {
      const m = body.match(/```dialogue\s*\n([\s\S]*?)\n```/);
      if (m) {
        const parsed = parseDialogueBody(m[1], filename);
        store.dialogues[record.dialogue] = Object.assign(
          { id: record.dialogue, speaker: record.id },
          parsed
        );
      }
    }
  }
}

function pluralOf(type) { return type + 's'; }

function typeFromPath(filename) {
  const rel = path.relative(CONTENT, filename).split(path.sep);
  if (rel[0] === 'regions' && rel[2] === 'region.md') return 'region';
  if (rel[0] === 'regions') {
    const sub = rel[2];
    const singular = { settlements: 'settlement', buildings: 'building',
                       npcs: 'npc', quests: 'quest', encounters: 'encounter',
                       dialogues: 'dialogue' }[sub];
    return singular || null;
  }
  if (rel[0] === 'factions') return 'faction';
  if (rel[0] === 'items') return 'item';
  if (rel[0] === 'arcs') return 'arc';
  if (rel[0] === 'overworld.md' || rel.includes('overworld.md')) return 'overworld';
  return null;
}

main();
