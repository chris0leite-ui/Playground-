// Great Eagle mount: ignores terrain. Summonable at Renown cost.
function makeEagle(x, y) {
  return {
    type: 'eagle', x, y, w: 24, h: 20,
    hp: 140, maxHp: 140, angle: 0,
    team: TEAM.NEUTRAL, rider: null,
    wanderTimer: rand(0, 3), wanderAngle: rand(0, Math.PI * 2),
    flies: true, speed: 280,
    draw: drawEagle,
    update: updateEagle,
  };
}

function updateEagle(dt, e) {
  if (e.rider) return;
  e.wanderTimer -= dt;
  if (e.wanderTimer <= 0) {
    e.wanderTimer = rand(3, 6);
    e.wanderAngle = rand(0, Math.PI * 2);
  }
  // Eagles glide above terrain; skip collision.
  e.x += Math.cos(e.wanderAngle) * 40 * dt;
  e.y += Math.sin(e.wanderAngle) * 40 * dt;
  e.x = clamp(e.x, 20, MAP.W * TILE - 20);
  e.y = clamp(e.y, 20, MAP.H * TILE - 20);
  e.angle = e.wanderAngle;
}

function drawEagle(ctx, e) {
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 14, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#7a5a3a';
  ctx.fillRect(-6, -6, 12, 12);
  // Wings
  const flap = Math.sin(state.time * 8) * 3;
  ctx.fillStyle = '#5a3a1a';
  ctx.beginPath();
  ctx.moveTo(-6, 0); ctx.lineTo(-22, -8 + flap); ctx.lineTo(-22, 8 - flap);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, 0); ctx.lineTo(22, -8 + flap); ctx.lineTo(22, 8 - flap);
  ctx.closePath(); ctx.fill();
  // Head
  ctx.fillStyle = '#d0a060';
  ctx.fillRect(6, -3, 5, 6);
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.fillRect(10, -1, 3, 2);
  ctx.restore();
  if (e.rider) {
    const p = e.rider;
    ctx.fillStyle = '#3a4a5a';
    ctx.fillRect(-4, -10, 8, 8);
    ctx.fillStyle = '#e0c8a0';
    ctx.beginPath(); ctx.arc(0, -12, 3, 0, Math.PI * 2); ctx.fill();
  }
  if (!e.rider) drawHpBar(ctx, e, 20);
}
