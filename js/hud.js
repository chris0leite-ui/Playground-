// Updates the DOM HUD each frame: HP bar, gold, renown, wanted stars, mount.
// Also handles the message overlay (intro, pause, death).

const HUD = {
  gold: null, renown: null, wanted: null,
  hpBar: null, hpText: null, mount: null,
  msg: null, msgTitle: null, msgBody: null, msgBtn: null,
};

function initHUD() {
  HUD.gold = document.getElementById('gold');
  HUD.renown = document.getElementById('renown');
  HUD.wanted = document.getElementById('wanted');
  HUD.hpBar = document.getElementById('hp-bar');
  HUD.hpText = document.getElementById('hp-text');
  HUD.mount = document.getElementById('mount-indicator');
  HUD.msg = document.getElementById('message-overlay');
  HUD.msgTitle = document.getElementById('message-title');
  HUD.msgBody = document.getElementById('message-body');
  HUD.msgBtn = document.getElementById('message-btn');

  HUD.msgBtn.addEventListener('click', onMessageClick);
}

function updateHUD() {
  const p = state.player;
  if (!p) return;
  HUD.gold.textContent = `Gold: ${p.gold}`;
  HUD.renown.textContent = `Renown: ${state.renown}`;

  const stars = '\u2022'.repeat(p.wantedLevel);
  HUD.wanted.textContent = stars ? `Wanted: ${stars}` : '';
  HUD.wanted.style.color = p.wantedLevel > 0 ? '#ff6060' : '';

  const pct = clamp(p.hp / p.maxHp, 0, 1) * 100;
  HUD.hpBar.style.width = pct + '%';
  HUD.hpText.textContent = `${Math.max(0, Math.ceil(p.hp))} / ${p.maxHp}`;

  if (p.onHorse) {
    HUD.mount.textContent = 'Mounted: Steed of Rohan';
    HUD.mount.classList.add('on');
  } else {
    HUD.mount.classList.remove('on');
  }
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
  if (state.gameOver) {
    restartRun();
    return;
  }
  if (state.paused) {
    state.paused = false;
    hideMessage();
  }
}

function togglePause() {
  if (state.gameOver || !state.started) return;
  state.paused = !state.paused;
  if (state.paused) {
    showMessage('Paused', 'The siege pauses. Catch your breath.', 'Resume');
  } else {
    hideMessage();
  }
}

function showIntro() {
  showMessage(
    'Middle-earth: Streets of Minas Tirith',
    'You are a Ranger of the North. Slay orcs, gather gold, eat lembas to heal. Mount steeds to travel swiftly. Strike Citadel Guards at your peril — they will hunt you. Use the joystick to move and the buttons to attack and mount.',
    'Ride out'
  );
}

function showDeath() {
  if (typeof recordDeath === 'function') recordDeath();
  showMessage(
    'You have fallen',
    `Your saga ends. Renown earned: ${state.renown}. Gold gathered: ${state.player.gold}.`,
    'Rise again'
  );
}
