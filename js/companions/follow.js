// Shared follow behavior. Keeps the companion within range of the player and
// returns a convenient nearest-hostile lookup.
function followPlayer(c, dt, desiredDist, speed) {
  const p = state.player;
  if (!p) return;
  const d = distEnt(c, p);
  if (d > desiredDist) {
    const ang = Math.atan2(p.y - c.y, p.x - c.x);
    tryMove(c, Math.cos(ang) * speed * dt, Math.sin(ang) * speed * dt);
    c.angle = ang;
  }
}

function nearestHostile(c, maxDist) {
  let best = null, bd = maxDist;
  for (const e of state.entities) {
    if (e === c || e.friendly) continue;
    if (e.type !== 'orc' && e.type !== 'uruk' && e.type !== 'troll'
        && e.type !== 'guard' && !e.isBoss) continue;
    if (e.hp == null || e.hp <= 0) continue;
    const d = distEnt(c, e);
    if (d < bd) { bd = d; best = e; }
  }
  return best;
}
