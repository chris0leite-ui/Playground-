// Entry + keyboard input. Touch (joystick + action buttons) lives in
// engine/input_touch.js. Input is routed by state.inputMode:
// 'world' | 'dialogue' | 'menu' | 'overworld'.

function bindInput() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  bindStick();
  bindActionButtons();
  bindCanvasClick();

  document.getElementById('pause-btn').addEventListener('click', togglePause);

  // Prevent context menu from long-press on mobile.
  window.addEventListener('contextmenu', (e) => e.preventDefault());
}

function bindCanvasClick() {
  const c = state.canvas;
  c.addEventListener('mousedown', (e) => {
    if (state.inputMode === 'overworld') overworldClick(e.clientX, e.clientY);
  });
  c.addEventListener('touchstart', (e) => {
    if (state.inputMode !== 'overworld') return;
    const t = e.changedTouches[0];
    overworldClick(t.clientX, t.clientY);
    e.preventDefault();
  }, { passive: false });
}

function onKeyDown(e) {
  const k = e.key.toLowerCase();

  // Modifier shortcuts (don't record into state.keys — they're single-shot).
  if (e.shiftKey && k === 's') { saveSave(); e.preventDefault(); return; }
  if (e.shiftKey && k === 'l') { loadSave(); e.preventDefault(); return; }

  state.keys[k] = true;

  // Dialogue mode: digits select choices, Esc closes, other keys are ignored.
  if (state.inputMode === 'dialogue') {
    if (/^[1-9]$/.test(k)) { advanceDialogue(parseInt(k, 10) - 1); e.preventDefault(); return; }
    if (k === 'escape') { closeDialogue(); e.preventDefault(); return; }
    return;
  }

  // Overworld mode: Esc or M closes.
  if (state.inputMode === 'overworld') {
    if (k === 'escape' || k === 'm') { closeOverworld(); e.preventDefault(); return; }
    return;
  }

  // Debug: open a test dialogue with 't'. Removed once content authoring lands.
  if (k === 't' && state.started && !state.paused && !state.gameOver) {
    openDialogue('__test__');
    e.preventDefault();
    return;
  }

  // Open the overworld map.
  if (k === 'm' && state.started && !state.paused && !state.gameOver) {
    openOverworld();
    e.preventDefault();
    return;
  }

  if (k === ' ' || k === 'spacebar') state.edge.attack = true;
  if (k === 'f') state.edge.shoot = true;
  if (k === 'e') state.edge.mount = true;
  if (k === 'p') togglePause();
  if (k === 'enter' && state.gameOver) restartRun();
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
}

function onKeyUp(e) {
  state.keys[e.key.toLowerCase()] = false;
}

function keyboardMove() {
  let dx = 0, dy = 0;
  if (state.keys['w'] || state.keys['arrowup']) dy -= 1;
  if (state.keys['s'] || state.keys['arrowdown']) dy += 1;
  if (state.keys['a'] || state.keys['arrowleft']) dx -= 1;
  if (state.keys['d'] || state.keys['arrowright']) dx += 1;
  if (dx !== 0 && dy !== 0) {
    const inv = 1 / Math.sqrt(2);
    dx *= inv; dy *= inv;
  }
  return { dx, dy };
}

function moveInput() {
  if (state.inputMode !== 'world') return { dx: 0, dy: 0 };
  if (state.stick.active) return { dx: state.stick.dx, dy: state.stick.dy };
  return keyboardMove();
}
