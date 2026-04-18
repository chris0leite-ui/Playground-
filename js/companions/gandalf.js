// Gandalf: stays back, periodically unleashes a radial shockwave.
function makeGandalf(x, y) {
  return {
    type: 'gandalf', x, y, w: 14, h: 14,
    hp: 110, maxHp: 110, angle: 0,
    team: TEAM.PLAYER, friendly: true,
    castTimer: 6, castAnim: 0, hurtFlash: 0,
    draw: drawGandalf,
    update: updateGandalf,
  };
}

function updateGandalf(dt, c) {
  if (c.castTimer > 0) c.castTimer -= dt;
  if (c.castAnim > 0) c.castAnim -= dt;
  followPlayer(c, dt, 90, 100);
  if (c.castTimer <= 0) {
    c.castTimer = 7;
    c.castAnim = 0.6;
    const R = 120;
    for (const e of state.entities) {
      if (e === c || e.friendly || e === state.player) continue;
      if (e.hp == null || e.hp <= 0) continue;
      if (distEnt(e, c) < R) {
        e.hp -= 40;
        e.hurtFlash = 0.2;
        // Pushback
        const ang = Math.atan2(e.y - c.y, e.x - c.x);
        e.x += Math.cos(ang) * 10;
        e.y += Math.sin(ang) * 10;
        if (e.hp <= 0) emit('enemyKilled', { entity: e, byPlayer: false });
      }
    }
    state.shake = Math.min(10, state.shake + 4);
  }
}

function drawGandalf(ctx, c) {
  drawShadow(ctx, 10);
  // Grey robe
  ctx.fillStyle = '#7a7a7a';
  ctx.fillRect(-7, -4, 14, 14);
  // White beard
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(-4, -2, 8, 6);
  ctx.fillStyle = '#e0c8a0';
  ctx.beginPath(); ctx.arc(0, -6, 3, 0, Math.PI * 2); ctx.fill();
  // Pointy hat
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath();
  ctx.moveTo(-5, -9); ctx.lineTo(5, -9); ctx.lineTo(0, -18); ctx.closePath();
  ctx.fill();
  // Staff
  ctx.strokeStyle = '#6a4a2a';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(7, -2); ctx.lineTo(11, -14); ctx.stroke();
  if (c.castAnim > 0) {
    const r = (0.6 - c.castAnim) / 0.6 * 120;
    ctx.strokeStyle = 'rgba(240,240,200,0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  }
  drawHpBar(ctx, c, 16);
}
