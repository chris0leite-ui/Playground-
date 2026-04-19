// Tiny YAML-subset frontmatter parser. Rejects anything outside the subset:
// scalars (string/int/float/bool/null), flow arrays [a, b], flow maps {a:1},
// block lists (`- item`), one level of block maps. No anchors, no multi-doc.

function parseFrontmatter(src, filename) {
  const lines = src.split(/\r?\n/);
  if (lines[0] !== '---') return { frontmatter: null, body: src };
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') { end = i; break; }
  }
  if (end < 0) throw new Error(`${filename}: unterminated frontmatter`);
  const fmLines = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n');
  return { frontmatter: parseBlock(fmLines, 0, filename), body };
}

function parseBlock(lines, baseIndent, filename) {
  const obj = {};
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.match(/^ */)[0].length;
    if (indent < baseIndent) throw new Error(`${filename}:${i + 1}: under-indent`);
    if (indent > baseIndent) continue; // handled by parent
    const line = raw.slice(indent);
    const mKey = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!mKey) throw new Error(`${filename}:${i + 1}: expected 'key:' line — got "${line}"`);
    const key = mKey[1];
    const rest = mKey[2];
    if (rest) { obj[key] = parseScalar(rest, filename, i); continue; }
    // Multi-line: look ahead to find indented children.
    const child = [];
    let j = i + 1;
    while (j < lines.length) {
      const cLine = lines[j];
      if (!cLine.trim() || cLine.trim().startsWith('#')) { child.push(cLine); j++; continue; }
      const cInd = cLine.match(/^ */)[0].length;
      if (cInd <= baseIndent) break;
      child.push(cLine);
      j++;
    }
    if (child.length === 0) { obj[key] = null; continue; }
    // Determine list vs map by first non-blank.
    const first = child.find((l) => l.trim() && !l.trim().startsWith('#'));
    if (first && first.trim().startsWith('- ')) {
      obj[key] = parseBlockList(child, filename);
    } else {
      const nextIndent = first.match(/^ */)[0].length;
      obj[key] = parseBlock(child, nextIndent, filename);
    }
    i = j - 1;
  }
  return obj;
}

function parseBlockList(lines, filename) {
  const out = [];
  for (const raw of lines) {
    const t = raw.trim();
    if (!t || t.startsWith('#')) continue;
    if (!t.startsWith('- ')) throw new Error(`${filename}: expected '- item' — got "${t}"`);
    out.push(parseScalar(t.slice(2).trim(), filename, 0));
  }
  return out;
}

function parseScalar(s, filename, line) {
  s = s.trim();
  if (s === '' || s === 'null') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+$/.test(s)) return parseInt(s, 10);
  if (/^-?\d+\.\d+$/.test(s)) return parseFloat(s);
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
  if (s.startsWith('"') && s.endsWith('"')) return JSON.parse(s);
  if (s.startsWith('[') && s.endsWith(']')) return parseFlowArray(s, filename, line);
  if (s.startsWith('{') && s.endsWith('}')) return parseFlowMap(s, filename, line);
  // Allow colons in values (needed for cross-refs like "region:shire"). Reject
  // only the flow separator, comment marker, or unbalanced flow brackets.
  if (/[#,\[\]{}]/.test(s)) {
    throw new Error(`${filename}:${line + 1}: unquoted scalar contains reserved chars: "${s}"`);
  }
  return s;
}

function parseFlowArray(s, filename, line) {
  const inner = s.slice(1, -1).trim();
  if (!inner) return [];
  return splitFlow(inner).map((v) => parseScalar(v, filename, line));
}

function parseFlowMap(s, filename, line) {
  const inner = s.slice(1, -1).trim();
  if (!inner) return {};
  const out = {};
  for (const part of splitFlow(inner)) {
    const m = part.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!m) throw new Error(`${filename}:${line + 1}: flow map part malformed: "${part}"`);
    out[m[1]] = parseScalar(m[2], filename, line);
  }
  return out;
}

function splitFlow(s) {
  // Split on top-level commas (not inside nested [] or {} or "").
  const out = [];
  let depth = 0, buf = '', quote = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quote) { buf += c; if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'") { buf += c; quote = c; continue; }
    if (c === '[' || c === '{') { depth++; buf += c; continue; }
    if (c === ']' || c === '}') { depth--; buf += c; continue; }
    if (c === ',' && depth === 0) { out.push(buf.trim()); buf = ''; continue; }
    buf += c;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

module.exports = { parseFrontmatter };
