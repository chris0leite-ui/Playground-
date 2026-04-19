// World-level enemy seeding. Called after worldgen + initEntities so that
// biome tiles exist. Each biome gets its signature mix: orcs everywhere,
// Uruks & trolls heavy in Mordor + Isengard, spiders in Mirkwood, Haradrim
// on Harad sand.

function _biomeWeight(t) {
  switch (t) {
    case TILES.MORDOR: return 14;
    case TILES.FANGORN: return 6;
    case TILES.FOREST: return 6;
    case TILES.ROHAN: return 3;
    case TILES.SWAMP: return 3;
    case TILES.GRASS: return 2;
    case TILES.SAND: return 2;
    case TILES.ROAD: return 1;
    case TILES.SHIRE: return 1;
    case TILES.RIVENDELL: return 0;
    default: return 0;
  }
}

function _pickWeightedOpenTile() {
  for (let tries = 0; tries < 400; tries++) {
    const x = randInt(1, MAP.W - 2);
    const y = randInt(1, MAP.H - 2);
    const t = state.map[y][x];
    const w = _biomeWeight(t);
    if (w <= 0) continue;
    if (Math.random() * 14 < w) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2, tile: t };
    }
  }
  const fb = findOpenTile();
  return { x: fb.x, y: fb.y, tile: TILES.GRASS };
}

// Pick an enemy factory based on the biome under a spawn point.
function _enemyForBiome(t) {
  const r = Math.random();
  if (t === TILES.MORDOR) {
    if (r < 0.35) return makeUruk;
    if (r < 0.5)  return makeTroll;
    return makeOrc;
  }
  if (t === TILES.FOREST || t === TILES.FANGORN) {
    if (r < 0.45) return makeSpider;
    if (r < 0.65) return makeUruk;
    return makeOrc;
  }
  if (t === TILES.SAND) {
    if (r < 0.55) return makeHaradrim;
    return makeOrc;
  }
  if (t === TILES.SWAMP) {
    if (r < 0.35) return makeSpider;
    return makeOrc;
  }
  if (r < 0.15) return makeUruk;
  return makeOrc;
}

function scatterEnemies() {
  const p = state.player;
  const px = p ? p.x : 0, py = p ? p.y : 0;
  for (let i = 0; i < CONFIG.NUM_ORCS; i++) {
    const pos = _pickWeightedOpenTile();
    if (dist(pos.x, pos.y, px, py) < 8 * TILE) { i--; continue; }
    const factory = _enemyForBiome(pos.tile);
    if (typeof factory === 'function') state.entities.push(factory(pos.x, pos.y));
  }
  const mt = typeof LANDMARK_PX === 'function' && LANDMARK_PX('minasTirith');
  for (let i = 0; i < CONFIG.NUM_GUARDS; i++) {
    let pos;
    if (mt && i < CONFIG.NUM_GUARDS * 0.7) {
      const ang = Math.random() * Math.PI * 2;
      const r = TILE * (4 + Math.random() * 14);
      pos = { x: mt.x + Math.cos(ang) * r, y: mt.y + Math.sin(ang) * r };
      if (isSolidAt(pos.x, pos.y)) pos = findOpenTile();
    } else {
      pos = findOpenTile();
    }
    state.entities.push(makeGuard(pos.x, pos.y));
  }
}
