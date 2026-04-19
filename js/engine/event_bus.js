// Tiny global event bus. Engine subsystems (quest, faction, save) subscribe
// on boot; game logic emits. T0.4 introduces this; T0.6 wires up listeners
// that replace the hardcoded onEnemyKilled/wantedLevel logic.

const eventBus = {
  listeners: {},
  on(event, fn) {
    (this.listeners[event] = this.listeners[event] || []).push(fn);
  },
  off(event, fn) {
    const ls = this.listeners[event];
    if (!ls) return;
    const i = ls.indexOf(fn);
    if (i >= 0) ls.splice(i, 1);
  },
  emit(event, ...args) {
    const ls = this.listeners[event];
    if (!ls) return;
    for (const fn of ls) fn(...args);
  },
};
