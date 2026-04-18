// Boss registry and spawning at tier-appropriate anchor points.
// Uses _findSafeSpot (from player.js) to snap to the nearest reachable tile
// so bosses don't anchor inside a building.
function spawnBosses() {
  const cx = (MAP.W / 2) * TILE, cy = (MAP.H / 2) * TILE;
  const troll = _findSafeSpot(cx - 320, cy + 60, 160) || { x: cx - 320, y: cy + 60 };
  const uruk  = _findSafeSpot(cx + 200, cy - 40, 160) || { x: cx + 200, y: cy - 40 };
  const wk    = _findSafeSpot(cx, cy - 64, 120)       || { x: cx, y: cy - 64 };
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
