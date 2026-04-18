// Entity factory functions and initial world population.

function makePlayer(x, y) {
  return {
    type: 'player',
    x, y, vx: 0, vy: 0,
    w: 14, h: 14,
    hp: CONFIG.PLAYER_MAX_HP,
    maxHp: CONFIG.PLAYER_MAX_HP,
    angle: 0,
    attackTimer: 0,
    attackSwing: 0,       // > 0 while sword visible
    hurtFlash: 0,
    team: TEAM.PLAYER,
    onHorse: null,
    gold: 0,
    wantedLevel: 0,
    wantedDecay: 0,
  };
}

function makeOrc(x, y) {
  return {
    type: 'orc',
    x, y, vx: 0, vy: 0,
    w: 14, h: 14,
    hp: CONFIG.ORC_HP,
    maxHp: CONFIG.ORC_HP,
    angle: 0,
    attackTimer: 0,
    hurtFlash: 0,
    team: TEAM.ORC,
    speed: CONFIG.ORC_SPEED,
    aggroRange: CONFIG.ORC_AGGRO_RANGE,
    attackRange: CONFIG.ORC_ATTACK_RANGE,
    damage: CONFIG.ORC_DAMAGE,
    wanderTimer: rand(0, 1),
    wanderAngle: rand(0, Math.PI * 2),
  };
}

function makeGuard(x, y) {
  return {
    type: 'guard',
    x, y, vx: 0, vy: 0,
    w: 14, h: 14,
    hp: CONFIG.GUARD_HP,
    maxHp: CONFIG.GUARD_HP,
    angle: 0,
    attackTimer: 0,
    hurtFlash: 0,
    team: TEAM.GUARD,
    speed: CONFIG.GUARD_SPEED,
    aggroRange: CONFIG.GUARD_AGGRO_RANGE,
    attackRange: CONFIG.GUARD_ATTACK_RANGE,
    damage: CONFIG.GUARD_DAMAGE,
    wanderTimer: rand(0, 2),
    wanderAngle: rand(0, Math.PI * 2),
  };
}

function makeHorse(x, y) {
  return {
    type: 'horse',
    x, y, vx: 0, vy: 0,
    w: 20, h: 14,
    hp: CONFIG.HORSE_HP,
    maxHp: CONFIG.HORSE_HP,
    angle: rand(0, Math.PI * 2),
    team: TEAM.NEUTRAL,
    rider: null,
    wanderTimer: rand(0, 3),
    wanderAngle: rand(0, Math.PI * 2),
  };
}

function makePickup(x, y, kind) {
  return {
    type: 'pickup',
    x, y, vx: 0, vy: 0,
    w: 12, h: 12,
    kind,
    team: TEAM.NEUTRAL,
    bobPhase: rand(0, Math.PI * 2),
  };
}

function initEntities() {
  // Player starts on central plaza.
  const cx = (MAP.W / 2) * TILE;
  const cy = (MAP.H / 2) * TILE;
  state.player = makePlayer(cx, cy);
  state.entities.push(state.player);

  for (let i = 0; i < CONFIG.NUM_ORCS; i++) {
    const p = findOpenTile();
    // Orcs avoid spawning right on top of player.
    if (dist(p.x, p.y, cx, cy) < 6 * TILE) continue;
    state.entities.push(makeOrc(p.x, p.y));
  }
  for (let i = 0; i < CONFIG.NUM_GUARDS; i++) {
    const p = findOpenTile();
    state.entities.push(makeGuard(p.x, p.y));
  }
  for (let i = 0; i < CONFIG.NUM_HORSES; i++) {
    const p = findOpenRoadTile();
    state.entities.push(makeHorse(p.x, p.y));
  }
  for (let i = 0; i < CONFIG.NUM_PICKUPS; i++) {
    const p = findOpenTile();
    const kind = Math.random() < 0.55 ? 'gold' : 'lembas';
    state.entities.push(makePickup(p.x, p.y, kind));
  }
}
