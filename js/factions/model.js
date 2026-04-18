// Reputation numbers per faction, clamped to [-100..100]. 0 = neutral.
const FACTION_KEYS = ['gondor', 'rohan', 'mordor', 'free'];

function adjustRep(key, delta) {
  state.factions[key] = clamp((state.factions[key] || 0) + delta, -100, 100);
}

function rep(key) { return state.factions[key] || 0; }
