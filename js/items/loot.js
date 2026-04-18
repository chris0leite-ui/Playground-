// Roll loot drops when enemies die. Bosses guarantee rare drops.
const LOOT_TABLES = {
  orc:       [{ chance: 0.10, slot: 'weapon', key: 'dagger' },
              { chance: 0.05, slot: 'weapon', key: 'sword' }],
  uruk:      [{ chance: 0.18, slot: 'weapon', key: 'sword' },
              { chance: 0.08, slot: 'armor',  key: 'mail' }],
  troll:     [{ chance: 0.30, slot: 'weapon', key: 'spear' },
              { chance: 0.15, slot: 'armor',  key: 'gondorPlate' }],
  guard:     [{ chance: 0.20, slot: 'weapon', key: 'spear' },
              { chance: 0.10, slot: 'armor',  key: 'gondorPlate' }],
  bossTroll: [{ chance: 1.00, slot: 'weapon', key: 'sting' }],
  bossUruk:  [{ chance: 1.00, slot: 'armor',  key: 'mithril' }],
  bossWK:    [{ chance: 1.00, slot: 'weapon', key: 'anduril' }],
};

function rollLoot(entity) {
  const table = LOOT_TABLES[entity.type];
  if (!table) return;
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
