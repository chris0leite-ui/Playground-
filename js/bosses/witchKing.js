// Witch-King: Citadel boss. Teleport dashes + morgul spike ranged attack.
function makeBossWK(x, y) {
  return {
    type: 'bossWK', isBoss: true,
    x, y, w: 22, h: 22,
    hp: 900, maxHp: 900, angle: 0,
    attackTimer: 0, dashTimer: 0, hurtFlash: 0,
    team: TEAM.ORC,
    phase: 0,
    draw: drawBossWK,
    update: updateBossWK,
  };
}

function updateBossWK(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  if (e.attackTimer > 0) e.attackTimer -= dt;
  if (e.dashTimer > 0) e.dashTimer -= dt;
  const d = distEnt(e, p);
  if (d > 520) return;
  const ang = Math.atan2(p.y - e.y, p.x - e.x);
  e.angle = ang;
  // Phase 0: drift; Phase 1: dash; Phase 2: morgul spike.
  if (e.dashTimer <= 0 && d > 90 && d < 260) {
    e.dashTimer = 4;
    e.x = p.x + Math.cos(ang + Math.PI) * 50;
    e.y = p.y + Math.sin(ang + Math.PI) * 50;
    toast('The Witch-King vanishes!', 1);
  }
  if (d > 40) {
    tryMove(e, Math.cos(ang) * 95 * dt, Math.sin(ang) * 95 * dt);
  }
  if (e.attackTimer <= 0) {
    e.attackTimer = 1.3;
    if (d < 48) damagePlayer(26);
    else if (typeof spawnProjectile === 'function') {
      spawnProjectile(e, ang, { damage: 22, speed: 260, range: 400, ranged: true, morgul: true });
    }
  }
}

function drawBossWK(ctx, e) {
  drawShadow(ctx, 14);
  ctx.fillStyle = 'rgba(0,0,0,0.9)';
  ctx.fillRect(-11, -13, 22, 28);
  // Tattered robes
  ctx.fillStyle = 'rgba(30,20,30,0.9)';
  ctx.beginPath();
  ctx.moveTo(-11, 15); ctx.lineTo(-16, 22); ctx.lineTo(0, 18); ctx.lineTo(16, 22);
  ctx.lineTo(11, 15); ctx.closePath();
  ctx.fill();
  // Iron crown
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(-8, -15, 16, 4);
  for (let i = 0; i < 5; i++) ctx.fillRect(-8 + i * 4, -18, 2, 4);
  // Morgul glow
  ctx.fillStyle = 'rgba(200,180,255,0.5)';
  ctx.beginPath(); ctx.arc(0, -5, 6, 0, Math.PI * 2); ctx.fill();
  if (e.hp < e.maxHp) {
    const pct = clamp(e.hp / e.maxHp, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-22, -26, 44, 5);
    ctx.fillStyle = '#a060d0';
    ctx.fillRect(-21, -25, 42 * pct, 3);
  }
}
