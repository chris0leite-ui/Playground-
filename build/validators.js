// Cross-reference validator. After per-record schema checks, this pass
// verifies every <type>:<id> reference resolves, region neighbors are
// symmetric, arcs don't cycle, etc. Extend here as new constraints land.

function validateCrossRefs(store) {
  const errors = [];
  function refExists(ref) {
    if (typeof ref !== 'string' || !ref.includes(':')) return true;
    const [t, id] = ref.split(':', 2);
    const bucket = store[t + 's'];
    return bucket && bucket[id];
  }

  // Region neighbor symmetry.
  for (const id in store.regions) {
    const r = store.regions[id];
    const n = r.neighbors || {};
    for (const dir in n) {
      const other = n[dir];
      if (!other) continue;
      if (!store.regions[other]) {
        errors.push(`region "${id}" has neighbor "${other}" (${dir}) which does not exist`);
        continue;
      }
      const opp = { north: 'south', south: 'north', east: 'west', west: 'east',
                    ne: 'sw', sw: 'ne', nw: 'se', se: 'nw' }[dir];
      const back = (store.regions[other].neighbors || {})[opp];
      if (back !== id) {
        errors.push(`region "${id}" neighbor "${other}" (${dir}) not mirrored: "${other}".${opp} = ${back}`);
      }
    }
  }

  // NPC location must reference a real region or building.
  for (const id in store.npcs) {
    const n = store.npcs[id];
    if (!refExists(n.location)) {
      errors.push(`npc "${id}" location "${n.location}" does not resolve`);
    }
  }

  // Quest giver must be a real npc.
  for (const id in store.quests) {
    const q = store.quests[id];
    if (!refExists(q.giver)) {
      errors.push(`quest "${id}" giver "${q.giver}" does not resolve`);
    }
  }

  // Arc quests_in_order resolve + no cycles (a quest appearing twice).
  for (const id in store.arcs) {
    const a = store.arcs[id];
    const seen = new Set();
    for (const ref of a.quests_in_order || []) {
      if (!refExists(ref)) errors.push(`arc "${id}" includes missing ${ref}`);
      if (seen.has(ref)) errors.push(`arc "${id}" includes ${ref} more than once`);
      seen.add(ref);
    }
  }

  return errors;
}

module.exports = { validateCrossRefs };
