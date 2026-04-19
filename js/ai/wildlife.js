// Ambient wildlife: deer flee from the player and drop lembas; boars charge
// if you get close and drop gold. Neither contributes to wanted level, but
// both give small XP on kill.
function makeDeer(x, y) {
  return {
    type: 'deer', x, y,
    w: 14, h: 12,
    hp: 20, maxHp: 20, angle: 0,
    team: TEAM.NEUTRAL, friendly: false,
    speed: 150,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
    draw: drawDeer,
    update: updateDeer,
  };
}

function makeBoar(x, y) {
  return {
    type: 'boar', x, y,
    w: 18, h: 14,
    hp: 45, maxHp: 45, angle: 0,
    attackTimer: 0,
    team: TEAM.ORC, // hostile-ish so player attacks work normally
    speed: 110,
    attackRange: 22, damage: 12,
    wanderTimer: rand(0, 2), wanderAngle: rand(0, Math.PI * 2),
    draw: drawBoar,
    update: updateBoar,
  };
}

function updateDeer(dt, e) {
  const p = state.player;
  if (!p) return;
  const d = distEnt(e, p);
  if (d < 180) {
    // Flee directly away.
    const ang = Math.atan2(e.y - p.y, e.x - p.x);
    e.angle = ang;
    tryMove(e, Math.cos(ang) * e.speed * dt, Math.sin(ang) * e.speed * dt);
  } else {
    wander(e, dt);
  }
}

function updateBoar(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) { wander(e, dt); return; }
  if (e.attackTimer > 0) e.attackTimer -= dt;
  const d = distEnt(e, p);
  if (d < 160) {
    const ang = Math.atan2(p.y - e.y, p.x - e.x);
    e.angle = ang;
    if (d > e.attackRange) {
      tryMove(e, Math.cos(ang) * e.speed * dt, Math.sin(ang) * e.speed * dt);
    } else if (e.attackTimer <= 0) {
      e.attackTimer = 1.0;
      damagePlayer(e.damage);
    }
  } else {
    wander(e, dt);
  }
}

function drawDeer(ctx, e) {
  drawShadow(ctx, 10);
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#b08060';
  ctx.fillRect(-8, -4, 16, 8);
  ctx.fillStyle = '#8a6040';
  ctx.fillRect(-8, -4, 3, 8);
  ctx.fillRect(6, -3, 4, 6);
  // Antlers
  ctx.strokeStyle = '#e8d8b0';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(9, -2); ctx.lineTo(13, -6);
  ctx.moveTo(9, 2);  ctx.lineTo(13, 6);
  ctx.stroke();
  ctx.fillStyle = '#e8d8b0';
  ctx.fillRect(-6, 3, 2, 2);
  ctx.fillRect(4, 3, 2, 2);
  ctx.restore();
  drawHpBar(ctx, e, 14);
}

function drawBoar(ctx, e) {
  drawShadow(ctx, 11);
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(-9, -5, 18, 10);
  ctx.fillStyle = '#2a1a10';
  ctx.fillRect(-9, -5, 4, 10);
  // Head
  ctx.fillStyle = '#4a3028';
  ctx.fillRect(7, -4, 5, 8);
  // Tusks
  ctx.fillStyle = '#f0e8d0';
  ctx.fillRect(11, -3, 3, 2);
  ctx.fillRect(11, 1, 3, 2);
  // Eye
  ctx.fillStyle = '#c13030';
  ctx.fillRect(9, -2, 1, 1);
  ctx.restore();
  drawHpBar(ctx, e, 16);
}

// Spawn a sprinkling of wildlife on reset — biased by biome.
function _spawnWildlife() {
  for (let i = 0; i < 30; i++) {
    // Deer in Shire / Rohan / Forest.
    const p = findOpenTile();
    if (!p) continue;
    const t = tileAt(p.x, p.y);
    if (t === TILES.SHIRE || t === TILES.ROHAN || t === TILES.FOREST || t === TILES.GRASS) {
      state.entities.push(makeDeer(p.x, p.y));
    }
  }
  for (let i = 0; i < 20; i++) {
    // Boars in Fangorn / Forest / Eriador.
    const p = findOpenTile();
    if (!p) continue;
    const t = tileAt(p.x, p.y);
    if (t === TILES.FANGORN || t === TILES.FOREST || t === TILES.GRASS) {
      state.entities.push(makeBoar(p.x, p.y));
    }
  }
}
on('reset', _spawnWildlife);
