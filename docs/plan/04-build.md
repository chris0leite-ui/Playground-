# §4 Build pipeline

`node build.js` — synchronous, single pass, zero npm. Sub-second target.

## Pipeline (each step in its own helper ≤120 lines)

1. **Walk** `content/` recursively. Route by path → content type.
2. **Parse frontmatter** via `build/parse_frontmatter.js`.
3. **Parse bodies** by fenced-block tag:
   - ```tilemap → `parse_tilemap.js`
   - ```dialogue → `parse_dialogue.js`
   - ```steps → `parse_quest.js`
4. **Validate** per type against `build/schemas.js` (required/optional, types, unknown keys rejected).
5. **Cross-ref** via `build/validators.js`: every `<type>:<id>` resolves; region neighbors are symmetric; `spawn_point` non-solid; dialogue choices resolve; no cycles in `arc.quests_in_order`.
6. **Emit** via `build/emit.js` to `js/world/<type>s.js`. Output is deterministic (stable key order). Each shard registers onto `window.W`.
7. **Index** — regenerate `content/INDEX.json`, `content/index.md`, and each `content/regions/<r>/_index.md`.

## Compiled shape (example)

```js
W.regions["shire"] = { id:"shire", name:"The Shire", tilemap:"shire",
  neighbors:{east:"bree-land",...}, spawn_point:{x:20,y:20}, ... };
W.tilemaps["shire"] = { w:48, h:48, grid:[[0,0,...]],
  subtypes:{"3,7":"hobbit-hole"}, decor:[...] };
W.dialogues["barliman-welcome"] = { speaker:"...", start:"start",
  nodes:{ start:{ text:"...",
    choices:[{text,next,cond?,effects?}, ...] } } };
```

## Flags
- `--check` — validate only, no emit.
- `--verbose` — log every file.

Exit non-zero on any error with `file:line`-precise messages.
