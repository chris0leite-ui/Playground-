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

registerEntityType('pickup', {
  factory: makePickup,
  update: updatePickup,
  draw: drawPickup,
});
