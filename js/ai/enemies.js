// Extra enemy factories (Uruk-hai, Cave Troll). They use the existing
// updateHostile() loop for basic chase/attack.
function makeUruk(x, y) {
  return {
    type: 'uruk', x, y, vx: 0, vy: 0,
    w: 16, h: 16,
    hp: 110, maxHp: 110, angle: 0,
    attackTimer: 0, hurtFlash: 0,
    team: TEAM.ORC,
    speed: 88, aggroRange: 260,
    attackRange: 26, damage: 14,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
    draw: drawUruk,
    update: (dt, e) => updateHostile(e, dt, false),
  };
}

function makeTroll(x, y) {
  return {
    type: 'troll', x, y, vx: 0, vy: 0,
    w: 26, h: 26,
    hp: 260, maxHp: 260, angle: 0,
    attackTimer: 0, hurtFlash: 0,
    team: TEAM.ORC,
    speed: 48, aggroRange: 240,
    attackRange: 40, damage: 28,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
    draw: drawTroll,
    update: (dt, e) => updateHostile(e, dt, false),
  };
}

function drawUruk(ctx, e) {
  drawShadow(ctx, 10);
  tint(ctx, e);
  ctx.fillStyle = '#2a2a1a';
  ctx.fillRect(-7, -6, 14, 13);
  ctx.fillStyle = '#4a3a2a';
  ctx.beginPath();
  ctx.arc(0, -8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(-2, -9, 4, 1);
  // White hand rune on chest
  ctx.fillStyle = '#f0e8d0';
  ctx.fillRect(-2, -3, 4, 5);
  // Big blade
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#b0b0b0';
  ctx.fillRect(4, -2, 16, 4);
  ctx.restore();
  ctx.globalAlpha = 1;
  drawHpBar(ctx, e, 18);
}

function drawTroll(ctx, e) {
  drawShadow(ctx, 16);
  tint(ctx, e);
  ctx.fillStyle = '#5a5a4a';
  ctx.fillRect(-12, -10, 24, 22);
  ctx.fillStyle = '#7a7a6a';
  ctx.beginPath();
  ctx.arc(0, -14, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-3, -15, 2, 2);
  ctx.fillRect(1, -15, 2, 2);
  // Club
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(8, -4, 18, 8);
  ctx.restore();
  ctx.globalAlpha = 1;
  drawHpBar(ctx, e, 26);
}
