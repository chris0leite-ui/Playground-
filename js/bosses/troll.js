// Cave troll boss: slow, huge HP, telegraphed slam that hits in an arc.
function makeBossTroll(x, y) {
  return {
    type: 'bossTroll', isBoss: true,
    x, y, w: 36, h: 36,
    hp: 700, maxHp: 700, angle: 0,
    attackTimer: 0, hurtFlash: 0,
    team: TEAM.ORC,
    telegraph: 0, // > 0 while windup animates
    draw: drawBossTroll,
    update: updateBossTroll,
  };
}

function updateBossTroll(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  const d = distEnt(e, p);
  if (d > 520) return; // sleep when far
  if (e.attackTimer > 0) e.attackTimer -= dt;
  if (e.telegraph > 0) e.telegraph -= dt;

  const ang = Math.atan2(p.y - e.y, p.x - e.x);
  e.angle = ang;
  if (d > 44) {
    tryMove(e, Math.cos(ang) * 36 * dt, Math.sin(ang) * 36 * dt);
  } else if (e.attackTimer <= 0 && e.telegraph <= 0) {
    e.telegraph = 0.6;
    e.attackTimer = 2.2;
    // Resolve slam when telegraph ends.
    setTimeout(() => {
      if (e.hp <= 0) return;
      const d2 = distEnt(e, p);
      if (d2 < 60) damagePlayer(36);
      state.shake = 10;
    }, 560);
  }
}

function drawBossTroll(ctx, e) {
  drawShadow(ctx, 22);
  tint(ctx, e);
  ctx.fillStyle = '#4a4a3a';
  ctx.fillRect(-16, -14, 32, 28);
  ctx.fillStyle = '#7a7a6a';
  ctx.beginPath(); ctx.arc(0, -18, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c13030';
  ctx.fillRect(-5, -20, 2, 2);
  ctx.fillRect(3, -20, 2, 2);
  if (e.telegraph > 0) {
    ctx.save();
    ctx.rotate(e.angle);
    ctx.strokeStyle = 'rgba(255,60,60,0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 60, -0.6, 0.6); ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  // Boss hp bar wider
  if (e.hp < e.maxHp) {
    const pct = clamp(e.hp / e.maxHp, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-24, -30, 50, 5);
    ctx.fillStyle = pct > 0.3 ? '#c13030' : '#ff6060';
    ctx.fillRect(-23, -29, 48 * pct, 3);
  }
}
