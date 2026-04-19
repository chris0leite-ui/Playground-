// Simple XP/level progression. Each kill grants XP; thresholds grant
// stat bumps that feed back into combat via a global damage bonus and
// higher max HP.
const XP_PER = { orc: 10, uruk: 20, troll: 50, guard: 15, spider: 15, haradrim: 20,
                 boar: 8, deer: 3, bossTroll: 250, bossUruk: 400, bossWK: 800 };
const XP_THRESHOLDS = [100, 250, 500, 1000, 2000, 4000, 8000, 16000];

function xpToNext() {
  const p = state.player;
  const lvl = p.level || 1;
  return XP_THRESHOLDS[lvl - 1] || 99999;
}

function levelBonusDamage() {
  const p = state.player;
  return ((p.level || 1) - 1) * 2;
}

function _levelUp() {
  const p = state.player;
  p.level = (p.level || 1) + 1;
  p.maxHp = (p.maxHp || CONFIG.PLAYER_MAX_HP) + 10;
  p.hp = p.maxHp;
  toast(`LEVEL ${p.level}! +10 Max HP, +2 Damage`, 4);
  state.shake = 6;
}

function _grantXp(entity) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  const xp = XP_PER[entity.type];
  if (!xp) return;
  p.xp = (p.xp || 0) + xp;
  while (p.xp >= xpToNext()) _levelUp();
}

on('enemyKilled', ({ entity }) => {
  // Any ally kill grants XP — you commanded the party, you get the kill credit.
  if (!entity) return;
  _grantXp(entity);
});

// Keep level/xp through resets? No — every run starts fresh.
on('reset', () => {
  if (state.player) { state.player.level = 1; state.player.xp = 0; }
});
