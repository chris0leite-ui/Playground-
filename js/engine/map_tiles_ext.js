// Biome / terrain tile draws (Shire, Rohan, Mordor, Fangorn, Mountain,
// Forest, Sand, Swamp, Bridge, Rivendell). Split from map_tiles.js to
// respect the engine 150-line budget.

function drawTileExt(ctx, t, sx, sy, tx, ty) {
  switch (t) {
    case TILES.SHIRE: {
      ctx.fillStyle = PALETTE.shire;
      ctx.fillRect(sx, sy, TILE, TILE);
      if (((tx * 19 + ty * 13) & 7) === 0) {
        ctx.fillStyle = PALETTE.shireFlower;
        ctx.fillRect(sx + 8, sy + 6, 3, 3);
        ctx.fillRect(sx + 20, sy + 18, 3, 3);
      }
      return;
    }
    case TILES.RIVENDELL: {
      ctx.fillStyle = PALETTE.rivendell;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.strokeStyle = PALETTE.rivendellVein;
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, TILE - 1, TILE - 1);
      return;
    }
    case TILES.ROHAN: {
      ctx.fillStyle = PALETTE.rohan;
      ctx.fillRect(sx, sy, TILE, TILE);
      if (((tx * 17 + ty * 11) & 5) === 0) {
        ctx.fillStyle = PALETTE.rohanDark;
        ctx.fillRect(sx + 4, sy + 10, 4, 2);
        ctx.fillRect(sx + 16, sy + 22, 5, 2);
      }
      return;
    }
    case TILES.MORDOR: {
      ctx.fillStyle = PALETTE.mordor;
      ctx.fillRect(sx, sy, TILE, TILE);
      if (((tx * 23 + ty * 7) & 3) === 0) {
        ctx.fillStyle = PALETTE.mordorCrack;
        ctx.fillRect(sx + 6, sy + 14, 10, 2);
      }
      return;
    }
    case TILES.FANGORN: {
      ctx.fillStyle = PALETTE.fangorn;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.fangornMoss;
      ctx.fillRect(sx + 3, sy + 3, 4, 4);
      ctx.fillRect(sx + 22, sy + 20, 5, 4);
      return;
    }
    case TILES.MOUNTAIN: {
      ctx.fillStyle = PALETTE.mountain;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.mountainSnow;
      ctx.beginPath();
      ctx.moveTo(sx + TILE / 2, sy + 4);
      ctx.lineTo(sx + TILE - 4, sy + TILE - 6);
      ctx.lineTo(sx + 4, sy + TILE - 6);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = PALETTE.mountainDark;
      ctx.fillRect(sx + TILE - 3, sy, 3, TILE);
      return;
    }
    case TILES.FOREST: {
      ctx.fillStyle = PALETTE.forest;
      ctx.fillRect(sx, sy, TILE, TILE);
      const seed = (tx * 31 + ty * 17) & 15;
      const trees = 1 + (seed & 2);
      for (let i = 0; i < trees; i++) {
        const ox = 4 + ((seed * (i + 1) * 13) % 22);
        const oy = 4 + ((seed * (i + 1) * 7) % 22);
        ctx.fillStyle = PALETTE.forestTrunk;
        ctx.fillRect(sx + ox, sy + oy + 3, 2, 4);
        ctx.fillStyle = PALETTE.forestLeaf;
        ctx.beginPath();
        ctx.arc(sx + ox + 1, sy + oy + 1, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    case TILES.SAND: {
      ctx.fillStyle = PALETTE.sand;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.sandDark;
      if (((tx * 29 + ty * 5) & 3) === 0) {
        ctx.fillRect(sx + 6, sy + 14, 10, 2);
        ctx.fillRect(sx + 16, sy + 22, 8, 2);
      }
      return;
    }
    case TILES.SWAMP: {
      ctx.fillStyle = PALETTE.swamp;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.swampMuck;
      ctx.beginPath();
      ctx.arc(sx + 10, sy + 10, 4, 0, Math.PI * 2);
      ctx.arc(sx + 22, sy + 22, 3, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    case TILES.BRIDGE: {
      ctx.fillStyle = PALETTE.bridge;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.bridgeTrim;
      ctx.fillRect(sx, sy, TILE, 2);
      ctx.fillRect(sx, sy + TILE - 2, TILE, 2);
      ctx.fillRect(sx + TILE / 2 - 1, sy + 4, 2, TILE - 8);
      return;
    }
  }
}
