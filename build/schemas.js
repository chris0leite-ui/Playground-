// Schema definitions per content type. `req` = required frontmatter keys.
// `opt` = allowed optional keys. Unknown keys on a parsed record raise a
// build error. Type is derived from the file's path, not frontmatter.

const SCHEMAS = {
  region: {
    req: ['id', 'name', 'tilemap', 'neighbors'],
    opt: ['parent', 'climate', 'era', 'tone', 'factions_present',
          'spawn_point', 'overworld_pos', 'description', 'tags'],
  },
  settlement: {
    req: ['id', 'region', 'name', 'type', 'faction'],
    opt: ['population', 'ruler', 'notable_buildings', 'tile_region',
          'description', 'tags'],
  },
  building: {
    req: ['id', 'type', 'name'],
    opt: ['settlement', 'region', 'owner_npc', 'services',
          'inventory_for_sale', 'interior_map', 'entrance', 'description', 'tags'],
  },
  npc: {
    req: ['id', 'name', 'location', 'faction', 'role'],
    opt: ['class', 'disposition', 'dialogue', 'quest_hooks', 'stats',
          'spawn_conditions', 'spawn_pos', 'inventory', 'description', 'tags'],
  },
  dialogue: {
    req: ['id', 'speaker'],
    opt: ['default_node', 'tags'],
  },
  quest: {
    req: ['id', 'title', 'giver', 'summary'],
    opt: ['prerequisites', 'rewards', 'classes_eligible', 'arc', 'tags'],
  },
  item: {
    req: ['id', 'name', 'type', 'slot'],
    opt: ['stats', 'lore', 'rarity', 'crafted_by', 'where_found', 'icon_color', 'tags'],
  },
  faction: {
    req: ['id', 'name', 'banner_color'],
    opt: ['rep_tiers', 'allies', 'enemies', 'territories', 'description', 'tags'],
  },
  class: {
    req: ['id', 'name', 'stats'],
    opt: ['starting_inventory', 'starting_region', 'starting_pos',
          'signature_ability', 'can_use', 'lore', 'tags'],
  },
  arc: {
    req: ['id', 'title', 'summary', 'quests_in_order'],
    opt: ['regions', 'classes_eligible', 'introduced_by', 'reward_capstone',
          'description', 'tags'],
  },
  encounter: {
    req: ['id', 'region', 'trigger', 'enemies'],
    opt: ['loot_table', 'narrative', 'once', 'classes_affected', 'type', 'tags'],
  },
  tilemap: {
    req: ['id', 'size'],
    opt: ['legend_overrides', 'tags'],
  },
  overworld: {
    req: ['id', 'regions'],
    opt: ['bg_color', 'tags'],
  },
};

const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

function validateRecord(type, record, filename) {
  const s = SCHEMAS[type];
  if (!s) throw new Error(`${filename}: unknown content type "${type}"`);
  if (!record || typeof record !== 'object') {
    throw new Error(`${filename}: frontmatter must be an object`);
  }
  for (const key of s.req) {
    if (!(key in record)) {
      throw new Error(`${filename}: missing required field "${key}" for ${type}`);
    }
  }
  const allowed = new Set([...s.req, ...s.opt]);
  for (const k of Object.keys(record)) {
    if (!allowed.has(k)) {
      throw new Error(`${filename}: unknown field "${k}" for ${type}`);
    }
  }
  if (record.id && !ID_RE.test(record.id)) {
    throw new Error(`${filename}: invalid id "${record.id}" (must match ${ID_RE})`);
  }
}

module.exports = { SCHEMAS, validateRecord };
