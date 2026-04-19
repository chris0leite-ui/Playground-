// Central mutable state. Every module reads/writes here.
const state = {
  canvas: null,
  ctx: null,
  dpr: 1,
  viewW: 0,
  viewH: 0,

  // One unified Middle-earth world — no region switching any more.
  map: [],
  entities: [],
  player: null,
  camera: { x: 0, y: 0 },

  keys: {},
  edge: { attack: false, mount: false, shoot: false }, // one-shot edge triggers
  stick: { active: false, dx: 0, dy: 0, id: null, cx: 0, cy: 0 },

  // Input context. Anything other than 'world' freezes player + entity
  // updates. Set by dialogue/menu subsystems; default is 'world'.
  inputMode: 'world',

  flags: {},          // persistent boolean flags set by dialogue/quest effects
  reputation: {},     // faction-id -> number in [-100, 100]
  quests: {},         // quest-id -> { status, stepIdx, flags }

  // Player-selected waypoint (from a minimap tap). Compass arrow prefers
  // this over the nearest quest NPC when set.
  waypoint: null,

  renown: 0,
  time: 0,
  frame: 0,
  paused: false,
  gameOver: false,
  started: false,
  shake: 0,
};

function resetRun() {
  state.renown = 0;
  state.time = 0;
  state.paused = false;
  state.gameOver = false;
  state.shake = 0;
  state.inputMode = 'world';
  state.flags = {};
  state.reputation = {};
  state.quests = {};
  state.waypoint = null;
  initWorld();
  initEntities();
  if (typeof spawnContentNPCs === 'function') spawnContentNPCs();
  if (typeof scatterEnemies === 'function') scatterEnemies();
  if (typeof spawnExoticMounts === 'function') spawnExoticMounts();
  if (typeof invalidateMinimap === 'function') invalidateMinimap();
  if (typeof eventBus !== 'undefined' && eventBus.emit) eventBus.emit('reset');
}
