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
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.fillRect(-1, bob - 4, 2, 8);
    ctx.fillRect(-4, bob - 1, 8, 2);
  } else if (typeof e.kind === 'string' && e.kind.indexOf('weapon:') === 0) {
    const wid = e.kind.slice(7);
    const spec = (typeof WEAPONS !== 'undefined' && WEAPONS[wid]) || null;
    ctx.save();
    ctx.rotate(Math.sin(state.time * 2 + e.bobPhase) * 0.3);
    ctx.fillStyle = (spec && spec.color) || '#c8c8c0';
    ctx.fillRect(-8, bob - 2, 16, 4);
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(-2, bob - 1, 4, 2);
    ctx.restore();
  }
}

registerEntityType('pickup', {
  factory: makePickup,
  update: updatePickup,
  draw: drawPickup,
});
