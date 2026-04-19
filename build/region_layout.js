// Region-to-world-tile mapping. Hand-tuned rectangles on the 320x192 world
// map so each authored region's content lands on or near its real
// Middle-earth biome. Keys match content/regions/<id>/region.md ids.
//
// Fields: ox, oy are the top-left world-tile of the region's local (0,0).
// w,h are the region's width/height in world tiles (used to clip content).

const REGION_LAYOUT = {
  'shire':               { ox:  10, oy:  20, w: 48, h: 30 },
  'bree-land':           { ox:  42, oy:  28, w: 40, h: 28 },
  'old-forest':          { ox:  50, oy:  55, w: 20, h: 16 },
  'eriador-rivendell':   { ox: 104, oy:  20, w: 36, h: 26 },
  'moria-hollin':        { ox:  96, oy:  60, w: 20, h: 18 },
  'lothlorien-anduin':   { ox: 134, oy:  50, w: 36, h: 28 },
  'rohan':               { ox:  52, oy: 130, w: 46, h: 30 },
  'gondor-south':        { ox: 152, oy: 140, w: 40, h: 30 },
  'dale-erebor':         { ox: 260, oy:  18, w: 40, h: 30 },
  'mordor-ruin':         { ox: 224, oy: 132, w: 56, h: 38 },
  'minas-tirith':        { ox: 152, oy: 140, w: 30, h: 30 },
};

// Default rectangle if a region isn't listed. Drops into a safe Shire-edge
// area so even unmapped content shows up somewhere visible.
const DEFAULT_LAYOUT = { ox: 10, oy: 85, w: 30, h: 20 };

function layoutFor(regionId) {
  return REGION_LAYOUT[regionId] || DEFAULT_LAYOUT;
}

// Compute the world tile for a content-local (x,y) pair under a given
// region. Clamps inside the region rect so nothing spills.
function toWorldTile(regionId, localX, localY) {
  const L = layoutFor(regionId);
  const cx = Math.max(0, Math.min(L.w - 1, localX | 0));
  const cy = Math.max(0, Math.min(L.h - 1, localY | 0));
  return { x: L.ox + cx, y: L.oy + cy };
}

module.exports = { REGION_LAYOUT, layoutFor, toWorldTile };
