// Quest-giver NPCs: standing close + pressing F starts the quest.
function makeQuestGiver(x, y, name, questId) {
  return {
    type: 'giver', x, y, w: 14, h: 14,
    noHp: true, alive: true,
    name, questId, angle: 0,
    team: TEAM.PLAYER, friendly: true,
    draw: drawQuestGiver,
    update: updateQuestGiver,
  };
}

function updateQuestGiver(dt, e) {
  const p = state.player;
  if (!p) return;
  const d = distEnt(e, p);
  if (d < 30) {
    const def = QUEST_REGISTRY[e.questId];
    const taken = state.quests.completed.indexOf(e.questId) >= 0
               || state.quests.active.find(q => q.id === e.questId);
    if (!taken && def) state.toast.hint = 'Press F: ' + e.name + ' — ' + def.title;
    if (!taken && state.edge.interact) {
      state.edge.interact = false;
      startQuest(e.questId);
    }
  }
}

function drawQuestGiver(ctx, e) {
  drawShadow(ctx, 8);
  ctx.fillStyle = '#2a3a5a';
  ctx.fillRect(-6, -5, 12, 11);
  ctx.fillStyle = PALETTE.gondorWhite;
  ctx.fillRect(-4, -3, 8, 7);
  ctx.fillStyle = '#e0c8a0';
  ctx.beginPath(); ctx.arc(0, -7, 3, 0, Math.PI * 2); ctx.fill();
  // Floating name tag
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  const w = e.name.length * 6 + 8;
  ctx.fillRect(-w/2, -22, w, 12);
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.font = 'bold 10px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText(e.name, 0, -13);
  // Quest "!" marker
  const pulse = 0.5 + Math.sin(state.time * 4) * 0.5;
  ctx.fillStyle = `rgba(240,200,60,${0.5 + pulse * 0.5})`;
  ctx.fillRect(-1, -32, 2, 6);
  ctx.fillRect(-1, -25, 2, 2);
}

function spawnQuestGivers() {
  const s = LANDMARK_PX('hobbiton');
  // Starting NPCs right inside Hobbiton so the player can take quests on turn 1.
  state.entities.push(makeQuestGiver(s.x - 30, s.y + 20, 'Rosie',     'faramir-message'));
  state.entities.push(makeQuestGiver(s.x + 30, s.y + 20, 'Hamfast',   'pelennor-patrol'));
  state.entities.push(makeQuestGiver(s.x,      s.y - 30, 'Traveller', 'captains-horse'));
}
