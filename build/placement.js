// Decorate NPCs / settlements / buildings with absolute world-tile
// positions based on their region's layout rectangle. Run once after
// ingest() but before emit shards, so the compiled JS carries world_pos.

const { toWorldTile } = require('./region_layout');

function decorateWorldPositions(store) {
  for (const id in store.npcs) {
    const n = store.npcs[id];
    const regionId = extractRegionFromLocation(n.location, store);
    const local = n.spawn_pos || { x: 0, y: 0 };
    n.world_pos = toWorldTile(regionId, local.x, local.y);
  }
  for (const id in store.settlements) {
    const s = store.settlements[id];
    const tr = s.tile_region || { x: 0, y: 0, w: 4, h: 4 };
    s.world_pos = toWorldTile(
      s.region,
      Math.round((tr.x || 0) + (tr.w || 0) / 2),
      Math.round((tr.y || 0) + (tr.h || 0) / 2),
    );
  }
  for (const id in store.buildings) {
    const b = store.buildings[id];
    if (!b.entrance) continue;
    const sid = b.settlement;
    const settle = sid && store.settlements[sid];
    const regionId = settle ? settle.region : (b.region || null);
    b.world_pos = toWorldTile(regionId, b.entrance.x, b.entrance.y);
  }
}

function extractRegionFromLocation(loc, store) {
  if (!loc) return null;
  const [kind, ref] = String(loc).split(':');
  if (kind === 'region') return ref;
  if (kind === 'building') {
    const b = store.buildings[ref];
    if (!b) return null;
    const sid = b.settlement;
    const settle = sid && store.settlements[sid];
    return settle ? settle.region : (b.region || null);
  }
  return null;
}

function reportPlacement(store) {
  console.log('[placement] settlements:');
  for (const id in store.settlements) {
    const s = store.settlements[id];
    console.log('  ', id, '→', s.world_pos, 'region:', s.region);
  }
  console.log('[placement] npcs:');
  for (const id in store.npcs) {
    const n = store.npcs[id];
    console.log('  ', id, '→', n.world_pos);
  }
}

module.exports = { decorateWorldPositions, reportPlacement };
