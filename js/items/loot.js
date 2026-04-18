// Roll loot drops when enemies die. Bosses guarantee rare drops.
const LOOT_TABLES = {
  orc:       [{ chance: 0.10, slot: 'weapon', key: 'dagger' },
              { chance: 0.05, slot: 'weapon', key: 'sword' },
              { chance: 0.04, slot: 'weapon', key: 'throwingAxe' }],
  uruk:      [{ chance: 0.18, slot: 'weapon', key: 'sword' },
              { chance: 0.08, slot: 'weapon', key: 'elvenKnife' },
              { chance: 0.06, slot: 'weapon', key: 'barrowBlade' },
              { chance: 0.08, slot: 'armor',  key: 'mail' }],
  troll:     [{ chance: 0.25, slot: 'weapon', key: 'warHammer' },
              { chance: 0.20, slot: 'weapon', key: 'dwarfAxe' },
              { chance: 0.15, slot: 'armor',  key: 'gondorPlate' }],
  guard:     [{ chance: 0.20, slot: 'weapon', key: 'spear' },
              { chance: 0.08, slot: 'weapon', key: 'bow' },
              { chance: 0.10, slot: 'armor',  key: 'gondorPlate' }],
  bossTroll: [{ chance: 1.00, slot: 'weapon', key: 'sting' }],
  bossUruk:  [{ chance: 1.00, slot: 'weapon', key: 'glamdring' },
              { chance: 1.00, slot: 'armor',  key: 'mithril' }],
  bossWK:    [{ chance: 1.00, slot: 'weapon', key: 'anduril' },
              { chance: 1.00, slot: 'weapon', key: 'palantirBolt' }],
};

function rollLoot(entity) {
  const table = LOOT_TABLES[entity.type];
  if (!table) return;
  // Bosses drop every guaranteed row; regular enemies drop at most one.
  if (entity.isBoss) {
    let dropped = 0;
    for (const row of table) {
      if (rng() < row.chance) {
        const off = dropped++ * 16;
        state.entities.push(makeItemPickup(entity.x + off, entity.y, row.slot, row.key));
      }
    }
    return;
  }
  for (const row of table) {
    if (rng() < row.chance) {
      state.entities.push(makeItemPickup(entity.x, entity.y, row.slot, row.key));
      return;
    }
  }
  // Fallback: small gold pouch.
  if (rng() < 0.25) state.entities.push(makePickup(entity.x, entity.y, 'gold'));
}

on('enemyKilled', ({ entity }) => { if (entity) rollLoot(entity); });
