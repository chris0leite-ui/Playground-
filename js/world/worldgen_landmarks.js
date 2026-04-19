// Named-place registry + stamp. Every module that needs a world position
// for a named place reads LANDMARKS here; nothing else hardcodes pixels.

const LANDMARKS = {
  hobbiton:    { name: 'Hobbiton',       tx: 22,  ty: 34,  r: 5,  style: 'village' },
  bree:        { name: 'Bree',           tx: 55,  ty: 44,  r: 4,  style: 'village' },
  weathertop:  { name: 'Weathertop',     tx: 78,  ty: 38,  r: 3,  style: 'ruin' },
  rivendell:   { name: 'Rivendell',      tx: 120, ty: 32,  r: 5,  style: 'pavilion' },
  moriaGate:   { name: 'East-gate of Moria', tx: 108, ty: 70, r: 3, style: 'cavegate' },
  lothlorien:  { name: 'Lothlórien',     tx: 150, ty: 58,  r: 5,  style: 'glade' },
  dolGuldur:   { name: 'Dol Guldur',     tx: 215, ty: 82,  r: 3,  style: 'spire' },
  erebor:      { name: 'Erebor',         tx: 285, ty: 30,  r: 5,  style: 'mountain-hall' },
  isengard:    { name: 'Isengard',       tx: 100, ty: 120, r: 4,  style: 'tower' },
  helmsDeep:   { name: "Helm's Deep",    tx: 52,  ty: 138, r: 3,  style: 'fortress' },
  edoras:      { name: 'Edoras',         tx: 72,  ty: 148, r: 4,  style: 'hall' },
  osgiliath:   { name: 'Osgiliath',      tx: 175, ty: 150, r: 4,  style: 'ruin' },
  minasTirith: { name: 'Minas Tirith',   tx: 165, ty: 158, r: 20, style: 'concentric' },
  minasMorgul: { name: 'Minas Morgul',   tx: 200, ty: 155, r: 4,  style: 'spire' },
  blackGate:   { name: 'Black Gate',     tx: 232, ty: 130, r: 3,  style: 'gatewall' },
  baradDur:    { name: 'Barad-dûr',      tx: 280, ty: 152, r: 5,  style: 'spire' },
  mountDoom:   { name: 'Mount Doom',     tx: 255, ty: 165, r: 5,  style: 'volcano' },
  // --- Minor landmarks (quest targets) ---
  hobbitonPond:  { name: 'Hobbiton Pond',   tx: 30,  ty: 38,  r: 3, style: 'pond' },
  chetwoodGrove: { name: 'Chetwood Grove',  tx: 60,  ty: 34,  r: 4, style: 'grove' },
  barrowDowns:   { name: 'Barrow-downs',    tx: 62,  ty: 56,  r: 4, style: 'barrowring' },
  greenwayCamp:  { name: 'Greenway Camp',   tx: 50,  ty: 58,  r: 3, style: 'camp' },
  bruinenFord:   { name: 'Ford of Bruinen', tx: 112, ty: 40,  r: 3, style: 'ford' },
  mirkwoodNest:  { name: 'Spider Nest',     tx: 240, ty: 70,  r: 4, style: 'nest' },
  wildStables:   { name: 'Wild Stables',    tx: 92,  ty: 152, r: 3, style: 'paddock' },
  morannonCamp:  { name: 'Morannon Camp',   tx: 246, ty: 142, r: 3, style: 'camp' },
  oldFord:       { name: 'Old Ford',        tx: 172, ty: 50,  r: 3, style: 'ford' },
  mallornGlade:  { name: 'Mallorn Glade',   tx: 154, ty: 62,  r: 3, style: 'glade' },
};

function LANDMARK_PX(key) {
  const L = LANDMARKS[key];
  return L ? { x: L.tx * TILE, y: L.ty * TILE } : null;
}

function placeLandmark(L) {
  const { tx, ty, style } = L;
  switch (style) {
    case 'village': {
      const huts = [[-3,-1],[-1,2],[2,-2],[3,1],[-2,-3],[1,3]];
      for (const [dx, dy] of huts) _wgSet(tx + dx, ty + dy, TILES.BUILDING);
      return;
    }
    case 'pavilion':
      for (let dx = -3; dx <= 3; dx += 2) _wgSet(tx + dx, ty, TILES.BUILDING);
      for (let dx = -2; dx <= 2; dx += 2) _wgSet(tx + dx, ty + 1, TILES.PAVEMENT);
      return;
    case 'ruin':
      _wgSet(tx - 1, ty, TILES.WALL); _wgSet(tx + 1, ty, TILES.WALL);
      _wgSet(tx, ty - 1, TILES.WALL); _wgSet(tx - 2, ty + 1, TILES.WALL);
      return;
    case 'tower':
      for (let dy = -3; dy <= 0; dy++) {
        _wgSet(tx,     ty + dy, TILES.WALL);
        _wgSet(tx + 1, ty + dy, TILES.WALL);
      }
      for (let dx = -2; dx <= 3; dx++) _wgSet(tx + dx, ty + 1, TILES.PAVEMENT);
      return;
    case 'fortress':
      for (let dy = -2; dy <= 2; dy++) {
        _wgSet(tx - 2, ty + dy, TILES.WALL); _wgSet(tx + 2, ty + dy, TILES.WALL);
      }
      for (let dx = -2; dx <= 2; dx++) {
        _wgSet(tx + dx, ty - 2, TILES.WALL); _wgSet(tx + dx, ty + 2, TILES.WALL);
      }
      _wgSet(tx, ty, TILES.BUILDING);
      return;
    case 'hall':
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) _wgSet(tx + dx, ty + dy, TILES.BUILDING);
      return;
    case 'cavegate':
      for (let dy = -1; dy <= 1; dy++) {
        _wgSet(tx - 2, ty + dy, TILES.WALL); _wgSet(tx + 2, ty + dy, TILES.WALL);
      }
      _wgSet(tx, ty, TILES.PAVEMENT);
      return;
    case 'glade':
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) _wgSet(tx + dx, ty + dy, TILES.PAVEMENT);
      return;
    case 'spire':
      for (let dy = -4; dy <= 0; dy++) {
        _wgSet(tx,     ty + dy, TILES.WALL);
        _wgSet(tx + 1, ty + dy, TILES.WALL);
      }
      return;
    case 'gatewall':
      for (let dx = -4; dx <= 4; dx++) {
        if (Math.abs(dx) > 1) _wgSet(tx + dx, ty, TILES.WALL);
        else _wgSet(tx + dx, ty, TILES.ROAD);
      }
      return;
    case 'mountain-hall':
      for (let dx = -1; dx <= 1; dx++) _wgSet(tx + dx, ty, TILES.BUILDING);
      for (let dx = -2; dx <= 2; dx++) _wgSet(tx + dx, ty - 1, TILES.MOUNTAIN);
      for (let dx = -3; dx <= 3; dx++) _wgSet(tx + dx, ty - 2, TILES.MOUNTAIN);
      return;
    case 'volcano':
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const d = Math.hypot(dx, dy);
          if (d > 3) continue;
          if (d < 1.5) _wgSet(tx + dx, ty + dy, TILES.MORDOR);
          else _wgSet(tx + dx, ty + dy, TILES.MOUNTAIN);
        }
      }
      return;
    case 'concentric': buildConcentricCity(tx, ty, 18); return;
  }
  // Minor landmark styles live in worldgen_landmarks_ext.js so this file
  // stays under the 150-line budget.
  if (typeof placeLandmarkExt === 'function') placeLandmarkExt(L);
}
