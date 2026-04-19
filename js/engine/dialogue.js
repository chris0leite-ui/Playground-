// Dialogue runtime. Tree-walks W.dialogues[id] via the #dialogue-overlay
// modal. Freezes world input by setting state.inputMode = 'dialogue'.
// Condition + effect evaluators are kept tiny here and extended by
// quest/faction listeners in T0.6.

let currentDialogue = null;

function openDialogue(id, ctx) {
  const W = window.W || {};
  const def = (W.dialogues || {})[id];
  if (!def) { console.warn('unknown dialogue:', id); return; }
  currentDialogue = { def, nodeId: def.start || 'start', ctx: ctx || {} };
  state.inputMode = 'dialogue';
  state.edge.attack = false;
  state.edge.mount = false;
  renderDialogue();
}

function advanceDialogue(choiceIdx) {
  if (!currentDialogue) return;
  const node = currentDialogue.def.nodes[currentDialogue.nodeId];
  if (!node) { closeDialogue(); return; }
  const visible = visibleChoices(node);
  const choice = visible[choiceIdx];
  if (!choice) return;
  if (choice.effects) for (const eff of choice.effects) applyEffect(eff);
  if (!choice.next) { closeDialogue(); return; }
  currentDialogue.nodeId = choice.next;
  renderDialogue();
}

function closeDialogue() {
  currentDialogue = null;
  state.inputMode = 'world';
  const panel = document.getElementById('dialogue-overlay');
  if (panel) panel.classList.add('hidden');
  eventBus.emit('dialogue_ended');
}

function visibleChoices(node) {
  return (node.choices || []).filter((c) => !c.cond || evalCond(c.cond));
}

function renderDialogue() {
  const panel = document.getElementById('dialogue-overlay');
  const textEl = document.getElementById('dialogue-text');
  const choicesEl = document.getElementById('dialogue-choices');
  if (!panel || !textEl || !choicesEl) return;
  const node = currentDialogue.def.nodes[currentDialogue.nodeId];
  textEl.textContent = node && node.text ? node.text : '';
  choicesEl.innerHTML = '';
  const visible = visibleChoices(node || {});
  visible.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = c.text;
    btn.addEventListener('click', () => advanceDialogue(i));
    choicesEl.appendChild(btn);
  });
  panel.classList.remove('hidden');
}

function evalCond(cond) {
  if (!cond) return true;
  switch (cond.type) {
    case 'flag':     return !!state.flags[cond.name];
    case 'not_flag': return !state.flags[cond.name];
    case 'quest_step_cmp': {
      const q = state.quests[cond.quest];
      const step = q ? q.stepIdx : -1;
      return compareNum(step, cond.cmp, cond.n);
    }
    case 'faction_rep_cmp': {
      const r = (state.reputation[cond.faction] || 0);
      return compareNum(r, cond.cmp, cond.n);
    }
    case 'item': {
      const p = state.player;
      return !!(p && p.inventory && p.inventory.indexOf(cond.id) >= 0);
    }
    case 'not_item': {
      const p = state.player;
      return !(p && p.inventory && p.inventory.indexOf(cond.id) >= 0);
    }
    case 'class_eq': {
      const p = state.player;
      return !!(p && p.classId === cond.classId);
    }
    default: return true;
  }
}

function compareNum(a, cmp, b) {
  switch (cmp) {
    case '>=': return a >= b;
    case '>':  return a > b;
    case '<=': return a <= b;
    case '<':  return a < b;
    case '==': return a === b;
  }
  return false;
}

function applyEffect(eff) {
  if (!eff) return;
  switch (eff.type) {
    case 'gold':
      if (state.player) state.player.gold = Math.max(0, (state.player.gold || 0) + eff.delta);
      break;
    case 'hp':
      if (state.player) state.player.hp = clamp(state.player.hp + eff.delta, 0, state.player.maxHp);
      break;
    case 'flag':
      state.flags[eff.name] = eff.value !== undefined ? eff.value : true;
      eventBus.emit('flag_set', eff.name, state.flags[eff.name]);
      break;
    case 'quest_start':    startQuest(eff.id); break;
    case 'quest_advance':  advanceQuest(eff.id, eff.step); break;
    case 'quest_complete': completeQuest(eff.id); break;
    case 'faction_rep':    modRep(eff.faction, eff.delta); break;
    // 'item' is deferred to inventory work in T2.
    default:
      eventBus.emit('dialogue_effect', eff);
  }
}

// Debug fixture so the pipeline is testable before any markdown content
// exists. Removed once content authoring lands.
(function registerDebugDialogue() {
  window.W = window.W || {};
  window.W.dialogues = window.W.dialogues || {};
  if (window.W.dialogues['__test__']) return;
  window.W.dialogues['__test__'] = {
    start: 'start',
    nodes: {
      start: {
        text: 'Hail, Ranger. The road is long. Shall we speak?',
        choices: [
          { text: 'Speak on.', next: 'more' },
          { text: 'Another time.', next: null },
        ],
      },
      more: {
        text: 'Dark tidings from the east. Be wary.',
        choices: [{ text: 'Farewell.', next: null }],
      },
    },
  };
})();
