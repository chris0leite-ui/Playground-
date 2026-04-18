// Per-weapon melee swing animations. drawPlayer calls drawWeaponFx() when
// attackSwing > 0 and the current weapon is not ranged.
//
// `t` is 0..1 progress through the swing.
function drawWeaponFx(ctx, player) {
  const stats = weaponStats();
  if (!stats || stats.ranged) return;
  const t = 1 - (player.attackSwing / 0.22);
  ctx.save();
  ctx.rotate(player.angle);
  const anim = stats.anim || 'swing';
  const color = stats.color || PALETTE.gondorWhite;
  const glow = stats.glow;

  if (anim === 'swing') {
    // Arc sweep from -60° to +60° across the swing.
    const ang = -Math.PI / 3 + t * (2 * Math.PI / 3);
    ctx.rotate(ang);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(22, 0); ctx.stroke();
    if (glow) {
      ctx.strokeStyle = glow;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(22, 0); ctx.stroke();
    }
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.fillRect(3, -2, 3, 4);
  } else if (anim === 'stab') {
    // Quick thrust forward on the first third, retract after.
    const reach = t < 0.5 ? t * 40 : (1 - t) * 40;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(8 + reach, 0); ctx.stroke();
    ctx.fillStyle = PALETTE.gondorGold;
    ctx.fillRect(3, -2, 3, 4);
  } else if (anim === 'thrust') {
    // Spear: longer thrust, slim line.
    const reach = t < 0.5 ? t * 56 : (1 - t) * 56;
    ctx.strokeStyle = '#5a4a3a';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(10 + reach, 0); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(10 + reach, 0); ctx.lineTo(4 + reach, -3); ctx.lineTo(4 + reach, 3);
    ctx.closePath(); ctx.fill();
  } else if (anim === 'cleave') {
    // Big horizontal arc, wider than swing.
    const ang = -Math.PI / 2 + t * Math.PI;
    ctx.rotate(ang);
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(4, -1, 14, 2);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(18, -7); ctx.lineTo(28, 0); ctx.lineTo(18, 7);
    ctx.lineTo(14, 0); ctx.closePath(); ctx.fill();
  } else if (anim === 'smash') {
    // Overhead: hammer rises then slams with a radial shockwave.
    if (t < 0.5) {
      const lift = (t * 2) * -14;
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(-1, lift - 4, 2, 16);
      ctx.fillStyle = color;
      ctx.fillRect(-6, lift - 8, 12, 8);
    } else {
      const impact = (t - 0.5) * 2;
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(8, -2, 12, 4);
      ctx.fillStyle = color;
      ctx.fillRect(18, -8, 10, 16);
      // Shockwave ring
      ctx.strokeStyle = `rgba(255,240,180,${1 - impact})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(18, 0, impact * 40, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}
