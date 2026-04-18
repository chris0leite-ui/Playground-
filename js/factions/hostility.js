// Central hostility check. Replaces team-only comparisons so factions can
// flip guards hostile when you side with Mordor (rep.gondor very low).
function factionOf(e) {
  if (!e) return null;
  if (e.type === 'guard' || e.type === 'rohir') return 'gondor';
  if (e.type === 'orc' || e.type === 'uruk' || e.type === 'troll' || e.isBoss) return 'mordor';
  if (e.type === 'player') return 'free';
  return null;
}

// Returns true if `a` should attack `b`.
function isHostile(a, b) {
  if (!a || !b) return false;
  if (a.friendly && b.friendly) return false;
  const fa = factionOf(a), fb = factionOf(b);
  if (fa === 'mordor' && b === state.player) return true;
  if (fa === 'gondor' && b === state.player) {
    // Always hostile if wanted; also hostile if rep.gondor < -30.
    return state.player.wantedLevel > 0 || rep('gondor') < -30;
  }
  if (fa === 'gondor' && fb === 'mordor') return true;
  if (fa === 'mordor' && fb === 'gondor') return true;
  return false;
}
