// Class selection at game start. When W.classes has entries, the intro
// screen renders class buttons. Picking a class applies its stats,
// inventory, stealth bonus, and teleports the player to
// class.starting_region at class.starting_pos.

function showClassPicker() {
  const W = window.W || {};
  const classes = W.classes || {};
  const ids = Object.keys(classes).sort();
  if (ids.length === 0) {
    // World content missing — almost always a stale cache. Show a loud
    // diagnostic instead of silently falling back to the legacy intro.
    if (typeof showToast === 'function') {
      showToast('World content missing. Clear browser cache or reload.', 6000);
    }
    showIntro();
    return;
  }
  const regCount = Object.keys((window.W && window.W.regions) || {}).length;
  if (regCount === 0 && typeof showToast === 'function') {
    showToast('World regions missing. Clear cache and reload.', 6000);
  }

  const panel = document.getElementById('dialogue-overlay');
  const textEl = document.getElementById('dialogue-text');
  const choicesEl = document.getElementById('dialogue-choices');
  if (!panel || !textEl || !choicesEl) { showIntro(); return; }

  textEl.textContent = 'The Fourth Age has dawned. Choose your kin.';
  choicesEl.innerHTML = '';
  for (const id of ids) {
    const c = classes[id];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = c.name + (c.signature_ability ? ` · ${c.signature_ability}` : '');
    btn.addEventListener('click', () => { applyClass(id); closeClassPicker(); });
    choicesEl.appendChild(btn);
  }
  state.inputMode = 'menu';
  panel.classList.remove('hidden');
}

function closeClassPicker() {
  const panel = document.getElementById('dialogue-overlay');
  if (panel) panel.classList.add('hidden');
  state.inputMode = 'world';
  state.started = true;
}

function applyClass(classId) {
  const W = window.W || {};
  const c = (W.classes || {})[classId];
  if (!c) return;
  const p = state.player;
  p.classId = classId;
  if (c.stats) {
    p.maxHp = c.stats.hp || p.maxHp;
    p.hp = p.maxHp;
    p.atk = c.stats.atk || p.atk;
    p.def = c.stats.def || p.def;
    p.speed = c.stats.speed || p.speed;
    p.sight = c.stats.sight || p.sight;
  }
  if (c.signature_ability === 'stealth') p.stealth = 0.5;
  p.inventory = (c.starting_inventory || []).slice();
  // Teleport to the class's starting region if it exists.
  const regionId = c.starting_region;
  if (regionId && state.world.regions[regionId]) {
    const prev = state.region;
    if (prev) {
      const idx = prev.entities.indexOf(p);
      if (idx >= 0) prev.entities.splice(idx, 1);
    }
    loadRegion(regionId);
    if (c.starting_pos) {
      p.x = c.starting_pos.x * TILE + TILE / 2;
      p.y = c.starting_pos.y * TILE + TILE / 2;
    } else if (state.region.def && state.region.def.spawn_point) {
      p.x = state.region.def.spawn_point.x;
      p.y = state.region.def.spawn_point.y;
    }
    if (!state.entities.includes(p)) state.entities.push(p);
    state.player = p;
    state.flags['region_visited:' + regionId] = true;
  }
  eventBus.emit('class_selected', classId);
}
