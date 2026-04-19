// "YOU ARE HERE" indicator: always drawn over the player, bigger and more
// visible when mounted so the tiny rider sprite on top of a horse never
// vanishes.
function drawPlayerMarker(ctx) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  const sx = p.x - state.camera.x;
  const sy = p.y - state.camera.y;
  if (sx < -40 || sy < -40 || sx > state.viewW + 40 || sy > state.viewH + 40) return;
  const mounted = !!p.onHorse;
  const t = state.time;
  const pulse = Math.sin(t * 4);
  ctx.save();

  // Outer pulsing ring — bigger when mounted to encompass the horse sprite.
  const r = (mounted ? 24 : 18) + pulse * 2;
  ctx.strokeStyle = `rgba(240,200,60,${0.5 + pulse * 0.2})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Downward-pointing chevron floating above the player.
  const anchorY = sy - (mounted ? 28 : 22);
  const bob = Math.sin(t * 4) * 2;
  ctx.fillStyle = 'rgba(255,240,120,0.95)';
  ctx.strokeStyle = '#4a2a00';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx,        anchorY + bob);
  ctx.lineTo(sx - 6,    anchorY - 8 + bob);
  ctx.lineTo(sx + 6,    anchorY - 8 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // "YOU" badge above the chevron.
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(sx - 13, anchorY - 22 + bob, 26, 11);
  ctx.fillStyle = '#ffd850';
  ctx.font = 'bold 9px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('YOU', sx, anchorY - 13 + bob);

  ctx.restore();
}
registerOverlay(drawPlayerMarker);
