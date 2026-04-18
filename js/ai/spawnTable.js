// Per-tier enemy spawn weights. Called when the ambush system or future
// respawn logic needs "an enemy appropriate for tier T".
const SPAWN_TABLES = {
  7: [{ type: 'orc', w: 8 }, { type: 'uruk', w: 1 }],
  6: [{ type: 'orc', w: 6 }, { type: 'uruk', w: 3 }],
  5: [{ type: 'orc', w: 3 }, { type: 'uruk', w: 5 }, { type: 'troll', w: 1 }],
  4: [{ type: 'uruk', w: 4 }, { type: 'troll', w: 2 }],
  3: [{ type: 'uruk', w: 3 }, { type: 'troll', w: 3 }],
  2: [{ type: 'troll', w: 3 }, { type: 'uruk', w: 2 }],
  1: [{ type: 'troll', w: 2 }, { type: 'uruk', w: 3 }],
};

function pickSpawnFor(tier) {
  const table = SPAWN_TABLES[tier] || SPAWN_TABLES[7];
  let total = 0;
  for (const row of table) total += row.w;
  let pick = rng() * total;
  for (const row of table) {
    pick -= row.w;
    if (pick <= 0) return row.type;
  }
  return table[0].type;
}

function spawnEnemyOfType(type, x, y) {
  if (type === 'orc') return makeOrc(x, y);
  if (type === 'uruk') return makeUruk(x, y);
  if (type === 'troll') return makeTroll(x, y);
  return makeOrc(x, y);
}
