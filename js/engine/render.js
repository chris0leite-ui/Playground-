// Shared rendering primitives. Per-entity-type draw functions live in
// js/engine/entity_types/<t>.js and are dispatched via the entity registry.

function drawEntities(ctx) {
  // Y-sort for pseudo-depth.
  const cam = state.camera;
  const sorted = state.entities.slice().sort((a, b) => a.y - b.y);
  for (const e of sorted) {
    const sx = e.x - cam.x;
    const sy = e.y - cam.y;
    // Cull off-screen with margin.
    if (sx < -40 || sy < -40 || sx > state.viewW + 40 || sy > state.viewH + 40) continue;

    ctx.save();
    ctx.translate(sx, sy);
    drawEntity(ctx, e);
    ctx.restore();
  }
}

function drawShadow(ctx, r) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.6, r, r * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
}

function tint(ctx, entity) {
  if (entity.hurtFlash > 0) {
    ctx.globalAlpha = 0.7;
  }
}

function drawHpBar(ctx, e, width) {
  if (e.hp >= e.maxHp) return;
  const pct = clamp(e.hp / e.maxHp, 0, 1);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(-width / 2 - 1, -16, width + 2, 4);
  ctx.fillStyle = pct > 0.5 ? '#6abe3a' : pct > 0.25 ? '#d4a82a' : '#c13030';
  ctx.fillRect(-width / 2, -15, width * pct, 2);
}
