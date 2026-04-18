// Quest engine. Each quest def:
//   { id, title, brief, objective: {type, target, count}, reward }
// Supported objective.type:
//   'kill'     — target is enemy type, count hits
//   'boss'     — target is boss type, count hits (usually 1)
//   'reach'    — target is {x, y, r}
//   'collect'  — target is pickup kind, count hits
const QUEST_REGISTRY = {};

function registerQuest(def) { QUEST_REGISTRY[def.id] = def; }

function startQuest(id) {
  const def = QUEST_REGISTRY[id];
  if (!def) return;
  if (state.quests.active.find(q => q.id === id)) return;
  if (state.quests.completed.indexOf(id) >= 0) return;
  state.quests.active.push({ id, progress: 0, def });
  toast('Quest: ' + def.title + ' — ' + def.brief, 5);
}

function _completeQuest(q) {
  state.quests.active = state.quests.active.filter(x => x !== q);
  state.quests.completed.push(q.id);
  if (q.def.reward && q.def.reward.renown) state.renown += q.def.reward.renown;
  if (q.def.reward && q.def.reward.gold) state.player.gold += q.def.reward.gold;
  if (q.def.reward && q.def.reward.weapon) equipWeapon(q.def.reward.weapon);
  toast('Quest complete: ' + q.def.title + ` (+${q.def.reward.renown||0} Renown)`, 4);
  emit('questCompleted', { id: q.id });
}

function _checkReach(dt) {
  const p = state.player; if (!p) return;
  for (const q of state.quests.active) {
    const obj = q.def.objective;
    if (obj.type !== 'reach') continue;
    if (dist(p.x, p.y, obj.target.x, obj.target.y) < obj.target.r) {
      q.progress = 1;
      _completeQuest(q);
      break;
    }
  }
}

on('enemyKilled', ({ entity, byPlayer }) => {
  if (!byPlayer) return;
  for (const q of state.quests.active.slice()) {
    const obj = q.def.objective;
    if (obj.type === 'kill' && entity.type === obj.target) {
      q.progress++;
      if (q.progress >= obj.count) _completeQuest(q);
    } else if (obj.type === 'boss' && entity.isBoss && entity.type === obj.target) {
      q.progress = 1;
      _completeQuest(q);
    }
  }
});

on('pickup', ({ kind }) => {
  for (const q of state.quests.active.slice()) {
    const obj = q.def.objective;
    if (obj.type === 'collect' && kind === obj.target) {
      q.progress++;
      if (q.progress >= obj.count) _completeQuest(q);
    }
  }
});

registerUpdate(_checkReach);
