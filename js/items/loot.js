// Roll loot drops when enemies die. Bosses guarantee rare drops.
const LOOT_TABLES = {
  deer:      [{ chance: 0.60, pickup: 'lembas' }],
  boar:      [{ chance: 0.60, pickup: 'gold' },
              { chance: 0.20, pickup: 'lembas' }],
  orc:       [{ chance: 0.10, slot: 'weapon', key: 'dagger' },
              { chance: 0.05, slot: 'weapon', key: 'sword' },
              { chance: 0.04, slot: 'weapon', key: 'throwingAxe' },
              { chance: 0.18, pickup: 'lembas' }],
  uruk:      [{ chance: 0.18, slot: 'weapon', key: 'sword' },
              { chance: 0.08, slot: 'weapon', key: 'elvenKnife' },
              { chance: 0.06, slot: 'weapon', key: 'barrowBlade' },
              { chance: 0.08, slot: 'armor',  key: 'mail' },
              { chance: 0.22, pickup: 'lembas' }],
  troll:     [{ chance: 0.25, slot: 'weapon', key: 'warHammer' },
              { chance: 0.20, slot: 'weapon', key: 'dwarfAxe' },
              { chance: 0.15, slot: 'armor',  key: 'gondorPlate' },
              { chance: 0.30, pickup: 'lembas' }],
  guard:     [{ chance: 0.20, slot: 'weapon', key: 'spear' },
              { chance: 0.08, slot: 'weapon', key: 'bow' },
              { chance: 0.10, slot: 'armor',  key: 'gondorPlate' },
              { chance: 0.20, pickup: 'lembas' }],
  bossTroll: [{ chance: 1.00, slot: 'weapon', key: 'sting' },
              { chance: 1.00, pickup: 'lembas' }],
  bossUruk:  [{ chance: 1.00, slot: 'weapon', key: 'glamdring' },
              { chance: 1.00, slot: 'armor',  key: 'mithril' },
              { chance: 1.00, pickup: 'lembas' }],
  bossWK:    [{ chance: 1.00, slot: 'weapon', key: 'anduril' },
              { chance: 1.00, slot: 'weapon', key: 'palantirBolt' },
              { chance: 1.00, pickup: 'lembas' }],
  bossSauron:[{ chance: 1.00, slot: 'armor',  key: 'mithril' },
              { chance: 1.00, slot: 'weapon', key: 'anduril' },
              { chance: 1.00, pickup: 'lembas' },
              { chance: 1.00, pickup: 'gold' }],
};

function _dropRow(row, x, y, offset) {
  if (row.pickup) {
    state.entities.push(makePickup(x + offset, y, row.pickup));
  } else {
    state.entities.push(makeItemPickup(x + offset, y, row.slot, row.key));
  }
}

function rollLoot(entity) {
  const table = LOOT_TABLES[entity.type];
  if (!table) return;
  if (entity.isBoss) {
    let dropped = 0;
    for (const row of table) {
      if (rng() < row.chance) {
        _dropRow(row, entity.x, entity.y, dropped++ * 16);
      }
    }
    return;
  }
  for (const row of table) {
    if (rng() < row.chance) {
      _dropRow(row, entity.x, entity.y, 0);
      return;
    }
  }
  if (rng() < 0.25) state.entities.push(makePickup(entity.x, entity.y, 'gold'));
}

on('enemyKilled', ({ entity }) => { if (entity) rollLoot(entity); });
