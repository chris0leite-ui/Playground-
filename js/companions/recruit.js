// Recruiter NPCs placed at quest-giver spots. Interact with F to join.
const RECRUIT_INFO = {
  Legolas: 'Elven archer — fires arrows at the nearest enemy from range.',
  Gimli:   'Dwarven warrior — high HP, charges enemies and cleaves.',
  Gandalf: 'Wizard — every 7s unleashes a shockwave that knocks back & damages all nearby foes.',
};

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
  if (d < 36) {
    state.toast.hint = `${e.who} (Use to recruit) — ${RECRUIT_INFO[e.who] || ''}`;
    if (state.edge.interact) {
      state.edge.interact = false;
      const f = e.who === 'Legolas' ? makeLegolas :
                e.who === 'Gimli'   ? makeGimli :
                e.who === 'Gandalf' ? makeGandalf : null;
      if (f) {
        const c = f(p.x + 30, p.y);
        c.companionName = e.who;
        state.entities.push(c);
        toast(e.who + ' joins you!', 3);
        e.alive = false;
      }
    }
  }
}

function drawRecruit(ctx, e) {
  drawShadow(ctx, 8);
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(-6, -5, 12, 11);
  const color = e.who === 'Legolas' ? '#3a5a3a' :
                e.who === 'Gimli'   ? '#8a3a1a' : '#e0e0e0';
  ctx.fillStyle = color;
  ctx.fillRect(-4, -3, 8, 7);
  ctx.fillStyle = '#e0c8a0';
  ctx.beginPath(); ctx.arc(0, -7, 3, 0, Math.PI * 2); ctx.fill();
  // Floating name tag
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  const w = e.who.length * 6 + 8;
  ctx.fillRect(-w/2, -22, w, 12);
  ctx.fillStyle = PALETTE.gondorGold;
  ctx.font = 'bold 10px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText(e.who, 0, -13);
  // "!" pulse
  const pulse = 0.5 + Math.sin(state.time * 4) * 0.5;
  ctx.fillStyle = `rgba(240,200,60,${0.5 + pulse * 0.5})`;
  ctx.fillRect(-1, -32, 2, 6);
  ctx.fillRect(-1, -25, 2, 2);
}

function spawnRecruiters() {
  const cx = (MAP.W / 2) * TILE, cy = (MAP.H / 2) * TILE;
  state.entities.push(makeRecruit(cx - 70, cy + 17 * TILE, 'Legolas'));
  state.entities.push(makeRecruit(cx - 90, cy - 10, 'Gimli'));
  state.entities.push(makeRecruit(cx, cy - 2 * TILE, 'Gandalf'));
}
on('reset', spawnRecruiters);
