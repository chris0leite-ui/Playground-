// Region-aware initial spawn and respawn top-up.
// The base NUM_* counts still apply; this module handles the two new
// biome-specific enemy types (spiders, haradrim) and biases orc respawns
// toward Mordor/Mirkwood.
function _spawnRegionalInitial() {
  // Spiders cluster inside Mirkwood tiles.
  for (let i = 0; i < CONFIG.NUM_SPIDERS; i++) {
    const p = _findTileIn(TILES.FOREST);
    if (p) state.entities.push(makeSpider(p.x, p.y));
  }
  for (let i = 0; i < CONFIG.NUM_HARADRIM; i++) {
    const p = _findTileIn(TILES.SAND);
    if (p) state.entities.push(makeHaradrim(p.x, p.y));
  }
}

function _findTileIn(targetTile) {
  for (let tries = 0; tries < 400; tries++) {
    const x = randInt(1, MAP.W - 2);
    const y = randInt(1, MAP.H - 2);
    if (state.map[y][x] === targetTile) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return null;
}

on('reset', _spawnRegionalInitial);

// Respawn top-up: every 5s, if below baseline, drop one in its native biome.
let _regionRespawnT = 5;
function _tickRegionRespawn(dt) {
  _regionRespawnT -= dt;
  if (_regionRespawnT > 0) return;
  _regionRespawnT = 5;
  let spiders = 0, haradrim = 0;
  for (const e of state.entities) {
    if (e.type === 'spider') spiders++;
    else if (e.type === 'haradrim') haradrim++;
  }
  const player = state.player;
  if (!player) return;
  if (spiders < CONFIG.NUM_SPIDERS) {
    const p = _findTileIn(TILES.FOREST);
    if (p && dist(p.x, p.y, player.x, player.y) > 320) state.entities.push(makeSpider(p.x, p.y));
  }
  if (haradrim < CONFIG.NUM_HARADRIM) {
    const p = _findTileIn(TILES.SAND);
    if (p && dist(p.x, p.y, player.x, player.y) > 320) state.entities.push(makeHaradrim(p.x, p.y));
  }
}
registerUpdate(_tickRegionRespawn);
