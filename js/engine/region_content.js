// Registers every content-authored region (window.W.regions + W.tilemaps)
// into state.world.regions so loadRegion(id) works for them. Called once
// after initDefaultRegion, before the player picks a class.

function registerContentRegions() {
  const W = window.W || {};
  for (const id in (W.regions || {})) {
    if (state.world.regions[id]) continue; // don't overwrite runtime shims
    const rdef = W.regions[id];
    const tmId = rdef.tilemap || id;
    const tm = (W.tilemaps || {})[tmId];
    if (!tm) { console.warn('no tilemap for region', id, tmId); continue; }
    const tilemap = tm.grid.map((row) => row.slice());
    const spawn = rdef.spawn_point
      ? { x: rdef.spawn_point.x * TILE + TILE / 2,
          y: rdef.spawn_point.y * TILE + TILE / 2 }
      : { x: (tm.w / 2) * TILE, y: (tm.h / 2) * TILE };
    const region = makeRegion(id, tm.w, tm.h, tilemap, {
      spawn_point: spawn,
      neighbors: rdef.neighbors || {},
      subtypes: tm.subtypes || {},
      decor: tm.decor || [],
    });
    state.world.regions[id] = region;
    // Pre-place any NPCs whose location points into this region.
    for (const npcId in (W.npcs || {})) {
      const n = W.npcs[npcId];
      if (!n.location) continue;
      const [t, ref] = n.location.split(':');
      let matches = false;
      if (t === 'region' && ref === id) matches = true;
      else if (t === 'building') {
        const b = (W.buildings || {})[ref];
        if (b && (b.region === id || (b.settlement && (W.settlements || {})[b.settlement] &&
          (W.settlements || {})[b.settlement].region === id))) matches = true;
      }
      if (matches && typeof makeNpc === 'function') {
        region.entities.push(makeNpc(n));
      }
    }
  }
}
