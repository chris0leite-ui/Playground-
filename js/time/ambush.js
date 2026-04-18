// At night, occasionally spawn extra orcs off-camera to raise tension.
let _ambushT = 10;
function updateAmbush(dt) {
  if (!isNight()) { _ambushT = 8; return; }
  _ambushT -= dt;
  if (_ambushT > 0) return;
  _ambushT = rand(6, 12);
  const p = state.player;
  if (!p) return;
  const count = 2 + Math.floor(rand(0, 2));
  for (let i = 0; i < count; i++) {
    const spot = findOpenTile();
    // Keep spawn off-screen.
    if (dist(spot.x, spot.y, p.x, p.y) < 260) continue;
    state.entities.push(makeOrc(spot.x, spot.y));
  }
}
registerUpdate(updateAmbush);
