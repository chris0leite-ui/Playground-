// Fell Beast: the Nazgûl's winged steed. Flies (ignores terrain), fast,
// tanky. Spawns near Mordor; tame it and fly freely over the mountains.
function makeFellBeast(x, y) {
  return {
    type: 'fellBeast', x, y, w: 26, h: 22,
    hp: 180, maxHp: 180, angle: 0,
    team: TEAM.NEUTRAL, rider: null,
    wanderTimer: rand(0, 4), wanderAngle: rand(0, Math.PI * 2),
    flies: true, speed: 320,
    draw: drawFellBeast,
    update: updateFellBeast,
  };
}

function updateFellBeast(dt, e) {
  if (e.rider) return;
  e.wanderTimer -= dt;
  if (e.wanderTimer <= 0) {
    e.wanderTimer = rand(4, 8);
    e.wanderAngle = rand(0, Math.PI * 2);
  }
  e.x += Math.cos(e.wanderAngle) * 50 * dt;
  e.y += Math.sin(e.wanderAngle) * 50 * dt;
  e.x = clamp(e.x, 20, MAP.W * TILE - 20);
  e.y = clamp(e.y, 20, MAP.H * TILE - 20);
  e.angle = e.wanderAngle;
}

function drawFellBeast(ctx, e) {
  // Big shadow on the ground below (this beast is always airborne).
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 16, 16, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.rotate(e.angle);
  const flap = Math.sin(state.time * 6) * 4;
  // Leathery wings
  ctx.fillStyle = '#2a1a2a';
  ctx.beginPath();
  ctx.moveTo(-6, 0); ctx.lineTo(-26, -10 + flap); ctx.lineTo(-18, -2);
  ctx.lineTo(-26, 10 - flap); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, 0); ctx.lineTo(26, -10 + flap); ctx.lineTo(18, -2);
  ctx.lineTo(26, 10 - flap); ctx.closePath(); ctx.fill();
  // Body
  ctx.fillStyle = '#1a1018';
  ctx.fillRect(-7, -7, 14, 14);
  // Skeletal spine highlights
  ctx.fillStyle = '#4a3040';
  ctx.fillRect(-6, -1, 12, 2);
  // Head with red eye
  ctx.fillStyle = '#2a1a2a';
  ctx.fillRect(7, -3, 6, 6);
  ctx.fillStyle = '#ff2020';
  ctx.fillRect(11, -1, 2, 2);
  // Tail
  ctx.strokeStyle = '#2a1a2a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-7, 0); ctx.lineTo(-14, 3); ctx.stroke();
  ctx.restore();

  if (e.rider) {
    const p = e.rider;
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(-4, -10, 8, 8);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-5, -14, 10, 4);
  }
  if (!e.rider) drawHpBar(ctx, e, 22);
}
