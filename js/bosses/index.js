// Boss registry and spawning at tier-appropriate anchor points.
function spawnBosses() {
  const cx = (MAP.W / 2) * TILE, cy = (MAP.H / 2) * TILE;
  // Tier 6 arena (outer ring): cave troll
  state.entities.push(makeBossTroll(cx - 320, cy + 60));
  // Tier 4 arena: Uruk captain
  state.entities.push(makeBossUruk(cx + 200, cy - 40));
  // Citadel (tier 1): Witch-King
  state.entities.push(makeBossWK(cx, cy - 64));
}

// Listen for boss death to emit a canonical event & reward renown.
on('enemyKilled', ({ entity }) => {
  if (!entity || !entity.isBoss) return;
  const reward = entity.type === 'bossWK' ? 2000 : entity.type === 'bossUruk' ? 700 : 400;
  state.renown += reward;
  toast(`Boss defeated! +${reward} Renown`, 4);
  emit('bossDefeated', { type: entity.type });
});
