// Main entry point: canvas sizing, main loop, top-level update/draw, boot.

let _last = 0;
let _deathShown = false;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  state.canvas.width = Math.floor(w * dpr);
  state.canvas.height = Math.floor(h * dpr);
  state.canvas.style.width = w + 'px';
  state.canvas.style.height = h + 'px';
  state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  state.viewW = w;
  state.viewH = h;
  state.dpr = dpr;
}

function updateCamera() {
  const p = state.player;
  if (!p) return;
  let cx = p.x - state.viewW / 2;
  let cy = p.y - state.viewH / 2;
  const wPx = regionW() * TILE, hPx = regionH() * TILE;
  cx = clamp(cx, 0, wPx - state.viewW);
  cy = clamp(cy, 0, hPx - state.viewH);
  // If view exceeds region size, center the region.
  if (state.viewW > wPx) cx = (wPx - state.viewW) / 2;
  if (state.viewH > hPx) cy = (hPx - state.viewH) / 2;
  if (state.shake > 0) {
    cx += (Math.random() - 0.5) * state.shake;
    cy += (Math.random() - 0.5) * state.shake;
    state.shake *= 0.88;
    if (state.shake < 0.2) state.shake = 0;
  }
  state.camera.x = cx;
  state.camera.y = cy;
}

function update(dt) {
  if (!state.started || state.paused || state.gameOver) return;
  // World is frozen in dialogue/menu/overworld modes; camera/render still run.
  if (state.inputMode !== 'world') return;
  state.time += dt;
  state.frame++;
  updatePlayer(dt);
  updateEntities(dt);
  updateFactions(dt);
  updateCamera();

  if (state.gameOver && !_deathShown) {
    _deathShown = true;
    showDeath();
  }
}

function draw() {
  const ctx = state.ctx;
  // Sky/void background (for edges when view is larger than world).
  ctx.fillStyle = PALETTE.mordorBlack;
  ctx.fillRect(0, 0, state.viewW, state.viewH);

  drawMap(ctx);
  drawEntities(ctx);
  if (state.inputMode === 'overworld') drawOverworld(ctx);
  updateHUD();
}

function loop(tMs) {
  const t = tMs / 1000;
  let dt = t - _last;
  _last = t;
  if (dt > 1 / 15) dt = 1 / 30; // clamp big jumps (tab switch)
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function restartRun() {
  _deathShown = false;
  resetRun();
  hideMessage();
}

function boot() {
  state.canvas = document.getElementById('game');
  state.ctx = state.canvas.getContext('2d');
  // Pixelated look.
  state.ctx.imageSmoothingEnabled = false;

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 100));

  initHUD();
  bindInput();
  bindFactionListeners();
  bindQuestListeners();
  bindSaveHooks();
  resetRun();
  showClassPicker();

  _last = performance.now() / 1000;
  requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', boot);
