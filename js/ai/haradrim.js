// Haradrim Archer: desert warrior. Keeps at range, fires arrows.
function makeHaradrim(x, y) {
  return {
    type: 'haradrim', x, y, vx: 0, vy: 0,
    w: 14, h: 14,
    hp: 70, maxHp: 70, angle: 0,
    attackTimer: 0, hurtFlash: 0,
    team: TEAM.ORC,
    speed: 70, aggroRange: 320,
    attackRange: 240, damage: 14,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
    draw: drawHaradrim,
    update: updateHaradrim,
  };
}

function updateHaradrim(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) { wander(e, dt); return; }
  if (e.attackTimer > 0) e.attackTimer -= dt;
  const d = distEnt(e, p);
  if (d < e.aggroRange) {
    const ang = Math.atan2(p.y - e.y, p.x - e.x);
    e.angle = ang;
    // Kite: move away if too close, hold position at ideal range.
    if (d < 90) {
      tryMove(e, -Math.cos(ang) * e.speed * dt, -Math.sin(ang) * e.speed * dt);
    } else if (d > e.attackRange) {
      tryMove(e, Math.cos(ang) * e.speed * dt, Math.sin(ang) * e.speed * dt);
    }
    if (e.attackTimer <= 0 && d < e.attackRange) {
      e.attackTimer = 1.2;
      spawnProjectile(e, ang, { damage: 14, speed: 300, range: 280 });
    }
  } else {
    wander(e, dt);
  }
}

function drawHaradrim(ctx, e) {
  drawShadow(ctx, 9);
  tint(ctx, e);
  // Red/black desert robe
  ctx.fillStyle = '#8a2a20';
  ctx.fillRect(-6, -5, 12, 11);
  ctx.fillStyle = '#2a1a10';
  ctx.fillRect(-5, -4, 10, 3);
  // Turbaned head
  ctx.fillStyle = '#c8a080';
  ctx.beginPath(); ctx.arc(0, -7, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(-5, -10, 10, 3);
  // Bow
  ctx.save();
  ctx.rotate(e.angle);
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(8, 0, 6, -1, 1);
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
  drawHpBar(ctx, e, 16);
}
