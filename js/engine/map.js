// Tile rendering + spawn helpers. World generation lives in
// js/world/worldgen*.js. Per-tile draw cases are split into
// engine/map_tiles.js to respect the 150-line engine budget.

function drawMap(ctx) {
  const cam = state.camera;
  const w = regionW(), h = regionH();
  const x0 = Math.max(0, Math.floor(cam.x / TILE));
  const y0 = Math.max(0, Math.floor(cam.y / TILE));
  const x1 = Math.min(w - 1, Math.ceil((cam.x + state.viewW) / TILE));
  const y1 = Math.min(h - 1, Math.ceil((cam.y + state.viewH) / TILE));

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const t = state.map[y][x];
      const sx = x * TILE - cam.x;
      const sy = y * TILE - cam.y;
      drawTile(ctx, t, sx, sy, x, y);
    }
  }
}

function _openTileType(t) {
  return t === TILES.ROAD || t === TILES.PAVEMENT || t === TILES.GRASS
      || t === TILES.SHIRE || t === TILES.RIVENDELL || t === TILES.ROHAN
      || t === TILES.MORDOR || t === TILES.FANGORN || t === TILES.FOREST
      || t === TILES.SAND || t === TILES.SWAMP || t === TILES.BRIDGE
      || t === TILES.DUNGEON_FLOOR || t === TILES.TREE;
}

function findOpenTile() {
  for (let tries = 0; tries < 200; tries++) {
    const x = randInt(1, MAP.W - 4);
    const y = randInt(1, MAP.H - 2);
    if (_openTileType(state.map[y][x])) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return { x: TILE * 10, y: TILE * 10 };
}

function findOpenRoadTile() {
  for (let tries = 0; tries < 800; tries++) {
    const x = randInt(1, MAP.W - 4);
    const y = randInt(1, MAP.H - 2);
    if (state.map[y][x] === TILES.ROAD) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return findOpenTile();
}
