// Runs after the base entity init to layer in world props / doors / beacons /
// quest givers / gates / bosses.
function _snapAll(types) {
  for (const e of state.entities) {
    if (!types || types.indexOf(e.type) >= 0) {
      const safe = _findSafeSpot(e.x, e.y, 200);
      if (safe) { e.x = safe.x; e.y = safe.y; }
    }
  }
}

// Player spawns at Hobbiton in the Shire (NW). A long eastward journey to
// Rivendell, Moria, Rohan, and finally Gondor awaits.
function _spawn() { return LANDMARK_PX('hobbiton'); }

function _spawnWorldContent() {
  if (state.player) {
    const s = _spawn();
    state.player.x = s.x;
    state.player.y = s.y;
    // Final safety: snap the player to a walkable tile if Hobbiton's center
    // happens to be on a building.
    const safe = _findSafeSpot(state.player.x, state.player.y, 160);
    if (safe) { state.player.x = safe.x; state.player.y = safe.y; }
  }
  spawnDoors();
  spawnProps();
  spawnBeacons();
  spawnGates();
  spawnQuestGivers();
  spawnBosses();
  spawnStarterLoot();
  _snapAll(['giver', 'recruit', 'beacon', 'itempickup', 'stall', 'barrel', 'spider', 'haradrim']);
}

function spawnStarterLoot() {
  const s = _spawn();
  state.entities.push(makeItemPickup(s.x - 40, s.y - 30, 'weapon', 'bow'));
  state.entities.push(makeItemPickup(s.x + 40, s.y - 30, 'weapon', 'throwingAxe'));
  state.entities.push(makeItemPickup(s.x + 60, s.y, 'armor', 'mail'));
}
on('reset', _spawnWorldContent);
