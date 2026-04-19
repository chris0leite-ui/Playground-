// Middle-earth worldgen. Replaces the old concentric-only initMap by
// painting biome blobs, carving the Anduin, raising the Misty Mountains,
// fencing Mordor, building Minas Tirith, and stamping every named
// landmark from LANDMARKS.
//
// All coordinates here are TILE coordinates unless suffixed _px.

function _inBounds(x, y) { return x >= 0 && y >= 0 && x < MAP.W && y < MAP.H; }
function _set(x, y, t) { if (_inBounds(x, y)) state.map[y][x] = t; }
function _get(x, y) { return _inBounds(x, y) ? state.map[y][x] : TILES.GRASS; }

function _paintRect(x0, y0, x1, y1, tile) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (_inBounds(x, y) && state.map[y][x] === TILES.GRASS) state.map[y][x] = tile;
    }
  }
}

// Deterministic edge jitter: for edge tiles, flip a pseudo-random coin so
// biome boundaries aren't perfectly straight.
function _paintBlob(x0, y0, x1, y1, tile, jitter) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!_inBounds(x, y)) continue;
      if (state.map[y][x] !== TILES.GRASS) continue;
      const edgeDist = Math.min(x - x0, x1 - x, y - y0, y1 - y);
      if (edgeDist < jitter) {
        // Deterministic noise.
        const n = ((x * 73856093) ^ (y * 19349663)) & 7;
        if (n < 4 - edgeDist) continue;
      }
      state.map[y][x] = tile;
    }
  }
}

function _carveAnduin() {
  // Winding 2-tile-wide river from top to bottom around x=170.
  for (let y = 0; y < MAP.H; y++) {
    const baseX = 170 + Math.round(Math.sin(y * 0.11) * 5 + Math.sin(y * 0.33) * 3);
    _set(baseX,     y, TILES.WATER);
    _set(baseX - 1, y, TILES.WATER);
  }
}

function _carveMistyMountains() {
  // Vertical spine at x=95..106 with two gaps (High Pass, Moria East-gate).
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 95; x <= 106; x++) {
      const highPass = (y >= 40 && y <= 44) && (x >= 98 && x <= 103);
      const moriaGap = (y >= 68 && y <= 72) && (x >= 99 && x <= 104);
      if (highPass || moriaGap) _set(x, y, TILES.ROAD);
      else _set(x, y, TILES.MOUNTAIN);
    }
  }
}

function _fenceMordor() {
  // Mountain wall around Mordor box. Gaps: Black Gate (top), Cirith Ungol (west).
  const x0 = 215, x1 = 315, y0 = 128, y1 = 180;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const onEdge = (x === x0 || x === x1 || y === y0 || y === y1);
      if (!onEdge) continue;
      const isBlackGate  = (y === y0 && x >= 230 && x <= 235);
      const isCirithUng  = (x === x0 && y >= 148 && y <= 152);
      if (isBlackGate || isCirithUng) _set(x, y, TILES.ROAD);
      else _set(x, y, TILES.MOUNTAIN);
    }
  }
}

function _buildConcentricCity(cx, cy, ringRadius) {
  // Fill circle with BUILDING.
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= ringRadius) _set(x, y, TILES.BUILDING);
    }
  }
  // Ring wall at the edge.
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d > ringRadius - 0.5 && d < ringRadius + 0.7) _set(x, y, TILES.WALL);
    }
  }
  // Concentric ring roads at r = 5, 9, 14.
  const ringRoads = [5, 9, 14];
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      for (const r of ringRoads) {
        if (Math.abs(d - r) < 0.6) state.map[y] && (state.map[y][x] = TILES.ROAD);
        else if (Math.abs(d - r) < 1.3 && _get(x, y) === TILES.BUILDING) {
          state.map[y][x] = TILES.PAVEMENT;
        }
      }
    }
  }
  // Eight radial spokes.
  for (let a = 0; a < 8; a++) {
    const angle = (a * Math.PI) / 4;
    const dx = Math.cos(angle), dy = Math.sin(angle);
    for (let r = 0; r < ringRadius + 0.2; r += 0.25) {
      const x = Math.round(cx + dx * r);
      const y = Math.round(cy + dy * r);
      if (!_inBounds(x, y)) continue;
      if (state.map[y][x] !== TILES.GRASS) state.map[y][x] = TILES.ROAD;
    }
  }
  // Inner plaza.
  for (let y = 0; y < MAP.H; y++) {
    for (let x = 0; x < MAP.W; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d < 2.5) _set(x, y, TILES.PAVEMENT);
    }
  }
  // Citadel cluster just above centre.
  for (let y = cy - 3; y <= cy - 1; y++) {
    for (let x = cx - 1; x <= cx + 1; x++) _set(x, y, TILES.BUILDING);
  }
}

