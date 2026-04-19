// Beacons: interact to light; when lit, Rohirrim spawn at the world edge
// and charge toward the player's wanted-level aggressors.
function makeBeacon(x, y) {
  return {
    type: 'beacon', x, y, w: 18, h: 22,
    hp: 100, maxHp: 100, angle: 0,
    team: TEAM.NEUTRAL, lit: false, cooldown: 0,
    draw: drawBeacon,
    update: updateBeacon,
  };
}

function updateBeacon(dt, b) {
  if (b.cooldown > 0) b.cooldown -= dt;
  if (b.lit) return;
  const p = state.player;
  if (!p) return;
  const d = distEnt(b, p);
  if (d < 30 && state.edge.interact && b.cooldown <= 0) {
    state.edge.interact = false;
    b.lit = true;
    b.cooldown = 20;
    toast('Beacon lit! Rohan hears the call.', 4);
    emit('beaconLit', { beacon: b });
  } else if (d < 30) {
    // Show interact hint (drawn next frame via banner).
    state.toast.hint = 'Press F to light beacon';
  }
}

function drawBeacon(ctx, b) {
  drawShadow(ctx, 10);
  ctx.fillStyle = '#5a5a5a';
  ctx.fillRect(-5, -6, 10, 18);
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(-6, 10, 12, 3);
  // Brazier bowl
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.ellipse(0, -8, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  if (b.lit) {
    const flick = 1 + Math.sin(state.time * 20) * 0.2;
    ctx.fillStyle = `rgba(255, 180, 40, ${0.9})`;
    ctx.beginPath();
    ctx.ellipse(0, -14, 6 * flick, 10 * flick, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(255, 255, 200, 0.8)`;
    ctx.beginPath();
    ctx.ellipse(0, -14, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function spawnBeacons() {
  // One beacon per realm — Shire (near spawn), Rohan, Gondor.
  const h = LANDMARK_PX('hobbiton');
  const e = LANDMARK_PX('edoras');
  const mt = LANDMARK_PX('minasTirith');
  state.entities.push(makeBeacon(h.x + 80, h.y));
  state.entities.push(makeBeacon(e.x + 40, e.y));
  state.entities.push(makeBeacon(mt.x, mt.y + 22 * TILE));
}
