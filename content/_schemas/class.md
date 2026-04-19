# Schema: class

Path: `content/classes/<id>.md`.

Required:
- `id`, `name`.
- `stats`: `{ hp, atk, def, speed, sight }`.

Optional:
- `starting_inventory`: array of item-ids.
- `starting_region`: region-id (which region to load at class pick).
- `starting_pos`: `{ x, y }` within the starting region's tilemap.
- `signature_ability`: e.g. `stealth | track | forage | shieldwall`.
- `can_use`: `{ melee: bool, bow: bool, magic_items: bool }`.
- `lore`, `tags`.

See `_examples/class.example.md`.
