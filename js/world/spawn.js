// Runs after the base entity init to layer in world props / doors / beacons /
// quest givers / gates / bosses.
function _spawnWorldContent() {
  // Relocate the player to the outer tier 7 so the inner gates have meaning.
  if (state.player) {
    state.player.x = (MAP.W / 2) * TILE;
    state.player.y = (MAP.H - 2) * TILE;
  }
  spawnDoors();
  spawnProps();
  spawnBeacons();
  spawnGates();
  spawnQuestGivers();
  spawnBosses();
  spawnStarterLoot();
}

function spawnStarterLoot() {
  // Two weapons + an armor on the grass near the tier 7 spawn.
  const cx = (MAP.W / 2) * TILE, cy = (MAP.H - 2) * TILE;
  state.entities.push(makeItemPickup(cx - 40, cy - 30, 'weapon', 'bow'));
  state.entities.push(makeItemPickup(cx + 40, cy - 30, 'weapon', 'throwingAxe'));
  state.entities.push(makeItemPickup(cx + 60, cy, 'armor', 'mail'));
}
on('reset', _spawnWorldContent);
