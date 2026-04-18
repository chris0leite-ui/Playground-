// Per-frame watchdog: if the player ends up standing on a solid tile (e.g. after
// dismounting an eagle over water, or any teleport/reset), spiral them out to
// the nearest walkable spot so they don't get frozen by tryMove.

function rescuePlayer(dt) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  if (p.onHorse && p.onHorse.flies) return;
  if (!isSolidAt(p.x, p.y)) return;
  const safe = _findSafeSpot(p.x, p.y, 160);
  if (safe) { p.x = safe.x; p.y = safe.y; }
}

registerUpdate(rescuePlayer);
