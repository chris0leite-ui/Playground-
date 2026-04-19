// Region abstraction. A region owns a tilemap + its entities. The engine
// reads/writes the "current" region via `state.region`; `state.map` and
// `state.entities` remain as alias pointers for back-compat.

function regionW() { return state.region ? state.region.w : MAP.W; }
function regionH() { return state.region ? state.region.h : MAP.H; }

function makeRegion(id, w, h, tilemap, def) {
  return { id, w, h, tilemap, entities: [], def: def || {} };
}

function unloadRegion(prev) {
  if (!prev) return;
  // Entities live inside the region object, so nothing to stash yet.
  // Edge-transition memoing (T0.8) will extend this.
}

function loadRegion(id) {
  const region = state.world.regions[id];
  if (!region) throw new Error('unknown region: ' + id);
  unloadRegion(state.region);
  state.world.currentRegionId = id;
  state.region = region;
  state.map = region.tilemap;          // shim alias
  state.entities = region.entities;    // shim alias
}

// Called from updatePlayer after tryMove. If the player is flush against
// a region boundary and still pushing into it, cross into the matching
// neighbor (if one is registered).
function maybeEdgeTransition(p, inputDx, inputDy) {
  if (!state.region || !state.region.def) return false;
  const neighbors = state.region.def.neighbors || {};
  const halfW = p.w / 2, halfH = p.h / 2;
  const wPx = regionW() * TILE, hPx = regionH() * TILE;

  let dir = null;
  if (inputDx < -0.3 && p.x <= halfW + 2) dir = 'west';
  else if (inputDx > 0.3 && p.x >= wPx - halfW - 2) dir = 'east';
  else if (inputDy < -0.3 && p.y <= halfH + 2) dir = 'north';
  else if (inputDy > 0.3 && p.y >= hPx - halfH - 2) dir = 'south';
  if (!dir) return false;

  const neighborId = neighbors[dir];
  if (!neighborId || !state.world.regions[neighborId]) {
    if (typeof showToast === 'function') showToast('The path leads nowhere.');
    return false;
  }

  transitionToRegion(neighborId, dir, p);
  return true;
}

function transitionToRegion(neighborId, fromDir, p) {
  const prev = state.region;
  if (prev) {
    const idx = prev.entities.indexOf(p);
    if (idx >= 0) prev.entities.splice(idx, 1);
  }
  loadRegion(neighborId);
  const halfW = p.w / 2, halfH = p.h / 2;
  const wPx = regionW() * TILE, hPx = regionH() * TILE;
  if (fromDir === 'west')       p.x = wPx - halfW - 4;
  else if (fromDir === 'east')  p.x = halfW + 4;
  else if (fromDir === 'north') p.y = hPx - halfH - 4;
  else if (fromDir === 'south') p.y = halfH + 4;
  if (fromDir === 'west' || fromDir === 'east') {
    p.y = clamp(p.y, halfH + 1, hPx - halfH - 1);
  } else {
    p.x = clamp(p.x, halfW + 1, wPx - halfW - 1);
  }
  ensureWalkable(p, fromDir);
  if (!state.entities.includes(p)) state.entities.push(p);
  state.player = p;
  state.flags['region_visited:' + neighborId] = true;
  eventBus.emit('region_entered', neighborId);
}

// If the spawn tile (or the player's body) sits on a solid tile — walls on
// an edge, a pond, etc. — slide the player along the entry edge, then scan
// inward, until a clear tile is found. Prevents transitions from trapping
// the player against a decorative wall.
function ensureWalkable(p, fromDir) {
  if (!isSolidAt(p.x, p.y)) return;
  const halfW = p.w / 2, halfH = p.h / 2;
  const wPx = regionW() * TILE, hPx = regionH() * TILE;
  const edgeAxis = (fromDir === 'west' || fromDir === 'east') ? 'y' : 'x';
  const origX = p.x, origY = p.y;
  for (let slide = TILE; slide < TILE * 24; slide += TILE) {
    for (const sign of [-1, 1]) {
      if (edgeAxis === 'y') p.y = clamp(origY + sign * slide, halfH + 1, hPx - halfH - 1);
      else                  p.x = clamp(origX + sign * slide, halfW + 1, wPx - halfW - 1);
      if (!isSolidAt(p.x, p.y)) return;
    }
    p.x = origX; p.y = origY;
  }
  // Last resort: walk perpendicular inward a few tiles.
  for (let push = TILE; push < TILE * 12; push += TILE) {
    if (fromDir === 'west')       p.x = origX + push;
    else if (fromDir === 'east')  p.x = origX - push;
    else if (fromDir === 'north') p.y = origY + push;
    else if (fromDir === 'south') p.y = origY - push;
    p.x = clamp(p.x, halfW + 1, wPx - halfW - 1);
    p.y = clamp(p.y, halfH + 1, hPx - halfH - 1);
    if (!isSolidAt(p.x, p.y)) return;
  }
}

// T0.2: one hardcoded region wraps the existing Minas Tirith map.
// Future regions will be registered from compiled world data (W.regions).
function initDefaultRegion() {
  initMap(); // fills state.map with the procedural city
  const region = makeRegion('minas-tirith', MAP.W, MAP.H, state.map, {
    name: 'Minas Tirith',
    spawn_point: { x: (MAP.W / 2) * TILE, y: (MAP.H / 2) * TILE },
    neighbors: { west: 'rohan', east: 'gondor-south' },
    overworld_pos: { x: 12, y: 13 },
  });
  state.world.regions[region.id] = region;
  loadRegion(region.id);
}
