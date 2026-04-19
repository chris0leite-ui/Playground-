// Procedural Minas Tirith map — concentric rings with eight radial roads, a
// citadel cluster, and the Anduin strip along the east edge. This is a T0
// holdover: once the content pipeline is live this whole file is replaced
// by a compiled tilemap at W.tilemaps['gondor-south.minas-tirith'].

function initMap() {
  const W = MAP.W, H = MAP.H;
  const cx = (W - 1) / 2, cy = (H - 1) / 2;
  const map = [];

  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) row.push(TILES.GRASS);
    map.push(row);
  }

  // Core circular city inside radius 18. Fill everything inside with
  // buildings, then carve roads out of it.
  const ringRadius = 18;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= ringRadius) map[y][x] = TILES.BUILDING;
    }
  }

  // Ring walls at radius ~18 (a 1-tile-thick fortification).
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d > ringRadius - 0.5 && d < ringRadius + 0.7) map[y][x] = TILES.WALL;
    }
  }

  // Concentric ROAD rings at radii 5, 9, 14. Pavement bands on either side.
  const ringRoads = [5, 9, 14];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      for (const r of ringRoads) {
        if (Math.abs(d - r) < 0.6) map[y][x] = TILES.ROAD;
        else if (Math.abs(d - r) < 1.3 && map[y][x] === TILES.BUILDING) {
          map[y][x] = TILES.PAVEMENT;
        }
      }
    }
  }

  // Eight radial spoke roads (cardinals + diagonals).
  for (let a = 0; a < 8; a++) {
    const angle = (a * Math.PI) / 4;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    for (let r = 0; r < ringRadius + 0.2; r += 0.25) {
      const x = Math.round(cx + dx * r);
      const y = Math.round(cy + dy * r);
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      if (map[y][x] !== TILES.GRASS) map[y][x] = TILES.ROAD;
    }
  }

  // Inner plaza.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d < 2.5) map[y][x] = TILES.PAVEMENT;
    }
  }

  // Citadel: a 3x3 BUILDING cluster just above center.
  const ccx = Math.round(cx);
  const ccy = Math.round(cy - 2);
  for (let y = ccy - 1; y <= ccy + 1; y++) {
    for (let x = ccx - 1; x <= ccx + 1; x++) {
      if (x >= 0 && y >= 0 && x < W && y < H) map[y][x] = TILES.BUILDING;
    }
  }

  // Guarantee a 4-way opening around the spawn tile so the player can always
  // leave the plaza — the citadel cluster above can otherwise overwrite the
  // north side of the inner plaza and box the spawn in.
  const sx = Math.round(cx), sy = Math.round(cy);
  for (const [dx, dy] of [[0,0],[1,0],[-1,0],[0,1],[0,-1],[0,-2]]) {
    const tx = sx + dx, ty = sy + dy;
    if (tx >= 0 && ty >= 0 && tx < W && ty < H) map[ty][tx] = TILES.PAVEMENT;
  }

  // Anduin river: 2-tile strip on the far east edge.
  for (let y = 0; y < H; y++) {
    for (let x = W - 2; x < W; x++) map[y][x] = TILES.WATER;
  }
  // Grass buffer one tile inside the river.
  for (let y = 0; y < H; y++) {
    if (map[y][W - 3] === TILES.BUILDING || map[y][W - 3] === TILES.WALL) {
      map[y][W - 3] = TILES.GRASS;
    }
  }

  state.map = map;
}
