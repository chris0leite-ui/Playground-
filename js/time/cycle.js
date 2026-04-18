// Advances the time-of-day clock. state.timeOfDay.t in [0,1):
//   0.00..0.20 night   0.20..0.30 dawn   0.30..0.70 day
//   0.70..0.80 dusk    0.80..1.00 night
function _phaseFor(t) {
  if (t < 0.20) return 'night';
  if (t < 0.30) return 'dawn';
  if (t < 0.70) return 'day';
  if (t < 0.80) return 'dusk';
  return 'night';
}

function updateTimeOfDay(dt) {
  const tod = state.timeOfDay;
  tod.t = (tod.t + dt * tod.speed) % 1;
  const next = _phaseFor(tod.t);
  if (next !== tod.phase) {
    const prev = tod.phase;
    tod.phase = next;
    emit('dayPhaseChanged', { from: prev, to: next });
  }
}

function isNight() { return state.timeOfDay.phase === 'night'; }
registerUpdate(updateTimeOfDay);
