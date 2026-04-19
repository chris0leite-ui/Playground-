// Spawn every content-authored NPC onto the unified world. Each NPC
// carries a `world_pos: {x,y}` in tile coordinates, computed at build
// time via build/region_layout.js. If the chosen tile is solid we scan
// outward for the nearest walkable tile so nobody gets trapped in a wall.

function _findNearbyWalkable(tx, ty, maxR) {
  const limit = maxR || 8;
  for (let r = 0; r <= limit; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = tx + dx, y = ty + dy;
        if (x < 0 || y < 0 || x >= MAP.W || y >= MAP.H) continue;
        if (!isSolidTile(state.map[y][x])) return { x, y };
      }
    }
  }
  return { x: tx, y: ty };
}

function spawnContentNPCs() {
  const W = window.W || {};
  const npcs = W.npcs || {};
  if (typeof makeNpc !== 'function') return;
  for (const id in npcs) {
    const n = npcs[id];
    const wp = n.world_pos || { x: 20, y: 20 };
    const safe = _findNearbyWalkable(wp.x | 0, wp.y | 0, 10);
    const def = Object.assign({}, n, {
      spawn_pos: { x: safe.x, y: safe.y },
    });
    const ent = makeNpc(def);
    if (ent) state.entities.push(ent);
  }
}
