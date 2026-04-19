// Enemy variety: uruk-hai, cave troll, Mirkwood spider, Haradrim archer.
// All four plug into the existing updateHostile loop; spider/haradrim add
// ranged kiting behaviour via spawnProjectile.

function makeUruk(x, y) {
  return makeActor({
    type: 'uruk', x, y, w: 16, h: 16,
    hp: 110, team: TEAM.ORC,
    speed: 88, aggroRange: 260, attackRange: 26, damage: 14,
    attackCooldown: 0.85,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
  });
}

function makeTroll(x, y) {
  return makeActor({
    type: 'troll', x, y, w: 26, h: 26,
    hp: 260, team: TEAM.ORC,
    speed: 48, aggroRange: 240, attackRange: 40, damage: 28,
    attackCooldown: 1.2,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
  });
}

function makeSpider(x, y) {
  return makeActor({
    type: 'spider', x, y, w: 16, h: 14,
    hp: 55, team: TEAM.ORC,
    speed: 125, aggroRange: 260, attackRange: 200, damage: 10,
    attackCooldown: 1.6,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
  });
}

function makeHaradrim(x, y) {
  return makeActor({
    type: 'haradrim', x, y, w: 14, h: 14,
    hp: 70, team: TEAM.ORC,
    speed: 70, aggroRange: 320, attackRange: 240, damage: 14,
    attackCooldown: 1.1,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
  });
}

// Ranged kiting update — shared by spider & haradrim.
function updateRanged(e, dt) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  if (e.attackTimer > 0) e.attackTimer -= dt;
  const d = distEnt(e, p);
  if (d < e.aggroRange) {
    const ang = Math.atan2(p.y - e.y, p.x - e.x);
    e.angle = ang;
    if (d < 90) {
      tryMove(e, -Math.cos(ang) * e.speed * dt, -Math.sin(ang) * e.speed * dt);
    } else if (d > e.attackRange) {
      tryMove(e, Math.cos(ang) * e.speed * dt, Math.sin(ang) * e.speed * dt);
    }
    if (e.attackTimer <= 0 && d <= e.attackRange && typeof spawnProjectile === 'function') {
      e.attackTimer = e.attackCooldown || 1.2;
      spawnProjectile(e, ang, { damage: e.damage, speed: 260, range: e.attackRange });
    }
  }
}

function _drawBody(ctx, e, body, head, eye) {
  drawShadow(ctx, Math.max(9, e.w / 2));
  tint(ctx, e);
  ctx.fillStyle = body;
  ctx.fillRect(-e.w / 2, -e.h / 2, e.w, e.h);
  ctx.fillStyle = head;
  ctx.beginPath(); ctx.arc(0, -e.h / 2 - 2, Math.max(4, e.h / 4), 0, Math.PI * 2); ctx.fill();
  if (eye) { ctx.fillStyle = eye; ctx.fillRect(-1, -e.h / 2 - 3, 2, 2); }
  ctx.globalAlpha = 1;
}

function drawUruk(ctx, e) {
  _drawBody(ctx, e, '#2a2a1a', '#4a3a2a', '#fff');
  ctx.fillStyle = PALETTE.gondorWhite; ctx.fillRect(-2, -3, 4, 5);
  ctx.save(); ctx.rotate(e.angle); ctx.fillStyle = '#b0b0b0'; ctx.fillRect(4, -2, 16, 4); ctx.restore();
  drawHpBar(ctx, e, 20);
}
function drawTroll(ctx, e) {
  _drawBody(ctx, e, '#5a5a4a', '#7a7a6a');
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(-3, -15, 2, 2); ctx.fillRect(1, -15, 2, 2);
  ctx.save(); ctx.rotate(e.angle); ctx.fillStyle = '#3a2a1a'; ctx.fillRect(8, -4, 18, 8); ctx.restore();
  drawHpBar(ctx, e, 28);
}
function drawSpider(ctx, e) {
  _drawBody(ctx, e, '#1a0a10', '#2a0a0a', '#e84060');
  ctx.strokeStyle = '#1a0a10'; ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const a = (i - 1.5) * 0.5;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(Math.PI - a) * 12, Math.sin(a) * 8); ctx.stroke();
  }
  drawHpBar(ctx, e, 18);
}
function drawHaradrim(ctx, e) {
  _drawBody(ctx, e, '#8a3a1a', '#d4a82a');
  ctx.save(); ctx.rotate(e.angle);
  ctx.strokeStyle = '#d4a82a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(6, 0, 6, -0.8, 0.8); ctx.stroke();
  ctx.restore();
  drawHpBar(ctx, e, 18);
}

registerEntityType('uruk',     { factory: makeUruk, update: (e, dt) => updateHostile(e, dt, false), draw: drawUruk });
registerEntityType('troll',    { factory: makeTroll, update: (e, dt) => updateHostile(e, dt, false), draw: drawTroll });
registerEntityType('spider',   { factory: makeSpider, update: updateRanged, draw: drawSpider });
registerEntityType('haradrim', { factory: makeHaradrim, update: updateRanged, draw: drawHaradrim });
