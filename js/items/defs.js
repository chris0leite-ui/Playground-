// Weapon & armor stat tables. Pure data.
const WEAPONS = {
  // --- Melee ---
  dagger:       { name: 'Dagger',           damage: 22, range: 26, cooldown: 0.26, color: '#b0b0b0' },
  sword:        { name: 'Sword',            damage: 34, range: 34, cooldown: 0.38, color: '#c8c8c0' },
  elvenKnife:   { name: 'Elven Knife',      damage: 28, range: 30, cooldown: 0.22, color: '#c0f0d0', bonusVs: { orc: 10, uruk: 10 } },
  sting:        { name: 'Sting',            damage: 40, range: 30, cooldown: 0.30, color: '#7adaf0', bonusVs: { orc: 20, uruk: 20 } },
  morgul:       { name: 'Morgul Blade',     damage: 30, range: 30, cooldown: 0.40, color: '#c0a0ff', poison: 8 },
  barrowBlade:  { name: 'Barrow-Blade',     damage: 44, range: 32, cooldown: 0.38, color: '#a8c0e0', bonusVs: { bossWK: 40, nazgul: 40 } },
  glamdring:    { name: 'Glamdring',        damage: 50, range: 38, cooldown: 0.38, color: '#f0f4ff', bonusVs: { troll: 30, uruk: 20 } },
  anduril:      { name: 'Andúril',          damage: 56, range: 40, cooldown: 0.45, color: '#fff4c0' },
  dwarfAxe:     { name: 'Dwarven Axe',      damage: 62, range: 30, cooldown: 0.60, color: '#d8a860' },
  warHammer:    { name: 'Hammer of Númenor', damage: 80, range: 34, cooldown: 0.80, color: '#8a6a4a', knockback: 20 },
  // --- Polearms ---
  spear:        { name: 'Gondor Spear',     damage: 30, range: 44, cooldown: 0.50, color: '#d0c080' },
  // --- Ranged ---
  bow:          { name: 'Bow of Galadriel', damage: 28, range: 300, cooldown: 0.55, ranged: true, speed: 340, color: '#e0d080' },
  throwingAxe:  { name: 'Throwing Axe',     damage: 34, range: 200, cooldown: 0.70, ranged: true, speed: 260, color: '#c09060' },
  palantirBolt: { name: 'Ithil-Bolt',       damage: 60, range: 360, cooldown: 1.20, ranged: true, speed: 420, color: '#a080ff' },
};

const ARMORS = {
  cloak:       { name: 'Ranger Cloak',      reduction: 2 },
  mail:        { name: 'Chainmail',         reduction: 6 },
  gondorPlate: { name: 'Gondor Plate',      reduction: 10 },
  mithril:     { name: 'Mithril Shirt',     reduction: 16 },
};

function weaponStats() {
  const w = state.inventory.weapon;
  return w ? WEAPONS[w] : WEAPONS.sword;
}

function armorReduction() {
  const a = state.inventory.armor;
  return a ? ARMORS[a].reduction : 0;
}
