// Smashable market stalls and barrels. Drop gold/lembas on death.
function makeStall(x, y) {
  return {
    type: 'stall', x, y, w: 24, h: 14,
    hp: 18, maxHp: 18, angle: 0,
    team: TEAM.NEUTRAL,
    draw: drawStall,
    update: updateProp,
  };
}

function makeBarrel(x, y) {
  return {
    type: 'barrel', x, y, w: 14, h: 14,
    hp: 10, maxHp: 10, angle: 0,
    team: TEAM.NEUTRAL,
    draw: drawBarrel,
    update: updateProp,
  };
}

function updateProp(dt, e) {
  if (e.hp <= 0 && !e._dropped) {
    e._dropped = true;
    const kind = e.type === 'barrel'
      ? (Math.random() < 0.5 ? 'lembas' : 'gold')
      : (Math.random() < 0.7 ? 'gold' : 'lembas');
    state.entities.push(makePickup(e.x, e.y, kind));
    e.alive = false;
    state.shake = Math.min(8, state.shake + 2);
  }
}

function drawStall(ctx, e) {
  drawShadow(ctx, 12);
  ctx.fillStyle = '#7a5a3a';
  ctx.fillRect(-12, -5, 24, 10);
  ctx.fillStyle = '#c13030';
  ctx.fillRect(-12, -10, 24, 5);
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.fillRect(-10, -8, 3, 3);
  ctx.fillRect(4, -8, 3, 3);
  if (e.hp < e.maxHp) drawHpBar(ctx, e, 22);
}

function drawBarrel(ctx, e) {
  drawShadow(ctx, 8);
  ctx.fillStyle = '#5a3a1a';
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2a1a0a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 7, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (e.hp < e.maxHp) drawHpBar(ctx, e, 14);
}

function spawnProps() {
  // Scatter stalls near roads and barrels elsewhere.
  for (let i = 0; i < 10; i++) {
    const p = findOpenRoadTile();
    state.entities.push(makeStall(p.x, p.y));
  }
  for (let i = 0; i < 14; i++) {
    const p = findOpenTile();
    state.entities.push(makeBarrel(p.x, p.y));
  }
}
