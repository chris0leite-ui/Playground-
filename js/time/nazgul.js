// Nazgul: a flying shadow that appears at night. Standing in its aura
// drains hp and briefly inverts player input (handled via state.nazgul.fear).
function spawnNazgul() {
  const edge = Math.random() < 0.5 ? 0 : MAP.W * TILE;
  const y = rand(TILE * 4, MAP.H * TILE - TILE * 4);
  const toward = Math.atan2(state.player.y - y, state.player.x - edge);
  const n = {
    type: 'nazgul', noHp: true, alive: true,
    x: edge, y, angle: toward, speed: 90,
    ttl: 14,
    aura: 70,
    draw: drawNazgul,
    update: updateNazgul,
  };
  state.entities.push(n);
  state.nazgul.active = n;
  toast('A shadow crosses the plain…', 3);
}

function updateNazgul(dt, n) {
  n.ttl -= dt;
  if (n.ttl <= 0) { n.alive = false; state.nazgul.active = null; return; }
  // Drift slowly toward the player.
  const ang = Math.atan2(state.player.y - n.y, state.player.x - n.x);
  n.angle = lerp(n.angle, ang, 0.02);
  n.x += Math.cos(n.angle) * n.speed * dt;
  n.y += Math.sin(n.angle) * n.speed * dt;
  const d = distEnt(n, state.player);
  if (d < n.aura) {
    damagePlayer(14 * dt);
    state.nazgul.fear = 0.5;
  } else if (state.nazgul.fear > 0) {
    state.nazgul.fear = Math.max(0, state.nazgul.fear - dt);
  }
}

function drawNazgul(ctx, n) {
  // Massive drifting shadow ellipse + winged silhouette.
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(0, 4, n.aura, n.aura * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.9;
  ctx.rotate(n.angle);
  ctx.fillRect(-6, -3, 12, 6);
  ctx.beginPath();
  ctx.moveTo(-6, 0); ctx.lineTo(-26, -14); ctx.lineTo(-14, 0);
  ctx.lineTo(-26, 14); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, 0); ctx.lineTo(26, -14); ctx.lineTo(14, 0);
  ctx.lineTo(26, 14); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function updateNazgulScheduler(dt) {
  if (state.nazgul.active) return;
  if (!isNight()) { state.nazgul.cooldown = 30; return; }
  state.nazgul.cooldown -= dt;
  if (state.nazgul.cooldown <= 0) {
    state.nazgul.cooldown = rand(40, 80);
    spawnNazgul();
  }
}
registerUpdate(updateNazgulScheduler);
