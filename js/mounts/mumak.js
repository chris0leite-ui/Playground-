// Mûmak: slow, heavy, crushes props and small enemies on contact.
function makeMumak(x, y) {
  return {
    type: 'mumak', x, y, w: 40, h: 30,
    hp: 400, maxHp: 400, angle: 0,
    team: TEAM.NEUTRAL, rider: null,
    wanderTimer: rand(0, 4), wanderAngle: rand(0, Math.PI * 2),
    speed: 90,
    draw: drawMumak,
    update: updateMumak,
  };
}

function updateMumak(dt, m) {
  if (!m.rider) {
    m.wanderTimer -= dt;
    if (m.wanderTimer <= 0) {
      m.wanderTimer = rand(4, 8);
      m.wanderAngle = rand(0, Math.PI * 2);
    }
    tryMove(m, Math.cos(m.wanderAngle) * 25 * dt, Math.sin(m.wanderAngle) * 25 * dt);
    m.angle = m.wanderAngle;
  }
  // Trample pass: damage things beneath us.
  for (const e of state.entities) {
    if (e === m || e === m.rider) continue;
    if (e.friendly || e.type === 'pickup' || e.type === 'itempickup') continue;
    if (!('hp' in e)) continue;
    if (rectsOverlap(m.x - m.w/2, m.y - m.h/2, m.w, m.h,
                     e.x - e.w/2, e.y - e.h/2, e.w, e.h)) {
      e.hp -= 60 * dt;
      if (e.hp <= 0) emit('enemyKilled', { entity: e, byPlayer: !!m.rider });
    }
  }
}

function drawMumak(ctx, m) {
  drawShadow(ctx, 22);
  ctx.save();
  ctx.rotate(m.angle);
  // Body
  ctx.fillStyle = '#7a6a4a';
  ctx.fillRect(-20, -14, 40, 28);
  // Tusks
  ctx.fillStyle = '#f0e8d0';
  ctx.fillRect(18, -10, 12, 3);
  ctx.fillRect(18, 7, 12, 3);
  // Legs
  ctx.fillStyle = '#4a3a2a';
  ctx.fillRect(-16, 12, 4, 6);
  ctx.fillRect(-6, 12, 4, 6);
  ctx.fillRect(4, 12, 4, 6);
  ctx.fillRect(12, 12, 4, 6);
  ctx.restore();
  if (!m.rider) drawHpBar(ctx, m, 40);
}
