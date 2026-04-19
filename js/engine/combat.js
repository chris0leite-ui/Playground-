// Combat helpers used by the player (and eventually friendly NPCs).
// Extracted from player.js. Shared arc/range mechanics — no class-specific
// logic; that comes via actor stats.

function tryMelee(attacker) {
  if (attacker.attackTimer > 0) return;
  attacker.attackTimer = CONFIG.PLAYER_ATTACK_COOLDOWN;
  attacker.attackSwing = 0.22;
  const range = CONFIG.PLAYER_ATTACK_RANGE;
  const fx = attacker.x + Math.cos(attacker.angle) * range * 0.5;
  const fy = attacker.y + Math.sin(attacker.angle) * range * 0.5;
  let killed = false;
  for (const e of state.entities) {
    if (e === attacker || e.type === 'pickup' || e === attacker.onHorse) continue;
    if (!('hp' in e)) continue;
    if (e.hp <= 0) continue;
    const d = dist(e.x, e.y, fx, fy);
    if (d < range) {
      e.hp -= CONFIG.PLAYER_ATTACK_DAMAGE;
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
  attacker.attackTimer = CONFIG.PLAYER_ATTACK_COOLDOWN * 1.2;
  const sp = 300;
  const p = makeActor({
    type: 'projectile',
    x: attacker.x + Math.cos(attacker.angle) * 10,
    y: attacker.y + Math.sin(attacker.angle) * 10,
    w: 4, h: 4,
    hp: 1,
    vx: Math.cos(attacker.angle) * sp,
    vy: Math.sin(attacker.angle) * sp,
    team: attacker.team,
    damage: CONFIG.PLAYER_ATTACK_DAMAGE,
    angle: attacker.angle,
    owner: attacker,
    ttl: 0.9,
  });
  state.entities.push(p);
}
