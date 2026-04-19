// Mirkwood Spider: fast, low HP. Fires a "web" projectile that slows the
// player (sets p.webbed). Uses spawnProjectile with a special web type so
// projectile.js can read `web: true` and apply the slow instead of damage.
function makeSpider(x, y) {
  return {
    type: 'spider', x, y, vx: 0, vy: 0,
    w: 16, h: 14,
    hp: 55, maxHp: 55, angle: 0,
    attackTimer: 0, hurtFlash: 0,
    team: TEAM.ORC,
    speed: 120, aggroRange: 260,
    attackRange: 200, damage: 10,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
    draw: drawSpider,
    update: updateSpider,
  };
}

function updateSpider(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) { wander(e, dt); return; }
  if (e.attackTimer > 0) e.attackTimer -= dt;
  const d = distEnt(e, p);
  if (d < e.aggroRange) {
    const ang = Math.atan2(p.y - e.y, p.x - e.x);
    e.angle = ang;
    if (d > 90) {
      // Close the gap.
      tryMove(e, Math.cos(ang) * e.speed * dt, Math.sin(ang) * e.speed * dt);
    } else if (e.attackTimer <= 0) {
      e.attackTimer = 1.6;
      // Fire a web: zero damage, sets p.webbed on hit.
      spawnProjectile(e, ang, {
        damage: 0, speed: 220, range: 240, web: true,
      });
    }
  } else {
    wander(e, dt);
  }
}

function drawSpider(ctx, e) {
  drawShadow(ctx, 10);
  tint(ctx, e);
  ctx.save();
  ctx.rotate(e.angle);
  // Body
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2a3a';
  ctx.beginPath();
  ctx.arc(5, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  // Red eyes cluster
  ctx.fillStyle = '#c13030';
  ctx.fillRect(7, -2, 2, 2);
  ctx.fillRect(7, 0, 2, 2);
  // 4 pairs of legs
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.5;
  for (let i = -2; i <= 2; i++) {
    if (i === 0) continue;
    const len = 10;
    ctx.beginPath();
    ctx.moveTo(0, i); ctx.lineTo(-len, i * 2.2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i); ctx.lineTo(len, i * 2.2); ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  drawHpBar(ctx, e, 18);
}
