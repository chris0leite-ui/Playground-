// Runtime for content-authored encounters. Listens on region_entered and
// spawns the listed enemies as a scatter across walkable tiles. Keeps a
// per-region cooldown so re-entering doesn't immediately re-populate.

function encountersForRegion(id) {
  const all = (window.W && window.W.encounters) || {};
  const out = [];
  for (const k in all) if (all[k].region === id) out.push(all[k]);
  return out;
}

function spawnEncounter(enc) {
  if (!Array.isArray(enc.enemies)) return;
  const cx = state.player ? state.player.x : regionW() * TILE / 2;
  const cy = state.player ? state.player.y : regionH() * TILE / 2;
  for (const group of enc.enemies) {
    const count = group.count || 1;
    const type = group.type || 'orc';
    for (let i = 0; i < count; i++) {
      const pos = findOpenTile();
      if (!pos) continue;
      if (dist(pos.x, pos.y, cx, cy) < 5 * TILE) { i--; continue; }
      let ent = null;
      if (type === 'orc' && typeof makeOrc === 'function')        ent = makeOrc(pos.x, pos.y);
      else if (type === 'guard' && typeof makeGuard === 'function') ent = makeGuard(pos.x, pos.y);
      if (ent) { if (group.tag) ent.tag = group.tag; state.entities.push(ent); }
    }
  }
  if (enc.narrative && typeof showToast === 'function') showToast(enc.narrative, 2600);
}

function countLiveHostiles() {
  let n = 0;
  for (const e of state.entities) {
    if ((e.type === 'orc' || e.type === 'guard') && e.hp > 0) n++;
  }
  return n;
}

function onRegionEnteredSpawnEncounters(regionId) {
  if (!regionId) return;
  const region = state.world && state.world.regions && state.world.regions[regionId];
  if (!region) return;
  const already = (region._encounterSpawnedAt || 0);
  const now = state.time || 0;
  if (now - already < 30) return; // 30s cooldown per region
  const list = encountersForRegion(regionId);
  for (const enc of list) {
    if (enc.trigger !== 'on_enter_region') continue;
    if (enc.once && region._encounterFired && region._encounterFired[enc.id]) continue;
    spawnEncounter(enc);
    region._encounterFired = region._encounterFired || {};
    region._encounterFired[enc.id] = true;
  }
  // Baseline patrol so every content region has at least some hostiles.
  if (regionId !== 'minas-tirith' && countLiveHostiles() < 4) {
    spawnEncounter({ enemies: [{ type: 'orc', count: 6 }] });
  }
  region._encounterSpawnedAt = now;
}

function bindEncounterListeners() {
  if (typeof eventBus === 'undefined' || !eventBus.on) return;
  eventBus.on('region_entered', onRegionEnteredSpawnEncounters);
}
