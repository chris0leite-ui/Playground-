// Uruk Captain: faster than a troll, summons minions at low HP.
function makeBossUruk(x, y) {
  return {
    type: 'bossUruk', isBoss: true,
    x, y, w: 20, h: 20,
    hp: 500, maxHp: 500, angle: 0,
    attackTimer: 0, hurtFlash: 0,
    team: TEAM.ORC,
    minionCD: 8, rallied: false,
    draw: drawBossUruk,
    update: updateBossUruk,
  };
}

function updateBossUruk(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  if (e.attackTimer > 0) e.attackTimer -= dt;
  if (e.minionCD > 0) e.minionCD -= dt;
  const d = distEnt(e, p);
  if (d > 480) return;
  const ang = Math.atan2(p.y - e.y, p.x - e.x);
  e.angle = ang;
  if (d > 30) {
    tryMove(e, Math.cos(ang) * 120 * dt, Math.sin(ang) * 120 * dt);
  } else if (e.attackTimer <= 0) {
    e.attackTimer = 0.6;
    damagePlayer(18);
  }
  // Rally: at 50% HP, summon orcs once.
  if (!e.rallied && e.hp < e.maxHp * 0.5) {
    e.rallied = true;
    for (let i = 0; i < 4; i++) {
      state.entities.push(makeOrc(e.x + Math.cos(i) * 40, e.y + Math.sin(i) * 40));
    }
    toast('The Captain rallies his pack!', 2);
  }
  // Periodic minion summon.
  if (e.minionCD <= 0 && d < 300) {
    e.minionCD = 12;
    state.entities.push(makeOrc(e.x + 20, e.y + 20));
  }
}

function drawBossUruk(ctx, e) {
  drawShadow(ctx, 14);
  tint(ctx, e);
  ctx.fillStyle = '#1a1a10';
  ctx.fillRect(-10, -9, 20, 18);
  ctx.fillStyle = '#5a4a2a';
  ctx.beginPath(); ctx.arc(0, -12, 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f0e8d0';
  ctx.fillRect(-3, -5, 6, 8); // white hand
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#c0c0c0';
  ctx.fillRect(6, -3, 22, 6);
  ctx.fillStyle = PALETTE.mordorRed;
  ctx.fillRect(22, -2, 6, 4);
  ctx.restore();
  ctx.globalAlpha = 1;
  if (e.hp < e.maxHp) {
    const pct = clamp(e.hp / e.maxHp, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(-20, -22, 42, 5);
    ctx.fillStyle = '#c13030';
    ctx.fillRect(-19, -21, 40 * pct, 3);
  }
}
