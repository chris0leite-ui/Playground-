// LocalStorage-backed save/load. Single slot today; the format is versioned
// via SAVE_VERSION so loads across breaking changes fail gracefully rather
// than crashing. Entities are NOT serialized (each region rebuilds on load);
// player position and progression state are.

const SAVE_KEY = 'me-save-0';
const SAVE_VERSION = 1;

function saveSave() {
  try {
    const p = state.player;
    const payload = {
      version: SAVE_VERSION,
      schemaVersion: (window.W && window.W.schemaVersion) || 0,
      time: state.time,
      renown: state.renown,
      flags: state.flags,
      reputation: state.reputation,
      quests: state.quests,
      currentRegionId: state.world.currentRegionId,
      player: p && {
        x: p.x, y: p.y, hp: p.hp, maxHp: p.maxHp,
        gold: p.gold, angle: p.angle,
      },
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    if (typeof showToast === 'function') showToast('Saved.');
    return true;
  } catch (err) {
    console.error('save failed', err);
    if (typeof showToast === 'function') showToast('Save failed.');
    return false;
  }
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      if (typeof showToast === 'function') showToast('No save found.');
      return false;
    }
    const data = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) {
      if (typeof showToast === 'function') showToast('Save is from an older version.');
      return false;
    }
    resetRun();
    if (data.currentRegionId && state.world.regions[data.currentRegionId]) {
      loadRegion(data.currentRegionId);
    }
    state.time = data.time || 0;
    state.renown = data.renown || 0;
    state.flags = data.flags || {};
    state.reputation = data.reputation || {};
    state.quests = data.quests || {};
    if (state.player && data.player) {
      Object.assign(state.player, {
        x: data.player.x, y: data.player.y,
        hp: data.player.hp, maxHp: data.player.maxHp,
        gold: data.player.gold, angle: data.player.angle,
      });
    }
    state.started = true;
    hideMessage();
    if (typeof showToast === 'function') showToast('Loaded.');
    return true;
  } catch (err) {
    console.error('load failed', err);
    if (typeof showToast === 'function') showToast('Load failed.');
    return false;
  }
}

function hasSave() { return !!localStorage.getItem(SAVE_KEY); }

function bindSaveHooks() {
  eventBus.on('region_entered', () => { saveSave(); });
}
