// AI and per-type update functions for non-player entities.

function updateEntities(dt) {
  for (const e of state.entities) {
    if (e === state.player) continue;
    if (e.hurtFlash > 0) e.hurtFlash -= dt;
    updateEntity(e, dt); // dispatch via entity_registry
  }
  // Prune corpses in place. Pickups have no hp; keep them unless dead.
  for (let i = state.entities.length - 1; i >= 0; i--) {
    const e = state.entities[i];
    if (e === state.player) continue;
    if (e.type === 'pickup') {
      if (e.alive === false) state.entities.splice(i, 1);
      continue;
    }
    if (e.hp <= 0) state.entities.splice(i, 1);
  }
}

// Shared orc/guard behavior. Guards aggro only when rep[citadel-guard]
// is negative (the Fourth-Age view of the old wanted system).
function updateHostile(e, dt, isGuard) {
  const p = state.player;
  if (!p || p.hp <= 0) {
    wander(e, dt);
    return;
  }

  const stars = hostileTier('citadel-guard');
  const active = isGuard ? stars > 0 : true;
  const d = distEnt(e, p);

  if (e.attackTimer > 0) e.attackTimer -= dt;

  // Stealth reduces effective aggro range. 0 = no effect; 1 = invisible.
  const stealth = p.stealth || 0;
  const effAggro = e.aggroRange * (1 - stealth * 0.5);

  if (active && d < effAggro) {
    const ang = Math.atan2(p.y - e.y, p.x - e.x);
    e.angle = ang;
    if (d > e.attackRange - 2) {
      const sp = e.speed * (isGuard ? 1 + 0.08 * stars : 1);
      tryMove(e, Math.cos(ang) * sp * dt, Math.sin(ang) * sp * dt);
    } else if (e.attackTimer <= 0) {
      e.attackTimer = isGuard ? CONFIG.GUARD_ATTACK_COOLDOWN : CONFIG.ORC_ATTACK_COOLDOWN;
      damagePlayer(e.damage);
    }
  } else {
    wander(e, dt);
  }
}

function wander(e, dt) {
  e.wanderTimer -= dt;
  if (e.wanderTimer <= 0) {
    e.wanderTimer = rand(1.2, 3.5);
    e.wanderAngle = rand(0, Math.PI * 2);
    // Half the time, stand still.
    if (Math.random() < 0.4) e.wanderAngle = null;
  }
  if (e.wanderAngle == null) return;
  const sp = (e.speed || 40) * 0.35;
  tryMove(e, Math.cos(e.wanderAngle) * sp * dt, Math.sin(e.wanderAngle) * sp * dt);
  e.angle = e.wanderAngle;
}

function updateHorse(e, dt) {
  if (e.rider) {
    // Ridden: position & angle driven by player.
    return;
  }
  e.wanderTimer -= dt;
  if (e.wanderTimer <= 0) {
    e.wanderTimer = rand(2, 5);
    e.wanderAngle = rand(0, Math.PI * 2);
    if (Math.random() < 0.5) e.wanderAngle = null;
  }
  if (e.wanderAngle == null) return;
  const sp = CONFIG.HORSE_WANDER_SPEED;
  tryMove(e, Math.cos(e.wanderAngle) * sp * dt, Math.sin(e.wanderAngle) * sp * dt);
  e.angle = e.wanderAngle;
}

function updatePickup(e, dt) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  if (distEnt(e, p) < 18) {
    if (e.kind === 'lembas') {
      p.hp = Math.min(p.maxHp, p.hp + CONFIG.LEMBAS_HEAL);
    } else if (e.kind === 'gold') {
      p.gold += CONFIG.GOLD_VALUE;
      state.renown += 5;
    } else if (typeof e.kind === 'string' && e.kind.indexOf('weapon:') === 0) {
      if (typeof pickupWeapon === 'function') pickupWeapon(e.kind.slice(7));
    }
    e.alive = false;
  }
}
