// Biome-blob painter. Each blob fills its rect with a biome tile, with a
// deterministic jitter along the edges so boundaries aren't ruler-straight.

function _wgInBounds(x, y) { return x >= 0 && y >= 0 && x < MAP.W && y < MAP.H; }
function _wgSet(x, y, t) { if (_wgInBounds(x, y)) state.map[y][x] = t; }
function _wgGet(x, y) { return _wgInBounds(x, y) ? state.map[y][x] : TILES.GRASS; }

function _paintBlob(x0, y0, x1, y1, tile, jitter) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!_wgInBounds(x, y)) continue;
      if (state.map[y][x] !== TILES.GRASS) continue;
      const edgeDist = Math.min(x - x0, x1 - x, y - y0, y1 - y);
      if (edgeDist < jitter) {
        const n = ((x * 73856093) ^ (y * 19349663)) & 7;
        if (n < 4 - edgeDist) continue;
      }
      state.map[y][x] = tile;
    }
  }
}

function paintBiomes() {
  _paintBlob(  0,   0,  60,  55, TILES.SHIRE,     3);
  _paintBlob(180,   0, 319,  95, TILES.FOREST,    4);   // Mirkwood
  _paintBlob(110, 115, 160, 160, TILES.FANGORN,   3);
  _paintBlob(  0, 110,  95, 175, TILES.ROHAN,     3);
  _paintBlob(215, 125, 315, 180, TILES.MORDOR,    2);
  _paintBlob(  0, 180, 319, 191, TILES.SAND,      1);
  _paintBlob(110,  25, 130,  40, TILES.RIVENDELL, 2);
  _paintBlob(195, 130, 214, 170, TILES.SWAMP,     1);
}

// Turn ~18% of FOREST / FANGORN tiles into decorative TREE tiles.
// Deterministic by coordinate hash so regen is stable. Trees are
// non-solid (see util.isSolidTile) so they don't trap the player.
function scatterTrees() {
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const t = state.map[y][x];
      if (t !== TILES.FOREST && t !== TILES.FANGORN) continue;
      const n = ((x * 73856093) ^ (y * 83492791)) & 31;
      if (n < 6) state.map[y][x] = TILES.TREE;
    }
  }
}

// Name of the biome under a pixel coordinate — used by the HUD title.
function biomeNameAt(px, py) {
  const tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
  if (tx < 0 || ty < 0 || tx >= MAP.W || ty >= MAP.H) return 'Middle-earth';
  const t = state.map[ty][tx];
  const names = {
    [TILES.SHIRE]: 'The Shire',
    [TILES.RIVENDELL]: 'Rivendell',
    [TILES.ROHAN]: 'The Riddermark',
    [TILES.MORDOR]: 'Mordor',
    [TILES.FANGORN]: 'Fangorn',
    [TILES.FOREST]: 'The Greenwood',
    [TILES.SAND]: 'Harad',
    [TILES.SWAMP]: 'Dead Marshes',
    [TILES.MOUNTAIN]: 'Misty Mountains',
    [TILES.WATER]: 'The Anduin',
    [TILES.BRIDGE]: 'The Anduin',
  };
  return names[t] || 'Middle-earth';
}
