// Macro-map overlay. Toggled with 'M' (or Esc to close). Lets the player
// jump between discovered regions. A minimal placeholder today (one
// region); content will populate W.overworld in later tiers.

function openOverworld() {
  if (!state.started || state.paused || state.gameOver) return;
  state.inputMode = 'overworld';
  state.edge.attack = false;
  state.edge.mount = false;
}

function closeOverworld() { state.inputMode = 'world'; }

function toggleOverworld() {
  if (state.inputMode === 'overworld') closeOverworld();
  else openOverworld();
}

function overworldMap() {
  const ow = window.W && window.W.overworld;
  if (ow && Array.isArray(ow.regions) && ow.regions.length) return ow;
  // Fallback: synthesize from W.regions + the hardcoded Minas Tirith so
  // the map is still useful if the overworld shard failed to load.
  const regions = [{ id: 'minas-tirith', x: 12, y: 13 }];
  const wr = (window.W && window.W.regions) || {};
  for (const id in wr) {
    const pos = wr[id] && wr[id].overworld_pos;
    if (pos) regions.push({ id, x: pos.x, y: pos.y });
  }
  return { bg_color: '#0a0a16', regions };
}

function overworldScreen(r) {
  const cx = state.viewW / 2, cy = state.viewH / 2;
  const scale = Math.min(state.viewW, state.viewH) / 20;
  return { x: cx + (r.x - 8) * scale, y: cy + (r.y - 8) * scale };
}

function drawOverworld(ctx) {
  const map = overworldMap();
  ctx.fillStyle = map.bg_color || 'rgba(10,10,14,0.88)';
  ctx.fillRect(0, 0, state.viewW, state.viewH);

  ctx.fillStyle = PALETTE.gondorGold;
  ctx.font = '22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Map of Middle-earth', state.viewW / 2, 48);

  ctx.font = '14px Georgia, serif';
  ctx.textBaseline = 'middle';
  for (const r of map.regions) {
    const unlocked = !r.unlocked_by || state.flags[r.unlocked_by];
    const current = state.world.currentRegionId === r.id;
    const { x, y } = overworldScreen(r);
    ctx.fillStyle = current ? PALETTE.gondorGold : unlocked ? PALETTE.gondorWhite : '#555';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    const content = window.W && window.W.regions && window.W.regions[r.id];
    const runtime = state.world.regions[r.id];
    const name = (content && content.name)
      || (runtime && runtime.def && runtime.def.name)
      || (runtime && runtime.id) || r.id;
    ctx.fillText(unlocked ? name : '???', x + 16, y);
  }

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#c8c8c8';
  ctx.font = '12px Georgia, serif';
  ctx.fillText('Press M or Esc to close.  Click a region to travel.',
    20, state.viewH - 16);
}

function overworldClick(clientX, clientY) {
  if (state.inputMode !== 'overworld') return;
  const map = overworldMap();
  for (const r of map.regions) {
    const { x, y } = overworldScreen(r);
    if (Math.hypot(clientX - x, clientY - y) > 14) continue;
    const unlocked = !r.unlocked_by || state.flags[r.unlocked_by];
    if (!unlocked) return;
    closeOverworld();
    if (r.id === state.world.currentRegionId) return;
    if (!state.world.regions[r.id]) return; // unbuilt region — ignore for now
    loadRegion(r.id);
    if (state.player && state.region.def && state.region.def.spawn_point) {
      state.player.x = state.region.def.spawn_point.x;
      state.player.y = state.region.def.spawn_point.y;
    }
    return;
  }
}
