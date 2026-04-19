// Friendly (non-hostile) NPC entity type. Drawn as a robed figure with a
// faction-tinted collar. Reacts to 'talk' input (see input.js handler).

function drawNpc(ctx, e) {
  drawShadow(ctx, 9);
  tint(ctx, e);
  // Robe
  ctx.fillStyle = e.robeColor || '#5a5a5a';
  ctx.fillRect(-6, -4, 12, 10);
  // Collar (faction color)
  ctx.fillStyle = e.collarColor || PALETTE.gondorGold;
  ctx.fillRect(-6, -4, 12, 2);
  // Head
  ctx.fillStyle = '#e0c8a0';
  ctx.beginPath(); ctx.arc(0, -7, 4, 0, Math.PI * 2); ctx.fill();
  // Name-pip indicator (small gold dot above head when dialogue available)
  if (e.dialogueId) {
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.beginPath(); ctx.arc(0, -14, 2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function updateNpc(e, dt) {
  // T1 NPCs are stationary — no AI beyond existing.
  if (e.hurtFlash > 0) e.hurtFlash -= dt;
}

function makeNpc(def) {
  const spawn = def.spawn_pos || { x: 24, y: 24 };
  const factionColor = (window.W && window.W.factions && window.W.factions[def.faction] &&
                        window.W.factions[def.faction].banner_color) || '#c0c0c0';
  return makeActor({
    type: 'npc',
    x: spawn.x * TILE + TILE / 2,
    y: spawn.y * TILE + TILE / 2,
    w: 12, h: 14,
    hp: 100,
    team: 'NPC',
    npcId: def.id,
    name: def.name,
    role: def.role,
    faction: def.faction,
    dialogueId: def.dialogue,
    collarColor: factionColor,
    robeColor: '#3a3a3a',
  });
}

registerEntityType('npc', {
  factory: makeNpc,
  update: updateNpc,
  draw: drawNpc,
});
