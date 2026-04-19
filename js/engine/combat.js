// Combat helpers used by the player (and eventually friendly NPCs).
// Reads damage / range / cooldown from the currently equipped weapon via
// engine/inventory.js. Level-bump damage is folded in automatically.

function tryMelee(attacker) {
  if (attacker.attackTimer > 0) return;
  const w = (typeof weaponStats === 'function') ? weaponStats() : null;
  if (w && w.ranged) return tryShoot(attacker);
  const cooldown = (w && w.cooldown) || CONFIG.PLAYER_ATTACK_COOLDOWN;
  const range    = (w && w.range)    || CONFIG.PLAYER_ATTACK_RANGE;
  attacker.attackTimer = cooldown;
  attacker.attackSwing = 0.22;
  const fx = attacker.x + Math.cos(attacker.angle) * range * 0.5;
  const fy = attacker.y + Math.sin(attacker.angle) * range * 0.5;
  let killed = false;
  for (const e of state.entities) {
    if (e === attacker || e.type === 'pickup' || e === attacker.onHorse) continue;
    if (!('hp' in e)) continue;
    if (e.hp <= 0) continue;
    const d = dist(e.x, e.y, fx, fy);
    if (d < range) {
      const dmg = (typeof currentWeaponDamage === 'function')
        ? currentWeaponDamage(e.type)
        : CONFIG.PLAYER_ATTACK_DAMAGE;
      e.hp -= dmg;
      e.hurtFlash = 0.15;
      const ang = Math.atan2(e.y - attacker.y, e.x - attacker.x);
      e.x += Math.cos(ang) * 4;
      e.y += Math.sin(ang) * 4;
      if (e.hp <= 0 && attacker === state.player) {
        onEnemyKilled(e);
        killed = true;
      }
    }
  }
  if (killed) state.shake = Math.min(6, state.shake + 3);
}

function tryShoot(attacker) {
  if (attacker.attackTimer > 0) return;
  const w = (typeof weaponStats === 'function') ? weaponStats('bow') : null;
  const cooldown = (w && w.cooldown) || (CONFIG.PLAYER_ATTACK_COOLDOWN * 1.2);
  const speed    = (w && w.speed)    || 300;
  const damage   = (typeof currentWeaponDamage === 'function')
    ? currentWeaponDamage(null)
    : CONFIG.PLAYER_ATTACK_DAMAGE;
  attacker.attackTimer = cooldown;
  const p = makeActor({
    type: 'projectile',
    x: attacker.x + Math.cos(attacker.angle) * 10,
    y: attacker.y + Math.sin(attacker.angle) * 10,
    w: 4, h: 4, hp: 1,
    vx: Math.cos(attacker.angle) * speed,
    vy: Math.sin(attacker.angle) * speed,
    team: attacker.team,
    damage,
    angle: attacker.angle,
    owner: attacker,
    ttl: 0.9,
  });
  state.entities.push(p);
}

// Enemy ranged attack — called by spider/haradrim AI. Identical payload
// shape as the player's projectile, but team is ORC so the player takes
// damage on hit.
function spawnProjectile(owner, angle, opts) {
  const damage = (opts && opts.damage) || owner.damage || 10;
  const speed  = (opts && opts.speed)  || 220;
  const ttl    = ((opts && opts.range) || 220) / speed;
  const p = makeActor({
    type: 'projectile',
    x: owner.x + Math.cos(angle) * 10,
    y: owner.y + Math.sin(angle) * 10,
    w: 4, h: 4, hp: 1,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    team: owner.team,
    damage,
    angle,
    owner,
    ttl,
  });
  state.entities.push(p);
}
