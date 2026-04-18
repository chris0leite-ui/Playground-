// When a beacon is lit, spawn allied Rohirrim riders that charge orcs/guards
// hostile to the player.
function makeRohir(x, y) {
  return {
    type: 'rohir', x, y, w: 18, h: 12,
    hp: 120, maxHp: 120, angle: 0,
    team: TEAM.PLAYER, friendly: true,
    speed: 180,
    damage: 20,
    attackRange: 26, attackTimer: 0, attackCooldown: 0.7,
    ttl: 45,
    draw: drawRohir,
    update: updateRohir,
  };
}

function updateRohir(dt, r) {
  r.ttl -= dt;
  if (r.ttl <= 0) { r.alive = false; return; }
  if (r.attackTimer > 0) r.attackTimer -= dt;

  // Find nearest hostile target.
  let best = null, bd = 400;
  for (const e of state.entities) {
    if (e === r || e.friendly) continue;
    if (e.type !== 'orc' && e.type !== 'guard' && e.type !== 'uruk' && e.type !== 'troll') continue;
    if (e.hp <= 0) continue;
    const d = distEnt(r, e);
    if (d < bd) { bd = d; best = e; }
  }
  if (!best) {
    // Drift toward player.
    const p = state.player;
    const ang = Math.atan2(p.y - r.y, p.x - r.x);
    tryMove(r, Math.cos(ang) * 60 * dt, Math.sin(ang) * 60 * dt);
    r.angle = ang;
    return;
  }
  const ang = Math.atan2(best.y - r.y, best.x - r.x);
  r.angle = ang;
  if (bd > r.attackRange - 2) {
    tryMove(r, Math.cos(ang) * r.speed * dt, Math.sin(ang) * r.speed * dt);
  } else if (r.attackTimer <= 0) {
    r.attackTimer = r.attackCooldown;
    best.hp -= r.damage;
    best.hurtFlash = 0.15;
    if (best.hp <= 0) emit('enemyKilled', { entity: best, byPlayer: false });
  }
}

function drawRohir(ctx, r) {
  drawShadow(ctx, 12);
  ctx.save();
  ctx.rotate(r.angle);
  // Horse body
  ctx.fillStyle = '#8a6a3a';
  ctx.fillRect(-10, -5, 20, 10);
  ctx.fillStyle = PALETTE.horseMane;
  ctx.fillRect(-10, -5, 3, 10);
  // Rider
  ctx.fillStyle = '#3a5a3a';
  ctx.fillRect(-3, -9, 6, 6);
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.fillRect(-2, -11, 4, 2);
  // Spear
  ctx.strokeStyle = '#5a4a3a';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(2, -6); ctx.lineTo(22, -8); ctx.stroke();
  ctx.restore();
  drawHpBar(ctx, r, 18);
}

function summonRohirrim() {
  // Spawn 5 riders from the east edge.
  const baseX = (MAP.W - 4) * TILE;
  const baseY = state.player ? state.player.y : (MAP.H / 2) * TILE;
  for (let i = 0; i < 5; i++) {
    state.entities.push(makeRohir(baseX, baseY + (i - 2) * 24));
  }
  toast('The Rohirrim have come!', 3);
}
on('beaconLit', summonRohirrim);
