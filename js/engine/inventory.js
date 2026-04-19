// Weapon loadout + pickup-driven inventory. Combat reads damage / range /
// cooldown from the currently selected WEAPONS entry plus any level bonus.

const WEAPONS = {
  sword:     { name: 'Sword',         damage: 34, range: 34, cooldown: 0.38, ranged: false, color: '#c8c8c0' },
  bow:       { name: 'Bow',           damage: 28, range: 300, cooldown: 0.55, ranged: true,  color: '#e0d080', speed: 340 },
  elvenKnife:{ name: 'Elven Knife',   damage: 40, range: 30, cooldown: 0.22, ranged: false, color: '#c0f0d0', bonusVs: { orc: 10, uruk: 10 } },
  spear:     { name: 'Gondor Spear',  damage: 30, range: 48, cooldown: 0.50, ranged: false, color: '#d0c080' },
  warHammer: { name: 'War Hammer',    damage: 72, range: 34, cooldown: 0.80, ranged: false, color: '#8a6a4a' },
};

const INV_DEFAULT = { weapon: 'sword', owned: ['sword', 'bow'] };

function initInventory() {
  state.inventory = { weapon: INV_DEFAULT.weapon, owned: INV_DEFAULT.owned.slice() };
}

function weaponStats(key) {
  const id = key || (state.inventory && state.inventory.weapon) || 'sword';
  return WEAPONS[id] || WEAPONS.sword;
}

function currentWeaponDamage(victimType) {
  const w = weaponStats();
  let dmg = w.damage + (typeof levelBonusDamage === 'function' ? levelBonusDamage() : 0);
  if (w.bonusVs && victimType && w.bonusVs[victimType]) dmg += w.bonusVs[victimType];
  return dmg;
}

function pickupWeapon(id) {
  if (!WEAPONS[id]) return false;
  const inv = state.inventory;
  if (!inv.owned.includes(id)) inv.owned.push(id);
  inv.weapon = id;
  if (typeof showToast === 'function') showToast('Picked up: ' + WEAPONS[id].name, 1800);
  return true;
}

function cycleWeapon() {
  const inv = state.inventory;
  if (!inv || !inv.owned.length) return;
  const i = inv.owned.indexOf(inv.weapon);
  inv.weapon = inv.owned[(i + 1) % inv.owned.length];
  if (typeof showToast === 'function') showToast('Wield: ' + weaponStats().name, 1200);
}

// 20% chance per enemy kill to drop a weapon upgrade; higher-tier enemies
// drop higher-tier weapons.
const DROP_TABLE = {
  orc:      [['elvenKnife', 0.2], ['spear', 0.1]],
  uruk:     [['spear', 0.35], ['warHammer', 0.1]],
  troll:    [['warHammer', 0.8]],
  spider:   [['elvenKnife', 0.4]],
  haradrim: [['bow', 0.5], ['spear', 0.2]],
  guard:    [['spear', 0.3]],
};

function maybeDropWeapon(entity) {
  const table = DROP_TABLE[entity.type];
  if (!table) return;
  for (const [id, chance] of table) {
    if (Math.random() < chance) {
      state.entities.push(makePickup(entity.x, entity.y, 'weapon:' + id));
      return;
    }
  }
}
