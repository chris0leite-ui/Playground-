// Tiny pub/sub. Decouples systems that react to world events.
const _events = {};

function on(name, fn) {
  (_events[name] || (_events[name] = [])).push(fn);
}

function off(name, fn) {
  const arr = _events[name];
  if (!arr) return;
  const i = arr.indexOf(fn);
  if (i >= 0) arr.splice(i, 1);
}

function emit(name, payload) {
  const arr = _events[name];
  if (!arr) return;
  for (const fn of arr.slice()) {
    try { fn(payload); } catch (err) { console.error(name, err); }
  }
}
