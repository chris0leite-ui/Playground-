// Middle-earth landmark registry. Every module that needs a named-place
// position reads from LANDMARKS; nothing else should hard-code pixel
// offsets from (MAP.W/2, MAP.H/2) any more.
//
// tx / ty are tile coordinates (0..MAP.W, 0..MAP.H).
// r is the "inside this landmark" radius in tiles (for region-enter toasts).
// biome controls which ground tile the worldgen paints underneath the
// landmark's footprint (before buildings/walls are stamped on top).
const LANDMARKS = {
  // --- Eriador (NW) ---
  hobbiton:    { name: 'Hobbiton',      tx: 22,  ty: 34,  r: 5,  biome: 'SHIRE',     style: 'village' },
  bree:        { name: 'Bree',          tx: 55,  ty: 44,  r: 4,  biome: 'SHIRE',     style: 'village' },
  weathertop:  { name: 'Weathertop',    tx: 78,  ty: 38,  r: 3,                       style: 'ruin' },
  rivendell:   { name: 'Rivendell',     tx: 120, ty: 32,  r: 5,  biome: 'RIVENDELL', style: 'pavilion' },
  // --- Misty Mountains / Moria ---
  moriaGate:   { name: 'East-gate of Moria', tx: 108, ty: 70, r: 3, style: 'cavegate' },
  // --- Rhovanion / Anduin vale ---
  lothlorien:  { name: 'Lothlórien',    tx: 150, ty: 58,  r: 5,  biome: 'FOREST',    style: 'glade' },
  mirkwood:    { name: 'Mirkwood',      tx: 230, ty: 50,  r: 30, biome: 'FOREST' },   // biome-only
  dolGuldur:   { name: 'Dol Guldur',    tx: 215, ty: 82,  r: 3,                       style: 'spire' },
  erebor:      { name: 'Erebor',        tx: 285, ty: 30,  r: 5,                       style: 'mountain-hall' },
  // --- Rohan (SW) ---
  isengard:    { name: 'Isengard',      tx: 100, ty: 120, r: 4,                       style: 'tower' },
  helmsDeep:   { name: "Helm's Deep",   tx: 52,  ty: 138, r: 3,                       style: 'fortress' },
  edoras:      { name: 'Edoras',        tx: 72,  ty: 148, r: 4,  biome: 'ROHAN',     style: 'hall' },
  // --- Gondor (S-center) ---
  osgiliath:   { name: 'Osgiliath',     tx: 175, ty: 150, r: 4,                       style: 'ruin' },
  minasTirith: { name: 'Minas Tirith',  tx: 165, ty: 158, r: 20,                      style: 'concentric' },
  minasMorgul: { name: 'Minas Morgul',  tx: 200, ty: 155, r: 4,                       style: 'spire-evil' },
  // --- Mordor (SE) ---
  blackGate:   { name: 'Black Gate',    tx: 232, ty: 130, r: 3,                       style: 'gatewall' },
  baradDur:    { name: 'Barad-dûr',     tx: 280, ty: 152, r: 5,                       style: 'spire-evil' },
  mountDoom:   { name: 'Mount Doom',    tx: 255, ty: 165, r: 5,                       style: 'volcano' },
};

function LANDMARK_PX(key) {
  const L = LANDMARKS[key];
  return { x: L.tx * TILE, y: L.ty * TILE };
}

// Region-enter detection. Returns the landmark the player is currently inside
// (via r), or the biome name of the tile underfoot, whichever is more specific.
function regionAt(px, py) {
  const tx = px / TILE, ty = py / TILE;
  for (const key in LANDMARKS) {
    const L = LANDMARKS[key];
    if (L.r && Math.hypot(tx - L.tx, ty - L.ty) < L.r) return L.name;
  }
  // Fall back to biome tile.
  const t = tileAt(px, py);
  const biomeName = {
    [TILES.SHIRE]: 'The Shire',
    [TILES.RIVENDELL]: 'Rivendell Valley',
    [TILES.ROHAN]: 'The Riddermark',
    [TILES.MORDOR]: 'Mordor',
    [TILES.FANGORN]: 'Fangorn Forest',
    [TILES.FOREST]: 'The Greenwood',
    [TILES.SAND]: 'Harad',
    [TILES.SWAMP]: 'Dead Marshes',
  }[t];
  return biomeName || null;
}

let _lastRegion = null;
function updateRegionLabel(dt) {
  const p = state.player;
  if (!p) return;
  const r = regionAt(p.x, p.y);
  if (r !== _lastRegion) {
    _lastRegion = r;
    if (r) toast('Entering ' + r, 3);
  }
}
registerUpdate(updateRegionLabel);
on('reset', () => { _lastRegion = null; });
