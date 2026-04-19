// Nazgul: flying shadows. At night they spawn across all of Middle-earth;
// during the day they keep haunting Mordor. Multiple can be airborne at
// once. Standing in an aura drains HP and inverts player input (fear).
function spawnNazgul(nearPlayer) {
  const edge = Math.random() < 0.5 ? 0 : MAP.W * TILE;
  const y = nearPlayer
    ? clamp(state.player.y + rand(-400, 400), TILE * 4, MAP.H * TILE - TILE * 4)
    : rand(TILE * 4, MAP.H * TILE - TILE * 4);
  const toward = Math.atan2(state.player.y - y, state.player.x - edge);
  const n = {
    type: 'nazgul', noHp: true, alive: true,
    x: edge, y, angle: toward, speed: 90,
    ttl: 18,
    aura: 70,
    draw: drawNazgul,
    update: updateNazgul,
  };
  state.entities.push(n);
  if (!state.nazgul.list) state.nazgul.list = [];
  state.nazgul.list.push(n);
  if (state.nazgul.list.length === 1) toast('A shadow crosses the plain…', 3);
  else if (state.nazgul.list.length === 3) toast('The Nine gather against you!', 4);
}

function _countNazgul() {
  if (!state.nazgul.list) return 0;
  state.nazgul.list = state.nazgul.list.filter(n => n.alive !== false);
  return state.nazgul.list.length;
}

function updateNazgul(dt, n) {
  n.ttl -= dt;
  if (n.ttl <= 0) { n.alive = false; return; }
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

// Scheduler: at night, keep up to 3 Nazgul airborne. In Mordor (player on
// MORDOR/SWAMP tile or inside Barad-dûr / Black Gate radius), always
// maintain at least 1.
function updateNazgulScheduler(dt) {
  if (state.location === 'moria') return; // no shadows indoors
  const p = state.player;
  if (!p) return;
  const alive = _countNazgul();
  const t = tileAt(p.x, p.y);
  const inMordor = t === TILES.MORDOR || t === TILES.SWAMP;
  const targetCount = isNight() ? 3 : (inMordor ? 1 : 0);
  if (alive >= targetCount) { state.nazgul.cooldown = 12; return; }
  state.nazgul.cooldown -= dt;
  if (state.nazgul.cooldown <= 0) {
    state.nazgul.cooldown = rand(8, 18);
    spawnNazgul(inMordor && !isNight());
  }
}
registerUpdate(updateNazgulScheduler);

on('reset', () => { state.nazgul.list = []; state.nazgul.active = null; });
