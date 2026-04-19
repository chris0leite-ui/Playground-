// Per-tile draw routines. Called by drawMap in engine/map.js. Split so the
// engine/map.js stays under the 150-line budget. Biome / terrain extras
// live in engine/map_tiles_ext.js.

function drawTile(ctx, t, sx, sy, tx, ty) {
  switch (t) {
    case TILES.GRASS: {
      ctx.fillStyle = PALETTE.grass;
      ctx.fillRect(sx, sy, TILE, TILE);
      if (((tx * 31 + ty * 17) & 7) === 0) {
        ctx.fillStyle = PALETTE.grassDark;
        ctx.fillRect(sx + 6, sy + 8, 4, 4);
        ctx.fillRect(sx + 18, sy + 20, 3, 3);
      }
      return;
    }
    case TILES.ROAD: {
      ctx.fillStyle = PALETTE.road;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.roadLine;
      ctx.fillRect(sx + TILE / 2 - 1, sy, 2, TILE);
      return;
    }
    case TILES.PAVEMENT: {
      ctx.fillStyle = PALETTE.pavement;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, TILE - 1, TILE - 1);
      return;
    }
    case TILES.BUILDING: {
      ctx.fillStyle = PALETTE.building;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.buildingDark;
      ctx.fillRect(sx, sy, TILE, 3);
      ctx.fillRect(sx, sy + TILE - 3, TILE, 3);
      ctx.fillStyle = PALETTE.mordorBlack;
      ctx.fillRect(sx + 6, sy + 8, 4, 4);
      ctx.fillRect(sx + 18, sy + 8, 4, 4);
      ctx.fillRect(sx + 6, sy + 20, 4, 4);
      ctx.fillRect(sx + 18, sy + 20, 4, 4);
      return;
    }
    case TILES.WATER: {
      ctx.fillStyle = PALETTE.anduin;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.anduinFoam;
      const phase = (state.time * 30 + tx * 7 + ty * 5) % TILE;
      ctx.fillRect(sx + phase, sy + 10, 6, 2);
      ctx.fillRect(sx + (phase + 16) % TILE, sy + 22, 4, 2);
      return;
    }
    case TILES.WALL: {
      ctx.fillStyle = PALETTE.wall;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.wallDark;
      ctx.fillRect(sx, sy + TILE - 6, TILE, 6);
      ctx.fillRect(sx, sy, 3, TILE);
      return;
    }
    case TILES.TREE: {
      ctx.fillStyle = PALETTE.forest;
      ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = PALETTE.forestTrunk;
      ctx.fillRect(sx + TILE / 2 - 2, sy + 14, 4, 12);
      ctx.fillStyle = '#1a3a1a';
      ctx.beginPath();
      ctx.arc(sx + TILE / 2, sy + 11, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.forestLeaf;
      ctx.beginPath();
      ctx.arc(sx + TILE / 2 - 3, sy + 8, 6, 0, Math.PI * 2);
      ctx.arc(sx + TILE / 2 + 4, sy + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  }
  drawTileExt(ctx, t, sx, sy, tx, ty);
}
