// Class loadouts. Applied once on run start.
const CLASSES = {
  ranger:   { name: 'Ranger',        weapon: 'sword',  armor: 'cloak',       hp: 100 },
  rohirrim: { name: 'Rohirrim',      weapon: 'spear',  armor: 'mail',        hp: 120 },
  hobbit:   { name: 'Hobbit',        weapon: 'sting',  armor: 'mithril',     hp: 80  },
};

function applyClass(key) {
  const c = CLASSES[key] || CLASSES.ranger;
  state.meta.classChoice = key;
  equipWeapon(c.weapon);
  equipArmor(c.armor);
  if (state.player) {
    state.player.maxHp = c.hp;
    state.player.hp = c.hp;
  }
}
// Re-apply on every reset.
on('reset', () => { applyClass(state.meta.classChoice || 'ranger'); });
