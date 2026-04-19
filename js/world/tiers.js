// The classical city has 7 tiers. We map tile distance-to-center into a tier
// number (1 = Citadel, 7 = outer fields).
//   tier 1: r < 3
//   tier 2: r < 6
//   tier 3: r < 9
//   tier 4: r < 12
//   tier 5: r < 15
//   tier 6: r < 18 (inside the wall)
//   tier 7: r >= 18 (outside)
const TIER_RADII = [3, 6, 9, 12, 15, 18];

function tierAtTile(tx, ty) {
  // Tiers are measured from Minas Tirith — the rest of Middle-earth sits
  // outside the wall, which is "tier 7".
  const cx = LANDMARKS.minasTirith.tx, cy = LANDMARKS.minasTirith.ty;
  const d = Math.hypot(tx - cx, ty - cy);
  for (let i = 0; i < TIER_RADII.length; i++) {
    if (d < TIER_RADII[i]) return i + 1;
  }
  return 7;
}

function tierAt(px, py) {
  return tierAtTile(px / TILE, py / TILE);
}

function isTierUnlocked(t) { return state.tiers.unlocked.indexOf(t) >= 0; }

function unlockTier(t) {
  if (isTierUnlocked(t)) return;
  state.tiers.unlocked.push(t);
  toast('Tier ' + t + ' unlocked!', 3);
  emit('tierUnlocked', { tier: t });
}

// Listen for renown thresholds to unlock tiers automatically.
const _tierThresholds = { 5: 200, 4: 600, 3: 1400, 2: 2800, 1: 5000 };
function _checkTierUnlocks() {
  for (const key in _tierThresholds) {
    const t = parseInt(key, 10);
    if (!isTierUnlocked(t) && state.renown >= _tierThresholds[t]) {
      unlockTier(t);
    }
  }
}
registerUpdate(_checkTierUnlocks);