function _placeLandmark(L) {
  const { tx, ty, style } = L;
  switch (style) {
    case 'village':
      // 4-6 scattered buildings.
      const huts = [[-3,-1],[-1,2],[2,-2],[3,1],[-2,-3],[1,3]];
      for (const [dx, dy] of huts) _set(tx + dx, ty + dy, TILES.BUILDING);
      break;
    case 'pavilion':
      // Row of 4 tall pavilions.
      for (let dx = -3; dx <= 3; dx += 2) _set(tx + dx, ty, TILES.BUILDING);
      for (let dx = -2; dx <= 2; dx += 2) _set(tx + dx, ty + 1, TILES.PAVEMENT);
      break;
    case 'ruin':
      // Broken walls.
      _set(tx - 1, ty, TILES.WALL); _set(tx + 1, ty, TILES.WALL);
      _set(tx, ty - 1, TILES.WALL); _set(tx - 2, ty + 1, TILES.WALL);
      break;
    case 'tower':
      // Orthanc / Isengard — single tall WALL stack.
      for (let dy = -3; dy <= 0; dy++) {
        _set(tx,     ty + dy, TILES.WALL);
        _set(tx + 1, ty + dy, TILES.WALL);
      }
      // Moat/stonework ring.
      for (let dx = -2; dx <= 3; dx++) { _set(tx + dx, ty + 1, TILES.PAVEMENT); }
      break;
    case 'fortress':
      // Small walled fort.
      for (let dy = -2; dy <= 2; dy++) {
        _set(tx - 2, ty + dy, TILES.WALL);
        _set(tx + 2, ty + dy, TILES.WALL);
      }
      for (let dx = -2; dx <= 2; dx++) {
        _set(tx + dx, ty - 2, TILES.WALL);
        _set(tx + dx, ty + 2, TILES.WALL);
      }
      _set(tx, ty, TILES.BUILDING);
      break;
    case 'hall':
      // 3x3 BUILDING, Meduseld style.
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) _set(tx + dx, ty + dy, TILES.BUILDING);
      }
      break;
    case 'cavegate':
      // Mountain gap lined with walls.
      for (let dy = -1; dy <= 1; dy++) {
        _set(tx - 2, ty + dy, TILES.WALL);
        _set(tx + 2, ty + dy, TILES.WALL);
      }
      _set(tx, ty, TILES.PAVEMENT);
      break;
    case 'glade':
      // Clearing — central PAVEMENT dot.
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) _set(tx + dx, ty + dy, TILES.PAVEMENT);
      break;
    case 'spire':
    case 'spire-evil':
      // Tall 2x5 WALL tower.
      for (let dy = -4; dy <= 0; dy++) {
        _set(tx,     ty + dy, TILES.WALL);
        _set(tx + 1, ty + dy, TILES.WALL);
      }
      break;
    case 'gatewall':
      // Black Gate — stretched wall with a road in the middle.
      for (let dx = -4; dx <= 4; dx++) {
        if (Math.abs(dx) > 1) _set(tx + dx, ty, TILES.WALL);
        else _set(tx + dx, ty, TILES.ROAD);
      }
      break;
    case 'mountain-hall':
      // Erebor — carved into mountain, a 3-tile hall front.
      for (let dx = -1; dx <= 1; dx++) _set(tx + dx, ty, TILES.BUILDING);
      for (let dx = -2; dx <= 2; dx++) _set(tx + dx, ty - 1, TILES.MOUNTAIN);
      for (let dx = -3; dx <= 3; dx++) _set(tx + dx, ty - 2, TILES.MOUNTAIN);
      break;
    case 'volcano':
      // Mount Doom — circular mountain with crater centre.
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const d = Math.hypot(dx, dy);
          if (d > 3) continue;
          if (d < 1.5) _set(tx + dx, ty + dy, TILES.MORDOR);
          else _set(tx + dx, ty + dy, TILES.MOUNTAIN);
        }
      }
      break;
    case 'concentric':
      _buildConcentricCity(tx, ty, 18);
      break;
  }
}

function _placeBridges() {
  // Find a river tile near each bridge y and convert it + its neighbour to
  // BRIDGE. Also widen the bridge over a few adjacent tiles.
  const bridges = [
    { y: 50,  name: 'Old Ford' },
    { y: 150, name: 'Osgiliath' },
    { y: 100, name: 'Rauros crossing' },
  ];
  for (const b of bridges) {
    for (let y = b.y - 1; y <= b.y + 1; y++) {
      for (let x = 0; x < MAP.W; x++) {
        if (_get(x, y) === TILES.WATER) _set(x, y, TILES.BRIDGE);
      }
    }
  }
}

function _paintBiomes() {
  // Everything starts as GRASS. Paint biomes in order; later paints only
  // affect tiles still GRASS so the Anduin & mountains (carved next) win.
  _paintBlob(  0,   0,  60,  55, TILES.SHIRE,   3);
  _paintBlob(180,   0, 319,  95, TILES.FOREST,  4);  // Mirkwood
  _paintBlob(110, 115, 160, 160, TILES.FANGORN, 3);
  _paintBlob(  0, 110,  95, 175, TILES.ROHAN,   3);
  _paintBlob(215, 125, 315, 180, TILES.MORDOR,  2);
  _paintBlob(  0, 180, 319, 191, TILES.SAND,    1);
  _paintBlob(110,  25, 130,  40, TILES.RIVENDELL, 2);
  // Dead Marshes between Mordor and the river.
  _paintBlob(195, 130, 214, 170, TILES.SWAMP,   1);
}

function generateWorld() {
  const W = MAP.W, H = MAP.H;
  state.map = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) row.push(TILES.GRASS);
    state.map.push(row);
  }
  _paintBiomes();
  _carveAnduin();
  _carveMistyMountains();
  _fenceMordor();
  // Build Minas Tirith first so landmark stamps can overlay.
  _placeLandmark(LANDMARKS.minasTirith);
  for (const key in LANDMARKS) {
    if (key === 'minasTirith') continue;
    _placeLandmark(LANDMARKS[key]);
  }
  _placeBridges();
}
