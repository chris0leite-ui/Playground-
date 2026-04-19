function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function rand(lo, hi) { return lo + Math.random() * (hi - lo); }

function randInt(lo, hi) { return Math.floor(rand(lo, hi + 1)); }

function dist(ax, ay, bx, by) {
  const dx = ax - bx, dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

function distEnt(a, b) { return dist(a.x, a.y, b.x, b.y); }

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function tileAt(px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  if (tx < 0 || ty < 0 || tx >= MAP.W || ty >= MAP.H) return TILES.WALL;
  return state.map[ty][tx];
}

function isSolidTile(t) {
  return t === TILES.BUILDING || t === TILES.WATER || t === TILES.WALL || t === TILES.MOUNTAIN;
}

function isSwampTile(t) { return t === TILES.SWAMP; }

function isSolidAt(px, py) { return isSolidTile(tileAt(px, py)); }

function lerp(a, b, t) { return a + (b - a) * t; }

function now() { return performance.now() / 1000; }
