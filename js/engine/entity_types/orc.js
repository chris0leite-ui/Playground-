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

registerEntityType('orc', {
  factory: makeOrc,
  update: (e, dt) => updateHostile(e, dt, false),
  draw: drawOrc,
});
