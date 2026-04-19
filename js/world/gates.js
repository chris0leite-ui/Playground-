// Inner-tier gates that block passage unless the tier is unlocked.
// Placed at the north spoke road crossing each ring boundary.
function makeGate(x, y, tier) {
  return {
    type: 'gate', x, y, w: 26, h: 8,
    tier, noHp: true, alive: true, angle: 0,
    team: TEAM.NEUTRAL,
    draw: drawGate,
    update: updateGate,
  };
}

function updateGate(dt, g) {
  if (isTierUnlocked(g.tier)) return;
  const p = state.player;
  if (!p) return;
  // Push the player back if they overlap the gate.
  if (rectsOverlap(g.x - g.w/2, g.y - g.h/2, g.w, g.h,
                   p.x - p.w/2, p.y - p.h/2, p.w, p.h)) {
    const dx = p.x - g.x;
    const dy = p.y - g.y;
    if (Math.abs(dx) > Math.abs(dy)) p.x += dx > 0 ? 4 : -4;
    else p.y += dy > 0 ? 4 : -4;
    if (state.frame % 40 === 0) {
      toast('Gate sealed: need Renown ' + (_gateRenown(g.tier) | 0), 2);
    }
  }
}

function _gateRenown(tier) {
  const t = { 5: 200, 4: 600, 3: 1400, 2: 2800, 1: 5000 };
  return t[tier] || 0;
}

function drawGate(ctx, g) {
  const open = isTierUnlocked(g.tier);
  drawShadow(ctx, 14);
  ctx.fillStyle = open ? '#3a3a3a' : PALETTE.wall;
  ctx.fillRect(-g.w/2, -g.h/2, g.w, g.h);
  ctx.fillStyle = open ? PALETTE.gondorGold : PALETTE.wallDark;
  ctx.fillRect(-g.w/2 + 2, -g.h/2 + 1, g.w - 4, 2);
  ctx.fillStyle = open ? '#7a7a7a' : '#2a2a2a';
  for (let i = 0; i < 4; i++) ctx.fillRect(-g.w/2 + 4 + i * 6, -g.h/2 + 3, 3, 3);
  // Lock icon if closed
  if (!open) {
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.fillRect(-2, -g.h/2 - 6, 4, 3);
    ctx.fillRect(-3, -g.h/2 - 3, 6, 4);
  }
}

function spawnGates() {
  // North spoke of Minas Tirith — a gate just inside each ring's inner edge.
  const cx = LANDMARKS.minasTirith.tx;
  const cy = LANDMARKS.minasTirith.ty;
  for (let t = 2; t <= 6; t++) {
    const r = TIER_RADII[t - 2] - 0.2;
    const x = cx * TILE;
    const y = (cy - r) * TILE;
    state.entities.push(makeGate(x, y, t - 1));
  }
}
