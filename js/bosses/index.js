// Boss registry: one boss per thematic landmark.
//   Cave Troll — Moria East-gate
//   Uruk Captain — Isengard
//   Witch-King — Minas Morgul
function _anchorNear(key, rSearch) {
  const a = LANDMARK_PX(key);
  return _findSafeSpot(a.x, a.y, rSearch || 160) || a;
}
function spawnBosses() {
  const troll = _anchorNear('moriaGate');
  const uruk  = _anchorNear('isengard');
  const wk    = _anchorNear('minasMorgul');
  state.entities.push(makeBossTroll(troll.x, troll.y));
  state.entities.push(makeBossUruk(uruk.x, uruk.y));
  state.entities.push(makeBossWK(wk.x, wk.y));
}

// Listen for boss death to emit a canonical event & reward renown.
on('enemyKilled', ({ entity }) => {
  if (!entity || !entity.isBoss) return;
  const reward = entity.type === 'bossWK' ? 2000 : entity.type === 'bossUruk' ? 700 : 400;
  state.renown += reward;
  toast(`Boss defeated! +${reward} Renown`, 4);
  emit('bossDefeated', { type: entity.type });
});
