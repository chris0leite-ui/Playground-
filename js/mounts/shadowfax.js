// Shadowfax: rare silver-white horse, faster than any steed of Rohan.
function makeShadowfax(x, y) {
  return {
    type: 'shadowfax', x, y, w: 22, h: 14,
    hp: 160, maxHp: 160, angle: rand(0, Math.PI * 2),
    team: TEAM.NEUTRAL, rider: null,
    wanderTimer: rand(0, 3), wanderAngle: rand(0, Math.PI * 2),
    speed: 360,
    draw: drawShadowfax,
    update: updateShadowfax,
  };
}

function updateShadowfax(dt, e) {
  if (e.rider) return;
  e.wanderTimer -= dt;
  if (e.wanderTimer <= 0) {
    e.wanderTimer = rand(2, 5);
    e.wanderAngle = rand(0, Math.PI * 2);
    if (Math.random() < 0.3) e.wanderAngle = null;
  }
  if (e.wanderAngle == null) return;
  const sp = 60;
  tryMove(e, Math.cos(e.wanderAngle) * sp * dt, Math.sin(e.wanderAngle) * sp * dt);
  e.angle = e.wanderAngle;
}

function drawShadowfax(ctx, e) {
  drawShadow(ctx, 12);
  ctx.save();
  ctx.rotate(e.angle);
  // Silver-white body
  ctx.fillStyle = '#f0efe8';
  ctx.fillRect(-11, -5, 22, 10);
  ctx.fillStyle = '#d8d4c8';
  ctx.fillRect(-11, -5, 3, 10);
  ctx.fillRect(8, -4, 3, 8);
  // Head
  ctx.fillStyle = '#f0efe8';
  ctx.fillRect(9, -3, 5, 6);
  // Faint glow/mane highlight
  ctx.fillStyle = 'rgba(255,255,220,0.4)';
  ctx.fillRect(-12, -7, 24, 2);
  // Legs
  ctx.fillStyle = '#b8b4a8';
  ctx.fillRect(-8, 4, 2, 3);
  ctx.fillRect(-3, 4, 2, 3);
  ctx.fillRect(2, 4, 2, 3);
  ctx.fillRect(6, 4, 2, 3);
  ctx.restore();
  if (e.rider) {
    ctx.fillStyle = '#7a7a7a';
    ctx.fillRect(-4, -10, 8, 8);
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath(); ctx.arc(0, -12, 3, 0, Math.PI * 2); ctx.fill();
  }
  if (!e.rider) drawHpBar(ctx, e, 20);
}
