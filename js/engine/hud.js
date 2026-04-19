// Updates the DOM HUD each frame: HP bar, gold, renown, wanted stars, mount.
// Also handles the message overlay (intro, pause, death).

const HUD = {
  gold: null, renown: null, wanted: null, title: null,
  hpBar: null, hpText: null, mount: null,
  msg: null, msgTitle: null, msgBody: null, msgBtn: null,
};

function regionDisplayName(id) {
  const content = (window.W && window.W.regions && window.W.regions[id]) || null;
  const runtime = state.world && state.world.regions && state.world.regions[id];
  return (content && content.name)
      || (runtime && runtime.def && runtime.def.name)
      || id || 'Middle-earth';
}

function refreshHudTitle() {
  if (!HUD.title) return;
  const id = state.world && state.world.currentRegionId;
  HUD.title.textContent = 'Middle-earth: ' + regionDisplayName(id);
}

function initHUD() {
  HUD.gold = document.getElementById('gold');
  HUD.renown = document.getElementById('renown');
  HUD.wanted = document.getElementById('wanted');
  HUD.title = document.getElementById('title');
  HUD.hpBar = document.getElementById('hp-bar');
  HUD.hpText = document.getElementById('hp-text');
  HUD.mount = document.getElementById('mount-indicator');
  HUD.msg = document.getElementById('message-overlay');
  HUD.msgTitle = document.getElementById('message-title');
  HUD.msgBody = document.getElementById('message-body');
  HUD.msgBtn = document.getElementById('message-btn');

  HUD.msgBtn.addEventListener('click', onMessageClick);
  if (typeof eventBus !== 'undefined' && eventBus.on) {
    eventBus.on('region_entered', refreshHudTitle);
  }
  refreshHudTitle();
}

function updateHUD() {
  const p = state.player;
  if (!p) return;
  HUD.gold.textContent = `Gold: ${p.gold}`;
  HUD.renown.textContent = `Renown: ${state.renown}`;

  const tier = hostileTier('citadel-guard');
  const stars = '\u2022'.repeat(tier);
  HUD.wanted.textContent = stars ? `Wanted: ${stars}` : '';
  HUD.wanted.style.color = tier > 0 ? '#ff6060' : '';

  const pct = clamp(p.hp / p.maxHp, 0, 1) * 100;
  HUD.hpBar.style.width = pct + '%';
  HUD.hpText.textContent = `${Math.max(0, Math.ceil(p.hp))} / ${p.maxHp}`;

  if (p.onHorse) {
    HUD.mount.textContent = 'Mounted: Steed of Rohan';
    HUD.mount.classList.add('on');
  } else {
    HUD.mount.classList.remove('on');
  }

  // Show the Talk button only when an NPC is in range and we're in world mode.
  const talkBtn = document.getElementById('talk-btn');
  if (talkBtn) {
    const target = (state.inputMode === 'world') ? findNearestNpc(80) : null;
    if (target) {
      talkBtn.classList.remove('hidden');
      talkBtn.textContent = 'Talk';
    } else {
      talkBtn.classList.add('hidden');
    }
  }

  updateQuestLog();
}

function updateQuestLog() {
  const log = document.getElementById('quest-log');
  if (!log) return;
  const W = (window.W && window.W.quests) || {};
  const rows = [];
  for (const id in state.quests) {
    const q = state.quests[id];
    if (q.status !== 'active') continue;
    const def = W[id];
    const title = (def && def.title) || id;
    let hint = '';
    if (def && def.steps && def.steps[q.stepIdx]) {
      const s = def.steps[q.stepIdx];
      hint = s.hint || s.target || s.id || '';
    }
    rows.push(`<div class="qrow"><div class="qtitle">${escapeHtml(title)}</div>` +
              (hint ? `<div class="qhint">${escapeHtml(String(hint))}</div>` : '') +
              `</div>`);
  }
  if (rows.length === 0) { log.classList.add('hidden'); return; }
  log.innerHTML = rows.join('');
  log.classList.remove('hidden');
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
}

// Modal/overlay/toast helpers live in engine/hud_modals.js.
