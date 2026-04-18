// Generalizes mount/dismount so the player can ride horses, eagles, wargs,
// and mumakil. Replaces the built-in mount logic only at the edges: the
// existing tryMountOrDismount in player.js still handles horses directly;
// this module adds a world spawner for the new mount types and extends the
// mount speed lookup.
function spawnExoticMounts() {
  // One eagle, two wargs, one mumak somewhere in the outer tier.
  let p = findOpenTile(); state.entities.push(makeEagle(p.x, p.y));
  p = findOpenTile(); state.entities.push(makeWarg(p.x, p.y));
  p = findOpenTile(); state.entities.push(makeWarg(p.x, p.y));
  p = findOpenTile(); state.entities.push(makeMumak(p.x, p.y));
}
on('reset', spawnExoticMounts);

// Returns a per-mount speed multiplier for updatePlayer. Hooked via global.
function mountSpeed() {
  const p = state.player;
  if (!p || !p.onHorse) return null;
  const m = p.onHorse;
  if (m.type === 'eagle') return 320;
  if (m.type === 'warg')  return 280;
  if (m.type === 'mumak') return 110;
  return CONFIG.HORSE_SPEED;
}
