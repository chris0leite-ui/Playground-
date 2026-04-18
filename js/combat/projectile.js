// Projectiles for bows and enemy ranged attacks.
function spawnProjectile(owner, angle, stats) {
  const p = {
    type: 'projectile', noHp: true, alive: true,
    x: owner.x + Math.cos(angle) * 10,
    y: owner.y + Math.sin(angle) * 10,
    angle, w: 4, h: 4,
    speed: stats.speed || 300,
    range: stats.range || 300,
    damage: stats.damage || 20,
    team: owner.team,
    ownerIsPlayer: owner === state.player,
    morgul: !!stats.morgul,
    traveled: 0,
    draw: drawProjectile,
    update: updateProjectile,
  };
  state.entities.push(p);
}

function updateProjectile(dt, p) {
  const step = p.speed * dt;
  p.x += Math.cos(p.angle) * step;
  p.y += Math.sin(p.angle) * step;
  p.traveled += step;
  if (p.traveled > p.range) { p.alive = false; return; }
  if (isSolidAt(p.x, p.y)) { p.alive = false; return; }
  // Hit test.
  for (const e of state.entities) {
    if (e === p) continue;
    if (!('hp' in e) || e.hp <= 0) continue;
    if (p.ownerIsPlayer && e.friendly) continue;
    if (!p.ownerIsPlayer && e !== state.player) continue;
    if (p.ownerIsPlayer && e === state.player) continue;
    const dx = e.x - p.x, dy = e.y - p.y;
    if (dx * dx + dy * dy < (10 + e.w / 2) * (10 + e.w / 2)) {
      if (e === state.player) {
        damagePlayer(p.damage);
      } else {
        e.hp -= p.damage;
        e.hurtFlash = 0.15;
        if (e.hp <= 0) emit('enemyKilled', { entity: e, byPlayer: p.ownerIsPlayer });
      }
      p.alive = false;
      return;
    }
  }
}

function drawProjectile(ctx, p) {
  ctx.save();
  ctx.rotate(p.angle);
  ctx.fillStyle = p.morgul ? '#c0a0ff' : '#f0e0a0';
  ctx.fillRect(-6, -1, 12, 2);
  ctx.fillStyle = '#8a6a2a';
  ctx.fillRect(4, -2, 3, 4);
  ctx.restore();
}
