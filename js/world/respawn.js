// Periodic respawn so the world stays alive — orcs/guards/horses/pickups
// trickle back when their counts drop below baseline. Spawns happen
// off-screen so players don't see things appear out of thin air.
const RESPAWN = {
  orc:    { count: () => CONFIG.NUM_ORCS,    make: (p) => makeOrc(p.x, p.y) },
  guard:  { count: () => CONFIG.NUM_GUARDS,  make: (p) => makeGuard(p.x, p.y) },
  horse:  { count: () => CONFIG.NUM_HORSES,  make: (p) => makeHorse(p.x, p.y), road: true },
  pickup: { count: () => CONFIG.NUM_PICKUPS, make: (p) => makePickup(p.x, p.y, Math.random() < 0.55 ? 'gold' : 'lembas') },
};

let _respawnT = 3;
function _countByType(type) {
  let n = 0;
  for (const e of state.entities) if (e.type === type) n++;
  return n;
}

function _offScreenOpenTile(road) {
  const player = state.player;
  for (let i = 0; i < 30; i++) {
    const p = road ? findOpenRoadTile() : findOpenTile();
    if (!player || dist(p.x, p.y, player.x, player.y) > 320) return p;
  }
  return null;
}

function updateRespawn(dt) {
  _respawnT -= dt;
  if (_respawnT > 0) return;
  _respawnT = 4;

  for (const type in RESPAWN) {
    const def = RESPAWN[type];
    const baseline = def.count();
    const current = _countByType(type);
    if (current >= baseline) continue;
    const spot = _offScreenOpenTile(def.road);
    if (!spot) continue;
    state.entities.push(def.make(spot));
  }
}
registerUpdate(updateRespawn);
