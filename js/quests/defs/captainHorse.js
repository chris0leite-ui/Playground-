// "Slay the Uruk Captain" — the Captain now holds Isengard. Long-term goal.
registerQuest({
  id: 'captains-horse',
  title: 'Traveller: Defeat the Uruk Captain',
  brief: 'A Captain of Isengard must fall. He drops Glamdring and a Mithril shirt.',
  objective: { type: 'boss', target: 'bossUruk', count: 1 },
  reward: { renown: 800, weapon: 'spear' },
});
