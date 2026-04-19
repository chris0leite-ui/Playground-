# Schema: arc

Path: `content/arcs/<id>.md`.

Required:
- `id`, `title`, `summary`, `quests_in_order` (array of quest-ids).

Optional:
- `regions`: array of region-ids.
- `classes_eligible`: array of class-ids.
- `introduced_by`: npc-id.
- `reward_capstone`: item-id or flag-name.
- `description`, `tags`.

Rules:
- No quest may appear twice in `quests_in_order` (build validator enforces).
- All referenced quests must exist.
