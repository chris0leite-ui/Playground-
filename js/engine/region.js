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

// T0.2: one hardcoded region wraps the existing Minas Tirith map.
// Future regions will be registered from compiled world data (W.regions).
function initDefaultRegion() {
  initMap(); // fills state.map with the procedural city
  const region = makeRegion('minas-tirith', MAP.W, MAP.H, state.map, {
    spawn_point: { x: (MAP.W / 2) * TILE, y: (MAP.H / 2) * TILE },
    neighbors: {},
  });
  state.world.regions[region.id] = region;
  loadRegion(region.id);
}
