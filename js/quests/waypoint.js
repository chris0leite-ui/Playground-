// Renders an arrow at the edge of the viewport pointing to the current quest
// target (reach-type objectives). For kill/collect, points at the nearest
// matching entity so you know where to go.
function _activeQuestTarget() {
  const active = state.quests.active[0];
  if (!active) return null;
  const obj = active.def.objective;
  if (obj.type === 'reach') return { x: obj.target.x, y: obj.target.y, label: active.def.title };
  if (obj.type === 'kill' || obj.type === 'boss') {
    // Find nearest entity of the target type.
    let best = null, bd = Infinity;
    for (const e of state.entities) {
      if (e.hp == null || e.hp <= 0) continue;
      if (obj.type === 'kill' && e.type !== obj.target) continue;
      if (obj.type === 'boss' && e.type !== obj.target) continue;
      const d = distEnt(e, state.player);
      if (d < bd) { bd = d; best = e; }
    }
    if (best) return { x: best.x, y: best.y, label: active.def.title };
  }
  return null;
}

function drawWaypoint(ctx) {
  const tgt = _activeQuestTarget();
  const p = state.player;
  if (!tgt || !p) return;
  const sx = tgt.x - state.camera.x;
  const sy = tgt.y - state.camera.y;
  const cx = state.viewW / 2, cy = state.viewH / 2;
  const margin = 40;

  // If on-screen, draw a soft ring + label.
  if (sx >= margin && sy >= margin && sx <= state.viewW - margin && sy <= state.viewH - margin) {
    ctx.save();
    ctx.strokeStyle = 'rgba(240,200,60,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(sx, sy, 18 + Math.sin(state.time * 4) * 3, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(240,200,60,0.9)';
    ctx.font = '11px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(tgt.label, sx, sy - 28);
    ctx.restore();
    return;
  }

  // Off-screen: clamp to edge with an arrow pointing outward.
  const ang = Math.atan2(tgt.y - p.y, tgt.x - p.x);
  const ex = cx + Math.cos(ang) * (Math.min(state.viewW, state.viewH) * 0.40);
  const ey = cy + Math.sin(ang) * (Math.min(state.viewW, state.viewH) * 0.40);
  ctx.save();
  ctx.translate(ex, ey);
  ctx.rotate(ang);
  ctx.fillStyle = 'rgba(240,200,60,0.9)';
  ctx.beginPath();
  ctx.moveTo(12, 0); ctx.lineTo(-8, -7); ctx.lineTo(-4, 0); ctx.lineTo(-8, 7);
  ctx.closePath(); ctx.fill();
  ctx.restore();
  // Distance label
  ctx.save();
  ctx.fillStyle = 'rgba(240,200,60,0.9)';
  ctx.font = '11px Georgia';
  ctx.textAlign = 'center';
  const d = Math.round(dist(p.x, p.y, tgt.x, tgt.y) / TILE);
  ctx.fillText(`${tgt.label} · ${d} tiles`, ex, ey - 16);
  ctx.restore();
}

registerOverlay(drawWaypoint);
