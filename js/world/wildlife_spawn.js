// Wildlife scatter: deer prefer grassy biomes, boars like forests.

function _pickGrassyTile() {
  for (let t = 0; t < 200; t++) {
    const x = randInt(1, MAP.W - 2);
    const y = randInt(1, MAP.H - 2);
    const tile = state.map[y][x];
    if (tile === TILES.SHIRE || tile === TILES.ROHAN || tile === TILES.GRASS) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return findOpenTile();
}

function _pickForestTile() {
  for (let t = 0; t < 200; t++) {
    const x = randInt(1, MAP.W - 2);
    const y = randInt(1, MAP.H - 2);
    const tile = state.map[y][x];
    if (tile === TILES.FOREST || tile === TILES.FANGORN) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return findOpenTile();
}

function scatterWildlife() {
  if (typeof makeDeer !== 'function') return;
  for (let i = 0; i < (CONFIG.NUM_DEER || 40); i++) {
    const pos = _pickGrassyTile();
    state.entities.push(makeDeer(pos.x, pos.y));
  }
  for (let i = 0; i < (CONFIG.NUM_BOARS || 30); i++) {
    const pos = _pickForestTile();
    state.entities.push(makeBoar(pos.x, pos.y));
  }
}
