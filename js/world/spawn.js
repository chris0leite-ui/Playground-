// Runs after the base entity init to layer in world props / doors / beacons /
// quest givers / gates / bosses.
//
// Snaps every hand-placed entity to a reachable tile via _findSafeSpot so
// we never anchor an NPC or pickup inside a building.
function _snapAll(types) {
  for (const e of state.entities) {
    if (!types || types.indexOf(e.type) >= 0) {
      const safe = _findSafeSpot(e.x, e.y, 160);
      if (safe) { e.x = safe.x; e.y = safe.y; }
    }
  }
}

// Player spawn sits just outside the south wall (tier 7), regardless of
// how large the map is. Keeps the start near the city on any map size.
const SPAWN_X = (MAP.W / 2) * TILE;
const SPAWN_Y = (MAP.H / 2 + 20) * TILE;

function _spawnWorldContent() {
  // Relocate the player to the outer tier 7 so the inner gates have meaning.
  if (state.player) {
    state.player.x = SPAWN_X;
    state.player.y = SPAWN_Y;
  }
  spawnDoors();
  spawnProps();
  spawnBeacons();
  spawnGates();
  spawnQuestGivers();
  spawnBosses();
  spawnStarterLoot();
  // Make sure every reachable NPC / pickup / beacon / prop is on a walkable
  // tile. Doors and gates intentionally sit on road tiles already; bosses
  // are snapped in spawnBosses().
  _snapAll(['giver', 'recruit', 'beacon', 'itempickup', 'stall', 'barrel']);
}

function spawnStarterLoot() {
  state.entities.push(makeItemPickup(SPAWN_X - 40, SPAWN_Y - 30, 'weapon', 'bow'));
  state.entities.push(makeItemPickup(SPAWN_X + 40, SPAWN_Y - 30, 'weapon', 'throwingAxe'));
  state.entities.push(makeItemPickup(SPAWN_X + 60, SPAWN_Y, 'armor', 'mail'));
}
on('reset', _spawnWorldContent);
