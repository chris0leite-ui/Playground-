// Dialogue DSL → { start, nodes }. Parses markdown body with '## node: <id>'
// sections. Each choice line:
//   - "text" -> next-or-END [if: <cond>] {effects: <eff-list>}

function parseDialogueBody(body, filename) {
  const nodes = {};
  let start = null;
  const sections = splitSections(body);
  for (const sec of sections) {
    const nodeId = sec.id;
    if (!start) start = nodeId;
    nodes[nodeId] = { text: sec.text.trim(), choices: sec.choices };
  }
  if (!start) throw new Error(`${filename}: no '## node: <id>' sections`);
  return { start, nodes };
}

function splitSections(body) {
  const re = /^##\s*node:\s*([A-Za-z0-9_-]+)\s*$/m;
  const out = [];
  const lines = body.split(/\r?\n/);
  let cur = null;
  let textBuf = [];
  for (const line of lines) {
    const m = line.match(re);
    if (m) {
      if (cur) flush(cur, textBuf, out);
      cur = { id: m[1], choices: [] };
      textBuf = [];
      continue;
    }
    if (!cur) continue;
    const c = parseChoice(line);
    if (c) cur.choices.push(c);
    else textBuf.push(line);
  }
  if (cur) flush(cur, textBuf, out);
  return out;
}

function flush(sec, textBuf, out) {
  // Body prose may include in-flow [if: ...] hints from authoring; strip
  // them — only choice-line conditions are evaluated by the engine.
  sec.text = textBuf.join('\n').replace(/\s*\[if:[^\]]+\]\s*/g, ' ').trim();
  out.push(sec);
}

function parseChoice(line) {
  const m = line.match(/^\s*-\s*"([^"]+)"\s*->\s*([A-Za-z0-9_-]+|END)\s*(.*)$/);
  if (!m) return null;
  const choice = { text: m[1], next: m[2] === 'END' ? null : m[2] };
  const rest = m[3];
  const ifM = rest.match(/\[if:\s*([^\]]+)\]/);
  if (ifM) choice.cond = parseCondition(ifM[1].trim());
  const effM = rest.match(/\{effects:\s*([^}]+)\}/);
  if (effM) choice.effects = parseEffects(effM[1]);
  return choice;
}

function parseCondition(s) {
  s = s.trim();
  // Top-level OR (||) has lowest precedence. Split, then parse each clause
  // as an AND. Bare clauses are leaves.
  if (s.includes('||')) {
    return { type: 'or', clauses: s.split('||').map((p) => parseCondition(p.trim())) };
  }
  if (s.includes('&&')) {
    return { type: 'and', clauses: s.split('&&').map((p) => parseCondition(p.trim())) };
  }
  return parseLeafCondition(s);
}

function parseLeafCondition(s) {
  let m = s.match(/^flag:([A-Za-z0-9_-]+)$/);
  if (m) return { type: 'flag', name: m[1] };
  m = s.match(/^!flag:([A-Za-z0-9_-]+)$/);
  if (m) return { type: 'not_flag', name: m[1] };
  m = s.match(/^quest:([A-Za-z0-9-]+)\.step\s*(>=|>|<=|<|==)\s*(-?\d+)$/);
  if (m) return { type: 'quest_step_cmp', quest: m[1], cmp: m[2], n: parseInt(m[3], 10) };
  m = s.match(/^faction:([A-Za-z0-9-]+)\.rep\s*(>=|>|<=|<|==)\s*(-?\d+)$/);
  if (m) return { type: 'faction_rep_cmp', faction: m[1], cmp: m[2], n: parseInt(m[3], 10) };
  m = s.match(/^item:([A-Za-z0-9-]+)$/);
  if (m) return { type: 'item', id: m[1] };
  m = s.match(/^!item:([A-Za-z0-9-]+)$/);
  if (m) return { type: 'not_item', id: m[1] };
  m = s.match(/^class\s*==\s*([A-Za-z0-9-]+)$/);
  if (m) return { type: 'class_eq', classId: m[1] };
  return { type: 'raw', raw: s };
}

function parseEffects(s) {
  return s.split(',').map((part) => {
    const t = part.trim();
    // gold ±N, hp ±N
    let m = t.match(/^(gold|hp)\s*([+-]?\d+)$/);
    if (m) return { type: m[1], delta: parseInt(m[2], 10) };
    m = t.match(/^flag:([A-Za-z0-9_.-]+)\s*=\s*(true|false)$/);
    if (m) return { type: 'flag', name: m[1], value: m[2] === 'true' };
    m = t.match(/^quest:([A-Za-z0-9-]+)\.(start|advance|complete)$/);
    if (m) return { type: `quest_${m[2]}`, id: m[1] };
    m = t.match(/^faction:([A-Za-z0-9-]+)\.rep\s*([+-]?\d+)$/);
    if (m) return { type: 'faction_rep', faction: m[1], delta: parseInt(m[2], 10) };
    m = t.match(/^item:([A-Za-z0-9-]+)\s*([+-]?\d+)$/);
    if (m) return { type: 'item', id: m[1], delta: parseInt(m[2], 10) };
    return { type: 'unknown', raw: t };
  });
}

module.exports = { parseDialogueBody };
