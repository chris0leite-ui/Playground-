// Warg: fast beast with fear aura. Can be stolen from orc captains.
function makeWarg(x, y) {
  return {
    type: 'warg', x, y, w: 22, h: 14,
    hp: 110, maxHp: 110, angle: 0,
    team: TEAM.NEUTRAL, rider: null,
    wanderTimer: rand(0, 3), wanderAngle: rand(0, Math.PI * 2),
    speed: 260, fearAura: 80,
    draw: drawWarg,
    update: updateWarg,
  };
}

function updateWarg(dt, w) {
  if (w.rider) return;
  w.wanderTimer -= dt;
  if (w.wanderTimer <= 0) {
    w.wanderTimer = rand(2, 5);
    w.wanderAngle = rand(0, Math.PI * 2);
  }
  const sp = 40;
  tryMove(w, Math.cos(w.wanderAngle) * sp * dt, Math.sin(w.wanderAngle) * sp * dt);
  w.angle = w.wanderAngle;
  // Fear aura: nearby guards wander away.
  for (const e of state.entities) {
    if (e.type !== 'guard' || e.hp <= 0) continue;
    if (distEnt(e, w) < w.fearAura) {
      e.wanderAngle = Math.atan2(e.y - w.y, e.x - w.x);
      e.wanderTimer = 1.5;
    }
  }
}

function drawWarg(ctx, w) {
  drawShadow(ctx, 12);
  ctx.save();
  ctx.rotate(w.angle);
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(-11, -5, 22, 10);
  ctx.fillStyle = '#5a3a2a';
  ctx.fillRect(-11, -5, 4, 10);
  ctx.fillStyle = '#2a1a1a';
  ctx.fillRect(9, -3, 5, 6);
  // Red eyes
  ctx.fillStyle = '#c13030';
  ctx.fillRect(11, -2, 2, 2);
  ctx.fillRect(11, 0, 2, 2);
  // Legs
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-7, 4, 2, 3);
  ctx.fillRect(5, 4, 2, 3);
  ctx.restore();
  if (!w.rider) drawHpBar(ctx, w, 20);
}
