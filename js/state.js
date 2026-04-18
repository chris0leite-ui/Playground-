// Central mutable state. Every module reads/writes here.
const state = {
  canvas: null,
  ctx: null,
  dpr: 1,
  viewW: 0,
  viewH: 0,

  map: [],
  entities: [],
  player: null,
  camera: { x: 0, y: 0 },

  keys: {},
  edge: { attack: false, mount: false, interact: false }, // one-shot edge triggers
  stick: { active: false, dx: 0, dy: 0, id: null, cx: 0, cy: 0 },

  renown: 0,
  time: 0,
  frame: 0,
  paused: false,
  gameOver: false,
  started: false,
  shake: 0,

  // New subsystem namespaces. Each module manages its own slice.
  timeOfDay: { t: 0.25, phase: 'day', speed: 1 / 240 }, // 4 min per cycle
  nazgul: { active: null, cooldown: 30 },
  factions: { gondor: 0, rohan: 0, mordor: -20, free: 10 },
  quests: { active: [], completed: [], banner: null, bannerTimer: 0 },
  inventory: { weapon: null, armor: null, bag: [] },
  meta: { profile: null, classChoice: 'ranger' },
  tiers: { currentTier: 7, unlocked: [7, 6] }, // tiers 1..7 (1 = top)
  toast: { text: '', timer: 0 },
};

// Systems register per-frame updaters and overlay drawers here.
// This avoids bloating game.js with a long list of calls.
const _systems = { updates: [], overlays: [] };
function registerUpdate(fn) { _systems.updates.push(fn); }
function registerOverlay(fn) { _systems.overlays.push(fn); }
function runUpdates(dt) { for (const fn of _systems.updates) fn(dt); }
function drawOverlays(ctx) { for (const fn of _systems.overlays) fn(ctx); }

function resetRun() {
  state.entities = [];
  state.renown = 0;
  state.time = 0;
  state.paused = false;
  state.gameOver = false;
  state.shake = 0;
  state.quests.active = [];
  state.quests.completed = [];
  state.quests.banner = null;
  state.quests.bannerTimer = 0;
  state.nazgul.active = null;
  state.nazgul.cooldown = 30;
  state.timeOfDay.t = 0.25;
  state.factions = { gondor: 0, rohan: 0, mordor: -20, free: 10 };
  state.inventory = { weapon: null, armor: null, bag: [] };
  state.tiers.currentTier = 7;
  state.tiers.unlocked = [7, 6];
  state.toast = { text: '', timer: 0 };
  initMap();
  initEntities();
  if (typeof emit === 'function') emit('reset');
}

// Show a brief message at the top of the screen.
function toast(text, seconds) {
  state.toast.text = text;
  state.toast.timer = seconds || 2.5;
}
