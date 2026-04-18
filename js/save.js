// Thin localStorage wrapper. Never throws; returns defaults on any failure.
const SAVE_KEY = 'minas-tirith-v1';

function saveAll(profile) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(profile)); }
  catch (_) { /* private mode etc. */ }
}

function loadAll() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) { return null; }
}

function wipeSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (_) {}
}
