// Entity sprite drawing. Everything procedurally drawn — no image assets.

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

function drawEntity(ctx, e) {
  // Custom draw (bosses, companions, props, etc.)
  if (typeof e.draw === 'function') { e.draw(ctx, e); return; }
  switch (e.type) {
    case 'player':  drawPlayer(ctx, e); break;
    case 'orc':     drawOrc(ctx, e); break;
    case 'guard':   drawGuard(ctx, e); break;
    case 'horse':   drawHorse(ctx, e); break;
    case 'pickup':  drawPickup(ctx, e); break;
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

function drawPlayer(ctx, e) {
  // If mounted, skip — the horse will draw the composite.
  if (e.onHorse) return;

  drawShadow(ctx, 9);
  tint(ctx, e);
  // Cloak
  ctx.fillStyle = '#3a4a5a';
  ctx.fillRect(-7, -6, 14, 12);
  // Tunic
  ctx.fillStyle = '#5a4a3a';
  ctx.fillRect(-5, -4, 10, 8);
  // Head
  ctx.fillStyle = '#e0c8a0';
  ctx.beginPath();
  ctx.arc(0, -7, 4, 0, Math.PI * 2);
  ctx.fill();
  // Hair
  ctx.fillStyle = '#2a1a10';
  ctx.fillRect(-4, -10, 8, 3);
  ctx.globalAlpha = 1;

  // Weapon swing FX (dispatch on current weapon's `anim`).
  if (e.attackSwing > 0 && typeof drawWeaponFx === 'function') {
    drawWeaponFx(ctx, e);
  }

  // Facing indicator (small arrow tip)
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.moveTo(8, 0); ctx.lineTo(4, -3); ctx.lineTo(4, 3); ctx.closePath();
  ctx.fill();
  ctx.restore();

  drawHpBar(ctx, e, 20);
}

function drawOrc(ctx, e) {
  drawShadow(ctx, 9);
  tint(ctx, e);
  // Body
  ctx.fillStyle = PALETTE.orcGreen;
  ctx.fillRect(-6, -5, 12, 11);
  // Head
  ctx.fillStyle = PALETTE.orcSkin;
  ctx.beginPath();
  ctx.arc(0, -7, 4, 0, Math.PI * 2);
  ctx.fill();
  // Red eye dot
  ctx.fillStyle = PALETTE.mordorRed;
  ctx.fillRect(-1, -8, 2, 2);
  // Crude blade
  ctx.save();
  ctx.rotate(e.angle);
  ctx.fillStyle = '#8a7a5a';
  ctx.fillRect(4, -1, 10, 2);
  ctx.restore();
  ctx.globalAlpha = 1;
  drawHpBar(ctx, e, 16);
}

function drawGuard(ctx, e) {
  drawShadow(ctx, 9);
  tint(ctx, e);
  ctx.fillStyle = PALETTE.gondorWhite;
  ctx.fillRect(-6, -5, 12, 11);
  // Breastplate gold stripe
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.fillRect(-6, -2, 12, 2);
  // Head
  ctx.fillStyle = '#e0c8a0';
  ctx.beginPath(); ctx.arc(0, -7, 4, 0, Math.PI * 2); ctx.fill();
  // Gold helmet top
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.fillRect(-4, -10, 8, 3);
  // Spear
  ctx.save();
  ctx.rotate(e.angle);
  ctx.strokeStyle = '#5a4a3a';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(18, 0); ctx.stroke();
  ctx.fillStyle = PALETTE.gondorWhite;
  ctx.beginPath();
  ctx.moveTo(18, 0); ctx.lineTo(14, -3); ctx.lineTo(14, 3); ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.globalAlpha = 1;
  drawHpBar(ctx, e, 16);
}

function drawHorse(ctx, e) {
  drawShadow(ctx, 12);
  ctx.save();
  ctx.rotate(e.angle);
  // Body
  ctx.fillStyle = PALETTE.horseBrown;
  ctx.fillRect(-10, -5, 20, 10);
  // Mane / tail
  ctx.fillStyle = PALETTE.horseMane;
  ctx.fillRect(-10, -5, 3, 10);
  ctx.fillRect(7, -4, 3, 8);
  // Head
  ctx.fillStyle = PALETTE.horseBrown;
  ctx.fillRect(8, -3, 5, 6);
  // Legs (ticks)
  ctx.fillStyle = PALETTE.horseMane;
  ctx.fillRect(-8, 4, 2, 3);
  ctx.fillRect(-3, 4, 2, 3);
  ctx.fillRect(2, 4, 2, 3);
  ctx.fillRect(6, 4, 2, 3);
  ctx.restore();

  // Rider on top (player).
  if (e.rider) {
    const p = e.rider;
    ctx.save();
    // Rider cloak
    ctx.fillStyle = '#3a4a5a';
    ctx.fillRect(-6, -8, 12, 10);
    // Tunic
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(-4, -7, 8, 7);
    // Head
    ctx.fillStyle = '#e0c8a0';
    ctx.beginPath(); ctx.arc(0, -10, 4, 0, Math.PI * 2); ctx.fill();
    // Hair
    ctx.fillStyle = '#2a1a10';
    ctx.fillRect(-4, -13, 8, 3);
    // Sword swing
    if (p.attackSwing > 0) {
      ctx.save();
      ctx.rotate(p.angle);
      ctx.strokeStyle = PALETTE.gondorWhite;
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(22, -6); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  if (!e.rider) drawHpBar(ctx, e, 18);
}

function drawPickup(ctx, e) {
  const bob = Math.sin(state.time * 3 + e.bobPhase) * 2;
  drawShadow(ctx, 7);
  if (e.kind === 'gold') {
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.beginPath();
    ctx.arc(0, bob, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff3c0';
    ctx.fillRect(-2, bob - 2, 2, 2);
  } else if (e.kind === 'lembas') {
    ctx.fillStyle = PALETTE.lembas;
    ctx.fillRect(-6, bob - 5, 12, 10);
    ctx.strokeStyle = PALETTE.gondorGold;
    ctx.lineWidth = 1;
    ctx.strokeRect(-5.5, bob - 4.5, 11, 9);
    // Mallorn leaf cross
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.fillRect(-1, bob - 4, 2, 8);
    ctx.fillRect(-4, bob - 1, 8, 2);
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
