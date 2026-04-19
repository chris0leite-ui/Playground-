// Entity factory functions and initial world population. Every factory is a
// thin wrapper over makeActor (engine/actor.js).

function makePlayer(x, y) {
  return makeActor({
    type: 'player',
    x, y,
    hp: CONFIG.PLAYER_MAX_HP,
    team: TEAM.PLAYER,
    attackSwing: 0,
    onHorse: null,
    gold: 0,
    stealth: 0,   // 0..1 — raised by class (Ranger/Hobbit) via signature_ability
  });
}

function makeOrc(x, y) {
  return makeActor({
    type: 'orc',
    x, y,
    hp: CONFIG.ORC_HP,
    team: TEAM.ORC,
    speed: CONFIG.ORC_SPEED,
    aggroRange: CONFIG.ORC_AGGRO_RANGE,
    attackRange: CONFIG.ORC_ATTACK_RANGE,
    damage: CONFIG.ORC_DAMAGE,
    wanderTimer: rand(0, 1),
    wanderAngle: rand(0, Math.PI * 2),
  });
}

function makeGuard(x, y) {
  return makeActor({
    type: 'guard',
    x, y,
    hp: CONFIG.GUARD_HP,
    team: TEAM.GUARD,
    speed: CONFIG.GUARD_SPEED,
    aggroRange: CONFIG.GUARD_AGGRO_RANGE,
    attackRange: CONFIG.GUARD_ATTACK_RANGE,
    damage: CONFIG.GUARD_DAMAGE,
    wanderTimer: rand(0, 2),
    wanderAngle: rand(0, Math.PI * 2),
  });
}

function makeHorse(x, y) {
  return makeActor({
    type: 'horse',
    x, y,
    w: 20, h: 14,
    hp: CONFIG.HORSE_HP,
    team: TEAM.NEUTRAL,
    angle: rand(0, Math.PI * 2),
    rider: null,
    wanderTimer: rand(0, 3),
    wanderAngle: rand(0, Math.PI * 2),
  });
}

function makePickup(x, y, kind) {
  return makeActor({
    type: 'pickup',
    x, y,
    w: 12, h: 12,
    team: TEAM.NEUTRAL,
    kind,
    bobPhase: rand(0, Math.PI * 2),
  });
}

function initEntities() {
  // Start the player near Hobbiton. Tile (22, 34) is the Hobbiton landmark
  // centre; we place the player a few tiles south where the village road
  // reliably lands on grass/road rather than a BUILDING stamp.
  const start = (typeof LANDMARK_PX === 'function' && LANDMARK_PX('hobbiton'))
    || { x: TILE * 22, y: TILE * 34 };
  state.player = makePlayer(start.x, start.y + TILE * 4);
  state.entities.push(state.player);

  // Horses + pickups scattered across the whole world. Hostiles live in
  // js/world/enemy_scatter.js so biome weighting can steer where they
  // appear.
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
