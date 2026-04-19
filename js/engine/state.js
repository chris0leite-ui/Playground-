// Central mutable state. Every module reads/writes here.
const state = {
  canvas: null,
  ctx: null,
  dpr: 1,
  viewW: 0,
  viewH: 0,

  // World. `region` is the active region; `map` and `entities` are
  // back-compat alias pointers assigned by loadRegion().
  world: { regions: {}, currentRegionId: null },
  region: null,
  map: [],
  entities: [],
  player: null,
  camera: { x: 0, y: 0 },

  keys: {},
  edge: { attack: false, mount: false, shoot: false }, // one-shot edge triggers
  stick: { active: false, dx: 0, dy: 0, id: null, cx: 0, cy: 0 },

  // Input context. Anything other than 'world' freezes player + entity
  // updates. Set by dialogue/overworld/menu subsystems; default is 'world'.
  inputMode: 'world',

  flags: {},          // persistent boolean flags set by dialogue/quest effects
  reputation: {},     // faction-id -> number in [-100, 100]
  quests: {},         // quest-id -> { status, stepIdx, flags }

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
  // Rebuild the world from scratch. Entities belong to the current region.
  state.world.regions = {};
  state.world.currentRegionId = null;
  state.region = null;
  initDefaultRegion();
  initEntities();
}
