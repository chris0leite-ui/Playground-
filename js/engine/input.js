// Entry + keyboard input. Touch (joystick + action buttons) lives in
// engine/input_touch.js. Input is routed by state.inputMode:
// 'world' | 'dialogue' | 'menu'.

function bindInput() {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  bindStick();
  bindActionButtons();

  document.getElementById('pause-btn').addEventListener('click', togglePause);

  // Prevent context menu from long-press on mobile.
  window.addEventListener('contextmenu', (e) => e.preventDefault());
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

  // Talk: 't' opens the nearest NPC's dialogue (within TALK_RANGE). Falls
  // back to the debug fixture when no NPC is nearby — useful before content.
  if (k === 't' && state.started && !state.paused && !state.gameOver) {
    const target = findNearestNpc(80);
    if (target && target.dialogueId) openDialogue(target.dialogueId);
    else openDialogue('__test__');
    e.preventDefault();
    return;
  }

  if (k === ' ' || k === 'spacebar') state.edge.attack = true;
  if (k === 'f') state.edge.shoot = true;
  if (k === 'e') state.edge.mount = true;
  if (k === 'q' && typeof cycleWeapon === 'function') cycleWeapon();
  if (k === 'p') togglePause();
  if (k === 'enter' && state.gameOver) restartRun();
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
}

function onKeyUp(e) {
  state.keys[e.key.toLowerCase()] = false;
}

function findNearestNpc(range) {
  const p = state.player;
  if (!p) return null;
  let best = null, bestD = range;
  for (const e of state.entities) {
    if (e.type !== 'npc') continue;
    const d = distEnt(e, p);
    if (d < bestD) { bestD = d; best = e; }
  }
  return best;
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
