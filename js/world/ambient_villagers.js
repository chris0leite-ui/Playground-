// Decorative NPCs clustered around settlement landmarks. They have no
// dialogue, no quest hooks — just faces in the village so towns feel
// lived-in.

const VILLAGER_NAMES = {
  hobbiton:   ['Rosie', 'Peony', 'Adalgrim', 'Opal', 'Tom', 'Dora'],
  bree:       ['Nob', 'Harry', 'Mattie', 'Grim', 'Cole'],
  edoras:     ['Hama', 'Widfara', 'Thoden', 'Léoflæd', 'Oswyn'],
  rivendell:  ['Celebnor', 'Indis', 'Findir', 'Aewen'],
  isengard:   ['Wyn', 'Kael'],
  minasTirith:['Iorlas', 'Teluin', 'Fara', 'Beren'],
};

function _settlementSites() {
  return [
    ['hobbiton', LANDMARKS.hobbiton],
    ['bree', LANDMARKS.bree],
    ['edoras', LANDMARKS.edoras],
    ['rivendell', LANDMARKS.rivendell],
    ['isengard', LANDMARKS.isengard],
    ['minasTirith', LANDMARKS.minasTirith],
  ].filter(([, L]) => L);
}

function spawnAmbientVillagers() {
  if (typeof makeNpc !== 'function') return;
  for (const [key, L] of _settlementSites()) {
    const names = VILLAGER_NAMES[key] || ['Villager'];
    for (const name of names) {
      for (let tries = 0; tries < 12; tries++) {
        const ang = Math.random() * Math.PI * 2;
        const r = 1 + Math.random() * Math.max(2, (L.r || 3) - 1);
        const tx = Math.round(L.tx + Math.cos(ang) * r);
        const ty = Math.round(L.ty + Math.sin(ang) * r);
        if (tx < 0 || ty < 0 || tx >= MAP.W || ty >= MAP.H) continue;
        if (isSolidTile(state.map[ty][tx])) continue;
        state.entities.push(makeNpc({
          id: 'villager-' + key + '-' + name,
          name,
          role: 'villager',
          faction: 'none',
          spawn_pos: { x: tx, y: ty },
        }));
        break;
      }
    }
  }
}
