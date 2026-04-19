// Orchestrator: allocate map, paint biomes → terrain → roads → landmarks
// → bridges → tree scatter. Exposed as generateWorld(); called by
// initWorld() in engine/world.js at run start.

function generateWorld() {
  state.map = [];
  for (let y = 0; y < MAP.H; y++) {
    const row = [];
    for (let x = 0; x < MAP.W; x++) row.push(TILES.GRASS);
    state.map.push(row);
  }
  paintBiomes();
  carveAnduin();
  carveMistyMountains();
  fenceMordor();
  // Minas Tirith first so other landmarks can overlap its outskirts.
  placeLandmark(LANDMARKS.minasTirith);
  // Road network before landmark structures — villages stamp on roads
  // as natural plazas.
  carveRoadNetwork();
  for (const key in LANDMARKS) {
    if (key === 'minasTirith') continue;
    placeLandmark(LANDMARKS[key]);
  }
  placeBridges();
  scatterTrees();
}

function carveRoadNetwork() {
  const routes = [
    ['hobbiton',   'bree'],
    ['bree',       'weathertop'],
    ['weathertop', 'rivendell'],
    ['rivendell',  'moriaGate'],
    ['moriaGate',  'lothlorien'],
    ['lothlorien', 'dolGuldur'],
    ['moriaGate',  'isengard'],
    ['isengard',   'helmsDeep'],
    ['helmsDeep',  'edoras'],
    ['edoras',     'osgiliath'],
    ['osgiliath',  'minasTirith'],
    ['osgiliath',  'minasMorgul'],
    ['minasMorgul','blackGate'],
    ['blackGate',  'baradDur'],
    ['baradDur',   'mountDoom'],
  ];
  for (const [a, b] of routes) {
    const A = LANDMARKS[a], B = LANDMARKS[b];
    if (A && B) carveRoadLine(A.tx, A.ty, B.tx, B.ty);
  }
}
