// Minor landmark stamps — pond, grove, barrow ring, bandit camp, river
// ford, spider nest, stable paddock, Morannon camp, Mallorn glade. Split
// from worldgen_landmarks.js to respect the 150-line engine budget.

function placeLandmarkExt(L) {
  const { tx, ty, style } = L;
  switch (style) {
    case 'pond': {
      // 5-tile circular water with a BRIDGE stepping-stone at south.
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx * dx + dy * dy <= 4) _wgSet(tx + dx, ty + dy, TILES.WATER);
        }
      }
      _wgSet(tx, ty + 2, TILES.BRIDGE);
      _wgSet(tx - 1, ty + 3, TILES.GRASS);
      return;
    }
    case 'grove': {
      // Dense tree cluster with a walkable clearing at the centre.
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          const d = Math.hypot(dx, dy);
          if (d > 3) continue;
          if (d < 1) _wgSet(tx + dx, ty + dy, TILES.PAVEMENT);
          else _wgSet(tx + dx, ty + dy, TILES.TREE);
        }
      }
      return;
    }
    case 'barrowring': {
      // Ring of WALL ruins around a dark centre.
      const ring = [[-3,0],[3,0],[0,-3],[0,3],[-2,-2],[2,-2],[-2,2],[2,2]];
      for (const [dx, dy] of ring) _wgSet(tx + dx, ty + dy, TILES.WALL);
      _wgSet(tx, ty, TILES.PAVEMENT);
      return;
    }
    case 'camp': {
      // Two tents + a palisade gap.
      _wgSet(tx - 1, ty - 1, TILES.BUILDING);
      _wgSet(tx + 1, ty - 1, TILES.BUILDING);
      _wgSet(tx - 2, ty, TILES.WALL);
      _wgSet(tx + 2, ty, TILES.WALL);
      _wgSet(tx, ty + 1, TILES.ROAD);
      return;
    }
    case 'ford': {
      // Widen the river at this y with a 5-wide bridge.
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (_wgGet(tx + dx, ty + dy) === TILES.WATER) {
            _wgSet(tx + dx, ty + dy, TILES.BRIDGE);
          }
        }
      }
      return;
    }
    case 'nest': {
      // Spider nest: dark tree cluster around a WALL cave mouth.
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (Math.hypot(dx, dy) > 3) continue;
          _wgSet(tx + dx, ty + dy, TILES.TREE);
        }
      }
      _wgSet(tx, ty, TILES.WALL);
      _wgSet(tx - 1, ty, TILES.PAVEMENT);
      _wgSet(tx + 1, ty, TILES.PAVEMENT);
      return;
    }
    case 'paddock': {
      // Small fenced stable.
      for (let dx = -2; dx <= 2; dx++) {
        _wgSet(tx + dx, ty - 2, TILES.WALL);
        _wgSet(tx + dx, ty + 2, TILES.WALL);
      }
      _wgSet(tx - 2, ty, TILES.WALL); _wgSet(tx + 2, ty, TILES.WALL);
      _wgSet(tx - 2, ty + 1, TILES.PAVEMENT);
      _wgSet(tx, ty, TILES.BUILDING);
      return;
    }
  }
}
