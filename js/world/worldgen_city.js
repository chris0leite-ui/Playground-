// Minas Tirith concentric-city stamp. Split out of worldgen_landmarks.js
// so each file stays within the content-file budget.

function buildConcentricCity(cx, cy, ringRadius) {
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= ringRadius) _wgSet(x, y, TILES.BUILDING);
    }
  }
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d > ringRadius - 0.5 && d < ringRadius + 0.7) _wgSet(x, y, TILES.WALL);
    }
  }
  const ringRoads = [5, 9, 14];
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      for (const r of ringRoads) {
        if (Math.abs(d - r) < 0.6) state.map[y][x] = TILES.ROAD;
        else if (Math.abs(d - r) < 1.3 && _wgGet(x, y) === TILES.BUILDING) {
          state.map[y][x] = TILES.PAVEMENT;
        }
      }
    }
  }
  for (let a = 0; a < 8; a++) {
    const angle = (a * Math.PI) / 4;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    for (let r = 0; r < ringRadius + 0.2; r += 0.25) {
      const x = Math.round(cx + dx * r);
      const y = Math.round(cy + dy * r);
      if (!_wgInBounds(x, y)) continue;
      if (state.map[y][x] !== TILES.GRASS) state.map[y][x] = TILES.ROAD;
    }
  }
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d < 2.5) _wgSet(x, y, TILES.PAVEMENT);
    }
  }
  // Keep the 4-way opening around spawn — small but guaranteed escape.
  const sx = Math.round(cx), sy = Math.round(cy);
  for (const [dx, dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]) {
    _wgSet(sx + dx, sy + dy, TILES.PAVEMENT);
  }
}
