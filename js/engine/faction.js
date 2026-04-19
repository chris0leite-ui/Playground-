// Faction reputation. Replaces the hardcoded wantedLevel shim.
// Rep is a number in [-100, 100] per faction-id, defaulting to 0.

const REP_MIN = -100;
const REP_MAX = 100;
const FACTION_REGEN_PER_SEC = 1.0; // rep slowly approaches 0 while at rest

function getRep(id) { return state.reputation[id] || 0; }

function modRep(id, delta) {
  const cur = getRep(id);
  const next = clamp(cur + delta, REP_MIN, REP_MAX);
  state.reputation[id] = next;
  eventBus.emit('faction_rep_changed', id, next, cur);
}

function setRep(id, value) {
  state.reputation[id] = clamp(value, REP_MIN, REP_MAX);
}

// Negative rep intensity: 0..4 (maps to old wanted-stars UI).
function hostileTier(id) {
  const r = getRep(id);
  if (r >= 0) return 0;
  return Math.min(4, Math.ceil(-r / 20));
}

function updateFactions(dt) {
  for (const id in state.reputation) {
    const r = state.reputation[id];
    if (r === 0) continue;
    const step = Math.sign(-r) * FACTION_REGEN_PER_SEC * dt;
    const next = Math.abs(step) >= Math.abs(r) ? 0 : r + step;
    state.reputation[id] = next;
  }
}

// Kills dock reputation with the victim's faction. Registered at boot.
function bindFactionListeners() {
  eventBus.on('entity_killed', (victim, killer) => {
    if (!victim || killer !== state.player) return;
    if (victim.type === 'guard') modRep('citadel-guard', -20);
    else if (victim.type === 'horse') modRep('citadel-guard', -5);
  });
}
