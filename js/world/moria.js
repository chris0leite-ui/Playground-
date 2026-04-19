// Moria dungeon. A separate 60x40 map the player enters by pressing Use
// on the Moria Gate. While inside, state.map and state.entities are swapped
// for Moria's versions; leaving restores the surface state exactly.
const MORIA_W = 60, MORIA_H = 40;

function _carveRoom(map, x0, y0, w, h) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      if (x >= 0 && y >= 0 && x < MORIA_W && y < MORIA_H) {
        map[y][x] = TILES.DUNGEON_FLOOR;
      }
    }
  }
}

function _carveCorridor(map, x0, y0, x1, y1) {
  // L-shaped passage: horizontal first then vertical.
  const mx = x1;
  for (let x = Math.min(x0, mx); x <= Math.max(x0, mx); x++) {
    if (x >= 0 && y0 >= 0 && x < MORIA_W && y0 < MORIA_H) map[y0][x] = TILES.DUNGEON_FLOOR;
    if (x >= 0 && y0 + 1 < MORIA_H) map[y0 + 1][x] = TILES.DUNGEON_FLOOR;
  }
  for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) {
    if (mx >= 0 && y >= 0 && mx < MORIA_W && y < MORIA_H) map[y][mx] = TILES.DUNGEON_FLOOR;
    if (mx + 1 < MORIA_W) map[y][mx + 1] = TILES.DUNGEON_FLOOR;
  }
}

function generateMoriaMap() {
  const map = [];
  for (let y = 0; y < MORIA_H; y++) {
    const row = [];
    for (let x = 0; x < MORIA_W; x++) row.push(TILES.DUNGEON_WALL);
    map.push(row);
  }
  // Entrance chamber (west, near East-gate of Moria).
  _carveRoom(map, 2, 16, 8, 8);
  // Pillared hall.
  _carveRoom(map, 14, 4, 14, 14);
  // Second Hall with chasm.
  _carveRoom(map, 14, 22, 18, 14);
  // Durin's chamber.
  _carveRoom(map, 36, 10, 12, 14);
  // Bridge room.
  _carveRoom(map, 36, 26, 10, 8);
  // Balrog chamber (east).
  _carveRoom(map, 50, 14, 9, 12);
  // Corridors.
  _carveCorridor(map, 9, 20, 14, 11);
  _carveCorridor(map, 27, 11, 36, 16);
  _carveCorridor(map, 31, 29, 36, 29);
  _carveCorridor(map, 45, 19, 50, 19);
  _carveCorridor(map, 45, 29, 50, 19);

  // Carve the chasm across the bridge room.
  for (let y = 27; y < 33; y++) {
    for (let x = 38; x < 44; x++) map[y][x] = TILES.CHASM;
  }
  // Durin's Bridge — a single-tile-wide span.
  map[29][40] = TILES.DUNGEON_FLOOR;
  map[29][41] = TILES.DUNGEON_FLOOR;
  map[30][40] = TILES.DUNGEON_FLOOR;
  map[30][41] = TILES.DUNGEON_FLOOR;

  return map;
}

// --- Portal entity used for both "enter Moria" (on surface) and
// "return to surface" (inside Moria). Interaction is handled via its update.
function makeMoriaPortal(x, y, dir) {
  return {
    type: 'moriaPortal', x, y, w: 24, h: 24,
    noHp: true, alive: true, angle: 0,
    dir, // 'enter' or 'exit'
    team: TEAM.NEUTRAL,
    draw: drawMoriaPortal,
    update: updateMoriaPortal,
  };
}

function updateMoriaPortal(dt, e) {
  const p = state.player;
  if (!p) return;
  const d = distEnt(e, p);
  if (d < 28) {
    state.toast.hint = e.dir === 'enter'
      ? 'Press Use to descend into the Mines of Moria'
      : 'Press Use to climb back to Middle-earth';
    if (state.edge.interact) {
      state.edge.interact = false;
      if (e.dir === 'enter') enterMoria();
      else leaveMoria();
    }
  }
}

function drawMoriaPortal(ctx, e) {
  drawShadow(ctx, 14);
  // Stone arch with a dark entryway.
  ctx.fillStyle = '#3a2a22';
  ctx.fillRect(-12, -14, 24, 20);
  ctx.fillStyle = '#0a0606';
  ctx.fillRect(-8, -10, 16, 16);
  // Glowing rune.
  const pulse = 0.5 + Math.sin(state.time * 2) * 0.5;
  ctx.fillStyle = `rgba(200,180,255,${0.5 + pulse * 0.4})`;
  ctx.fillRect(-3, -6, 6, 2);
  ctx.fillRect(-1, -8, 2, 6);
}

