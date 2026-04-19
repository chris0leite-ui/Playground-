// HUD additions: location/quest banner at the top, the side panel, toast,
// interact hint, and the Hall button.
let _hudExtraEl = null;
let _locationEl = null;
let _questBarEl = null;
let _titleEl = null;

function ensureHudExtra() {
  if (_hudExtraEl) return;
  const hud = document.getElementById('hud');
  // Reuse the static page title as the live location banner.
  _locationEl = document.getElementById('title');

  // Permanent quest banner — shows the active objective + distance.
  _questBarEl = document.createElement('div');
  _questBarEl.id = 'quest-banner';
  _questBarEl.innerHTML = '<em>No active quest. Talk to an NPC marked with a gold "!"</em>';
  hud.appendChild(_questBarEl);

  // Side panel with level / day / factions / weapon.
  _hudExtraEl = document.createElement('div');
  _hudExtraEl.id = 'hud-extra';
  hud.appendChild(_hudExtraEl);

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

function _distanceLabel(x, y) {
  const p = state.player;
  if (!p) return '';
  const tiles = Math.round(dist(p.x, p.y, x, y) / TILE);
  // Compass heading (8-way).
  const ang = Math.atan2(y - p.y, x - p.x);
  const dir = ['E','SE','S','SW','W','NW','N','NE'];
  const idx = ((Math.round(ang / (Math.PI / 4)) + 8) % 8);
  return `${tiles} tiles ${dir[idx]}`;
}

function updateExtraHUD() {
  ensureHudExtra();

  // 1. Location banner — current biome/landmark, reusing the page title.
  const region = (state.player && typeof regionAt === 'function')
    ? regionAt(state.player.x, state.player.y) : null;
  _locationEl.textContent = region || 'Middle-earth';

  // 2. Quest banner — first active quest, its objective, direction, reward.
  const q = state.quests.active[0];
  if (q) {
    const o = q.def.objective;
    let progress = '';
    if (o.count) progress = ` · ${q.progress}/${o.count}`;
    let hint = '';
    if (typeof _activeQuestTarget === 'function') {
      const tgt = _activeQuestTarget();
      if (tgt) hint = ` — ${_distanceLabel(tgt.x, tgt.y)}`;
    }
    const r = q.def.reward || {};
    const rewards = [];
    if (r.renown) rewards.push(`${r.renown} Renown`);
    if (r.gold)   rewards.push(`${r.gold} Gold`);
    if (r.weapon) rewards.push(WEAPONS[r.weapon].name);
    if (r.armor)  rewards.push(ARMORS[r.armor].name);
    const rewardLine = rewards.length
      ? `<br><span class="q-reward">Reward: ${rewards.join(' · ')}</span>` : '';
    _questBarEl.innerHTML =
      `<strong>${q.def.title}</strong>${progress}<br><span class="q-sub">${q.def.brief}${hint}</span>${rewardLine}`;
  } else {
    _questBarEl.innerHTML =
      '<em>No active quest — look for NPCs with a gold "!" above their head.</em>';
  }

  // 3. Side panel (level, day/night, factions, weapon).
  const tod = state.timeOfDay;
  const f = state.factions;
  const p = state.player || {};
  const lvl = p.level || 1;
  const xp = p.xp || 0;
  const next = (typeof xpToNext === 'function') ? xpToNext() : 100;
  _hudExtraEl.innerHTML = `
    <div><strong>Lv ${lvl}</strong> · XP ${xp}/${next}</div>
    <div><strong>${tod.phase.toUpperCase()}</strong> (${(tod.t*100|0)}%)</div>
    <div>G ${f.gondor|0} · R ${f.rohan|0} · M ${f.mordor|0}</div>
    <div>Wpn: ${WEAPONS[state.inventory.weapon||'sword'].name}</div>
  `;

  // Toast + hint.
  const t = document.getElementById('toast');
  if (state.toast.timer > 0) {
    t.textContent = state.toast.text;
    t.classList.add('on');
  } else {
    t.classList.remove('on');
  }
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
