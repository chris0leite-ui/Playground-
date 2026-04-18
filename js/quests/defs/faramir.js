// Tutorial "go-to" quest. Target sits on the outer ring road just inside the
// south wall gap — reachable from the spawn with no gate in the way.
registerQuest({
  id: 'faramir-message',
  title: 'Faramir’s Message',
  brief: 'Deliver the sealed message inside the outer wall.',
  objective: { type: 'reach', target: {
    x: (MAP.W / 2) * TILE,
    y: ((MAP.H / 2) + 9) * TILE,
    r: 40,
  } },
  reward: { renown: 200, gold: 40 },
});
