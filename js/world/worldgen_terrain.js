// Rivers, mountains, bridges. Runs AFTER paintBiomes so water/mountain
// can overwrite biome tiles. Helper _wgSet/_wgGet/_wgInBounds come from
// worldgen_biomes.js.

function carveAnduin() {
  for (let y = 0; y < MAP.H; y++) {
    const baseX = 170 + Math.round(Math.sin(y * 0.11) * 5 + Math.sin(y * 0.33) * 3);
    _wgSet(baseX,     y, TILES.WATER);
    _wgSet(baseX - 1, y, TILES.WATER);
  }
}

function carveMistyMountains() {
  // Vertical spine y=0..115. Two gaps: High Pass + Moria East-gate.
  for (let y = 0; y < 115; y++) {
    for (let x = 95; x <= 106; x++) {
      const highPass  = (y >= 40 && y <= 44) && (x >= 98 && x <= 103);
      const moriaGap  = (y >= 68 && y <= 72) && (x >= 99 && x <= 104);
      if (highPass || moriaGap) _wgSet(x, y, TILES.ROAD);
      else _wgSet(x, y, TILES.MOUNTAIN);
    }
  }
}

function fenceMordor() {
  const x0 = 215, x1 = 315, y0 = 128, y1 = 180;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const onEdge = (x === x0 || x === x1 || y === y0 || y === y1);
      if (!onEdge) continue;
      const isBlackGate = (y === y0 && x >= 230 && x <= 235);
      const isCirithUng = (x === x0 && y >= 148 && y <= 152);
      if (isBlackGate || isCirithUng) _wgSet(x, y, TILES.ROAD);
      else _wgSet(x, y, TILES.MOUNTAIN);
    }
  }
}

function placeBridges() {
  const bridges = [50, 100, 150];
  for (const by of bridges) {
    for (let y = by - 1; y <= by + 1; y++) {
      for (let x = 0; x < MAP.W; x++) {
        if (_wgGet(x, y) === TILES.WATER) _wgSet(x, y, TILES.BRIDGE);
      }
    }
  }
}

// Draws a ROAD along a line, hopping over water via BRIDGE and skipping
// mountains / buildings / walls so landmark structures aren't clobbered.
function carveRoadLine(x0, y0, x1, y1) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  if (steps === 0) return;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    if (!_wgInBounds(x, y)) continue;
    const cur = state.map[y][x];
    if (cur === TILES.WATER) _wgSet(x, y, TILES.BRIDGE);
    else if (cur === TILES.MOUNTAIN || cur === TILES.BUILDING || cur === TILES.WALL) continue;
    else _wgSet(x, y, TILES.ROAD);
  }
}
