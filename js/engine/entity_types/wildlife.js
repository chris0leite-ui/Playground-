// Ambient wildlife: skittish deer and sometimes-grumpy boars. Shared
// wander loop lives in ai.js; flee / charge behaviour overrides here.

function makeDeer(x, y) {
  return makeActor({
    type: 'deer', x, y, w: 14, h: 12,
    hp: 20, team: TEAM.NEUTRAL,
    speed: 160, aggroRange: 180,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
  });
}

function makeBoar(x, y) {
  return makeActor({
    type: 'boar', x, y, w: 16, h: 14,
    hp: 40, team: TEAM.NEUTRAL,
    speed: 90, aggroRange: 100,
    attackRange: 22, damage: 8, attackCooldown: 1.2,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
  });
}

function updateDeer(e, dt) {
  const p = state.player;
  e.wanderTimer -= dt;
  if (p && p.hp > 0) {
    const d = distEnt(e, p);
    if (d < e.aggroRange) {
      const ang = Math.atan2(e.y - p.y, e.x - p.x);
      tryMove(e, Math.cos(ang) * e.speed * dt, Math.sin(ang) * e.speed * dt);
      e.angle = ang;
      return;
    }
  }
  if (e.wanderTimer <= 0) {
    e.wanderTimer = rand(2, 5);
    e.wanderAngle = rand(0, Math.PI * 2);
  }
  const sp = 35;
  tryMove(e, Math.cos(e.wanderAngle) * sp * dt, Math.sin(e.wanderAngle) * sp * dt);
  e.angle = e.wanderAngle;
}

function updateBoar(e, dt) {
  const p = state.player;
  if (e.attackTimer > 0) e.attackTimer -= dt;
  if (p && p.hp > 0) {
    const d = distEnt(e, p);
    if (d < e.aggroRange) {
      const ang = Math.atan2(p.y - e.y, p.x - e.x);
      tryMove(e, Math.cos(ang) * e.speed * dt, Math.sin(ang) * e.speed * dt);
      e.angle = ang;
      if (d <= e.attackRange && e.attackTimer <= 0) {
        e.attackTimer = e.attackCooldown;
        if (typeof damagePlayer === 'function') damagePlayer(e.damage);
      }
      return;
    }
  }
  e.wanderTimer -= dt;
  if (e.wanderTimer <= 0) {
    e.wanderTimer = rand(2, 5);
    e.wanderAngle = rand(0, Math.PI * 2);
  }
  const sp = 25;
  tryMove(e, Math.cos(e.wanderAngle) * sp * dt, Math.sin(e.wanderAngle) * sp * dt);
  e.angle = e.wanderAngle;
}

function drawDeer(ctx, e) {
  drawShadow(ctx, 8);
  tint(ctx, e);
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#a08060';
  ctx.fillRect(-7, -4, 14, 8);
  ctx.fillStyle = '#f0e0c8';
  ctx.fillRect(-6, -3, 2, 2);
  ctx.fillStyle = '#604020';
  ctx.fillRect(4, -2, 3, 4);
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawBoar(ctx, e) {
  drawShadow(ctx, 9);
  tint(ctx, e);
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#4a3a2a';
  ctx.fillRect(-8, -5, 16, 10);
  ctx.fillStyle = '#2a1a10';
  ctx.fillRect(-8, -5, 3, 10);
  ctx.fillStyle = '#e0e0d0';
  ctx.fillRect(7, -1, 2, 1);
  ctx.fillRect(7, 0, 2, 1);
  ctx.restore();
  ctx.globalAlpha = 1;
  drawHpBar(ctx, e, 16);
}

registerEntityType('deer', { factory: makeDeer, update: updateDeer, draw: drawDeer });
registerEntityType('boar', { factory: makeBoar, update: updateBoar, draw: drawBoar });
