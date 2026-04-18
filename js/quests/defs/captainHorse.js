registerQuest({
  id: 'captains-horse',
  title: 'Slay the Uruk Captain',
  brief: 'Track and defeat the Uruk Captain on the inner tiers. Drops Glamdring and Mithril on death.',
  objective: { type: 'boss', target: 'bossUruk', count: 1 },
  reward: { renown: 800, weapon: 'spear' },
});
