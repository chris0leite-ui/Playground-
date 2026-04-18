// Full-screen tint overlay keyed to time-of-day phase.
const _tintTable = {
  night: { r: 10, g: 10, b: 30, a: 0.55 },
  dawn:  { r: 220, g: 120, b: 80, a: 0.22 },
  day:   { r: 0, g: 0, b: 0, a: 0 },
  dusk:  { r: 180, g: 80, b: 50, a: 0.30 },
};

function drawDayTint(ctx) {
  const tod = state.timeOfDay;
  const c = _tintTable[tod.phase] || _tintTable.day;
  if (c.a <= 0) return;
  ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${c.a})`;
  ctx.fillRect(0, 0, state.viewW, state.viewH);
}

registerOverlay(drawDayTint);
