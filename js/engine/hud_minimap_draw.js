// Per-frame minimap overlay draw. Reads MINIMAP state from hud_minimap.js.
// Called from loop.draw() after world + entity draw.

const MINIMAP_LABELED = {
  hobbiton: 'Hobbiton', bree: 'Bree', rivendell: 'Rivendell',
  moriaGate: 'Moria', erebor: 'Erebor', lothlorien: 'Lórien',
  isengard: 'Isengard', edoras: 'Edoras', helmsDeep: "Helm's Deep",
  minasTirith: 'Minas Tirith', minasMorgul: 'M. Morgul',
  baradDur: 'Barad-dûr', mountDoom: 'Mt Doom',
};

function drawMinimap(ctx) {
  if (!state.started || state.paused || state.gameOver) return;
  if (!MINIMAP.cache) buildMinimapCache();
  const s = MINIMAP.scale;
  const cw = MINIMAP.cw, ch = MINIMAP.ch;
  const x0 = state.viewW - cw - 10;
  const y0 = 82;
  MINIMAP.x = x0; MINIMAP.y = y0;

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x0 - 2, y0 - 2, cw + 4, ch + 4);
  ctx.strokeStyle = PALETTE.gondorGold;
  ctx.lineWidth = 1;
  ctx.strokeRect(x0 - 1.5, y0 - 1.5, cw + 3, ch + 3);
  ctx.drawImage(MINIMAP.cache, x0, y0);

  // Landmark dots + labels for the biggest settlements.
  ctx.font = 'bold 9px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  for (const key in LANDMARKS) {
    const L = LANDMARKS[key];
    const mx = x0 + L.tx * s;
    const my = y0 + L.ty * s;
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.fillRect(mx - 1, my - 1, 3, 3);
    if (MINIMAP_LABELED[key]) {
      const text = MINIMAP_LABELED[key];
      const w = ctx.measureText(text).width + 4;
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(mx - w / 2, my - 12, w, 10);
      ctx.fillStyle = PALETTE.gondorGold;
      ctx.fillText(text, mx, my - 3);
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

  // Player (pulsing gold).
  const p = state.player;
  if (p) {
    const px = x0 + (p.x / TILE) * s;
    const py = y0 + (p.y / TILE) * s;
    const pulse = 0.6 + Math.sin(state.time * 4) * 0.3;
    ctx.fillStyle = `rgba(255,240,120,${pulse})`;
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Active waypoint (red pin).
  if (state.waypoint) {
    const tx = x0 + (state.waypoint.x / TILE) * s;
    const ty = y0 + (state.waypoint.y / TILE) * s;
    ctx.fillStyle = '#ff6060';
    ctx.beginPath();
    ctx.arc(tx, ty, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Active reach-quest landmark (red ?-pin).
  const reach = (typeof activeReachTarget === 'function') ? activeReachTarget() : null;
  if (reach) {
    const rx = x0 + (reach.x / TILE) * s;
    const ry = y0 + (reach.y / TILE) * s;
    ctx.fillStyle = '#ff4040';
    ctx.beginPath();
    ctx.arc(rx, ry, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', rx, ry);
  }
  ctx.restore();
}
