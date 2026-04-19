# Schema: faction

Path: `content/factions/<id>.md`.

Required:
- `id`, `name`, `banner_color` (hex).

Optional:
- `rep_tiers`: defaults to
  `[{-100 hated, -30 disliked, 0 neutral, 30 liked, 80 honored, 100 champion}]`.
- `allies`: array of faction-ids.
- `enemies`: array of faction-ids.
- `territories`: array of region-ids.
- `description`, `tags`.

See `_examples/faction.example.md`.
