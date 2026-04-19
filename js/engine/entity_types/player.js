// Player entity type. Update is driven directly from loop.js (updatePlayer);
// the registry supplies draw + factory.

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

  // Sword swing
  if (e.attackSwing > 0) {
    ctx.save();
    ctx.rotate(e.angle);
    ctx.strokeStyle = PALETTE.gondorWhite;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(22, 0);
    ctx.stroke();
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.fillRect(3, -2, 3, 4);
    ctx.restore();
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

registerEntityType('player', {
  factory: makePlayer,
  draw: drawPlayer,
});
