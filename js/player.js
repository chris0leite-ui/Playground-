// Player-specific logic: movement, attack, mount/dismount, wanted level decay.

function updatePlayer(dt) {
  const p = state.player;
  if (!p || p.hp <= 0) return;

  // Auto-dismount if our mount has died (kept-alive with hp=1 briefly here
  // so the player lands safely instead of sharing the corpse's fate).
  if (p.onHorse && p.onHorse.hp != null && p.onHorse.hp <= 0) {
    const dead = p.onHorse;
    dead.rider = null;
    p.onHorse = null;
    const safe = (typeof _findSafeSpot === 'function') ? _findSafeSpot(p.x, p.y, 96) : null;
    if (safe) { p.x = safe.x; p.y = safe.y; }
    toast('Your mount has fallen — you dismount.', 2.5);
  }

  const input = moveInput();
  if (state.nazgul && state.nazgul.fear > 0) {
    input.dx = -input.dx; input.dy = -input.dy;
  }
  if (p.webbed > 0) p.webbed = Math.max(0, p.webbed - dt);
  const mountSp = (typeof mountSpeed === 'function') ? mountSpeed() : null;
  let speed = p.onHorse ? (mountSp || CONFIG.HORSE_SPEED) : CONFIG.PLAYER_SPEED;
  // Swamp slows foot travel by 40%; spider web by 50%.
  if (!p.onHorse && isSwampTile(tileAt(p.x, p.y))) speed *= 0.6;
  if (p.webbed > 0) speed *= 0.5;
  const mag = Math.hypot(input.dx, input.dy);
  if (mag > 0.1) {
    p.angle = Math.atan2(input.dy, input.dx);
  }
  p.vx = input.dx * speed;
  p.vy = input.dy * speed;

  if (p.onHorse && p.onHorse.flies) {
    // Eagles ignore terrain entirely.
    p.x = clamp(p.x + p.vx * dt, 10, MAP.W * TILE - 10);
    p.y = clamp(p.y + p.vy * dt, 10, MAP.H * TILE - 10);
  } else {
    tryMove(p, p.vx * dt, p.vy * dt);
  }

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

  // Wanted level slowly decays while you're not being chased.
  if (p.wantedLevel > 0) {
    p.wantedDecay += dt;
    if (p.wantedDecay > 18) {
      p.wantedLevel = Math.max(0, p.wantedLevel - 1);
      p.wantedDecay = 0;
    }
  }
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

  // Clamp to world bounds.
  e.x = clamp(e.x, halfW + 1, MAP.W * TILE - halfW - 1);
  e.y = clamp(e.y, halfH + 1, MAP.H * TILE - halfH - 1);
}

function tryAttack() {
  const p = state.player;
  const stats = (typeof weaponStats === 'function') ? weaponStats() : null;
  const bonus = (typeof levelBonusDamage === 'function') ? levelBonusDamage() : 0;
  const cd = stats ? stats.cooldown : CONFIG.PLAYER_ATTACK_COOLDOWN;
  const range = stats ? stats.range : CONFIG.PLAYER_ATTACK_RANGE;
  const dmg = (stats ? stats.damage : CONFIG.PLAYER_ATTACK_DAMAGE) + bonus;
  if (p.attackTimer > 0) return;
  p.attackTimer = cd;
  p.attackSwing = 0.22;

  // Ranged weapons (bow) fire a projectile; melee sweeps a cone.
  if (stats && stats.ranged && typeof spawnProjectile === 'function') {
    spawnProjectile(p, p.angle, stats);
    return;
  }

  const fx = p.x + Math.cos(p.angle) * range * 0.5;
  const fy = p.y + Math.sin(p.angle) * range * 0.5;

  let killed = false;
  for (const e of state.entities) {
    if (e === p || e.type === 'pickup' || e === p.onHorse) continue;
    if (e.friendly) continue;
    if (!('hp' in e)) continue;
    if (e.hp <= 0) continue;
    const d = dist(e.x, e.y, fx, fy);
    if (d < range) {
      let damage = dmg;
      if (stats && stats.bonusVs && stats.bonusVs[e.type]) damage += stats.bonusVs[e.type];
      e.hp -= damage;
      e.hurtFlash = 0.15;
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
  if (e.type === 'orc') {
    state.renown += CONFIG.RENOWN_PER_ORC;
  } else if (e.type === 'guard') {
    state.renown += CONFIG.RENOWN_PER_GUARD;
    state.player.wantedLevel = Math.min(
      CONFIG.WANTED_MAX,
      state.player.wantedLevel + CONFIG.WANTED_PER_GUARD_KILL
    );
    state.player.wantedDecay = 0;
  } else if (e.type === 'horse') {
    state.player.wantedLevel = Math.min(CONFIG.WANTED_MAX, state.player.wantedLevel + 1);
  }
  emit('enemyKilled', { entity: e, byPlayer: true });
}

// Spiral outward from (cx,cy) to find the nearest non-solid spot (up to maxR px).
// Checks a small cross footprint to avoid placing the player half-inside a wall.
function _findSafeSpot(cx, cy, maxR) {
  for (let r = 0; r <= maxR; r += 8) {
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (!isSolidAt(x - 6, y) && !isSolidAt(x + 6, y) &&
          !isSolidAt(x, y - 6) && !isSolidAt(x, y + 6)) {
        return { x, y };
      }
    }
  }
  return null;
}

function tryMountOrDismount() {
  const p = state.player;
  if (p.onHorse) {
    // Dismount: spiral outward to a safe tile. Essential for flying mounts
    // which may have stopped over water or walls.
    p.onHorse.rider = null;
    const safe = _findSafeSpot(p.x, p.y, 128);
    if (safe) { p.x = safe.x; p.y = safe.y; }
    p.onHorse = null;
    return;
  }
  // Find nearest free mount within MOUNT_RANGE.
  const MOUNT_TYPES = ['horse', 'eagle', 'warg', 'mumak', 'shadowfax', 'ent', 'fellBeast'];
  let best = null, bestD = CONFIG.MOUNT_RANGE;
  for (const e of state.entities) {
    if (MOUNT_TYPES.indexOf(e.type) < 0 || e.hp <= 0 || e.rider) continue;
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
  if (!p || p.hp <= 0) return;
  if (!isFinite(amount) || amount < 0) return;
  const armor = (typeof armorReduction === 'function') ? armorReduction() : 0;
  // Armor subtracts from damage, but never reduces it below 25% of the
  // original so no armor combination makes you fully invulnerable.
  amount = Math.max(amount * 0.25, amount - armor);
  if (amount <= 0) return;
  p.hp -= amount;
  p.hurtFlash = 0.2;
  state.shake = Math.min(10, state.shake + amount * 0.25);
  if (p.hp <= 0) {
    p.hp = 0;
    state.gameOver = true;
    if (p.onHorse) { p.onHorse.rider = null; p.onHorse = null; }
  }
}
