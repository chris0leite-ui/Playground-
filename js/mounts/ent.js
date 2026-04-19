// Ent: slow, massive, tree-shepherd mount. Tramples enemies and props.
function makeEnt(x, y) {
  return {
    type: 'ent', x, y, w: 28, h: 28,
    hp: 380, maxHp: 380, angle: 0,
    team: TEAM.NEUTRAL, rider: null,
    wanderTimer: rand(0, 4), wanderAngle: rand(0, Math.PI * 2),
    speed: 75,
    draw: drawEnt,
    update: updateEnt,
  };
}

function updateEnt(dt, e) {
  if (!e.rider) {
    e.wanderTimer -= dt;
    if (e.wanderTimer <= 0) {
      e.wanderTimer = rand(5, 10);
      e.wanderAngle = rand(0, Math.PI * 2);
    }
    tryMove(e, Math.cos(e.wanderAngle) * 20 * dt, Math.sin(e.wanderAngle) * 20 * dt);
    e.angle = e.wanderAngle;
  }
  // Trample pass — crush hostile enemies under the foot radius.
  for (const other of state.entities) {
    if (other === e || other === e.rider) continue;
    if (other.friendly || other.type === 'pickup' || other.type === 'itempickup') continue;
    if (!('hp' in other)) continue;
    if (rectsOverlap(e.x - e.w/2, e.y - e.h/2, e.w, e.h,
                     other.x - other.w/2, other.y - other.h/2, other.w, other.h)) {
      other.hp -= 50 * dt;
      if (other.hp <= 0) emit('enemyKilled', { entity: other, byPlayer: !!e.rider });
    }
  }
}

function drawEnt(ctx, e) {
  drawShadow(ctx, 16);
  ctx.save();
  ctx.rotate(e.angle);
  // Trunk body
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(-10, -14, 20, 28);
  // Bark texture
  ctx.fillStyle = '#3a2a10';
  ctx.fillRect(-10, -14, 4, 28);
  ctx.fillRect(6, -14, 4, 28);
  ctx.fillRect(-8, -6, 16, 3);
  ctx.fillRect(-8, 6, 16, 3);
  // Leafy crown
  ctx.fillStyle = '#2a4a2a';
  ctx.beginPath();
  ctx.arc(0, -18, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a5a3a';
  ctx.fillRect(-6, -22, 4, 3);
  ctx.fillRect(2, -20, 5, 4);
  // Big eyes in the trunk
  ctx.fillStyle = '#f0e8a0';
  ctx.fillRect(-4, -8, 2, 2);
  ctx.fillRect(2, -8, 2, 2);
  // Root feet
  ctx.fillStyle = '#2a1a08';
  ctx.fillRect(-10, 12, 4, 4);
  ctx.fillRect(6, 12, 4, 4);
  ctx.restore();
  if (e.rider) {
    ctx.fillStyle = '#3a4a5a';
    ctx.fillRect(-4, -22, 8, 6);
    ctx.fillStyle = '#e0c8a0';
    ctx.beginPath(); ctx.arc(0, -24, 3, 0, Math.PI * 2); ctx.fill();
  }
  if (!e.rider) drawHpBar(ctx, e, 30);
}
