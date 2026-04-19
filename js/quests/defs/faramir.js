// Tutorial quest: reach Bree. Short walk east from Hobbiton so new players
// learn the waypoint arrow and the region-enter toast.
registerQuest({
  id: 'faramir-message',
  title: 'Rosie: Deliver the Letter',
  brief: 'Walk east and reach Bree. Follow the gold waypoint arrow.',
  objective: { type: 'reach', target: {
    x: LANDMARKS.bree.tx * TILE,
    y: LANDMARKS.bree.ty * TILE,
    r: 48,
  } },
  reward: { renown: 200, gold: 40 },
});
