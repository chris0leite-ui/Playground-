# Schema: npc

Path: `content/regions/<region-id>/npcs/<id>.md`.

Required:
- `id`, `name`.
- `location`: `region:<id>` or `building:<id>`.
- `faction`: faction-id (or `none`).
- `role`: free text — "innkeeper", "captain", "beggar"…

Optional:
- `class`: class-id (stat preset).
- `disposition`: `friendly | neutral | hostile | wary`.
- `dialogue`: dialogue-id (references a compiled dialogue).
- `quest_hooks`: array of quest-ids this NPC gives or advances.
- `stats`: `{ hp, dmg, atk_range, speed, sight }` overrides.
- `spawn_conditions`: e.g. `{ quest_state: "quest-id:step-id", after_time_of_day: "night" }`.
- `spawn_pos`: `{ x, y }` — defaults to settlement center.
- `inventory`, `description`, `tags`.

See `_examples/npc.example.md`.
