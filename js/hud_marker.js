// A subtle gold ring pulses around the player every frame, even while
// mounted, so you never lose track of where you are on a busy screen.
function drawPlayerMarker(ctx) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  const sx = p.x - state.camera.x;
  const sy = p.y - state.camera.y;
  if (sx < 0 || sy < 0 || sx > state.viewW || sy > state.viewH) return;
  const t = state.time;
  ctx.save();
  ctx.strokeStyle = `rgba(240,200,60,${0.35 + Math.sin(t * 4) * 0.15})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sx, sy, 16 + Math.sin(t * 4) * 2, 0, Math.PI * 2);
  ctx.stroke();
  // Tiny gold dot dead center as a backup.
  ctx.fillStyle = 'rgba(240,200,60,0.9)';
  ctx.beginPath();
  ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
registerOverlay(drawPlayerMarker);
