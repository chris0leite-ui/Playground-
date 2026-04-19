// Exotic mounts: Shadowfax, Ent, Fell Beast, Eagle, Warg, Mumak.
// Each uses a single makeMount factory + a type-switched draw routine.
// Stationary wandering behaviour mirrors the horse updater.

const MOUNT_SPECS = {
  shadowfax: { hp: 160, speed: 360, w: 22, h: 14, color: '#f0efe8', accent: '#d8d4c8', name: 'Shadowfax' },
  ent:       { hp: 260, speed:  90, w: 22, h: 22, color: '#3a4a2a', accent: '#2a3a1a', name: 'Ent' },
  fellbeast: { hp: 200, speed: 340, w: 26, h: 14, color: '#1a0a0a', accent: '#3a2020', name: 'Fell Beast' },
  eagle:     { hp: 120, speed: 320, w: 22, h: 14, color: '#6a5a3a', accent: '#e8d890', name: 'Great Eagle' },
  warg:      { hp: 110, speed: 280, w: 18, h: 12, color: '#3a2a20', accent: '#1a1010', name: 'Warg' },
  mumak:     { hp: 320, speed: 110, w: 28, h: 18, color: '#6a5a48', accent: '#4a3a28', name: 'Mûmak' },
};

function makeMount(type, x, y) {
  const spec = MOUNT_SPECS[type] || MOUNT_SPECS.eagle;
  return makeActor({
    type, x, y,
    w: spec.w, h: spec.h,
    hp: spec.hp,
    team: TEAM.NEUTRAL,
    rider: null,
    speed: spec.speed,
    wanderTimer: rand(0, 3),
    wanderAngle: rand(0, Math.PI * 2),
    mountName: spec.name,
  });
}

function updateMount(e, dt) {
  if (e.rider) return;
  e.wanderTimer -= dt;
  if (e.wanderTimer <= 0) {
    e.wanderTimer = rand(2, 5);
    e.wanderAngle = rand(0, Math.PI * 2);
    if (Math.random() < 0.3) e.wanderAngle = null;
  }
  if (e.wanderAngle == null) return;
  const sp = 60;
  tryMove(e, Math.cos(e.wanderAngle) * sp * dt, Math.sin(e.wanderAngle) * sp * dt);
  e.angle = e.wanderAngle;
}

function drawMount(ctx, e) {
  drawShadow(ctx, Math.max(10, e.w / 2));
  const spec = MOUNT_SPECS[e.type] || MOUNT_SPECS.eagle;
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = spec.color;
  ctx.fillRect(-e.w / 2, -e.h / 2, e.w, e.h);
  ctx.fillStyle = spec.accent;
  // Head/mane marker.
  ctx.fillRect(e.w / 2 - 4, -e.h / 2 + 2, 4, e.h - 4);
  // Decorative stripe (type-specific).
  if (e.type === 'eagle') {
    ctx.fillStyle = '#fff';
    ctx.fillRect(-e.w / 2, -1, e.w, 2);
  } else if (e.type === 'fellbeast') {
    ctx.fillStyle = '#6a1010';
    ctx.fillRect(-e.w / 2 + 2, -1, e.w - 4, 2);
  } else if (e.type === 'shadowfax') {
    ctx.fillStyle = 'rgba(255,255,220,0.5)';
    ctx.fillRect(-e.w / 2, -e.h / 2 - 2, e.w, 2);
  } else if (e.type === 'mumak') {
    ctx.fillStyle = '#fff';
    ctx.fillRect(e.w / 2 - 8, -e.h / 2 - 2, 2, 4);
  }
  ctx.restore();
  if (e.rider) {
    ctx.fillStyle = '#3a4a5a';
    ctx.fillRect(-5, -9, 10, 10);
    ctx.fillStyle = '#e0c8a0';
    ctx.beginPath(); ctx.arc(0, -11, 3, 0, Math.PI * 2); ctx.fill();
  }
  if (!e.rider) drawHpBar(ctx, e, Math.max(18, e.w));
}

for (const t of Object.keys(MOUNT_SPECS)) {
  registerEntityType(t, { factory: null, update: updateMount, draw: drawMount });
}
