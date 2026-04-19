// Equip / unequip. Weapons and armors each have one slot. Pickup only
// equips if the new item is strictly better than what the player has
// equipped; otherwise it's absorbed as gold so the player isn't silently
// downgraded mid-combat.
function _weaponDps(key) {
  const w = WEAPONS[key];
  if (!w) return 0;
  return w.damage / Math.max(0.1, w.cooldown);
}

function equipWeapon(key) {
  if (!WEAPONS[key]) return;
  state.inventory.weapon = key;
  toast('Equipped ' + WEAPONS[key].name, 2);
  emit('equipChanged', { slot: 'weapon', key });
}

function equipArmor(key) {
  if (!ARMORS[key]) return;
  state.inventory.armor = key;
  toast('Equipped ' + ARMORS[key].name, 2);
  emit('equipChanged', { slot: 'armor', key });
}

// Called when the player walks onto an item pickup. Returns true if the
// pickup should be consumed.
function _consumeItemPickup(item) {
  if (item.slot === 'weapon') {
    const current = state.inventory.weapon;
    if (!current || _weaponDps(item.itemKey) > _weaponDps(current)) {
      equipWeapon(item.itemKey);
    } else {
      // Weaker weapon — absorb as a small gold reward and notify.
      state.player.gold += 5;
      toast('Found ' + WEAPONS[item.itemKey].name + ' (weaker — sold for 5 gold)', 2);
    }
  } else {
    const current = state.inventory.armor;
    const curRed = current ? ARMORS[current].reduction : 0;
    if (ARMORS[item.itemKey].reduction > curRed) {
      equipArmor(item.itemKey);
    } else {
      state.player.gold += 5;
      toast('Found ' + ARMORS[item.itemKey].name + ' (weaker — sold for 5 gold)', 2);
    }
  }
  return true;
}

// Pickups of kind 'weapon'/'armor' carry `itemKey` to identify them.
function makeItemPickup(x, y, slot, itemKey) {
  const name = slot === 'weapon' ? WEAPONS[itemKey].name : ARMORS[itemKey].name;
  return {
    type: 'itempickup', x, y, w: 14, h: 14,
    noHp: true, alive: true,
    slot, itemKey, name,
    bobPhase: rand(0, Math.PI * 2),
    team: TEAM.NEUTRAL,
    draw: drawItemPickup,
    update: updateItemPickup,
  };
}

function updateItemPickup(dt, e) {
  const p = state.player;
  if (!p || p.hp <= 0) return;
  if (distEnt(e, p) < 18) {
    if (_consumeItemPickup(e)) e.alive = false;
  }
}

function drawItemPickup(ctx, e) {
  const bob = Math.sin(state.time * 3 + e.bobPhase) * 2;
  drawShadow(ctx, 8);
  const color = e.slot === 'weapon' ? (WEAPONS[e.itemKey].color || '#c0c0c0') : '#c0c0c0';
  ctx.fillStyle = color;
  if (e.slot === 'weapon') {
    ctx.fillRect(-1, bob - 8, 2, 14);
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.fillRect(-3, bob + 2, 6, 2);
  } else {
    ctx.fillRect(-6, bob - 4, 12, 8);
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.strokeStyle = PALETTE.gondorGold;
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, bob - 4, 12, 8);
  }
}
