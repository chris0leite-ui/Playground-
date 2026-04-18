registerQuest({
  id: 'captains-horse',
  title: 'The Captain’s Horse',
  brief: 'Defeat the Uruk Captain.',
  objective: { type: 'boss', target: 'bossUruk', count: 1 },
  reward: { renown: 800, weapon: 'spear' },
});
