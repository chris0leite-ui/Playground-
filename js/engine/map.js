// Tile rendering + spawn helpers. Map generation lives in
// engine/map_minas_tirith.js (T0 holdover) and will eventually be replaced
// by compiled per-region tilemaps at W.tilemaps[region-id].

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

function drawTile(ctx, t, sx, sy, tx, ty) {
  switch (t) {
    case TILES.GRASS: {
      ctx.fillStyle = PALETTE.grass;
      ctx.fillRect(sx, sy, TILE, TILE);
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
    case TILES.TREE: {
      ctx.fillStyle = PALETTE.grass;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = '#2a3a1a';
      ctx.beginPath();
      ctx.arc(sx + TILE / 2, sy + TILE / 2 + 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a5a2a';
      ctx.beginPath();
      ctx.arc(sx + TILE / 2 - 2, sy + TILE / 2 - 1, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

// Spawn helpers. Used by initEntities and by future scatter encounters.
function findOpenTile() {
  const w = regionW(), h = regionH();
  for (let tries = 0; tries < 200; tries++) {
    const x = randInt(1, w - 4);
    const y = randInt(1, h - 2);
    const t = state.map[y][x];
    if (t === TILES.ROAD || t === TILES.PAVEMENT || t === TILES.GRASS) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return { x: TILE * 10, y: TILE * 10 };
}

function findOpenRoadTile() {
  const w = regionW(), h = regionH();
  for (let tries = 0; tries < 200; tries++) {
    const x = randInt(1, w - 4);
    const y = randInt(1, h - 2);
    if (state.map[y][x] === TILES.ROAD) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return findOpenTile();
}
