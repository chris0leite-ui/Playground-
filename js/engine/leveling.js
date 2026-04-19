// XP / level progression. Each kill grants XP; thresholds bump max HP
// and melee damage. Fresh levels on each reset; no persistence between
// runs (saves still round-trip xp + level if they exist).

const XP_PER = {
  orc: 10, uruk: 20, troll: 60, guard: 15,
  spider: 15, haradrim: 18,
};

const XP_THRESHOLDS = [100, 250, 500, 1000, 2000, 4000, 8000, 16000];

function xpToNext() {
  const p = state.player;
  const lvl = (p && p.level) || 1;
  return XP_THRESHOLDS[lvl - 1] || 99999;
}

function levelBonusDamage() {
  const p = state.player;
  return (((p && p.level) || 1) - 1) * 2;
}

function _levelUp() {
  const p = state.player;
  p.level = (p.level || 1) + 1;
  p.maxHp = (p.maxHp || CONFIG.PLAYER_MAX_HP) + 10;
  p.hp = p.maxHp;
  if (typeof showToast === 'function') {
    showToast(`LEVEL ${p.level}! +10 Max HP, +2 Damage`, 2800);
  }
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

function bindLevelingListeners() {
  if (typeof eventBus === 'undefined' || !eventBus.on) return;
  eventBus.on('entity_killed', (victim, killer) => {
    if (!victim || killer !== state.player) return;
    _grantXp(victim);
  });
  eventBus.on('reset', () => {
    if (state.player) { state.player.level = 1; state.player.xp = 0; }
  });
}
