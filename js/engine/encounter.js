// Content-authored encounter runtime. On `reset` after worldgen, iterate
// W.encounters with trigger: on_enter_region and scatter their enemies in
// the biome they reference. Simpler than the old region-event hook — we
// no longer have region transitions.

function encountersForRegion(id) {
  const all = (window.W && window.W.encounters) || {};
  const out = [];
  for (const k in all) if (all[k].region === id) out.push(all[k]);
  return out;
}

function spawnEncounter(enc) {
  if (!Array.isArray(enc.enemies)) return;
  for (const group of enc.enemies) {
    const count = group.count || 1;
    const type = group.type || 'orc';
    for (let i = 0; i < count; i++) {
      const pos = findOpenTile();
      if (!pos) continue;
      let ent = null;
      if (type === 'orc' && typeof makeOrc === 'function')           ent = makeOrc(pos.x, pos.y);
      else if (type === 'guard' && typeof makeGuard === 'function')  ent = makeGuard(pos.x, pos.y);
      if (ent) { if (group.tag) ent.tag = group.tag; state.entities.push(ent); }
    }
  }
}

function spawnAllContentEncounters() {
  const all = (window.W && window.W.encounters) || {};
  for (const k in all) {
    if (all[k].trigger === 'on_enter_region') spawnEncounter(all[k]);
  }
}

function bindEncounterListeners() {
  if (typeof eventBus === 'undefined' || !eventBus.on) return;
  eventBus.on('reset', spawnAllContentEncounters);
}
