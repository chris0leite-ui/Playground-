// Quest state machine. Each active quest has a stepIdx into its
// compiled steps[] array (from W.quests[id].steps). Per-step-type checkers
// live in `questStepTypes` and react to engine events. Dialogue effects and
// content markdown can start/advance/complete quests.

const questStepTypes = {};

function registerQuestStepType(id, def) { questStepTypes[id] = def; }

function getQuestDef(id) {
  return (window.W && window.W.quests && window.W.quests[id]) || null;
}

function startQuest(id) {
  if (state.quests[id]) return;
  if (!getQuestDef(id)) return;
  state.quests[id] = { id, status: 'active', stepIdx: 0, flags: {} };
  eventBus.emit('quest_started', id);
}

function advanceQuest(id, stepId) {
  const q = state.quests[id];
  if (!q || q.status !== 'active') return;
  const def = getQuestDef(id);
  if (!def) return;
  const steps = def.steps || [];
  if (stepId) {
    const idx = steps.findIndex((s) => s.id === stepId);
    if (idx < 0) return;
    q.stepIdx = idx;
  } else {
    q.stepIdx++;
    q.flags = {}; // per-step scratch resets between steps
  }
  if (q.stepIdx >= steps.length) completeQuest(id);
  else eventBus.emit('quest_advanced', id, steps[q.stepIdx]);
}

function completeQuest(id) {
  const q = state.quests[id];
  if (!q) return;
  q.status = 'done';
  eventBus.emit('quest_completed', id);
}

function failQuest(id) {
  const q = state.quests[id];
  if (!q) return;
  q.status = 'failed';
  eventBus.emit('quest_failed', id);
}

function bindQuestListeners() {
  function checkAll(ev, args) {
    for (const id in state.quests) {
      const q = state.quests[id];
      if (q.status !== 'active') continue;
      const def = getQuestDef(id);
      if (!def) continue;
      const step = (def.steps || [])[q.stepIdx];
      if (!step) continue;
      const t = questStepTypes[step.type];
      if (!t || !t.check) continue;
      if (t.check(step, q, ev, args)) advanceQuest(id);
    }
  }
  eventBus.on('entity_killed',  (...a) => checkAll('entity_killed', a));
  eventBus.on('dialogue_ended', (...a) => checkAll('dialogue_ended', a));
  eventBus.on('tile_entered',   (...a) => checkAll('tile_entered', a));
  eventBus.on('item_picked_up', (...a) => checkAll('item_picked_up', a));
  eventBus.on('flag_set',       (...a) => checkAll('flag_set', a));
}

registerQuestStepType('kill', {
  check(step, q, ev, args) {
    if (ev !== 'entity_killed') return false;
    const victim = args[0];
    const want = (step.target && step.target.tag) || step.target;
    if (!victim || (victim.tag !== want && victim.type !== want)) return false;
    q.flags._kills = (q.flags._kills || 0) + 1;
    const need = step.count || (step.target && step.target.count) || 1;
    return q.flags._kills >= need;
  },
});

registerQuestStepType('dialogue', { check(step, q, ev) { return ev === 'dialogue_ended'; } });
registerQuestStepType('reach',    { check() { return false; } }); // tile_entered wired in T0.8
registerQuestStepType('gather',   {
  check(step, q, ev, args) { return ev === 'item_picked_up' && args[0] === step.target; },
});
registerQuestStepType('flag',     {
  check(step, q, ev, args) { return ev === 'flag_set' && args[0] === step.target; },
});
