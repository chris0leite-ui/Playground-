function drawProjectile(ctx, e) {
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.fillRect(-5, -1, 10, 2);
  ctx.restore();
}

function updateProjectile(e, dt) {
  e.x += e.vx * dt;
  e.y += e.vy * dt;
  e.ttl -= dt;
  if (e.ttl <= 0) { e.hp = 0; return; }
  if (isSolidAt(e.x, e.y)) { e.hp = 0; return; }
  for (const other of state.entities) {
    if (other === e || other === e.owner) continue;
    if (other.type === 'pickup' || other.type === 'projectile') continue;
    if (!('hp' in other) || other.hp <= 0) continue;
    const r = (other.w || 14) / 2 + 3;
    if (dist(e.x, e.y, other.x, other.y) < r) {
      other.hp -= e.damage;
      other.hurtFlash = 0.15;
      if (other.hp <= 0 && e.owner === state.player) onEnemyKilled(other);
      e.hp = 0;
      return;
    }
  }
}

registerEntityType('projectile', {
  update: updateProjectile,
  draw: drawProjectile,
});
