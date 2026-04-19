// Edge-of-screen compass: if an active-quest giver NPC exists in the current
// region but is off-screen, draw an arrow on the nearest screen edge pointing
// to them. Called from loop.draw(); a no-op when the giver is on-screen.

function questTargetInRegion() {
  const quests = (state && state.quests) || {};
  const W = (window.W && window.W.quests) || {};
  const givers = new Set();
  for (const id in quests) {
    if (quests[id].status !== 'active') continue;
    const def = W[id];
    if (!def || !def.giver) continue;
    const [t, ref] = def.giver.split(':');
    if (t === 'npc') givers.add(ref);
  }
  if (!givers.size || !state.entities || !state.player) return null;
  const p = state.player;
  let best = null, bestD = Infinity;
  for (const e of state.entities) {
    if (e.type !== 'npc' || !givers.has(e.npcId)) continue;
    const d = dist(e.x, e.y, p.x, p.y);
    if (d < bestD) { bestD = d; best = e; }
  }
  return best;
}

// Prefer an explicit player waypoint (from a minimap tap) over the
// auto-picked quest NPC.
function compassTarget() {
  if (state.waypoint) {
    return { x: state.waypoint.x, y: state.waypoint.y, name: 'Waypoint' };
  }
  const npc = questTargetInRegion();
  return npc ? { x: npc.x, y: npc.y, name: npc.name || 'Quest' } : null;
}

function drawQuestCompass(ctx) {
  if (!state.started || state.paused || state.gameOver) return;
  if (state.inputMode !== 'world') return;
  const target = compassTarget();
  if (!target) return;
  const cam = state.camera;
  const sx = target.x - cam.x, sy = target.y - cam.y;
  const pad = 52;
  const onScreen = sx >= 0 && sx <= state.viewW && sy >= 0 && sy <= state.viewH;
  if (onScreen) {
    // Clear the waypoint once the player has reached it.
    if (state.waypoint && Math.hypot(target.x - state.player.x, target.y - state.player.y) < TILE * 2) {
      state.waypoint = null;
    }
    return;
  }
  const ex = clamp(sx, pad, state.viewW - pad);
  const ey = clamp(sy, pad, state.viewH - pad);
  const ang = Math.atan2(sy - ey, sx - ex);
  ctx.save();
  ctx.translate(ex, ey);
  ctx.rotate(ang);
  ctx.fillStyle = 'rgba(212,168,42,0.92)';
  ctx.strokeStyle = 'rgba(0,0,0,0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 0); ctx.lineTo(-10, -11); ctx.lineTo(-4, 0); ctx.lineTo(-10, 11);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = 'rgba(0,0,0,0.85)';
  ctx.lineWidth = 3;
  ctx.font = '14px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.strokeText(target.name, ex, ey - 26);
  ctx.fillText(target.name, ex, ey - 26);
  ctx.restore();
}
