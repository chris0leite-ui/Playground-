// Modal + transient overlays (intro, pause, death, toasts). Split from
// hud.js to keep each file under the 150-line engine budget.

function showToast(text, ms) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), ms || 1600);
}

function showMessage(title, body, btnLabel) {
  HUD.msgTitle.textContent = title;
  HUD.msgBody.textContent = body;
  HUD.msgBtn.textContent = btnLabel;
  HUD.msg.classList.remove('hidden');
}

function hideMessage() { HUD.msg.classList.add('hidden'); }

function onMessageClick() {
  if (!state.started) {
    state.started = true;
    hideMessage();
    return;
  }
  if (state.gameOver) { restartRun(); return; }
  if (state.paused)   { state.paused = false; hideMessage(); }
}

function togglePause() {
  if (state.gameOver || !state.started) return;
  state.paused = !state.paused;
  if (state.paused) showMessage('Paused', 'The siege pauses. Catch your breath.', 'Resume');
  else hideMessage();
}

function showIntro() {
  showMessage(
    'Middle-earth: Streets of Minas Tirith',
    'You are a Ranger of the North. Slay orcs, gather gold, eat lembas to heal. Mount steeds to travel swiftly. Strike Citadel Guards at your peril — they will hunt you. Use the joystick to move and the buttons to attack and mount.',
    'Ride out'
  );
}

function showDeath() {
  showMessage(
    'You have fallen',
    `Your saga ends. Renown earned: ${state.renown}. Gold gathered: ${state.player.gold}.`,
    'Rise again'
  );
}
