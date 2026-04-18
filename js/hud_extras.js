// HUD additions: day phase, quest tracker, toast, interact hint.
// Runs as a post-HUD pass that injects into a side panel.
let _hudExtraEl = null;
function ensureHudExtra() {
  if (_hudExtraEl) return;
  _hudExtraEl = document.createElement('div');
  _hudExtraEl.id = 'hud-extra';
  document.getElementById('hud').appendChild(_hudExtraEl);

  const toastEl = document.createElement('div');
  toastEl.id = 'toast';
  document.body.appendChild(toastEl);

  const hintEl = document.createElement('div');
  hintEl.id = 'hint';
  document.body.appendChild(hintEl);

  const hallBtn = document.createElement('button');
  hallBtn.id = 'hall-btn';
  hallBtn.type = 'button';
  hallBtn.textContent = 'Hall';
  hallBtn.addEventListener('click', showHall);
  document.getElementById('hud-top').appendChild(hallBtn);
}

function updateExtraHUD() {
  ensureHudExtra();
  const tod = state.timeOfDay;
  const quests = state.quests.active.map(q => {
    const o = q.def.objective;
    const prog = o.count ? ` ${q.progress}/${o.count}` : '';
    return `• ${q.def.title}${prog}`;
  }).join('<br>');
  const f = state.factions;
  const p = state.player || {};
  const lvl = p.level || 1;
  const xp = p.xp || 0;
  const next = (typeof xpToNext === 'function') ? xpToNext() : 100;
  _hudExtraEl.innerHTML = `
    <div><strong>Lv ${lvl}</strong> · XP ${xp}/${next}</div>
    <div><strong>${tod.phase.toUpperCase()}</strong> (${(tod.t*100|0)}%)</div>
    <div>G ${f.gondor|0} · R ${f.rohan|0} · M ${f.mordor|0}</div>
    <div>Weapon: ${WEAPONS[state.inventory.weapon||'sword'].name}</div>
    <div>${quests || '<em>No active quest</em>'}</div>
  `;
  // Toast
  const t = document.getElementById('toast');
  if (state.toast.timer > 0) {
    t.textContent = state.toast.text;
    t.classList.add('on');
  } else {
    t.classList.remove('on');
  }
  // Hint (interact)
  const h = document.getElementById('hint');
  if (state.toast.hint) {
    h.textContent = state.toast.hint;
    h.classList.add('on');
    state.toast.hint = null;
  } else {
    h.classList.remove('on');
  }
}

function _tickToast(dt) {
  if (state.toast.timer > 0) state.toast.timer -= dt;
}
registerUpdate(_tickToast);
registerOverlay(updateExtraHUD);
