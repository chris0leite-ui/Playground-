// Entity-type registry. Replaces hardcoded switch statements in
// ai.js/render.js. Each type declares { factory, update, draw }.

const entityTypes = {};

function registerEntityType(id, def) {
  entityTypes[id] = def || {};
}

function updateEntity(e, dt) {
  const t = entityTypes[e.type];
  if (t && t.update) t.update(e, dt);
}

function drawEntity(ctx, e) {
  const t = entityTypes[e.type];
  if (t && t.draw) t.draw(ctx, e);
}
