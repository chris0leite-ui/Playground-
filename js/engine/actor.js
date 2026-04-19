// makeActor — the common shape shared by player, orcs, guards, horses, and
// eventually any future NPC. Factories in entity_types/*.js layer their
// type-specific fields on top via plain object spread.

function makeActor(base) {
  const common = {
    vx: 0, vy: 0,
    w: 14, h: 14,
    angle: 0,
    attackTimer: 0,
    hurtFlash: 0,
  };
  const actor = { ...common, ...base };
  if (actor.hp !== undefined && actor.maxHp === undefined) {
    actor.maxHp = actor.hp;
  }
  return actor;
}