// --- Surface → Moria transition ---
function enterMoria() {
  if (state.location === 'moria') return;
  // Snapshot surface.
  state.surfaceSnapshot = {
    map: state.map,
    entities: state.entities,
    mapW: MAP.W,
    mapH: MAP.H,
    playerX: state.player.x,
    playerY: state.player.y,
  };
  // Dismount — horses don't come into the mines.
  if (state.player.onHorse) {
    state.player.onHorse.rider = null;
    state.player.onHorse = null;
  }
  // Swap world dimensions and map.
  MAP.W = MORIA_W;
  MAP.H = MORIA_H;
  state.map = generateMoriaMap();
  state.entities = [state.player];
  // Place player at the entrance chamber.
  state.player.x = 5 * TILE;
  state.player.y = 20 * TILE;
  // Exit portal next to the player, heading back.
  state.entities.push(makeMoriaPortal(3 * TILE, 20 * TILE, 'exit'));
  // Populate the mines with goblins + Balrog.
  _spawnMoriaEnemies();
  state.location = 'moria';
  if (typeof MINIMAP !== 'undefined') MINIMAP.cache = null;
  toast('You descend into the Mines of Moria…', 4);
  emit('locationChanged', { to: 'moria' });
}

function leaveMoria() {
  if (state.location !== 'moria') return;
  const snap = state.surfaceSnapshot;
  MAP.W = snap.mapW;
  MAP.H = snap.mapH;
  state.map = snap.map;
  state.entities = snap.entities;
  if (state.entities.indexOf(state.player) === -1) state.entities.push(state.player);
  // Return the player to a safe tile just outside the Moria Gate.
  const gate = LANDMARKS.moriaGate;
  state.player.x = gate.tx * TILE + 3 * TILE;  // a few tiles east of the gate
  state.player.y = gate.ty * TILE;
  state.location = 'surface';
  state.surfaceSnapshot = null;
  if (typeof MINIMAP !== 'undefined') MINIMAP.cache = null;
  toast('You emerge into the light of Middle-earth.', 3);
  emit('locationChanged', { to: 'surface' });
}

function _spawnMoriaEnemies() {
  // Moria goblins — orc factories placed on floor tiles in a few rooms.
  const goblinRooms = [
    { x0: 14, y0: 4,  w: 14, h: 14, n: 6 },
    { x0: 14, y0: 22, w: 18, h: 14, n: 8 },
    { x0: 36, y0: 10, w: 12, h: 14, n: 5 },
  ];
  for (const r of goblinRooms) {
    for (let i = 0; i < r.n; i++) {
      const tx = r.x0 + 1 + Math.floor(Math.random() * (r.w - 2));
      const ty = r.y0 + 1 + Math.floor(Math.random() * (r.h - 2));
      if (state.map[ty][tx] === TILES.DUNGEON_FLOOR) {
        state.entities.push(makeOrc(tx * TILE + TILE / 2, ty * TILE + TILE / 2));
      }
    }
  }
  // Balrog inside its eastern chamber.
  const bx = 54 * TILE, by = 20 * TILE;
  state.entities.push(makeBossBalrog(bx, by));
  // Treasure piles scattered on floors.
  for (let i = 0; i < 12; i++) {
    const tx = 2 + Math.floor(Math.random() * (MORIA_W - 4));
    const ty = 2 + Math.floor(Math.random() * (MORIA_H - 4));
    if (state.map[ty][tx] === TILES.DUNGEON_FLOOR) {
      state.entities.push(makePickup(tx * TILE + TILE / 2, ty * TILE + TILE / 2, Math.random() < 0.7 ? 'gold' : 'lembas'));
    }
  }
}

// --- Surface gate interaction: detect proximity to Moria Gate landmark
// and pop an enter-portal prompt.
function _tickMoriaGate(dt) {
  if (state.location !== 'surface') return;
  const p = state.player;
  if (!p) return;
  const lm = LANDMARKS.moriaGate;
  const dx = p.x / TILE - lm.tx;
  const dy = p.y / TILE - lm.ty;
  if (dx * dx + dy * dy < 9) { // within 3 tiles of the gate
    state.toast.hint = 'Press Use to descend into the Mines of Moria';
    if (state.edge.interact) {
      state.edge.interact = false;
      enterMoria();
    }
  }
}
registerUpdate(_tickMoriaGate);

// Reset the dungeon state on full-run reset.
on('reset', () => {
  state.location = 'surface';
  state.surfaceSnapshot = null;
});
state.location = state.location || 'surface';

// Balrog defeat → 15% victory bonus (separate from bossTroll etc).
on('bossDefeated', ({ type }) => {
  if (type === 'bossBalrog' && state.victory) {
    if (!state.victory.hit.balrog) {
      state.victory.hit.balrog = true;
      state.victory.percent = Math.min(100, state.victory.percent + 15);
      toast('★ Balrog cast into shadow (+15% toward Victory)', 5);
    }
  }
});

// Extra XP entry for the Balrog.
if (typeof XP_PER !== 'undefined') XP_PER.bossBalrog = 600;
