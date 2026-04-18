// Recruiter NPCs placed at quest-giver spots. Interact with F to join.
function makeRecruit(x, y, who) {
  return {
    type: 'recruit', x, y, w: 14, h: 14,
    noHp: true, alive: true,
    who, angle: 0,
    team: TEAM.PLAYER, friendly: true,
    draw: (ctx, e) => drawRecruit(ctx, e),
    update: updateRecruit,
  };
}

function updateRecruit(dt, e) {
  const p = state.player;
  if (!p) return;
  const d = distEnt(e, p);
  if (d < 28) {
    state.toast.hint = 'Press F to recruit ' + e.who;
    if (state.edge.interact) {
      state.edge.interact = false;
      const f = e.who === 'Legolas' ? makeLegolas :
                e.who === 'Gimli'   ? makeGimli :
                e.who === 'Gandalf' ? makeGandalf : null;
      if (f) {
        state.entities.push(f(p.x + 30, p.y));
        toast(e.who + ' joins you!', 3);
        e.alive = false;
      }
    }
  }
}

function drawRecruit(ctx, e) {
  drawShadow(ctx, 8);
  // Simple cloaked figure with a colored tabard to hint identity.
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(-6, -5, 12, 11);
  const color = e.who === 'Legolas' ? '#3a5a3a' :
                e.who === 'Gimli'   ? '#8a3a1a' : '#e0e0e0';
  ctx.fillStyle = color;
  ctx.fillRect(-4, -3, 8, 7);
  ctx.fillStyle = '#e0c8a0';
  ctx.beginPath(); ctx.arc(0, -7, 3, 0, Math.PI * 2); ctx.fill();
  // "!" over head
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.fillRect(-1, -18, 2, 5);
  ctx.fillRect(-1, -11, 2, 2);
}

function spawnRecruiters() {
  const cx = (MAP.W / 2) * TILE, cy = (MAP.H / 2) * TILE;
  // Legolas outside the wall near spawn; Gimli on tier 5; Gandalf on tier 2.
  state.entities.push(makeRecruit(cx - 70, cy + 17 * TILE, 'Legolas'));
  state.entities.push(makeRecruit(cx - 90, cy - 10, 'Gimli'));
  state.entities.push(makeRecruit(cx, cy - 2 * TILE, 'Gandalf'));
}
on('reset', spawnRecruiters);
