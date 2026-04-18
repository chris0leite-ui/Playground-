// Gimli: tanky melee. Rushes the nearest hostile and cleaves.
function makeGimli(x, y) {
  return {
    type: 'gimli', x, y, w: 16, h: 16,
    hp: 180, maxHp: 180, angle: 0,
    team: TEAM.PLAYER, friendly: true,
    attackTimer: 0, hurtFlash: 0,
    draw: drawGimli,
    update: updateGimli,
  };
}

function updateGimli(dt, c) {
  if (c.attackTimer > 0) c.attackTimer -= dt;
  const target = nearestHostile(c, 300);
  if (!target) { followPlayer(c, dt, 70, 110); return; }
  const d = distEnt(c, target);
  const ang = Math.atan2(target.y - c.y, target.x - c.x);
  c.angle = ang;
  if (d > 28) {
    tryMove(c, Math.cos(ang) * 130 * dt, Math.sin(ang) * 130 * dt);
  } else if (c.attackTimer <= 0) {
    c.attackTimer = 0.5;
    target.hp -= 26;
    target.hurtFlash = 0.15;
    if (target.hp <= 0) emit('enemyKilled', { entity: target, byPlayer: false });
  }
}

function drawGimli(ctx, c) {
  drawShadow(ctx, 10);
  ctx.fillStyle = '#5a4a3a';
  ctx.fillRect(-7, -4, 14, 12);
  // Red beard
  ctx.fillStyle = '#8a3a1a';
  ctx.fillRect(-5, -1, 10, 6);
  ctx.fillStyle = '#e0c8a0';
  ctx.beginPath(); ctx.arc(0, -6, 4, 0, Math.PI * 2); ctx.fill();
  // Helm
  ctx.fillStyle = '#6a6a6a';
  ctx.fillRect(-4, -10, 8, 3);
  // Axe
  ctx.save();
  ctx.rotate(c.angle);
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(4, -1, 12, 2);
  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(12, -5, 6, 10);
  ctx.restore();
  drawHpBar(ctx, c, 16);
}
