// Middle-earth regions painted on top of the base (mostly grass) map.
// Each region is a roughly-circular patch with a unique ground tile and
// a small cluster of landmarks placed as BUILDING tiles so they render
// without new entity types.
const REGIONS = [
  { name: 'The Shire',  cx: 26,  cy: 26,  r: 14, tile: 'SHIRE' },
  { name: 'Rivendell',  cx: 100, cy: 22,  r: 13, tile: 'RIVENDELL' },
  { name: 'Rohan',      cx: 24,  cy: 96,  r: 16, tile: 'ROHAN' },
  { name: 'Mordor',     cx: 100, cy: 104, r: 16, tile: 'MORDOR' },
  { name: 'Fangorn',    cx: 100, cy: 62,  r: 12, tile: 'FANGORN' },
];

function regionAt(px, py) {
  const tx = px / TILE, ty = py / TILE;
  for (const r of REGIONS) {
    if (Math.hypot(tx - r.cx, ty - r.cy) < r.r) return r;
  }
  return null;
}

function _paintRegion(r) {
  const tileId = TILES[r.tile];
  for (let y = Math.max(0, r.cy - r.r); y < Math.min(MAP.H, r.cy + r.r); y++) {
    for (let x = Math.max(0, r.cx - r.r); x < Math.min(MAP.W, r.cx + r.r); x++) {
      const d = Math.hypot(x - r.cx, y - r.cy);
      if (d < r.r && state.map[y][x] === TILES.GRASS) {
        state.map[y][x] = tileId;
      }
    }
  }
}

function _paintLandmarks() {
  // Shire: 6 "hobbit holes" as small BUILDING clusters.
  const shire = REGIONS[0];
  const holes = [[-6,-2],[-3,3],[2,-4],[5,1],[-1,-5],[4,-2]];
  for (const [dx, dy] of holes) {
    const x = shire.cx + dx, y = shire.cy + dy;
    if (x >= 0 && y >= 0 && x < MAP.W && y < MAP.H) state.map[y][x] = TILES.BUILDING;
  }
  // Rivendell: four tall pavilions in a row.
  const riv = REGIONS[1];
  for (let i = -2; i <= 2; i += 2) {
    const x = riv.cx + i, y = riv.cy;
    if (x >= 0 && y >= 0 && x < MAP.W && y < MAP.H) state.map[y][x] = TILES.BUILDING;
  }
  // Rohan: Meduseld — a 3x3 hall on a small hill at region center.
  const roh = REGIONS[2];
  for (let y = roh.cy - 1; y <= roh.cy + 1; y++) {
    for (let x = roh.cx - 1; x <= roh.cx + 1; x++) {
      if (x >= 0 && y >= 0 && x < MAP.W && y < MAP.H) state.map[y][x] = TILES.BUILDING;
    }
  }
  // Mordor: Barad-dûr — a 2x4 tall tower silhouette.
  const mor = REGIONS[3];
  for (let y = mor.cy - 2; y <= mor.cy + 1; y++) {
    for (let x = mor.cx - 0; x <= mor.cx + 1; x++) {
      if (x >= 0 && y >= 0 && x < MAP.W && y < MAP.H) state.map[y][x] = TILES.WALL;
    }
  }
}

function paintRegions() {
  for (const r of REGIONS) _paintRegion(r);
  _paintLandmarks();
}

// Runs right after initMap(), before spawn.js, because map paints must
// be done before entities pick spawn tiles.
on('reset', paintRegions);

// Toast when the player crosses into a different region.
let _lastRegion = null;
function updateRegionLabel(dt) {
  const p = state.player;
  if (!p) return;
  const r = regionAt(p.x, p.y);
  const key = r ? r.name : null;
  if (key !== _lastRegion) {
    _lastRegion = key;
    if (key) toast('Entering ' + key, 3);
    else toast('Leaving the named lands', 2);
  }
}
registerUpdate(updateRegionLabel);
