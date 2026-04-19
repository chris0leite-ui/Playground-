// Quest steps DSL → array of step objects. Expects a fenced ```steps block.

function parseQuestBody(body, filename) {
  const m = body.match(/```steps\s*\n([\s\S]*?)\n```/);
  if (!m) return []; // quests without steps are allowed (dialogue-only quests)
  const lines = m[1].split(/\r?\n/);
  const steps = [];
  let cur = null;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const mStart = line.match(/^-\s+id:\s*([A-Za-z0-9_-]+)\s*$/);
    if (mStart) {
      if (cur) steps.push(cur);
      cur = { id: mStart[1] };
      continue;
    }
    if (!cur) throw new Error(`${filename}: step field outside a step: "${line}"`);
    const mField = line.match(/^\s+([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!mField) throw new Error(`${filename}: expected step field — got "${line}"`);
    cur[mField[1]] = parseStepValue(mField[2].trim());
  }
  if (cur) steps.push(cur);
  return steps;
}

function parseStepValue(s) {
  if (s === '' || s === 'null') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  // Keep complex targets as strings; engine interprets them.
  return s;
}

module.exports = { parseQuestBody };
