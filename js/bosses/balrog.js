// The Balrog of Moria. Slow, enormous HP pool, flame-whip melee + a
// long-range fireball cast. Only spawns inside the Moria dungeon.
function makeBossBalrog(x, y) {
  return {
    type: 'bossBalrog', isBoss: true,
    x, y, w: 40, h: 40,
    hp: 1200, maxHp: 1200, angle: 0,
    attackTimer: 0, castTimer: 4, hurtFlash: 0,
    team: TEAM.ORC,
    draw: drawBossBalrog,
    update: updateBossBalrog,
  };
}

function updateBossBalrog(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  if (e.attackTimer > 0) e.attackTimer -= dt;
  if (e.castTimer > 0) e.castTimer -= dt;
  const d = distEnt(e, p);
  if (d > 600) return;
  const ang = Math.atan2(p.y - e.y, p.x - e.x);
  e.angle = ang;
  if (d > 50) {
    tryMove(e, Math.cos(ang) * 60 * dt, Math.sin(ang) * 60 * dt);
  }
  // Flame whip — close-range heavy hit.
  if (d < 58 && e.attackTimer <= 0) {
    e.attackTimer = 1.4;
    damagePlayer(40);
    state.shake = 10;
  }
  // Fireball cast — long range.
  if (e.castTimer <= 0) {
    e.castTimer = 3.5;
    if (typeof spawnProjectile === 'function') {
      spawnProjectile(e, ang, { damage: 32, speed: 260, range: 380, morgul: true });
    }
  }
}

function drawBossBalrog(ctx, e) {
  // Flickering orange glow.
  const flick = 0.8 + Math.sin(state.time * 15) * 0.2;
  ctx.save();
  ctx.globalAlpha = 0.5 * flick;
  ctx.fillStyle = PALETTE.balrogGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawShadow(ctx, 22);
  tint(ctx, e);
  // Charred hulking body.
  ctx.fillStyle = PALETTE.balrog;
  ctx.fillRect(-18, -18, 36, 36);
  // Fiery cracks in the body.
  ctx.fillStyle = PALETTE.balrogFire;
  ctx.fillRect(-16, -10, 4, 22);
  ctx.fillRect(-4, -16, 3, 32);
  ctx.fillRect(10, -8, 4, 18);
  // Horns + head.
  ctx.fillStyle = '#2a1008';
  ctx.fillRect(-10, -22, 6, 6);
  ctx.fillRect(4, -22, 6, 6);
  ctx.beginPath();
  ctx.moveTo(-10, -22); ctx.lineTo(-14, -30); ctx.lineTo(-6, -22); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, -22); ctx.lineTo(10, -30); ctx.lineTo(10, -22); ctx.fill();
  // Eyes.
  ctx.fillStyle = '#ffd060';
  ctx.fillRect(-6, -14, 3, 3);
  ctx.fillRect(3, -14, 3, 3);
  // Flame whip trailing behind.
  ctx.save();
  ctx.rotate(e.angle + Math.PI);
  ctx.strokeStyle = PALETTE.balrogFire;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(20, 10 * Math.sin(state.time * 6), 40, 4 * Math.sin(state.time * 4));
  ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
  // Boss HP bar.
  if (e.hp < e.maxHp) {
    const pct = clamp(e.hp / e.maxHp, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-30, -34, 62, 6);
    ctx.fillStyle = '#c13030';
    ctx.fillRect(-29, -33, 60 * pct, 4);
  }
}
