// Binds keyboard and touch input into state.keys / state.stick / state.edge.
// Called once at boot.

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
  state.keys[k] = true;
  if (k === ' ' || k === 'spacebar') state.edge.attack = true;
  if (k === 'e') state.edge.mount = true;
  if (k === 'f') state.edge.interact = true;
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
  if (state.stick.active) return { dx: state.stick.dx, dy: state.stick.dy };
  return keyboardMove();
}

// ---- Virtual joystick ----
function bindStick() {
  const zone = document.getElementById('stick-zone');
  const base = document.getElementById('stick-base');
  const knob = document.getElementById('stick-knob');

  const radius = () => base.offsetWidth / 2;

  function setKnob(dx, dy) {
    const r = radius();
    knob.style.transform = `translate(calc(-50% + ${dx * r}px), calc(-50% + ${dy * r}px))`;
  }

  function getBaseCenter() {
    const rect = base.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function start(clientX, clientY, id) {
    // Re-center the stick under the finger (anywhere in the zone).
    const zoneRect = zone.getBoundingClientRect();
    const size = base.offsetWidth;
    let cx = clientX - zoneRect.left - size / 2;
    let cy = clientY - zoneRect.top - size / 2;
    cx = clamp(cx, 0, zone.offsetWidth - size);
    cy = clamp(cy, 0, zone.offsetHeight - size);
    base.style.left = `${cx}px`;
    base.style.bottom = `${zone.offsetHeight - cy - size}px`;
    base.style.opacity = '1';
    state.stick.active = true;
    state.stick.id = id;
    update(clientX, clientY);
  }

  function update(clientX, clientY) {
    const c = getBaseCenter();
    const r = radius();
    let dx = (clientX - c.x) / r;
    let dy = (clientY - c.y) / r;
    const mag = Math.hypot(dx, dy);
    if (mag > 1) { dx /= mag; dy /= mag; }
    state.stick.dx = dx;
    state.stick.dy = dy;
    setKnob(dx, dy);
  }

  function end() {
    state.stick.active = false;
    state.stick.id = null;
    state.stick.dx = 0;
    state.stick.dy = 0;
    setKnob(0, 0);
    base.style.opacity = '0.7';
  }

  zone.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    start(t.clientX, t.clientY, t.identifier);
  }, { passive: false });

  zone.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (t.identifier === state.stick.id) { update(t.clientX, t.clientY); break; }
    }
  }, { passive: false });

  function onEnd(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === state.stick.id) { end(); break; }
    }
  }
  zone.addEventListener('touchend', onEnd);
  zone.addEventListener('touchcancel', onEnd);

  // Mouse fallback so desktop can test touch UI with a mouse.
  let mouseDown = false;
  zone.addEventListener('mousedown', (e) => {
    mouseDown = true;
    start(e.clientX, e.clientY, 'mouse');
  });
  window.addEventListener('mousemove', (e) => {
    if (mouseDown) update(e.clientX, e.clientY);
  });
  window.addEventListener('mouseup', () => {
    if (mouseDown) { mouseDown = false; end(); }
  });
}

// ---- Action buttons ----
function bindActionButtons() {
  const attack = document.getElementById('attack-btn');
  const mount = document.getElementById('mount-btn');

  function press(fn) {
    return (e) => { e.preventDefault(); fn(); };
  }

  attack.addEventListener('touchstart', press(() => { state.edge.attack = true; }), { passive: false });
  attack.addEventListener('mousedown', press(() => { state.edge.attack = true; }));

  mount.addEventListener('touchstart', press(() => { state.edge.mount = true; }), { passive: false });
  mount.addEventListener('mousedown', press(() => { state.edge.mount = true; }));
}
