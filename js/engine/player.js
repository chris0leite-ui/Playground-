// Player-specific logic: movement, attack, mount/dismount, wanted level decay.

function updatePlayer(dt) {
  const p = state.player;
  if (!p || p.hp <= 0) return;

  const input = moveInput();
  const speed = p.onHorse ? CONFIG.HORSE_SPEED : CONFIG.PLAYER_SPEED;
  const mag = Math.hypot(input.dx, input.dy);
  if (mag > 0.1) {
    p.angle = Math.atan2(input.dy, input.dx);
  }
  p.vx = input.dx * speed;
  p.vy = input.dy * speed;

  tryMove(p, p.vx * dt, p.vy * dt);

  if (p.onHorse) {
    p.onHorse.x = p.x;
    p.onHorse.y = p.y;
    p.onHorse.angle = p.angle;
  }

  if (p.attackTimer > 0) p.attackTimer -= dt;
  if (p.attackSwing > 0) p.attackSwing -= dt;
  if (p.hurtFlash > 0) p.hurtFlash -= dt;

  if (state.edge.attack) {
    state.edge.attack = false;
    tryAttack();
  }
  if (state.edge.mount) {
    state.edge.mount = false;
    tryMountOrDismount();
  }
  // Faction rep decay is driven by updateFactions(dt) in loop.js.
}

// Axis-separated tile collision. Moves the entity by dx, dy without phasing
// through solid tiles.
function tryMove(e, dx, dy) {
  const halfW = e.w / 2, halfH = e.h / 2;

  // Horizontal
  let nx = e.x + dx;
  const xLead = dx > 0 ? nx + halfW : nx - halfW;
  if (!isSolidAt(xLead, e.y - halfH + 2) && !isSolidAt(xLead, e.y + halfH - 2)) {
    e.x = nx;
  }
  // Vertical
  let ny = e.y + dy;
  const yLead = dy > 0 ? ny + halfH : ny - halfH;
  if (!isSolidAt(e.x - halfW + 2, yLead) && !isSolidAt(e.x + halfW - 2, yLead)) {
    e.y = ny;
  }

  // Clamp to region bounds.
  e.x = clamp(e.x, halfW + 1, regionW() * TILE - halfW - 1);
  e.y = clamp(e.y, halfH + 1, regionH() * TILE - halfH - 1);
}

function tryAttack() {
  const p = state.player;
  if (p.attackTimer > 0) return;
  p.attackTimer = CONFIG.PLAYER_ATTACK_COOLDOWN;
  p.attackSwing = 0.22;

  const range = CONFIG.PLAYER_ATTACK_RANGE;
  const fx = p.x + Math.cos(p.angle) * range * 0.5;
  const fy = p.y + Math.sin(p.angle) * range * 0.5;

  let killed = false;
  for (const e of state.entities) {
    if (e === p || e.type === 'pickup' || e === p.onHorse) continue;
    if (!('hp' in e)) continue;
    if (e.hp <= 0) continue;
    const d = dist(e.x, e.y, fx, fy);
    if (d < range) {
      e.hp -= CONFIG.PLAYER_ATTACK_DAMAGE;
      e.hurtFlash = 0.15;
      // Small knockback.
      const ang = Math.atan2(e.y - p.y, e.x - p.x);
      e.x += Math.cos(ang) * 4;
      e.y += Math.sin(ang) * 4;
      if (e.hp <= 0) {
        onEnemyKilled(e);
        killed = true;
      }
    }
  }
  if (killed) state.shake = Math.min(6, state.shake + 3);
}

function onEnemyKilled(e) {
  // Faction listeners handle rep hits; quest listeners advance objectives.
  // Renown is a global score kept here for now; moves to a data-driven
  // on_killed reward table in a later tier.
  eventBus.emit('entity_killed', e, state.player);
  if (e.type === 'orc')        state.renown += CONFIG.RENOWN_PER_ORC;
  else if (e.type === 'guard') state.renown += CONFIG.RENOWN_PER_GUARD;
}

function tryMountOrDismount() {
  const p = state.player;
  if (p.onHorse) {
    // Dismount: nudge off the saddle perpendicular to facing.
    p.onHorse.rider = null;
    const ox = Math.cos(p.angle + Math.PI / 2) * 16;
    const oy = Math.sin(p.angle + Math.PI / 2) * 16;
    if (!isSolidAt(p.x + ox, p.y + oy)) {
      p.x += ox; p.y += oy;
    }
    p.onHorse = null;
    return;
  }
  // Find nearest free horse within MOUNT_RANGE.
  let best = null, bestD = CONFIG.MOUNT_RANGE;
  for (const e of state.entities) {
    if (e.type !== 'horse' || e.hp <= 0 || e.rider) continue;
    const d = distEnt(e, p);
    if (d < bestD) { bestD = d; best = e; }
  }
  if (best) {
    best.rider = p;
    p.onHorse = best;
    p.x = best.x;
    p.y = best.y;
  }
}

function damagePlayer(amount) {
  const p = state.player;
  if (p.hp <= 0) return;
  p.hp -= amount;
  p.hurtFlash = 0.2;
  state.shake = Math.min(10, state.shake + amount * 0.25);
  if (p.hp <= 0) {
    p.hp = 0;
    state.gameOver = true;
    if (p.onHorse) { p.onHorse.rider = null; p.onHorse = null; }
  }
}
