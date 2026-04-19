# Schema: encounter

Path: `content/regions/<region-id>/encounters/<id>.md`.

Required:
- `id`, `region`.
- `trigger`: one of `on_enter_region | on_reach | on_interval | on_flag`.
- `enemies`: array of `{ type, count, tag? }`.

Optional:
- `loot_table`: array of `{ item, weight, min, max }`.
- `narrative`: text shown via a toast or dialogue.
- `once`: bool — fires once per save if true.
- `classes_affected`: array of class-ids.
- `type`: `scatter | fixed`. `scatter` generates enemies inside a region bbox.
- `tags`.
