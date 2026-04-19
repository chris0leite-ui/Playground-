// Minimap: a cached low-res render of the whole world, blitted every frame
// with overlay dots for the player, all landmarks, the camera viewport, and
// the current quest target. Rebuilt once per reset; cheap to draw.
const MINIMAP = {
  canvas: null,
  ctx: null,
  w: 160,
  h: 96,
  scale: 0,
  cache: null,   // offscreen canvas containing the static tile draw
  cacheCtx: null,
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
  }
  return '#000';
}

function _buildMinimapCache() {
  MINIMAP.scale = Math.min(MINIMAP.w / MAP.W, MINIMAP.h / MAP.H);
  const cw = Math.ceil(MAP.W * MINIMAP.scale);
  const ch = Math.ceil(MAP.H * MINIMAP.scale);
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const cx = c.getContext('2d');
  cx.imageSmoothingEnabled = false;
  // ImageData pixel blit for speed.
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
  MINIMAP.cacheCtx = cx;
}

function _drawMinimap(ctx) {
  if (!MINIMAP.cache) _buildMinimapCache();
  const s = MINIMAP.scale;
  const cw = MINIMAP.cache.width;
  const ch = MINIMAP.cache.height;
  // Anchor top-right with a small inset under the HUD top row.
  const x0 = state.viewW - cw - 10;
  const y0 = 82;

  ctx.save();
  // Frame
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x0 - 2, y0 - 2, cw + 4, ch + 4);
  ctx.strokeStyle = PALETTE.gondorGold;
  ctx.lineWidth = 1;
  ctx.strokeRect(x0 - 2 + 0.5, y0 - 2 + 0.5, cw + 4 - 1, ch + 4 - 1);
  ctx.drawImage(MINIMAP.cache, x0, y0);

  // Landmark dots + labels for major ones (surface only).
  if (state.location !== 'moria') {
    for (const key in LANDMARKS) {
      const L = LANDMARKS[key];
      const mx = x0 + L.tx * s;
      const my = y0 + L.ty * s;
      ctx.fillStyle = PALETTE.gondorGold;
      ctx.fillRect(mx - 1, my - 1, 3, 3);
    }
  }

  // Viewport rectangle.
  const vx = x0 + (state.camera.x / TILE) * s;
  const vy = y0 + (state.camera.y / TILE) * s;
  const vw = (state.viewW / TILE) * s;
  const vh = (state.viewH / TILE) * s;
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1;
  ctx.strokeRect(vx, vy, vw, vh);

  // Player dot (pulsing gold).
  const p = state.player;
  if (p) {
    const px = x0 + (p.x / TILE) * s;
    const py = y0 + (p.y / TILE) * s;
    const pulse = 0.6 + Math.sin(state.time * 4) * 0.3;
    ctx.fillStyle = `rgba(255,240,120,${pulse})`;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Quest target (red dot) — suppress inside the Moria dungeon since quest
  // waypoints are surface-space.
  if (state.location !== 'moria' && typeof _activeQuestTarget === 'function') {
    const tgt = _activeQuestTarget();
    if (tgt) {
      const tx = x0 + (tgt.x / TILE) * s;
      const ty = y0 + (tgt.y / TILE) * s;
      ctx.fillStyle = '#ff6060';
      ctx.beginPath();
      ctx.arc(tx, ty, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  ctx.restore();
}

// Rebuild cache whenever the map is regenerated.
on('reset', () => { MINIMAP.cache = null; });
registerOverlay(_drawMinimap);
