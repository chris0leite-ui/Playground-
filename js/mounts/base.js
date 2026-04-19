// Generalizes mount/dismount so the player can ride horses, eagles, wargs,
// and mumakil. Replaces the built-in mount logic only at the edges: the
// existing tryMountOrDismount in player.js still handles horses directly;
// this module adds a world spawner for the new mount types and extends the
// mount speed lookup.
function spawnExoticMounts() {
  // Spread mounts across the world, each in a thematic spot.
  let p = findOpenTile(); state.entities.push(makeEagle(p.x, p.y));
  p = findOpenTile(); state.entities.push(makeWarg(p.x, p.y));
  p = findOpenTile(); state.entities.push(makeWarg(p.x, p.y));
  p = findOpenTile(); state.entities.push(makeMumak(p.x, p.y));
  // Shadowfax gallops the plains of Rohan — seek a ROHAN tile.
  p = _findTileIn(TILES.ROHAN) || findOpenTile();
  state.entities.push(makeShadowfax(p.x, p.y));
  // Ents dwell in Fangorn.
  p = _findTileIn(TILES.FANGORN) || _findTileIn(TILES.FOREST) || findOpenTile();
  state.entities.push(makeEnt(p.x, p.y));
  p = _findTileIn(TILES.FANGORN) || findOpenTile();
  state.entities.push(makeEnt(p.x, p.y));
  // Fell Beast — one near Mordor (anywhere on MORDOR tile).
  p = _findTileIn(TILES.MORDOR) || findOpenTile();
  state.entities.push(makeFellBeast(p.x, p.y));
}
on('reset', spawnExoticMounts);

// Returns a per-mount speed multiplier for updatePlayer. Hooked via global.
function mountSpeed() {
  const p = state.player;
  if (!p || !p.onHorse) return null;
  const m = p.onHorse;
  if (m.type === 'eagle')     return 320;
  if (m.type === 'warg')      return 280;
  if (m.type === 'mumak')     return 110;
  if (m.type === 'shadowfax') return 360;
  if (m.type === 'ent')       return 90;
  if (m.type === 'fellBeast') return 340;
  return CONFIG.HORSE_SPEED;
}
