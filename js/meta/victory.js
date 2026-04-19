// Victory progress: track milestones on the march toward defeating Sauron.
// Four quarter-points add up to 100%; reaching 100% pops a victory screen.
const VICTORY_MILESTONES = {
  caveTroll:    { label: 'Cave Troll slain',       pct: 20 },
  urukCaptain:  { label: 'Uruk Captain defeated',  pct: 20 },
  mountDoom:    { label: 'Mount Doom reached',     pct: 20 },
  baradDur:     { label: 'Barad-dûr reached',      pct: 15 },
  witchKing:    { label: 'Witch-King slain',       pct: 25 },
};

state.victory = { hit: {}, percent: 0, won: false };

function _updateVictory() {
  let total = 0;
  for (const k in VICTORY_MILESTONES) {
    if (state.victory.hit[k]) total += VICTORY_MILESTONES[k].pct;
  }
  state.victory.percent = Math.min(100, total);
  if (state.victory.percent >= 100 && !state.victory.won) {
    state.victory.won = true;
    toast('VICTORY — The Shadow has been cast down!', 8);
    emit('victory');
  }
}

function _markMilestone(k) {
  if (state.victory.hit[k]) return;
  state.victory.hit[k] = true;
  toast(`★ ${VICTORY_MILESTONES[k].label} (+${VICTORY_MILESTONES[k].pct}% toward Victory)`, 5);
  _updateVictory();
}

on('bossDefeated', ({ type }) => {
  if (type === 'bossTroll') _markMilestone('caveTroll');
  else if (type === 'bossUruk') _markMilestone('urukCaptain');
  else if (type === 'bossWK') _markMilestone('witchKing');
});

function _tickVictoryRegions(dt) {
  const p = state.player;
  if (!p) return;
  // Landmark-reach milestones: snap to landmark if within its r*TILE radius.
  for (const [key, lm] of [['mountDoom', LANDMARKS.mountDoom], ['baradDur', LANDMARKS.baradDur]]) {
    const d = Math.hypot(p.x / TILE - lm.tx, p.y / TILE - lm.ty);
    if (d < (lm.r || 5) + 1) _markMilestone(key);
  }
}
registerUpdate(_tickVictoryRegions);

on('reset', () => {
  state.victory = { hit: {}, percent: 0, won: false };
});

// --- HUD overlay ---
let _victoryBarEl = null;
function _ensureVictoryBar() {
  if (_victoryBarEl) return;
  _victoryBarEl = document.createElement('div');
  _victoryBarEl.id = 'victory-bar';
  _victoryBarEl.innerHTML =
    '<div id="victory-label">Against the Shadow</div>' +
    '<div id="victory-track"><div id="victory-fill"></div></div>' +
    '<div id="victory-pct">0%</div>';
  document.getElementById('hud').appendChild(_victoryBarEl);
}

function _drawVictoryBar() {
  _ensureVictoryBar();
  const pct = state.victory.percent | 0;
  document.getElementById('victory-fill').style.width = pct + '%';
  document.getElementById('victory-pct').textContent = pct + '%';
}
registerOverlay(_drawVictoryBar);
