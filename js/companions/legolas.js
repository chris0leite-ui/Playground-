// Legolas: ranged bow companion. Keeps distance, fires arrows.
function makeLegolas(x, y) {
  return {
    type: 'legolas', x, y, w: 14, h: 14,
    hp: 90, maxHp: 90, angle: 0,
    team: TEAM.PLAYER, friendly: true,
    attackTimer: 0, hurtFlash: 0,
    draw: drawLegolas,
    update: updateLegolas,
  };
}

function updateLegolas(dt, c) {
  if (c.attackTimer > 0) c.attackTimer -= dt;
  const target = nearestHostile(c, 260);
  if (target && c.attackTimer <= 0) {
    c.attackTimer = 0.6;
    const ang = Math.atan2(target.y - c.y, target.x - c.x);
    c.angle = ang;
    spawnProjectile(c, ang, { damage: 22, speed: 340, range: 320 });
  }
  followPlayer(c, dt, 70, 120);
}

function drawLegolas(ctx, c) {
  drawShadow(ctx, 9);
  ctx.fillStyle = '#3a5a3a';
  ctx.fillRect(-6, -5, 12, 11);
  ctx.fillStyle = '#f0e0a0';
  ctx.beginPath(); ctx.arc(0, -8, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d8c070';
  ctx.fillRect(-5, -11, 10, 2);
  // Bow
  ctx.save();
  ctx.rotate(c.angle);
  ctx.strokeStyle = '#8a6a2a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(8, 0, 6, -1, 1);
  ctx.stroke();
  ctx.restore();
  drawHpBar(ctx, c, 16);
}
