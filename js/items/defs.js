// Weapon & armor stat tables. Pure data.
const WEAPONS = {
  dagger:   { name: 'Dagger',       damage: 22, range: 26, cooldown: 0.30, color: '#b0b0b0' },
  sword:    { name: 'Sword',        damage: 34, range: 34, cooldown: 0.38, color: '#c8c8c0' },
  sting:    { name: 'Sting',        damage: 40, range: 30, cooldown: 0.30, color: '#7adaf0', bonusVs: { orc: 20, uruk: 20 } },
  anduril:  { name: 'Andúril',      damage: 56, range: 40, cooldown: 0.45, color: '#fff4c0' },
  morgul:   { name: 'Morgul Blade', damage: 30, range: 30, cooldown: 0.40, color: '#c0a0ff', poison: 8 },
  bow:      { name: 'Bow of Galadriel', damage: 28, range: 300, cooldown: 0.55, ranged: true, speed: 340, color: '#e0d080' },
  spear:    { name: 'Gondor Spear', damage: 30, range: 44, cooldown: 0.50, color: '#d0c080' },
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
