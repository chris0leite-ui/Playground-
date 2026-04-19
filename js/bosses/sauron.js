// Sauron the Deceiver — final boss standing at the foot of Barad-dûr.
// Enormous HP, three attack patterns, summons Nazgûl reinforcements, and
// a punishing melee. Defeat = instant Victory.
function makeBossSauron(x, y) {
  return {
    type: 'bossSauron', isBoss: true,
    x, y, w: 44, h: 54,
    hp: 3500, maxHp: 3500, angle: 0,
    attackTimer: 0, castTimer: 4, summonTimer: 10, teleportTimer: 6,
    hurtFlash: 0,
    team: TEAM.ORC,
    draw: drawBossSauron,
    update: updateBossSauron,
  };
}

function updateBossSauron(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  if (e.attackTimer > 0) e.attackTimer -= dt;
  if (e.castTimer > 0) e.castTimer -= dt;
  if (e.summonTimer > 0) e.summonTimer -= dt;
  if (e.teleportTimer > 0) e.teleportTimer -= dt;
  const d = distEnt(e, p);
  if (d > 700) return; // sleeps when far

  const ang = Math.atan2(p.y - e.y, p.x - e.x);
  e.angle = ang;

  // Close the gap slowly but relentlessly.
  if (d > 60) {
    tryMove(e, Math.cos(ang) * 55 * dt, Math.sin(ang) * 55 * dt);
  }

  // 1. Melee shockwave — huge hit when adjacent.
  if (d < 72 && e.attackTimer <= 0) {
    e.attackTimer = 1.6;
    damagePlayer(60);
    state.shake = 14;
  }

  // 2. Shadow bolt salvo — three fireballs in a tight fan.
  if (e.castTimer <= 0 && d > 80) {
    e.castTimer = 2.4;
    if (typeof spawnProjectile === 'function') {
      for (const off of [-0.18, 0, 0.18]) {
        spawnProjectile(e, ang + off, { damage: 45, speed: 300, range: 520, morgul: true });
      }
    }
  }

  // 3. Summon a Nazgûl every 12 seconds — reinforcements from the sky.
  if (e.summonTimer <= 0) {
    e.summonTimer = 12;
    if (typeof spawnNazgul === 'function') spawnNazgul(true);
    toast('Sauron calls the Nine!', 2.5);
  }

  // 4. Teleport away when player is right on top, to avoid a simple
  // damage-stack cheese.
  if (e.teleportTimer <= 0 && d < 36) {
    e.teleportTimer = 7;
    const back = ang + Math.PI;
    const step = 140;
    const nx = e.x + Math.cos(back) * step;
    const ny = e.y + Math.sin(back) * step;
    e.x = clamp(nx, 20, MAP.W * TILE - 20);
    e.y = clamp(ny, 20, MAP.H * TILE - 20);
    state.shake = 10;
  }
}

function drawBossSauron(ctx, e) {
  // Molten-eye glow radiating outward.
  const flick = 0.7 + Math.sin(state.time * 10) * 0.3;
  ctx.save();
  ctx.globalAlpha = 0.45 * flick;
  ctx.fillStyle = '#ff5020';
  ctx.beginPath();
  ctx.arc(0, -8, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawShadow(ctx, 26);
  tint(ctx, e);

  // Armoured pillar body.
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(-18, -24, 36, 52);
  // Jagged shoulder pauldrons.
  ctx.fillStyle = '#2a2a2a';
  ctx.beginPath();
  ctx.moveTo(-18, -18); ctx.lineTo(-28, -26); ctx.lineTo(-18, -6); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(18, -18); ctx.lineTo(28, -26); ctx.lineTo(18, -6); ctx.closePath(); ctx.fill();
  // Breastplate rune — the Eye.
  ctx.fillStyle = '#6a0000';
  ctx.beginPath();
  ctx.ellipse(0, -2, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffb020';
  ctx.fillRect(-2, -3, 4, 2);

  // Crowned helm with a single flaming slit.
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(-12, -34, 24, 14);
  // Spikes.
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 5, -34); ctx.lineTo(i * 5 - 2, -42); ctx.lineTo(i * 5 + 2, -42);
    ctx.closePath(); ctx.fill();
  }
  // Slit.
  ctx.fillStyle = '#ffe060';
  ctx.fillRect(-8, -26, 16, 2);
  // Mace in hand.
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(16, -2, 20, 4);
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(32, -8, 10, 16);
  ctx.fillStyle = '#ff4020';
  ctx.fillRect(34, -4, 6, 8);
  ctx.restore();

  ctx.globalAlpha = 1;
  // Giant boss HP bar — double the usual width.
  if (e.hp < e.maxHp) {
    const pct = clamp(e.hp / e.maxHp, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(-40, -46, 82, 7);
    ctx.fillStyle = '#c13030';
    ctx.fillRect(-39, -45, 80 * pct, 5);
    ctx.font = 'bold 9px Georgia';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd060';
    ctx.fillText('SAURON', 0, -50);
  }
}
