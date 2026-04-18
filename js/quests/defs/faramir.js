registerQuest({
  id: 'faramir-message',
  title: 'Faramir’s Message',
  brief: 'Reach the Citadel at the top of the city.',
  objective: { type: 'reach', target: {
    x: (MAP.W / 2) * TILE,
    y: ((MAP.H / 2) - 2) * TILE,
    r: 40,
  } },
  reward: { renown: 300, gold: 40 },
});
