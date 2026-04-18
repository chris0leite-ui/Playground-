// Doors: entities that block passage until kicked. Kicking is just attacking.
function makeDoor(x, y) {
  return {
    type: 'door', x, y, w: 22, h: 6,
    hp: 40, maxHp: 40, angle: 0,
    team: TEAM.NEUTRAL, solid: true,
    draw: drawDoor,
    update: updateDoor,
  };
}

function updateDoor(dt, d) {
  if (d.hp <= 0) {
    d.solid = false; d.broken = true;
    d.hp = 1; d.noHp = true; // keep the broken frame on the map
    return;
  }
  // Solid doors push entities that try to walk through.
  if (!d.solid) return;
  // Simple AABB push-back for non-player entities that overlap.
  for (const e of state.entities) {
    if (e === d || !('w' in e)) continue;
    if (e.type === 'projectile' || e.type === 'pickup') continue;
    if (rectsOverlap(d.x - d.w/2, d.y - d.h/2, d.w, d.h, e.x - e.w/2, e.y - e.h/2, e.w, e.h)) {
      const dx = e.x - d.x;
      const dy = e.y - d.y;
      if (Math.abs(dx) > Math.abs(dy)) e.x += dx > 0 ? 2 : -2;
      else e.y += dy > 0 ? 2 : -2;
    }
  }
}

function drawDoor(ctx, d) {
  if (d.broken) {
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(-d.w/2, -d.h/2, 4, d.h);
    ctx.fillRect(d.w/2 - 4, -d.h/2, 4, d.h);
    return;
  }
  ctx.fillStyle = '#5a3a2a';
  ctx.fillRect(-d.w/2, -d.h/2, d.w, d.h);
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.fillRect(-2, -d.h/2 + 1, 4, d.h - 2);
  if (d.hp < d.maxHp) drawHpBar(ctx, d, d.w);
}

function spawnDoors() {
  // Place a door at the four cardinal gate positions in the outer wall.
  const cx = (MAP.W - 1) / 2, cy = (MAP.H - 1) / 2;
  const R = 18 * TILE;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  for (const [dx, dy] of dirs) {
    const x = cx * TILE + dx * R;
    const y = cy * TILE + dy * R;
    state.entities.push(makeDoor(x, y));
  }
}
