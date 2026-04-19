// ASCII tilemap body → { w, h, grid, subtypes, decor }. Expects a fenced
// ```tilemap block in the body.

const DEFAULT_LEGEND = {
  '.': { tile: 'GRASS' },
  ',': { tile: 'ROAD' },
  'p': { tile: 'PAVEMENT' },
  '#': { tile: 'BUILDING' },
  'H': { tile: 'BUILDING', subtype: 'hobbit-hole' },
  '~': { tile: 'WATER' },
  'T': { tile: 'TREE' },
  'W': { tile: 'WALL' },
  '+': { tile: 'ROAD', decor: 'door' },
  '=': { tile: 'ROAD', decor: 'bridge' },
  '^': { tile: 'WALL' },
  's': { tile: 'GRASS' },
  'r': { tile: 'GRASS', decor: 'ruin' },
  ' ': { tile: 'WALL' },
};

// Tile enum must match engine/config.js TILES.
const TILE_ENUM = { GRASS: 0, ROAD: 1, PAVEMENT: 2, BUILDING: 3, WATER: 4, WALL: 5, TREE: 6 };

function parseTilemap(body, frontmatter, filename) {
  const legend = Object.assign({}, DEFAULT_LEGEND, frontmatter.legend_overrides || {});
  const m = body.match(/```tilemap\s*\n([\s\S]*?)\n```/);
  if (!m) throw new Error(`${filename}: expected \`\`\`tilemap fenced block`);
  const rows = m[1].split(/\r?\n/).filter((l, i, arr) => !(i === arr.length - 1 && l === ''));
  if (rows.length === 0) throw new Error(`${filename}: tilemap has no rows`);
  const w = rows[0].length;
  for (let y = 0; y < rows.length; y++) {
    if (rows[y].length !== w) throw new Error(`${filename}: row ${y + 1} width ${rows[y].length} != ${w}`);
  }
  const grid = [];
  const subtypes = {};
  const decor = [];
  for (let y = 0; y < rows.length; y++) {
    const row = [];
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      const rule = legend[ch];
      if (!rule) throw new Error(`${filename}: unknown tilemap glyph "${ch}" at (${x},${y})`);
      row.push(TILE_ENUM[rule.tile]);
      if (rule.subtype) subtypes[`${x},${y}`] = rule.subtype;
      if (rule.decor) decor.push({ type: rule.decor, x, y });
    }
    grid.push(row);
  }
  return { w, h: rows.length, grid, subtypes, decor };
}

module.exports = { parseTilemap };
