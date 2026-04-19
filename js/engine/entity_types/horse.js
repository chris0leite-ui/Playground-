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
    ctx.fillStyle = '#3a4a5a';
    ctx.fillRect(-6, -8, 12, 10);
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(-4, -7, 8, 7);
    ctx.fillStyle = '#e0c8a0';
    ctx.beginPath(); ctx.arc(0, -10, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a1a10';
    ctx.fillRect(-4, -13, 8, 3);
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

registerEntityType('horse', {
  factory: makeHorse,
  update: updateHorse,
  draw: drawHorse,
});
