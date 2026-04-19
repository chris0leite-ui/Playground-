// Thin wrapper — actual world generation lives in js/world/middleEarth.js.
function initMap() { generateWorld(); }

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
    case TILES.SHIRE: {
      ctx.fillStyle = PALETTE.shire;
      ctx.fillRect(sx, sy, TILE, TILE);
      if (((tx * 19 + ty * 13) & 7) === 0) {
        ctx.fillStyle = PALETTE.shireFlower;
        ctx.fillRect(sx + 8, sy + 6, 3, 3);
        ctx.fillRect(sx + 20, sy + 18, 3, 3);
      }
      break;
    }
    case TILES.RIVENDELL: {
      ctx.fillStyle = PALETTE.rivendell;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.strokeStyle = PALETTE.rivendellVein;
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, TILE - 1, TILE - 1);
      break;
    }
    case TILES.ROHAN: {
      ctx.fillStyle = PALETTE.rohan;
      ctx.fillRect(sx, sy, TILE, TILE);
      if (((tx * 17 + ty * 11) & 5) === 0) {
        ctx.fillStyle = PALETTE.rohanDark;
        ctx.fillRect(sx + 4, sy + 10, 4, 2);
        ctx.fillRect(sx + 16, sy + 22, 5, 2);
      }
      break;
    }
    case TILES.MORDOR: {
      ctx.fillStyle = PALETTE.mordor;
      ctx.fillRect(sx, sy, TILE, TILE);
      if (((tx * 23 + ty * 7) & 3) === 0) {
        ctx.fillStyle = PALETTE.mordorCrack;
        ctx.fillRect(sx + 6, sy + 14, 10, 2);
      }
      break;
    }
    case TILES.FANGORN: {
      ctx.fillStyle = PALETTE.fangorn;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.fangornMoss;
      ctx.fillRect(sx + 3, sy + 3, 4, 4);
      ctx.fillRect(sx + 22, sy + 20, 5, 4);
      break;
    }
    case TILES.MOUNTAIN: {
      ctx.fillStyle = PALETTE.mountain;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.mountainSnow;
      ctx.beginPath();
      ctx.moveTo(sx + TILE / 2, sy + 4);
      ctx.lineTo(sx + TILE - 4, sy + TILE - 6);
      ctx.lineTo(sx + 4, sy + TILE - 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = PALETTE.mountainDark;
      ctx.fillRect(sx + TILE - 3, sy, 3, TILE);
      break;
    }
    case TILES.FOREST: {
      ctx.fillStyle = PALETTE.forest;
      ctx.fillRect(sx, sy, TILE, TILE);
      // Scatter 2-3 small tree canopies by hash.
      const seed = (tx * 31 + ty * 17) & 15;
      const trees = 1 + (seed & 2);
      for (let i = 0; i < trees; i++) {
        const ox = 4 + ((seed * (i + 1) * 13) % 22);
        const oy = 4 + ((seed * (i + 1) * 7) % 22);
        ctx.fillStyle = PALETTE.forestTrunk;
        ctx.fillRect(sx + ox, sy + oy + 3, 2, 4);
        ctx.fillStyle = PALETTE.forestLeaf;
        ctx.beginPath();
        ctx.arc(sx + ox + 1, sy + oy + 1, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case TILES.SAND: {
      ctx.fillStyle = PALETTE.sand;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.sandDark;
      if (((tx * 29 + ty * 5) & 3) === 0) {
        ctx.fillRect(sx + 6, sy + 14, 10, 2);
        ctx.fillRect(sx + 16, sy + 22, 8, 2);
      }
      break;
    }
    case TILES.SWAMP: {
      ctx.fillStyle = PALETTE.swamp;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.swampMuck;
      ctx.beginPath();
      ctx.arc(sx + 10, sy + 10, 4, 0, Math.PI * 2);
      ctx.arc(sx + 22, sy + 22, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case TILES.BRIDGE: {
      ctx.fillStyle = PALETTE.bridge;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.bridgeTrim;
      ctx.fillRect(sx, sy, TILE, 2);
      ctx.fillRect(sx, sy + TILE - 2, TILE, 2);
      ctx.fillRect(sx + TILE / 2 - 1, sy + 4, 2, TILE - 8);
      break;
    }
  }
}

// Helper used by entity spawning to scatter units onto non-solid tiles.
function _openTileType(t) {
  return t === TILES.ROAD || t === TILES.PAVEMENT || t === TILES.GRASS
      || t === TILES.SHIRE || t === TILES.RIVENDELL || t === TILES.ROHAN
      || t === TILES.MORDOR || t === TILES.FANGORN || t === TILES.FOREST
      || t === TILES.SAND || t === TILES.SWAMP || t === TILES.BRIDGE;
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
  // With a large map, roads are a small fraction of tiles; give the search
  // a bigger budget before falling back to any open tile.
  for (let tries = 0; tries < 800; tries++) {
    const x = randInt(1, MAP.W - 4);
    const y = randInt(1, MAP.H - 2);
    if (state.map[y][x] === TILES.ROAD) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return findOpenTile();
}
