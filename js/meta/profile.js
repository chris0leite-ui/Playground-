// Loads/saves a persistent profile: unlocks, best renown, class choice.
const DEFAULT_PROFILE = {
  bestRenown: 0, bestGold: 0,
  runsCompleted: 0,
  classChoice: 'ranger',
  unlocks: { rohirrim: false, hobbit: false },
  hall: [], // list of {class, renown, gold, bossesKilled}
};

function loadProfile() {
  const p = loadAll() || {};
  state.meta.profile = Object.assign({}, DEFAULT_PROFILE, p);
  state.meta.classChoice = state.meta.profile.classChoice || 'ranger';
}

function persistProfile() { saveAll(state.meta.profile); }

function recordDeath() {
  const prof = state.meta.profile;
  if (!prof) return;
  const p = state.player;
  const run = {
    cls: state.meta.classChoice,
    renown: state.renown,
    gold: p ? p.gold : 0,
    t: Date.now(),
  };
  prof.hall.push(run);
  prof.hall.sort((a, b) => b.renown - a.renown);
  prof.hall = prof.hall.slice(0, 10);
  prof.bestRenown = Math.max(prof.bestRenown, state.renown);
  prof.bestGold = Math.max(prof.bestGold, p ? p.gold : 0);
  prof.runsCompleted = (prof.runsCompleted || 0) + 1;
  if (state.renown >= 1000) prof.unlocks.rohirrim = true;
  if (state.renown >= 3000) prof.unlocks.hobbit = true;
  persistProfile();
}
