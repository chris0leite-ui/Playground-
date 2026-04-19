// World shim. Replaces the old region.js edge-transition machinery with a
// single-map model. regionW/regionH still exist as compatibility aliases
// so existing engine code keeps working.

function regionW() { return MAP.W; }
function regionH() { return MAP.H; }

function initWorld() {
  generateWorld();
}
