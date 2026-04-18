// Faction rep changes when things happen in the world.
on('enemyKilled', ({ entity, byPlayer }) => {
  if (!byPlayer || !entity) return;
  switch (entity.type) {
    case 'orc': case 'uruk': case 'troll':
      adjustRep('gondor', +1); adjustRep('rohan', +1);
      adjustRep('mordor', -2); adjustRep('free', +1);
      break;
    case 'guard':
      adjustRep('gondor', -5); adjustRep('rohan', -2);
      adjustRep('mordor', +3); adjustRep('free', -1);
      break;
    case 'bossTroll': case 'bossUruk':
      adjustRep('gondor', +10); adjustRep('rohan', +8); adjustRep('free', +8);
      adjustRep('mordor', -15);
      break;
    case 'bossWK':
      adjustRep('gondor', +25); adjustRep('rohan', +20); adjustRep('free', +20);
      adjustRep('mordor', -50);
      break;
  }
});

on('beaconLit', () => { adjustRep('rohan', +10); adjustRep('gondor', +5); });
