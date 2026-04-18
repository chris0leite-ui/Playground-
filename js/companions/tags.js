// Tags above active companions so the player can tell Legolas/Gimli/Gandalf
// apart in a crowded fight.
function drawCompanionTags(ctx) {
  const cam = state.camera;
  for (const e of state.entities) {
    if (!e.companionName) continue;
    const sx = e.x - cam.x;
    const sy = e.y - cam.y;
    if (sx < -40 || sy < -40 || sx > state.viewW + 40 || sy > state.viewH + 40) continue;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    const w = e.companionName.length * 6 + 8;
    ctx.fillRect(-w/2, -28, w, 11);
    ctx.fillStyle = '#9ad860';
    ctx.font = 'bold 9px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(e.companionName, 0, -19);
    ctx.restore();
  }
}
registerOverlay(drawCompanionTags);
