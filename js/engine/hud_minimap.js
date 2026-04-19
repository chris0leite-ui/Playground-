// Minimap — cached low-res render of the whole world + overlay dots.
// Rebuilt once per reset, blitted every frame. Per-frame draw lives in
// engine/hud_minimap_draw.js to respect the 150-line budget.

const MINIMAP = {
  w: 160, h: 96, scale: 0,
  cache: null,
  x: 0, y: 0,       // top-left screen position (updated each draw)
  cw: 0, ch: 0,
};

function _minimapTileColor(t) {
  switch (t) {
    case TILES.GRASS:     return '#3a5f3a';
    case TILES.ROAD:      return '#6a5a3a';
    case TILES.PAVEMENT:  return '#8a8a88';
    case TILES.BUILDING:  return '#d8d0b8';
    case TILES.WATER:     return '#2a4a7a';
    case TILES.WALL:      return '#5a5550';
    case TILES.SHIRE:     return '#5a8a3a';
    case TILES.RIVENDELL: return '#c8cec8';
    case TILES.ROHAN:     return '#9a8a4a';
    case TILES.MORDOR:    return '#2a241e';
    case TILES.FANGORN:   return '#1a2a18';
    case TILES.MOUNTAIN:  return '#7a7068';
    case TILES.FOREST:    return '#1a2a18';
    case TILES.SAND:      return '#d4b880';
    case TILES.SWAMP:     return '#3a4830';
    case TILES.BRIDGE:    return '#7a6a4a';
    case TILES.TREE:      return '#1a2a18';
  }
  return '#000';
}

function buildMinimapCache() {
  MINIMAP.scale = Math.min(MINIMAP.w / MAP.W, MINIMAP.h / MAP.H);
  const cw = Math.ceil(MAP.W * MINIMAP.scale);
  const ch = Math.ceil(MAP.H * MINIMAP.scale);
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const cx = c.getContext('2d');
  cx.imageSmoothingEnabled = false;
  const img = cx.createImageData(cw, ch);
  for (let py = 0; py < ch; py++) {
    for (let px = 0; px < cw; px++) {
      const tx = Math.floor(px / MINIMAP.scale);
      const ty = Math.floor(py / MINIMAP.scale);
      const t = (state.map[ty] && state.map[ty][tx] !== undefined) ? state.map[ty][tx] : 0;
      const col = _minimapTileColor(t);
      const r = parseInt(col.slice(1, 3), 16);
      const g = parseInt(col.slice(3, 5), 16);
      const b = parseInt(col.slice(5, 7), 16);
      const i = (py * cw + px) * 4;
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
    }
  }
  cx.putImageData(img, 0, 0);
  MINIMAP.cache = c;
  MINIMAP.cw = cw; MINIMAP.ch = ch;
}

function invalidateMinimap() { MINIMAP.cache = null; }

// Translate a screen-space (client) point into a world-tile position if
// it's inside the minimap, or null otherwise. Used to let the player tap
// the minimap to set state.waypoint.
function minimapTapToWaypoint(clientX, clientY) {
  if (!MINIMAP.cache) return null;
  const rect = state.canvas.getBoundingClientRect();
  const sx = clientX - rect.left;
  const sy = clientY - rect.top;
  const x0 = MINIMAP.x, y0 = MINIMAP.y;
  if (sx < x0 || sy < y0 || sx > x0 + MINIMAP.cw || sy > y0 + MINIMAP.ch) return null;
  const tx = (sx - x0) / MINIMAP.scale;
  const ty = (sy - y0) / MINIMAP.scale;
  return { x: tx * TILE, y: ty * TILE };
}

function bindMinimapTaps() {
  if (!state.canvas) return;
  const set = (cx, cy) => {
    const wp = minimapTapToWaypoint(cx, cy);
    if (wp) state.waypoint = wp;
    return !!wp;
  };
  state.canvas.addEventListener('mousedown', (e) => {
    if (set(e.clientX, e.clientY)) e.preventDefault();
  });
  state.canvas.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    if (set(t.clientX, t.clientY)) e.preventDefault();
  }, { passive: false });
}
