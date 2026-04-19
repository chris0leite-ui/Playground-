# Schema: settlement

Path: `content/regions/<region-id>/settlements/<id>.md`.

Required frontmatter:
- `id`: kebab-case.
- `region`: region-id.
- `name`.
- `type`: one of `village | town | city | fort | ruin | camp`.
- `faction`: faction-id.

Optional:
- `population`: integer.
- `ruler`: npc-id.
- `notable_buildings`: array of building-ids.
- `tile_region`: `{ x, y, w, h }` bbox in region tilemap.
- `description`.
- `tags`.

See `_examples/settlement.example.md`.
