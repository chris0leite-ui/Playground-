# Schema: quest

Path: `content/regions/<region-id>/quests/<id>.md`.

Required:
- `id`, `title`, `giver` (npc-id), `summary`.

Optional:
- `prerequisites`: dialogue-condition expression.
- `rewards`: `{ gold, xp, items: [...], rep: [{ faction, delta }] }`.
- `classes_eligible`: array of class-ids.
- `arc`: arc-id.
- `tags`.

Body contains a fenced `` ```steps `` block. Step types:
`dialogue | reach | kill | gather | deliver | escort | survive | flag`.
Each step: `- id: <step-id>` then indented fields. Optional
`on_success: <step-id>` / `on_fail: <step-id>` for branches.

See `_examples/quest.example.md`.
