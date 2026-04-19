// Game constants, palette, tile enum.
// Attached to plain globals — shared across all <script> files.

const TILE = 32;

// One unified Middle-earth map — no region switching. 320x192 tiles.
const MAP = {
  W: 320,
  H: 192,
};

const TILES = {
  GRASS: 0,
  ROAD: 1,
  PAVEMENT: 2,
  BUILDING: 3,
  WATER: 4,
  WALL: 5,
  // Biome ground tiles (all walkable):
  SHIRE: 6,
  RIVENDELL: 7,
  ROHAN: 8,
  MORDOR: 9,
  FANGORN: 10,
  // Additional terrain:
  MOUNTAIN: 11,   // solid
  FOREST: 12,    // walkable dark floor (Mirkwood / Fangorn canopy)
  SAND: 13,
  SWAMP: 14,
  BRIDGE: 15,    // walkable water crossing
  TREE: 16,      // decorative (non-solid); split from WALL since v=7
  DUNGEON_FLOOR: 17,
  DUNGEON_WALL: 18,
  CHASM: 19,
};

const PALETTE = {
  gondorWhite: '#f0e8d0',
  gondorGold: '#d4a82a',
  mordorRed: '#8a1a1a',
  mordorBlack: '#1a1a1a',
  grass: '#3a5f3a',
  grassDark: '#2a4a2a',
  road: '#4a4a4a',
  roadLine: '#5a5a5a',
  pavement: '#8a8a88',
  building: '#d8d0b8',
  buildingDark: '#a89c7c',
  buildingRoof: '#5a3a2a',
  wall: '#5a5550',
  wallDark: '#3a3530',
  anduin: '#2a4a7a',
  anduinFoam: '#3a5a8a',
  lembas: '#5a8a3a',
  blood: '#6a1010',
  orcGreen: '#3a4a2a',
  orcSkin: '#5a6a3a',
  horseBrown: '#6a4a2a',
  horseMane: '#3a2a1a',
  shire: '#5a8a3a',
  shireFlower: '#d4e890',
  rivendell: '#c8cec8',
  rivendellVein: '#a8aeae',
  rohan: '#9a8a4a',
  rohanDark: '#7a6a3a',
  mordor: '#2a241e',
  mordorCrack: '#5a1a10',
  fangorn: '#1a2a18',
  fangornMoss: '#3a4a2a',
  mountain: '#7a7068',
  mountainSnow: '#e8e4d8',
  mountainDark: '#3a3530',
  forest: '#1a2a18',
  forestTrunk: '#3a2a1a',
  forestLeaf: '#2a4a2a',
  sand: '#d4b880',
  sandDark: '#b09860',
  swamp: '#3a4830',
  swampMuck: '#5a4a2a',
  bridge: '#7a6a4a',
  bridgeTrim: '#4a3a2a',
};

const CONFIG = {
  PLAYER_SPEED: 140,
  HORSE_SPEED: 230,
  ORC_SPEED: 78,
  GUARD_SPEED: 92,
  HORSE_WANDER_SPEED: 30,
  PLAYER_MAX_HP: 100,
  PLAYER_ATTACK_DAMAGE: 34,
  PLAYER_ATTACK_RANGE: 34,
  PLAYER_ATTACK_COOLDOWN: 0.38,
  ORC_HP: 60,
  ORC_DAMAGE: 8,
  ORC_ATTACK_RANGE: 22,
  ORC_ATTACK_COOLDOWN: 0.9,
  ORC_AGGRO_RANGE: 220,
  GUARD_HP: 90,
  GUARD_DAMAGE: 12,
  GUARD_ATTACK_RANGE: 24,
  GUARD_ATTACK_COOLDOWN: 0.8,
  GUARD_AGGRO_RANGE: 300,
  HORSE_HP: 80,
  MOUNT_RANGE: 44,
  LEMBAS_HEAL: 30,
  GOLD_VALUE: 10,
  RENOWN_PER_ORC: 50,
  RENOWN_PER_GUARD: 120,
  WANTED_PER_GUARD_KILL: 1,
  WANTED_MAX: 5,
  // Large-world scatter counts (no per-region seeding any more).
  NUM_ORCS: 240,
  NUM_GUARDS: 30,
  NUM_HORSES: 60,
  NUM_PICKUPS: 120,
};

const TEAM = {
  PLAYER: 0,
  ORC: 1,
  GUARD: 2,
  NEUTRAL: 3,
};
