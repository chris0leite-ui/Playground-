// Builds a Minas Tirith-inspired concentric map with spoke roads and an Anduin strip.

function initMap() {
  const W = MAP.W, H = MAP.H;
  const cx = (W - 1) / 2, cy = (H - 1) / 2;
  const map = [];

  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      row.push(TILES.GRASS);
    }
    map.push(row);
  }

  // Core circular city inside radius 18. Fill everything inside with buildings,
  // then carve roads out of it.
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
      // Spokes carve through buildings and walls (gates in the walls).
      if (map[y][x] !== TILES.GRASS) map[y][x] = TILES.ROAD;
    }
  }

  // Inner plaza: tiny open pavement at the very center.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d < 2.5) map[y][x] = TILES.PAVEMENT;
    }
  }

  // Citadel: a 3x3 BUILDING cluster at the top (just above center) with a
  // pavement skirt. Acts as a landmark.
  const ccx = Math.round(cx);
  const ccy = Math.round(cy - 2);
  for (let y = ccy - 1; y <= ccy + 1; y++) {
    for (let x = ccx - 1; x <= ccx + 1; x++) {
      if (x >= 0 && y >= 0 && x < W && y < H) map[y][x] = TILES.BUILDING;
    }
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

function drawMap(ctx) {
  const cam = state.camera;
  const x0 = Math.max(0, Math.floor(cam.x / TILE));
  const y0 = Math.max(0, Math.floor(cam.y / TILE));
  const x1 = Math.min(MAP.W - 1, Math.ceil((cam.x + state.viewW) / TILE));
  const y1 = Math.min(MAP.H - 1, Math.ceil((cam.y + state.viewH) / TILE));

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const t = state.map[y][x];
      const sx = x * TILE - cam.x;
      const sy = y * TILE - cam.y;
      drawTile(ctx, t, sx, sy, x, y);
    }
  }
}

function drawTile(ctx, t, sx, sy, tx, ty) {
  switch (t) {
    case TILES.GRASS: {
      ctx.fillStyle = PALETTE.grass;
      ctx.fillRect(sx, sy, TILE, TILE);
      // Sparse darker tufts (deterministic by coord).
      if (((tx * 31 + ty * 17) & 7) === 0) {
        ctx.fillStyle = PALETTE.grassDark;
        ctx.fillRect(sx + 6, sy + 8, 4, 4);
        ctx.fillRect(sx + 18, sy + 20, 3, 3);
      }
      break;
    }
    case TILES.ROAD: {
      ctx.fillStyle = PALETTE.road;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.roadLine;
      ctx.fillRect(sx + TILE / 2 - 1, sy, 2, TILE);
      break;
    }
    case TILES.PAVEMENT: {
      ctx.fillStyle = PALETTE.pavement;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, TILE - 1, TILE - 1);
      break;
    }
    case TILES.BUILDING: {
      ctx.fillStyle = PALETTE.building;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.buildingDark;
      ctx.fillRect(sx, sy, TILE, 3);
      ctx.fillRect(sx, sy + TILE - 3, TILE, 3);
      ctx.fillStyle = PALETTE.mordorBlack;
      // Window grid.
      ctx.fillRect(sx + 6, sy + 8, 4, 4);
      ctx.fillRect(sx + 18, sy + 8, 4, 4);
      ctx.fillRect(sx + 6, sy + 20, 4, 4);
      ctx.fillRect(sx + 18, sy + 20, 4, 4);
      break;
    }
    case TILES.WATER: {
      ctx.fillStyle = PALETTE.anduin;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.anduinFoam;
      const phase = (state.time * 30 + tx * 7 + ty * 5) % TILE;
      ctx.fillRect(sx + phase, sy + 10, 6, 2);
      ctx.fillRect(sx + (phase + 16) % TILE, sy + 22, 4, 2);
      break;
    }
    case TILES.WALL: {
      ctx.fillStyle = PALETTE.wall;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.wallDark;
      ctx.fillRect(sx, sy + TILE - 6, TILE, 6);
      ctx.fillRect(sx, sy, 3, TILE);
      break;
    }
  }
}

// Helper used by entity spawning to scatter units onto non-solid tiles.
function findOpenTile() {
  for (let tries = 0; tries < 200; tries++) {
    const x = randInt(1, MAP.W - 4);
    const y = randInt(1, MAP.H - 2);
    const t = state.map[y][x];
    if (t === TILES.ROAD || t === TILES.PAVEMENT || t === TILES.GRASS) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return { x: TILE * 10, y: TILE * 10 };
}

function findOpenRoadTile() {
  for (let tries = 0; tries < 200; tries++) {
    const x = randInt(1, MAP.W - 4);
    const y = randInt(1, MAP.H - 2);
    if (state.map[y][x] === TILES.ROAD) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return findOpenTile();
}
