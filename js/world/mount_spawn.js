// Seed exotic mounts at worldgen time, biome-thematic: Shadowfax in
// Rohan, Ents in Fangorn, Fell Beasts near Mordor, Eagles on mountains
// (snap off-mountain to a walkable neighbour), Wargs / Mûmakil wherever.

function _findTileIn(tileValue, maxTries) {
  const tries = maxTries || 400;
  for (let i = 0; i < tries; i++) {
    const x = randInt(1, MAP.W - 2);
    const y = randInt(1, MAP.H - 2);
    if (state.map[y][x] === tileValue) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return null;
}

function _snapToWalkable(pos) {
  if (!pos) return findOpenTile();
  if (isSolidAt(pos.x, pos.y)) {
    // walk outward ring until walkable
    for (let r = 1; r <= 8; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const x = pos.x + dx * TILE, y = pos.y + dy * TILE;
          if (!isSolidAt(x, y)) return { x, y };
        }
      }
    }
    return findOpenTile();
  }
  return pos;
}

function spawnExoticMounts() {
  if (typeof makeMount !== 'function') return;
  const list = [
    { type: 'shadowfax', at: _findTileIn(TILES.ROHAN) },
    { type: 'shadowfax', at: _findTileIn(TILES.ROHAN) },
    { type: 'ent',       at: _findTileIn(TILES.FANGORN) || _findTileIn(TILES.FOREST) },
    { type: 'ent',       at: _findTileIn(TILES.FANGORN) || _findTileIn(TILES.FOREST) },
    { type: 'ent',       at: _findTileIn(TILES.FANGORN) || _findTileIn(TILES.FOREST) },
    { type: 'fellbeast', at: _findTileIn(TILES.MORDOR) },
    { type: 'eagle',     at: _findTileIn(TILES.MOUNTAIN) },
    { type: 'eagle',     at: _findTileIn(TILES.MOUNTAIN) },
    { type: 'warg',      at: null },
    { type: 'warg',      at: null },
    { type: 'warg',      at: null },
    { type: 'mumak',     at: _findTileIn(TILES.SAND) },
  ];
  for (const it of list) {
    const pos = _snapToWalkable(it.at);
    state.entities.push(makeMount(it.type, pos.x, pos.y));
  }
}
