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
    // resetRun spawns the player in the default region; if the save
    // points at a different region, migrate the player entity across.
    const p = state.player;
    if (p && data.currentRegionId && state.world.regions[data.currentRegionId]
        && data.currentRegionId !== state.world.currentRegionId) {
      const prev = state.region;
      if (prev) {
        const idx = prev.entities.indexOf(p);
        if (idx >= 0) prev.entities.splice(idx, 1);
      }
      loadRegion(data.currentRegionId);
      if (!state.entities.includes(p)) state.entities.push(p);
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
      // The mount we were riding doesn't survive a save (regions
      // rebuild fresh on load). Dismount cleanly so the player
      // controls themselves, not a stale horse reference.
      state.player.onHorse = null;
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
