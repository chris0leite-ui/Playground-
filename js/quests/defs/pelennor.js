registerQuest({
  id: 'pelennor-patrol',
  title: 'Hamfast: Clear the Woods',
  brief: 'The goblins are out again. Slay 8 orcs anywhere in Middle-earth.',
  objective: { type: 'kill', target: 'orc', count: 8 },
  reward: { renown: 500, gold: 80 },
});
