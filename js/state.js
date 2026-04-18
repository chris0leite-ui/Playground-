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
  edge: { attack: false, mount: false }, // one-shot edge triggers
  stick: { active: false, dx: 0, dy: 0, id: null, cx: 0, cy: 0 },

  renown: 0,
  time: 0,
  frame: 0,
  paused: false,
  gameOver: false,
  started: false,
  shake: 0,
};

function resetRun() {
  state.entities = [];
  state.renown = 0;
  state.time = 0;
  state.paused = false;
  state.gameOver = false;
  state.shake = 0;
  initMap();
  initEntities();
}
