// Reach-step helpers. Split from engine/quest.js so each stays under the
// 150-line budget. Uses LANDMARKS from worldgen_landmarks.js.

function reachStepTarget(step) {
  if (!step || !step.target || typeof LANDMARKS === 'undefined') return null;
  const s = String(step.target);
  if (s.indexOf('landmark:') === 0) {
    const L = LANDMARKS[s.slice(9)];
    if (!L) return null;
    return { x: L.tx * TILE, y: L.ty * TILE, r: step.radius || L.r || 3 };
  }
  return null;
}

let _reachTick = 0;
function tickReachQuests(dt) {
  _reachTick += dt;
  if (_reachTick < 0.25) return;
  _reachTick = 0;
  const p = state.player;
  if (!p) return;
  for (const id in state.quests) {
    const q = state.quests[id];
    if (q.status !== 'active') continue;
    const def = getQuestDef(id);
    if (!def) continue;
    const step = (def.steps || [])[q.stepIdx];
    if (!step || step.type !== 'reach') continue;
    const tgt = reachStepTarget(step);
    if (!tgt) continue;
    const d = Math.hypot(p.x - tgt.x, p.y - tgt.y);
    if (d <= tgt.r * TILE) {
      q.flags._reached = true;
      if (step.set_flag) {
        state.flags[step.set_flag] = true;
        eventBus.emit('flag_set', step.set_flag, true);
      }
      advanceQuest(id);
      if (typeof showToast === 'function' && def.title) {
        showToast(`${def.title}: target reached — return to the giver.`, 2400);
      }
    }
  }
}

// Active reach-step target for the first active quest whose current step
// is `reach`. Used by the minimap pin and compass.
function activeReachTarget() {
  for (const id in state.quests) {
    const q = state.quests[id];
    if (q.status !== 'active') continue;
    const def = getQuestDef(id);
    if (!def) continue;
    const step = (def.steps || [])[q.stepIdx];
    if (!step || step.type !== 'reach') continue;
    const tgt = reachStepTarget(step);
    if (tgt) return { x: tgt.x, y: tgt.y, title: def.title || 'Quest' };
  }
  return null;
}
