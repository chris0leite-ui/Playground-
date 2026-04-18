registerQuest({
  id: 'pelennor-patrol',
  title: 'Clear the Pelennor',
  brief: 'Slay 8 orcs on the fields beyond the wall.',
  objective: { type: 'kill', target: 'orc', count: 8 },
  reward: { renown: 500, gold: 80 },
});
