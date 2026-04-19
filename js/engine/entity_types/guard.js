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

registerEntityType('guard', {
  factory: makeGuard,
  update: (e, dt) => updateHostile(e, dt, true),
  draw: drawGuard,
});
